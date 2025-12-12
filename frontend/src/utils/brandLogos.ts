// Import des logos SVG
import fenderLogo from '../assets/logos/fender.svg'
import marshallLogo from '../assets/logos/marshall.svg'
import orangeLogo from '../assets/logos/orange.svg'
import mesaBoogieLogo from '../assets/logos/mesa-boogie.svg'
import voxLogo from '../assets/logos/vox.svg'
import peaveyLogo from '../assets/logos/peavey.svg'
import walrusLogo from '../assets/logos/walrus.svg'

// Mapping des logos de marques
export const brandLogos: Record<string, string> = {
  'Fender': fenderLogo,
  'Marshall': marshallLogo,
  'Orange': orangeLogo,
  'Mesa Boogie': mesaBoogieLogo,
  'Vox': voxLogo,
  'Peavey': peaveyLogo,
  'Walrus': walrusLogo,
  'Walrus Audio': walrusLogo
}

// Fonction pour obtenir le chemin du logo
export function getBrandLogo(brand: string): string {
  return brandLogos[brand] || ''
}

