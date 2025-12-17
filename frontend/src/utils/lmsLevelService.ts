/**
 * Service centralisé pour la courbe de niveau (XP → niveau).
 * 
 * Actuellement :
 * - Niveau 1 : 0 – 999 XP
 * - Niveau 2 : 1 000 – 1 999 XP
 * - ...
 * 
 * La formule est simple mais centralisée pour pouvoir évoluer sans casser l’UI.
 */
export function getLevelFromXP(totalXP: number): number {
  const xpPerLevel = 1000
  if (totalXP <= 0) return 1
  return Math.floor(totalXP / xpPerLevel) + 1
}


