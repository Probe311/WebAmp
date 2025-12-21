/**
 * Seed catalogue pedals/amplifiers into Supabase.
 * Usage (dev): 
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ts-node supabase/seed/seed_catalog.ts
 *
 * Data source: frontend/src/data/pedals.ts & amplifiers.ts
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { pedalLibrary, PedalModel } from '../../frontend/src/data/pedals'
import { amplifierLibrary, AmplifierModel } from '../../frontend/src/data/amplifiers'

const BATCH_SIZE = 100

interface PedalParameter {
  min: number
  max: number
  default: number
  label: string
  controlType?: string
  orientation?: 'vertical' | 'horizontal'
}

interface AmplifierParameter {
  min: number
  max: number
  default: number
}

interface PedalPayload {
  id: string
  brand: string
  model: string
  type: string
  description: string
  color: string
  accent_color: string
  style: string
}

interface AmplifierPayload {
  id: string
  brand: string
  model: string
  type: string
  description: string
  color: string
  style: string
  knob_color: string
  knob_base_color: string
  grille_gradient_a: string
  grille_gradient_b: string
  grille_pattern: string
  knob_layout: string
  border_style: string
}

interface PedalParameterPayload {
  pedal_id: string
  name: string
  label: string
  min: number
  max: number
  default_value: number
  control_type: string
  orientation?: string
  order_index: number
}

interface AmplifierParameterPayload {
  amplifier_id: string
  name: string
  label: string
  min: number
  max: number
  default_value: number
  order_index: number
}

async function upsertBatch<T>(
  supabase: SupabaseClient,
  table: string,
  items: T[],
  onConflict: string = 'id'
): Promise<void> {
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from(table).upsert(batch, { onConflict })
    if (error) {
      throw new Error(`Failed to upsert batch to ${table}: ${error.message}`)
    }
  }
}

async function insertBatch<T>(
  supabase: SupabaseClient,
  table: string,
  items: T[]
): Promise<void> {
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE)
    const { error } = await supabase.from(table).insert(batch)
    if (error) {
      throw new Error(`Failed to insert batch to ${table}: ${error.message}`)
    }
  }
}

async function seedPedalParameters(
  supabase: SupabaseClient,
  table: string,
  items: Array<{ id: string; parameters: Record<string, PedalParameter> }>,
  mapper: (itemId: string, name: string, def: PedalParameter, order: number) => PedalParameterPayload
): Promise<number> {
  const { error: deleteError } = await supabase.from(table).delete().neq('id', 0)
  if (deleteError) {
    throw new Error(`Failed to clear ${table}: ${deleteError.message}`)
  }

  const paramsPayload: PedalParameterPayload[] = []
  
  for (const item of items) {
    let order = 0
    Object.entries(item.parameters).forEach(([name, def]) => {
      paramsPayload.push(mapper(item.id, name, def, order++))
    })
  }
  
  if (paramsPayload.length > 0) {
    await insertBatch(supabase, table, paramsPayload)
  }
  
  return paramsPayload.length
}

async function seedAmplifierParameters(
  supabase: SupabaseClient,
  table: string,
  items: Array<{ id: string; parameters: Record<string, AmplifierParameter> }>,
  mapper: (itemId: string, name: string, def: AmplifierParameter, order: number) => AmplifierParameterPayload
): Promise<number> {
  const { error: deleteError } = await supabase.from(table).delete().neq('id', 0)
  if (deleteError) {
    throw new Error(`Failed to clear ${table}: ${deleteError.message}`)
  }

  const paramsPayload: AmplifierParameterPayload[] = []
  
  for (const item of items) {
    let order = 0
    Object.entries(item.parameters).forEach(([name, def]) => {
      paramsPayload.push(mapper(item.id, name, def, order++))
    })
  }
  
  if (paramsPayload.length > 0) {
    await insertBatch(supabase, table, paramsPayload)
  }
  
  return paramsPayload.length
}

async function main(): Promise<void> {
  const url = process.env.SUPABASE_URL?.trim()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables')
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error('Invalid SUPABASE_URL format. Must start with http:// or https://')
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  try {
    // Seed pedals
    const pedalsPayload: PedalPayload[] = pedalLibrary.map((p: PedalModel): PedalPayload => ({
      id: p.id,
      brand: p.brand,
      model: p.model,
      type: p.type,
      description: p.description,
      color: p.color,
      accent_color: p.accentColor,
      style: p.style
    }))
    await upsertBatch<PedalPayload>(supabase, 'pedals', pedalsPayload)
    console.log(`✓ Inserted ${pedalsPayload.length} pedals`)

    // Seed pedal parameters
    const pedalParamsCount = await seedPedalParameters(
      supabase,
      'pedal_parameters',
      pedalLibrary,
      (pedalId: string, name: string, def: PedalParameter, order: number): PedalParameterPayload => ({
        pedal_id: pedalId,
        name,
        label: def.label,
        min: def.min,
        max: def.max,
        default_value: def.default,
        control_type: def.controlType ?? 'knob',
        orientation: def.orientation,
        order_index: order
      })
    )
    console.log(`✓ Inserted ${pedalParamsCount} pedal parameters`)

    // Seed amplifiers
    const ampsPayload: AmplifierPayload[] = amplifierLibrary.map((a: AmplifierModel): AmplifierPayload => ({
      id: a.id,
      brand: a.brand,
      model: a.model,
      type: a.type,
      description: a.description,
      color: a.color,
      style: a.style,
      knob_color: a.knobColor,
      knob_base_color: a.knobBaseColor,
      grille_gradient_a: a.uiStyle.grilleGradient[0] ?? '',
      grille_gradient_b: a.uiStyle.grilleGradient[1] ?? '',
      grille_pattern: a.uiStyle.grillePattern,
      knob_layout: a.uiStyle.knobLayout ?? 'horizontal',
      border_style: a.uiStyle.borderStyle
    }))
    await upsertBatch<AmplifierPayload>(supabase, 'amplifiers', ampsPayload)
    console.log(`✓ Inserted ${ampsPayload.length} amplifiers`)

    // Seed amplifier parameters
    const ampParamsCount = await seedAmplifierParameters(
      supabase,
      'amplifier_parameters',
      amplifierLibrary,
      (ampId: string, name: string, def: AmplifierParameter, order: number): AmplifierParameterPayload => ({
        amplifier_id: ampId,
        name,
        label: name.toUpperCase(),
        min: def.min,
        max: def.max,
        default_value: def.default,
        order_index: order
      })
    )
    console.log(`✓ Inserted ${ampParamsCount} amplifier parameters`)

    console.log('✅ Seed completed successfully')
  } catch (error) {
    console.error('❌ Seed failed:', error instanceof Error ? error.message : String(error))
    throw error
  }
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})

