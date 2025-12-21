import React from 'react'
import { Chord } from '../../services/tablatures'

interface ChordDiagramProps {
  chord: Chord
  scale?: number
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord, scale = 1 }) => {
  if (!chord) return <div className="text-neutral-500 text-xs">Aucun diagramme</div>

  // Variables de taille
  const SVG_WIDTH = 120 * scale
  const SVG_HEIGHT = 150 * scale
  const VIEWBOX_WIDTH = 100
  const VIEWBOX_HEIGHT = 120
  
  // Dimensions de la grille
  const GRID_START_X = 10
  const GRID_END_X = 90
  const GRID_START_Y = 15
  
  // Espacements
  const STRING_SPACING = 16
  const FRET_SPACING = 20
  const NUM_STRINGS = 6
  const NUM_FRETS = 5
  
  // Tailles des éléments
  const DOT_RADIUS = 6
  const OPEN_CIRCLE_RADIUS = 3
  const NUT_STROKE_WIDTH = 4
  const FRET_STROKE_WIDTH = 1
  const STRING_STROKE_WIDTH = 1
  
  // Couleurs
  const FRET_COLOR = '#444'
  const DOT_COLOR = '#f59e0b'
  const MUTE_COLOR = '#ef4444'
  
  // Positions des cordes
  const stringPositions = Array.from({ length: NUM_STRINGS }, (_, i) => 
    GRID_START_X + i * STRING_SPACING
  )

  // Calculer la frette de base pour les accords barrés
  const minFret = Math.min(...chord.frets.filter(f => f > 0))
  const baseFret = chord.baseFret || (minFret > 0 && minFret > 1 ? minFret : 0)
  const showBaseFret = baseFret > 0

  // Calculer le nombre de frettes à afficher
  const maxFret = Math.max(...chord.frets.filter(f => f >= 0))
  const displayFrets = showBaseFret ? maxFret - baseFret + 1 : maxFret
  const numFretsToShow = Math.max(NUM_FRETS, displayFrets)

  return (
    <div className="bg-gray-800 dark:bg-gray-800 p-8 rounded-3xl border border-white/5 shadow-inner">
      {/* Titre de l'accord centré */}
      <h3 className="text-3xl font-bold mb-6 text-white tracking-tight text-center">
        {chord.name}
      </h3>
      
      <svg 
        width={SVG_WIDTH} 
        height={SVG_HEIGHT} 
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`} 
        className="mx-auto overflow-visible"
      >
        {/* Frets (Horizontal) */}
        {Array.from({ length: numFretsToShow + 1 }, (_, i) => (
          <line 
            key={`f-${i}`} 
            x1={GRID_START_X} 
            y1={GRID_START_Y + i * FRET_SPACING} 
            x2={GRID_END_X} 
            y2={GRID_START_Y + i * FRET_SPACING} 
            stroke={FRET_COLOR} 
            strokeWidth={i === 0 ? NUT_STROKE_WIDTH : FRET_STROKE_WIDTH} 
          />
        ))}

        {/* Strings (Vertical) */}
        {stringPositions.map((x, i) => (
          <line 
            key={`s-${i}`} 
            x1={x} 
            y1={GRID_START_Y} 
            x2={x} 
            y2={GRID_START_Y + numFretsToShow * FRET_SPACING} 
            stroke={FRET_COLOR} 
            strokeWidth={STRING_STROKE_WIDTH} 
          />
        ))}

        {/* Dots / Markers */}
        {chord.frets.map((fret, stringIdx) => {
          const x = stringPositions[stringIdx]
          
          if (fret === -1 || fret < 0) {
            // Mute (X)
            return (
              <text 
                key={`m-${stringIdx}`} 
                x={x} 
                y={GRID_START_Y - 4} 
                textAnchor="middle" 
                fill={MUTE_COLOR} 
                fontSize="10" 
                fontWeight="bold"
              >
                ×
              </text>
            )
          }
          
          if (fret === 0) {
            // Open (O)
            return (
              <circle 
                key={`o-${stringIdx}`} 
                cx={x} 
                cy={GRID_START_Y - 7} 
                r={OPEN_CIRCLE_RADIUS} 
                stroke={DOT_COLOR} 
                strokeWidth="1.5" 
                fill="none"
                className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              />
            )
          }
          
          // Fingered position
          // Si baseFret existe, on calcule la position relative
          const displayFret = showBaseFret ? fret - baseFret : fret
          // La position Y est au milieu entre la nut/frette précédente et la frette actuelle
          const y = GRID_START_Y + (displayFret * FRET_SPACING) - (FRET_SPACING / 2)
          const finger = chord.fingers?.[stringIdx]
          
          return (
            <g key={`p-${stringIdx}`}>
              <circle 
                cx={x} 
                cy={y} 
                r={DOT_RADIUS} 
                fill={DOT_COLOR}
                className="drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              />
              {finger && finger > 0 && (
                <text 
                  x={x} 
                  y={y + 3} 
                  textAnchor="middle" 
                  fill="black" 
                  fontSize="8" 
                  fontWeight="bold"
                >
                  {finger}
                </text>
              )}
              {!finger && (
                <text 
                  x={x} 
                  y={y + 3} 
                  textAnchor="middle" 
                  fill="black" 
                  fontSize="8" 
                  fontWeight="bold"
                >
                  {fret}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

