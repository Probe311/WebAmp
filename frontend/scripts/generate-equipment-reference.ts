/**
 * Génère `docs/EQUIPMENT_REFERENCE.md` depuis les définitions réellement
 * rendues par le design system et les fiches de recherche (`specs/`).
 *
 * Usage : `npx tsx scripts/generate-equipment-reference.ts` (depuis frontend/)
 */
import { writeFileSync } from 'node:fs'
import { pedalLibrary } from '../src/data/pedals'
import { amplifierLibrary } from '../src/data/amplifiers'
import { pedalEquipment } from '../src/equipment/definitions/pedals'
import { ampEquipment } from '../src/equipment/definitions/amplifiers'
import { PEDAL_RESEARCH, PEDAL_RESEARCH_DOUBTS } from '../src/equipment/specs'

/** Types passés en marque blanche + recherche web (lots L1–L5). */
const LOT_TYPES = [
  'overdrive',
  'distortion',
  'fuzz',
  'chorus',
  'flanger',
  'phaser',
  'tremolo',
  'vibe',
  'delay',
  'tapedelay',
  'reverb',
  'springreverb',
  'shimmerreverb',
  'eq',
  'wah',
  'volume',
]
const lot = pedalLibrary.filter((p) => LOT_TYPES.includes(p.type))

const cell = (s: string | undefined | null) => (s ? String(s).replace(/\|/g, '\\|') : '—')

const controlList = (def: (typeof pedalEquipment)[string]) => {
  const parts: string[] = []
  if (def.controls.length) parts.push(`knobs: ${def.controls.map((c) => c.label).join(', ')}`)
  if (def.sliders?.length) parts.push(`faders: ${def.sliders.map((s) => s.label).join(', ')}`)
  if (def.multiSwitches?.length)
    parts.push(`sélecteurs: ${def.multiSwitches.map((m) => `${m.label} (${m.options.join('/')})`).join(', ')}`)
  const toggles = def.switches.filter((s) => s.id !== 'active')
  if (toggles.length) parts.push(`switchs: ${toggles.map((s) => s.label).join(', ')}`)
  return parts.join(' · ')
}

const isHouse = (r?: { house?: boolean; note?: string }) => Boolean(r?.house || /maison/i.test(r?.note ?? ''))
const sourceCell = (id: string) => {
  const r = PEDAL_RESEARCH[id]
  const d = pedalEquipment[id]
  if (isHouse(r)) return 'modèle maison WebAmp'
  if (!d.branding.sourceUrl) return r?.note ? `— (${r.note})` : '—'
  const warn = r?.urlDoubt ? ' ⚠' : ''
  return r?.urlKind === 'brand' ? `${d.branding.sourceUrl} *(page gamme)*${warn}` : `${d.branding.sourceUrl}${warn}`
}

const withUrl = lot.filter((p) => pedalEquipment[p.id].branding.sourceUrl).length
const noUrl = lot.filter((p) => !pedalEquipment[p.id].branding.sourceUrl && !isHouse(PEDAL_RESEARCH[p.id]))
const house = lot.filter((p) => isHouse(PEDAL_RESEARCH[p.id]))

