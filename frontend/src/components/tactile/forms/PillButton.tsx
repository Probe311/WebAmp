import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../ui/cx'

export type PillButtonVariant = 'primary' | 'neutral' | 'pressed' | 'ghost' | 'danger'
export type PillButtonSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<PillButtonSize, string> = {
  sm: 'min-h-8 gap-1.5 px-4 py-1.5 text-xs',
  md: 'min-h-[42px] gap-2 px-6 py-2.5 text-sm',
  lg: 'min-h-[50px] gap-2.5 px-8 py-3.5 text-base',
}

export interface PillButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: PillButtonVariant
  size?: PillButtonSize
  iconLeft?: ReactNode
  iconRight?: ReactNode
  /** Alias kit : `icon` = iconLeft */
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  /** Remplace `iconLeft` par un indicateur et désactive le bouton. */
  loading?: boolean
  /** Alias kit */
  isLoading?: boolean
}

/**
 * CTA kit : carré arrondi (`rounded-2xl`), `neu-accent-btn` pour l'action principale.
 */
export function PillButton({
  variant = 'neutral',
  size = 'md',
  iconLeft,
  iconRight,
  icon,
  iconPosition = 'left',
  loading = false,
  isLoading,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: PillButtonProps) {
  const busy = loading || isLoading
  const left = iconLeft ?? (iconPosition !== 'right' ? icon : undefined)
  const right = iconRight ?? (iconPosition === 'right' ? icon : undefined)

  const variantClass =
    variant === 'primary'
      ? 'neu-accent-btn font-semibold'
      : variant === 'danger'
        ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[4px_4px_12px_rgba(244,63,94,0.35),-3px_-3px_8px_rgba(255,255,255,0.7)]'
        : variant === 'pressed'
          ? 'neu-pressed font-semibold text-[color:var(--neu-accent)]'
          : variant === 'ghost'
            ? 'bg-transparent text-[color:var(--neu-text-muted)] hover:neu-flat hover:text-[color:var(--neu-accent)]'
            : 'neu-flat font-medium text-[color:var(--neu-text)] hover:text-[color:var(--neu-accent)] active:neu-pressed'

  return (
    <button
      type={type}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={cx(
        'relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-2xl',
        'transition-all duration-150 active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        SIZE_CLASSES[size],
        variantClass,
        className
      )}
      {...rest}
    >
      {busy ? (
        <span
          aria-hidden="true"
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        left && <span className="shrink-0">{left}</span>
      )}
      {children != null && <span className="truncate">{children}</span>}
      {!busy && right && <span className="shrink-0">{right}</span>}
    </button>
  )
}
