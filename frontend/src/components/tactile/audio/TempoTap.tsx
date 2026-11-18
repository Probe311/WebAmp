import { useEffect, useRef, useState } from 'react'
import { Minus, Plus, Square } from 'lucide-react'
import { cx } from '../../ui/cx'
import { playMetronomeClick } from '../../../audio/metronome'
import { usePedalboardEngine } from '../../../hooks/usePedalboardEngine'

export const MIN_BPM = 30
export const MAX_BPM = 300
export type TimeSignature = '4/4' | '3/4' | '6/8' | '7/8'

const SIGNATURES: readonly TimeSignature[] = ['4/4', '3/4', '6/8', '7/8']
const TAP_RESET_MS = 2000
const TAP_WINDOW = 6

const clampBpm = (bpm: number) => Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(bpm)))

/** BPM moyen d'une série d'horodatages de taps (ms), `null` si moins de 2 taps. */
export function bpmFromTaps(times: readonly number[]): number | null {
  if (times.length < 2) return null
  const average = (times[times.length - 1] - times[0]) / (times.length - 1)
  return clampBpm(60000 / average)
}

export interface TempoTapProps {
  bpm: number
  onBpmChange: (bpm: number) => void
  /** Alias kit / pages. */
  timeSignature?: TimeSignature
  defaultSignature?: TimeSignature
  onSignatureChange?: (signature: TimeSignature) => void
  onBeat?: (index: number, accent: boolean) => void
  /** Click AudioContext sur chaque temps (moteur métronome). */
  enableClick?: boolean
  label?: string
  /** `plain` = fenêtre outils 4×3 (compact, remplit le cadre). */
  variant?: 'card' | 'plain'
  className?: string
}

/**
 * Métronome Softube/NEU — display inset, tap, signature.
 * BPM = temps de la signature (noire x/4, croche x/8).
 */
