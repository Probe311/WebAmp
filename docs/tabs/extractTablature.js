const fs = require('fs');
const path = require('path');

// Lire le fichier HTML
const htmlFile = path.join(__dirname, 'Shake it off.html');
const htmlContent = fs.readFileSync(htmlFile, 'utf-8');

// Structure de données pour le JSON
const result = {
  title: "Shake It Off",
  artist: "Taylor Swift",
  tracks: []
};

// Positions Y des cordes de guitare (basées sur le SVG)
const GUITAR_STRING_POSITIONS = {
  1: 1,   // E aigu
  2: 13,  // B
  3: 25,  // G
  4: 37,  // D
  5: 49,  // A
  6: 61   // E grave
};

// Positions Y des cordes de basse (4 cordes)
const BASS_STRING_POSITIONS = {
  1: 1,   // G
  2: 13,  // D
  3: 25,  // A
  4: 37   // E
};

// Positions Y des éléments de batterie (basées sur le SVG)
// Les positions Y varient selon la notation de batterie
const DRUM_POSITIONS = {
  1: -5,   // Crash/Ride (ligne du haut)
  2: 5,    // Hi-hat ouvert/fermé
  3: 15,   // Snare
  4: 25,   // Tom
  5: 35,   // Tom
  6: 45    // Kick/Bass drum
};

// Fonction pour trouver la corde la plus proche d'une position Y
function findClosestString(y, stringPositions = GUITAR_STRING_POSITIONS) {
  let closestString = 1;
  let minDistance = Math.abs(y - stringPositions[1]);
  
  const maxString = Math.max(...Object.keys(stringPositions).map(Number));
  
  for (let str = 2; str <= maxString; str++) {
    const distance = Math.abs(y - stringPositions[str]);
    if (distance < minDistance) {
      minDistance = distance;
      closestString = str;
    }
  }
  
  return closestString;
}

// Fonction pour extraire les coordonnées d'un chemin SVG
function extractCoordinates(pathData) {
  const coords = [];
  // Chercher les commandes M (moveTo), L (lineTo), et c (courbe) avec leurs coordonnées
  // Les commandes peuvent avoir des espaces ou des virgules
  const coordRegex = /[MLc]\s+([\d.-]+)[\s,]+([\d.-]+)/g;
  let match;
  
  while ((match = coordRegex.exec(pathData)) !== null) {
    const x = parseFloat(match[1]);
    const y = parseFloat(match[2]);
    // Filtrer les coordonnées invalides
    if (!isNaN(x) && !isNaN(y) && Math.abs(x) < 10000 && Math.abs(y) < 10000) {
      coords.push({ x, y });
    }
  }
  
  return coords;
}

// Fonction pour estimer la frette à partir de la position X
// Utilise les positions des marqueurs de mesures pour déterminer la frette
function estimateFret(x, measureMap = new Map()) {
  if (measureMap.size === 0) {
    // Estimation simple sans positions de mesures
    return Math.max(0, Math.round(x / 50));
  }
  
  // Trouver la mesure dans laquelle se trouve cette note
  let closestMeasureNumber = null;
  let closestMeasureX = null;
  let minDistance = Infinity;
  
  measureMap.forEach((measureX, measureNumber) => {
    const distance = Math.abs(x - measureX);
    if (distance < minDistance) {
      minDistance = distance;
      closestMeasureNumber = measureNumber;
      closestMeasureX = measureX;
    }
  });
  
  if (closestMeasureX === null) {
    return 0;
  }
  
  // Trouver la mesure suivante pour calculer la largeur de la mesure
  const sortedMeasures = Array.from(measureMap.entries())
    .sort((a, b) => a[1] - b[1]);
  
  const currentIndex = sortedMeasures.findIndex(m => m[0] === closestMeasureNumber);
  const nextMeasureX = currentIndex < sortedMeasures.length - 1 
    ? sortedMeasures[currentIndex + 1][1]
    : closestMeasureX + 150; // Estimation si dernière mesure
  
  // Position relative dans la mesure (0 = début de mesure)
  const relativeX = x - closestMeasureX;
  const measureWidth = nextMeasureX - closestMeasureX;
  
  // Les frettes sont espacées régulièrement dans la mesure
  // Estimation : environ 25-30 pixels par frette dans une mesure
  const fretSpacing = measureWidth / 4; // 4 temps par mesure en 4/4
  const estimatedFret = Math.round(relativeX / fretSpacing);
  
  return Math.max(0, estimatedFret);
}

// Fonction pour extraire les notes d'un chemin SVG
function extractNoteFromPath(pathElement, measureNumber, measureStartX = 0) {
  const pathDataMatch = pathElement.match(/d="([^"]*)"/);
  if (!pathDataMatch) return null;
  
  const pathData = pathDataMatch[1];
  const coords = extractCoordinates(pathData);
  
  if (coords.length === 0) return null;
  
  // Utiliser la première coordonnée pour déterminer la position
  const firstCoord = coords[0];
  const string = findClosestString(firstCoord.y);
  const fret = estimateFret(firstCoord.x, measureStartX);
  
  return {
    string: string,
    fret: fret,
    x: firstCoord.x,
    y: firstCoord.y,
    measure: measureNumber
  };
}

