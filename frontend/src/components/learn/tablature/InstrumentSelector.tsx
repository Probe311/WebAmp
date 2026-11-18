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

  const getBorderColor = (color: string) => {
 // Extraire la couleur de la classe Tailwind (ex: "text-[var(--td-danger)]" -> "red-500")
    if (color.includes('red')) return 'border-[var(--td-danger)]';
    if (color.includes('orange')) return 'border-orange-500';
    if (color.includes('cyan')) return 'border-cyan-400';
    if (color.includes('purple')) return 'border-purple-400';
 return 'border-[color:var(--neu-accent)]'; // Par défaut
  };

  const getBackgroundColor = (color: string) => {
 // Extraire la couleur de la classe Tailwind pour le background
    if (color.includes('red')) return 'bg-[var(--td-danger)] ';
    if (color.includes('orange')) return 'bg-orange-50 dark:bg-orange-900/20';
    if (color.includes('cyan')) return 'bg-cyan-50 dark:bg-cyan-900/20';
    if (color.includes('purple')) return 'bg-purple-50 dark:bg-purple-900/20';
 return 'bg-[color:var(--neu-accent-soft)] '; // Par défaut
  };

  return (
 <div className="relative">
 <button 
 onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 neu-flat hover:bg-[color:var(--neu-bg-track)] border border-[color:var(--neu-edge)] rounded-[var(--td-radius-well)] px-4 py-2.5 transition-all min-w-[220px] group shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]"
 >
        <div className={`p-2 rounded-[var(--td-radius-control)] bg-[color:var(--neu-bg-track)] group-hover:bg-[color:var(--neu-bg-hollow)] dark:group-hover:bg-[color:var(--neu-bg-hollow)] transition-colors ${activeTrack.color}`}>
 {getIcon(activeTrack.type)}
 </div>
 <div className="flex flex-col items-start mr-auto">
          <span className="text-[10px] text-[color:var(--neu-text-muted)] font-bold uppercase tracking-wider group-hover:text-[color:var(--neu-text-muted)] dark:group-hover:text-[color:var(--neu-text-faint)]">Instrument</span>
          <span className="text-sm font-bold text-[color:var(--neu-text)]">{activeTrack.name}</span>
 </div>
        <ChevronDown size={16} className={`text-[color:var(--neu-text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
 </button>

 {isOpen && (
 <>
 <div 
 className="fixed inset-0 z-40" 
 onClick={() => setIsOpen(false)}
 />
          <div className="absolute top-full mt-2 left-0 w-64 neu-flat border border-[color:var(--neu-edge)] rounded-[var(--td-radius-well)] shadow-2xl z-50 overflow-hidden">
 {tracks.map(track => (
 <button
 key={track.id}
 onClick={() => { onChange(track.id); setIsOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[color:var(--neu-bg-track)] transition-colors border-l-2 ${
 activeId === track.id 
 ? `${getBorderColor(track.color)} ${getBackgroundColor(track.color)}` 
 : 'border-transparent'
 }`}
 >
 <span className={track.color}>
 {getIcon(track.type)}
 </span>
 <span className={`text-sm font-medium ${
 activeId === track.id 
                    ? 'text-[color:var(--neu-text)]' 
                    : 'text-[color:var(--neu-text-muted)]'
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

