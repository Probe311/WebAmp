import { useState, useEffect, useRef } from 'react'
import { Metronome as MetronomeEngine, MetronomeConfig, MetronomeState } from '../audio/metronome'
import { CTA } from './CTA'
import { Slider } from './Slider'
import { Play, Pause, Square } from 'lucide-react'
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

    // Si le métronome est en pause, le reprendre
    if (state.isPlaying && metronomeRef.current) {
      metronomeRef.current.stop()
      return
    }

    // Démarrer le moteur audio si nécessaire
    try {
      await engine.start()
    } catch (error) {
      console.error('Erreur démarrage moteur audio:', error)
      return
    }

    // Obtenir l'AudioContext après le démarrage
    const audioCtx = engine.getAudioContext()
    if (!audioCtx) {
      console.warn('AudioContext non disponible après démarrage')
      return
    }

    // S'assurer que l'AudioContext est actif
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume()
    } else if (audioCtx.state === 'closed') {
      console.warn('AudioContext fermé, impossible de démarrer le métronome')
      return
    }

    // Recréer le métronome si nécessaire ou si la config a changé
    if (!metronomeRef.current) {
      metronomeRef.current = new MetronomeEngine(audioCtx, config)
    } else {
      // Mettre à jour la config si elle a changé
      metronomeRef.current.setTempo(config.tempo)
      metronomeRef.current.setTimeSignature(config.timeSignature[0], config.timeSignature[1])
      metronomeRef.current.setSubdivisions(config.subdivisions)
      metronomeRef.current.setAccentFirstBeat(config.accentFirstBeat)
    }

    // Démarrer le métronome
    if (audioCtx.state === 'running') {
      console.log('Démarrage du métronome...', { tempo: config.tempo, timeSignature: config.timeSignature, subdivisions: config.subdivisions })
      metronomeRef.current.start()
      console.log('Métronome démarré, état:', metronomeRef.current.getState())
    } else {
      console.warn('AudioContext non actif, impossible de démarrer le métronome. État:', audioCtx.state)
    }
  }

  const handleStop = () => {
    if (metronomeRef.current) {
      metronomeRef.current.stop()
      // Réinitialiser l'état
      setState({
        isPlaying: false,
        currentBeat: 0,
        currentSubdivision: 0
      })
    }
  }

  const handleTempoChange = (tempo: number) => {
    setConfig({ ...config, tempo })
  }

  const handleTimeSignatureChange = (beats: number, noteValue: number) => {
    setConfig({ ...config, timeSignature: [beats, noteValue] })
  }

  const handleSubdivisionsChange = (subdivisions: number) => {
    setConfig({ ...config, subdivisions })
  }

  return (
    <div className="space-y-6 text-black/85 dark:text-white/90">
      {/* Contrôles principaux */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <CTA
            variant="primary"
            icon={state.isPlaying ? <Pause size={18} /> : <Play size={18} />}
            onClick={handlePlayPause}
            active={state.isPlaying}
          >
            {state.isPlaying ? 'Pause' : 'Start'}
          </CTA>
          <CTA
            variant="secondary"
            icon={<Square size={18} />}
            onClick={handleStop}
            disabled={!state.isPlaying}
          >
            Stop
          </CTA>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium flex items-center gap-2">
            <span>BPM:</span>
            <input
              type="number"
              min="30"
              max="300"
              value={config.tempo}
              onChange={(e) => handleTempoChange(Math.max(30, Math.min(300, parseInt(e.target.value) || 120)))}
              className="w-20 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
            />
          </label>
          <Slider
            value={config.tempo}
            min={30}
            max={300}
            onChange={handleTempoChange}
            label=""
            orientation="horizontal"
            className="w-32"
          />
        </div>
      </div>

      {/* Affichage du tempo */}
      <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
        <div className="text-center">
          <div className="text-6xl font-bold text-black dark:text-white mb-2">
            {config.tempo} BPM
          </div>
          <div className="text-sm text-black/70 dark:text-white/70">
            {config.timeSignature[0]}/{config.timeSignature[1]} - Beat {state.currentBeat + 1}
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Signature rythmique:</label>
          <select
            value={`${config.timeSignature[0]}/${config.timeSignature[1]}`}
            onChange={(e) => {
              const [beats, noteValue] = e.target.value.split('/').map(Number)
              handleTimeSignatureChange(beats, noteValue)
            }}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-black/20 dark:border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          >
            <option value="4/4">4/4</option>
            <option value="3/4">3/4</option>
            <option value="2/4">2/4</option>
            <option value="6/8">6/8</option>
            <option value="7/8">7/8</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Subdivisions:</label>
          <select
            value={config.subdivisions}
            onChange={(e) => handleSubdivisionsChange(Number(e.target.value))}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-black/20 dark:border-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          >
            <option value="1">Noires</option>
            <option value="2">Croches</option>
            <option value="4">Doubles croches</option>
            <option value="8">Triples croches</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Accent sur le premier temps:</label>
          <input
            type="checkbox"
            checked={config.accentFirstBeat}
            onChange={(e) => {
              setConfig({ ...config, accentFirstBeat: e.target.checked })
            }}
            className="w-5 h-5 rounded border-black/20 dark:border-white/20 focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
          />
        </div>
      </div>
    </div>
  )
}
