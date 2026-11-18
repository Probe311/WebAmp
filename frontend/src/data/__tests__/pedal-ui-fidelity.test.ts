import { describe, it, expect } from 'vitest'
import { pedalLibrary } from '../pedals'

function pedal(id: string) {
  const p = pedalLibrary.find((x) => x.id === id)
  if (!p) throw new Error(`missing ${id}`)
  return p
}

describe('pedal ui fidelity', () => {
  it('TS9 : pied rect, triangle, 2M+1S, ordre Drive/Level/Tone', () => {
    const p = pedal('ibanez-tube-screamer')
    expect(Object.keys(p.parameters)).toEqual(['drive', 'level', 'tone'])
    expect(p.ui?.footShape).toBe('rect')
    expect(p.ui?.layout).toBe('triangle')
    expect(p.ui?.knobSizes).toEqual({ drive: 'M', level: 'M', tone: 'S' })
  })

  it('spot-check classics', () => {
    expect(pedal('proco-rat').ui?.layout).toBe('triangle')
    expect(pedal('boss-ds1').ui?.footShape).toBe('round')
    expect(pedal('electro-harmonix-big-muff').ui?.layout).toBe('triangle')
    expect(pedal('mxr-phase90').ui?.layout).toBe('stack')
    expect(pedal('cry-baby-wah').ui?.skin).toBe('wah')
  })

  it('Ultra conserve skin ultra (ui modèle > fidelity)', () => {
    expect(pedal('webamp-od300').ui?.skin).toBe('ultra')
  })
})
