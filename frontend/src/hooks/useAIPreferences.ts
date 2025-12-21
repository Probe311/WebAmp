import { useState, useEffect, useCallback } from 'react'
import { learnUserPreferences, getPersonalizedRecommendations, UserUsageHistory, LearnedPreferences } from '../services/aiPreferences'
import { useAuth } from './useAuth'

const STORAGE_KEY_PREFIX = 'webamp-ai-'

/**
 * Hook pour gérer l'apprentissage des préférences utilisateur via IA
 */
export function useAIPreferences() {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<LearnedPreferences | null>(null)
  const [isLearning, setIsLearning] = useState(false)

  /**
   * Récupère l'historique d'utilisation depuis localStorage
   */
  const getUsageHistory = useCallback((): UserUsageHistory => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}usage-history`)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Erreur lecture historique:', error)
    }

    return {
      presetIds: [],
      pedalIds: [],
      amplifierIds: [],
      genres: [],
      artists: [],
      moods: [],
      instruments: [],
      timeSpent: {},
      lastUsed: {},
    }
  }, [])

  /**
   * Sauvegarde l'historique d'utilisation
   */
  const saveUsageHistory = useCallback((history: UserUsageHistory) => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}usage-history`, JSON.stringify(history))
    } catch (error) {
      console.error('Erreur sauvegarde historique:', error)
    }
  }, [])

  /**
   * Enregistre l'utilisation d'un preset
   */
  const trackPresetUsage = useCallback((presetId: string, genre?: string, artist?: string, mood?: string) => {
    const history = getUsageHistory()
    
    if (!history.presetIds.includes(presetId)) {
      history.presetIds.push(presetId)
    }
    
    if (genre && !history.genres.includes(genre)) {
      history.genres.push(genre)
    }
    
    if (artist && !history.artists.includes(artist)) {
      history.artists.push(artist)
    }
    
    if (mood && !history.moods.includes(mood)) {
      history.moods.push(mood)
    }

    history.lastUsed[presetId] = new Date().toISOString()
    saveUsageHistory(history)
  }, [getUsageHistory, saveUsageHistory])

  /**
   * Enregistre l'utilisation d'une pédale
   */
  const trackPedalUsage = useCallback((pedalId: string) => {
    const history = getUsageHistory()
    
    if (!history.pedalIds.includes(pedalId)) {
      history.pedalIds.push(pedalId)
    }
    
    saveUsageHistory(history)
  }, [getUsageHistory, saveUsageHistory])

  /**
   * Enregistre l'utilisation d'un ampli
   */
  const trackAmplifierUsage = useCallback((amplifierId: string) => {
    const history = getUsageHistory()
    
    if (!history.amplifierIds.includes(amplifierId)) {
      history.amplifierIds.push(amplifierId)
    }
    
    saveUsageHistory(history)
  }, [getUsageHistory, saveUsageHistory])

  /**
   * Enregistre le temps passé sur un preset
   */
  const trackTimeSpent = useCallback((presetId: string, minutes: number) => {
    const history = getUsageHistory()
    history.timeSpent[presetId] = (history.timeSpent[presetId] || 0) + minutes
    saveUsageHistory(history)
  }, [getUsageHistory, saveUsageHistory])

  /**
   * Apprend les préférences à partir de l'historique
   */
  const learnPreferences = useCallback(async () => {
    if (!user?.id) return

    const history = getUsageHistory()
    
    // Nécessite au moins quelques données pour apprendre
    if (history.presetIds.length === 0 && history.pedalIds.length === 0) {
      return
    }

    setIsLearning(true)
    try {
      const learned = await learnUserPreferences(user.id, history)
      setPreferences(learned)
      
      // Sauvegarder les préférences apprises
      try {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}learned-preferences`, JSON.stringify(learned))
      } catch (error) {
        console.error('Erreur sauvegarde préférences:', error)
      }
    } catch (error) {
      console.error('Erreur apprentissage préférences:', error)
    } finally {
      setIsLearning(false)
    }
  }, [user?.id, getUsageHistory])

  /**
   * Charge les préférences apprises depuis localStorage
   */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}learned-preferences`)
      if (stored) {
        setPreferences(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Erreur chargement préférences:', error)
    }
  }, [])

  /**
   * Apprend automatiquement les préférences après un certain nombre d'utilisations
   */
  useEffect(() => {
    if (!user?.id) return

    const history = getUsageHistory()
    const totalUsage = history.presetIds.length + history.pedalIds.length
    
    // Apprendre après 10 utilisations minimum
    if (totalUsage >= 10 && !preferences) {
      learnPreferences()
    }
  }, [user?.id, preferences, getUsageHistory, learnPreferences])

  return {
    preferences,
    isLearning,
    learnPreferences,
    trackPresetUsage,
    trackPedalUsage,
    trackAmplifierUsage,
    trackTimeSpent,
    getUsageHistory,
  }
}


