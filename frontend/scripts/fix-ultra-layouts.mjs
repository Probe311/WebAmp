import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const p = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/pedals-webamp-ultra.ts')
let s = fs.readFileSync(p, 'utf8')

const map = {
  'webamp-od300': "ui: { skin: 'ultra', layout: 'triangle' }",
  'webamp-to800': "ui: { skin: 'ultra', layout: 'triangle' }",
  'webamp-um300': "ui: { skin: 'ultra', layout: 'grid2' }",
  'webamp-hm300': "ui: { skin: 'ultra', layout: 'grid2' }",
  'webamp-hd300': "ui: { skin: 'ultra', layout: 'grid2' }",
  'webamp-sf300': "ui: { skin: 'ultra', layout: 'grid2' }",
  'webamp-bod400': "ui: { skin: 'ultra', layout: 'grid2' }",
  'webamp-beq700': "ui: { skin: 'eq', layout: 'sliders' }",
  'webamp-cs400': "ui: { skin: 'ultra', layout: 'sliders' }",
  'webamp-nr300': "ui: { skin: 'ultra', layout: 'stack' }",
  'webamp-uc200': "ui: { skin: 'ultra', layout: 'grid2' }",
  'webamp-uv300': "ui: { skin: 'ultra', layout: 'triangle' }",
  'webamp-ut300': "ui: { skin: 'ultra', layout: 'triangle' }",
  'webamp-cl9': "ui: { skin: 'ultra', layout: 'triangle' }",
  'webamp-vp1': "ui: { skin: 'ultra', layout: 'stack' }",
  'webamp-fx600': "ui: { skin: 'ultra', layout: 'row' }",
  'webamp-vd400': "ui: { skin: 'ultra', layout: 'triangle' }",
  'webamp-dr600': "ui: { skin: 'ultra', layout: 'triangle' }",
  'webamp-tm300': "ui: { skin: 'ultra', layout: 'triangle' }",
  'webamp-uo300': "ui: { skin: 'ultra', layout: 'grid2' }",
  'webamp-eq700': "ui: { skin: 'eq', layout: 'sliders' }",
  'webamp-tu300': "ui: { skin: 'ultra', layout: 'single' }",
}

// CS-400 → vertical sliders (compressor identity)
s = s.replace(
  /id: 'webamp-cs400',([\s\S]*?)parameters: \{([\s\S]*?)\n    \},/,
  (full, mid, body) => {
    const next = body
      .replace(
        /sustain: \{ min: 0, max: 100, default: 50, label: 'Sustain' \}/,
        "sustain: { min: 0, max: 100, default: 50, label: 'Sustain', controlType: 'slider', orientation: 'vertical' }"
      )
      .replace(
        /attack: \{ min: 0, max: 100, default: 40, label: 'Attack' \}/,
        "attack: { min: 0, max: 100, default: 40, label: 'Attack', controlType: 'slider', orientation: 'vertical' }"
      )
      .replace(
        /level: \{ min: 0, max: 100, default: 50, label: 'Level' \}/,
        "level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }"
      )
    return `id: 'webamp-cs400',${mid}parameters: {${next}\n    },`
  }
)

// Split on pedal objects starting with "  {\n    id:"
const parts = s.split(/\n  \{\n    id: /)
const head = parts[0]
const rebuilt = [head]

for (let i = 1; i < parts.length; i++) {
  let block = parts[i]
  const idMatch = block.match(/^'([^']+)'/)
  const id = idMatch?.[1]
  if (id && map[id]) {
    block = block.replace(/ui: \{[^}]+\}/, map[id])
  }
  rebuilt.push(block)
}

s = rebuilt.join('\n  {\n    id: ')
fs.writeFileSync(p, s)
console.log('fixed', Object.keys(map).length)
