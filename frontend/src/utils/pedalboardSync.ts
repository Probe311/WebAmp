// Fonctions utilitaires pour synchroniser les effets avec le moteur audio

import { Effect } from '../components/Pedalboard'
import { WebSocketClient } from '../services/websocket'

/**
 * Synchronise un effet avec le moteur audio
 */
export async function syncEffectToAudio(
  effect: Effect,
  isInitialized: boolean,
  engine: any,
  addAudioEffect: (effect: Effect) => Promise<void>
): Promise<void> {
  if (isInitialized && engine) {
    try {
      await addAudioEffect(effect)
    } catch (error) {
      console.error('Erreur ajout effet audio:', error)
    }
  }
}

/**
 * Synchronise un effet avec WebSocket
 */
export function syncEffectToWebSocket(
  message: any,
  requireAck: boolean = false
): Promise<any> {
  const ws = WebSocketClient.getInstance()
  if (ws.isConnected()) {
    return ws.send(message, requireAck).catch((error) => {
      console.error('Erreur WebSocket:', error)
      throw error
    })
  }
  return Promise.resolve()
}

/**
 * Supprime un effet du moteur audio
 */
export function removeEffectFromAudio(
  id: string,
  isInitialized: boolean,
  engine: any,
  removeAudioEffect: (id: string) => void
): void {
  if (isInitialized && engine) {
    try {
      removeAudioEffect(id)
    } catch (error) {
      console.error('Erreur suppression effet audio:', error)
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
  engine: any,
  updateAudioParameters: (id: string, params: Record<string, number>) => Promise<void>
): Promise<void> {
  if (isInitialized && engine) {
    try {
      await updateAudioParameters(id, parameters)
    } catch (error) {
      console.error('Erreur mise à jour paramètres audio:', error)
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
  engine: any,
  setEffectEnabled: (id: string, enabled: boolean) => void
): void {
  if (isInitialized && engine) {
    try {
      setEffectEnabled(id, enabled)
    } catch (error) {
      console.error('Erreur toggle bypass audio:', error)
    }
  }
}

