import React from 'react';
import { Gauge } from 'lucide-react';
import { TransportControls } from './TransportControls';

interface SongHeaderProps {
  title: string;
  artist: string;
  bpm: number;
  isPlaying: boolean;
  isLooping: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onToggleLoop: () => void;
}

export const SongHeader: React.FC<SongHeaderProps> = ({
  title,
  artist,
  bpm,
  isPlaying,
  isLooping,
  onPlayPause,
  onReset,
  onToggleLoop
}) => {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-bold text-black dark:text-white">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1 flex items-center gap-2">
          {artist} 
          <span className="w-1 h-1 rounded-full bg-gray-400"/>
          <span className="text-orange-500 font-medium flex items-center gap-1">
            <Gauge size={12}/> {bpm} BPM
          </span>
        </p>
      </div>
      
      <TransportControls
        isPlaying={isPlaying}
        isLooping={isLooping}
        onPlayPause={onPlayPause}
        onReset={onReset}
        onToggleLoop={onToggleLoop}
      />
    </div>
  );
};

