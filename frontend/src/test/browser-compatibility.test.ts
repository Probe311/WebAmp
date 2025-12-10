import { describe, it, expect } from 'vitest'

describe('Browser Compatibility Tests', () => {
  describe('Web Audio API Support', () => {
    it('should have AudioContext available', () => {
      expect(typeof AudioContext).not.toBe('undefined')
      expect(typeof window.AudioContext).not.toBe('undefined')
    })

    it('should support required Web Audio API nodes', () => {
      const ctx = new AudioContext()
      
      expect(() => ctx.createGain()).not.toThrow()
      expect(() => ctx.createWaveShaper()).not.toThrow()
      expect(() => ctx.createBiquadFilter()).not.toThrow()
      expect(() => ctx.createDelay()).not.toThrow()
      expect(() => ctx.createConvolver()).not.toThrow()
      expect(() => ctx.createOscillator()).not.toThrow()
      expect(() => ctx.createAnalyser()).not.toThrow()
    })

    it('should support ScriptProcessorNode or AudioWorklet', () => {
      const ctx = new AudioContext()
      
      // ScriptProcessorNode (déprécié mais encore supporté)
      const hasScriptProcessor = typeof ctx.createScriptProcessor !== 'undefined'
      // AudioWorklet (moderne)
      const hasAudioWorklet = typeof ctx.audioWorklet !== 'undefined'
      
      expect(hasScriptProcessor || hasAudioWorklet).toBe(true)
    })
  })

  describe('Performance API', () => {
    it('should have performance.now() available', () => {
      expect(typeof performance).not.toBe('undefined')
      expect(typeof performance.now).toBe('function')
      
      const start = performance.now()
      expect(start).toBeGreaterThan(0)
    })
  })

  describe('WebSocket Support', () => {
    it('should have WebSocket available', () => {
      expect(typeof WebSocket).not.toBe('undefined')
      expect(typeof window.WebSocket).not.toBe('undefined')
    })
  })

  describe('ArrayBuffer Support', () => {
    it('should support ArrayBuffer and TypedArrays', () => {
      expect(typeof ArrayBuffer).not.toBe('undefined')
      expect(typeof Float32Array).not.toBe('undefined')
      expect(typeof Uint8Array).not.toBe('undefined')
    })
  })

  describe('ES6 Features', () => {
    it('should support Promise', () => {
      expect(typeof Promise).not.toBe('undefined')
      
      const promise = Promise.resolve(42)
      expect(promise).toBeInstanceOf(Promise)
    })

    it('should support async/await', async () => {
      const result = await Promise.resolve(42)
      expect(result).toBe(42)
    })

    it('should support Map and Set', () => {
      expect(typeof Map).not.toBe('undefined')
      expect(typeof Set).not.toBe('undefined')
      
      const map = new Map()
      const set = new Set()
      expect(map).toBeInstanceOf(Map)
      expect(set).toBeInstanceOf(Set)
    })
  })
})

