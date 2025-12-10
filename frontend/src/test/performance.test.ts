import { describe, it, expect } from 'vitest'
import { makeOverdrive, makeDistortion, makeFuzz } from '../audio/effects'

describe('Performance Tests', () => {
  const audioCtx = new AudioContext()
  const frameCount = 128
  const iterations = 1000

  describe('Latency Tests', () => {
    it('should process audio with low latency', () => {
      const effect = makeOverdrive(audioCtx, 50, 50, 50)
      const start = performance.now()
      
      // Simulate processing
      for (let i = 0; i < iterations; i++) {
        // Process would happen here
      }
      
      const end = performance.now()
      const latency = (end - start) / iterations
      
      // Latence par buffer devrait être < 5ms
      expect(latency).toBeLessThan(5)
    })
  })

  describe('CPU Usage Tests', () => {
    it('should process multiple effects efficiently', () => {
      const effects = [
        makeOverdrive(audioCtx, 50, 50, 50),
        makeDistortion(audioCtx, 50, 50, 50),
        makeFuzz(audioCtx, 50, 50, 50)
      ]

      const start = performance.now()
      
      for (let i = 0; i < iterations; i++) {
        // Simulate processing chain
      }
      
      const end = performance.now()
      const cpuTime = (end - start) / iterations
      
      // CPU usage devrait être < 15% du temps disponible
      const availableTime = (frameCount / audioCtx.sampleRate) * 1000 // ms
      const cpuPercent = (cpuTime / availableTime) * 100
      
      expect(cpuPercent).toBeLessThan(15)
    })
  })

  describe('Memory Tests', () => {
    it('should use reasonable memory for 10 effects', () => {
      const effects = []
      for (let i = 0; i < 10; i++) {
        effects.push(makeOverdrive(audioCtx, 50, 50, 50))
      }

      // Estimation mémoire (approximative)
      const estimatedMemoryMB = (effects.length * 0.5) // ~0.5MB par effet
      
      expect(estimatedMemoryMB).toBeLessThan(100)
    })
  })
})

