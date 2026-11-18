import { useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { Move, RotateCcw } from 'lucide-react'
import { cx } from '../../ui/cx'
import { IconAction, Panel } from '../primitives'

export interface XYValue {
  /** 0 → 1, gauche → droite. */
  x: number
  /** 0 → 1, bas → haut. */
  y: number
}

const CENTER: XYValue = { x: 0.5, y: 0.5 }
const GRID_DIVISIONS = 4
const KEY_STEP = 0.02

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

export interface XYPadProps {
  value: XYValue
  onChange: (value: XYValue) => void
  xLabel?: string
  yLabel?: string
  /** Position du bouton de réinitialisation (centre par défaut). */
  resetValue?: XYValue
  label?: string
  className?: string
}

/** Pad XY : glissement souris/tactile ou flèches (Maj = pas ×5), grille et lectures X/Y. */
export function XYPad({
  value,
  onChange,
  xLabel = 'X',
  yLabel = 'Y',
  resetValue = CENTER,
  label = 'PAD XY',
  className,
}: XYPadProps) {
  const padRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const moveTo = (clientX: number, clientY: number) => {
    const rect = padRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return
    onChange({
      x: clamp01((clientX - rect.left) / rect.width),
      y: clamp01(1 - (clientY - rect.top) / rect.height),
    })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? KEY_STEP * 5 : KEY_STEP
    const deltas: Record<string, XYValue> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: step },
      ArrowDown: { x: 0, y: -step },
    }
    const delta = deltas[event.key]
    if (!delta) return
    event.preventDefault()
    onChange({ x: clamp01(value.x + delta.x), y: clamp01(value.y + delta.y) })
  }

  const percent = (ratio: number) => `${Math.round(ratio * 100)}`

  return (
    <Panel depth="flat" className={cx('flex w-full max-w-xs flex-col gap-4 rounded-3xl p-5', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--neu-edge)] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="neu-flat-sm grid h-8 w-8 place-items-center rounded-full text-[color:var(--neu-accent)]">
            <Move className="h-4 w-4" />
          </span>
          <h4 className="text-xs font-bold tracking-tight text-[color:var(--neu-text)]">{label}</h4>
        </div>
        <IconAction size="sm" label="Réinitialiser" onClick={() => onChange(resetValue)}>
          <RotateCcw className="h-4 w-4" />
        </IconAction>
      </div>

      <div
        ref={padRef}
        role="group"
        tabIndex={0}
        aria-label={`${label} : ${xLabel} ${percent(value.x)} %, ${yLabel} ${percent(value.y)} %`}
        className="relative aspect-square w-full cursor-crosshair touch-none overflow-hidden rounded-2xl neu-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/60"
        onKeyDown={onKeyDown}
        onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
          event.preventDefault()
          event.currentTarget.setPointerCapture?.(event.pointerId)
          dragging.current = true
          moveTo(event.clientX, event.clientY)
        }}
        onPointerMove={(event) => dragging.current && moveTo(event.clientX, event.clientY)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
      >
        {Array.from({ length: GRID_DIVISIONS - 1 }, (_, i) => (
          <span key={i} aria-hidden="true">
            <span
              className="absolute inset-y-0 w-px bg-[color:var(--neu-bg-hollow)]"
              style={{ left: `${((i + 1) / GRID_DIVISIONS) * 100}%` }}
            />
            <span
              className="absolute inset-x-0 h-px bg-[color:var(--neu-bg-hollow)]"
              style={{ top: `${((i + 1) / GRID_DIVISIONS) * 100}%` }}
            />
          </span>
        ))}
        <span
          aria-hidden="true"
          className="absolute inset-y-0 w-px bg-[color:var(--neu-accent-soft)]"
          style={{ left: `${value.x * 100}%` }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-x-0 h-px bg-[color:var(--neu-accent-soft)]"
          style={{ top: `${(1 - value.y) * 100}%` }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--neu-accent)] shadow-[0_0_10px_var(--neu-accent),3px_3px_8px_rgba(var(--neu-shadow-dark),0.6)]"
          style={{
            left: `${value.x * 100}%`,
            top: `${(1 - value.y) * 100}%`,
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 font-mono text-[11px] font-bold text-[color:var(--neu-text-muted)]">
        {[
          { name: xLabel, ratio: value.x },
          { name: yLabel, ratio: value.y },
        ].map(({ name, ratio }, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-full neu-inset px-3 py-1.5"
          >
            <span>{name}</span>
            <span className="tabular-nums text-[color:var(--neu-accent)]">{percent(ratio)} %</span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
