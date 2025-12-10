/**
 * Composant pour gérer les presets (liste, création, édition, suppression)
 */
import { useState, useEffect } from 'react'
import { Save, Trash2, Edit2, Star, Download, Plus } from 'lucide-react'
import { Modal } from './Modal'
import { CTA } from './CTA'
import { useToast } from './notifications/ToastProvider'
import { useAuth } from '../beta/auth/AuthProvider'
import { 
  loadUserPresets, 
  loadPublicPresets, 
  createPreset, 
  updatePreset, 
  deletePreset,
  Preset,
  PresetCreate
} from '../services/supabase/presets'
import { addFavorite, removeFavorite, isFavorite, loadFavorites } from '../services/supabase/favorites'
import { Effect } from './Pedalboard'

interface PresetsManagerProps {
  isOpen: boolean
  onClose: () => void
  onLoadPreset: (preset: Preset) => void
  currentEffects: Effect[]
  currentAmplifierId?: string
  currentAmplifierParameters?: Record<string, number>
}

export function PresetsManager({
  isOpen,
  onClose,
  onLoadPreset,
  currentEffects,
  currentAmplifierId,
  currentAmplifierParameters
}: PresetsManagerProps) {
  const { user } = useAuth()
  const isAuthenticated = !!user
  const { showToast } = useToast()
  const [presets, setPresets] = useState<Preset[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)
  const [presetName, setPresetName] = useState('')
  const [presetNotes, setPresetNotes] = useState('')
  const [presetTags, setPresetTags] = useState('')
  const [presetIsPublic, setPresetIsPublic] = useState(false)
  const [activeTab, setActiveTab] = useState<'my' | 'public' | 'favorites'>('my')

  useEffect(() => {
    if (isOpen) {
      loadPresets()
    }
  }, [isOpen, activeTab, isAuthenticated])

  async function loadPresets() {
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      let loadedPresets: Preset[] = []

      if (activeTab === 'my') {
        loadedPresets = await loadUserPresets()
      } else if (activeTab === 'public') {
        loadedPresets = await loadPublicPresets()
      } else if (activeTab === 'favorites') {
        loadedPresets = await loadFavorites()
      }

      setPresets(loadedPresets)

      // Charger les favoris
      if (isAuthenticated) {
        const favoriteIds = await Promise.all(
          loadedPresets.map(p => isFavorite(p.id).then(fav => fav ? p.id : null))
        )
        setFavorites(new Set(favoriteIds.filter(id => id !== null) as string[]))
      }
    } catch (error) {
      console.error('Erreur lors du chargement des presets:', error)
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Erreur lors du chargement'
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleSavePreset() {
    if (!presetName.trim()) {
      showToast({
        variant: 'error',
        title: 'Nom requis',
        message: 'Veuillez entrer un nom pour le preset'
      })
      return
    }

    try {
      const tags = presetTags.split(',').map(t => t.trim()).filter(t => t.length > 0)
      
      const presetData: PresetCreate = {
        name: presetName,
        notes: presetNotes || undefined,
        tags: tags.length > 0 ? tags : undefined,
        is_public: presetIsPublic,
        effects: currentEffects,
        amplifier_id: currentAmplifierId,
        amplifier_parameters: currentAmplifierParameters
      }

      if (editingPreset) {
        await updatePreset(editingPreset.id, presetData)
        showToast({
          variant: 'success',
          title: 'Preset mis à jour',
          message: 'Le preset a été mis à jour avec succès'
        })
      } else {
        await createPreset(presetData)
        showToast({
          variant: 'success',
          title: 'Preset créé',
          message: 'Le preset a été créé avec succès'
        })
      }

      setShowCreateModal(false)
      setShowEditModal(false)
      setEditingPreset(null)
      setPresetName('')
      setPresetNotes('')
      setPresetTags('')
      setPresetIsPublic(false)
      loadPresets()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Erreur lors de la sauvegarde'
      })
    }
  }

  async function handleDeletePreset(preset: Preset) {
    if (!confirm(`Supprimer le preset "${preset.name}" ?`)) return

    try {
      await deletePreset(preset.id)
      showToast({
        variant: 'success',
        title: 'Preset supprimé',
        message: 'Le preset a été supprimé avec succès'
      })
      loadPresets()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Erreur lors de la suppression'
      })
    }
  }

  async function handleToggleFavorite(presetId: string) {
    try {
      const isFav = favorites.has(presetId)
      if (isFav) {
        await removeFavorite(presetId)
        setFavorites(prev => {
          const next = new Set(prev)
          next.delete(presetId)
          return next
        })
      } else {
        await addFavorite(presetId)
        setFavorites(prev => new Set(prev).add(presetId))
      }
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Erreur lors de la mise à jour des favoris'
      })
    }
  }

  function handleEditPreset(preset: Preset) {
    setEditingPreset(preset)
    setPresetName(preset.name)
    setPresetNotes(preset.notes || '')
    setPresetTags(preset.tags.join(', '))
    setPresetIsPublic(preset.is_public)
    setShowEditModal(true)
  }

  function handleLoadPreset(preset: Preset) {
    onLoadPreset(preset)
    showToast({
      variant: 'success',
      title: 'Preset chargé',
      message: `Le preset "${preset.name}" a été chargé`
    })
    onClose()
  }

  if (!isAuthenticated) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Gestion des presets">
        <div className="p-6 text-center">
          <p className="text-black/70 dark:text-white/70 mb-4">
            Vous devez être connecté pour gérer vos presets
          </p>
          <CTA variant="primary" onClick={onClose}>
            Fermer
          </CTA>
        </div>
      </Modal>
    )
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Gestion des presets" className="max-w-4xl">
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-black/10 dark:border-white/10">
            <button
              onClick={() => setActiveTab('my')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'my'
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                  : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
              }`}
            >
              Mes presets
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'public'
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                  : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
              }`}
            >
              Presets publics
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'favorites'
                  ? 'text-black dark:text-white border-b-2 border-black dark:border-white'
                  : 'text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white'
              }`}
            >
              Favoris
            </button>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <CTA
              variant="primary"
              icon={<Plus size={18} />}
              onClick={() => {
                setPresetName('')
                setPresetNotes('')
                setPresetTags('')
                setPresetIsPublic(false)
                setShowCreateModal(true)
              }}
            >
              Nouveau preset
            </CTA>
          </div>

          {/* Liste des presets */}
          {loading ? (
            <div className="text-center py-8 text-black/50 dark:text-white/50">
              Chargement...
            </div>
          ) : presets.length === 0 ? (
            <div className="text-center py-8 text-black/50 dark:text-white/50">
              Aucun preset {activeTab === 'my' ? 'personnel' : activeTab === 'public' ? 'public' : 'favori'}
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {presets.map(preset => (
                <div
                  key={preset.id}
                  className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-black dark:text-white">{preset.name}</h3>
                      {preset.is_public && (
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded">
                          Public
                        </span>
                      )}
                    </div>
                    {preset.notes && (
                      <p className="text-sm text-black/60 dark:text-white/60 mt-1">{preset.notes}</p>
                    )}
                    {preset.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {preset.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-0.5 bg-black/5 dark:bg-white/5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-black/40 dark:text-white/40 mt-1">
                      {preset.effects.length} effet(s) • {preset.amplifier_id ? 'Avec ampli' : 'Sans ampli'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <CTA
                      variant="icon-only"
                      icon={<Star size={16} />}
                      onClick={() => handleToggleFavorite(preset.id)}
                      className={favorites.has(preset.id) ? 'text-yellow-500' : ''}
                    />
                    <CTA
                      variant="icon-only"
                      icon={<Download size={16} />}
                      onClick={() => handleLoadPreset(preset)}
                      title="Charger le preset"
                    />
                    {activeTab === 'my' && (
                      <>
                        <CTA
                          variant="icon-only"
                          icon={<Edit2 size={16} />}
                          onClick={() => handleEditPreset(preset)}
                          title="Modifier"
                        />
                        <CTA
                          variant="icon-only"
                          icon={<Trash2 size={16} />}
                          onClick={() => handleDeletePreset(preset)}
                          title="Supprimer"
                          className="text-red-500"
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Modal de création/édition */}
      <Modal
        isOpen={showCreateModal || showEditModal}
        onClose={() => {
          setShowCreateModal(false)
          setShowEditModal(false)
          setEditingPreset(null)
        }}
        title={editingPreset ? 'Modifier le preset' : 'Nouveau preset'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
              Nom *
            </label>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20"
              placeholder="Mon preset"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
              Notes
            </label>
            <textarea
              value={presetNotes}
              onChange={(e) => setPresetNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20"
              rows={3}
              placeholder="Description du preset..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
              Tags (séparés par des virgules)
            </label>
            <input
              type="text"
              value={presetTags}
              onChange={(e) => setPresetTags(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20"
              placeholder="rock, distortion, lead"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={presetIsPublic}
              onChange={(e) => setPresetIsPublic(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="isPublic" className="text-sm text-black/70 dark:text-white/70">
              Rendre ce preset public
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <CTA
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false)
                setShowEditModal(false)
                setEditingPreset(null)
              }}
            >
              Annuler
            </CTA>
            <CTA variant="primary" icon={<Save size={18} />} onClick={handleSavePreset}>
              {editingPreset ? 'Mettre à jour' : 'Créer'}
            </CTA>
          </div>
        </div>
      </Modal>
    </>
  )
}

