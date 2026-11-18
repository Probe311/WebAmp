export type PedalEngageStyle = 'glow' | 'led'
export type PedalLedSide = 'left' | 'right'
/** Forme du CTA pied — par marque */
export type PedalFootShape = 'round' | 'square' | 'rect'

export interface BrandPedalChrome {
  engageStyle: PedalEngageStyle
  ledSide: PedalLedSide
  footShape: PedalFootShape
}

function hashBrand(brand: string): number {
  let h = 0
  for (let i = 0; i < brand.length; i++) h = (h * 31 + brand.charCodeAt(i)) | 0
  return Math.abs(h)
}

/** Overrides explicites (sinon fallback hash pour variété LED L/R) */
const BRAND_CHROME: Record<string, BrandPedalChrome> = {
  // Glow — digital / Ultra
  WebAmp: { engageStyle: 'glow', ledSide: 'left', footShape: 'round' },
  Strymon: { engageStyle: 'glow', ledSide: 'left', footShape: 'square' },
  Eventide: { engageStyle: 'glow', ledSide: 'right', footShape: 'square' },
  Meris: { engageStyle: 'glow', ledSide: 'left', footShape: 'rect' },
  'Chase Bliss': { engageStyle: 'glow', ledSide: 'right', footShape: 'rect' },
  'Source Audio': { engageStyle: 'glow', ledSide: 'left', footShape: 'square' },
  Empress: { engageStyle: 'glow', ledSide: 'right', footShape: 'round' },
  'TC Electronic': { engageStyle: 'glow', ledSide: 'left', footShape: 'rect' },
  'Line 6': { engageStyle: 'glow', ledSide: 'right', footShape: 'rect' },
  'Universal Audio': { engageStyle: 'glow', ledSide: 'left', footShape: 'square' },

  // LED — Japanese / compact
  BOSS: { engageStyle: 'led', ledSide: 'left', footShape: 'round' },
  Ibanez: { engageStyle: 'led', ledSide: 'right', footShape: 'round' },
  Mooer: { engageStyle: 'led', ledSide: 'left', footShape: 'square' },
  Joyo: { engageStyle: 'led', ledSide: 'right', footShape: 'square' },
  Behringer: { engageStyle: 'led', ledSide: 'left', footShape: 'rect' },

  // LED — US classics
  Dunlop: { engageStyle: 'led', ledSide: 'right', footShape: 'round' },
  MXR: { engageStyle: 'led', ledSide: 'left', footShape: 'square' },
  'Way Huge': { engageStyle: 'led', ledSide: 'right', footShape: 'rect' },
  EVH: { engageStyle: 'led', ledSide: 'left', footShape: 'round' },
  'Electro-Harmonix': { engageStyle: 'led', ledSide: 'right', footShape: 'square' },
  Fulltone: { engageStyle: 'led', ledSide: 'left', footShape: 'rect' },
  'Pro Co': { engageStyle: 'led', ledSide: 'right', footShape: 'round' },
  Keeley: { engageStyle: 'led', ledSide: 'left', footShape: 'square' },

  // LED — boutique / art
  'Walrus Audio': { engageStyle: 'led', ledSide: 'left', footShape: 'square' },
  'EarthQuaker Devices': { engageStyle: 'led', ledSide: 'right', footShape: 'rect' },
  'Fairfield Circuitry': { engageStyle: 'led', ledSide: 'left', footShape: 'round' },
  'Old Blood Noise': { engageStyle: 'led', ledSide: 'right', footShape: 'square' },
  ZVEX: { engageStyle: 'led', ledSide: 'left', footShape: 'rect' },
  'Z.Vex': { engageStyle: 'led', ledSide: 'left', footShape: 'rect' },

  // LED — vintage / other
  DigiTech: { engageStyle: 'led', ledSide: 'right', footShape: 'rect' },
  Roland: { engageStyle: 'led', ledSide: 'left', footShape: 'square' },
  Marshall: { engageStyle: 'led', ledSide: 'right', footShape: 'round' },
  Vox: { engageStyle: 'led', ledSide: 'left', footShape: 'rect' },
  Morley: { engageStyle: 'led', ledSide: 'right', footShape: 'rect' },
  Leslie: { engageStyle: 'led', ledSide: 'left', footShape: 'round' },
  Moog: { engageStyle: 'led', ledSide: 'right', footShape: 'square' },
  Klon: { engageStyle: 'led', ledSide: 'left', footShape: 'round' },
  JHS: { engageStyle: 'led', ledSide: 'right', footShape: 'square' },
  'Red Panda': { engageStyle: 'led', ledSide: 'left', footShape: 'rect' },
  Neunaber: { engageStyle: 'glow', ledSide: 'right', footShape: 'round' },
}

/**
 * Chrome pied par marque (LED L/R ou glow + forme CTA).
 * Override possible via `model.ui.engageStyle` / `ledSide` / `footShape`.
 */
export function resolveBrandPedalChrome(brand: string): BrandPedalChrome {
  const known = BRAND_CHROME[brand]
  if (known) return known

  const h = hashBrand(brand)
  const shapes: PedalFootShape[] = ['round', 'square', 'rect']
  return {
    engageStyle: h % 3 === 0 ? 'glow' : 'led',
    ledSide: h % 2 === 0 ? 'left' : 'right',
    footShape: shapes[h % 3],
  }
}
