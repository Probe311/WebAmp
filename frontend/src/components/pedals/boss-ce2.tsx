import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-ce2'

/**
 * Composant complet de la pédale BOSS CE-2
 * Layout simple : 3 knobs en ligne
 */
export function BossCe2Pedal({ 
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
    </>
  ), [rate, depth, model, onChange, pedalAccentColor])

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
export const BossCe2Controls = ({
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
    </>
  )
}

export default BossCe2Pedal

