import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { Block } from '../Block'
import { lmsService } from '../../services/lms'
import { songsterrService } from '../../services/songsterr'
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

  // Charger les informations de la tablature
  useEffect(() => {
    const loadTablatureInfo = async () => {
      console.log('🎸 FullTablatureViewer - Début chargement tablature:', {
        tablatureId,
        title,
        artist,
        courseId,
        lessonId
      })
      
      setLoadingInfo(true)
      setError(null)
      try {
        // 1. Essayer de charger depuis Supabase
        console.log('🎸 FullTablatureViewer - Recherche dans Supabase pour:', tablatureId)
        let info = await lmsService.getTablature(tablatureId)
        
        if (info) {
          console.log('✅ FullTablatureViewer - Tablature trouvée dans Supabase:', {
            id: info.id,
            title: info.title,
            artist: info.artist,
            measuresCount: info.measures?.length || 0,
            songsterr_id: (info as any).songsterr_id,
            songsterrId: (info as any).songsterrId,
            songsterr_url: (info as any).songsterr_url,
            songsterrUrl: (info as any).songsterrUrl
          })
        } else {
          console.log('⚠️ FullTablatureViewer - Tablature non trouvée dans Supabase')
        }
        
        // 2. Si pas trouvé dans Supabase et qu'on a title/artist, essayer Songsterr
        if (!info && title && artist) {
          console.log(`🎸 FullTablatureViewer - Appel Songsterr pour: "${title}" par "${artist}"`)
          const songsterrData = await songsterrService.getTablatureByTitleAndArtist(title, artist)
          
          if (songsterrData) {
            console.log('✅ FullTablatureViewer - Données Songsterr reçues:', {
              id: songsterrData.id,
              title: songsterrData.title,
              artist: songsterrData.artist,
              songsterrId: songsterrData.songsterrId,
              songsterrUrl: songsterrData.songsterrUrl,
              measuresCount: songsterrData.measures?.length || 0
            })
            
            // Convertir les données Songsterr au format attendu
            info = {
              id: tablatureId, // Utiliser l'ID du cours plutôt que l'ID Songsterr
              title: songsterrData.title,
              artist: songsterrData.artist,
              tempo: songsterrData.tempo,
              time_signature: songsterrData.timeSignature,
              key: songsterrData.key,
              measures: songsterrData.measures,
              songsterrUrl: songsterrData.songsterrUrl
            }
            
            // Sauvegarder dans Supabase pour les prochaines fois
            try {
              console.log('💾 FullTablatureViewer - Sauvegarde dans Supabase...')
              await lmsService.saveTablature({
                id: tablatureId,
                title: songsterrData.title,
                artist: songsterrData.artist,
                tempo: songsterrData.tempo,
                time_signature: songsterrData.timeSignature,
                key: songsterrData.key,
                measures: songsterrData.measures || [],
                songsterrUrl: songsterrData.songsterrUrl,
                songsterrId: songsterrData.songsterrId
              })
              console.log(`✅ FullTablatureViewer - Tablature "${tablatureId}" sauvegardée dans Supabase`)
              
              // Associer la tablature au cours si courseId est fourni
              if (courseId) {
                console.log('🔗 FullTablatureViewer - Association au cours:', { courseId, lessonId })
                await lmsService.associateTablatureToCourse(courseId, tablatureId, lessonId)
                console.log(`✅ FullTablatureViewer - Tablature associée au cours "${courseId}"`)
              }
            } catch (saveError) {
              console.warn('⚠️ FullTablatureViewer - Erreur sauvegarde Supabase:', saveError)
              // On continue quand même avec les données Songsterr
            }
          } else {
            console.log('❌ FullTablatureViewer - Aucune donnée Songsterr trouvée')
          }
        } else if (!info && (!title || !artist)) {
          console.log('⚠️ FullTablatureViewer - Pas de title/artist fourni pour Songsterr:', { title, artist })
        }
        
        // 3. Si la tablature existe mais n'a pas de mesures, essayer Songsterr
        if (info && (!info.measures || info.measures.length === 0)) {
          // Priorité 1: Utiliser l'ID Songsterr stocké s'il existe
          const songsterrId = (info as any).songsterr_id || (info as any).songsterrId
          
          console.log(`🔍 FullTablatureViewer - Vérification ID Songsterr:`, {
            songsterr_id: (info as any).songsterr_id,
            songsterrId: (info as any).songsterrId,
            found: !!songsterrId,
            value: songsterrId
          })
          
          if (songsterrId) {
            console.log(`🎸 FullTablatureViewer - Tablature trouvée mais sans mesures, utilisation ID Songsterr: ${songsterrId}`)
            try {
              const songsterrData = await songsterrService.getTablatureBySongsterrId(songsterrId)
              
              if (songsterrData && songsterrData.measures && songsterrData.measures.length > 0) {
                console.log(`✅ FullTablatureViewer - ${songsterrData.measures.length} mesures récupérées depuis Songsterr (par ID)`)
                
                // Mettre à jour les mesures dans l'info
                info.measures = songsterrData.measures
                info.songsterr_id = songsterrData.songsterrId
                info.songsterr_url = songsterrData.songsterrUrl
                
                // Sauvegarder les mesures dans Supabase
                try {
                  await lmsService.saveTablature({
                    id: info.id,
                    title: songsterrData.title || info.title,
                    artist: songsterrData.artist || info.artist,
                    tempo: songsterrData.tempo || info.tempo,
                    time_signature: songsterrData.timeSignature || info.time_signature,
                    key: songsterrData.key || info.key,
                    measures: songsterrData.measures,
                    songsterrUrl: songsterrData.songsterrUrl,
                    songsterrId: songsterrData.songsterrId
                  })
                  console.log(`✅ FullTablatureViewer - Mesures sauvegardées dans Supabase`)
                } catch (saveError) {
                  console.warn('⚠️ FullTablatureViewer - Erreur sauvegarde mesures:', saveError)
                }
              } else {
                console.log('⚠️ FullTablatureViewer - Songsterr n\'a pas retourné de mesures (par ID)')
              }
            } catch (songsterrError) {
              console.warn('⚠️ FullTablatureViewer - Erreur appel Songsterr par ID:', songsterrError)
            }
          } else if (title && artist) {
            // Priorité 2: Chercher par titre et artiste si pas d'ID Songsterr
            // Note: Cette méthode échouera à cause de CORS, mais on essaie quand même
            console.log(`🎸 FullTablatureViewer - Tablature trouvée mais sans mesures, tentative appel Songsterr pour: "${title}" par "${artist}" (sera bloqué par CORS)`)
            try {
              const songsterrData = await songsterrService.getTablatureByTitleAndArtist(title, artist)
              
              if (songsterrData && songsterrData.measures && songsterrData.measures.length > 0) {
                console.log(`✅ FullTablatureViewer - ${songsterrData.measures.length} mesures récupérées depuis Songsterr`)
                
                // Mettre à jour les mesures dans l'info
                info.measures = songsterrData.measures
                info.songsterr_id = songsterrData.songsterrId
                info.songsterr_url = songsterrData.songsterrUrl
                
                // Sauvegarder les mesures dans Supabase
                try {
                  await lmsService.saveTablature({
                    id: info.id,
                    title: info.title,
                    artist: info.artist,
                    tempo: songsterrData.tempo || info.tempo,
                    time_signature: songsterrData.timeSignature || info.time_signature,
                    key: songsterrData.key || info.key,
                    measures: songsterrData.measures,
                    songsterrUrl: songsterrData.songsterrUrl,
                    songsterrId: songsterrData.songsterrId
                  })
                  console.log(`✅ FullTablatureViewer - Mesures sauvegardées dans Supabase`)
                } catch (saveError) {
                  console.warn('⚠️ FullTablatureViewer - Erreur sauvegarde mesures:', saveError)
                }
              } else {
                console.log('⚠️ FullTablatureViewer - Songsterr n\'a pas retourné de mesures')
              }
            } catch (songsterrError) {
              console.warn('⚠️ FullTablatureViewer - Erreur appel Songsterr:', songsterrError)
            }
          }
        }
        
        if (info) {
          setTablatureInfo(info)
          // Si initialMeasures est fourni et non vide, l'utiliser
          if (initialMeasures && initialMeasures.length > 0) {
            setMeasures(initialMeasures.slice(0, PAGE_SIZE))
            setHasMore(initialMeasures.length > PAGE_SIZE)
          } else if (info.measures && info.measures.length > 0) {
            // Sinon, utiliser les mesures de la tablature
            setMeasures(info.measures.slice(0, PAGE_SIZE))
            setHasMore(info.measures.length > PAGE_SIZE)
          } else if ((info as any).songsterr_url || (info as any).songsterrUrl) {
            // Si on a un lien Songsterr mais pas de mesures, afficher le lien
            setMeasures([])
            setHasMore(false)
            console.log(`💡 FullTablatureViewer - Tablature "${tablatureId}" a une URL Songsterr mais pas de mesures directes.`)
          } else {
            setError(`La tablature "${tablatureId}" existe mais ne contient aucune mesure.`)
            console.error(`❌ FullTablatureViewer - La tablature "${tablatureId}" existe mais ne contient aucune mesure.`)
          }
        } else {
          if (title && artist) {
            setError(`La tablature "${title}" de ${artist} n'a pas été trouvée dans Supabase ni sur Songsterr.`)
            console.error(`❌ FullTablatureViewer - La tablature "${title}" de ${artist} n'a pas été trouvée dans Supabase ni sur Songsterr.`)
          } else {
            setError(`La tablature "${tablatureId}" n'a pas été trouvée dans la base de données.`)
            console.error(`❌ FullTablatureViewer - La tablature "${tablatureId}" n'a pas été trouvée dans la base de données.`)
          }
        }
      } catch (err) {
        console.error('Error loading tablature:', err)
        setError(`Erreur lors du chargement de la tablature "${tablatureId}".`)
      } finally {
        setLoadingInfo(false)
      }
    }
    loadTablatureInfo()
  }, [tablatureId, initialMeasures, title, artist, courseId, lessonId])

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
          setMeasures(prev => [...prev, ...result.measures])
          setCurrentPage(prev => prev + 1)
          setHasMore(result.hasMore)
        } else {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error('Error loading more measures:', error)
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
          r="10"
          fill={isDark ? '#f59e0b' : '#f97316'}
          stroke={isDark ? '#ffffff' : '#000000'}
          strokeWidth="1"
        />
        {/* Numéro de frette */}
        <text
          x={x}
          y={y + 4}
          textAnchor="middle"
          fill={isDark ? '#000000' : '#ffffff'}
          fontSize="10"
          fontWeight="bold"
        >
          {fretText}
        </text>
        {/* Indicateur de technique */}
        {note.technique && (
          <text
            x={x + 12}
            y={y - 8}
            fill={isDark ? '#ffffff' : '#000000'}
            fontSize="8"
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
          fill={isDark ? '#ffffff' : '#000000'}
          fontSize="10"
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
            fill={isDark ? '#f59e0b' : '#f97316'}
            fontSize="12"
            fontWeight="bold"
          >
            {measure.chord}
          </text>
        )}

        {/* Section (Intro, Verse, etc.) */}
        {measure.section && (
          <text
            x={x}
            y={25}
            fill={isDark ? '#9ca3af' : '#6b7280'}
            fontSize="10"
            fontWeight="bold"
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
          stroke={isDark ? '#ffffff' : '#000000'}
          strokeWidth="2"
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
          stroke={isDark ? '#ffffff' : '#000000'}
          strokeWidth="2"
        />

        {/* Instructions */}
        {measure.instructions && measure.instructions.length > 0 && (
          <text
            x={x + 5}
            y={40 + STRING_HEIGHT * 6 + 15}
            fill={isDark ? '#9ca3af' : '#6b7280'}
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Voir la tablature sur Songsterr
              <ChevronDown size={18} className="rotate-[-90deg]" />
            </a>
          </div>
        </Block>
      )}

      {/* Tablature horizontale */}
      {measures.length > 0 && (
        <Block className="p-4 overflow-x-auto">
          <div ref={containerRef} className="relative" style={{ minWidth: `${measures.length * MEASURE_WIDTH + 60}px` }}>
            <svg
              width="100%"
              height={STRING_HEIGHT * 6 + 80}
              viewBox={`0 0 ${measures.length * MEASURE_WIDTH + 60} ${STRING_HEIGHT * 6 + 80}`}
              className="overflow-visible"
            >
            {/* Noms des cordes à gauche */}
            {STRING_NAMES.map((name, index) => {
              const y = 40 + index * STRING_HEIGHT + STRING_HEIGHT / 2
              return (
                <text
                  key={`string-${index}`}
                  x="10"
                  y={y + 4}
                  fill={isDark ? '#ffffff' : '#000000'}
                  fontSize="14"
                  fontWeight="bold"
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
                  stroke={isDark ? '#525252' : '#9ca3af'}
                  strokeWidth={index < 2 ? '2' : '1'}
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
          <button
            onClick={loadMoreMeasures}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          </button>
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
