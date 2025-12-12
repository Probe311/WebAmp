import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-dd3'

/**
 * Composant complet de la pédale BOSS DD-3
 * Layout : ligne 1 switch-selector, ligne 2: 2 knobs, ligne 3: 1 knob taille S
 */
export function BossDd3Pedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  const time = values.time ?? model.parameters.time.default
  const feedback = values.feedback ?? model.parameters.feedback.default
  const level = values.level ?? model.parameters.level.default
  const memory = values.memory ?? model.parameters.memory.default

  const controls = useMemo(() => (
    <div className="flex flex-col gap-2 w-full py-1">
      {/* Ligne 1 : Switch-selector */}
      <div className="w-full -mb-1">
        <SwitchSelector
          value={memory}
          min={model.parameters.memory.min}
          max={model.parameters.memory.max}
          labels={model.parameters.memory.labels || []}
          icons={model.parameters.memory.icons}
          color={model.accentColor}
          onChange={(v) => onChange?.('memory', v)}
          className="switch-selector-full-width"
        />
      </div>
      
      {/* Ligne 2 : 2 knobs */}
      <div className="grid grid-cols-2 gap-2 w-full justify-items-center">
        <Potentiometer
          label={model.parameters.time.label}
          value={time}
          min={model.parameters.time.min}
          max={model.parameters.time.max}
          color={model.accentColor}
          onChange={(v) => onChange?.('time', v)}
          size="small"
        />
        <Potentiometer
          label={model.parameters.feedback.label}
          value={feedback}
          min={model.parameters.feedback.min}
          max={model.parameters.feedback.max}
          color={model.accentColor}
          onChange={(v) => onChange?.('feedback', v)}
          size="small"
        />
      </div>
      
      {/* Ligne 3 : 1 knob centré taille S */}
      <div className="w-full flex justify-center -mt-1">
        <Potentiometer
          label={model.parameters.level.label}
          value={level}
          min={model.parameters.level.min}
          max={model.parameters.level.max}
          color={model.accentColor}
          onChange={(v) => onChange?.('level', v)}
          size="small"
        />
      </div>
    </div>
  ), [time, feedback, level, memory, model, onChange])

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
export const BossDd3Controls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
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
              color={model.accentColor}
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
              color={model.accentColor}
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
            color={model.accentColor}
            onChange={(v) => onChange?.(name, v)}
          />
        )
      })}
    </>
  )
}

export default BossDd3Pedal

