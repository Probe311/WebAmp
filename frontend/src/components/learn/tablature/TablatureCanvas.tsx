import React, { useRef, useEffect } from 'react';
import { LayoutTemplate } from 'lucide-react';
import { Block } from '../../Block';
import { Measure } from './Measure';
import type { Measure as MeasureType } from './Measure';

interface TablatureCanvasProps {
  measures: MeasureType[];
  currentTrack: {
    tuning: string;
  };
  currentMeasureIndex: number;
  isLooping: boolean;
  loopRange: [number, number] | null;
  zoom: number;
  showChords: boolean;
  isPlaying: boolean;
  onMeasureClick: (index: number) => void;
}

export const TablatureCanvas: React.FC<TablatureCanvasProps> = ({
  measures,
  currentTrack,
  currentMeasureIndex,
  isLooping,
  loopRange,
  zoom,
  showChords,
  isPlaying,
  onMeasureClick
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <Block className="flex-1 p-0 overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-y-auto custom-scrollbar scroll-smooth bg-white dark:bg-gray-800"
        style={{ maxHeight: '60vh' }}
      >
        <div className="max-w-4xl mx-auto py-10 min-h-full">
          
          <div className="flex items-center justify-between px-6 mb-8 opacity-50">
            <div className="flex items-center gap-2">
              <LayoutTemplate size={14} />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Vue Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">Tuning:</span>
              <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-black dark:text-white">
                {currentTrack.tuning}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0 pb-32">
            {measures.map((measure, index) => {
              const isActive = index === Math.floor(currentMeasureIndex);
              const isLoopActive = isLooping && loopRange && index >= loopRange[0] && index <= loopRange[1];
              const playheadPercent = isActive ? (currentMeasureIndex - Math.floor(currentMeasureIndex)) * 100 : 0;

              return (
                <Measure
                  key={measure.id}
                  measure={measure}
                  index={index}
                  isActive={isActive}
                  isLoopActive={isLoopActive}
                  playheadPercent={playheadPercent}
                  zoom={zoom}
                  showChords={showChords}
                  onMeasureClick={() => onMeasureClick(index)}
                />
              );
            })}
          </div>
          
          <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-600 font-medium tracking-widest text-sm uppercase">
            Fin de la piste
          </div>
        </div>
      </div>
    </Block>
  );
};

