/**
 * Gestion des préférences utilisateur stockées dans localStorage
 */

const STORAGE_KEY_PREFIX = 'webamp-'

export interface UserPreferences {
  showThankYouMessage: boolean
}

const DEFAULT_PREFERENCES: UserPreferences = {
  showThankYouMessage: true // Par défaut, afficher le message
}

/**
 * Récupère toutes les préférences utilisateur
 */
export function getUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}preferences`)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Fusionner avec les valeurs par défaut pour gérer les nouvelles préférences
      return { ...DEFAULT_PREFERENCES, ...parsed }
    }
  } catch (error) {
    // lecture silencieuse des préférences
  }
  return DEFAULT_PREFERENCES
}

/**
 * Sauvegarde toutes les préférences utilisateur
 */
export function saveUserPreferences(preferences: Partial<UserPreferences>): void {
  try {
    const current = getUserPreferences()
    const updated = { ...current, ...preferences }
    localStorage.setItem(`${STORAGE_KEY_PREFIX}preferences`, JSON.stringify(updated))
  } catch (error) {
    // écriture silencieuse des préférences
  }
}

/**
 * Récupère une préférence spécifique
 */
export function getPreference<K extends keyof UserPreferences>(
  key: K
): UserPreferences[K] {
  const preferences = getUserPreferences()
  return preferences[key]
}

/**
 * Sauvegarde une préférence spécifique
 */
export function setPreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  saveUserPreferences({ [key]: value })
}

