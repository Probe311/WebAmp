import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-od1'

/**
 * Composant complet de la pédale BOSS OD-1
 * Layout simple : 3 knobs en ligne
 */
export function BossOd1Pedal({ 
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

  const level = values.level ?? model.parameters.level.default
  const overdrive = values.overdrive ?? model.parameters.overdrive.default

  const controls = useMemo(() => (
    <>
      <Potentiometer
        label="LEVEL"
        value={level}
        min={model.parameters.level.min}
        max={model.parameters.level.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('level', v)}
      />
      <Potentiometer
        label="OVERDRIVE"
        value={overdrive}
        min={model.parameters.overdrive.min}
        max={model.parameters.overdrive.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('overdrive', v)}
      />
    </>
  ), [level, overdrive, model, onChange, pedalAccentColor])

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
export const BossOd1Controls = ({
  values = {},
  onChange,
  accentColor
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const level = values.level ?? model.parameters.level.default
  const overdrive = values.overdrive ?? model.parameters.overdrive.default

  return (
    <>
      <Potentiometer
        label="LEVEL"
        value={level}
        min={model.parameters.level.min}
        max={model.parameters.level.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('level', v)}
      />
      <Potentiometer
        label="OVERDRIVE"
        value={overdrive}
        min={model.parameters.overdrive.min}
        max={model.parameters.overdrive.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('overdrive', v)}
      />
    </>
  )
}

export default BossOd1Pedal

