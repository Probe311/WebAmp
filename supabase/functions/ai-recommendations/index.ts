// Edge Function: ai-recommendations
// Recommandations personnalisées basées sur les préférences apprises via Gemini API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'
import { callGemini } from '../_shared/gemini.ts'

interface RecommendationsRequest {
  userId: string
  preferences: {
    favoriteGenres: string[]
    favoriteArtists: string[]
    favoritePedals: string[]
    favoriteAmplifiers: string[]
    preferredMoods: string[]
    preferredInstrument: 'guitar' | 'bass' | 'other'
    skillLevel: 'beginner' | 'intermediate' | 'advanced'
  }
  availablePresets: Array<{
    id: string
    name: string
    genre?: string
    tags?: string[]
  }>
}

interface Recommendation {
  id: string
  score: number
  reason: string
}

interface RecommendationsResponse {
  recommendations: Recommendation[]
}

async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return createCorsJsonResponse({ ok: true })
  }

  if (req.method !== 'POST') {
    return createCorsErrorResponse('Method not allowed', 405)
  }

  try {
    const body = (await req.json()) as RecommendationsRequest

    if (!body.userId || !body.preferences || !body.availablePresets) {
      return createCorsErrorResponse('userId, preferences and availablePresets are required', 400)
    }

    const systemPrompt = `
Tu es un système de recommandation personnalisé pour WebAmp.
On te donne les préférences apprises d'un utilisateur et une liste de presets disponibles.
Tu dois recommander les presets les plus pertinents pour cet utilisateur.

Retourne STRICTEMENT un JSON valide de type RecommendationsResponse :
{
  "recommendations": [
    {
      "id": "preset-id",
      "score": 0-1,
      "reason": "Explication courte de pourquoi ce preset est recommandé (en français)"
    },
    ...
  ]
}

Contraintes :
- Classe les presets du plus recommandé (score proche de 1) au moins recommandé (score proche de 0)
- Adapte les recommandations au niveau de compétence (beginner = presets simples, advanced = presets complexes)
- Prends en compte les genres, artistes et ambiances préférés
- Fournis une raison claire pour chaque recommandation
- Ne renvoie AUCUN texte hors du JSON.
- Retourne un objet JSON valide directement, sans wrapper.
`

    const preferencesSummary = `
Préférences utilisateur:
- Genres favoris: ${body.preferences.favoriteGenres.join(', ') || 'aucun'}
- Artistes favoris: ${body.preferences.favoriteArtists.join(', ') || 'aucun'}
- Pédales favorites: ${body.preferences.favoritePedals.join(', ') || 'aucun'}
- Amplis favoris: ${body.preferences.favoriteAmplifiers.join(', ') || 'aucun'}
- Ambiances préférées: ${body.preferences.preferredMoods.join(', ') || 'aucun'}
- Instrument: ${body.preferences.preferredInstrument}
- Niveau: ${body.preferences.skillLevel}
`

    const presetsSummary = body.availablePresets
      .map((p) => `- ${p.id}: ${p.name} (genre: ${p.genre || 'n/a'}, tags: ${(p.tags || []).join(', ') || 'aucun'})`)
      .join('\n')

    const userPrompt = `${preferencesSummary}\n\nPresets disponibles:\n${presetsSummary}\n\nRecommande les presets les plus pertinents pour cet utilisateur. Retourne UNIQUEMENT le JSON RecommendationsResponse.`

    const result = await callGemini<RecommendationsResponse>(systemPrompt, userPrompt, {
      temperature: 0.5, // Équilibre pour des recommandations cohérentes
      maxOutputTokens: 2048
    })

    return createCorsJsonResponse(
      {
        ok: true,
        recommendations: result.recommendations,
      },
      200,
    )
  } catch (error) {
    console.error('ai-recommendations error:', error)
    return createCorsErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500,
    )
  }
}

serve((req) => handleCors(req, handler))

serve((req) => handleCors(req, handler))

