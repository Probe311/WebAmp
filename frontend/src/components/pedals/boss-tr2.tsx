import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-tr2'

/**
 * Composant complet de la pédale BOSS TR-2
 * Layout : ligne 1 switch-selector, ligne 2: 2 knobs
 */
export function BossTr2Pedal({ 
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
  const wave = values.wave ?? model.parameters.wave.default

  const controls = useMemo(() => (
    <div className="flex flex-col gap-3 w-full">
      {/* Ligne 1 : Switch-selector */}
      <div className="w-full">
        <SwitchSelector
          value={wave}
          min={model.parameters.wave.min}
          max={model.parameters.wave.max}
          labels={model.parameters.wave.labels || []}
          icons={model.parameters.wave.icons}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('wave', v)}
          className="switch-selector-full-width"
        />
      </div>
      
      {/* Ligne 2 : 2 knobs */}
      <div className="grid grid-cols-2 gap-3 w-full justify-items-center">
        <Potentiometer
          label={model.parameters.rate.label}
          value={rate}
          min={model.parameters.rate.min}
          max={model.parameters.rate.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('rate', v)}
        />
        <Potentiometer
          label={model.parameters.depth.label}
          value={depth}
          min={model.parameters.depth.min}
          max={model.parameters.depth.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('depth', v)}
        />
      </div>
    </div>
  ), [rate, depth, wave, model, onChange])

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
export const BossTr2Controls = ({
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
  const wave = values.wave ?? model.parameters.wave.default

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="w-full">
        <SwitchSelector
          value={wave}
          min={model.parameters.wave.min}
          max={model.parameters.wave.max}
          labels={model.parameters.wave.labels || []}
          icons={model.parameters.wave.icons}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('wave', v)}
          className="switch-selector-full-width"
        />
      </div>
      <div className="grid grid-cols-2 gap-3 w-full justify-items-center">
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
      </div>
    </div>
  )
}

export default BossTr2Pedal

