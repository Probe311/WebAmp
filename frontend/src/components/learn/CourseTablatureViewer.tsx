import React, { useState, useEffect, useMemo } from 'react';
import { TutorialStep } from '../../data/tutorials';
import { Block } from '../Block';
import { 
  SongHeader, 
  Toolbar, 
  TablatureCanvas,
  Countdown,
  type Track,
  type Measure as MeasureType,
  type TablatureNote
} from './tablature';

// --- Types ---

// Track étendu avec measures pour CourseTablatureViewer
interface ExtendedTrack extends Track {
  measures: MeasureType[];
}

interface SongData {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  tracks: ExtendedTrack[];
}

// Helper pour créer des lignes de tablature avec le bon nombre de tirets (80 pour 720px)
const createTabLine = (string: string, content: string): string => {
  const dashes = '-'.repeat(80);
  const line = `${string} |${dashes}|`;
  // Vérification: la partie entre les | doit faire exactement 80 caractères
  const match = line.match(/\|\s*([^|]+)\s*\|/);
  if (match && match[1].length !== 80) {
    console.warn(`TabLine length mismatch: expected 80, got ${match[1].length}`);
  }
  return line;
};

const createTabLineWithNotes = (string: string, content: string): string => {
  // S'assurer que le contenu ne dépasse pas 80 caractères
  const maxContentLength = 80;
  let finalContent = content;
  
  // Si le contenu est trop long, le tronquer
  if (content.length > maxContentLength) {
    finalContent = content.substring(0, maxContentLength);
  }
  
  // Remplir avec des tirets pour atteindre exactement 80 caractères
  const padding = maxContentLength - finalContent.length;
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  const paddedContent = '-'.repeat(leftPad) + finalContent + '-'.repeat(rightPad);
  
  // Vérification que le contenu fait bien 80 caractères
  if (paddedContent.length !== 80) {
    console.warn(`Padded content length mismatch: expected 80, got ${paddedContent.length}, content: ${finalContent.length}, padding: ${padding}`);
  }
  
  const line = `${string} |${paddedContent}|`;
  const match = line.match(/\|\s*([^|]+)\s*\|/);
  if (match && match[1].length !== 80) {
    console.warn(`TabLineWithNotes length mismatch: expected 80, got ${match[1].length}`);
  }
  
  return line;
};

