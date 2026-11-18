import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import type { PedalComponentProps } from './types'

const pedalId = 'strymon-bigsky'

/**
 * Strymon BigSky — 3 knobs en 2+1 (Decay / Tone / Mix)
 */
export function StrymonBigskyPedal({
  values = {},
  onChange,
  bypassed = false,
  onBypassToggle,
  bottomActions,
  accentColor,
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])

  if (!model) return null

  const pedalAccentColor = accentColor || model.accentColor

  const decay = values.decay ?? model.parameters.decay.default
  const tone = values.tone ?? model.parameters.tone.default
  const mix = values.mix ?? model.parameters.mix.default

  const controls = useMemo(
    () => [
      <Potentiometer
        key="decay"
        label="DECAY"
        value={decay}
        min={model.parameters.decay.min}
        max={model.parameters.decay.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('decay', v)}
      />,
      <Potentiometer
        key="tone"
        label="TONE"
        value={tone}
        min={model.parameters.tone.min}
        max={model.parameters.tone.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('tone', v)}
      />,
      <Potentiometer
        key="mix"
        label="MIX"
        value={mix}
        min={model.parameters.mix.min}
        max={model.parameters.mix.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('mix', v)}
      />,
    ],
    [decay, tone, mix, model, onChange, pedalAccentColor],
  )

  return (
    <PedalFrame
      model={model}
      layout="three-knobs"
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      showFootswitch={false}
      bottomActions={bottomActions}
    >
      {controls}
    </PedalFrame>
  )
}

export const StrymonBigskyControls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  const pedalAccentColor = accentColor || model.accentColor
  const decay = values.decay ?? model.parameters.decay.default
  const tone = values.tone ?? model.parameters.tone.default
  const mix = values.mix ?? model.parameters.mix.default

  return (
    <>
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
        label="MIX"
        value={mix}
        min={model.parameters.mix.min}
        max={model.parameters.mix.max}
        color={pedalAccentColor}
        onChange={(v) => onChange?.('mix', v)}
      />
    </>
  )
}

export default StrymonBigskyPedal
