import { Knob } from './Knob'

export interface PotentiometerProps {
  value: number
  min?: number
  max?: number
  label?: string
  color?: string
  size?: 'small' | 'medium' | 'large'
  step?: number
  onChange: (value: number) => void
  disabled?: boolean
  className?: string
}

const SIZE_MAP: Record<NonNullable<PotentiometerProps['size']>, 'sm' | 'md' | 'lg'> = {
  small: 'sm',
  medium: 'md',
  large: 'lg'
}

export function Potentiometer({
  value,
  min = 0,
  max = 100,
  label = '',
  color,
  size = 'medium',
  step = 1,
  onChange,
  disabled = false,
  className = ''
}: PotentiometerProps) {
  const handleChange = (nextValue: number) => {
    if (disabled) return
    const steppedValue = Math.round(nextValue / step) * step
    onChange(steppedValue)
  }

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`.trim()}>
      <Knob
        label={label}
        value={value}
        min={min}
        max={max}
        onChange={handleChange}
        size={SIZE_MAP[size]}
        color={color}
        showValue
        disabled={disabled}
      />
    </div>
  )
}
