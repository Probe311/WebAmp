/**
 * Service Supabase pour la gestion des favoris
 */
import { getSupabaseClient } from '../../lib/supabaseClient'
import { Preset } from './presets'

/**
 * Ajoute un preset aux favoris
 */
export async function addFavorite(presetId: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  const { error } = await supabase
    .from('favorites')
    .insert({
      user_id: user.id,
      preset_id: presetId
    })

  if (error) throw error
}

/**
 * Retire un preset des favoris
 */
export async function removeFavorite(presetId: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('preset_id', presetId)

  if (error) throw error
}

/**
 * Vérifie si un preset est dans les favoris
 */
export async function isFavorite(presetId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  const { data, error } = await supabase
    .from('favorites')
    .select('preset_id')
    .eq('user_id', user.id)
    .eq('preset_id', presetId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    throw error
  }

  return !!data
}

/**
 * Charge tous les presets favoris de l'utilisateur
 */
export async function loadFavorites(): Promise<Preset[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  // Récupérer les IDs des favoris
  const { data: favorites, error: favError } = await supabase
    .from('favorites')
    .select('preset_id')
    .eq('user_id', user.id)

  if (favError) throw favError
  if (!favorites || favorites.length === 0) return []

  const presetIds = favorites.map(f => f.preset_id)

  // Charger les presets
  const { data: presets, error: presetsError } = await supabase
    .from('presets')
    .select(`
      *,
      preset_effects (
        *,
        preset_effect_parameters (*)
      ),
      preset_amplifiers (*)
    `)
    .in('id', presetIds)

  if (presetsError) throw presetsError
  if (!presets) return []

  // Transformer les presets
  return presets.map((preset: any) => {
    const effects = (preset.preset_effects || []).map((pe: any) => {
      const params: Record<string, number> = {}
      ;(pe.preset_effect_parameters || []).forEach((param: any) => {
        params[param.name] = param.value
      })

      return {
        id: pe.effect_id || pe.id,
        type: pe.type || '',
        pedalId: pe.pedal_id || '',
        parameters: params,
        bypassed: pe.bypassed || false
      }
    })

    const amplifier = preset.preset_amplifiers?.[0]

    return {
      id: preset.id,
      user_id: preset.user_id,
      name: preset.name,
      style: preset.style,
      notes: preset.notes,
      is_public: preset.is_public,
      tags: preset.tags || [],
      bpm: preset.bpm,
      instrument: preset.instrument,
      created_at: preset.created_at,
      updated_at: preset.updated_at,
      amplifier_id: amplifier?.amplifier_id || null,
      amplifier_parameters: amplifier?.parameters || null,
      effects
    } as Preset
  })
}

