import type { PedalModel } from '../../../data/pedals'
import type { PedalComponentProps } from '../types'
import { PedalFrame } from '../PedalFrame'
import { renderModelParams } from './renderParams'
import { layoutToFrameClass, resolveLayout } from './layoutUtils'

export function FlatSkin({
  model,
  values = {},
  onChange,
  bypassed = false,
  onBypassToggle,
  bottomActions,
  accentColor,
}: PedalComponentProps & { model: PedalModel }) {
  const accent = accentColor || model.accentColor
  const layout = resolveLayout(model)
  const frameLayout =
    layout === 'sliders'
      ? 'eq'
      : layout === 'triangle'
        ? 'three-knobs'
        : layout === 'grid2'
          ? 'four-knobs'
          : layout === 'stack' || layout === 'single'
            ? 'two-knobs'
            : 'default'

  const knobs = Object.entries(model.parameters).filter(
    ([, d]) => !d.controlType || d.controlType === 'knob'
  )
  const switches = Object.entries(model.parameters).filter(
    ([, d]) => d.controlType === 'switch-selector'
  )
  const sliders = Object.entries(model.parameters).filter(([, d]) => d.controlType === 'slider')

  // Compresseurs / sliders : bande de faders ; switches en dessous
  if (layout === 'sliders') {
    return (
      <PedalFrame
        model={model}
        layout="eq"
        bypassed={bypassed}
        onBypassToggle={onBypassToggle}
        showFootswitch={false}
        bottomActions={bottomActions}
        className={layoutToFrameClass(layout)}
      >
        {renderModelParams(
          { ...model, parameters: Object.fromEntries(sliders.length ? sliders : knobs) },
          values,
          onChange,
          accent,
          { knobSize: 'S' }
        )}
        {switches.length > 0 && (
          <div className="col-span-full w-full flex justify-center mt-1">
            {renderModelParams(
              { ...model, parameters: Object.fromEntries(switches) },
              values,
              onChange,
              accent
            )}
          </div>
        )}
      </PedalFrame>
    )
  }

  return (
    <PedalFrame
      model={model}
      layout={frameLayout}
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      showFootswitch={false}
      bottomActions={bottomActions}
      className={layoutToFrameClass(layout)}
      size={layout === 'single' ? 'M' : undefined}
    >
      {renderModelParams(
        {
          ...model,
          parameters: Object.fromEntries([...knobs, ...switches]),
        },
        values,
        onChange,
        accent,
        { knobSize: layout === 'single' ? 'L' : 'M' }
      )}
    </PedalFrame>
  )
}
