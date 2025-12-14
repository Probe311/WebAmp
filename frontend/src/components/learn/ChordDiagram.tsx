import React from 'react'
import { Chord } from '../../services/tablatures'

interface ChordDiagramProps {
  chord: Chord
  scale?: number
}

export const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord, scale = 1 }) => {
  if (!chord) return <div className="text-neutral-500 text-xs">No diagram</div>

  const width = 100 * scale
  const height = 120 * scale
  const gridX = 15
  const gridY = 20
  const stringSpacing = 14
  const fretSpacing = 18

  // Calculer la frette de base pour les accords barrés
  const minFret = Math.min(...chord.frets.filter(f => f > 0))
  const baseFret = chord.baseFret || (minFret > 0 ? minFret : 0)
  const showBaseFret = baseFret > 0

  // Calculer le nombre de frettes à afficher
  const maxFret = Math.max(...chord.frets.filter(f => f >= 0))
  const numFrets = Math.max(4, maxFret - baseFret + 1)

  return (
    <svg width={width} height={height} viewBox="0 0 100 120" className="overflow-visible">
      {/* Chord Name */}
      <text x="50" y="10" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
        {chord.name}
      </text>

      {/* Base Fret Indicator */}
      {showBaseFret && (
        <text x="50" y="18" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
          {baseFret}fr
        </text>
      )}

      {/* Nut (Top thick line) */}
      <line 
        x1={gridX} 
        y1={gridY} 
        x2={gridX + 5 * stringSpacing} 
        y2={gridY} 
        stroke="white" 
        strokeWidth="4" 
      />

      {/* Strings (Vertical) */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <line 
          key={`s-${i}`} 
          x1={gridX + i * stringSpacing} 
          y1={gridY} 
          x2={gridX + i * stringSpacing} 
          y2={gridY + numFrets * fretSpacing} 
          stroke="#525252" 
          strokeWidth={i > 2 ? 1 : 2} 
        />
      ))}

      {/* Frets (Horizontal) */}
      {Array.from({ length: numFrets + 1 }).map((_, i) => (
        <line 
          key={`f-${i}`} 
          x1={gridX} 
          y1={gridY + i * fretSpacing} 
          x2={gridX + 5 * stringSpacing} 
          y2={gridY + i * fretSpacing} 
          stroke="#525252" 
          strokeWidth={i === 0 ? "4" : "1"} 
        />
      ))}

      {/* Barre de frette de base (si accord barré) */}
      {showBaseFret && (
        <line
          x1={gridX}
          y1={gridY}
          x2={gridX + 5 * stringSpacing}
          y2={gridY}
          stroke="white"
          strokeWidth="2"
        />
      )}

      {/* Dots / Markers */}
      {chord.frets.map((fret, stringIdx) => {
        const x = gridX + stringIdx * stringSpacing
        
        if (fret === -1 || fret < 0) {
          // Mute (X)
          return (
            <text 
              key={`m-${stringIdx}`} 
              x={x} 
              y={gridY - 5} 
              textAnchor="middle" 
              fill="#ef4444" 
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
              cy={gridY - 8} 
              r="3" 
              stroke="#f59e0b" 
              strokeWidth="1.5" 
              fill="none" 
            />
          )
        }
        
        // Fingered position
        const displayFret = fret - baseFret
        const y = gridY + (displayFret * fretSpacing) - (fretSpacing / 2)
        const finger = chord.fingers?.[stringIdx]
        
        return (
          <g key={`p-${stringIdx}`}>
            <circle cx={x} cy={y} r="6" fill="#f59e0b" />
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
  )
}

