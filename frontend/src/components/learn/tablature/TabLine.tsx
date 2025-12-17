import React from 'react';

interface TabLineProps {
  line: string;
  isActive: boolean;
}

export const TabLine: React.FC<TabLineProps> = ({ line, isActive }) => {
  return (
    <div className="font-mono text-gray-600 dark:text-gray-500 whitespace-pre relative leading-[1.8em] tracking-wide">
      {line.split('').map((char, charIdx) => {
        const isNote = /[0-9]/.test(char);
        const isTech = /[hbp\/~]/.test(char);
        const isStruct = /[|eBGDACHSK]/.test(char);

        let className = "opacity-30"; 
        if (isNote) {
          className = `font-bold opacity-100 ${
            isActive 
              ? 'text-black dark:text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.3)]' 
              : 'text-gray-700 dark:text-gray-300'
          }`;
        }
        if (isTech) className = "text-cyan-500 dark:text-cyan-400 opacity-100 font-bold italic";
        if (isStruct) className = "text-gray-500 dark:text-gray-400 opacity-100";

        return <span key={charIdx} className={className}>{char}</span>
      })}
    </div>
  );
};

