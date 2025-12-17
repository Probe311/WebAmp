/**
 * ABC Converter Utility
 * 
 * Utilitaire pour la conversion entre format ABC et tablatures
 * Support format ABC via abcjs
 * Génération MIDI depuis ABC
 * 
 * Section : "6. Apprentissage et Pédagogie (Learn)"
 */

import type { Tablature, TabMeasure, TabNote } from '../components/TabViewer';

// Types pour le format ABC
export interface ABCNote {
  pitch: string;  // "C", "D", "E", etc.
  octave?: number;
  duration?: string;  // "1/4", "1/8", etc.
  accidental?: '#' | 'b' | 'n';
}

export interface ABCMeasure {
  notes: ABCNote[];
  timeSignature?: string;
}

export interface ABCScore {
  title?: string;
  composer?: string;
  key?: string;  // "C", "Am", etc.
  time?: string;  // "4/4", "3/4", etc.
  measures: ABCMeasure[];
}

/**
 * Convertit une tablature en format ABC
 */
export function tablatureToABC(tablature: Tablature): string {
  const lines: string[] = [];

  // Header ABC
  lines.push('X:1');
  if (tablature.title) {
    lines.push(`T:${tablature.title}`);
  }
  if (tablature.artist) {
    lines.push(`C:${tablature.artist}`);
  }

  // Time signature
  const firstMeasure = tablature.measures[0];
  if (firstMeasure?.timeSignature) {
    lines.push(`M:${firstMeasure.timeSignature}`);
  } else {
    lines.push('M:4/4');
  }

  // Key (par défaut C majeur)
  lines.push('K:C');

  // Notes
  const abcNotes: string[] = [];
  
  tablature.measures.forEach((measure, measureIndex) => {
    measure.notes.forEach(note => {
      // Convertir fret + string en note ABC
      const tuning = tablature.tuning || ['E', 'A', 'D', 'G', 'B', 'E'];
      const openNote = tuning[note.string - 1];
      const noteName = getNoteFromFret(openNote, note.fret);
      
      // Durée
      const duration = note.duration || 'q';
      const abcDuration = convertDurationToABC(duration);
      
      abcNotes.push(`${noteName}${abcDuration}`);
    });

    // Séparateur de mesure
    if (measureIndex < tablature.measures.length - 1) {
      abcNotes.push('|');
    }
  });

  lines.push(abcNotes.join(' '));
  lines.push('');

  return lines.join('\n');
}

/**
 * Convertit le format ABC en tablature
 */
export function abcToTablature(abcString: string, tuning: string[] = ['E', 'A', 'D', 'G', 'B', 'E']): Tablature {
  // Parser le format ABC (simplifié)
  const lines = abcString.split('\n');
  const tablature: Tablature = {
    measures: [],
    tuning,
  };

  let currentMeasure: TabMeasure = { notes: [] };
  let timeSignature: string | undefined;

  // Parser le header
  lines.forEach(line => {
    if (line.startsWith('T:')) {
      tablature.title = line.substring(2).trim();
    } else if (line.startsWith('C:')) {
      tablature.artist = line.substring(2).trim();
    } else if (line.startsWith('M:')) {
      timeSignature = line.substring(2).trim();
    } else if (line.startsWith('K:')) {
      // Key signature (ignoré pour l'instant)
    } else if (line.trim() && !line.startsWith('X:') && !line.startsWith('V:')) {
      // Parser les notes
      const notes = parseABCNotes(line, tuning);
      notes.forEach(note => {
        currentMeasure.notes.push(note);
      });
    }
  });

  if (timeSignature) {
    currentMeasure.timeSignature = timeSignature;
  }

  if (currentMeasure.notes.length > 0) {
    tablature.measures.push(currentMeasure);
  }

  return tablature;
}

/**
 * Génère du MIDI depuis le format ABC
 * Utilise abcjs de façon dynamique pour éviter de le charger côté serveur/test inutilement.
 */
