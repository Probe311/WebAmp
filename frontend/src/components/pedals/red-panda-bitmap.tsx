
import { pedalLibrary } from '../../data/pedals'
import { Pedal } from '../Pedal'
import { Potentiometer } from '../Potentiometer'

export interface PedalComponentProps {
  values?: Record<string, number>
  onChange?: (param: string, value: number) => void
  bypassed?: boolean
}

const pedalId = 'red-panda-bitmap'

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

export const RedPandaBitmapControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters
  return (
    <div className="flex flex-row justify-center items-center gap-2 w-full" style={{ marginTop: '-0.5rem', marginBottom: '-0.5rem' }}>
      {buildControls(params, values, onChange, model.accentColor)}
    </div>
  )
}

export const RedPandaBitmapPedal = ({ values = {}, onChange, bypassed = false }: PedalComponentProps) => {
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
      <div className="flex flex-row justify-center items-center gap-2 w-full" style={{ marginTop: '-0.5rem', marginBottom: '-0.5rem' }}>
        {buildControls(params, values, onChange, model.accentColor)}
      </div>
    </Pedal>
  )
}

export default RedPandaBitmapPedal

