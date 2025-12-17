import React from 'react';
import { Settings, ZoomIn, ZoomOut } from 'lucide-react';
import { Slider } from '../../Slider';

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
        <button
          onClick={onToggleChords}
          className={`w-10 h-5 rounded-full relative transition-colors duration-300 ease-in-out focus:outline-none ${
            showChords ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
          style={{
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.9)'
          }}
        >
          <div
            className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-300 ease-in-out bg-white"
            style={{
              transform: showChords ? 'translateX(20px)' : 'translateX(0)',
              boxShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        </button>
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Accords</span>
      </div>
      
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))} 
          className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          <ZoomOut size={16} />
        </button>
        <div className="w-20">
          <Slider 
            value={zoom * 100} 
            min={50} 
            max={150} 
            onChange={(v) => onZoomChange(v/100)}
            orientation="horizontal"
          />
        </div>
        <button 
          onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))} 
          className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          <ZoomIn size={16} />
        </button>
      </div>
      
      <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
        <Settings size={20} />
      </button>
    </div>
  );
};

