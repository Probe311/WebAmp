import { useState, useEffect } from 'react'
import { FullTablatureViewer } from './FullTablatureViewer'
import { CTA } from '../CTA'
import { Music, ChevronDown } from 'lucide-react'
import { Block } from '../Block'
import { lmsService } from '../../services/lms'

interface TablaturePreviewProps {
  tablatureId: string
  maxMeasures?: number // Nombre maximum de mesures à afficher avant de montrer le bouton
}

export function TablaturePreview({ tablatureId, maxMeasures = 4 }: TablaturePreviewProps) {
  const [tablatureInfo, setTablatureInfo] = useState<any>(null)
  const [showFull, setShowFull] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTablature = async () => {
      setLoading(true)
      const info = await lmsService.getTablature(tablatureId)
      if (info) {
        setTablatureInfo(info)
      }
      setLoading(false)
    }
    loadTablature()
  }, [tablatureId])

  if (loading || !tablatureInfo) {
    return null
  }

  const totalMeasures = tablatureInfo.measures?.length || 0
  const previewMeasures = tablatureInfo.measures?.slice(0, maxMeasures) || []
  const isLongTablature = totalMeasures > maxMeasures

  // Si on affiche la version complète ou si la tablature est courte
  if (showFull || !isLongTablature) {
    return (
      <div className="mt-4">
        <FullTablatureViewer
          tablatureId={tablatureId}
          initialMeasures={showFull ? (tablatureInfo.measures || []) : previewMeasures}
          onLoadMore={async (page) => {
            const result = await lmsService.getTablatureMeasures(
              tablatureId,
              page,
              16
            )
            return result.measures
          }}
        />
      </div>
    )
  }

  // Aperçu avec bouton "Voir toute la tablature"
  return (
    <div className="mt-4">
      <Block className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Music size={16} className="text-orange-500" />
          <h4 className="text-sm font-bold text-black/85 dark:text-white/90">
            Tablature : {tablatureInfo.title}
          </h4>
          {tablatureInfo.artist && (
            <span className="text-xs text-black/60 dark:text-white/60">
              par {tablatureInfo.artist}
            </span>
          )}
        </div>

        {/* Aperçu de la tablature - Premières mesures seulement */}
        <div className="mb-4 overflow-x-auto">
          <div className="min-w-[600px]">
            <FullTablatureViewer
              tablatureId={tablatureId}
              initialMeasures={previewMeasures}
              onLoadMore={async () => {
                // Ne pas charger plus dans l'aperçu
                return []
              }}
            />
          </div>
        </div>

        {/* Bouton "Voir toute la tablature" */}
        <div className="flex justify-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <CTA
            onClick={() => setShowFull(true)}
            variant="important"
            icon={<ChevronDown size={18} />}
          >
            Voir toute la tablature ({totalMeasures} mesure{totalMeasures > 1 ? 's' : ''})
          </CTA>
        </div>
      </Block>
    </div>
  )
}

