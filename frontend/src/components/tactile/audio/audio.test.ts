import { describe, expect, it } from 'vitest'
import { crossfadeGains } from './Crossfader'
import { faderToDb } from './ChannelFader'
import { formatTimecode } from './TransportDeck'
import { SEQUENCER_PRESETS, SEQUENCER_STEPS, SEQUENCER_TRACKS } from './StepSequencer'

describe('audio helpers', () => {
  it('crossfade : bords et centre', () => {
    expect(crossfadeGains(0, 'linear')).toEqual({ a: 1, b: 0 })
    expect(crossfadeGains(1, 'cut')).toEqual({ a: 0, b: 1 })
    expect(crossfadeGains(0.5, 'cut')).toEqual({ a: 1, b: 1 })
    const mid = crossfadeGains(0.5, 'smooth')
    expect(mid.a ** 2 + mid.b ** 2).toBeCloseTo(1)
  })

  it('fader : 0,75 = 0 dB, 0 = -∞', () => {
    expect(faderToDb(0.75)).toBeCloseTo(0)
    expect(faderToDb(0)).toBe(-Infinity)
  })

  it('timecode MM:SS:FF', () => {
    expect(formatTimecode(65.5)).toBe('01:05:15')
  })

  it('préréglages : 10 styles × BPM + 11 pistes × 16 pas', () => {
    expect(Object.keys(SEQUENCER_PRESETS)).toHaveLength(10)
    expect(SEQUENCER_TRACKS[0]).toBe('CRASH')
    expect(SEQUENCER_TRACKS[6]).toBe('KICK')
    expect(SEQUENCER_TRACKS[10]).toBe('TOM4')
    expect(SEQUENCER_PRESETS.rock.bpm).toBe(110)
    expect(SEQUENCER_PRESETS.dnb.bpm).toBe(174)
    for (const def of Object.values(SEQUENCER_PRESETS)) {
      expect(def.bpm).toBeGreaterThanOrEqual(60)
      expect(def.bpm).toBeLessThanOrEqual(200)
      expect(def.pattern).toHaveLength(SEQUENCER_TRACKS.length)
      def.pattern.forEach((row) => expect(row).toHaveLength(SEQUENCER_STEPS))
    }
  })
})
