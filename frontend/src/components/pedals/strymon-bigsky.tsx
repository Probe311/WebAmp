
import { pedalLibrary } from '../../data/pedals'
import { Pedal } from '../Pedal'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'

export interface PedalComponentProps {
  values?: Record<string, number>
  onChange?: (param: string, value: number) => void
  bypassed?: boolean
}

const pedalId = 'strymon-bigsky'

const buildControls = (
  params: Record<string, any>,
  values: Record<string, number>,
  onChange?: (param: string, value: number) => void,
  accentColor?: string
) => {
  return Object.entries(params).map(([name, def]) => {
    const controlType = (def as any).controlType || 'knob'
    const value = values[name] ?? (def as any).default ?? 0

    if (controlType === 'slider') {
      const orientation = (def as any).orientation || 'vertical'
      return (
        <Slider
          key={name}
          label={(def as any).label}
          value={value}
          min={(def as any).min}
          max={(def as any).max}
          orientation={orientation}
          onChange={(v) => onChange?.(name, v)}
          color={accentColor || (def as any).color}
        />
      )
    }

    if (controlType === 'switch-selector' && (def as any).labels) {
      return (
        <SwitchSelector
          key={name}
          value={value}
          min={(def as any).min}
          max={(def as any).max}
          labels={(def as any).labels}
          icons={(def as any).icons}
          color={accentColor || (def as any).color}
          onChange={(v) => onChange?.(name, v)}
        />
      )
    }

    return (
      <Potentiometer
        key={name}
        label={(def as any).label}
        value={value}
        min={(def as any).min}
        max={(def as any).max}
        color={accentColor || (def as any).color}
        onChange={(v) => onChange?.(name, v)}
      />
    )
  })
}

const renderControls = (
  params: Record<string, any>,
  values: Record<string, number>,
  onChange?: (param: string, value: number) => void,
  accentColor?: string
) => {
  const controls = buildControls(params, values, onChange, accentColor)
  return (
    <div className="flex flex-row justify-center items-center gap-2 w-full" style={{ marginTop: '-0.5rem', marginBottom: '-0.5rem' }}>
      {controls}
    </div>
  )
}

export const StrymonBigskyControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters
  return renderControls(params, values, onChange, model.accentColor)
}

export const StrymonBigskyPedal = ({ values = {}, onChange, bypassed = false }: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters

  return (
    <Pedal
      brand={model.brand}
      model={model.model}
      color={model.color}
      accentColor={model.accentColor}
      bypassed={bypassed}
      showFootswitch={false}
    >
      {renderControls(params, values, onChange, model.accentColor)}
    </Pedal>
  )
}

export default StrymonBigskyPedal

