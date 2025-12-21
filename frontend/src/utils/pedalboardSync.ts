// Fonctions utilitaires pour synchroniser les effets avec le moteur audio

import { Effect } from '../components/Pedalboard'
import { WebSocketClient, WebSocketMessage } from '../services/websocket'
import { PedalboardEngine } from '../audio/PedalboardEngine'
import { createLogger } from '../services/logger'

const logger = createLogger('pedalboardSync')

/**
 * Synchronise un effet avec le moteur audio
 */
export async function syncEffectToAudio(
  effect: Effect,
  isInitialized: boolean,
  engine: PedalboardEngine | null,
  addAudioEffect: (effect: Effect) => Promise<void>
): Promise<void> {
  if (isInitialized && engine) {
    try {
      await addAudioEffect(effect)
    } catch (error) {
      logger.error('Échec de synchronisation d\'effet avec le moteur audio', error, { 
        effectId: effect.id, 
        pedalId: effect.pedalId 
      })
    }
  }
}

/**
 * Synchronise un effet avec WebSocket
 */
export function syncEffectToWebSocket(
  message: WebSocketMessage,
  requireAck: boolean = false
): Promise<WebSocketMessage> {
  const ws = WebSocketClient.getInstance()
  if (ws.isConnected()) {
    return ws.send(message, requireAck).catch((error) => {
      logger.error('Échec d\'envoi de message WebSocket', error, { messageType: message.type })
      throw error
    })
  }
  return Promise.resolve(message)
}

/**
 * Supprime un effet du moteur audio
 */
export function removeEffectFromAudio(
  id: string,
  isInitialized: boolean,
  engine: PedalboardEngine | null,
  removeAudioEffect: (id: string) => void
): void {
  if (isInitialized && engine) {
    try {
      removeAudioEffect(id)
    } catch (error) {
      logger.error('Échec de suppression d\'effet du moteur audio', error, { effectId: id })
    }
  }
}

/**
 * Met à jour les paramètres d'un effet dans le moteur audio
 */
export async function updateEffectParametersInAudio(
  id: string,
  parameters: Record<string, number>,
  isInitialized: boolean,
  engine: PedalboardEngine | null,
  updateAudioParameters: (id: string, params: Record<string, number>) => Promise<void>
): Promise<void> {
  if (isInitialized && engine) {
    try {
      await updateAudioParameters(id, parameters)
    } catch (error) {
      logger.error('Échec de mise à jour des paramètres d\'effet', error, { effectId: id, parameters })
    }
  }
}

/**
 * Active/désactive un effet dans le moteur audio
 */
export function setEffectEnabledInAudio(
  id: string,
  enabled: boolean,
  isInitialized: boolean,
  engine: PedalboardEngine | null,
  setEffectEnabled: (id: string, enabled: boolean) => void
): void {
  if (isInitialized && engine) {
    try {
      setEffectEnabled(id, enabled)
    } catch (error) {
      logger.error('Échec de toggle bypass d\'effet', error, { effectId: id, enabled })
    }
  }
}

