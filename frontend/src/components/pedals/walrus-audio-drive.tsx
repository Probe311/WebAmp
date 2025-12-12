import { useMemo } from 'react'
import { CircleDot, Square, Sun } from 'lucide-react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'walrus-audio-drive'
const ACCENT_COLOR = '#E55045'

/**
 * Composant complet de la pédale Walrus Audio Drive
 * Layout spécial : 3 sliders horizontaux + switch-selector en bas
 */
export function WalrusAudioDrivePedal({ 
  values = {}, 
  onChange, 
  bypassed = false,
  onBypassToggle,
  bottomActions
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  const gain = values.gain ?? model.parameters.gain.default
  const tone = values.tone ?? model.parameters.tone.default
  const volume = values.volume ?? model.parameters.volume.default
  const mode = values.mode ?? model.parameters.mode.default

  const controls = useMemo(() => (
    <div className="flex flex-col gap-4 w-full">
      {/* Gain Slider */}
      <div className="w-full">
        <Slider
          label="GAIN"
          value={gain}
          min={model.parameters.gain.min}
          max={model.parameters.gain.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('gain', v)}
          color={ACCENT_COLOR}
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
          color={ACCENT_COLOR}
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
          color={ACCENT_COLOR}
        />
      </div>

      {/* Mode Switch Selector */}
      <div className="w-full mt-2">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={['SMOOTH', 'CRUNCH', 'BRIGHT']}
          icons={[CircleDot, Square, Sun]}
          color={ACCENT_COLOR}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  ), [gain, tone, volume, mode, model, onChange])

  // Créer un modèle modifié avec la couleur d'accent correcte
  const modelWithAccent = useMemo(() => ({
    ...model,
    accentColor: ACCENT_COLOR
  }), [model])

  return (
    <PedalFrame
      model={modelWithAccent}
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
export const WalrusAudioDriveControls = ({
  values = {},
  onChange,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  const gain = values.gain ?? model.parameters.gain.default
  const tone = values.tone ?? model.parameters.tone.default
  const volume = values.volume ?? model.parameters.volume.default
  const mode = values.mode ?? model.parameters.mode.default

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="w-full">
        <Slider
          label="GAIN"
          value={gain}
          min={model.parameters.gain.min}
          max={model.parameters.gain.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('gain', v)}
          color={ACCENT_COLOR}
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
          color={ACCENT_COLOR}
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
          color={ACCENT_COLOR}
        />
      </div>
      <div className="w-full mt-2">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={['SMOOTH', 'CRUNCH', 'BRIGHT']}
          icons={[CircleDot, Square, Sun]}
          color={ACCENT_COLOR}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  )
}

export default WalrusAudioDrivePedal
