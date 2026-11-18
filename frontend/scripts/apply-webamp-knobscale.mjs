import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const p = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/pedals-webamp-ultra.ts')
let s = fs.readFileSync(p, 'utf8')

const scales = {
  'webamp-od300': 1,
  'webamp-to800': 1,
  'webamp-um300': 0.5,
  'webamp-hm300': 0.5,
  'webamp-hd300': 0.5,
  'webamp-sf300': 0.5,
  'webamp-bod400': 0.5,
  'webamp-beq700': 0.5,
  'webamp-cs400': 0.5,
  'webamp-nr300': 1,
  'webamp-uc200': 0.5,
  'webamp-uv300': 0.5,
  'webamp-ut300': 1,
  'webamp-cl9': 1,
  'webamp-vp1': 1,
  'webamp-fx600': 0.5,
  'webamp-vd400': 1,
  'webamp-dr600': 0.5,
  'webamp-tm300': 1,
  'webamp-uo300': 0.5,
  'webamp-eq700': 0.5,
  'webamp-tu300': 1,
}

const essais = {
  'webamp-wahcko': "{ skin: 'wah', knobScale: 0.5 }",
}

const parts = s.split(/\n  \{\n    id: /)
const out = [parts[0]]
for (let i = 1; i < parts.length; i++) {
  let b = parts[i]
  const id = (b.match(/^'([^']+)'/) || [])[1]
  if (id && essais[id]) {
    b = b.replace(/ui: \{[^}]*\}/, `ui: ${essais[id]}`)
  } else if (id && scales[id] != null) {
    b = b.replace(/ui: \{([^}]*)\}/, (m, inner) => {
      if (inner.includes('knobScale')) return m
      const clean = inner.trim().replace(/,\s*$/, '')
      return `ui: { ${clean}, knobScale: ${scales[id]} }`
    })
  }
  out.push(b)
}
fs.writeFileSync(p, out.join('\n  {\n    id: '))
console.log('done')
