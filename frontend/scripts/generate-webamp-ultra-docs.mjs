/**
 * Génère docs/pedales/WebAmp_* + met à jour LISTE-PEDALES.md / README.md
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const docsPedals = path.join(root, 'docs/pedales')

/** @type {{ id: string, folder: string, brand: string, model: string, type: string, behringer?: string, description: string, params: string[], skin: string }[]} */
const specs = [
  { id: 'webamp-od300', folder: 'WebAmp_OD-300', brand: 'WebAmp', model: 'OD-300', type: 'overdrive', behringer: 'OD300', description: 'Overdrive / distortion dual-mode', params: ['drive', 'tone', 'level', 'mode'], skin: 'ultra' },
  { id: 'webamp-to800', folder: 'WebAmp_TO-800', brand: 'WebAmp', model: 'TO-800', type: 'overdrive', behringer: 'TO800', description: 'Tube overdrive vintage', params: ['drive', 'tone', 'level'], skin: 'ultra' },
  { id: 'webamp-um300', folder: 'WebAmp_UM-300', brand: 'WebAmp', model: 'UM-300', type: 'distortion', behringer: 'UM300', description: 'Ultra metal + EQ 3 bandes', params: ['distortion', 'level', 'low', 'mid', 'high'], skin: 'ultra' },
  { id: 'webamp-hm300', folder: 'WebAmp_HM-300', brand: 'WebAmp', model: 'HM-300', type: 'distortion', behringer: 'HM300', description: 'Heavy metal 80s', params: ['distortion', 'low', 'mid', 'level'], skin: 'ultra' },
  { id: 'webamp-hd300', folder: 'WebAmp_HD-300', brand: 'WebAmp', model: 'HD-300', type: 'distortion', behringer: 'HD300', description: 'Heavy distortion + boost', params: ['boost', 'distortion', 'tone', 'bottom', 'level'], skin: 'ultra' },
  { id: 'webamp-sf300', folder: 'WebAmp_SF-300', brand: 'WebAmp', model: 'SF-300', type: 'fuzz', behringer: 'SF300', description: 'Super fuzz 3 modes', params: ['gain', 'level', 'low', 'high', 'mode'], skin: 'ultra' },
  { id: 'webamp-bod400', folder: 'WebAmp_BOD-400', brand: 'WebAmp', model: 'BOD-400', type: 'overdrive', behringer: 'BOD400', description: 'Bass overdrive + blend · façade LEVEL / HIGH / GAIN / BAL + LOW', params: ['level', 'gain', 'bass', 'treble', 'blend'], skin: 'ultra' },
  { id: 'webamp-beq700', folder: 'WebAmp_BEQ-700', brand: 'WebAmp', model: 'BEQ-700', type: 'eq', behringer: 'BEQ700', description: 'EQ graphique 7 bandes basse + LEVEL · façade jaune, faders sombres', params: ['b50', 'b120', 'b400', 'b500', 'b800', 'b4k5', 'b10k', 'level'], skin: 'eq' },
  { id: 'webamp-cs400', folder: 'WebAmp_CS-400', brand: 'WebAmp', model: 'CS-400', type: 'compressor', behringer: 'CS400', description: 'Compresseur sustainer · façade LEVEL / TONE / ATTACK / SUSTAIN', params: ['sustain', 'attack', 'tone', 'level'], skin: 'ultra' },
  { id: 'webamp-nr300', folder: 'WebAmp_NR-300', brand: 'WebAmp', model: 'NR-300', type: 'noisegate', behringer: 'NR300', description: 'Noise reducer', params: ['threshold', 'decay', 'mode'], skin: 'ultra' },
  { id: 'webamp-uc200', folder: 'WebAmp_UC-200', brand: 'WebAmp', model: 'UC-200', type: 'chorus', behringer: 'UC200', description: 'Ultra chorus', params: ['level', 'tone', 'rate', 'depth'], skin: 'ultra' },
  { id: 'webamp-uv300', folder: 'WebAmp_UV-300', brand: 'WebAmp', model: 'UV-300', type: 'chorus', behringer: 'UV300', description: 'Ultra vibrato', params: ['depth', 'rate', 'rise', 'mode'], skin: 'ultra' },
  { id: 'webamp-ut300', folder: 'WebAmp_UT-300', brand: 'WebAmp', model: 'UT-300', type: 'tremolo', behringer: 'UT300', description: 'Ultra tremolo', params: ['rate', 'wave', 'depth'], skin: 'ultra' },
  { id: 'webamp-cl9', folder: 'WebAmp_CL-9', brand: 'WebAmp', model: 'CL-9', type: 'chorus', behringer: 'CL9', description: 'Compresseur / limiteur · façade rouge, 3 knobs (ATTACK TIME / SUSTAIN / LEVEL)', params: ['rate', 'depth', 'level'], skin: 'ultra' },
  { id: 'webamp-vp1', folder: 'WebAmp_VP-1', brand: 'WebAmp', model: 'VP-1', type: 'phaser', behringer: 'VP1', description: 'Vintage phaser', params: ['rate', 'tone'], skin: 'ultra' },
  { id: 'webamp-fx600', folder: 'WebAmp_FX-600', brand: 'WebAmp', model: 'FX-600', type: 'multifx', behringer: 'FX600', description: 'Multi-FX 6 algos · sélecteur FX horizontal', params: ['level', 'param1', 'param2', 'mode'], skin: 'ultra' },
  { id: 'webamp-vd400', folder: 'WebAmp_VD-400', brand: 'WebAmp', model: 'VD-400', type: 'delay', behringer: 'VD400', description: 'Digital delay', params: ['time', 'feedback', 'level'], skin: 'ultra' },
  { id: 'webamp-dr600', folder: 'WebAmp_DR-600', brand: 'WebAmp', model: 'DR-600', type: 'reverb', behringer: 'DR600', description: 'Digital reverb · façade LEVEL / TONE / TIME + sélecteur MODE horizontal', params: ['mix', 'decay', 'tone', 'mode'], skin: 'ultra' },
  { id: 'webamp-tm300', folder: 'WebAmp_TM-300', brand: 'WebAmp', model: 'TM-300', type: 'overdrive', behringer: 'TM300', description: 'Modeler d’ampli à lampes', params: ['level', 'low', 'high', 'drive', 'mic', 'mod', 'amp'], skin: 'ultra' },
  { id: 'webamp-uo300', folder: 'WebAmp_UO-300', brand: 'WebAmp', model: 'UO-300', type: 'octaver', behringer: 'UO300', description: 'Ultra octave', params: ['direct', 'oct1', 'oct2', 'range'], skin: 'ultra' },
  { id: 'webamp-eq700', folder: 'WebAmp_EQ-700', brand: 'WebAmp', model: 'EQ-700', type: 'eq', behringer: 'EQ700', description: 'EQ graphique 7 bandes', params: ['b100', 'b200', 'b400', 'b800', 'b1k6', 'b3k2', 'b6k4'], skin: 'eq' },
  { id: 'webamp-tu300', folder: 'WebAmp_TU-300', brand: 'WebAmp', model: 'TU-300', type: 'tuner', behringer: 'TU300', description: 'Tuner chromatique', params: ['mode'], skin: 'ultra' },
  { id: 'webamp-wahcko', folder: 'WebAmp_Wahcko', brand: 'WebAmp', model: 'Wahcko', type: 'wah', description: 'Essai UI treadle wah', params: ['sweep', 'range'], skin: 'wah' },
]

