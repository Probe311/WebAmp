import type { PedalModel } from '../../../data/pedals'
import { Potentiometer, type PotentiometerSize } from '../../Potentiometer'
import { Slider, type SliderThumbShape } from '../../Slider'
import { SwitchSelector } from '../../SwitchSelector'
import { resolveKnobSize } from './layoutUtils'

export function renderModelParams(
  model: PedalModel,
  values: Record<string, number>,
  onChange: ((param: string, value: number) => void) | undefined,
  accentColor: string,
  opts?: {
    knobSize?: PotentiometerSize
    className?: string
    compactSliders?: boolean
    thumbShape?: SliderThumbShape
  }
) {
  return Object.entries(model.parameters).map(([name, def]) => {
    const controlType = def.controlType || 'knob'
    const value = values[name] ?? def.default ?? 0

    if (controlType === 'slider') {
      return (
        <Slider
          key={name}
          label={def.label}
          value={value}
          min={def.min}
          max={def.max}
          orientation={def.orientation || 'vertical'}
          onChange={(v) => onChange?.(name, v)}
          color={accentColor}
          className={opts?.className}
          compact={opts?.compactSliders}
          thumbShape={opts?.thumbShape ?? model.ui?.sliderThumb ?? 'rect'}
        />
      )
    }

    if (controlType === 'switch-selector' && def.labels) {
      return (
        <SwitchSelector
          key={name}
          value={value}
          min={def.min}
          max={def.max}
          labels={def.labels}
          icons={def.icons}
          color={accentColor}
          onChange={(v) => onChange?.(name, v)}
          className={opts?.className}
        />
      )
    }

    return (
      <Potentiometer
        key={name}
        label={def.label}
        value={value}
        min={def.min}
        max={def.max}
        color={accentColor}
        size={resolveKnobSize(model, name, opts?.knobSize)}
        onChange={(v) => onChange?.(name, v)}
        className={opts?.className}
      />
    )
  })
}
