import React from 'react';
import { Block } from '../../Block';
import { InstrumentSelector, Track } from './InstrumentSelector';
import { SpeedControl } from './SpeedControl';
import { ViewOptions } from './ViewOptions';

interface ToolbarProps {
  tracks: Track[];
  selectedTrackId: string;
  speed: number;
  showChords: boolean;
  zoom: number;
  onTrackChange: (id: string) => void;
  onSpeedChange: (speed: number) => void;
  onToggleChords: () => void;
  onZoomChange: (zoom: number) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  tracks,
  selectedTrackId,
  speed,
  showChords,
  zoom,
  onTrackChange,
  onSpeedChange,
  onToggleChords,
  onZoomChange
}) => {
  return (
    <Block className="p-4">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <InstrumentSelector 
          tracks={tracks} 
          activeId={selectedTrackId} 
          onChange={onTrackChange} 
        />
        
        <div className="flex items-center gap-6">
          <SpeedControl speed={speed} onSpeedChange={onSpeedChange} />
          <ViewOptions 
            showChords={showChords}
            zoom={zoom}
            onToggleChords={onToggleChords}
            onZoomChange={onZoomChange}
          />
        </div>
      </div>
    </Block>
  );
};

