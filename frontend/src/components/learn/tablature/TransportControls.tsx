import React from 'react';
import { Play, Pause, SkipBack, Repeat } from 'lucide-react';
import { Block } from '../../Block';

interface TransportControlsProps {
  isPlaying: boolean;
  isLooping: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onToggleLoop: () => void;
}

export const TransportControls: React.FC<TransportControlsProps> = ({
  isPlaying,
  isLooping,
  onPlayPause,
  onReset,
  onToggleLoop
}) => {
  return (
    <Block className="p-1.5 inline-block">
      <div className="flex items-center gap-2">
        <button 
          onClick={onReset}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          title="Reset"
        >
          <SkipBack size={20} />
        </button>
        <button 
          onClick={onPlayPause}
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
          onClick={onToggleLoop}
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
  );
};

