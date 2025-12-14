import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'tc-gmajor2'

/**
 * Composant complet de la pédale TC Electronic G-Major 2
 * Layout spécial : switch-selectors et slider sur la première ligne, 2 knobs sur la deuxième ligne
 */
export function TcGmajor2Pedal({ 
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

  const { switchSelectors, sliders, knobs } = useMemo(() => {
    const entries = Object.entries(model.parameters)
    const switchSelectors = entries.filter(([, def]) => def.controlType === 'switch-selector')
    const sliders = entries.filter(([, def]) => def.controlType === 'slider')
    const knobs = entries.filter(([, def]) => def.controlType !== 'switch-selector' && def.controlType !== 'slider')
    return { switchSelectors, sliders, knobs }
  }, [model])

  const controls = useMemo(() => (
    <div className="flex flex-col gap-2 w-full items-center">
      {/* Ligne 1 : Switch-selectors et slider */}
      <div className="flex flex-row justify-center items-center gap-2 w-full flex-wrap">
        {switchSelectors.map(([name, def]) => {
          const value = values[name] ?? def.default ?? 0
          return (
            <SwitchSelector
              key={name}
              value={value}
              min={def.min}
              max={def.max}
              labels={def.labels || []}
              icons={def.icons}
              color={pedalAccentColor}
              onChange={(v) => onChange?.(name, v)}
            />
          )
        })}
        {sliders.map(([name, def]) => {
          const value = values[name] ?? def.default ?? 0
          const orientation = def.orientation || 'vertical'
          return (
            <Slider
              key={name}
              label={def.label}
              value={value}
              min={def.min}
              max={def.max}
              orientation={orientation}
              onChange={(v) => onChange?.(name, v)}
              color={pedalAccentColor}
            />
          )
        })}
      </div>

      {/* Ligne 2 : 2 knobs */}
      <div className="flex flex-row justify-center items-center gap-3 w-full">
        {knobs.map(([name, def]) => {
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
      </div>
    </div>
  ), [switchSelectors, sliders, knobs, values, onChange, model])

  return (
    <PedalFrame
      model={model}
      layout="gmajor2"
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
export const TcGmajor2Controls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const entries = Object.entries(model.parameters)
  const switchSelectors = entries.filter(([, def]) => def.controlType === 'switch-selector')
  const sliders = entries.filter(([, def]) => def.controlType === 'slider')
  const knobs = entries.filter(([, def]) => def.controlType !== 'switch-selector' && def.controlType !== 'slider')

  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <div className="flex flex-row justify-center items-center gap-2 w-full flex-wrap">
        {switchSelectors.map(([name, def]) => {
          const value = values[name] ?? def.default ?? 0
          return (
            <SwitchSelector
              key={name}
              value={value}
              min={def.min}
              max={def.max}
              labels={def.labels || []}
              icons={def.icons}
              color={pedalAccentColor}
              onChange={(v) => onChange?.(name, v)}
            />
          )
        })}
        {sliders.map(([name, def]) => {
          const value = values[name] ?? def.default ?? 0
          const orientation = def.orientation || 'vertical'
          return (
            <Slider
              key={name}
              label={def.label}
              value={value}
              min={def.min}
              max={def.max}
              orientation={orientation}
              onChange={(v) => onChange?.(name, v)}
              color={pedalAccentColor}
            />
          )
        })}
      </div>
      <div className="flex flex-row justify-center items-center gap-3 w-full">
        {knobs.map(([name, def]) => {
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
      </div>
    </div>
  )
}

export default TcGmajor2Pedal

