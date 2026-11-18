import type { KeyboardEvent } from 'react'
import { cx } from '../../ui/cx'
import { clamp, useControllable } from '../lib/useControllable'
import { useRatioDrag } from '../lib/useRatioDrag'

const UNITY = 0.75 // position 0 dB
const TRACK_HEIGHT = 180
const METER_SEGMENTS = 18

/** Position du fader (0–1) → dB ; 0,75 vaut 0 dB. */
export function faderToDb(position: number): number {
  return position <= 0 ? -Infinity : 20 * Math.log10(position / UNITY)
}

const formatDb = (db: number) => (db === -Infinity ? '-∞' : `${db > 0 ? '+' : ''}${db.toFixed(1)}`)

interface SwitchProps {
  label: string
  letter: string
  active: boolean
  tone: 'danger' | 'warn' | 'accent'
  onClick: () => void
}

function ChannelSwitch({ label, letter, active, tone, onClick }: SwitchProps) {
  const toneClass =
    tone === 'danger'
      ? 'text-rose-500'
      : tone === 'warn'
        ? 'text-amber-600'
        : 'text-[color:var(--neu-accent)]'

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        'h-7 w-7 cursor-pointer rounded-full border border-[color:var(--neu-edge)] font-mono text-[11px] font-bold transition-[color,box-shadow] duration-150',
        active ? cx('neu-pressed', toneClass) : 'neu-flat-sm text-[color:var(--neu-text-faint)]'
      )}
    >
      {letter}
    </button>
  )
}

export interface ChannelFaderProps {
  /** Gain, 0 → 1 (0,75 = 0 dB). */
  volume?: number
  defaultVolume?: number
  onVolumeChange?: (volume: number) => void
  /** Panoramique, -1 (gauche) → 1 (droite). */
  pan?: number
  defaultPan?: number
  onPanChange?: (pan: number) => void
  muted?: boolean
  defaultMuted?: boolean
  onMutedChange?: (muted: boolean) => void
  solo?: boolean
  defaultSolo?: boolean
  onSoloChange?: (solo: boolean) => void
  armed?: boolean
  defaultArmed?: boolean
  onArmedChange?: (armed: boolean) => void
  /** Niveau du mini-vumètre, 0 → 1 ; absent : vumètre masqué. */
  level?: number
  label?: string
  className?: string
}

