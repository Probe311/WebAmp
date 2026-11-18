import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { Eye, EyeOff, Lock, Search as SearchIcon, X } from 'lucide-react'
import { cx } from '../../ui/cx'
import {
  FieldFeedback,
  FieldLabel,
  fieldSurface,
  useFieldMeta,
  type FieldMeta,
} from './Field'

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>, FieldMeta {
  iconLeft?: ReactNode
  iconRight?: ReactNode
  shape?: 'pill' | 'rounded'
}

/** Champ texte simple : label, icônes optionnelles, aide ou erreur. */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, hint, error, id, iconLeft, iconRight, shape = 'pill', className, ...rest },
  ref
) {
  const { fieldId, hintId, errorId, showsHint, describedBy } = useFieldMeta({ id, hint, error })
  const surface = fieldSurface({
    shape,
    hasIconLeft: Boolean(iconLeft),
    hasIconRight: Boolean(iconRight),
    invalid: Boolean(error),
  })

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <div className="relative flex items-center">
        {iconLeft && (
          <span className="pointer-events-none absolute left-4 flex items-center text-[color:var(--neu-text-faint)]">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(surface.className, className)}
          
          {...rest}
        />
        {iconRight && (
          <span className="pointer-events-none absolute right-4 flex items-center text-[color:var(--neu-text-faint)]">
            {iconRight}
          </span>
        )}
      </div>
      <FieldFeedback hint={hint} error={error} hintId={hintId} errorId={errorId} showsHint={showsHint} />
    </div>
  )
})

export interface PasswordFieldProps extends Omit<TextFieldProps, 'type' | 'iconLeft' | 'iconRight'> {
  /** Libellé du bouton d'affichage, annoncé aux lecteurs d'écran. */
  revealLabel?: string
}

/** Champ mot de passe avec bascule d'affichage. */
export function PasswordField({
  label = 'Mot de passe',
  placeholder = '••••••••••••',
  error,
  className,
  revealLabel = 'Afficher le mot de passe',
  ...rest
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)
  const { fieldId, hintId, errorId, showsHint, describedBy } = useFieldMeta({ ...rest, error })
  const surface = fieldSurface({ shape: 'pill', hasIconLeft: true, hasIconRight: true, invalid: Boolean(error) })

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-4 flex items-center text-[color:var(--neu-text-faint)]">
          <Lock className="h-4 w-4" />
        </span>
        <input
          id={fieldId}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cx(surface.className, 'pr-12', className)}
          
          {...rest}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={revealLabel}
          aria-pressed={visible}
          title={visible ? 'Masquer le mot de passe' : revealLabel}
          className="absolute right-3.5 cursor-pointer rounded-full p-1.5 text-[color:var(--neu-text-faint)] transition-colors hover:text-[color:var(--neu-accent)]"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      <FieldFeedback hint={rest.hint} error={error} hintId={hintId} errorId={errorId} showsHint={showsHint} />
    </div>
  )
}

export interface SearchFieldProps extends Omit<TextFieldProps, 'iconLeft' | 'iconRight' | 'type'> {
  onClear?: () => void
  onSearch?: (value: string) => void
}

/** Champ de recherche : croix de purge et validation par Entrée. */
export function SearchField({
  value,
  onChange,
  onClear,
  onSearch,
  placeholder = 'Rechercher…',
  className,
  label,
  hint,
  error,
  id,
  ...rest
}: SearchFieldProps) {
  const { fieldId, hintId, errorId, showsHint, describedBy } = useFieldMeta({ id, hint, error })
  const hasValue = Boolean(value && String(value).length > 0)
  const surface = fieldSurface({ hasIconLeft: true, hasIconRight: true, invalid: Boolean(error) })

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>}
      <div className="relative flex items-center">
        <span className="pointer-events-none absolute left-4 flex items-center text-[color:var(--neu-text-faint)]">
          <SearchIcon className="h-4 w-4" />
        </span>
        <input
          id={fieldId}
          type="search"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-describedby={describedBy}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onSearch?.(String(value ?? ''))
          }}
          className={cx(surface.className, className)}
          {...rest}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Effacer la recherche"
            title="Effacer la recherche"
            className="absolute right-3 cursor-pointer rounded-full p-1 text-[color:var(--neu-text-faint)] transition-colors hover:text-[color:var(--neu-accent)]"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <FieldFeedback hint={hint} error={error} hintId={hintId} errorId={errorId} showsHint={showsHint} />
    </div>
  )
}
