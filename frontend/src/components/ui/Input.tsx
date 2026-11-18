import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cx } from './cx'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label?: string
  /** Aide affichée sous le champ, reliée par `aria-describedby`. */
  hint?: string
  helperText?: string
  /** Erreur : remplace l'aide, passe le champ en `aria-invalid` + `role="alert"`. */
  error?: string
  id?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
  pill?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hint,
    helperText,
    error,
    id,
    className,
    icon,
    iconPosition = 'left',
    pill = true,
    ...rest
  },
  ref
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const help = hint || helperText
  const showsHint = Boolean(help && !error)
  const hintId = showsHint ? `${inputId}-hint` : undefined
  const errorId = error ? `${inputId}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="px-1 text-xs font-semibold text-[color:var(--neu-text-muted)]"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && iconPosition === 'left' && (
          <div className="pointer-events-none absolute left-4 flex items-center text-[color:var(--neu-text-faint)]">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(
            'w-full neu-inset py-2.5 text-sm text-[color:var(--neu-text)]',
            'placeholder:text-[color:var(--neu-text-faint)] outline-none transition-all',
            'focus:ring-2 focus:ring-[color:var(--neu-accent)]/40',
            'disabled:cursor-not-allowed disabled:opacity-50',
            pill ? 'rounded-full' : 'rounded-2xl',
            icon && iconPosition === 'left' ? 'pl-11 pr-4' : 'px-5',
            icon && iconPosition === 'right' ? 'pr-11 pl-4' : null,
            error ? 'ring-2 ring-rose-400' : null,
            className
          )}
          {...rest}
        />
        {icon && iconPosition === 'right' && (
          <div className="pointer-events-none absolute right-4 flex items-center text-[color:var(--neu-text-faint)]">
            {icon}
          </div>
        )}
      </div>
      {error ? (
        <span id={errorId} role="alert" className="px-2 text-xs font-medium text-rose-500">
          {error}
        </span>
      ) : showsHint ? (
        <span id={hintId} className="px-2 text-xs text-[color:var(--neu-text-faint)]">
          {help}
        </span>
      ) : null}
    </div>
  )
})
