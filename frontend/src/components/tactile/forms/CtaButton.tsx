import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cx } from '../../ui/cx'

/** Échelle squircle Softube — icon-only. */
export type CtaSize = 'xs' | 's' | 'm' | 'l' | 'xl'

export type CtaTone = 'neutral' | 'accent' | 'danger'

const SIZE_TILE: Record<CtaSize, string> = {
  xs: 'h-6 w-6 rounded-lg',
  s: 'h-8 w-8 rounded-xl',
  m: 'h-10 w-10 rounded-xl',
  /** Défaut kit Softube (`h-11`). */
  l: 'h-11 w-11 rounded-2xl',
  xl: 'h-14 w-14 rounded-2xl',
}

/** Classes icône Lucide recommandées par taille. */
export const CTA_ICON_CLASS: Record<CtaSize, string> = {
  xs: 'h-2.5 w-2.5',
  s: 'h-3.5 w-3.5',
  m: 'h-4 w-4',
  l: 'h-[18px] w-[18px]',
  xl: 'h-5 w-5',
}

const TONE_IDLE: Record<CtaTone, string> = {
  neutral: 'text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)]',
  accent: 'text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-accent)]',
  danger: 'text-[color:var(--neu-text-muted)] hover:text-red-500',
}

const TONE_ACTIVE: Record<CtaTone, string> = {
  neutral: 'text-[color:var(--neu-text)]',
  accent: 'text-[color:var(--neu-accent)]',
  danger: 'text-red-500',
}

export interface CtaButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Nom accessible → `aria-label` + `title`. */
  label: string
  size?: CtaSize
  tone?: CtaTone
  /** État enfoncé / actif (`aria-pressed`). */
  pressed?: boolean
  children: ReactNode
}

/**
 * CTA icon-only squircle (`neu-cta-flat` / `neu-pressed`).
 * Tailles : XS · S · M · L · XL.
 */
export function CtaButton({
  label,
  size = 'l',
  tone = 'neutral',
  pressed = false,
  className,
  children,
  type = 'button',
  ...rest
}: CtaButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cx(
        'inline-grid shrink-0 cursor-pointer place-items-center transition-shadow',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/50',
        'disabled:cursor-not-allowed disabled:opacity-40',
        SIZE_TILE[size],
        pressed ? 'neu-pressed' : 'neu-cta-flat',
        pressed ? TONE_ACTIVE[tone] : TONE_IDLE[tone],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
