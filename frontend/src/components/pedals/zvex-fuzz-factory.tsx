import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import type { PedalComponentProps } from './types'

const pedalId = 'zvex-fuzz-factory'

/**
 * Composant complet de la pédale ZVEX Fuzz Factory
 * Layout spécial : 3 knobs sur la première ligne, 2 knobs sur la deuxième ligne
 */
export function ZvexFuzzFactoryPedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  const knobs = useMemo(() => Object.entries(model.parameters), [model])

  const controls = useMemo(() => (
    <div className="flex flex-col gap-3 w-full items-center">
      {/* Première ligne : 3 knobs centrés */}
      <div className="flex flex-row justify-center items-center gap-3 w-full">
        {knobs.slice(0, 3).map(([name, def]) => {
          const value = values[name] ?? def.default ?? 0
          return (
            <Potentiometer
              key={name}
              label={def.label}
              value={value}
              min={def.min}
              max={def.max}
              color={model.accentColor}
              onChange={(v) => onChange?.(name, v)}
            />
          )
        })}
      </div>
      {/* Deuxième ligne : 2 knobs centrés */}
      {knobs.length > 3 && (
        <div className="flex flex-row justify-center items-center gap-3 w-full">
          {knobs.slice(3).map(([name, def]) => {
            const value = values[name] ?? def.default ?? 0
            return (
              <Potentiometer
                key={name}
                label={def.label}
                value={value}
                min={def.min}
                max={def.max}
                color={model.accentColor}
                onChange={(v) => onChange?.(name, v)}
              />
            )
          })}
        </div>
      )}
    </div>
  ), [knobs, values, onChange, model])

  return (
    <PedalFrame
      model={model}
      layout="flex"
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      showFootswitch={false}
      bottomActions={bottomActions}
    >
      {controls}
    </PedalFrame>
  )
}

// Export pour compatibilité avec l'ancien système
export const ZvexFuzzFactoryControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  const knobs = Object.entries(model.parameters)

  return (
    <div className="flex flex-col gap-3 w-full items-center">
      <div className="flex flex-row justify-center items-center gap-3 w-full">
        {knobs.slice(0, 3).map(([name, def]) => {
          const value = values[name] ?? def.default ?? 0
          return (
            <Potentiometer
              key={name}
              label={def.label}
              value={value}
              min={def.min}
              max={def.max}
              color={model.accentColor}
              onChange={(v) => onChange?.(name, v)}
            />
          )
        })}
      </div>
      {knobs.length > 3 && (
        <div className="flex flex-row justify-center items-center gap-3 w-full">
          {knobs.slice(3).map(([name, def]) => {
            const value = values[name] ?? def.default ?? 0
            return (
              <Potentiometer
                key={name}
                label={def.label}
                value={value}
                min={def.min}
                max={def.max}
                color={model.accentColor}
                onChange={(v) => onChange?.(name, v)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ZvexFuzzFactoryPedal

