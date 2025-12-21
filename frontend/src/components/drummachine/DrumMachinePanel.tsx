import { useMemo, useCallback, useState } from 'react'
import { Play, Pause, Square, RotateCcw, Volume2, Music, X } from 'lucide-react'
import { CTA } from '../CTA'
import { Slider } from '../Slider'
import { useDrumMachine, DrumInstrument, DrumStep } from '../../contexts/DrumMachineContext'
import { DEFAULT_PATTERNS } from '../../contexts/patterns'
import { DrumPad, INSTRUMENT_LABELS, INSTRUMENT_COLORS } from './DrumPad'
import { AIBeatArchitect } from '../ai/AIBeatArchitect'
import { BeatPattern } from '../../services/ai'
import { DrumSampleSelector } from './DrumSampleSelector'

const INSTRUMENTS: DrumInstrument[] = ['kick', 'snare', 'hihat', 'openhat', 'crash', 'ride', 'tom1', 'tom2', 'tom3']

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
    sampleSources,
    setBpm,
    setPattern,
    setSelectedPattern,
    toggleStep,
    handlePlayPause,
    handleStop,
    handlePatternChange,
    handleVolumeChange,
    setMasterVolume,
    loadSample,
    clearSample
  } = useDrumMachine()

  const [selectedInstrument, setSelectedInstrument] = useState<DrumInstrument | null>(null)

  // La boucle de lecture est maintenant gérée dans le contexte global
  // pour continuer même si la modale est fermée

  const handleReset = () => {
    setPattern([...DEFAULT_PATTERNS[0].steps])
    setSelectedPattern(0)
  }

  const handlePatternSelect = useCallback((index: number) => {
    handlePatternChange(index)
    setPattern([...DEFAULT_PATTERNS[index].steps])
  }, [handlePatternChange, setPattern])

  // Fonction pour appliquer un pattern généré par l'IA
  const handleApplyAIPattern = useCallback((aiPattern: BeatPattern) => {
    // Convertir le format BeatPattern en format DrumStep[]
    const convertedSteps: DrumStep[] = Array.from({ length: 16 }, () => ({}))
    
    aiPattern.steps.forEach((step) => {
      const stepIndex = step.step
      if (stepIndex >= 0 && stepIndex < 16) {
        step.instruments.forEach((instrument) => {
          convertedSteps[stepIndex][instrument] = true
        })
      }
    })

    // Appliquer le pattern
    setPattern(convertedSteps)
    
    // Mettre à jour le BPM si fourni
    if (aiPattern.tempo) {
      setBpm(aiPattern.tempo)
    }
  }, [setPattern, setBpm])

  // Mémoriser les callbacks pour chaque step/instrument pour éviter les re-renders
  const stepCallbacks = useMemo(() => {
    const callbacks: Record<string, () => void> = {}
    INSTRUMENTS.forEach(instrument => {
      Array.from({ length: NUM_STEPS }).forEach((_, stepIndex) => {
        const key = `${instrument}-${stepIndex}`
        callbacks[key] = () => toggleStep(stepIndex, instrument)
      })
    })
    return callbacks
  }, [toggleStep])

  // Gérer la sélection d'un sample
  const handleSampleSelected = useCallback(async (audioBlob: Blob, name: string) => {
    if (!selectedInstrument) return
    await loadSample(selectedInstrument, audioBlob, name)
  }, [selectedInstrument, loadSample])

  // Gérer la suppression d'un sample
  const handleClearSample = useCallback((instrument: DrumInstrument) => {
    clearSample(instrument)
  }, [clearSample])

  return (
    <div className="space-y-6 text-black/85 dark:text-white/90">
      {/* Contrôles principaux */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <CTA
            variant="icon-only"
            icon={isPlaying ? <Pause size={18} /> : <Play size={18} />}
            onClick={(e) => {
              e.stopPropagation()
              handlePlayPause()
            }}
            active={isPlaying}
            title={isPlaying ? 'Pause' : 'Play'}
            className={isPlaying ? 'bg-green-500/20 border-green-500/60 text-green-600 dark:text-green-400' : ''}
          />
          <CTA
            variant="icon-only"
            icon={<Square size={18} />}
            onClick={handleStop}
            title="Stop"
          />
          <CTA
            variant="icon-only"
            icon={<RotateCcw size={18} />}
            onClick={handleReset}
            title="Reset"
          />
          <AIBeatArchitect
            onApplyPattern={handleApplyAIPattern}
            currentTempo={bpm}
            renderAsButton={true}
          />
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
        
        <div className="bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10 p-4 overflow-x-auto custom-scrollbar">
          <div className="min-w-max">
            {/* En-tête avec numéros de steps */}
            <div className="grid grid-cols-[160px_60px_repeat(16,40px)_200px] gap-1.5 mb-2 items-center">
              <div className="text-xs font-semibold text-black/60 dark:text-white/60 px-2">
                Instrument
              </div>
              <div className="text-xs font-semibold text-black/60 dark:text-white/60 px-2 text-center">
                Sample
              </div>
              {Array.from({ length: NUM_STEPS }).map((_, stepIndex) => (
                <div
                  key={stepIndex}
                  className={`h-6 w-full min-w-[40px] flex items-center justify-center text-xs font-semibold rounded ${
                    stepIndex === currentStep && isPlaying
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'bg-gray-100 dark:bg-gray-600 text-black/60 dark:text-white/60'
                  }`}
                >
                  {stepIndex + 1}
                </div>
              ))}
              <div className="text-xs font-semibold text-black/60 dark:text-white/60 px-2">
                Volume
              </div>
            </div>

            {/* Lignes d'instruments */}
            {INSTRUMENTS.map((instrument) => {
              const hasSample = !!sampleSources[instrument]
              return (
                <div key={instrument} className="grid grid-cols-[160px_60px_repeat(16,40px)_200px] gap-1.5 mb-1.5 items-center">
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: INSTRUMENT_COLORS[instrument] }}
                    />
                    <span className="text-sm font-medium truncate">{INSTRUMENT_LABELS[instrument]}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <CTA
                      variant="icon-only"
                      icon={<Music size={14} />}
                      onClick={() => setSelectedInstrument(instrument)}
                      title={hasSample ? `Sample: ${sampleSources[instrument]}` : 'Charger un sample depuis Freesound'}
                      className={hasSample ? 'text-blue-600 dark:text-blue-400' : ''}
                    />
                    {hasSample && (
                      <CTA
                        variant="icon-only"
                        icon={<X size={14} />}
                        onClick={() => handleClearSample(instrument)}
                        title="Supprimer le sample (revenir au synth)"
                        className="text-red-600 dark:text-red-400"
                      />
                    )}
                  </div>
                  {Array.from({ length: NUM_STEPS }).map((_, stepIndex) => {
                    const isStepActive = pattern[stepIndex]?.[instrument] || false
                    const isCurrentStepActive = stepIndex === currentStep && isPlaying && isStepActive
                    const callbackKey = `${instrument}-${stepIndex}`
                    
                    return (
                      <DrumPad
                        key={stepIndex}
                        instrument={instrument}
                        isActive={isCurrentStepActive}
                        isStepActive={isStepActive}
                        onClick={stepCallbacks[callbackKey]}
                        size="medium"
                        showLabel={false}
                        className="w-full min-w-[40px]"
                      />
                    )
                  })}
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
              )
            })}
          </div>
        </div>
      </div>

      {/* Sélecteur de samples */}
      {selectedInstrument && (
        <DrumSampleSelector
          isOpen={!!selectedInstrument}
          onClose={() => setSelectedInstrument(null)}
          instrument={selectedInstrument}
          onSampleSelected={handleSampleSelected}
          currentSampleName={sampleSources[selectedInstrument]}
        />
      )}
    </div>
  )
}
