/**
 * Composant pour uploader des Impulse Responses
 */
import { useState, useRef, useEffect } from 'react'
import { Upload, FileAudio } from 'lucide-react'
import { Modal } from './Modal'
import { CTA } from './CTA'
import { useToast } from './notifications/ToastProvider'
import { useAuth } from '../beta/auth/AuthProvider'
import { uploadIR, loadUserIRs, ImpulseResponse } from '../services/supabase/impulseResponses'

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
      console.error('Erreur lors du chargement des IR:', error)
    } finally {
      setLoading(false)
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

            <CTA
              variant="primary"
              icon={<Upload size={18} />}
              onClick={handleUpload}
              disabled={!selectedFile || !irName.trim() || uploading}
              className="w-full"
            >
              {uploading ? 'Upload en cours...' : 'Uploader'}
            </CTA>
          </div>
        </div>

        {/* Liste des IR */}
        <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
            Mes IR ({userIRs.length})
          </h3>

          {loading ? (
            <div className="text-center py-4 text-black/50 dark:text-white/50">
              Chargement...
            </div>
          ) : userIRs.length === 0 ? (
            <div className="text-center py-4 text-black/50 dark:text-white/50">
              Aucun IR uploadé
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
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
                      {ir.mime_type} • {new Date(ir.created_at).toLocaleDateString()}
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

