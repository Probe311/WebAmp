import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Activity } from 'lucide-react'
import { cx } from '../../ui/cx'
import { RangeField } from '../forms/RangeField'
import { spectrumColor } from '../lib/spectrum'
import { Panel, SegmentedPills } from '../primitives'

/** Centres des 10 bandes de l'analyseur temps réel (octaves, Hz). */
export const RTA_FREQUENCIES = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000] as const

export interface EqBand {
  /** Fréquence centrale en Hz. */
  freq: number
  /** Gain en dB. */
  gain: number
  /** Facteur de qualité. */
  q: number
}

export const DEFAULT_EQ_BANDS: readonly EqBand[] = [
  { freq: 100, gain: 0, q: 1 },
  { freq: 500, gain: 0, q: 1 },
  { freq: 2500, gain: 0, q: 1 },
  { freq: 10000, gain: 0, q: 1 },
]

const SAMPLE_RATE = 48000
const F_MIN = 20
const F_MAX = 20000
const GAIN_RANGE = 18
const VIEW_W = 320
const VIEW_H = 120
const SEGMENTS = 14

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
const freqToX = (freq: number) => (Math.log(freq / F_MIN) / Math.log(F_MAX / F_MIN)) * VIEW_W
const gainToY = (gain: number) => VIEW_H / 2 - (gain / GAIN_RANGE) * (VIEW_H / 2)

/** Réponse en dB d'un filtre en cloche (biquad RBJ « peaking ») à la fréquence `f`. */
export function peakingResponseDb({ freq, gain, q }: EqBand, f: number): number {
  const w0 = (2 * Math.PI * freq) / SAMPLE_RATE
  const amp = 10 ** (gain / 40)
  const alpha = Math.sin(w0) / (2 * q)
  const cosW0 = Math.cos(w0)
  const [b0, b1, b2] = [1 + alpha * amp, -2 * cosW0, 1 - alpha * amp]
  const [a0, a1, a2] = [1 + alpha / amp, -2 * cosW0, 1 - alpha / amp]
  const w = (2 * Math.PI * f) / SAMPLE_RATE
  const power = (c0: number, c1: number, c2: number) =>
    (c0 + c1 * Math.cos(w) + c2 * Math.cos(2 * w)) ** 2 + (c1 * Math.sin(w) + c2 * Math.sin(2 * w)) ** 2
  return 10 * Math.log10(power(b0, b1, b2) / power(a0, a1, a2))
}

const totalResponseDb = (bands: readonly EqBand[], f: number) =>
  bands.reduce((sum, band) => sum + peakingResponseDb(band, f), 0)

export interface SpectrumAnalyzerProps {
  /** Niveaux 0 → 1 des 10 bandes RTA. Absents : signal simulé (si `live`). */
  levels?: readonly number[]
  live?: boolean
  /** Bandes de l'égaliseur paramétrique (4 attendues). */
  eq: readonly EqBand[]
  onEqChange: (bands: EqBand[]) => void
  label?: string
  className?: string
}

/**
 * Analyseur 10 bandes + égaliseur paramétrique 4 bandes.
 *
 * Le nœud d'une bande se déplace à la souris/au toucher (fréquence en
 * logarithmique, gain linéaire) ou au clavier (flèches) ; gain et Q ont
 * aussi leur curseur.
 */
