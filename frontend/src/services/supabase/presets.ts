/**
 * Service Supabase pour la gestion des presets
 */
import { getSupabaseClient } from '../../lib/supabaseClient'
import { Effect } from '../../components/Pedalboard'

export interface Preset {
  id: string
  user_id: string | null
  name: string
  style: string | null
  notes: string | null
  is_public: boolean
  tags: string[]
  bpm: number | null
  instrument: string | null
  created_at: string
  updated_at: string
  amplifier_id: string | null
  amplifier_parameters: Record<string, number> | null
  effects: Effect[]
}

export interface PresetCreate {
  name: string
  style?: string
  notes?: string
  is_public?: boolean
  tags?: string[]
  bpm?: number
  instrument?: string
  amplifier_id?: string
  amplifier_parameters?: Record<string, number>
  effects: Effect[]
}

export interface PresetUpdate extends Partial<PresetCreate> {
  name?: string
}

/**
 * Charge tous les presets de l'utilisateur connecté
 */
export async function loadUserPresets(): Promise<Preset[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data: presets, error } = await supabase
    .from('presets')
    .select(`
      *,
      preset_effects (
        *,
        preset_effect_parameters (*)
      ),
      preset_amplifiers (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  if (!presets) return []

  return presets.map(transformPreset)
}

/**
 * Charge les presets publics
 */
export async function loadPublicPresets(limit = 50): Promise<Preset[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: presets, error } = await supabase
    .from('presets')
    .select(`
      *,
      preset_effects (
        *,
        preset_effect_parameters (*)
      ),
      preset_amplifiers (*)
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  if (!presets) return []

  return presets.map(transformPreset)
}

/**
 * Charge un preset par ID
 */
export async function loadPresetById(presetId: string): Promise<Preset | null> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()

  const { data: preset, error } = await supabase
    .from('presets')
    .select(`
      *,
      preset_effects (
        *,
        preset_effect_parameters (*)
      ),
      preset_amplifiers (*)
    `)
    .eq('id', presetId)
    .single()

  if (error) throw error
  if (!preset) return null

  // Vérifier les permissions (public ou owner)
  if (!preset.is_public && preset.user_id !== user?.id) {
    throw new Error('Accès non autorisé à ce preset')
  }

  return transformPreset(preset)
}

/**
 * Crée un nouveau preset
 */
export async function createPreset(preset: PresetCreate): Promise<Preset> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  // Créer le preset
  const { data: newPreset, error: presetError } = await supabase
    .from('presets')
    .insert({
      user_id: user.id,
      name: preset.name,
      style: preset.style || null,
      notes: preset.notes || null,
      is_public: preset.is_public || false,
      tags: preset.tags || [],
      bpm: preset.bpm || null,
      instrument: preset.instrument || null
    })
    .select()
    .single()

  if (presetError) throw presetError
  if (!newPreset) throw new Error('Erreur lors de la création du preset')

  // Créer les effets
  if (preset.effects && preset.effects.length > 0) {
    const presetEffects = preset.effects.map((effect, index) => ({
      preset_id: newPreset.id,
      effect_id: effect.id,
      pedal_id: effect.pedalId,
      type: effect.type,
      position: index,
      bypassed: effect.bypassed || false
    }))

    const { data: effects, error: effectsError } = await supabase
      .from('preset_effects')
      .insert(presetEffects)
      .select()

    if (effectsError) throw effectsError

    // Créer les paramètres des effets
    if (effects) {
      const allParams: any[] = []
      effects.forEach((pe: any) => {
        const effect = preset.effects.find(e => e.id === pe.effect_id)
        if (effect && effect.parameters) {
          Object.entries(effect.parameters).forEach(([name, value]) => {
            allParams.push({
              preset_effect_id: pe.id,
              name,
              value: value as number
            })
          })
        }
      })

      if (allParams.length > 0) {
        const { error: paramsError } = await supabase
          .from('preset_effect_parameters')
          .insert(allParams)

        if (paramsError) throw paramsError
      }
    }
  }

  // Créer l'ampli si présent
  if (preset.amplifier_id) {
    const { error: ampError } = await supabase
      .from('preset_amplifiers')
      .insert({
        preset_id: newPreset.id,
        amplifier_id: preset.amplifier_id,
        parameters: preset.amplifier_parameters || null
      })

    if (ampError) throw ampError
  }

  // Recharger le preset complet
  const loaded = await loadPresetById(newPreset.id)
  if (!loaded) throw new Error('Erreur lors du chargement du preset créé')
  return loaded
}

