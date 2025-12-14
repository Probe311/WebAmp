import { useMemo } from 'react'
import { CircleDot, Square, Circle } from 'lucide-react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'walrus-audio-phaser'

/**
 * Composant complet de la pédale Walrus Audio Phaser
 * Layout spécial : 3 sliders horizontaux + switch-selector en bas
 */
export function WalrusAudioPhaserPedal({ 
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
  const feedback = values.feedback ?? model.parameters.feedback.default
  const depth = values.depth ?? model.parameters.depth.default
  const mode = values.mode ?? model.parameters.mode.default

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

      {/* Feedback Slider */}
      <div className="w-full">
        <Slider
          label="FEEDBACK"
          value={feedback}
          min={model.parameters.feedback.min}
          max={model.parameters.feedback.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('feedback', v)}
          color={pedalAccentColor}
        />
      </div>

      {/* Mode Switch Selector */}
      <div className="w-full mt-2">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={['LIGHT', 'MEDIUM', 'HEAVY']}
          icons={[CircleDot, Square, Circle]}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  ), [rate, feedback, depth, mode, model, onChange, pedalAccentColor])

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
export const WalrusAudioPhaserControls = ({
  values = {},
  onChange,
  accentColor
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor

  const rate = values.rate ?? model.parameters.rate.default
  const feedback = values.feedback ?? model.parameters.feedback.default
  const depth = values.depth ?? model.parameters.depth.default
  const mode = values.mode ?? model.parameters.mode.default

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
          label="FEEDBACK"
          value={feedback}
          min={model.parameters.feedback.min}
          max={model.parameters.feedback.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('feedback', v)}
          color={pedalAccentColor}
        />
      </div>
      <div className="w-full mt-2">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={['LIGHT', 'MEDIUM', 'HEAVY']}
          icons={[CircleDot, Square, Circle]}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  )
}

export default WalrusAudioPhaserPedal
