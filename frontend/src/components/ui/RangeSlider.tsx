import { useId, type InputHTMLAttributes } from 'react'
import { cx } from './cx'

export interface RangeSliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange' | 'min' | 'max' | 'step' | 'id'> {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  orientation?: 'horizontal' | 'vertical'
  /** Affiche la valeur à droite du label. */
  showValue?: boolean
  formatValue?: (value: number) => string
  id?: string
}

/**
 * Curseur du design system. S'appuie sur `input[type=range]` : clavier, lecteurs
 * d'écran et `dir=rtl` restent natifs. Le rendu vient de `tones-primitives.css`.
 */
export function RangeSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  orientation = 'horizontal',
  showValue = false,
  formatValue,
  id,
  className,
  disabled,
  ...rest
}: RangeSliderProps) {
  const generatedId = useId()
  const sliderId = id ?? generatedId
  const isVertical = orientation === 'vertical'
  const display = formatValue ? formatValue(value) : String(value)

  return (
    <div className={cx('flex gap-1.5', isVertical ? 'flex-col items-center' : 'flex-col', className)}>
      {(label || showValue) && (
        <div className={cx('flex items-center gap-2', isVertical ? 'flex-col' : 'justify-between')}>
          {label && (
            <label
              htmlFor={sliderId}
              className="text-[11px] font-semibold uppercase tracking-wide text-[var(--td-text-muted)]"
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-xs font-medium tabular-nums text-[var(--td-text-secondary)]">
              {display}
            </span>
          )}
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        className="td-slider"
        data-orientation={orientation}
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-valuetext={formatValue ? display : undefined}
        onChange={(e) => onChange(Number(e.target.value))}
        {...rest}
      />
    </div>
  )
}
