import { describe, it, expect } from 'vitest'
import { 
  analyzeControlTypes, 
  analyzeControlTypesFromModel, 
  determineKnobSize,
  type ControlTypeAnalysis,
  type PedalModelForAnalysis
} from '../pedalControlHelpers'

describe('pedalControlHelpers', () => {
  describe('analyzeControlTypes', () => {
    it('devrait identifier correctement les potentiomètres', () => {
      const pedalModel: PedalModelForAnalysis = {
        type: 'overdrive',
        parameters: {
          gain: { controlType: 'knob' },
          tone: { controlType: 'knob' },
          volume: { controlType: 'knob' }
        }
      }
      
      const parameters = { gain: 50, tone: 50, volume: 50 }
      const result = analyzeControlTypes(parameters, pedalModel)
      
      expect(result.potentiometers).toHaveLength(3)
      expect(result.sliders).toHaveLength(0)
      expect(result.switchSelectors).toHaveLength(0)
      expect(result.hasThreeKnobs).toBe(true)
      expect(result.hasFourKnobs).toBe(false)
    })

    it('devrait identifier correctement les sliders', () => {
      const pedalModel: PedalModelForAnalysis = {
        type: 'eq',
        parameters: {
          bass: { controlType: 'slider' },
          middle: { controlType: 'slider' },
          treble: { controlType: 'slider' }
        }
      }
      
      const parameters = { bass: 50, middle: 50, treble: 50 }
      const result = analyzeControlTypes(parameters, pedalModel)
      
      expect(result.sliders).toHaveLength(3)
      expect(result.isEQ).toBe(true)
      expect(result.hasThreeKnobs).toBe(false)
    })

    it('devrait identifier correctement les switch-selectors', () => {
      const pedalModel: PedalModelForAnalysis = {
        type: 'chorus',
        parameters: {
          mode: { controlType: 'switch-selector' },
          rate: { controlType: 'knob' },
          depth: { controlType: 'knob' }
        }
      }
      
      const parameters = { mode: 0, rate: 50, depth: 50 }
      const result = analyzeControlTypes(parameters, pedalModel)
      
      expect(result.switchSelectors).toHaveLength(1)
      expect(result.potentiometers).toHaveLength(2)
      expect(result.hasSwitchSelectorWithKnobs).toBe(true)
    })

    it('devrait gérer les paramètres sans controlType (défaut: knob)', () => {
      const pedalModel: PedalModelForAnalysis = {
        type: 'distortion',
        parameters: {
          gain: {}, // Pas de controlType défini
          tone: { controlType: 'knob' }
        }
      }
      
      const parameters = { gain: 50, tone: 50 }
      const result = analyzeControlTypes(parameters, pedalModel)
      
      expect(result.potentiometers.length).toBeGreaterThan(0)
    })
  })

  describe('analyzeControlTypesFromModel', () => {
    it('devrait compter correctement les potentiomètres', () => {
      const pedalModel: PedalModelForAnalysis = {
        type: 'overdrive',
        parameters: {
          gain: { controlType: 'knob' },
          tone: { controlType: 'knob' },
          volume: { controlType: 'knob' },
          level: { controlType: 'knob' }
        }
      }
      
      const result = analyzeControlTypesFromModel(pedalModel)
      
      expect(result.potentiometers).toBe(4)
      expect(result.hasFourKnobs).toBe(true)
      expect(result.hasThreeKnobs).toBe(false)
    })

    it('devrait identifier un EQ', () => {
      const pedalModel: PedalModelForAnalysis = {
        type: 'eq',
        parameters: {
          bass: { controlType: 'slider' },
          middle: { controlType: 'slider' }
        }
      }
      
      const result = analyzeControlTypesFromModel(pedalModel)
      
      expect(result.isEQ).toBe(true)
    })
  })

  describe('determineKnobSize', () => {
    it('devrait retourner "large" pour 1-2 potentiomètres sans switch-selector', () => {
      expect(determineKnobSize(1, false)).toBe('large')
      expect(determineKnobSize(2, false)).toBe('large')
    })

    it('devrait retourner "medium" pour 3-4 potentiomètres sans switch-selector', () => {
      expect(determineKnobSize(3, false)).toBe('medium')
      expect(determineKnobSize(4, false)).toBe('medium')
    })

    it('devrait retourner "small" pour 5+ potentiomètres sans switch-selector', () => {
      expect(determineKnobSize(5, false)).toBe('small')
      expect(determineKnobSize(6, false)).toBe('small')
    })

    it('devrait retourner "large" pour 1-2 potentiomètres avec switch-selector', () => {
      expect(determineKnobSize(1, true)).toBe('large')
      expect(determineKnobSize(2, true)).toBe('large')
    })

    it('devrait retourner "medium" pour 3 potentiomètres avec switch-selector', () => {
      expect(determineKnobSize(3, true)).toBe('medium')
    })

    it('devrait retourner "small" pour 4+ potentiomètres avec switch-selector', () => {
      expect(determineKnobSize(4, true)).toBe('small')
      expect(determineKnobSize(5, true)).toBe('small')
    })
  })
})

