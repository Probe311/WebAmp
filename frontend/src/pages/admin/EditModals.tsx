/**
 * Modales d'édition pour le panneau d'administration
 */
import React, { useState, useEffect } from 'react'
import { Modal } from '../../components/Modal'
import { Loader } from '../../components/Loader'
import { useToast } from '../../components/notifications/ToastProvider'
import { adminService, Preset, DLCPack, FeatureFlag } from '../../services/admin'
import { SupabasePedal, SupabaseAmplifier } from '../../services/supabase/catalog'

// Modal d'édition d'ampli
export function EditAmplifierModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  amplifier 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  amplifier: SupabaseAmplifier | null
}) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({ 
    brand: '', 
    model: '', 
    type: '', 
    description: '',
    color: '',
    style: '',
    knob_color: '',
    knob_base_color: '',
    grille_gradient_a: '',
    grille_gradient_b: '',
    grille_pattern: '',
    knob_layout: '',
    border_style: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (amplifier) {
      setFormData({
        brand: amplifier.brand || '',
        model: amplifier.model || '',
        type: amplifier.type || '',
        description: amplifier.description || '',
        color: amplifier.color || '',
        style: amplifier.style || '',
        knob_color: amplifier.knob_color || '',
        knob_base_color: amplifier.knob_base_color || '',
        grille_gradient_a: amplifier.grille_gradient_a || '',
        grille_gradient_b: amplifier.grille_gradient_b || '',
        grille_pattern: amplifier.grille_pattern || '',
        knob_layout: amplifier.knob_layout || '',
        border_style: amplifier.border_style || ''
      })
    }
  }, [amplifier, isOpen])

  const handleSubmit = async () => {
    if (!formData.brand.trim() || !formData.model.trim() || !formData.type.trim()) {
      showToast({ variant: 'error', title: 'Erreur', message: 'La marque, le modèle et le type sont obligatoires' })
      return
    }

    if (!amplifier) return

    setLoading(true)
    try {
      await adminService.updateAmplifier(amplifier.id, {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        type: formData.type.trim(),
        description: formData.description.trim() || null,
        color: formData.color.trim() || null,
        style: formData.style.trim() || null,
        knob_color: formData.knob_color.trim() || null,
        knob_base_color: formData.knob_base_color.trim() || null,
        grille_gradient_a: formData.grille_gradient_a.trim() || null,
        grille_gradient_b: formData.grille_gradient_b.trim() || null,
        grille_pattern: formData.grille_pattern.trim() || null,
        knob_layout: formData.knob_layout.trim() || null,
        border_style: formData.border_style.trim() || null
      })
      showToast({ variant: 'success', title: 'Ampli modifié', message: `L'ampli "${formData.brand} ${formData.model}" a été modifié avec succès.` })
      onSuccess()
      onClose()
    } catch (error) {
      showToast({ variant: 'error', title: 'Erreur', message: `Impossible de modifier l'ampli : ${error instanceof Error ? error.message : 'Erreur inconnue'}` })
    } finally {
      setLoading(false)
    }
  }

  if (!amplifier) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier un ampli" widthClassName="max-w-2xl">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Marque <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Fender"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Modèle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Twin Reverb"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Sélectionner</option>
              <option value="combo">Combo</option>
              <option value="head">Head</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={3}
            placeholder="Description de l'ampli"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Couleur</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="#000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Style</label>
            <select
              value={formData.style}
              onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Sélectionner</option>
              <option value="vintage">Vintage</option>
              <option value="modern">Modern</option>
              <option value="high-gain">High-Gain</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Couleur des boutons</label>
            <input
              type="text"
              value={formData.knob_color}
              onChange={(e) => setFormData({ ...formData, knob_color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="#FFFFFF"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Couleur de base des boutons</label>
            <select
              value={formData.knob_base_color}
              onChange={(e) => setFormData({ ...formData, knob_base_color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Sélectionner</option>
              <option value="black">Black</option>
              <option value="gold">Gold</option>
              <option value="chrome">Chrome</option>
              <option value="gray">Gray</option>
              <option value="silver">Silver</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gradient grille A</label>
            <input
              type="text"
              value={formData.grille_gradient_a}
              onChange={(e) => setFormData({ ...formData, grille_gradient_a: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="#000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gradient grille B</label>
            <input
              type="text"
              value={formData.grille_gradient_b}
              onChange={(e) => setFormData({ ...formData, grille_gradient_b: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Motif grille</label>
            <select
              value={formData.grille_pattern}
              onChange={(e) => setFormData({ ...formData, grille_pattern: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Sélectionner</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="grid">Grid</option>
              <option value="diagonal">Diagonal</option>
              <option value="none">None</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Layout boutons</label>
            <select
              value={formData.knob_layout}
              onChange={(e) => setFormData({ ...formData, knob_layout: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Sélectionner</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="grid">Grid</option>
              <option value="compact">Compact</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Style bordure</label>
            <select
              value={formData.border_style}
              onChange={(e) => setFormData({ ...formData, border_style: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Sélectionner</option>
              <option value="solid">Solid</option>
              <option value="double">Double</option>
              <option value="dashed">Dashed</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" disabled={loading}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading || !formData.brand.trim() || !formData.model.trim() || !formData.type.trim()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center">
            {loading ? (
              <>
                <Loader size="sm" variant="light" showText={false} className="!flex" />
                <span>Mise à jour...</span>
              </>
            ) : (
              'Mettre à jour'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal d'édition de pédale
export function EditPedalModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  pedal 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  pedal: SupabasePedal | null
}) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({ 
    brand: '', 
    model: '', 
    type: '', 
    description: '',
    color: '',
    accent_color: '',
    style: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pedal) {
      setFormData({
        brand: pedal.brand || '',
        model: pedal.model || '',
        type: pedal.type || '',
        description: pedal.description || '',
        color: pedal.color || '',
        accent_color: pedal.accent_color || '',
        style: pedal.style || ''
      })
    }
  }, [pedal, isOpen])

  const handleSubmit = async () => {
    if (!formData.brand.trim() || !formData.model.trim() || !formData.type.trim()) {
      showToast({ variant: 'error', title: 'Erreur', message: 'La marque, le modèle et le type sont obligatoires' })
      return
    }

    if (!pedal) return

    setLoading(true)
    try {
      await adminService.updatePedal(pedal.id, {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        type: formData.type.trim(),
        description: formData.description.trim() || null,
        color: formData.color.trim() || null,
        accent_color: formData.accent_color.trim() || null,
        style: formData.style.trim() || null
      })
      showToast({ variant: 'success', title: 'Pédale modifiée', message: `La pédale "${formData.brand} ${formData.model}" a été modifiée avec succès.` })
      onSuccess()
      onClose()
    } catch (error) {
      showToast({ variant: 'error', title: 'Erreur', message: `Impossible de modifier la pédale : ${error instanceof Error ? error.message : 'Erreur inconnue'}` })
    } finally {
      setLoading(false)
    }
  }

  if (!pedal) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier une pédale" widthClassName="max-w-2xl">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Marque <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Boss"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Modèle <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="DS-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="distortion"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={3}
            placeholder="Description de la pédale"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Couleur</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="#000000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Couleur accent</label>
            <input
              type="text"
              value={formData.accent_color}
              onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="#FF0000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Style</label>
            <select
              value={formData.style}
              onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Sélectionner</option>
              <option value="vintage">Vintage</option>
              <option value="modern">Modern</option>
              <option value="boutique">Boutique</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" disabled={loading}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading || !formData.brand.trim() || !formData.model.trim() || !formData.type.trim()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center">
            {loading ? (
              <>
                <Loader size="sm" variant="light" showText={false} className="!flex" />
                <span>Mise à jour...</span>
              </>
            ) : (
              'Mettre à jour'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal d'édition de preset
export function EditPresetModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  preset 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  preset: Preset | null
}) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    is_public: false
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (preset) {
      setFormData({
        name: preset.name || '',
        description: preset.description || '',
        is_public: preset.is_public || false
      })
    }
  }, [preset, isOpen])

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast({ variant: 'error', title: 'Erreur', message: 'Le nom est obligatoire' })
      return
    }

    if (!preset) return

    setLoading(true)
    try {
      await adminService.updatePreset(preset.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        is_public: formData.is_public
      })
      showToast({ variant: 'success', title: 'Preset modifié', message: `Le preset "${formData.name}" a été modifié avec succès.` })
      onSuccess()
      onClose()
    } catch (error) {
      showToast({ variant: 'error', title: 'Erreur', message: `Impossible de modifier le preset : ${error instanceof Error ? error.message : 'Erreur inconnue'}` })
    } finally {
      setLoading(false)
    }
  }

  if (!preset) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier un preset" widthClassName="max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Nom du preset"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={3}
            placeholder="Description du preset"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_public"
            checked={formData.is_public}
            onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
            className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="is_public" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Public
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" disabled={loading}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading || !formData.name.trim()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center">
            {loading ? (
              <>
                <Loader size="sm" variant="light" showText={false} className="!flex" />
                <span>Mise à jour...</span>
              </>
            ) : (
              'Mettre à jour'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal d'édition de pack DLC
export function EditDLCPackModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  pack 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  pack: DLCPack | null
}) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'course' as 'brand' | 'style' | 'course' | 'artist' | 'genre',
    category: '',
    price: '',
    currency: 'EUR',
    is_premium: true,
    tags: '',
    thumbnail: '',
    image_url: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (pack) {
      setFormData({
        name: pack.name || '',
        description: pack.description || '',
        type: pack.type || 'course',
        category: pack.category || '',
        price: pack.price?.toString() || '',
        currency: pack.currency || 'EUR',
        is_premium: pack.is_premium || false,
        tags: (pack.tags || []).join(', '),
        thumbnail: pack.thumbnail || '',
        image_url: pack.image_url || ''
      })
    }
  }, [pack, isOpen])

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.category.trim()) {
      showToast({ variant: 'error', title: 'Erreur', message: 'Le nom et la catégorie sont obligatoires' })
      return
    }

    if (!pack) return

    setLoading(true)
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      await adminService.updateDLCPack(pack.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        type: formData.type,
        category: formData.category.trim(),
        price: parseFloat(formData.price) || 0,
        currency: formData.currency,
        is_premium: formData.is_premium,
        tags: tagsArray,
        thumbnail: formData.thumbnail.trim() || null,
        image_url: formData.image_url.trim() || null
      })
      showToast({ variant: 'success', title: 'Pack modifié', message: `Le pack "${formData.name}" a été modifié avec succès.` })
      onSuccess()
      onClose()
    } catch (error) {
      showToast({ variant: 'error', title: 'Erreur', message: `Impossible de modifier le pack : ${error instanceof Error ? error.message : 'Erreur inconnue'}` })
    } finally {
      setLoading(false)
    }
  }

  if (!pack) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier un pack DLC" widthClassName="max-w-3xl">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Nom du pack"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Ex: Rock"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={3}
            placeholder="Description du pack"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="brand">Marque</option>
              <option value="style">Style</option>
              <option value="course">Cours</option>
              <option value="artist">Artiste</option>
              <option value="genre">Genre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="9.99"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Devise</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (séparés par des virgules)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="rock, blues, premium"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL Thumbnail</label>
            <input
              type="url"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="https://example.com/thumb.jpg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">URL Image</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.is_premium}
            onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
            className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pack premium</label>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" disabled={loading}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading || !formData.name.trim() || !formData.category.trim()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center">
            {loading ? (
              <>
                <Loader size="sm" variant="light" showText={false} className="!flex" />
                <span>Mise à jour...</span>
              </>
            ) : (
              'Mettre à jour'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal d'édition de feature flag
export function EditFeatureFlagModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  flag 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  flag: FeatureFlag | null
}) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({ key: '', name: '', description: '', enabled: false, value: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (flag) {
      let valueStr = ''
      if (flag.value !== null && flag.value !== undefined) {
        if (typeof flag.value === 'string') {
          valueStr = flag.value
        } else {
          try {
            valueStr = JSON.stringify(flag.value, null, 2)
          } catch {
            valueStr = String(flag.value)
          }
        }
      }
      setFormData({
        key: flag.key || '',
        name: flag.name || '',
        description: flag.description || '',
        enabled: flag.enabled || false,
        value: valueStr
      })
    }
  }, [flag, isOpen])

  const handleSubmit = async () => {
    if (!formData.key.trim() || !formData.name.trim()) {
      showToast({ variant: 'error', title: 'Erreur', message: 'La clé et le nom sont obligatoires' })
      return
    }

    if (!flag) return

    setLoading(true)
    try {
      let parsedValue: any = null
      if (formData.value.trim()) {
        try {
          parsedValue = JSON.parse(formData.value.trim())
        } catch {
          parsedValue = formData.value.trim()
        }
      }

      await adminService.updateFeatureFlag(flag.id, {
        key: formData.key.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        enabled: formData.enabled,
        value: parsedValue
      })
      showToast({ variant: 'success', title: 'Feature flag modifié', message: `Le feature flag "${formData.name}" a été modifié avec succès.` })
      onSuccess()
      onClose()
    } catch (error) {
      showToast({ variant: 'error', title: 'Erreur', message: `Impossible de modifier le feature flag : ${error instanceof Error ? error.message : 'Erreur inconnue'}` })
    } finally {
      setLoading(false)
    }
  }

  if (!flag) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier un feature flag" widthClassName="max-w-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Clé <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
            placeholder="ex: new_feature"
            disabled
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">La clé ne peut pas être modifiée</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Ex: Nouvelle fonctionnalité"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={3}
            placeholder="Description du feature flag"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valeur (JSON optionnel)</label>
          <textarea
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
            rows={3}
            placeholder='{"config": "value"} ou texte simple'
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enabled"
            checked={formData.enabled}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="enabled" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Activé
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" disabled={loading}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading || !formData.key.trim() || !formData.name.trim()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center">
            {loading ? (
              <>
                <Loader size="sm" variant="light" showText={false} className="!flex" />
                <span>Mise à jour...</span>
              </>
            ) : (
              'Mettre à jour'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

