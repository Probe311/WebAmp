import { useMemo } from 'react'
import { Moon, Zap, Sun } from 'lucide-react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'walrus-audio-distortion'

/**
 * Composant complet de la pédale Walrus Audio Distortion
 * Layout spécial : 3 sliders horizontaux + switch-selector en bas
 */
export function WalrusAudioDistortionPedal({ 
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

  const gain = values.gain ?? model.parameters.gain.default
  const tone = values.tone ?? model.parameters.tone.default
  const volume = values.volume ?? model.parameters.volume.default
  const mode = values.mode ?? model.parameters.mode.default

  const controls = useMemo(() => (
    <div className="flex flex-col gap-6 w-full mt-2">
      {/* Gain Slider */}
      <div className="w-full">
        <Slider
          label="GAIN"
          value={gain}
          min={model.parameters.gain.min}
          max={model.parameters.gain.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('gain', v)}
          color={pedalAccentColor}
          labelPosition="top"
        />
      </div>

      {/* Tone Slider */}
      <div className="w-full">
        <Slider
          label="TONE"
          value={tone}
          min={model.parameters.tone.min}
          max={model.parameters.tone.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('tone', v)}
          color={pedalAccentColor}
          labelPosition="top"
        />
      </div>

      {/* Volume Slider */}
      <div className="w-full">
        <Slider
          label="VOL"
          value={volume}
          min={model.parameters.volume.min}
          max={model.parameters.volume.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('volume', v)}
          color={pedalAccentColor}
          labelPosition="top"
        />
      </div>

      {/* Mode Switch Selector */}
      <div className="w-full mt-2">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={['DARK', 'SI', 'LED']}
          icons={[Moon, Zap, Sun]}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  ), [gain, tone, volume, mode, model, onChange])

  return (
    <PedalFrame
      model={model}
      layout="flex"
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      showFootswitch={false}
      bottomActions={bottomActions}
      className="has-horizontal-sliders"
    >
      {controls}
    </PedalFrame>
  )
}

// Export pour compatibilité avec l'ancien système
export const WalrusAudioDistortionControls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor

  const gain = values.gain ?? model.parameters.gain.default
  const tone = values.tone ?? model.parameters.tone.default
  const volume = values.volume ?? model.parameters.volume.default
  const mode = values.mode ?? model.parameters.mode.default

  return (
    <div className="flex flex-col gap-6 w-full mt-2">
      <div className="w-full">
        <Slider
          label="GAIN"
          value={gain}
          min={model.parameters.gain.min}
          max={model.parameters.gain.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('gain', v)}
          color={pedalAccentColor}
          labelPosition="top"
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
          color={pedalAccentColor}
          labelPosition="top"
        />
      </div>
      <div className="w-full">
        <Slider
          label="VOL"
          value={volume}
          min={model.parameters.volume.min}
          max={model.parameters.volume.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('volume', v)}
          color={pedalAccentColor}
          labelPosition="top"
        />
      </div>
      <div className="w-full mt-2">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={['DARK', 'SI', 'LED']}
          icons={[Moon, Zap, Sun]}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  )
}

export default WalrusAudioDistortionPedal
