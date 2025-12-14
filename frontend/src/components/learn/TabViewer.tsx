import { Tablature } from '../../services/tablatures'
import { Block } from '../Block'
import { Music, Clock } from 'lucide-react'

interface TabViewerProps {
  tablature: Tablature
  showTitle?: boolean
}

export function TabViewer({ tablature, showTitle = true }: TabViewerProps) {
  const stringNames = ['E', 'A', 'D', 'G', 'B', 'E'] // De la plus grave (6) à la plus aiguë (1)

  return (
    <Block className="p-6">
      {showTitle && (
        <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <Music size={20} className="text-orange-500" />
            <h3 className="text-xl font-bold text-black/85 dark:text-white/90">
              {tablature.title}
            </h3>
          </div>
          {tablature.artist && (
            <p className="text-sm text-black/70 dark:text-white/70 mb-2">
              Artiste: {tablature.artist}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-black/60 dark:text-white/60">
            {tablature.tempo && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{tablature.tempo} BPM</span>
              </div>
            )}
            {tablature.key && (
              <span>Clé: {tablature.key}</span>
            )}
            {tablature.timeSignature && (
              <span>Mesure: {tablature.timeSignature}</span>
            )}
          </div>
        </div>
      )}

      {/* Tablature visuelle */}
      <div className="space-y-6">
        {tablature.measures.map((measure, measureIndex) => (
          <div key={measureIndex} className="space-y-3">
            <h4 className="text-sm font-bold text-black/70 dark:text-white/70">
              Mesure {measureIndex + 1}
            </h4>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              {/* En-tête avec noms des cordes */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-16 text-xs font-bold text-black/60 dark:text-white/60">
                  Corde
                </div>
                <div className="flex-1 flex justify-between px-2">
                  {stringNames.map((name, index) => (
                    <div
                      key={index}
                      className="w-8 text-center text-xs font-bold text-black/70 dark:text-white/70"
                    >
                      {name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Lignes de tablature */}
              <div className="space-y-2">
                {stringNames.map((_, stringIndex) => {
                  const stringNumber = 6 - stringIndex // 6 = E grave, 1 = E aigu
                  const note = measure.notes.find(n => n.string === stringNumber)
                  
                  return (
                    <div
                      key={stringIndex}
                      className="flex items-center gap-3 h-10"
                    >
                      {/* Label de la corde */}
                      <div className="w-12 text-xs font-bold text-black/70 dark:text-white/70 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                        {stringNumber}
                      </div>
                      
                      {/* Ligne de tablature */}
                      <div className="flex-1 relative h-full flex items-center bg-gray-50 dark:bg-gray-900/30 rounded px-4">
                        {/* Ligne horizontale */}
                        <div className="absolute left-4 right-4 h-0.5 bg-gray-400 dark:bg-gray-500" />
                        
                        {/* Note/Frette */}
                        {note ? (
                          <div className="absolute left-1/2 -translate-x-1/2 z-10">
                            {note.fret === 0 ? (
                              // Corde à vide
                              <div className="w-7 h-7 rounded-full border-2 border-orange-500 bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center hover:scale-110 transition-transform">
                                <span className="text-xs font-bold text-orange-500">O</span>
                              </div>
                            ) : (
                              // Note avec frette
                              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform" title={`Corde ${stringNumber}, Frette ${note.fret}`}>
                                <span className="text-sm font-bold">{note.fret}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Pas de note sur cette corde
                          <div className="absolute left-1/2 -translate-x-1/2 text-gray-300 dark:text-gray-600 text-xs">
                            -
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Indication d'accord si toutes les notes sont jouées simultanément */}
              {measure.notes.length >= 3 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-black/60 dark:text-white/60 italic">
                    Accord joué simultanément
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Légende */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-bold text-black/70 dark:text-white/70 mb-3">
          Comment lire la tablature
        </h4>
        <ul className="space-y-2 text-xs text-black/60 dark:text-white/60">
          <li>
            • <strong>Les 6 lignes horizontales</strong> représentent les 6 cordes de la guitare
            <br />
            <span className="ml-4">(E grave en bas, E aigu en haut)</span>
          </li>
          <li>
            • <strong>Les cercles orange avec des chiffres</strong> indiquent la case (frette) où placer vos doigts
          </li>
          <li>
            • <strong>"O"</strong> signifie jouer la corde à vide (sans appuyer sur une frette)
          </li>
          <li>
            • <strong>Les mesures</strong> sont lues de gauche à droite, comme une partition
          </li>
        </ul>
      </div>
    </Block>
  )
}
