import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { Block } from '../Block'
import { CTA } from '../CTA'
import { lmsService } from '../../services/lms'
import { useTheme } from '../../contexts/ThemeContext'

interface TablatureNote {
  string: number // 1-6 (de la plus grave à la plus aiguë, 1=E grave, 6=E aigu)
  fret: number // 0-24
  duration?: string // 'w', 'h', 'q', '8', '16', etc.
  time?: number // Position temporelle dans la mesure
  technique?: string // 'h' (hammer-on), 'p' (pull-off), 'b' (bend), 's' (slide), etc.
}

interface TablatureMeasure {
  notes: TablatureNote[]
  timeSignature?: string // '4/4', '3/4', etc.
  chord?: string // Nom de l'accord au-dessus de la mesure
  section?: string // 'Intro', 'Verse', 'Chorus', etc.
  instructions?: string[] // 'let ring', 'Harm.', etc.
}

interface FullTablatureViewerProps {
  tablatureId: string
  initialMeasures?: TablatureMeasure[]
  onLoadMore?: (page: number) => Promise<TablatureMeasure[]>
  // Optionnel: titre et artiste pour rechercher sur Songsterr si la tablature n'existe pas dans Supabase
  title?: string
  artist?: string
  // Optionnel: ID du cours pour associer la tablature au cours
  courseId?: string
  // Optionnel: ID de la leçon pour associer la tablature à la leçon
  lessonId?: string
}

