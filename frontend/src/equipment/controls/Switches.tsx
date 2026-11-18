import { useId, useState } from 'react'
import type { KnobAppearance } from '../types'

/* --- Toggle (toggle / mini / paddle / slide) --- */
export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  onLabel?: string
  offLabel?: string
  variant?: 'toggle' | 'mini-toggle' | 'paddle' | 'slide-switch'
  size?: number
  labelColor?: string
  tooltip?: string
  disabled?: boolean
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  onLabel = 'ON',
  offLabel = 'OFF',
  variant = 'toggle',
  size = 34,
  labelColor = '#1c1917',
  tooltip,
  disabled = false,
}: ToggleSwitchProps) {
  const id = useId()
  const effective = variant === 'mini-toggle' ? Math.max(24, Math.round(size * 0.72)) : size
  const nut = Math.max(14, Math.round(effective * 0.52))
  const isSlide = variant === 'slide-switch'
  const isPaddle = variant === 'paddle'

  return (
    <div className="inline-flex select-none flex-col items-center">
      <span style={{ color: labelColor }} className="mb-0.5 whitespace-nowrap font-mono text-[7px] font-bold uppercase tracking-wider opacity-85">
        {onLabel}
      </span>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? onLabel : offLabel}`}
        title={tooltip || `${label} (${checked ? onLabel : offLabel})`}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          onChange(!checked)
        }}
        style={{
          width: isSlide ? Math.max(34, effective) : Math.max(28, nut + 12),
          height: isSlide ? 18 : Math.max(28, nut + 12),
        }}
        className="relative flex cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#F26A1B]"
      >
        {isSlide ? (
          <span className="relative flex h-full w-full items-center rounded-sm border border-white/15 bg-zinc-950 p-0.5 shadow-inner">
            <span
              style={{ transform: checked ? 'translateX(100%)' : 'translateX(0%)' }}
              className="h-full w-1/2 rounded-[2px] border border-white/50 bg-gradient-to-b from-slate-200 to-slate-500 shadow transition-transform duration-150"
            />
          </span>
        ) : (
          <span
            aria-hidden="true"
            style={{ width: nut, height: nut }}
            className="flex items-center justify-center rounded-full border border-slate-500/70 bg-gradient-to-br from-slate-100 via-slate-300 to-slate-500 shadow-[0_3px_6px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.9)]"
          >
            <span className="relative flex h-[62%] w-[62%] items-center justify-center rounded-full bg-gradient-to-b from-slate-800 to-slate-600 shadow-inner">
              <span
                style={{
                  transform: checked ? 'translateY(-35%) scaleY(1.08)' : 'translateY(35%) scaleY(1.08)',
                }}
                className={`${
                  isPaddle
                    ? 'h-4 w-2.5 rounded-sm bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-500'
                    : variant === 'mini-toggle'
                      ? 'h-2.5 w-1 rounded-full bg-gradient-to-r from-slate-200 via-white to-slate-400'
                      : 'h-3.5 w-1.5 rounded-full bg-gradient-to-r from-slate-200 via-white to-slate-400'
                } border border-slate-400/60 shadow-[0_3px_5px_rgba(0,0,0,0.55)] transition-transform duration-150`}
              />
            </span>
          </span>
        )}
      </button>
      <span style={{ color: labelColor }} className="mt-0.5 whitespace-nowrap font-mono text-[7px] font-bold uppercase tracking-wider opacity-70">
        {offLabel}
      </span>
      <span style={{ color: labelColor }} className="mt-0.5 whitespace-nowrap text-[8px] font-bold uppercase tracking-wider">
        {label}
      </span>
    </div>
  )
}

/* --- Rocker (power / standby) --- */
export interface RockerSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  rockerColor?: 'red' | 'black'
  size?: number
  labelColor?: string
  disabled?: boolean
}

export function RockerSwitch({
  checked,
  onChange,
  label,
  rockerColor = 'red',
  size = 30,
  labelColor = '#1c1917',
  disabled = false,
}: RockerSwitchProps) {
  const isRed = rockerColor === 'red'
  const w = Math.max(18, Math.round(size * 0.72))
  const h = Math.max(24, size)

  // Boîte = corps rocker → ancrage façade au centre du hardware
  return (
    <div className="relative inline-flex select-none items-center justify-center" style={{ width: w, height: h }}>
      <span
        style={{ color: labelColor }}
        className="pointer-events-none absolute bottom-full left-1/2 mb-0.5 -translate-x-1/2 whitespace-nowrap text-[7px] font-bold uppercase tracking-wider"
      >
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? 'ON' : 'OFF'}`}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          onChange(!checked)
        }}
        style={{ width: w, height: h }}
        className="cursor-pointer rounded-[3px] border border-black/80 bg-zinc-900 p-[2px] shadow-[0_2px_4px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-[#F26A1B]"
      >
        <span
          className="flex h-full w-full flex-col justify-between rounded-[2px] p-0.5 transition-all duration-150"
          style={{
            background: isRed
              ? checked
                ? 'linear-gradient(180deg, rgba(255,120,120,0.95) 0%, #ef4444 40%, #991b1b 100%)'
                : 'linear-gradient(180deg, #991b1b 0%, #7f1d1d 55%, #450a0a 100%)'
              : checked
                ? 'linear-gradient(180deg, #52525b 0%, #27272a 55%, #18181b 100%)'
                : 'linear-gradient(180deg, #27272a 0%, #18181b 55%, #09090b 100%)',
            boxShadow:
              isRed && checked
                ? '0 0 14px rgba(239,68,68,0.9), inset 0 2px 4px rgba(255,255,255,0.5)'
                : 'inset 0 1px 2px rgba(255,255,255,0.2)',
            transform: checked ? 'perspective(40px) rotateX(12deg)' : 'perspective(40px) rotateX(-12deg)',
          }}
        >
          <span className="font-mono text-[6px] font-bold leading-none text-white/80">I</span>
          <span className="font-mono text-[6px] font-bold leading-none text-white/50">O</span>
        </span>
      </button>
    </div>
  )
}

