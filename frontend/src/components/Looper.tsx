import { useState, useRef, useEffect } from 'react'
import { Looper as LooperEngine, LooperState } from '../audio/looper'
import { CTA } from './CTA'
import { Play, Pause, Square, Repeat, RotateCcw, Download } from 'lucide-react'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'

export function Looper() {
  const { engine } = usePedalboardEngine()
  const looperRef = useRef<LooperEngine | null>(null)
  const [state, setState] = useState<LooperState>({
    isRecording: false,
    isPlaying: false,
    loopLength: 0,
    currentPosition: 0,
    tracks: []
  })

  // Cleanup lors du démontage
  useEffect(() => {
    return () => {
      if (looperRef.current) {
        looperRef.current.stopPlayback()
        looperRef.current.stopRecording()
      }
    }
  }, [])

  useEffect(() => {
    if (!looperRef.current) return

    const interval = setInterval(() => {
      const newState = looperRef.current?.getState()
      if (newState) {
        setState(newState)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleRecord = async () => {
    if (!engine) {
      console.warn('Engine non disponible')
      return
    }

    // Démarrer le moteur audio si nécessaire (comme le métronome)
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
      console.warn('AudioContext fermé, impossible de démarrer l\'enregistrement')
      return
    }

    // Recréer le looper si nécessaire
    if (!looperRef.current) {
      looperRef.current = new LooperEngine(audioCtx, {
        maxLength: 60,
        sampleRate: audioCtx.sampleRate
      })
      // Reconnecter la sortie
      const output = engine.getOutput()
      if (output) {
        looperRef.current.connectInput(output)
      }
    }

    if (state.isRecording) {
      looperRef.current.stopRecording()
    } else {
      // Vérifier une dernière fois que l'AudioContext est actif
      if (audioCtx.state === 'running') {
        looperRef.current.startRecording()
      } else {
        console.warn('AudioContext non actif, impossible de démarrer l\'enregistrement. État:', audioCtx.state)
      }
    }
  }

  const handlePlay = async () => {
    if (!engine) {
      console.warn('Engine non disponible')
      return
    }

    // Démarrer le moteur audio si nécessaire (comme le métronome)
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
      console.warn('AudioContext fermé, impossible de démarrer la lecture')
      return
    }

    // Recréer le looper si nécessaire
    if (!looperRef.current) {
      looperRef.current = new LooperEngine(audioCtx, {
        maxLength: 60,
        sampleRate: audioCtx.sampleRate
      })
      // Reconnecter la sortie
      const output = engine.getOutput()
      if (output) {
        looperRef.current.connectInput(output)
      }
    }

    if (state.isPlaying) {
      looperRef.current.stopPlayback()
    } else {
      // Vérifier une dernière fois que l'AudioContext est actif
      if (audioCtx.state === 'running') {
        looperRef.current.startPlayback()
      } else {
        console.warn('AudioContext non actif, impossible de démarrer la lecture. État:', audioCtx.state)
      }
    }
  }

  const handleOverdub = async () => {
    if (!engine) {
      console.warn('Engine non disponible')
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
    if (!audioCtx || !looperRef.current) {
      console.warn('AudioContext ou Looper non disponible')
      return
    }

    // S'assurer que l'AudioContext est actif
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume()
    } else if (audioCtx.state === 'closed') {
      console.warn('AudioContext fermé, impossible de démarrer l\'overdub')
      return
    }

    // Recréer le looper si nécessaire
    if (!looperRef.current) {
      looperRef.current = new LooperEngine(audioCtx, {
        maxLength: 60,
        sampleRate: audioCtx.sampleRate
      })
      // Reconnecter la sortie
      const output = engine.getOutput()
      if (output) {
        looperRef.current.connectInput(output)
      }
    }

    if (audioCtx.state === 'running') {
      looperRef.current.startOverdub()
    } else {
      console.warn('AudioContext non actif, impossible de démarrer l\'overdub. État:', audioCtx.state)
    }
  }

  const handleClear = () => {
    looperRef.current?.clear()
  }

  const handleReverse = () => {
    looperRef.current?.toggleReverse()
  }

  const handleExport = async () => {
    const blob = await looperRef.current?.exportToWAV()
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `loop-${Date.now()}.wav`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 text-black/85 dark:text-white/90">
      {/* Contrôles principaux */}
      <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
        <div className="flex items-center gap-3">
          <CTA
            variant="primary"
            icon={state.isRecording ? <Pause size={18} /> : <Play size={18} />}
            onClick={handleRecord}
            active={state.isRecording}
          >
            {state.isRecording ? 'Stop' : 'Record'}
          </CTA>
          <CTA
            variant="primary"
            icon={state.isPlaying ? <Pause size={18} /> : <Play size={18} />}
            onClick={handlePlay}
            active={state.isPlaying}
          >
            {state.isPlaying ? 'Stop' : 'Play'}
          </CTA>
          <CTA
            variant="secondary"
            icon={<Repeat size={18} />}
            onClick={handleOverdub}
          >
            Overdub
          </CTA>
          <CTA
            variant="secondary"
            icon={<RotateCcw size={18} />}
            onClick={handleReverse}
          >
            Reverse
          </CTA>
          <CTA
            variant="secondary"
            icon={<Square size={18} />}
            onClick={handleClear}
          >
            Clear
          </CTA>
          <CTA
            variant="secondary"
            icon={<Download size={18} />}
            onClick={handleExport}
            disabled={state.tracks.length === 0}
          >
            Export
          </CTA>
        </div>
      </div>

      {/* Affichage du temps */}
      <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
        <div className="text-center">
          <div className="text-4xl font-bold text-black dark:text-white mb-2">
            {formatTime(state.currentPosition)} / {formatTime(state.loopLength)}
          </div>
          <div className="text-sm text-black/70 dark:text-white/70">
            {state.tracks.length} piste(s)
          </div>
          {!engine && (
            <div className="text-xs text-red-500 mt-2">
              Engine non disponible - Cliquez sur un bouton pour activer
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
