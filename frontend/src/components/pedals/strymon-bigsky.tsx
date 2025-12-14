import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'strymon-bigsky'

/**
 * Composant complet de la pédale Strymon BigSky
 * Layout simple : 5 knobs en ligne avec marges ajustées
 */
export function StrymonBigskyPedal({ 
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

  const layoutControls = useMemo(() => (
    <div className="flex flex-row justify-center items-center gap-2 w-full" style={{ marginTop: '-0.5rem', marginBottom: '-0.5rem' }}>
      {controls}
    </div>
  ), [controls])

  return (
    <PedalFrame
      model={model}
      layout="default"
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      showFootswitch={false}
      bottomActions={bottomActions}
    >
      {layoutControls}
    </PedalFrame>
  )
}

// Export pour compatibilité avec l'ancien système
export const StrymonBigskyControls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const controls = Object.entries(model.parameters).map(([name, def]) => {
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

  return (
    <div className="flex flex-row justify-center items-center gap-2 w-full" style={{ marginTop: '-0.5rem', marginBottom: '-0.5rem' }}>
      {controls}
    </div>
  )
}

export default StrymonBigskyPedal

