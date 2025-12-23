import { useState, useEffect, useRef, useCallback } from 'react'
import { TopBanner } from './components/TopBanner'
import { BottomNavigation, PageId } from './components/BottomNavigation'
import { DrumMachinePanel } from './components/drummachine/DrumMachinePanel'
import { RockStarProfilesModal } from './components/RockStarProfilesModal'
import { PartnerThankYouModal } from './components/PartnerThankYouModal'
import { Modal } from './components/Modal'
import { Loader } from './components/Loader'
import { loadProfile, loadProfileSequentially } from './utils/profileLoader'
import { loadTonePackSequentially } from './utils/tonePackLoader'
import { TonePack } from './types/gallery'
import { useToast } from './components/notifications/ToastProvider'
import { PedalboardEngine } from './audio/PedalboardEngine'
import { useAuth } from './auth/AuthProvider'
import { HomePage } from './pages/HomePage'
import { WebAmpPage } from './pages/WebAmpPage'
import { DawPage } from './pages/DawPage'
import { PracticePage } from './pages/PracticePage'
import { LearnPage } from './pages/LearnPage'
import { MixingConsolePage } from './pages/MixingConsolePage'
import { DrumMachinePage } from './pages/DrumMachinePage'
import { GalleryPage } from './pages/GalleryPage'
import { SettingsPage } from './pages/SettingsPage'
import { AccountPage } from './pages/AccountPage'
import { AdminPage } from './pages/AdminPage'
import { useFeatureFlags } from './hooks/useFeatureFlags'
import { useAnalytics } from './hooks/useAnalytics'
import { createLogger } from './services/logger'
import { ADMIN_UUID } from './config/constants'
import { pedalLibrary } from './data/pedals'

const logger = createLogger('App')

