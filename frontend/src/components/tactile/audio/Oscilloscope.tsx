import { useEffect, useRef, useState } from 'react'
import { Pause, Play, Waves } from 'lucide-react'
import { cx } from '../../ui/cx'
import { IconAction, Panel, SegmentedPills } from '../primitives'

const SCOPE_BG = 'var(--neu-text)'
const SCOPE_ACCENT = 'var(--neu-accent)'

export type ScopeMode = 'scope' | 'phase'
export type ScopeWaveform = 'live' | 'sine' | 'saw' | 'square'

const WIDTH = 320
const HEIGHT = 200
const POINTS = 256
const CYCLES = 2.5
const SCROLL_CYCLES_PER_SECOND = 0.6

/** Forme d'onde périodique, `phase` en cycles, résultat dans [-1, 1]. */
export function waveAt(shape: Exclude<ScopeWaveform, 'live'>, phase: number): number {
  const fraction = phase - Math.floor(phase)
  if (shape === 'sine') return Math.sin(2 * Math.PI * phase)
  if (shape === 'saw') return 2 * fraction - 1
  return fraction < 0.5 ? 1 : -1
}

/** Signal « live » simulé : fondamentale, harmonique 3 qui dérive, bruit. */
const simulatedLive = (phase: number, time: number) =>
  0.65 * Math.sin(2 * Math.PI * phase) + 0.25 * Math.sin(2 * Math.PI * 3 * phase + time) + (Math.random() - 0.5) * 0.08

export interface OscilloscopeProps {
  /** Source réelle pour la forme « live ». Absente : signal simulé. */
  analyser?: AnalyserNode
  defaultMode?: ScopeMode
  defaultWaveform?: ScopeWaveform
  label?: string
  className?: string
}

/**
 * Oscilloscope (temps) et vectorscope (phase L/R, figure de Lissajous).
 * La boucle d'animation s'arrête en pause ; `prefers-reduced-motion` démarre en pause.
 */
export function Oscilloscope({
  analyser,
  defaultMode = 'scope',
  defaultWaveform = 'live',
  label = 'OSCILLOSCOPE',
  className,
}: OscilloscopeProps) {
  const [mode, setMode] = useState<ScopeMode>(defaultMode)
  const [waveform, setWaveform] = useState<ScopeWaveform>(defaultWaveform)
  const [running, setRunning] = useState(() => !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = WIDTH * dpr
    canvas.height = HEIGHT * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const buffer = analyser ? new Float32Array(analyser.fftSize) : null

    /** Échantillon de la voie gauche (`offset` = 0) ou droite (`offset` = déphasage en cycles). */
    const sample = (phase: number, ratio: number, offset: number) => {
      if (waveform !== 'live') return waveAt(waveform, phase + offset)
      if (buffer) return buffer[(Math.floor(ratio * (buffer.length - 1)) + Math.round(offset * 64)) % buffer.length] ?? 0
      return simulatedLive(phase + offset, timeRef.current)
    }

    const draw = () => {
      ctx.fillStyle = SCOPE_BG
      ctx.fillRect(0, 0, WIDTH, HEIGHT)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 1; i < 8; i++) {
        ctx.moveTo((WIDTH / 8) * i, 0)
        ctx.lineTo((WIDTH / 8) * i, HEIGHT)
      }
      for (let j = 1; j < 6; j++) {
        ctx.moveTo(0, (HEIGHT / 6) * j)
        ctx.lineTo(WIDTH, (HEIGHT / 6) * j)
      }
      ctx.stroke()

      if (analyser && buffer) analyser.getFloatTimeDomainData(buffer)
      const scroll = timeRef.current * SCROLL_CYCLES_PER_SECOND
      // Le déphasage L/R dérive lentement pour que la figure vive.
      const shift = waveform === 'live' ? 0.25 : 0.125 + 0.1 * Math.sin(timeRef.current)

      ctx.strokeStyle = SCOPE_ACCENT
      ctx.lineWidth = 2
      ctx.lineJoin = 'round'
      ctx.shadowColor = SCOPE_ACCENT
      ctx.shadowBlur = 6
      ctx.beginPath()
      for (let i = 0; i <= POINTS; i++) {
        const ratio = i / POINTS
        let x: number
        let y: number
        if (mode === 'scope') {
          x = ratio * WIDTH
          y = HEIGHT / 2 - sample(ratio * CYCLES + scroll, ratio, 0) * (HEIGHT / 2 - 12)
        } else {
          const size = Math.min(WIDTH, HEIGHT) / 2 - 12
          x = WIDTH / 2 + sample(ratio, ratio, 0) * size
          y = HEIGHT / 2 - sample(ratio, ratio, shift) * size
        }
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    draw()
    if (!running) return

    let frameId = 0
    let previous = performance.now()
    const tick = (now: number) => {
      timeRef.current += Math.min(0.05, (now - previous) / 1000)
      previous = now
      draw()
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [analyser, mode, running, waveform])

  return (
    <Panel depth="flat" className={cx('flex w-full max-w-md flex-col gap-4 rounded-3xl p-5', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--neu-edge)] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="neu-flat-sm grid h-8 w-8 place-items-center rounded-full text-[color:var(--neu-accent)]">
            <Waves className="h-4 w-4" />
          </span>
          <h4 className="text-xs font-bold tracking-tight text-[color:var(--neu-text)]">{label}</h4>
        </div>
        <IconAction
          size="sm"
          label={running ? 'Mettre en pause' : 'Reprendre'}
          pressed={!running}
          onClick={() => setRunning((current) => !current)}
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </IconAction>
      </div>

      <canvas
        ref={canvasRef}
        role="img"
        aria-label={mode === 'scope' ? 'Forme d’onde en fonction du temps' : 'Corrélation de phase gauche/droite'}
        className="block h-auto w-full rounded-2xl neu-inset"
        style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SegmentedPills
          label="Mode"
          size="sm"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'scope', label: 'Scope' },
            { value: 'phase', label: 'Phase' },
          ]}
        />
        <SegmentedPills
          label="Forme d’onde"
          size="sm"
          value={waveform}
          onChange={setWaveform}
          options={[
            { value: 'live', label: 'Live' },
            { value: 'sine', label: 'Sinus' },
            { value: 'saw', label: 'Dent' },
            { value: 'square', label: 'Carré' },
          ]}
        />
      </div>
    </Panel>
  )
}
