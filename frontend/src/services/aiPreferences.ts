/**
 * Préférences utilisateur via Edge Functions (JWT requis).
 */
import { invokeEdge } from './invokeEdge'

export interface UserUsageHistory {
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

export async function learnUserPreferences(
  _userId: string,
  history: UserUsageHistory,
): Promise<LearnedPreferences> {
  const data = await invokeEdge<{ ok: boolean; preferences?: LearnedPreferences }>(
    'ai-learn-preferences',
    { history },
  )
  if (!data.ok || !data.preferences) {
    throw new Error('Réponse IA invalide (preferences manquant)')
  }
  return data.preferences
}

export async function getPersonalizedRecommendations(
  _userId: string,
  preferences: LearnedPreferences,
  availablePresets: Array<{ id: string; name: string; genre?: string; tags?: string[] }>,
): Promise<Array<{ id: string; score: number; reason: string }>> {
  const data = await invokeEdge<{
    ok: boolean
    recommendations?: Array<{ id: string; score: number; reason: string }>
  }>('ai-recommendations', {
    preferences,
    availablePresets,
  })
  if (!data.ok || !data.recommendations) {
    throw new Error('Réponse IA invalide (recommendations manquant)')
  }
  return data.recommendations
}