function docBody(s) {
  const ref = s.behringer
    ? `Référence matérielle d’inspiration : **Behringer ${s.behringer}** (ligne compacte Ultra). Marque UI : **WebAmp** — pas un clone logo Behringer.`
    : `Essai de skin UI WebAmp (\`${s.skin}\`). Références visuelles boutique / digital (composition, pas assets copyrightés).`

  return `# ${s.brand} ${s.model}

**Version :** 1.0  
**Date :** 29 octobre 2026  
**Catalogue id :** \`${s.id}\`  
**Skin UI :** \`${s.skin}\`  
**Type :** \`${s.type}\`

## 1. Présentation

${s.description}.

${ref}

## 2. Paramètres UI

${s.params.map((p) => `- **${p}**`).join('\n')}

## 3. Objectifs DSP (cibles)

1. Comportement cohérent avec une pédale compacte de la même famille d’effet.
2. Courbes de gain / mix / temps plausibles pour démo et calibration future.
3. Bypass soft sans click excessif.

## 4. Ressources

- Catalogue Thomann Behringer effets (réf. commerciale de la ligne Ultra).
- Modèle doc long : [SD1](../SD1/documentation.md).
- Skin runtime : \`frontend/src/components/pedals/skins/\`.

## 5. Statut

Documentation courte ✅ · Assets photo ⏳ · DSP audio ⏳
`
}

