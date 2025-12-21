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
    <div className="flex items-center gap-4 pl-6 border-l border-gray-200 dark:border-gray-700">
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
          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          aria-label="Zoom arrière"
        >
          <ZoomOut size={16} />
        </button>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 min-w-[2.5rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button 
          onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))} 
          className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          aria-label="Zoom avant"
        >
          <ZoomIn size={16} />
        </button>
      </div>
    </div>
  );
};

