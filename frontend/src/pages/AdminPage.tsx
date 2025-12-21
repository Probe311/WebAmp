import React, { useState, useEffect, useRef } from 'react'
import { Shield, Package, Zap, Settings, BookOpen, GraduationCap, Layers, ToggleLeft, BarChart3, Edit, Trash2, Plus, X, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react'
import { useToast } from '../components/notifications/ToastProvider'
import { createLogger } from '../services/logger'

const logger = createLogger('AdminPage')
import { adminService, Brand, Preset, DLCPack, FeatureFlag, BrandFromProducts } from '../services/admin'
import { Course, Lesson, QuizQuestion } from '../services/supabase'
import { SupabasePedal, SupabaseAmplifier } from '../services/supabase/catalog'
import { analyticsService } from '../services/analytics'
import { CTA } from '../components/CTA'
import { Modal } from '../components/Modal'
import { Loader } from '../components/Loader'
import { Toggle } from '../components/Toggle'
import { getBrandLogos, getBrandLogoSmall } from '../utils/brandLogos'
import { CreateBrandModal, CreateFeatureFlagModal, CreateCourseModal, CreateLessonModal, CreateDLCPackModal } from './admin/CreateModals'
import { SessionsWorldMap, CountriesBarChart, EvolutionLineChart, DevicesPieChart, BrowsersPieChart, OSPieChart } from '../components/admin/AnalyticsCharts'
import { calculateCourseQualityScore, getScoreColor, CourseScore, calculateLessonQualityScore, LessonScore } from '../utils/courseQualityScore'
import { optimizeCourseWithAI, OptimizationResult } from '../services/gemini'

type AdminSection = 'brands' | 'amplifiers' | 'pedals' | 'presets' | 'courses' | 'lessons' | 'packs' | 'features' | 'analytics'

interface AdminSectionConfig {
  id: AdminSection
  label: string
  icon: typeof Shield
}

const sections: AdminSectionConfig[] = [
  { id: 'brands', label: 'Marques', icon: Package },
  { id: 'amplifiers', label: 'Amplis', icon: Zap },
  { id: 'pedals', label: 'Pédales', icon: Settings },
  { id: 'presets', label: 'Configurations', icon: Layers },
  { id: 'courses', label: 'Cours', icon: BookOpen },
  { id: 'lessons', label: 'Leçons', icon: GraduationCap },
  { id: 'packs', label: 'Packs', icon: Package },
  { id: 'features', label: 'Fonctionnalités', icon: ToggleLeft },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 }
]

export function AdminPage() {
  const { showToast } = useToast()
  const [activeSection, setActiveSection] = useState<AdminSection>('brands')
  const [loading, setLoading] = useState(false)

  // États pour chaque section
  const [brands, setBrands] = useState<Brand[]>([])
  const [brandsFromProducts, setBrandsFromProducts] = useState<BrandFromProducts[]>([])
  const [amplifiers, setAmplifiers] = useState<SupabaseAmplifier[]>([])
  const [pedals, setPedals] = useState<SupabasePedal[]>([])
  const [presets, setPresets] = useState<Preset[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [packs, setPacks] = useState<DLCPack[]>([])
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([])

  // Charger les données selon la section active
  useEffect(() => {
    loadSectionData(activeSection)
  }, [activeSection])

  const loadSectionData = async (section: AdminSection) => {
    setLoading(true)
    try {
      switch (section) {
        case 'brands':
          const [brandsData, brandsFromProductsData] = await Promise.all([
            adminService.getBrands(),
            adminService.getBrandsFromProducts()
          ])
          setBrands(brandsData)
          setBrandsFromProducts(brandsFromProductsData)
          break
        case 'amplifiers':
          setAmplifiers(await adminService.getAmplifiers())
          break
        case 'pedals':
          setPedals(await adminService.getPedals())
          break
        case 'presets':
          setPresets(await adminService.getPresets())
          break
        case 'courses':
          setCourses(await adminService.getCourses())
          break
        case 'lessons':
          setLessons(await adminService.getLessons())
          break
        case 'packs':
          setPacks(await adminService.getDLCPacks())
          break
        case 'features':
          setFeatureFlags(await adminService.getFeatureFlags())
          break
        case 'analytics':
          // Les données analytics sont chargées directement dans le composant
          break
      }
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de charger les données : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    } finally {
      setLoading(false)
    }
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'brands':
        return <BrandsSection brandsFromProducts={brandsFromProducts} onRefresh={() => loadSectionData('brands')} />
      case 'amplifiers':
        return <AmplifiersSection amplifiers={amplifiers} onRefresh={() => loadSectionData('amplifiers')} />
      case 'pedals':
        return <PedalsSection pedals={pedals} onRefresh={() => loadSectionData('pedals')} />
      case 'presets':
        return <PresetsSection presets={presets} onRefresh={() => loadSectionData('presets')} />
      case 'courses':
        return <CoursesSection courses={courses} onRefresh={() => loadSectionData('courses')} />
      case 'lessons':
        return <LessonsSection lessons={lessons} onRefresh={() => loadSectionData('lessons')} />
      case 'packs':
        return <PacksSection packs={packs} onRefresh={() => loadSectionData('packs')} />
      case 'features':
        return <FeaturesSection flags={featureFlags} onRefresh={() => loadSectionData('features')} />
      case 'analytics':
        return <AnalyticsSection />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <Shield size={32} />
          <div>
            <h1 className="text-2xl font-bold">Panneau d'Administration</h1>
            <p className="text-red-100 text-sm">Gestion complète de WebAmp</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <nav className="p-4 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive
                      ? 'bg-red-500 text-white shadow-md'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{section.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 pb-32">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader size="md" variant="light" showText={false} />
            </div>
          ) : (
            renderSection()
          )}
        </div>
      </div>
    </div>
  )
}

