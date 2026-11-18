import type { LedColor, LedVariant } from '../types'

export interface LedIndicatorProps {
  active: boolean
  color?: LedColor
  label?: string
  size?: number
  variant?: LedVariant
  labelColor?: string
  hideLabel?: boolean
}

const LED_PALETTES: Record<LedColor, { on: string; off: string; glow: string }> = {
  red: {
    on: 'radial-gradient(circle at 35% 30%, #fecaca 0%, #ef4444 45%, #b91c1c 100%)',
    off: 'radial-gradient(circle at 35% 30%, #7f1d1d 0%, #450a0a 75%, #2a0606 100%)',
    glow: '0 0 12px 3px rgba(239,68,68,0.85), 0 0 4px rgba(254,202,202,0.9)',
  },
  orange: {
    on: 'radial-gradient(circle at 35% 30%, #fed7aa 0%, #F26A1B 48%, #c2410c 100%)',
    off: 'radial-gradient(circle at 35% 30%, #7c2d12 0%, #431407 80%)',
    glow: '0 0 12px 3px rgba(242,106,27,0.85), 0 0 4px rgba(254,215,170,0.9)',
  },
  amber: {
    on: 'radial-gradient(circle at 35% 30%, #fef3c7 0%, #f59e0b 48%, #b45309 100%)',
    off: 'radial-gradient(circle at 35% 30%, #78350f 0%, #451a03 80%)',
    glow: '0 0 12px 3px rgba(245,158,11,0.85), 0 0 4px rgba(254,243,199,0.9)',
  },
  green: {
    on: 'radial-gradient(circle at 35% 30%, #bbf7d0 0%, #22c55e 48%, #15803d 100%)',
    off: 'radial-gradient(circle at 35% 30%, #14532d 0%, #052e16 80%)',
    glow: '0 0 12px 3px rgba(34,197,94,0.85), 0 0 4px rgba(187,247,208,0.9)',
  },
  blue: {
    on: 'radial-gradient(circle at 35% 30%, #bfdbfe 0%, #3b82f6 48%, #1d4ed8 100%)',
    off: 'radial-gradient(circle at 35% 30%, #1e3a8a 0%, #172554 80%)',
    glow: '0 0 12px 3px rgba(59,130,246,0.85), 0 0 4px rgba(191,219,254,0.9)',
  },
  white: {
    on: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #fef3c7 55%, #fde68a 100%)',
    off: 'radial-gradient(circle at 35% 30%, #52525b 0%, #27272a 85%)',
    glow: '0 0 14px 4px rgba(255,255,255,0.95), 0 0 6px rgba(254,243,199,0.95)',
  },
  rgb: {
    on: 'conic-gradient(from 0deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #a855f7, #ef4444)',
    off: 'radial-gradient(circle at 35% 30%, #3f3f46 0%, #18181b 85%)',
    glow: '0 0 14px 4px rgba(168,85,247,0.85), 0 0 6px rgba(56,189,248,0.9)',
  },
}

export function LedIndicator({
  active,
  color = 'red',
  label,
  size = 12,
  variant = 'led',
  labelColor = '#1e293b',
  hideLabel = false,
}: LedIndicatorProps) {
  const palette = LED_PALETTES[color] ?? LED_PALETTES.red
  const bezel =
    variant === 'jewel'
      ? Math.max(18, size + 6)
      : variant === 'led-ring'
        ? Math.max(20, size + 8)
        : Math.max(12, size + 4)
  const isSquare = variant === 'square'
  const isRing = variant === 'led-ring'

  return (
    <div
      data-led-variant={variant}
      data-led-color={color}
      data-active={active ? 'true' : 'false'}
      className="inline-flex select-none flex-col items-center gap-0.5"
      role="status"
      aria-label={label ? `${label}: ${active ? 'allumé' : 'éteint'}` : active ? 'allumé' : 'éteint'}
    >
      <div
        style={{ width: bezel, height: bezel }}
        className={`flex items-center justify-center ${
          isSquare
            ? 'rounded-sm border border-[#eab6a4]/60 bg-zinc-900 p-[2px] shadow-inner'
            : variant === 'jewel'
              ? 'rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 p-[3px] shadow-[0_3px_6px_rgba(0,0,0,0.45)]'
              : isRing
                ? 'rounded-full border border-white/15 bg-zinc-950 p-[3px] shadow-inner'
                : 'rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 p-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.45)]'
        }`}
      >
        <span
          style={{
            background: isRing
              ? active
                ? 'radial-gradient(circle, #09090b 45%, transparent 46%), ' + palette.on
                : 'radial-gradient(circle, #09090b 45%, #27272a 46%)'
              : active
                ? palette.on
                : palette.off,
            boxShadow: active ? `${palette.glow}, inset 0 1px 2px rgba(255,255,255,0.7)` : 'inset 0 2px 3px rgba(0,0,0,0.65)',
          }}
          className={`relative block h-full w-full ${isSquare ? 'rounded-[2px]' : 'rounded-full'}`}
        >
          {!isRing && (
            <span aria-hidden="true" className="absolute left-[22%] top-[18%] h-[22%] w-[28%] rounded-full bg-white/60 blur-[0.5px]" />
          )}
        </span>
      </div>
      {label && !hideLabel && (
        <span style={{ color: labelColor }} className="mt-0.5 whitespace-nowrap text-[7px] font-bold uppercase leading-none tracking-wider">
          {label}
        </span>
      )}
    </div>
  )
}
