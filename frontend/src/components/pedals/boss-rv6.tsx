import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-rv6'

/**
 * Composant complet de la pédale BOSS RV-6
 * Layout spécial : switch-selector en haut (pleine largeur), 3 knobs en ligne horizontale en dessous
 */
export function BossRv6Pedal({ 
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

  const decay = values.decay ?? model.parameters.decay.default
  const tone = values.tone ?? model.parameters.tone.default
  const level = values.level ?? model.parameters.level.default
  const mode = values.mode ?? model.parameters.mode.default

  const controls = useMemo(() => (
    <div className="flex flex-col gap-3 w-full">
      {/* Switch-selector en haut, pleine largeur */}
      <div className="w-full">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={model.parameters.mode.labels || []}
          icons={model.parameters.mode.icons}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>

      {/* 3 knobs en ligne horizontale */}
      <div className="flex flex-row justify-center items-center gap-3 w-full">
        <Potentiometer
          label="DECAY"
          value={decay}
          min={model.parameters.decay.min}
          max={model.parameters.decay.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('decay', v)}
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
      </div>
    </div>
  ), [decay, tone, level, mode, model, onChange, pedalAccentColor])

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
export const BossRv6Controls = ({
  values = {},
  onChange,
  accentColor
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const decay = values.decay ?? model.parameters.decay.default
  const tone = values.tone ?? model.parameters.tone.default
  const level = values.level ?? model.parameters.level.default
  const mode = values.mode ?? model.parameters.mode.default

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="w-full">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={model.parameters.mode.labels || []}
          icons={model.parameters.mode.icons}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
      <div className="flex flex-row justify-center items-center gap-3 w-full">
        <Potentiometer
          label="DECAY"
          value={decay}
          min={model.parameters.decay.min}
          max={model.parameters.decay.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('decay', v)}
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
      </div>
    </div>
  )
}

export default BossRv6Pedal

