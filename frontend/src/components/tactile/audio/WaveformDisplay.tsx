import { useMemo, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { Repeat, Scissors } from 'lucide-react'
import { cx } from '../../ui/cx'
import { clamp, useControllable } from '../lib/useControllable'
import { useRatioDrag } from '../lib/useRatioDrag'

/** Région de boucle en fractions 0 → 1 de la durée totale. */
export type LoopRegion = readonly [start: number, end: number]

export type WaveformRate = 1 | 2 | 4

const MIN_LOOP = 0.005
const RATES: readonly WaveformRate[] = [1, 2, 4]
/**
 * Compact Looper : colonne CTA M (`w-10`) + onde ≈ stack 3×40 + gaps.
 * Secondary controls = S (`h-8`) — parity MIDI `octBtn`.
 */
const COMPACT_ASIDE_W = 'w-10'
const COMPACT_CTRL =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/50'

/** Forme d'onde de démonstration, déterministe. */
export function demoPeaks(count = 256): number[] {
  return Array.from({ length: count }, (_, i) => {
    const t = i / count
    const envelope = 0.35 + 0.65 * Math.abs(Math.sin(t * Math.PI * 3.1))
    const grain = 0.55 + 0.45 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.31))
    return clamp(envelope * grain, 0.04, 1)
  })
}

