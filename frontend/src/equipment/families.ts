/**
 * Familles de hardware : archétype de châssis + surface + style de commandes.
 * Un modèle hérite de sa famille ; seuls les overrides le distinguent.
 */
import type { PedalModel } from '../data/pedals'
import type { AmplifierModel } from '../data/amplifiers'
import type {
  AmpArchetype,
  EquipmentSurfaceConfig,
  IndicatorStyle,
  KnobAppearance,
  LedColor,
  PedalArchetype,
} from './types'

export interface PedalFamily {
  chassis: PedalArchetype
  surface: EquipmentSurfaceConfig
  knobStyle: KnobAppearance
  indicator: IndicatorStyle
  ledColor: LedColor
  foot: 'footswitch' | 'stomp-pad'
  knobScale: number
}

interface FamilySpec {
  chassis: PedalArchetype
  surface: EquipmentSurfaceConfig
  knobStyle: KnobAppearance
  indicator?: IndicatorStyle
  ledColor: LedColor
  foot?: 'footswitch' | 'stomp-pad'
  knobScale?: number
}

/** Famille par défaut pour les 27 types du catalogue. */
const BY_TYPE: Record<string, FamilySpec> = {
  overdrive: {
    chassis: 'compact',
    surface: { color: 'mustard-yellow', texture: 'smooth', finish: 'satin', material: 'abs-plastic' },
    knobStyle: 'black-silver',
    ledColor: 'red',
    foot: 'stomp-pad',
  },
  distortion: {
    chassis: 'compact',
    surface: { color: 'anthracite', texture: 'powder-coated', finish: 'powder-coated', material: 'abs-plastic' },
    knobStyle: 'black-silver',
    ledColor: 'red',
    foot: 'stomp-pad',
  },
  fuzz: {
    chassis: 'compact',
    surface: { color: 'cream-ivory', texture: 'smooth', finish: 'satin', material: 'abs-plastic' },
    knobStyle: 'cream',
    ledColor: 'amber',
  },
  chorus: {
    chassis: 'compact',
    surface: { color: 'baby-blue', texture: 'smooth', finish: 'gloss', material: 'abs-plastic' },
    knobStyle: 'classic',
    ledColor: 'blue',
  },
  delay: {
    chassis: 'compact',
    surface: { color: 'gunmetal', texture: 'matte', finish: 'matte', material: 'abs-plastic' },
    knobStyle: 'classic',
    ledColor: 'blue',
  },
  reverb: {
    chassis: 'compact',
    surface: { color: 'silver', texture: 'brushed-metal', finish: 'brushed', material: 'aluminum' },
    knobStyle: 'metal',
    ledColor: 'blue',
  },
  flanger: {
    chassis: 'compact',
    surface: { color: 'anthracite', texture: 'glossy', finish: 'gloss', material: 'abs-plastic' },
    knobStyle: 'classic',
    ledColor: 'green',
  },
  tremolo: {
    chassis: 'compact',
    surface: { color: 'cream-ivory', texture: 'smooth', finish: 'satin', material: 'abs-plastic' },
    knobStyle: 'classic',
    ledColor: 'amber',
  },
  phaser: {
    chassis: 'compact',
    surface: { color: 'black', texture: 'matte', finish: 'satin', material: 'abs-plastic', pipingColor: '#f0b4a2' },
    knobStyle: 'classic',
    ledColor: 'white',
  },
  eq: {
    chassis: 'eq',
    surface: { color: 'silver', texture: 'brushed-metal', finish: 'brushed', material: 'aluminum' },
    knobStyle: 'metal',
    ledColor: 'blue',
  },
  wah: {
    chassis: 'treadle',
    surface: { color: 'black', texture: 'tolex', finish: 'matte', material: 'tolex' },
    knobStyle: 'classic',
    ledColor: 'red',
  },
  boost: {
    chassis: 'compact',
    surface: { color: 'cream-ivory', texture: 'smooth', finish: 'gloss', material: 'abs-plastic' },
    knobStyle: 'cream',
    ledColor: 'amber',
  },
  compressor: {
    chassis: 'compact',
    surface: { color: 'silver', texture: 'brushed-metal', finish: 'brushed', material: 'aluminum' },
    knobStyle: 'chrome',
    ledColor: 'red',
  },
  octaver: {
    chassis: 'compact',
    surface: { color: 'purple', texture: 'matte', finish: 'matte', material: 'abs-plastic' },
    knobStyle: 'classic',
    ledColor: 'green',
  },
  pitch: {
    chassis: 'compact',
    surface: { color: 'electric-blue', texture: 'smooth', finish: 'gloss', material: 'abs-plastic' },
    knobStyle: 'classic',
    ledColor: 'blue',
  },
  rotary: {
    chassis: 'compact',
    surface: { color: 'vintage-brown', texture: 'wood-grain', finish: 'satin', material: 'natural-wood' },
    knobStyle: 'cream',
    ledColor: 'amber',
  },
  volume: {
    chassis: 'expression',
    surface: { color: 'silver', texture: 'brushed-metal', finish: 'brushed', material: 'aluminum' },
    knobStyle: 'metal',
    ledColor: 'green',
  },
  noisegate: {
    chassis: 'compact',
    surface: { color: 'anthracite', texture: 'powder-coated', finish: 'powder-coated', material: 'abs-plastic' },
    knobStyle: 'classic',
    ledColor: 'green',
  },
  multifx: {
    chassis: 'looper',
    surface: { color: 'black', texture: 'matte', finish: 'satin', material: 'abs-plastic' },
    knobStyle: 'classic',
    ledColor: 'blue',
  },
  vibe: {
    chassis: 'compact',
    surface: { color: 'turquoise', texture: 'smooth', finish: 'gloss', material: 'abs-plastic' },
    knobStyle: 'classic',
    ledColor: 'amber',
  },
  ringmod: {
    chassis: 'compact',
    surface: { color: 'gunmetal', texture: 'brushed-metal', finish: 'brushed', material: 'steel' },
    knobStyle: 'metal',
    ledColor: 'green',
  },
  bitcrusher: {
    chassis: 'compact',
    surface: { color: 'neon-green', texture: 'matte', finish: 'matte', material: 'abs-plastic' },
    knobStyle: 'black-silver',
    ledColor: 'green',
  },
  lofi: {
    chassis: 'compact',
    surface: { color: 'vintage-brown', texture: 'smooth', finish: 'aged', material: 'abs-plastic' },
    knobStyle: 'cream',
    ledColor: 'amber',
  },
  tapedelay: {
    chassis: 'compact',
    surface: { color: 'vintage-brown', texture: 'tolex', finish: 'satin', material: 'tolex' },
    knobStyle: 'cream',
    ledColor: 'amber',
  },
  springreverb: {
    chassis: 'compact',
    surface: { color: 'turquoise', texture: 'smooth', finish: 'gloss', material: 'abs-plastic' },
    knobStyle: 'chrome',
    ledColor: 'blue',
  },
  shimmerreverb: {
    chassis: 'compact',
    surface: { color: 'electric-blue', texture: 'matte', finish: 'satin', material: 'abs-plastic' },
    knobStyle: 'classic',
    ledColor: 'white',
  },
  tuner: {
    chassis: 'tuner',
    surface: { color: 'white', texture: 'smooth', finish: 'gloss', material: 'abs-plastic' },
    knobStyle: 'mini',
    ledColor: 'red',
  },
}

