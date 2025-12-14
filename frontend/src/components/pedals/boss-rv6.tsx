import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-rv6'

/**
 * Composant complet de la pédale BOSS RV-6
 * Layout spécial : switch-selector en haut (pleine largeur), 3 knobs en ligne horizontale en dessous
 */
export function BossRv6Pedal({ 
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

  const { switchSelectors, knobs } = useMemo(() => {
    const entries = Object.entries(model.parameters)
    const switchSelectors = entries.filter(([, def]) => def.controlType === 'switch-selector')
    const knobs = entries.filter(([, def]) => def.controlType !== 'switch-selector')
    return { switchSelectors, knobs }
  }, [model])

  const controls = useMemo(() => (
    <div className="flex flex-col gap-3 w-full">
      {/* Switch-selector en haut, pleine largeur */}
      {switchSelectors.map(([name, def]) => {
        const value = values[name] ?? def.default ?? 0
        return (
          <div key={name} className="w-full">
            <SwitchSelector
              value={value}
              min={def.min}
              max={def.max}
              labels={def.labels || []}
              icons={def.icons}
              color={pedalAccentColor}
              onChange={(v) => onChange?.(name, v)}
              className="switch-selector-full-width"
            />
          </div>
        )
      })}

      {/* 3 knobs en ligne horizontale */}
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
  ), [switchSelectors, knobs, values, onChange, model])

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
export const BossRv6Controls = ({
  values = {},
  onChange,
  accentColor
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const entries = Object.entries(model.parameters)
  const switchSelectors = entries.filter(([, def]) => def.controlType === 'switch-selector')
  const knobs = entries.filter(([, def]) => def.controlType !== 'switch-selector')

  return (
    <div className="flex flex-col gap-3 w-full">
      {switchSelectors.map(([name, def]) => {
        const value = values[name] ?? def.default ?? 0
        return (
          <div key={name} className="w-full">
            <SwitchSelector
              value={value}
              min={def.min}
              max={def.max}
              labels={def.labels || []}
              icons={def.icons}
              color={pedalAccentColor}
              onChange={(v) => onChange?.(name, v)}
              className="switch-selector-full-width"
            />
          </div>
        )
      })}
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

export default BossRv6Pedal

