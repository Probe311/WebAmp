// Utilitaires pour mapper les noms des profils aux IDs de la bibliothèque
import { amplifierLibrary } from '../data/amplifiers'
import { pedalLibrary } from '../data/pedals'

export function findAmplifierId(profileName: string): string | null {
  const normalized = profileName.toLowerCase()
  
  // Mapping spécifique pour les noms de profils
  const mappings: Record<string, string> = {
    'marshall plexi': 'marshall-plexi',
    'marshall plexi 1959': 'marshall-plexi',
    'marshall super lead 100': 'marshall-plexi',
    'marshall super lead 1959': 'marshall-plexi',
    'marshall jcm800': 'marshall-jcm800',
    'fender twin': 'fender-65-twin',
    'fender twin reverb': 'fender-65-twin',
    'fender bassman': 'fender-65-twin', // Approximation
    'fender vibroverb': 'fender-deluxe-reverb', // Approximation
    'fender super reverb': 'fender-deluxe-reverb', // Approximation
    'fender dual showman': 'fender-65-twin', // Approximation
    'vox ac30': 'vox-ac30',
    'hiwatt dr103': 'vox-ac30', // Approximation - pas de Hiwatt dans la bibliothèque
    'orange heads': 'orange-rockerverb',
    'orange rockerverb': 'orange-rockerverb',
    'mesa boogie mark i': 'mesa-mark1',
    'mesa boogie mark iic+': 'mesa-mark-iic-plus',
    'evh 5150': 'peavey-5150',
    'peavey 5150': 'peavey-5150',
    'marshall silver jubilee 2555': 'marshall-jcm800', // Approximation
    'marshall jcm slash 2555': 'marshall-jcm800', // Approximation
    'dumble': 'fender-deluxe-reverb', // Approximation - pas de Dumble dans la bibliothèque
    'two-rock custom': 'fender-deluxe-reverb', // Approximation
    'fender blackface': 'fender-65-twin', // Approximation
    'prs custom amps': 'mesa-dual-rectifier', // Approximation
    'roland jc-120': 'roland-jc120',
    'randall kh103': 'mesa-dual-rectifier', // Approximation
    'gibson ga-40': 'gibson-ga40',
    'carvin legacy': 'carvin-legacy',
    'synergy modules (live récents)': 'synergy-modules',
    'synergy modules': 'synergy-modules',
    'marshall jvm410hjs': 'marshall-jvm410hjs',
    'peavey jsx': 'peavey-jsx',
    'lab series l5': 'lab-series-l5',
    'marshall jtm45': 'marshall-jtm45',
    'marshall 1959slp': 'marshall-1959slp',
    'soldano slo-100': 'soldano-slo100',
    'fender vibrolux': 'fender-vibrolux',
    'mesa/boogie dual rectifier': 'mesa-dual-rectifier',
    'mesa/boogie mark i': 'mesa-mark1',
    'mesa/boogie mark iic+': 'mesa-mark-iic-plus',
    'mesa/boogie jp2c': 'mesa-jp2c',
    'mesa/boogie mark v': 'mesa-mark-v',
    'mesa lonestar': 'mesa-lonestar',
    'polytone mini-brute': 'polytone-minibrute',
    'standel amps': 'standel-custom',
    'engl powerball': 'engl-powerball',
    'randall rg100es': 'randall-rg100es',
    'hartley thompson': 'hartley-thompson',
    'yamaha dg80': 'yamaha-dg80',
    'fractal axe-fx': 'fractal-axe-fx',
    'neural dsp quad cortex': 'neural-quad-cortex'
  }
  
  if (mappings[normalized]) {
    return mappings[normalized]
  }
  
  // Recherche flexible par marque et modèle
  for (const amp of amplifierLibrary) {
    const brandModel = `${amp.brand} ${amp.model}`.toLowerCase()
    if (normalized.includes(amp.brand.toLowerCase()) || brandModel.includes(normalized) || normalized.includes(brandModel)) {
      return amp.id
    }
  }
  
  return null
}

