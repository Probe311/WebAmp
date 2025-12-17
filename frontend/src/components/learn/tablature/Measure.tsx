import React from 'react';
import { TabLine } from './TabLine';

export interface Measure {
  id: number;
  width: number;
  lines: string[];
  chord?: string;
  marker?: string;
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
          <TabLine key={lineIdx} line={line} isActive={isActive} />
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
        onClick={onMeasureClick}
      />
    </div>
  );
};

