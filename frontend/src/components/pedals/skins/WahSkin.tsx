import type { PedalModel } from '../../../data/pedals'
import type { PedalComponentProps } from '../types'
import { PedalFrame } from '../PedalFrame'
import { Potentiometer } from '../../Potentiometer'
import { WahExpressionLayout } from '../WahExpressionLayout'

/**
 * Wah WebAmp — même shell que les autres marques (PedalFrame), treadle 2/3 + potards 1/3.
 */
export function WahSkin({
  model,
  values = {},
  onChange,
  bypassed = false,
  onBypassToggle,
  bottomActions,
  accentColor,
}: PedalComponentProps & { model: PedalModel }) {
  const accent = accentColor || model.accentColor
  const knobs = Object.entries(model.parameters).filter(
    ([name, d]) => name !== 'sweep' && (!d.controlType || d.controlType === 'knob')
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
        {knobs.map(([name, def]) => (
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
      </WahExpressionLayout>
    </PedalFrame>
  )
}
