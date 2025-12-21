import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-ch1'

/**
 * Composant complet de la pédale BOSS CH-1
 * Layout : 4 knobs en grille 2x2
 */
export function BossCh1Pedal({ 
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
  const equalizer = values.equalizer ?? model.parameters.equalizer.default
  const level = values.level ?? model.parameters.level.default

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
        label="EQUALIZER"
        value={equalizer}
        min={model.parameters.equalizer.min}
        max={model.parameters.equalizer.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('equalizer', v)}
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
  ), [rate, depth, equalizer, level, model, onChange, pedalAccentColor])

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
export const BossCh1Controls = ({
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
  const equalizer = values.equalizer ?? model.parameters.equalizer.default
  const level = values.level ?? model.parameters.level.default

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
        label="EQUALIZER"
        value={equalizer}
        min={model.parameters.equalizer.min}
        max={model.parameters.equalizer.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('equalizer', v)}
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

export default BossCh1Pedal

