import { useState, useEffect, useRef, useCallback } from 'react'
import { ShellHeader } from './components/shell/ShellHeader'
import { DrumMachinePanel } from './components/drummachine/DrumMachinePanel'
import { RockStarProfilesModal } from './components/RockStarProfilesModal'
import { PartnerThankYouModal } from './components/PartnerThankYouModal'
import { Modal } from './components/Modal'
import { Loader } from './components/Loader'
import { loadProfile, loadProfileSequentially } from './utils/profileLoader'
import { loadTonePackSequentially } from './utils/tonePackLoader'
import { TonePack } from './types/gallery'
import { useToast } from './components/notifications/ToastProvider'
import { AudioSessionProvider, useAudioSession } from './audio/AudioSessionContext'
import { useAuth } from './auth/AuthProvider'
import { consumePostAuthApp } from './auth/authGateSession'
import { HomePage } from './pages/HomePage'
import { PedalboardPage } from './pages/PedalboardPage'
import { AmplifierPage } from './pages/AmplifierPage'
import { MidiKeyboardPage } from './pages/MidiKeyboardPage'
import { DawPage } from './pages/DawPage'
import { ChordsPage } from './pages/ChordsPage'
import { TunerPage } from './pages/TunerPage'
import { LearnPage } from './pages/LearnPage'
import { MixingConsolePage } from './pages/MixingConsolePage'
import { DrumMachinePage } from './pages/DrumMachinePage'
import { GalleryPage } from './pages/GalleryPage'
import { SettingsPage } from './pages/SettingsPage'
import { AccountPage } from './pages/AccountPage'
import { AdminPage } from './pages/AdminPage'
import { LooperPage } from './pages/LooperPage'
import { MetronomePage } from './pages/MetronomePage'
import { useAnalytics } from './hooks/useAnalytics'
import { createLogger } from './services/logger'
import { pedalLibrary } from './data/pedals'
import { WorkspaceProvider, useWorkspace } from './workspace/WorkspaceContext'
import type { AppId } from './workspace/types'
import { WindowGrid } from './components/shell/WindowGrid'
import { AppDock } from './components/shell/AppDock'
import { HelpFab } from './components/shell/HelpFab'
import { useIsAdmin } from './hooks/useIsAdmin'

const logger = createLogger('App')

