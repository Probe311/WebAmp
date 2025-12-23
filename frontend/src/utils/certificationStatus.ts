// Import des logos
import walrusSmallLogo from '../assets/logos/walrus_small.svg'
import walrusLogo from '../assets/logos/walrus.svg'
import bossSmallLogo from '../assets/logos/boss_small.svg'
import bossLogo from '../assets/logos/boss.svg'
import electroHarmonixSmallLogo from '../assets/logos/electro-harmonix_small.svg'
import electroHarmonixLogo from '../assets/logos/electro-harmonix.svg'

/**
 * Statuts de certification matériel
 * Seule la certification verte (certified) est disponible
 */
export type CertificationStatus = 'certified'

/**
 * Configuration des certifications par marque
 */
export interface BrandCertification {
  status: CertificationStatus
  smallLogo: string
  fullLogo: string
}

/**
 * Mapping des certifications par nom de marque
 * Seules les marques certifiées (vert) sont incluses
 */
export const brandCertifications: Record<string, BrandCertification> = {
  'Walrus Audio': {
    status: 'certified',
    smallLogo: walrusSmallLogo,
    fullLogo: walrusLogo
  }
}

/**
 * Vérifie si une marque est certifiée
 */
export function isBrandCertified(brand: string): boolean {
  const certification = brandCertifications[brand]
  return certification?.status === 'certified'
}

/**
 * Vérifie si une marque est en cours de certification
 * @deprecated Le statut 'pending' n'existe plus. Utiliser isBrandCertified à la place.
 */
export function isBrandPending(brand: string): boolean {
  return false
}

/**
 * Obtient le statut de certification d'une marque
 */
export function getCertificationStatus(brand: string): CertificationStatus | null {
  return brandCertifications[brand]?.status || null
}

/**
 * Obtient le logo small d'une marque certifiée ou en cours
 */
export function getCertifiedBrandSmallLogo(brand: string): string | null {
  const certification = brandCertifications[brand]
  return certification?.smallLogo || null
}

/**
 * Obtient le logo complet d'une marque certifiée ou en cours
 */
export function getCertifiedBrandFullLogo(brand: string): string | null {
  const certification = brandCertifications[brand]
  return certification?.fullLogo || null
}

/**
 * Vérifie si une marque a un statut de certification (certifiée ou en cours)
 */
export function hasCertificationStatus(brand: string): boolean {
  return brand in brandCertifications
}

/**
 * Ajoute ou met à jour la certification d'une marque
 * @param brand Nom de la marque
 * @param smallLogo URL ou chemin du logo small
 * @param fullLogo URL ou chemin du logo complet
 */
export function setBrandCertification(brand: string, smallLogo: string, fullLogo: string): void {
  brandCertifications[brand] = {
    status: 'certified',
    smallLogo,
    fullLogo
  }
}

/**
 * Supprime la certification d'une marque
 * @param brand Nom de la marque
 */
export function removeBrandCertification(brand: string): void {
  delete brandCertifications[brand]
}

