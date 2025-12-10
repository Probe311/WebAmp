import { useState } from 'react'
import { Activity, Settings, Users, Drum, Sliders, Play, Pause, Square, Home, Repeat, Music, Timer, Save, User, LogOut } from 'lucide-react'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { ShortcutAction } from '../types/keyboardShortcuts'
import { RockStarProfilesModal } from './RockStarProfilesModal'
import { SettingsPanel } from './SettingsPanel'
import { CTA } from './CTA'
import { Modal } from './Modal'
import { SystemMonitoringPanel } from './monitoring/SystemMonitoringPanel'
import { SimpleView } from './equalizer/SimpleView'
import { AdvancedView } from './equalizer/AdvancedView'
import { DrumMachinePanel } from './drummachine/DrumMachinePanel'
import { useDrumMachine } from '../contexts/DrumMachineContext'
import { RoomSimulator } from './RoomSimulator'
import { Looper } from './Looper'
import { TunerComponent } from './Tuner'
import { Metronome } from './Metronome'
import { AuthModal } from './AuthModal'
import { useAuth } from '../beta/auth/AuthProvider'
import { AccountPanel } from '../beta/auth/components/AccountPanel'

interface TopBannerProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  stats: {
    cpu: number
    latency: number
    peakInput: number
    peakOutput: number
  }
  onProfileSelect?: (profileName: string) => void
  onShowPresets?: () => void
}