export function findPedalId(profileName: string): string | null {
  const normalized = profileName.toLowerCase()
  
  // Mapping spécifique pour les noms de profils
  const mappings: Record<string, string> = {
    'fuzz face': 'dunlop-fuzz-face',
    'vox wah v847': 'dunlop-crybaby-classic',
    'cry baby wah': 'dunlop-crybaby-classic',
    'wah evh': 'dunlop-crybaby-classic',
    'dunlop wah': 'dunlop-crybaby-classic',
    'dunlop slash wah sw95': 'dunlop-crybaby-classic',
    'dunlop kh95 wah': 'dunlop-crybaby-classic',
    'rmc wah': 'dunlop-crybaby-classic',
    'tube screamer': 'ibanez-tube-screamer',
    'ibanez ts808': 'ibanez-tube-screamer',
    'ibanez ts-9': 'ibanez-tube-screamer',
    'ibanez ts9': 'ibanez-tube-screamer',
    'big muff': 'electro-harmonix-big-muff',
    'big muff pi': 'electro-harmonix-big-muff',
    'boss ce-1 chorus': 'boss-ce1',
    'boss dd-3': 'boss-dd3',
    'boss dd-2/3': 'boss-dd3',
    'boss dd3': 'boss-dd3',
    'mxr phase 90': 'boss-ph3',
    'mxr flanger 117': 'boss-bf3',
    'mxr mc-402 boost/od': 'boss-sd1',
    'mxr analog chorus': 'boss-ch1',
    'univibe': 'boss-ch1',
    'uni-vibe': 'boss-ch1',
    'octavia': 'zvex-fuzz-factory',
    'tape echo': 'roland-space-echo',
    'echoplex': 'roland-space-echo',
    'binson echo': 'binson-echorec',
    'binson echorec': 'binson-echorec',
    'delays roland': 'roland-space-echo',
    'delays multiples': 'tc-delay',
    'delays soft': 'tc-delay',
    'delays / modulations': 'tc-gmajor2',
    'memory man delay': 'memory-man-delay',
    'delay tc electronic': 'tc-delay',
    'power booster': 'treble-booster',
    'boost léger': 'treble-booster',
    'boost/compresseurs divers': 'mxr-dyna-comp',
    'overdrives transparents': 'klon-centaur',
    'reverb': 'boss-rv6',
    'leslie/rotary': 'roland-space-echo',
    'wah occasionnel': 'dunlop-crybaby-classic',
    'digitech whammy': 'digitech-whammy',
    'boss volume/expression': 'boss-ge7',
    'rack bradshaw': 'tc-delay',
    'dod eq': 'boss-ge7',
    'eqs': 'boss-ge7',
    'eq': 'boss-ge7',
    'noise gate': 'boss-ge7',
    'tc electronic g-major 2': 'tc-delay',
    'ibanez jemini distortion': 'ibanez-jemini',
    'eventide harmonizer': 'eventide-harmonizer',
    'morley bad horsie wah': 'morley-bad-horsie',
    'satchurator': 'satchurator',
    'vox time machine delay': 'vox-time-machine',
    'killswitch intégré': 'killswitch-stutter',
    'treble booster (rangemaster/clone)': 'treble-booster',
    'treble booster': 'treble-booster',
    'overdrive mesa grid slammer': 'mesa-grid-slammer',
    'boss ce-2': 'boss-ce2',
    'boss chorus ce-1': 'boss-ce1',
    'boss od-1': 'boss-od1',
    'jhs at drive': 'jhs-at-drive',
    'reverb neunaber': 'neunaber-reverb',
    'wah jp95': 'dunlop-crybaby-classic',
    'chorus': 'boss-ce1'
  }
  
  if (mappings[normalized]) {
    return mappings[normalized]
  }
  
  // Recherche flexible par marque et modèle
  for (const pedal of pedalLibrary) {
    const brandModel = `${pedal.brand} ${pedal.model}`.toLowerCase()
    if (normalized.includes(pedal.brand.toLowerCase()) || brandModel.includes(normalized) || normalized.includes(brandModel)) {
      return pedal.id
    }
    
    // Recherche par type si le nom contient le type
    if (normalized.includes(pedal.type)) {
      // Trouver la première pédale du type qui correspond
      const typeMatch = pedalLibrary.find(p => p.type === pedal.type)
      if (typeMatch) {
        return typeMatch.id
      }
    }
  }
  
  return null
}

