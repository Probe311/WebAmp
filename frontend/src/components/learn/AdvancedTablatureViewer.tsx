import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, Pause, SkipBack, Repeat, 
  Settings, ZoomIn, ZoomOut, Guitar, 
  ChevronDown, Music2, Gauge, 
  LayoutTemplate
} from 'lucide-react';
import { Slider } from '../Slider';
import { Switch } from '../Switch';
import { Block } from '../Block';

// --- Types ---

interface Measure {
  id: number;
  width: number;
  lines: string[];
  chord?: string;
  marker?: string;
}

interface Track {
  id: string;
  name: string;
  type: 'guitar' | 'bass' | 'drums';
  tuning: string;
  color: string;
  measures: Measure[];
}

interface SongData {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  tracks: Track[];
}

// --- MOCK DATABASE ---
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

// --- Instrument Selector Component ---

interface InstrumentSelectorProps {
  tracks: Track[];
  activeId: string;
  onChange: (id: string) => void;
}

const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({ tracks, activeId, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeTrack = tracks.find(t => t.id === activeId) || tracks[0];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 transition-all min-w-[220px] group shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]"
      >
        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors ${activeTrack.color}`}>
          {activeTrack.type === 'bass' ? <Music2 size={18} /> : <Guitar size={18} />}
        </div>
        <div className="flex flex-col items-start mr-auto">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300">Track</span>
          <span className="text-sm font-bold text-black dark:text-white">{activeTrack.name}</span>
        </div>
        <ChevronDown size={16} className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl">
            {tracks.map(track => (
              <button
                key={track.id}
                onClick={() => { onChange(track.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l-2 ${
                  activeId === track.id 
                    ? `border-orange-500 bg-orange-50 dark:bg-orange-900/20` 
                    : 'border-transparent'
                }`}
              >
                <span className={track.color}>
                  {track.type === 'bass' ? <Music2 size={16} /> : <Guitar size={16} />}
                </span>
                <span className={`text-sm font-medium ${
                  activeId === track.id 
                    ? 'text-black dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {track.name}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// --- Main Component ---

export const AdvancedTablatureViewer: React.FC = () => {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMeasureIndex, setCurrentMeasureIndex] = useState(0);
  const [selectedTrackId, setSelectedTrackId] = useState(SONG_DB.tracks[0].id);
  const [speed, setSpeed] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);
  const [loopRange, setLoopRange] = useState<[number, number] | null>(null);
  const [zoom, setZoom] = useState(1);
  const [showChords, setShowChords] = useState(true);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Derived Data
  const currentTrack = useMemo(() => 
    SONG_DB.tracks.find(t => t.id === selectedTrackId) || SONG_DB.tracks[0], 
    [selectedTrackId]
  );
  
  // Audio Engine Simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      const baseMeasureTime = (240000 / SONG_DB.bpm);
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
  }, [isPlaying, speed, isLooping, loopRange, currentTrack]);

  // Auto-Scroll
  useEffect(() => {
    if (scrollContainerRef.current && isPlaying) {
      const measureHeight = 200 * zoom; 
      const targetScroll = Math.floor(currentMeasureIndex) * measureHeight;
      
      scrollContainerRef.current.scrollTo({
        top: targetScroll - 100,
        behavior: 'smooth'
      });
    }
  }, [Math.floor(currentMeasureIndex), isPlaying, zoom]);

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

  return (
    <div className="h-full flex flex-col p-6  gap-6 font-sans">
      
      {/* 1. Header & Controls Card */}
      <div className="flex flex-col gap-6 shrink-0">
          
          {/* Title Row */}
          <div className="flex justify-between items-end">
             <div>
                <h1 className="text-3xl font-bold text-black dark:text-white">{SONG_DB.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
                  {SONG_DB.artist} 
                  <span className="w-1 h-1 rounded-full bg-gray-400"/>
                  <span className="text-orange-500 font-medium flex items-center gap-1">
                    <Gauge size={12}/> {SONG_DB.bpm} BPM
                  </span>
                </p>
             </div>
             
             {/* Transport Controls */}
             <Block className="p-1.5 inline-block">
               <div className="flex items-center gap-2">
                  <button 
                     onClick={() => setCurrentMeasureIndex(0)}
                     className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                     title="Réinitialiser"
                  >
                     <SkipBack size={20} />
                  </button>
                  <button 
                     onClick={() => setIsPlaying(!isPlaying)}
                     className={`w-14 h-10 flex items-center justify-center rounded-xl transition-all shadow-md ${
                       isPlaying 
                         ? 'bg-orange-500 text-white' 
                         : 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                     }`}
                  >
                     {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
                  </button>
                  <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                  <button 
                     onClick={toggleLoop}
                     className={`h-10 px-3 flex items-center gap-2 rounded-xl text-xs font-bold transition-all border ${
                       isLooping 
                         ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700' 
                         : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                     }`}
                  >
                     <Repeat size={16} />
                     {isLooping ? 'ON' : 'LOOP'}
                  </button>
               </div>
             </Block>
          </div>

          {/* Toolbar Row */}
          <Block className="p-4">
             <div className="flex flex-wrap justify-between items-center gap-4">
                <InstrumentSelector 
                  tracks={SONG_DB.tracks} 
                  activeId={selectedTrackId} 
                  onChange={setSelectedTrackId} 
                />
                
                <div className="flex items-center gap-6">
                   {/* Speed Control */}
                   <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-600">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Speed</span>
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={() => setSpeed(Math.max(0.5, speed - 0.1))} 
                           className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                         >-</button>
                         <span className="text-sm font-mono font-medium text-black dark:text-white w-8 text-center">{speed.toFixed(1)}x</span>
                         <button 
                           onClick={() => setSpeed(Math.min(1.5, speed + 0.1))} 
                           className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                         >+</button>
                      </div>
                   </div>

                   {/* View Options */}
                   <div className="flex items-center gap-4 pl-6 border-l border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2">
                         <div className="flex items-center gap-1">
                           <button
                             onClick={() => setShowChords(!showChords)}
                             className={`w-10 h-5 rounded-full relative transition-colors duration-300 ease-in-out focus:outline-none ${
                               showChords ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                             }`}
                             style={{
                               boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.9)'
                             }}
                           >
                             <div
                               className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-300 ease-in-out bg-white"
                               style={{
                                 transform: showChords ? 'translateX(20px)' : 'translateX(0)',
                                 boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                               }}
                             />
                           </button>
                         </div>
                         <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Chords</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                         <button 
                           onClick={() => setZoom(Math.max(0.5, zoom - 0.1))} 
                           className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                         >
                           <ZoomOut size={16} />
                         </button>
                         <div className="w-20">
                           <Slider 
                             value={zoom * 100} 
                             min={50} 
                             max={150} 
                             onChange={(v) => setZoom(v/100)}
                             orientation="horizontal"
                           />
                         </div>
                         <button 
                           onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} 
                           className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                         >
                           <ZoomIn size={16} />
                         </button>
                      </div>
                      
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                         <Settings size={20} />
                      </button>
                   </div>
                </div>
             </div>
          </Block>
      </div>

      {/* 2. Tab Canvas Card */}
      <Block className="flex-1 p-0 overflow-hidden">
         <div 
           ref={scrollContainerRef}
           className="h-full overflow-y-auto custom-scrollbar scroll-smooth bg-white dark:bg-gray-800"
         >
            <div className="max-w-4xl mx-auto py-10 min-h-full">
               
               <div className="flex items-center justify-between px-6 mb-8 opacity-50">
                  <div className="flex items-center gap-2">
                    <LayoutTemplate size={14} />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Standard View</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Tuning:</span>
                     <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-black dark:text-white">
                        {currentTrack.tuning}
                     </span>
                  </div>
               </div>

               <div className="flex flex-col gap-0 pb-32">
                  {currentTrack.measures.map((measure, index) => {
                     const isActive = index === Math.floor(currentMeasureIndex);
                     const isLoopActive = isLooping && loopRange && index >= loopRange[0] && index <= loopRange[1];
                     const playheadPercent = isActive ? (currentMeasureIndex - Math.floor(currentMeasureIndex)) * 100 : 0;

                     return (
                        <div 
                           key={measure.id} 
                           className={`relative px-6 transition-all duration-300 border-l-[6px] ${
                             isActive 
                               ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-10 scale-[1.01]' 
                               : isLoopActive 
                                  ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-500/30' 
                                  : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
                           }`}
                           style={{ 
                             height: `${200 * zoom}px`, 
                             fontSize: `${zoom}rem`
                           }}
                        >
                           {/* Section Marker */}
                           {measure.marker && (
                              <div className="absolute top-2 left-20 z-10">
                                 <span className="text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-300 dark:border-gray-600 uppercase tracking-wide">
                                    {measure.marker}
                                 </span>
                              </div>
                           )}

                           {/* Chord Display */}
                           {showChords && measure.chord && (
                              <div className="absolute top-4 left-[50%] -translate-x-1/2">
                                 <span className={`text-xl font-bold tracking-tight ${
                                   isActive 
                                     ? 'text-orange-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                                     : 'text-gray-500 dark:text-gray-400'
                                 }`}>
                                    {measure.chord}
                                 </span>
                              </div>
                           )}

                           {/* Measure Number */}
                           <div className={`absolute left-6 top-1/2 -translate-y-1/2 font-mono text-sm font-bold ${
                             isActive 
                               ? 'text-black dark:text-white' 
                               : 'text-gray-400 dark:text-gray-600'
                           }`}>
                              {measure.id}
                           </div>

                           {/* Tab Lines */}
                           <div className="h-full flex flex-col justify-center ml-16 relative">
                              {measure.lines.map((line, lineIdx) => (
                                 <div key={lineIdx} className="font-mono text-gray-600 dark:text-gray-500 whitespace-pre relative leading-[1.8em] tracking-wide">
                                    {line.split('').map((char, charIdx) => {
                                       const isNote = /[0-9]/.test(char);
                                       const isTech = /[hbp\/~]/.test(char);
                                       const isStruct = /[|eBGD]/.test(char);

                                       let className = "opacity-30"; 
                                       if (isNote) {
                                         className = `font-bold opacity-100 ${
                                           isActive 
                                             ? 'text-black dark:text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.3)]' 
                                             : 'text-gray-700 dark:text-gray-300'
                                         }`;
                                       }
                                       if (isTech) className = "text-cyan-500 dark:text-cyan-400 opacity-100 font-bold italic";
                                       if (isStruct) className = "text-gray-500 dark:text-gray-400 opacity-100";

                                       return <span key={charIdx} className={className}>{char}</span>
                                    })}
                                 </div>
                              ))}

                              {/* Playhead */}
                              {isActive && (
                                 <div 
                                    className="absolute top-6 bottom-6 w-0.5 bg-orange-500 shadow-[0_0_15px_rgba(245,158,11,1)] z-20 pointer-events-none"
                                    style={{ left: `${15 + (playheadPercent * 0.8)}%` }} 
                                 >
                                    <div className="w-4 h-4 bg-orange-500 rounded-full absolute -top-2 -left-[7px] border-2 border-white dark:border-gray-800 shadow-sm" />
                                 </div>
                              )}
                           </div>
                           
                           {/* Click to Jump */}
                           <div 
                              className="absolute inset-0 cursor-pointer z-0"
                              onClick={() => {
                                 setCurrentMeasureIndex(index);
                                 if (!isPlaying && !isLooping) setIsPlaying(true);
                              }}
                           />
                        </div>
                     );
                  })}
               </div>
               
               <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 font-medium tracking-widest text-sm uppercase">
                  End of Track
               </div>
            </div>
         </div>
      </Block>
    </div>
  );
};

