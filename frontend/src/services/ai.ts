/**
 * AI Services
 *
 * Service frontend pour appeler les fonctions Edge IA (Supabase) :
 * - Génération de presets WebAmp à partir d'une description (ai-presets)
 */

export interface GeneratePresetContext {
  instrument?: 'guitar' | 'bass' | 'other'
  genre?: string
  artist?: string
  songTitle?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
}

export interface WebAmpPresetEffect {
  type: 'amp' | 'cab' | 'pedal' | 'utility'
  id: string
  enabled: boolean
  parameters: Record<string, number | string | boolean>
}

export interface WebAmpPreset {
  id: string
  name: string
  description?: string
  tags?: string[]
  genre?: string
  mood?: string
  instrument?: string
  chain: WebAmpPresetEffect[]
}

export interface AnalyzeContext {
  genre?: string
  artist?: string
  songTitle?: string
  mood?: string
  instrument?: 'guitar' | 'bass' | 'other'
}

export interface SuggestedEffect {
  id: string
  type: 'amp' | 'cab' | 'pedal' | 'utility'
  name: string
  description?: string
  parameters?: Record<string, number | string | boolean>
  position?: number
}

export interface AnalysisResult {
  inferredGenre?: string
  inferredMood?: string
  notes?: string
  suggestedEffects: SuggestedEffect[]
}

export interface RankedPreset {
  id: string
  score: number
}

export type WebAmpCommandType =
  | 'setPreset'
  | 'setAmplifier'
  | 'setParameter'
  | 'togglePedal'
  | 'bypassAll'
  | 'setMetronome'
  | 'setLooper'
  | 'noOp'

export interface WebAmpCommand {
  type: WebAmpCommandType
  payload?: Record<string, unknown>
  naturalLanguageSummary?: string
}

export async function generatePresetFromDescription(
  description: string,
  context?: GeneratePresetContext,
): Promise<WebAmpPreset> {
  if (!description.trim()) {
    throw new Error('La description du preset est requise')
  }

  // L’URL d’appel dépendra de la config Supabase en prod.
  // En local, Supabase expose en général les fonctions sur /functions/v1/<nom>.
  const endpoint =
    import.meta.env.VITE_SUPABASE_EDGE_URL_AI_PRESETS ||
    '/functions/v1/ai-presets'

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description, context }),
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`Erreur IA (ai-presets): ${resp.status} - ${text}`)
  }

  const data = await resp.json()

  if (!data.ok || !data.preset) {
    throw new Error('Réponse IA invalide (preset manquant)')
  }

  return data.preset as WebAmpPreset
}

/**
 * Analyse intelligente (IA) pour suggérer des effets en fonction du contexte
 * (genre, artiste, morceau, humeur...).
 */
export async function analyzeContext(
  context: AnalyzeContext,
): Promise<AnalysisResult> {
  const hasInput =
    !!context.genre || !!context.artist || !!context.songTitle || !!context.mood

  if (!hasInput) {
    throw new Error('Au moins un champ (genre, artiste, morceau, humeur) est requis')
  }

  const endpoint =
    import.meta.env.VITE_SUPABASE_EDGE_URL_AI_ANALYZE ||
    '/functions/v1/ai-analyze'

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(context),
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`Erreur IA (ai-analyze): ${resp.status} - ${text}`)
  }

  const data = await resp.json()
  if (!data.ok || !data.analysis) {
    throw new Error('Réponse IA invalide (analysis manquant)')
  }

  return data.analysis as AnalysisResult
}

/**
 * Classement IA des presets pour un utilisateur donné
 * à partir d'une liste de presets candidats + contexte utilisateur.
 */
export async function rankPresetsForUser(
  presets: WebAmpPreset[],
  userContext?: {
    favoriteGenres?: string[]
    favoriteArtists?: string[]
    level?: 'beginner' | 'intermediate' | 'advanced'
    instrument?: 'guitar' | 'bass' | 'other'
    recentlyUsedPresetIds?: string[]
  },
): Promise<RankedPreset[]> {
  if (!presets.length) {
    return []
  }

  const endpoint =
    import.meta.env.VITE_SUPABASE_EDGE_URL_AI_RANK_PRESETS ||
    '/functions/v1/ai-rank-presets'

  const payload = {
    presets: presets.map((p) => ({
      id: p.id,
      name: p.name,
      tags: p.tags,
      genre: p.genre,
      mood: p.mood,
      instrument: p.instrument,
    })),
    userContext,
  }

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`Erreur IA (ai-rank-presets): ${resp.status} - ${text}`)
  }

  const data = await resp.json()
  if (!data.ok || !data.ranking || !data.ranking.ranked) {
    throw new Error('Réponse IA invalide (ranking manquant)')
  }

  return data.ranking.ranked as RankedPreset[]
}

/**
 * Interprétation d'une commande vocale transcrite (texte) en commande WebAmp structurée.
 * (La reconnaissance vocale elle-même est gérée côté client ou par un service externe.)
 */
export async function interpretVoiceCommand(
  text: string,
  options?: {
    language?: string
    instrument?: 'guitar' | 'bass' | 'other'
    presetId?: string
  },
): Promise<WebAmpCommand> {
  if (!text.trim()) {
    throw new Error('La commande vocale (texte) est vide')
  }

  const endpoint =
    import.meta.env.VITE_SUPABASE_EDGE_URL_AI_VOICE_INTENT ||
    '/functions/v1/ai-voice-intent'

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      language: options?.language || 'fr',
      context: {
        instrument: options?.instrument,
        presetId: options?.presetId,
      },
    }),
  })

  if (!resp.ok) {
    const textResp = await resp.text()
    throw new Error(`Erreur IA (ai-voice-intent): ${resp.status} - ${textResp}`)
  }

  const data = await resp.json()
  if (!data.ok || !data.intent || !data.intent.command) {
    throw new Error('Réponse IA invalide (intent manquant)')
  }

  return data.intent.command as WebAmpCommand
}





