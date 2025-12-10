
import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { Pedal } from '../Pedal'
import { Slider } from '../Slider'

export interface PedalComponentProps {
  values?: Record<string, number>
  onChange?: (param: string, value: number) => void
  bypassed?: boolean
}

const pedalId = 'source-audio-programmable-eq'

export const SourceAudioProgrammableEqControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  // Séparer les bandes EQ du contrôle level
  const { bands, level } = useMemo(() => {
    const bands: Array<[string, any]> = []
    let levelParam: [string, any] | null = null

    Object.entries(model.parameters).forEach(([name, def]) => {
      if (name.toLowerCase() === 'level') {
        levelParam = [name, def]
      } else {
        bands.push([name, def])
      }
    })

    return { bands, level: levelParam }
  }, [model.parameters])

  const levelDef: any = level ? level[1] : null
  const levelName = level ? level[0] : null

  return (
    <div className="flex items-end gap-2 w-full">
      {/* Colonnes des bandes EQ */}
      <div className="flex items-end gap-1.5 flex-1 justify-center">
        {bands.map(([name, def]) => {
          const value = values[name] ?? def.default ?? 0
          return (
            <Slider
              key={name}
              label={def.label}
              value={value}
              min={def.min}
              max={def.max}
              orientation="vertical"
              onChange={(v) => onChange?.(name, v)}
              color={model.accentColor}
            />
          )
        })}
      </div>
      {/* Contrôle level séparé si présent */}
      {level && levelDef && levelName && (
        <div className="ml-2">
          <Slider
            label={levelDef.label || 'Level'}
            value={values[levelName] ?? levelDef.default ?? 0}
            min={levelDef.min ?? 0}
            max={levelDef.max ?? 100}
            orientation="vertical"
            onChange={(v) => onChange?.(levelName, v)}
            color={model.accentColor}
          />
        </div>
      )}
    </div>
  )
}

export const SourceAudioProgrammableEqPedal = ({ values = {}, onChange, bypassed = false }: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  return (
    <Pedal
      brand={model.brand}
      model={model.model}
      color={model.color}
      accentColor={model.accentColor}
      bypassed={bypassed}
      showFootswitch={false}
    >
      <SourceAudioProgrammableEqControls values={values} onChange={onChange} />
    </Pedal>
  )
}

export default SourceAudioProgrammableEqPedal