let md = `# Référence matériel — WebAmp Studio (marque blanche)

Document généré par \`frontend/scripts/generate-equipment-reference.ts\` depuis les
définitions réellement rendues par le design system (\`frontend/src/equipment/\`)
et les fiches constructeur relevées en ligne (recherche des lots L1–L5, URLs
vérifiées en HTTP le 15 novembre 2026).

## Règles de marque blanche

- Aucune marque réelle sur l'appareil : \`brandName\` = \`WebAmp Studio\` (pédales)
  ou \`WebAmp\` (amplis).
- Marque et modèle d'origine conservés en métadonnée interne
  \`branding.sourceName\` / \`branding.sourceUrl\` — jamais rendus à l'écran.
- Nomenclature : \`WA-<code><n>\` (pédales), \`WA-<n><H|C> <SÉRIE>\` (amplis).
- Ids de paramètres audio inchangés : \`PedalboardEngine\`, \`audio/ampToneStack.ts\`,
  \`config.ts\` et les presets ne sont pas impactés.

## Méthode de recherche

Recherche **par famille de hardware** (BOSS compact, Ibanez Tube Screamer,
EHX/Big Muff, MXR/Dunlop, Pro Co, boîtiers boutique JHS/Wampler/EQD/Strymon/
Walrus/Chase Bliss, mini-pédales Mooer, fuzz vintage, delays analogiques,
tape echoes, grosses boîtes reverb, égaliseurs graphiques et paramétriques,
wah signature Dunlop/Vox, pédales de volume), puis fiche **modèle par modèle** :
couleur et finition du boîtier, matériau, style de knobs, couleur de LED, type
de footswitch, libellés sérigraphiés réels et URL constructeur.

Chaque URL conservée a été ouverte en HTTP : une 404, une page hors sujet ou une
page de modèle voisin est soit remplacée, soit marquée ⚠ (voir la section des
doutes). Les teintes sont ramenées aux tokens disponibles (\`EquipmentColorId\`) :
ce sont des équivalents, pas des Pantone.

## Lots L1–L5 (${lot.length} modèles)

${lot.length} modèles — ${withUrl} avec source en ligne (dont ${
  lot.filter((p) => PEDAL_RESEARCH[p.id]?.urlKind === 'brand').length
} pages gamme), ${house.length} modèles maison WebAmp, ${noUrl.length} sans source officielle,
${PEDAL_RESEARCH_DOUBTS.length} URLs encore douteuses.

| # | Code WebAmp | Modèle source (interne) | Type | Châssis | Boîtier | Knobs / LED | Contrôles | Source |
|---|---|---|---|---|---|---|---|---|
`

lot.forEach((model, i) => {
  const d = pedalEquipment[model.id]
  const surface = [d.surfaceConfig?.color, d.surfaceConfig?.finish].filter(Boolean).join(' / ')
  const knobs = `${d.controls[0]?.style.type ?? (d.sliders?.length ? 'faders' : '—')} / ${d.leds[0]?.color ?? 'sans LED'}`
  md += `| ${i + 1} | ${cell(d.branding.modelName)} | ${cell(d.branding.sourceName)} | ${model.type} | ${d.chassisVariant} | ${cell(surface)} | ${cell(knobs)} | ${cell(controlList(d))} | ${cell(sourceCell(model.id))} |\n`
})

md += `\n## Amplis (${amplifierLibrary.length}) — lot L7\n\n| # | Code WebAmp | Modèle source (interne) | Type | Châssis | Boîtier | Knobs / LED | Contrôles | Source |\n|---|---|---|---|---|---|---|---|---|\n`

amplifierLibrary.forEach((amp, i) => {
  const d = ampEquipment[amp.id]
  const surface = [d.surfaceConfig?.color, d.surfaceConfig?.finish].filter(Boolean).join(' / ')
  const knobs = `${d.controls[0]?.style.type ?? '—'} / ${d.leds[0]?.color ?? 'sans LED'}`
  md += `| ${i + 1} | ${cell(d.branding.modelName)} | ${cell(d.branding.sourceName)} | ${amp.type} | ${d.chassisVariant} | ${cell(surface)} | ${cell(knobs)} | ${cell(controlList(d))} | L7 (recherche à venir) |\n`
})

md += `\n## Modèles sans source officielle (${noUrl.length})\n\nAucune page constructeur en ligne n'existe pour ces appareils (produits vintage\nde marques disparues, assemblages custom, modèles retirés du catalogue).\n\n${noUrl
  .map(
    (p) =>
      `- ${pedalEquipment[p.id].branding.modelName} — ${pedalEquipment[p.id].branding.sourceName} : ${
        PEDAL_RESEARCH[p.id]?.note ?? 'pas de fiche officielle'
      }`,
  )
  .join('\n')}\n`