// Composants pour chaque section
function BrandsSection({ brandsFromProducts, onRefresh }: { brandsFromProducts: BrandFromProducts[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBrand, setEditingBrand] = useState<BrandFromProducts | null>(null)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la marque "${name}" ?`)) {
      return
    }

    try {
      await adminService.deleteBrand(id)
      showToast({
        variant: 'success',
        title: 'Marque supprimée',
        message: `La marque "${name}" a été supprimée avec succès.`
      })
      onRefresh()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de supprimer la marque : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  const handleEdit = (brandProduct: BrandFromProducts) => {
    setEditingBrand(brandProduct)
    setShowCreateModal(true)
  }


  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Marques ({brandsFromProducts.length})</h2>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => {
              setEditingBrand(null)
              setShowCreateModal(true)
            }}
          >
            + Ajouter
          </button>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {brandsFromProducts.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Aucune marque trouvée dans les amplis et pédales.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Logo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amplis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pédales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {brandsFromProducts.map((brandProduct) => {
                  const brand = brandProduct.brandData
                  return (
                    <tr key={brandProduct.name}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {(() => {
                            // Priorité 1: Logo local small
                            const localSmallLogo = getBrandLogoSmall(brandProduct.name)
                            // Priorité 2: Logo de la base de données small (data URI ou URL)
                            let dbSmallLogo = brand?.logo_url_small
                            // Si c'est un data URI, l'utiliser directement, sinon vérifier si c'est un chemin
                            if (dbSmallLogo && !dbSmallLogo.startsWith('data:') && !dbSmallLogo.startsWith('http') && !dbSmallLogo.startsWith('/')) {
                              // Si ce n'est pas un data URI ni une URL, c'est peut-être du SVG brut, le convertir en data URI
                              if (dbSmallLogo.trim().startsWith('<svg')) {
                                dbSmallLogo = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dbSmallLogo)}`
                              }
                            }
                            
                            // Priorité 3: Logo local normal
                            const localNormalLogo = getBrandLogos(brandProduct.name).normal
                            // Priorité 4: Logo de la base de données normal (data URI ou URL)
                            let dbNormalLogo = brand?.logo_url
                            // Si c'est un data URI, l'utiliser directement, sinon vérifier si c'est un chemin
                            if (dbNormalLogo && !dbNormalLogo.startsWith('data:') && !dbNormalLogo.startsWith('http') && !dbNormalLogo.startsWith('/')) {
                              // Si ce n'est pas un data URI ni une URL, c'est peut-être du SVG brut, le convertir en data URI
                              if (dbNormalLogo.trim().startsWith('<svg')) {
                                dbNormalLogo = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dbNormalLogo)}`
                              }
                            }
                            
                            const smallLogo = localSmallLogo || dbSmallLogo
                            const normalLogo = localNormalLogo || dbNormalLogo
                            
                            return (
                              <>
                                {smallLogo && (
                                  <img 
                                    src={smallLogo} 
                                    alt={`${brandProduct.name} small`}
                                    className="h-8 w-auto object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                    }}
                                  />
                                )}
                                {normalLogo && !smallLogo && (
                                  <img 
                                    src={normalLogo} 
                                    alt={`${brandProduct.name} normal`}
                                    className="h-12 w-auto object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.style.display = 'none'
                                    }}
                                  />
                                )}
                                {!smallLogo && !normalLogo && (
                                  <div className="h-12 w-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500 dark:text-gray-400">
                                    {brandProduct.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </>
                            )
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{brandProduct.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
                          {brandProduct.amplifierCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-xs font-medium">
                          {brandProduct.pedalCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <CTA
                            variant="icon-only"
                            icon={<Edit size={18} />}
                            onClick={() => handleEdit(brandProduct)}
                            title="Modifier"
                          />
                          {brand && (
                            <CTA
                              variant="icon-only"
                              icon={<Trash2 size={18} />}
                              onClick={() => handleDelete(brand.id, brand.name)}
                              title="Supprimer"
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <CreateBrandModal 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false)
          setEditingBrand(null)
        }} 
        onSuccess={onRefresh}
        editingBrand={editingBrand}
      />
    </>
  )
}

function AmplifiersSection({ amplifiers, onRefresh }: { amplifiers: SupabaseAmplifier[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleDelete = async (id: string, brand: string, model: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'ampli "${brand} ${model}" ?`)) {
      return
    }

    try {
      await adminService.deleteAmplifier(id)
      showToast({
        variant: 'success',
        title: 'Ampli supprimé',
        message: `L'ampli "${brand} ${model}" a été supprimé avec succès.`
      })
      onRefresh()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de supprimer l'ampli : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Amplis ({amplifiers.length})</h2>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => setShowCreateModal(true)}
          >
            + Ajouter
          </button>
        </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {amplifiers.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucun ampli enregistré.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Marque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Modèle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {amplifiers.map((amp) => (
                <tr key={amp.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{amp.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{amp.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{amp.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <CTA
                        variant="icon-only"
                        icon={<Edit size={18} />}
                        onClick={() => showToast({ variant: 'info', title: 'À venir', message: 'Formulaire d\'édition à implémenter' })}
                        title="Modifier"
                      />
                      <CTA
                        variant="icon-only"
                        icon={<Trash2 size={18} />}
                        onClick={() => handleDelete(amp.id, amp.brand, amp.model)}
                        title="Supprimer"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Créer un ampli" widthClassName="max-w-2xl">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          La création d'amplis nécessite une configuration complexe (paramètres, style, etc.).<br />
          Utilisez le script de seed pour ajouter des amplis depuis les fichiers de données.
        </div>
      </Modal>
    </>
  )
}

function PedalsSection({ pedals, onRefresh }: { pedals: SupabasePedal[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleDelete = async (id: string, brand: string, model: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la pédale "${brand} ${model}" ?`)) {
      return
    }

    try {
      await adminService.deletePedal(id)
      showToast({
        variant: 'success',
        title: 'Pédale supprimée',
        message: `La pédale "${brand} ${model}" a été supprimée avec succès.`
      })
      onRefresh()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de supprimer la pédale : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Pédales ({pedals.length})</h2>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => setShowCreateModal(true)}
          >
            + Ajouter
          </button>
        </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {pedals.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucune pédale enregistrée.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Marque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Modèle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {pedals.map((pedal) => (
                <tr key={pedal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{pedal.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pedal.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pedal.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <CTA
                        variant="icon-only"
                        icon={<Edit size={18} />}
                        onClick={() => showToast({ variant: 'info', title: 'À venir', message: 'Formulaire d\'édition à implémenter' })}
                        title="Modifier"
                      />
                      <CTA
                        variant="icon-only"
                        icon={<Trash2 size={18} />}
                        onClick={() => handleDelete(pedal.id, pedal.brand, pedal.model)}
                        title="Supprimer"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Créer une pédale" widthClassName="max-w-2xl">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p className="mb-4">
            La création de pédales nécessite une configuration complexe (paramètres, types, etc.).<br />
            Utilisez le script de seed pour ajouter des pédales depuis les fichiers de données.
          </p>
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </Modal>
    </>
  )
}

function PresetsSection({ presets, onRefresh }: { presets: Preset[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le preset "${name}" ?`)) {
      return
    }

    try {
      await adminService.deletePreset(id)
      showToast({
        variant: 'success',
        title: 'Preset supprimé',
        message: `Le preset "${name}" a été supprimé avec succès.`
      })
      onRefresh()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de supprimer le preset : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Configurations ({presets.length})</h2>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => setShowCreateModal(true)}
          >
            + Ajouter
          </button>
        </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {presets.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucun preset enregistré.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Public</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {presets.map((preset) => (
                <tr key={preset.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{preset.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {preset.is_public ? 'Oui' : 'Non'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <CTA
                        variant="icon-only"
                        icon={<Edit size={18} />}
                        onClick={() => showToast({ variant: 'info', title: 'À venir', message: 'Formulaire d\'édition à implémenter' })}
                        title="Modifier"
                      />
                      <CTA
                        variant="icon-only"
                        icon={<Trash2 size={18} />}
                        onClick={() => handleDelete(preset.id, preset.name)}
                        title="Supprimer"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      </div>
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Créer un preset" widthClassName="max-w-2xl">
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          <p className="mb-4">
            La création de presets nécessite une configuration complexe (chaîne d'effets, paramètres, etc.).<br />
            Utilisez l'interface WebAmp pour créer et sauvegarder des presets.
          </p>
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </Modal>
    </>
  )
}

function CoursesSection({ courses, onRefresh }: { courses: Course[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [courseScores, setCourseScores] = useState<Map<string, CourseScore>>(new Map())
  const [loadingScores, setLoadingScores] = useState<Set<string>>(new Set())
  const [optimizingCourse, setOptimizingCourse] = useState<string | null>(null)
  const [showOptimizationModal, setShowOptimizationModal] = useState<{
    course: Course
    result: OptimizationResult
  } | null>(null)
  const [showBulkOptimizationModal, setShowBulkOptimizationModal] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState<{
    total: number
    current: number
    currentCourseTitle: string
    success: number
    errors: number
  } | null>(null)
  const loadedScoreIdsRef = useRef<Set<string>>(new Set())

  // Charger les scores pour tous les cours
  useEffect(() => {
    const loadScores = async () => {
      // Charger les scores pour les nouveaux cours uniquement
      const coursesToLoad = courses.filter(c => !loadedScoreIdsRef.current.has(c.id) && !loadingScores.has(c.id))
      
      if (coursesToLoad.length === 0) return

      for (const course of coursesToLoad) {
        setLoadingScores(prev => new Set(prev).add(course.id))
        try {
          const courseWithLessons = await adminService.getCourseWithLessons(course.id)
          if (courseWithLessons) {
            const score = calculateCourseQualityScore(courseWithLessons.course, courseWithLessons.lessons)
            setCourseScores(prev => {
              const next = new Map(prev)
              next.set(course.id, score)
              loadedScoreIdsRef.current.add(course.id)
              return next
            })
          }
        } catch (error) {
          logger.error(`Erreur calcul score cours ${course.id}`, error)
        } finally {
          setLoadingScores(prev => {
            const next = new Set(prev)
            next.delete(course.id)
            return next
          })
        }
      }
    }

    loadScores()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses.length])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le cours "${title}" ?`)) {
      return
    }

    try {
      await adminService.deleteCourse(id)
      showToast({
        variant: 'success',
        title: 'Cours supprimé',
        message: `Le cours "${title}" a été supprimé avec succès.`
      })
      onRefresh()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de supprimer le cours : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  const handleOptimize = async (course: Course, autoApply: boolean = false) => {
    setOptimizingCourse(course.id)
    try {
      const courseWithLessons = await adminService.getCourseWithLessons(course.id)
      if (!courseWithLessons) {
        throw new Error('Cours introuvable')
      }

      // Charger les questions de quiz si c'est un quiz
      let quizQuestions: QuizQuestion[] | undefined
      if (course.type === 'quiz') {
        const { lmsService } = await import('../services/lms')
        quizQuestions = await lmsService.getQuizQuestions(course.id)
      }

      const result = await optimizeCourseWithAI(courseWithLessons.course, courseWithLessons.lessons, quizQuestions)
      
      if (autoApply) {
        // Appliquer automatiquement l'optimisation
        await handleApplyOptimizationDirectly(course, result)
      } else {
        // Afficher la modal de confirmation
        setShowOptimizationModal({ course, result })
      }
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur d\'optimisation',
        message: error instanceof Error ? error.message : 'Impossible d\'optimiser le cours'
      })
    } finally {
      setOptimizingCourse(null)
    }
  }

  const handleApplyOptimizationDirectly = async (course: Course, result: OptimizationResult) => {
    try {
      // Appliquer les optimisations au cours
      await adminService.updateCourse(course.id, result.optimized.course as Partial<Course>)

      // Récupérer les leçons existantes
      const courseWithLessons = await adminService.getCourseWithLessons(course.id)
      if (!courseWithLessons) {
        throw new Error('Impossible de charger les leçons du cours')
      }

      // 1. Supprimer les leçons marquées pour suppression
      const deletedIds = result.optimized.deletedLessonIds || []
      for (const deletedId of deletedIds) {
        try {
          await adminService.deleteLesson(deletedId)
        } catch (error) {
          logger.error(`Erreur suppression leçon ${deletedId}`, error)
        }
      }

      // 2. Trier les leçons optimisées par order_index
      const sortedLessons = (result.optimized.lessons || []).slice().sort((a, b) => 
        (a.order_index || 0) - (b.order_index || 0)
      )

      // 3. Récupérer toutes les leçons restantes après suppression
      const remainingLessonsBefore = await adminService.getLessons(course.id)
      const maxOrderIndex = Math.max(...remainingLessonsBefore.map(l => l.order_index), -1)
      const tempOffset = maxOrderIndex + 1000 // Offset temporaire pour éviter les conflits

      // 4. Appliquer les modifications (création/mise à jour) SANS order_index d'abord
      const createdLessonIds: string[] = []
      for (const optimizedLesson of sortedLessons) {
        if (optimizedLesson.action === 'create') {
          // Créer une nouvelle leçon avec un order_index temporaire
          const newLesson = await adminService.createLesson({
            course_id: course.id,
            title: optimizedLesson.title || 'Nouvelle leçon',
            description: optimizedLesson.description || '',
            content_type: optimizedLesson.content_type || 'text',
            order_index: tempOffset + createdLessonIds.length, // Index temporaire
            action_type: optimizedLesson.action_type || null,
            action_target: optimizedLesson.action_target || null,
            action_value: optimizedLesson.action_value || null
          })
          createdLessonIds.push(newLesson.id)
        } else if (optimizedLesson.action === 'update' && optimizedLesson.id) {
          // Mettre à jour une leçon existante SANS order_index pour l'instant
          const updateData: Partial<Lesson> = {}
          if (optimizedLesson.title) updateData.title = optimizedLesson.title
          if (optimizedLesson.description) updateData.description = optimizedLesson.description
          if (optimizedLesson.content_type) updateData.content_type = optimizedLesson.content_type as Lesson['content_type']
          // Ne PAS mettre à jour order_index ici pour éviter les conflits
          if (optimizedLesson.action_type !== undefined) updateData.action_type = optimizedLesson.action_type
          if (optimizedLesson.action_target !== undefined) updateData.action_target = optimizedLesson.action_target
          if (optimizedLesson.action_value !== undefined) updateData.action_value = optimizedLesson.action_value

          await adminService.updateLesson(optimizedLesson.id, updateData)
        }
      }

      // 5. Maintenant récupérer toutes les leçons (y compris les nouvelles)
      const allLessons = await adminService.getLessons(course.id)
      
      // 6. Construire un mapping des leçons optimisées avec leur order_index cible
      const lessonOrderMap = new Map<string, number>()
      for (const optimizedLesson of sortedLessons) {
        if (optimizedLesson.action === 'create' && optimizedLesson.order_index !== undefined) {
          // Trouver l'ID de la leçon créée qui correspond
          const createdLesson = allLessons.find(l => 
            !lessonOrderMap.has(l.id) && 
            l.title === optimizedLesson.title &&
            l.order_index >= tempOffset
          )
          if (createdLesson) {
            lessonOrderMap.set(createdLesson.id, optimizedLesson.order_index)
          }
        } else if (optimizedLesson.action === 'update' && optimizedLesson.id && optimizedLesson.order_index !== undefined) {
          lessonOrderMap.set(optimizedLesson.id, optimizedLesson.order_index)
        }
      }

      // 7. Trier les leçons AVANT les mises à jour selon leur order_index cible
      // Cela garantit qu'on connaît l'ordre final avant de faire les mises à jour
      logger.info('Réorganisation des leçons (handleApplyOptimizationDirectly) - Début', {
        courseId: course.id,
        totalLessons: allLessons.length,
        lessonOrderMapSize: lessonOrderMap.size,
        tempOffset,
        currentOrderIndexes: allLessons.map(l => ({ id: l.id, title: l.title.substring(0, 30), order_index: l.order_index }))
      })

      const sortedLessonsForUpdate = [...allLessons].sort((a, b) => {
        // Utiliser l'order_index cible si disponible, sinon utiliser l'order_index actuel
        const orderA = lessonOrderMap.get(a.id) ?? a.order_index
        const orderB = lessonOrderMap.get(b.id) ?? b.order_index
        return orderA - orderB
      })

      logger.info('Réorganisation des leçons (handleApplyOptimizationDirectly) - Tri effectué', {
        courseId: course.id,
        sortedOrder: sortedLessonsForUpdate.map(l => ({ 
          id: l.id, 
          title: l.title.substring(0, 30), 
          currentOrder: l.order_index,
          targetOrder: lessonOrderMap.get(l.id) ?? l.order_index
        }))
      })

      // 8. Mettre TOUTES les leçons à des valeurs NÉGATIVES uniques pour libérer tous les index positifs
      // On utilise des index négatifs car ils sont très peu susceptibles d'être utilisés
      logger.info('Réorganisation des leçons (handleApplyOptimizationDirectly) - Mise à jour vers index négatifs temporaires', {
        courseId: course.id,
        totalLessons: sortedLessonsForUpdate.length
      })

      for (let i = 0; i < sortedLessonsForUpdate.length; i++) {
        const lesson = sortedLessonsForUpdate[i]
        // Utiliser des index négatifs uniques : -1, -2, -3, etc.
        const tempIndex = -(i + 1)
        try {
          logger.info(`Réorganisation (handleApplyOptimizationDirectly) - Mise à jour temporaire leçon ${i + 1}/${sortedLessonsForUpdate.length}`, {
            lessonId: lesson.id,
            lessonTitle: lesson.title.substring(0, 30),
            oldOrderIndex: lesson.order_index,
            newTempOrderIndex: tempIndex
          })
          await adminService.updateLesson(lesson.id, { order_index: tempIndex })
        } catch (error) {
          logger.error(`Erreur lors de la mise à jour temporaire de la leçon ${lesson.id} (handleApplyOptimizationDirectly)`, error, {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            oldOrderIndex: lesson.order_index,
            newTempOrderIndex: tempIndex,
            index: i
          })
          throw error
        }
      }

      // 9. Maintenant réassigner les order_index finaux séquentiellement dans l'ordre déjà trié
      // Toutes les leçons sont maintenant à des index négatifs, donc aucun conflit possible
      logger.info('Réorganisation des leçons (handleApplyOptimizationDirectly) - Réassignation des index finaux', {
        courseId: course.id,
        totalLessons: sortedLessonsForUpdate.length
      })

      for (let i = 0; i < sortedLessonsForUpdate.length; i++) {
        const lesson = sortedLessonsForUpdate[i]
        try {
          logger.info(`Réorganisation (handleApplyOptimizationDirectly) - Réassignation finale leçon ${i + 1}/${sortedLessonsForUpdate.length}`, {
            lessonId: lesson.id,
            lessonTitle: lesson.title.substring(0, 30),
            finalOrderIndex: i
          })
          await adminService.updateLesson(lesson.id, { order_index: i })
        } catch (error) {
          logger.error(`Erreur lors de la réassignation finale de la leçon ${lesson.id} (handleApplyOptimizationDirectly)`, error, {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            finalOrderIndex: i,
            totalLessons: sortedLessonsForUpdate.length
          })
          throw error
        }
      }

      logger.info('Réorganisation des leçons (handleApplyOptimizationDirectly) - Terminé avec succès', {
        courseId: course.id,
        totalLessons: sortedLessonsForUpdate.length
      })

      // Réinitialiser le cache du score pour recharger
      loadedScoreIdsRef.current.delete(course.id)
      setCourseScores(prev => {
        const next = new Map(prev)
        next.delete(course.id)
        return next
      })
    } catch (error) {
      throw error
    }
  }

  const handleOptimizeAllLowScoreCourses = () => {
    if (courses.length === 0) {
      showToast({
        variant: 'info',
        title: 'Aucun cours',
        message: 'Aucun cours à optimiser'
      })
      return
    }

    // Filtrer les cours avec score < 90%
    const coursesToOptimize: Array<{ course: Course; score: number }> = []
    
    for (const course of courses) {
      const score = courseScores.get(course.id)
      if (score && score.totalScore < 90) {
        coursesToOptimize.push({ course, score: score.totalScore })
      } else if (!score) {
        // Si le score n'est pas encore calculé, on l'inclut par défaut
        coursesToOptimize.push({ course, score: 0 })
      }
    }

    if (coursesToOptimize.length === 0) {
      showToast({
        variant: 'success',
        title: 'Aucune optimisation nécessaire',
        message: 'Tous les cours ont un score supérieur à 90%'
      })
      return
    }

    // Ouvrir la modale de confirmation
    setShowBulkOptimizationModal(true)
    setOptimizationProgress({
      total: coursesToOptimize.length,
      current: 0,
      currentCourseTitle: '',
      success: 0,
      errors: 0
    })
  }

  const handleStartBulkOptimization = async () => {
    // NE PAS fermer la modale, elle restera ouverte pour afficher la progression

    // Filtrer les cours avec score < 90%
    const coursesToOptimize: Array<{ course: Course; score: number }> = []
    
    for (const course of courses) {
      const score = courseScores.get(course.id)
      if (score && score.totalScore < 90) {
        coursesToOptimize.push({ course, score: score.totalScore })
      } else if (!score) {
        coursesToOptimize.push({ course, score: 0 })
      }
    }

    // Initialiser la progression
    setOptimizationProgress({
      total: coursesToOptimize.length,
      current: 0,
      currentCourseTitle: '',
      success: 0,
      errors: 0
    })

    // Traiter chaque cours en séquence
    let finalSuccessCount = 0
    let finalErrorCount = 0

    for (let i = 0; i < coursesToOptimize.length; i++) {
      const { course } = coursesToOptimize[i]
      
      // Mettre à jour la progression
      setOptimizationProgress(prev => prev ? {
        ...prev,
        current: i + 1,
        currentCourseTitle: course.title
      } : null)

      try {
        await handleOptimize(course, true) // autoApply = true
        
        // Recalculer le score après optimisation
        const courseWithLessons = await adminService.getCourseWithLessons(course.id)
        if (courseWithLessons) {
          const newScore = calculateCourseQualityScore(courseWithLessons.course, courseWithLessons.lessons)
          setCourseScores(prev => {
            const next = new Map(prev)
            next.set(course.id, newScore)
            return next
          })
        }

        finalSuccessCount++
        setOptimizationProgress(prev => prev ? {
          ...prev,
          success: finalSuccessCount
        } : null)
        
        // Attendre un peu entre chaque optimisation pour éviter de surcharger l'API (sauf pour le dernier)
        if (i < coursesToOptimize.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (error) {
        finalErrorCount++
        setOptimizationProgress(prev => prev ? {
          ...prev,
          errors: finalErrorCount
        } : null)
        logger.error(`Erreur optimisation cours ${course.id}`, error)
        // Continuer avec le cours suivant même en cas d'erreur
      }
    }

    // Rafraîchir la liste
    onRefresh()

    // Mettre à jour la progression pour indiquer que c'est terminé
    setOptimizationProgress(prev => prev ? {
      ...prev,
      current: prev.total,
      currentCourseTitle: ''
    } : null)

    // Afficher le résumé
    showToast({
      variant: finalSuccessCount > 0 ? 'success' : 'error',
      title: 'Optimisation terminée',
      message: `${finalSuccessCount} cours optimisé(s) avec succès${finalErrorCount > 0 ? `. ${finalErrorCount} erreur(s).` : '.'}`
    })

    // Attendre 3 secondes pour que l'utilisateur voie le résultat final, puis fermer la modale
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Fermer la modale et réinitialiser la progression
    setShowBulkOptimizationModal(false)
    setOptimizationProgress(null)
  }

  const handleApplyOptimization = async () => {
    if (!showOptimizationModal) return

    const { course, result } = showOptimizationModal
    try {
      // Appliquer les optimisations au cours
      await adminService.updateCourse(course.id, result.optimized.course as Partial<Course>)

      // Récupérer les leçons existantes
      const courseWithLessons = await adminService.getCourseWithLessons(course.id)
      if (!courseWithLessons) {
        throw new Error('Impossible de charger les leçons du cours')
      }

      // 1. Supprimer les leçons marquées pour suppression
      const deletedIds = result.optimized.deletedLessonIds || []
      for (const deletedId of deletedIds) {
        try {
          await adminService.deleteLesson(deletedId)
        } catch (error) {
          logger.error(`Erreur suppression leçon ${deletedId}`, error)
        }
      }

      // 2. Trier les leçons optimisées par order_index
      const sortedLessons = (result.optimized.lessons || []).slice().sort((a, b) => 
        (a.order_index || 0) - (b.order_index || 0)
      )

      // 3. Récupérer toutes les leçons restantes après suppression
      const remainingLessonsBefore = await adminService.getLessons(course.id)
      const maxOrderIndex = Math.max(...remainingLessonsBefore.map(l => l.order_index), -1)
      const tempOffset = maxOrderIndex + 1000 // Offset temporaire pour éviter les conflits

      // 4. Appliquer les modifications (création/mise à jour) SANS order_index d'abord
      const createdLessonIds: string[] = []
      for (const optimizedLesson of sortedLessons) {
        if (optimizedLesson.action === 'create') {
          // Créer une nouvelle leçon avec un order_index temporaire
          const newLesson = await adminService.createLesson({
            course_id: course.id,
            title: optimizedLesson.title || 'Nouvelle leçon',
            description: optimizedLesson.description || '',
            content_type: optimizedLesson.content_type || 'text',
            order_index: tempOffset + createdLessonIds.length, // Index temporaire
            action_type: optimizedLesson.action_type || null,
            action_target: optimizedLesson.action_target || null,
            action_value: optimizedLesson.action_value || null
          })
          createdLessonIds.push(newLesson.id)
        } else if (optimizedLesson.action === 'update' && optimizedLesson.id) {
          // Mettre à jour une leçon existante SANS order_index pour l'instant
          const updateData: Partial<Lesson> = {}
          if (optimizedLesson.title) updateData.title = optimizedLesson.title
          if (optimizedLesson.description) updateData.description = optimizedLesson.description
          if (optimizedLesson.content_type) updateData.content_type = optimizedLesson.content_type as Lesson['content_type']
          // Ne PAS mettre à jour order_index ici pour éviter les conflits
          if (optimizedLesson.action_type !== undefined) updateData.action_type = optimizedLesson.action_type
          if (optimizedLesson.action_target !== undefined) updateData.action_target = optimizedLesson.action_target
          if (optimizedLesson.action_value !== undefined) updateData.action_value = optimizedLesson.action_value

          await adminService.updateLesson(optimizedLesson.id, updateData)
        }
      }

      // 5. Maintenant récupérer toutes les leçons (y compris les nouvelles)
      const allLessons = await adminService.getLessons(course.id)
      
      // 6. Construire un mapping des leçons optimisées avec leur order_index cible
      const lessonOrderMap = new Map<string, number>()
      for (const optimizedLesson of sortedLessons) {
        if (optimizedLesson.action === 'create' && optimizedLesson.order_index !== undefined) {
          // Trouver l'ID de la leçon créée qui correspond
          const createdLesson = allLessons.find(l => 
            !lessonOrderMap.has(l.id) && 
            l.title === optimizedLesson.title &&
            l.order_index >= tempOffset
          )
          if (createdLesson) {
            lessonOrderMap.set(createdLesson.id, optimizedLesson.order_index)
          }
        } else if (optimizedLesson.action === 'update' && optimizedLesson.id && optimizedLesson.order_index !== undefined) {
          lessonOrderMap.set(optimizedLesson.id, optimizedLesson.order_index)
        }
      }

      // 7. Trier les leçons AVANT les mises à jour selon leur order_index cible
      // Cela garantit qu'on connaît l'ordre final avant de faire les mises à jour
      logger.info('Réorganisation des leçons (handleApplyOptimization) - Début', {
        courseId: course.id,
        totalLessons: allLessons.length,
        lessonOrderMapSize: lessonOrderMap.size,
        tempOffset,
        currentOrderIndexes: allLessons.map(l => ({ id: l.id, title: l.title.substring(0, 30), order_index: l.order_index }))
      })

      const sortedLessonsForUpdate = [...allLessons].sort((a, b) => {
        // Utiliser l'order_index cible si disponible, sinon utiliser l'order_index actuel
        const orderA = lessonOrderMap.get(a.id) ?? a.order_index
        const orderB = lessonOrderMap.get(b.id) ?? b.order_index
        return orderA - orderB
      })

      logger.info('Réorganisation des leçons (handleApplyOptimization) - Tri effectué', {
        courseId: course.id,
        sortedOrder: sortedLessonsForUpdate.map(l => ({ 
          id: l.id, 
          title: l.title.substring(0, 30), 
          currentOrder: l.order_index,
          targetOrder: lessonOrderMap.get(l.id) ?? l.order_index
        }))
      })

      // 8. Mettre TOUTES les leçons à des valeurs NÉGATIVES uniques pour libérer tous les index positifs
      // On utilise des index négatifs car ils sont très peu susceptibles d'être utilisés
      logger.info('Réorganisation des leçons (handleApplyOptimization) - Mise à jour vers index négatifs temporaires', {
        courseId: course.id,
        totalLessons: sortedLessonsForUpdate.length
      })

      for (let i = 0; i < sortedLessonsForUpdate.length; i++) {
        const lesson = sortedLessonsForUpdate[i]
        // Utiliser des index négatifs uniques : -1, -2, -3, etc.
        const tempIndex = -(i + 1)
        try {
          logger.info(`Réorganisation (handleApplyOptimization) - Mise à jour temporaire leçon ${i + 1}/${sortedLessonsForUpdate.length}`, {
            lessonId: lesson.id,
            lessonTitle: lesson.title.substring(0, 30),
            oldOrderIndex: lesson.order_index,
            newTempOrderIndex: tempIndex
          })
          await adminService.updateLesson(lesson.id, { order_index: tempIndex })
        } catch (error) {
          logger.error(`Erreur lors de la mise à jour temporaire de la leçon ${lesson.id} (handleApplyOptimization)`, error, {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            oldOrderIndex: lesson.order_index,
            newTempOrderIndex: tempIndex,
            index: i
          })
          throw error
        }
      }

      // 9. Maintenant réassigner les order_index finaux séquentiellement dans l'ordre déjà trié
      // Toutes les leçons sont maintenant à des index négatifs, donc aucun conflit possible
      logger.info('Réorganisation des leçons (handleApplyOptimization) - Réassignation des index finaux', {
        courseId: course.id,
        totalLessons: sortedLessonsForUpdate.length
      })

      for (let i = 0; i < sortedLessonsForUpdate.length; i++) {
        const lesson = sortedLessonsForUpdate[i]
        try {
          logger.info(`Réorganisation (handleApplyOptimization) - Réassignation finale leçon ${i + 1}/${sortedLessonsForUpdate.length}`, {
            lessonId: lesson.id,
            lessonTitle: lesson.title.substring(0, 30),
            finalOrderIndex: i
          })
          await adminService.updateLesson(lesson.id, { order_index: i })
        } catch (error) {
          logger.error(`Erreur lors de la réassignation finale de la leçon ${lesson.id} (handleApplyOptimization)`, error, {
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            finalOrderIndex: i,
            totalLessons: sortedLessonsForUpdate.length
          })
          throw error
        }
      }

      logger.info('Réorganisation des leçons (handleApplyOptimization) - Terminé avec succès', {
        courseId: course.id,
        totalLessons: sortedLessonsForUpdate.length
      })

      showToast({
        variant: 'success',
        title: 'Optimisation appliquée',
        message: `Le cours a été optimisé. Score estimé: ${result.estimatedNewScore}% (était ${result.originalScore}%)`
      })

      // Réinitialiser le cache du score pour recharger
      loadedScoreIdsRef.current.delete(course.id)
      setCourseScores(prev => {
        const next = new Map(prev)
        next.delete(course.id)
        return next
      })

      setShowOptimizationModal(null)
      onRefresh()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible d'appliquer l'optimisation : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  const getScoreBadge = (score: CourseScore | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          Calcul...
        </span>
      )
    }

    if (!score) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          N/A
        </span>
      )
    }

    const color = getScoreColor(score.totalScore)
    const bgColor = color === 'red' 
      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      : color === 'orange'
      ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
      : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor}`} title={`Qualité: ${score.breakdown.quality}%, Longueur: ${score.breakdown.length}%, Pertinence: ${score.breakdown.relevance}%, Structure: ${score.breakdown.structure}%, Engagement: ${score.breakdown.engagement}%, Expression clé: ${score.breakdown.keyword}%, Médias: ${score.breakdown.media}%${score.keyword ? ` (Clé: "${score.keyword}")` : ''}`}>
        {score.totalScore}%
      </span>
    )
  }


  // Calculer les compteurs par catégorie de score
  const scoreCounts = React.useMemo(() => {
    let red = 0   // < 70%
    let orange = 0 // 71-89%
    let green = 0  // >= 90%
    
    courses.forEach(course => {
      const score = courseScores.get(course.id)
      if (!score) {
        // Si pas de score, on le compte comme rouge (à améliorer)
        red++
      } else {
        if (score.totalScore < 70) {
          red++
        } else if (score.totalScore >= 70 && score.totalScore < 90) {
          orange++
        } else {
          green++
        }
      }
    })
    
    return { red, orange, green }
  }, [courses, courseScores])

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Cours ({courses.length})</h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{scoreCounts.red}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{scoreCounts.orange}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{scoreCounts.green}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleOptimizeAllLowScoreCourses}
              disabled={optimizingCourse !== null || (optimizationProgress !== null && optimizationProgress.current > 0)}
            >
              {(optimizingCourse !== null || (optimizationProgress !== null && optimizationProgress.current > 0)) ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              {(optimizingCourse !== null || (optimizationProgress !== null && optimizationProgress.current > 0)) ? 'Optimisation en cours...' : 'Optimiser tous les cours'}
            </button>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => {
                setEditingCourse(null)
                setShowCreateModal(true)
              }}
            >
              + Ajouter un cours
            </button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {courses.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucun cours enregistré.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Publié</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {courses.map((course) => {
                const score = courseScores.get(course.id)
                const isLoading = loadingScores.has(course.id)
                const isOptimizing = optimizingCourse === course.id
                const isCurrentlyOptimizing = optimizationProgress?.currentCourseTitle === course.title

                return (
                  <tr key={course.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                        {course.type === 'quiz' ? 'Quiz' : course.type === 'tutorial' ? 'Tutoriel' : course.type === 'guide' ? 'Guide' : course.type === 'preset' ? 'Preset' : course.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{course.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getScoreBadge(score, isLoading)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {course.is_published ? 'Oui' : 'Non'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <CTA
                          variant="icon-only"
                          icon={
                            (isOptimizing || isCurrentlyOptimizing) ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Sparkles size={18} />
                            )
                          }
                          onClick={() => handleOptimize(course)}
                          title={(isOptimizing || isCurrentlyOptimizing) ? "Optimisation en cours..." : "Optimiser avec IA"}
                          disabled={isOptimizing || isCurrentlyOptimizing}
                          className={(isOptimizing || isCurrentlyOptimizing) ? 'opacity-50 cursor-not-allowed' : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'}
                        />
                        <CTA
                          variant="icon-only"
                          icon={<Edit size={18} />}
                          onClick={() => showToast({ variant: 'info', title: 'À venir', message: 'Formulaire d\'édition à implémenter' })}
                          title="Modifier"
                        />
                        <CTA
                          variant="icon-only"
                          icon={<Trash2 size={18} />}
                          onClick={() => handleDelete(course.id, course.title)}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        </div>
      </div>
      <CreateCourseModal 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false)
          setEditingCourse(null)
        }} 
        onSuccess={() => {
          onRefresh()
          setEditingCourse(null)
        }}
        editingCourse={editingCourse}
      />
      
      {/* Modal d'optimisation */}
      <Modal
        isOpen={showOptimizationModal !== null}
        onClose={() => setShowOptimizationModal(null)}
        title="Optimisation IA du cours"
        widthClassName="max-w-4xl"
      >
        {showOptimizationModal && (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-blue-900 dark:text-blue-100">Score actuel</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {showOptimizationModal.result.originalScore}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-green-900 dark:text-green-100">Score estimé après optimisation</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {showOptimizationModal.result.estimatedNewScore}%
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Modifications proposées</h3>
              <ul className="space-y-2">
                {showOptimizationModal.result.changes.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowOptimizationModal(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyOptimization}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Appliquer l'optimisation
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal d'optimisation en masse */}
      <Modal
        isOpen={showBulkOptimizationModal}
        onClose={() => {
          // Ne permettre la fermeture que si l'optimisation n'a pas commencé ou est terminée
          if (!optimizationProgress || optimizationProgress.current === 0 || optimizationProgress.current >= optimizationProgress.total) {
            setShowBulkOptimizationModal(false)
            setOptimizationProgress(null)
          }
        }}
        title="Optimisation en masse des cours"
        widthClassName="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              {(() => {
                const coursesToOptimize = courses.filter(c => {
                  const score = courseScores.get(c.id)
                  return (score && score.totalScore < 90) || !score
                }).length
                return `${coursesToOptimize} cours seront optimisés automatiquement (score < 90%).`
              })()}
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
              Les optimisations seront appliquées directement et les scores seront mis à jour automatiquement.
            </p>
          </div>

          {optimizationProgress && optimizationProgress.total > 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progression
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {optimizationProgress.current} / {optimizationProgress.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((optimizationProgress.current / optimizationProgress.total) * 100, 100)}%` }}
                />
              </div>
              {optimizationProgress.currentCourseTitle && optimizationProgress.current < optimizationProgress.total && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Traitement en cours : <strong>{optimizationProgress.currentCourseTitle}</strong>
                </p>
              )}
              {optimizationProgress.current >= optimizationProgress.total && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    ✓ Optimisation terminée !
                  </p>
                </div>
              )}
              {(optimizationProgress.success > 0 || optimizationProgress.errors > 0) && (
                <div className="flex gap-4 mt-3 text-xs">
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    ✓ {optimizationProgress.success} succès
                  </span>
                  {optimizationProgress.errors > 0 && (
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      ✗ {optimizationProgress.errors} erreurs
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Cliquez sur "Démarrer l'optimisation" pour commencer le traitement des cours.
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                setShowBulkOptimizationModal(false)
                setOptimizationProgress(null)
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={optimizationProgress !== null && optimizationProgress.current > 0 && optimizationProgress.current < optimizationProgress.total}
            >
              {optimizationProgress && optimizationProgress.current >= optimizationProgress.total ? 'Fermer' : 'Annuler'}
            </button>
            {(!optimizationProgress || optimizationProgress.current < optimizationProgress.total) && (
              <button
                onClick={handleStartBulkOptimization}
                disabled={optimizationProgress !== null && optimizationProgress.current > 0}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {optimizationProgress && optimizationProgress.current > 0 ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    En cours...
                  </>
                ) : (
                  'Démarrer l\'optimisation'
                )}
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  )
}

function LessonsSection({ lessons, onRefresh }: { lessons: Lesson[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [lessonScores, setLessonScores] = useState<Map<string, LessonScore>>(new Map())
  const [loadingScores, setLoadingScores] = useState<Set<string>>(new Set())
  const [coursesMap, setCoursesMap] = useState<Map<string, Course>>(new Map())
  const loadedScoreIdsRef = useRef<Set<string>>(new Set())

  // Charger les cours pour avoir accès à la difficulté
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courses = await adminService.getCourses()
        const map = new Map(courses.map(c => [c.id, c]))
        setCoursesMap(map)
        setAvailableCourses(courses)
      } catch (error) {
        logger.error('Erreur chargement cours', error)
      }
    }
    loadCourses()
  }, [])

  // Charger les scores pour toutes les leçons
  useEffect(() => {
    const loadScores = async () => {
      if (coursesMap.size === 0) return // Attendre que les cours soient chargés
      
      const lessonsToLoad = lessons.filter(l => 
        !loadedScoreIdsRef.current.has(l.id) && 
        !loadingScores.has(l.id)
      )
      
      if (lessonsToLoad.length === 0) return

      for (const lesson of lessonsToLoad) {
        setLoadingScores(prev => new Set(prev).add(lesson.id))
        try {
          const course = coursesMap.get(lesson.course_id)
          const score = calculateLessonQualityScore(lesson, course?.difficulty)
          setLessonScores(prev => {
            const next = new Map(prev)
            next.set(lesson.id, score)
            loadedScoreIdsRef.current.add(lesson.id)
            return next
          })
        } catch (error) {
          logger.error(`Erreur calcul score leçon ${lesson.id}`, error)
        } finally {
          setLoadingScores(prev => {
            const next = new Set(prev)
            next.delete(lesson.id)
            return next
          })
        }
      }
    }

    loadScores()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons.length, coursesMap.size])

  useEffect(() => {
    if (showCreateModal && availableCourses.length === 0) {
      adminService.getCourses().then(setAvailableCourses).catch(() => setAvailableCourses([]))
    }
  }, [showCreateModal, availableCourses.length])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer la leçon "${title}" ?`)) {
      return
    }

    try {
      await adminService.deleteLesson(id)
      showToast({
        variant: 'success',
        title: 'Leçon supprimée',
        message: `La leçon "${title}" a été supprimée avec succès.`
      })
      onRefresh()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de supprimer la leçon : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  const getLessonScoreBadge = (score: LessonScore | undefined, isLoading: boolean) => {
    if (isLoading) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          Calcul...
        </span>
      )
    }

    if (!score) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          N/A
        </span>
      )
    }

    const color = getScoreColor(score.totalScore)
    const bgColor = color === 'red' 
      ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      : color === 'orange'
      ? 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200'
      : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'

    return (
      <span 
        className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor}`} 
        title={`Longueur: ${score.breakdown.length}%, Richesse: ${score.breakdown.richness}%, Titre: ${score.breakdown.title}%, Interactivité: ${score.breakdown.interactivity}%`}
      >
        {score.totalScore}%
      </span>
    )
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Leçons ({lessons.length})</h2>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => setShowCreateModal(true)}
          >
            + Ajouter
          </button>
        </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {lessons.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucune leçon enregistrée.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Cours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {lessons.map((lesson) => {
                const score = lessonScores.get(lesson.id)
                const isLoading = loadingScores.has(lesson.id)
                const course = coursesMap.get(lesson.course_id)

                return (
                  <tr key={lesson.id}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{lesson.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {course?.title || lesson.course_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lesson.content_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getLessonScoreBadge(score, isLoading)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <CTA
                          variant="icon-only"
                          icon={<Edit size={18} />}
                          onClick={() => showToast({ variant: 'info', title: 'À venir', message: 'Formulaire d\'édition à implémenter' })}
                          title="Modifier"
                        />
                        <CTA
                          variant="icon-only"
                          icon={<Trash2 size={18} />}
                          onClick={() => handleDelete(lesson.id, lesson.title)}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      </div>
      <CreateLessonModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={onRefresh} courses={availableCourses} />
    </>
  )
}

function PacksSection({ packs, onRefresh }: { packs: DLCPack[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [expandedPack, setExpandedPack] = useState<string | null>(null)
  const [packCourses, setPackCourses] = useState<Map<string, Course[]>>(new Map())
  const [loadingCourses, setLoadingCourses] = useState<Set<string>>(new Set())
  const [showLinkModal, setShowLinkModal] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])

  const loadPackCourses = async (packId: string) => {
    if (packCourses.has(packId)) {
      return
    }

    setLoadingCourses(prev => new Set(prev).add(packId))
    try {
      const courses = await adminService.getDLCPackCourses(packId)
      setPackCourses(prev => new Map(prev).set(packId, courses))
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de charger les cours : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    } finally {
      setLoadingCourses(prev => {
        const next = new Set(prev)
        next.delete(packId)
        return next
      })
    }
  }

  const handleToggleExpand = async (packId: string) => {
    if (expandedPack === packId) {
      setExpandedPack(null)
    } else {
      setExpandedPack(packId)
      await loadPackCourses(packId)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le pack "${name}" ?`)) {
      return
    }

    try {
      await adminService.deleteDLCPack(id)
      showToast({
        variant: 'success',
        title: 'Pack supprimé',
        message: `Le pack "${name}" a été supprimé avec succès.`
      })
      onRefresh()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de supprimer le pack : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  const handleOpenLinkModal = async (packId: string) => {
    setShowLinkModal(packId)
    try {
      const courses = await adminService.getCourses()
      const linkedCourses = packCourses.get(packId) || []
      const linkedIds = new Set(linkedCourses.map(c => c.id))
      setAvailableCourses(courses.filter(c => !linkedIds.has(c.id)))
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de charger les cours : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  const handleLinkCourse = async (packId: string, courseId: string) => {
    try {
      await adminService.linkCourseToPack(packId, courseId)
      showToast({
        variant: 'success',
        title: 'Cours lié',
        message: 'Le cours a été ajouté au pack avec succès.'
      })
      setPackCourses(prev => {
        const courses = prev.get(packId) || []
        const course = availableCourses.find(c => c.id === courseId)
        if (course) {
          return new Map(prev).set(packId, [...courses, course])
        }
        return prev
      })
      setAvailableCourses(prev => prev.filter(c => c.id !== courseId))
      setShowLinkModal(null)
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de lier le cours : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  const handleUnlinkCourse = async (packId: string, courseId: string, courseTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir retirer le cours "${courseTitle}" du pack ?`)) {
      return
    }

    try {
      await adminService.unlinkCourseFromPack(packId, courseId)
      showToast({
        variant: 'success',
        title: 'Cours retiré',
        message: 'Le cours a été retiré du pack avec succès.'
      })
      setPackCourses(prev => {
        const courses = prev.get(packId) || []
        return new Map(prev).set(packId, courses.filter(c => c.id !== courseId))
      })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de retirer le cours : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Packs ({packs.length})</h2>
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          onClick={() => setShowCreateModal(true)}
        >
          + Ajouter
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        {packs.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Aucun pack enregistré.
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Cours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {packs.map((pack) => {
                const courses = packCourses.get(pack.id) || []
                const isExpanded = expandedPack === pack.id
                const isLoading = loadingCourses.has(pack.id)

                return (
                  <React.Fragment key={pack.id}>
                    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{pack.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{pack.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {pack.price} {pack.currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <span>{courses.length} cours</span>
                          <CTA
                            variant="icon-only"
                            icon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            onClick={() => handleToggleExpand(pack.id)}
                            title={isExpanded ? 'Masquer' : 'Afficher les cours'}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <CTA
                            variant="icon-only"
                            icon={<Plus size={18} />}
                            onClick={() => handleOpenLinkModal(pack.id)}
                            title="Ajouter un cours"
                          />
                          <CTA
                            variant="icon-only"
                            icon={<Edit size={18} />}
                            onClick={() => showToast({ variant: 'info', title: 'À venir', message: 'Formulaire d\'édition à implémenter' })}
                            title="Modifier"
                          />
                          <CTA
                            variant="icon-only"
                            icon={<Trash2 size={18} />}
                            onClick={() => handleDelete(pack.id, pack.name)}
                            title="Supprimer"
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          />
                        </div>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-gray-900">
                          {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader size="sm" variant="light" showText={false} />
                            </div>
                          ) : courses.length === 0 ? (
                            <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                              Aucun cours lié à ce pack.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-3">
                                Cours liés ({courses.length})
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {courses.map((course) => (
                                  <div
                                    key={course.id}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start justify-between"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                        {course.title}
                                      </h5>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {course.category} • {course.difficulty}
                                      </p>
                                      {course.description && (
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2">
                                          {course.description}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-xs px-2 py-1 rounded ${
                                          course.is_published
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                        }`}>
                                          {course.is_published ? 'Publié' : 'Brouillon'}
                                        </span>
                                        {course.is_premium && (
                                          <span className="text-xs px-2 py-1 rounded bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                            Premium
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    <CTA
                                      variant="icon-only"
                                      icon={<X size={16} />}
                                      onClick={() => handleUnlinkCourse(pack.id, course.id, course.title)}
                                      title="Retirer du pack"
                                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2 flex-shrink-0"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal pour lier un cours */}
      <Modal
        isOpen={showLinkModal !== null}
        onClose={() => setShowLinkModal(null)}
        title="Ajouter un cours au pack"
        widthClassName="max-w-2xl"
      >
        <div className="max-h-96 overflow-y-auto">
          {availableCourses.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Tous les cours sont déjà liés à ce pack.
            </div>
          ) : (
            <div className="space-y-2">
              {availableCourses.map((course) => (
                <div
                  key={`available-${course.id}`}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm text-gray-900 dark:text-white">
                      {course.title}
                    </h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {course.category} • {course.difficulty}
                    </p>
                    {course.description && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>
                  <CTA
                    variant="icon-only"
                    icon={<Plus size={18} />}
                    onClick={() => showLinkModal && handleLinkCourse(showLinkModal, course.id)}
                    title="Ajouter au pack"
                    className="ml-2 flex-shrink-0"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
      <CreateDLCPackModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={onRefresh} />
    </div>
  )
}

function FeaturesSection({ flags, onRefresh }: { flags: FeatureFlag[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)

  // Mapping des clés de feature flags vers des noms lisibles pour les pages
  const pageNames: Record<string, string> = {
    'page_looper': 'Looper',
    'page_practice': 'Pratique',
    'page_learn': 'Apprendre',
    'page_mixing': 'Mixage',
    'page_drummachine': 'Boîte à rythmes'
  }

  // Pages prédéfinies à initialiser
  const predefinedPages = [
    { key: 'page_looper', name: 'Looper', description: 'Page du looper' },
    { key: 'page_practice', name: 'Pratique', description: 'Page de pratique' },
    { key: 'page_learn', name: 'Apprendre', description: 'Page d\'apprentissage' },
    { key: 'page_mixing', name: 'Mixage', description: 'Page de mixage' },
    { key: 'page_drummachine', name: 'Boîte à rythmes', description: 'Page de la boîte à rythmes' }
  ]

  // Séparer les flags de pages des autres flags
  const pageFlags = flags.filter(flag => flag.key.startsWith('page_'))
  const otherFlags = flags.filter(flag => !flag.key.startsWith('page_'))

  // Trouver les pages manquantes
  const existingPageKeys = new Set(pageFlags.map(flag => flag.key))
  const missingPages = predefinedPages.filter(page => !existingPageKeys.has(page.key))

  // Fonction pour initialiser les pages manquantes
  const initializeMissingPages = async () => {
    if (missingPages.length === 0) {
      showToast({
        variant: 'info',
        title: 'Aucune page à initialiser',
        message: 'Toutes les pages sont déjà configurées.'
      })
      return
    }

    setIsInitializing(true)
    try {
      let created = 0
      let errors = 0

      for (const page of missingPages) {
        try {
          await adminService.createFeatureFlag({
            key: page.key,
            name: page.name,
            description: page.description,
            enabled: false, // Désactivées par défaut
            value: null
          })
          created++
        } catch (error) {
          logger.error(`Erreur lors de la création du feature flag ${page.key}`, error)
          errors++
        }
      }

      if (created > 0) {
        showToast({
          variant: 'success',
          title: 'Pages initialisées',
          message: `${created} page(s) ont été créée(s) avec succès.${errors > 0 ? ` ${errors} erreur(s).` : ''}`
        })
        onRefresh()
      } else if (errors > 0) {
        showToast({
          variant: 'error',
          title: 'Erreur',
          message: `Impossible de créer les pages : ${errors} erreur(s).`
        })
      }
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible d'initialiser les pages : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    } finally {
      setIsInitializing(false)
    }
  }

  const toggleFeature = async (flag: FeatureFlag, enabled: boolean) => {
    try {
      await adminService.updateFeatureFlag(flag.id, { enabled })
      showToast({
        variant: 'success',
        title: 'Fonctionnalité mise à jour',
        message: `${flag.name} est maintenant ${enabled ? 'activée' : 'désactivée'}`
      })
      onRefresh()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de mettre à jour la fonctionnalité : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le feature flag "${name}" ?`)) {
      return
    }

    try {
      await adminService.deleteFeatureFlag(id)
      showToast({
        variant: 'success',
        title: 'Feature flag supprimé',
        message: `Le feature flag "${name}" a été supprimé avec succès.`
      })
      onRefresh()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de supprimer le feature flag : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Fonctionnalités ({flags.length})</h2>
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            onClick={() => setShowCreateModal(true)}
          >
            + Ajouter
          </button>
        </div>
        <div className="space-y-6">
          {/* Section Pages */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pages</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Activez ou désactivez les pages de l'application</p>
              </div>
              {missingPages.length > 0 && (
                <button
                  onClick={initializeMissingPages}
                  disabled={isInitializing}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {isInitializing ? 'Initialisation...' : `Initialiser les pages manquantes (${missingPages.length})`}
                </button>
              )}
            </div>
            {pageFlags.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                <p className="mb-4">Aucune page configurée.</p>
                {missingPages.length > 0 && (
                  <button
                    onClick={initializeMissingPages}
                    disabled={isInitializing}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isInitializing ? 'Initialisation...' : `Initialiser ${missingPages.length} page(s)`}
                  </button>
                )}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Clé</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">État</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {pageFlags.map((flag) => (
                    <tr key={flag.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                        {pageNames[flag.key] || flag.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{flag.key}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Toggle
                          checked={flag.enabled}
                          onChange={(checked: boolean) => toggleFeature(flag, checked)}
                          labelLeft="OFF"
                          labelRight="ON"
                          mode="onoff"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <CTA
                            variant="icon-only"
                            icon={<Edit size={18} />}
                            onClick={() => showToast({ variant: 'info', title: 'À venir', message: 'Formulaire d\'édition à implémenter' })}
                            title="Modifier"
                          />
                          <CTA
                            variant="icon-only"
                            icon={<Trash2 size={18} />}
                            onClick={() => handleDelete(flag.id, flag.name)}
                            title="Supprimer"
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Section Autres fonctionnalités */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Autres fonctionnalités
                {pageFlags.length > 0 && <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">({otherFlags.length})</span>}
              </h3>
            </div>
            {otherFlags.length === 0 && pageFlags.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Aucune fonctionnalité configurée. Créez-en une pour commencer.
              </div>
            ) : otherFlags.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Aucune autre fonctionnalité configurée.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Clé</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">État</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {otherFlags.map((flag) => (
                    <tr key={flag.id}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{flag.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{flag.key}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Toggle
                          checked={flag.enabled}
                          onChange={(checked: boolean) => toggleFeature(flag, checked)}
                          labelLeft="OFF"
                          labelRight="ON"
                          mode="onoff"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <CTA
                            variant="icon-only"
                            icon={<Edit size={18} />}
                            onClick={() => showToast({ variant: 'info', title: 'À venir', message: 'Formulaire d\'édition à implémenter' })}
                            title="Modifier"
                          />
                          <CTA
                            variant="icon-only"
                            icon={<Trash2 size={18} />}
                            onClick={() => handleDelete(flag.id, flag.name)}
                            title="Supprimer"
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <CreateFeatureFlagModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSuccess={onRefresh} />
    </>
  )
}

function AnalyticsSection() {
  const { showToast } = useToast()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | 'all'>('30d')

  useEffect(() => {
    loadStats()
  }, [selectedPeriod])

  const loadStats = () => {
    setLoading(true)
    try {
      const analyticsStats = analyticsService.getStats()
      setStats(analyticsStats)
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible de charger les statistiques : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClearData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer toutes les données analytics ? Cette action est irréversible.')) {
      try {
        analyticsService.clearAll()
        loadStats()
        showToast({
          variant: 'success',
          title: 'Données effacées',
          message: 'Toutes les données analytics ont été supprimées.'
        })
      } catch (error) {
        showToast({
          variant: 'error',
          title: 'Erreur',
          message: `Impossible d'effacer les données : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
        })
      }
    }
  }

  const handleExportData = () => {
    try {
      const data = analyticsService.exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `webamp-analytics-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast({
        variant: 'success',
        title: 'Export réussi',
        message: 'Les données analytics ont été exportées.'
      })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: `Impossible d'exporter les données : ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      })
    }
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const minutes = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${minutes}m ${secs}s`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader size="lg" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            Aucune donnée analytics disponible pour le moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Analytics</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Statistiques d'audience et d'utilisation (cookieless)
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | 'all')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="all">Tout</option>
          </select>
          <button
            onClick={handleExportData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Exporter
          </button>
          <button
            onClick={handleClearData}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Effacer
          </button>
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Sessions totales</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.totalSessions.toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Vues de pages</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.totalPageViews.toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Événements</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.totalEvents.toLocaleString()}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs uniques</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {stats.uniqueUsers.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Durée moyenne de session */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Durée moyenne de session</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {formatDuration(stats.averageSessionDuration)}
        </div>
      </div>

      {/* Graphiques */}
      <div className="space-y-6">
        {/* Évolution temporelle */}
        <EvolutionLineChart stats={stats} />

        {/* Grille de graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carte du monde / Barres pays */}
          <SessionsWorldMap stats={stats} />
          
          {/* Barres pays */}
          <CountriesBarChart stats={stats} />
        </div>

        {/* Camemberts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DevicesPieChart stats={stats} />
          <BrowsersPieChart stats={stats} />
          <OSPieChart stats={stats} />
        </div>
      </div>

      {/* Top pages */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pages les plus visitées</h3>
        {stats.topPages.length > 0 ? (
          <div className="space-y-2">
            {stats.topPages.map((page: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                    #{index + 1}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">{page.path}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-semibold">
                  {page.views.toLocaleString()} vues
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
        )}
      </div>

      {/* Top événements */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Événements les plus fréquents</h3>
        {stats.topEvents.length > 0 ? (
          <div className="space-y-2">
            {stats.topEvents.map((event: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                    #{index + 1}
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">{event.name}</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300 font-semibold">
                  {event.count.toLocaleString()} fois
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
        )}
      </div>

      {/* Sessions par jour */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité par jour</h3>
        {Object.keys(stats.sessionsByDay).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(stats.sessionsByDay)
              .sort(([a], [b]) => b.localeCompare(a))
              .slice(0, 30)
              .map(([date, count]: [string, any]) => (
                <div key={date} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-900 dark:text-white font-medium">{formatDate(date)}</span>
                  <span className="text-gray-600 dark:text-gray-300 font-semibold">
                    {count.toLocaleString()} événements
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
        )}
      </div>
    </div>
  )
}

