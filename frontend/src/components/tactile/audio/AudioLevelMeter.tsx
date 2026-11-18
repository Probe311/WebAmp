import { useEffect, useState, type ReactNode } from 'react'
import { BarChart2, Volume2, VolumeX } from 'lucide-react'
import { cx } from '../../ui/cx'

export type LevelMeterMode = 'leds' | 'fluid'
/** Variantes app (`compact`/`standard`) + alias kit. */
export type LevelMeterVariant =
  | 'compact'
  | 'standard'
  | 'wide-pills'
  | 'rounded-squares'
  | 'dual-pills'

const DB_MARKS = [
  { label: '+3', color: 'text-[color:var(--neu-accent)] font-bold' },
  { label: '0', color: 'text-[color:var(--neu-accent)] font-extrabold' },
  { label: '-3', color: 'text-amber-600 font-semibold' },
  { label: '-6', color: 'text-[color:var(--neu-text-muted)]' },
  { label: '-12', color: 'text-[color:var(--neu-text-muted)]' },
  { label: '-18', color: 'text-[color:var(--neu-text-muted)]' },
  { label: '-24', color: 'text-[color:var(--neu-text-faint)]' },
  { label: '-36', color: 'text-[color:var(--neu-text-faint)]' },
  { label: '-48', color: 'text-[color:var(--neu-text-faint)]' },
]

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

function normalizeVariant(variant: LevelMeterVariant): 'wide-pills' | 'rounded-squares' | 'dual-pills' {
  if (variant === 'compact' || variant === 'dual-pills') return 'dual-pills'
  if (variant === 'rounded-squares') return 'rounded-squares'
  return 'wide-pills'
}

function formatLabel(variant: LevelMeterVariant): string {
  const kind = normalizeVariant(variant)
  if (kind === 'rounded-squares') return 'CARRÉS'
  if (kind === 'dual-pills') return 'DOUBLE PILLS'
  return 'PILLS LARGES'
}

/** Couleur d'un segment selon sa hauteur dans l'échelle. */
function segmentStyle(index: number, total: number): { background: string; glow: string } {
  const fraction = index / Math.max(1, total - 1)
  if (fraction >= 0.88) return { background: 'var(--neu-accent)', glow: '0 0 10px var(--neu-accent-glow), 0 0 3px var(--neu-accent)' }
  if (fraction >= 0.74) return { background: '#f59e0b', glow: '0 0 8px rgba(245, 158, 11, 0.75)' }
  if (fraction >= 0.55) return { background: '#eab308', glow: '0 0 7px rgba(234, 179, 8, 0.7)' }
  if (fraction >= 0.28) return { background: '#22c55e', glow: '0 0 6px rgba(34, 197, 94, 0.65)' }
  return { background: '#10b981', glow: '0 0 6px rgba(16, 185, 129, 0.7)' }
}

type TrackKind = 'slim' | 'wide' | 'square'

interface ChannelBarProps {
  value: number
  peak: number
  segments: number
  mode: LevelMeterMode
  height: number
  kind: TrackKind
  muted: boolean
}

