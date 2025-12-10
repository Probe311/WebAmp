/**
 * Utilitaires pour les nombres
 */

/**
 * Clamp une valeur entre min et max
 */
export function clamp(value: number, min: number = 0, max: number = 100): number {
  return Math.min(max, Math.max(min, value))
}

