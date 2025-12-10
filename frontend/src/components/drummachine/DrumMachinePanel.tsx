import { Play, Pause, Square, RotateCcw, Volume2 } from 'lucide-react'
import { CTA } from '../CTA'
import { Slider } from '../Slider'
import { useDrumMachine, DrumInstrument } from '../../contexts/DrumMachineContext'
import { DEFAULT_PATTERNS } from '../../contexts/patterns'

const INSTRUMENTS: DrumInstrument[] = ['kick', 'snare', 'hihat', 'openhat', 'crash', 'ride', 'tom1', 'tom2']
const INSTRUMENT_LABELS: Record<DrumInstrument, string> = {
  kick: 'Kick',
  snare: 'Snare',
  hihat: 'Hi-Hat',
  openhat: 'Open Hat',
  crash: 'Crash',
  ride: 'Ride',
  tom1: 'Tom 1',
  tom2: 'Tom 2'
}

const INSTRUMENT_COLORS: Record<DrumInstrument, string> = {
  kick: '#ef4444',
  snare: '#3b82f6',
  hihat: '#10b981',
  openhat: '#06b6d4',
  crash: '#f59e0b',
  ride: '#8b5cf6',
  tom1: '#ec4899',
  tom2: '#f97316'
}

const NUM_STEPS = 16

export function DrumMachinePanel() {
  const {
    isPlaying,
    masterVolume,
    currentStep,
    bpm,
    pattern,
    selectedPattern,
    volumes,
    setBpm,
    setPattern,
    setSelectedPattern,
    toggleStep,
    handlePlayPause,
    handleStop,
    handlePatternChange,
    handleVolumeChange,
    setMasterVolume
  } = useDrumMachine()

  // La boucle de lecture est maintenant gérée dans le contexte global
  // pour continuer même si la modale est fermée

  const handleReset = () => {
    setPattern([...DEFAULT_PATTERNS[0].steps])
    setSelectedPattern(0)
  }

  const handlePatternSelect = (index: number) => {
    handlePatternChange(index)
    setPattern([...DEFAULT_PATTERNS[index].steps])
  }

  return (
    <div className="space-y-6 text-black/85 dark:text-white/90">
      {/* Contrôles principaux */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <CTA
            variant="primary"
            icon={isPlaying ? <Pause size={18} /> : <Play size={18} />}
            onClick={(e) => {
              e.stopPropagation()
              handlePlayPause()
            }}
            active={isPlaying}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </CTA>
          <CTA
            variant="secondary"
            icon={<Square size={18} />}
            onClick={handleStop}
          >
            Stop
          </CTA>
          <CTA
            variant="secondary"
            icon={<RotateCcw size={18} />}
            onClick={handleReset}
          >
            Reset
          </CTA>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <span>BPM:</span>
            <input
              type="number"
              min="60"
              max="200"
              value={bpm}
              onChange={(e) => setBpm(Math.max(60, Math.min(200, parseInt(e.target.value) || 120)))}
              className="w-20 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
            />
          </label>
          <Slider
            value={bpm}
            min={60}
            max={200}
            onChange={(value) => setBpm(value)}
            label=""
            orientation="horizontal"
            className="w-32"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Master</span>
            <Slider
              value={masterVolume}
              min={0}
              max={100}
              onChange={(value) => setMasterVolume(value)}
              label=""
              orientation="horizontal"
              className="w-32"
            />
          </div>
        </div>
      </div>

      {/* Patterns prédéfinis */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Patterns prédéfinis (BPM & volumes):</label>
        <div className="flex gap-2 flex-wrap">
          {DEFAULT_PATTERNS.map((p, index) => (
            <CTA
              key={index}
              variant="secondary"
              onClick={() => handlePatternSelect(index)}
              active={selectedPattern === index}
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="font-semibold">{p.name}</span>
                <span className="text-[11px] text-black/60 dark:text-white/60">BPM: {p.bpm ?? '—'}</span>
              </div>
            </CTA>
          ))}
        </div>
      </div>

      {/* Grille de pas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Séquenceur</h3>
          <div className="text-xs text-black/50 dark:text-white/50">
            {NUM_STEPS} steps
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10 p-4 overflow-x-auto">
          <div className="min-w-max">
            {/* En-tête avec numéros de steps */}
            <div className="grid grid-cols-[96px_repeat(16,40px)_120px] gap-1 mb-2 items-center">
              <div />
              {Array.from({ length: NUM_STEPS }).map((_, stepIndex) => (
                <div
                  key={stepIndex}
                  className={`h-6 flex items-center justify-center text-xs font-semibold rounded ${
                    stepIndex === currentStep && isPlaying
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-gray-100 dark:bg-gray-600 text-black/60 dark:text-white/60'
                  }`}
                >
                  {stepIndex + 1}
                </div>
              ))}
              <div />
            </div>

            {/* Lignes d'instruments */}
            {INSTRUMENTS.map((instrument) => (
              <div key={instrument} className="grid grid-cols-[96px_repeat(16,40px)_160px] gap-1 mb-1 items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: INSTRUMENT_COLORS[instrument] }}
                  />
                  <span className="text-sm font-medium">{INSTRUMENT_LABELS[instrument]}</span>
                </div>
                {Array.from({ length: NUM_STEPS }).map((_, stepIndex) => (
                  <button
                    key={stepIndex}
                    onClick={() => toggleStep(stepIndex, instrument)}
                    onTouchStart={(e) => {
                      e.preventDefault()
                      toggleStep(stepIndex, instrument)
                    }}
                    className={`h-10 rounded transition-all duration-150 touch-manipulation ${
                      pattern[stepIndex]?.[instrument]
                        ? 'bg-opacity-100 shadow-md'
                        : 'bg-gray-200 dark:bg-gray-600 bg-opacity-30'
                    } ${
                      stepIndex === currentStep && isPlaying
                        ? 'ring-2 ring-black dark:ring-white ring-offset-1'
                        : ''
                    }`}
                    style={{
                      backgroundColor: pattern[stepIndex]?.[instrument]
                        ? INSTRUMENT_COLORS[instrument]
                        : undefined,
                      minWidth: '40px',
                      minHeight: '40px'
                    }}
                  />
                ))}
                <div className="flex items-center gap-3 pl-2">
                  <Volume2 size={14} className="text-black/50 dark:text-white/50" />
                  <Slider
                    value={volumes[instrument]}
                    min={0}
                    max={100}
                    onChange={(value) => handleVolumeChange(instrument, value)}
                    label=""
                    orientation="horizontal"
                    className="w-28"
                  />
                  <span className="text-xs w-12 text-right">{volumes[instrument]}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
