/**
 * Marque blanche : nomenclature WebAmp + libellés de gamme.
 *
 * Marques licenciées (Walrus) et maison (WebAmp) gardent leurs noms réels.
 * Les autres : jamais affichées — conservées en `sourceName` pour la recherche.
 */
import type { PedalModel } from '../data/pedals'
import type { AmplifierModel } from '../data/amplifiers'

/** Libellé de gamme par type de pédale. */
export const PEDAL_LINES: Record<string, string> = {
  overdrive: 'OVER DRIVE',
  distortion: 'DISTORTION',
  fuzz: 'FUZZ',
  chorus: 'CHORUS',
  delay: 'DELAY',
  reverb: 'REVERB',
  flanger: 'FLANGER',
  tremolo: 'TREMOLO',
  phaser: 'PHASER',
  eq: 'EQUALIZER',
  wah: 'WAH',
  boost: 'BOOST',
  compressor: 'COMPRESSOR',
  octaver: 'OCTAVE',
  pitch: 'PITCH',
  rotary: 'ROTARY',
  volume: 'VOLUME',
  noisegate: 'NOISE GATE',
  multifx: 'MULTI FX',
  vibe: 'UNI-VIBE',
  ringmod: 'RING MOD',
  bitcrusher: 'BITCRUSH',
  lofi: 'LO-FI',
  tapedelay: 'TAPE ECHO',
  springreverb: 'SPRING',
  shimmerreverb: 'SHIMMER',
  tuner: 'TUNER',
}

/** Code produit par type de pédale. */
export const PEDAL_CODES: Record<string, string> = {
  overdrive: 'OD',
  distortion: 'DS',
  fuzz: 'FZ',
  chorus: 'CH',
  delay: 'DL',
  reverb: 'RV',
  flanger: 'FL',
  tremolo: 'TR',
  phaser: 'PH',
  eq: 'EQ',
  wah: 'WH',
  boost: 'BS',
  compressor: 'CP',
  octaver: 'OC',
  pitch: 'PT',
  rotary: 'RT',
  volume: 'VL',
  noisegate: 'NG',
  multifx: 'MX',
  vibe: 'VB',
  ringmod: 'RM',
  bitcrusher: 'BC',
  lofi: 'LF',
  tapedelay: 'TE',
  springreverb: 'SP',
  shimmerreverb: 'SH',
  tuner: 'TU',
}

export interface WhiteLabel {
  brandName: string
  modelName: string
  subtitle: string
  sourceName: string
}

/** Marques avec autorisation d'affichage du nom réel. */
export const LICENSED_BRANDS = ['Walrus Audio'] as const

/** Marques maison (catalogue WebAmp). */
export const HOUSE_BRANDS = ['WebAmp', 'Webamp Classic', 'WebAmp Studio'] as const

export function isLicensedBrand(brand: string): boolean {
  return (LICENSED_BRANDS as readonly string[]).includes(brand)
}

export function isHouseBrand(brand: string): boolean {
  return (HOUSE_BRANDS as readonly string[]).includes(brand)
}

/** Afficher le nom catalogue tel quel (licencié ou maison). */
export function keepsRealName(brand: string): boolean {
  return isLicensedBrand(brand) || isHouseBrand(brand)
}

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Identité en marque blanche d'une pédale (toujours renommée). */
export function whiteLabelForPedal(model: PedalModel, indexInType: number): WhiteLabel {
  const line = PEDAL_LINES[model.type] ?? 'EFFECT'
  const code = PEDAL_CODES[model.type] ?? 'FX'
  const n = indexInType + 1
  return {
    brandName: 'WebAmp Studio',
    modelName: `${line} ${code}-${n}`,
    subtitle: `WA-${code}${pad2(n)} · SERIES`,
    sourceName: `${model.brand} ${model.model}`,
  }
}

/** Série d'ampli selon archétype (nom de gamme, pas de marque réelle). */
const AMP_SERIES: Record<string, string> = {
  'head-gold': 'CLASSIC TUBE',
  'head-citrus': 'STUDIO',
  'head-silver': 'HIGH GAIN',
  'head-black': 'MODERN',
  lunchbox: 'LUNCHBOX',
  combo: 'COMBO',
  'combo-twin': 'TWIN COMBO',
  rack: 'MODELER',
}

function defaultAmpArchetype(amp: AmplifierModel): string {
  if (amp.type === 'combo') {
    return /twin/i.test(amp.model) ? 'combo-twin' : 'combo'
  }
  if (amp.style === 'high-gain') return 'head-silver'
  if (amp.style === 'vintage') return 'head-gold'
  return 'head-black'
}

/** Identité en marque blanche d'un ampli (toujours renommée). */
export function whiteLabelForAmp(
  amp: AmplifierModel,
  _indexInBrand: number,
  archetype?: string
): WhiteLabel {
  const series = AMP_SERIES[archetype ?? defaultAmpArchetype(amp)] ?? 'AMPLIFIER'
  return {
    brandName: 'WebAmp Studio',
    // Affichage grille : « WEBAMP CLASSIC TUBE » (plus de code WA-nH)
    modelName: `WEBAMP ${series}`,
    subtitle: amp.type === 'head' ? 'All-Tube Head' : 'Combo',
    sourceName: `${amp.brand} ${amp.model}`,
  }
}

/** Label listing / shell : réel si autorisé, sinon marque blanche. */
export function displayLabelForPedal(model: PedalModel, indexInType: number): WhiteLabel {
  const sourceName = `${model.brand} ${model.model}`
  if (keepsRealName(model.brand)) {
    return {
      brandName: model.brand,
      modelName: model.model,
      subtitle: model.type,
      sourceName,
    }
  }
  return whiteLabelForPedal(model, indexInType)
}

/** Label listing ampli : réel si autorisé, sinon marque blanche. */
export function displayLabelForAmp(
  amp: AmplifierModel,
  indexInBrand: number,
  archetype?: string
): WhiteLabel {
  const sourceName = `${amp.brand} ${amp.model}`
  if (keepsRealName(amp.brand)) {
    return {
      brandName: amp.brand,
      modelName: amp.model,
      subtitle: amp.type === 'head' ? 'Head' : 'Combo',
      sourceName,
    }
  }
  return whiteLabelForAmp(amp, indexInBrand, archetype)
}

/** Index 0-based d'une pédale dans son type (ordre catalogue). */
export function pedalIndexInType(library: PedalModel[], pedal: PedalModel): number {
  let i = 0
  for (const p of library) {
    if (p.id === pedal.id) return i
    if (p.type === pedal.type) i++
  }
  return 0
}

/** Index 0-based d'un ampli dans sa marque (ordre catalogue). */
export function ampIndexInBrand(library: AmplifierModel[], amp: AmplifierModel): number {
  let i = 0
  for (const a of library) {
    if (a.id === amp.id) return i
    if (a.brand === amp.brand) i++
  }
  return 0
}
