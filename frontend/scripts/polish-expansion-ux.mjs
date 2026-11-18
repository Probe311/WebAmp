/**
 * Repasse UX expansion boutique :
 * - retire Mode A/B/C générique
 * - compressors → sliders verticaux + layout sliders
 * - boost 1 knob → single
 * - noisegate 2–3 → triangle/stack
 * - delay/reverb/chorus → triangle + layout
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const p = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/pedals-expansion.ts')
let s = fs.readFileSync(p, 'utf8')

// Strip generic Mode A/B/C blocks
s = s.replace(
  /,?\s*mode: \{\s*min: 0,\s*max: 2,\s*default: 0,\s*label: 'Mode',\s*controlType: 'switch-selector',\s*labels: \['A', 'B', 'C'\],\s*icons: \[Circle, Square, Zap\]\s*\}/g,
  ''
)

/** Convert knob-like param lines to sliders for compressor blocks — simpler: per-param label replace inside compressor objects */

function addSlider(labelLine) {
  // e.g. sustain: { min: 0, max: 100, default: 50, label: 'Sustain' },
  return labelLine.replace(
    /(\w+): \{ min: 0, max: 100, default: \d+, label: '[^']+' \}/,
    (m) => (m.includes('controlType') ? m : m.replace(/ \}$/, ", controlType: 'slider', orientation: 'vertical' }"))
  )
}

// Process object by object via regex on type compressor
s = s.replace(
  /(\{[^{}]*?type: 'compressor',[\s\S]*?parameters: \{)([\s\S]*?)(\n\s*\},)/g,
  (_, head, body, tail) => {
    let b = body
      .split('\n')
      .map((line) => {
        if (/^\s+\w+: \{ min:/.test(line) && !line.includes('controlType') && !line.includes('mode:')) {
          return line.replace(/ \},?\s*$/, (end) => {
            const comma = end.includes(',') ? ',' : ''
            return `, controlType: 'slider', orientation: 'vertical' }${comma}`
          })
        }
        return line
      })
      .join('\n')
    return head + b + tail
  }
)

// ui layout by type
const layoutByType = {
  compressor: 'sliders',
  boost: 'single',
  noisegate: 'triangle',
  volume: 'single',
  delay: 'triangle',
  tapedelay: 'triangle',
  reverb: 'triangle',
  shimmerreverb: 'triangle',
  chorus: 'triangle',
  flanger: 'grid2',
  phaser: 'stack',
  tremolo: 'triangle',
  overdrive: 'triangle',
  distortion: 'triangle',
  fuzz: 'triangle',
  pitch: 'triangle',
  octaver: 'triangle',
  multifx: 'row',
  eq: 'sliders',
  wah: 'stack',
  bitcrusher: 'triangle',
  lofi: 'triangle',
  ringmod: 'triangle',
  vibe: 'triangle',
  rotary: 'triangle',
  tuner: 'single',
  springreverb: 'triangle',
}

s = s.replace(
  /(type: '([^']+)',[\s\S]*?ui: \{ skin: ')([^']+)(')(\s*\})/g,
  (full, pre, type, skin, q, close) => {
    const layout = layoutByType[type] || 'auto'
    if (full.includes('layout:')) return full
    return `${pre}${skin}', layout: '${layout}'${close}`
  }
)

// Special: 1-param boosts already single; 2-param noisegate → stack
s = s.replace(
  /(id: 'boss-ns2'[\s\S]*?ui: \{ skin: 'flat', layout: ')triangle(')/,
  "$1stack$2"
)
s = s.replace(
  /(id: 'tc-ditto'[\s\S]*?ui: \{ skin: 'flat', layout: ')[^']+(')/,
  "$1single$2"
)
s = s.replace(
  /(id: 'xotic-ep-booster'[\s\S]*?ui: \{ skin: 'flat', layout: ')[^']+(')/,
  "$1single$2"
)
s = s.replace(
  /(id: 'mxr-micro-amp'[\s\S]*?ui: \{ skin: 'flat', layout: ')[^']+(')/,
  "$1single$2"
)
s = s.replace(
  /(id: 'ehx-lpb1'[\s\S]*?ui: \{ skin: 'flat', layout: ')[^']+(')/,
  "$1single$2"
)

// Remove unused Waves if still imported — keep Circle Square Zap for remaining real modes
if (!s.includes('[Circle, Square, Zap]')) {
  s = s.replace(/import \{ Waves, Circle, Square, Zap \} from 'lucide-react'\r?\n/, '')
} else if (!s.includes('Waves')) {
  s = s.replace(/import \{ Waves, Circle, Square, Zap \}/, "import { Circle, Square, Zap }")
}

fs.writeFileSync(p, s)
console.log('expansion polished')