/** Wahs sans pédale d'expression (filtre à molette). */
const ENVELOPE_WAHS = new Set(['ehx-q-tron', 'mutron-iii', 'boss-aw3', 'digitech-synth-wah'])

/** Résout l'archétype + le hardware d'une pédale. */
export function resolvePedalFamily(model: PedalModel): PedalFamily {
  const base: FamilySpec =
    BY_TYPE[model.type] ?? {
      chassis: 'compact',
      surface: { color: 'anthracite', finish: 'matte' },
      knobStyle: 'classic',
      ledColor: 'red',
    }

  const params = Object.values(model.parameters)
  const knobs = params.filter((p) => !p.controlType || p.controlType === 'knob').length
  const selectors = params.filter((p) => p.controlType === 'switch-selector').length
  const horizontalSliders = params.filter(
    (p) => p.controlType === 'slider' && p.orientation === 'horizontal'
  ).length
  const verticalSliders = params.filter(
    (p) => p.controlType === 'slider' && p.orientation !== 'horizontal'
  ).length

  let chassis: PedalArchetype = base.chassis
  if (model.type === 'eq') chassis = 'eq'
  else if (horizontalSliders > 0 && verticalSliders === 0) chassis = 'sliders'
  else if (model.type === 'wah' && ENVELOPE_WAHS.has(model.id)) chassis = 'compact'
  else if (model.type === 'multifx') chassis = 'looper'
  else if (model.type === 'tuner') chassis = 'tuner'
  else if (model.type !== 'wah' && model.type !== 'volume') {
    if (knobs + selectors <= 2 && horizontalSliders === 0) chassis = 'mini'
    else if (knobs + selectors >= 5) chassis = 'compact-wide'
    else chassis = 'compact'
  }

  // Une pédale à faders horizontaux garde ses faders, quelle que soit sa famille.
  if (horizontalSliders > 0) chassis = model.type === 'eq' ? 'eq' : 'sliders'

  return {
    chassis,
    surface: base.surface,
    knobStyle: base.knobStyle,
    indicator: base.indicator ?? 'line',
    ledColor: base.ledColor,
    foot: base.foot ?? (chassis === 'treadle' || chassis === 'expression' ? 'footswitch' : 'footswitch'),
    knobScale: base.knobScale ?? 1,
  }
}

