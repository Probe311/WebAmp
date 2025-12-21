import React from 'react';

export interface TablatureNote {
  string: number; // 1-6 (1=E grave, 6=E aigu)
  fret: number | null; // Position de la frette (0-24) ou null
  x: number; // Position X dans la mesure (en pourcentage 0-100)
  duration?: string;
  technique?: string;
}

interface TablatureBackgroundProps {
  lines: string[];
  isActive: boolean;
  zoom: number;
  stringCount: number;
}

export const TablatureBackground: React.FC<TablatureBackgroundProps> = ({
  lines,
  isActive,
  zoom,
  stringCount
}) => {
  return (
    <div className="absolute inset-0 z-0" style={{ marginLeft: '2rem', width: 'calc(100% - 2rem)', overflow: 'hidden' }}>
      <div className="h-full flex flex-col justify-center">
        {lines.map((line, lineIdx) => {
          // Extraire seulement les tirets et les séparateurs | pour le fond
          // Remplacer les chiffres par des tirets pour créer le fond
          let backgroundLine = line.replace(/[0-9]/g, '-');
          
          // Ajouter un | à la fin si ce n'est pas déjà présent
          if (!backgroundLine.endsWith('|')) {
            backgroundLine += '|';
          }
          
          return (
            <div
              key={lineIdx}
              className="font-mono text-gray-600 dark:text-gray-500 whitespace-pre relative leading-[1.8em] tracking-wide overflow-hidden"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
                whiteSpace: 'pre',
                width: '100%',
                lineHeight: '1.8em',
                maxWidth: '100%'
              }}
            >
              {backgroundLine.split('').map((char, charIdx) => {
                // Inclure E majuscule pour la dernière corde (E grave) - même UI que le reste
                const isStruct = /[|eBGDACHSKE]/.test(char);
                const className = isStruct 
                  ? "text-gray-500 dark:text-gray-400 opacity-100" 
                  : "opacity-30";

                return (
                  <span key={charIdx} className={className} style={{ display: 'inline' }}>
                    {char}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