for (const s of specs) {
  const dir = path.join(docsPedals, s.folder)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'documentation.md'), docBody(s), 'utf8')
}

// Rebuild LISTE from existing ✅ + expansion ⏳ + WebAmp ✅
const listePath = path.join(docsPedals, 'LISTE-PEDALES.md')
const prev = fs.existsSync(listePath) ? fs.readFileSync(listePath, 'utf8') : ''
const existingRows = [...prev.matchAll(/\| ([✅⏳]) \| \[([^\]]+)\]\([^)]+\) \|/g)].map((m) => ({
  status: m[1],
  folder: m[2],
}))

const byFolder = new Map(existingRows.map((r) => [r.folder, r]))
for (const s of specs) {
  byFolder.set(s.folder, { status: '✅', folder: s.folder })
}

const rows = [...byFolder.values()].sort((a, b) => a.folder.localeCompare(b.folder))
const total = rows.length
const documented = rows.filter((r) => r.status === '✅').length

let liste = `# Liste des pédales — WebAmp

Fichier de suivi. Modèle : [SD1](./SD1/documentation.md).

**Total :** ${total} · **Dossiers :** ${total}/${total} · **Documentées :** ${documented} / ${total} · **Assets locaux :** (voir dossiers)

| Statut | Dossier |
|:---:|---|
`

for (const r of rows) {
  liste += `| ${r.status} | [${r.folder}](./${r.folder}/documentation.md) |\n`
}
liste += `\n**Légende :** ✅ documenté · ⏳ stub à enrichir\n`

fs.writeFileSync(listePath, liste, 'utf8')

fs.writeFileSync(
  path.join(docsPedals, 'README.md'),
  `# Référentiel et documentation des pédales — WebAmp

Documentation technique, schémas, photos et notes de modélisation DSP.

Modèle long : **BOSS SD-1** ([SD1](./SD1/documentation.md)).

## Progression

- **Total :** ${total}
- **Documentées :** ${documented} / ${total}
- **Liste :** [LISTE-PEDALES.md](./LISTE-PEDALES.md)

## Gammes

- Historique (BOSS, EHX, Strymon…) — docs longues / assets
- Expansion boutique — stubs ⏳
- **WebAmp Ultra** (\`WebAmp_*\`) — docs courtes ✅, skin \`ultra\` / essais art

## Structure d’un dossier

1. \`documentation.md\`
2. Photos / schémas / manuels (optionnel)

## Utilitaires

- \`frontend/scripts/generate-pedals-expansion.mjs\`
- \`frontend/scripts/generate-webamp-ultra-docs.mjs\`
`,
  'utf8'
)

console.log(`Docs: ${specs.length} WebAmp · LISTE total ${total} · documentées ${documented}`)
