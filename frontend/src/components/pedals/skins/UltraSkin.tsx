import type { PedalModel } from '../../../data/pedals'
import type { PedalComponentProps } from '../types'
import { PedalFrame } from '../PedalFrame'
import { renderModelParams } from './renderParams'
import { knobSizeFromScale, layoutToFrameClass, resolveLayout } from './layoutUtils'

/**
 * Ultra = même composition Pedal (tête / réglages / pied LED + activation).
 * triangle + switch : potards 2+1, sélecteur en ligne 3.
 */
export function UltraSkin({
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
  const knobSize = knobSizeFromScale(
    model.ui?.knobScale ?? (layout === 'grid2' || layout === 'sliders' ? 0.5 : 1)
  )

  const knobs = Object.entries(model.parameters).filter(
    ([, d]) => !d.controlType || d.controlType === 'knob'
  )
  const switches = Object.entries(model.parameters).filter(
    ([, d]) => d.controlType === 'switch-selector'
  )
  const sliders = Object.entries(model.parameters).filter(([, d]) => d.controlType === 'slider')

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

  if (layout === 'sliders') {
    return (
      <PedalFrame
        model={model}
        size="M"
        layout="eq"
        bypassed={bypassed}
        onBypassToggle={onBypassToggle}
        bottomActions={bottomActions}
        className={layoutToFrameClass(layout)}
      >
        {renderModelParams(
          { ...model, parameters: Object.fromEntries(sliders.length ? sliders : knobs) },
          values,
          onChange,
          accent,
          {
            knobSize,
            compactSliders: true,
            className: 'flex-1 min-w-0',
            thumbShape: model.ui?.sliderThumb,
          }
        )}
        {switches.length > 0 && (
          <div className="col-span-full w-full flex justify-center mt-1">
            {renderModelParams(
              { ...model, parameters: Object.fromEntries(switches) },
              values,
              onChange,
              accent,
              { knobSize: 'S' }
            )}
          </div>
        )}
      </PedalFrame>
    )
  }

  // triangle + switch (UO-300) : 2+1 knobs puis sélecteur pleine largeur
  if (layout === 'triangle' && switches.length > 0) {
    return (
      <PedalFrame
        model={model}
        size="M"
        layout="flex"
        bypassed={bypassed}
        onBypassToggle={onBypassToggle}
        bottomActions={bottomActions}
      >
        <div className="flex flex-col gap-2 w-full items-center">
          <div className="grid grid-cols-2 gap-1 justify-items-center w-full [&>*:nth-child(3)]:col-span-2">
            {renderModelParams(
              { ...model, parameters: Object.fromEntries(knobs) },
              values,
              onChange,
              accent,
              { knobSize }
            )}
          </div>
          <div className="w-full flex justify-center">
            {renderModelParams(
              { ...model, parameters: Object.fromEntries(switches) },
              values,
              onChange,
              accent,
              { knobSize: 'S' }
            )}
          </div>
        </div>
      </PedalFrame>
    )
  }

  return (
    <PedalFrame
      model={model}
      size="M"
      layout={frameLayout}
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      bottomActions={bottomActions}
      className={layoutToFrameClass(layout)}
    >
      {renderModelParams(
        {
          ...model,
          parameters: Object.fromEntries(
            knobs.length || switches.length
              ? [...knobs, ...switches]
              : Object.entries(model.parameters)
          ),
        },
        values,
        onChange,
        accent,
        { knobSize }
      )}
    </PedalFrame>
  )
}
