import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1) Nettoyage / optimisation
function optimizeHtml(html) {
  let cleaned = html;

  // Supprimer les attributs data-* (player, tracking, etc.)
  cleaned = cleaned.replace(/\s+data-[^=]*="[^"]*"/g, '');

  // Supprimer les classes CSS spécifiques Songsterr
  cleaned = cleaned.replace(/\s+class="[^"]*"/g, '');

  // Supprimer certains attributs d'accessibilité inutiles ici
  cleaned = cleaned.replace(/\s+role="[^"]*"/g, '');
  cleaned = cleaned.replace(/\s+aria-[^=]*="[^"]*"/g, '');

  // Supprimer les styles inline
  cleaned = cleaned.replace(/\s+style="[^"]*"/g, '');

  // Supprimer boutons/menus de contrôle
  cleaned = cleaned.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '');
  cleaned = cleaned.replace(/<div[^>]*data-tab-control[^>]*>[\s\S]*?<\/div>/gi, '');
  cleaned = cleaned.replace(/<g[^>]*data-tab-control[^>]*>[\s\S]*?<\/g>/gi, '');
  cleaned = cleaned.replace(/<g[^>]*data-testid[^>]*>[\s\S]*?<\/g>/gi, '');

  // Supprimer les divs de contrôle du player
  cleaned = cleaned.replace(/<div[^>]*data-player-key[^>]*>[\s\S]*?<\/div>/gi, '');

  // Compacter un peu
  cleaned = cleaned.replace(/\s{2,}/g, ' ');
  cleaned = cleaned.replace(/>\s+</g, '><');

  return cleaned.trim();
}

// 2) Extraction des 3 sections <section id="tablature">... </section>
function extractSections(fullHtml) {
  const sections = {
    electric: null,
    bass: null,
    piano: null,
  };

  // Utiliser une regex pour trouver TOUTES les sections <section id="tablature">...</section>
  const sectionRegex = /<section\s+id="tablature"[^>]*>([\s\S]*?)<\/section>/gi;
  const allSections = [];
  let match;
  
  while ((match = sectionRegex.exec(fullHtml)) !== null) {
    allSections.push({
      fullMatch: match[0],
      startIndex: match.index,
      endIndex: match.index + match[0].length
    });
  }

  console.log(`📊 ${allSections.length} sections <section id="tablature"> trouvées`);

  if (allSections.length === 0) {
    console.error('❌ Aucune section trouvée avec la regex.');
    return sections;
  }

  // Identifier chaque section en regardant le contexte avant (les 200 caractères précédents)
  for (let i = 0; i < allSections.length; i++) {
    const section = allSections[i];
    const contextBefore = fullHtml.substring(
      Math.max(0, section.startIndex - 200),
      section.startIndex
    ).toLowerCase();

    // Identifier le type d'instrument
    if (!sections.electric && (contextBefore.includes('electric guitar') || contextBefore.includes('guitare électrique'))) {
      sections.electric = section.fullMatch;
      console.log(`✅ Section guitare électrique identifiée (section ${i + 1})`);
    } else if (!sections.bass && (contextBefore.includes('basse') || contextBefore.includes('bass')) && !contextBefore.includes('electric')) {
      sections.bass = section.fullMatch;
      console.log(`✅ Section basse identifiée (section ${i + 1})`);
    } else if (!sections.piano && contextBefore.includes('piano')) {
      sections.piano = section.fullMatch;
      console.log(`✅ Section piano identifiée (section ${i + 1})`);
    }
  }

  // Si on n'a pas trouvé toutes les sections par contexte, les assigner dans l'ordre
  if (allSections.length >= 3) {
    if (!sections.electric && allSections[0]) sections.electric = allSections[0].fullMatch;
    if (!sections.bass && allSections[1]) sections.bass = allSections[1].fullMatch;
    if (!sections.piano && allSections[2]) sections.piano = allSections[2].fullMatch;
  } else if (allSections.length === 2) {
    if (!sections.electric && allSections[0]) sections.electric = allSections[0].fullMatch;
    if (!sections.bass && allSections[1]) sections.bass = allSections[1].fullMatch;
  } else if (allSections.length === 1) {
    if (!sections.electric) sections.electric = allSections[0].fullMatch;
  }

  return sections;
}

// 3) Script principal
(function main() {
  // Remonter de frontend/src/scripts vers la racine du projet
  const projectRoot = path.resolve(__dirname, '../../../');
  const filePath = path.join(projectRoot, 'docs', 'tabs', 'Shake it off.html');
  if (!fs.existsSync(filePath)) {
    console.error('❌ Fichier introuvable :', filePath);
    process.exit(1);
  }

  const fullHtml = fs.readFileSync(filePath, 'utf8');
  console.log('✅ Fichier lu, longueur =', fullHtml.length);

  const rawSections = extractSections(fullHtml);

  if (!rawSections.electric && !rawSections.bass && !rawSections.piano) {
    console.error('❌ Aucune section <section id="tablature"> trouvée.');
    process.exit(1);
  }

  const electricHtml = rawSections.electric ? optimizeHtml(rawSections.electric) : null;
  const bassHtml     = rawSections.bass    ? optimizeHtml(rawSections.bass)    : null;
  const pianoHtml    = rawSections.piano   ? optimizeHtml(rawSections.piano)   : null;

  console.log('📊 Tailles après nettoyage :', {
    electric: electricHtml?.length || 0,
    bass:     bassHtml?.length || 0,
    piano:    pianoHtml?.length || 0,
  });

  const blocks = [];

  if (electricHtml) {
    blocks.push(
      `[html instrument="Guitare électrique" title="Shake It Off - Guitare électrique"]\n` +
      electricHtml +
      `\n[/html]`
    );
  }

  if (bassHtml) {
    blocks.push(
      `[html instrument="Basse" title="Shake It Off - Basse"]\n` +
      bassHtml +
      `\n[/html]`
    );
  }

  if (pianoHtml) {
    blocks.push(
      `[html instrument="Piano" title="Shake It Off - Piano"]\n` +
      pianoHtml +
      `\n[/html]`
    );
  }

  const description =
`La tablature complète est disponible ci-dessous pour différents instruments :

${blocks.join('\n\n')}

Utilisez le sélecteur ci-dessus pour choisir l'instrument que vous souhaitez apprendre.`;

  console.log('------------------ DESCRIPTION START ------------------');
  console.log(description);
  console.log('------------------- DESCRIPTION END -------------------');

  // Sauvegarder aussi dans un fichier pour faciliter la copie
  const outputPath = path.join(projectRoot, 'docs', 'tabs', 'ShakeItOff-description.txt');
  try {
    fs.writeFileSync(outputPath, description, 'utf8');
    console.log(`\n✅ Description sauvegardée dans: ${outputPath}`);
    console.log('💡 Tu peux maintenant copier cette description dans Supabase.');
  } catch (err) {
    console.warn('⚠️ Impossible de sauvegarder le fichier:', err.message);
    console.log('💡 Copie la description depuis la console ci-dessus.');
  }
})();

