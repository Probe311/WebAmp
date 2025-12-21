/**
 * Fonction pour sauvegarder les logos SVG dans /assets/logos
 * 
 * Cette fonction DOIT être utilisée dans un script Node.js uniquement
 * (ex: scripts/export-brand-logos.ts)
 * 
 * @param brands Liste des marques avec leurs logos SVG
 * @param outputDir Répertoire de sortie (par défaut: frontend/src/assets/logos)
 */
import { generateLogoFilename } from './brandLogoUtils'
import { Brand } from '../services/admin'

// Types pour Node.js (à utiliser uniquement dans un script Node.js)
type NodeFS = typeof import('fs')
type NodePath = typeof import('path')

export interface BrandLogoData {
  name: string
  logoSvg?: string | null
  logoSvgSmall?: string | null
}

/**
 * Fonction pour sauvegarder les logos SVG dans /assets/logos
 * 
 * NOTE: Cette fonction nécessite fs et path de Node.js
 * Elle doit être utilisée uniquement dans un script Node.js
 * 
 * Exemple d'utilisation dans un script Node.js:
 * ```typescript
 * import * as fs from 'fs'
 * import * as path from 'path'
 * import { saveBrandLogosToFilesystem } from './utils/saveBrandLogos'
 * 
 * const brands = [...]
 * const outputDir = path.join(__dirname, '../frontend/src/assets/logos')
 * await saveBrandLogosToFilesystem(brands, outputDir, fs, path)
 * ```
 */
export async function saveBrandLogosToFilesystem(
  brands: BrandLogoData[],
  outputDir: string,
  fs: NodeFS,
  path: NodePath
): Promise<{ saved: number; errors: number }> {
  let saved = 0
  let errors = 0

  // Créer le répertoire s'il n'existe pas
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  for (const brand of brands) {
    try {
      // Sauvegarder le logo normal
      if (brand.logoSvg && brand.logoSvg.trim()) {
        const filename = generateLogoFilename(brand.name)
        const filePath = path.join(outputDir, filename)
        fs.writeFileSync(filePath, brand.logoSvg.trim(), 'utf-8')
        saved++
      }

      // Sauvegarder le logo petit
      if (brand.logoSvgSmall && brand.logoSvgSmall.trim()) {
        const filename = generateLogoFilename(brand.name, 'small')
        const filePath = path.join(outputDir, filename)
        fs.writeFileSync(filePath, brand.logoSvgSmall.trim(), 'utf-8')
        saved++
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde du logo pour ${brand.name}:`, error)
      errors++
    }
  }

  return { saved, errors }
}

