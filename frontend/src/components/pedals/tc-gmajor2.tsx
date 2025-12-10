
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

const pedalId = 'tc-gmajor2'

const buildControls = (
  params: Record<string, any>,
  values: Record<string, number>,
  onChange?: (param: string, value: number) => void,
  accentColor?: string
) => {
  const entries = Object.entries(params)
  const switchSelectors = entries.filter(([, def]) => (def as any).controlType === 'switch-selector')
  const sliders = entries.filter(([, def]) => (def as any).controlType === 'slider')
  const knobs = entries.filter(([, def]) => (def as any).controlType !== 'switch-selector' && (def as any).controlType !== 'slider')

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      {/* Ligne 1 : Switch-selectors et slider */}
      <div className="flex flex-row justify-center items-center gap-2 w-full flex-wrap">
        {switchSelectors.map(([name, def]) => {
          const value = values[name] ?? (def as any).default ?? 0
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
        })}
        {sliders.map(([name, def]) => {
    const value = values[name] ?? (def as any).default ?? 0
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
        })}
      </div>

      {/* Ligne 2 : 2 knobs */}
      <div className="flex flex-row justify-center items-center gap-3 w-full">
        {knobs.map(([name, def]) => {
          const value = values[name] ?? (def as any).default ?? 0
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
        })}
      </div>
    </div>
  )
}

export const TcGmajor2Controls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters
  return <>{buildControls(params, values, onChange, model.accentColor)}</>
}

export const TcGmajor2Pedal = ({ values = {}, onChange, bypassed = false }: PedalComponentProps) => {
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
      {buildControls(params, values, onChange, model.accentColor)}
    </Pedal>
  )
}

export default TcGmajor2Pedal