export function FullTablatureViewer({
  tablatureId,
  initialMeasures = [],
  onLoadMore,
  title,
  artist,
  courseId,
  lessonId
}: FullTablatureViewerProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [measures, setMeasures] = useState<TablatureMeasure[]>(initialMeasures)
  const [loading, setLoading] = useState(false)
  const [loadingInfo, setLoadingInfo] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [tablatureInfo, setTablatureInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const PAGE_SIZE = 16
  const STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'] // De la plus aiguë à la plus grave (affichage standard)
  const MEASURE_WIDTH = 200 // Largeur d'une mesure en pixels
  const STRING_HEIGHT = 30 // Hauteur entre chaque ligne de corde

  // Charger les informations de la tablature (uniquement depuis Supabase)
  useEffect(() => {
    const loadTablatureInfo = async () => {
      setLoadingInfo(true)
      setError(null)
      try {
        const info = await lmsService.getTablature(tablatureId)
        
        if (info) {
          setTablatureInfo(info)
          // Si initialMeasures est fourni et non vide, l'utiliser
          if (initialMeasures && initialMeasures.length > 0) {
            setMeasures(initialMeasures.slice(0, PAGE_SIZE))
            setHasMore(initialMeasures.length > PAGE_SIZE)
          } else if (info.measures && Array.isArray(info.measures) && info.measures.length > 0) {
            // Sinon, utiliser les mesures de la tablature
            setMeasures(info.measures.slice(0, PAGE_SIZE) as TablatureMeasure[])
            setHasMore(info.measures.length > PAGE_SIZE)
          } else if ((info as any).songsterr_url || (info as any).songsterrUrl) {
            // Si on a un lien Songsterr mais pas de mesures, afficher uniquement le lien
            setMeasures([])
            setHasMore(false)
          } else {
            setError(`La tablature "${tablatureId}" existe mais ne contient aucune mesure.`)
          }
        } else {
          setError(`La tablature "${tablatureId}" n'a pas été trouvée dans la base de données.`)
        }
      } catch (err) {
        setError(`Erreur lors du chargement de la tablature "${tablatureId}".`)
      } finally {
        setLoadingInfo(false)
      }
    }
    loadTablatureInfo()
  }, [tablatureId, initialMeasures])

  // Charger plus de mesures
  const loadMoreMeasures = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    try {
      if (onLoadMore) {
        const newMeasures = await onLoadMore(currentPage + 1)
        if (newMeasures.length > 0) {
          setMeasures(prev => [...prev, ...newMeasures])
          setCurrentPage(prev => prev + 1)
          setHasMore(newMeasures.length === PAGE_SIZE)
        } else {
          setHasMore(false)
        }
      } else {
        // Utiliser l'API par défaut
        const result = await lmsService.getTablatureMeasures(
          tablatureId,
          currentPage + 1,
          PAGE_SIZE
        )
        if (result.measures.length > 0) {
          setMeasures(prev => [...prev, ...result.measures] as TablatureMeasure[])
          setCurrentPage(prev => prev + 1)
          setHasMore(result.hasMore)
        } else {
          setHasMore(false)
        }
      }
    } catch (error) {
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }

  // Observer pour charger automatiquement quand on arrive en bas
  useEffect(() => {
    if (!loadMoreRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreMeasures()
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading])

  // Rendre une note sur une corde
  const renderNote = (note: TablatureNote, x: number, stringIndex: number) => {
    const y = stringIndex * STRING_HEIGHT + STRING_HEIGHT / 2
    const fretText = note.fret.toString()
    
    return (
      <g key={`note-${note.string}-${note.fret}-${x}`}>
        {/* Cercle de fond pour la note */}
        <circle
          cx={x}
          cy={y}
          r="11"
          fill={isDark ? '#f97316' : '#f97316'}
          stroke={isDark ? '#ffffff' : '#ffffff'}
          strokeWidth="2"
          opacity="0.95"
        />
        {/* Numéro de frette */}
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          fill={isDark ? '#ffffff' : '#ffffff'}
          fontSize="11"
          fontWeight="bold"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
        >
          {fretText}
        </text>
        {/* Indicateur de technique */}
        {note.technique && (
          <text
            x={x + 14}
            y={y - 8}
            fill={isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)'}
            fontSize="9"
            fontWeight="600"
          >
            {note.technique}
          </text>
        )}
      </g>
    )
  }

  // Rendre une mesure
  const renderMeasure = (measure: TablatureMeasure, measureIndex: number) => {
    const x = measureIndex * MEASURE_WIDTH + 60 // 60px pour les noms de cordes
    
    return (
      <g key={`measure-${measureIndex}`}>
        {/* Numéro de mesure */}
        <text
          x={x + MEASURE_WIDTH / 2}
          y={15}
          textAnchor="middle"
          fill={isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)'}
          fontSize="11"
          fontWeight="bold"
        >
          {measureIndex + 1}
        </text>

        {/* Accord au-dessus de la mesure */}
        {measure.chord && (
          <text
            x={x + MEASURE_WIDTH / 2}
            y={30}
            textAnchor="middle"
            fill={isDark ? '#f97316' : '#f97316'}
            fontSize="13"
            fontWeight="bold"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
          >
            {measure.chord}
          </text>
        )}

        {/* Section (Intro, Verse, etc.) */}
        {measure.section && (
          <text
            x={x}
            y={25}
            fill={isDark ? 'rgba(156,163,175,0.9)' : 'rgba(107,114,128,0.9)'}
            fontSize="10"
            fontWeight="600"
            textDecoration="underline"
          >
            {measure.section}
          </text>
        )}

        {/* Barre verticale de début de mesure */}
        <line
          x1={x}
          y1={40}
          x2={x}
          y2={40 + STRING_HEIGHT * 6}
          stroke={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'}
          strokeWidth="2.5"
        />

        {/* Notes de la mesure */}
        {measure.notes.map((note, noteIndex) => {
          // Calculer la position X dans la mesure basée sur le temps ou l'index
          let noteX: number
          if (note.time !== undefined) {
            // Utiliser la position temporelle si disponible
            noteX = x + (note.time * MEASURE_WIDTH) + 10
          } else {
            // Sinon, distribuer uniformément
            const notesPerBeat = Math.ceil(measure.notes.length / 4) // Supposons 4 temps par mesure
            const beatIndex = Math.floor(noteIndex / notesPerBeat)
            const noteInBeat = noteIndex % notesPerBeat
            noteX = x + (beatIndex * MEASURE_WIDTH / 4) + (noteInBeat * (MEASURE_WIDTH / 4 / notesPerBeat)) + 10
          }
          
          const stringIndex = 6 - note.string // Inverser pour afficher E aigu en haut
          
          return renderNote(note, noteX, stringIndex)
        })}

        {/* Barre verticale de fin de mesure */}
        <line
          x1={x + MEASURE_WIDTH}
          y1={40}
          x2={x + MEASURE_WIDTH}
          y2={40 + STRING_HEIGHT * 6}
          stroke={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'}
          strokeWidth="2.5"
        />

        {/* Instructions */}
        {measure.instructions && measure.instructions.length > 0 && (
          <text
            x={x + 5}
            y={40 + STRING_HEIGHT * 6 + 15}
            fill={isDark ? 'rgba(156,163,175,0.8)' : 'rgba(107,114,128,0.8)'}
            fontSize="9"
            fontStyle="italic"
          >
            {measure.instructions.join(', ')}
          </text>
        )}
      </g>
    )
  }

  // Afficher un message d'erreur si la tablature n'existe pas
  if (loadingInfo) {
    return (
      <Block className="p-6">
        <div className="flex items-center justify-center gap-3">
          <Loader2 size={20} className="animate-spin text-orange-500" />
          <span className="text-black/70 dark:text-white/70">Chargement de la tablature...</span>
        </div>
      </Block>
    )
  }

  if (error) {
    return (
      <Block className="p-6">
        <div className="text-center">
          <p className="text-red-500 dark:text-red-400 mb-2 font-medium">{error}</p>
          <p className="text-sm text-black/60 dark:text-white/60">
            ID de la tablature : <code className="bg-black/10 dark:bg-white/10 px-2 py-1 rounded">{tablatureId}</code>
          </p>
        </div>
      </Block>
    )
  }

  if (!tablatureInfo) {
    return (
      <Block className="p-6">
        <div className="text-center">
          <p className="text-black/70 dark:text-white/70 mb-2">Tablature non trouvée</p>
          <p className="text-sm text-black/60 dark:text-white/60">
            ID : <code className="bg-black/10 dark:bg-white/10 px-2 py-1 rounded">{tablatureId}</code>
          </p>
        </div>
      </Block>
    )
  }

  return (
    <div className="space-y-4">
      {/* En-tête de la tablature */}
      {tablatureInfo && (
        <Block className="p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-black/85 dark:text-white/90 mb-1">
                {tablatureInfo.title}
              </h3>
              {tablatureInfo.artist && (
                <p className="text-sm text-black/70 dark:text-white/70">
                  Par {tablatureInfo.artist}
                </p>
              )}
              {/* Lien vers Songsterr si disponible */}
              {(tablatureInfo as any).songsterrUrl && (
                <a
                  href={(tablatureInfo as any).songsterrUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 mt-1 inline-flex items-center gap-1"
                >
                  Voir sur Songsterr →
                </a>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-black/60 dark:text-white/60">
              {tablatureInfo.tempo && (
                <span>J = {tablatureInfo.tempo}</span>
              )}
              {tablatureInfo.time_signature && (
                <span>{tablatureInfo.time_signature}</span>
              )}
              {tablatureInfo.key && (
                <span>Ton: {tablatureInfo.key}</span>
              )}
            </div>
          </div>
        </Block>
      )}

      {/* Message si pas de mesures mais lien Songsterr disponible */}
      {measures.length === 0 && (tablatureInfo as any).songsterrUrl && (
        <Block className="p-6">
          <div className="text-center">
            <p className="text-black/70 dark:text-white/70 mb-4">
              La tablature complète est disponible sur Songsterr.
            </p>
            <a
              href={(tablatureInfo as any).songsterrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-lg
                bg-white dark:bg-gray-700 text-black/90 dark:text-white/90
                font-semibold text-sm
                cursor-pointer transition-all duration-200 select-none touch-manipulation
                shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)]
                dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)]
                hover:shadow-[3px_3px_6px_rgba(0,0,0,0.12),-3px_-3px_6px_rgba(255,255,255,1)]
                dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(70,70,70,0.6)]
                hover:-translate-y-0.5 active:scale-95
                border-2 border-black/15 dark:border-white/15
              "
            >
              Voir la tablature sur Songsterr
              <ChevronDown size={18} className="rotate-[-90deg]" />
            </a>
          </div>
        </Block>
      )}

      {/* Tablature horizontale */}
      {measures.length > 0 && (
        <Block className="p-4">
          <div 
            ref={containerRef} 
            className="relative overflow-x-auto custom-scrollbar"
            style={{ 
              maxWidth: '100%',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            <svg
              width="100%"
              height={STRING_HEIGHT * 6 + 80}
              viewBox={`0 0 ${measures.length * MEASURE_WIDTH + 60} ${STRING_HEIGHT * 6 + 80}`}
              className="overflow-visible"
              style={{ minWidth: `${measures.length * MEASURE_WIDTH + 60}px` }}
            >
            {/* Noms des cordes à gauche */}
            {STRING_NAMES.map((name, index) => {
              const y = 40 + index * STRING_HEIGHT + STRING_HEIGHT / 2
              return (
                <text
                  key={`string-${index}`}
                  x="10"
                  y={y + 5}
                  fill={isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.85)'}
                  fontSize="15"
                  fontWeight="bold"
                  style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
                >
                  {name}
                </text>
              )
            })}

            {/* Lignes de cordes horizontales */}
            {STRING_NAMES.map((_, index) => {
              const y = 40 + index * STRING_HEIGHT + STRING_HEIGHT / 2
              return (
                <line
                  key={`line-${index}`}
                  x1="50"
                  y1={y}
                  x2={measures.length * MEASURE_WIDTH + 60}
                  y2={y}
                  stroke={isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)'}
                  strokeWidth={index < 2 ? '2.5' : '1.5'}
                />
              )
            })}

            {/* Mesures */}
            {measures.map((measure, index) => renderMeasure(measure, index))}
          </svg>
        </div>
      </Block>
      )}

      {/* Bouton "Charger plus" */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-4">
          <CTA
            onClick={loadMoreMeasures}
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Chargement...</span>
              </>
            ) : (
              <>
                <ChevronDown size={18} />
                <span>Voir la tablature complète ({measures.length} mesure{measures.length > 1 ? 's' : ''} affichée{measures.length > 1 ? 's' : ''})</span>
              </>
            )}
          </CTA>
        </div>
      )}

      {/* Message de fin */}
      {!hasMore && measures.length > 0 && (
        <div className="text-center py-4 text-sm text-black/60 dark:text-white/60">
          Fin de la tablature ({measures.length} mesure{measures.length > 1 ? 's' : ''})
        </div>
      )}
    </div>
  )
}
