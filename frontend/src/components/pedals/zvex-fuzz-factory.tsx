
import { pedalLibrary } from '../../data/pedals'
import { Pedal } from '../Pedal'
import { Potentiometer } from '../Potentiometer'

export interface PedalComponentProps {
  values?: Record<string, number>
  onChange?: (param: string, value: number) => void
  bypassed?: boolean
}

const pedalId = 'zvex-fuzz-factory'

const renderControls = (
  params: Record<string, any>,
  values: Record<string, number>,
  onChange?: (param: string, value: number) => void,
  accentColor?: string
) => {
  const knobs = Object.entries(params)

  return (
    <div className="flex flex-col gap-3 w-full items-center">
      {/* Première ligne : 3 knobs centrés */}
      <div className="flex flex-row justify-center items-center gap-3 w-full">
        {knobs.slice(0, 3).map(([name, def]) => {
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
      {/* Deuxième ligne : 2 knobs centrés */}
      {knobs.length > 3 && (
        <div className="flex flex-row justify-center items-center gap-3 w-full">
          {knobs.slice(3).map(([name, def]) => {
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
      )}
    </div>
  )
}

export const ZvexFuzzFactoryControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  const params = model.parameters
  return renderControls(params, values, onChange, model.accentColor)
}

export const ZvexFuzzFactoryPedal = ({ values = {}, onChange, bypassed = false }: PedalComponentProps) => {
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

export default ZvexFuzzFactoryPedal

