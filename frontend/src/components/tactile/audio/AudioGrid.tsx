import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { cx } from '../../ui/cx'
import { useControllable } from '../lib/useControllable'

export type AudioGridMode = 'toggle' | 'momentary'
/** @deprecated Conservé pour compat. */
export type AudioGridVariant = 'speaker' | 'pads'
/** @deprecated Conservé pour compat. */
export type AudioGridPattern = 'matrix' | 'radial'

const PAD_COUNT = 16
const MATRIX_SIZE = 7
const MATRIX_CENTER = Math.floor(MATRIX_SIZE / 2)
/** Distance max centre → coin (≈ 4.24). */
const MATRIX_MAX_DIST = Math.hypot(MATRIX_CENTER, MATRIX_CENTER)

const DEFAULT_PAD_LABELS = [
  'CRASH', 'RIDE', 'CHINA', 'HH-C',
  'HH-O', 'SNARE', 'KICK', 'TOM1',
  'TOM2', 'TOM3', 'TOM4', 'CLAP',
  'RIM', 'FX 1', 'FX 2', 'VOX',
] as const

export interface AudioGridProps {
  active?: readonly number[]
  activePads?: readonly number[]
  defaultActive?: readonly number[]
  onActiveChange?: (active: readonly number[]) => void
  mode?: AudioGridMode
  onTrigger?: (index: number) => void
  onPadTrigger?: (index: number) => void
  labels?: readonly string[]
  variant?: AudioGridVariant
  pattern?: AudioGridPattern
  /**
   * Compteur incrémenté à chaque hit (pad / step) — déclenche une onde
   * circulaire fluide depuis le centre.
   */
  pulse?: number
  /** @deprecated Utiliser `pulse`. */
  level?: number
  label?: string
  sublabel?: string
  className?: string
}

/** Softstep 0→1. */
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)))
  return t * t * (3 - 2 * t)
}

