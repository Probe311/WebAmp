import { useState, useEffect, useRef } from 'react'
import { Metronome as MetronomeEngine, MetronomeConfig, MetronomeState } from '../audio/metronome'
import { CTA } from './CTA'
import { Slider } from './Slider'
import { Play, Pause, Square, ChevronDown, ChevronUp } from 'lucide-react'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'

export function Metronome() {
  const { engine } = usePedalboardEngine()
  const metronomeRef = useRef<MetronomeEngine | null>(null)
  const [state, setState] = useState<MetronomeState>({
    isPlaying: false,
    currentBeat: 0,
    currentSubdivision: 0
  })
  const [config, setConfig] = useState<MetronomeConfig>({
    tempo: 120,
    timeSignature: [4, 4],
    subdivisions: 4,
    accentFirstBeat: true
  })

  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      if (metronomeRef.current) {
        metronomeRef.current.stop()
      }
    }
  }, [])

  useEffect(() => {
    if (!metronomeRef.current) return

    const interval = setInterval(() => {
      const newState = metronomeRef.current?.getState()
      if (newState) {
        setState(newState)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const handlePlayPause = async () => {
    if (!engine) {
      console.warn('Engine non disponible')
      return
    }

    if (state.isPlaying && metronomeRef.current) {
      metronomeRef.current.stop()
      return
    }

    try {
      await engine.start()
    } catch (error) {
      console.error('Erreur démarrage moteur audio:', error)
      return
    }

    const audioCtx = engine.getAudioContext()
    if (!audioCtx) {
      console.warn('AudioContext non disponible après démarrage')
      return
    }

    if (audioCtx.state === 'suspended') {
      await audioCtx.resume()
    } else if (audioCtx.state === 'closed') {
      console.warn('AudioContext fermé, impossible de démarrer le métronome')
      return
    }

    if (!metronomeRef.current) {
      metronomeRef.current = new MetronomeEngine(audioCtx, config)
    } else {
      metronomeRef.current.setTempo(config.tempo)
      metronomeRef.current.setTimeSignature(config.timeSignature[0], config.timeSignature[1])
      metronomeRef.current.setSubdivisions(config.subdivisions)
      metronomeRef.current.setAccentFirstBeat(config.accentFirstBeat)
    }

    if (audioCtx.state === 'running') {
      metronomeRef.current.start()
    } else {
      console.warn('AudioContext non actif, impossible de démarrer le métronome. État:', audioCtx.state)
    }
  }

  const handleStop = () => {
    if (metronomeRef.current) {
      metronomeRef.current.stop()
      setState({
        isPlaying: false,
        currentBeat: 0,
        currentSubdivision: 0
      })
    }
  }

  const handleTempoChange = (tempo: number) => {
    const newTempo = Math.max(30, Math.min(300, tempo))
    setConfig({ ...config, tempo: newTempo })
    if (metronomeRef.current) {
      metronomeRef.current.setTempo(newTempo)
    }
  }

  const adjustTempo = (delta: number) => {
    handleTempoChange(config.tempo + delta)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 text-black/85 dark:text-white/90">
      {/* Contrôles BPM */}
      <div className="flex flex-col items-center gap-6">
        {/* Affichage BPM principal */}
        <div className="text-center">
          <div className="text-8xl font-bold text-black dark:text-white mb-2">
            {config.tempo}
          </div>
          <div className="text-sm font-bold uppercase tracking-wider text-black/70 dark:text-white/70">
            BPM
          </div>
        </div>

        {/* Contrôles BPM */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => adjustTempo(-1)}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.12),-3px_-3px_6px_rgba(255,255,255,1)] dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(70,70,70,0.6)] transition-all duration-200 touch-manipulation"
            aria-label="Diminuer BPM"
          >
            <ChevronDown size={20} />
          </button>
          
          <div className="w-64">
            <Slider
              value={config.tempo}
              min={30}
              max={300}
              onChange={handleTempoChange}
              label=""
              orientation="horizontal"
            />
          </div>

          <button
            onClick={() => adjustTempo(1)}
            className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.12),-3px_-3px_6px_rgba(255,255,255,1)] dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(70,70,70,0.6)] transition-all duration-200 touch-manipulation"
            aria-label="Augmenter BPM"
          >
            <ChevronUp size={20} />
          </button>
        </div>
      </div>

      {/* Indicateurs de beat */}
      <div className="flex items-center gap-2">
        {Array.from({ length: config.timeSignature[0] }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-12 rounded-full transition-all duration-100 ${
              i === state.currentBeat
                ? 'bg-orange-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                : 'bg-white dark:bg-gray-700 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]'
            }`}
          />
        ))}
      </div>

      {/* Contrôles de transport */}
      <div className="flex items-center gap-4">
        <CTA
          variant="important"
          icon={state.isPlaying ? <Pause size={24} /> : <Play size={24} />}
          onClick={handlePlayPause}
          active={state.isPlaying}
          className="w-20 h-20 rounded-full"
        />
        <CTA
          variant="secondary"
          icon={<Square size={20} />}
          onClick={handleStop}
          disabled={!state.isPlaying}
        >
          Stop
        </CTA>
      </div>

      {/* Informations */}
      <div className="text-sm text-black/70 dark:text-white/70 text-center">
        {config.timeSignature[0]}/{config.timeSignature[1]} - Beat {state.currentBeat + 1}
      </div>
    </div>
  )
}