md += `
## URLs à revérifier (${PEDAL_RESEARCH_DOUBTS.length})

Ces fiches portent un champ \`urlDoubt\` : l'adresse pointe un modèle voisin, une
réédition, une page de gamme, ou une source non constructeur. Elles restent
utiles comme référence mais **ne sont pas des fiches produit exactes**.

| Fiche | URL | Raison |
|---|---|---|
${PEDAL_RESEARCH_DOUBTS.map((d) => `| \`${d.id}\` | ${PEDAL_RESEARCH[d.id].url ?? '—'} | ${d.doubt} |`).join('\n')}

Bilan de la vérification HTTP (novembre 2026) : sur 45 fiches signalées pour les
lots L1–L4, 33 sont corrigées — pages produit réelles pour BOSS
DD-3/RV-5/OD-3/DC-2W, EHX Holy Grail/Cathedral, Suhr Riot, Tech 21 GT2,
Fulltone OCD, Behringer SF300, Mesa Grid Slammer/Throttle Box, Joyo American
Sound, Marshall Guv'nor et Bluesbreaker, Meris Polymoon/Mercury7, Empress
Echosystem, Keeley Caverns, Red Panda Particle, OBNE Dark Star, Neunaber
Immerse, Eventide Space, SurfyBear Metal, Z.Vex Fuzz Factory, Way Huge Swollen
Pickle MkIIS, Line 6 DL4 MkII, Strymon Brigadier/BigSky, et Bondi Sick As.
Quatre liens sont passés en \`urlKind: 'none'\` : Satchurator et Vox Time Machine
(retirés du catalogue Vox), Malekko Ekko 616 (site constructeur hors ligne) et
Eventide Harmonizer (modèle studio sans fiche).

## Garantie de couverture

Le module de specs est découpé en modules feuilles : \`specs/types.ts\` (contrat
\`PedalResearch\`), \`specs/urls.ts\` (helpers et constantes d'URL partagés),
\`specs/research.ts\` (L1–L3), \`specs/research-l4.ts\` (L4) et
\`specs/research-l5.ts\` (L5). Seul \`specs/index.ts\` fusionne les lots — aucune
dépendance circulaire.

Le test \`frontend/src/equipment/__tests__/definitions.test.ts\` vérifie que :

1. chaque modèle des lots L1–L5 possède une fiche dans \`specs/\` ;
2. chaque fiche expose soit une URL constructeur, soit une justification
   explicite (\`urlKind: 'none'\` ou \`house: true\`) ;
3. toute fiche marquée \`urlDoubt\` a bien une URL et une justification,
   exposées par \`PEDAL_RESEARCH_DOUBTS\`.

## Familles de châssis

| Archétype | Dimensions (px) | Usage |
|---|---|---|
| \`compact\` | 300×460 | boîtier 3–4 knobs type BOSS/MXR |
| \`compact-wide\` | 340×460 | boîtier large (Big Muff, RAT, Strymon, Walrus) |
| \`mini\` | 260×380 | mini-pédales (Mooer, TS Mini) |
| \`sliders\` | 320×520 | faders horizontaux (Fundamental Series) |
| \`eq\` | 420×400 | égaliseurs à faders verticaux |
| \`treadle\` | 320×520 | wah / Uni-Vibe / volume |
| \`expression\` | 300×460 | expression / pitch |
| \`looper\` | 400×480 | looper / multi-effets (DL4) |
| \`desktop\` | 380×360 | Space Echo, Echorec, SurfyBear, Eventide Space |
| \`tuner\` | 280×400 | accordeurs |

## Reste à faire

- [ ] L6 Boost 9 + Comp 10 + Noisegate 5 + Octaver 5 + Pitch 5 + Ringmod/Bitcrusher/Lo-Fi/Rotary/Tuner/Multifx 31
- [ ] L7 Amplis 44 (recherche fiche par fiche)
`

writeFileSync('../docs/EQUIPMENT_REFERENCE.md', md)
console.log(
  'rows',
  lot.length,
  'amps',
  amplifierLibrary.length,
  'withUrl',
  withUrl,
  'house',
  house.length,
  'sansUrl',
  noUrl.length,
  'doubts',
  PEDAL_RESEARCH_DOUBTS.length,
)
