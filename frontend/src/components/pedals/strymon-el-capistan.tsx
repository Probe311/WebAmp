
import { pedalLibrary } from '../../data/pedals'
import { Pedal } from '../Pedal'
import { Potentiometer } from '../Potentiometer'

export interface PedalComponentProps {
  values?: Record<string, number>
  onChange?: (param: string, value: number) => void
  bypassed?: boolean
}

const pedalId = 'strymon-el-capistan'

const buildControls = (
  params: Record<string, any>,
  values: Record<string, number>,
  onChange?: (param: string, value: number) => void,
  accentColor?: string
) => {
  return Object.entries(params).map(([name, def]) => {
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
  })
}

export const StrymonElCapistanControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters
  const controls = buildControls(params, values, onChange, model.accentColor)
  
  // 3 knobs en haut, 2 en bas
  const topRow = controls.slice(0, 3)
  const bottomRow = controls.slice(3)
  
  return (
    <div className="flex flex-col w-full items-center">
      <div className="flex flex-row justify-center items-center gap-2 w-full">
        {topRow}
      </div>
      <div className="flex flex-row justify-center items-center gap-2 w-full">
        {bottomRow}
      </div>
    </div>
  )
}

export const StrymonElCapistanPedal = ({ values = {}, onChange, bypassed = false }: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters
  const controls = buildControls(params, values, onChange, model.accentColor)
  
  const topRow = controls.slice(0, 3)
  const bottomRow = controls.slice(3)

  return (
    <Pedal
      brand={model.brand}
      model={model.model}
      color={model.color}
      accentColor={model.accentColor}
      bypassed={bypassed}
      showFootswitch={false}
    >
      <div className="flex flex-col w-full items-center">
        <div className="flex flex-row justify-center items-center gap-2 w-full">
          {topRow}
        </div>
        <div className="flex flex-row justify-center items-center gap-2 w-full">
          {bottomRow}
        </div>
      </div>
    </Pedal>
  )
}

export default StrymonElCapistanPedal

