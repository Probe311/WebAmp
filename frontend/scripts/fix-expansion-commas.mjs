import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const p = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/data/pedals-expansion.ts')
let s = fs.readFileSync(p, 'utf8')
s = s.replace(/style: '(vintage|modern|boutique)'\r?\n    ui:/g, "style: '$1',\n    ui:")
fs.writeFileSync(p, s)
console.log('fixed', (s.match(/ui: \{ skin/g) || []).length)