// Fonction pour extraire toutes les notes d'une section HTML
function extractAllNotes(html, instrumentName, measureMap = new Map(), stringPositions = GUITAR_STRING_POSITIONS) {
  const notes = [];
  const measuresMap = new Map();
  
  // Chercher tous les paths avec data-notes-measure
  // Le regex doit gérer les attributs dans n'importe quel ordre et sur plusieurs lignes
  // Gérer aussi les cas avec "o" à la fin (ex: "4o", "5o")
  const pathRegex = /<path[^>]*data-notes-measure="(\d+)(?:o)?"[^>]*>/gs;
  let match;
  
  while ((match = pathRegex.exec(html)) !== null) {
    const measureNumber = parseInt(match[1]);
    const fullPath = match[0];
    
    // Extraire le d="..." du path
    const dMatch = fullPath.match(/d="([^"]*)"/);
    if (!dMatch) continue;
    
    const pathData = dMatch[1];
    
    if (!measuresMap.has(measureNumber)) {
      measuresMap.set(measureNumber, []);
    }
    
    const coords = extractCoordinates(pathData);
    if (coords.length > 0) {
      const firstCoord = coords[0];
      const string = findClosestString(firstCoord.y, stringPositions);
      const fret = estimateFret(firstCoord.x, measureMap);
      
      measuresMap.get(measureNumber).push({
        string: string,
        fret: fret,
        x: firstCoord.x,
        y: firstCoord.y
      });
    }
  }
  
  // Convertir en format de notes
  measuresMap.forEach((noteData, measureNumber) => {
    noteData.forEach((note, index) => {
      notes.push({
        measure: measureNumber,
        position: index,
        string: note.string,
        fret: note.fret,
        x: note.x,
        y: note.y
      });
    });
  });
  
  return notes.sort((a, b) => {
    if (a.measure !== b.measure) return a.measure - b.measure;
    if (a.x !== b.x) return a.x - b.x;
    return a.position - b.position;
  });
}

// Fonction pour extraire les accords (groupes de notes dans la même mesure)
function extractChords(notes) {
  const chords = [];
  const measuresMap = new Map();
  
  // Grouper les notes par mesure
  notes.forEach(note => {
    if (!measuresMap.has(note.measure)) {
      measuresMap.set(note.measure, []);
    }
    measuresMap.get(note.measure).push(note);
  });
  
  // Pour chaque mesure avec plusieurs notes, créer un accord
  measuresMap.forEach((measureNotes, measureNumber) => {
    if (measureNotes.length >= 2) {
      const frets = [null, null, null, null, null, null]; // 6 cordes
      measureNotes.forEach(note => {
        if (note.string >= 1 && note.string <= 6) {
          frets[note.string - 1] = note.fret;
        }
      });
      
      chords.push({
        measure: measureNumber,
        frets: frets,
        notes: measureNotes.map(n => ({
          string: n.string,
          fret: n.fret
        }))
      });
    }
  });
  
  return chords;
}

// Extraire le tempo
const tempoMatch = htmlContent.match(/tempo4.*?= (\d+)/);
const tempo = tempoMatch ? parseInt(tempoMatch[1]) : null;

// Extraire la signature temporelle
const timeSigMatch = htmlContent.match(/id=".*?-sig1".*?>(\d+)<\/text>.*?id=".*?-sig2".*?>(\d+)<\/text>/);
const timeSignature = timeSigMatch ? `${timeSigMatch[1]}/${timeSigMatch[2]}` : null;

// Extraire les mesures avec leurs positions X (dédupliquées)
function extractMeasures(html) {
  const measuresMap = new Map(); // Map<number, x> pour dédupliquer
  
  // Chercher tous les marqueurs de mesures avec leurs positions X
  const measureRegex = /<g data-tab-control="marker"[^>]*><text[^>]*x="([\d.]+)"[^>]*>(\d+)<\/text><\/g>/g;
  let match;
  
  while ((match = measureRegex.exec(html)) !== null) {
    const x = parseFloat(match[1]);
    const measureNumber = parseInt(match[2]);
    
    // Garder la première occurrence de chaque mesure (ou la moyenne si nécessaire)
    if (!measuresMap.has(measureNumber)) {
      measuresMap.set(measureNumber, x);
    } else {
      // Si plusieurs positions pour la même mesure, prendre la moyenne
      const existingX = measuresMap.get(measureNumber);
      measuresMap.set(measureNumber, (existingX + x) / 2);
    }
  }
  
  // Convertir en tableau trié
  const measures = Array.from(measuresMap.entries())
    .map(([number, x]) => ({ number, x }))
    .sort((a, b) => a.number - b.number);
  
  return {
    numbers: measures.map(m => m.number),
    positions: measures.map(m => m.x),
    map: new Map(measures.map(m => [m.number, m.x]))
  };
}

