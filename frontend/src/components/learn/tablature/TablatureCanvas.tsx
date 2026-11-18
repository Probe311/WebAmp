import React, { useRef, useEffect } from 'react';
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
  scrollToTop?: boolean;
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
  onMeasureClick,
  scrollToTop = false
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll vers le haut quand scrollToTop est true
  useEffect(() => {
    if (scrollContainerRef.current && scrollToTop) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [scrollToTop]);

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
    <Block className="flex-1 p-0 overflow-visible">
      <div 
        ref={scrollContainerRef}
        className="h-full overflow-y-auto overflow-x-visible custom-scrollbar scroll-smooth neu-flat"
        style={{ maxHeight: '60vh', overflowX: 'visible' }}
      >
        <div className="w-full py-10 min-h-full" style={{ overflowX: 'hidden' }}>
          <div className="w-full max-w-[720px] mx-auto px-6" style={{ minWidth: 0, overflowX: 'hidden', width: '100%' }}>
          
            <div className="flex items-center justify-end mb-8">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]">Tuning:</span>
                <span className="font-mono text-sm bg-[color:var(--neu-bg-track)] px-2 py-0.5 rounded text-[color:var(--neu-text)]">
                  {currentTrack.tuning}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-0 pb-32 w-full">
            {measures.map((measure, index) => {
              const measureFloor = Math.floor(currentMeasureIndex);
              const isActive = index === measureFloor && index < measures.length;
              const isLoopActive = !!(isLooping && loopRange && index >= loopRange[0] && index <= loopRange[1]);
              const positionInMeasure = currentMeasureIndex - measureFloor;
              const playheadPercent = isActive ? Math.min(100, Math.max(0, positionInMeasure * 100)) : 0;

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
            
            <div className="h-48 flex items-center justify-center text-[color:var(--neu-text-faint)] font-medium tracking-widest text-sm uppercase">
              Fin de la piste
            </div>
          </div>
        </div>
      </div>
    </Block>
  );
};

