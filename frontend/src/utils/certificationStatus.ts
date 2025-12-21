// Import des logos
import walrusSmallLogo from '../assets/logos/walrus_small.svg'
import walrusLogo from '../assets/logos/walrus.svg'
import bossSmallLogo from '../assets/logos/boss_small.svg'
import bossLogo from '../assets/logos/boss.svg'
import electroHarmonixSmallLogo from '../assets/logos/electro-harmonix_small.svg'
import electroHarmonixLogo from '../assets/logos/electro-harmonix.svg'

/**
 * Statuts de certification matériel
 */
export type CertificationStatus = 'certified' | 'pending'

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
 */
export const brandCertifications: Record<string, BrandCertification> = {
  'Walrus Audio': {
    status: 'certified',
    smallLogo: walrusSmallLogo,
    fullLogo: walrusLogo
  },
  'BOSS': {
    status: 'pending',
    smallLogo: bossSmallLogo,
    fullLogo: bossLogo
  },
  'Electro-Harmonix': {
    status: 'pending',
    smallLogo: electroHarmonixSmallLogo,
    fullLogo: electroHarmonixLogo
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
 */
export function isBrandPending(brand: string): boolean {
  const certification = brandCertifications[brand]
  return certification?.status === 'pending'
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

