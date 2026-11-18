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
          className="w-10 h-10 flex items-center justify-center rounded-[var(--td-radius-well)] hover:bg-[color:var(--neu-bg-hollow)] text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)] transition-colors"
 title="Reset"
 >
 <SkipBack size={20} />
 </button>
 <button 
 onClick={onPlayPause}
 className={`w-14 h-10 flex items-center justify-center rounded-[var(--td-radius-well)] transition-all shadow-md ${
 isPlaying 
 ? 'neu-accent-btn' 
              : 'bg-[color:var(--neu-bg-track)] text-[color:var(--neu-text)] hover:bg-[color:var(--neu-bg-hollow)]'
 }`}
 >
 {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
 </button>
        <div className="w-px h-6 bg-[color:var(--neu-bg-hollow)] mx-1" />
 <button 
 onClick={onToggleLoop}
 className={`h-10 px-3 flex items-center gap-2 rounded-[var(--td-radius-well)] text-xs font-bold transition-all border ${
 isLooping 
 ? 'bg-[color:var(--neu-accent-soft)] text-[color:var(--neu-accent)] border-[color:var(--neu-accent)]/40 ' 
              : 'text-[color:var(--neu-text-muted)] border-transparent hover:text-[color:var(--neu-text)] hover:bg-[color:var(--neu-bg-hollow)]'
 }`}
 >
 <Repeat size={16} />
 {isLooping ? 'ON' : 'LOOP'}
 </button>
 </div>
 </Block>
  );
};

