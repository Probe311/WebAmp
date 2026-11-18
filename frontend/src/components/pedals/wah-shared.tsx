import { useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { Potentiometer } from '../Potentiometer'
import { WahExpressionLayout } from './WahExpressionLayout'
import type { PedalComponentProps } from './types'

function sweepKeyFor(model: { parameters: Record<string, unknown> }) {
  if ('sweep' in model.parameters) return 'sweep'
  return null
}

/**
 * Factory wah : treadle 2/3 + colonne potards 1/3, boîtier L.
 * `sweep` est piloté par le treadle, pas dupliqué en potard.
 */
export function createWahPedal(pedalId: string) {
  function WahPedal({
    values = {},
    onChange,
    bypassed = false,
    onBypassToggle,
    bottomActions,
    accentColor,
  }: PedalComponentProps) {
    const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
    if (!model) return null

    const accent = accentColor || model.accentColor
    const skip = sweepKeyFor(model)

    const knobs = useMemo(
      () =>
        Object.entries(model.parameters)
          .filter(([name, d]) => name !== skip && (!d.controlType || d.controlType === 'knob'))
          .map(([name, def]) => (
            <Potentiometer
              key={name}
              label={def.label}
              value={values[name] ?? def.default}
              min={def.min}
              max={def.max}
              color={accent}
              size="S"
              onChange={(v) => onChange?.(name, v)}
            />
          )),
      [model, values, onChange, accent, skip]
    )

    return (
      <PedalFrame
        model={model}
        size="M"
        layout="flex"
        bypassed={bypassed}
        onBypassToggle={onBypassToggle}
        showFootswitch={false}
        bottomActions={bottomActions}
        className="is-wah-pedal shell-1-5x"
      >
        <WahExpressionLayout
          model={model}
          values={values}
          onChange={onChange}
          accentColor={accent}
        >
          {knobs}
        </WahExpressionLayout>
      </PedalFrame>
    )
  }

  WahPedal.displayName = `WahPedal(${pedalId})`

  function WahControls({ values = {}, onChange, accentColor }: PedalComponentProps) {
    const model = pedalLibrary.find((p) => p.id === pedalId)
    if (!model) return null
    const accent = accentColor || model.accentColor
    const skip = sweepKeyFor(model)
    return (
      <>
        {Object.entries(model.parameters)
          .filter(([name, d]) => name !== skip && (!d.controlType || d.controlType === 'knob'))
          .map(([name, def]) => (
            <Potentiometer
              key={name}
              label={def.label}
              value={values[name] ?? def.default}
              min={def.min}
              max={def.max}
              color={accent}
              size="S"
              onChange={(v) => onChange?.(name, v)}
            />
          ))}
      </>
    )
  }

  return { WahPedal, WahControls }
}
