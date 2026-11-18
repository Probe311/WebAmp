import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Toggle } from '../../Toggle';

interface ViewOptionsProps {
  showChords: boolean;
  zoom: number;
  onToggleChords: () => void;
  onZoomChange: (zoom: number) => void;
}

export const ViewOptions: React.FC<ViewOptionsProps> = ({
  showChords,
  zoom,
  onToggleChords,
  onZoomChange
}) => {
  return (
    <div className="flex items-center gap-4 pl-6 border-l border-[color:var(--neu-edge)]">
      <div className="flex items-center gap-2">
        <Toggle
          checked={showChords}
          onChange={() => onToggleChords()}
          labelRight="Accords"
          mode="onoff"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))} 
          className="p-1.5 text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)] hover:bg-[color:var(--neu-bg-hollow)] rounded-[var(--td-radius-control)] transition-colors flex-shrink-0"
          aria-label="Zoom arrière"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs font-medium text-[color:var(--neu-text-muted)] min-w-[2.5rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))} 
          className="p-1.5 text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)] hover:bg-[color:var(--neu-bg-hollow)] rounded-[var(--td-radius-control)] transition-colors flex-shrink-0"
          aria-label="Zoom avant"
        >
          <ZoomIn size={16} />
        </button>
      </div>
    </div>
  );
};

