import { useCallback, useRef, type KeyboardEvent, type PointerEvent, type WheelEvent } from 'react'
import { cx } from '../../ui/cx'
import { polarToCartesian } from '../lib/geometry'
import { spectrumColor } from '../lib/spectrum'
import { neuSize, type NeuSize, type TactileSize } from '../tokens'

export type SpectrumKnobSize = NeuSize | TactileSize

interface SizeSpec {
  box: number
  knob: number
  center: number
  innerRadius: number
  outerRadius: number
  pointerLength: number
  pointerWidth: number
  tickCount: number
  tickWidth: number
  labelText: string
  valueText: string
}

const SIZES: Record<'sm' | 'md' | 'lg', SizeSpec> = {
  sm: {
    box: 96,
    knob: 56,
    center: 48,
    innerRadius: 35,
    outerRadius: 43,
    pointerLength: 15,
    pointerWidth: 2,
    tickCount: 37,
    tickWidth: 1.5,
    labelText: 'text-[11px] font-medium text-[color:var(--neu-text-muted)]',
    valueText: 'text-[11px] font-bold text-[color:var(--neu-text)]',
  },
  md: {
    box: 144,
    knob: 88,
    center: 72,
    innerRadius: 52,
    outerRadius: 65,
    pointerLength: 25,
    pointerWidth: 2.5,
    tickCount: 45,
    tickWidth: 2,
    labelText: 'text-xs font-semibold tracking-wider text-[color:var(--neu-text-muted)]',
    valueText: 'text-sm font-bold text-[color:var(--neu-text)]',
  },
  lg: {
    box: 208,
    knob: 128,
    center: 104,
    innerRadius: 76,
    outerRadius: 94,
    pointerLength: 38,
    pointerWidth: 3.5,
    tickCount: 49,
    tickWidth: 2.5,
    labelText: 'text-xs font-bold uppercase tracking-widest text-[color:var(--neu-text-faint)]',
    valueText: 'text-base font-extrabold text-[color:var(--neu-text)]',
  },
}

const SWEEP_DEG = 270
const START_DEG = -135

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export interface SpectrumKnobProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: SpectrumKnobSize
  label?: string
  unit?: string
  showValue?: boolean
  disabled?: boolean
  className?: string
}

/**
 * Potentiomètre kit : graduations spectre + cap neu-convex (gradient / ombre kit).
 * Souris/tactile autour du centre ; molette ±2 pas ; clavier flèches / Page / Home / End.
 */
export function SpectrumKnob({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 'm',
  label = 'MIX',
  unit = '%',
  showValue = true,
  disabled = false,
  className,
}: SpectrumKnobProps) {
  const spec = SIZES[neuSize(size)]
  const rootRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const ratio = max === min ? 0 : clamp((value - min) / (max - min), 0, 1)
  const rotation = START_DEG + ratio * SWEEP_DEG

  const commit = useCallback(
    (raw: number) => {
      if (disabled) return
      const snapped = Math.round((raw - min) / step) * step + min
      const next = Number(clamp(snapped, min, max).toFixed(6))
      if (next !== value) onChange(next)
    },
    [disabled, max, min, onChange, step, value]
  )

  const valueFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const root = rootRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      const dx = clientX - (rect.left + rect.width / 2)
      const dy = clientY - (rect.top + rect.height / 2)
      const angle = clamp(Math.atan2(dx, -dy) * (180 / Math.PI), START_DEG, -START_DEG)
      commit(min + ((angle + 135) / SWEEP_DEG) * (max - min))
    },
    [commit, max, min]
  )

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || event.button !== 0) return
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragging.current = true
    valueFromPointer(event.clientX, event.clientY)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    valueFromPointer(event.clientX, event.clientY)
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    dragging.current = false
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (disabled) return
    event.preventDefault()
    commit(value + (event.deltaY < 0 ? step * 2 : -step * 2))
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const moves: Record<string, number> = {
      ArrowUp: step,
      ArrowRight: step,
      ArrowDown: -step,
      ArrowLeft: -step,
      PageUp: step * 10,
      PageDown: -step * 10,
    }
    if (event.key in moves) {
      event.preventDefault()
      commit(value + moves[event.key])
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      commit(min)
    } else if (event.key === 'End') {
      event.preventDefault()
      commit(max)
    }
  }

  const ticks = Array.from({ length: spec.tickCount }, (_, index) => {
    const fraction = index / (spec.tickCount - 1)
    const angle = START_DEG + fraction * SWEEP_DEG
    const inner = polarToCartesian(spec.center, spec.center, spec.innerRadius, angle)
    const outer = polarToCartesian(spec.center, spec.center, spec.outerRadius, angle)
    const lit = fraction <= ratio
    return { fraction, inner, outer, color: lit ? spectrumColor(fraction) : '#cbd5e1' }
  })

  return (
    <div className={cx('flex select-none flex-col items-center', disabled && 'opacity-50', className)}>
      <div
        ref={rootRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={`${Math.round(value)}${unit}`}
        aria-disabled={disabled || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onWheel}
        onKeyDown={onKeyDown}
        className="relative flex cursor-pointer touch-none items-center justify-center focus-visible:outline-none"
        style={{ width: spec.box, height: spec.box }}
      >
        <svg
          className="pointer-events-auto absolute inset-0 h-full w-full"
          viewBox={`0 0 ${spec.box} ${spec.box}`}
          aria-hidden="true"
        >
          {ticks.map((tick) => (
            <line
              key={tick.fraction}
              x1={tick.inner.x}
              y1={tick.inner.y}
              x2={tick.outer.x}
              y2={tick.outer.y}
              stroke={tick.color}
              strokeWidth={spec.tickWidth}
              strokeLinecap="round"
              className="cursor-pointer transition-colors duration-[var(--neu-duration-fast)]"
              onClick={() => commit(min + tick.fraction * (max - min))}
            />
          ))}
        </svg>

        <div
          aria-hidden="true"
          className="neu-convex relative flex cursor-grab items-center justify-center rounded-full active:cursor-grabbing"
          style={{
            width: spec.knob,
            height: spec.knob,
            // Kit light knob pixels (aussi mappés par .neu-convex)
            background: 'var(--neu-knob-face)',
            boxShadow:
              '6px 6px 14px rgba(var(--neu-shadow-dark), 0.55), -6px -6px 14px rgba(var(--neu-shadow-light), 0.95), inset 1px 1px 2px rgba(var(--neu-shadow-light), 0.85)',
            transform: `rotate(${rotation}deg)`,
          }}
        >
          <div className="pointer-events-none absolute inset-1 rounded-full border border-[color:var(--neu-edge)]" />
          <div
            className="pointer-events-none absolute top-2 rounded-full bg-[color:var(--neu-text)]"
            style={{
              height: spec.pointerLength,
              width: spec.pointerWidth,
            }}
          />
        </div>
      </div>

      <div className="mt-2.5 flex flex-col items-center text-center">
        {label && <span className={spec.labelText}>{label}</span>}
        {showValue && (
          <span className={cx('mt-0.5 tabular-nums', spec.valueText)}>
            {Math.round(value)}
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
