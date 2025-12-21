/**
 * Utilitaires pour gérer les logos SVG des marques
 */

/**
 * Génère un nom de fichier à partir du nom de la marque
 * @param brandName Nom de la marque
 * @param suffix Suffixe optionnel (ex: "_small")
 * @returns Nom de fichier normalisé (ex: "fender.svg" ou "fender_small.svg")
 */
export function generateLogoFilename(brandName: string, suffix: string = ''): string {
  // Normaliser le nom: minuscules, remplacer les espaces et caractères spéciaux par des tirets
  const normalized = brandName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  
  const suffixPart = suffix ? `_${suffix.replace(/[^a-z0-9]/g, '')}` : ''
  return `${normalized}${suffixPart}.svg`
}

/**
 * Génère le chemin complet du logo dans /assets/logos
 * @param brandName Nom de la marque
 * @param suffix Suffixe optionnel
 * @returns Chemin relatif (ex: "/assets/logos/fender.svg")
 */
export function getLogoPath(brandName: string, suffix: string = ''): string {
  const filename = generateLogoFilename(brandName, suffix)
  return `/assets/logos/${filename}`
}

/**
 * Valide le contenu SVG
 * @param svgContent Contenu SVG à valider
 * @returns true si le contenu semble être du SVG valide
 */
export function isValidSVG(svgContent: string): boolean {
  if (!svgContent || !svgContent.trim()) {
    return false
  }
  
  // Vérifier que c'est du SVG (commence par <svg ou contient <svg)
  const trimmed = svgContent.trim()
  return trimmed.startsWith('<svg') || trimmed.includes('<svg')
}

/**
 * Nettoie le contenu SVG (supprime les espaces superflus)
 * @param svgContent Contenu SVG à nettoyer
 * @returns SVG nettoyé
 */
export function cleanSVG(svgContent: string): string {
  return svgContent.trim()
}

/**
 * Convertit le contenu SVG en data URI
 * @param svgContent Contenu SVG
 * @returns Data URI
 */
export function svgToDataURI(svgContent: string): string {
  const cleaned = cleanSVG(svgContent)
  const encoded = encodeURIComponent(cleaned)
  return `data:image/svg+xml;charset=utf-8,${encoded}`
}

