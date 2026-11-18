import { InputHTMLAttributes } from 'react'
import { cx } from '../../components/ui/cx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

/**
 * Champ d'authentification — encastrement `neu-inset` et anneau d'erreur
 * tokenisés. Les états visuels passent par des classes hover/focus, plus par
 * des écritures `style` conditionnées à `document.documentElement`.
 */
export function AuthField({ label, error, hint, className = '', ...inputProps }: Props) {
  const hasError = Boolean(error)
  const showLabel = Boolean(label)

  return (
    <div className={showLabel ? 'space-y-1.5' : 'space-y-0'}>
      {showLabel && (
        <label className="block text-xs font-semibold uppercase tracking-[0.5px] text-[color:var(--neu-text-muted)]">
          {label}
        </label>
      )}
      <input
        {...inputProps}
        aria-label={!showLabel ? inputProps.name || inputProps.placeholder || 'field' : undefined}
        aria-invalid={hasError || undefined}
        className={cx(
          'neu-inset w-full rounded-full bg-[color:var(--neu-bg)] px-4 py-3 text-sm text-[color:var(--neu-text)]',
          'placeholder:text-[color:var(--neu-text-faint)] transition-shadow duration-150',
          'focus:ring-2 focus:ring-[color:var(--neu-accent)]/40 disabled:cursor-not-allowed disabled:opacity-50',
          hasError && 'ring-2 ring-rose-400',
          className
        )}
      />
      {hint && !hasError && <p className="px-2 text-xs text-[color:var(--neu-text-faint)]">{hint}</p>}
      {hasError && (
        <p role="alert" className="px-2 text-xs font-medium text-rose-500">
          {error}
        </p>
      )}
    </div>
  )
}
