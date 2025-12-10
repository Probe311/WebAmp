import { useState } from 'react'
import { Modal } from './Modal'
import { CTA } from './CTA'
import { Download, Upload } from 'lucide-react'
import { exportPreset, downloadPreset, importPreset, validatePreset, PresetExport } from '../utils/presetExport'
import { useToast } from './notifications/ToastProvider'
import { Effect } from './Pedalboard'

interface PresetExportModalProps {
  isOpen: boolean
  onClose: () => void
  presetName: string
  amplifierId: string | undefined
  amplifierParameters: Record<string, number> | undefined
  effects: Effect[]
  onImport?: (preset: PresetExport) => void
}

export function PresetExportModal({
  isOpen,
  onClose,
  presetName,
  amplifierId,
  amplifierParameters,
  effects,
  onImport
}: PresetExportModalProps) {
  const { showToast } = useToast()
  const [exportMetadata, setExportMetadata] = useState({
    description: '',
    author: '',
    tags: '',
    genre: '',
    style: ''
  })

  const handleExport = () => {
    try {
      const tags = exportMetadata.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)
      
      const preset = exportPreset(
        presetName || 'Unnamed Preset',
        amplifierId,
        amplifierParameters,
        effects,
        {
          description: exportMetadata.description || undefined,
          author: exportMetadata.author || undefined,
          tags: tags.length > 0 ? tags : undefined,
          genre: exportMetadata.genre || undefined,
          style: exportMetadata.style || undefined
        }
      )
      
      downloadPreset(preset)
      showToast({
        variant: 'success',
        title: 'Preset exporté',
        message: 'Le preset a été téléchargé avec succès'
      })
      onClose()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur d\'export',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    }
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const preset = await importPreset(file)
      const validation = validatePreset(preset)
      
      if (!validation.valid) {
        showToast({
          variant: 'error',
          title: 'Preset invalide',
          message: validation.errors.join(', ')
        })
        return
      }
      
      if (onImport) {
        onImport(preset)
        showToast({
          variant: 'success',
          title: 'Preset importé',
          message: `Le preset "${preset.name}" a été importé avec succès`
        })
        onClose()
      }
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur d\'import',
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    }
    
    // Réinitialiser l'input
    event.target.value = ''
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export/Import de preset"
      className="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Export */}
        <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <Download size={20} />
            Exporter le preset
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Description
              </label>
              <textarea
                value={exportMetadata.description}
                onChange={(e) => setExportMetadata({ ...exportMetadata, description: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                rows={2}
                placeholder="Description du preset..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                  Auteur
                </label>
                <input
                  type="text"
                  value={exportMetadata.author}
                  onChange={(e) => setExportMetadata({ ...exportMetadata, author: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  placeholder="Votre nom..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  value={exportMetadata.genre}
                  onChange={(e) => setExportMetadata({ ...exportMetadata, genre: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                  placeholder="Rock, Metal, Blues..."
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Tags (séparés par des virgules)
              </label>
              <input
                type="text"
                value={exportMetadata.tags}
                onChange={(e) => setExportMetadata({ ...exportMetadata, tags: e.target.value })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                placeholder="heavy, distortion, lead..."
              />
            </div>
            
            <CTA
              variant="primary"
              icon={<Download size={18} />}
              onClick={handleExport}
              className="w-full"
            >
              Télécharger le preset
            </CTA>
          </div>
        </div>

        {/* Import */}
        <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
            <Upload size={20} />
            Importer un preset
          </h3>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="preset-import-input"
              />
              <label htmlFor="preset-import-input" className="block">
                <CTA
                  variant="secondary"
                  icon={<Upload size={18} />}
                  onClick={() => {}}
                  className="w-full cursor-pointer"
                >
                  Sélectionner un fichier JSON
                </CTA>
              </label>
            </div>
            
            <p className="text-xs text-black/50 dark:text-white/50">
              Sélectionnez un fichier JSON de preset pour l'importer dans WebAmp
            </p>
          </div>
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

