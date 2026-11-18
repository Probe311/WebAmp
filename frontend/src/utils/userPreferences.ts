/**
 * Gestion des préférences utilisateur stockées dans localStorage
 */

const STORAGE_KEY_PREFIX = 'webamp-'

export interface UserPreferences {
  showThankYouMessage: boolean
  audioDeviceId: string
  sampleRate: number
  bufferSize: number
}

const DEFAULT_PREFERENCES: UserPreferences = {
  showThankYouMessage: true,
  audioDeviceId: 'default',
  sampleRate: 44100,
  bufferSize: 128,
}

/**
 * Récupère toutes les préférences utilisateur
 */
export function getUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}preferences`)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_PREFERENCES, ...parsed }
    }
  } catch {
    /* lecture silencieuse */
  }
  return { ...DEFAULT_PREFERENCES }
}

/**
 * Sauvegarde toutes les préférences utilisateur
 */
export function saveUserPreferences(preferences: Partial<UserPreferences>): void {
  try {
    const current = getUserPreferences()
    const updated = { ...current, ...preferences }
    localStorage.setItem(`${STORAGE_KEY_PREFIX}preferences`, JSON.stringify(updated))
  } catch {
    /* écriture silencieuse */
  }
}

export function getPreference<K extends keyof UserPreferences>(key: K): UserPreferences[K] {
  return getUserPreferences()[key]
}

export function setPreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): void {
  saveUserPreferences({ [key]: value })
}
