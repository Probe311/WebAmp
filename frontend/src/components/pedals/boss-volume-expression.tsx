import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-volume-expression'

/**
 * Composant complet de la pédale Boss Volume/Expression
 * Layout simple : 1 knob
 */
export function BossVolumeExpressionPedal({ 
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

  const volume = values.volume ?? model.parameters.volume.default
  const taper = values.taper ?? model.parameters.taper.default

  const controls = useMemo(() => (
    <>
      <Potentiometer
        label="VOLUME"
        value={volume}
        min={model.parameters.volume.min}
        max={model.parameters.volume.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('volume', v)}
      />
      <Potentiometer
        label="TAPER"
        value={taper}
        min={model.parameters.taper.min}
        max={model.parameters.taper.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('taper', v)}
      />
    </>
  ), [volume, taper, model, onChange, pedalAccentColor])

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
export const BossVolumeExpressionControls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const volume = values.volume ?? model.parameters.volume.default
  const taper = values.taper ?? model.parameters.taper.default

  return (
    <>
      <Potentiometer
        label="VOLUME"
        value={volume}
        min={model.parameters.volume.min}
        max={model.parameters.volume.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('volume', v)}
      />
      <Potentiometer
        label="TAPER"
        value={taper}
        min={model.parameters.taper.min}
        max={model.parameters.taper.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('taper', v)}
      />
    </>
  )
}

export default BossVolumeExpressionPedal

