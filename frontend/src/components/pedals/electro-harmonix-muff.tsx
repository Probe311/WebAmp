import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'electro-harmonix-muff'

/**
 * Composant complet de la pédale Electro-Harmonix Muff
 * Layout simple : 4 knobs
 */
export function ElectroHarmonixMuffPedal({ 
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

  const sustain = values.sustain ?? model.parameters.sustain.default
  const tone = values.tone ?? model.parameters.tone.default
  const volume = values.volume ?? model.parameters.volume.default

  const controls = useMemo(() => (
    <>
      <Potentiometer
        label="SUSTAIN"
        value={sustain}
        min={model.parameters.sustain.min}
        max={model.parameters.sustain.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('sustain', v)}
      />
      <Potentiometer
        label="TONE"
        value={tone}
        min={model.parameters.tone.min}
        max={model.parameters.tone.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('tone', v)}
      />
      <Potentiometer
        label="VOLUME"
        value={volume}
        min={model.parameters.volume.min}
        max={model.parameters.volume.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('volume', v)}
      />
    </>
  ), [sustain, tone, volume, model, onChange, pedalAccentColor])

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
export const ElectroHarmonixMuffControls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const sustain = values.sustain ?? model.parameters.sustain.default
  const tone = values.tone ?? model.parameters.tone.default
  const volume = values.volume ?? model.parameters.volume.default

  return (
    <>
      <Potentiometer
        label="SUSTAIN"
        value={sustain}
        min={model.parameters.sustain.min}
        max={model.parameters.sustain.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('sustain', v)}
      />
      <Potentiometer
        label="TONE"
        value={tone}
        min={model.parameters.tone.min}
        max={model.parameters.tone.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('tone', v)}
      />
      <Potentiometer
        label="VOLUME"
        value={volume}
        min={model.parameters.volume.min}
        max={model.parameters.volume.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('volume', v)}
      />
    </>
  )
}

export default ElectroHarmonixMuffPedal

