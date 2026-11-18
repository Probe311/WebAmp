/**
 * Génère src/data/pedal-ui-fidelity.ts — ui: pour classics documentés.
 * Heuristiques famille + overrides explicites (TS9, etc.).
 */
import fs from 'fs'

const meta = JSON.parse(fs.readFileSync('scripts/pedal-meta.json', 'utf8'))

/** Overrides manuels (fidélité hardware) */
const OVERRIDES = {
  'ibanez-tube-screamer': {
    skin: 'flat',
    layout: 'triangle',
    footShape: 'rect',
    engageStyle: 'led',
    ledSide: 'right',
    knobSizes: { drive: 'M', level: 'M', tone: 'S' },
  },
  'ibanez-tube-screamer-mini': {
    skin: 'flat',
    layout: 'triangle',
    footShape: 'rect',
    engageStyle: 'led',
    ledSide: 'right',
    knobSizes: { drive: 'M', level: 'M', tone: 'S' },
  },
  'ibanez-jemini': {
    skin: 'flat',
    layout: 'triangle',
    footShape: 'rect',
    engageStyle: 'led',
    ledSide: 'right',
    knobScale: 1,
  },
  'proco-rat': {
    skin: 'flat',
    layout: 'triangle',
    footShape: 'round',
    engageStyle: 'led',
    ledSide: 'right',
    knobScale: 1,
  },
  'boss-ds1': {
    skin: 'flat',
    layout: 'triangle',
    footShape: 'round',
    engageStyle: 'led',
    ledSide: 'left',
    knobScale: 1,
  },
  'boss-sd1': {
    skin: 'flat',
    layout: 'triangle',
    footShape: 'round',
    engageStyle: 'led',
    ledSide: 'left',
    knobScale: 1,
  },
  'electro-harmonix-big-muff': {
    skin: 'flat',
    layout: 'triangle',
    footShape: 'square',
    engageStyle: 'led',
    ledSide: 'right',
    knobScale: 1,
  },
  'electro-harmonix-muff': {
    skin: 'flat',
    layout: 'triangle',
    footShape: 'square',
    engageStyle: 'led',
    ledSide: 'right',
    knobScale: 1,
  },
  'mxr-phase90': {
    skin: 'flat',
    layout: 'stack',
    footShape: 'square',
    engageStyle: 'led',
    ledSide: 'left',
    knobScale: 1,
  },
  'fulltone-ocd': {
    skin: 'flat',
    layout: 'triangle',
    footShape: 'rect',
    engageStyle: 'led',
    ledSide: 'left',
    knobScale: 1,
  },
  'klon-centaur': {
    skin: 'flat',
    layout: 'triangle',
    footShape: 'round',
    engageStyle: 'led',
    ledSide: 'left',
    knobScale: 1,
  },
}

const BRAND_FOOT = {
  BOSS: 'round',
  Ibanez: 'rect',
  Mooer: 'square',
  Dunlop: 'round',
  MXR: 'square',
  'Electro-Harmonix': 'square',
  Fulltone: 'rect',
  'Pro Co': 'round',
  'Walrus Audio': 'square',
  Strymon: 'square',
  Eventide: 'square',
  'TC Electronic': 'rect',
  DigiTech: 'rect',
  Vox: 'rect',
  Morley: 'rect',
  Klon: 'round',
  JHS: 'square',
  'Red Panda': 'rect',
  Neunaber: 'round',
  ZVEX: 'rect',
  'Z.Vex': 'rect',
  Moog: 'square',
  Roland: 'square',
  Marshall: 'round',
  Leslie: 'round',
  Empress: 'round',
  'Source Audio': 'square',
  Custom: 'round',
  Colorsound: 'round',
  Rangemaster: 'round',
  'Roger Mayer': 'round',
  Maestro: 'square',
  Binson: 'square',
  'Shin-ei': 'round',
  SurfyBear: 'rect',
  Mesa: 'square',
  ISP: 'round',
}

const BRAND_ENGAGE = {
  Strymon: 'glow',
  Eventide: 'glow',
  Neunaber: 'glow',
  'TC Electronic': 'glow',
}

function infer(p) {
  if (OVERRIDES[p.id]) return OVERRIDES[p.id]

  const footShape = BRAND_FOOT[p.brand] || 'round'
  const engageStyle = BRAND_ENGAGE[p.brand] || 'led'
  const ledSide = ['BOSS', 'MXR', 'Walrus Audio', 'Fulltone', 'Klon'].includes(p.brand)
    ? 'left'
    : 'right'

  if (p.type === 'wah') {
    return { skin: 'wah', footShape, engageStyle, ledSide, knobScale: 0.5 }
  }
  if (p.type === 'eq' || p.hasSlider) {
    return {
      skin: p.type === 'eq' ? 'eq' : 'flat',
      layout: 'sliders',
      footShape,
      engageStyle,
      ledSide,
      knobScale: 0.5,
      sliderThumb: p.brand === 'Walrus Audio' ? 'rect' : 'round',
    }
  }

  let layout = 'auto'
  let knobScale = 1
  if (p.knobCount === 1) {
    layout = 'single'
    knobScale = 1
  } else if (p.knobCount === 2) {
    layout = 'stack'
  } else if (p.knobCount === 3) {
    layout = 'triangle'
  } else if (p.knobCount === 4) {
    layout = 'grid2'
    knobScale = 0.5
  } else if (p.knobCount >= 5) {
    layout = 'grid2'
    knobScale = 0.5
  }

  return {
    skin: 'flat',
    layout,
    footShape,
    engageStyle,
    ledSide,
    knobScale,
  }
}

function ser(obj, indent = 2) {
  const pad = ' '.repeat(indent)
  const lines = Object.entries(obj).map(([k, v]) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const inner = Object.entries(v)
        .map(([kk, vv]) => `${kk}: '${vv}'`)
        .join(', ')
      return `${pad}${k}: { ${inner} }`
    }
    if (typeof v === 'string') return `${pad}${k}: '${v}'`
    return `${pad}${k}: ${v}`
  })
  return `{\n${lines.join(',\n')},\n${' '.repeat(indent - 2)}}`
}

const entries = meta.map((p) => {
  const ui = infer(p)
  return `  '${p.id}': ${ser(ui, 4)}`
})

const out = `import type { PedalUiConfig } from './pedals'

/**
 * Fidélité hardware — classics documentés.
 * Fusionné dans pedalLibrary (ui existant gagne si déjà set).
 * Généré / maintenu : heuristics + OVERRIDES (TS9, RAT, Muff…).
 */
export const pedalUiFidelity: Record<string, PedalUiConfig> = {
${entries.join(',\n')},
}
`

fs.writeFileSync('src/data/pedal-ui-fidelity.ts', out)
console.log(`Wrote ${meta.length} ui configs`)
