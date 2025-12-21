import React from 'react';
import { TablatureBackground, type TablatureNote } from './TablatureBackground';
import { TablatureNotes } from './TablatureNotes';

export interface Measure {
  id: number;
  width: number;
  lines: string[];
  chord?: string;
  marker?: string;
  notes?: TablatureNote[]; // Notes depuis JSON
}

interface MeasureProps {
  measure: Measure;
  index: number;
  isActive: boolean;
  isLoopActive: boolean;
  playheadPercent: number;
  zoom: number;
  showChords: boolean;
  onMeasureClick: () => void;
}

export const Measure: React.FC<MeasureProps> = ({
  measure,
  index,
  isActive,
  isLoopActive,
  playheadPercent,
  zoom,
  showChords,
  onMeasureClick
}) => {

  return (
    <div 
      className={`relative transition-all duration-300 border-l-[6px] overflow-hidden ${
        isActive 
          ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-10' 
          : isLoopActive 
             ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-500/30' 
             : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50'
      }`}
      style={{ 
        height: `${240 * zoom}px`, 
        fontSize: `${zoom}rem`,
        width: '100%',
        minWidth: '100%',
        maxWidth: '100%',
        overflowX: 'hidden',
        overflowY: 'visible',
        paddingLeft: `${12 * zoom}px`,
        paddingRight: `${12 * zoom}px`,
        marginLeft: '0',
        marginRight: '0'
      }}
    >
      {/* Section Marker - au-dessus de la première ligne, aligné avec le début du contenu de tablature */}
      {measure.marker && (
        <div className="absolute z-10 flex items-center" style={{ 
          top: 'calc(50% - 7em)', // Au-dessus de la première ligne (e) avec marge supplémentaire
          left: 'calc(2rem + 0.25rem)' // Après le label "e" et le premier | (marginLeft 2rem du TablatureBackground + petit offset)
        }}>
          <span className="text-[10px] font-bold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-300 dark:border-gray-600 uppercase tracking-wide">
            {measure.marker}
          </span>
        </div>
      )}

      {/* Chord Display - au-dessus de la première ligne, aligné avec la fin du contenu de tablature */}
      {showChords && measure.chord && (
        <div className="absolute z-10" style={{ 
          top: 'calc(50% - 5.4em)', // Au-dessus de la première ligne
          right: 'calc(2rem + 1rem)' // Aligné avec la fin du contenu (marginRight 2rem du TablatureBackground + offset)
        }}>
          <span className={`text-base font-bold tracking-tight ${
            isActive 
              ? 'text-orange-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
              : 'text-gray-500 dark:text-gray-400'
          }`}>
            {measure.chord}
          </span>
        </div>
      )}

      {/* Measure Number */}
      <div className={`absolute left-2 top-1/2 -translate-y-1/2 font-mono text-sm font-bold z-10 ${
        isActive 
          ? 'text-black dark:text-white' 
          : 'text-gray-400 dark:text-gray-600'
      }`}>
        {measure.id}
      </div>

      {/* Tab Lines avec fond et notes séparés */}
      <div className="h-full flex flex-col justify-center relative overflow-hidden" style={{ minWidth: 0, width: '100%', position: 'relative', marginLeft: '0' }}>
        {/* Fond de tablature (z-index: 0) */}
        <TablatureBackground
          lines={measure.lines}
          isActive={isActive}
          zoom={zoom}
          stringCount={measure.lines.length}
        />

        {/* Notes par-dessus (z-index: 10) */}
        {measure.notes && measure.notes.length > 0 && (
          <TablatureNotes
            notes={measure.notes}
            lines={measure.lines}
            isActive={isActive}
            zoom={zoom}
            playheadPercent={playheadPercent}
            measureWidth={720} // Largeur maximale de la mesure
          />
        )}

        {/* Playhead (z-index: 20) */}
        {isActive && (
          <div 
            className="absolute top-6 bottom-6 w-0.5 bg-orange-500 shadow-[0_0_15px_rgba(245,158,11,1)] z-[20] pointer-events-none"
            style={{ 
              left: `${10 + (playheadPercent / 100) * 85}%`,
              marginLeft: '2rem'
            }} 
          >
            <div className="w-4 h-4 bg-orange-500 rounded-full absolute -top-2 -left-[7px] border-2 border-white dark:border-gray-800 shadow-sm" />
          </div>
        )}
      </div>
      
      {/* Click to Jump */}
      <div 
        className="absolute inset-0 cursor-pointer z-0"
        onClick={onMeasureClick}
      />
    </div>
  );
};

