import { useId, type ReactNode } from 'react'
import { cx } from '../../ui/cx'

/**
 * Métadonnées d'un champ : identifiant stable, cible `aria-describedby` et
 * rendu de l'aide / de l'erreur.
 */
export interface FieldMeta {
  label?: string
  hint?: string
  error?: string
  id?: string
}

export function useFieldMeta({ id, hint, error }: FieldMeta) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const hintId = `${fieldId}-hint`
  const errorId = `${fieldId}-error`
  const showsHint = Boolean(hint && !error)
  const describedBy =
    [showsHint ? hintId : undefined, error ? errorId : undefined].filter(Boolean).join(' ') || undefined

  return { fieldId, hintId, errorId, showsHint, describedBy }
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="px-1 text-xs font-semibold text-[color:var(--neu-text-muted)]">
      {children}
    </label>
  )
}

export interface FieldFeedbackProps {
  hint?: string
  error?: string
  hintId: string
  errorId: string
  showsHint: boolean
}

export function FieldFeedback({ hint, error, hintId, errorId, showsHint }: FieldFeedbackProps) {
  if (error) {
    return (
      <p id={errorId} role="alert" className="px-2 text-xs font-medium text-rose-500">
        {error}
      </p>
    )
  }
  if (showsHint && hint) {
    return (
      <p id={hintId} className="px-2 text-xs text-[color:var(--neu-text-faint)]">
        {hint}
      </p>
    )
  }
  return null
}

/** Style commun de tous les champs de saisie du design system. */
export function fieldSurface({
  shape = 'pill',
  hasIconLeft = false,
  hasIconRight = false,
  invalid = false,
}: {
  shape?: 'pill' | 'rounded'
  hasIconLeft?: boolean
  hasIconRight?: boolean
  invalid?: boolean
}): { className: string; style?: undefined } {
  return {
    className: cx(
      'neu-inset w-full py-2.5 text-sm text-[color:var(--neu-text)] outline-none transition-shadow',
      'placeholder:text-[color:var(--neu-text-faint)] disabled:cursor-not-allowed disabled:opacity-50',
      shape === 'pill' ? 'rounded-full' : 'rounded-2xl',
      hasIconLeft ? 'pl-11' : 'pl-5',
      hasIconRight ? 'pr-11' : 'pr-4',
      invalid
        ? 'ring-2 ring-rose-400'
        : 'focus:ring-2 focus:ring-[color:var(--neu-accent)]/40'
    ),
  }
}
