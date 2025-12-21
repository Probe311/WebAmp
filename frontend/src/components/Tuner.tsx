import { useState, useEffect, useRef } from 'react'
import { Tuner, TunerState, Tuning } from '../audio/tuner'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'
import { Dropdown, DropdownOption } from './Dropdown'
import { useTheme } from '../contexts/ThemeContext'

export function TunerComponent() {
  const { theme } = useTheme()
  const { audioContext, audioSource } = usePedalboardEngine()
  const tunerRef = useRef<Tuner | null>(null)
  const [state, setState] = useState<TunerState>({
    note: null,
    cents: 0,
    frequency: 0,
    isInTune: false
  })
  const [tuning, setTuning] = useState<Tuning>('standard')
  const isDark = theme === 'dark'

  const tuningOptions: DropdownOption[] = [
    { value: 'standard', label: 'Standard (EADGBE)' },
    { value: 'dropD', label: 'Drop D (DADGBE)' },
    { value: 'dropC', label: 'Drop C (CGCFAD)' },
    { value: 'openG', label: 'Open G (DGDGBD)' },
    { value: 'openD', label: 'Open D (DADF#AD)' },
    { value: 'dadgad', label: 'DADGAD' }
  ]

  useEffect(() => {
    if (!audioContext || !audioSource) return

    const analyser = audioContext.createAnalyser()
    audioSource.connect(analyser)

    tunerRef.current = new Tuner(audioContext, analyser)
    tunerRef.current.setTuning(tuning)

    const intervalId = window.setInterval(() => {
      const newState = tunerRef.current?.detectNote()
      if (newState) {
        setState(newState)
      }
    }, 100)

    return () => {
      window.clearInterval(intervalId)
      try {
        audioSource.disconnect(analyser)
      } catch (e) {
        // Ignorer
      }
      tunerRef.current = null
    }
  }, [audioContext, audioSource, tuning])

  // Formater la note pour l'affichage (retire l'octave et convertit # en ♯)
  const formatNote = (note: string | null): string => {
    if (!note) return '—'
    return note.replace('#', '♯').replace(/[0-9]/g, '')
  }

  // Calculer les LEDs actives selon les cents
  const getLEDsActive = (cents: number): number => {
    // -50 à +50 cents -> 0 à 21 LEDs (10 au centre = accordé)
    const clamped = Math.max(-50, Math.min(50, cents))
    const ratio = (clamped + 50) / 100 // 0 à 1
    return Math.round(ratio * 20) // 0 à 20 (21 LEDs au total: 0-20)
  }

  // Obtenir la couleur d'une LED selon sa position
  const getLEDColor = (index: number, activeUntil: number): string => {
    if (index > activeUntil) return '' // LED éteinte, utilise les classes CSS
    
    const centerLED = 10 // LED au centre (index 10)
    if (index === centerLED) {
      return '#00ff00' // Vert au centre
    } else if (index < centerLED) {
      return '#ff0000' // Rouge à gauche
    } else {
      return '#ff0000' // Rouge à droite
    }
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6">
      {/* Sélection de l'accordage - style Boss */}
      <div className="w-full max-w-xs">
        <label className="block text-xs font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-2">
          Accordage
        </label>
        <Dropdown
          options={tuningOptions}
          value={tuning}
          onChange={(value) => {
            setTuning(value as Tuning)
            tunerRef.current?.setTuning(value as Tuning)
          }}
        />
      </div>

      {/* Caisse principale style Boss - fond neumorphic */}
      <div 
        className="relative w-full max-w-md rounded-2xl p-6 bg-white dark:bg-gray-700
          shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)]
          dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)]"
      >
        {/* Écran LED style Boss - s'adapte au thème */}
        <div 
          className="w-full rounded-md p-6 mb-4 bg-gray-100 dark:bg-gray-800
            shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
            dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]
            border border-black/10 dark:border-white/10"
        >
          {/* Affichage de la note - style LED */}
          <div className="flex items-center justify-center mb-4">
            {state.note ? (
              <div className="text-center">
                <div 
                  className="text-7xl font-bold"
                  style={{
                    color: '#00ff00',
                    textShadow: '0 0 10px rgba(0,255,0,0.8), 0 0 20px rgba(0,255,0,0.5), 0 0 30px rgba(0,255,0,0.3)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.05em'
                  }}
                >
                  {formatNote(state.note)}
                </div>
                {state.frequency > 0 && (
                  <div className="text-sm mt-2 font-mono text-black/50 dark:text-white/50">
                    {state.frequency.toFixed(1)} Hz
                  </div>
                )}
              </div>
            ) : (
              <div className="text-7xl font-bold font-mono text-black/30 dark:text-white/30">
                {formatNote(null)}
              </div>
            )}
          </div>

          {/* Barre de LEDs style Boss */}
          <div className="flex items-center justify-center gap-1 mb-2">
            {Array.from({ length: 21 }).map((_, index) => {
              const activeUntil = getLEDsActive(state.cents)
              const isActive = index <= activeUntil
              const ledColor = getLEDColor(index, activeUntil)
              
              return (
                <div
                  key={index}
                  className={`h-8 flex-1 rounded-sm transition-all duration-75 ${
                    !isActive 
                      ? 'bg-black/30 dark:bg-black/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] dark:shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-black/30 dark:border-black/50'
                      : ''
                  }`}
                  style={isActive ? {
                    background: `linear-gradient(to bottom, ${ledColor}, ${ledColor}dd)`,
                    boxShadow: `0 0 8px ${ledColor}, 0 0 12px ${ledColor}88, inset 0 1px 0 rgba(255,255,255,0.2)`,
                    border: '1px solid rgba(255,255,255,0.2)'
                  } : {}}
                />
              )
            })}
          </div>

          {/* Labels de la barre de LEDs */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-1">
            <span>BÉMOL</span>
            <span>0</span>
            <span>DIÈSE</span>
          </div>
        </div>

        {/* Indicateur de statut */}
        {state.note && (
          <div className="flex items-center justify-center gap-2">
            {state.isInTune ? (
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    background: '#00ff00',
                    boxShadow: '0 0 8px #00ff00, 0 0 12px #00ff00'
                  }}
                />
                <span 
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: '#00ff00' }}
                >
                  Accordé
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    background: state.cents > 0 ? '#ff0000' : '#ff6600',
                    boxShadow: state.cents > 0 
                      ? '0 0 8px #ff0000, 0 0 12px #ff0000'
                      : '0 0 8px #ff6600, 0 0 12px #ff6600'
                  }}
                />
                <span 
                  className="text-sm font-semibold uppercase tracking-wider"
                  style={{ color: state.cents > 0 ? '#ff0000' : '#ff6600' }}
                >
                  {state.cents > 0 ? 'Trop dièse' : 'Trop bémol'}
                </span>
              </div>
            )}
          </div>
        )}

        {!state.note && (
          <div className="text-center text-sm text-black/50 dark:text-white/50">
            En attente du signal...
          </div>
        )}
      </div>
    </div>
  )
}
