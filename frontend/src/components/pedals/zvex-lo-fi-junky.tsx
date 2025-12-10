
import { pedalLibrary } from '../../data/pedals'
import { Pedal } from '../Pedal'
import { Potentiometer } from '../Potentiometer'

export interface PedalComponentProps {
  values?: Record<string, number>
  onChange?: (param: string, value: number) => void
  bypassed?: boolean
}

const pedalId = 'zvex-lo-fi-junky'

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

export const ZvexLoFiJunkyControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters
  const controls = buildControls(params, values, onChange, model.accentColor)
  
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 w-full justify-items-center">
      {controls}
    </div>
  )
}

export const ZvexLoFiJunkyPedal = ({ values = {}, onChange, bypassed = false }: PedalComponentProps) => {
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
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 w-full justify-items-center">
        {buildControls(params, values, onChange, model.accentColor)}
      </div>
    </Pedal>
  )
}

export default ZvexLoFiJunkyPedal

