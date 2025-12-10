
import { pedalLibrary } from '../../data/pedals'
import { Pedal } from '../Pedal'
import { Potentiometer } from '../Potentiometer'
import { SwitchSelector } from '../SwitchSelector'

export interface PedalComponentProps {
  values?: Record<string, number>
  onChange?: (param: string, value: number) => void
  bypassed?: boolean
}

const pedalId = 'strymon-flint'

const renderControls = (
  params: Record<string, any>,
  values: Record<string, number>,
  onChange?: (param: string, value: number) => void,
  accentColor?: string
) => {
  const entries = Object.entries(params)
  const switchSelectors = entries.filter(([, def]) => (def as any).controlType === 'switch-selector')
  const knobs = entries.filter(([, def]) => (def as any).controlType !== 'switch-selector')

  return (
    <div className="flex flex-col gap-1.5 w-full items-center">
      {/* 2 switch-selectors en haut, centrés */}
      {switchSelectors.map(([name, def]) => {
        const value = values[name] ?? (def as any).default ?? 0
        return (
          <div key={name} className="w-full flex justify-center">
            <SwitchSelector
              value={value}
              min={(def as any).min}
              max={(def as any).max}
              labels={(def as any).labels}
              icons={(def as any).icons}
              color={accentColor || (def as any).color}
              onChange={(v: number) => onChange?.(name, v)}
              className="switch-selector-full-width"
            />
          </div>
        )
      })}

      {/* 3 knobs en ligne horizontale, centrés */}
      <div className="flex flex-row justify-center items-center gap-2 w-full">
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
              onChange={(v: number) => onChange?.(name, v)}
            />
          )
        })}
      </div>
    </div>
  )
}

export const StrymonFlintControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters
  return renderControls(params, values, onChange, model.accentColor)
}

export const StrymonFlintPedal = ({ values = {}, onChange, bypassed = false }: PedalComponentProps) => {
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

export default StrymonFlintPedal

