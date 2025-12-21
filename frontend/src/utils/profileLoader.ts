// Fonction utilitaire pour charger un profil de rock star
import { rockStarProfiles } from '../data/rockStarProfiles'
import { findAmplifierId, findPedalId } from './profileMapper'
import { PROFILE_STATE_UPDATE_DELAY, PROFILE_PEDAL_ADD_DELAY } from '../config/constants'

export interface ProfileLoadResult {
  amplifierId: string | null
  pedalIds: string[]
}

export interface LoadableProfile {
  amplifierId?: string | null
  amplifierParameters?: Record<string, number>
  pedalIds: string[]
  name?: string
}

/**
 * Charge un profil de manière séquentielle
 */
export async function loadProfileSequentially(
  profile: LoadableProfile,
  clearEffects: () => void,
  setAmplifier: (id: string | null) => void,
  setAmplifierParameters: (params: Record<string, number>) => void,
  addEffect: (pedalId: string) => void
): Promise<void> {
  // Vider le pedalboard
  clearEffects()

  // Sélectionner l'ampli
  if (profile.amplifierId) {
    setAmplifier(profile.amplifierId)
    if (profile.amplifierParameters) {
      setAmplifierParameters(profile.amplifierParameters)
    }
  }

  // Attendre que le state soit mis à jour
  await new Promise(resolve => setTimeout(resolve, PROFILE_STATE_UPDATE_DELAY))

  // Ajouter les effets séquentiellement
  if (profile.pedalIds && profile.pedalIds.length > 0) {
    for (let i = 0; i < profile.pedalIds.length; i++) {
      const pedalId = profile.pedalIds[i]
      addEffect(pedalId)
      // Attendre entre chaque pédale pour laisser le state se mettre à jour
      if (i < profile.pedalIds.length - 1) {
        await new Promise(resolve => setTimeout(resolve, PROFILE_PEDAL_ADD_DELAY))
      }
    }
  }
}

export function loadProfile(profileName: string): ProfileLoadResult | null {
  const profile = rockStarProfiles.find(p => p.name === profileName)
  if (!profile) {
    return null
  }

  // Trouver le premier ampli disponible
  let amplifierId: string | null = null
  for (const ampName of profile.amps) {
    const id = findAmplifierId(ampName)
    if (id) {
      amplifierId = id
      break
    }
  }

  // Trouver toutes les pédales disponibles
  const pedalIds: string[] = []
  for (const pedalName of profile.pedals) {
    const id = findPedalId(pedalName)
    if (id) {
      pedalIds.push(id)
    }
  }

  return {
    amplifierId,
    pedalIds
  }
}

