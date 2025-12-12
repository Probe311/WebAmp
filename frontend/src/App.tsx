import { useState, useEffect, useRef, useCallback } from 'react'
import { WebSocketClient } from './services/websocket'
import { WEBSOCKET_URL } from './config'
import { TopBanner } from './components/TopBanner'
import { Pedalboard } from './components/Pedalboard'
import { AmplifierSelector } from './components/AmplifierSelector'
import { DrumMachineCompact } from './components/drummachine/DrumMachineCompact'
import { DrumMachinePanel } from './components/drummachine/DrumMachinePanel'
import { Modal } from './components/Modal'
import { loadProfile, loadProfileSequentially } from './utils/profileLoader'
import { useTheme } from './contexts/ThemeContext'
import { useToast } from './components/notifications/ToastProvider'
import { PedalboardEngine } from './audio/PedalboardEngine'
import { useDrumMachine } from './contexts/DrumMachineContext'

function App() {
  const { theme } = useTheme()
  const { showToast } = useToast()
  const { isActive: isDrumMachineActive } = useDrumMachine()
  const [, setConnected] = useState(false)
  const [, setRunning] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAmplifier, setSelectedAmplifier] = useState<string | null>(null)
  const [, setAmplifierParameters] = useState<Record<string, number>>({})
  const [currentPedalIds, setCurrentPedalIds] = useState<string[]>([])
  const [showDrumMachineModal, setShowDrumMachineModal] = useState(false)
  const [stats, setStats] = useState({
    cpu: 0,
    latency: 0,
    peakInput: -96,
    peakOutput: -96
  })
  
  const addEffectRef = useRef<((pedalId: string) => void) | null>(null)
  const clearEffectsRef = useRef<(() => void) | null>(null)
  const pedalboardRef = useRef<HTMLDivElement>(null)
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
  }, [showToast])

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
            } catch (error) {
              // Ignorer silencieusement - l'utilisateur devra interagir
            }
          }
        } catch (error) {
          // Tone.js n'est peut-être pas encore chargé, ce n'est pas grave
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

  useEffect(() => {
    // Ne pas se connecter si l'URL est vide (WebSocket optionnel)
    if (!WEBSOCKET_URL || WEBSOCKET_URL.trim() === '') {
      return
    }

    const ws = WebSocketClient.getInstance()
    
    ws.onConnect = () => {
      setConnected(true)
      // Pas de notification de connexion
    }
    
    ws.onDisconnect = () => {
      setConnected(false)
      setRunning(false)
      // Pas de notification de déconnexion
    }
    
    ws.onError = () => {
      // Pas de notification d'erreur
    }
    
    ws.onStateSync = (state) => {
      console.log('Synchronisation de l\'état initial:', state)
      // Synchroniser l'ampli
      if (state.amplifierId) {
        setSelectedAmplifier(state.amplifierId)
      }
      // Les pédales seront synchronisées via le Pedalboard
    }
    
    ws.onMessage = (data) => {
      if (data.type === 'status') {
        setRunning(data.running || false)
      } else if (data.type === 'stats') {
        setStats({
          cpu: data.cpu || 0,
          latency: data.latency || 0,
          peakInput: data.peakInput || -96,
          peakOutput: data.peakOutput || -96
        })
      }
    }
    
    ws.connect(WEBSOCKET_URL)
    
    return () => {
      ws.disconnect()
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

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      <TopBanner 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stats={stats}
        onProfileSelect={handleProfileSelect}
      />

      <main className="flex-1 flex flex-col gap-4 p-4 pt-4 pb-0 overflow-hidden bg-white dark:bg-gray-900 relative transition-colors duration-200">
        {/* Layout Bento Grid - 2 lignes (responsive) */}
        <div className={`flex-1 min-h-0 grid grid-rows-[1fr_1fr] gap-4 overflow-hidden transition-all duration-300 ${
          isDrumMachineActive 
            ? 'grid-cols-1 md:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {/* Ligne 1 : Pedalboard (75% si boîte à rythmes active, 100% sinon) */}
          <div 
            ref={pedalboardRef}
            className={`row-span-1 flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 ${
              isDrumMachineActive 
                ? 'col-span-1 md:col-span-3' 
                : 'col-span-1'
            }`}
            style={{
              boxShadow: theme === 'dark' 
                ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(40, 40, 40, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)'
                : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
            }}
          >
            <Pedalboard 
              searchQuery={searchQuery}
              onAddEffectRef={handleAddEffectRef}
              onClearEffectsRef={handleClearEffectsRef}
              onEffectsChange={handleEffectsChange}
              currentPedalIds={currentPedalIds}
              currentAmplifierId={selectedAmplifier ?? undefined}
              peakInput={stats.peakInput}
            />
          </div>
          
          {/* Boîte à rythmes compacte (25% si active, cachée sinon) */}
          {isDrumMachineActive && (
            <div className="col-span-1 row-span-1 flex flex-col min-h-0">
              <DrumMachineCompact onExpand={() => setShowDrumMachineModal(true)} />
            </div>
          )}
          
          {/* Ligne 2 : AmplifierSelector (pleine largeur) */}
          <div className={`row-span-1 min-h-0 p-0 overflow-hidden bg-transparent ${
            isDrumMachineActive 
              ? 'col-span-1 md:col-span-4' 
              : 'col-span-1'
          }`}>
            <AmplifierSelector 
              selectedAmplifier={selectedAmplifier ?? undefined}
              onAmplifierChange={setSelectedAmplifier}
              onParametersChange={setAmplifierParameters}
              hasPedals={currentPedalIds.length > 0}
            />
          </div>
        </div>
      </main>

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
    </div>
  )
}

export default App
