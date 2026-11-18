/**
 * Genres musicaux pour filtres Style (amplis / pédales).
 * Le champ optionnel `genre` sur le modèle prime ; sinon heuristique + overrides.
 */
import type { PedalModel } from '../data/pedals'
import type { AmplifierModel } from '../data/amplifiers'

export type MusicGenreBase =
  | 'rock'
  | 'metal'
  | 'blues'
  | 'jazz-clean'
  | 'high-gain'
  | 'versatile'

export type MusicGenreNiche = 'reggae' | 'country' | 'ambient' | 'experimental' | 'funk'

export type MusicGenre = MusicGenreBase | MusicGenreNiche

export const MUSIC_GENRE_LABELS: Record<MusicGenre, string> = {
  rock: 'Rock',
  metal: 'Metal',
  blues: 'Blues',
  'jazz-clean': 'Jazz / Clean',
  'high-gain': 'High-gain',
  versatile: 'Versatile',
  reggae: 'Reggae',
  country: 'Country',
  ambient: 'Ambient',
  experimental: 'Experimental',
  funk: 'Funk',
}

/** Overrides explicites (niches / cas ambigus). */
const PEDAL_GENRE_OVERRIDES: Record<string, MusicGenre> = {
  'walrus-audio-ambient': 'ambient',
  'strymon-bigsky-shimmer': 'ambient',
  'walrus-slo': 'ambient',
  'surfybear-metal': 'reggae',
  'leslie-rotary': 'jazz-clean',
  univibe: 'funk',
  'mxr-univibe': 'funk',
  'moog-mf-ring': 'experimental',
  'zvex-lo-fi-junky': 'experimental',
  'chase-bliss-mood': 'experimental',
  'chase-bliss-habit': 'experimental',
  'death-by-audio-fuzz-war': 'experimental',
}

const AMP_GENRE_OVERRIDES: Record<string, MusicGenre> = {
  'fender-65-twin': 'jazz-clean',
  'fender-deluxe-reverb': 'blues',
  'fender-vibrolux': 'blues',
  'marshall-jcm800': 'rock',
  'marshall-plexi': 'rock',
  'marshall-jtm45': 'blues',
  'marshall-1959slp': 'rock',
  'marshall-jvm410hjs': 'high-gain',
  'orange-rockerverb': 'rock',
  'orange-tiny-terror': 'rock',
  'orange-rockerverb-alt': 'rock',
  'orange-tiny-terror-alt': 'rock',
  'mesa-dual-rectifier': 'metal',
  'mesa-dual-rectifier-alt': 'metal',
  'mesa-mark1': 'rock',
  'mesa-mark-iic-plus': 'metal',
  'mesa-jp2c': 'metal',
  'mesa-mark-v': 'versatile',
  'mesa-mark-v-alt': 'versatile',
  'mesa-lonestar': 'blues',
  'vox-ac30': 'rock',
  'vox-ac15': 'rock',
  'vox-ac30-alt': 'rock',
  'vox-ac15-alt': 'rock',
  'peavey-5150': 'metal',
  'peavey-5150-alt': 'metal',
  'peavey-6505': 'metal',
  'peavey-jsx': 'metal',
  'soldano-slo100': 'high-gain',
  'engl-powerball': 'metal',
  'randall-rg100es': 'metal',
  'roland-jc120': 'jazz-clean',
  'polytone-minibrute': 'jazz-clean',
  'gibson-ga40': 'blues',
  'lab-series-l5': 'jazz-clean',
  'standel-custom': 'country',
  'supro-blues-king': 'blues',
  'supro-black-magick': 'blues',
  'hartley-thompson': 'blues',
  'carvin-legacy': 'rock',
  'synergy-modules': 'versatile',
  'yamaha-dg80': 'versatile',
  'fractal-axe-fx': 'versatile',
  'neural-quad-cortex': 'versatile',
}

function textHas(hay: string, ...needles: string[]): boolean {
  const h = hay.toLowerCase()
  return needles.some((n) => h.includes(n))
}

function heuristicFromText(text: string): MusicGenre | null {
  if (textHas(text, 'reggae', 'dub', 'ska')) return 'reggae'
  if (textHas(text, 'country', 'twang', 'nashville')) return 'country'
  if (textHas(text, 'ambient', 'shimmer', 'pad ', 'atmospher')) return 'ambient'
  if (textHas(text, 'experimental', 'glitch', 'lo-fi', 'lofi', 'ring mod', 'bitcrush'))
    return 'experimental'
  if (textHas(text, 'funk', 'uni-vibe', 'univibe', 'envelope filter')) return 'funk'
  if (textHas(text, 'metal', 'djent', 'thrash', 'death metal')) return 'metal'
  if (textHas(text, 'high-gain', 'high gain', 'saturé', 'rectifier', '5150', '6505'))
    return 'high-gain'
  if (textHas(text, 'blues', 'bluesy', 'blackface')) return 'blues'
  if (textHas(text, 'jazz', 'clean cristallin', 'crystal', 'chorus jazz')) return 'jazz-clean'
  if (textHas(text, 'hard rock', 'classic rock', 'rock ')) return 'rock'
  return null
}

/** Genre affiché / filtré pour une pédale. */
export function resolvePedalGenre(pedal: PedalModel): MusicGenre {
  if (pedal.genre) return pedal.genre
  const byId = PEDAL_GENRE_OVERRIDES[pedal.id]
  if (byId) return byId

  switch (pedal.type) {
    case 'shimmerreverb':
      return 'ambient'
    case 'springreverb':
      return 'versatile'
    case 'lofi':
    case 'ringmod':
    case 'bitcrusher':
      return 'experimental'
    case 'vibe':
      return 'funk'
    case 'rotary':
      return 'jazz-clean'
    case 'distortion':
    case 'fuzz':
      return 'rock'
    case 'overdrive':
      return 'blues'
    case 'noisegate':
      return 'metal'
    case 'tuner':
    case 'eq':
    case 'volume':
    case 'compressor':
    case 'multifx':
      return 'versatile'
    default:
      break
  }

  const fromText = heuristicFromText(`${pedal.model} ${pedal.description}`)
  if (fromText) return fromText

  if (pedal.style === 'vintage') return 'blues'
  if (pedal.style === 'boutique') return 'versatile'
  return 'versatile'
}

/** Genre affiché / filtré pour un ampli. */
export function resolveAmpGenre(amp: AmplifierModel): MusicGenre {
  if (amp.genre) return amp.genre
  const byId = AMP_GENRE_OVERRIDES[amp.id]
  if (byId) return byId

  if (amp.style === 'high-gain') return 'high-gain'

  const fromText = heuristicFromText(`${amp.model} ${amp.description} ${amp.brand}`)
  if (fromText) return fromText

  if (amp.style === 'vintage') return 'blues'
  if (amp.style === 'modern') return 'rock'
  return 'versatile'
}

export function genreLabel(genre: MusicGenre): string {
  return MUSIC_GENRE_LABELS[genre]
}
