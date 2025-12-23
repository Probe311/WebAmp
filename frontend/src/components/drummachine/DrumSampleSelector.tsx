/**
 * Composant pour rechercher et charger des samples de batterie depuis Freesound
 */
import { useState, useEffect, useCallback } from 'react'
import { Download, X, Music, ExternalLink } from 'lucide-react'
import { Modal } from '../Modal'
import { CTA } from '../CTA'
import { Loader } from '../Loader'
import { useToast } from '../notifications/ToastProvider'
import { freesoundService, type FreesoundSound } from '../../services/freesound'
import { DrumInstrument, INSTRUMENT_LABELS } from './DrumPad'
import { SearchBar } from '../SearchBar'

interface DrumSampleSelectorProps {
  isOpen: boolean
  onClose: () => void
  instrument: DrumInstrument
  onSampleSelected: (audioBlob: Blob, name: string) => Promise<void>
  currentSampleName?: string | null
}

// Mapping des instruments vers les termes de recherche Freesound
const INSTRUMENT_SEARCH_TERMS: Record<DrumInstrument, string> = {
  kick: 'drum kick bass',
  snare: 'drum snare',
  hihat: 'drum hihat closed',
  openhat: 'drum hihat open',
  crash: 'drum crash cymbal',
  ride: 'drum ride cymbal',
  tom1: 'drum tom',
  tom2: 'drum tom',
  tom3: 'drum tom'
}

