/**
 * Hook pour gérer le PedalboardEngine avec Web Audio API
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { PedalboardEngine } from '../audio/PedalboardEngine'
import { pedalLibrary } from '../data/pedals'
import { Effect } from '../components/Pedalboard'

export interface UsePedalboardEngineOptions {
  autoStart?: boolean
  enableAudioInput?: boolean
}

export function usePedalboardEngine(options: UsePedalboardEngineOptions = {}) {
  const { autoStart = false, enableAudioInput = false } = options
  
  const engineRef = useRef<PedalboardEngine | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null)

  // Initialiser le moteur
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new PedalboardEngine({
        sampleRate: 44100,
        routing: 'serial'
      })
      setIsInitialized(true)
    }

    return () => {
      if (engineRef.current) {
        engineRef.current.dispose()
        engineRef.current = null
      }
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Démarrer/arrêter le moteur
  const start = useCallback(async () => {
    if (!engineRef.current) return

    try {
      await engineRef.current.start()
      setIsRunning(true)

      // Connecter l'entrée audio si demandé
      if (enableAudioInput) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        setAudioStream(stream)
        const audioCtx = engineRef.current.getAudioContext()
        if (!audioCtx) {
          return
        }
        const source = audioCtx.createMediaStreamSource(stream)
        source.connect(engineRef.current.getInput())
      }
    } catch (error) {
      // démarrage silencieux du moteur audio
    }
  }, [enableAudioInput])

  const stop = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop()
      setIsRunning(false)
    }
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      setAudioStream(null)
    }
  }, [audioStream])

  // Auto-start si demandé
  useEffect(() => {
    if (autoStart && isInitialized && !isRunning) {
      start()
    }
  }, [autoStart, isInitialized, isRunning, start])

  // Ajouter un effet
  const addEffect = useCallback(async (effect: Effect) => {
    if (!engineRef.current) return

    const pedalModel = pedalLibrary.find(p => p.id === effect.pedalId)
    if (!pedalModel) {
      return
    }

    try {
      // Utiliser l'effect.id comme clé dans le moteur (pas le pedalId)
      await engineRef.current.addEffect(pedalModel, effect.parameters, effect.id)
    } catch (error) {
      // échec silencieux d'ajout d'effet
    }
  }, [])

  // Supprimer un effet
  const removeEffect = useCallback((effectId: string) => {
    if (!engineRef.current) return

    // Trouver le pedalId depuis l'effectId
    // Note: Dans une vraie implémentation, on devrait stocker le mapping
    engineRef.current.removeEffect(effectId)
  }, [])

  // Mettre à jour les paramètres d'un effet
  const updateEffectParameters = useCallback(async (
    effectId: string,
    parameters: Record<string, number>
  ) => {
    if (!engineRef.current) return

    try {
      await engineRef.current.updateEffectParameters(effectId, parameters)
    } catch (error) {
      // échec silencieux de mise à jour des paramètres
    }
  }, [])

  // Activer/désactiver un effet
  const setEffectEnabled = useCallback((effectId: string, enabled: boolean) => {
    if (!engineRef.current) return
    engineRef.current.setEffectEnabled(effectId, enabled)
  }, [])

  // Charger une IR personnalisée
  const loadImpulseResponse = useCallback(async (
    effectId: string,
    irUrl: string
  ) => {
    if (!engineRef.current) return

    try {
      await engineRef.current.loadImpulseResponse(effectId, irUrl)
    } catch (error) {
      throw error
    }
  }, [])

  // Charger une IR depuis Freesound
  const loadImpulseResponseFromFreesound = useCallback(async (
    effectId: string,
    freesoundSoundId: number
  ) => {
    if (!engineRef.current) return

    try {
      await engineRef.current.loadImpulseResponseFromFreesound(effectId, freesoundSoundId)
    } catch (error) {
      throw error
    }
  }, [])

  return {
    engine: engineRef.current,
    audioContext: engineRef.current?.getAudioContext() || null,
    audioSource: engineRef.current?.getInput() || null,
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

