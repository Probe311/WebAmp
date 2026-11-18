/**
 * Point d'entrée du module de specs.
 *
 * Fusionne les lots de recherche, du plus ancien au plus récent. Les lots sont
 * des modules feuilles (types + URLs partagés), donc aucune dépendance
 * circulaire : seul ce fichier connaît l'ensemble des lots.
 */
import type { PedalResearch } from './types'
import { PEDAL_RESEARCH_L3 } from './research'
import { PEDAL_RESEARCH_L4 } from './research-l4'
import { PEDAL_RESEARCH_L5 } from './research-l5'

export type { PedalResearch }

/** Lots L1–L3 (drive, modulation) + L4 (delays, reverbs) + L5 (EQ, wah, volume). */
export const PEDAL_RESEARCH: Record<string, PedalResearch> = {
  ...PEDAL_RESEARCH_L3,
  ...PEDAL_RESEARCH_L4,
  ...PEDAL_RESEARCH_L5,
}

export const PEDAL_RESEARCH_COUNT = Object.keys(PEDAL_RESEARCH).length

/** Fiches dont l'URL est déduite ou approximative (voir `urlDoubt`). */
export const PEDAL_RESEARCH_DOUBTS = Object.entries(PEDAL_RESEARCH)
  .filter(([, research]) => research.urlDoubt)
  .map(([id, research]) => ({ id, url: research.url, doubt: research.urlDoubt as string }))