export function TempoTap({
  bpm,
  onBpmChange,
  timeSignature,
  defaultSignature = '4/4',
  onSignatureChange,
  onBeat,
  enableClick = false,
  label = 'MÉTRONOME & TAP TEMPO',
  variant = 'card',
  className,
}: TempoTapProps) {
  const { engine, start: startEngine } = usePedalboardEngine()
  const [signature, setSignature] = useState<TimeSignature>(timeSignature ?? defaultSignature)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState(-1)
  const taps = useRef<number[]>([])
  const onBeatRef = useRef(onBeat)
  onBeatRef.current = onBeat
  const plain = variant === 'plain'
  const enableClickRef = useRef(enableClick)
  enableClickRef.current = enableClick
  const engineRef = useRef(engine)
  engineRef.current = engine

  useEffect(() => {
    if (timeSignature) setSignature(timeSignature)
  }, [timeSignature])

  const numerator = Number(signature.split('/')[0])
  const denominator = Number(signature.split('/')[1])

  useEffect(() => {
    if (!running) {
      setBeat(-1)
      return
    }
    let cancelled = false
    let timer = 0
    let index = 0
    const boot = async () => {
      if (enableClickRef.current) {
        try {
          await startEngine()
          const ctx = engineRef.current.getAudioContext()
          if (ctx?.state === 'suspended') await ctx.resume()
        } catch {
          /* ignore */
        }
      }
      if (cancelled) return
      const fire = () => {
        const accent = index === 0
        setBeat(index)
        onBeatRef.current?.(index, accent)
        if (enableClickRef.current) {
          const ctx = engineRef.current.getAudioContext()
          if (ctx) playMetronomeClick(ctx, accent)
        }
        index = (index + 1) % numerator
      }
      fire()
      // ponytail: setInterval dérive — plafond OK pour click UI ; upgrade = AudioContext clock
      timer = window.setInterval(fire, (60000 / bpm) * (denominator === 8 ? 0.5 : 1))
    }
    void boot()
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [running, bpm, numerator, denominator, startEngine])

  const tap = () => {
    const now = performance.now()
    const last = taps.current[taps.current.length - 1]
    taps.current = [...(last !== undefined && now - last <= TAP_RESET_MS ? taps.current : []), now].slice(
      -TAP_WINDOW
    )
    const next = bpmFromTaps(taps.current)
    if (next !== null) onBpmChange(next)
  }

  const setSig = (next: TimeSignature) => {
    setSignature(next)
    onSignatureChange?.(next)
  }

  const ctl = cx(
    'inline-grid shrink-0 cursor-pointer place-items-center rounded-2xl neu-cta-flat text-[color:var(--neu-text)] transition-shadow disabled:cursor-not-allowed disabled:opacity-40 active:neu-pressed',
    plain ? 'h-9 w-9' : 'h-11 w-11'
  )

  return (
    <div
      className={cx(
        'flex w-full flex-col rounded-[var(--td-radius-panel)] bg-[color:var(--neu-bg)]',
        !plain && 'max-w-md gap-5 border border-[color:var(--neu-edge)] p-5 neu-window',
        plain && 'h-full min-h-0 justify-between gap-2',
        className
      )}
    >
      {!plain && (
        <header className="flex items-center justify-between gap-3">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[color:var(--neu-text)]">
            {label}
          </h4>
          <span className="neu-inset rounded-2xl px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-[color:var(--neu-accent)]">
            SYNC : INT
          </span>
        </header>
      )}

      <div
        className={cx(
          'neu-inset flex items-center justify-between rounded-2xl',
          plain ? 'min-h-0 flex-1 gap-3 px-3 py-2.5' : 'gap-4 px-5 py-5'
        )}
      >
        <div className="min-w-0">
          <p className="text-[9px] font-bold uppercase tracking-wider text-[color:var(--neu-text-faint)]">
            Tempo Maître
          </p>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <output
              aria-live="off"
              className={cx(
                'font-mono font-bold tabular-nums leading-none text-[color:var(--neu-text)]',
                plain ? 'text-4xl' : 'text-5xl'
              )}
            >
              {bpm}
            </output>
            <span className="text-xs font-bold tracking-wider text-[color:var(--neu-accent)]">BPM</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          {Array.from({ length: numerator }, (_, index) => {
            const lit = index === beat
            return (
              <span
                key={index}
                className={cx(
                  'rounded-full transition-[background-color,box-shadow] duration-75',
                  plain ? 'h-2.5 w-2.5' : 'h-3.5 w-3.5',
                  lit
                    ? index === 0
                      ? 'bg-[color:var(--neu-accent)] shadow-[0_0_8px_var(--neu-accent)]'
                      : 'bg-emerald-500 shadow-[0_0_8px_#22c55e]'
                    : 'bg-[color:var(--neu-bg-hollow)] shadow-[inset_1px_1px_2px_rgba(var(--neu-shadow-dark),0.6)]'
                )}
              />
            )
          })}
        </div>
      </div>

      <div className={cx('flex items-center', plain ? 'gap-1.5' : 'flex-wrap gap-2.5')}>
        <button
          type="button"
          aria-label="Diminuer le tempo"
          disabled={bpm <= MIN_BPM}
          onClick={() => onBpmChange(clampBpm(bpm - 1))}
          className={ctl}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          aria-label={running ? 'Stop' : 'Start'}
          aria-pressed={running}
          onClick={() => setRunning((v) => !v)}
          className={cx(
            ctl,
            running ? 'neu-pressed text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-accent)]'
          )}
        >
          {running ? (
            <Square className="h-3 w-3 fill-current" />
          ) : (
            <span className="ml-0.5 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
          )}
        </button>

        <button
          type="button"
          aria-label="Augmenter le tempo"
          disabled={bpm >= MAX_BPM}
          onClick={() => onBpmChange(clampBpm(bpm + 1))}
          className={ctl}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={tap}
          className={cx(
            'neu-cta-flat flex-1 cursor-pointer rounded-2xl text-[10px] font-bold tracking-[0.12em] text-[color:var(--neu-accent)] transition-shadow active:neu-pressed',
            plain ? 'min-h-9 px-2' : 'min-h-11 px-4 text-xs'
          )}
        >
          TAP TEMPO
        </button>
      </div>

      <div className={cx('flex items-center', plain ? 'gap-1.5' : 'flex-wrap gap-2')}>
        {!plain && (
          <span className="text-[10px] font-bold tracking-wider text-[color:var(--neu-text-faint)]">
            SIGNATURE :
          </span>
        )}
        <div
          role="group"
          aria-label="Signature rythmique"
          className="neu-inset flex min-w-0 flex-1 items-center gap-0.5 rounded-2xl p-0.5"
        >
          {SIGNATURES.map((value) => {
            const active = value === signature
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setSig(value)}
                className={cx(
                  'min-w-0 flex-1 cursor-pointer rounded-xl font-bold transition-shadow',
                  plain ? 'min-h-7 px-1 text-[10px]' : 'min-h-8 px-3 text-xs',
                  active
                    ? 'neu-pressed text-[color:var(--neu-accent)]'
                    : 'bg-transparent text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]'
                )}
              >
                {value}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