/**
 * Met à jour un preset
 */
export async function updatePreset(presetId: string, updates: PresetUpdate): Promise<Preset> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  // Vérifier que le preset appartient à l'utilisateur
  const { data: existing } = await supabase
    .from('presets')
    .select('user_id')
    .eq('id', presetId)
    .single()

  if (!existing || existing.user_id !== user.id) {
    throw new Error('Preset non trouvé ou accès non autorisé')
  }

  // Mettre à jour le preset
  const { error: updateError } = await supabase
    .from('presets')
    .update({
      name: updates.name,
      style: updates.style,
      notes: updates.notes,
      is_public: updates.is_public,
      tags: updates.tags,
      bpm: updates.bpm,
      instrument: updates.instrument,
      updated_at: new Date().toISOString()
    })
    .eq('id', presetId)

  if (updateError) throw updateError

  // Si les effets sont mis à jour, supprimer les anciens et recréer
  if (updates.effects) {
    // Supprimer les anciens effets (cascade supprime les paramètres)
    const { error: deleteError } = await supabase
      .from('preset_effects')
      .delete()
      .eq('preset_id', presetId)

    if (deleteError) throw deleteError

    // Recréer les effets
    const presetEffects = updates.effects.map((effect, index) => ({
      preset_id: presetId,
      effect_id: effect.id,
      pedal_id: effect.pedalId,
      type: effect.type,
      position: index,
      bypassed: effect.bypassed || false
    }))

    const { data: effects, error: effectsError } = await supabase
      .from('preset_effects')
      .insert(presetEffects)
      .select()

    if (effectsError) throw effectsError

    // Créer les paramètres
    if (effects) {
      const allParams: any[] = []
      effects.forEach((pe: any) => {
        const effect = updates.effects!.find(e => e.id === pe.effect_id)
        if (effect && effect.parameters) {
          Object.entries(effect.parameters).forEach(([name, value]) => {
            allParams.push({
              preset_effect_id: pe.id,
              name,
              value: value as number
            })
          })
        }
      })

      if (allParams.length > 0) {
        const { error: paramsError } = await supabase
          .from('preset_effect_parameters')
          .insert(allParams)

        if (paramsError) throw paramsError
      }
    }
  }

  // Mettre à jour l'ampli si présent
  if (updates.amplifier_id !== undefined) {
    // Supprimer l'ancien
    await supabase
      .from('preset_amplifiers')
      .delete()
      .eq('preset_id', presetId)

    // Créer le nouveau si présent
    if (updates.amplifier_id) {
      const { error: ampError } = await supabase
        .from('preset_amplifiers')
        .insert({
          preset_id: presetId,
          amplifier_id: updates.amplifier_id,
          parameters: updates.amplifier_parameters || null
        })

      if (ampError) throw ampError
    }
  }

  // Recharger le preset complet
  const loaded = await loadPresetById(presetId)
  if (!loaded) throw new Error('Erreur lors du chargement du preset mis à jour')
  return loaded
}

/**
 * Supprime un preset
 */
export async function deletePreset(presetId: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  // Vérifier que le preset appartient à l'utilisateur
  const { data: existing } = await supabase
    .from('presets')
    .select('user_id')
    .eq('id', presetId)
    .single()

  if (!existing || existing.user_id !== user.id) {
    throw new Error('Preset non trouvé ou accès non autorisé')
  }

  // Supprimer (cascade supprime les effets et paramètres)
  const { error } = await supabase
    .from('presets')
    .delete()
    .eq('id', presetId)

  if (error) throw error
}

/**
 * Transforme un preset de Supabase en Preset
 */
function transformPreset(preset: any): Preset {
  const effects: Effect[] = (preset.preset_effects || []).map((pe: any) => {
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
  }
}

