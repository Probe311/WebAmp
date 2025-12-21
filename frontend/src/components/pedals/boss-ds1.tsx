import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-ds1'

/**
 * Composant complet de la pédale BOSS DS-1
 * Layout : 3 knobs en ligne
 */
export function BossDs1Pedal({ 
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

  const distortion = values.distortion ?? model.parameters.distortion.default
  const tone = values.tone ?? model.parameters.tone.default
  const level = values.level ?? model.parameters.level.default

  const controls = useMemo(() => (
    <>
      <Potentiometer
        label="DISTORTION"
        value={distortion}
        min={model.parameters.distortion.min}
        max={model.parameters.distortion.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('distortion', v)}
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
        label="LEVEL"
        value={level}
        min={model.parameters.level.min}
        max={model.parameters.level.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('level', v)}
      />
    </>
  ), [distortion, tone, level, model, onChange, pedalAccentColor])

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
export const BossDs1Controls = ({
  values = {},
  onChange,
  accentColor
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor

  const distortion = values.distortion ?? model.parameters.distortion.default
  const tone = values.tone ?? model.parameters.tone.default
  const level = values.level ?? model.parameters.level.default

  return (
    <>
      <Potentiometer
        label="DISTORTION"
        value={distortion}
        min={model.parameters.distortion.min}
        max={model.parameters.distortion.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('distortion', v)}
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
        label="LEVEL"
        value={level}
        min={model.parameters.level.min}
        max={model.parameters.level.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('level', v)}
      />
    </>
  )
}

export default BossDs1Pedal

