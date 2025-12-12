/**
 * Constantes de couleurs centralisées pour les pédales
 * Toutes les couleurs des pédales doivent passer par ces constantes
 */

/**
 * Calcule la luminosité relative d'une couleur hexadécimale
 * Retourne une valeur entre 0 (noir) et 1 (blanc)
 */
function getLuminance(hex: string): number {
  // Retirer le # si présent
  const cleanHex = hex.replace('#', '')
  
  // Convertir en RGB
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255
  
  // Appliquer la formule de luminosité relative (sRGB)
  const [rLinear, gLinear, bLinear] = [r, g, b].map(val => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear
}

/**
 * Détermine la couleur du texte optimale selon la couleur d'accent
 * Retourne '#ffffff' (blanc) pour les couleurs sombres, '#000000' (noir) pour les couleurs claires
 */
export function getContrastTextColor(accentColor: string): string {
  const luminance = getLuminance(accentColor)
  // Seuil de 0.5 : si la couleur est plus claire que ce seuil, utiliser du texte noir
  return luminance > 0.5 ? '#000000' : '#ffffff'
}

// Couleurs pour les états des boutons On/Off
export const PEDAL_BUTTON_COLORS = {
  // État actif (pédale activée)
  active: {
    backgroundColor: '#ffffff', // Blanc pour le fond du bouton actif (déprécié, utiliser accentColor)
    textColor: '#ffffff', // Blanc pour le texte/icône (déprécié, utiliser getContrastTextColor)
    borderColor: '', // Sera remplacé par accentColor de la pédale
  },
  // État bypassed (pédale désactivée)
  bypassed: {
    backgroundColor: '#f5f5f5', // Gris clair pour le fond du bouton désactivé
    textColor: '#444444', // Gris foncé pour le texte/icône désactivé
    borderColor: '#e5e5e5', // Gris clair pour la bordure désactivée
  },
} as const

// Couleurs pour le footswitch (bouton rond sur la pédale)
export const FOOTSWITCH_COLORS = {
  // État actif
  active: {
    backgroundColor: '#ffffff', // Blanc pour le fond du footswitch actif
    dotColor: '', // Sera remplacé par accentColor de la pédale
    borderColor: '', // Sera remplacé par accentColor de la pédale
  },
  // État bypassed
  bypassed: {
    backgroundColor: '#333333', // Gris foncé pour le fond du footswitch désactivé
    dotColor: '#666666', // Gris moyen pour le point intérieur désactivé
    borderColor: '', // Sera remplacé par accentColor de la pédale
  },
} as const

