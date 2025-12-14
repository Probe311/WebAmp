import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'roland-space-echo'

/**
 * Composant complet de la pédale Roland Space Echo
 * Layout : ligne 1 switch-selector, ligne 2: 2 knobs, ligne 3: 1 knob taille S
 */
export function RolandSpaceEchoPedal({ 
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

  const repeat = values.repeat ?? model.parameters.repeat.default
  const intensity = values.intensity ?? model.parameters.intensity.default
  const echoVolume = values.echoVolume ?? model.parameters.echoVolume.default
  const heads = values.heads ?? model.parameters.heads.default

  const controls = useMemo(() => (
    <div className="flex flex-col gap-2 w-full py-1">
      {/* Ligne 1 : Switch-selector */}
      <div className="w-full -mb-1">
        <SwitchSelector
          value={heads}
          min={model.parameters.heads.min}
          max={model.parameters.heads.max}
          labels={model.parameters.heads.labels || []}
          icons={model.parameters.heads.icons}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('heads', v)}
          className="switch-selector-full-width"
        />
      </div>
      
      {/* Ligne 2 : 2 knobs */}
      <div className="grid grid-cols-2 gap-2 w-full justify-items-center">
        <Potentiometer
          label={model.parameters.repeat.label}
          value={repeat}
          min={model.parameters.repeat.min}
          max={model.parameters.repeat.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('repeat', v)}
          size="small"
        />
        <Potentiometer
          label={model.parameters.intensity.label}
          value={intensity}
          min={model.parameters.intensity.min}
          max={model.parameters.intensity.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('intensity', v)}
          size="small"
        />
      </div>
      
      {/* Ligne 3 : 1 knob centré taille S */}
      <div className="w-full flex justify-center -mt-1">
        <Potentiometer
          label={model.parameters.echoVolume.label}
          value={echoVolume}
          min={model.parameters.echoVolume.min}
          max={model.parameters.echoVolume.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('echoVolume', v)}
          size="small"
        />
      </div>
    </div>
  ), [repeat, intensity, echoVolume, heads, model, onChange])

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
export const RolandSpaceEchoControls = ({
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

export default RolandSpaceEchoPedal

