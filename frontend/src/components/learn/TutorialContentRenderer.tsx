import { useState, useEffect } from 'react'
import { TutorialStep } from '../../data/tutorials'
import { TabViewer } from './TabViewer'
import { ChordGrid } from './ChordGrid'
import { ArtistProfile } from './ArtistProfile'
import { tablatureService } from '../../services/tablatures'
import { lmsService } from '../../services/lms'
import { customLessonBlocks } from './customLessonBlocks'
import { parseLessonContent, cleanLessonDescription, type HtmlTabBlock } from '../../utils/lessonContentParser'
import { Dropdown, type DropdownOption } from '../Dropdown'
import { Block } from '../Block'
import { Guitar, Piano, Music, Loader2 } from 'lucide-react'
import { CourseTablatureViewer } from './CourseTablatureViewer'

/**
 * Composant sécurisé pour rendre du HTML stocké dans Supabase.
 * Utilisé pour les blocs de tablatures/instruments définis dans la description
 * d'une leçon via :
 *
 * [html instrument="Guitare lead" title="Solo - Intro"]
 *   ... SVG / HTML de la tablature ...
 * [/html]
 */
function SafeHTMLRenderer({ html }: { html: string }) {
  return (
    <div
      className="overflow-x-auto custom-scrollbar"
      style={{
        maxWidth: '100%',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
    >
      <div
        className="tablature-content"
        style={{
          minWidth: 'fit-content'
        }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
    </div>
  )
}

interface TutorialContentRendererProps {
  step: TutorialStep
  courseId?: string // ID du cours pour charger les tablatures associées
  courseTitle?: string // Titre du cours (pour extraire titre/artiste pour Songsterr)
  onLoadPreset?: (presetId: string) => void
  onAddPedal?: (pedalId: string) => void
}

export function TutorialContentRenderer({ 
  step, 
  courseId,
  courseTitle
}: TutorialContentRendererProps) {
  // Parser le contenu de la description pour extraire tous les blocs
  const detectedContent = parseLessonContent(step.description)
  
  // Détecter si c'est l'étape 4 "la tablature"
  const isTablatureStep = step.title?.toLowerCase().includes('tablature') || 
                          step.id === 'step-4' ||
                          step.description?.toLowerCase().includes('tablature complète')

  // Si c'est l'étape tablature, utiliser le composant avancé
  if (isTablatureStep) {
    return <CourseTablatureViewer step={step} courseTitle={courseTitle} />
  }

  return (
    <div className="space-y-4">
      {/* Contenu principal de l'étape */}
      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-li:my-1">
        <div 
          className="text-black/70 dark:text-white/70 text-base whitespace-pre-wrap"
          style={{ 
            lineHeight: '1.3',
          }}
        >
          {cleanLessonDescription(step.description)}
        </div>
      </div>

      {/* Afficher la tablature simple si référencée explicitement */}
      {detectedContent.tablatureId && !detectedContent.isFullTablature && (
        <TablatureFromAPI tablatureId={detectedContent.tablatureId!} />
      )}

      {/* Afficher les accords si référencés */}
      {detectedContent.chordNames && detectedContent.chordNames.length > 0 && (() => {
        const chords = detectedContent.chordNames!
          .map(name => tablatureService.getChord(name))
          .filter((chord): chord is NonNullable<typeof chord> => chord !== undefined)
        
        if (chords.length > 0) {
          return (
            <ChordGrid 
              chords={chords} 
              title={chords.length === 1 ? `Diagramme d'accord : ${chords[0].name}` : "Diagrammes d'accords"}
            />
          )
        }
        return null
      })()}

      {/* Afficher le profil d'artiste si référencé */}
      {detectedContent.artistName && (
        <div className="mt-4">
          <ArtistProfile artistName={detectedContent.artistName!} />
        </div>
      )}

      {/* Afficher les blocs HTML/SVG de tablatures stockés dans Supabase */}
      {detectedContent.htmlBlocks && detectedContent.htmlBlocks.length > 0 && (
        <TablatureHtmlBlocks blocks={detectedContent.htmlBlocks} />
      )}

      {/* Afficher les blocs personnalisés si référencés */}
      {detectedContent.blockIds && detectedContent.blockIds.length > 0 && (
        <div className="mt-4 space-y-4">
          {detectedContent.blockIds.map((blockId) => {
            const BlockNode = customLessonBlocks[blockId]
            if (!BlockNode) return null
            return (
              <div key={blockId}>
                {BlockNode}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/**
 * Affichage UI des blocs de tablature HTML.
 * - 1 bloc : affiché directement, avec un petit titre/instrument si fourni
 * - Plusieurs blocs : sélecteur (dropdown) permettant de choisir la tab / l'instrument
 */
function TablatureHtmlBlocks({ blocks }: { blocks: HtmlTabBlock[] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  // Fonction pour obtenir l'icône selon l'instrument
  const getInstrumentIcon = (instrument?: string) => {
    if (!instrument) return <Guitar size={16} />
    const lowerInstrument = instrument.toLowerCase()
    if (lowerInstrument.includes('piano')) {
      return <Piano size={16} />
    }
    // Guitare électrique, Basse, etc. utilisent l'icône Guitar
    return <Guitar size={16} />
  }

  // Préparer les options pour le dropdown avec uniquement le nom de l'instrument
  const dropdownOptions: DropdownOption[] = blocks.map((block, index) => {
    const instrumentName = block.instrument || `Tablature ${index + 1}`
    return {
      value: index.toString(),
      label: instrumentName,
      icon: getInstrumentIcon(block.instrument)
    }
  })

  if (blocks.length === 1) {
    const block = blocks[0]
    return (
      <div className="mt-4">
        <Block className="p-4">
        {(block.title || block.instrument) && (
            <h4 className="text-sm font-bold text-black/70 dark:text-white/70 mb-4 flex items-center gap-2">
              {getInstrumentIcon(block.instrument)}
              {block.title || block.instrument || 'Tablature'}
            </h4>
        )}
        <SafeHTMLRenderer html={block.html} />
        </Block>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <Block className="p-4">
        <div className="mb-4">
          <label className="block mb-2 text-xs font-semibold uppercase tracking-wider text-black/70 dark:text-white/70">
            Sélectionner l'instrument
          </label>
          <Dropdown
            options={dropdownOptions}
            value={activeIndex.toString()}
            onChange={(value) => setActiveIndex(parseInt(value, 10))}
            className="max-w-xs"
          />
        </div>
        <SafeHTMLRenderer html={blocks[activeIndex].html} />
      </Block>
    </div>
  )
}

/**
 * Composant pour charger et afficher une tablature depuis l'API
 */
function TablatureFromAPI({ tablatureId }: { tablatureId: string }) {
  const [tablature, setTablature] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTablature = async () => {
      setLoading(true)
      setError(null)
      try {
        // Essayer d'abord avec l'API
        const apiTablature = await lmsService.getTablature(tablatureId)
        if (apiTablature) {
          setTablature(apiTablature)
        } else {
          // Fallback sur le service local
          const localTablature = tablatureService.getTablature(tablatureId)
          if (localTablature) {
            setTablature(localTablature)
          } else {
            setError(`Tablature "${tablatureId}" non trouvée`)
          }
        }
      } catch (err) {
        setError(`Erreur lors du chargement de la tablature: ${err instanceof Error ? err.message : 'Erreur inconnue'}`)
      } finally {
        setLoading(false)
      }
    }
    loadTablature()
  }, [tablatureId])

  if (loading) {
    return (
      <div className="mt-4">
        <Block className="p-4">
          <div className="flex items-center justify-center gap-2 text-black/70 dark:text-white/70">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Chargement de la tablature...</span>
          </div>
        </Block>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-4">
        <Block className="p-4">
          <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
        </Block>
      </div>
    )
  }

  if (!tablature) {
    return null
  }

  // Si la tablature a du HTML, l'afficher comme un bloc HTML
  if ((tablature as any).html_content || (tablature as any).html) {
    return (
      <div className="mt-4">
        <Block className="p-4">
          <h4 className="text-sm font-bold text-black/70 dark:text-white/70 mb-4 flex items-center gap-2">
            <Music size={16} />
            {tablature.title || 'Tablature'}
          </h4>
          <SafeHTMLRenderer html={(tablature as any).html_content || (tablature as any).html} />
        </Block>
      </div>
    )
  }

  // Sinon, utiliser TabViewer pour les tablatures avec mesures
  // Convertir le format de l'API au format attendu par TabViewer
  const convertedTablature = {
    id: tablature.id || tablatureId,
    title: tablature.title || 'Tablature',
    artist: tablature.artist,
    tempo: tablature.tempo,
    timeSignature: tablature.time_signature || tablature.timeSignature,
    key: tablature.key,
    measures: tablature.measures || []
  }

  return (
    <div className="mt-4">
      <TabViewer tablature={convertedTablature} />
    </div>
  )
}


