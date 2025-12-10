/**
 * Service Supabase pour le catalogue (pédales et amplis)
 */
import { getSupabaseClient } from '../../lib/supabaseClient'
import { PedalModel } from '../../data/pedals'
import { AmplifierModel } from '../../data/amplifiers'

export interface SupabasePedal {
  id: string
  brand: string
  model: string
  type: string
  description: string | null
  color: string | null
  accent_color: string | null
  style: string | null
}

export interface SupabasePedalParameter {
  id: number
  pedal_id: string
  name: string
  label: string | null
  min: number
  max: number
  default_value: number
  control_type: string | null
  orientation: string | null
  order_index: number
}

export interface SupabaseAmplifier {
  id: string
  brand: string
  model: string
  type: string
  description: string | null
  color: string | null
  style: string | null
  knob_color: string | null
  knob_base_color: string | null
  grille_gradient_a: string | null
  grille_gradient_b: string | null
  grille_pattern: string | null
  knob_layout: string | null
  border_style: string | null
}

export interface SupabaseAmplifierParameter {
  id: number
  amplifier_id: string
  name: string
  label: string | null
  min: number
  max: number
  default_value: number
  order_index: number
}

/**
 * Charge toutes les pédales depuis Supabase
 */
export async function loadPedalsFromSupabase(): Promise<PedalModel[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  // Charger les pédales
  const { data: pedals, error: pedalsError } = await supabase
    .from('pedals')
    .select('*')
    .order('brand', { ascending: true })
    .order('model', { ascending: true })

  if (pedalsError) throw pedalsError
  if (!pedals) return []

  // Charger les paramètres
  const { data: parameters, error: paramsError } = await supabase
    .from('pedal_parameters')
    .select('*')
    .order('pedal_id', { ascending: true })
    .order('order_index', { ascending: true })

  if (paramsError) throw paramsError

  // Transformer en PedalModel
  return pedals.map((pedal: SupabasePedal) => {
    const pedalParams = (parameters as SupabasePedalParameter[]).filter(p => p.pedal_id === pedal.id)
    const params: Record<string, any> = {}

    pedalParams.forEach(param => {
      params[param.name] = {
        min: param.min,
        max: param.max,
        default: param.default_value,
        label: param.label || param.name,
        controlType: param.control_type as any || 'knob',
        orientation: param.orientation as 'vertical' | 'horizontal' | undefined
      }
    })

    return {
      id: pedal.id,
      brand: pedal.brand,
      model: pedal.model,
      type: pedal.type as any,
      description: pedal.description || '',
      parameters: params,
      color: pedal.color || '#1a1a1a',
      accentColor: pedal.accent_color || '#3b82f6',
      style: (pedal.style || 'modern') as 'vintage' | 'modern' | 'boutique'
    } as PedalModel
  })
}

/**
 * Charge tous les amplis depuis Supabase
 */
export async function loadAmplifiersFromSupabase(): Promise<AmplifierModel[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  // Charger les amplis
  const { data: amplifiers, error: ampsError } = await supabase
    .from('amplifiers')
    .select('*')
    .order('brand', { ascending: true })
    .order('model', { ascending: true })

  if (ampsError) throw ampsError
  if (!amplifiers) return []

  // Charger les paramètres
  const { data: parameters, error: paramsError } = await supabase
    .from('amplifier_parameters')
    .select('*')
    .order('amplifier_id', { ascending: true })
    .order('order_index', { ascending: true })

  if (paramsError) throw paramsError

  // Transformer en AmplifierModel
  return amplifiers.map((amp: SupabaseAmplifier) => {
    const ampParams = (parameters as SupabaseAmplifierParameter[]).filter(p => p.amplifier_id === amp.id)
    const params: Record<string, { min: number; max: number; default: number }> = {}

    ampParams.forEach(param => {
      params[param.name] = {
        min: param.min,
        max: param.max,
        default: param.default_value
      }
    })

    return {
      id: amp.id,
      brand: amp.brand,
      model: amp.model,
      type: amp.type as 'combo' | 'head',
      description: amp.description || '',
      parameters: params,
      color: amp.color || '#1a1a1a',
      style: (amp.style || 'modern') as 'vintage' | 'modern' | 'high-gain',
      knobColor: amp.knob_color || '#3b82f6',
      knobBaseColor: (amp.knob_base_color || 'black') as 'black' | 'gold' | 'chrome' | 'gray' | 'silver',
      uiStyle: {
        grilleGradient: [
          amp.grille_gradient_a || '#1a1a1a',
          amp.grille_gradient_b || '#2a2a2a'
        ],
        grillePattern: (amp.grille_pattern || 'horizontal') as 'horizontal' | 'vertical' | 'grid' | 'diagonal' | 'none',
        knobLayout: (amp.knob_layout || 'horizontal') as 'horizontal' | 'vertical' | 'grid' | 'compact',
        borderStyle: (amp.border_style || 'solid') as 'solid' | 'double' | 'dashed'
      }
    } as AmplifierModel
  })
}