// --- MOCK DATABASE (fallback) ---
const SONG_DB: SongData = {
  id: "shake-it-off",
  title: "Shake It Off",
  artist: "Taylor Swift",
  bpm: 160,
  tracks: [
    {
      id: "t1",
      name: "Distortion Guitar",
      type: "guitar",
      tuning: "E A D G B E",
      color: "text-orange-500",
      measures: Array.from({ length: 24 }).map((_, i) => {
        // Exemple de notes depuis JSON pour la première mesure
        const notes: TablatureNote[] = i === 0 ? [
          { string: 2, fret: 1, x: 20 }, // B string, fret 1, à 20% de la largeur
          { string: 3, fret: 2, x: 20 }, // G string, fret 2
          { string: 4, fret: 2, x: 20 }, // D string, fret 2
          { string: 5, fret: 0, x: 10 }, // A string, fret 0 (corde à vide)
          { string: 2, fret: 1, x: 50 }, // B string, fret 1, à 50%
          { string: 3, fret: 2, x: 50 }, // G string, fret 2
          { string: 4, fret: 2, x: 50 }, // D string, fret 2
          { string: 5, fret: 0, x: 50 }, // A string, fret 0
        ] : i % 2 === 1 ? [
          { string: 1, fret: 5, x: 20 }, // e string, fret 5
          { string: 2, fret: 5, x: 20 }, // B string, fret 5
          { string: 3, fret: 5, x: 20 }, // G string, fret 5
          { string: 4, fret: 7, x: 20 }, // D string, fret 7
          { string: 5, fret: 7, x: 20 }, // A string, fret 7
        ] : [];

        return {
          id: i + 1,
          width: 1,
          chord: i % 4 === 0 ? "Am" : i % 4 === 1 ? "C" : "G",
          marker: i === 0 ? "Intro" : i === 4 ? "Verse 1" : i === 8 ? "Chorus" : undefined,
          lines: [
            i % 2 === 0 ? createTabLine("e", "") : createTabLineWithNotes("e", "-------5-5-----5-------5-5-----5-------5-5-----5-------5-5-----5"),
            i % 2 === 0 ? createTabLineWithNotes("B", "-------1-1-----1-------1-1-----1-------1-1-----1-------1-1-----1") : createTabLineWithNotes("B", "-------5-5-----5-------5-5-----5-------5-5-----5-------5-5-----5"),
            i % 2 === 0 ? createTabLineWithNotes("G", "-------2-2-----2-------2-2-----2-------2-2-----2-------2-2-----2") : createTabLineWithNotes("G", "-------5-5-----5-------5-5-----5-------5-5-----5-------5-5-----5"),
            i % 2 === 0 ? createTabLineWithNotes("D", "-------2-2-----2-------2-2-----2-------2-2-----2-------2-2-----2") : createTabLineWithNotes("D", "-------7-7-----7-------7-7-----7-------7-7-----7-------7-7-----7"),
            i % 2 === 0 ? createTabLineWithNotes("A", "-0---0-------0---0---0-------0---0---0-------0---0---0-------0") : createTabLineWithNotes("A", "-7---7-------7---7---7-------7---7---7-------7---7---7-------7"),
            i % 2 === 0 ? createTabLine("E", "") : createTabLine("E", "")
          ],
          notes: notes // Notes depuis JSON
        };
      })
    },
    {
      id: "t2",
      name: "Clean Guitar",
      type: "guitar",
      tuning: "E A D G B E",
      color: "text-cyan-400",
      measures: Array.from({ length: 24 }).map((_, i) => ({
        id: i + 1,
        width: 1,
        lines: [
          createTabLineWithNotes("e", "-------0---------------0---------------0---------------0---------"),
          createTabLineWithNotes("B", "-----1---1-----------1---1-----------1---1-----------1---1-------"),
          createTabLineWithNotes("G", "---2-------2-------2-------2-------2-------2-------2-------2-----"),
          createTabLineWithNotes("D", "-------------2---------------2---------------2---------------2---"),
          createTabLineWithNotes("A", "-0-------------------------------0-------------------------------"),
          createTabLine("E", "")
        ]
      }))
    },
    {
      id: "t3",
      name: "Bass",
      type: "bass",
      tuning: "E A D G",
      color: "text-purple-400",
      measures: Array.from({ length: 24 }).map((_, i) => ({
        id: i + 1,
        width: 1,
        lines: [
          createTabLine("G", ""),
          createTabLine("D", ""),
          createTabLineWithNotes("A", "-0-0-0-0-3-3-3-3-----------------0-0-0-0-3-3-3-3-----------------"),
          createTabLineWithNotes("E", "-----------------3-3-3-3-3-3-3-3-----------------3-3-3-3-3-3-3-3-")
        ]
      }))
    }
  ]
};

// --- Helpers ---

const normalizeSlug = (value: string | undefined) =>
  (value || 'shake-it-off')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'shake-it-off';

// Fonction de conversion du format JSON au format attendu par les composants
interface JsonTablatureNote {
  measure: number;
  position: number;
  string: number;
  fret: number | null;
  x: number; // Position X en pixels absolus
  y: number;
}

interface JsonTablatureMeasure {
  number: number;
  notes: JsonTablatureNote[];
  chords: any[];
}

interface JsonTablatureTrack {
  name: string;
  instrument: string;
  tuning: string[]; // Array de strings
  tempo: number;
  timeSignature: string;
  measures: JsonTablatureMeasure[];
}

interface JsonTablatureData {
  title: string;
  artist: string;
  tracks: JsonTablatureTrack[];
}

/**
 * Convertit le format JSON de tablature au format attendu par les composants
 */
