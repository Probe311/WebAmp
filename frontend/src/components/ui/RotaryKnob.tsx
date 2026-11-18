import { useCallback, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { cx } from './cx'

export interface RotaryKnobProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Diamètre en pixels. */
  size?: number
  /** Valeur restaurée au double-clic. */
  defaultValue?: number
  formatValue?: (value: number) => string
  disabled?: boolean
  className?: string
}

const SWEEP = 0.75 // 270° de course, comme un potentiomètre physique
const DRAG_RANGE_PX = 160 // pixels de glissement pour parcourir toute la course

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

/**
 * Potentiomètre rotatif du design system.
 *
 * Souris/tactile : glissement vertical avec capture de pointeur ; clavier :
 * flèches (±1 pas), Page↑/↓ (±10 pas), Home/End ; double-clic : valeur par défaut.
 * Exposé comme `role="slider"`, donc annoncé avec sa valeur formatée.
 */
export function RotaryKnob({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  step = 0.1,
  size = 56,
  defaultValue,
  formatValue,
  disabled = false,
  className,
}: RotaryKnobProps) {
  const dragOrigin = useRef<{ y: number; value: number } | null>(null)

  const quantize = useCallback(
    (raw: number) => {
      const snapped = Math.round((raw - min) / step) * step + min
      return Number(clamp(snapped, min, max).toFixed(6))
    },
    [min, max, step]
  )

  const commit = useCallback(
    (raw: number) => {
      const next = quantize(raw)
      if (next !== value) onChange(next)
    },
    [quantize, onChange, value]
  )

  const ratio = max === min ? 0 : clamp((value - min) / (max - min), 0, 1)
  const angle = -135 + ratio * 270
  const display = formatValue ? formatValue(value) : value.toFixed(step < 1 ? 1 : 0)

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return
    const big = step * 10
    let next: number | null = null
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        next = value + step
        break
      case 'ArrowDown':
      case 'ArrowLeft':
        next = value - step
        break
      case 'PageUp':
        next = value + big
        break
      case 'PageDown':
        next = value - big
        break
      case 'Home':
        next = min
        break
      case 'End':
        next = max
        break
      default:
        return
    }
    e.preventDefault()
    commit(next)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled || e.button !== 0) return
    e.preventDefault()
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragOrigin.current = { y: e.clientY, value }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const origin = dragOrigin.current
    if (!origin) return
    const travelled = (origin.y - e.clientY) / DRAG_RANGE_PX
    commit(origin.value + travelled * (max - min))
  }

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragOrigin.current) return
    dragOrigin.current = null
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  const onDoubleClick = () => {
    if (disabled) return
    commit(defaultValue ?? min)
  }

  const radius = 40
  const circumference = 2 * Math.PI * radius
  const arc = circumference * SWEEP

  return (
    <div className={cx('flex select-none flex-col items-center gap-1', className)}>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--td-text-muted)]">
        {label}
      </span>

      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={display}
        aria-disabled={disabled || undefined}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={onDoubleClick}
        className={cx(
          'td-focusable relative rounded-full outline-offset-4',
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-ns-resize touch-none'
        )}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--td-surface-inset)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${arc} ${circumference}`}
            transform="rotate(135 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--td-primary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${arc * ratio} ${circumference}`}
            transform="rotate(135 50 50)"
          />
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="var(--td-surface-elevated)"
            stroke="var(--td-edge-panel)"
            strokeWidth="1"
          />
          <line
            x1="50"
            y1="24"
            x2="50"
            y2="34"
            stroke="var(--td-text-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
          />
        </svg>
      </div>

      <span className="text-xs font-medium tabular-nums text-[var(--td-text-secondary)]">
        {display}
      </span>
    </div>
  )
}
