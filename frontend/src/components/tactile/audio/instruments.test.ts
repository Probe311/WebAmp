import { describe, expect, it } from 'vitest'
import { envelopePoints } from './AdsrEnvelope'
import { waveAt } from './Oscilloscope'
import { peakingResponseDb } from './SpectrumAnalyzer'
import { bpmFromTaps } from './TempoTap'

describe('instruments helpers', () => {
  it('tap tempo : 500 ms entre taps = 120 BPM, moins de 2 taps = null', () => {
    expect(bpmFromTaps([0, 500, 1000, 1500])).toBe(120)
    expect(bpmFromTaps([0])).toBeNull()
  })

  it('égaliseur : gain atteint à la fréquence centrale, neutre à 0 dB', () => {
    expect(peakingResponseDb({ freq: 1000, gain: 6, q: 1 }, 1000)).toBeCloseTo(6, 1)
    expect(peakingResponseDb({ freq: 1000, gain: 0, q: 1 }, 300)).toBeCloseTo(0, 5)
  })

  it('ADSR : monte au sommet, redescend à zéro', () => {
    const points = envelopePoints({ attack: 100, decay: 100, sustain: 0.5, release: 100 })
    expect(points).toHaveLength(5)
    expect(points[1][1]).toBeLessThan(points[2][1])
    expect(points[0][1]).toBe(points[4][1])
  })

  it('formes d’onde : bornées dans [-1, 1]', () => {
    for (const shape of ['sine', 'saw', 'square'] as const)
      for (let p = 0; p < 3; p += 0.07) expect(Math.abs(waveAt(shape, p))).toBeLessThanOrEqual(1)
  })
})
