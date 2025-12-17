import React, { useState, useEffect, useMemo } from 'react';
import { TutorialStep } from '../../data/tutorials';
import { Block } from '../Block';
import { lmsService } from '../../services/lms';
import { 
  SongHeader, 
  Toolbar, 
  TablatureCanvas,
  type Track,
  type Measure as MeasureType
} from './tablature';

// --- Types ---

interface SongData {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  tracks: Track[];
}

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
      measures: Array.from({ length: 24 }).map((_, i) => ({
        id: i + 1,
        width: 1,
        chord: i % 4 === 0 ? "Am" : i % 4 === 1 ? "C" : "G",
        marker: i === 0 ? "Intro" : i === 4 ? "Verse 1" : i === 8 ? "Chorus" : undefined,
        lines: [
          i % 2 === 0 ? "e |---------------------------------|" : "e |-------5-5-----5-------5-5-----5-|",
          i % 2 === 0 ? "B |-------1-1-----1-------1-1-----1-|" : "B |-------5-5-----5-------5-5-----5-|",
          i % 2 === 0 ? "G |-------2-2-----2-------2-2-----2-|" : "G |-------5-5-----5-------5-5-----5-|",
          i % 2 === 0 ? "D |-------2-2-----2-------2-2-----2-|" : "D |-------7-7-----7-------7-7-----7-|",
          i % 2 === 0 ? "A |-0---0-------0---0---0-------0---|" : "A |-7---7-------7---7---7-------7---|",
          i % 2 === 0 ? "E |---------------------------------|" : "E |---------------------------------|"
        ]
      }))
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
          "e |-------0---------------0---------|",
          "B |-----1---1-----------1---1-------|",
          "G |---2-------2-------2-------2-----|",
          "D |-------------2---------------2---|",
          "A |-0-------------------------------|",
          "E |---------------------------------|"
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
          "G |---------------------------------|",
          "D |---------------------------------|",
          "A |-0-0-0-0-3-3-3-3-----------------|",
          "E |-----------------3-3-3-3-3-3-3-3-|"
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

