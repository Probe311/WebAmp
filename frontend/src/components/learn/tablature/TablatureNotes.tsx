import React, { useMemo } from 'react';
import type { TablatureNote } from './TablatureBackground';

interface TablatureNotesProps {
  notes: TablatureNote[];
  lines: string[];
  isActive: boolean;
  zoom: number;
  playheadPercent: number;
  measureWidth: number; // Largeur de la mesure en pixels
}

export const TablatureNotes: React.FC<TablatureNotesProps> = ({
  notes,
  lines,
  isActive,
  zoom,
  playheadPercent,
  measureWidth
}) => {
  // Calculer la position de chaque note basée sur sa position X dans la ligne
  const notePositions = useMemo(() => {
    // Filtrer les notes avec fret null
    return notes
      .filter((note) => note.fret !== null)
      .map((note) => {
      const lineIndex = note.string - 1; // Convertir string (1-6) en index (0-5)
      const line = lines[lineIndex];
      if (!line) return { x: '0%', y: '0%', note, charIndex: 0 };

      // Trouver la position du premier |
      const firstPipeIndex = line.indexOf('|');
      if (firstPipeIndex === -1) return { x: '0%', y: '0%', note, charIndex: 0 };

      // Calculer la largeur du contenu entre les |
      const lastPipeIndex = line.lastIndexOf('|');
      const contentLength = lastPipeIndex - firstPipeIndex - 1;
      
      // Si note.x est fourni, l'utiliser directement (en pourcentage de la largeur du contenu)
      let xPercent = note.x || 0;
      
      // Si x n'est pas fourni, chercher le chiffre correspondant dans la ligne
      let charIndex = firstPipeIndex + 1 + Math.round((xPercent / 100) * contentLength);
      if (!note.x && line && note.fret !== null) {
        // Chercher toutes les occurrences de chiffres dans la ligne correspondant au fret
        const fretStr = note.fret.toString();
        const digitMatches = Array.from(line.matchAll(new RegExp(`\\b${fretStr}\\b`, 'g')));
        // Utiliser la première occurrence correspondant au fret
        if (digitMatches.length > 0) {
          const match = digitMatches[0];
          charIndex = match.index || charIndex;
          // Calculer le pourcentage basé sur la position réelle
          xPercent = ((charIndex - firstPipeIndex - 1) / contentLength) * 100;
        }
      } else {
        // Calculer l'index du caractère basé sur le pourcentage
        charIndex = firstPipeIndex + 1 + Math.round((xPercent / 100) * contentLength);
      }
      
      // Convertir le pourcentage en position CSS relative au conteneur
      // Le conteneur a une marge gauche de 4rem (ml-16)
      // La zone de contenu commence après le label de corde et le premier |
      // On utilise le pourcentage directement sur la largeur du contenu entre les |
      const charPositionInContent = charIndex - firstPipeIndex - 1;
      const contentPercent = (charPositionInContent / contentLength) * 100;
      
      // La zone utilisable commence après le label (environ 10% de la largeur totale avec marge réduite)
      // et fait 85% de la largeur totale
      const xPosition = `${10 + (contentPercent / 100) * 85}%`;
      
      // Position Y basée sur la ligne (string)
      // Le conteneur utilise flex avec justify-center et leading-[1.8em]
      // On calcule la position relative au centre du conteneur
      const lineHeight = 1.8; // em - correspond au leading-[1.8em] du fond
      const totalLines = lines.length;
      const totalHeight = totalLines * lineHeight;
      const lineCenter = lineIndex * lineHeight + (lineHeight / 2);
      // Position relative au centre (0 = centre, négatif = au-dessus, positif = en-dessous)
      const yPosition = `${(lineCenter - totalHeight / 2)}em`;

      return { x: xPosition, y: yPosition, note, charIndex };
    });
  }, [notes, lines]);

  return (
    <div className="absolute inset-0 z-10" style={{ marginLeft: '2rem', width: 'calc(100% - 2rem)', overflow: 'hidden' }}>
      <div className="h-full flex flex-col justify-center relative">
        {notePositions.map(({ x, y, note }, noteIdx) => {
          const lineIndex = note.string - 1;
          // Calculer si la note est active (avant le playhead)
          const xPercent = parseFloat(x) || 0;
          // Le playhead est positionné à 10% + (playheadPercent * 0.85)%
          const playheadPosition = 10 + (playheadPercent / 100) * 85;
          const isActiveNote = isActive && xPercent <= playheadPosition;

          return (
            <div
              key={noteIdx}
              className="absolute flex items-center justify-center pointer-events-none"
              style={{
                left: x,
                top: '50%',
                marginTop: y, // Position relative au centre
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* Cercle de la note avec le chiffre à l'intérieur - même style que les accords */}
              <div
                className={`rounded-full flex items-center justify-center ${
                  isActiveNote
                    ? 'bg-orange-500 dark:bg-orange-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                    : 'bg-orange-500 dark:bg-orange-400'
                }`}
                style={{
                  width: `${20 * zoom}px`,
                  height: `${20 * zoom}px`,
                  zIndex: 15
                }}
              >
                {/* Numéro de frette à l'intérieur - foncé */}
                {note.fret !== null && (
                  <span
                    className="font-mono font-bold text-black dark:text-gray-900"
                    style={{
                      fontSize: `${0.75 * zoom}rem`,
                      zIndex: 16,
                      lineHeight: 1,
                      fontWeight: 'bold'
                    }}
                  >
                    {note.fret}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