export function TopBanner({
  searchQuery,
  onSearchChange,
  stats,
  onProfileSelect,
  onShowPresets
}: TopBannerProps) {
  const [showMonitoring, setShowMonitoring] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showProfiles, setShowProfiles] = useState(false)
  const [showDrumMachine, setShowDrumMachine] = useState(false)
  const [showEqualizer, setShowEqualizer] = useState(false)
  const [showRoom, setShowRoom] = useState(false)
  const [showLooper, setShowLooper] = useState(false)
  const [showTuner, setShowTuner] = useState(false)
  const [showMetronome, setShowMetronome] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [showPresets, setShowPresets] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [equalizerMode, setEqualizerMode] = useState<'simple' | 'advanced'>('simple')
  const { user, logout } = useAuth()
  const isAuthenticated = !!user
  // États pour Room
  const [roomConfig, setRoomConfig] = useState({
    size: 50,
    reverb: 30,
    position: 50,
    damping: 50
  })
  
  const { isPlaying, isActive, handlePlayPause, handleStop } = useDrumMachine()
  
  const handleProfileSelect = (profileName: string) => {
    if (onProfileSelect) {
      onProfileSelect(profileName)
    }
  }

  // Gestion des raccourcis clavier
  useKeyboardShortcuts((action: ShortcutAction) => {
    switch (action.type) {
      case 'openSettings':
        setShowSettings(true)
        break
      case 'openProfiles':
        setShowProfiles(true)
        break
      case 'toggleMetronome':
        setShowMetronome(!showMetronome)
        break
      case 'toggleLooper':
        setShowLooper(!showLooper)
        break
      case 'toggleTuner':
        setShowTuner(!showTuner)
        break
      case 'toggleDrumMachine':
        setShowDrumMachine(!showDrumMachine)
        break
      case 'toggleRoomSimulator':
        setShowRoom(!showRoom)
        break
    }
  })


  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 rounded-b-3xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(40,40,40,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] z-[100] transition-colors duration-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-black/85 dark:text-white/90 tracking-[2px] uppercase">WebAmp</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-[500px] mx-8">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-6 py-3 bg-white dark:bg-gray-700 rounded-3xl text-black/85 dark:text-white/90 text-sm transition-all duration-200
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
              dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]
              focus:outline-none focus:border-black/10 dark:focus:border-white/20
              focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.07),inset_-3px_-3px_6px_rgba(255,255,255,1)]
              dark:focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-3px_-3px_6px_rgba(70,70,70,0.6)]
              placeholder:text-black/50 dark:placeholder:text-white/50 placeholder:font-medium"
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Groupe Machine à rythmes avec contrôles */}
          <div className={`flex items-center gap-0 bg-white dark:bg-gray-700 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)] ${
            isActive ? 'rounded-l-2xl' : 'rounded-2xl'
          }`}>
          <CTA
            variant="icon-only"
            icon={<Drum size={20} />}
            onClick={() => setShowDrumMachine(true)}
            title="Machine à rythmes"
            active={showDrumMachine}
              className={`${isActive ? 'rounded-l-lg rounded-r-none' : 'rounded-lg'} border-0 shadow-none`}
            />
            {isActive && (
              <>
                <CTA
                  variant="icon-only"
                  icon={isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePlayPause()
                  }}
                  title={isPlaying ? 'Pause' : 'Play'}
                  active={isPlaying}
                  className="rounded-none border-0 shadow-none"
                />
                <CTA
                  variant="icon-only"
                  icon={<Square size={18} />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStop()
                  }}
                  title="Stop"
                  className="rounded-r-lg rounded-l-none border-0 shadow-none"
                />
              </>
            )}
          </div>
          <CTA
            variant="icon-only"
            icon={<Users size={20} />}
            onClick={() => setShowProfiles(true)}
            title="Profils"
          />
          <CTA
            variant="icon-only"
            icon={<Activity size={20} />}
            onClick={() => setShowMonitoring(true)}
            title="Monitoring système"
            active={showMonitoring}
          />

          <CTA
            variant="icon-only"
            icon={<Sliders size={20} />}
            onClick={() => setShowEqualizer(true)}
            title="Égaliseur"
            active={showEqualizer}
          />
          <CTA
            variant="icon-only"
            icon={<Home size={20} />}
            onClick={() => setShowRoom(true)}
            title="Room Simulator"
            active={showRoom}
          />
          <CTA
            variant="icon-only"
            icon={<Repeat size={20} />}
            onClick={() => setShowLooper(true)}
            title="Looper"
            active={showLooper}
          />
          <CTA
            variant="icon-only"
            icon={<Music size={20} />}
            onClick={() => setShowTuner(true)}
            title="Tuner"
            active={showTuner}
          />
          <CTA
            variant="icon-only"
            icon={<Timer size={20} />}
            onClick={() => setShowMetronome(true)}
            title="Metronome"
            active={showMetronome}
          />
          {isAuthenticated && (
            <CTA
              variant="icon-only"
              icon={<Save size={20} />}
              onClick={() => {
                if (onShowPresets) {
                  onShowPresets()
                } else {
                  setShowPresets(true)
                }
              }}
              title="Gérer les presets"
              active={showPresets}
            />
          )}
          <CTA
            variant="icon-only"
            icon={<Settings size={20} />}
            onClick={() => setShowSettings(true)}
            title="Paramètres"
            active={showSettings}
          />
          {isAuthenticated && (
            <>
              <CTA
                variant="icon-only"
                icon={<User size={20} />}
                onClick={() => setShowAccount(true)}
                title="Mon compte"
                active={showAccount}
              />
              <CTA
                variant="icon-only"
                icon={<LogOut size={20} />}
                onClick={async () => {
                  try {
                    await logout()
                  } catch (error) {
                    console.error('Erreur de déconnexion', error)
                  }
                }}
                title="Déconnexion"
              />
            </>
          )}
        </div>
      </header>

      <Modal
        isOpen={showMonitoring}
        onClose={() => setShowMonitoring(false)}
        title="Monitoring système"
        widthClassName="max-w-6xl"
        bodyClassName="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
      >
        <SystemMonitoringPanel />
      </Modal>

      <Modal
        isOpen={showDrumMachine}
        onClose={() => setShowDrumMachine(false)}
        title="Machine à rythmes"
        widthClassName="max-w-6xl"
        bodyClassName="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
      >
        <DrumMachinePanel />
      </Modal>

      <Modal
        isOpen={showEqualizer}
        onClose={() => setShowEqualizer(false)}
        title="Égaliseur"
        widthClassName="max-w-[95vw]"
        bodyClassName="p-6 overflow-hidden bg-white dark:bg-gray-900"
        headerRight={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#EBECF0] dark:bg-gray-700 p-1.5 rounded-full shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(60,60,60,0.5)]">
              <button
                onClick={() => setEqualizerMode('simple')}
                onTouchStart={(e) => {
                  e.preventDefault()
                  setEqualizerMode('simple')
                }}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200
                  touch-manipulation focus:outline-none select-none
                  ${equalizerMode === 'simple' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(60,60,60,0.6)]' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 bg-transparent'
                  }
                `}
                aria-label="Mode Simple"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                Simple
              </button>
              <button
                onClick={() => setEqualizerMode('advanced')}
                onTouchStart={(e) => {
                  e.preventDefault()
                  setEqualizerMode('advanced')
                }}
                className={`
                  px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200
                  touch-manipulation focus:outline-none select-none
                  ${equalizerMode === 'advanced' 
                    ? 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-200 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(60,60,60,0.6)]' 
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 bg-transparent'
                  }
                `}
                aria-label="Mode Avancé"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                Avancé
              </button>
            </div>
          </div>
        }
      >
        {equalizerMode === 'simple' ? (
          <SimpleView />
        ) : (
          <AdvancedView stats={stats} />
        )}
      </Modal>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Paramètres"
        widthClassName="max-w-xl"
        bodyClassName="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
      >
        <SettingsPanel onClose={() => setShowSettings(false)} />
      </Modal>

      <RockStarProfilesModal
        isOpen={showProfiles}
        onClose={() => setShowProfiles(false)}
        onSelectProfile={handleProfileSelect}
      />

      <Modal
        isOpen={showRoom}
        onClose={() => setShowRoom(false)}
        title="Room Simulator"
        widthClassName="max-w-2xl"
        bodyClassName="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
      >
        <RoomSimulator
          config={roomConfig}
          onConfigChange={setRoomConfig}
        />
      </Modal>

      <Modal
        isOpen={showLooper}
        onClose={() => setShowLooper(false)}
        title="Looper"
        widthClassName="max-w-4xl"
        bodyClassName="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
      >
        <Looper />
      </Modal>

      <Modal
        isOpen={showTuner}
        onClose={() => setShowTuner(false)}
        title="Tuner"
        widthClassName="max-w-md"
        bodyClassName="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
      >
        <TunerComponent />
      </Modal>

      <Modal
        isOpen={showMetronome}
        onClose={() => setShowMetronome(false)}
        title="Metronome"
        widthClassName="max-w-2xl"
        bodyClassName="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
      >
        <Metronome />
      </Modal>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
      />

      {isAuthenticated && (
        <Modal
          isOpen={showAccount}
          onClose={() => setShowAccount(false)}
          title="Mon compte"
          widthClassName="max-w-2xl"
          bodyClassName="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
        >
          <AccountPanel />
        </Modal>
      )}
    </>
  )
}