function App() {
  const { showToast } = useToast()
  const { user } = useAuth()
  const isAdmin = user?.id === ADMIN_UUID
  const [isLoading, setIsLoading] = useState(true)
  const { isEnabled } = useFeatureFlags()
  const { pageView } = useAnalytics()
  const [currentPage, setCurrentPage] = useState<PageId>('home')
  const [searchQuery, setSearchQuery] = useState('')
  const [librarySearchQuery, setLibrarySearchQuery] = useState('')
  const [autoOpenLibrary, setAutoOpenLibrary] = useState(false)
  const [selectedAmplifier, setSelectedAmplifier] = useState<string | null>(null)
  const [, setAmplifierParameters] = useState<Record<string, number>>({})
  const [currentPedalIds, setCurrentPedalIds] = useState<string[]>([])
  const [showDrumMachineModal, setShowDrumMachineModal] = useState(false)
  const [showProfilesModal, setShowProfilesModal] = useState(false)
  const [showPartnerThankYouModal, setShowPartnerThankYouModal] = useState(false)
  const previousUserRef = useRef<string | null>(null)
  const [stats] = useState({
    cpu: 0,
    latency: 0,
    peakInput: -96,
    peakOutput: -96
  })
  
  const addEffectRef = useRef<((pedalId: string) => void) | null>(null)
  const clearEffectsRef = useRef<(() => void) | null>(null)
  const audioContextResumedRef = useRef(false)
  const engineRef = useRef<PedalboardEngine | null>(null)
  
  const handleProfileSelect = useCallback(async (profileName: string) => {
    const profileResult = loadProfile(profileName)
    if (!profileResult) {
      showToast({
        variant: 'error',
        title: 'Profil introuvable',
        message: 'Le profil demandé est introuvable ou corrompu.'
      })
      return
    }

    if (!clearEffectsRef.current || !addEffectRef.current) {
      return
    }

    try {
      await loadProfileSequentially(
        {
          amplifierId: profileResult.amplifierId,
          pedalIds: profileResult.pedalIds,
          name: profileName
        },
        clearEffectsRef.current,
        setSelectedAmplifier,
        setAmplifierParameters,
        addEffectRef.current
      )

      showToast({
        variant: 'success',
        title: 'Profil chargé',
        message: `Ampli ${profileResult.amplifierId || 'par défaut'} et ${profileResult.pedalIds.length} pédale(s) appliqués.`
      })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: 'Impossible de charger le profil'
      })
    }
  }, [showToast, setSelectedAmplifier, setAmplifierParameters])

  // Chargement initial de l'application
  useEffect(() => {
    // Simuler un délai de chargement minimum pour une meilleure UX
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Charger un TonePack en attente depuis localStorage
  useEffect(() => {
    if (currentPage === 'webamp' && clearEffectsRef.current && addEffectRef.current) {
      const pendingPackJson = localStorage.getItem('pendingTonePack')
      if (pendingPackJson) {
        try {
          const pack: TonePack = JSON.parse(pendingPackJson)
          localStorage.removeItem('pendingTonePack')

          // Charger le pack de manière asynchrone
          loadTonePackSequentially(
            pack,
            clearEffectsRef.current,
            setSelectedAmplifier,
            setAmplifierParameters,
            addEffectRef.current
          ).then(() => {
            showToast({
              variant: 'success',
              title: 'Pack chargé',
              message: `Le pack "${pack.name}" a été chargé avec succès sur le pedalboard.`
            })
          }).catch((error) => {
            logger.error('Erreur lors du chargement du TonePack', error)
            showToast({
              variant: 'error',
              title: 'Erreur',
              message: 'Impossible de charger le pack de tones'
            })
          })
        } catch (error) {
          logger.error('Erreur lors du parsing du TonePack', error)
          localStorage.removeItem('pendingTonePack')
        }
      }
    }
    // Note: clearEffectsRef et addEffectRef sont des refs stables, pas besoin de les inclure
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, showToast, setSelectedAmplifier, setAmplifierParameters])

  // Détecter une nouvelle connexion et afficher la popup de remerciement partenaire
  useEffect(() => {
    const currentUserId = user?.id || null
    
    // Si l'utilisateur vient de se connecter (était null, maintenant connecté)
    if (currentUserId && previousUserRef.current === null && !isLoading) {
      // Vérifier si la popup n'a pas déjà été affichée dans cette session
      const hasShownPopup = sessionStorage.getItem('partnerThankYouShown')
      if (!hasShownPopup) {
        // Attendre un peu pour que l'interface soit chargée
        setTimeout(() => {
          setShowPartnerThankYouModal(true)
          sessionStorage.setItem('partnerThankYouShown', 'true')
        }, 1000)
      }
    }
    
    previousUserRef.current = currentUserId
  }, [user, isLoading])

  // Résumer l'AudioContext lors de la première interaction utilisateur
  useEffect(() => {
    const handleUserInteraction = async () => {
      if (audioContextResumedRef.current) return
      
      try {
        // Créer une instance temporaire du moteur pour accéder à l'AudioContext
        if (!engineRef.current) {
          const { DEFAULT_SAMPLE_RATE, DEFAULT_AUDIO_ROUTING } = await import('./config/constants')
          engineRef.current = new PedalboardEngine({
            sampleRate: DEFAULT_SAMPLE_RATE,
            routing: DEFAULT_AUDIO_ROUTING
          })
        }
        
        // Résumer l'AudioContext du moteur
        await engineRef.current.resumeAudioContext()
        audioContextResumedRef.current = true
        
        // Résumer aussi Tone.js si disponible
        try {
          const Tone = await import('tone')
          if (Tone.context && Tone.context.state === 'suspended') {
            try {
              await Tone.start()
        } catch (error) {
          logger.debug('Impossible de démarrer Tone.js, interaction utilisateur requise', { error })
        }
      } else if (Tone.context && Tone.context.state === 'running') {
        // AudioContext déjà actif, rien à faire
      }
    } catch (error) {
      logger.debug('Tone.js n\'est pas encore chargé', { error })
    }
  } catch (error) {
    logger.debug('Erreur lors de la résolution de l\'AudioContext', { error })
  }
    }
    
    // Écouter les événements utilisateur pour résumer l'AudioContext
    // Utiliser 'once: true' pour ne résumer qu'une seule fois
    const events = ['click', 'touchstart', 'keydown']
    const handlers: Array<() => void> = []
    
    events.forEach(event => {
      const handler = () => {
        handleUserInteraction()
        // Retirer tous les handlers après la première interaction
        handlers.forEach(h => {
          events.forEach(e => {
            document.removeEventListener(e, h)
          })
        })
      }
      handlers.push(handler)
      document.addEventListener(event, handler, { once: true, passive: true })
    })
    
    return () => {
      handlers.forEach(handler => {
        events.forEach(event => {
          document.removeEventListener(event, handler)
        })
      })
    }
  }, [])


  // Mémoriser les callbacks pour éviter les re-renders infinis
  const handleEffectsChange = useCallback((pedalIds: string[]) => {
    setCurrentPedalIds(pedalIds)
  }, [])

  const handleAddEffectRef = useCallback((fn: (pedalId: string) => void) => {
    addEffectRef.current = fn
  }, [])

  const handleClearEffectsRef = useCallback((fn: () => void) => {
    clearEffectsRef.current = fn
  }, [])

  // Mapping des pages vers leurs feature flags
  const pageFeatureFlags: Record<PageId, string | null> = {
    'home': null,
    'webamp': null,
    'daw': 'page_daw',
    'practice': 'page_practice',
    'learn': 'page_learn',
    'mixing': 'page_mixing',
    'drummachine': 'page_drummachine',
    'gallery': 'page_gallery',
    'settings': null,
    'account': null,
    'admin': null
  }

  // Gérer la navigation vers le pedalboard avec recherche optionnelle
  const handleNavigateToPedalboard = useCallback((pedalId?: string) => {
    if (pedalId) {
      const pedal = pedalLibrary.find(p => p.id === pedalId)
      if (pedal) {
        // Utiliser le nom du modèle pour la recherche
        setLibrarySearchQuery(pedal.model)
        setAutoOpenLibrary(true)
      }
    } else {
      setLibrarySearchQuery('')
      setAutoOpenLibrary(false)
    }
    setCurrentPage('webamp')
    pageView('/webamp')
  }, [pageView])

  // Gérer le changement de page avec redirection pour les pages nécessitant une authentification
  const handlePageChange = useCallback((page: PageId) => {
    // Si la page nécessite une authentification et que l'utilisateur n'est pas connecté, rediriger vers home
    if (page === 'account' && !user) {
      setCurrentPage('home')
      return
    }
    // Si la page admin est demandée et que l'utilisateur n'est pas admin, rediriger vers home
    if (page === 'admin' && !isAdmin) {
      setCurrentPage('home')
      showToast({
        variant: 'error',
        title: 'Accès refusé',
        message: 'Vous n\'avez pas les droits d\'administration.'
      })
      return
    }
    // Vérifier le feature flag pour cette page
    const featureFlagKey = pageFeatureFlags[page]
    if (featureFlagKey && !isEnabled(featureFlagKey)) {
      setCurrentPage('home')
      showToast({
        variant: 'info',
        title: 'Page désactivée',
        message: 'Cette page est actuellement désactivée.'
      })
      return
    }
    setCurrentPage(page)
    // Tracker la vue de page
    pageView(`/${page}`)
  }, [user, isAdmin, showToast, isEnabled, pageView])

  // Tracker la page initiale
  useEffect(() => {
    if (!isLoading) {
      pageView(`/${currentPage}`)
    }
  }, [isLoading, currentPage, pageView])

  // Afficher le loader pendant le chargement initial
  if (isLoading) {
    return <Loader fullScreen size="lg" text="Initialisation..." />
  }

  // Rendre la page appropriée
  const renderPage = () => {
    // Vérifier le feature flag pour la page actuelle
    const featureFlagKey = pageFeatureFlags[currentPage]
    if (featureFlagKey && !isEnabled(featureFlagKey)) {
      return <HomePage onNavigateToLearn={() => setCurrentPage('learn')} onNavigateToPedalboard={handleNavigateToPedalboard} />
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToLearn={() => setCurrentPage('learn')} onNavigateToPedalboard={handleNavigateToPedalboard} />
      case 'webamp':
        return (
          <WebAmpPage
            searchQuery={searchQuery}
            librarySearchQuery={librarySearchQuery}
            autoOpenLibrary={autoOpenLibrary}
            onLibraryOpened={() => setAutoOpenLibrary(false)}
            selectedAmplifier={selectedAmplifier ?? undefined}
            onAmplifierChange={setSelectedAmplifier}
            onParametersChange={setAmplifierParameters}
            currentPedalIds={currentPedalIds}
            onAddEffectRef={handleAddEffectRef}
            onClearEffectsRef={handleClearEffectsRef}
            onEffectsChange={handleEffectsChange}
            peakInput={stats.peakInput}
            onExpandDrumMachine={() => setShowDrumMachineModal(true)}
            onOpenProfiles={() => setShowProfilesModal(true)}
          />
        )
      case 'daw':
        return <DawPage />
      case 'practice':
        return <PracticePage />
      case 'learn':
        return <LearnPage />
      case 'mixing':
        return <MixingConsolePage stats={stats} />
      case 'drummachine':
        return <DrumMachinePage />
      case 'gallery':
        return <GalleryPage onNavigateToWebAmp={() => setCurrentPage('webamp')} />
      case 'settings':
        return <SettingsPage />
      case 'account':
        return <AccountPage />
      case 'admin':
        return isAdmin ? <AdminPage /> : <HomePage onNavigateToLearn={() => setCurrentPage('learn')} onNavigateToPedalboard={handleNavigateToPedalboard} />
      default:
        return <HomePage onNavigateToLearn={() => setCurrentPage('learn')} onNavigateToPedalboard={handleNavigateToPedalboard} />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-200 custom-scrollbar">
      <TopBanner 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stats={stats}
        onProfileSelect={handleProfileSelect}
        onLogoClick={() => handlePageChange('home')}
      />

      <main className="flex-1 overflow-hidden bg-white dark:bg-gray-900 relative transition-colors duration-200">
        {renderPage()}
      </main>

      <BottomNavigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isAuthenticated={!!user}
        isAdmin={isAdmin}
      />

      {/* Modal boîte à rythmes plein écran */}
      <Modal
        isOpen={showDrumMachineModal}
        onClose={() => setShowDrumMachineModal(false)}
        title="Machine à rythmes"
        widthClassName="max-w-6xl"
        bodyClassName="p-6 overflow-y-auto custom-scrollbar max-h-[calc(80vh-80px)]"
      >
        <DrumMachinePanel />
      </Modal>

      {/* Modal profils */}
      <RockStarProfilesModal
        isOpen={showProfilesModal}
        onClose={() => setShowProfilesModal(false)}
        onSelectProfile={handleProfileSelect}
      />

      {/* Modal remerciement partenaire */}
      <PartnerThankYouModal
        isOpen={showPartnerThankYouModal}
        onClose={() => setShowPartnerThankYouModal(false)}
      />
    </div>
  )
}

export default App