function convertJsonTablatureToSongData(jsonData: JsonTablatureData): SongData {
  // Convertir les tracks
  const tracks: ExtendedTrack[] = jsonData.tracks.map((track, trackIndex) => {
    // Convertir tuning de array à string
    let tuningString: string;
    if (Array.isArray(track.tuning)) {
      tuningString = track.tuning.join(' ');
    } else if (typeof track.tuning === 'string') {
      tuningString = track.tuning;
    } else {
      // Fallback sur un tuning par défaut (guitar standard)
      tuningString = 'E A D G B E';
      console.warn(`Tuning manquant pour la track "${track.name}", utilisation du tuning par défaut`);
    }

    // Convertir les mesures
    const measures: MeasureType[] = track.measures.map((measure) => {
      // Convertir les notes: x en pixels absolus → pourcentage (0-100)
      // On suppose que la largeur d'une mesure est d'environ 1250px (basé sur les valeurs x du JSON)
      const measureWidth = 1250; // Largeur approximative d'une mesure en pixels
      
      const convertedNotes: TablatureNote[] = measure.notes
        .filter((note) => note.fret !== null) // Filtrer les notes avec fret null
        .map((note) => ({
          string: note.string,
          fret: note.fret,
          x: (note.x / measureWidth) * 100, // Convertir pixels → pourcentage
        }));

      // Générer les lignes de tablature si elles n'existent pas
      // On crée des lignes vides avec 80 tirets
      // S'assurer que tuningString est une chaîne valide avant d'appeler split()
      const defaultLabels = ['E', 'A', 'D', 'G', 'B', 'E'];
      const stringLabels = (tuningString && typeof tuningString === 'string' && tuningString.trim().length > 0) 
        ? tuningString.split(' ').reverse() 
        : defaultLabels; // Inverser pour avoir e, B, G, D, A, E
      const lines = stringLabels.map((label) => createTabLine(label || 'E', ''));

      // Extraire le chord du premier chord si disponible
      // Pour l'instant, on ne convertit pas les frets en nom d'accord
      // On laisse undefined pour que les accords soient gérés par le système de notes
      const chord = undefined; // Les accords seront déterminés par les notes dans la mesure

      return {
        id: measure.number,
        width: 1,
        lines,
        chord,
        notes: convertedNotes.length > 0 ? convertedNotes : undefined,
      };
    });

    // Déterminer le type d'instrument
    let instrumentType: 'guitar' | 'bass' | 'drums' | 'piano' = 'guitar';
    if (track.instrument === 'electricGuitar' || track.instrument === 'guitar') {
      instrumentType = 'guitar';
    } else if (track.instrument === 'piano') {
      instrumentType = 'piano';
    } else if (track.instrument === 'bass') {
      instrumentType = 'bass';
    } else if (track.instrument === 'drums' || track.instrument === 'drum' || track.name.toLowerCase().includes('drum')) {
      instrumentType = 'drums';
    }

    // Assigner une couleur selon le type d'instrument
    let trackColor: string;
    if (instrumentType === 'drums') {
      trackColor = 'text-red-500'; // Couleur rouge pour les drums
    } else {
      trackColor = trackIndex === 0 ? 'text-orange-500' : 
                   trackIndex === 1 ? 'text-cyan-400' : 'text-purple-400';
    }

    return {
      id: `t${trackIndex + 1}`,
      name: track.name,
      type: instrumentType,
      tuning: tuningString,
      color: trackColor,
      measures,
    };
  });

  return {
    id: normalizeSlug(jsonData.title),
    title: jsonData.title,
    artist: jsonData.artist,
    bpm: jsonData.tracks[0]?.tempo || 160,
    tracks,
  };
}

// Exporter la fonction de conversion pour utilisation externe
export { convertJsonTablatureToSongData };

// --- Main Component ---

interface CourseTablatureViewerProps {
  step: TutorialStep;
  courseTitle?: string;
}

