import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'electro-harmonix-oceans-11'

/**
 * Composant complet de la pédale Electro-Harmonix Oceans 11
 * Layout spécial : switch-selector en haut (pleine largeur), 3 knobs en ligne horizontale en dessous
 */
export function ElectroHarmonixOceans11Pedal({ 
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

  const rate = values.rate ?? model.parameters.rate.default
  const depth = values.depth ?? model.parameters.depth.default
  const mix = values.mix ?? model.parameters.mix.default
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
          label="MIX"
          value={mix}
          min={model.parameters.mix.min}
          max={model.parameters.mix.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('mix', v)}
        />
      </div>
    </div>
  ), [rate, depth, mix, mode, model, onChange, pedalAccentColor])

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
export const ElectroHarmonixOceans11Controls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null
  
  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor
  
  const rate = values.rate ?? model.parameters.rate.default
  const depth = values.depth ?? model.parameters.depth.default
  const mix = values.mix ?? model.parameters.mix.default
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
          label="MIX"
          value={mix}
          min={model.parameters.mix.min}
          max={model.parameters.mix.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('mix', v)}
        />
      </div>
    </div>
  )
}

export default ElectroHarmonixOceans11Pedal