// Convert Supabase JSON (comme docs/tabs/Shake it off.json) vers SongData
function convertSupabaseJsonToSongData(jsonData: any): SongData | null {
  if (!jsonData || !Array.isArray(jsonData.tracks)) return null;

  const title = jsonData.title || 'Tablature';
  const artist = jsonData.artist || '';
  const bpm = jsonData.tracks[0]?.tempo || 120;

  const tracks: Track[] = jsonData.tracks.map((track: any, index: number) => {
    const instrument = (track.instrument || track.type || 'guitar').toLowerCase();
    const type: Track['type'] =
      instrument.includes('drum') ? 'drums' :
      instrument.includes('bass') ? 'bass' :
      instrument.includes('piano') ? 'piano' :
      'guitar';

    const trackId = `t${index + 1}`;

    // Génération de lignes mock à partir du numéro de mesure (fallback si aucune info)
    const buildLines = (measureNum: number): string[] => {
      if (type === 'bass') {
        return measureNum % 2 === 0
          ? [
              "G |---------------------------------|",
              "D |---------------------------------|",
              "A |-3-3-3-3-0-0-0-0-----------------|",
              "E |-----------------0-0-0-0-0-0-0-0-|"
            ]
          : [
              "G |---------------------------------|",
              "D |---------------------------------|",
              "A |-0-0-0-0-3-3-3-3-----------------|",
              "E |-----------------3-3-3-3-3-3-3-3-|"
            ];
      }
      if (type === 'drums') {
        return [
          "C |---------------------------------|",
          "H |---------------------------------|",
          "S |---------------------------------|",
          "K |---------------------------------|"
        ];
      }
      if (type === 'piano') {
        return [
          "RH|--- G ---- B ---- D ---- G ----|",
          "LH|--- A ---- C ---- E ---- A ----|",
          "VL|--------------------------------|",
          "VR|--------------------------------|"
        ];
      }
      // guitare par défaut
      if (measureNum % 4 === 1) {
        return [
          "e |-------0-0-----0-------0-0-----0-|",
          "B |-------1-1-----1-------1-1-----1-|",
          "G |-------2-2-----2-------2-2-----2-|",
          "D |-------2-2-----2-------2-2-----2-|",
          "A |-0---0-------0---0---0-------0---|",
          "E |---------------------------------|"
        ];
      }
      if (measureNum % 4 === 2) {
        return [
          "e |-------0-0-----0-------0-0-----0-|",
          "B |-------1-1-----1-------1-1-----1-|",
          "G |-------0-0-----0-------0-0-----0-|",
          "D |-------2-2-----2-------2-2-----2-|",
          "A |-3---3-------3---3---3-------3---|",
          "E |---------------------------------|"
        ];
      }
      return [
        "e |-------5-5-----5-------5-5-----5-|",
        "B |-------5-5-----5-------5-5-----5-|",
        "G |-------5-5-----5-------5-5-----5-|",
        "D |-------7-7-----7-------7-7-----7-|",
        "A |-7---7-------7---7---7-------7---|",
        "E |---------------------------------|"
      ];
    };

    const measures: MeasureType[] = (track.measures || []).map((measure: any, mIndex: number) => {
      const measureNum = measure.number || mIndex + 1;
      return {
        id: measureNum,
        width: 1,
        chord: Array.isArray(measure.chords) && measure.chords.length > 0 ? measure.chords[0] : undefined,
        marker: measureNum === 1 ? "Intro" : measureNum === 5 ? "Verse 1" : measureNum === 9 ? "Chorus" : undefined,
        lines: buildLines(measureNum)
      };
    });

    return {
      id: trackId,
      name: track.name || `Track ${index + 1}`,
      type,
      tuning: Array.isArray(track.tuning) ? track.tuning.join(' ') : (track.tuning || "E A D G B E"),
      color: index === 0 ? "text-orange-500" : index === 1 ? "text-cyan-400" : "text-purple-400",
      measures
    };
  });

  return {
    id: normalizeSlug(title),
    title,
    artist,
    bpm,
    tracks
  };
}

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
  const [songData, setSongData] = useState<SongData>(SONG_DB);
  const [loading, setLoading] = useState(false);

  // Derived Data
  const currentTrack = useMemo(() => 
    songData.tracks.find(t => t.id === selectedTrackId) || songData.tracks[0], 
    [selectedTrackId, songData]
  );

  // Charger depuis Supabase si disponible, sinon fallback mock
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const slug = normalizeSlug(courseTitle || step?.title);
        const data = await lmsService.getTablature(slug);
        const parsed = convertSupabaseJsonToSongData(data);
        if (parsed) {
          setSongData(parsed);
          setSelectedTrackId(parsed.tracks[0]?.id || null);
          setLoading(false);
          return;
        }
      } catch (err) {
        // fallback handled below
      }
      setSongData(SONG_DB);
      setSelectedTrackId(SONG_DB.tracks[0].id);
      setLoading(false);
    };
    load();
  }, [courseTitle, step?.title]);
  
  // Audio Engine Simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying && currentTrack) {
      const baseMeasureTime = (240000 / songData.bpm);
      const stepTime = (baseMeasureTime / 16) / speed;

      interval = setInterval(() => {
        setCurrentMeasureIndex(prev => {
          const next = prev + (1/16);
          
          if (isLooping && loopRange) {
             if (next >= loopRange[1] + 1) return loopRange[0];
          }

          if (next >= currentTrack.measures.length) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }, stepTime);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, isLooping, loopRange, currentTrack, songData.bpm]);

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

  const handleMeasureClick = (index: number) => {
    setCurrentMeasureIndex(index);
    if (!isPlaying && !isLooping) setIsPlaying(true);
  };

  if (!songData || !currentTrack || !selectedTrackId || loading) {
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

  return (
    <div className="h-full flex flex-col gap-6 font-sans mt-4">
      
      {/* 1. Header & Controls Card */}
      <div className="flex flex-col gap-6 shrink-0">
          
          {/* Title Row */}
          <SongHeader
            title={songData.title}
            artist={songData.artist}
            bpm={songData.bpm}
            isPlaying={isPlaying}
            isLooping={isLooping}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onReset={() => setCurrentMeasureIndex(0)}
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
      />
    </div>
  );
};
