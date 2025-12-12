import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import type { PedalComponentProps } from './types'

const pedalId = 'zvex-lo-fi-junky'

/**
 * Composant complet de la pédale ZVEX Lo-Fi Junky
 * Layout grid : 4 knobs en grille 2x2
 */
export function ZvexLoFiJunkyPedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  const controls = useMemo(() => {
    return (
      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 w-full justify-items-center">
        {Object.entries(model.parameters).map(([name, def]) => {
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
    )
  }, [model, values, onChange])

  return (
    <PedalFrame
      model={model}
      layout="default"
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
export const ZvexLoFiJunkyControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 w-full justify-items-center">
      {Object.entries(model.parameters).map(([name, def]) => {
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
  )
}

export default ZvexLoFiJunkyPedal