export function SpectrumAnalyzer({
  levels,
  live = true,
  eq,
  onEqChange,
  label = 'ANALYSEUR & ÉGALISEUR',
  className,
}: SpectrumAnalyzerProps) {
  const [simulated, setSimulated] = useState<number[]>(() => RTA_FREQUENCIES.map(() => 0))
  const [selected, setSelected] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)

  const useSimulation = !levels && live
  useEffect(() => {
    if (!useSimulation) return
    const timer = window.setInterval(() => {
      setSimulated((previous) =>
        previous.map((value, index) => value * 0.6 + 0.4 * (0.8 - index * 0.04) * (0.4 + 0.6 * Math.random()))
      )
    }, 80)
    return () => window.clearInterval(timer)
  }, [useSimulation])

  const bars = levels ?? simulated

  const updateBand = (index: number, patch: Partial<EqBand>) =>
    onEqChange(eq.map((band, i) => (i === index ? { ...band, ...patch } : band)))

  const moveTo = (clientX: number, clientY: number) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return
    const rx = clamp((clientX - rect.left) / rect.width, 0, 1)
    const ry = clamp((clientY - rect.top) / rect.height, 0, 1)
    updateBand(selected, {
      freq: Math.round(F_MIN * (F_MAX / F_MIN) ** rx),
      gain: Math.round((0.5 - ry) * 2 * GAIN_RANGE * 2) / 2,
    })
  }

  const onNodeKeyDown = (index: number, event: KeyboardEvent<SVGGElement>) => {
    const band = eq[index]
    const moves: Record<string, Partial<EqBand>> = {
      ArrowLeft: { freq: Math.round(clamp(band.freq / 2 ** (1 / 12), F_MIN, F_MAX)) },
      ArrowRight: { freq: Math.round(clamp(band.freq * 2 ** (1 / 12), F_MIN, F_MAX)) },
      ArrowUp: { gain: Math.min(GAIN_RANGE, band.gain + 0.5) },
      ArrowDown: { gain: Math.max(-GAIN_RANGE, band.gain - 0.5) },
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    updateBand(index, moves[event.key])
  }

  const curve = Array.from({ length: 96 }, (_, i) => {
    const f = F_MIN * (F_MAX / F_MIN) ** (i / 95)
    return `${i === 0 ? 'M' : 'L'}${freqToX(f).toFixed(1)} ${gainToY(clamp(totalResponseDb(eq, f), -GAIN_RANGE, GAIN_RANGE)).toFixed(1)}`
  }).join(' ')

  const band = eq[selected]
  const formatFreq = (freq: number) => (freq >= 1000 ? `${+(freq / 1000).toFixed(1)}k` : `${freq}`)

  return (
    <Panel depth="flat" className={cx('flex w-full max-w-md flex-col gap-4 rounded-3xl p-5', className)}>
      <div className="flex items-center gap-2.5 border-b border-[color:var(--neu-edge)] pb-3">
        <span className="neu-flat-sm grid h-8 w-8 place-items-center rounded-full text-[color:var(--neu-accent)]">
          <Activity className="h-4 w-4" />
        </span>
        <h4 className="text-xs font-bold tracking-tight text-[color:var(--neu-text)]">{label}</h4>
      </div>

      <div
        role="img"
        aria-label="Analyseur de spectre 10 bandes"
        className="flex gap-1.5 rounded-2xl neu-inset p-2.5"
      >
        {RTA_FREQUENCIES.map((freq, index) => {
          const lit = Math.round(clamp(bars[index] ?? 0, 0, 1) * SEGMENTS)
          return (
            <div key={freq} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-24 w-full flex-col-reverse gap-[2px]">
                {Array.from({ length: SEGMENTS }, (_, segment) => (
                  <div
                    key={segment}
                    className="w-full flex-1 rounded-full transition-colors duration-75"
                    style={{
                      backgroundColor: segment < lit ? spectrumColor(index / (RTA_FREQUENCIES.length - 1)) : 'var(--neu-bg-hollow)',
                    }}
                  />
                ))}
              </div>
              <span className="font-mono text-[9px] font-bold text-[color:var(--neu-text-muted)]">{formatFreq(freq)}</span>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        <SegmentedPills
          label="Bande d'égalisation"
          size="sm"
          value={String(selected)}
          onChange={(value) => setSelected(Number(value))}
          options={eq.map((_, index) => ({ value: String(index), label: `Bande ${index + 1}` }))}
        />

        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="block h-auto w-full touch-none rounded-2xl neu-inset"
          onPointerMove={(event: PointerEvent<SVGSVGElement>) => dragging.current && moveTo(event.clientX, event.clientY)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          {[100, 1000, 10000].map((freq) => (
            <line key={freq} x1={freqToX(freq)} x2={freqToX(freq)} y1={0} y2={VIEW_H} stroke="var(--neu-bg-hollow)" strokeWidth={1} />
          ))}
          <line x1={0} x2={VIEW_W} y1={VIEW_H / 2} y2={VIEW_H / 2} stroke="var(--neu-text-faint)" strokeWidth={1} strokeDasharray="3 3" />
          <path d={curve} fill="none" stroke="var(--neu-accent)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          {eq.map((node, index) => {
            const active = index === selected
            return (
              <g
                key={index}
                tabIndex={0}
                role="slider"
                aria-label={`Bande ${index + 1}`}
                aria-valuemin={-GAIN_RANGE}
                aria-valuemax={GAIN_RANGE}
                aria-valuenow={node.gain}
                aria-valuetext={`${node.freq} Hz, ${node.gain} dB`}
                className="cursor-grab focus-visible:outline-none"
                onFocus={() => setSelected(index)}
                onKeyDown={(event) => onNodeKeyDown(index, event)}
                onPointerDown={(event) => {
                  event.preventDefault()
                  event.currentTarget.setPointerCapture?.(event.pointerId)
                  setSelected(index)
                  dragging.current = true
                }}
              >
                <circle
                  cx={freqToX(node.freq)}
                  cy={gainToY(clamp(totalResponseDb(eq, node.freq), -GAIN_RANGE, GAIN_RANGE))}
                  r={active ? 7 : 5}
                  fill={active ? 'var(--neu-accent)' : 'var(--neu-bg)'}
                  stroke="var(--neu-accent)"
                  strokeWidth={2}
                />
              </g>
            )
          })}
        </svg>

        <div className="flex items-center justify-between px-1 font-mono text-[10px] font-bold text-[color:var(--neu-text-muted)]">
          <span>
            FRÉQ. <strong className="text-[color:var(--neu-text)]">{band.freq} Hz</strong>
          </span>
          <span>{`±${GAIN_RANGE} dB`}</span>
        </div>

        <RangeField label="Gain" unit="dB" min={-GAIN_RANGE} max={GAIN_RANGE} step={0.5} value={band.gain} onChange={(gain) => updateBand(selected, { gain })} />
        <RangeField label="Q" min={0.3} max={10} step={0.1} value={band.q} onChange={(q) => updateBand(selected, { q })} />
      </div>
    </Panel>
  )
}
