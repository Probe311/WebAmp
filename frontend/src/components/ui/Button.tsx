import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cx } from './cx'
import { NEU_TOKENS } from '../tactile/tokens'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'neutral' | 'pressed'
export type ButtonSize = 'sm' | 'md' | 'lg'

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-8 gap-1.5 px-4 py-1.5 text-xs',
  md: 'min-h-[42px] gap-2 px-6 py-2.5 text-sm',
  lg: 'min-h-[50px] gap-2.5 px-8 py-3.5 text-base',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Désactive le bouton et remplace l'icône de gauche par un indicateur. */
  loading?: boolean
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
  /** @deprecated use iconLeft */
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
}

/**
 * CTA app — carré arrondi neumorphique (tokens NEU).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'neutral',
    size = 'md',
    loading,
    isLoading,
    fullWidth,
    iconLeft,
    iconRight,
    icon,
    iconPosition = 'left',
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const busy = Boolean(loading || isLoading)
  const left = iconLeft ?? (iconPosition === 'left' ? icon : undefined)
  const right = iconRight ?? (iconPosition === 'right' ? icon : undefined)

  const v = variant === 'secondary' ? 'neutral' : variant

  const variantClass =
    v === 'primary'
      ? NEU_TOKENS.surfaces.accentBtn
      : v === 'pressed'
        ? `${NEU_TOKENS.surfaces.pressed} font-semibold text-[color:var(--neu-accent)]`
        : v === 'danger'
          ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-[4px_4px_12px_rgba(244,63,94,0.35)]'
          : v === 'ghost'
            ? 'bg-transparent text-[color:var(--neu-text-muted)] hover:neu-flat hover:text-[color:var(--neu-accent)]'
            : `${NEU_TOKENS.surfaces.flat} font-medium text-[color:var(--neu-text)] hover:text-[color:var(--neu-accent)] active:neu-pressed`

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || busy}
      className={cx(
        'relative inline-flex shrink-0 cursor-pointer select-none items-center justify-center whitespace-nowrap rounded-2xl transition-all duration-150',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[0.98]',
        SIZE_CLASSES[size],
        variantClass,
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {busy ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
      ) : (
        left && <span className="shrink-0">{left}</span>
      )}
      <span>{children}</span>
      {!busy && right && <span className="shrink-0">{right}</span>}
    </button>
  )
})
