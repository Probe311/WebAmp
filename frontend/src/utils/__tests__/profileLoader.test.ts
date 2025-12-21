import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadProfileSequentially, loadProfile, type LoadableProfile } from '../profileLoader'

// Mock des dépendances
vi.mock('../profileMapper', () => ({
  findAmplifierId: vi.fn((name: string) => {
    if (name === 'Marshall JCM800') return 'marshall-jcm800'
    if (name === 'Fender Twin Reverb') return 'fender-twin-reverb'
    return null
  }),
  findPedalId: vi.fn((name: string) => {
    if (name === 'Tube Screamer') return 'ibanez-ts9'
    if (name === 'Big Muff') return 'ehx-big-muff'
    return null
  })
}))

vi.mock('../data/rockStarProfiles', () => ({
  rockStarProfiles: [
    {
      name: 'Test Profile',
      amps: ['Marshall JCM800'],
      pedals: ['Tube Screamer', 'Big Muff']
    },
    {
      name: 'Empty Profile',
      amps: [],
      pedals: []
    }
  ]
}))

describe('profileLoader', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('loadProfileSequentially', () => {
    it('devrait appeler clearEffects en premier', async () => {
      const clearEffects = vi.fn()
      const setAmplifier = vi.fn()
      const setAmplifierParameters = vi.fn()
      const addEffect = vi.fn()

      const profile: LoadableProfile = {
        amplifierId: 'marshall-jcm800',
        pedalIds: []
      }

      const promise = loadProfileSequentially(
        profile,
        clearEffects,
        setAmplifier,
        setAmplifierParameters,
        addEffect
      )

      // Avancer le temps pour déclencher les timeouts
      await vi.runAllTimersAsync()
      await promise

      expect(clearEffects).toHaveBeenCalled()
    })

    it('devrait configurer l\'amplificateur si fourni', async () => {
      const clearEffects = vi.fn()
      const setAmplifier = vi.fn()
      const setAmplifierParameters = vi.fn()
      const addEffect = vi.fn()

      const profile: LoadableProfile = {
        amplifierId: 'marshall-jcm800',
        amplifierParameters: { gain: 75, volume: 50 },
        pedalIds: []
      }

      const promise = loadProfileSequentially(
        profile,
        clearEffects,
        setAmplifier,
        setAmplifierParameters,
        addEffect
      )

      await vi.runAllTimersAsync()
      await promise

      expect(setAmplifier).toHaveBeenCalledWith('marshall-jcm800')
      expect(setAmplifierParameters).toHaveBeenCalledWith({ gain: 75, volume: 50 })
    })

    it('devrait ajouter les pédales séquentiellement avec délais', async () => {
      const clearEffects = vi.fn()
      const setAmplifier = vi.fn()
      const setAmplifierParameters = vi.fn()
      const addEffect = vi.fn()

      const profile: LoadableProfile = {
        amplifierId: 'marshall-jcm800',
        pedalIds: ['ibanez-ts9', 'ehx-big-muff']
      }

      const promise = loadProfileSequentially(
        profile,
        clearEffects,
        setAmplifier,
        setAmplifierParameters,
        addEffect
      )

      // Vérifier que la première pédale est ajoutée après le délai initial
      await vi.advanceTimersByTimeAsync(300)
      expect(addEffect).toHaveBeenCalledTimes(1)
      expect(addEffect).toHaveBeenNthCalledWith(1, 'ibanez-ts9')

      // Avancer pour la deuxième pédale
      await vi.advanceTimersByTimeAsync(150)
      expect(addEffect).toHaveBeenCalledTimes(2)
      expect(addEffect).toHaveBeenNthCalledWith(2, 'ehx-big-muff')

      await promise
    })

    it('devrait fonctionner sans amplificateur', async () => {
      const clearEffects = vi.fn()
      const setAmplifier = vi.fn()
      const setAmplifierParameters = vi.fn()
      const addEffect = vi.fn()

      const profile: LoadableProfile = {
        pedalIds: ['ibanez-ts9']
      }

      const promise = loadProfileSequentially(
        profile,
        clearEffects,
        setAmplifier,
        setAmplifierParameters,
        addEffect
      )

      await vi.runAllTimersAsync()
      await promise

      expect(setAmplifier).not.toHaveBeenCalled()
      expect(addEffect).toHaveBeenCalledWith('ibanez-ts9')
    })
  })

  describe('loadProfile', () => {
    it('devrait retourner null si le profil n\'existe pas', () => {
      const result = loadProfile('Non Existent Profile')
      expect(result).toBeNull()
    })

    it('devrait trouver le profil et mapper les amplis et pédales', () => {
      const result = loadProfile('Test Profile')

      expect(result).not.toBeNull()
      expect(result?.amplifierId).toBe('marshall-jcm800')
      expect(result?.pedalIds).toContain('ibanez-ts9')
      expect(result?.pedalIds).toContain('ehx-big-muff')
    })

    it('devrait gérer un profil vide', () => {
      const result = loadProfile('Empty Profile')

      expect(result).not.toBeNull()
      expect(result?.amplifierId).toBeNull()
      expect(result?.pedalIds).toEqual([])
    })

    it('devrait retourner null si aucun ampli n\'est trouvé mais continuer avec les pédales', () => {
      // Mock pour retourner null pour les amplis
      const { findAmplifierId } = require('../profileMapper')
      vi.mocked(findAmplifierId).mockReturnValue(null)

      const result = loadProfile('Test Profile')

      expect(result).not.toBeNull()
      expect(result?.amplifierId).toBeNull()
      expect(result?.pedalIds.length).toBeGreaterThan(0)
    })
  })
})

