import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const p = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/pedals-webamp-ultra.ts')
let s = fs.readFileSync(p, 'utf8')

const map = {
  'webamp-od300': 'triangle',
  'webamp-to800': 'triangle',
  'webamp-um300': 'grid2',
  'webamp-hm300': 'grid2',
  'webamp-hd300': 'grid2',
  'webamp-sf300': 'grid2',
  'webamp-bod400': 'grid2',
  'webamp-beq700': 'sliders',
  'webamp-cs400': 'triangle',
  'webamp-nr300': 'stack',
  'webamp-uc200': 'grid2',
  'webamp-uv300': 'triangle',
  'webamp-ut300': 'triangle',
  'webamp-cl9': 'triangle',
  'webamp-vp1': 'stack',
  'webamp-fx600': 'row',
  'webamp-vd400': 'triangle',
  'webamp-dr600': 'triangle',
  'webamp-tm300': 'triangle',
  'webamp-uo300': 'grid2',
  'webamp-eq700': 'sliders',
  'webamp-tu300': 'single',
}

for (const [id, layout] of Object.entries(map)) {
  const re = new RegExp(`(id: '${id}'[\\s\\S]*?\\n\\s*ui: )ultra([,\\n])`, 'm')
  if (re.test(s)) {
    s = s.replace(re, `$1{ skin: 'ultra', layout: '${layout}' }$2`)
  }
}

s = s.replace(/ui: ultra,/g, "ui: { skin: 'ultra', layout: 'triangle' },")
s = s.replace(/const ultra = \{ skin: 'ultra' as const \}\r?\n/, '')

fs.writeFileSync(p, s)
console.log('ok', (s.match(/layout: '/g) || []).length)
