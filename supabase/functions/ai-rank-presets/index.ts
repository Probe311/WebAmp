// Edge Function: ai-rank-presets
// Classement intelligent de presets en fonction du contexte utilisateur via Gemini API.

import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'
import { callGemini } from '../_shared/gemini.ts'
import { guardAuthedPost, safeClientError } from '../_shared/guard.ts'

interface RankPreset {
  id: string
  name: string
  tags?: string[]
  genre?: string
  mood?: string
  instrument?: string
}

interface RankRequest {
  presets: RankPreset[]
  userContext?: {
    favoriteGenres?: string[]
    favoriteArtists?: string[]
    level?: 'beginner' | 'intermediate' | 'advanced'
    instrument?: 'guitar' | 'bass' | 'other'
    recentlyUsedPresetIds?: string[]
  }
}

interface RankedPreset {
  id: string
  score: number
}

interface RankResponse {
  ranked: RankedPreset[]
}

async function callLLMForRanking(prompt: string): Promise<RankResponse> {
  const systemPrompt = `
Tu es un moteur de recommandation de presets pour WebAmp.
On te fournit une liste de presets candidats et un contexte utilisateur.

Tu dois renvoyer STRICTEMENT un JSON valide de type RankResponse :
{
  "ranked": [
    { "id": "preset-id", "score": 0-1 },
    ...
  ]
}

Contraintes :
- "ranked" doit contenir AU MOINS tous les ids fournis (dans l'ordre de préférence décroissant).
- "score" est entre 0 et 1 (1 = top recommandation).
- Ne renvoie AUCUN autre texte que le JSON.
`

  return await callGemini<RankResponse>(systemPrompt, prompt, {
    temperature: 0.3,
    maxOutputTokens: 2048,
  })
}

async function handlePresetRankingRequest(req: Request): Promise<Response> {
  const gate = await guardAuthedPost(req, 'ai-rank-presets')
  if (!gate.ok) return gate.response
  const { origin } = gate

  try {
    const body = (await req.json()) as RankRequest

    if (!body.presets || !Array.isArray(body.presets) || body.presets.length === 0) {
      return createCorsErrorResponse('presets (array) is required', 400, {}, origin)
    }
    if (body.presets.length > 50) {
      body.presets = body.presets.slice(0, 50)
    }

    const contextLines: string[] = []
    if (body.userContext?.favoriteGenres?.length) {
      contextLines.push(`Genres préférés: ${body.userContext.favoriteGenres.join(', ')}`)
    }
    if (body.userContext?.favoriteArtists?.length) {
      contextLines.push(`Artistes préférés: ${body.userContext.favoriteArtists.join(', ')}`)
    }
    if (body.userContext?.level) {
      contextLines.push(`Niveau: ${body.userContext.level}`)
    }
    if (body.userContext?.instrument) {
      contextLines.push(`Instrument: ${body.userContext.instrument}`)
    }
    if (body.userContext?.recentlyUsedPresetIds?.length) {
      contextLines.push(`Presets récemment utilisés: ${body.userContext.recentlyUsedPresetIds.join(', ')}`)
    }

    const presetSummary = body.presets
      .map(
        (p) =>
          `- id: ${p.id}, name: ${p.name}, genre: ${p.genre || 'n/a'}, mood: ${
            p.mood || 'n/a'
          }, tags: ${(p.tags || []).join(', ')}`,
      )
      .join('\n')

    const prompt = `
Contexte utilisateur:
${contextLines.join('\n') || '(aucun)'}

Presets candidats:
${presetSummary}

Classe ces presets du plus recommandé au moins recommandé pour cet utilisateur.
Retourne UNIQUEMENT le JSON RankResponse.`

    const ranking = await callLLMForRanking(prompt)

    return createCorsJsonResponse({ ok: true, ranking }, 200, {}, origin)
  } catch (error) {
    console.error('ai-rank-presets error:', error)
    return createCorsErrorResponse(safeClientError(error), 500, {}, origin)
  }
}

Deno.serve((req) => handleCors(req, handlePresetRankingRequest))
