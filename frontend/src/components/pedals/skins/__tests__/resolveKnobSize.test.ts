import { describe, it, expect } from 'vitest'
import { resolveKnobSize } from '../layoutUtils'
import type { PedalModel } from '../../../../data/pedals'

function stub(ui: PedalModel['ui']): Pick<PedalModel, 'ui'> {
  return { ui }
}

describe('resolveKnobSize', () => {
  it('TS9 2M+1S : Tone S, Drive/Level M', () => {
    const model = stub({
      skin: 'flat',
      layout: 'triangle',
      knobSizes: { drive: 'M', level: 'M', tone: 'S' },
    })
    expect(resolveKnobSize(model, 'drive')).toBe('M')
    expect(resolveKnobSize(model, 'level')).toBe('M')
    expect(resolveKnobSize(model, 'tone')).toBe('S')
  })

  it('priorité knobSizes sur knobScale et fallback', () => {
    const model = stub({ skin: 'flat', knobScale: 0.5, knobSizes: { gain: 'L' } })
    expect(resolveKnobSize(model, 'gain', 'S')).toBe('L')
    expect(resolveKnobSize(model, 'tone', 'M')).toBe('M')
  })

  it('knobScale sans knobSizes ni fallback', () => {
    expect(resolveKnobSize(stub({ skin: 'ultra', knobScale: 0.5 }), 'x')).toBe('S')
    expect(resolveKnobSize(stub({ skin: 'ultra', knobScale: 1 }), 'x')).toBe('M')
  })

  it('défaut M', () => {
    expect(resolveKnobSize(stub({ skin: 'flat' }), 'x')).toBe('M')
  })
})
