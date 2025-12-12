import { useMemo } from 'react'
import { CircleDot, Square, Circle } from 'lucide-react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Slider } from '../Slider'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'walrus-audio-chorus'
const ACCENT_COLOR = '#9A81BB'

/**
 * Composant complet de la pédale Walrus Audio Chorus
 * Layout spécial : 3 sliders horizontaux + switch-selector en bas
 */
export function WalrusAudioChorusPedal({ 
  values = {},
  onChange,
  bypassed = false,
  onBypassToggle,
  bottomActions
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  const rate = values.rate ?? model.parameters.rate.default
  const depth = values.depth ?? model.parameters.depth.default
  const mix = values.mix ?? model.parameters.mix.default
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
          color={ACCENT_COLOR}
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
          color={ACCENT_COLOR}
        />
      </div>

      {/* Mix Slider */}
      <div className="w-full">
        <Slider
          label="MIX"
          value={mix}
          min={model.parameters.mix.min}
          max={model.parameters.mix.max}
          orientation="horizontal"
          onChange={(v) => onChange?.('mix', v)}
          color={ACCENT_COLOR}
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
          color={ACCENT_COLOR}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  ), [rate, depth, mix, mode, model, onChange])

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
export const WalrusAudioChorusControls = ({
  values = {}, 
  onChange, 
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  const rate = values.rate ?? model.parameters.rate.default
  const depth = values.depth ?? model.parameters.depth.default
  const mix = values.mix ?? model.parameters.mix.default
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
          color={ACCENT_COLOR}
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
          color={ACCENT_COLOR}
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
          color={ACCENT_COLOR}
        />
      </div>
      <div className="w-full mt-2">
        <SwitchSelector
          value={mode}
          min={model.parameters.mode.min}
          max={model.parameters.mode.max}
          labels={['LIGHT', 'MEDIUM', 'HEAVY']}
          icons={[CircleDot, Square, Circle]}
          color={ACCENT_COLOR}
          onChange={(v) => onChange?.('mode', v)}
          className="switch-selector-full-width"
        />
      </div>
    </div>
  )
}

export default WalrusAudioChorusPedal
