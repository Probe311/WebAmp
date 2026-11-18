import { SpectrumKnob, type SpectrumKnobSize } from './tactile/audio/SpectrumKnob'
import { neuSize, type NeuSize } from './tactile/tokens'

/** Tailles canoniques — map → SpectrumKnob. */
export type PotentiometerSize = 'S' | 'M' | 'L' | 's' | 'm' | 'l' | 'small' | 'medium' | 'large' | SpectrumKnobSize

export interface PotentiometerProps {
  value?: number
  min?: number
  max?: number
  label?: string
  unit?: string
  showValue?: boolean
  /** @deprecated ignore — SpectrumKnob porte son propre spectre */
  color?: string
  size?: PotentiometerSize
  step?: number
  onChange?: (value: number) => void
  disabled?: boolean
  className?: string
  bipolar?: boolean
}

function toKnobSize(size: PotentiometerSize = 'm'): SpectrumKnobSize {
  if (size === 'S' || size === 's' || size === 'small' || size === 'sm') return 'sm'
  if (size === 'L' || size === 'l' || size === 'large' || size === 'lg') return 'lg'
  if (size === 'M' || size === 'm' || size === 'medium' || size === 'md') return 'md'
  return neuSize(size as NeuSize)
}

/**
 * Potentiomètre app — délègue au knob spectre tactile (tokens NEU).
 */
export function Potentiometer({
  value = 0,
  min = 0,
  max = 100,
  label = '',
  unit = '%',
  showValue = true,
  size = 'm',
  step = 1,
  onChange,
  className = '',
}: PotentiometerProps) {
  return (
    <SpectrumKnob
      value={value}
      min={min}
      max={max}
      label={label}
      unit={unit}
      showValue={showValue}
      size={toKnobSize(size)}
      step={step}
      onChange={onChange ?? (() => undefined)}
      className={className}
    />
  )
}
