// Fonction utilitaire pour charger un profil de rock star
import { rockStarProfiles } from '../data/rockStarProfiles'
import { findAmplifierId, findPedalId } from './profileMapper'

export interface ProfileLoadResult {
  amplifierId: string | null
  pedalIds: string[]
}

export function loadProfile(profileName: string): ProfileLoadResult | null {
  const profile = rockStarProfiles.find(p => p.name === profileName)
  if (!profile) {
    console.error(`Profil non trouvé: ${profileName}`)
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

