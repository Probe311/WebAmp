import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  syncEffectToAudio,
  syncEffectToWebSocket,
  removeEffectFromAudio,
  updateEffectParametersInAudio,
  setEffectEnabledInAudio
} from '../pedalboardSync'
import { PedalboardEngine } from '../../audio/PedalboardEngine'
import { WebSocketClient } from '../../services/websocket'
import type { Effect } from '../../components/Pedalboard'
import type { WebSocketMessage } from '../../services/websocket'

// Mock du logger
vi.mock('../../services/logger', () => ({
  createLogger: () => ({
    error: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn()
  })
}))

// Mock de WebSocketClient
vi.mock('../../services/websocket', () => ({
  WebSocketClient: {
    getInstance: vi.fn()
  }
}))

describe('pedalboardSync', () => {
  const mockEngine = {
    addEffect: vi.fn(),
    removeEffect: vi.fn(),
    updateEffectParameters: vi.fn(),
    setEffectEnabled: vi.fn()
  } as unknown as PedalboardEngine

  const mockEffect: Effect = {
    id: 'effect-1',
    type: 'overdrive',
    pedalId: 'boss-sd1',
    name: 'Boss SD-1',
    bypassed: false,
    parameters: { gain: 50, tone: 50, volume: 50 }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('syncEffectToAudio', () => {
    it('devrait appeler addAudioEffect si le moteur est initialisé', async () => {
      const addAudioEffect = vi.fn().mockResolvedValue(undefined)

      await syncEffectToAudio(mockEffect, true, mockEngine, addAudioEffect)

      expect(addAudioEffect).toHaveBeenCalledWith(mockEffect)
    })

    it('ne devrait pas appeler addAudioEffect si le moteur n\'est pas initialisé', async () => {
      const addAudioEffect = vi.fn()

      await syncEffectToAudio(mockEffect, false, mockEngine, addAudioEffect)

      expect(addAudioEffect).not.toHaveBeenCalled()
    })

    it('ne devrait pas appeler addAudioEffect si le moteur est null', async () => {
      const addAudioEffect = vi.fn()

      await syncEffectToAudio(mockEffect, true, null, addAudioEffect)

      expect(addAudioEffect).not.toHaveBeenCalled()
    })

    it('devrait gérer les erreurs silencieusement', async () => {
      const addAudioEffect = vi.fn().mockRejectedValue(new Error('Test error'))

      await expect(
        syncEffectToAudio(mockEffect, true, mockEngine, addAudioEffect)
      ).resolves.not.toThrow()

      expect(addAudioEffect).toHaveBeenCalled()
    })
  })

  describe('syncEffectToWebSocket', () => {
    it('devrait envoyer un message si WebSocket est connecté', async () => {
      const mockMessage: WebSocketMessage = {
        type: 'addEffect',
        effectId: 'effect-1'
      }
      const mockWs = {
        isConnected: vi.fn().mockReturnValue(true),
        send: vi.fn().mockResolvedValue(mockMessage)
      }
      vi.mocked(WebSocketClient.getInstance).mockReturnValue(mockWs as unknown as WebSocketClient)

      const result = await syncEffectToWebSocket(mockMessage, false)

      expect(mockWs.send).toHaveBeenCalledWith(mockMessage, false)
      expect(result).toBe(mockMessage)
    })

    it('devrait retourner le message si WebSocket n\'est pas connecté', async () => {
      const mockMessage: WebSocketMessage = {
        type: 'addEffect',
        effectId: 'effect-1'
      }
      const mockWs = {
        isConnected: vi.fn().mockReturnValue(false)
      }
      vi.mocked(WebSocketClient.getInstance).mockReturnValue(mockWs as unknown as WebSocketClient)

      const result = await syncEffectToWebSocket(mockMessage, false)

      expect(result).toBe(mockMessage)
    })
  })

  describe('removeEffectFromAudio', () => {
    it('devrait appeler removeAudioEffect si le moteur est initialisé', () => {
      const removeAudioEffect = vi.fn()

      removeEffectFromAudio('effect-1', true, mockEngine, removeAudioEffect)

      expect(removeAudioEffect).toHaveBeenCalledWith('effect-1')
    })

    it('ne devrait pas appeler removeAudioEffect si le moteur n\'est pas initialisé', () => {
      const removeAudioEffect = vi.fn()

      removeEffectFromAudio('effect-1', false, mockEngine, removeAudioEffect)

      expect(removeAudioEffect).not.toHaveBeenCalled()
    })

    it('devrait gérer les erreurs silencieusement', () => {
      const removeAudioEffect = vi.fn().mockImplementation(() => {
        throw new Error('Test error')
      })

      expect(() => {
        removeEffectFromAudio('effect-1', true, mockEngine, removeAudioEffect)
      }).not.toThrow()
    })
  })

  describe('updateEffectParametersInAudio', () => {
    it('devrait appeler updateAudioParameters si le moteur est initialisé', async () => {
      const updateAudioParameters = vi.fn().mockResolvedValue(undefined)
      const parameters = { gain: 75, tone: 60 }

      await updateEffectParametersInAudio('effect-1', parameters, true, mockEngine, updateAudioParameters)

      expect(updateAudioParameters).toHaveBeenCalledWith('effect-1', parameters)
    })

    it('ne devrait pas appeler updateAudioParameters si le moteur n\'est pas initialisé', async () => {
      const updateAudioParameters = vi.fn()

      await updateEffectParametersInAudio('effect-1', {}, false, mockEngine, updateAudioParameters)

      expect(updateAudioParameters).not.toHaveBeenCalled()
    })

    it('devrait gérer les erreurs silencieusement', async () => {
      const updateAudioParameters = vi.fn().mockRejectedValue(new Error('Test error'))

      await expect(
        updateEffectParametersInAudio('effect-1', {}, true, mockEngine, updateAudioParameters)
      ).resolves.not.toThrow()
    })
  })

  describe('setEffectEnabledInAudio', () => {
    it('devrait appeler setEffectEnabled si le moteur est initialisé', () => {
      const setEffectEnabled = vi.fn()

      setEffectEnabledInAudio('effect-1', true, true, mockEngine, setEffectEnabled)

      expect(setEffectEnabled).toHaveBeenCalledWith('effect-1', true)
    })

    it('ne devrait pas appeler setEffectEnabled si le moteur n\'est pas initialisé', () => {
      const setEffectEnabled = vi.fn()

      setEffectEnabledInAudio('effect-1', true, false, mockEngine, setEffectEnabled)

      expect(setEffectEnabled).not.toHaveBeenCalled()
    })

    it('devrait gérer les erreurs silencieusement', () => {
      const setEffectEnabled = vi.fn().mockImplementation(() => {
        throw new Error('Test error')
      })

      expect(() => {
        setEffectEnabledInAudio('effect-1', true, true, mockEngine, setEffectEnabled)
      }).not.toThrow()
    })
  })
})

