import { useState, useEffect, useRef } from 'react'
import { Tuner, TunerState, Tuning } from '../audio/tuner'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'
import { Dropdown, DropdownOption } from './Dropdown'

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

  const tuningOptions: DropdownOption[] = [
    { value: 'standard', label: 'Standard (EADGBE)' },
    { value: 'dropD', label: 'Drop D (DADGBE)' },
    { value: 'dropC', label: 'Drop C (CGCFAD)' },
    { value: 'openG', label: 'Open G (DGDGBD)' },
    { value: 'openD', label: 'Open D (DADF#AD)' },
    { value: 'dadgad', label: 'DADGAD' }
  ]

  useEffect(() => {
    if (audioContext && audioSource) {
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
    return Math.max(0, Math.min(100, 50 + cents))
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 text-black/85 dark:text-white/90">
      {/* Sélection de l'accordage */}
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

      {/* Affichage principal */}
      <div className="flex flex-col items-center gap-6">
        {/* Note principale */}
        <div className="relative">
          <div className="w-48 h-48 rounded-full border-4 border-black/20 dark:border-white/20 flex items-center justify-center bg-white dark:bg-gray-700 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)]">
            {state.note ? (
              <div className="text-center">
                <div className="text-7xl font-bold text-black dark:text-white">
                  {state.note}
                </div>
                {state.note.includes('♯') && (
                  <div className="text-2xl font-bold text-black/50 dark:text-white/50 -mt-2">
                    {state.note.replace('♯', '')}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-7xl font-bold text-black/30 dark:text-white/30">
                —
              </div>
            )}
          </div>
        </div>

        {/* Indicateur de cent */}
        {state.note && (
          <div className="flex flex-col items-center gap-2 w-full max-w-md">
            {/* Barre de cent */}
            <div className="relative w-full h-2 bg-white dark:bg-gray-700 rounded-full shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] overflow-hidden">
              {/* Zone verte (accordé) */}
              <div className="absolute left-1/2 -translate-x-1/2 w-[20%] h-full bg-green-500/30" />
              {/* Indicateur */}
              <div
                className={`absolute top-0 h-full w-1 transition-all duration-75 ${
                  Math.abs(state.cents) < 5 ? 'bg-green-500' :
                  Math.abs(state.cents) < 20 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ left: `${getNeedlePosition(state.cents)}%`, transform: 'translateX(-50%)' }}
              />
            </div>
            
            {/* Texte de cent */}
            <div className={`text-xl font-bold ${getCentsColor(state.cents)}`}>
              {state.cents > 0 ? '+' : ''}{state.cents.toFixed(0)} cents
            </div>
            
            {/* Statut */}
            <div className="text-sm text-black/70 dark:text-white/70">
              {state.isInTune ? (
                <span className="text-green-500 font-semibold">✓ Accordé</span>
              ) : (
                <span className={state.cents > 0 ? 'text-yellow-500' : 'text-red-500'}>
                  {state.cents > 0 ? 'Trop haut' : 'Trop bas'}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Fréquence */}
        {state.note && (
          <div className="text-sm text-black/50 dark:text-white/50 font-mono">
            {state.frequency.toFixed(1)} Hz
          </div>
        )}

        {!state.note && (
          <div className="text-sm text-black/50 dark:text-white/50">
            En attente de signal...
          </div>
        )}
      </div>
    </div>
  )
}
