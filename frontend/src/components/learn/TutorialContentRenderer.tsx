import { useState, useEffect } from 'react'
import { TutorialStep } from '../../data/tutorials'
import { TabViewer } from './TabViewer'
import { FullTablatureViewer } from './FullTablatureViewer'
import { TablaturePreview } from './TablaturePreview'
import { ChordGrid } from './ChordGrid'
import { ArtistProfile } from './ArtistProfile'
import { tablatureService } from '../../services/tablatures'
import { lmsService } from '../../services/lms'

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
  const [associatedTablatures, setAssociatedTablatures] = useState<string[]>([])
  
  // Log initial
  console.log('📝 TutorialContentRenderer - Props reçues:', {
    stepTitle: step.title,
    stepId: step.id,
    courseId,
    courseTitle,
    descriptionLength: step.description.length,
    descriptionPreview: step.description.substring(0, 100)
  })
  
  // Extraire le titre et l'artiste depuis le titre du cours
  // Format attendu: "Apprendre \"Titre\" - Artiste"
  const extractTitleAndArtist = (title?: string): { title?: string; artist?: string } => {
    if (!title) {
      console.log('📝 TutorialContentRenderer - Pas de courseTitle fourni')
      return {}
    }
    
    const match = title.match(/Apprendre\s+["'](.+?)["']\s+-\s+(.+)/i)
    if (match) {
      const extracted = {
        title: match[1].trim(),
        artist: match[2].trim()
      }
      console.log('📝 TutorialContentRenderer - Titre et artiste extraits:', extracted)
      return extracted
    }
    
    console.log('📝 TutorialContentRenderer - Format de courseTitle non reconnu:', title)
    return {}
  }
  
  const { title: songTitle, artist: songArtist } = extractTitleAndArtist(courseTitle)
  
  console.log('📝 TutorialContentRenderer - Titre/Artiste pour Songsterr:', { songTitle, songArtist })

  // Charger les tablatures associées à cette leçon depuis Supabase
  useEffect(() => {
    const loadAssociatedTablatures = async () => {
      if (!courseId || !step.id) {
        console.log('📝 TutorialContentRenderer - Pas de courseId ou step.id, skip chargement tablatures associées')
        return
      }

      console.log('📝 TutorialContentRenderer - Chargement tablatures associées:', { courseId, lessonId: step.id })
      try {
        const tablatures = await lmsService.getCourseTablatures(courseId, step.id)
        console.log('📝 TutorialContentRenderer - Tablatures associées trouvées:', tablatures)
        const tablatureIds = tablatures.map((t: any) => t.id).filter(Boolean)
        if (tablatureIds.length > 0) {
          console.log('📝 TutorialContentRenderer - IDs de tablatures associées:', tablatureIds)
          setAssociatedTablatures(tablatureIds)
        } else {
          console.log('📝 TutorialContentRenderer - Aucune tablature associée trouvée')
        }
      } catch (error) {
        console.error('❌ TutorialContentRenderer - Erreur chargement tablatures associées:', error)
      }
    }

    loadAssociatedTablatures()
  }, [courseId, step.id])

  // Détecter si le step contient des références à des tablatures, accords ou artistes
  const detectContent = () => {
    const content: {
      tablatureId?: string
      isFullTablature?: boolean
      chordNames?: string[]
      artistName?: string
    } = {}

    // Chercher des références dans la description
    const description = step.description
    console.log('📝 TutorialContentRenderer - Analyse de la description:', {
      stepTitle: step.title,
      descriptionLength: description.length,
      descriptionContent: description
    })

    // Détecter les références de tablatures complètes (format: [fulltablature:example-001] ou [tablature:example-001:full])
    const fullTabMatch = description.match(/\[fulltablature:([^\]]+)\]/) || 
                         description.match(/\[tablature:([^\]]+):full\]/)
    if (fullTabMatch) {
      content.tablatureId = fullTabMatch[1]
      content.isFullTablature = true
      console.log('✅ TutorialContentRenderer - Tablature complète détectée:', {
        tablatureId: fullTabMatch[1],
        match: fullTabMatch[0],
        fullMatch: fullTabMatch
      })
    } else {
      // Détecter les références de tablatures simples (format: [tablature:example-001])
      const tabMatch = description.match(/\[tablature:([^\]]+)\]/)
      if (tabMatch) {
        content.tablatureId = tabMatch[1]
        content.isFullTablature = false
        console.log('✅ TutorialContentRenderer - Tablature simple détectée:', {
          tablatureId: tabMatch[1],
          match: tabMatch[0]
        })
      } else {
        // Log détaillé pour debug
        console.log('⚠️ TutorialContentRenderer - Aucune référence de tablature trouvée dans la description')
        console.log('   Description complète:', description)
        console.log('   Recherche de [fulltablature:]:', description.includes('[fulltablature:'))
        console.log('   Recherche de [tablature:]:', description.includes('[tablature:'))
        
        // Si le titre est "La tablature" ou "La progression complète", on peut essayer de générer l'ID
        if (step.title.includes('tablature') || step.title.includes('progression complète')) {
          console.log('💡 TutorialContentRenderer - Titre suggère une tablature, mais pas de tag trouvé')
          console.log('   Titre:', step.title)
          console.log('   CourseTitle:', courseTitle)
        }
      }
    }

    // Détecter TOUTES les références d'accords (format: [chord:C] ou [chord:Am])
    const chordMatches = description.matchAll(/\[chord:([^\]]+)\]/g)
    const chordNames: string[] = []
    for (const match of chordMatches) {
      chordNames.push(match[1])
    }
    if (chordNames.length > 0) {
      content.chordNames = chordNames
      console.log('✅ TutorialContentRenderer - Accords détectés:', chordNames)
    }

    // Détecter les références d'artistes (format: [artist:Jimi Hendrix])
    const artistMatch = description.match(/\[artist:([^\]]+)\]/)
    if (artistMatch) {
      content.artistName = artistMatch[1]
      console.log('✅ TutorialContentRenderer - Artiste détecté:', artistMatch[1])
    }

    console.log('📝 TutorialContentRenderer - Contenu détecté:', content)
    return content
  }

  const detectedContent = detectContent()

  return (
    <div className="space-y-4">
      {/* Contenu principal de l'étape */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <div 
          className="text-black/70 dark:text-white/70 text-base whitespace-pre-line"
          style={{ 
            lineHeight: '1.5'
          }}
        >
          {step.description
            .replace(/\[tablature:[^\]]+\]/g, '')
            .replace(/\[fulltablature:[^\]]+\]/g, '')
            .replace(/\[chord:[^\]]+\]/g, '')
            .replace(/\[artist:[^\]]+\]/g, '')}
        </div>
      </div>

      {/* Afficher les tablatures associées à la leçon */}
      {associatedTablatures.map((tablatureId) => (
        <TablaturePreview
          key={tablatureId}
          tablatureId={tablatureId}
          maxMeasures={4}
        />
      ))}

      {/* Afficher la tablature complète si référencée explicitement */}
      {detectedContent.tablatureId && detectedContent.isFullTablature && (() => {
        console.log('🎸 TutorialContentRenderer - Rendu FullTablatureViewer:', {
          tablatureId: detectedContent.tablatureId,
          songTitle,
          songArtist,
          courseId,
          lessonId: step.id
        })
        return (
          <div className="mt-4">
            <FullTablatureViewer
              tablatureId={detectedContent.tablatureId}
              initialMeasures={[]}
              title={songTitle}
              artist={songArtist}
              courseId={courseId}
              lessonId={step.id}
              onLoadMore={async (page) => {
                console.log('📝 TutorialContentRenderer - Chargement mesures page:', page)
                const result = await lmsService.getTablatureMeasures(
                  detectedContent.tablatureId!,
                  page,
                  16
                )
                console.log('📝 TutorialContentRenderer - Mesures chargées:', result)
                return result.measures || []
              }}
            />
          </div>
        )
      })()}

      {/* Afficher la tablature simple si référencée explicitement */}
      {detectedContent.tablatureId && !detectedContent.isFullTablature && (() => {
        const tablature = tablatureService.getTablature(detectedContent.tablatureId!)
        if (tablature) {
          return (
            <div className="mt-4">
              <TabViewer tablature={tablature} />
            </div>
          )
        }
        return null
      })()}

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
    </div>
  )
}

