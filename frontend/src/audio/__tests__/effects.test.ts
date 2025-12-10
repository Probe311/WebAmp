import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  makeOverdrive,
  makeDistortion,
  makeFuzz,
  makeChorus,
  makeFlanger,
  makePhaser,
  makeTremolo,
  makeDelay,
  makeReverb,
  makeEQ,
  makeCompressor,
  makeNoiseGate,
  makeRingModulator,
  makeBitCrusher,
  makeLoFi,
  makeTapeDelay,
  makeSpringReverb,
  makeShimmerReverb
} from '../effects'

describe('Audio Effects', () => {
  let audioCtx: AudioContext

  beforeEach(() => {
    audioCtx = new AudioContext()
  })

  describe('Distortion Effects', () => {
    it('should create overdrive effect', () => {
      const effect = makeOverdrive(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create distortion effect', () => {
      const effect = makeDistortion(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create fuzz effect', () => {
      const effect = makeFuzz(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create fuzz with gate', () => {
      const effect = makeFuzz(audioCtx, 50, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
      expect(effect.cleanup).toBeDefined()
    })
  })

  describe('Modulation Effects', () => {
    it('should create chorus effect', () => {
      const effect = makeChorus(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create flanger effect', () => {
      const effect = makeFlanger(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create phaser effect', () => {
      const effect = makePhaser(audioCtx, 50, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create tremolo effect', () => {
      const effect = makeTremolo(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })
  })

  describe('Time-Based Effects', () => {
    it('should create delay effect', () => {
      const effect = makeDelay(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create reverb effect', async () => {
      const effect = await makeReverb(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create tape delay effect', () => {
      const effect = makeTapeDelay(audioCtx, 50, 50, 50, 30, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create spring reverb effect', () => {
      const effect = makeSpringReverb(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create shimmer reverb effect', async () => {
      const effect = await makeShimmerReverb(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })
  })

  describe('Filter Effects', () => {
    it('should create EQ effect', () => {
      const effect = makeEQ(audioCtx, 50, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })
  })

  describe('Dynamic Effects', () => {
    it('should create compressor effect', () => {
      const effect = makeCompressor(audioCtx, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create noise gate effect', () => {
      const effect = makeNoiseGate(audioCtx, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })
  })

  describe('Special Effects', () => {
    it('should create ring modulator effect', () => {
      const effect = makeRingModulator(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create bit crusher effect', () => {
      const effect = makeBitCrusher(audioCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })

    it('should create lo-fi effect', () => {
      const effect = makeLoFi(audioCtx, 50, 50, 50, 50)
      expect(effect.input).toBeDefined()
      expect(effect.output).toBeDefined()
    })
  })

  describe('Parameter Ranges', () => {
    it('should handle parameter values at boundaries', () => {
      // Test min values
      expect(() => makeOverdrive(audioCtx, 0, 0, 0)).not.toThrow()
      // Test max values
      expect(() => makeOverdrive(audioCtx, 100, 100, 100)).not.toThrow()
    })

    it('should handle invalid parameter values gracefully', () => {
      // Test negative values
      expect(() => makeOverdrive(audioCtx, -10, 50, 50)).not.toThrow()
      // Test values > 100
      expect(() => makeOverdrive(audioCtx, 150, 50, 50)).not.toThrow()
    })
  })
})
