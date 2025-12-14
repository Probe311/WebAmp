import { Chord } from '../../services/tablatures'
import { Block } from '../Block'
import { useTheme } from '../../contexts/ThemeContext'

interface ChordViewerProps {
  chord: Chord
  showName?: boolean
  size?: 'small' | 'medium' | 'large'
}

export function ChordViewer({ chord, showName = true, size = 'medium' }: ChordViewerProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const sizeClasses = {
    small: { 
      container: 'w-28', 
      scale: 0.9,
      text: 'text-sm',
      padding: 'p-2'
    },
    medium: { 
      container: 'w-full', 
      scale: 1.5,
      text: 'text-base',
      padding: 'p-2'
    },
    large: { 
      container: 'w-44', 
      scale: 1.6,
      text: 'text-lg',
      padding: 'p-3'
    }
  }

  const sizes = sizeClasses[size]
  const width = 100 * sizes.scale
  const height = 120 * sizes.scale
  const gridX = 15
  const gridY = 20
  const stringSpacing = 14
  const fretSpacing = 18

  // Calculer les frets à afficher
  const maxFret = Math.max(...chord.frets.filter(f => f >= 0))
  const minFret = Math.min(...chord.frets.filter(f => f >= 0))
  const baseFret = chord.baseFret || (minFret > 0 ? minFret : 0)
  const showBaseFret = baseFret > 0
  const numFrets = Math.max(4, maxFret - baseFret + 1)

  // Couleurs adaptées au thème
  const textColor = isDark ? 'white' : 'black'
  const stringColor = isDark ? '#525252' : '#9ca3af'
  const fretColor = isDark ? '#525252' : '#9ca3af'
  const nutColor = isDark ? 'white' : 'black'
  const dotColor = '#f59e0b' // Orange pour les points
  const muteColor = '#ef4444' // Rouge pour les cordes muettes

  return (
    <div className={`${sizes.container} h-full flex flex-col`}>
      <Block className={`${sizes.padding} w-full h-full flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700`}>
        {/* Nom de l'accord */}
        {showName && (
          <div className="mb-1 text-center flex-shrink-0">
            <h4 className={`${sizes.text} font-bold text-black/85 dark:text-white/90`}>
              {chord.name}
            </h4>
          </div>
        )}

        {/* Indication de frette de base */}
        {showBaseFret && (
          <div className="mb-1 text-xs font-bold text-black/70 dark:text-white/70 text-center flex-shrink-0">
            {baseFret}fr
          </div>
        )}

        {/* Diagramme SVG */}
        <div className="flex-1 flex items-center justify-center">
          <svg 
            width={width} 
            height={height} 
            viewBox="0 0 100 120" 
            className="overflow-visible"
          >
            {/* Chord Name (si pas déjà affiché au-dessus) */}
            {!showName && (
              <text 
                x="50" 
                y="10" 
                textAnchor="middle" 
                fill={textColor} 
                fontSize="16" 
                fontWeight="bold"
              >
                {chord.name}
              </text>
            )}

            {/* Nut (Top thick line) */}
            <line 
              x1={gridX} 
              y1={gridY} 
              x2={gridX + 5 * stringSpacing} 
              y2={gridY} 
              stroke={nutColor} 
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
                stroke={stringColor} 
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
                stroke={fretColor} 
                strokeWidth="1" 
              />
            ))}

            {/* Barre de frette de base (si accord barré) */}
            {showBaseFret && (
              <line 
                x1={gridX} 
                y1={gridY} 
                x2={gridX + 5 * stringSpacing} 
                y2={gridY} 
                stroke={nutColor} 
                strokeWidth="3" 
              />
            )}

            {/* Dots / Markers */}
            {chord.frets.map((fret, stringIdx) => {
              const x = gridX + stringIdx * stringSpacing
              const displayFret = fret > 0 ? fret - baseFret : 0
              
              if (fret === -1) {
                // Mute (X)
                return (
                  <text 
                    key={`m-${stringIdx}`} 
                    x={x} 
                    y={gridY - 5} 
                    textAnchor="middle" 
                    fill={muteColor} 
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
                    stroke={dotColor} 
                    strokeWidth="1.5" 
                    fill="none" 
                  />
                )
              }
              
              // Fingered position
              const y = gridY + (displayFret * fretSpacing) - (fretSpacing / 2)
              return (
                <g key={`p-${stringIdx}`}>
                  <circle 
                    cx={x} 
                    cy={y} 
                    r="6" 
                    fill={dotColor} 
                  />
                  {chord.fingers && chord.fingers[stringIdx] > 0 && (
                    <text 
                      x={x} 
                      y={y + 3} 
                      textAnchor="middle" 
                      fill="black" 
                      fontSize="8" 
                      fontWeight="bold"
                    >
                      {chord.fingers[stringIdx]}
                    </text>
                  )}
                  {(!chord.fingers || !chord.fingers[stringIdx] || chord.fingers[stringIdx] === 0) && (
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
      </Block>
    </div>
  )
}
