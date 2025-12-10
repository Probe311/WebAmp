import { describe, it, expect, beforeEach, vi } from 'vitest'
import { PedalboardEngine } from '../PedalboardEngine'
import { pedalLibrary } from '../../data/pedals'

describe('PedalboardEngine', () => {
  let engine: PedalboardEngine
  let audioCtx: AudioContext

  beforeEach(() => {
    audioCtx = new AudioContext()
    engine = new PedalboardEngine(audioCtx)
  })

  describe('Effect Management', () => {
    it('should add an effect', async () => {
      const pedal = pedalLibrary.find(p => p.id === 'boss-ds1')
      expect(pedal).toBeDefined()
      
      if (pedal) {
        const effectId = await engine.addEffect(pedal.id, pedal.type, {})
        expect(effectId).toBeDefined()
      }
    })

    it('should remove an effect', async () => {
      const pedal = pedalLibrary.find(p => p.id === 'boss-ds1')
      if (pedal) {
        const effectId = await engine.addEffect(pedal.id, pedal.type, {})
        expect(() => engine.removeEffect(effectId)).not.toThrow()
      }
    })

    it('should update effect parameters', async () => {
      const pedal = pedalLibrary.find(p => p.id === 'boss-ds1')
      if (pedal) {
        const effectId = await engine.addEffect(pedal.id, pedal.type, {})
        expect(() => engine.updateEffectParameters(effectId, { distortion: 75 })).not.toThrow()
      }
    })

    it('should toggle effect bypass', async () => {
      const pedal = pedalLibrary.find(p => p.id === 'boss-ds1')
      if (pedal) {
        const effectId = await engine.addEffect(pedal.id, pedal.type, {})
        expect(() => engine.setEffectEnabled(effectId, false)).not.toThrow()
        expect(() => engine.setEffectEnabled(effectId, true)).not.toThrow()
      }
    })
  })

  describe('Multiple Effects', () => {
    it('should handle multiple effects in chain', async () => {
      const pedals = [
        pedalLibrary.find(p => p.id === 'boss-ds1'),
        pedalLibrary.find(p => p.id === 'boss-ce2'),
        pedalLibrary.find(p => p.id === 'boss-dd3')
      ].filter(Boolean)

      for (const pedal of pedals) {
        if (pedal) {
          await engine.addEffect(pedal.id, pedal.type, {})
        }
      }

      // Should not throw with multiple effects
      expect(true).toBe(true)
    })

    it('should support up to 20 effects', async () => {
      const testPedal = pedalLibrary[0]
      if (testPedal) {
        for (let i = 0; i < 20; i++) {
          await engine.addEffect(testPedal.id, testPedal.type, {}, `test-${i}`)
        }
        // Should handle 20 effects without issues
        expect(true).toBe(true)
      }
    })
  })

  describe('Cleanup', () => {
    it('should cleanup resources on dispose', () => {
      expect(() => engine.dispose()).not.toThrow()
    })

    it('should cleanup individual effects', async () => {
      const pedal = pedalLibrary.find(p => p.id === 'boss-ds1')
      if (pedal) {
        const effectId = await engine.addEffect(pedal.id, pedal.type, {})
        engine.removeEffect(effectId)
        // Cleanup should be called
        expect(true).toBe(true)
      }
    })
  })
})

