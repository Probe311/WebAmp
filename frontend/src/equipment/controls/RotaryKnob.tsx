import { useCallback, useId, useRef, useState } from 'react'
import type { IndicatorStyle, KnobAppearance } from '../types'

export interface RotaryKnobProps {
  id?: string
  value: number
  min?: number
  max?: number
  step?: number
  defaultValue?: number
  label: string
  unit?: string
  size?: number
  knobStyle?: KnobAppearance
  indicatorStyle?: IndicatorStyle
  rotationMin?: number
  rotationMax?: number
  disabled?: boolean
  onChange: (value: number) => void
  color?: string
  labelColor?: string
  tooltip?: string
  showValue?: boolean
  labelPosition?: 'bottom' | 'top' | 'none'
  className?: string
}

interface KnobTheme {
  skirt: string
  cap: string
  ring: string
  indicator: string
  tick: string
  text: string
  metallic?: boolean
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const quantize = (v: number, min: number, max: number, step: number) => {
  const snapped = Math.round((clamp(v, min, max) - min) / step) * step + min
  return Number(clamp(snapped, min, max).toFixed(step < 1 ? 2 : 0))
}

/** Palettes de potentiomètres — une entrée par `KnobAppearance`. */
function knobTheme(style: KnobAppearance, color: string): KnobTheme {
  switch (style) {
    case 'black-silver':
      return {
        skirt: 'repeating-conic-gradient(from 0deg, #1b1d20 0deg 12deg, #0b0c0e 12deg 24deg)',
        cap: 'conic-gradient(from 45deg, #f8fafc, #cbd5e1, #e2e8f0, #94a3b8, #f8fafc)',
        ring: 'rgba(255,255,255,0.28)',
        indicator: '#111113',
        tick: 'rgba(15,23,42,0.55)',
        text: '#1c1917',
        metallic: true,
      }
    case 'cream':
      return {
        skirt: 'radial-gradient(circle at 35% 30%, #f5ebd6 0%, #d8c8a8 75%, #b8a482 100%)',
        cap: 'radial-gradient(circle at 35% 28%, #fffaf0 0%, #ebe0c8 72%, #c9b999 100%)',
        ring: 'rgba(255,255,255,0.7)',
        indicator: '#1c1917',
        tick: 'rgba(41,37,36,0.55)',
        text: '#1c1917',
      }
    case 'gold':
      return {
        skirt: 'radial-gradient(circle at 35% 30%, #3a2e18 0%, #19140c 78%)',
        cap: 'conic-gradient(from 90deg, #f7df94, #c59b38, #fdeaa8, #9c7521, #f7df94)',
        ring: 'rgba(253,224,71,0.45)',
        indicator: '#1c1917',
        tick: 'rgba(28,25,23,0.6)',
        text: '#1c1917',
        metallic: true,
      }
    case 'chrome':
      return {
        skirt: 'conic-gradient(from 45deg, #ffffff, #94a3b8, #f8fafc, #475569, #ffffff)',
        cap: 'conic-gradient(from 90deg, #f8fafc, #cbd5e1, #ffffff, #64748b, #f8fafc)',
        ring: 'rgba(255,255,255,0.9)',
        indicator: '#09090b',
        tick: 'rgba(15,23,42,0.6)',
        text: '#0f172a',
        metallic: true,
      }
    case 'metal':
    case 'aluminum':
      return {
        skirt: 'conic-gradient(from 135deg, #cbd5e1, #64748b, #e2e8f0, #475569, #cbd5e1)',
        cap: 'radial-gradient(circle at 32% 28%, #f1f5f9 0%, #94a3b8 55%, #475569 100%)',
        ring: 'rgba(255,255,255,0.6)',
        indicator: '#0f172a',
        tick: 'rgba(30,41,59,0.55)',
        text: '#1e293b',
        metallic: true,
      }
    case 'chicken-head':
      return {
        skirt: 'radial-gradient(circle at 35% 30%, #2c2f34 0%, #111315 80%)',
        cap: 'radial-gradient(circle at 35% 28%, #34383f 0%, #15171a 82%)',
        ring: 'rgba(255,255,255,0.18)',
        indicator: '#f8fafc',
        tick: 'rgba(30,41,59,0.6)',
        text: '#1e293b',
      }
    case 'pointer':
      return {
        skirt: 'radial-gradient(circle at 35% 30%, #2d3138 0%, #111317 82%)',
        cap: 'radial-gradient(circle at 35% 28%, #3f444e 0%, #181a1f 85%)',
        ring: 'rgba(255,255,255,0.22)',
        indicator: color,
        tick: 'rgba(30,41,59,0.55)',
        text: '#1e293b',
      }
    case 'skirted':
      return {
        skirt: 'repeating-conic-gradient(from 0deg, #1f2228 0deg 10deg, #0d0e11 10deg 20deg)',
        cap: 'radial-gradient(circle at 35% 28%, #2d3139 0%, #111317 80%)',
        ring: 'rgba(255,255,255,0.28)',
        indicator: '#f8fafc',
        tick: 'rgba(15,23,42,0.6)',
        text: '#1e293b',
      }
    case 'flat-top':
      return {
        skirt: 'linear-gradient(145deg, #27272a, #09090b)',
        cap: 'linear-gradient(180deg, #3f3f46 0%, #27272a 100%)',
        ring: 'rgba(255,255,255,0.3)',
        indicator: '#f8fafc',
        tick: 'rgba(30,41,59,0.55)',
        text: '#1e293b',
      }
    case 'dome':
      return {
        skirt: 'radial-gradient(circle at 35% 30%, #374151 0%, #111827 80%)',
        cap: 'radial-gradient(circle at 32% 24%, #ffffff 0%, #64748b 24%, #1e293b 78%, #090d16 100%)',
        ring: 'rgba(255,255,255,0.35)',
        indicator: '#f8fafc',
        tick: 'rgba(30,41,59,0.5)',
        text: '#1e293b',
      }
    case 'mini':
      return {
        skirt: 'radial-gradient(circle at 35% 30%, #3f3f46 0%, #18181b 82%)',
        cap: 'radial-gradient(circle at 35% 28%, #52525b 0%, #18181b 84%)',
        ring: 'rgba(255,255,255,0.2)',
        indicator: '#ffffff',
        tick: 'rgba(30,41,59,0.45)',
        text: '#1e293b',
      }
    case 'large':
      return {
        skirt: 'repeating-conic-gradient(from 0deg, #27272a 0deg 8deg, #121215 8deg 16deg)',
        cap: 'radial-gradient(circle at 35% 28%, #3f3f46 0%, #18181b 78%, #09090b 100%)',
        ring: 'rgba(255,255,255,0.22)',
        indicator: '#ffffff',
        tick: 'rgba(15,23,42,0.6)',
        text: '#1e293b',
      }
    case 'colored':
      return {
        skirt: `radial-gradient(circle at 35% 30%, ${color} 0%, #b44608 82%, #7c2d12 100%)`,
        cap: `radial-gradient(circle at 32% 28%, #ff934f 0%, ${color} 68%, #c2410c 100%)`,
        ring: 'rgba(255,255,255,0.35)',
        indicator: '#ffffff',
        tick: 'rgba(30,41,59,0.5)',
        text: '#1e293b',
      }
    case 'translucent':
      return {
        skirt: `radial-gradient(circle at 35% 30%, ${color}55 0%, rgba(255,255,255,0.28) 65%, rgba(15,23,42,0.45) 100%)`,
        cap: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.65) 0%, ${color}66 55%, rgba(15,23,42,0.5) 100%)`,
        ring: 'rgba(255,255,255,0.7)',
        indicator: '#ffffff',
        tick: 'rgba(30,41,59,0.45)',
        text: '#1e293b',
      }
    case 'led-ring':
      return {
        skirt: 'radial-gradient(circle at 35% 30%, #18181b 0%, #09090b 85%)',
        cap: 'radial-gradient(circle at 35% 28%, #27272a 0%, #111317 85%)',
        ring: `${color}88`,
        indicator: color,
        tick: 'rgba(148,163,184,0.4)',
        text: '#1e293b',
      }
    case 'thumbwheel':
      return {
        skirt: 'linear-gradient(180deg, #09090b 0%, #18181b 50%, #09090b 100%)',
        cap: 'repeating-linear-gradient(180deg, #3f3f46 0px, #3f3f46 3px, #18181b 3px, #18181b 6px)',
        ring: 'rgba(255,255,255,0.2)',
        indicator: color,
        tick: 'rgba(15,23,42,0.5)',
        text: '#1e293b',
      }
    case 'vintage-round':
      return {
        skirt: 'radial-gradient(circle at 35% 30%, #362e29 0%, #1c1714 75%, #0e0b0a 100%)',
        cap: 'radial-gradient(circle at 35% 28%, #473d36 0%, #211c19 78%, #100d0c 100%)',
        ring: 'rgba(245,235,214,0.25)',
        indicator: '#f5ebd6',
        tick: 'rgba(41,37,36,0.6)',
        text: '#1c1917',
      }
    case 'classic':
    case 'classic-round':
    default:
      return {
        skirt: 'radial-gradient(circle at 35% 30%, #3a3d42 0%, #17191c 70%, #0b0c0e 100%)',
        cap: 'radial-gradient(circle at 35% 28%, #2e3136 0%, #141619 78%, #0a0b0d 100%)',
        ring: 'rgba(255,255,255,0.16)',
        indicator: '#f8fafc',
        tick: 'rgba(15,23,42,0.55)',
        text: '#1e293b',
      }
  }
}

export function RotaryKnob({
  id: customId,
  value,
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  label,
  unit = '%',
  size = 48,
  knobStyle = 'classic',
  indicatorStyle = 'line',
  rotationMin = -135,
  rotationMax = 135,
  disabled = false,
  onChange,
  color = '#F26A1B',
  labelColor,
  tooltip,
  showValue = true,
  labelPosition = 'bottom',
  className = '',
}: RotaryKnobProps) {
  const [dragging, setDragging] = useState(false)
  const [hovered, setHovered] = useState(false)
  const autoId = useId()
  const id = customId ?? autoId
  const dragStartY = useRef(0)
  const dragStartValue = useRef(value)

  const safeValue = clamp(value, min, max)
  const ratio = max > min ? (safeValue - min) / (max - min) : 0
  const angle = rotationMin + ratio * (rotationMax - rotationMin)
  const theme = knobTheme(knobStyle, color)
  const resolvedLabelColor = labelColor ?? theme.text

  const commit = useCallback(
    (next: number) => {
      if (disabled) return
      const q = quantize(next, min, max, step)
      if (q !== safeValue) onChange(q)
    },
    [disabled, min, max, step, safeValue, onChange]
  )

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    ;(e.currentTarget as HTMLElement).focus?.()
    setDragging(true)
    dragStartY.current = e.clientY
    dragStartValue.current = safeValue

    const onMove = (ev: PointerEvent | MouseEvent) => {
      const dy = dragStartY.current - ev.clientY
      const sensitivity = ev.shiftKey ? 420 : 150
      commit(dragStartValue.current + (dy / sensitivity) * (max - min))
    }
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
    const coarse = Math.max(step, (max - min) / 10)
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault()
      commit(safeValue + (e.shiftKey ? coarse : step))
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault()
      commit(safeValue - (e.shiftKey ? coarse : step))
    } else if (e.key === 'PageUp') {
      e.preventDefault()
      commit(safeValue + coarse)
    } else if (e.key === 'PageDown') {
      e.preventDefault()
      commit(safeValue - coarse)
    } else if (e.key === 'Home') {
      e.preventDefault()
      commit(min)
    } else if (e.key === 'End') {
      e.preventDefault()
      commit(max)
    }
  }

  const isSkirted = knobStyle === 'skirted' || knobStyle === 'black-silver'
  const capSize = Math.round(size * (isSkirted ? 0.66 : 0.78))
  const tickCount = indicatorStyle === 'printed-scale' ? 11 : 9
  const indicatorColor =
    indicatorStyle === 'white-pointer'
      ? '#ffffff'
      : indicatorStyle === 'black-pointer'
        ? '#09090b'
        : indicatorStyle === 'colored-pointer' || indicatorStyle === 'pointer' || indicatorStyle === 'led-position'
          ? color
          : theme.indicator

  const labelEl =
    labelPosition !== 'none' ? (
      <div className="flex flex-col items-center leading-tight">
        <span
          style={{ color: resolvedLabelColor }}
          className="whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.08em]"
        >
          {label}
        </span>
        {showValue && (
          <span
            style={{ color: resolvedLabelColor }}
            className="whitespace-nowrap font-mono text-[7px] font-semibold tabular-nums opacity-70"
          >
            {Math.round(safeValue)}
            {unit}
          </span>
        )}
      </div>
    ) : null

  // Boîte = corps du knob uniquement → EquipmentShell ancre le corps à (x,y)%
  return (
    <div
      className={`relative inline-flex select-none items-center justify-center ${disabled ? 'pointer-events-none opacity-50' : ''} ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {labelPosition === 'top' && labelEl ? (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-0.5 -translate-x-1/2">{labelEl}</div>
      ) : null}

      {(dragging || hovered) && (
        <div
          role="tooltip"
          className="pointer-events-none absolute -top-7 left-1/2 z-40 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-900/95 px-2 py-0.5 font-mono text-[9px] font-semibold text-white shadow-lg"
        >
          {tooltip || label}: <span className="tabular-nums text-[#ff8a47]">{Math.round(safeValue)}{unit}</span>
        </div>
      )}

      <div
        id={id}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={safeValue}
        aria-valuetext={`${Math.round(safeValue)}${unit}`}
        aria-disabled={disabled}
        onPointerDown={handlePointerDown}
        onDoubleClick={(e) => {
          e.stopPropagation()
          commit(defaultValue ?? Math.round((min + max) / 2))
        }}
        onKeyDown={handleKeyDown}
        style={{ width: size, height: size }}
        className={`relative flex cursor-ns-resize touch-none items-center justify-center rounded-full outline-none transition-shadow ${
          dragging ? 'ring-2 ring-[#F26A1B]/70' : ''
        }`}
      >
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {knobStyle === 'led-ring' ? (
            <>
              <circle cx="50" cy="50" r="55" fill="none" stroke="rgba(15,23,42,0.35)" strokeWidth="4" />
              {Array.from({ length: 13 }).map((_, idx) => {
                const t = idx / 12
                const deg = rotationMin + t * (rotationMax - rotationMin)
                const lit = t <= ratio + 0.01
                const rad = ((deg - 90) * Math.PI) / 180
                return (
                  <circle
                    key={`led-${idx}`}
                    cx={50 + Math.cos(rad) * 55}
                    cy={50 + Math.sin(rad) * 55}
                    r={lit ? 2.4 : 1.7}
                    fill={lit ? color : 'rgba(100,116,139,0.4)'}
                  />
                )
              })}
            </>
          ) : (
            Array.from({ length: tickCount }).map((_, idx) => {
              const t = idx / (tickCount - 1)
              const deg = rotationMin + t * (rotationMax - rotationMin)
              const active = t <= ratio + 0.01
              const rad = ((deg - 90) * Math.PI) / 180
              const major = idx === 0 || idx === tickCount - 1 || idx === Math.floor(tickCount / 2)
              const r1 = 52
              const r2 = major ? 64 : 59
              return (
                <line
                  key={idx}
                  x1={50 + Math.cos(rad) * r1}
                  y1={50 + Math.sin(rad) * r1}
                  x2={50 + Math.cos(rad) * r2}
                  y2={50 + Math.sin(rad) * r2}
                  stroke={active ? (knobStyle === 'gold' ? theme.indicator : color) : theme.tick}
                  strokeWidth={major ? 2.6 : 1.8}
                  strokeLinecap="round"
                />
              )
            })
          )}
        </svg>

        <div
          style={{
            width: size,
            height: size,
            background: theme.skirt,
            boxShadow: dragging
              ? '0 8px 14px rgba(0,0,0,0.48), 0 0 0 2px rgba(242,106,27,0.4)'
              : '0 5px 10px rgba(0,0,0,0.42), 0 2px 3px rgba(0,0,0,0.3)',
            borderColor: theme.ring,
          }}
          className="relative flex items-center justify-center rounded-full border"
        >
          <div
            style={{
              width: capSize,
              height: capSize,
              background: theme.cap,
              transform: `rotate(${angle}deg)`,
              boxShadow: theme.metallic
                ? 'inset 0 1px 2px rgba(255,255,255,0.85), inset 0 -2px 3px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.35)'
                : 'inset 0 1px 2px rgba(255,255,255,0.25), 0 2px 5px rgba(0,0,0,0.45)',
            }}
            className="relative flex items-center justify-center rounded-full transition-transform duration-75 ease-out"
          >
            {knobStyle === 'chicken-head' && (
              <div
                aria-hidden="true"
                style={{
                  width: Math.max(7, Math.round(capSize * 0.28)),
                  height: Math.round(capSize * 0.72),
                  background: 'linear-gradient(180deg, #3f444c 0%, #16181c 100%)',
                  top: -Math.round(capSize * 0.22),
                }}
                className="absolute left-1/2 -translate-x-1/2 rounded-t-full rounded-b-md border border-white/15 shadow-md"
              />
            )}

            {indicatorStyle === 'dot' && (
              <span
                style={{ backgroundColor: indicatorColor, top: Math.max(3, Math.round(capSize * 0.14)) }}
                className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full shadow-sm"
              />
            )}
            {indicatorStyle === 'led-position' && (
              <span
                style={{ backgroundColor: color, boxShadow: `0 0 8px 2px ${color}`, top: Math.max(2, Math.round(capSize * 0.12)) }}
                className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
              />
            )}
            {indicatorStyle === 'notch' && (
              <span
                style={{ backgroundColor: color, height: Math.max(5, Math.round(capSize * 0.24)) }}
                className="absolute left-1/2 top-0.5 w-1 -translate-x-1/2 rounded-full"
              />
            )}
            {(indicatorStyle === 'line' ||
              indicatorStyle === 'pointer' ||
              indicatorStyle === 'white-pointer' ||
              indicatorStyle === 'black-pointer' ||
              indicatorStyle === 'colored-pointer' ||
              indicatorStyle === 'numbered-scale' ||
              indicatorStyle === 'printed-scale') && (
              <span
                style={{
                  backgroundColor: indicatorColor,
                  height: Math.max(6, Math.round(capSize * 0.36)),
                  top: Math.max(2, Math.round(capSize * 0.08)),
                }}
                className="absolute left-1/2 w-[2px] -translate-x-1/2 rounded-full"
              />
            )}
          </div>
        </div>
      </div>

      {labelPosition === 'bottom' && labelEl ? (
        <div className="pointer-events-none absolute top-full left-1/2 z-10 mt-0.5 -translate-x-1/2">{labelEl}</div>
      ) : null}
    </div>
  )
}
