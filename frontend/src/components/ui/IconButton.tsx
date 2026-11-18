import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cx } from './cx'

export type IconButtonVariant = 'ghost' | 'subtle' | 'danger'
export type IconButtonSize = 'sm' | 'md'

const SIZES: Record<IconButtonSize, string> = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
}

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** Nom accessible : devient `aria-label` et `title`. Obligatoire. */
  label: string
  variant?: IconButtonVariant
  size?: IconButtonSize
  /** État d'un bouton bascule (rend `aria-pressed`). */
  pressed?: boolean
  children: ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'ghost', size = 'md', pressed, className, children, type = 'button', ...rest },
  ref
) {
  const tone =
    variant === 'danger'
      ? 'text-[color:var(--neu-text-muted)] hover:text-rose-500'
      : 'text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]'

  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cx(
        'inline-grid cursor-pointer place-items-center rounded-full transition-all',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/50',
        SIZES[size],
        tone,
        pressed
          ? 'neu-pressed text-[color:var(--neu-accent)]'
          : variant === 'subtle'
            ? 'neu-flat'
            : 'hover:neu-flat-sm',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
})
