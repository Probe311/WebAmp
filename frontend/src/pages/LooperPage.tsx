import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, Repeat, Square } from 'lucide-react'
import { AppPageShell } from '../components/shell/AppPageShell'
import {
  CTA_ICON_CLASS,
  CtaButton,
  WaveformDisplay,
  type LoopRegion,
  type WaveformRate,
} from '../components/tactile'
import { cx } from '../components/ui/cx'
import { Looper as LooperEngine } from '../audio/looper'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'
import { generateWaveformData } from '../components/looper/utils'
import { setLooperSessionBuffer } from '../audio/looperSession'

const CTA_SIZE = 'm' as const
const iconCls = CTA_ICON_CLASS[CTA_SIZE]
const PEAK_BARS = 256

function peaksFromTracks(tracks: Float32Array[]): number[] {
  if (tracks.length === 0) return []
  const longest = tracks.reduce((a, b) => (a.length >= b.length ? a : b))
  const mixed = new Float32Array(longest.length)
  for (const track of tracks) {
    for (let i = 0; i < track.length; i++) mixed[i] += track[i] / tracks.length
  }
  return generateWaveformData(mixed, PEAK_BARS).map((p) => Math.min(1, p / 100))
}

/** Looper Softube : Record/Play/Loop branchés sur LooperEngine + sortie pedalboard. */
export function LooperPage() {
  const { engine, start } = usePedalboardEngine({ enableAudioInput: true })
  const looperRef = useRef<LooperEngine | null>(null)
  const [recording, setRecording] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [looping, setLooping] = useState(true)
  const [position, setPosition] = useState(0)
  const [region, setRegion] = useState<LoopRegion | null>(null)
  const [rate, setRate] = useState<WaveformRate>(1)
  const [peaks, setPeaks] = useState<number[]>([])
  const [durationSec, setDurationSec] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const loopingRef = useRef(looping)
  const prevNormRef = useRef(0)
  loopingRef.current = looping

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      try {
        await start()
        const audioCtx = engine.getAudioContext()
        if (!audioCtx || cancelled) return
        if (audioCtx.state === 'suspended') await audioCtx.resume()
        if (!looperRef.current) {
          looperRef.current = new LooperEngine(audioCtx, {
            maxLength: 60,
            sampleRate: audioCtx.sampleRate,
          })
          const output = engine.getOutput()
          if (output) looperRef.current.connectInput(output)
        }
      } catch {
        /* init silencieux */
      }
    }
    void init()
    return () => {
      cancelled = true
      looperRef.current?.stopPlayback()
      looperRef.current?.stopRecording()
    }
  }, [engine, start])

  useEffect(() => {
    looperRef.current?.setPlaybackSpeed(rate)
  }, [rate])

  useEffect(() => {
    const id = window.setInterval(() => {
      const looper = looperRef.current
      if (!looper) return
      const state = looper.getState()
      setRecording(state.isRecording)
      setPlaying(state.isPlaying)
      setDurationSec(state.loopLength)
      setPeaks(peaksFromTracks(state.tracks))
      setLooperSessionBuffer(looper.exportToAudioBuffer())
      if (state.loopLength > 0) {
        const norm = state.currentPosition / state.loopLength
        if (state.isPlaying) {
          setPosition(norm)
          if (!loopingRef.current && prevNormRef.current > 0.85 && norm < 0.15) {
            looper.stopPlayback()
            setPlaying(false)
            setPosition(1)
          }
          prevNormRef.current = norm
        }
        let sum = 0
        for (const t of state.tracks) {
          const i = Math.min(t.length - 1, Math.floor(norm * t.length))
          sum += Math.abs(t[i] ?? 0)
        }
        setAudioLevel(state.isPlaying || state.isRecording ? Math.min(1, sum / Math.max(1, state.tracks.length) * 4) : 0)
      } else if (state.isRecording) {
        setAudioLevel(0.4 + Math.random() * 0.2)
      } else {
        setAudioLevel(0)
      }
    }, 80)
    return () => window.clearInterval(id)
  }, [])

  const ensureReady = useCallback(async () => {
    await start()
    const audioCtx = engine.getAudioContext()
    if (!audioCtx) return null
    if (audioCtx.state === 'suspended') await audioCtx.resume()
    if (!looperRef.current) {
      looperRef.current = new LooperEngine(audioCtx, {
        maxLength: 60,
        sampleRate: audioCtx.sampleRate,
      })
      const output = engine.getOutput()
      if (output) looperRef.current.connectInput(output)
    }
    return looperRef.current
  }, [engine, start])

  const toggleRecord = useCallback(async () => {
    const looper = await ensureReady()
    if (!looper) return
    if (looper.getState().isRecording) {
      looper.stopRecording()
      setRecording(false)
      const state = looper.getState()
      setDurationSec(state.loopLength)
      setPeaks(peaksFromTracks(state.tracks))
      setLooperSessionBuffer(looper.exportToAudioBuffer())
    } else {
      looper.stopPlayback()
      setPlaying(false)
      setPosition(0)
      looper.startRecording()
      setRecording(true)
    }
  }, [ensureReady])

  const togglePlay = useCallback(async () => {
    const looper = await ensureReady()
    if (!looper) return
    const state = looper.getState()
    if (state.isPlaying) {
      looper.stopPlayback()
      setPlaying(false)
    } else if (state.tracks.length > 0) {
      if (state.isRecording) looper.stopRecording()
      setRecording(false)
      looper.setPlaybackSpeed(rate)
      looper.startPlayback()
      setPlaying(true)
    }
  }, [ensureReady, rate])

  const ctas = (
    <>
      <CtaButton
        label={recording ? "Arrêter l'enregistrement" : 'Enregistrer'}
        size={CTA_SIZE}
        tone="danger"
        pressed={recording}
        onClick={() => void toggleRecord()}
      >
        <span
          className={cx(
            'block rounded-full',
            recording
              ? 'h-3.5 w-3.5 bg-[var(--td-danger)] shadow-[0_0_8px_rgba(239,68,68,0.7)]'
              : 'h-3 w-3 border-2 border-current'
          )}
        />
      </CtaButton>

      <CtaButton
        label={playing ? 'Stop' : 'Lecture'}
        size={CTA_SIZE}
        tone="accent"
        pressed={playing}
        onClick={() => void togglePlay()}
      >
        {playing ? (
          <Square className={cx(iconCls, 'fill-current')} />
        ) : (
          <Play className={iconCls} />
        )}
      </CtaButton>

      <CtaButton
        label={looping ? 'Désactiver la boucle' : 'Activer la boucle'}
        size={CTA_SIZE}
        tone="accent"
        pressed={looping}
        onClick={() => setLooping((v) => !v)}
      >
        <Repeat className={iconCls} />
      </CtaButton>
    </>
  )

  return (
    <AppPageShell fill className="!overflow-visible !pl-3.5 !pr-3 !pb-3 !pt-2 sm:!pl-4 sm:!pr-3.5 sm:!pb-3.5 sm:!pt-2.5">
      <WaveformDisplay
        peaks={peaks}
        position={position}
        onSeek={setPosition}
        loop={region}
        onLoopChange={setRegion}
        rate={rate}
        onRateChange={setRate}
        isPlaying={playing || recording}
        audioLevel={audioLevel}
        durationSec={durationSec}
        aside={ctas}
        compact
        className="h-full"
      />
    </AppPageShell>
  )
}
