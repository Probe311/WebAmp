import React from 'react';

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const SpeedControl: React.FC<SpeedControlProps> = ({ speed, onSpeedChange }) => {
  return (
    <div className="flex items-center gap-3 bg-[color:var(--neu-bg-track)] rounded-[var(--td-radius-well)] px-3 py-2 border border-[color:var(--neu-edge)]">
      <span className="text-xs font-bold text-[color:var(--neu-text-muted)] uppercase tracking-wider">Vitesse</span>
      <div className="flex items-center gap-2">
        <button 
          onClick={() => onSpeedChange(Math.max(0.5, speed - 0.1))} 
          className="text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]"
        >
          -
        </button>
        <span className="text-sm font-mono font-medium text-[color:var(--neu-text)] w-8 text-center">
          {speed.toFixed(1)}x
        </span>
        <button 
          onClick={() => onSpeedChange(Math.min(1.5, speed + 0.1))} 
          className="text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]"
        >
          +
        </button>
      </div>
    </div>
  );
};