function AppShell() {
  const { showToast } = useToast()
  const { user } = useAuth()
  const isAdmin = useIsAdmin()
  const [isLoading, setIsLoading] = useState(true)
  const { pageView } = useAnalytics()
  const { openApp, closeApp, focusedAppId, windows } = useWorkspace()
  const pedalboardOpen = windows.some((w) => w.appId === 'pedalboard' || w.appId === 'webamp')
  const [searchQuery, setSearchQuery] = useState('')
  const [librarySearchQuery, setLibrarySearchQuery] = useState('')
  const [autoOpenLibrary, setAutoOpenLibrary] = useState(false)
  const postAuthHandledRef = useRef(false)
  const {
    engine,
    amplifierId: selectedAmplifier,
    setAmplifierId: setSelectedAmplifier,
    setAmplifierParameters
  } = useAudioSession()
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
    } catch {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: 'Impossible de charger le profil'
      })
    }
  }, [showToast, setSelectedAmplifier, setAmplifierParameters])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  // Après gate LP → ouvrir `next` / home (sessionStorage posé par AppWithAuth)
  useEffect(() => {
    if (isLoading || !user || postAuthHandledRef.current) return
    const target = consumePostAuthApp()
    postAuthHandledRef.current = true
    if (!target) return
    openApp(target)
    pageView(`/${target}`)
  }, [isLoading, user, openApp, pageView])

  useEffect(() => {
    if (pedalboardOpen && clearEffectsRef.current && addEffectRef.current) {
      const pendingPackJson = localStorage.getItem('pendingTonePack')
      if (pendingPackJson) {
        try {
          const pack: TonePack = JSON.parse(pendingPackJson)
          localStorage.removeItem('pendingTonePack')

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

      const pendingProfile = localStorage.getItem('pendingRockStarProfile')
      if (pendingProfile) {
        localStorage.removeItem('pendingRockStarProfile')
        void handleProfileSelect(pendingProfile)
      }
    }
  }, [pedalboardOpen, showToast, setSelectedAmplifier, setAmplifierParameters, handleProfileSelect])

  useEffect(() => {
    const currentUserId = user?.id || null
    if (currentUserId && previousUserRef.current === null && !isLoading) {
      const hasShownPopup = sessionStorage.getItem('partnerThankYouShown')
      if (!hasShownPopup) {
        setTimeout(() => {
          setShowPartnerThankYouModal(true)
          sessionStorage.setItem('partnerThankYouShown', 'true')
        }, 1000)
      }
    }
    previousUserRef.current = currentUserId
  }, [user, isLoading])

  useEffect(() => {
    const handleUserInteraction = async () => {
      if (audioContextResumedRef.current) return
      try {
        await engine.resumeAudioContext()
        audioContextResumedRef.current = true
        try {
          const Tone = await import('tone')
          if (Tone.context?.state === 'suspended') {
            try {
              await Tone.start()
            } catch (error) {
              logger.debug('Impossible de démarrer Tone.js, interaction utilisateur requise', { error })
            }
          }
        } catch (error) {
          logger.debug("Tone.js n'est pas encore chargé", { error })
        }
      } catch (error) {
        logger.debug("Erreur lors de la résolution de l'AudioContext", { error })
      }
    }

    const events = ['click', 'touchstart', 'keydown']
    const handlers: Array<() => void> = []
    events.forEach((event) => {
      const handler = () => {
        handleUserInteraction()
        handlers.forEach((h) => {
          events.forEach((e) => document.removeEventListener(e, h))
        })
      }
      handlers.push(handler)
      document.addEventListener(event, handler, { once: true, passive: true })
    })

    return () => {
      handlers.forEach((handler) => {
        events.forEach((event) => document.removeEventListener(event, handler))
      })
    }
  }, [engine])

  const handleEffectsChange = useCallback((pedalIds: string[]) => {
    setCurrentPedalIds(pedalIds)
  }, [])

  const handleAddEffectRef = useCallback((fn: (pedalId: string) => void) => {
    addEffectRef.current = fn
  }, [])

  const handleClearEffectsRef = useCallback((fn: () => void) => {
    clearEffectsRef.current = fn
  }, [])

  const handleNavigateToPedalboard = useCallback((pedalId?: string) => {
    if (pedalId) {
      const pedal = pedalLibrary.find((p) => p.id === pedalId)
      if (pedal) {
        setLibrarySearchQuery(pedal.model)
        setAutoOpenLibrary(true)
      }
    } else {
      setLibrarySearchQuery('')
      setAutoOpenLibrary(false)
    }
    openApp('pedalboard')
    pageView('/pedalboard')
  }, [openApp, pageView])

  useEffect(() => {
    if (!isLoading && focusedAppId) {
      pageView(`/${focusedAppId}`)
    }
  }, [focusedAppId, isLoading, pageView])

  const renderApp = useCallback((appId: string) => {
    switch (appId as AppId) {
      case 'home':
        return (
          <HomePage
            onNavigateToLearn={() => openApp('learn')}
            onNavigateToPedalboard={handleNavigateToPedalboard}
          />
        )
      case 'webamp':
      case 'pedalboard':
        return (
          <PedalboardPage
            searchQuery={searchQuery}
            librarySearchQuery={librarySearchQuery}
            autoOpenLibrary={autoOpenLibrary}
            onLibraryOpened={() => setAutoOpenLibrary(false)}
            currentAmplifierId={selectedAmplifier ?? undefined}
            currentPedalIds={currentPedalIds}
            onAddEffectRef={handleAddEffectRef}
            onClearEffectsRef={handleClearEffectsRef}
            onEffectsChange={handleEffectsChange}
            peakInput={stats.peakInput}
            onExpandDrumMachine={() => setShowDrumMachineModal(true)}
            onOpenProfiles={() => setShowProfilesModal(true)}
          />
        )
      case 'amplifier':
        return (
          <AmplifierPage
            selectedAmplifier={selectedAmplifier ?? undefined}
            onAmplifierChange={setSelectedAmplifier}
            onParametersChange={setAmplifierParameters}
            hasPedals={currentPedalIds.length > 0}
          />
        )
      case 'daw':
        return <DawPage />
      case 'mixing':
        return <MixingConsolePage stats={stats} />
      case 'midi':
        return <MidiKeyboardPage />
      case 'drummachine':
        return <DrumMachinePage />
      case 'looper':
        return <LooperPage />
      case 'metronome':
        return <MetronomePage />
      case 'chords':
        return <ChordsPage />
      case 'tuner':
        return <TunerPage />
      case 'learn':
        return <LearnPage />
      case 'gallery':
        return <GalleryPage onNavigateToWebAmp={() => openApp('pedalboard')} />
      case 'settings':
        return <SettingsPage />
      case 'account':
        return <AccountPage />
      case 'admin':
        if (!isAdmin) {
          return (
            <HomePage
              onNavigateToLearn={() => openApp('learn')}
              onNavigateToPedalboard={handleNavigateToPedalboard}
            />
          )
        }
        return <AdminPage />
      default:
        return (
          <HomePage
            onNavigateToLearn={() => openApp('learn')}
            onNavigateToPedalboard={handleNavigateToPedalboard}
          />
        )
    }
  }, [
    openApp,
    handleNavigateToPedalboard,
    searchQuery,
    librarySearchQuery,
    autoOpenLibrary,
    selectedAmplifier,
    currentPedalIds,
    handleAddEffectRef,
    handleClearEffectsRef,
    handleEffectsChange,
    stats,
    isAdmin,
    setSelectedAmplifier,
    setAmplifierParameters,
  ])

  useEffect(() => {
    if (focusedAppId !== 'admin' || isAdmin) return
    openApp('home')
    showToast({
      variant: 'error',
      title: 'Accès refusé',
      message: "Vous n'avez pas les droits d'administration.",
    })
  }, [focusedAppId, isAdmin, openApp, showToast])

  // Compte = session uniquement (persist workspace / logout)
  useEffect(() => {
    if (user) return
    if (!windows.some((w) => w.appId === 'account')) return
    closeApp('account')
  }, [user, windows, closeApp])

  if (isLoading) {
    return <Loader fullScreen size="lg" />
  }

  return (
    <div className="neu-bg neu-theme-transition custom-scrollbar flex h-screen flex-col overflow-hidden">
      <ShellHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onLogoClick={() => openApp('home')}
      />

      <main className="neu-bg neu-theme-transition relative flex-1 overflow-hidden">
        <WindowGrid renderApp={renderApp} />
      </main>

      <AppDock isAdmin={isAdmin} />
      <HelpFab />

      <Modal
        isOpen={showDrumMachineModal}
        onClose={() => setShowDrumMachineModal(false)}
        title="Machine à rythmes"
        widthClassName="max-w-6xl"
        bodyClassName="p-6 overflow-y-auto custom-scrollbar max-h-[calc(80vh-80px)]"
      >
        <DrumMachinePanel />
      </Modal>

      <RockStarProfilesModal
        isOpen={showProfilesModal}
        onClose={() => setShowProfilesModal(false)}
        onSelectProfile={handleProfileSelect}
      />

      <PartnerThankYouModal
        isOpen={showPartnerThankYouModal}
        onClose={() => setShowPartnerThankYouModal(false)}
      />
    </div>
  )
}

function App() {
  return (
    <AudioSessionProvider>
      <WorkspaceProvider>
        <AppShell />
      </WorkspaceProvider>
    </AudioSessionProvider>
  )
}

export default App
