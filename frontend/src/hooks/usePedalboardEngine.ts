/**
 * Accès au moteur audio de la session pour les composants.
 *
 * Ce hook ne crée plus de `PedalboardEngine` : il consomme le moteur unique
 * exposé par `AudioSessionProvider`. L'API publique et la forme du retour sont
 * inchangées, donc les appelants (Pedalboard, Tuner, Metronome, Looper) n'ont
 * pas à être modifiés.
 *
 * Important : plus aucun `dispose()` au démontage. Fermer une fenêtre ne doit
 * pas arrêter le signal ; la destruction du moteur est explicite
 * (`resetSharedEngine`).
 */

import { useEffect, useState, useCallback } from 'react'
import { useAudioSession } from '../audio/AudioSessionContext'
import { pedalLibrary } from '../data/pedals'
import type { Effect } from '../audio/types'
import { createLogger } from '../services/logger'
import { getPreference } from '../utils/userPreferences'

const logger = createLogger('usePedalboardEngine')

export interface UsePedalboardEngineOptions {
  autoStart?: boolean
  enableAudioInput?: boolean
}

export function usePedalboardEngine(options: UsePedalboardEngineOptions = {}) {
  const { autoStart = false, enableAudioInput = false } = options
  const { engine } = useAudioSession()

  const [isRunning, setIsRunning] = useState(false)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

  // Le moteur existe dès le montage du provider : la session est initialisée.
  const isInitialized = true

  // Nettoyer le stream micro au démontage (le moteur, lui, reste vivant)
  useEffect(() => {
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [audioStream])

  const start = useCallback(async () => {
    try {
      await engine.start()
      setIsRunning(true)

      if (enableAudioInput) {
        const deviceId = getPreference('audioDeviceId')
        const audio =
          deviceId && deviceId !== 'default'
            ? ({ deviceId: { exact: deviceId } } satisfies MediaTrackConstraints)
            : true
        const stream = await navigator.mediaDevices.getUserMedia({ audio })
        setAudioStream(stream)
        const audioCtx = engine.getAudioContext()
        if (!audioCtx) {
          return
        }
        const source = audioCtx.createMediaStreamSource(stream)
        source.connect(engine.getInput())
      }
    } catch (error) {
      logger.error('Échec du démarrage du moteur audio', error, { enableAudioInput })
    }
  }, [engine, enableAudioInput])

  const stop = useCallback(() => {
    engine.stop()
    setIsRunning(false)
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      setAudioStream(null)
    }
  }, [engine, audioStream])

  useEffect(() => {
    if (autoStart && !isRunning) {
      start()
    }
  }, [autoStart, isRunning, start])

  const addEffect = useCallback(async (effect: Effect) => {
    const pedalModel = pedalLibrary.find(p => p.id === effect.pedalId)
    if (!pedalModel) {
      return
    }

    try {
      await engine.addEffect(pedalModel, effect.parameters, effect.id)
    } catch (error) {
      logger.error('Échec d\'ajout d\'effet', error, { effectId: effect.id, pedalId: effect.pedalId })
    }
  }, [engine])

  const removeEffect = useCallback((effectId: string) => {
    engine.removeEffect(effectId)
  }, [engine])

  const updateEffectParameters = useCallback(async (
    effectId: string,
    parameters: Record<string, number>
  ) => {
    try {
      await engine.updateEffectParameters(effectId, parameters)
    } catch (error) {
      logger.error('Échec de mise à jour des paramètres d\'effet', error, { effectId, parameters })
    }
  }, [engine])

  const setEffectEnabled = useCallback((effectId: string, enabled: boolean) => {
    engine.setEffectEnabled(effectId, enabled)
  }, [engine])

  const loadImpulseResponse = useCallback(async (effectId: string, irUrl: string) => {
    await engine.loadImpulseResponse(effectId, irUrl)
  }, [engine])

  const loadImpulseResponseFromFreesound = useCallback(async (
    effectId: string,
    freesoundSoundId: number
  ) => {
    await engine.loadImpulseResponseFromFreesound(effectId, freesoundSoundId)
  }, [engine])

  return {
    engine,
    audioContext: engine.getAudioContext() || null,
    audioSource: engine.getAudioContext() ? engine.getInput() : null,
    isInitialized,
    isRunning,
    start,
    stop,
    addEffect,
    removeEffect,
    updateEffectParameters,
    setEffectEnabled,
    loadImpulseResponse,
    loadImpulseResponseFromFreesound
  }
}
