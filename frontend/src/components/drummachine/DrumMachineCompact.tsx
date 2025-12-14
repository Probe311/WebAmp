import { Play, Pause, Square, Maximize2 } from 'lucide-react'
import { CTA } from '../CTA'
import { Slider } from '../Slider'
import { useDrumMachine, DrumInstrument } from '../../contexts/DrumMachineContext'
import { useMemo } from 'react'
import { DrumPad } from './DrumPad'

// Instruments pour la version compacte (grille 3x3)
const COMPACT_INSTRUMENTS: DrumInstrument[] = [
  'kick', 'snare', 'hihat',
  'openhat', 'crash', 'ride',
  'tom1', 'tom2', 'tom3'
]

export function DrumMachineCompact({ onExpand }: { onExpand?: () => void }) {
  const {
    isPlaying,
    isActive,
    masterVolume,
    currentStep,
    bpm,
    pattern,
    handlePlayPause,
    handleStop,
    setBpm,
    setMasterVolume,
    toggleStep,
    playSound
  } = useDrumMachine()

  // Ne rien afficher si la boîte à rythmes n'est pas active
  if (!isActive) {
    return null
  }

  // Déterminer quels instruments sont actifs au step actuel
  const activeInstruments = useMemo(() => {
    if (!isPlaying || currentStep === undefined) return new Set<DrumInstrument>()
    const stepData = pattern[currentStep]
    if (!stepData) return new Set<DrumInstrument>()
    
    const active = new Set<DrumInstrument>()
    COMPACT_INSTRUMENTS.forEach(instrument => {
      if (stepData[instrument]) {
        active.add(instrument)
      }
    })
    return active
  }, [isPlaying, currentStep, pattern])

  const handlePadClick = (instrument: DrumInstrument) => {
    // Jouer le son immédiatement
    playSound(instrument)
    // Toggle le step actuel si en lecture, sinon toggle le premier step
    const stepToToggle = isPlaying && currentStep !== undefined ? currentStep : 0
    toggleStep(stepToToggle, instrument)
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-2xl p-4 border border-black/10 dark:border-white/10 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] overflow-hidden">
      {/* En-tête avec titre et bouton expand */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-black/90 dark:text-white/90">Boîte à rythmes</h3>
        {onExpand && (
          <CTA
            variant="icon-only"
            icon={<Maximize2 size={14} />}
            onClick={onExpand}
            title="Ouvrir en plein écran"
            className="w-7 h-7"
          />
        )}
      </div>

      {/* Contrôles Play/Pause/Stop */}
      <div className="flex items-center gap-2 mb-3">
        <CTA
          variant="important"
          icon={isPlaying ? <Pause size={14} /> : <Play size={14} />}
          onClick={handlePlayPause}
          active={isPlaying}
          className="flex-1 text-xs py-1.5"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </CTA>
        <CTA
          variant="secondary"
          icon={<Square size={14} />}
          onClick={handleStop}
          className="px-2 py-1.5"
        />
      </div>

      {/* BPM et Master Volume */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-black/70 dark:text-white/70 w-10">BPM</span>
          <input
            type="number"
            min="60"
            max="200"
            value={bpm}
            onChange={(e) => setBpm(Math.max(60, Math.min(200, parseInt(e.target.value) || 120)))}
            className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-700 rounded border border-black/10 dark:border-white/10 text-center focus:outline-none focus:ring-1 focus:ring-black/20 dark:focus:ring-white/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-black/70 dark:text-white/70 w-10">Vol</span>
          <Slider
            value={masterVolume}
            min={0}
            max={100}
            onChange={(value) => setMasterVolume(value)}
            label=""
            orientation="horizontal"
            className="flex-1"
          />
        </div>
      </div>

      {/* Grille de pads 3x3 */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="text-xs font-medium text-black/60 dark:text-white/60 mb-2 text-center">
          Pads
        </div>
        <div className="flex-1 min-h-0 grid grid-cols-3 grid-rows-3 gap-x-2 gap-y-2">
          {COMPACT_INSTRUMENTS.map((instrument) => {
            const isActive = activeInstruments.has(instrument)
            // Vérifier si l'instrument est activé dans le pattern (step actuel si en lecture, sinon step 0)
            const checkStep = isPlaying && currentStep !== undefined ? currentStep : 0
            const isStepActive = pattern[checkStep]?.[instrument] || false
            
            return (
              <DrumPad
                key={instrument}
                instrument={instrument}
                isActive={isActive}
                isStepActive={isStepActive}
                onClick={() => handlePadClick(instrument)}
                size="small"
                showLabel={true}
                className="w-full h-full aspect-square"
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
