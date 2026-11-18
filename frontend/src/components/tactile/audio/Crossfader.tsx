import type { KeyboardEvent } from 'react'
import { cx } from '../../ui/cx'
import { SegmentedPills } from '../primitives'
import { clamp, useControllable } from '../lib/useControllable'
import { useRatioDrag } from '../lib/useRatioDrag'

export type CrossfaderCurve = 'linear' | 'smooth' | 'cut'

/**
 * Gains des voies A et B pour une position 0 (A) → 1 (B).
 * `linear` : somme constante des amplitudes ; `smooth` : puissance constante ;
 * `cut` : plein volume jusqu'aux 10 % de chaque bord, coupure franche.
 */
export function crossfadeGains(position: number, curve: CrossfaderCurve): { a: number; b: number } {
  const x = clamp(position, 0, 1)
  if (curve === 'linear') return { a: 1 - x, b: x }
  if (curve === 'smooth') return { a: Math.cos((x * Math.PI) / 2), b: Math.sin((x * Math.PI) / 2) }
  return { a: Math.min(1, (1 - x) * 10), b: Math.min(1, x * 10) }
}

const CURVE_OPTIONS = [
  { value: 'linear', label: 'Linéaire' },
  { value: 'smooth', label: 'Douce' },
  { value: 'cut', label: 'Cut' },
] as const

function GainBar({ letter, gain }: { letter: string; gain: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 font-mono text-[11px] font-bold text-[color:var(--neu-text-muted)]">{letter}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full neu-inset">
        <div
          className="h-full rounded-full bg-[color:var(--neu-accent)] transition-[width] duration-75"
          style={{ width: `${gain * 100}%` }}
        />
      </div>
    </div>
  )
}

export interface CrossfaderProps {
  /** Position 0 (A) → 1 (B). */
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  curve?: CrossfaderCurve
  defaultCurve?: CrossfaderCurve
  onCurveChange?: (curve: CrossfaderCurve) => void
  /** Reçoit les gains calculés à chaque changement de position ou de courbe. */
  onGainsChange?: (gains: { a: number; b: number }) => void
  className?: string
}

/** Crossfader A/B horizontal avec choix de la courbe de mélange. */
export function Crossfader({
  value,
  defaultValue = 0.5,
  onChange,
  curve,
  defaultCurve = 'smooth',
  onCurveChange,
  onGainsChange,
  className,
}: CrossfaderProps) {
  const [position, setPosition] = useControllable(value, defaultValue, onChange)
  const [activeCurve, setCurve] = useControllable(curve, defaultCurve, onCurveChange)

  const move = (next: number) => {
    const bounded = Number(clamp(next, 0, 1).toFixed(3))
    setPosition(bounded)
    onGainsChange?.(crossfadeGains(bounded, activeCurve))
  }
  const changeCurve = (next: CrossfaderCurve) => {
    setCurve(next)
    onGainsChange?.(crossfadeGains(position, next))
  }

  const drag = useRatioDrag<HTMLDivElement>((x) => move(Math.abs(x - 0.5) < 0.02 ? 0.5 : x))

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') move(position - 0.05)
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') move(position + 0.05)
    else if (event.key === 'Home') move(0)
    else if (event.key === 'End') move(1)
    else return
    event.preventDefault()
  }

  const gains = crossfadeGains(position, activeCurve)

  return (
    <div
      className={cx(
        'inline-flex w-72 select-none flex-col gap-4 rounded-3xl border border-[color:var(--neu-edge)] neu-flat p-5',
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        <GainBar letter="A" gain={gains.a} />
        <GainBar letter="B" gain={gains.b} />
      </div>

      <div className="flex items-center gap-3">
        <span
          className={cx(
            'font-mono text-sm font-bold',
            position < 0.5 ? 'text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text-faint)]'
          )}
        >
          A
        </span>
        <div
          ref={drag.ref}
          {...drag.handlers}
          role="slider"
          tabIndex={0}
          aria-label="Crossfader"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={position}
          aria-valuetext={
            position === 0.5 ? 'Centre' : position < 0.5 ? `A ${Math.round((1 - position) * 100)} %` : `B ${Math.round(position * 100)} %`
          }
          onKeyDown={onKeyDown}
          onDoubleClick={() => move(0.5)}
          className="relative h-4 flex-1 cursor-pointer touch-none rounded-full neu-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/60"
        >
          <span aria-hidden="true" className="absolute left-1/2 top-1 h-2 w-px bg-[color:var(--neu-text-faint)]" />
          <span
            aria-hidden="true"
            className="absolute top-1/2 grid h-9 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border border-[color:var(--neu-edge)] neu-flat"
            style={{ left: `${position * 100}%` }}
          >
            <span className="h-5 w-0.5 rounded-full bg-[color:var(--neu-accent)]" />
          </span>
        </div>
        <span
          className={cx(
            'font-mono text-sm font-bold',
            position > 0.5 ? 'text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text-faint)]'
          )}
        >
          B
        </span>
      </div>

      <SegmentedPills
        label="Courbe du crossfader"
        size="sm"
        value={activeCurve}
        onChange={changeCurve}
        options={CURVE_OPTIONS}
        className="self-center"
      />
    </div>
  )
}
