import { describe, it, expect } from 'vitest'
import { pedalLibrary } from '../../data/pedals'
import { amplifierLibrary } from '../../data/amplifiers'
import {
  displayLabelForAmp,
  displayLabelForPedal,
  keepsRealName,
  pedalIndexInType,
  ampIndexInBrand,
} from '../branding'
import { resolveAmpGenre, resolvePedalGenre } from '../genres'

function pedal(id: string) {
  const p = pedalLibrary.find((x) => x.id === id)
  if (!p) throw new Error(`missing pedal ${id}`)
  return p
}

function amp(id: string) {
  const a = amplifierLibrary.find((x) => x.id === id)
  if (!a) throw new Error(`missing amp ${id}`)
  return a
}

describe('displayLabel + genres', () => {
  it('Walrus conserve marque et modèle réels', () => {
    const p = pedal('walrus-audio-drive')
    expect(keepsRealName(p.brand)).toBe(true)
    const label = displayLabelForPedal(p, pedalIndexInType(pedalLibrary, p))
    expect(label.brandName).toBe('Walrus Audio')
    expect(label.modelName).toBe(p.model)
  })

  it('pédale tierce → marque blanche WebAmp Studio', () => {
    const p = pedal('boss-ds1')
    expect(keepsRealName(p.brand)).toBe(false)
    const label = displayLabelForPedal(p, pedalIndexInType(pedalLibrary, p))
    expect(label.brandName).toBe('WebAmp Studio')
    expect(label.modelName).toMatch(/DISTORTION/)
    expect(label.sourceName).toContain('BOSS')
  })

  it('Webamp Classic (gamme maison) conserve le nom catalogue', () => {
    const p = pedalLibrary.find((x) => x.brand === 'Webamp Classic')
    expect(p).toBeTruthy()
    if (!p) return
    const label = displayLabelForPedal(p, pedalIndexInType(pedalLibrary, p))
    expect(label.brandName).toBe('Webamp Classic')
    expect(label.modelName).toBe(p.model)
  })

  it('ampli tierce → white-label ; genres résolus', () => {
    const a = amp('marshall-jcm800')
    const label = displayLabelForAmp(a, ampIndexInBrand(amplifierLibrary, a))
    expect(label.brandName).toBe('WebAmp Studio')
    expect(label.sourceName).toContain('Marshall')
    expect(resolveAmpGenre(a)).toBe('rock')
  })

  it('niches pédales : ambient / reggae / experimental', () => {
    expect(resolvePedalGenre(pedal('walrus-audio-ambient'))).toBe('ambient')
    expect(resolvePedalGenre(pedal('surfybear-metal'))).toBe('reggae')
    expect(resolvePedalGenre(pedal('moog-mf-ring'))).toBe('experimental')
  })
})