/** Pads 4×4 + matrice 7×7 en deux sous-blocs séparés. */
export function AudioGrid({
  active,
  activePads,
  defaultActive = [],
  onActiveChange,
  mode = 'toggle',
  onTrigger,
  onPadTrigger,
  labels,
  pulse = 0,
  className,
}: AudioGridProps) {
  const padsValue = active ?? activePads
  const [lit, setLit] = useControllable<readonly number[]>(padsValue, defaultActive, onActiveChange)
  const [held, setHeld] = useState<number | null>(null)
  const [flash, setFlash] = useState<number | null>(null)
  /** Rayon normalisé 0–1 de l’onde (centre → bord). */
  const [waveR, setWaveR] = useState(0)
  const [waveAmp, setWaveAmp] = useState(0)
  const rafRef = useRef<number | null>(null)

  const fire = onTrigger ?? onPadTrigger

  const press = (index: number) => {
    fire?.(index)
    setFlash(index)
    window.setTimeout(() => setFlash((cur) => (cur === index ? null : cur)), 220)
    if (mode === 'toggle') setLit(lit.includes(index) ? lit.filter((item) => item !== index) : [...lit, index])
    else setHeld(index)
  }
  const release = () => setHeld(null)

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.repeat || (event.key !== ' ' && event.key !== 'Enter')) return
    event.preventDefault()
    press(index)
  }

  // Onde circulaire fluide : expansion + fade
  useEffect(() => {
    if (pulse <= 0) return
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current)

    const start = performance.now()
    const duration = 520

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // ease-out cubic sur le rayon
      const eased = 1 - (1 - t) ** 3
      setWaveR(eased)
      // amplitude : monte vite puis redescend
      const amp = t < 0.18 ? smoothstep(0, 0.18, t) : 1 - smoothstep(0.18, 1, t)
      setWaveAmp(amp)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setWaveR(0)
        setWaveAmp(0)
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [pulse])

  const block =
    'flex w-full flex-col items-center gap-3 rounded-3xl border border-[color:var(--neu-edge)] bg-[color:var(--neu-bg)] p-4 sm:p-5'

  return (
    <div className={cx('flex h-full min-h-0 w-full max-w-sm flex-col gap-3', className)}>
      {/* Sous-bloc pads — padding bas resserré (TOM4 ↔ border) */}
      <div className={cx(block, 'shrink-0 !px-4 !pb-2 !pt-4 sm:!px-5 sm:!pb-2.5 sm:!pt-5')}>
        <div
          role="group"
          aria-label="Pads"
          className="grid w-full max-w-[260px] grid-cols-4 gap-3 rounded-2xl neu-inset p-2.5"
        >
          {Array.from({ length: PAD_COUNT }, (_, index) => {
            const on = mode === 'toggle' ? lit.includes(index) : held === index
            const isFlash = flash === index
            const padLabel = labels?.[index] ?? DEFAULT_PAD_LABELS[index] ?? String(index + 1)
            return (
              <button
                key={index}
                type="button"
                aria-label={`Pad ${padLabel}`}
                aria-pressed={on}
                onPointerDown={() => press(index)}
                onPointerUp={release}
                onPointerLeave={release}
                onKeyDown={(event) => onKeyDown(event, index)}
                onKeyUp={release}
                className={cx(
                  'flex aspect-square cursor-pointer touch-none select-none flex-col items-center justify-between rounded-xl p-1.5 transition-all duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/60',
                  isFlash
                    ? 'scale-95 neu-pressed ring-2 ring-[color:var(--neu-accent)]'
                    : on
                      ? 'neu-pressed text-[color:var(--neu-accent)]'
                      : 'neu-cta-flat text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)] active:scale-95 active:neu-pressed'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cx(
                    'h-1.5 w-1.5 self-end rounded-full',
                    on || isFlash
                      ? 'bg-[color:var(--neu-accent)] shadow-[0_0_6px_var(--neu-accent)]'
                      : 'bg-[color:var(--neu-bg-hollow)]'
                  )}
                />
                <span className="font-mono text-[9px] font-bold tracking-tight">{padLabel}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sous-bloc matrice — bas, aligné séquenceur ; sans header */}
      <div className={cx(block, 'mt-auto shrink-0')} aria-hidden>
        <div className="relative flex aspect-square w-full max-w-[260px] items-center justify-center rounded-2xl neu-inset p-3.5">
          <div className="grid w-full grid-cols-7 place-items-center gap-2">
            {Array.from({ length: MATRIX_SIZE * MATRIX_SIZE }, (_, idx) => {
              const row = Math.floor(idx / MATRIX_SIZE)
              const col = idx % MATRIX_SIZE
              const dist = Math.hypot(row - MATRIX_CENTER, col - MATRIX_CENTER) / MATRIX_MAX_DIST
              // Anneau doux autour du rayon + glow intérieur
              const ring = 1 - Math.abs(dist - waveR) / 0.22
              const inside = 1 - smoothstep(waveR - 0.08, waveR + 0.05, dist)
              const raw = Math.max(0, ring, inside * 0.55) * waveAmp
              const litDot = raw > 0.04
              const intensity = Math.min(1, raw)
              return (
                <div
                  key={idx}
                  className="h-2.5 w-2.5 rounded-full sm:h-3 sm:w-3"
                  style={{
                    backgroundColor: litDot ? 'var(--neu-accent)' : 'var(--neu-bg-hollow)',
                    opacity: litDot ? 0.25 + intensity * 0.75 : 1,
                    boxShadow: litDot
                      ? `0 0 ${4 + intensity * 8}px var(--neu-accent-glow)`
                      : 'inset 1.5px 1.5px 3px rgba(var(--neu-shadow-dark), 0.75), inset -1px -1px 2px rgba(var(--neu-shadow-light), 0.85)',
                    transform: `scale(${1 + intensity * 0.35})`,
                    transition: 'background-color 40ms linear, opacity 40ms linear, transform 40ms linear, box-shadow 40ms linear',
                  }}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
