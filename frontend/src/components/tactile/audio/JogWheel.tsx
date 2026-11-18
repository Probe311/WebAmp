import { useRef, useState, type KeyboardEvent, type PointerEvent, type WheelEvent } from 'react'
import { cx } from '../../ui/cx'
import { clamp, useControllable } from '../lib/useControllable'
import { neuSize, type NeuSize, type TactileSize } from '../tokens'

export type JogWheelSize = NeuSize | TactileSize

const SIZE_CFG = {
  sm: {
    well: 'h-28 w-28 p-2',
    dimple: 'top-2.5 h-4 w-4',
    centerCap: 'h-9 w-9',
    notches: 24,
    viewBox: '0 0 112 112',
    center: 56,
    r1: 48,
    r2: 53,
  },
  md: {
    well: 'h-40 w-40 p-3',
    dimple: 'top-3.5 h-6 w-6',
    centerCap: 'h-12 w-12',
    notches: 36,
    viewBox: '0 0 160 160',
    center: 80,
    r1: 69,
    r2: 76,
  },
  lg: {
    well: 'h-52 w-52 p-3.5',
    dimple: 'top-4 h-8 w-8',
    centerCap: 'h-16 w-16',
    notches: 48,
    viewBox: '0 0 208 208',
    center: 104,
    r1: 91,
    r2: 99,
  },
} as const

export interface JogWheelProps {
  /** Position en crans : une rotation complète vaut `notches` crans. */
  value?: number
  defaultValue?: number
  onChange?: (value: number, delta?: number) => void
  /** Nombre de crans par tour (écrase le défaut taille si fourni). */
  notches?: number
  min?: number
  max?: number
  size?: JogWheelSize
  label?: string
  unit?: string
  sensitivity?: number
  showReadout?: boolean
  disabled?: boolean
  className?: string
}

/** Écart angulaire le plus court entre deux angles, dans [-180, 180]. */
const angleDelta = (from: number, to: number) => ((((to - from) % 360) + 540) % 360) - 180

/**
 * Molette de scrub rotative : well inset, crans SVG, dimple accent, cap central.
 * Glisser autour du centre, molette ou flèches (±1 cran, Page↑/↓ ±10).
 */
export function JogWheel({
  value,
  defaultValue = 0,
  onChange,
  notches: notchesProp,
  min = -Infinity,
  max = Infinity,
  size = 'm',
  label = 'JOG / SCRUB',
  unit = '°',
  sensitivity = 1,
  showReadout = true,
  disabled = false,
  className,
}: JogWheelProps) {
  const [current, setCurrent] = useControllable(value, defaultValue)
  const cfg = SIZE_CFG[neuSize(size)]
  const notches = notchesProp ?? cfg.notches
  const degPerNotch = 360 / notches
  const rootRef = useRef<HTMLDivElement>(null)
  const lastAngle = useRef<number | null>(null)
  const latest = useRef(current)
  const [isSpinning, setIsSpinning] = useState(false)
  latest.current = current

  const commit = (next: number, delta?: number) => {
    if (disabled) return
    const bounded = clamp(next, min, max)
    if (bounded !== latest.current) {
      latest.current = bounded
      setCurrent(bounded)
      onChange?.(bounded, delta)
    }
  }

  const pointerAngle = (event: PointerEvent<HTMLDivElement>) => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (!rect) return 0
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    return Math.atan2(dx, -dy) * (180 / Math.PI)
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    setIsSpinning(true)
    lastAngle.current = pointerAngle(event)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (lastAngle.current === null) return
    const angle = pointerAngle(event)
    const deltaDeg = angleDelta(lastAngle.current, angle)
    const stepDelta = deltaDeg / (degPerNotch * sensitivity)
    commit(latest.current + stepDelta, Math.round(stepDelta * 10) / 10)
    lastAngle.current = angle
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (lastAngle.current === null) return
    lastAngle.current = null
    setIsSpinning(false)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (disabled) return
    const step = event.deltaY < 0 ? 1 : -1
    commit(latest.current + step, step)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Record<string, number> = {
      ArrowUp: 1,
      ArrowRight: 1,
      ArrowDown: -1,
      ArrowLeft: -1,
      PageUp: 10,
      PageDown: -10,
    }
    if (!(event.key in moves)) return
    event.preventDefault()
    commit(latest.current + moves[event.key], moves[event.key])
  }

  const rotationDeg = current * degPerNotch * sensitivity
  const normalizedAngle = ((Math.round(rotationDeg) % 360) + 360) % 360

  return (
    <div className={cx('flex select-none flex-col items-center', disabled && 'opacity-50', className)}>
      <div
        ref={rootRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={Number.isFinite(min) ? min : undefined}
        aria-valuemax={Number.isFinite(max) ? max : undefined}
        aria-valuenow={Math.round(current)}
        aria-disabled={disabled || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        className={cx(
          'neu-inset relative flex cursor-grab items-center justify-center rounded-full touch-none active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/60',
          cfg.well
        )}
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={cfg.viewBox}
        >
          {Array.from({ length: notches }, (_, index) => {
            const deg = (index / notches) * 360
            const rad = ((deg - 90) * Math.PI) / 180
            const cardinal = index % (notches / 4) === 0
            const x1 = cfg.center + Math.cos(rad) * cfg.r1
            const y1 = cfg.center + Math.sin(rad) * cfg.r1
            const x2 = cfg.center + Math.cos(rad) * cfg.r2
            const y2 = cfg.center + Math.sin(rad) * cfg.r2
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={cardinal ? 'var(--neu-accent)' : 'var(--neu-text-faint)'}
                strokeWidth={cardinal ? 2 : 1}
                strokeLinecap="round"
                opacity={cardinal ? 0.9 : 0.45}
              />
            )
          })}
        </svg>

        <div
          aria-hidden="true"
          className="relative flex h-full w-full items-center justify-center rounded-full transition-shadow duration-150"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #e2e8f2)',
            boxShadow: isSpinning
              ? '4px 4px 10px rgba(163, 177, 198, 0.7), -4px -4px 10px rgba(255, 255, 255, 0.95), inset 0 0 0 1px rgba(242, 106, 27, 0.25)'
              : '7px 7px 16px rgba(163, 177, 198, 0.65), -7px -7px 16px rgba(255, 255, 255, 0.95)',
            transform: `rotate(${rotationDeg}deg)`,
          }}
        >
          <div className="pointer-events-none absolute inset-2.5 rounded-full border border-[color:var(--neu-bg-hollow)]/40" />
          <div className="pointer-events-none absolute inset-6 rounded-full border border-[color:var(--neu-edge)]" />

          <div
            className={cx(
              'neu-inset absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full pointer-events-none',
              cfg.dimple
            )}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-[color:var(--neu-accent)] shadow-[0_0_6px_var(--neu-accent)]" />
          </div>
        </div>

        <div
          aria-hidden="true"
          className={cx(
            'neu-flat pointer-events-none absolute flex flex-col items-center justify-center rounded-full border border-[color:var(--neu-edge)]',
            cfg.centerCap
          )}
        >
          <span className="font-mono text-[10px] font-extrabold tabular-nums text-[color:var(--neu-text)]">
            {normalizedAngle}°
          </span>
        </div>
      </div>

      <div className="mt-3 flex flex-col items-center text-center">
        {label && (
          <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]">
            {label}
          </span>
        )}
        {showReadout && (
          <div className="mt-1 flex items-center gap-2">
            <span className="neu-inset rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold tabular-nums text-[color:var(--neu-accent)]">
              {current > 0 ? `+${Math.round(current * 10) / 10}` : Math.round(current * 10) / 10}
              {unit}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