export async function abcToMIDI(abcString: string): Promise<Blob> {
  // Validation de base pour éviter des appels inutiles
  const validation = validateABC(abcString)
  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid ABC string')
  }

  try {
    // Import dynamique pour ne charger abcjs que dans le navigateur
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - abcjs n'a pas forcément de typings complets
    const ABCJS = await import('abcjs')

    if (!ABCJS || !ABCJS.synth || typeof ABCJS.synth.getMidiFile !== 'function') {
      throw new Error('abcjs.synth.getMidiFile is not available')
    }

    // getMidiFile peut renvoyer soit une data URI, soit un buffer binaire selon la version/options
    const midiResult = ABCJS.synth.getMidiFile(abcString, {
      midiOutputType: 'binary',
    })

    // Si c’est une data URI
    if (typeof midiResult === 'string' && midiResult.startsWith('data:audio/midi')) {
      const base64 = midiResult.split(',')[1] || ''
      const binary = atob(base64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }
      return new Blob([bytes], { type: 'audio/midi' })
    }

    // Si c’est déjà un buffer/Uint8Array ou similaire
    if (midiResult instanceof Uint8Array || ArrayBuffer.isView(midiResult)) {
      return new Blob([midiResult], { type: 'audio/midi' })
    }

    // Fallback : tenter de sérialiser en Blob brut
    return new Blob([midiResult], { type: 'audio/midi' })
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error('Failed to generate MIDI from ABC')
  }
}

/**
 * Convertit une note ABC en note de tablature
 */
function parseABCNotes(abcLine: string, tuning: string[]): TabNote[] {
  const notes: TabNote[] = [];
  
  // Parser simplifié (nécessite une implémentation plus robuste)
  const notePattern = /([A-G][#b]?)(\d*)/g;
  let match;
  
  while ((match = notePattern.exec(abcLine)) !== null) {
    const noteName = match[1];
    const octave = match[2] ? parseInt(match[2]) : 4;
    
    // Trouver la meilleure position sur la guitare
    const { string, fret } = findBestPosition(noteName, octave, tuning);
    
    notes.push({
      string,
      fret,
      duration: 'q', // Par défaut
    });
  }
  
  return notes;
}

/**
 * Trouve la meilleure position d'une note sur la guitare
 */
function findBestPosition(noteName: string, octave: number, tuning: string[]): { string: number; fret: number } {
  // Mapping des notes
  const noteMap: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4,
    'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11,
  };

  const targetNote = noteMap[noteName] + (octave * 12);
  
  // Chercher la meilleure position
  let bestString = 1;
  let bestFret = 0;
  let minFret = Infinity;

  tuning.forEach((openNote, stringIndex) => {
    const openNoteValue = noteMap[openNote] + 4 * 12; // Octave 4 par défaut
    const fret = targetNote - openNoteValue;
    
    if (fret >= 0 && fret < 24 && fret < minFret) {
      minFret = fret;
      bestString = stringIndex + 1;
      bestFret = fret;
    }
  });

  return { string: bestString, fret: bestFret };
}

/**
 * Convertit un fret + string en note ABC
 */
function getNoteFromFret(openNote: string, fret: number): string {
  const noteMap: Record<string, number> = {
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4,
    'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11,
  };

  const openNoteValue = noteMap[openNote] || 0;
  const targetNote = (openNoteValue + fret) % 12;
  const octave = Math.floor((openNoteValue + fret) / 12) + 4;

  // Trouver le nom de la note
  const noteNames = Object.keys(noteMap).filter(n => noteMap[n] === targetNote);
  const noteName = noteNames[0] || 'C';

  return `${noteName}${octave}`;
}

/**
 * Convertit une durée en format ABC
 */
function convertDurationToABC(duration: string): string {
  const durationMap: Record<string, string> = {
    'w': '1',      // whole
    'h': '1/2',   // half
    'q': '1/4',   // quarter
    '8': '1/8',   // eighth
    '16': '1/16', // sixteenth
  };

  return durationMap[duration] || '1/4';
}

/**
 * Valide une chaîne ABC
 */
export function validateABC(abcString: string): { valid: boolean; error?: string } {
  if (!abcString || abcString.trim().length === 0) {
    return { valid: false, error: 'ABC string is empty' };
  }

  // Vérifier la présence d'un header X:
  if (!abcString.includes('X:')) {
    return { valid: false, error: 'ABC string must start with X: (reference number)' };
  }

  // Vérifier la présence d'une clé K:
  if (!abcString.includes('K:')) {
    return { valid: false, error: 'ABC string must include K: (key signature)' };
  }

  return { valid: true };
}

export default {
  tablatureToABC,
  abcToTablature,
  abcToMIDI,
  validateABC,
};