/** Tranche de console : fader vertical, panoramique, M/S/R et mini-vumètre. */
export function ChannelFader({
  volume,
  defaultVolume = UNITY,
  onVolumeChange,
  pan,
  defaultPan = 0,
  onPanChange,
  muted,
  defaultMuted = false,
  onMutedChange,
  solo,
  defaultSolo = false,
  onSoloChange,
  armed,
  defaultArmed = false,
  onArmedChange,
  level,
  label = 'CH 1',
  className,
}: ChannelFaderProps) {
  const [vol, setVol] = useControllable(volume, defaultVolume, onVolumeChange)
  const [panning, setPan] = useControllable(pan, defaultPan, onPanChange)
  const [isMuted, setMuted] = useControllable(muted, defaultMuted, onMutedChange)
  const [isSolo, setSolo] = useControllable(solo, defaultSolo, onSoloChange)
  const [isArmed, setArmed] = useControllable(armed, defaultArmed, onArmedChange)

  const fader = useRatioDrag<HTMLDivElement>((_x, y) => setVol(Number((1 - y).toFixed(3))))
  const panner = useRatioDrag<HTMLDivElement>((x) => {
    const next = Number((x * 2 - 1).toFixed(2))
    setPan(Math.abs(next) < 0.04 ? 0 : next) // aimant au centre
  })

  const onFaderKey = (event: KeyboardEvent) => {
    const step = event.key === 'PageUp' || event.key === 'PageDown' ? 0.1 : 0.02
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === 'PageUp') setVol(clamp(vol + step, 0, 1))
    else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'PageDown') setVol(clamp(vol - step, 0, 1))
    else if (event.key === 'Home') setVol(1)
    else if (event.key === 'End') setVol(0)
    else return
    event.preventDefault()
  }

  const onPanKey = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') setPan(clamp(panning - 0.1, -1, 1))
    else if (event.key === 'ArrowRight') setPan(clamp(panning + 0.1, -1, 1))
    else if (event.key === 'Home') setPan(0)
    else return
    event.preventDefault()
  }

  const lit = isMuted ? 0 : Math.round(clamp(level ?? 0, 0, 1) * METER_SEGMENTS)
  const panText = panning === 0 ? 'C' : `${panning < 0 ? 'G' : 'D'}${Math.round(Math.abs(panning) * 100)}`

  return (
    <div
      className={cx(
        'inline-flex w-24 select-none flex-col items-center gap-3 rounded-3xl border border-[color:var(--neu-edge)] neu-flat p-4',
        className
      )}
    >
      <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]">{label}</span>

      <div
        ref={panner.ref}
        {...panner.handlers}
        role="slider"
        tabIndex={0}
        aria-label={`${label} panoramique`}
        aria-valuemin={-1}
        aria-valuemax={1}
        aria-valuenow={panning}
        aria-valuetext={panText}
        onKeyDown={onPanKey}
        onDoubleClick={() => setPan(0)}
        className="relative h-3 w-full cursor-pointer touch-none rounded-full neu-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/60"
      >
        <span
          aria-hidden="true"
          className="absolute top-1/2 h-5 w-3 -translate-x-1/2 -translate-y-1/2 rounded-md border border-[color:var(--neu-edge)] neu-flat-sm"
          style={{ left: `${(panning + 1) * 50}%` }}
        />
      </div>
      <span className="-mt-1 font-mono text-[10px] font-bold text-[color:var(--neu-text-muted)]">PAN {panText}</span>

      <div className="flex items-stretch gap-2.5" style={{ height: TRACK_HEIGHT }}>
        <div
          ref={fader.ref}
          {...fader.handlers}
          role="slider"
          tabIndex={0}
          aria-orientation="vertical"
          aria-label={`${label} volume`}
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={vol}
          aria-valuetext={`${formatDb(faderToDb(vol))} dB`}
          onKeyDown={onFaderKey}
          onDoubleClick={() => setVol(UNITY)}
          className="relative w-4 cursor-pointer touch-none rounded-full neu-inset focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/60"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-1 h-px bg-[color:var(--neu-text-faint)]"
            style={{ top: `${(1 - UNITY) * 100}%` }}
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 grid h-7 w-9 -translate-x-1/2 translate-y-1/2 place-items-center rounded-lg border border-[color:var(--neu-edge)] neu-flat"
            style={{ bottom: `${vol * 100}%` }}
          >
            <span className="h-0.5 w-5 rounded-full bg-[color:var(--neu-accent)]" />
          </span>
        </div>

        {level !== undefined && (
          <div
            aria-hidden="true"
            className="flex w-2.5 flex-col-reverse justify-between gap-px rounded-full neu-inset p-0.5"
          >
            {Array.from({ length: METER_SEGMENTS }, (_, index) => (
              <span
                key={index}
                className={cx(
                  'w-full flex-1 rounded-full',
                  index >= lit
                    ? 'bg-[color:var(--neu-bg-hollow)]'
                    : index >= METER_SEGMENTS - 3
                      ? 'bg-[color:var(--neu-accent)]'
                      : 'bg-emerald-500'
                )}
              />
            ))}
          </div>
        )}
      </div>

      <span className="font-mono text-xs font-bold tabular-nums text-[color:var(--neu-text)]">
        {formatDb(faderToDb(vol))} dB
      </span>

      <div className="flex gap-1.5">
        <ChannelSwitch label={`${label} muet`} letter="M" active={isMuted} tone="danger" onClick={() => setMuted(!isMuted)} />
        <ChannelSwitch label={`${label} solo`} letter="S" active={isSolo} tone="warn" onClick={() => setSolo(!isSolo)} />
        <ChannelSwitch label={`${label} armer`} letter="R" active={isArmed} tone="accent" onClick={() => setArmed(!isArmed)} />
      </div>
    </div>
  )
}
