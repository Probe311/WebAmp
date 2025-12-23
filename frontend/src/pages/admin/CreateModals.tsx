/**
 * Modales de création pour le panneau d'administration
 */
import React, { useState } from 'react'
import { Modal } from '../../components/Modal'
import { Loader } from '../../components/Loader'
import { useToast } from '../../components/notifications/ToastProvider'
import { adminService, BrandFromProducts } from '../../services/admin'
import { Course, Lesson } from '../../services/supabase'
import { SupabasePedal, SupabaseAmplifier } from '../../services/supabase/catalog'
import { getBrandLogos } from '../../utils/brandLogos'
import { generateLogoFilename, isValidSVG, svgToDataURI } from '../../utils/brandLogoUtils'
import { createLogger } from '../../services/logger'

const logger = createLogger('CreateModals')

// Modal de création/édition de marque
export function CreateBrandModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  editingBrand 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingBrand?: BrandFromProducts | null
}) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    logo_svg: '', 
    logo_svg_small: '',
    website: '' 
  })
  const [loading, setLoading] = useState(false)

  // Pré-remplir les champs si on est en mode édition
  React.useEffect(() => {
    if (editingBrand) {
      const brand = editingBrand.brandData
      // Si logo_url contient du SVG (commence par <svg ou data:image/svg), l'utiliser directement
      // Sinon, essayer de charger depuis le fichier local
      let logoSvg = ''
      let logoSvgSmall = ''
      
      if (brand?.logo_url) {
        if (brand.logo_url.startsWith('<svg') || brand.logo_url.startsWith('data:image/svg')) {
          logoSvg = brand.logo_url.startsWith('data:') 
            ? decodeURIComponent(brand.logo_url.split(',')[1] || '')
            : brand.logo_url
        } else if (brand.logo_url.startsWith('/assets/logos/')) {
          // C'est un chemin local, on garde vide car on ne peut pas charger le fichier depuis le navigateur
          logoSvg = ''
        }
      }
      
      if (brand?.logo_url_small) {
        if (brand.logo_url_small.startsWith('<svg') || brand.logo_url_small.startsWith('data:image/svg')) {
          logoSvgSmall = brand.logo_url_small.startsWith('data:') 
            ? decodeURIComponent(brand.logo_url_small.split(',')[1] || '')
            : brand.logo_url_small
        } else if (brand.logo_url_small.startsWith('/assets/logos/')) {
          logoSvgSmall = ''
        }
      }
      
      setFormData({
        name: editingBrand.name,
        description: brand?.description || '',
        logo_svg: logoSvg,
        logo_svg_small: logoSvgSmall,
        website: brand?.website || ''
      })
    } else {
      setFormData({ name: '', description: '', logo_svg: '', logo_svg_small: '', website: '' })
    }
  }, [editingBrand, isOpen])

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showToast({ variant: 'error', title: 'Erreur', message: 'Le nom est obligatoire' })
      return
    }

    // Valider les SVG si fournis
    if (formData.logo_svg.trim() && !isValidSVG(formData.logo_svg)) {
      showToast({ variant: 'error', title: 'Erreur', message: 'Le logo principal n\'est pas un SVG valide' })
      return
    }
    
    if (formData.logo_svg_small.trim() && !isValidSVG(formData.logo_svg_small)) {
      showToast({ variant: 'error', title: 'Erreur', message: 'Le logo petit n\'est pas un SVG valide' })
      return
    }

    setLoading(true)
    try {
      // Générer les noms de fichiers et chemins
      const logoFilename = formData.logo_svg.trim() ? generateLogoFilename(formData.name.trim()) : null
      const logoSmallFilename = formData.logo_svg_small.trim() ? generateLogoFilename(formData.name.trim(), 'small') : null
      
      // Convertir les SVG en data URI pour un stockage plus efficace
      // Cela évite les problèmes de taille et permet un meilleur encodage
      const logoUrl = formData.logo_svg.trim() 
        ? svgToDataURI(formData.logo_svg.trim()) // Convertir en data URI
        : null
      
      const logoUrlSmall = formData.logo_svg_small.trim()
        ? svgToDataURI(formData.logo_svg_small.trim()) // Convertir en data URI
        : null
      
      // Vérifier la taille des data URI (limite PostgreSQL TEXT ~1GB, mais on limite à 1MB pour être sûr)
      const MAX_SIZE = 1024 * 1024 // 1MB
      if (logoUrl && logoUrl.length > MAX_SIZE) {
        showToast({ variant: 'error', title: 'Erreur', message: 'Le logo principal est trop volumineux (max 1MB)' })
        setLoading(false)
        return
      }
      if (logoUrlSmall && logoUrlSmall.length > MAX_SIZE) {
        showToast({ variant: 'error', title: 'Erreur', message: 'Le logo petit est trop volumineux (max 1MB)' })
        setLoading(false)
        return
      }

      // Préparer les données à mettre à jour/créer
      // Ne pas inclure logo_url_small si la colonne n'existe pas dans la base
      const brandData: any = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        logo_url: logoUrl,
        website: formData.website.trim() || null
      }
      
      // Ajouter logo_url_small seulement si on a une valeur (la colonne peut ne pas exister)
      if (logoUrlSmall) {
        brandData.logo_url_small = logoUrlSmall
      }

      // Si on a un ID de marque existant, on met à jour
      // Sinon, on crée une nouvelle marque (même si editingBrand existe, car la marque n'existe pas encore dans la table brands)
      if (editingBrand?.brandData?.id) {
        // Mise à jour - on a un ID de marque existant
        await adminService.updateBrand(editingBrand.brandData.id, brandData)
        showToast({ variant: 'success', title: 'Marque mise à jour', message: `La marque "${formData.name}" a été mise à jour avec succès.` })
      } else {
        // Création - soit nouvelle marque, soit marque qui existe dans les produits mais pas dans la table brands
        await adminService.createBrand(brandData)
        showToast({ variant: 'success', title: 'Marque créée', message: `La marque "${formData.name}" a été créée avec succès.` })
      }
      
      // TODO: Appeler une fonction pour sauvegarder les SVG dans /assets/logos
      // Cela nécessitera un endpoint backend ou un script de build
      
      setFormData({ name: '', description: '', logo_svg: '', logo_svg_small: '', website: '' })
      onSuccess()
      onClose()
    } catch (error: any) {
      // Extraire le message d'erreur de manière plus robuste
      let errorMessage = 'Erreur inconnue'
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (error?.message) {
        errorMessage = error.message
      } else if (error?.error?.message) {
        errorMessage = error.error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error?.code) {
        errorMessage = `Erreur ${error.code}: ${error.message || 'Erreur inconnue'}`
      }
      
      logger.error('Erreur lors de la création/mise à jour de la marque', error)
      showToast({ 
        variant: 'error', 
        title: 'Erreur', 
        message: `Impossible de ${editingBrand?.brandData ? 'mettre à jour' : 'créer'} la marque : ${errorMessage}` 
      })
    } finally {
      setLoading(false)
    }
  }

  // Déterminer si on est en mode édition
  // On est en édition si editingBrand existe (même si brandData n'existe pas encore)
  const isEditing = editingBrand !== null && editingBrand !== undefined

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Modifier une marque" : "Créer une marque"} widthClassName="max-w-2xl">
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
            placeholder="Ex: Fender"
            disabled={isEditing}
          />
          {isEditing && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Le nom ne peut pas être modifié</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={3}
            placeholder="Description de la marque"
          />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo SVG (normal)
              {formData.name && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  (sera sauvegardé dans: {generateLogoFilename(formData.name)})
                </span>
              )}
            </label>
            <textarea
              value={formData.logo_svg}
              onChange={(e) => setFormData({ ...formData, logo_svg: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-xs"
              rows={8}
              placeholder="<svg>...</svg>"
            />
            {formData.logo_svg.trim() && isValidSVG(formData.logo_svg) && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Aperçu:</p>
                <div 
                  className="h-12 flex items-center justify-center bg-white dark:bg-gray-900 rounded"
                  dangerouslySetInnerHTML={{ __html: formData.logo_svg.trim() }}
                />
              </div>
            )}
            {formData.logo_svg.trim() && !isValidSVG(formData.logo_svg) && (
              <p className="text-xs text-red-500 mt-1">Le contenu ne semble pas être un SVG valide</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo SVG (petit)
              {formData.name && (() => {
                const localLogos = getBrandLogos(formData.name)
                if (localLogos.small) {
                  return (
                    <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                      (Logo local disponible)
                    </span>
                  )
                }
                return null
              })()}
              {formData.name && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  (sera sauvegardé dans: {generateLogoFilename(formData.name, 'small')})
                </span>
              )}
            </label>
            <textarea
              value={formData.logo_svg_small}
              onChange={(e) => setFormData({ ...formData, logo_svg_small: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-xs"
              rows={8}
              placeholder="<svg>...</svg>"
            />
            {formData.logo_svg_small.trim() && isValidSVG(formData.logo_svg_small) && (
              <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Aperçu:</p>
                <div 
                  className="h-8 flex items-center justify-center bg-white dark:bg-gray-900 rounded"
                  dangerouslySetInnerHTML={{ __html: formData.logo_svg_small.trim() }}
                />
              </div>
            )}
            {formData.logo_svg_small.trim() && !isValidSVG(formData.logo_svg_small) && (
              <p className="text-xs text-red-500 mt-1">Le contenu ne semble pas être un SVG valide</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Site web</label>
          <input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" disabled={loading}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading || !formData.name.trim()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center">
            {loading ? (
              <>
                <Loader size="sm" variant="light" showText={false} className="!flex" />
                <span>{isEditing ? 'Mise à jour...' : 'Création...'}</span>
              </>
            ) : (
              isEditing ? 'Mettre à jour' : 'Créer'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal de création de feature flag
export function CreateFeatureFlagModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({ key: '', name: '', description: '', enabled: false, value: '' })
  const [loading, setLoading] = useState(false)
  const [isPageFlag, setIsPageFlag] = useState(false)

  // Pages prédéfinies
  const predefinedPages = [
    { key: 'page_looper', name: 'Looper', description: 'Page du looper' },
    { key: 'page_practice', name: 'Pratique', description: 'Page de pratique' },
    { key: 'page_learn', name: 'Apprendre', description: 'Page d\'apprentissage' },
    { key: 'page_mixing', name: 'Mixage', description: 'Page de mixage' },
    { key: 'page_drummachine', name: 'Boîte à rythmes', description: 'Page de la boîte à rythmes' }
  ]

  const handleSubmit = async () => {
    if (!formData.key.trim() || !formData.name.trim()) {
      showToast({ variant: 'error', title: 'Erreur', message: 'La clé et le nom sont obligatoires' })
      return
    }

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

      await adminService.createFeatureFlag({
        key: formData.key.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        enabled: formData.enabled,
        value: parsedValue
      })
      showToast({ variant: 'success', title: 'Feature flag créé', message: `Le feature flag "${formData.name}" a été créé avec succès.` })
      setFormData({ key: '', name: '', description: '', enabled: false, value: '' })
      onSuccess()
      onClose()
    } catch (error) {
      showToast({ variant: 'error', title: 'Erreur', message: `Impossible de créer le feature flag : ${error instanceof Error ? error.message : 'Erreur inconnue'}` })
    } finally {
      setLoading(false)
    }
  }

  const handlePageSelect = (page: typeof predefinedPages[0]) => {
    setFormData({
      key: page.key,
      name: page.name,
      description: page.description,
      enabled: true,
      value: ''
    })
    setIsPageFlag(true)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer un feature flag" widthClassName="max-w-2xl">
      <div className="space-y-4">
        {/* Sélecteur de pages prédéfinies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pages prédéfinies (optionnel)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {predefinedPages.map((page) => (
              <button
                key={page.key}
                type="button"
                onClick={() => handlePageSelect(page)}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left"
              >
                <div className="font-medium">{page.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">{page.key}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Clé <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.key}
            onChange={(e) => {
              setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, '_') })
              setIsPageFlag(e.target.value.startsWith('page_'))
            }}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono"
            placeholder="ex: new_feature ou page_looper"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Format: snake_case (ex: new_feature). Pour les pages, utilisez le préfixe "page_"</p>
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
            Activé par défaut
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
                <span>Création...</span>
              </>
            ) : (
              'Créer'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal de création de cours
export function CreateCourseModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  editingCourse 
}: { 
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  editingCourse?: Course | null
}) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    duration: '',
    type: 'tutorial' as 'tutorial' | 'guide' | 'quiz' | 'preset',
    icon: '',
    tags: '',
    order_index: '0',
    is_published: false,
    is_premium: false,
    price: ''
  })
  const [loading, setLoading] = useState(false)
  const isEditing = !!editingCourse

  // Pré-remplir les champs si on est en mode édition
  React.useEffect(() => {
    if (editingCourse) {
      setFormData({
        title: editingCourse.title || '',
        description: editingCourse.description || '',
        category: editingCourse.category || '',
        difficulty: editingCourse.difficulty || 'beginner',
        duration: editingCourse.duration?.toString() || '',
        type: editingCourse.type || 'tutorial',
        icon: editingCourse.icon || '',
        tags: (editingCourse.tags || []).join(', '),
        order_index: editingCourse.order_index?.toString() || '0',
        is_published: editingCourse.is_published || false,
        is_premium: editingCourse.is_premium || false,
        price: editingCourse.price?.toString() || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        difficulty: 'beginner',
        duration: '',
        type: 'tutorial',
        icon: '',
        tags: '',
        order_index: '0',
        is_published: false,
        is_premium: false,
        price: ''
      })
    }
  }, [editingCourse, isOpen])

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.category.trim()) {
      showToast({ variant: 'error', title: 'Erreur', message: 'Le titre et la catégorie sont obligatoires' })
      return
    }

    setLoading(true)
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      
      if (isEditing && editingCourse) {
        // Mode édition
        await adminService.updateCourse(editingCourse.id, {
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          category: formData.category.trim(),
          difficulty: formData.difficulty,
          duration: formData.duration ? parseInt(formData.duration) : null,
          type: formData.type,
          icon: formData.icon.trim() || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          order_index: parseInt(formData.order_index) || 0,
          is_published: formData.is_published,
          is_premium: formData.is_premium,
          price: formData.price ? parseFloat(formData.price) : undefined
        })
        showToast({ variant: 'success', title: 'Cours modifié', message: `Le cours "${formData.title}" a été modifié avec succès.` })
      } else {
        // Mode création
        await adminService.createCourse({
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          category: formData.category.trim(),
          difficulty: formData.difficulty,
          duration: formData.duration ? parseInt(formData.duration) : null,
          type: formData.type,
          icon: formData.icon.trim() || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          order_index: parseInt(formData.order_index) || 0,
          is_published: formData.is_published,
          is_premium: formData.is_premium,
          price: formData.price ? parseFloat(formData.price) : undefined,
          pack_id: null
        })
        showToast({ variant: 'success', title: 'Cours créé', message: `Le cours "${formData.title}" a été créé avec succès.` })
      }
      
      setFormData({
        title: '',
        description: '',
        category: '',
        difficulty: 'beginner',
        duration: '',
        type: 'tutorial',
        icon: '',
        tags: '',
        order_index: '0',
        is_published: false,
        is_premium: false,
        price: ''
      })
      onSuccess()
      onClose()
    } catch (error) {
      showToast({ variant: 'error', title: 'Erreur', message: `Impossible de ${isEditing ? 'modifier' : 'créer'} le cours : ${error instanceof Error ? error.message : 'Erreur inconnue'}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Modifier le cours" : "Créer un cours"} widthClassName="max-w-3xl">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Titre du cours"
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
              placeholder="Ex: Technique"
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
            placeholder="Description du cours"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulté</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="tutorial">Tutoriel</option>
              <option value="guide">Guide</option>
              <option value="quiz">Quiz</option>
              <option value="preset">Preset</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Durée (min)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="30"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags (séparés par des virgules)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="rock, blues, technique"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ordre</label>
            <input
              type="number"
              value={formData.order_index}
              onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Icône</label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="BookOpen"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prix (si premium)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="9.99"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_published}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Publié</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.is_premium}
              onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
              className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Premium</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" disabled={loading}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading || !formData.title.trim() || !formData.category.trim()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center">
            {loading ? (
              <>
                <Loader size="sm" variant="light" showText={false} className="!flex" />
                <span>{isEditing ? 'Mise à jour...' : 'Création...'}</span>
              </>
            ) : (
              isEditing ? 'Mettre à jour' : 'Créer'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal de création de leçon
export function CreateLessonModal({ isOpen, onClose, onSuccess, courses, editingLesson }: { isOpen: boolean; onClose: () => void; onSuccess: () => void; courses: Course[]; editingLesson?: Lesson | null }) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    course_id: '',
    title: '',
    description: '',
    content_type: 'text' as 'text' | 'video' | 'interactive',
    order_index: '0',
    action_type: '',
    action_target: '',
    action_value: ''
  })
  const [loading, setLoading] = useState(false)
  const isEditing = !!editingLesson

  // Pré-remplir les champs si on est en mode édition
  React.useEffect(() => {
    if (editingLesson) {
      setFormData({
        course_id: editingLesson.course_id || '',
        title: editingLesson.title || '',
        description: editingLesson.description || '',
        content_type: editingLesson.content_type || 'text',
        order_index: editingLesson.order_index?.toString() || '0',
        action_type: editingLesson.action_type || '',
        action_target: editingLesson.action_target || '',
        action_value: editingLesson.action_value ? JSON.stringify(editingLesson.action_value) : ''
      })
    } else {
      setFormData({
        course_id: '',
        title: '',
        description: '',
        content_type: 'text',
        order_index: '0',
        action_type: '',
        action_target: '',
        action_value: ''
      })
    }
  }, [editingLesson, isOpen])

  const handleSubmit = async () => {
    if (!formData.course_id || !formData.title.trim()) {
      showToast({ variant: 'error', title: 'Erreur', message: 'Le cours et le titre sont obligatoires' })
      return
    }

    setLoading(true)
    try {
      if (isEditing && editingLesson) {
        // Mode édition
        await adminService.updateLesson(editingLesson.id, {
          course_id: formData.course_id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          content_type: formData.content_type,
          order_index: parseInt(formData.order_index) || 0,
          action_type: formData.action_type.trim() || null,
          action_target: formData.action_target.trim() || null,
          action_value: formData.action_value.trim() ? JSON.parse(formData.action_value.trim()) : null
        })
        showToast({ variant: 'success', title: 'Leçon modifiée', message: `La leçon "${formData.title}" a été modifiée avec succès.` })
      } else {
        // Mode création
        await adminService.createLesson({
          course_id: formData.course_id,
          title: formData.title.trim(),
          description: formData.description.trim(),
          content_type: formData.content_type,
          order_index: parseInt(formData.order_index) || 0,
          action_type: formData.action_type.trim() || null,
          action_target: formData.action_target.trim() || null,
          action_value: formData.action_value.trim() ? JSON.parse(formData.action_value.trim()) : null
        })
        showToast({ variant: 'success', title: 'Leçon créée', message: `La leçon "${formData.title}" a été créée avec succès.` })
      }
      setFormData({
        course_id: '',
        title: '',
        description: '',
        content_type: 'text',
        order_index: '0',
        action_type: '',
        action_target: '',
        action_value: ''
      })
      onSuccess()
      onClose()
    } catch (error) {
      showToast({ variant: 'error', title: 'Erreur', message: `Impossible de ${isEditing ? 'modifier' : 'créer'} la leçon : ${error instanceof Error ? error.message : 'Erreur inconnue'}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Modifier la leçon" : "Créer une leçon"} widthClassName="max-w-3xl">
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cours <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.course_id}
            onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Sélectionner un cours</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>{course.title}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Titre de la leçon"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type de contenu</label>
            <select
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="text">Texte</option>
              <option value="video">Vidéo</option>
              <option value="interactive">Interactif</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={5}
            placeholder="Description de la leçon (peut contenir des tags spéciaux)"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ordre</label>
          <input
            type="number"
            value={formData.order_index}
            onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type d'action</label>
            <input
              type="text"
              value={formData.action_type}
              onChange={(e) => setFormData({ ...formData, action_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="addPedal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cible</label>
            <input
              type="text"
              value={formData.action_target}
              onChange={(e) => setFormData({ ...formData, action_target: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="pedal_id"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Valeur (JSON)</label>
            <input
              type="text"
              value={formData.action_value}
              onChange={(e) => setFormData({ ...formData, action_value: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
              placeholder='{"param": "value"}'
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg" disabled={loading}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading || !formData.course_id || !formData.title.trim()} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[100px] justify-center">
            {loading ? (
              <>
                <Loader size="sm" variant="light" showText={false} className="!flex" />
                <span>{isEditing ? 'Mise à jour...' : 'Création...'}</span>
              </>
            ) : (
              isEditing ? 'Mettre à jour' : 'Créer'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Modal de création de pack DLC
export function CreateDLCPackModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
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

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.category.trim()) {
      showToast({ variant: 'error', title: 'Erreur', message: 'Le nom et la catégorie sont obligatoires' })
      return
    }

    setLoading(true)
    try {
      const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      await adminService.createDLCPack({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        type: formData.type,
        category: formData.category.trim(),
        price: parseFloat(formData.price) || 0,
        currency: formData.currency,
        is_premium: formData.is_premium,
        tags: tagsArray,
        metadata: {},
        thumbnail: formData.thumbnail.trim() || null,
        image_url: formData.image_url.trim() || null
      })
      showToast({ variant: 'success', title: 'Pack créé', message: `Le pack "${formData.name}" a été créé avec succès.` })
      setFormData({
        name: '',
        description: '',
        type: 'course',
        category: '',
        price: '',
        currency: 'EUR',
        is_premium: true,
        tags: '',
        thumbnail: '',
        image_url: ''
      })
      onSuccess()
      onClose()
    } catch (error) {
      showToast({ variant: 'error', title: 'Erreur', message: `Impossible de créer le pack : ${error instanceof Error ? error.message : 'Erreur inconnue'}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Créer un pack DLC" widthClassName="max-w-3xl">
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
                <span>Création...</span>
              </>
            ) : (
              'Créer'
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

