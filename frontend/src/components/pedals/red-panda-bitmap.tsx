import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import type { PedalComponentProps } from './types'

const pedalId = 'red-panda-bitmap'

/**
 * Composant complet de la pédale Red Panda Bitmap
 * Layout : 3 knobs (ligne 1: 2 knobs, ligne 2: 1 knob centré)
 */
export function RedPandaBitmapPedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions
,
  accentColor}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor

  const controls = useMemo(() => {
    return Object.entries(model.parameters).map(([name, def]) => {
      const value = values[name] ?? def.default ?? 0
      return (
        <Potentiometer
          key={name}
          label={def.label}
          value={value}
          min={def.min}
          max={def.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.(name, v)}
        />
      )
    })
  }, [model, values, onChange])

  return (
    <PedalFrame
      model={model}
      layout="three-knobs"
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
export const RedPandaBitmapControls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  return (
    <>
      {Object.entries(model.parameters).map(([name, def]) => {
        const value = values[name] ?? def.default ?? 0
        return (
          <Potentiometer
            key={name}
            label={def.label}
            value={value}
            min={def.min}
            max={def.max}
            color={pedalAccentColor}
            onChange={(v) => onChange?.(name, v)}
          />
        )
      })}
    </>
  )
}

export default RedPandaBitmapPedal