function ChannelBar({ value, peak, segments, mode, height, kind, muted }: ChannelBarProps) {
  const activeCount = Math.round(value * segments)
  const peakIndex = Math.round(peak * Math.max(1, segments - 1))
  const widthClass =
    kind === 'slim' ? 'w-3.5 rounded-full p-0.5' : kind === 'square' ? 'w-6 rounded-2xl p-1' : 'w-7 rounded-full p-1.5'
  const cellClass =
    kind === 'slim' ? 'h-1 rounded-full' : kind === 'square' ? 'h-1.5 rounded-[3px]' : 'h-[5px] rounded-full'

  return (
    <div
      className={cx('neu-inset relative flex flex-col justify-end overflow-hidden', widthClass)}
      style={{ height }}
    >
      {mode === 'leds' ? (
        <div className="flex h-full w-full flex-col-reverse justify-between gap-[2px]">
          {Array.from({ length: segments }, (_, index) => {
            const lit = index < activeCount
            const isPeakTick = !muted && index === peakIndex && peak > 0.05
            const style = segmentStyle(index, segments)
            return (
              <div
                key={index}
                className={cx('relative w-full transition-colors duration-75', cellClass)}
                style={{
                  backgroundColor: lit
                    ? style.background
                    : isPeakTick
                      ? 'var(--neu-accent)'
                      : 'var(--neu-bg-hollow)',
                  boxShadow: lit
                    ? style.glow
                    : isPeakTick
                      ? '0 0 8px var(--neu-accent)'
                      : 'inset 1px 1px 1.5px rgba(163, 177, 198, 0.4)',
                }}
              />
            )
          })}
        </div>
      ) : (
        <div className="relative flex h-full w-full flex-col justify-end">
          <div
            className={cx(
              'relative w-full overflow-hidden transition-[height] duration-75',
              kind === 'square' ? 'rounded-xl' : 'rounded-full'
            )}
            style={{
              height: `${Math.max(3, value * 100)}%`,
              background:
                'linear-gradient(to top, #10b981 0%, #22c55e 50%, #eab308 72%, var(--neu-accent) 85%, var(--neu-accent) 100%)',
              boxShadow: value > 0.85 ? '0 0 12px var(--neu-accent-glow)' : '0 0 6px rgba(16, 185, 129, 0.55)',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-1.5 rounded-full bg-white/60" />
          </div>
          {peak > 0.05 && (
            <div
              className="absolute inset-x-0 h-1 rounded-full bg-[color:var(--neu-accent)] shadow-[0_0_8px_var(--neu-accent)] transition-[bottom] duration-150"
              style={{ bottom: `${peak * 97}%` }}
            />
          )}
        </div>
      )}
    </div>
  )
}

export interface AudioLevelMeterProps {
  /** Niveau mono, utilisé si `leftLevel` / `rightLevel` sont absents. */
  level?: number
  leftLevel?: number
  rightLevel?: number
  /** Position de crête normalisée 0 → 1. */
  peakHold?: number
  leftPeakHold?: number
  rightPeakHold?: number
  label?: string
  sublabel?: string
  isStereo?: boolean
  variant?: LevelMeterVariant
  mode?: LevelMeterMode
  onVariantChange?: (variant: LevelMeterVariant) => void
  onModeChange?: (mode: LevelMeterMode) => void
  /** Rend les actions de format et de mode dans le panneau (défaut kit = true hors standalone). */
  showControls?: boolean
  showDb?: boolean
  dbValue?: number | string
  segments?: number
  height?: number
  /** Barres seules, sans le cadre d'analyseur. */
  standalone?: boolean
  className?: string
}

/**
 * Indicateur de niveau stéréo — chrome carte kit (header toggles, marques dB, footer).
 * Alias exporté : `AudioLevelIndicator`.
 */
export function AudioLevelMeter({
  level = 0.68,
  leftLevel,
  rightLevel,
  peakHold,
  leftPeakHold,
  rightPeakHold,
  label = 'INDICATEUR DE NIVEAU SONORE',
  sublabel = 'PEAK HOLD · TRUE RMS',
  isStereo = true,
  variant = 'compact',
  mode = 'leds',
  onVariantChange,
  onModeChange,
  showControls,
  showDb = true,
  dbValue,
  segments = 24,
  height = 240,
  standalone = false,
  className,
}: AudioLevelMeterProps) {
  const [activeVariant, setActiveVariant] = useState(variant)
  const [activeMode, setActiveMode] = useState(mode)
  const [muted, setMuted] = useState(false)
  const controlsVisible = showControls ?? !standalone

  useEffect(() => setActiveVariant(variant), [variant])
  useEffect(() => setActiveMode(mode), [mode])

  const leftValue = muted ? 0 : clamp01(leftLevel ?? level)
  const rightValue = muted ? 0 : clamp01(rightLevel ?? level * 0.94)
  const peakL = muted ? 0 : clamp01(leftPeakHold ?? peakHold ?? leftValue * 1.05)
  const peakR = muted ? 0 : clamp01(rightPeakHold ?? peakHold ?? rightValue * 1.05)
  const effectivePeak = Math.max(peakL, peakR)

  const displayDb =
    dbValue !== undefined
      ? typeof dbValue === 'number'
        ? `${dbValue > 0 ? '+' : ''}${dbValue.toFixed(1)} dB`
        : dbValue
      : effectivePeak >= 0.98
        ? '0.0 dB'
        : `${(-24 * (1 - effectivePeak)).toFixed(1)} dB`

  const state = muted ? 'MUTED' : effectivePeak > 0.88 ? 'OVERLOAD' : 'NOMINAL'
  const kind = normalizeVariant(activeVariant)
  const trackKind: TrackKind = kind === 'dual-pills' ? 'slim' : kind === 'rounded-squares' ? 'square' : 'wide'

  const setVariant = (next: LevelMeterVariant) => {
    setActiveVariant(next)
    onVariantChange?.(next)
  }

  const setMode = (next: LevelMeterMode) => {
    setActiveMode(next)
    onModeChange?.(next)
  }

  const bars: ReactNode =
    kind === 'dual-pills' ? (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2.5 font-mono text-[10px] font-bold text-[color:var(--neu-text-muted)]">
          <span>L</span>
          <span className="text-[color:var(--neu-text-faint)]">·</span>
          <span>R</span>
        </div>
        <div className="neu-inset flex items-center justify-center gap-1.5 rounded-full p-1">
          <ChannelBar value={leftValue} peak={peakL} segments={segments} mode={activeMode} height={height} kind="slim" muted={muted} />
          <ChannelBar value={rightValue} peak={peakR} segments={segments} mode={activeMode} height={height} kind="slim" muted={muted} />
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold tabular-nums text-[color:var(--neu-text)]">
          <span>{Math.round(leftValue * 100)}%</span>
          <span className="text-[color:var(--neu-text-faint)]">/</span>
          <span>{Math.round(rightValue * 100)}%</span>
        </div>
      </div>
    ) : isStereo ? (
      <div className="flex items-center gap-4">
        {[
          { key: '1 (L)', value: leftValue, peak: peakL },
          { key: '2 (R)', value: rightValue, peak: peakR },
        ].map((channel) => (
          <div key={channel.key} className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]">
              CH {channel.key}
            </span>
            <ChannelBar
              value={channel.value}
              peak={channel.peak}
              segments={segments}
              mode={activeMode}
              height={height}
              kind={trackKind}
              muted={muted}
            />
            <span className="font-mono text-[10px] font-bold tabular-nums text-[color:var(--neu-text)]">
              {Math.round(channel.value * 100)}%
            </span>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex flex-col items-center gap-2">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]">
          MONO
        </span>
        <ChannelBar
          value={leftValue}
          peak={peakL}
          segments={segments}
          mode={activeMode}
          height={height}
          kind={trackKind}
          muted={muted}
        />
        <span className="font-mono text-[10px] font-bold tabular-nums text-[color:var(--neu-text)]">
          {Math.round(leftValue * 100)}%
        </span>
      </div>
    )

  if (standalone) {
    return (
      <div className={cx('flex select-none flex-col items-center', className)}>
        {label && (
          <span className="mb-2 text-[11px] font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]">
            {label}
          </span>
        )}
        {bars}
        {showDb && (
          <span className="mt-2 font-mono text-xs font-bold tabular-nums text-[color:var(--neu-text-muted)]">
            {displayDb}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={cx('flex select-none flex-col items-center', className)}>
      <div className="neu-flat-lg neu-card relative flex flex-col items-center rounded-3xl p-6">
        <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-3 border-b border-[color:var(--neu-bg-hollow)] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="neu-flat flex h-8 w-8 items-center justify-center rounded-full text-[color:var(--neu-accent)]">
              <BarChart2 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold leading-tight tracking-tight text-[color:var(--neu-text)]">{label}</h4>
              <span className="font-mono text-[9px] leading-tight text-[color:var(--neu-text-faint)]">{sublabel}</span>
            </div>
          </div>

          {controlsVisible && (
            <div className="flex items-center gap-2">
              <div className="neu-inset flex items-center gap-1 rounded-full p-0.5">
                {(
                  [
                    { value: 'wide-pills' as const, label: 'Pills' },
                    { value: 'rounded-squares' as const, label: 'Carrés' },
                    { value: 'dual-pills' as const, label: 'Duo' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setVariant(option.value)}
                    className={cx(
                      'cursor-pointer rounded-full px-2 py-1 text-[9px] font-bold uppercase transition-all',
                      normalizeVariant(activeVariant) === option.value
                        ? 'neu-flat text-[color:var(--neu-accent)]'
                        : 'text-[color:var(--neu-text-faint)] hover:text-[color:var(--neu-text)]'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="neu-inset flex items-center gap-1 rounded-full p-0.5">
                {(
                  [
                    { value: 'leds' as const, label: 'LEDs' },
                    { value: 'fluid' as const, label: 'Fluide' },
                  ] as const
                ).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMode(option.value)}
                    className={cx(
                      'cursor-pointer rounded-full px-2 py-1 text-[9px] font-bold uppercase transition-all',
                      activeMode === option.value
                        ? 'neu-flat text-[color:var(--neu-accent)]'
                        : 'text-[color:var(--neu-text-faint)] hover:text-[color:var(--neu-text)]'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                title={muted ? 'Activer le son' : 'Couper le son (Mute)'}
                aria-pressed={muted}
                onClick={() => setMuted((current) => !current)}
                className={cx(
                  'cursor-pointer rounded-full p-2 transition-all',
                  muted
                    ? 'neu-pressed text-rose-500'
                    : 'neu-flat text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-accent)] active:neu-pressed'
                )}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>

        <div className="relative flex items-center gap-5 px-2 py-1">
          <div
            className="flex flex-col justify-between pr-2 text-right font-mono text-[9px] text-[color:var(--neu-text-muted)]"
            style={{ height }}
          >
            {DB_MARKS.map((mark) => (
              <div key={mark.label} className="flex items-center justify-end gap-1.5">
                <span className={mark.color}>{mark.label}</span>
                <span className="h-px w-1.5 bg-[color:var(--neu-text-faint)]/80" />
              </div>
            ))}
          </div>

          {bars}

          <div className="flex flex-col justify-between pl-3 font-mono text-[9px]" style={{ height }}>
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-bold uppercase text-[color:var(--neu-text-faint)]">Peak Crête</span>
              <span
                className={cx(
                  'text-[11px] font-bold tabular-nums',
                  effectivePeak > 0.88 ? 'text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text)]'
                )}
              >
                {displayDb}
              </span>
            </div>
            <div className="flex flex-col items-start gap-1">
              <span className="text-[8px] font-bold uppercase text-[color:var(--neu-text-faint)]">Format</span>
              <span className="neu-flat-sm rounded-full px-2 py-0.5 text-[9px] font-bold text-[color:var(--neu-text)]">
                {formatLabel(activeVariant)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] font-bold uppercase text-[color:var(--neu-text-faint)]">État</span>
              <span className="text-[9px] font-bold text-[color:var(--neu-accent)]">{state}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex w-full items-center justify-between border-t border-[color:var(--neu-bg-hollow)] px-1 pt-3.5 font-mono text-[10px] text-[color:var(--neu-text-muted)]">
          <div className="flex items-center gap-2">
            <span
              className={cx(
                'h-2.5 w-2.5 rounded-full',
                muted
                  ? 'bg-rose-500'
                  : effectivePeak > 0.88
                    ? 'animate-pulse bg-[color:var(--neu-accent)] shadow-[0_0_8px_var(--neu-accent)]'
                    : 'bg-emerald-500 shadow-[0_0_6px_#10b981]'
              )}
            />
            <span className="font-bold text-[color:var(--neu-text)]">
              {muted ? 'CANAL SILENCIEUX' : 'BUS AUDIO ANALOGIQUE'}
            </span>
          </div>
          <span>
            MAX CRÊTE : <strong className="text-[color:var(--neu-text)]">{Math.round(effectivePeak * 100)}%</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
