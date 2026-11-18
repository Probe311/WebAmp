import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import catalog from './_catalog_remaining.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));

function doc(p) {
  const src = (p.sources || []).map((s) => `- ${s}`).join('\n') || '- Sources constructeur / communautaires';
  const sp = (p.specs || []).map((s) => `| ${s[0]} | ${s[1]} |`).join('\n') || '| — | — |';
  const te = (p.tech || []).map((t) => `- ${t}`).join('\n') || '- Voir présentation';
  const nt = (p.notes || []).map((n) => `- ${n}`).join('\n');
  return `# ${p.title} — Documentation technique et modélisation sonore

**Version :** 1.0  
**Date :** 29 octobre 2026  
**ID système :** \`${p.id}\`

---

## 1. Présentation

${p.presentation}

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
${p.dsp || 'Entrée → Traitement → Sortie'}
\`\`\`

Objectif : temps réel, multi-instances, calibration sur matériel réel, suréchantillonnage des non-linéarités si nécessaire.

---

## 7–11. Calibration, tests, limites

- Captures DI, FR, I/O, écoute A/B
- Identifier la révision matérielle
${nt ? nt + '\n' : ''}- Sans pédale physique, la fidélité reste une approximation
- Schémas et marques soumis aux droits applicables

---

## 12. Ressources locales

Compléter ce dossier avec photos produit, manuels PDF et schémas (script \`download.js\`).

---

## 13. Conclusion

Modèle comportemental calibré en priorité ; raffiner selon mesures.
`;
}

let n = 0;
let skipped = 0;
for (const p of catalog) {
  const dir = path.join(root, p.folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const out = path.join(dir, 'documentation.md');
  if (fs.existsSync(out) && fs.statSync(out).size > 200) {
    skipped++;
    continue;
  }
  fs.writeFileSync(out, doc(p), 'utf8');
  const gk = path.join(dir, '.gitkeep');
  if (fs.existsSync(gk)) fs.unlinkSync(gk);
  n++;
}
console.log(`Wrote ${n}, skipped existing ${skipped}, catalog ${catalog.length}`);
const done = fs.readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(root, d.name, 'documentation.md')))
  .length;
console.log(`Total documented folders: ${done}`);
