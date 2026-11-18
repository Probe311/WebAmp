import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'

const pedalId = 'boss-ce1'

/**
 * BOSS CE-1 — sélecteur puis knobs 2+1 (comme Space Echo)
 */
export function BossCe1Pedal({
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

  const rate = values.rate ?? model.parameters.rate.default
  const depth = values.depth ?? model.parameters.depth.default
  const level = values.level ?? model.parameters.level.default
  const mode = values.mode ?? model.parameters.mode.default

  const controls = useMemo(
    () => (
      <div className="flex w-full flex-col gap-2 py-1">
        <div className="w-full -mb-1">
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
        <div className="grid w-full grid-cols-2 gap-2 justify-items-center">
          <Potentiometer
            label="RATE"
            value={rate}
            min={model.parameters.rate.min}
            max={model.parameters.rate.max}
            color={pedalAccentColor}
            onChange={(v) => onChange?.('rate', v)}
            size="small"
          />
          <Potentiometer
            label="DEPTH"
            value={depth}
            min={model.parameters.depth.min}
            max={model.parameters.depth.max}
            color={pedalAccentColor}
            onChange={(v) => onChange?.('depth', v)}
            size="small"
          />
        </div>
        <div className="-mt-1 flex w-full justify-center">
          <Potentiometer
            label="LEVEL"
            value={level}
            min={model.parameters.level.min}
            max={model.parameters.level.max}
            color={pedalAccentColor}
            onChange={(v) => onChange?.('level', v)}
            size="small"
          />
        </div>
      </div>
    ),
    [rate, depth, level, mode, model, onChange, pedalAccentColor],
  )

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

export const BossCe1Controls = ({
  values = {},
  onChange,
  accentColor,
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  const pedalAccentColor = accentColor || model.accentColor
  const rate = values.rate ?? model.parameters.rate.default
  const depth = values.depth ?? model.parameters.depth.default
  const level = values.level ?? model.parameters.level.default
  const mode = values.mode ?? model.parameters.mode.default

  return (
    <div className="flex w-full flex-col gap-2 py-1">
      <div className="w-full -mb-1">
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
      <div className="grid w-full grid-cols-2 gap-2 justify-items-center">
        <Potentiometer
          label="RATE"
          value={rate}
          min={model.parameters.rate.min}
          max={model.parameters.rate.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('rate', v)}
          size="small"
        />
        <Potentiometer
          label="DEPTH"
          value={depth}
          min={model.parameters.depth.min}
          max={model.parameters.depth.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('depth', v)}
          size="small"
        />
      </div>
      <div className="-mt-1 flex w-full justify-center">
        <Potentiometer
          label="LEVEL"
          value={level}
          min={model.parameters.level.min}
          max={model.parameters.level.max}
          color={pedalAccentColor}
          onChange={(v) => onChange?.('level', v)}
          size="small"
        />
      </div>
    </div>
  )
}

export default BossCe1Pedal
