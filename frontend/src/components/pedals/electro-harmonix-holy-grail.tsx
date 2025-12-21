import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'electro-harmonix-holy-grail'

/**
 * Composant complet de la pédale Electro-Harmonix Holy Grail
 * Layout simple : 2 knobs
 */
export function ElectroHarmonixHolyGrailPedal({ 
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

  const reverb = values.reverb ?? model.parameters.reverb.default

  const controls = useMemo(() => (
    <>
      <Potentiometer
        label="REVERB"
        value={reverb}
        min={model.parameters.reverb.min}
        max={model.parameters.reverb.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('reverb', v)}
      />
    </>
  ), [reverb, model, onChange, pedalAccentColor])

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
export const ElectroHarmonixHolyGrailControls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const reverb = values.reverb ?? model.parameters.reverb.default

  return (
    <>
      <Potentiometer
        label="REVERB"
        value={reverb}
        min={model.parameters.reverb.min}
        max={model.parameters.reverb.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('reverb', v)}
      />
    </>
  )
}

export default ElectroHarmonixHolyGrailPedal

