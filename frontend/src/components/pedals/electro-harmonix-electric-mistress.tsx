import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'electro-harmonix-electric-mistress'

/**
 * Composant complet de la pédale Electro-Harmonix Electric Mistress
 * Layout : 3 knobs (ligne 1: 2 knobs, ligne 2: 1 knob centré)
 */
export function ElectroHarmonixElectricMistressPedal({ 
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

  const rate = values.rate ?? model.parameters.rate.default
  const range = values.range ?? model.parameters.range.default
  const color = values.color ?? model.parameters.color.default

  const controls = useMemo(() => (
    <>
      <Potentiometer
        label="RATE"
        value={rate}
        min={model.parameters.rate.min}
        max={model.parameters.rate.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('rate', v)}
      />
      <Potentiometer
        label="RANGE"
        value={range}
        min={model.parameters.range.min}
        max={model.parameters.range.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('range', v)}
      />
      <Potentiometer
        label="COLOR"
        value={color}
        min={model.parameters.color.min}
        max={model.parameters.color.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('color', v)}
      />
    </>
  ), [rate, range, color, model, onChange, pedalAccentColor])

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
export const ElectroHarmonixElectricMistressControls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const rate = values.rate ?? model.parameters.rate.default
  const range = values.range ?? model.parameters.range.default
  const color = values.color ?? model.parameters.color.default

  return (
    <>
      <Potentiometer
        label="RATE"
        value={rate}
        min={model.parameters.rate.min}
        max={model.parameters.rate.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('rate', v)}
      />
      <Potentiometer
        label="RANGE"
        value={range}
        min={model.parameters.range.min}
        max={model.parameters.range.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('range', v)}
      />
      <Potentiometer
        label="COLOR"
        value={color}
        min={model.parameters.color.min}
        max={model.parameters.color.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('color', v)}
      />
    </>
  )
}

export default ElectroHarmonixElectricMistressPedal

