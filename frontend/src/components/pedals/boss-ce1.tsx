import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-ce1'

/**
 * Composant complet de la pédale BOSS CE-1
 * Layout simple : 3 knobs en ligne
 */
export function BossCe1Pedal({ 
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
  const level = values.level ?? model.parameters.level.default
  const mode = values.mode ?? model.parameters.mode.default

  const controls = useMemo(() => (
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
          label="LEVEL"
          value={level}
          min={model.parameters.level.min}
          max={model.parameters.level.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('level', v)}
        />
      </div>
    </div>
  ), [rate, depth, level, mode, model, onChange, pedalAccentColor])

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
export const BossCe1Controls = ({
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

export default BossCe1Pedal

