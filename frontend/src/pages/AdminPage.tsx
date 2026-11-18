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
import { 
  hasCertificationStatus, 
  setBrandCertification, 
  removeBrandCertification,
  getCertifiedBrandSmallLogo,
  getCertifiedBrandFullLogo
} from '../utils/certificationStatus'
import { CreateBrandModal, CreateFeatureFlagModal, CreateCourseModal, CreateLessonModal, CreateDLCPackModal } from './admin/CreateModals'
import { EditAmplifierModal, EditPedalModal, EditPresetModal, EditDLCPackModal, EditFeatureFlagModal } from './admin/EditModals'
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
  const [editingPack, setEditingPack] = useState<DLCPack | null>(null)
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
    <div className="h-full flex flex-col bg-[color:var(--neu-bg)]">
 {/* Header */}
 <div className="bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] p-6 shadow-lg">
 <div className="flex items-center gap-3">
 <Shield size={32} />
 <div>
 <h1 className="text-2xl font-bold">Panneau d'Administration</h1>
 <p className="text-[var(--td-on-primary)] opacity-90 text-sm">Gestion complète de WebAmp</p>
 </div>
 </div>
 </div>

 <div className="flex-1 flex overflow-hidden">
 {/* Sidebar */}
        <div className="w-64 bg-[color:var(--neu-bg-track)] border-r border-[color:var(--neu-edge)] overflow-y-auto">
 <nav className="p-4 space-y-2">
 {sections.map((section) => {
 const Icon = section.icon
 const isActive = activeSection === section.id
 return (
 <button
 key={section.id}
 onClick={() => setActiveSection(section.id)}
 className={`
 w-full flex items-center gap-3 px-4 py-3 rounded-[var(--td-radius-control)] transition-all
 ${isActive
 ? 'bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] shadow-md'
                      : 'neu-inset text-[color:var(--neu-text-muted)] hover:bg-[color:var(--neu-bg-hollow)]'
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
 <div className="flex-1 overflow-y-auto p-6 pb-24">
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
  const [refreshKey, setRefreshKey] = useState(0)

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
          <h2 className="text-2xl font-bold text-[color:var(--neu-text)]">Marques ({brandsFromProducts.length})</h2>
 <button 
 className="px-4 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110"
 onClick={() => {
 setEditingBrand(null)
 setShowCreateModal(true)
 }}
 >
 + Ajouter
 </button>
 </div>
 <div className="neu-flat rounded-[var(--td-radius-control)] shadow overflow-hidden">
 {brandsFromProducts.length === 0 ? (
            <div className="p-8 text-center text-[color:var(--neu-text-muted)]">
 Aucune marque trouvée dans les amplis et pédales.
 </div>
 ) : (
 <table className="w-full">
              <thead className="bg-[color:var(--neu-bg-track)]">
 <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Logo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Amplis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Pédales</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Certification</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Actions</th>
 </tr>
 </thead>
              <tbody className="divide-y divide-[color:var(--neu-edge)]">
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
                                  <div className="h-12 w-12 flex items-center justify-center bg-[color:var(--neu-bg-track)] rounded text-xs text-[color:var(--neu-text-muted)]">
 {brandProduct.name.charAt(0).toUpperCase()}
 </div>
 )}
 </>
 )
 })()}
 </div>
 </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[color:var(--neu-text)]">{brandProduct.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">
 <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium">
 {brandProduct.amplifierCount}
 </span>
 </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">
 <span className="px-2 py-1 bg-[color-mix(in_srgb,var(--td-accent)_14%,transparent)] text-[var(--td-accent-text)] dark:text-[var(--td-accent)] rounded-full text-xs font-medium">
 {brandProduct.pedalCount}
 </span>
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 {(() => {
 const isCertified = hasCertificationStatus(brandProduct.name)
 const brandLogosData = getBrandLogos(brandProduct.name)
 const smallLogo = getBrandLogoSmall(brandProduct.name) || brandLogosData.small
 const fullLogo = brandLogosData.normal
 
 const handleToggleChange = (checked: boolean) => {
 if (checked) {
 // Activer la certification
 if (smallLogo && fullLogo) {
 setBrandCertification(brandProduct.name, smallLogo, fullLogo)
 showToast({
 variant: 'success',
 title: 'Certification activée',
 message: `La marque "${brandProduct.name}" est maintenant certifiée.`
 })
 // Forcer le re-render
 setRefreshKey(prev => prev + 1)
 } else {
 showToast({
 variant: 'error',
 title: 'Erreur',
 message: `Les logos pour "${brandProduct.name}" ne sont pas disponibles.`
 })
 }
 } else {
 // Désactiver la certification
 removeBrandCertification(brandProduct.name)
 showToast({
 variant: 'success',
 title: 'Certification désactivée',
 message: `La certification de "${brandProduct.name}" a été retirée.`
 })
 // Forcer le re-render
 setRefreshKey(prev => prev + 1)
 }
 }
 
 return (
 <Toggle
 checked={isCertified}
 onChange={handleToggleChange}
 labelLeft="Non"
 labelRight="Oui"
 mode="onoff"
 />
 )
 })()}
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
 className="text-[var(--td-danger)] hover:text-[var(--td-danger)] dark:hover:text-[var(--td-danger)]"
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
  const [editingAmplifier, setEditingAmplifier] = useState<SupabaseAmplifier | null>(null)

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
          <h2 className="text-2xl font-bold text-[color:var(--neu-text)]">Amplis ({amplifiers.length})</h2>
 <button 
 className="px-4 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110"
 onClick={() => setShowCreateModal(true)}
 >
 + Ajouter
 </button>
 </div>
 <div className="neu-flat rounded-[var(--td-radius-control)] shadow overflow-hidden">
 {amplifiers.length === 0 ? (
          <div className="p-8 text-center text-[color:var(--neu-text-muted)]">
 Aucun ampli enregistré.
 </div>
 ) : (
 <table className="w-full">
            <thead className="bg-[color:var(--neu-bg-track)]">
 <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Marque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Modèle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Actions</th>
 </tr>
 </thead>
            <tbody className="divide-y divide-[color:var(--neu-edge)]">
 {amplifiers.map((amp) => (
 <tr key={amp.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[color:var(--neu-text)]">{amp.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">{amp.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">{amp.type}</td>
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
 className="text-[var(--td-danger)] hover:text-[var(--td-danger)] dark:hover:text-[var(--td-danger)]"
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
        <div className="text-center text-[color:var(--neu-text-muted)] py-8">
 La création d'amplis nécessite une configuration complexe (paramètres, style, etc.).<br />
 Utilisez le script de seed pour ajouter des amplis depuis les fichiers de données.
 </div>
 </Modal>
 <EditAmplifierModal
 isOpen={editingAmplifier !== null}
 onClose={() => setEditingAmplifier(null)}
 onSuccess={() => {
 onRefresh()
 setEditingAmplifier(null)
 }}
 amplifier={editingAmplifier}
 />
 </>
  )
}

function PedalsSection({ pedals, onRefresh }: { pedals: SupabasePedal[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPedal, setEditingPedal] = useState<SupabasePedal | null>(null)

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
          <h2 className="text-2xl font-bold text-[color:var(--neu-text)]">Pédales ({pedals.length})</h2>
 <button 
 className="px-4 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110"
 onClick={() => setShowCreateModal(true)}
 >
 + Ajouter
 </button>
 </div>
 <div className="neu-flat rounded-[var(--td-radius-control)] shadow overflow-hidden">
 {pedals.length === 0 ? (
          <div className="p-8 text-center text-[color:var(--neu-text-muted)]">
 Aucune pédale enregistrée.
 </div>
 ) : (
 <table className="w-full">
            <thead className="bg-[color:var(--neu-bg-track)]">
 <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Marque</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Modèle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Actions</th>
 </tr>
 </thead>
            <tbody className="divide-y divide-[color:var(--neu-edge)]">
 {pedals.map((pedal) => (
 <tr key={pedal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[color:var(--neu-text)]">{pedal.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">{pedal.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">{pedal.type}</td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 <div className="flex items-center gap-2">
 <CTA
 variant="icon-only"
 icon={<Edit size={18} />}
 onClick={() => setEditingPedal(pedal)}
 title="Modifier"
 />
 <CTA
 variant="icon-only"
 icon={<Trash2 size={18} />}
 onClick={() => handleDelete(pedal.id, pedal.brand, pedal.model)}
 title="Supprimer"
 className="text-[var(--td-danger)] hover:text-[var(--td-danger)] dark:hover:text-[var(--td-danger)]"
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
        <div className="text-center text-[color:var(--neu-text-muted)] py-8">
 <p className="mb-4">
 La création de pédales nécessite une configuration complexe (paramètres, types, etc.).<br />
 Utilisez le script de seed pour ajouter des pédales depuis les fichiers de données.
 </p>
 <button
 onClick={() => setShowCreateModal(false)}
 className="px-6 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110 transition-colors"
 >
 Fermer
 </button>
 </div>
 </Modal>
 <EditPedalModal
 isOpen={editingPedal !== null}
 onClose={() => setEditingPedal(null)}
 onSuccess={() => {
 onRefresh()
 setEditingPedal(null)
 }}
 pedal={editingPedal}
 />
 </>
  )
}

function PresetsSection({ presets, onRefresh }: { presets: Preset[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null)

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
          <h2 className="text-2xl font-bold text-[color:var(--neu-text)]">Configurations ({presets.length})</h2>
 <button 
 className="px-4 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110"
 onClick={() => setShowCreateModal(true)}
 >
 + Ajouter
 </button>
 </div>
 <div className="neu-flat rounded-[var(--td-radius-control)] shadow overflow-hidden">
 {presets.length === 0 ? (
          <div className="p-8 text-center text-[color:var(--neu-text-muted)]">
 Aucun preset enregistré.
 </div>
 ) : (
 <table className="w-full">
            <thead className="bg-[color:var(--neu-bg-track)]">
 <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Public</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Actions</th>
 </tr>
 </thead>
            <tbody className="divide-y divide-[color:var(--neu-edge)]">
 {presets.map((preset) => (
 <tr key={preset.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[color:var(--neu-text)]">{preset.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">
 {preset.is_public ? 'Oui' : 'Non'}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 <div className="flex items-center gap-2">
 <CTA
 variant="icon-only"
 icon={<Edit size={18} />}
 onClick={() => setEditingPreset(preset)}
 title="Modifier"
 />
 <CTA
 variant="icon-only"
 icon={<Trash2 size={18} />}
 onClick={() => handleDelete(preset.id, preset.name)}
 title="Supprimer"
 className="text-[var(--td-danger)] hover:text-[var(--td-danger)] dark:hover:text-[var(--td-danger)]"
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
        <div className="text-center text-[color:var(--neu-text-muted)] py-8">
 <p className="mb-4">
 La création de presets nécessite une configuration complexe (chaîne d'effets, paramètres, etc.).<br />
 Utilisez l'interface WebAmp pour créer et sauvegarder des presets.
 </p>
 <button
 onClick={() => setShowCreateModal(false)}
 className="px-6 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110 transition-colors"
 >
 Fermer
 </button>
 </div>
 </Modal>
 <EditPresetModal
 isOpen={editingPreset !== null}
 onClose={() => setEditingPreset(null)}
 onSuccess={() => {
 onRefresh()
 setEditingPreset(null)
 }}
 preset={editingPreset}
 />
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
 
 // Attendre entre chaque optimisation pour respecter les limites de l'API Gemini
 // Le rate limiter du service gère déjà les délais, mais on ajoute un délai supplémentaire
 // pour être sûr de ne pas dépasser les limites (60 req/min pour l'API gratuite)
 if (i < coursesToOptimize.length - 1) {
 // Délai de 2 secondes pour respecter la limite de 30 req/min maximum
 await new Promise(resolve => setTimeout(resolve, 2000))
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
        <span className="px-2 py-1 text-xs rounded-full bg-[color:var(--neu-bg-track)] text-[color:var(--neu-text-muted)]">
 Calcul...
 </span>
 )
 }

 if (!score) {
 return (
        <span className="px-2 py-1 text-xs rounded-full bg-[color:var(--neu-bg-track)] text-[color:var(--neu-text-muted)]">
 N/A
 </span>
 )
 }

 const color = getScoreColor(score.totalScore)
 const bgColor = color === 'red' 
 ? 'bg-[var(--td-danger)] text-[var(--td-danger)] '
 : color === 'orange'
 ? 'bg-[color:var(--neu-accent-soft)] text-orange-800 '
 : 'bg-[var(--td-success)] text-[var(--td-success)] '

 return (
 <span className={`px-2 py-1 text-xs font-medium rounded-full ${bgColor}`} title={`Qualité: ${score.breakdown.quality}%, Longueur: ${score.breakdown.length}%, Pertinence: ${score.breakdown.relevance}%, Structure: ${score.breakdown.structure}%, Engagement: ${score.breakdown.engagement}%, Expression clé: ${score.breakdown.keyword}%, Médias: ${score.breakdown.media}%${score.keyword ? ` (Clé: "${score.keyword}")` : ''}`}>
 {score.totalScore}%
 </span>
 )
  }


  // Calculer les compteurs par catégorie de score
  const scoreCounts = React.useMemo(() => {
 let red = 0 // < 70%
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
            <h2 className="text-2xl font-bold text-[color:var(--neu-text)]">Cours ({courses.length})</h2>
 <div className="flex items-center gap-3">
 <div className="flex items-center gap-1.5">
 <div className="w-3 h-3 rounded-full bg-[var(--td-danger)]"></div>
                <span className="text-sm font-medium text-[color:var(--neu-text-muted)]">{scoreCounts.red}</span>
 </div>
 <div className="flex items-center gap-1.5">
 <div className="w-3 h-3 rounded-full bg-[color:var(--neu-accent)]"></div>
                <span className="text-sm font-medium text-[color:var(--neu-text-muted)]">{scoreCounts.orange}</span>
 </div>
 <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[color:var(--td-success)]"></div>
                <span className="text-sm font-medium text-[color:var(--neu-text-muted)]">{scoreCounts.green}</span>
 </div>
 </div>
 </div>
 <div className="flex gap-2">
 <button 
 className="px-4 py-2 neu-accent-btn rounded-[var(--td-radius-control)] font-semibold hover:opacity-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
 className="px-4 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110"
 onClick={() => {
 setEditingCourse(null)
 setShowCreateModal(true)
 }}
 >
 + Ajouter un cours
 </button>
 </div>
 </div>
 <div className="neu-flat rounded-[var(--td-radius-control)] shadow overflow-hidden">
 {courses.length === 0 ? (
          <div className="p-8 text-center text-[color:var(--neu-text-muted)]">
 Aucun cours enregistré.
 </div>
 ) : (
 <table className="w-full">
            <thead className="bg-[color:var(--neu-bg-track)]">
 <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Publié</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Actions</th>
 </tr>
 </thead>
            <tbody className="divide-y divide-[color:var(--neu-edge)]">
 {courses.map((course) => {
 const score = courseScores.get(course.id)
 const isLoading = loadingScores.has(course.id)
 const isOptimizing = optimizingCourse === course.id
 const isCurrentlyOptimizing = optimizationProgress?.currentCourseTitle === course.title

 return (
 <tr key={course.id}>
                    <td className="px-6 py-4 text-sm font-medium text-[color:var(--neu-text)]">{course.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">
 <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
 {course.type === 'quiz' ? 'Quiz' : course.type === 'tutorial' ? 'Tutoriel' : course.type === 'guide' ? 'Guide' : course.type === 'preset' ? 'Preset' : course.type}
 </span>
 </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">{course.category}</td>
 <td className="px-6 py-4 whitespace-nowrap">
 {getScoreBadge(score, isLoading)}
 </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">
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
 onClick={() => setEditingCourse(course)}
 title="Modifier"
 />
 <CTA
 variant="icon-only"
 icon={<Trash2 size={18} />}
 onClick={() => handleDelete(course.id, course.title)}
 title="Supprimer"
 className="text-[var(--td-danger)] hover:text-[var(--td-danger)] dark:hover:text-[var(--td-danger)]"
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
 <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[var(--td-radius-control)] p-4">
 <div className="flex items-center justify-between mb-2">
 <span className="font-medium text-blue-900 dark:text-blue-100">Score actuel</span>
 <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
 {showOptimizationModal.result.originalScore}%
 </span>
 </div>
 <div className="flex items-center justify-between">
 <span className="font-medium text-[var(--td-success)] ">Score estimé après optimisation</span>
 <span className="text-2xl font-bold text-[var(--td-success)] ">
 {showOptimizationModal.result.estimatedNewScore}%
 </span>
 </div>
 </div>

 <div>
              <h3 className="font-semibold text-[color:var(--neu-text)] mb-3">Modifications proposées</h3>
 <ul className="space-y-2">
 {showOptimizationModal.result.changes.map((change, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[color:var(--neu-text-muted)]">
 <span className="text-[var(--td-success)] mt-1">•</span>
 <span>{change}</span>
 </li>
 ))}
 </ul>
 </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-[color:var(--neu-edge)]">
 <button
 onClick={() => setShowOptimizationModal(null)}
                className="px-4 py-2 text-[color:var(--neu-text-muted)] bg-[color:var(--neu-bg-track)] rounded-[var(--td-radius-control)] hover:bg-[color:var(--neu-bg-hollow)]"
 >
 Annuler
 </button>
 <button
 onClick={handleApplyOptimization}
                className="px-4 py-2 bg-[color:var(--td-success)] text-white rounded-[var(--td-radius-control)] hover:bg-[var(--td-success)]"
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
 <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[var(--td-radius-control)] p-4">
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
            <div className="bg-[color:var(--neu-bg-track)] rounded-[var(--td-radius-control)] p-4">
 <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[color:var(--neu-text-muted)]">
 Progression
 </span>
                <span className="text-sm text-[color:var(--neu-text-muted)]">
 {optimizationProgress.current} / {optimizationProgress.total}
 </span>
 </div>
              <div className="w-full bg-[color:var(--neu-bg-hollow)] rounded-full h-3">
 <div
                  className="bg-[color:var(--neu-accent)] h-3 rounded-full transition-all duration-300"
 style={{ width: `${Math.min((optimizationProgress.current / optimizationProgress.total) * 100, 100)}%` }}
 />
 </div>
 {optimizationProgress.currentCourseTitle && optimizationProgress.current < optimizationProgress.total && (
                <p className="text-xs text-[color:var(--neu-text-muted)] mt-2">
 Traitement en cours : <strong>{optimizationProgress.currentCourseTitle}</strong>
 </p>
 )}
 {optimizationProgress.current >= optimizationProgress.total && (
 <div className="mt-3 p-3 bg-[var(--td-success)] border border-[var(--td-success)] rounded-[var(--td-radius-control)]">
 <p className="text-sm font-medium text-[var(--td-success)] ">
 ✓ Optimisation terminée !
 </p>
 </div>
 )}
 {(optimizationProgress.success > 0 || optimizationProgress.errors > 0) && (
 <div className="flex gap-4 mt-3 text-xs">
 <span className="text-[var(--td-success)] font-medium">
 ✓ {optimizationProgress.success} succès
 </span>
 {optimizationProgress.errors > 0 && (
 <span className="text-[var(--td-danger)] font-medium">
 ✗ {optimizationProgress.errors} erreurs
 </span>
 )}
 </div>
 )}
 </div>
 ) : (
            <div className="bg-[color:var(--neu-bg-track)] rounded-[var(--td-radius-control)] p-4">
              <p className="text-sm text-[color:var(--neu-text-muted)]">
 Cliquez sur "Démarrer l'optimisation" pour commencer le traitement des cours.
 </p>
 </div>
 )}

          <div className="flex gap-3 justify-end pt-4 border-t border-[color:var(--neu-edge)]">
 <button
 onClick={() => {
 setShowBulkOptimizationModal(false)
 setOptimizationProgress(null)
 }}
              className="px-4 py-2 text-[color:var(--neu-text-muted)] bg-[color:var(--neu-bg-track)] rounded-[var(--td-radius-control)] hover:bg-[color:var(--neu-bg-hollow)] disabled:opacity-50 disabled:cursor-not-allowed"
 disabled={optimizationProgress !== null && optimizationProgress.current > 0 && optimizationProgress.current < optimizationProgress.total}
 >
 {optimizationProgress && optimizationProgress.current >= optimizationProgress.total ? 'Fermer' : 'Annuler'}
 </button>
 {(!optimizationProgress || optimizationProgress.current < optimizationProgress.total) && (
 <button
 onClick={handleStartBulkOptimization}
 disabled={optimizationProgress !== null && optimizationProgress.current > 0}
 className="px-4 py-2 neu-accent-btn rounded-[var(--td-radius-control)] font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
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
        <span className="px-2 py-1 text-xs rounded-full bg-[color:var(--neu-bg-track)] text-[color:var(--neu-text-muted)]">
 Calcul...
 </span>
 )
 }

 if (!score) {
 return (
        <span className="px-2 py-1 text-xs rounded-full bg-[color:var(--neu-bg-track)] text-[color:var(--neu-text-muted)]">
 N/A
 </span>
 )
 }

 const color = getScoreColor(score.totalScore)
 const bgColor = color === 'red' 
 ? 'bg-[var(--td-danger)] text-[var(--td-danger)] '
 : color === 'orange'
 ? 'bg-[color:var(--neu-accent-soft)] text-orange-800 '
 : 'bg-[var(--td-success)] text-[var(--td-success)] '

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
          <h2 className="text-2xl font-bold text-[color:var(--neu-text)]">Leçons ({lessons.length})</h2>
 <button 
 className="px-4 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110"
 onClick={() => setShowCreateModal(true)}
 >
 + Ajouter
 </button>
 </div>
 <div className="neu-flat rounded-[var(--td-radius-control)] shadow overflow-hidden">
 {lessons.length === 0 ? (
          <div className="p-8 text-center text-[color:var(--neu-text-muted)]">
 Aucune leçon enregistrée.
 </div>
 ) : (
 <table className="w-full">
            <thead className="bg-[color:var(--neu-bg-track)]">
 <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Titre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Cours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Actions</th>
 </tr>
 </thead>
            <tbody className="divide-y divide-[color:var(--neu-edge)]">
 {lessons.map((lesson) => {
 const score = lessonScores.get(lesson.id)
 const isLoading = loadingScores.has(lesson.id)
 const course = coursesMap.get(lesson.course_id)

 return (
 <tr key={lesson.id}>
                    <td className="px-6 py-4 text-sm font-medium text-[color:var(--neu-text)]">{lesson.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">
 {course?.title || lesson.course_id}
 </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">{lesson.content_type}</td>
 <td className="px-6 py-4 whitespace-nowrap">
 {getLessonScoreBadge(score, isLoading)}
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 <div className="flex items-center gap-2">
 <CTA
 variant="icon-only"
 icon={<Edit size={18} />}
 onClick={() => setEditingLesson(lesson)}
 title="Modifier"
 />
 <CTA
 variant="icon-only"
 icon={<Trash2 size={18} />}
 onClick={() => handleDelete(lesson.id, lesson.title)}
 title="Supprimer"
 className="text-[var(--td-danger)] hover:text-[var(--td-danger)] dark:hover:text-[var(--td-danger)]"
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
 <CreateLessonModal 
 isOpen={showCreateModal || editingLesson !== null} 
 onClose={() => {
 setShowCreateModal(false)
 setEditingLesson(null)
 }} 
 onSuccess={() => {
 onRefresh()
 setEditingLesson(null)
 }} 
 courses={availableCourses}
 editingLesson={editingLesson}
 />
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
  const [editingPack, setEditingPack] = useState<DLCPack | null>(null)
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
        <h2 className="text-2xl font-bold text-[color:var(--neu-text)]">Packs ({packs.length})</h2>
 <button 
 className="px-4 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110"
 onClick={() => setShowCreateModal(true)}
 >
 + Ajouter
 </button>
 </div>
 <div className="neu-flat rounded-[var(--td-radius-control)] shadow overflow-hidden">
 {packs.length === 0 ? (
          <div className="p-8 text-center text-[color:var(--neu-text-muted)]">
 Aucun pack enregistré.
 </div>
 ) : (
 <table className="w-full">
            <thead className="bg-[color:var(--neu-bg-track)]">
 <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Cours</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Actions</th>
 </tr>
 </thead>
            <tbody className="divide-y divide-[color:var(--neu-edge)]">
 {packs.map((pack) => {
 const courses = packCourses.get(pack.id) || []
 const isExpanded = expandedPack === pack.id
 const isLoading = loadingCourses.has(pack.id)

 return (
 <React.Fragment key={pack.id}>
                    <tr className="hover:bg-[color:var(--neu-bg-track)]">
                      <td className="px-6 py-4 text-sm font-medium text-[color:var(--neu-text)]">{pack.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">{pack.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">
 {pack.price} {pack.currency}
 </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)]">
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
 onClick={() => setEditingPack(pack)}
 title="Modifier"
 />
 <CTA
 variant="icon-only"
 icon={<Trash2 size={18} />}
 onClick={() => handleDelete(pack.id, pack.name)}
 title="Supprimer"
 className="text-[var(--td-danger)] hover:text-[var(--td-danger)] dark:hover:text-[var(--td-danger)]"
 />
 </div>
 </td>
 </tr>
 {isExpanded && (
 <tr>
                        <td colSpan={5} className="px-6 py-4 bg-[color:var(--neu-bg-track)]">
 {isLoading ? (
 <div className="flex items-center justify-center py-4">
 <Loader size="sm" variant="light" showText={false} />
 </div>
 ) : courses.length === 0 ? (
                            <div className="text-center text-[color:var(--neu-text-muted)] py-4">
 Aucun cours lié à ce pack.
 </div>
 ) : (
 <div className="space-y-2">
                              <h4 className="font-semibold text-sm text-[color:var(--neu-text-muted)] mb-3">
 Cours liés ({courses.length})
 </h4>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
 {courses.map((course) => (
 <div
 key={course.id}
                                    className="neu-flat p-4 rounded-[var(--td-radius-control)] border border-[color:var(--neu-edge)] flex items-start justify-between"
 >
 <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-sm text-[color:var(--neu-text)] truncate">
 {course.title}
 </h5>
                                      <p className="text-xs text-[color:var(--neu-text-muted)] mt-1">
 {course.category} • {course.difficulty}
 </p>
 {course.description && (
                                        <p className="text-xs text-[color:var(--neu-text-faint)] mt-2 line-clamp-2">
 {course.description}
 </p>
 )}
 <div className="flex items-center gap-2 mt-2">
 <span className={`text-xs px-2 py-1 rounded ${
 course.is_published
 ? 'bg-[var(--td-success)] text-[var(--td-success)] '
                                            : 'bg-[color:var(--neu-bg-track)] text-[color:var(--neu-text)]'
 }`}>
 {course.is_published ? 'Publié' : 'Brouillon'}
 </span>
 {course.is_premium && (
 <span className="text-xs px-2 py-1 rounded bg-[color:var(--neu-accent-soft)] text-orange-800 ">
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
 className="text-[var(--td-danger)] hover:text-[var(--td-danger)] dark:hover:text-[var(--td-danger)] ml-2 flex-shrink-0"
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
            <div className="text-center text-[color:var(--neu-text-muted)] py-8">
 Tous les cours sont déjà liés à ce pack.
 </div>
 ) : (
 <div className="space-y-2">
 {availableCourses.map((course) => (
 <div
 key={`available-${course.id}`}
                  className="neu-flat p-4 rounded-[var(--td-radius-control)] border border-[color:var(--neu-edge)] flex items-start justify-between hover:bg-[color:var(--neu-bg-track)]"
 >
 <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm text-[color:var(--neu-text)]">
 {course.title}
 </h5>
                    <p className="text-xs text-[color:var(--neu-text-muted)] mt-1">
 {course.category} • {course.difficulty}
 </p>
 {course.description && (
                      <p className="text-xs text-[color:var(--neu-text-faint)] mt-2 line-clamp-2">
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
 <EditDLCPackModal
 isOpen={editingPack !== null}
 onClose={() => setEditingPack(null)}
 onSuccess={() => {
 onRefresh()
 setEditingPack(null)
 }}
 pack={editingPack}
 />
 </div>
  )
}

function FeaturesSection({ flags, onRefresh }: { flags: FeatureFlag[]; onRefresh: () => void }) {
  const { showToast } = useToast()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingFlag, setEditingFlag] = useState<FeatureFlag | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  // Mapping des clés de feature flags vers des noms lisibles pour les pages
  const pageNames: Record<string, string> = {
 'page_looper': 'Looper',
 'page_practice': 'Pratique',
 'page_learn': 'Apprendre',
 'page_mixing': 'Mixage',
 'page_drummachine': 'Boîte à rythmes',
 'page_gallery': 'Gallery',
 'page_daw': 'Studio (DAW)'
  }

  // Pages prédéfinies à initialiser
  const predefinedPages = [
 { key: 'page_looper', name: 'Looper', description: 'Page du looper' },
 { key: 'page_practice', name: 'Pratique', description: 'Page de pratique' },
 { key: 'page_learn', name: 'Apprendre', description: 'Page d\'apprentissage' },
 { key: 'page_mixing', name: 'Mixage', description: 'Page de mixage' },
 { key: 'page_drummachine', name: 'Boîte à rythmes', description: 'Page de la boîte à rythmes' },
 { key: 'page_gallery', name: 'Gallery', description: 'Page de la galerie de presets' },
 { key: 'page_daw', name: 'Studio (DAW)', description: 'Page du Digital Audio Workstation' }
  ]

  // Séparer les flags de pages des autres flags
  const pageFlags = flags.filter(flag => flag.key.startsWith('page_'))
  const otherFlags = flags.filter(flag => !flag.key.startsWith('page_'))

  // Trouver les pages manquantes
  const existingPageKeys = new Set(pageFlags.map(flag => flag.key))
  const missingPages = predefinedPages.filter(page => !existingPageKeys.has(page.key))

  // Initialiser une page manquante individuelle
  const initializePage = async (pageKey: string) => {
 const page = predefinedPages.find(p => p.key === pageKey)
 if (!page) return

 try {
 await adminService.createFeatureFlag({
 key: page.key,
 name: page.name,
 description: page.description,
 enabled: false,
 value: null
 })
 showToast({
 variant: 'success',
 title: 'Page initialisée',
 message: `${page.name} a été créée. Activez-la pour l’afficher.`
 })
 onRefresh()
 } catch (error) {
 logger.error(`Erreur lors de la création du feature flag ${page.key}`, error)
 showToast({
 variant: 'error',
 title: 'Erreur',
 message: `Impossible de créer la page ${page.name}.`
 })
 }
  }

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
          <h2 className="text-2xl font-bold text-[color:var(--neu-text)]">Fonctionnalités ({flags.length})</h2>
 <button 
 className="px-4 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110"
 onClick={() => setShowCreateModal(true)}
 >
 + Ajouter
 </button>
 </div>
 <div className="space-y-6">
 {/* Section Pages */}
 <div className="neu-flat rounded-[var(--td-radius-control)] shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-[color:var(--neu-edge)] flex justify-between items-center">
 <div>
                <h3 className="text-lg font-semibold text-[color:var(--neu-text)]">Pages</h3>
                <p className="text-sm text-[color:var(--neu-text-muted)] mt-1">Activez ou désactivez les pages de l'application</p>
 </div>
 {missingPages.length > 0 && (
 <button
 onClick={initializeMissingPages}
 disabled={isInitializing}
 className="px-4 py-2 neu-accent-btn rounded-[var(--td-radius-control)] font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
 >
 {isInitializing ? 'Initialisation...' : `Initialiser les pages manquantes (${missingPages.length})`}
 </button>
 )}
 </div>
 {pageFlags.length === 0 ? (
              <div className="p-8 text-center text-[color:var(--neu-text-muted)]">
 <p className="mb-4">Aucune page configurée.</p>
 {missingPages.length > 0 && (
 <button
 onClick={initializeMissingPages}
 disabled={isInitializing}
 className="px-4 py-2 neu-accent-btn rounded-[var(--td-radius-control)] font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {isInitializing ? 'Initialisation...' : `Initialiser ${missingPages.length} page(s)`}
 </button>
 )}
 </div>
 ) : (
 <table className="w-full">
                <thead className="bg-[color:var(--neu-bg-track)]">
 <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Page</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Clé</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">État</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Actions</th>
 </tr>
 </thead>
                <tbody className="divide-y divide-[color:var(--neu-edge)]">
 {/* Pages existantes */} 
 {pageFlags.map((flag) => (
 <tr key={flag.id}>
                      <td className="px-6 py-4 text-sm font-medium text-[color:var(--neu-text)]">
 {pageNames[flag.key] || flag.name}
 </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)] font-mono">{flag.key}</td>
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
 onClick={() => setEditingFlag(flag)}
 title="Modifier"
 />
 <CTA
 variant="icon-only"
 icon={<Trash2 size={18} />}
 onClick={() => handleDelete(flag.id, flag.name)}
 title="Supprimer"
 className="text-[var(--td-danger)] hover:text-[var(--td-danger)] dark:hover:text-[var(--td-danger)]"
 />
 </div>
 </td>
 </tr>
 ))}

 {/* Pages manquantes (non initialisées) */}
 {missingPages.map(page => (
 <tr key={page.key} className="bg-[var(--td-warning)]/40 ">
                      <td className="px-6 py-4 text-sm font-medium text-[color:var(--neu-text)]">
 {page.name}
 </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)] font-mono">{page.key}</td>
 <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--td-warning)] ">
 À initialiser
 </td>
 <td className="px-6 py-4 whitespace-nowrap text-sm">
 <CTA
 variant="secondary"
 onClick={() => initializePage(page.key)}
 title="Initialiser cette page"
 >
 Initialiser
 </CTA>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 )}
 </div>

 {/* Section Autres fonctionnalités */}
 <div className="neu-flat rounded-[var(--td-radius-control)] shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-[color:var(--neu-edge)]">
              <h3 className="text-lg font-semibold text-[color:var(--neu-text)]">
 Autres fonctionnalités
                {pageFlags.length > 0 && <span className="text-sm font-normal text-[color:var(--neu-text-muted)] ml-2">({otherFlags.length})</span>}
 </h3>
 </div>
 {otherFlags.length === 0 && pageFlags.length === 0 ? (
              <div className="p-8 text-center text-[color:var(--neu-text-muted)]">
 Aucune fonctionnalité configurée. Créez-en une pour commencer.
 </div>
 ) : otherFlags.length === 0 ? (
              <div className="p-8 text-center text-[color:var(--neu-text-muted)]">
 Aucune autre fonctionnalité configurée.
 </div>
 ) : (
 <table className="w-full">
                <thead className="bg-[color:var(--neu-bg-track)]">
 <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Clé</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">État</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[color:var(--neu-text-muted)] uppercase">Actions</th>
 </tr>
 </thead>
                <tbody className="divide-y divide-[color:var(--neu-edge)]">
 {otherFlags.map((flag) => (
 <tr key={flag.id}>
                      <td className="px-6 py-4 text-sm font-medium text-[color:var(--neu-text)]">{flag.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--neu-text-muted)] font-mono">{flag.key}</td>
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
 onClick={() => setEditingFlag(flag)}
 title="Modifier"
 />
 <CTA
 variant="icon-only"
 icon={<Trash2 size={18} />}
 onClick={() => handleDelete(flag.id, flag.name)}
 title="Supprimer"
 className="text-[var(--td-danger)] hover:text-[var(--td-danger)] dark:hover:text-[var(--td-danger)]"
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
 <EditFeatureFlagModal
 isOpen={editingFlag !== null}
 onClose={() => setEditingFlag(null)}
 onSuccess={() => {
 onRefresh()
 setEditingFlag(null)
 }}
 flag={editingFlag}
 />
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
 <div className="bg-[var(--td-warning)] border border-yellow-200 rounded-[var(--td-radius-control)] p-4">
 <p className="text-[var(--td-warning)] ">
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
          <h2 className="text-2xl font-bold text-[color:var(--neu-text)]">Analytics</h2>
          <p className="text-sm text-[color:var(--neu-text-muted)] mt-1">
 Statistiques d'audience et d'utilisation (cookieless)
 </p>
 </div>
 <div className="flex gap-2">
 <select
 value={selectedPeriod}
 onChange={(e) => setSelectedPeriod(e.target.value as '7d' | '30d' | 'all')}
            className="px-3 py-2 border border-[color:var(--neu-edge)] rounded-[var(--td-radius-control)] neu-inset text-[color:var(--neu-text)]"
 >
 <option value="7d">7 derniers jours</option>
 <option value="30d">30 derniers jours</option>
 <option value="all">Tout</option>
 </select>
 <button
 onClick={handleExportData}
 className="px-4 py-2 neu-accent-btn rounded-[var(--td-radius-control)] font-semibold hover:opacity-95 transition-colors"
 >
 Exporter
 </button>
 <button
 onClick={handleClearData}
 className="px-4 py-2 bg-[var(--td-accent-strong)] text-[var(--td-on-primary)] rounded-[var(--td-radius-control)] hover:brightness-110 transition-colors"
 >
 Effacer
 </button>
 <button
 onClick={loadStats}
            className="px-4 py-2 neu-flat text-[color:var(--neu-text)] rounded-[var(--td-radius-control)] hover:bg-[color:var(--neu-bg-hollow)] transition-colors"
 >
 Actualiser
 </button>
 </div>
 </div>

 {/* Statistiques principales */}
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neu-flat rounded-[var(--td-radius-control)] p-4 border border-[color:var(--neu-edge)]">
          <div className="text-sm text-[color:var(--neu-text-muted)]">Sessions totales</div>
          <div className="text-2xl font-bold text-[color:var(--neu-text)] mt-1">
 {stats.totalSessions.toLocaleString()}
 </div>
 </div>
        <div className="neu-flat rounded-[var(--td-radius-control)] p-4 border border-[color:var(--neu-edge)]">
          <div className="text-sm text-[color:var(--neu-text-muted)]">Vues de pages</div>
          <div className="text-2xl font-bold text-[color:var(--neu-text)] mt-1">
 {stats.totalPageViews.toLocaleString()}
 </div>
 </div>
        <div className="neu-flat rounded-[var(--td-radius-control)] p-4 border border-[color:var(--neu-edge)]">
          <div className="text-sm text-[color:var(--neu-text-muted)]">Événements</div>
          <div className="text-2xl font-bold text-[color:var(--neu-text)] mt-1">
 {stats.totalEvents.toLocaleString()}
 </div>
 </div>
        <div className="neu-flat rounded-[var(--td-radius-control)] p-4 border border-[color:var(--neu-edge)]">
          <div className="text-sm text-[color:var(--neu-text-muted)]">Utilisateurs uniques</div>
          <div className="text-2xl font-bold text-[color:var(--neu-text)] mt-1">
 {stats.uniqueUsers.toLocaleString()}
 </div>
 </div>
 </div>

 {/* Durée moyenne de session */}
      <div className="neu-flat rounded-[var(--td-radius-control)] p-4 border border-[color:var(--neu-edge)]">
        <div className="text-sm text-[color:var(--neu-text-muted)] mb-2">Durée moyenne de session</div>
        <div className="text-3xl font-bold text-[color:var(--neu-text)]">
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
      <div className="neu-flat rounded-[var(--td-radius-control)] p-6 border border-[color:var(--neu-edge)]">
        <h3 className="text-lg font-semibold text-[color:var(--neu-text)] mb-4">Pages les plus visitées</h3>
 {stats.topPages.length > 0 ? (
 <div className="space-y-2">
 {stats.topPages.map((page: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[color:var(--neu-bg-track)] rounded-[var(--td-radius-control)]">
 <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[color:var(--neu-text-muted)] w-6">
 #{index + 1}
 </span>
                  <span className="text-[color:var(--neu-text)] font-medium">{page.path}</span>
 </div>
                <span className="text-[color:var(--neu-text-muted)] font-semibold">
 {page.views.toLocaleString()} vues
 </span>
 </div>
 ))}
 </div>
 ) : (
          <p className="text-[color:var(--neu-text-muted)]">Aucune donnée disponible</p>
 )}
 </div>

 {/* Top événements */}
      <div className="neu-flat rounded-[var(--td-radius-control)] p-6 border border-[color:var(--neu-edge)]">
        <h3 className="text-lg font-semibold text-[color:var(--neu-text)] mb-4">Événements les plus fréquents</h3>
 {stats.topEvents.length > 0 ? (
 <div className="space-y-2">
 {stats.topEvents.map((event: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[color:var(--neu-bg-track)] rounded-[var(--td-radius-control)]">
 <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-[color:var(--neu-text-muted)] w-6">
 #{index + 1}
 </span>
                  <span className="text-[color:var(--neu-text)] font-medium">{event.name}</span>
 </div>
                <span className="text-[color:var(--neu-text-muted)] font-semibold">
 {event.count.toLocaleString()} fois
 </span>
 </div>
 ))}
 </div>
 ) : (
          <p className="text-[color:var(--neu-text-muted)]">Aucune donnée disponible</p>
 )}
 </div>

 {/* Sessions par jour */}
      <div className="neu-flat rounded-[var(--td-radius-control)] p-6 border border-[color:var(--neu-edge)]">
        <h3 className="text-lg font-semibold text-[color:var(--neu-text)] mb-4">Activité par jour</h3>
 {Object.keys(stats.sessionsByDay).length > 0 ? (
 <div className="space-y-2">
 {Object.entries(stats.sessionsByDay)
 .sort(([a], [b]) => b.localeCompare(a))
 .slice(0, 30)
 .map(([date, count]: [string, any]) => (
                <div key={date} className="flex items-center justify-between p-3 bg-[color:var(--neu-bg-track)] rounded-[var(--td-radius-control)]">
                  <span className="text-[color:var(--neu-text)] font-medium">{formatDate(date)}</span>
                  <span className="text-[color:var(--neu-text-muted)] font-semibold">
 {count.toLocaleString()} événements
 </span>
 </div>
 ))}
 </div>
 ) : (
          <p className="text-[color:var(--neu-text-muted)]">Aucune donnée disponible</p>
 )}
 </div>
 </div>
  )
}

