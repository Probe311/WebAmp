import { Chord } from '../../services/tablatures'
import { ChordViewer } from './ChordViewer'
import { Block } from '../Block'
import { Music, BookOpen } from 'lucide-react'

interface ChordGridProps {
  chords: Chord[]
  title?: string
}

export function ChordGrid({ chords, title }: ChordGridProps) {
  if (chords.length === 0) return null

  return (
    <div className="mt-4">
      <Block className="p-4">
        {title && (
          <h4 className="text-sm font-bold text-black/70 dark:text-white/70 mb-4 flex items-center gap-2">
            <Music size={16} />
            {title}
          </h4>
        )}
        
        {/* Grille d'accords - 4 colonnes par ligne, responsive, hauteur uniforme */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-fr">
          {chords.map((chord, index) => (
            <div key={index} className="flex justify-center min-h-[200px]">
              <ChordViewer chord={chord} size="medium" />
            </div>
          ))}
        </div>

        {/* Légende explicative */}
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-black/70 dark:text-white/70 mb-2 flex items-center gap-2">
            <BookOpen size={14} />
            Légende du diagramme d'accord :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-black/60 dark:text-white/60">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
                <circle cx="8" cy="8" r="3" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
              </svg>
              <div>
                <strong>Cercles avec "O"</strong> : Corde à jouer à vide
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
                <circle cx="8" cy="8" r="6" fill="#f59e0b" />
                <text x="8" y="11" textAnchor="middle" fill="black" fontSize="8" fontWeight="bold">1</text>
              </svg>
              <div>
                <strong>Cercles orange</strong> : Position des doigts (chiffre = doigt/frette)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-bold text-base flex-shrink-0">×</span>
              <div>
                <strong>Symbole ×</strong> : Corde muette (ne pas jouer)
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
                <line x1="8" y1="2" x2="8" y2="14" stroke="#525252" strokeWidth="1" />
                <line x1="2" y1="8" x2="14" y2="8" stroke="#525252" strokeWidth="1" />
              </svg>
              <div>
                <strong>Grille</strong> : Traits verticaux = frettes, horizontaux = cordes
              </div>
            </div>
          </div>
        </div>
      </Block>
    </div>
  )
}


