import fs from 'fs'
const src = fs.readFileSync('src/data/pedals.ts', 'utf8')
const blocks = src.split(/(?=\n  \{\n    id:)/)
const info = []
for (const b of blocks) {
  const id = (b.match(/id:\s*'([^']+)'/) || [])[1]
  if (!id) continue
  const brand = (b.match(/brand:\s*'([^']+)'/) || [])[1]
  const type = (b.match(/type:\s*'([^']+)'/) || [])[1]
  const params = [...b.matchAll(/^\s{6}(\w+):\s*\{/gm)].map((m) => m[1])
  const hasSlider = /controlType:\s*'slider'/.test(b)
  const hasSwitch = /controlType:\s*'switch-selector'/.test(b)
  const knobCount = params.filter((p) => {
    const chunk = b.match(new RegExp(`${p}:\\s*\\{[^]*?(?=\\n\\s{4,6}\\w+:|\\n\\s{4}\\})`))
    if (!chunk) return true
    return !/controlType:\s*'(slider|switch-selector)'/.test(chunk[0])
  }).length
  info.push({ id, brand, type, params, hasSlider, hasSwitch, knobCount })
}
fs.writeFileSync('scripts/pedal-meta.json', JSON.stringify(info, null, 2))
console.log(`Wrote ${info.length} pedals`)
