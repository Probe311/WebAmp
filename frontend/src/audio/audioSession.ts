/**
 * Détenteur unique du moteur audio de l'application.
 *
 * Règle structurante : le moteur appartient à la session, pas aux fenêtres.
 * Aucun composant ne doit créer ni détruire un `PedalboardEngine` : un
 * démontage de fenêtre ne doit jamais couper le signal audio.
 *
 * Le module est volontairement sans React, pour être testable sans DOM.
 */

import { PedalboardEngine } from './PedalboardEngine'
import { DEFAULT_AUDIO_ROUTING, DEFAULT_SAMPLE_RATE } from '../config/constants'
import { getPreference } from '../utils/userPreferences'

let sharedEngine: PedalboardEngine | null = null
let engineCreations = 0

/**
 * Retourne le moteur partagé, en le créant au premier appel.
 * Idempotent : les appels suivants (et les doubles rendus de StrictMode)
 * renvoient la même instance.
 * Sample rate lu depuis les préférences au premier démarrage (coût : recreer = reload).
 */
export function getSharedEngine(): PedalboardEngine {
  if (!sharedEngine) {
    const preferred = getPreference('sampleRate')
    sharedEngine = new PedalboardEngine({
      sampleRate: preferred || DEFAULT_SAMPLE_RATE,
      routing: DEFAULT_AUDIO_ROUTING
    })
    engineCreations += 1
  }
  return sharedEngine
}

/** Moteur courant sans effet de bord de création (utile en télémétrie). */
export function peekSharedEngine(): PedalboardEngine | null {
  return sharedEngine
}

/** Nombre de moteurs réellement instanciés depuis le chargement de la page. */
export function getEngineCreationCount(): number {
  return engineCreations
}

/**
 * Détruit explicitement le moteur partagé.
 * Réservé aux tests et au remplacement à chaud : ce n'est jamais appelé par un
 * démontage de composant.
 */
export function resetSharedEngine(): void {
  sharedEngine?.dispose()
  sharedEngine = null
}
