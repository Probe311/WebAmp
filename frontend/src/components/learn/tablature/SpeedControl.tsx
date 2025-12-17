import React from 'react';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({ speed, onSpeedChange }) => {
  return (
    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-600">
      <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Vitesse</span>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onSpeedChange(Math.max(0.5, speed - 0.1))} 
          className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          -
        </button>
        <span className="text-sm font-mono font-medium text-black dark:text-white w-8 text-center">
          {speed.toFixed(1)}x
        </span>
        <button 
          onClick={() => onSpeedChange(Math.min(1.5, speed + 0.1))} 
          className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          +
        </button>
      </div>
    </div>
  );
};

