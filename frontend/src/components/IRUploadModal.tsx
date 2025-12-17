/**
 * Composant pour uploader des Impulse Responses
 */
import { useState, useRef, useEffect } from 'react'
import { Upload, FileAudio, Search, Download, ExternalLink, Link as LinkIcon } from 'lucide-react'
import { Modal } from './Modal'
import { CTA } from './CTA'
import { Loader } from './Loader'
import { useToast } from './notifications/ToastProvider'
import { useAuth } from '../auth/AuthProvider'
import { uploadIR, loadUserIRs, ImpulseResponse } from '../services/supabase/impulseResponses'
import { freesoundService, type FreesoundSound } from '../services/freesound'
import { formatDateFrench } from '../utils/dateFormatter'

interface IRUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onIRSelected?: (ir: ImpulseResponse) => void
}

export function IRUploadModal({ isOpen, onClose, onIRSelected }: IRUploadModalProps) {
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { showToast } = useToast()
  const [uploading, setUploading] = useState(false)
  const [irName, setIrName] = useState('')
  const [irDescription, setIrDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [userIRs, setUserIRs] = useState<ImpulseResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [freesoundIRs, setFreesoundIRs] = useState<FreesoundSound[]>([])
  const [searchingFreesound, setSearchingFreesound] = useState(false)
  const [freesoundQuery, setFreesoundQuery] = useState('guitar cabinet impulse response')
  const [irUrl, setIrUrl] = useState('')
  const [importingFromUrl, setImportingFromUrl] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Charger les IR de l'utilisateur à l'ouverture
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadIRs()
    }
  }, [isOpen, isAuthenticated])

  async function loadIRs() {
    try {
      setLoading(true)
      const irs = await loadUserIRs()
      setUserIRs(irs)
    } catch (error) {
      // échec silencieux du chargement des IR
    } finally {
      setLoading(false)
    }
  }

  async function searchFreesoundIRs() {
    try {
      setSearchingFreesound(true)
      const results = await freesoundService.searchImpulseResponses(freesoundQuery, 20)
      setFreesoundIRs(results)
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur de recherche',
        message: error instanceof Error ? error.message : 'Erreur lors de la recherche sur Freesound'
      })
    } finally {
      setSearchingFreesound(false)
    }
  }

  async function handleDownloadFreesoundIR(sound: FreesoundSound) {
    try {
      showToast({
        variant: 'info',
        title: 'Téléchargement en cours',
        message: `Téléchargement de ${sound.name}...`
      })

      const blob = await freesoundService.downloadSound(sound.id)
      
      // Utiliser l'IR téléchargée
      if (onIRSelected) {
        // Créer une URL temporaire pour l'IR
        const url = URL.createObjectURL(blob)
        // Note: On devrait créer un ImpulseResponse depuis le FreesoundSound
        // Pour l'instant, on passe juste l'URL
        const tempIR: ImpulseResponse = {
          id: `freesound-${sound.id}`,
          name: sound.name,
          description: sound.description || `IR depuis Freesound (${sound.license})`,
          file_path: url,
          mime_type: 'audio/wav',
          created_at: sound.created,
          user_id: null,
          is_public: false,
          sample_rate: null,
          length_ms: null
        }
        onIRSelected(tempIR)
      }
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur de téléchargement',
        message: error instanceof Error ? error.message : 'Erreur lors du téléchargement depuis Freesound'
      })
    }
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    const validTypes = ['audio/wav', 'audio/x-wav', 'audio/ogg', 'application/octet-stream']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(wav|ogg)$/i)) {
      showToast({
        variant: 'error',
        title: 'Format invalide',
        message: 'Veuillez sélectionner un fichier WAV ou OGG'
      })
      return
    }

    // Vérifier la taille (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      showToast({
        variant: 'error',
        title: 'Fichier trop volumineux',
        message: 'La taille maximale est de 50 MB'
      })
      return
    }

    setSelectedFile(file)
    if (!irName.trim()) {
      setIrName(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  async function handleUpload() {
    if (!selectedFile || !irName.trim()) {
      showToast({
        variant: 'error',
        title: 'Champs requis',
        message: 'Veuillez sélectionner un fichier et entrer un nom'
      })
      return
    }

    try {
      setUploading(true)
      const ir = await uploadIR({
        name: irName,
        description: irDescription || undefined,
        file: selectedFile,
        is_public: false
      })

      showToast({
        variant: 'success',
        title: 'IR uploadé',
        message: 'Le fichier IR a été uploadé avec succès'
      })

      setSelectedFile(null)
      setIrName('')
      setIrDescription('')
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      await loadIRs()

      if (onIRSelected) {
        onIRSelected(ir)
      }
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Erreur lors de l\'upload'
      })
    } finally {
      setUploading(false)
    }
  }

  async function handleImportFromUrl() {
    if (!irUrl.trim()) {
      showToast({
        variant: 'error',
        title: 'URL requise',
        message: 'Veuillez saisir une URL de fichier IR (WAV ou OGG)'
      })
      return
    }

    try {
      setImportingFromUrl(true)

      const response = await fetch(irUrl)
      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`)
      }

      const contentType = response.headers.get('content-type') || ''
      const isAudio = contentType.includes('audio') || !!irUrl.match(/\.(wav|ogg)$/i)
      if (!isAudio) {
        throw new Error('Le fichier distant ne semble pas être un audio (WAV/OGG)')
      }

      const blob = await response.blob()

      // Limite de taille 50MB comme pour l’upload local
      if (blob.size > 50 * 1024 * 1024) {
        throw new Error('Fichier trop volumineux (max 50 MB)')
      }

      // Déduire un nom à partir de l’URL si besoin
      const urlFileName = irUrl.split('/').pop() || 'remote-ir.wav'
      const finalName = irName.trim() || urlFileName.replace(/\.[^/.]+$/, '')

      const file = new File([blob], urlFileName, { type: contentType || 'audio/wav' })

      const ir = await uploadIR({
        name: finalName,
        description: irDescription || `IR importée depuis ${irUrl}`,
        file,
        is_public: false
      })

      showToast({
        variant: 'success',
        title: 'IR importée',
        message: 'Le fichier IR distant a été importé avec succès'
      })

      setIrUrl('')
      if (!irName.trim()) {
        setIrName(finalName)
      }

      await loadIRs()

      if (onIRSelected) {
        onIRSelected(ir)
      }
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur import URL',
        message: error instanceof Error ? error.message : 'Erreur lors de l’import depuis l’URL'
      })
    } finally {
      setImportingFromUrl(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Upload d'IR">
        <div className="p-6 text-center">
          <p className="text-black/70 dark:text-white/70 mb-4">
            Vous devez être connecté pour uploader des IR
          </p>
          <CTA variant="primary" onClick={onClose}>
            Fermer
          </CTA>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestion des Impulse Responses" className="max-w-2xl">
      <div className="space-y-6">
        {/* Upload */}
        <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <Upload size={20} />
            Uploader un IR
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Fichier (WAV ou OGG, max 50MB) *
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".wav,.ogg,audio/wav,audio/ogg"
                onChange={handleFileSelect}
                className="hidden"
                id="ir-file-input"
              />
              <label htmlFor="ir-file-input" className="block">
                <div className="px-4 py-3 border-2 border-dashed border-black/20 dark:border-white/20 rounded-lg cursor-pointer hover:border-black/40 dark:hover:border-white/40 transition-colors">
                  {selectedFile ? (
                    <div className="flex items-center gap-2">
                      <FileAudio size={20} />
                      <span className="text-sm text-black dark:text-white">{selectedFile.name}</span>
                      <span className="text-xs text-black/50 dark:text-white/50">
                        ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                  ) : (
                    <div className="text-center text-black/50 dark:text-white/50">
                      Cliquez pour sélectionner un fichier
                    </div>
                  )}
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={irName}
                onChange={(e) => setIrName(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20"
                placeholder="Nom de l'IR"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Description
              </label>
              <textarea
                value={irDescription}
                onChange={(e) => setIrDescription(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20"
                rows={2}
                placeholder="Description de l'IR..."
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <CTA
                variant="primary"
                icon={<Upload size={18} />}
                onClick={handleUpload}
                disabled={!selectedFile || !irName.trim() || uploading}
                className="w-full md:w-1/2"
              >
                {uploading ? 'Upload en cours...' : 'Uploader'}
              </CTA>

              {/* Import depuis URL (dépôts communautaires type Tone3000, etc.) */}
              <div className="flex-1 flex flex-col gap-2">
                <label className="block text-xs font-medium text-black/60 dark:text-white/60">
                  Importer depuis une URL (WAV/OGG)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={irUrl}
                    onChange={(e) => setIrUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20 text-xs"
                    placeholder="https://exemple.com/ir/gratuit.wav"
                  />
                  <CTA
                    variant="secondary"
                    icon={<LinkIcon size={16} />}
                    onClick={handleImportFromUrl}
                    disabled={importingFromUrl || !irUrl.trim()}
                  >
                    {importingFromUrl ? 'Import...' : 'Importer'}
                  </CTA>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recherche Freesound */}
        <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <Search size={20} />
            Rechercher des IR sur Freesound
          </h3>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={freesoundQuery}
                onChange={(e) => setFreesoundQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchFreesoundIRs()}
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20"
                placeholder="Rechercher des IR (ex: guitar cabinet, reverb room...)"
              />
              <CTA
                variant="primary"
                icon={<Search size={18} />}
                onClick={searchFreesoundIRs}
                disabled={searchingFreesound || !freesoundQuery.trim()}
              >
                Rechercher
              </CTA>
            </div>

            {searchingFreesound && (
              <div className="text-center py-4 text-black/50 dark:text-white/50">
                Recherche en cours...
              </div>
            )}

            {freesoundIRs.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {freesoundIRs.map(sound => (
                  <div
                    key={sound.id}
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-black dark:text-white">{sound.name}</h4>
                      {sound.description && (
                        <p className="text-sm text-black/60 dark:text-white/60 mt-1 line-clamp-2">
                          {sound.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-black/40 dark:text-white/40">
                        <span>Licence: {sound.license}</span>
                        <span>Durée: {sound.duration.toFixed(1)}s</span>
                        <span>Sample Rate: {sound.samplerate}Hz</span>
                        {sound.tags.length > 0 && (
                          <span>Tags: {sound.tags.slice(0, 3).join(', ')}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {sound.previews?.['preview-hq-mp3'] && (
                        <CTA
                          variant="icon-only"
                          icon={<ExternalLink size={16} />}
                          onClick={() => window.open(sound.previews['preview-hq-mp3'], '_blank')}
                          title="Écouter l'aperçu"
                        />
                      )}
                      <CTA
                        variant="secondary"
                        icon={<Download size={16} />}
                        onClick={() => handleDownloadFreesoundIR(sound)}
                        title="Télécharger et utiliser"
                      >
                        Utiliser
                      </CTA>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!searchingFreesound && freesoundIRs.length === 0 && freesoundQuery && (
              <div className="text-center py-4 text-black/50 dark:text-white/50">
                Aucun résultat. Essayez une autre recherche.
              </div>
            )}
          </div>
        </div>

        {/* Liste des IR */}
        <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Mes IR ({userIRs.length})
          </h3>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader size="sm" variant="light" />
            </div>
          ) : userIRs.length === 0 ? (
            <div className="text-center py-4 text-black/50 dark:text-white/50">
              Aucun IR uploadé
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
              {userIRs.map(ir => (
                <div
                  key={ir.id}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-black dark:text-white">{ir.name}</h4>
                    {ir.description && (
                      <p className="text-sm text-black/60 dark:text-white/60 mt-1">{ir.description}</p>
                    )}
                    <p className="text-xs text-black/40 dark:text-white/40 mt-1">
                      {ir.mime_type} • {formatDateFrench(ir.created_at)}
                    </p>
                  </div>
                  <CTA
                    variant="secondary"
                    onClick={() => {
                      if (onIRSelected) {
                        onIRSelected(ir)
                      }
                      onClose()
                    }}
                  >
                    Utiliser
                  </CTA>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <CTA variant="secondary" onClick={onClose}>
            Fermer
          </CTA>
        </div>
      </div>
    </Modal>
  )
}