export const CourseTablatureViewer: React.FC<CourseTablatureViewerProps> = ({ step, courseTitle }) => {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMeasureIndex, setCurrentMeasureIndex] = useState(0);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [speed, setSpeed] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);
  const [loopRange, setLoopRange] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showChords, setShowChords] = useState(true);
  const [songData, setSongData] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [pendingPlay, setPendingPlay] = useState(false);
  const [scrollToTop, setScrollToTop] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); // Pour savoir si on a déjà commencé la lecture
  const [noTablatureData, setNoTablatureData] = useState(false); // Indique qu'aucun JSON valide n'a été trouvé

  // Derived Data
  const currentTrack = useMemo(() => 
    songData ? (songData.tracks.find(t => t.id === selectedTrackId) || songData.tracks[0]) : null, 
    [selectedTrackId, songData]
  );

  // Charger les données depuis step.description (JSON de Supabase)
  useEffect(() => {
    setLoading(true);
    setNoTablatureData(false);
    setSongData(null); // Réinitialiser les données
    
    // Utiliser un délai minimal pour éviter le flash du loader
    const loadData = async () => {
      const startTime = Date.now();
      const minLoadTime = 300; // Délai minimal de 300ms pour le loader
      
      try {
        // Essayer de parser le JSON depuis step.description
        if (step.description) {
          let jsonData: JsonTablatureData | null = null;
          
          // Le description peut être :
          // 1. Un JSON direct (cas le plus courant depuis Supabase)
          // 2. Un JSON dans un bloc [html]...[/html]
          // 3. Du texte avec du JSON quelque part
          
          // Essayer de parser directement
          try {
            jsonData = JSON.parse(step.description);
          } catch (e) {
            // Si ça échoue, chercher un bloc JSON dans le texte
            // Chercher un objet JSON qui commence par { et se termine par }
            // On cherche le plus grand objet JSON possible
            const jsonMatch = step.description.match(/\{[\s\S]*"tracks"[\s\S]*\}/);
            if (jsonMatch) {
              try {
                jsonData = JSON.parse(jsonMatch[0]);
              } catch (e2) {
                // Si ça échoue encore, essayer de trouver n'importe quel objet JSON
                const anyJsonMatch = step.description.match(/\{[\s\S]*\}/);
                if (anyJsonMatch) {
                  try {
                    jsonData = JSON.parse(anyJsonMatch[0]);
                  } catch (e3) {
                    console.warn('Impossible de parser le JSON depuis step.description:', e3);
                  }
                }
              }
            }
          }
          
          if (jsonData && jsonData.title && jsonData.tracks && Array.isArray(jsonData.tracks)) {
            // Convertir le JSON au format attendu
            const convertedData = convertJsonTablatureToSongData(jsonData);
            
            // Attendre le délai minimal si nécessaire
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadTime - elapsedTime);
            
            await new Promise(resolve => setTimeout(resolve, remainingTime));
            
            setSongData(convertedData);
            setSelectedTrackId(convertedData.tracks[0]?.id || null);
            setNoTablatureData(false);
          } else {
            // Aucun JSON valide trouvé, afficher le message "bientôt disponible"
            console.warn('JSON invalide ou format incorrect, tablature bientôt disponible');
            
            // Attendre le délai minimal si nécessaire
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadTime - elapsedTime);
            
            await new Promise(resolve => setTimeout(resolve, remainingTime));
            
            setSongData(null);
            setSelectedTrackId(null);
            setNoTablatureData(true);
          }
        } else {
          // Pas de description, afficher le message "bientôt disponible"
          
          // Attendre le délai minimal si nécessaire
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, minLoadTime - elapsedTime);
          
          await new Promise(resolve => setTimeout(resolve, remainingTime));
          
          setSongData(null);
          setSelectedTrackId(null);
          setNoTablatureData(true);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de tablature:', error);
        // Aucun JSON valide trouvé, afficher le message "bientôt disponible"
        
        // Attendre le délai minimal si nécessaire
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);
        
        await new Promise(resolve => setTimeout(resolve, remainingTime));
        
        setSongData(null);
        setSelectedTrackId(null);
        setNoTablatureData(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [step.description]);
  
  // Audio Engine Simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying && currentTrack && currentTrack.measures.length > 0 && songData) {
      const baseMeasureTime = (240000 / songData.bpm);
      const stepTime = (baseMeasureTime / 16) / speed;

      interval = setInterval(() => {
        setCurrentMeasureIndex(prev => {
          const currentMeasure = Math.floor(prev);
          const positionInMeasure = prev - currentMeasure;
          const nextPosition = positionInMeasure + (1/16);
          
          // Si on atteint ou dépasse la fin de la mesure actuelle (position >= 1)
          if (nextPosition >= 1) {
            const nextMeasure = currentMeasure + 1;
            
            if (isLooping && loopRange) {
              if (nextMeasure > loopRange[1]) return loopRange[0];
            }

            // Arrêter la lecture si on atteint ou dépasse la fin de la piste
            // S'assurer qu'on ne dépasse jamais la dernière mesure
            if (nextMeasure >= currentTrack.measures.length || currentTrack.measures.length === 0) {
              setIsPlaying(false);
              setHasStarted(false);
              // Retourner à la fin de la dernière mesure
              // Utiliser 0.999 au lieu de 1.0 pour éviter que Math.floor dépasse
              const lastMeasureIndex = Math.max(0, currentTrack.measures.length - 1);
              return lastMeasureIndex + 0.999; // Position à la fin, mais dans les limites
            }
            
            // Passer à la mesure suivante, en commençant à 0
            return nextMeasure;
          }
          
          // Vérifier qu'on ne dépasse pas la fin de la dernière mesure
          const maxIndex = currentTrack.measures.length - 1;
          if (currentMeasure > maxIndex) {
            setIsPlaying(false);
            setHasStarted(false);
            return maxIndex + 0.999; // Fin de la dernière mesure, dans les limites
          }
          
          // Limiter la position dans la mesure actuelle si on est à la dernière mesure
          if (currentMeasure === maxIndex && nextPosition >= 1.0) {
            setIsPlaying(false);
            setHasStarted(false);
            return maxIndex + 0.999; // Fin de la dernière mesure
          }
          
          return currentMeasure + nextPosition;
        });
      }, stepTime);
    } else if (isPlaying && currentTrack && currentTrack.measures.length === 0) {
      // Arrêter immédiatement si la piste est vide
      setIsPlaying(false);
      setHasStarted(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, isLooping, loopRange, currentTrack, songData?.bpm]);

  // Handlers
  const toggleLoop = () => {
    if (!isLooping) {
      const currentInt = Math.floor(currentMeasureIndex);
      setLoopRange([currentInt, currentInt]);
      setIsLooping(true);
    } else {
      setIsLooping(false);
      setLoopRange(null);
    }
  };

  const handlePlayPause = () => {
    if (!isPlaying) {
      // Si on n'a pas encore commencé, déclencher le countdown et réinitialiser
      if (!hasStarted) {
        setPendingPlay(true);
        setShowCountdown(true);
        setCurrentMeasureIndex(0);
      } else {
        // Si on reprend après une pause, reprendre où on était sans countdown
        setIsPlaying(true);
      }
    } else {
      // Si on est déjà en lecture, simplement mettre en pause
      setIsPlaying(false);
    }
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    if (pendingPlay) {
      setPendingPlay(false);
      setHasStarted(true);
      setIsPlaying(true);
    }
  };

  const handleMeasureClick = (index: number) => {
    setCurrentMeasureIndex(index);
    if (!isPlaying && !isLooping) {
      setHasStarted(false); // Nouvelle position = nouveau démarrage
      setPendingPlay(true);
      setShowCountdown(true);
    }
  };

  // Afficher le loader pendant le chargement
  if (loading) {
    return (
      <div className="mt-4">
        <Block className="p-4">
          <div className="text-center text-gray-600 dark:text-gray-400">
            Chargement de la tablature...
          </div>
        </Block>
      </div>
    );
  }

  // Après le chargement, vérifier si on a des données
  // Si pas de données valides, afficher le message "bientôt disponible"
  if (!loading && (noTablatureData || !songData)) {
    return (
      <div className="mt-4">
        <Block className="p-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Tablature bientôt disponible
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              La tablature pour ce cours est en cours de préparation.
            </div>
          </div>
        </Block>
      </div>
    );
  }

  // Si on a des données mais pas de piste sélectionnée
  if (!currentTrack || !selectedTrackId) {
    return (
      <div className="mt-4">
        <Block className="p-4">
          <div className="text-center text-gray-600 dark:text-gray-400">
            Aucune piste disponible
          </div>
        </Block>
      </div>
    );
  }

  // Vérification finale pour TypeScript
  if (!songData) {
    return null;
  }

  return (
    <div className="h-full flex flex-col gap-6 font-sans mt-4">
      <Countdown 
        isVisible={showCountdown} 
        onComplete={handleCountdownComplete}
      />
      
      {/* 1. Header & Controls Card */}
      <div className="flex flex-col gap-6 shrink-0">
          
          {/* Title Row */}
          <SongHeader
            title={songData.title}
            artist={songData.artist}
            bpm={songData.bpm}
            isPlaying={isPlaying}
            isLooping={isLooping}
            onPlayPause={handlePlayPause}
            onReset={() => {
              setCurrentMeasureIndex(0);
              setIsPlaying(false);
              setHasStarted(false);
              setScrollToTop(true);
              // Réinitialiser le flag après un court délai
              setTimeout(() => setScrollToTop(false), 100);
            }}
            onToggleLoop={toggleLoop}
          />

          {/* Toolbar Row */}
          <Toolbar
            tracks={songData.tracks}
            selectedTrackId={selectedTrackId}
            speed={speed}
            showChords={showChords}
            zoom={zoom}
            onTrackChange={setSelectedTrackId}
            onSpeedChange={setSpeed}
            onToggleChords={() => setShowChords(!showChords)}
            onZoomChange={setZoom}
          />
      </div>

      {/* 2. Tab Canvas Card */}
      <TablatureCanvas
        measures={currentTrack.measures}
        currentTrack={currentTrack}
        currentMeasureIndex={currentMeasureIndex}
        isLooping={isLooping}
        loopRange={loopRange}
        zoom={zoom}
        showChords={showChords}
        isPlaying={isPlaying}
        onMeasureClick={handleMeasureClick}
        scrollToTop={scrollToTop}
      />
    </div>
  );
};
