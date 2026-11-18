import type { PedalModel } from '../../../data/pedals'
import type { PedalComponentProps } from '../types'
import { PedalFrame } from '../PedalFrame'
import { renderModelParams } from './renderParams'

/**
 * EQ — PedalFrame, faders compact. thumb round = marges serrées.
 */
export function EqSkin({
  model,
  values = {},
  onChange,
  bypassed = false,
  onBypassToggle,
  bottomActions,
  accentColor,
}: PedalComponentProps & { model: PedalModel }) {
  const accent = accentColor || model.accentColor
  const thumb = model.ui?.sliderThumb ?? 'rect'
  const tight = thumb === 'round'

  return (
    <PedalFrame
      model={model}
      size="M"
      layout="eq"
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      showFootswitch={false}
      bottomActions={bottomActions}
    >
      <div
        className={`flex items-stretch w-full h-full min-h-[200px] justify-between ${
          tight ? 'gap-0 px-0' : 'gap-0.5 px-0.5'
        }`}
      >
        {renderModelParams(model, values, onChange, accent, {
          knobSize: 'S',
          compactSliders: true,
          thumbShape: thumb,
          className: tight ? 'flex-1 min-w-0 max-w-none' : 'flex-1 min-w-0',
        })}
      </div>
    </PedalFrame>
  )
}
