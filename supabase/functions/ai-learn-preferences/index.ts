// Edge Function: ai-learn-preferences
// Apprentissage des préférences utilisateur à partir de l'historique d'utilisation via Gemini API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'
import { callGemini } from '../_shared/gemini.ts'
import { guardAuthedPost, safeClientError } from '../_shared/guard.ts'

interface LearnPreferencesRequest {
  userId: string
  history: {
    presetIds: string[]
    pedalIds: string[]
    amplifierIds: string[]
    genres: string[]
    artists: string[]
    moods: string[]
    instruments: ('guitar' | 'bass' | 'other')[]
    timeSpent: Record<string, number>
    lastUsed: Record<string, string>
  }
}

interface LearnedPreferences {
  favoriteGenres: string[]
  favoriteArtists: string[]
  favoritePedals: string[]
  favoriteAmplifiers: string[]
  preferredMoods: string[]
  preferredInstrument: 'guitar' | 'bass' | 'other'
  skillLevel: 'beginner' | 'intermediate' | 'advanced'
  usagePatterns: {
    mostUsedTimeOfDay: string
    averageSessionDuration: number
    preferredComplexity: 'simple' | 'medium' | 'complex'
  }
  recommendations: {
    suggestedPresets: string[]
    suggestedPedals: string[]
    suggestedGenres: string[]
  }
}

async function handler(req: Request): Promise<Response> {
  const gate = await guardAuthedPost(req, 'ai-learn-preferences')
  if (!gate.ok) return gate.response
  const { origin, userId } = gate

  try {
    const body = (await req.json()) as LearnPreferencesRequest

    if (!body.history) {
      return createCorsErrorResponse('history is required', 400, {}, origin)
    }
    // Ignore spoofed userId — always use JWT subject
    body.userId = userId

    const systemPrompt = `
Tu es un système d'apprentissage des préférences utilisateur pour WebAmp.
On te donne l'historique d'utilisation d'un utilisateur et tu dois analyser ses préférences.

Retourne STRICTEMENT un JSON valide de type LearnedPreferences :
{
  "favoriteGenres": ["string"],
  "favoriteArtists": ["string"],
  "favoritePedals": ["string"],
  "favoriteAmplifiers": ["string"],
  "preferredMoods": ["string"],
  "preferredInstrument": "guitar" | "bass" | "other",
  "skillLevel": "beginner" | "intermediate" | "advanced",
  "usagePatterns": {
    "mostUsedTimeOfDay": "morning" | "afternoon" | "evening" | "night",
    "averageSessionDuration": number (en minutes),
    "preferredComplexity": "simple" | "medium" | "complex"
  },
  "recommendations": {
    "suggestedPresets": ["string"],
    "suggestedPedals": ["string"],
    "suggestedGenres": ["string"]
  }
}

Contraintes :
- Analyse l'historique pour identifier les patterns (genres les plus utilisés, pédales favorites, etc.)
- Détermine le niveau de compétence basé sur la complexité des presets utilisés
- Génère des recommandations pertinentes basées sur les préférences identifiées
- Ne renvoie AUCUN texte hors du JSON.
- Retourne un objet JSON valide directement, sans wrapper.
`

    const historySummary = `
Historique utilisateur:
- Presets utilisés: ${body.history.presetIds.length} (${body.history.presetIds.slice(0, 10).join(', ')}${body.history.presetIds.length > 10 ? '...' : ''})
- Pédales utilisées: ${body.history.pedalIds.length} (${body.history.pedalIds.slice(0, 10).join(', ')}${body.history.pedalIds.length > 10 ? '...' : ''})
- Amplis utilisés: ${body.history.amplifierIds.length} (${body.history.amplifierIds.join(', ')})
- Genres: ${body.history.genres.join(', ') || 'aucun'}
- Artistes: ${body.history.artists.join(', ') || 'aucun'}
- Ambiances: ${body.history.moods.join(', ') || 'aucun'}
- Instruments: ${body.history.instruments.join(', ') || 'aucun'}
- Temps passé par preset: ${Object.keys(body.history.timeSpent).length} presets trackés
`

    const userPrompt = `${historySummary}\n\nAnalyse cet historique et génère les préférences apprises. Retourne UNIQUEMENT le JSON LearnedPreferences.`

    const preferences = await callGemini<LearnedPreferences>(systemPrompt, userPrompt, {
      temperature: 0.6, // Équilibre entre créativité et cohérence
      maxOutputTokens: 2048
    })

    return createCorsJsonResponse({ ok: true, preferences }, 200, {}, origin)
  } catch (error) {
    console.error('ai-learn-preferences error:', error)
    return createCorsErrorResponse(safeClientError(error), 500, {}, origin)
  }
}

serve((req) => handleCors(req, handler))

