// Edge Function: ai-rank-presets
// Classement intelligent de presets en fonction du contexte utilisateur via Gemini API.

import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'
import { callGemini } from '../_shared/gemini.ts'

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
  // Utilise Gemini API via le helper partagé

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

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  }

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!resp.ok) {
    const text = await resp.text()
    console.error('LLM API error (ai-rank-presets)', resp.status, text)
    throw new Error(`LLM API error: ${resp.status}`)
  }

  const data = await resp.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('Empty LLM response')
  }

  try {
    const parsed = JSON.parse(content) as RankResponse
    return parsed
  } catch (err) {
    console.error('Failed to parse LLM JSON content (ai-rank-presets)', content, err)
    throw new Error('Invalid JSON from LLM')
  }
}

async function handlePresetRankingRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return createCorsJsonResponse({ ok: true })
  }

  if (req.method !== 'POST') {
    return createCorsErrorResponse('Method not allowed', 405)
  }

  try {
    const body = (await req.json()) as RankRequest

    if (!body.presets || !Array.isArray(body.presets) || body.presets.length === 0) {
      return createCorsErrorResponse('presets (array) is required', 400)
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

    return createCorsJsonResponse(
      {
        ok: true,
        ranking,
      },
      200,
    )
  } catch (error) {
    console.error('ai-rank-presets error:', error)
    return createCorsErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500,
    )
  }
}

serve((req) => handleCors(req, handlePresetRankingRequest))


