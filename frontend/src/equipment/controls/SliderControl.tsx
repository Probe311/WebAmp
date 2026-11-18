import { useCallback, useId, useRef, useState } from 'react'
import type { SliderScaleVariant, SliderShape } from '../types'

export interface SliderControlProps {
  id?: string
  value: number
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  label: string
  unit?: string
  orientation: 'horizontal' | 'vertical'
  length?: number
  styleType?: SliderShape
  scaleVariant?: SliderScaleVariant
  accentColor?: string
  labelColor?: string
  disabled?: boolean
  onChange: (value: number) => void
  tooltip?: string
  className?: string
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

interface Tick {
  height: number
  long: boolean
  opacity: number
}

/** Graduations Walrus en escalier : elles croissent de gauche (« − ») à droite (« + »). */
const WALRUS_TICKS_BY_SIDE = {
  // Du plus petit (bord gauche) au plus haut (près du libellé).
  left: Array.from({ length: 9 }, (_, i): Tick => ({ height: 2 + i * 0.4, long: i === 8, opacity: 0.5 + i * 0.04 })),
  // Du haut (près du libellé) au plus haut (bord droit).
  right: Array.from({ length: 9 }, (_, i): Tick => ({ height: 5.6 + i * 0.42, long: i === 0, opacity: 0.5 + i * 0.05 })),
}

function WalrusTicks({ ticks, alignEnd = false }: { ticks: Tick[]; alignEnd?: boolean }) {
  return (
    <div
      className={`flex h-[9px] flex-1 items-end gap-[2px] ${alignEnd ? 'justify-end' : ''}`}
      aria-hidden="true"
    >
      {ticks.map((tick, i) => (
        <span
          key={i}
          style={{ height: tick.height, opacity: tick.opacity }}
          className={`rounded-full bg-[#EDE4D0] ${tick.long ? 'w-[7px]' : 'w-[3px]'}`}
        />
      ))}
    </div>
  )
}

export function SliderControl({
  id: customId,
  value,
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  label,
  unit = '',
  orientation,
  length = 120,
  styleType,
  scaleVariant = 'linear-scale',
  accentColor = '#F26A1B',
  labelColor,
  disabled = false,
  onChange,
  tooltip,
  className = '',
}: SliderControlProps) {
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const trackRef = useRef<HTMLDivElement | null>(null)
  const autoId = useId()
  const id = customId ?? autoId

  const shape: SliderShape =
    styleType ?? (orientation === 'horizontal' ? 'phaser-horizontal' : 'eq-vertical-led')
  const safe = clamp(value, min, max)
  const ratio = max > min ? (safe - min) / (max - min) : 0
  const bipolar = scaleVariant === 'center-detent'
  const ledStyle = shape === 'eq-vertical-led' || shape === 'led-fader' || scaleVariant === 'led-scale'
  const effectiveLength = shape === 'short' || shape === 'mini' ? Math.round(length * 0.7) : length
  const fallbackLabel = labelColor ?? '#f3d9cf'

  const commitFromPos = useCallback(
    (clientX: number, clientY: number) => {
      if (!trackRef.current || disabled) return
      const rect = trackRef.current.getBoundingClientRect()
      const raw =
        orientation === 'horizontal'
          ? (clientX - rect.left) / Math.max(1, rect.width)
          : 1 - (clientY - rect.top) / Math.max(1, rect.height)
      let r = clamp(raw, 0, 1)
      if (bipolar && Math.abs(r - 0.5) < 0.03) r = 0.5
      const mapped = scaleVariant === 'logarithmic-scale' ? Math.pow(r, 1.6) : r
      const next = min + mapped * (max - min)
      onChange(Number((Math.round((next - min) / step) * step + min).toFixed(step < 1 ? 1 : 0)))
    },
    [disabled, orientation, bipolar, scaleVariant, min, max, step, onChange]
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
    commitFromPos(e.clientX, e.clientY)
    const onMove = (ev: PointerEvent | MouseEvent) => commitFromPos(ev.clientX, ev.clientY)
    const onUp = () => {
      setDragging(false)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return
    const coarse = Math.max(step, (max - min) / 8)
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault()
      onChange(clamp(safe + step, min, max))
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault()
      onChange(clamp(safe - step, min, max))
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      onChange(clamp(safe + coarse, min, max))
    } else if (e.key === 'PageDown') {
      e.preventDefault()
      onChange(clamp(safe - coarse, min, max))
    } else if (e.key === 'Home') {
      e.preventDefault()
      onChange(min)
    } else if (e.key === 'End') {
      e.preventDefault()
      onChange(max)
    }
  }

  const tooltipEl = (dragging || hovered) && (
    <div
      role="tooltip"
      className="pointer-events-none absolute -top-6 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900/95 px-2 py-0.5 font-mono text-[9px] font-semibold text-white shadow-md"
    >
      {tooltip || label}: <span className="tabular-nums text-[#ff8a47]">{Math.round(safe)}{unit}</span>
    </div>
  )

  if (orientation === 'horizontal' && shape === 'walrus-horizontal') {
    const capLeft = Math.min(94, Math.max(6, ratio * 100))
    return (
      <div
        className={`relative inline-flex select-none flex-col items-center ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {tooltipEl}
        <div
          id={id}
          ref={trackRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={safe}
          onPointerDown={handlePointerDown}
          onDoubleClick={(e) => {
            e.stopPropagation()
            onChange(defaultValue ?? Math.round((min + max) / 2))
          }}
          onKeyDown={handleKeyDown}
          style={{ width: effectiveLength, height: 20 }}
          className="relative flex cursor-ew-resize touch-none items-center rounded-md outline-none"
        >
          {/* Capuchon noir, filet crème */}
          <div
            style={{ left: `${capLeft}%`, top: 'calc(50% + 8px)' }}
            className="pointer-events-none absolute flex h-[21px] w-[30px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3px] border border-white/15 bg-gradient-to-b from-[#3a3a3a] via-[#1a1a1a] to-[#060606] shadow-[0_3px_5px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.12)]"
          >
            <span className="h-[11px] w-[2px] rounded-full bg-[#EDE4D0]" />
          </div>
        </div>

        <div style={{ width: effectiveLength }} className="mt-1 flex items-end gap-2.5">
          <WalrusTicks ticks={WALRUS_TICKS_BY_SIDE.left} alignEnd />
          <span
            style={{ color: fallbackLabel }}
            className="translate-y-[2px] whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.14em]"
          >
            {label}
          </span>
          <WalrusTicks ticks={WALRUS_TICKS_BY_SIDE.right} />
        </div>
      </div>
    )
  }

  if (orientation === 'horizontal') {
    return (
      <div
        className={`relative inline-flex select-none flex-col items-center ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {tooltipEl}
        <div
          id={id}
          ref={trackRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={safe}
          onPointerDown={handlePointerDown}
          onDoubleClick={(e) => {
            e.stopPropagation()
            onChange(defaultValue ?? Math.round((min + max) / 2))
          }}
          onKeyDown={handleKeyDown}
          style={{ width: effectiveLength, height: 22 }}
          className="relative flex cursor-ew-resize touch-none items-center rounded-md outline-none"
        >
          <div className="relative h-2 w-full overflow-hidden rounded-full border border-white/10 bg-zinc-950 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)]">
            <div
              style={{
                left: bipolar ? `${Math.min(0.5, ratio) * 100}%` : '0%',
                width: bipolar ? `${Math.abs(ratio - 0.5) * 100}%` : `${ratio * 100}%`,
                backgroundColor: accentColor,
              }}
              className="absolute top-0 bottom-0 opacity-85 transition-all duration-75"
            />
          </div>
          {bipolar && (
            <span className="pointer-events-none absolute left-1/2 h-3.5 w-[1.5px] -translate-x-1/2 bg-white/50" aria-hidden="true" />
          )}
          <div
            style={{ left: `${ratio * 100}%` }}
            className="pointer-events-none absolute top-1/2 flex h-5 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[3px] border border-white/15 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 shadow-[0_3px_6px_rgba(0,0,0,0.75)]"
          >
            <span
              style={{ backgroundColor: ledStyle ? accentColor : '#f3d9cf' }}
              className="h-3.5 w-[2.5px] rounded-full"
            />
          </div>
        </div>

        <div style={{ width: effectiveLength }} className="mt-0.5 flex items-center justify-between gap-1">
          <div className="flex flex-1 items-end gap-[2px] opacity-55" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} style={{ height: `${2 + (i % 3)}px` }} className="flex-1 rounded-full bg-[#eab6a4]/80" />
            ))}
          </div>
          <span style={{ color: fallbackLabel }} className="whitespace-nowrap text-[8px] font-bold uppercase tracking-widest">
            {label}
          </span>
          <div className="flex flex-1 items-end gap-[2px] opacity-75" aria-hidden="true">
            {Array.from({ length: 10 }).map((_, i) => (
              <span key={i} style={{ height: `${3 + Math.round((i / 9) * 5)}px` }} className="flex-1 rounded-full bg-[#eab6a4]" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const fillBottom = bipolar ? `${Math.min(0.5, ratio) * 100}%` : '0%'
  const fillHeight = bipolar ? `${Math.abs(ratio - 0.5) * 100}%` : `${ratio * 100}%`

  return (
    <div
      className={`relative inline-flex select-none flex-col items-center ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: fallbackLabel }} className="mb-1 whitespace-nowrap text-[8px] font-bold uppercase tracking-tight">
        {label}
      </span>
      {tooltipEl}
      <div
        id={id}
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={safe}
        onPointerDown={handlePointerDown}
        onDoubleClick={(e) => {
          e.stopPropagation()
          onChange(defaultValue ?? Math.round((min + max) / 2))
        }}
        onKeyDown={handleKeyDown}
        style={{ height: effectiveLength, width: 22 }}
        className="relative flex cursor-ns-resize touch-none justify-center rounded outline-none"
      >
        <div className="absolute inset-y-1 -left-2 -right-2 flex flex-col justify-between" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="flex w-full items-center justify-between">
              <span className={`w-1.5 ${idx === 2 ? 'h-[1.5px] bg-slate-800' : 'h-[1px] bg-slate-600/60'}`} />
              {scaleVariant === 'led-scale' && (
                <span
                  style={{ backgroundColor: (4 - idx) / 4 <= ratio ? accentColor : 'rgba(100,116,139,0.3)' }}
                  className="h-1 w-1 rounded-full"
                />
              )}
              <span className={`w-1.5 ${idx === 2 ? 'h-[1.5px] bg-slate-800' : 'h-[1px] bg-slate-600/60'}`} />
            </div>
          ))}
        </div>

        <div className="relative h-full w-1.5 overflow-hidden rounded-full border border-white/25 bg-zinc-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)]">
          <div
            style={{ bottom: fillBottom, height: fillHeight, backgroundColor: accentColor }}
            className="absolute left-0 right-0 opacity-85 transition-all duration-75"
          />
        </div>

        <div
          style={{ bottom: `${ratio * 100}%` }}
          className="pointer-events-none absolute left-1/2 flex h-5 w-3.5 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-[2px] border border-white/20 bg-gradient-to-b from-zinc-700 via-zinc-900 to-black shadow-[0_2px_5px_rgba(0,0,0,0.65)]"
        >
          {ledStyle && (
            <span
              style={{
                backgroundColor: shape === 'eq-vertical-led' ? '#38bdf8' : accentColor,
                boxShadow: `0 0 6px ${shape === 'eq-vertical-led' ? '#38bdf8' : accentColor}`,
              }}
              className="h-[3px] w-2 rounded-full"
            />
          )}
        </div>
      </div>

      {scaleVariant === 'numeric-scale' && (
        <span style={{ color: fallbackLabel }} className="mt-1 font-mono text-[7px] tabular-nums opacity-75">
          {min}..{max}
        </span>
      )}
    </div>
  )
}
