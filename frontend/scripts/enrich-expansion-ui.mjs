/**
 * Enrichit pedals-expansion.ts : ui.skin par type + switch Mode sur familles clés.
 * Ne touche pas aux 89 historiques ni à WebAmp Ultra.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/pedals-expansion.ts')
let src = fs.readFileSync(file, 'utf8')

if (!src.includes("import { Waves")) {
  src = src.replace(
    "import { PEDAL_ACCENT_COLORS } from './pedalAccentColors'",
    "import { PEDAL_ACCENT_COLORS } from './pedalAccentColors'\nimport { Waves, Circle, Square, Zap } from 'lucide-react'"
  )
}

/** @type {Record<string, string>} */
const skinByType = {
  delay: 'flat',
  tapedelay: 'flat',
  reverb: 'flat',
  shimmerreverb: 'flat',
  springreverb: 'flat',
  compressor: 'flat',
  noisegate: 'flat',
  chorus: 'flat',
  flanger: 'flat',
  phaser: 'flat',
  tremolo: 'flat',
  multifx: 'flat',
  eq: 'eq',
  wah: 'flat',
  overdrive: 'flat',
  distortion: 'flat',
  fuzz: 'flat',
  pitch: 'flat',
  octaver: 'flat',
  bitcrusher: 'flat',
  lofi: 'flat',
  ringmod: 'flat',
  vibe: 'flat',
  boost: 'flat',
  volume: 'flat',
  tuner: 'flat',
  rotary: 'flat',
}

const modeBlock = `,
      mode: {
        min: 0,
        max: 2,
        default: 0,
        label: 'Mode',
        controlType: 'switch-selector',
        labels: ['A', 'B', 'C'],
        icons: [Circle, Square, Zap]
      }`

// Inject ui after each style: '...' line inside expansion objects that lack ui
src = src.replace(
  /(type: '([^']+)',[\s\S]*?style: '(vintage|modern|boutique)')(\n\s*\})/g,
  (full, before, type, style, close) => {
    if (full.includes('ui:')) return full
    const skin = skinByType[type] || 'flat'
    let mid = before
    // Add mode switch for time/mod/dynamics if not present
    const wantsMode = ['delay', 'tapedelay', 'reverb', 'shimmerreverb', 'compressor', 'chorus', 'flanger', 'phaser', 'tremolo', 'multifx', 'pitch', 'octaver'].includes(type)
    if (wantsMode && !mid.includes("label: 'Mode'") && !mid.includes('controlType: \'switch-selector\'')) {
      mid = mid.replace(/(\n\s*parameters: \{[\s\S]*?)(\n\s*\},)/, `$1${modeBlock}$2`)
    }
    return `${mid},\n    ui: { skin: '${skin}' }${close}`
  }
)

fs.writeFileSync(file, src, 'utf8')
console.log('Enriched pedals-expansion.ts with ui + mode switches')
