/**
 * Batch writer: creates compact documentation.md for pedals from a catalog.
 * Usage: node _batch_write_docs.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(fileURLToPath(import.meta.url));

function doc({ id, title, brand, type, date = '29 octobre 2026', presentation, sources = [], specs = [], tech = [], dsp = '', notes = [] }) {
  const src = sources.length
    ? sources.map((s) => `- ${s}`).join('\n')
    : '- Pages constructeur / manuels / analyses publiques (voir fichiers locaux du dossier)';
  const sp = specs.length ? specs.map((s) => `| ${s[0]} | ${s[1]} |`).join('\n') : '| — | Voir sources |';
  const te = tech.map((t) => `- ${t}`).join('\n') || '- Voir présentation';
  const nt = notes.map((n) => `- ${n}`).join('\n') || '- Identifier la révision matérielle avant calibration';
  return `# ${title} — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** ${date}  
**ID système :** \`${id}\`

---

## 1. Présentation

${presentation}

---

## 2. Sources

${src}

---

## 3. Caractéristiques

| Caractéristique | Valeur |
|---|---|
${sp}

---

## 4. Technologie sonore

${te}

---

## 5–6. Architecture / DSP

\`\`\`text
${dsp || 'Entrée → Traitement caractéristique → Sortie'}
\`\`\`

Objectif DSP : temps réel, paramètres continus sans clics, calibration sur pédale physique, OS sur non-linéarités si besoin.

---

## 7–11. Calibration, tests, limites

- Mesurer FR, I/O, dynamique, latence
- A/B à niveau égal
${nt}
- Documents et marques soumis aux droits applicables

---

## 12. Ressources locales

Voir les fichiers téléchargés dans ce dossier (photos, manuels, schémas).

---

## 13. Conclusion

Prioriser un modèle comportemental calibré avant une simulation circuit détaillée.
`;
}

const catalog = [
  {
    folder: 'Ibanez_TS_Mini',
    id: 'ibanez-tube-screamer-mini',
    title: 'Ibanez Tube Screamer Mini (TSMINI)',
    brand: 'Ibanez',
    type: 'overdrive',
    presentation: "Version compacte du Tube Screamer (environ moitié de la taille d'un TS9). Même famille sonore mid-hump / soft clip, commandes Overdrive / Tone / Level, **true bypass**, alim externe 9 V uniquement (pas de pile). Made in Japan.",
    sources: [
      'https://www.ibanez.com/usa/products/detail/ts_mini_01.html',
      'Manuel TSMINI (Hoshino) — fichier local si téléchargé',
      'Référence croisée : documentation TS9 du même repo',
    ],
    specs: [
      ['Commandes', 'Overdrive, Tone, Level'],
      ['Bypass', 'True bypass'],
      ['Conso', '18 mA @ 9 V'],
      ['Alim', 'DC 9 V centre négatif (externe)'],
    ],
    tech: [
      'Soft clipping diodes dans feedback (famille TS)',
      'Bosse médium caractéristique',
      'True bypass (différent du buffer JFET historique TS808)',
    ],
    dsp: 'Entrée → Soft clip mid-hump (DRIVE) → TONE → LEVEL → Sortie\n(Réutiliser calibrage TS9, ajuster niveau/bypass)',
  },
  {
    folder: 'Walrus_Audio_Fundamental_Drive',
    id: 'walrus-audio-drive',
    title: 'Walrus Audio Fundamental Drive',
    brand: 'Walrus Audio',
    type: 'overdrive',
    presentation: "Overdrive série Fundamental : 3 faders (Gain, Tone, Volume) + switch 3 modes de clipping. Discontinué côté boutique mais pertinent pour l'app.",
    sources: [
      'https://www.walrusaudio.com/products/fundamental-series-drive',
      'Manuel EN + Fundamental Start Guide (cdn Shopify Walrus)',
    ],
    specs: [
      ['Commandes', 'Gain, Tone, Volume'],
      ['Modes', 'Smooth / Crunch / Bright'],
      ['Bypass', 'True bypass'],
      ['Alim', '9 V DC centre négatif, ≥ 100 mA'],
      ['Taille', '4.33" × 2.16" × 1.61"'],
    ],
    tech: [
      'Smooth : soft clip Si classique',
      'Crunch : soft + hard clip Si + léger boost grave',
      'Bright : même clip que Crunch + coupe grave pré-clip',
      'Tone = réduction des aigus',
    ],
    dsp: 'Entrée → [HPF si Bright] → Gain → f_clip(mode) → Tone LPF → Volume → Sortie',
    notes: ['Pas de schéma public — calibrer les 3 courbes de clip'],
  },
  {
    folder: 'Mesa_Boogie_Grid_Slammer',
    id: 'mesa-grid-slammer',
    title: 'Mesa/Boogie Grid Slammer',
    brand: 'Mesa Boogie',
    type: 'overdrive',
    presentation: "Overdrive Mesa avec bosse médium « 70s », plage Gain du soft clip au high-gain bas, Level jusqu'à ~+20 dB pour « slammer » l'entrée d'ampli. True bypass. Fabriqué Petaluma, CA.",
    sources: [
      'Manuel officiel Mesa Grid Slammer PDF',
      'https://www.mesaboogie.com/ (fiche produit)',
      'Build docs / schémas réplique DIY (fichiers locaux)',
    ],
    specs: [
      ['Commandes', 'Gain, Tone, Level'],
      ['Bypass', 'True bypass'],
      ['Boost Level', 'jusqu’à ~+20 dB'],
      ['Alim', '9 V centre négatif / pile'],
      ['Conso', '~15 mA (fiche)'],
    ],
    tech: [
      'Mid bump classique guitare',
      'Gain bas = rythme / blues percussif',
      'Gain haut = legato / lead crémeux',
      'Usage « input slamming » vers préampli amp',
    ],
    dsp: 'Entrée → Gain (soft→sat) + mid bump → Tone → Level → Sortie',
  },
  {
    folder: 'JHS_AT_Drive',
    id: 'jhs-at-drive',
    title: 'JHS AT / AT+ (Andy Timmons Drive)',
    brand: 'JHS',
    type: 'overdrive',
    presentation: "Overdrive signature Andy Timmons (évolution Angry Charlie). Canal drive : Volume, Drive, EQ, Air, toggle 25/50/100 W. AT+ ajoute un boost indépendant footswitchable. 9–18 V.",
    sources: [
      'https://jhspedals.info/products/at',
      'Manuel JHS AT+',
      'Build docs / schémas réplique (fichiers locaux)',
    ],
    specs: [
      ['Commandes drive', 'Volume, Drive, EQ, Air, toggle 25/50/100 W'],
      ['AT+', 'Boost indépendant + 2 footswitches'],
      ['Alim', '9–18 V DC centre négatif'],
      ['Conso', '~15 mA'],
    ],
    tech: [
      'Voicing British amp-in-a-box / Angry Charlie family',
      '25 W = plus compressé ; 100 W = plus ouvert (diode lift)',
      'EQ = HPF / bright-dark ; Air = présence',
      'Boost AT+ = pré-boost légèrement dirty',
    ],
    dsp: 'Entrée → [Boost?] → Drive + clip(mode W) → EQ/Air → Volume → Sortie',
  },
];

let written = 0;
for (const p of catalog) {
  const dir = path.join(root, p.folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, 'documentation.md');
  fs.writeFileSync(out, doc(p), 'utf8');
  const gk = path.join(dir, '.gitkeep');
  if (fs.existsSync(gk)) fs.unlinkSync(gk);
  written++;
  console.log('OK', p.folder);
}
console.log('Written', written);