// Extraire la section guitare électrique
const guitarSectionMatch = htmlContent.match(/Guitare electric[^]*?(?=Piano|$)/i);
if (guitarSectionMatch) {
  const guitarHtml = guitarSectionMatch[0];
  const measuresData = extractMeasures(guitarHtml);
  const notes = extractAllNotes(guitarHtml, 'electricGuitar', measuresData.map, GUITAR_STRING_POSITIONS);
  const chords = extractChords(notes);
  
  // Créer un Set pour dédupliquer les numéros de mesures
  const uniqueMeasureNumbers = [...new Set(measuresData.numbers)].sort((a, b) => a - b);
  
  result.tracks.push({
    name: "Electric Guitar",
    instrument: "electricGuitar",
    tuning: ["E", "A", "D", "G", "B", "E"],
    tempo: tempo,
    timeSignature: timeSignature,
    measures: uniqueMeasureNumbers.map(m => ({
      number: m,
      notes: notes.filter(n => n.measure === m),
      chords: chords.filter(c => c.measure === m)
    })),
    allNotes: notes,
    allChords: chords
  });
}

// Extraire la section basse
const bassSectionMatch = htmlContent.match(/Basse[^]*?(?=Piano|$)/i);
if (bassSectionMatch) {
  const bassHtml = bassSectionMatch[0];
  const measuresData = extractMeasures(bassHtml);
  const notes = extractAllNotes(bassHtml, 'electricBass', measuresData.map, BASS_STRING_POSITIONS);
  const chords = extractChords(notes);
  
  // Créer un Set pour dédupliquer les numéros de mesures
  const uniqueMeasureNumbers = [...new Set(measuresData.numbers)].sort((a, b) => a - b);
  
  result.tracks.push({
    name: "Electric Bass",
    instrument: "electricBass",
    tuning: ["E", "A", "D", "G"],
    tempo: tempo,
    timeSignature: timeSignature,
    measures: uniqueMeasureNumbers.map(m => ({
      number: m,
      notes: notes.filter(n => n.measure === m),
      chords: chords.filter(c => c.measure === m)
    })),
    allNotes: notes,
    allChords: chords
  });
}

// Extraire la section batterie
const drumsSectionMatch = htmlContent.match(/Batterie[^]*?(?=Piano|$)/i);
if (drumsSectionMatch) {
  const drumsHtml = drumsSectionMatch[0];
  const measuresData = extractMeasures(drumsHtml);
  const notes = extractAllNotes(drumsHtml, 'drums', measuresData.map, DRUM_POSITIONS);
  const chords = extractChords(notes);
  
  // Créer un Set pour dédupliquer les numéros de mesures
  const uniqueMeasureNumbers = [...new Set(measuresData.numbers)].sort((a, b) => a - b);
  
  result.tracks.push({
    name: "Drums",
    instrument: "drums",
    tempo: tempo,
    timeSignature: timeSignature,
    measures: uniqueMeasureNumbers.map(m => ({
      number: m,
      notes: notes.filter(n => n.measure === m),
      chords: chords.filter(c => c.measure === m)
    })),
    allNotes: notes,
    allChords: chords
  });
}

// Extraire la section piano
const pianoSectionMatch = htmlContent.match(/Piano[^]*?$/);
if (pianoSectionMatch) {
  const pianoHtml = pianoSectionMatch[0];
  const measuresData = extractMeasures(pianoHtml);
  const notes = extractAllNotes(pianoHtml, 'piano', measuresData.map);
  const chords = extractChords(notes);
  
  // Créer un Set pour dédupliquer les numéros de mesures
  const uniqueMeasureNumbers = [...new Set(measuresData.numbers)].sort((a, b) => a - b);
  
  result.tracks.push({
    name: "Piano",
    instrument: "piano",
    tempo: tempo,
    timeSignature: timeSignature,
    measures: uniqueMeasureNumbers.map(m => ({
      number: m,
      notes: notes.filter(n => n.measure === m),
      chords: chords.filter(c => c.measure === m)
    })),
    allNotes: notes,
    allChords: chords
  });
}

// Sauvegarder le résultat en JSON
const outputFile = path.join(__dirname, 'Shake it off.json');
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2), 'utf-8');

console.log(`✅ Fichier JSON créé : ${outputFile}`);
console.log(`📊 Pistes : ${result.tracks.length}`);
result.tracks.forEach(track => {
  console.log(`  - ${track.name}: ${track.measures.length} mesures, ${track.allNotes.length} notes, ${track.allChords.length} accords`);
});
