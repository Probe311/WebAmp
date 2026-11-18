/**
 * AI Services — Edge Functions Supabase (JWT requis).
 */
import { invokeEdge } from './invokeEdge'

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

export interface EffectModule {
  type: 'amp' | 'cab' | 'pedal' | 'utility'
  id: string
  enabled: boolean
  parameters: Record<string, number | string | boolean>
  position?: number
}

export interface ToneAssistantResponse {
  effects: EffectModule[]
  name?: string
  description?: string
  notes?: string
}

export interface DrumStep {
  step: number
  instruments: Array<'kick' | 'snare' | 'hihat' | 'openhat' | 'crash' | 'ride' | 'tom1' | 'tom2' | 'tom3'>
}

export interface BeatPattern {
  name: string
  description?: string
  steps: DrumStep[]
  tempo?: number
  timeSignature?: string
}

export async function generatePresetFromDescription(
  description: string,
  context?: GeneratePresetContext,
): Promise<WebAmpPreset> {
  if (!description.trim()) throw new Error('La description du preset est requise')
  const data = await invokeEdge<{ ok: boolean; preset?: WebAmpPreset }>('ai-presets', {
    description,
    context,
  })
  if (!data.ok || !data.preset) throw new Error('Réponse IA invalide (preset manquant)')
  return data.preset
}

export async function analyzeContext(context: AnalyzeContext): Promise<AnalysisResult> {
  const hasInput = !!context.genre || !!context.artist || !!context.songTitle || !!context.mood
  if (!hasInput) {
    throw new Error('Au moins un champ (genre, artiste, morceau, humeur) est requis')
  }
  const data = await invokeEdge<{ ok: boolean; analysis?: AnalysisResult }>('ai-analyze', context)
  if (!data.ok || !data.analysis) throw new Error('Réponse IA invalide (analysis manquant)')
  return data.analysis
}

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
  if (!presets.length) return []
  const data = await invokeEdge<{ ok: boolean; ranking?: { ranked: RankedPreset[] } }>(
    'ai-rank-presets',
    {
      presets: presets.map((p) => ({
        id: p.id,
        name: p.name,
        tags: p.tags,
        genre: p.genre,
        mood: p.mood,
        instrument: p.instrument,
      })),
      userContext,
    },
  )
  if (!data.ok || !data.ranking?.ranked) throw new Error('Réponse IA invalide (ranking manquant)')
  return data.ranking.ranked
}

export async function interpretVoiceCommand(
  text: string,
  options?: {
    language?: string
    instrument?: 'guitar' | 'bass' | 'other'
    presetId?: string
  },
): Promise<WebAmpCommand> {
  if (!text.trim()) throw new Error('La commande vocale (texte) est vide')
  const data = await invokeEdge<{ ok: boolean; intent?: { command: WebAmpCommand } }>(
    'ai-voice-intent',
    {
      text,
      language: options?.language || 'fr',
      context: {
        instrument: options?.instrument,
        presetId: options?.presetId,
      },
    },
  )
  if (!data.ok || !data.intent?.command) throw new Error('Réponse IA invalide (intent manquant)')
  return data.intent.command
}

export async function generateToneFromDescription(
  description: string,
  context?: {
    instrument?: 'guitar' | 'bass' | 'other'
    genre?: string
    artist?: string
    currentEffects?: Array<{ id: string; type: string; enabled: boolean }>
  },
): Promise<ToneAssistantResponse> {
  if (!description.trim()) throw new Error('La description du ton est requise')
  const data = await invokeEdge<{ ok: boolean; result?: ToneAssistantResponse }>(
    'ai-tone-assistant',
    { description, context },
  )
  if (!data.ok || !data.result) throw new Error('Réponse IA invalide (result manquant)')
  return data.result
}

export async function generateBeatFromDescription(
  description: string,
  context?: {
    tempo?: number
    timeSignature?: '4/4' | '3/4' | '2/4' | '6/8' | '7/8'
    complexity?: 'simple' | 'medium' | 'complex'
  },
): Promise<BeatPattern> {
  if (!description.trim()) throw new Error('La description du style est requise')
  const data = await invokeEdge<{ ok: boolean; pattern?: BeatPattern }>('ai-beat-architect', {
    description,
    context,
  })
  if (!data.ok || !data.pattern) throw new Error('Réponse IA invalide (pattern manquant)')
  return data.pattern
}
