import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'mooer-e-lady'

/**
 * Composant complet de la pédale Mooer E-Lady
 * Layout simple : 3 knobs
 */
export function MooerELadyPedal({ 
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
      const controlType = def.controlType || 'knob'
      const value = values[name] ?? def.default ?? 0

      if (controlType === 'slider') {
        return (
          <Slider
            key={name}
            label={def.label}
            value={value}
            min={def.min}
            max={def.max}
            orientation={def.orientation || 'vertical'}
            onChange={(v) => onChange?.(name, v)}
            color={pedalAccentColor}
          />
        )
      }

      if (controlType === 'switch-selector' && def.labels) {
        return (
          <SwitchSelector
            key={name}
            value={value}
            min={def.min}
            max={def.max}
            labels={def.labels}
            icons={def.icons}
            color={pedalAccentColor}
            onChange={(v) => onChange?.(name, v)}
          />
        )
      }

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
export const MooerELadyControls = ({
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
        const controlType = def.controlType || 'knob'
        const value = values[name] ?? def.default ?? 0

        if (controlType === 'slider') {
          return (
            <Slider
              key={name}
              label={def.label}
              value={value}
              min={def.min}
              max={def.max}
              orientation={def.orientation || 'vertical'}
              onChange={(v) => onChange?.(name, v)}
              color={pedalAccentColor}
            />
          )
        }

        if (controlType === 'switch-selector' && def.labels) {
          return (
            <SwitchSelector
              key={name}
              value={value}
              min={def.min}
              max={def.max}
              labels={def.labels}
              icons={def.icons}
              color={pedalAccentColor}
              onChange={(v) => onChange?.(name, v)}
            />
          )
        }

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

export default MooerELadyPedal

