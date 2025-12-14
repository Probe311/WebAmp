import { useMemo } from 'react'
import { Waves, Square, Shuffle } from 'lucide-react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'walrus-audio-tremolo'

/**
 * Composant complet de la pédale Walrus Audio Tremolo
 * Layout spécial : 3 sliders horizontaux + switch-selector en bas
 */
export function WalrusAudioTremoloPedal({ 
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
  const volume = values.volume ?? model.parameters.volume.default
  const wave = values.wave ?? model.parameters.wave.default

  const controls = useMemo(() => (
    <div className="flex flex-col gap-4 w-full">
      {/* Rate Slider */}
      <div className="w-full">
        <Slider
          label="RATE"
          value={rate}
          min={model.parameters.rate.min}
          max={model.parameters.rate.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('rate', v)}
          color={pedalAccentColor}
        />
      </div>

      {/* Depth Slider */}
      <div className="w-full">
        <Slider
          label="DEPTH"
          value={depth}
          min={model.parameters.depth.min}
          max={model.parameters.depth.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('depth', v)}
          color={pedalAccentColor}
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
        />
      </div>

      {/* Waveform Switch Selector */}
      <div className="w-full mt-2">
        <SwitchSelector
          value={wave}
          min={model.parameters.wave.min}
          max={model.parameters.wave.max}
          labels={['SINE', 'SQUARE', 'RANDOM']}
          icons={[Waves, Square, Shuffle]}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('wave', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  ), [rate, depth, volume, wave, model, onChange])

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
export const WalrusAudioTremoloControls = ({
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
  const volume = values.volume ?? model.parameters.volume.default
  const wave = values.wave ?? model.parameters.wave.default

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <Slider
          label="RATE"
          value={rate}
          min={model.parameters.rate.min}
          max={model.parameters.rate.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('rate', v)}
          color={pedalAccentColor}
        />
      </div>
      <div className="w-full">
        <Slider
          label="DEPTH"
          value={depth}
          min={model.parameters.depth.min}
          max={model.parameters.depth.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('depth', v)}
          color={pedalAccentColor}
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
        />
      </div>
      <div className="w-full mt-2">
        <SwitchSelector
          value={wave}
          min={model.parameters.wave.min}
          max={model.parameters.wave.max}
          labels={['SINE', 'SQUARE', 'RANDOM']}
          icons={[Waves, Square, Shuffle]}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('wave', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  )
}

export default WalrusAudioTremoloPedal
