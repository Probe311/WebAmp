import { useEffect, useRef, useState } from 'react'
import { Tuner, type TunerState, type Tuning } from '../audio/tuner'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'
import { SelectField } from '../components/tactile'
import { AppPageShell } from '../components/shell/AppPageShell'
import { cx } from '../components/ui/cx'

const TUNINGS: { value: Tuning; label: string }[] = [
  { value: 'standard', label: 'Standard' },
  { value: 'dropD', label: 'Drop D' },
  { value: 'dropC', label: 'Drop C' },
  { value: 'openG', label: 'Open G' },
  { value: 'openD', label: 'Open D' },
  { value: 'dadgad', label: 'DADGAD' },
]

function formatNote(note: string | null): string {
  if (!note) return '—'
  return note.replace('#', '♯').replace(/[0-9]/g, '')
}

function ledIndex(cents: number): number {
  const clamped = Math.max(-50, Math.min(50, cents))
  return Math.round(((clamped + 50) / 100) * 20)
}

/** Accordeur 4×3 — note hero, barre pleine largeur, accordage en bandeau. */
export function TunerPage() {
  const { audioContext, audioSource } = usePedalboardEngine()
  const tunerRef = useRef<Tuner | null>(null)
  const [tuning, setTuning] = useState<Tuning>('standard')
  const [state, setState] = useState<TunerState>({
    note: null,
    cents: 0,
    frequency: 0,
    isInTune: false,
  })

  useEffect(() => {
    if (!audioContext || !audioSource) return

    const analyser = audioContext.createAnalyser()
    audioSource.connect(analyser)
    tunerRef.current = new Tuner(audioContext, analyser)
    tunerRef.current.setTuning(tuning)

    const id = window.setInterval(() => {
      const next = tunerRef.current?.detectNote()
      if (next) setState(next)
    }, 100)

    return () => {
      window.clearInterval(id)
      try {
        audioSource.disconnect(analyser)
      } catch {
        /* ignore */
      }
      tunerRef.current = null
    }
  }, [audioContext, audioSource, tuning])

  const active = ledIndex(state.cents)
  const status = !state.note
    ? { label: 'En attente…', color: 'text-[color:var(--neu-text-faint)]' }
    : state.isInTune
      ? { label: 'Accordé', color: 'text-[var(--td-success)]' }
      : state.cents > 0
        ? { label: 'Trop dièse', color: 'text-[color:var(--neu-accent)]' }
        : { label: 'Trop bémol', color: 'text-[color:var(--neu-accent)]' }

  return (
    <AppPageShell fill className="!overflow-hidden !px-2.5 !pb-2.5 !pt-2 sm:!px-2.5 sm:!pb-2.5 sm:!pt-2">
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <SelectField
          aria-label="Accordage"
          options={TUNINGS}
          value={tuning}
          onChange={(v) => {
            setTuning(v)
            tunerRef.current?.setTuning(v)
          }}
        />

        <div className="neu-inset flex min-h-0 flex-1 flex-col justify-between gap-2 rounded-2xl px-3 py-2.5">
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1">
            <output
              aria-live="polite"
              className="font-mono text-5xl font-bold tabular-nums leading-none text-[color:var(--neu-text)]"
            >
              {formatNote(state.note)}
            </output>
            <span className="h-3 font-mono text-[10px] text-[color:var(--neu-text-faint)]">
              {state.frequency > 0 ? `${state.frequency.toFixed(1)} Hz` : '\u00A0'}
            </span>
          </div>

          <div className="flex w-full flex-col gap-1">
            <div className="flex w-full items-stretch gap-px" aria-hidden>
              {Array.from({ length: 21 }, (_, i) => {
                const lit = state.note != null && i <= active
                const center = i === 10
                return (
                  <span
                    key={i}
                    className={cx(
                      'h-8 flex-1 rounded-[2px] transition-[background-color,box-shadow] duration-75',
                      !lit && 'bg-[color:var(--neu-bg-hollow)]',
                      lit && center && 'bg-[var(--td-success)] shadow-[0_0_6px_#22c55e]',
                      lit && !center && 'bg-[color:var(--neu-accent)]'
                    )}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-[9px] font-bold uppercase tracking-wider text-[color:var(--neu-text-faint)]">
              <span>♭</span>
              <span>0</span>
              <span>♯</span>
            </div>
          </div>

          <p className={cx('text-center text-[10px] font-bold uppercase tracking-wider', status.color)}>
            {status.label}
          </p>
        </div>
      </div>
    </AppPageShell>
  )
}
