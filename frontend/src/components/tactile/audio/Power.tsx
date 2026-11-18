import { Power as PowerIcon } from 'lucide-react'
import { cx } from '../../ui/cx'
import { useControllable } from '../lib/useControllable'
import { neuSize, type NeuSize, type TactileSize } from '../tokens'

export type PowerVariant = 'button' | 'rocker'
export type PowerSize = NeuSize | TactileSize

const SIZE_CFG = {
  sm: {
    bezel: 'h-14 w-14 p-1.5',
    icon: 'h-4 w-4',
    led: 'h-1.5 w-1.5',
    rocker: 'h-8 w-14 p-1',
  },
  md: {
    bezel: 'h-20 w-20 p-2',
    icon: 'h-6 w-6',
    led: 'h-2 w-2',
    rocker: 'h-10 w-20 p-1.5',
  },
  lg: {
    bezel: 'h-28 w-28 p-2.5',
    icon: 'h-8 w-8',
    led: 'h-2.5 w-2.5',
    rocker: 'h-12 w-24 p-1.5',
  },
} as const

export interface PowerProps {
  powered?: boolean
  defaultPowered?: boolean
  onPoweredChange?: (powered: boolean) => void
  /** Alias kit. */
  onChange?: (powered: boolean) => void
  variant?: PowerVariant
  size?: PowerSize
  label?: string
  showLed?: boolean
  showStatus?: boolean
  disabled?: boolean
  className?: string
}

/** Interrupteur d'alimentation : bouton rond (bezel inset) ou bascule rocker. */
export function Power({
  powered,
  defaultPowered = false,
  onPoweredChange,
  onChange,
  variant = 'button',
  size = 'm',
  label = 'ALIMENTATION',
  showLed = true,
  showStatus,
  disabled = false,
  className,
}: PowerProps) {
  const [on, setOn] = useControllable(powered, defaultPowered, (next) => {
    onPoweredChange?.(next)
    onChange?.(next)
  })
  const cfg = SIZE_CFG[neuSize(size)]
  const statusVisible = showStatus ?? showLed

  if (variant === 'rocker') {
    return (
      <div className={cx('inline-flex select-none flex-col items-center gap-2.5', disabled && 'opacity-50', className)}>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={label}
          title={on ? 'Éteindre' : 'Allumer'}
          disabled={disabled}
          onClick={() => setOn(!on)}
          className={cx(
            'neu-inset relative flex cursor-pointer items-center justify-between rounded-2xl transition-all disabled:cursor-not-allowed',
            cfg.rocker
          )}
        >
          <span
            className={cx(
              'flex h-full flex-1 items-center justify-center rounded-xl font-mono text-[10px] font-extrabold transition-all duration-150',
              !on ? 'neu-flat text-[color:var(--neu-text)]' : 'text-[color:var(--neu-text-faint)]'
            )}
          >
            O
          </span>
          <span
            className={cx(
              'flex h-full flex-1 items-center justify-center rounded-xl font-mono text-[10px] font-extrabold transition-all duration-150',
              on
                ? 'neu-flat text-[color:var(--neu-accent)] shadow-[0_0_10px_var(--neu-accent-glow)]'
                : 'text-[color:var(--neu-text-faint)]'
            )}
          >
            I
          </span>
        </button>

        <div className="flex flex-col items-center text-center">
          {label && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]">
              {label}
            </span>
          )}
          {statusVisible && (
            <span
              className={cx(
                'mt-0.5 flex items-center gap-1.5 font-mono text-[10px] font-bold',
                on ? 'text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text-faint)]'
              )}
            >
              <span
                aria-hidden="true"
                className={cx(
                  'h-1.5 w-1.5 rounded-full',
                  on ? 'bg-[color:var(--neu-accent)] shadow-[0_0_6px_var(--neu-accent)]' : 'bg-[color:var(--neu-text-faint)]'
                )}
              />
              {on ? 'ON · ACTIF' : 'OFF · VEILLE'}
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cx('inline-flex select-none flex-col items-center gap-3', disabled && 'opacity-50', className)}>
      <div
        className={cx(
          'neu-inset relative flex items-center justify-center rounded-full',
          cfg.bezel
        )}
      >
        {on && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-1 rounded-full ring-2 ring-[color:var(--neu-accent)]/35"
          />
        )}

        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={label}
          title={on ? 'Mettre en veille' : 'Allumer le système'}
          disabled={disabled}
          onClick={() => setOn(!on)}
          className={cx(
            'relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-full transition-all duration-200 disabled:cursor-not-allowed',
            on
              ? 'neu-pressed text-[color:var(--neu-accent)]'
              : 'neu-flat text-[color:var(--neu-text-faint)] hover:text-[color:var(--neu-text-muted)] active:neu-pressed'
          )}
        >
          <PowerIcon
            className={cx(cfg.icon, 'transition-all duration-200', on && 'drop-shadow-[0_0_8px_var(--neu-accent-glow)]')}
            strokeWidth={2.5}
          />
          {showLed && (
            <span
              aria-hidden="true"
              className={cx(
                'mt-1 rounded-full transition-all duration-200',
                cfg.led,
                on ? 'bg-[color:var(--neu-accent)] shadow-[0_0_8px_var(--neu-accent)]' : 'bg-[color:var(--neu-bg-hollow)]'
              )}
            />
          )}
        </button>
      </div>

      {(label || statusVisible) && (
        <div className="flex flex-col items-center text-center">
          {label && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]">
              {label}
            </span>
          )}
          {statusVisible && (
            <span
              className={cx(
                'mt-0.5 font-mono text-[10px] font-bold',
                on ? 'text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text-faint)]'
              )}
            >
              {on ? 'ACTIF (ON)' : 'VEILLE (OFF)'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
