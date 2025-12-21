import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-bf3'

/**
 * Composant complet de la pédale BOSS BF-3
 * Layout simple : 4 knobs
 */
export function BossBf3Pedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions,
  accentColor
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor

  const rate = values.rate ?? model.parameters.rate.default
  const depth = values.depth ?? model.parameters.depth.default
  const manual = values.manual ?? model.parameters.manual.default
  const resonance = values.resonance ?? model.parameters.resonance.default

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
        label="DEPTH"
        value={depth}
        min={model.parameters.depth.min}
        max={model.parameters.depth.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('depth', v)}
      />
      <Potentiometer
        label="MANUAL"
        value={manual}
        min={model.parameters.manual.min}
        max={model.parameters.manual.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('manual', v)}
      />
      <Potentiometer
        label="RESONANCE"
        value={resonance}
        min={model.parameters.resonance.min}
        max={model.parameters.resonance.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('resonance', v)}
      />
    </>
  ), [rate, depth, manual, resonance, model, onChange, pedalAccentColor])

  return (
    <PedalFrame
      model={model}
      layout="four-knobs"
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
export const BossBf3Controls = ({
  values = {},
  onChange,
  accentColor
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const rate = values.rate ?? model.parameters.rate.default
  const depth = values.depth ?? model.parameters.depth.default
  const manual = values.manual ?? model.parameters.manual.default
  const resonance = values.resonance ?? model.parameters.resonance.default

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
        label="DEPTH"
        value={depth}
        min={model.parameters.depth.min}
        max={model.parameters.depth.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('depth', v)}
      />
      <Potentiometer
        label="MANUAL"
        value={manual}
        min={model.parameters.manual.min}
        max={model.parameters.manual.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('manual', v)}
      />
      <Potentiometer
        label="RESONANCE"
        value={resonance}
        min={model.parameters.resonance.min}
        max={model.parameters.resonance.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('resonance', v)}
      />
    </>
  )
}

export default BossBf3Pedal

