import { useState, useEffect, useRef, useCallback } from 'react'
import { TopBanner } from './components/TopBanner'
import { BottomNavigation, PageId } from './components/BottomNavigation'
import { DrumMachinePanel } from './components/drummachine/DrumMachinePanel'
import { RockStarProfilesModal } from './components/RockStarProfilesModal'
import { PartnerThankYouModal } from './components/PartnerThankYouModal'
import { Modal } from './components/Modal'
import { Loader } from './components/Loader'
import { loadProfile, loadProfileSequentially } from './utils/profileLoader'
import { useToast } from './components/notifications/ToastProvider'
import { PedalboardEngine } from './audio/PedalboardEngine'
import { useAuth } from './auth/AuthProvider'
import { HomePage } from './pages/HomePage'
import { WebAmpPage } from './pages/WebAmpPage'
import { LooperPage } from './pages/LooperPage'
import { PracticePage } from './pages/PracticePage'
import { LearnPage } from './pages/LearnPage'
import { MixingConsolePage } from './pages/MixingConsolePage'
import { DrumMachinePage } from './pages/DrumMachinePage'
import { SettingsPage } from './pages/SettingsPage'
import { AccountPage } from './pages/AccountPage'

function App() {
  const { showToast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<PageId>('home')
  const [searchQuery, setSearchQuery] = useState('')
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
      console.error('Erreur lors du chargement du profil:', error)
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
          engineRef.current = new PedalboardEngine({
            sampleRate: 44100,
            routing: 'serial'
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
              console.log('[App] Tone.js AudioContext démarré')
            } catch (error) {
              // Ignorer silencieusement - l'utilisateur devra interagir
              console.warn('[App] Impossible de démarrer Tone.js:', error)
            }
          } else if (Tone.context && Tone.context.state === 'running') {
            console.log('[App] Tone.js AudioContext déjà actif')
          }
        } catch (error) {
          // Tone.js n'est peut-être pas encore chargé, ce n'est pas grave
          console.warn('[App] Tone.js non disponible:', error)
        }
      } catch (error) {
        // Ignorer les erreurs silencieusement - l'AudioContext sera résumé lors de la prochaine interaction
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

  // Gérer le changement de page avec redirection pour les pages nécessitant une authentification
  const handlePageChange = useCallback((page: PageId) => {
    // Si la page nécessite une authentification et que l'utilisateur n'est pas connecté, rediriger vers home
    if (page === 'account' && !user) {
      setCurrentPage('home')
      return
    }
    setCurrentPage(page)
  }, [user])

  // Afficher le loader pendant le chargement initial
  if (isLoading) {
    return <Loader fullScreen size="lg" text="Initialisation..." />
  }

  // Rendre la page appropriée
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToLearn={() => setCurrentPage('learn')} />
      case 'webamp':
        return (
          <WebAmpPage
            searchQuery={searchQuery}
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
      case 'looper':
        return <LooperPage />
      case 'practice':
        return <PracticePage />
      case 'learn':
        return <LearnPage />
      case 'mixing':
        return <MixingConsolePage stats={stats} />
      case 'drummachine':
        return <DrumMachinePage />
      case 'settings':
        return <SettingsPage />
      case 'account':
        return <AccountPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      <TopBanner 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stats={stats}
        onProfileSelect={handleProfileSelect}
      />

      <main className="flex-1 overflow-hidden bg-white dark:bg-gray-900 relative transition-colors duration-200">
        {renderPage()}
      </main>

      <BottomNavigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isAuthenticated={!!user}
      />

      {/* Modal boîte à rythmes plein écran */}
      <Modal
        isOpen={showDrumMachineModal}
        onClose={() => setShowDrumMachineModal(false)}
        title="Machine à rythmes"
        widthClassName="max-w-6xl"
        bodyClassName="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
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
