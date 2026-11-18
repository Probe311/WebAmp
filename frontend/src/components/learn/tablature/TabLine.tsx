import React from 'react';

interface TabLineProps {
  line: string;
  isActive: boolean;
}

export const TabLine: React.FC<TabLineProps> = ({ line, isActive }) => {
  return (
    <div 
      className="font-mono text-[color:var(--neu-text-muted)] whitespace-pre relative leading-[1.8em] tracking-wide"
      style={{ 
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
        whiteSpace: 'pre',
        overflow: 'visible',
        width: '100%',
        minWidth: '100%'
      }}
    >
      {line.split('').map((char, charIdx) => {
        const isNote = /[0-9]/.test(char);
        const isTech = /[hbp\/~]/.test(char);
        const isStruct = /[|eBGDACHSK]/.test(char);

        let className = "opacity-30"; 
        if (isNote) {
          className = `font-bold opacity-100 ${
            isActive 
              ? 'text-[color:var(--neu-text)] drop-shadow-[0_0_5px_rgba(0,0,0,0.3)]' 
              : 'text-[color:var(--neu-text)]'
          }`;
        }
        if (isTech) className = "text-[color:var(--neu-accent)] opacity-100 font-bold italic";
        if (isStruct) className = "text-[color:var(--neu-text-muted)] opacity-100";

        return <span key={charIdx} className={className} style={{ display: 'inline' }}>{char}</span>
      })}
    </div>
  );
};

