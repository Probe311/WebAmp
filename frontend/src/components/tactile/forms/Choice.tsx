import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cx } from '../../ui/cx'

/**
 * Cases, boutons radio et interrupteurs : mêmes lignes de libellé, même
 * indicateur de focus, seul le contrôle change. Tous reposent sur un `input`
 * natif masqué, donc clavier et lecteurs d'écran fonctionnent sans code dédié.
 */

function ChoiceRow({
  label,
  description,
  disabled,
  className,
  children,
}: {
  label?: ReactNode
  description?: string
  disabled?: boolean
  className?: string
  children: ReactNode
}) {
  return (
    <label
      className={cx(
        'group inline-flex cursor-pointer select-none items-start gap-3',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      {children}
      {(label || description) && (
        <span className="flex flex-col">
          {label && (
            <span className="text-sm font-medium text-[color:var(--neu-text)] transition-colors group-hover:text-[color:var(--neu-text)]">
              {label}
            </span>
          )}
          {description && <span className="text-xs text-[color:var(--neu-text-faint)]">{description}</span>}
        </span>
      )}
    </label>
  )
}

export interface CheckboxFieldProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: ReactNode
  description?: string
  disabled?: boolean
  className?: string
}

export function CheckboxField({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className,
}: CheckboxFieldProps) {
  return (
    <ChoiceRow label={label} description={description} disabled={disabled} className={className}>
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden="true"
        className={cx(
          'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-2xl transition-shadow peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--neu-accent)]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[color:var(--neu-bg)]',
          checked ? 'neu-accent-btn' : 'neu-inset'
        )}
      >
        <Check
          className={cx(
            'h-3.5 w-3.5 stroke-[3] text-white transition-opacity duration-150',
            checked ? 'opacity-100' : 'opacity-0'
          )}
        />
      </span>
    </ChoiceRow>
  )
}

export interface RadioOption<T extends string> {
  value: T
  label: ReactNode
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps<T extends string> {
  name: string
  value: T
  onChange: (value: T) => void
  options: readonly RadioOption<T>[]
  /** Nom accessible du groupe. */
  label: string
  className?: string
}

export function RadioGroup<T extends string>({
  name,
  value,
  onChange,
  options,
  label,
  className,
}: RadioGroupProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={cx('flex flex-col gap-3', className)}>
      {options.map((option) => {
        const isSelected = option.value === value
        return (
          <ChoiceRow
            key={option.value}
            label={option.label}
            description={option.description}
            disabled={option.disabled}
          >
            <input
              type="radio"
              name={name}
              className="peer sr-only"
              checked={isSelected}
              disabled={option.disabled}
              onChange={() => onChange(option.value)}
            />
            <span
              aria-hidden="true"
              className={cx(
                'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--neu-accent)]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[color:var(--neu-bg)]',
                isSelected ? 'neu-inset' : 'neu-flat-sm'
              )}
            >
              <span
                className={cx(
                  'h-2.5 w-2.5 rounded-full bg-[color:var(--neu-accent)] shadow-[0_0_8px_var(--neu-accent)] transition-transform duration-150',
                  isSelected ? 'scale-100' : 'scale-0'
                )}
              />
            </span>
          </ChoiceRow>
        )
      })}
    </div>
  )
}

export type ToggleSwitchSize = 'sm' | 'md' | 'lg'

const TOGGLE_SIZES: Record<ToggleSwitchSize, { track: string; thumb: string; shift: string }> = {
  sm: { track: 'h-6 w-10 p-0.5', thumb: 'h-5 w-5', shift: 'translate-x-4' },
  md: { track: 'h-7 w-14 p-1', thumb: 'h-5 w-5', shift: 'translate-x-7' },
  lg: { track: 'h-8 w-16 p-1', thumb: 'h-6 w-6', shift: 'translate-x-8' },
}

export interface ToggleSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: ReactNode
  description?: string
  disabled?: boolean
  size?: ToggleSwitchSize
  className?: string
}

export function ToggleSwitch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className,
}: ToggleSwitchProps) {
  const sizing = TOGGLE_SIZES[size]

  return (
    <ChoiceRow label={label} description={description} disabled={disabled} className={className}>
      <input
        type="checkbox"
        role="switch"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        aria-hidden="true"
        className={cx(
          'flex shrink-0 items-center rounded-full transition-shadow duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--neu-accent)]/50 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[color:var(--neu-bg)]',
          sizing.track,
          checked ? 'neu-pressed' : 'neu-inset'
        )}
      >
        <span
          className={cx(
            'neu-flat-sm grid place-items-center rounded-full transition-transform duration-200',
            sizing.thumb,
            checked ? sizing.shift : 'translate-x-0'
          )}
        >
          {checked && <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--neu-accent)]" />}
        </span>
      </span>
    </ChoiceRow>
  )
}
