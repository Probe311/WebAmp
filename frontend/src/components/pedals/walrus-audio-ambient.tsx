import { useMemo } from 'react'
import { Layers, Flower2, Cloud } from 'lucide-react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { SwitchSelector } from '../SwitchSelector'
import { Slider } from '../Slider'
import type { PedalComponentProps } from './types'

const pedalId = 'walrus-audio-ambient'

/**
 * Composant complet de la pédale Walrus Audio Ambient
 * Layout : 3 knobs sur 2 lignes (ligne 1: 2 knobs, ligne 2: 1 knob centré)
 */
export function WalrusAudioAmbientPedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  const decay = values.decay ?? model.parameters.decay.default
  const tone = values.tone ?? model.parameters.tone.default
  const mix = values.mix ?? model.parameters.mix.default
  const mode = values.mode ?? model.parameters.mode.default

  const controls = useMemo(() => (
    <div className="flex flex-col gap-3 w-full">
      {/* Ligne 1 : 2 knobs */}
      <div className="grid grid-cols-2 gap-3 w-full justify-items-center">
        <Potentiometer
          label={model.parameters.decay.label}
          value={decay}
          min={model.parameters.decay.min}
          max={model.parameters.decay.max}
          color={model.accentColor}
          onChange={(v: number) => onChange?.('decay', v)}
        />
        <Potentiometer
          label={model.parameters.tone.label}
          value={tone}
          min={model.parameters.tone.min}
          max={model.parameters.tone.max}
          color={model.accentColor}
          onChange={(v) => onChange?.('tone', v)}
        />
      </div>

      {/* Ligne 2 : 1 knob centré */}
      <div className="w-full flex justify-center">
        <Potentiometer
          label={model.parameters.mix.label}
          value={mix}
          min={model.parameters.mix.min}
          max={model.parameters.mix.max}
          color={model.accentColor}
          onChange={(v) => onChange?.('mix', v)}
        />
      </div>

      {/* Mode Switch Selector */}
      <div className="w-full mt-2">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={['DEEP', 'LUSH', 'HAZE']}
          icons={[Layers, Flower2, Cloud]}
          color={model.accentColor}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  ), [decay, tone, mix, mode, model, onChange])

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
export const WalrusAudioAmbientControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  const decay = values.decay ?? model.parameters.decay.default
  const tone = values.tone ?? model.parameters.tone.default
  const mix = values.mix ?? model.parameters.mix.default
  const mode = values.mode ?? model.parameters.mode.default

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <Slider
          label="DECAY"
          value={decay}
          min={model.parameters.decay.min}
          max={model.parameters.decay.max}
          orientation="horizontal"
          onChange={(v: number) => onChange?.('decay', v)}
          color={model.accentColor}
        />
      </div>
      <div className="w-full">
        <Slider
          label="TONE"
          value={tone}
          min={model.parameters.tone.min}
          max={model.parameters.tone.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('tone', v)}
          color={model.accentColor}
        />
      </div>
      <div className="w-full">
        <Slider
          label="MIX"
          value={mix}
          min={model.parameters.mix.min}
          max={model.parameters.mix.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('mix', v)}
          color={model.accentColor}
        />
      </div>
      <div className="w-full mt-2">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={['DEEP', 'LUSH', 'HAZE']}
          icons={[Layers, Flower2, Cloud]}
          color={model.accentColor}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  )
}

export default WalrusAudioAmbientPedal