/** Push circulaire façade (Channel Select style) — corps seul pour ancrage. */
export interface ChannelPushProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  size?: number
  labelColor?: string
  disabled?: boolean
}

export function ChannelPush({
  checked,
  onChange,
  label = 'CHANNEL',
  size = 18,
  labelColor = '#1c1917',
  disabled = false,
}: ChannelPushProps) {
  return (
    <div className="relative inline-flex select-none items-center justify-center" style={{ width: size, height: size }}>
      <span
        style={{ color: labelColor }}
        className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 whitespace-nowrap text-[6px] font-bold uppercase tracking-wider"
      >
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label}: ${checked ? 'DRIVE' : 'CLEAN'}`}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          onChange(!checked)
        }}
        style={{ width: size, height: size }}
        className="cursor-pointer rounded-full border border-black/70 bg-gradient-to-b from-zinc-600 to-zinc-900 shadow-[0_2px_4px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] outline-none focus-visible:ring-2 focus-visible:ring-[#F26A1B]"
      >
        <span
          className="mx-auto mt-[3px] block h-[40%] w-[40%] rounded-full"
          style={{
            background: checked ? '#22c55e' : '#3f3f46',
            boxShadow: checked ? '0 0 8px rgba(34,197,94,0.85)' : 'inset 0 1px 2px rgba(0,0,0,0.6)',
          }}
        />
      </button>
    </div>
  )
}

/* --- Footswitch (bouton au pied) --- */
export interface FootswitchProps {
  active: boolean
  onToggle: (next: boolean) => void
  label?: string
  activeLabel?: string
  bypassLabel?: string
  size?: number
  disabled?: boolean
}

export function Footswitch({
  active,
  onToggle,
  label = 'BYPASS',
  activeLabel = 'ON',
  bypassLabel = 'BYPASS',
  size = 46,
  disabled = false,
}: FootswitchProps) {
  const outer = Math.max(38, size)
  return (
    <div className="inline-flex select-none flex-col items-center gap-1">
      <button
        type="button"
        aria-pressed={active}
        aria-label={`${label}: ${active ? activeLabel : bypassLabel}`}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          onToggle(!active)
        }}
        style={{ width: outer, height: outer }}
        className="relative flex cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#F26A1B]"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-slate-500/70 bg-gradient-to-b from-slate-100 via-slate-300 to-slate-500 shadow-[0_6px_12px_rgba(0,0,0,0.48),inset_0_1px_1px_rgba(255,255,255,0.95)]"
        />
        <span
          aria-hidden="true"
          style={{ width: Math.round(outer * 0.78), height: Math.round(outer * 0.78) }}
          className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 shadow-inner"
        >
          <span
            aria-hidden="true"
            style={{ width: Math.round(outer * 0.64), height: Math.round(outer * 0.64) }}
            className="absolute rounded-full bg-gradient-to-b from-slate-700 to-slate-900 shadow-inner"
          />
          <span
            aria-hidden="true"
            style={{
              width: Math.round(outer * 0.56),
              height: Math.round(outer * 0.56),
              transform: active ? 'scale(0.91) translateY(1.5px)' : 'scale(1) translateY(-1px)',
            }}
            className="absolute rounded-full border border-white/80 bg-gradient-to-b from-white via-slate-200 to-slate-400 transition-transform duration-100"
          />
        </span>
      </button>
      <span
        data-state={active ? 'on' : 'bypass'}
        className={`rounded-full px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-wider transition-colors ${
          active ? 'bg-slate-900/90 text-amber-300' : 'bg-slate-900/65 text-slate-200'
        }`}
      >
        {active ? activeLabel : bypassLabel}
      </span>
    </div>
  )
}

/* --- Stomp pad (grand pad caoutchouc) --- */
export interface StompPadProps {
  active: boolean
  onToggle: (next: boolean) => void
  label?: string
  brandText?: string
  width?: number
  height?: number
  disabled?: boolean
  /** Pad nu : la façade dessine elle-même son marquage. */
  minimal?: boolean
}

export function StompPad({
  active,
  onToggle,
  label = 'Effet',
  brandText = 'WEBAMP',
  width = 210,
  height = 110,
  disabled = false,
  minimal = false,
}: StompPadProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`${label}: ${active ? 'ON' : 'BYPASS'}`}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onToggle(!active)
      }}
      style={{ width, height }}
      className="relative cursor-pointer rounded-lg border border-black/80 bg-gradient-to-b from-zinc-800 via-zinc-900 to-black p-[4px] shadow-[0_6px_10px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.18)] outline-none focus-visible:ring-2 focus-visible:ring-[#F26A1B]"
    >
      <span
        aria-hidden="true"
        style={{
          transform: active ? 'translateY(1.5px) scale(0.99)' : 'translateY(0)',
          backgroundImage:
            'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 0), linear-gradient(180deg, #27272a 0%, #18181b 100%)',
          backgroundSize: '4px 4px, 100% 100%',
        }}
        className={`relative flex h-full w-full flex-col items-center justify-center rounded-[5px] transition-transform duration-100 ${
          active ? 'shadow-[inset_0_3px_8px_rgba(0,0,0,0.9)]' : 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.12),0_2px_4px_rgba(0,0,0,0.6)]'
        }`}
      >
        {!minimal && (
          <>
            <span className="rounded-md border border-zinc-600/50 bg-zinc-900/70 px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.22em] text-zinc-400 shadow-inner">
              {brandText}
            </span>
            <span
              className={`mt-1.5 rounded-full px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-widest ${
                active ? 'bg-[#F26A1B]/20 text-[#ff934f]' : 'bg-black/40 text-zinc-400'
              }`}
            >
              {active ? 'ON' : 'BYPASS'}
            </span>
          </>
        )}
      </span>
    </button>
  )
}

/* --- Sélecteur à options (multi-position) --- */
export interface MultiSwitchProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  width?: number
  /** `vertical` : glissière crantée à libellés empilés (chrome compact). */
  orientation?: 'horizontal' | 'vertical'
  /** Barre pleine largeur et libellés réduits, sans séparateurs. */
  dense?: boolean
  labelColor?: string
  disabled?: boolean
}

export function MultiSwitch({
  label,
  options,
  value,
  onChange,
  width = 150,
  orientation = 'horizontal',
  dense = false,
  labelColor = '#f3d9cf',
  disabled = false,
}: MultiSwitchProps) {
  const activeIdx = Math.max(0, options.indexOf(value))
  // Chaque position occupe sa propre case dans la barre : le curseur clair
  // reste centré sous son libellé, sans déborder aux extrémités.
  const slot = 100 / Math.max(2, options.length)

  if (orientation === 'vertical') {
    const trackHeight = 58
    return (
      <div
        className={`inline-flex select-none flex-col items-start ${disabled ? 'pointer-events-none opacity-50' : ''}`}
        role="radiogroup"
        aria-label={label}
      >
        <span
          style={{ color: labelColor }}
          className="mb-1 whitespace-nowrap text-[7px] font-bold uppercase tracking-[0.14em]"
        >
          {label}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col justify-between" style={{ height: trackHeight }}>
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                role="radio"
                aria-checked={value === opt}
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(opt)
                }}
                style={{ color: labelColor }}
                className={`cursor-pointer text-right text-[6.5px] font-bold uppercase leading-none tracking-wide outline-none ${
                  value === opt ? 'opacity-100 underline decoration-[#F26A1B] underline-offset-2' : 'opacity-55 hover:opacity-85'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div
            style={{ height: trackHeight, width: 16 }}
            className="relative rounded-sm border border-white/25 bg-zinc-950 p-[2px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)]"
          >
            <div
              style={{ top: `calc(${activeIdx * slot}% + 1px)`, height: `calc(${slot}% - 2px)` }}
              className="pointer-events-none absolute left-[2px] right-[2px] rounded-[1px] border border-white/45 bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-600 shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-all duration-150"
            />
            <div className="absolute inset-0 flex flex-col">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  role="radio"
                  aria-checked={value === opt}
                  aria-label={`${label}: ${opt}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onChange(opt)
                  }}
                  className="flex-1 cursor-pointer opacity-0"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`inline-flex select-none flex-col ${dense ? 'items-stretch gap-0.5' : 'items-center gap-1'} ${
        disabled ? 'pointer-events-none opacity-50' : ''
      }`}
      role="radiogroup"
      aria-label={label}
      style={dense ? { width } : undefined}
    >
      <div className={dense ? 'flex items-center gap-1' : undefined}>
        {dense && (
          <span
            style={{ color: labelColor }}
            className="whitespace-nowrap text-[6px] font-bold uppercase leading-none tracking-[0.12em]"
          >
            {label}
          </span>
        )}
        <div
          style={{ width: dense ? undefined : Math.max(60, width * 0.45) }}
          className={`relative flex h-4 items-center rounded-sm border border-white/15 bg-zinc-950 p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.95)] ${
            dense ? 'flex-1' : ''
          }`}
        >
          <div
            style={{ left: `calc(${activeIdx * slot}% + 2px)`, width: `calc(${slot}% - 4px)` }}
            className="pointer-events-none absolute top-0.5 bottom-0.5 rounded-[2px] border border-white/40 bg-gradient-to-b from-zinc-300 via-zinc-400 to-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,0.8)] transition-all duration-150"
          />
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={value === opt}
              aria-label={`${label}: ${opt}`}
              onClick={(e) => {
                e.stopPropagation()
                onChange(opt)
              }}
              className="h-full flex-1 cursor-pointer opacity-0"
            />
          ))}
        </div>
      </div>

      <div className={`flex items-center ${dense ? 'justify-between gap-0.5' : 'gap-1.5'}`}>
        {options.map((opt, idx) => {
          const isActive = value === opt
          return (
            <span key={opt} className={`inline-flex items-center ${dense ? 'gap-0.5' : 'gap-1.5'}`}>
              {idx > 0 && !dense && (
                <span className="text-[8px] opacity-35" style={{ color: labelColor }}>
                  |
                </span>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onChange(opt)
                }}
                style={{ color: labelColor }}
                className={`cursor-pointer rounded px-0.5 font-bold uppercase outline-none ${
                  dense ? 'text-[6px] tracking-tight' : 'text-[8px] tracking-wider'
                } ${
                  isActive ? 'underline decoration-[#F26A1B] underline-offset-2 opacity-100' : 'opacity-55 hover:opacity-85'
                }`}
              >
                {opt}
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}

/* --- Sélecteur rotatif cranté --- */
export interface RotarySelectorProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  size?: number
  knobStyle?: KnobAppearance
  labelColor?: string
  accentColor?: string
  disabled?: boolean
  /** Masque la ligne « label : valeur » (libellés sérigraphiés par le chrome). */
  hideReadout?: boolean
}

export function RotarySelector({
  label,
  options,
  value,
  onChange,
  size = 38,
  labelColor = '#1e293b',
  accentColor = '#F26A1B',
  disabled = false,
  hideReadout = false,
}: RotarySelectorProps) {
  const activeIdx = Math.max(0, options.indexOf(value))
  const total = Math.max(2, options.length)
  const angle = -110 + (activeIdx / (total - 1)) * 220

  const cycle = (dir: 1 | -1) => {
    if (disabled || options.length === 0) return
    onChange(options[(activeIdx + dir + options.length) % options.length])
  }

  return (
    <div className={`inline-flex select-none flex-col items-center gap-1 ${disabled ? 'pointer-events-none opacity-50' : ''}`}>
      <button
        type="button"
        aria-label={`${label}: ${value}`}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          cycle(1)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault()
            cycle(1)
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault()
            cycle(-1)
          }
        }}
        style={{ width: size, height: size }}
        className="relative flex cursor-pointer items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-zinc-700 via-zinc-800 to-zinc-950 shadow-[0_4px_10px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-[#F26A1B]"
      >
        <div
          style={{ transform: `rotate(${angle}deg)` }}
          className="relative h-[74%] w-[74%] rounded-full border border-white/15 bg-gradient-to-b from-zinc-800 to-black transition-transform duration-150"
        >
          <span
            style={{ backgroundColor: accentColor }}
            className="absolute -top-1 left-1/2 h-3 w-1.5 -translate-x-1/2 rounded-t-full shadow-sm"
          />
        </div>
      </button>
      {!hideReadout && (
        <span style={{ color: labelColor }} className="whitespace-nowrap text-[7px] font-bold uppercase tracking-wider">
          {label}: <span className="font-mono">{value}</span>
        </span>
      )}
    </div>
  )
}
