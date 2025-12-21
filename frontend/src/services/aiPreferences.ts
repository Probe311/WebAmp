/**
 * Service d'apprentissage des préférences utilisateur via IA
 * Utilise Gemini pour analyser l'historique d'utilisation et apprendre les préférences
 */

export interface UserUsageHistory {
  presetIds: string[]
  pedalIds: string[]
  amplifierIds: string[]
  genres: string[]
  artists: string[]
  moods: string[]
  instruments: ('guitar' | 'bass' | 'other')[]
  timeSpent: Record<string, number> // presetId -> minutes
  lastUsed: Record<string, string> // presetId -> ISO date
}

export interface LearnedPreferences {
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

/**
 * Apprend les préférences utilisateur à partir de l'historique d'utilisation
 */
export async function learnUserPreferences(
  userId: string,
  history: UserUsageHistory,
): Promise<LearnedPreferences> {
  const endpoint =
    import.meta.env.VITE_SUPABASE_EDGE_URL_AI_LEARN_PREFERENCES ||
    '/functions/v1/ai-learn-preferences'

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, history }),
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`Erreur IA (ai-learn-preferences): ${resp.status} - ${text}`)
  }

  const data = await resp.json()
  if (!data.ok || !data.preferences) {
    throw new Error('Réponse IA invalide (preferences manquant)')
  }

  return data.preferences as LearnedPreferences
}

/**
 * Récupère les recommandations personnalisées basées sur les préférences apprises
 */
export async function getPersonalizedRecommendations(
  userId: string,
  preferences: LearnedPreferences,
  availablePresets: Array<{ id: string; name: string; genre?: string; tags?: string[] }>,
): Promise<Array<{ id: string; score: number; reason: string }>> {
  const endpoint =
    import.meta.env.VITE_SUPABASE_EDGE_URL_AI_RECOMMENDATIONS ||
    '/functions/v1/ai-recommendations'

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      preferences,
      availablePresets,
    }),
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`Erreur IA (ai-recommendations): ${resp.status} - ${text}`)
  }

  const data = await resp.json()
  if (!data.ok || !data.recommendations) {
    throw new Error('Réponse IA invalide (recommendations manquant)')
  }

  return data.recommendations as Array<{ id: string; score: number; reason: string }>
}


