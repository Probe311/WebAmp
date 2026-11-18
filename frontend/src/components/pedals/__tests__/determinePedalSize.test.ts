import { describe, it, expect } from 'vitest'
import { determinePedalSize } from '../PedalFrame'
import { pedalLibrary } from '../../../data/pedals'

function byId(id: string) {
  const model = pedalLibrary.find((p) => p.id === id)
  if (!model) throw new Error(`pedal missing: ${id}`)
  return model
}

describe('determinePedalSize', () => {
  it('Walrus (sliders horizontaux) → M (shell 1.5× via has-horizontal-sliders)', () => {
    expect(determinePedalSize(byId('walrus-audio-drive'))).toBe('M')
    expect(determinePedalSize(byId('walrus-audio-distortion'))).toBe('M')
  })

  it('Oceans 11 (switch ≥6 modes) → XL', () => {
    expect(determinePedalSize(byId('electro-harmonix-oceans-11'))).toBe('XL')
  })

  it('3 knobs simples → M', () => {
    expect(determinePedalSize(byId('boss-ds1'))).toBe('M')
    expect(determinePedalSize(byId('boss-sd1'))).toBe('M')
  })

  it('EQ largeurs proportionnelles aux bandes', () => {
    expect(determinePedalSize(byId('empress-paraeq'))).toBe('M')
    expect(determinePedalSize(byId('source-audio-programmable-eq'))).toBe('L')
    expect(determinePedalSize(byId('boss-ge7'))).toBe('L')
    expect(determinePedalSize(byId('mxr-10-band-eq'))).toBe('XL')
  })

  it('RV-6 → L (taille 2)', () => {
    expect(determinePedalSize(byId('boss-rv6'))).toBe('L')
  })

  it('Flint / G-Major 2 / wah treadle → M (shell 1.5 via class)', () => {
    expect(determinePedalSize(byId('strymon-flint'))).toBe('M')
    expect(determinePedalSize(byId('tc-gmajor2'))).toBe('M')
    expect(determinePedalSize(byId('cry-baby-wah'))).toBe('M')
    expect(determinePedalSize(byId('vox-v847-wah'))).toBe('M')
  })

  it('Q-Tron / Mu-Tron III / AW-3 → M taille 1', () => {
    expect(determinePedalSize(byId('ehx-q-tron'))).toBe('M')
    expect(determinePedalSize(byId('mutron-iii'))).toBe('M')
    expect(determinePedalSize(byId('boss-aw3'))).toBe('M')
  })
})