/** Timing Softube : `01:17.0`. */
export function formatWaveTime(seconds: number) {
  const safe = Math.max(0, seconds)
  const m = Math.floor(safe / 60)
  const s = Math.floor(safe % 60)
  const tenth = Math.floor((safe % 1) * 10)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${tenth}`
}

export interface WaveformDisplayProps {
  peaks?: readonly number[]
  position?: number
  defaultPosition?: number
  onSeek?: (position: number) => void
  loop?: LoopRegion | null
  defaultLoop?: LoopRegion | null
  onLoopChange?: (loop: LoopRegion | null) => void
  /** Vitesse lecture 1x / 2x / 4x. */
  rate?: WaveformRate
  defaultRate?: WaveformRate
  onRateChange?: (rate: WaveformRate) => void
  trackName?: string
  isPlaying?: boolean
  audioLevel?: number
  durationSec?: number
  sampleRateLabel?: string
  channelsLabel?: string
  /** Colonne gauche alignée sur le canvas (ex. CTAs looper). */
  aside?: ReactNode
  /** Densité mini (Looper 33%×25%) : barre S + onde = hauteur CTA M. */
  compact?: boolean
  /** Masque LOOP A-B + vitesses + meta (pistes DAW). */
  hideTransport?: boolean
  className?: string
}

/**
 * Forme d'onde Softube.
 * Compact : barre S alignée à l'onde ; canvas étiré sur la colonne CTA M.
 */
export function WaveformDisplay({
  peaks,
  position,
  defaultPosition = 0,
  onSeek,
  loop,
  defaultLoop = null,
  onLoopChange,
  rate,
  defaultRate = 1,
  onRateChange,
  trackName,
  isPlaying = false,
  audioLevel = 0,
  durationSec,
  sampleRateLabel = '48 kHz',
  channelsLabel = 'STEREO',
  aside,
  compact = false,
  hideTransport = false,
  className,
}: WaveformDisplayProps) {
  const data = useMemo(() => peaks ?? demoPeaks(), [peaks])
  const [pos, setPos] = useControllable(position, defaultPosition, onSeek)
  const [region, setRegion] = useControllable<LoopRegion | null>(loop, defaultLoop, onLoopChange)
  const [speed, setSpeed] = useControllable(rate, defaultRate, onRateChange)

  const span = 1
  const windowStart = 0

  const anchor = useRef<number | null>(null)
  const { ref, handlers } = useRatioDrag<HTMLDivElement>((x, _y, event, phase) => {
    const fraction = clamp(x, 0, 1)
    if (phase === 'start') anchor.current = event.shiftKey ? fraction : null
    if (anchor.current === null) {
      setPos(Number(fraction.toFixed(4)))
    } else {
      const [start, end] = [Math.min(anchor.current, fraction), Math.max(anchor.current, fraction)]
      if (end - start >= MIN_LOOP) setRegion([start, end])
    }
  })

  const onKeyDown = (event: KeyboardEvent) => {
    const step = 0.02
    if (event.key === 'ArrowLeft') setPos(clamp(pos - step, 0, 1))
    else if (event.key === 'ArrowRight') setPos(clamp(pos + step, 0, 1))
    else if (event.key === 'Home') setPos(0)
    else if (event.key === 'End') setPos(1)
    else return
    event.preventDefault()
  }

  const playedCount = clamp(Math.round(pos * data.length), 0, data.length)
  const toPercent = (fraction: number) => `${((fraction - windowStart) / span) * 100}%`
  const elapsed = durationSec != null ? formatWaveTime(pos * durationSec) : null
  const total = durationSec != null ? formatWaveTime(durationSec) : null
  const levelPct = clamp(audioLevel, 0, 1) * 100
  const loopOn = !!region
  const showChrome = trackName || isPlaying || audioLevel > 0
  const freqShort =
    channelsLabel === 'STEREO'
      ? `${sampleRateLabel.replace(' ', '')} · ST`
      : `${sampleRateLabel} · ${channelsLabel}`

  const toggleLoopAb = () => {
    if (region) setRegion(null)
    else setRegion([0.15, 0.55])
  }

  const transportBar = !hideTransport && (
    <div
      className={cx(
        'flex shrink-0 flex-nowrap items-center overflow-hidden',
        compact ? 'gap-1.5' : 'gap-2'
      )}
    >
      <button
        type="button"
        aria-pressed={loopOn}
        aria-label="Boucle A-B"
        onClick={toggleLoopAb}
        className={cx(
          'neu-inset inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full font-bold tracking-wider transition-shadow',
          COMPACT_CTRL,
          compact ? 'h-8 min-w-[2rem] px-2.5 text-[10px]' : 'min-h-9 gap-2 px-3.5 text-[11px]',
          loopOn
            ? 'text-[color:var(--neu-accent)]'
            : 'text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]'
        )}
      >
        <Repeat className={compact ? 'h-3.5 w-3.5' : 'h-3.5 w-3.5'} aria-hidden />
        {compact ? 'A-B' : 'LOOP A-B'}
      </button>

      <div
        role="group"
        aria-label="Vitesse de lecture"
        className={cx(
          'neu-inset flex shrink-0 items-center rounded-full',
          compact ? 'h-8 gap-0 p-0.5' : 'gap-0.5 p-1'
        )}
      >
        {RATES.map((value) => {
          const active = speed === value
          return (
            <button
              key={value}
              type="button"
              aria-pressed={active}
              aria-label={`Vitesse ${value}x`}
              onClick={() => setSpeed(value)}
              className={cx(
                'cursor-pointer rounded-full font-bold transition-shadow',
                COMPACT_CTRL,
                compact ? 'h-full min-w-8 px-2 text-[10px]' : 'min-h-8 min-w-10 px-3 text-xs',
                active
                  ? 'neu-cta-flat text-[color:var(--neu-accent)]'
                  : 'bg-transparent text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]'
              )}
            >
              {value}x
            </button>
          )
        })}
      </div>

      <div
        className={cx(
          'ml-auto flex min-w-0 shrink items-center',
          compact ? 'gap-2' : 'gap-2'
        )}
      >
        {(elapsed || total) && (
          <div
            className={cx(
              'flex items-center gap-1 font-mono font-bold tabular-nums',
              compact ? 'text-[11px]' : 'text-[12px]'
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            {elapsed ? (
              <span className="text-[color:var(--neu-accent)]" title="Position">
                {elapsed}
              </span>
            ) : null}
            {elapsed && total ? (
              <span className="text-[color:var(--neu-text-faint)]" aria-hidden>
                /
              </span>
            ) : null}
            {total ? (
              <span className="text-[color:var(--neu-text-muted)]" title="Durée">
                {total}
              </span>
            ) : null}
          </div>
        )}
        <div
          className={cx(
            'flex items-center gap-1 font-bold tracking-wide text-[color:var(--neu-text-muted)]',
            compact ? 'text-[10px]' : 'text-[10px]'
          )}
          title="Fréquence / canaux"
        >
          <Scissors className="h-3.5 w-3.5 text-[color:var(--neu-accent)]" aria-hidden />
          <span>{compact ? freqShort : `${sampleRateLabel} · ${channelsLabel}`}</span>
        </div>
      </div>
    </div>
  )

  const waveCanvas = (
    <div
      ref={ref}
      {...handlers}
      role="slider"
      tabIndex={0}
      aria-label="Position de lecture"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pos * 100)}
      onKeyDown={onKeyDown}
      className={cx(
        'relative min-w-0 cursor-pointer touch-none overflow-hidden neu-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/60',
        compact
          ? 'h-full min-h-0 w-full flex-1 rounded-xl'
          : 'min-h-[72px] min-w-0 flex-1 rounded-2xl'
      )}
    >
      {region && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 bg-[color:var(--neu-accent-soft)]"
          style={{
            left: toPercent(region[0]),
            width: `${((region[1] - region[0]) / span) * 100}%`,
          }}
        />
      )}

      <div
        aria-hidden="true"
        className={cx(
          'absolute flex items-center gap-px',
          compact ? 'inset-1.5' : 'inset-x-3 inset-y-3'
        )}
      >
        {data.map((peak, index) => {
          const played = index < playedCount
          return (
            <span
              key={index}
              className="min-w-px flex-1 rounded-full"
              style={{
                height: `${peak * 100}%`,
                opacity: played ? 1 : 0.45,
                background: played
                  ? 'linear-gradient(180deg, #a855f7 0%, var(--neu-accent) 100%)'
                  : 'linear-gradient(180deg, color-mix(in srgb, #a855f7 55%, transparent), color-mix(in srgb, var(--neu-accent) 40%, transparent))',
              }}
            />
          )
        })}
      </div>

      {data.length > 0 && (
        <div
          aria-hidden="true"
          className="absolute inset-y-1.5 w-0.5 rounded-full bg-white/90 shadow-[0_0_8px_rgba(255,255,255,0.5)]"
          style={{ left: toPercent(pos) }}
        />
      )}
    </div>
  )

  return (
    <div
      className={cx(
        'flex min-h-0 w-full min-w-0 select-none flex-col',
        /* Compact : overflow visible pour ne pas couper les ombres CTA. */
        compact ? 'h-full justify-start gap-2 overflow-visible' : 'h-full gap-3 overflow-hidden',
        className
      )}
    >
      {showChrome && (
        <div className="flex shrink-0 items-center justify-between gap-2">
          <div className="min-w-0">
            {trackName && (
              <p className="truncate font-mono text-[10px] font-bold tracking-wide text-[color:var(--neu-text-muted)]">
                {trackName}
              </p>
            )}
            <div className="flex items-center gap-1.5">
              <span
                className={cx(
                  'h-1.5 w-1.5 rounded-full',
                  isPlaying
                    ? 'bg-[color:var(--neu-accent)] shadow-[0_0_6px_var(--neu-accent)]'
                    : 'bg-[color:var(--neu-text-faint)]'
                )}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-[color:var(--neu-text-faint)]">
                {isPlaying ? 'Playing' : 'Idle'}
              </span>
            </div>
          </div>
          <div
            className={cx(
              'neu-inset overflow-hidden rounded-full',
              compact ? 'h-1.5 w-14' : 'h-1.5 w-16'
            )}
            title={`Niveau ${Math.round(levelPct)}%`}
            role="meter"
            aria-label="Niveau audio"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(levelPct)}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-[color:var(--neu-accent)] transition-[width] duration-100"
              style={{ width: `${levelPct}%` }}
            />
          </div>
        </div>
      )}

      {compact ? (
        <>
          {!hideTransport && (
            <div className="flex shrink-0 items-center gap-2">
              {aside ? <div className={cx(COMPACT_ASIDE_W, 'shrink-0')} aria-hidden /> : null}
              <div className="min-w-0 flex-1">{transportBar}</div>
            </div>
          )}
          <div className="flex shrink-0 items-stretch gap-2 overflow-visible">
            {aside ? (
              <div
                className={cx(
                  COMPACT_ASIDE_W,
                  'flex shrink-0 flex-col items-center justify-center gap-1 overflow-visible'
                )}
              >
                {/* Bleed Softube : p/-m pour que neu-cta-flat ne soit pas clipé. */}
                <div className="-m-1.5 flex flex-col items-center justify-center gap-1 overflow-visible p-1.5">
                  {aside}
                </div>
              </div>
            ) : null}
            {/* Hauteur = stack CTA M (~128px) via stretch — pas de flex-1 inutile. */}
            <div className="flex min-h-0 min-w-0 flex-1 self-stretch">{waveCanvas}</div>
          </div>
        </>
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1 items-stretch gap-3">
          {aside ? (
            <div className="flex shrink-0 flex-col items-center justify-center gap-2.5 self-stretch">
              {aside}
            </div>
          ) : null}
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
            {transportBar}
            {waveCanvas}
          </div>
        </div>
      )}
    </div>
  )
}
