import type { PedalModel, PedalUiLayout } from '../../../data/pedals'
import type { PotentiometerSize } from '../../Potentiometer'

export function resolveLayout(model: PedalModel): PedalUiLayout {
  if (model.ui?.layout && model.ui.layout !== 'auto') return model.ui.layout

  const params = Object.values(model.parameters)
  const knobs = params.filter((p) => !p.controlType || p.controlType === 'knob')
  const sliders = params.filter((p) => p.controlType === 'slider')
  const switches = params.filter((p) => p.controlType === 'switch-selector')

  if (model.type === 'eq' || sliders.length >= 3) return 'sliders'
  if (knobs.length === 1 && switches.length === 0) return 'single'
  if (knobs.length === 2 && switches.length === 0) return 'stack'
  if (knobs.length === 3 && switches.length <= 1) return 'triangle'
  if (knobs.length === 4 && switches.length === 0) return 'grid2'
  if (knobs.length >= 5) return 'grid2'
  return 'row'
}

/** Classes shell pour PedalFrame / Ultra */
export function layoutToFrameClass(layout: PedalUiLayout): string {
  switch (layout) {
    case 'single':
      return 'has-two-knobs' // 1 col centrée
    case 'triangle':
      return 'has-three-knobs'
    case 'grid2':
      return 'has-four-knobs'
    case 'sliders':
      return 'is-eq-pedal'
    case 'stack':
      return 'has-two-knobs'
    case 'row':
    default:
      return ''
  }
}

export function accentShellFill(hex: string): string {
  return `color-mix(in srgb, ${hex} 22%, #f2f2f7)`
}

/** Boîtier taille 1 = M (BASE_UNIT) — toutes les pédales WebAmp */
export const WEBAMP_SHELL_PX = 230
export const WEBAMP_SHELL_MIN_H = 460

export function knobSizeFromScale(scale?: 0.5 | 1): 'S' | 'M' {
  return scale === 0.5 ? 'S' : 'M'
}

/**
 * Taille potard : knobSizes[param] → fallback explicite → knobScale → M.
 */
export function resolveKnobSize(
  model: Pick<PedalModel, 'ui'>,
  paramName: string,
  fallback?: PotentiometerSize
): PotentiometerSize {
  const per = model.ui?.knobSizes?.[paramName]
  if (per) return per
  if (fallback) return fallback
  if (model.ui?.knobScale != null) return knobSizeFromScale(model.ui.knobScale)
  return 'M'
}
