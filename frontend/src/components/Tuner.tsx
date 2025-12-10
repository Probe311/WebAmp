import { useState, useEffect, useRef } from 'react'
import { Tuner, TunerState, Tuning } from '../audio/tuner'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'

export function TunerComponent() {
  const { audioContext, audioSource } = usePedalboardEngine()
  const tunerRef = useRef<Tuner | null>(null)
  const [state, setState] = useState<TunerState>({
    note: null,
    cents: 0,
    frequency: 0,
    isInTune: false
  })
  const [tuning, setTuning] = useState<Tuning>('standard')

  useEffect(() => {
    if (audioContext && audioSource) {
      // Créer un AnalyserNode pour le tuner
      const analyser = audioContext.createAnalyser()
      audioSource.connect(analyser)
      
      tunerRef.current = new Tuner(audioContext, analyser)
      tunerRef.current.setTuning(tuning)
      
      return () => {
        try {
          audioSource.disconnect(analyser)
        } catch (e) {
          // Ignorer
        }
      }
    }
  }, [audioContext, audioSource, tuning])

  useEffect(() => {
    if (!tunerRef.current) return

    const interval = setInterval(() => {
      const newState = tunerRef.current?.detectNote()
      if (newState) {
        setState(newState)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const getCentsColor = (cents: number): string => {
    if (Math.abs(cents) < 5) return 'text-green-500'
    if (Math.abs(cents) < 20) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getNeedlePosition = (cents: number): number => {
    // -50 à +50 cents -> 0% à 100%
    return 50 + cents
  }

  return (
    <div className="space-y-6 text-black/85 dark:text-white/90">
      {/* Sélection de l'accordage */}
      <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
        <label className="block text-sm font-semibold mb-2">Accordage:</label>
        <select
          value={tuning}
          onChange={(e) => {
            setTuning(e.target.value as Tuning)
            tunerRef.current?.setTuning(e.target.value as Tuning)
          }}
          className="w-full px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-black/20 dark:border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
        >
          <option value="standard">Standard (EADGBE)</option>
          <option value="dropD">Drop D (DADGBE)</option>
          <option value="dropC">Drop C (CGCFAD)</option>
          <option value="openG">Open G (DGDGBD)</option>
          <option value="openD">Open D (DADF#AD)</option>
          <option value="dadgad">DADGAD</option>
        </select>
      </div>

      {/* Affichage de la note */}
      {state.note ? (
        <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
          <div className="text-center mb-4">
            <div className="text-6xl font-bold text-black dark:text-white mb-2">
              {state.note}
            </div>
            <div className="text-sm text-black/70 dark:text-white/70">
              {state.frequency.toFixed(1)} Hz
            </div>
          </div>

          {/* Aiguille visuelle */}
          <div className="relative h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
            <div className="absolute inset-0 flex items-center">
              {/* Marqueurs */}
              <div className="absolute left-0 w-full h-1 bg-gray-300 dark:bg-gray-600" />
              <div className="absolute left-1/2 w-1 h-8 bg-gray-400 dark:bg-gray-500 -translate-x-1/2" />
              
              {/* Aiguille */}
              <div
                className="absolute top-1/2 left-1/2 w-1 h-16 bg-red-500 origin-top -translate-x-1/2 transition-transform"
                style={{
                  transform: `translateX(-50%) rotate(${getNeedlePosition(state.cents) * 3.6 - 90}deg)`
                }}
              />
            </div>
          </div>

          <div className={`text-center text-xl font-semibold ${getCentsColor(state.cents)} mb-2`}>
            {state.cents > 0 ? '+' : ''}{state.cents.toFixed(1)} cents
          </div>

          <div className="text-center">
            {state.isInTune ? (
              <span className="text-green-500 font-semibold">✓ Accordé</span>
            ) : (
              <span className="text-yellow-500">
                {state.cents > 0 ? 'Trop haut' : 'Trop bas'}
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
          <div className="text-center mb-4">
            <div className="text-6xl font-bold text-black/30 dark:text-white/30 mb-2">
              —
            </div>
            <div className="text-sm text-black/50 dark:text-white/50">
              Aucun signal
            </div>
          </div>

          {/* Tuner visuel inactif */}
          <div 
            className="relative mx-auto mb-4"
            style={{
              width: '280px',
              height: '280px',
              background: '#ffffff',
              borderRadius: '50%',
              boxShadow: `
                8px 8px 16px rgba(0, 0, 0, 0.1),
                -8px -8px 16px rgba(255, 255, 255, 0.9),
                inset 0 0 0 1px rgba(255, 255, 255, 0.8)
              `
            }}
          >
            {/* Marqueurs du cadran */}
            <div className="absolute inset-0">
              {/* Marqueurs principaux (-50, -25, 0, +25, +50 cents) */}
              {[-50, -25, 0, 25, 50].map((cent, index) => {
                const angle = (cent * 3.6) - 90 // -50 cents = -180°, 0 = -90°, +50 = 0°
                const isCenter = cent === 0
                const radius = 120
                const x = 140 + Math.cos((angle * Math.PI) / 180) * radius
                const y = 140 + Math.sin((angle * Math.PI) / 180) * radius
                
                return (
                  <div
                    key={index}
                    className={`absolute ${isCenter ? 'w-1 h-12' : 'w-0.5 h-6'} bg-black/20 dark:bg-white/20`}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                      transformOrigin: 'center'
                    }}
                  />
                )
              })}
              
              {/* Marqueurs secondaires (tous les 5 cents) */}
              {Array.from({ length: 21 }, (_, i) => i - 10).map((cent, index) => {
                if (cent % 25 === 0) return null // Déjà dessinés
                const angle = (cent * 3.6) - 90
                const radius = 120
                const x = 140 + Math.cos((angle * Math.PI) / 180) * radius
                const y = 140 + Math.sin((angle * Math.PI) / 180) * radius
                
                return (
                  <div
                    key={`minor-${index}`}
                    className="absolute w-0.5 h-3 bg-black/10 dark:bg-white/10"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                      transformOrigin: 'center'
                    }}
                  />
                )
              })}
              
              {/* Labels des marqueurs principaux */}
              {[-50, -25, 0, 25, 50].map((cent, index) => {
                const angle = (cent * 3.6) - 90
                const radius = 100
                const x = 140 + Math.cos((angle * Math.PI) / 180) * radius
                const y = 140 + Math.sin((angle * Math.PI) / 180) * radius
                
                return (
                  <div
                    key={`label-${index}`}
                    className="absolute text-xs font-semibold text-black/40 dark:text-white/40"
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {cent > 0 ? '+' : ''}{cent}
                  </div>
                )
              })}
              
              {/* Zone centrale (accordé) */}
              <div
                className="absolute rounded-full bg-green-500/10 dark:bg-green-400/10"
                style={{
                  width: '60px',
                  height: '60px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid rgba(34, 197, 94, 0.2)'
                }}
              />
              
              {/* Aiguille inactif (centrée) */}
              <div
                className="absolute top-1/2 left-1/2 w-1 h-24 bg-black/30 dark:bg-white/30 origin-top transition-transform"
                style={{
                  transform: 'translateX(-50%) rotate(-90deg)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              />
              
              {/* Point central */}
              <div
                className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-black/40 dark:bg-white/40"
                style={{
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `
                    inset 1px 1px 2px rgba(0, 0, 0, 0.2),
                    -1px -1px 2px rgba(255, 255, 255, 0.8)
                  `
                }}
              />
            </div>
          </div>

          <div className="text-center text-sm text-black/50 dark:text-white/50">
            En attente de signal...
          </div>
        </div>
      )}
    </div>
  )
}
