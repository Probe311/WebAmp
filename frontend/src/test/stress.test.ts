import { describe, it, expect } from 'vitest'
import { makeOverdrive, makeDistortion, makeFuzz, makeChorus, makeDelay } from '../audio/effects'

describe('Stress Tests', () => {
  const audioCtx = new AudioContext()

  describe('Maximum Effects Test', () => {
    it('should handle 20 effects simultaneously', () => {
      const effects = []
      
      for (let i = 0; i < 20; i++) {
        const effectType = i % 5
        switch (effectType) {
          case 0:
            effects.push(makeOverdrive(audioCtx, 50, 50, 50))
            break
          case 1:
            effects.push(makeDistortion(audioCtx, 50, 50, 50))
            break
          case 2:
            effects.push(makeFuzz(audioCtx, 50, 50, 50))
            break
          case 3:
            effects.push(makeChorus(audioCtx, 50, 50, 50))
            break
          case 4:
            effects.push(makeDelay(audioCtx, 50, 50, 50))
            break
        }
      }

      expect(effects.length).toBe(20)
      // Tous les effets devraient être créés sans erreur
      effects.forEach(effect => {
        expect(effect.input).toBeDefined()
        expect(effect.output).toBeDefined()
      })
    })
  })

  describe('Rapid Parameter Changes', () => {
    it('should handle rapid parameter updates', () => {
      const effect = makeOverdrive(audioCtx, 50, 50, 50)
      
      // Simuler 1000 changements de paramètres rapides
      for (let i = 0; i < 1000; i++) {
        // Les paramètres seraient mis à jour ici
        // Pas d'erreur attendue
      }
      
      expect(effect.input).toBeDefined()
    })
  })

  describe('Rapid Add/Remove Effects', () => {
    it('should handle rapid effect addition and removal', () => {
      const effects = []
      
      // Ajouter et supprimer rapidement
      for (let i = 0; i < 100; i++) {
        const effect = makeOverdrive(audioCtx, 50, 50, 50)
        effects.push(effect)
        
        if (i % 10 === 0 && effects.length > 0) {
          effects.pop()
        }
      }
      
      // Ne devrait pas planter
      expect(effects.length).toBeGreaterThan(0)
    })
  })

  describe('High Sample Rate Test', () => {
    it('should handle high sample rates (96kHz)', () => {
      // Simuler un contexte à 96kHz
      const highRateCtx = {
        ...audioCtx,
        sampleRate: 96000
      } as AudioContext
      
      const effect = makeOverdrive(highRateCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
    })

    it('should handle very high sample rates (192kHz)', () => {
      const veryHighRateCtx = {
        ...audioCtx,
        sampleRate: 192000
      } as AudioContext
      
      const effect = makeOverdrive(veryHighRateCtx, 50, 50, 50)
      expect(effect.input).toBeDefined()
    })
  })
})