/* ============================= Amplis ============================= */

export interface AmpFamily {
  chassis: AmpArchetype
  surface: EquipmentSurfaceConfig
  knobStyle: KnobAppearance
  indicator: IndicatorStyle
  ledColor: LedColor
}

/** Résout l'archétype d'ampli (façade, grille, finition). */
export function resolveAmpFamily(amp: AmplifierModel): AmpFamily {
  const brand = amp.brand
  const paramCount = Object.keys(amp.parameters).length
  const isDigital = brand === 'Fractal' || brand === 'Neural DSP'
  const isCombo = amp.type === 'combo'

  if (isDigital) {
    return {
      chassis: 'rack',
      surface: {
        color: 'anthracite',
        texture: 'brushed-metal',
        finish: 'brushed',
        material: 'aluminum',
        mesh: 'perforated-metal',
        grilleColor: '#1e293b',
        faceplateColor: 'anthracite',
      },
      knobStyle: 'metal',
      indicator: 'dot',
      ledColor: 'blue',
    }
  }

  if (brand === 'Marshall') {
    return {
      chassis: 'head-gold',
      surface: {
        color: 'black',
        texture: 'tolex',
        finish: 'matte',
        material: 'tolex',
        mesh: 'woven-fabric',
        grilleColor: '#0f0f10',
        faceplateColor: 'gold',
        pipingColor: '#f8fafc',
      },
      knobStyle: 'gold',
      indicator: 'black-pointer',
      ledColor: 'red',
    }
  }

  if (brand === 'Orange') {
    if (paramCount <= 4) {
      return {
        chassis: 'lunchbox',
        surface: {
          color: 'vintage-orange',
          texture: 'smooth',
          finish: 'satin',
          material: 'steel',
          mesh: 'woven-fabric',
          grilleColor: '#111114',
          faceplateColor: 'cream-ivory',
        },
        knobStyle: 'classic',
        indicator: 'dot',
        ledColor: 'amber',
      }
    }
    return {
      chassis: 'head-citrus',
      surface: {
        color: 'vintage-orange',
        texture: 'smooth',
        finish: 'satin',
        material: 'steel',
        mesh: 'woven-fabric',
        grilleColor: '#1f2024',
        faceplateColor: 'white',
        pipingColor: '#f8fafc',
      },
      knobStyle: 'classic',
      indicator: 'dot',
      ledColor: 'amber',
    }
  }

  if (['Peavey', 'Engl', 'Soldano', 'Randall', 'Carvin', 'Hartley Thompson'].includes(brand)) {
    return {
      chassis: 'head-silver',
      surface: {
        color: 'black',
        texture: 'tolex',
        finish: 'matte',
        material: 'tolex',
        mesh: 'honeycomb-mesh',
        grilleColor: '#3f3f46',
        faceplateColor: 'silver',
        pipingColor: '#e2e8f0',
      },
      knobStyle: 'chicken-head',
      indicator: 'pointer',
      ledColor: 'green',
    }
  }

  if (brand === 'Mesa Boogie') {
    return {
      chassis: 'head-black',
      surface: {
        color: 'black',
        texture: 'tolex',
        finish: 'matte',
        material: 'tolex',
        mesh: 'diamond-mesh',
        grilleColor: '#27272a',
        faceplateColor: 'chrome',
      },
      knobStyle: 'chrome',
      indicator: 'line',
      ledColor: 'red',
    }
  }

  if (isCombo) {
    const twin = ['fender-65-twin', 'vox-ac30', 'vox-ac30-alt', 'roland-jc120', 'mesa-lonestar'].includes(amp.id)
    return {
      chassis: twin ? 'combo-twin' : 'combo',
      surface: {
        color: brand === 'Vox' ? 'black' : brand === 'Fender' || brand === 'Supro' ? 'black' : 'black',
        texture: brand === 'Fender' || brand === 'Vox' ? 'tolex' : 'tolex',
        finish: 'matte',
        material: 'tolex',
        mesh: 'vintage-grill-cloth',
        grilleColor: brand === 'Fender' ? '#d8cdb4' : brand === 'Vox' ? '#1f2024' : '#3f3f46',
        faceplateColor: brand === 'Vox' ? 'cream-ivory' : 'silver',
        pipingColor: '#f8fafc',
      },
      knobStyle: brand === 'Vox' ? 'cream' : 'chrome',
      indicator: 'dot',
      ledColor: 'red',
    }
  }

  return {
    chassis: 'head-black',
    surface: {
      color: 'black',
      texture: 'tolex',
      finish: 'matte',
      material: 'tolex',
      mesh: 'speaker-cloth',
      grilleColor: '#3f3f46',
      faceplateColor: 'silver',
    },
    knobStyle: 'classic',
    indicator: 'line',
    ledColor: 'red',
  }
}
