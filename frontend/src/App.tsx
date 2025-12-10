import { useState, useEffect, useRef } from 'react'
import { WebSocketClient } from './services/websocket'
import { WEBSOCKET_URL } from './config'
import { TopBanner } from './components/TopBanner'
import { Pedalboard, Effect } from './components/Pedalboard'
import { AmplifierSelector } from './components/AmplifierSelector'
import { PresetsManager } from './components/PresetsManager'
import { loadProfile } from './utils/profileLoader'
import { useTheme } from './contexts/ThemeContext'
import { useToast } from './components/notifications/ToastProvider'
import { PedalboardEngine } from './audio/PedalboardEngine'
import { Preset } from './services/supabase/presets'

function App() {
  const { theme } = useTheme()
  const { showToast } = useToast()
  const [, setConnected] = useState(false)
  const [, setRunning] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAmplifier, setSelectedAmplifier] = useState<string | undefined>(undefined)
  const [amplifierParameters, setAmplifierParameters] = useState<Record<string, number>>({})
  const [currentPedalIds, setCurrentPedalIds] = useState<string[]>([])
  const [currentEffects, setCurrentEffects] = useState<Effect[]>([])
  const [showPresets, setShowPresets] = useState(false)
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
  
  async function handleLoadPreset(preset: Preset) {
    // Vider le pedalboard
    if (clearEffectsRef.current) {
      clearEffectsRef.current()
    }

    // Sélectionner l'ampli
    if (preset.amplifier_id) {
      setSelectedAmplifier(preset.amplifier_id)
      if (preset.amplifier_parameters) {
        setAmplifierParameters(preset.amplifier_parameters)
      }
    }

    // Attendre que le state soit mis à jour
    await new Promise(resolve => setTimeout(resolve, 300))

    // Ajouter les effets
    if (preset.effects && preset.effects.length > 0) {
      for (let i = 0; i < preset.effects.length; i++) {
        const effect = preset.effects[i]
        if (addEffectRef.current) {
          addEffectRef.current(effect.pedalId)
          if (i < preset.effects.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 150))
          }
        }
      }
    }

    showToast({
      variant: 'success',
      title: 'Preset chargé',
      message: `Le preset "${preset.name}" a été chargé`
    })
  }
  
  const handleProfileSelect = async (profileName: string) => {
    console.log(`Chargement du profil: ${profileName}`)
    const profileResult = loadProfile(profileName)
    if (!profileResult) {
      console.error(`Impossible de charger le profil: ${profileName}`)
      showToast({
        variant: 'error',
        title: 'Profil introuvable',
        message: 'Le profil demandé est introuvable ou corrompu.'
      })
      return
    }
    
    console.log(`Profil chargé - Ampli: ${profileResult.amplifierId}, Pédales: ${profileResult.pedalIds.length}`)
    showToast({
      variant: 'success',
      title: 'Profil chargé',
      message: `Ampli ${profileResult.amplifierId || 'par défaut'} et ${profileResult.pedalIds.length} pédale(s) appliqués.`
    })
    
    // Vider le pedalboard d'abord
    if (clearEffectsRef.current) {
      clearEffectsRef.current()
      console.log('Pedalboard vidé')
    }
    
    // Sélectionner l'ampli immédiatement
    if (profileResult.amplifierId) {
      setSelectedAmplifier(profileResult.amplifierId)
      console.log(`Ampli sélectionné: ${profileResult.amplifierId}`)
    } else {
      console.warn(`Aucun ampli trouvé pour le profil: ${profileName}`)
    }
    
    // Attendre que le state soit mis à jour après le clear
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Ajouter toutes les pédales séquentiellement
    if (profileResult.pedalIds.length > 0) {
      console.log(`Ajout de ${profileResult.pedalIds.length} pédales...`)
      for (let i = 0; i < profileResult.pedalIds.length; i++) {
        const pedalId = profileResult.pedalIds[i]
        if (addEffectRef.current) {
          console.log(`Ajout de la pédale ${i + 1}/${profileResult.pedalIds.length}: ${pedalId}`)
          addEffectRef.current(pedalId)
          // Attendre entre chaque pédale pour laisser le state se mettre à jour
          if (i < profileResult.pedalIds.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 150))
          }
        } else {
          console.error('La fonction addEffectRef n\'est pas disponible')
        }
      }
      console.log('Toutes les pédales ont été ajoutées')
    } else {
      console.warn(`Aucune pédale trouvée pour le profil: ${profileName}`)
    }
  }

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

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-200">
      <TopBanner 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        stats={stats}
        onProfileSelect={handleProfileSelect}
        onShowPresets={() => setShowPresets(true)}
      />

      <main className="flex-1 flex flex-col gap-4 p-4 pt-4 pb-0 overflow-hidden bg-white dark:bg-gray-900 relative transition-colors duration-200">
        <div 
          ref={pedalboardRef}
          className="flex-1 min-h-0 flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-colors duration-200"
          style={{
            boxShadow: theme === 'dark' 
              ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(40, 40, 40, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)'
              : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
          }}
        >
          <Pedalboard 
            searchQuery={searchQuery}
            onAddEffectRef={(fn: (pedalId: string) => void) => { addEffectRef.current = fn }}
            onClearEffectsRef={(fn: () => void) => { clearEffectsRef.current = fn }}
            onEffectsChange={(pedalIds, effects) => {
              setCurrentPedalIds(pedalIds)
              setCurrentEffects(effects || [])
            }}
            currentPedalIds={currentPedalIds}
            currentAmplifierId={selectedAmplifier}
            peakInput={stats.peakInput}
          />
        </div>
        
        <div className="flex-1 min-h-0 p-0 overflow-hidden bg-transparent">
          <AmplifierSelector 
            selectedAmplifier={selectedAmplifier}
            onAmplifierChange={setSelectedAmplifier}
            onParametersChange={setAmplifierParameters}
            hasPedals={currentPedalIds.length > 0}
          />
        </div>
      </main>

      <PresetsManager
        isOpen={showPresets}
        onClose={() => setShowPresets(false)}
        onLoadPreset={handleLoadPreset}
        currentEffects={currentEffects}
        currentAmplifierId={selectedAmplifier}
        currentAmplifierParameters={amplifierParameters}
      />
    </div>
  )
}

export default App
