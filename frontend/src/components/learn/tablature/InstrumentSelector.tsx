import React, { useState } from 'react';
import { Guitar, Piano, Drum, ChevronDown } from 'lucide-react';
import { Block } from '../../Block';

export interface Track {
  id: string;
  name: string;
  type: 'guitar' | 'bass' | 'drums' | 'piano';
  tuning: string;
  color: string;
}

interface InstrumentSelectorProps {
  tracks: Track[];
  activeId: string;
  onChange: (id: string) => void;
}

export const InstrumentSelector: React.FC<InstrumentSelectorProps> = ({ tracks, activeId, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeTrack = tracks.find(t => t.id === activeId) || tracks[0];

  const getIcon = (type: string) => {
    switch (type) {
      case 'piano':
        return <Piano size={18} />;
      case 'drums':
        return <Drum size={18} />;
      default:
        return <Guitar size={18} />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 transition-all min-w-[220px] group shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]"
      >
        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors ${activeTrack.color}`}>
          {getIcon(activeTrack.type)}
        </div>
        <div className="flex flex-col items-start mr-auto">
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300">Instrument</span>
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
          <div className="absolute top-full mt-2 left-0 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
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
                  {getIcon(track.type)}
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

