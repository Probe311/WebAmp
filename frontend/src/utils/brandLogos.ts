// Import des logos SVG (normaux)
import fenderLogo from '../assets/logos/fender.svg'
import marshallLogo from '../assets/logos/marshall.svg'
import orangeLogo from '../assets/logos/orange.svg'
import mesaBoogieLogo from '../assets/logos/mesa-boogie.svg'
import voxLogo from '../assets/logos/vox.svg'
import peaveyLogo from '../assets/logos/peavey.svg'
import walrusLogo from '../assets/logos/walrus.svg'
import bossLogo from '../assets/logos/boss.svg'
import electroHarmonixLogo from '../assets/logos/electro-harmonix.svg'
import carvinLogo from '../assets/logos/carvin.svg'
import englLogo from '../assets/logos/engl.svg'
import gibsonLogo from '../assets/logos/gibson.svg'
import rolandLogo from '../assets/logos/roland.svg'
import soldanoLogo from '../assets/logos/soldano.svg'
import suproLogo from '../assets/logos/supro.svg'
import synergyLogo from '../assets/logos/synergy.svg'
import yamahaLogo from '../assets/logos/yamaha.svg'
import dunlopLogo from '../assets/logos/dunlop.svg'

// Import des logos SVG (small)
import bossSmallLogo from '../assets/logos/boss_small.svg'
import walrusSmallLogo from '../assets/logos/walrus_small.svg'

// Mapping des logos de marques (normaux)
export const brandLogos: Record<string, string> = {
  'Fender': fenderLogo,
  'Marshall': marshallLogo,
  'Orange': orangeLogo,
  'Mesa Boogie': mesaBoogieLogo,
  'Vox': voxLogo,
  'Peavey': peaveyLogo,
  'Walrus': walrusLogo,
  'Walrus Audio': walrusLogo,
  'BOSS': bossLogo,
  'Boss': bossLogo,
  'Electro-Harmonix': electroHarmonixLogo,
  'EHX': electroHarmonixLogo,
  'Carvin': carvinLogo,
  'ENGL': englLogo,
  'Engl': englLogo,
  'Gibson': gibsonLogo,
  'Roland': rolandLogo,
  'Soldano': soldanoLogo,
  'Supro': suproLogo,
  'Synergy': synergyLogo,
  'Yamaha': yamahaLogo,
  'Dunlop': dunlopLogo
}

// Mapping des logos de marques (small)
export const brandLogosSmall: Record<string, string> = {
  'BOSS': bossSmallLogo,
  'Boss': bossSmallLogo,
  'Walrus': walrusSmallLogo,
  'Walrus Audio': walrusSmallLogo
}

// Fonction pour obtenir le chemin du logo (normal)
export function getBrandLogo(brand: string): string {
  return brandLogos[brand] || ''
}

// Fonction pour obtenir le chemin du logo (small)
export function getBrandLogoSmall(brand: string): string {
  return brandLogosSmall[brand] || brandLogos[brand] || ''
}

// Fonction pour obtenir les deux logos (normal et small)
export function getBrandLogos(brand: string): { normal: string; small: string } {
  return {
    normal: brandLogos[brand] || '',
    small: brandLogosSmall[brand] || brandLogos[brand] || ''
  }
}

