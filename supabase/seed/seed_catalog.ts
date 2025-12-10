/**
 * Seed catalogue pedals/amplifiers into Supabase.
 * Usage (dev): 
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... ts-node supabase/seed/seed_catalog.ts
 *
 * Data source: frontend/src/data/pedals.ts & amplifiers.ts
 */
import { createClient } from '@supabase/supabase-js'
import { pedalLibrary } from '../../frontend/src/data/pedals'
import { amplifierLibrary } from '../../frontend/src/data/amplifiers'

async function main() {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Upsert pedals (remove duplicates first)
  const pedalsMap = new Map<string, any>()
  pedalLibrary.forEach(p => {
    pedalsMap.set(p.id, {
      id: p.id,
      brand: p.brand,
      model: p.model,
      type: p.type,
      description: p.description,
      color: p.color,
      accent_color: p.accentColor,
      style: p.style
    })
  })
  const pedalsPayload = Array.from(pedalsMap.values())

  // Insert in batches to avoid conflicts
  const batchSize = 100
  for (let i = 0; i < pedalsPayload.length; i += batchSize) {
    const batch = pedalsPayload.slice(i, i + batchSize)
    const { error: pedalErr } = await supabase.from('pedals').upsert(batch, { onConflict: 'id' })
    if (pedalErr) throw pedalErr
  }
  console.log(`✓ Inserted ${pedalsPayload.length} pedals`)

  // Clear and insert pedal parameters
  await supabase.from('pedal_parameters').delete().neq('id', 0)
  const pedalParamsPayload: any[] = []
  for (const p of pedalLibrary) {
    let order = 0
    Object.entries(p.parameters).forEach(([name, def]) => {
      pedalParamsPayload.push({
        pedal_id: p.id,
        name,
        label: def.label,
        min: def.min,
        max: def.max,
        default_value: def.default,
        control_type: def.controlType ?? 'knob',
        orientation: def.orientation,
        order_index: order++
      })
    })
  }
  if (pedalParamsPayload.length) {
    // Insert in batches
    for (let i = 0; i < pedalParamsPayload.length; i += batchSize) {
      const batch = pedalParamsPayload.slice(i, i + batchSize)
      const { error: pedalParamErr } = await supabase.from('pedal_parameters').insert(batch)
      if (pedalParamErr) throw pedalParamErr
    }
    console.log(`✓ Inserted ${pedalParamsPayload.length} pedal parameters`)
  }

  // Upsert amplifiers (remove duplicates first)
  const ampsMap = new Map<string, any>()
  amplifierLibrary.forEach(a => {
    ampsMap.set(a.id, {
      id: a.id,
      brand: a.brand,
      model: a.model,
      type: a.type,
      description: a.description,
      color: a.color,
      style: a.style,
      knob_color: a.knobColor,
      knob_base_color: a.knobBaseColor,
      grille_gradient_a: a.uiStyle.grilleGradient[0],
      grille_gradient_b: a.uiStyle.grilleGradient[1],
      grille_pattern: a.uiStyle.grillePattern,
      knob_layout: a.uiStyle.knobLayout ?? 'horizontal',
      border_style: a.uiStyle.borderStyle
    })
  })
  const ampsPayload = Array.from(ampsMap.values())

  // Insert in batches to avoid conflicts
  for (let i = 0; i < ampsPayload.length; i += batchSize) {
    const batch = ampsPayload.slice(i, i + batchSize)
    const { error: ampErr } = await supabase.from('amplifiers').upsert(batch, { onConflict: 'id' })
    if (ampErr) throw ampErr
  }
  console.log(`✓ Inserted ${ampsPayload.length} amplifiers`)

  // Clear and insert amplifier parameters
  await supabase.from('amplifier_parameters').delete().neq('id', 0)
  const ampParamsPayload: any[] = []
  for (const a of amplifierLibrary) {
    let order = 0
    Object.entries(a.parameters).forEach(([name, def]) => {
      ampParamsPayload.push({
        amplifier_id: a.id,
        name,
        label: name.toUpperCase(),
        min: def.min,
        max: def.max,
        default_value: def.default,
        order_index: order++
      })
    })
  }
  if (ampParamsPayload.length) {
    // Insert in batches
    for (let i = 0; i < ampParamsPayload.length; i += batchSize) {
      const batch = ampParamsPayload.slice(i, i + batchSize)
      const { error: ampParamErr } = await supabase.from('amplifier_parameters').insert(batch)
      if (ampParamErr) throw ampParamErr
    }
    console.log(`✓ Inserted ${ampParamsPayload.length} amplifier parameters`)
  }

  console.log('✅ Seed completed successfully')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

