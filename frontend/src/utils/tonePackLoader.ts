/**
 * Utilitaire pour charger un Tone Pack sur le pedalboard
 * Convertit un TonePack en format LoadableProfile pour utilisation avec loadProfileSequentially
 */
import { TonePack, TonePackEffect } from '../types/gallery'
import { LoadableProfile } from './profileLoader'
import { pedalLibrary } from '../data/pedals'
import { amplifierLibrary } from '../data/amplifiers'

/**
 * Convertit un TonePackEffect en pedalId
 * Recherche la pédale correspondante dans la bibliothèque
 */
function findPedalIdFromEffect(effect: TonePackEffect): string | null {
  // Essayer de trouver par ID exact
  const byId = pedalLibrary.find(p => p.id === effect.id)
  if (byId) return byId.id

  // Essayer de trouver par nom
  const byName = pedalLibrary.find(p => 
    p.model.toLowerCase().includes(effect.name.toLowerCase()) ||
    `${p.brand} ${p.model}`.toLowerCase().includes(effect.name.toLowerCase())
  )
  if (byName) return byName.id

  // Essayer de trouver par type
  const byType = pedalLibrary.find(p => p.type === effect.type)
  if (byType) return byType.id

  return null
}

/**
 * Trouve l'ampli depuis les métadonnées du TonePack
 */
function findAmplifierIdFromPack(pack: TonePack): string | null {
  // Chercher dans les métadonnées
  if (pack.metadata?.artist) {
    // Pour l'instant, on retourne null - l'ampli sera géré séparément
    // TODO: Implémenter la recherche d'ampli basée sur les métadonnées
  }

  // Chercher un ampli par défaut si aucun n'est spécifié
  return amplifierLibrary.length > 0 ? amplifierLibrary[0].id : null
}

/**
 * Convertit un TonePack en LoadableProfile
 */
export function tonePackToLoadableProfile(pack: TonePack): LoadableProfile {
  // Trier les effets par position
  const sortedEffects = [...pack.chain].sort((a, b) => a.position - b.position)

  // Convertir les effets en pedalIds
  const pedalIds: string[] = []
  for (const effect of sortedEffects) {
    if (!effect.enabled) continue // Ignorer les effets désactivés
    
    const pedalId = findPedalIdFromEffect(effect)
    if (pedalId) {
      pedalIds.push(pedalId)
    }
  }

  // Trouver l'ampli (pour l'instant, on utilise le premier disponible)
  const amplifierId = findAmplifierIdFromPack(pack)

  return {
    amplifierId,
    pedalIds,
    name: pack.name
  }
}

/**
 * Charge un TonePack sur le pedalboard
 * Utilise loadProfileSequentially pour appliquer les effets
 */
export async function loadTonePackSequentially(
  pack: TonePack,
  clearEffects: () => void,
  setAmplifier: (id: string | null) => void,
  setAmplifierParameters: (params: Record<string, number>) => void,
  addEffect: (pedalId: string) => void,
  updateEffectParameters?: (effectId: string, parameters: Record<string, number>) => void
): Promise<void> {
  const profile = tonePackToLoadableProfile(pack)

  // Vider le pedalboard
  clearEffects()

  // Sélectionner l'ampli
  if (profile.amplifierId) {
    setAmplifier(profile.amplifierId)
  }

  // Attendre que le state soit mis à jour
  await new Promise(resolve => setTimeout(resolve, 300))

  // Créer un mapping des effets pour récupérer les paramètres
  const effectMap = new Map<string, TonePackEffect>()
  pack.chain.forEach(effect => {
    const pedalId = findPedalIdFromEffect(effect)
    if (pedalId) {
      effectMap.set(pedalId, effect)
    }
  })

  // Ajouter les effets séquentiellement avec leurs paramètres
  if (profile.pedalIds && profile.pedalIds.length > 0) {
    for (let i = 0; i < profile.pedalIds.length; i++) {
      const pedalId = profile.pedalIds[i]
      addEffect(pedalId)

      // Si on a une fonction pour mettre à jour les paramètres, l'utiliser
      if (updateEffectParameters) {
        const effect = effectMap.get(pedalId)
        if (effect && effect.parameters) {
          // Convertir les paramètres en Record<string, number>
          const parameters: Record<string, number> = {}
          Object.entries(effect.parameters).forEach(([key, value]) => {
            if (typeof value === 'number') {
              parameters[key] = value
            } else if (typeof value === 'string') {
              const numValue = Number(value)
              if (!isNaN(numValue)) {
                parameters[key] = numValue
              }
            } else if (typeof value === 'boolean') {
              parameters[key] = value ? 1 : 0
            }
          })

          // Attendre un peu pour que l'effet soit créé, puis mettre à jour les paramètres
          setTimeout(() => {
            // Trouver l'ID de l'effet créé (on utilise un pattern basé sur le pedalId)
            // Note: Dans une vraie implémentation, on devrait avoir un callback ou un système d'événements
            // Pour l'instant, on utilise un délai fixe
            const effectId = `effect-${pedalId}-${Date.now()}`
            updateEffectParameters(effectId, parameters)
          }, 200)
        }
      }

      // Attendre entre chaque pédale
      if (i < profile.pedalIds.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 150))
      }
    }
  }
}