export function DrumSampleSelector({
  isOpen,
  onClose,
  instrument,
  onSampleSelected,
  currentSampleName
}: DrumSampleSelectorProps) {
  const { showToast } = useToast()
  // Initialiser avec le nom français de l'instrument pour une recherche plus intelligente
  const initialSearchQuery = `${INSTRUMENT_LABELS[instrument]} drum`
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [searching, setSearching] = useState(false)
  const [samples, setSamples] = useState<FreesoundSound[]>([])
  const [downloading, setDownloading] = useState<number | null>(null)

  // Fonction de recherche avec un query personnalisé
  const searchSamplesWithQuery = useCallback(async (query: string) => {
    if (!query.trim()) return

    try {
      setSearching(true)
      // Utiliser la méthode searchDrumSamples pour les types spécifiques
      let results: FreesoundSound[] = []
      
      if (instrument === 'kick') {
        results = await freesoundService.searchDrumSamples('kick', 30)
      } else if (instrument === 'snare') {
        results = await freesoundService.searchDrumSamples('snare', 30)
      } else if (instrument === 'hihat' || instrument === 'openhat') {
        results = await freesoundService.searchDrumSamples('hihat', 30)
      } else if (instrument === 'crash') {
        results = await freesoundService.searchDrumSamples('crash', 30)
      } else if (instrument === 'ride') {
        results = await freesoundService.searchDrumSamples('ride', 30)
      } else if (instrument === 'tom1' || instrument === 'tom2' || instrument === 'tom3') {
        results = await freesoundService.searchDrumSamples('tom', 30)
      } else {
        // Recherche générique avec le query fourni
        const searchResult = await freesoundService.searchSounds(query, {
          filter: 'license:"Attribution" OR license:"Creative Commons 0"',
          sort: 'downloads_desc',
          pageSize: 30,
          fields: 'id,name,tags,description,license,previews,username,duration,samplerate,download'
        })
        results = searchResult.results
      }

      setSamples(results)
    } catch (error) {
      let errorMessage = 'Erreur lors de la recherche sur Freesound'
      if (error instanceof Error) {
        errorMessage = error.message
        // Message plus clair pour les erreurs d'authentification
        if (error.message.includes('No authentication method available')) {
          errorMessage = 'Configuration Freesound manquante. Veuillez configurer VITE_FREESOUND_API_KEY dans les variables d\'environnement.'
        } else if (error.message.includes('OAuth2') || error.message.includes('400')) {
          errorMessage = 'Erreur d\'authentification Freesound. La recherche fonctionne avec une API key simple (VITE_FREESOUND_API_KEY).'
        }
      }
      showToast({
        variant: 'error',
        title: 'Erreur de recherche',
        message: errorMessage
      })
      setSamples([])
    } finally {
      setSearching(false)
    }
  }, [instrument, showToast])

  // Mettre à jour la recherche quand l'instrument change
  useEffect(() => {
    if (isOpen) {
      const newSearchQuery = `${INSTRUMENT_LABELS[instrument]} drum`
      setSearchQuery(newSearchQuery)
      // Déclencher la recherche automatiquement
      searchSamplesWithQuery(newSearchQuery)
    }
  }, [isOpen, instrument, searchSamplesWithQuery])

  async function searchSamples() {
    await searchSamplesWithQuery(searchQuery)
  }

  async function handleDownloadSample(sound: FreesoundSound) {
    try {
      setDownloading(sound.id)
      showToast({
        variant: 'info',
        title: 'Chargement en cours',
        message: `Chargement de ${sound.name}...`
      })

      // Utiliser les previews publics (pas d’OAuth requis). Priorité OGG, puis MP3.
      const previewUrl =
        sound.previews?.['preview-hq-ogg'] ||
        sound.previews?.['preview-lq-ogg'] ||
        sound.previews?.['preview-hq-mp3'] ||
        sound.previews?.['preview-lq-mp3']

      if (!previewUrl) {
        showToast({
          variant: 'error',
          title: 'Aucun preview disponible',
          message: 'Ce sample ne fournit pas de preview public. Essayez un autre résultat.'
        })
        return
      }

      // Télécharger le preview et le convertir en Blob pour l’injecter dans la machine
      const response = await fetch(previewUrl)
      if (!response.ok) {
        throw new Error(`Préview inaccessible (HTTP ${response.status})`)
      }
      const blob = await response.blob()

      await onSampleSelected(blob, sound.name)
      
      showToast({
        variant: 'success',
        title: 'Sample chargé',
        message: `${sound.name} a été chargé avec succès (preview Freesound)`
      })

      onClose()
    } catch (error) {
      let errorMessage = 'Erreur lors du chargement du preview'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      showToast({
        variant: 'error',
        title: 'Erreur de chargement',
        message: errorMessage
      })
    } finally {
      setDownloading(null)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Sélectionner un sample pour ${INSTRUMENT_LABELS[instrument]}`}
      className="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Sample actuel */}
        {currentSampleName && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music size={16} className="text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Sample actuel: {currentSampleName}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Recherche */}
        <div className="flex gap-2">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={`Rechercher des samples ${INSTRUMENT_LABELS[instrument]}...`}
              onEnter={searchSamples}
              showSearchButton={true}
              onSearchClick={searchSamples}
              disabled={searching}
            />
          </div>
        </div>

        {/* Résultats */}
        {searching && (
          <div className="flex items-center justify-center py-8">
            <Loader size="sm" variant="light" />
            <span className="ml-3 text-black/60 dark:text-white/60">Recherche en cours...</span>
          </div>
        )}

        {!searching && samples.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {samples.map(sound => (
              <div
                key={sound.id}
                className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-black dark:text-white truncate">{sound.name}</h4>
                  {sound.description && (
                    <p className="text-sm text-black/60 dark:text-white/60 mt-1 line-clamp-2">
                      {sound.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-black/40 dark:text-white/40">
                    <span>Licence: {sound.license}</span>
                    <span>Durée: {sound.duration.toFixed(1)}s</span>
                    {sound.samplerate && <span>{sound.samplerate}Hz</span>}
                    {sound.tags.length > 0 && (
                      <span className="truncate">Tags: {sound.tags.slice(0, 3).join(', ')}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {sound.previews?.['preview-hq-mp3'] && (
                    <CTA
                      variant="icon-only"
                      icon={<ExternalLink size={16} />}
                      onClick={() => window.open(sound.previews!['preview-hq-mp3'], '_blank')}
                      title="Écouter l'aperçu"
                    />
                  )}
                  <CTA
                    variant="secondary"
                    icon={<Download size={16} />}
                    onClick={() => handleDownloadSample(sound)}
                    disabled={downloading === sound.id}
                  >
                    {downloading === sound.id ? 'Téléchargement...' : 'Utiliser'}
                  </CTA>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searching && samples.length === 0 && searchQuery && (
          <div className="text-center py-8 text-black/50 dark:text-white/50">
            Aucun résultat. Essayez une autre recherche.
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t border-black/10 dark:border-white/10">
          <CTA variant="secondary" onClick={onClose}>
            Fermer
          </CTA>
        </div>
      </div>
    </Modal>
  )
}

