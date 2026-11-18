import type { InputHTMLAttributes } from 'react'
import { cx } from '../../ui/cx'
import { useFieldMeta } from './Field'

export interface RangeFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'onChange' | 'min' | 'max' | 'step' | 'id'
  > {
  value: number
  onChange: (value: number) => void
  label?: string
  /** Unité affichée à côté de la valeur (%, dB, Hz…). */
  unit?: string
  min?: number
  max?: number
  step?: number
  id?: string
}

/**
 * Curseur linéaire du design system.
 *
 * La piste et le bouton sont dessinés, mais l'interaction est un
 * `input[type=range]` transparent superposé : clavier, `aria-valuetext` et
 * comportements natifs restent gratuits.
 */
export function RangeField({
  value,
  onChange,
  label,
  unit = '',
  min = 0,
  max = 100,
  step = 1,
  id,
  className,
  disabled = false,
  ...rest
}: RangeFieldProps) {
  const { fieldId } = useFieldMeta({ id })
  const ratio = max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)))
  const percentage = ratio * 100

  return (
    <div className={cx('flex w-full select-none flex-col gap-2', disabled && 'opacity-50', className)}>
      <div className="flex items-center justify-between gap-3 px-1">
        {label && (
          <label htmlFor={fieldId} className="text-xs font-semibold text-[color:var(--neu-text-muted)]">
            {label}
          </label>
        )}
        <span className="ml-auto text-xs font-bold tabular-nums text-[color:var(--neu-accent)]">
          {value}
          {unit && ` ${unit}`}
        </span>
      </div>

      <div className="relative flex h-6 w-full items-center">
        <div
          aria-hidden="true"
          className="neu-inset relative h-3 w-full overflow-hidden rounded-full"
        >
          <div
            className="h-full rounded-full transition-[width] duration-75"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #ff8c42, var(--neu-accent))',
            }}
          />
        </div>

        <div
          aria-hidden="true"
          className="neu-flat-sm pointer-events-none absolute -ml-3 grid h-6 w-6 place-items-center rounded-full"
          style={{ left: `${percentage}%` }}
        >
          <span className="h-2 w-2 rounded-full bg-[color:var(--neu-accent)] shadow-[0_0_6px_var(--neu-accent)]" />
        </div>

        <input
          id={fieldId}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-label={label}
          aria-valuetext={`${value}${unit ? ` ${unit}` : ''}`}
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...rest}
        />
      </div>
    </div>
  )
}
