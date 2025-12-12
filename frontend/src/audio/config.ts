/**
 * Configuration globale des pédales avec Web Audio API
 * 
 * Ce fichier définit les configurations spécifiques pour chaque pédale
 * selon les spécifications constructeur réelles.
 */

import { PedalModel } from '../data/pedals'

export interface PedalAudioConfig {
  pedalId: string
  enabled: boolean
  parameters: Record<string, number>
  audioNodes?: {
    input?: AudioNode
    output?: AudioNode
  }
}

export interface PedalboardConfig {
  effects: PedalAudioConfig[]
  routing: 'serial' | 'parallel' | 'custom'
}

/**
 * Retourne la configuration audio spécifique pour une pédale
 * Basée sur les analyses techniques réelles (ElectroSmash, etc.)
 */
function getPedalSpecificAudioConfig(
  pedalId: string,
  paramName: string,
  value: number
): number | null {
  const normalized = value / 100

  // BOSS DS-1 : Scoop médian à ~500Hz, clipping dur, mid-scooped, aggressive, silicon hard clipping
  if (pedalId === 'boss-ds1') {
    switch (paramName) {
      case 'distortion':
        // Source: min: 0.2, max: 0.85, default: 0.55
        return 0.2 + normalized * 0.65
      case 'tone':
        // Source: min: 0.3, max: 0.8, default: 0.5
        // Tone avec scoop médian : 0-100 -> 0.3-0.8 (normalisé), puis converti en Hz
        const toneNormalized = 0.3 + normalized * 0.5
        return 200 + toneNormalized * 7800
      case 'level':
        // Source: min: 0.5, max: 1.2, default: 0.8
        return 0.5 + normalized * 0.7
      default:
        return null
    }
  }

  // ProCo RAT : Bosse médiane à ~1kHz, clipping dur symétrique, grainy, fat mids, filter-based tone control
  if (pedalId === 'proco-rat') {
    switch (paramName) {
      case 'distortion':
        // Source: min: 0.3, max: 1.0, default: 0.7
        return 0.3 + normalized * 0.7
      case 'filter':
        // Source: min: 0.0, max: 1.0, default: 0.5
        // Filter cible la bosse médiane : 0-100 -> 500-2000 Hz (centré sur 1kHz)
        return 500 + normalized * 1500
      case 'volume':
        // Source: min: 0.5, max: 1.3, default: 0.9
        return 0.5 + normalized * 0.8
      default:
        return null
    }
  }

  // Ibanez Tube Screamer : Bosse médiane à 700-800Hz, clipping doux, mid-hump, smooth clipping
  if (pedalId === 'ibanez-tube-screamer') {
    switch (paramName) {
      case 'drive':
        // Source: min: 0.1, max: 0.75, default: 0.4
        return 0.1 + normalized * 0.65
      case 'tone':
        // Source: min: 0.25, max: 0.7, default: 0.5
        const toneNormalized = 0.25 + normalized * 0.45
        return 300 + toneNormalized * 4700
      case 'level':
        // Source: min: 0.6, max: 1.3, default: 0.9
        return 0.6 + normalized * 0.7
      default:
        return null
    }
  }
  
  // Ibanez TS Mini : TS-9 but darker and rounder
  if (pedalId === 'ibanez-tube-screamer-mini') {
    switch (paramName) {
      case 'drive':
        // Source: min: 0.15, max: 0.8, default: 0.45
        return 0.15 + normalized * 0.65
      case 'tone':
        // Source: min: 0.2, max: 0.7, default: 0.5
        const toneNormalized = 0.2 + normalized * 0.5
        return 300 + toneNormalized * 4700
      case 'level':
        // Source: min: 0.6, max: 1.2, default: 0.9
        return 0.6 + normalized * 0.6
      default:
        return null
    }
  }

  // BOSS SD-1 : Similaire au TS mais plus transparent, asymmetric clipping, bright TS-type drive
  if (pedalId === 'boss-sd1') {
    switch (paramName) {
      case 'drive':
        // Source: min: 0.15, max: 0.8, default: 0.45
        return 0.15 + normalized * 0.65
      case 'tone':
        // Source: min: 0.3, max: 0.75, default: 0.55
        const toneNormalized = 0.3 + normalized * 0.45
        return 300 + toneNormalized * 4700
      case 'level':
        // Source: min: 0.6, max: 1.2, default: 0.9
        return 0.6 + normalized * 0.6
      default:
        return null
    }
  }

  // Klon Centaur : Transparent, presque pas de saturation, clean+drive blending, transparent, mid sweetener
  if (pedalId === 'klon-centaur') {
    switch (paramName) {
      case 'gain':
        // Source: min: 0.05, max: 0.6, default: 0.25
        return 0.05 + normalized * 0.55
      case 'treble':
        // Source: min: 0.3, max: 0.7, default: 0.55
        const trebleNormalized = 0.3 + normalized * 0.4
        return 2000 + trebleNormalized * 8000
      case 'output':
        // Source: min: 0.8, max: 1.5, default: 1.1
        return 0.8 + normalized * 0.7
      default:
        return null
    }
  }

  // Fulltone OCD : MOSFET clipping, grain ouvert, amp-like, wide frequency
  if (pedalId === 'fulltone-ocd') {
    switch (paramName) {
      case 'drive':
        // Source: min: 0.1, max: 0.9, default: 0.5
        return 0.1 + normalized * 0.8
      case 'tone':
        // Source: min: 0.3, max: 0.85, default: 0.6
        const toneNormalized = 0.3 + normalized * 0.55
        return 300 + toneNormalized * 4700
      case 'volume':
        // Source: min: 0.6, max: 1.4, default: 1.0
        return 0.6 + normalized * 0.8
      default:
        return null
    }
  }

  // Electro-Harmonix Big Muff : Fuzz avec creux à 1kHz, scooped mids, huge sustain
  if (pedalId === 'electro-harmonix-big-muff' || pedalId === 'electro-harmonix-muff') {
    switch (paramName) {
      case 'sustain':
        // Source: min: 0.4, max: 1.0, default: 0.75
        return 0.4 + normalized * 0.6
      case 'tone':
        // Source: min: 0.2, max: 0.9, default: 0.6
        const toneNormalized = 0.2 + normalized * 0.7
        return 200 + toneNormalized * 5800
      case 'volume':
        // Source: min: 0.6, max: 1.4, default: 1.0
        return 0.6 + normalized * 0.8
      default:
        return null
    }
  }

  // Dunlop Fuzz Face : Clipping asymétrique puis dur, warm, vintage, dynamic, germanium-like cleanup
  if (pedalId === 'dunlop-fuzz-face') {
    switch (paramName) {
      case 'fuzz':
        // Source: min: 0.4, max: 1.0, default: 0.75
        return 0.4 + normalized * 0.6
      case 'volume':
        // Source: min: 0.7, max: 1.4, default: 1.0
        return 0.7 + normalized * 0.7
      default:
        return null
    }
  }

  // ZVEX Fuzz Factory : Extrême avec contrôles avancés, unstable, oscillating, experimental
  if (pedalId === 'zvex-fuzz-factory') {
    switch (paramName) {
      case 'drive':
        // Source: min: 0.4, max: 1.0, default: 0.7
        return 0.4 + normalized * 0.6
      case 'gate':
        // Source: min: 0.0, max: 1.0, default: 0.2
        // Gate : 0-100 -> -60 to -10 dB
        const gateNormalized = normalized
        return -60 + gateNormalized * 50
      case 'comp':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      case 'stab':
        // Source: min: 0.2, max: 1.0, default: 0.9
        return 0.2 + normalized * 0.8
      case 'volume':
        // Source: min: 0.7, max: 1.5, default: 1.0
        return 0.7 + normalized * 0.8
      default:
        return null
    }
  }

  // Treble Booster : Highpass à 3500Hz, boost aigus
  if (pedalId === 'treble-booster') {
    switch (paramName) {
      case 'boost':
        // Boost aigu : 0-100 -> 0-20 dB
        return normalized * 20
      case 'level':
        return normalized * 2
      default:
        return null
    }
  }

  // Walrus Audio Distortion : Distortion moderne avec modes, mode-dependent
  // Distortion doit être plus agressive que l'overdrive (hard clipping vs soft clipping)
  if (pedalId === 'walrus-audio-distortion') {
    switch (paramName) {
      case 'gain':
        // Source: min: 0.5, max: 2.5, default: 1.5 (gain plus élevé que overdrive pour hard clipping)
        return 0.5 + normalized * 2.0
      case 'tone':
        // Source: min: 0.2, max: 0.8, default: 0.5
        const toneNormalized = 0.2 + normalized * 0.6
        return 200 + toneNormalized * 7800
      case 'vol':
      case 'volume':
        // Source: min: 0.6, max: 1.3, default: 0.9
        return 0.6 + normalized * 0.7
      default:
        return null
    }
  }

  // Ibanez Jemini : Double canal distortion/fuzz
  if (pedalId === 'ibanez-jemini') {
    switch (paramName) {
      case 'gainA':
      case 'gainB':
        // Gain élevé : 0-100 -> 0.5-18
        return 0.5 + normalized * 17.5
      case 'tone':
        return 200 + normalized * 7800
      case 'level':
        return normalized * 2
      default:
        return null
    }
  }

  // Satchurator : Distortion signature Satriani
  if (pedalId === 'satchurator') {
    switch (paramName) {
      case 'gain':
        // Grain compressé : 0-100 -> 0.6-17
        return 0.6 + normalized * 16.4
      case 'tone':
        return 200 + normalized * 7800
      case 'volume':
        return normalized * 2
      default:
        return null
    }
  }

  // Walrus Audio Fuzz : Fuzz moderne avec modes (GATE, CLASSIC, MID+)
  if (pedalId === 'walrus-audio-fuzz') {
    switch (paramName) {
      case 'gain':
        // Source: min: 0.3, max: 1.0, default: 0.75
        return 0.3 + normalized * 0.7
      case 'tone':
        // Source: min: 0.2, max: 0.9, default: 0.6
        const toneNormalized = 0.2 + normalized * 0.7
        return 200 + toneNormalized * 3800
      case 'vol':
      case 'volume':
        // Source: min: 0.7, max: 1.5, default: 1.0
        return 0.7 + normalized * 0.8
      default:
        return null
    }
  }

  // Octavia Fuzz : Fuzz avec octave supérieure
  if (pedalId === 'octavia-fuzz') {
    switch (paramName) {
      case 'fuzz':
        // Source: min: 0.3, max: 1.0, default: 0.7
        return 0.3 + normalized * 0.7
      case 'octave':
        // Source: min: 0.0, max: 1.0, default: 1.0
        return normalized
      case 'level':
        // Source: min: 0.5, max: 1.4, default: 1.0
        return 0.5 + normalized * 0.9
      default:
        return null
    }
  }

  // Walrus Audio Drive : Drive moderne avec modes (SMOOTH, CRUNCH, BRIGHT)
  // Overdrive = soft clipping (moins agressif que distortion)
  if (pedalId === 'walrus-audio-drive') {
    switch (paramName) {
      case 'gain':
        // Source: min: 0.1, max: 0.7, default: 0.4 (gain plus doux que distortion pour soft clipping)
        return 0.1 + normalized * 0.6
      case 'tone':
        // Source: min: 0.25, max: 0.85, default: 0.6
        const toneNormalized = 0.25 + normalized * 0.6
        return 300 + toneNormalized * 4700
      case 'vol':
      case 'volume':
        // Source: min: 0.6, max: 1.3, default: 1.0
        return 0.6 + normalized * 0.7
      default:
        return null
    }
  }

  // CHORUS
  // BOSS CH-1 : digital, bright, wide stereo
  if (pedalId === 'boss-ch1') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.2, max: 6, default: 1.6
        return 0.2 + normalized * 5.8
      case 'depth':
        // Source: min: 0.1, max: 0.8, default: 0.5
        return 0.1 + normalized * 0.7
      case 'equalizer':
        // Source: min: 0.3, max: 0.7, default: 0.5
        return 0.3 + normalized * 0.4
      case 'level':
        // Source: min: 0.4, max: 1.0, default: 0.7
        return 0.4 + normalized * 0.6
      default:
        return null
    }
  }

  // Electro-Harmonix Small Clone : warm, deep, analog
  if (pedalId === 'electro-harmonix-small-clone') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 4, default: 1.2
        return 0.1 + normalized * 3.9
      case 'depth':
        // Source: min: 0.5, max: 1.0, default: 0.75
        return 0.5 + normalized * 0.5
      default:
        return null
    }
  }

  // Walrus Audio Chorus : modes (LIGHT, MEDIUM, HEAVY)
  if (pedalId === 'walrus-audio-chorus') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 5, default: 1.5
        return 0.1 + normalized * 4.9
      case 'depth':
        // Source: min: 0.2, max: 0.9, default: 0.6
        return 0.2 + normalized * 0.7
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // Electro-Harmonix Oceans 11 Chorus
  if (pedalId === 'electro-harmonix-oceans-11') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 5, default: 1.3
        return 0.1 + normalized * 4.9
      case 'depth':
        // Source: min: 0.1, max: 0.8, default: 0.6
        return 0.1 + normalized * 0.7
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // BOSS CE-1 : classic warm analog
  if (pedalId === 'boss-ce1') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.3, max: 7, default: 1.2
        return 0.3 + normalized * 6.7
      case 'depth':
        // Source: min: 0.3, max: 0.9, default: 0.7
        return 0.3 + normalized * 0.6
      case 'level':
        // Source: min: 0.4, max: 1.0, default: 0.7
        return 0.4 + normalized * 0.6
      default:
        return null
    }
  }

  // MXR Analog Chorus
  if (pedalId === 'mxr-analog-chorus') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.2, max: 6, default: 1.6
        return 0.2 + normalized * 5.8
      case 'depth':
        // Source: min: 0.2, max: 0.8, default: 0.6
        return 0.2 + normalized * 0.6
      case 'level':
        // Source: min: 0.4, max: 1.0, default: 0.7
        return 0.4 + normalized * 0.6
      default:
        return null
    }
  }

  // DELAY
  // BOSS DD-3 : clean digital delay
  if (pedalId === 'boss-dd3') {
    switch (paramName) {
      case 'time':
      case 'delay':
        // Source: min: 0.02, max: 0.8, default: 0.45
        return 0.02 + normalized * 0.78
      case 'feedback':
        // Source: min: 0.1, max: 0.9, default: 0.4
        return 0.1 + normalized * 0.8
      case 'level':
        // Source: min: 0.2, max: 1.0, default: 0.5
        return 0.2 + normalized * 0.8
      default:
        return null
    }
  }

  // TC Electronic Flashback
  if (pedalId === 'tc-electronic-flashback') {
    switch (paramName) {
      case 'time':
        // Source: min: 0.02, max: 1.5, default: 0.45
        return 0.02 + normalized * 1.48
      case 'feedback':
        // Source: min: 0.1, max: 0.95, default: 0.4
        return 0.1 + normalized * 0.85
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // Walrus Audio Delay : modes (DIGITAL, ANALOG, REVERSE)
  if (pedalId === 'walrus-audio-delay') {
    switch (paramName) {
      case 'time':
        // Source: min: 0.02, max: 1.5, default: 0.4
        return 0.02 + normalized * 1.48
      case 'feedback':
        // Source: min: 0.1, max: 0.95, default: 0.5
        return 0.1 + normalized * 0.85
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // Strymon Timeline : studio-grade digital delay
  if (pedalId === 'strymon-timeline') {
    switch (paramName) {
      case 'time':
        // Source: min: 0.01, max: 2.0, default: 0.45
        return 0.01 + normalized * 1.99
      case 'repeats':
      case 'feedback':
        // Source: min: 0.1, max: 0.95, default: 0.45
        return 0.1 + normalized * 0.85
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.4
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // Echoplex EP-3 : tape delay with preamp coloration
  if (pedalId === 'echoplex-tape-delay') {
    switch (paramName) {
      case 'time':
        // Source: min: 0.07, max: 0.7, default: 0.35
        return 0.07 + normalized * 0.63
      case 'repeat':
      case 'feedback':
        // Source: min: 0.1, max: 0.85, default: 0.45
        return 0.1 + normalized * 0.75
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // Binson Echorec : multi-head magnetic drum echo
  if (pedalId === 'binson-echorec') {
    switch (paramName) {
      case 'repeat':
      case 'feedback':
        // Source: min: 0.1, max: 0.9, default: 0.5
        return 0.1 + normalized * 0.8
      case 'tone':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // Deluxe Memory Man : analog BBD delay, dark, modulated
  if (pedalId === 'memory-man-delay') {
    switch (paramName) {
      case 'delay':
      case 'time':
        // Source: min: 0.03, max: 0.55, default: 0.3
        return 0.03 + normalized * 0.52
      case 'feedback':
        // Source: min: 0.1, max: 0.85, default: 0.45
        return 0.1 + normalized * 0.75
      case 'blend':
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // Roland RE-201 : tape echo with wow/flutter
  if (pedalId === 'roland-space-echo') {
    switch (paramName) {
      case 'repeat':
      case 'feedback':
        // Source: min: 0.1, max: 0.95, default: 0.5
        return 0.1 + normalized * 0.85
      case 'intensity':
        // Source: min: 0.1, max: 0.95, default: 0.6
        return 0.1 + normalized * 0.85
      case 'echo_volume':
      case 'mix':
        // Source: min: 0.2, max: 1.0, default: 0.5
        return 0.2 + normalized * 0.8
      default:
        return null
    }
  }

  // TC 2290 : 80s high-definition digital delay
  if (pedalId === 'tc-delay') {
    switch (paramName) {
      case 'delay':
      case 'time':
        // Source: min: 0.02, max: 1.0, default: 0.45
        return 0.02 + normalized * 0.98
      case 'feedback':
        // Source: min: 0.1, max: 0.9, default: 0.5
        return 0.1 + normalized * 0.8
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.4
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // REVERB
  // BOSS RV-6
  if (pedalId === 'boss-rv6') {
    switch (paramName) {
      case 'decay':
        // Source: min: 0.3, max: 8.0, default: 2.5
        return 0.3 + normalized * 7.7
      case 'tone':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      case 'level':
        // Source: min: 0.2, max: 1.0, default: 0.5
        return 0.2 + normalized * 0.8
      default:
        return null
    }
  }

  // Electro-Harmonix Holy Grail
  if (pedalId === 'electro-harmonix-holy-grail') {
    switch (paramName) {
      case 'reverb':
      case 'mix':
        // Source: min: 0.2, max: 1.0, default: 0.6
        return 0.2 + normalized * 0.8
      default:
        return null
    }
  }

  // Walrus Audio Reverb : modes (HALL, SPRING, PLATE)
  if (pedalId === 'walrus-audio-reverb') {
    switch (paramName) {
      case 'decay':
        // Source: min: 0.3, max: 10.0, default: 3.0
        return 0.3 + normalized * 9.7
      case 'tone':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // Strymon BigSky
  if (pedalId === 'strymon-bigsky') {
    switch (paramName) {
      case 'decay':
        // Source: min: 0.3, max: 12.0, default: 4.0
        return 0.3 + normalized * 11.7
      case 'tone':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // TREMOLO
  // BOSS TR-2
  if (pedalId === 'boss-tr2') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 12, default: 4
        return 0.1 + normalized * 11.9
      case 'depth':
        // Source: min: 0.2, max: 1.0, default: 0.7
        return 0.2 + normalized * 0.8
      default:
        return null
    }
  }

  // Walrus Audio Tremolo : modes (SINE, SQUARE, RANDOM)
  if (pedalId === 'walrus-audio-tremolo') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 12, default: 5
        return 0.1 + normalized * 11.9
      case 'depth':
        // Source: min: 0.2, max: 1.0, default: 0.7
        return 0.2 + normalized * 0.8
      case 'vol':
      case 'volume':
        // Source: min: 0.5, max: 1.5, default: 1
        return 0.5 + normalized * 1.0
      default:
        return null
    }
  }

  // Fulltone Supa-Trem
  if (pedalId === 'fulltone-supatrem') {
    switch (paramName) {
      case 'speed':
      case 'rate':
        // Source: min: 0.1, max: 12, default: 4
        return 0.1 + normalized * 11.9
      case 'depth':
        // Source: min: 0.2, max: 1.0, default: 0.7
        return 0.2 + normalized * 0.8
      case 'volume':
        // Source: min: 0.7, max: 1.5, default: 1
        return 0.7 + normalized * 0.8
      default:
        return null
    }
  }

  // Strymon Flint
  if (pedalId === 'strymon-flint') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 12, default: 3
        return 0.1 + normalized * 11.9
      case 'depth':
        // Source: min: 0.2, max: 1.0, default: 0.6
        return 0.2 + normalized * 0.8
      case 'intensity':
        // Source: min: 0.2, max: 1.0, default: 0.8
        return 0.2 + normalized * 0.8
      default:
        return null
    }
  }

  // PHASER
  // BOSS PH-3
  if (pedalId === 'boss-ph3') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.2, max: 8, default: 1.2
        return 0.2 + normalized * 7.8
      case 'depth':
        // Source: min: 0.2, max: 1.0, default: 0.7
        return 0.2 + normalized * 0.8
      case 'resonance':
        // Source: min: 0.2, max: 0.9, default: 0.5
        return 0.2 + normalized * 0.7
      default:
        return null
    }
  }

  // Electro-Harmonix Small Stone
  if (pedalId === 'electro-harmonix-small-stone') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.2, max: 7, default: 1.1
        return 0.2 + normalized * 6.8
      case 'color':
        // Source: min: 0.0, max: 1.0, default: 0.5
        return normalized
      default:
        return null
    }
  }

  // Mooer Phase 90
  if (pedalId === 'mooer-phaser') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.2, max: 6, default: 1.2
        return 0.2 + normalized * 5.8
      case 'depth':
        // Source: min: 0.2, max: 1.0, default: 0.7
        return 0.2 + normalized * 0.8
      default:
        return null
    }
  }

  // Walrus Audio Phaser
  if (pedalId === 'walrus-audio-phaser') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.2, max: 8, default: 1.3
        return 0.2 + normalized * 7.8
      case 'feedback':
        // Source: min: 0.1, max: 0.9, default: 0.6
        return 0.1 + normalized * 0.8
      case 'depth':
        // Source: min: 0.2, max: 1.0, default: 0.7
        return 0.2 + normalized * 0.8
      default:
        return null
    }
  }

  // MXR Phase 90
  if (pedalId === 'mxr-phase90') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.2, max: 6, default: 1.2
        return 0.2 + normalized * 5.8
      case 'mix':
        // Source: min: 0.2, max: 0.8, default: 0.6
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // FLANGER
  // BOSS BF-3
  if (pedalId === 'boss-bf3') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 8, default: 0.8
        return 0.1 + normalized * 7.9
      case 'depth':
        // Source: min: 0.2, max: 0.9, default: 0.6
        return 0.2 + normalized * 0.7
      case 'manual':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      case 'resonance':
        // Source: min: 0.2, max: 0.9, default: 0.5
        return 0.2 + normalized * 0.7
      default:
        return null
    }
  }

  // Electro-Harmonix Electric Mistress
  if (pedalId === 'electro-harmonix-electric-mistress') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 7, default: 1.1
        return 0.1 + normalized * 6.9
      case 'range':
        // Source: min: 0.3, max: 1.0, default: 0.7
        return 0.3 + normalized * 0.7
      case 'color':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // Walrus Audio Flanger
  if (pedalId === 'walrus-audio-flanger') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 6, default: 0.9
        return 0.1 + normalized * 5.9
      case 'depth':
        // Source: min: 0.2, max: 0.9, default: 0.6
        return 0.2 + normalized * 0.7
      case 'feedback':
        // Source: min: 0.2, max: 0.9, default: 0.5
        return 0.2 + normalized * 0.7
      default:
        return null
    }
  }

  // Mooer E-Lady
  if (pedalId === 'mooer-e-lady') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 7, default: 1.0
        return 0.1 + normalized * 6.9
      case 'range':
        // Source: min: 0.3, max: 1.0, default: 0.7
        return 0.3 + normalized * 0.7
      case 'color':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // MXR Flanger 117
  if (pedalId === 'mxr-flanger-117') {
    switch (paramName) {
      case 'rate':
        // Source: min: 0.1, max: 8, default: 1.0
        return 0.1 + normalized * 7.9
      case 'width':
        // Source: min: 0.2, max: 1.0, default: 0.7
        return 0.2 + normalized * 0.8
      case 'regen':
      case 'feedback':
        // Source: min: 0.2, max: 0.9, default: 0.6
        return 0.2 + normalized * 0.7
      case 'manual':
        // Source: min: 0.2, max: 0.8, default: 0.5
        return 0.2 + normalized * 0.6
      default:
        return null
    }
  }

  // WAH (AudioWorklet)
  // Vox V847
  if (pedalId === 'vox-v847-wah') {
    switch (paramName) {
      case 'sweep':
        // Source: min: 300, max: 2000, default: 800 (Hz)
        return 300 + normalized * 1700
      case 'Q':
      case 'q':
        // Source: min: 2, max: 10, default: 6
        return 2 + normalized * 8
      case 'level':
        // Source: min: 0.5, max: 1.5, default: 1.0
        return 0.5 + normalized * 1.0
      default:
        return null
    }
  }

  // Dunlop Cry Baby GCB-95
  if (pedalId === 'cry-baby-wah' || pedalId === 'dunlop-crybaby-classic') {
    switch (paramName) {
      case 'sweep':
        // Source: min: 400, max: 2300, default: 900 (Hz)
        return 400 + normalized * 1900
      case 'Q':
      case 'q':
        // Source: min: 4, max: 12, default: 7
        return 4 + normalized * 8
      case 'volume':
        // Source: min: 0.5, max: 1.4, default: 1.0
        return 0.5 + normalized * 0.9
      default:
        return null
    }
  }

  // Dunlop Slash Wah SW95
  if (pedalId === 'slash-wah-sw95') {
    switch (paramName) {
      case 'sweep':
        // Source: min: 350, max: 2100, default: 850 (Hz)
        return 350 + normalized * 1750
      case 'Q':
      case 'q':
        // Source: min: 4, max: 12, default: 8
        return 4 + normalized * 8
      case 'boost':
        // Source: min: 0.0, max: 1.0, default: 0.6
        return normalized
      default:
        return null
    }
  }

  // MXR EVH Wah
  if (pedalId === 'evh-wah') {
    switch (paramName) {
      case 'sweep':
        // Source: min: 350, max: 1900, default: 820 (Hz)
        return 350 + normalized * 1550
      case 'Q':
      case 'q':
        // Source: min: 3, max: 10, default: 6
        return 3 + normalized * 7
      case 'volume':
        // Source: min: 0.5, max: 1.4, default: 1.0
        return 0.5 + normalized * 0.9
      default:
        return null
    }
  }

  // MXR KH95 Wah
  if (pedalId === 'kh95-wah') {
    switch (paramName) {
      case 'sweep':
        // Source: min: 330, max: 2100, default: 860 (Hz)
        return 330 + normalized * 1770
      case 'Q':
      case 'q':
        // Source: min: 5, max: 12, default: 9
        return 5 + normalized * 7
      case 'gain':
        // Source: min: 0.5, max: 1.5, default: 1.1
        return 0.5 + normalized * 1.0
      default:
        return null
    }
  }

  // RMC Custom Wah
  if (pedalId === 'rmc-wah') {
    switch (paramName) {
      case 'sweep':
        // Source: min: 300, max: 2200, default: 900 (Hz)
        return 300 + normalized * 1900
      case 'Q':
      case 'q':
        // Source: min: 4, max: 12, default: 8
        return 4 + normalized * 8
      case 'bass':
        // Source: min: -6, max: 6, default: 0
        return (normalized - 0.5) * 12
      default:
        return null
    }
  }

  // BOOST
  // Colorsound Power Booster
  if (pedalId === 'power-booster') {
    switch (paramName) {
      case 'gain':
        // Source: min: 0.5, max: 2.0, default: 1.2
        return 0.5 + normalized * 1.5
      case 'treble':
        // Source: min: -1, max: 1, default: 0.2
        return (normalized - 0.5) * 2 + 0.2
      case 'bass':
        // Source: min: -1, max: 1, default: 0.4
        return (normalized - 0.5) * 2 + 0.4
      default:
        return null
    }
  }

  // Clean Boost
  if (pedalId === 'light-boost') {
    switch (paramName) {
      case 'level':
        // Source: min: 0.5, max: 2.0, default: 1.2
        return 0.5 + normalized * 1.5
      case 'tone':
        // Source: min: 0.3, max: 0.8, default: 0.5
        return 0.3 + normalized * 0.5
      default:
        return null
    }
  }

  // MXR MC-402
  if (pedalId === 'mxr-mc402') {
    switch (paramName) {
      case 'boost':
        // Source: min: 0.5, max: 2.0, default: 1.3
        return 0.5 + normalized * 1.5
      case 'drive':
        // Source: min: 0.1, max: 0.8, default: 0.4
        return 0.1 + normalized * 0.7
      case 'tone':
        // Source: min: 0.3, max: 0.8, default: 0.5
        return 0.3 + normalized * 0.5
      default:
        return null
    }
  }

  // COMPRESSOR
  // MXR Dyna Comp
  if (pedalId === 'mxr-dyna-comp') {
    switch (paramName) {
      case 'output':
        // Source: min: 0.5, max: 1.5, default: 1.0
        return 0.5 + normalized * 1.0
      case 'sensitivity':
        // Source: min: 0.1, max: 1.0, default: 0.6
        return 0.1 + normalized * 0.9
      default:
        return null
    }
  }

  // NOISE GATE
  // ISP Decimator
  if (pedalId === 'noise-gate') {
    switch (paramName) {
      case 'threshold':
        // Source: min: -80, max: -10, default: -45
        return -80 + normalized * 70
      case 'release':
        // Source: min: 0.01, max: 0.5, default: 0.1
        return 0.01 + normalized * 0.49
      default:
        return null
    }
  }

  // OCTAVER / VIBE / PITCH / ROTARY (AudioWorklet)
  // Octavia
  if (pedalId === 'octavia-fuzz') {
    switch (paramName) {
      case 'fuzz':
        // Source: min: 0.3, max: 1.0, default: 0.7
        return 0.3 + normalized * 0.7
      case 'octave':
        // Source: min: 0.0, max: 1.0, default: 1.0
        return normalized
      case 'level':
        // Source: min: 0.5, max: 1.4, default: 1.0
        return 0.5 + normalized * 0.9
      default:
        return null
    }
  }

  // Uni-Vibe
  if (pedalId === 'univibe') {
    switch (paramName) {
      case 'speed':
        // Source: min: 0.1, max: 6, default: 1.2
        return 0.1 + normalized * 5.9
      case 'intensity':
        // Source: min: 0.2, max: 1.0, default: 0.6
        return 0.2 + normalized * 0.8
      case 'mix':
        // Source: min: 0.3, max: 1.0, default: 0.6
        return 0.3 + normalized * 0.7
      default:
        return null
    }
  }

  // DigiTech Whammy
  if (pedalId === 'digitech-whammy') {
    switch (paramName) {
      case 'interval':
        // Source: min: -12, max: 24, default: 12
        return -12 + normalized * 36
      case 'mix':
        // Source: min: 0.2, max: 1.0, default: 0.7
        return 0.2 + normalized * 0.8
      case 'tracking':
        // Source: min: 0.0, max: 1.0, default: 0.7
        return normalized
      default:
        return null
    }
  }

  // Leslie Rotary
  if (pedalId === 'leslie-rotary') {
    switch (paramName) {
      case 'speed':
        // Source: min: 0.1, max: 8, default: 3
        return 0.1 + normalized * 7.9
      case 'depth':
        // Source: min: 0.2, max: 1.0, default: 0.8
        return 0.2 + normalized * 0.8
      case 'mix':
        // Source: min: 0.2, max: 1.0, default: 0.6
        return 0.2 + normalized * 0.8
      default:
        return null
    }
  }

  return null // Pas de config spécifique, utiliser les valeurs par défaut
}

/**
 * Mappe les paramètres de la pédale (0-100) vers les valeurs Web Audio API
 * Utilise les configurations spécifiques par pédale quand disponibles
 */
export function mapParameterToAudioValue(
  pedalType: string,
  paramName: string,
  value: number, // 0-100
  pedalId?: string // ID de la pédale pour config spécifique
): number {
  const normalized = value / 100

  // Essayer d'abord la configuration spécifique de la pédale
  if (pedalId) {
    const specificValue = getPedalSpecificAudioConfig(pedalId, paramName, value)
    if (specificValue !== null) {
      return specificValue
    }
  }

  switch (pedalType) {
    // DISTORTION
    case 'distortion':
      switch (paramName) {
        case 'distortion':
        case 'gain':
          // Drive: 0-100 -> 0.1-20 (gain multiplicatif)
          return 0.1 + normalized * 19.9
        case 'tone':
          // Tone: 0-100 -> 200-8000 Hz (filtre passe-bas)
          return 200 + normalized * 7800
        case 'level':
        case 'volume':
          // Level: 0-100 -> 0-2 (gain)
          return normalized * 2
        case 'filter':
          // Filter (RAT): 0-100 -> 200-20000 Hz
          return 200 + normalized * 19800
        default:
          return normalized
      }

    // OVERDRIVE
    case 'overdrive':
      switch (paramName) {
        case 'drive':
        case 'gain':
          // Drive: 0-100 -> 0.3-10
          return 0.3 + normalized * 9.7
        case 'tone':
          // Tone: 0-100 -> 300-5000 Hz (boost médiums)
          return 300 + normalized * 4700
        case 'level':
        case 'volume':
        case 'output':
          // Level: 0-100 -> 0-2
          return normalized * 2
        case 'treble':
          // Treble: 0-100 -> 2000-10000 Hz
          return 2000 + normalized * 8000
        default:
          return normalized
      }

    // FUZZ
    case 'fuzz':
      switch (paramName) {
        case 'fuzz':
        case 'sustain':
        case 'gain':
          // Fuzz: 0-100 -> 0.5-30 (gain très élevé)
          return 0.5 + normalized * 29.5
        case 'tone':
          // Tone: 0-100 -> 200-6000 Hz
          return 200 + normalized * 5800
        case 'volume':
          // Volume: 0-100 -> 0-2
          return normalized * 2
        case 'gate':
          // Gate: 0-100 -> -60 to -10 dB
          return -60 + normalized * 50
        case 'comp':
          // Comp: 0-100 -> 0.1-10
          return 0.1 + normalized * 9.9
        case 'stab':
          // Stab: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // CHORUS
    case 'chorus':
      switch (paramName) {
        case 'rate':
          // Rate: 0-100 -> 0.1-10 Hz (LFO)
          return 0.1 + normalized * 9.9
        case 'depth':
          // Depth: 0-100 -> 0.001-0.02 (modulation)
          return 0.001 + normalized * 0.019
        case 'level':
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        case 'equalizer':
          // EQ: 0-100 -> 500-5000 Hz
          return 500 + normalized * 4500
        default:
          return normalized
      }

    // DELAY
    case 'delay':
      switch (paramName) {
        case 'time':
        case 'delay':
          // Time: 0-100 -> 0.01-1 second (10ms-1000ms)
          return 0.01 + normalized * 0.99
        case 'feedback':
        case 'repeat':
          // Feedback: 0-100 -> 0-0.9
          return normalized * 0.9
        case 'level':
        case 'mix':
        case 'blend':
          // Mix: 0-100 -> 0-1
          return normalized
        case 'tone':
          // Tone: 0-100 -> 200-8000 Hz
          return 200 + normalized * 7800
        case 'intensity':
          // Intensity: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // REVERB
    case 'reverb':
      switch (paramName) {
        case 'decay':
        case 'reverb':
          // Decay: 0-100 -> 0.1-10 seconds
          return 0.1 + normalized * 9.9
        case 'tone':
          // Tone: 0-100 -> 200-8000 Hz
          return 200 + normalized * 7800
        case 'level':
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // FLANGER
    case 'flanger':
      switch (paramName) {
        case 'rate':
          // Rate: 0-100 -> 0.1-5 Hz
          return 0.1 + normalized * 4.9
        case 'depth':
          // Depth: 0-100 -> 0.001-0.01
          return 0.001 + normalized * 0.009
        case 'feedback':
        case 'regen':
          // Feedback: 0-100 -> 0-0.8
          return normalized * 0.8
        case 'manual':
          // Manual: 0-100 -> 0.001-0.01
          return 0.001 + normalized * 0.009
        case 'range':
        case 'width':
          // Range: 0-100 -> 0.001-0.01
          return 0.001 + normalized * 0.009
        case 'color':
          // Color: 0-100 -> 500-5000 Hz
          return 500 + normalized * 4500
        case 'resonance':
          // Resonance: 0-100 -> 0-0.9
          return normalized * 0.9
        default:
          return normalized
      }

    // TREMOLO
    case 'tremolo':
      switch (paramName) {
        case 'rate':
        case 'speed':
          // Rate: 0-100 -> 0.5-15 Hz
          return 0.5 + normalized * 14.5
        case 'depth':
          // Depth: 0-100 -> 0-1
          return normalized
        case 'volume':
        case 'vol':
          // Volume: 0-100 -> 0-2
          return normalized * 2
        case 'intensity':
          // Intensity: 0-100 -> 0-1
          return normalized
        case 'wave':
          // Wave: 0-100 -> 0-1 (forme d'onde)
          return normalized
        default:
          return normalized
      }

    // PHASER
    case 'phaser':
      switch (paramName) {
        case 'rate':
          // Rate: 0-100 -> 0.1-5 Hz
          return 0.1 + normalized * 4.9
        case 'depth':
          // Depth: 0-100 -> 0-1
          return normalized
        case 'feedback':
          // Feedback: 0-100 -> 0-0.9
          return normalized * 0.9
        case 'resonance':
          // Resonance: 0-100 -> 0-20
          return normalized * 20
        case 'color':
          // Color: 0-100 -> 200-2000 Hz
          return 200 + normalized * 1800
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // EQ
    case 'eq':
      switch (paramName) {
        case 'bass':
        case 'low':
          // Bass: -15/+15 dB -> -12/+12 dB
          return (normalized - 0.5) * 24
        case 'middle':
        case 'mid':
        case 'lowMid':
        case 'highMid':
          // Mid: -15/+15 dB -> -12/+12 dB
          return (normalized - 0.5) * 24
        case 'treble':
        case 'high':
          // Treble: -15/+15 dB -> -12/+12 dB
          return (normalized - 0.5) * 24
        case 'level':
          // Level: 0-100 -> 0-2
          return normalized * 2
        default:
          // Pour les bandes spécifiques (100Hz, 200Hz, etc.)
          if (paramName.includes('Hz') || paramName.includes('khz') || paramName.includes('kHz')) {
            return (normalized - 0.5) * 30 // ±15 dB
          }
          return (normalized - 0.5) * 24 // ±12 dB par défaut
      }

    // COMPRESSOR
    case 'compressor':
      switch (paramName) {
        case 'output':
          // Output: 0-100 -> 0-2
          return normalized * 2
        case 'sensitivity':
          // Sensitivity: 0-100 -> -60 to 0 dB
          return -60 + normalized * 60
        default:
          return normalized
      }

    // NOISE GATE
    case 'noisegate':
      switch (paramName) {
        case 'threshold':
          // Threshold: 0-100 -> -60 to -10 dB
          return -60 + normalized * 50
        case 'release':
          // Release: 0-100 -> 0.01-1 second
          return 0.01 + normalized * 0.99
        default:
          return normalized
      }

    // WAH
    case 'wah':
      switch (paramName) {
        case 'sweep':
          // Sweep: 0-100 -> 0-1 (position du filtre, 0=300Hz, 1=2kHz)
          return normalized
        case 'Q':
        case 'q':
          // Q: 0-100 -> 0.1-20 (résonance)
          return 0.1 + normalized * 19.9
        case 'level':
        case 'volume':
          // Level: 0-100 -> 0-2
          return normalized * 2
        case 'boost':
          // Boost: 0-100 -> 0-15 dB
          return normalized * 15
        case 'gain':
          // Gain: 0-100 -> 0-30 dB
          return normalized * 30
        case 'bass':
          // Bass: 0-100 -> 50-500 Hz (pour RMC Custom Wah)
          return 50 + normalized * 450
        default:
          return normalized
      }

    // BOOST
    case 'boost':
      switch (paramName) {
        case 'gain':
        case 'level':
          // Gain: 0-100 -> 0-20 dB
          return normalized * 20
        case 'treble':
          // Treble: -20/+20 dB -> -20/+20 dB
          return (normalized - 0.5) * 40
        case 'bass':
          // Bass: -20/+20 dB -> -20/+20 dB
          return (normalized - 0.5) * 40
        case 'tone':
          // Tone: 0-100 -> 200-5000 Hz
          return 200 + normalized * 4800
        default:
          return normalized
      }

    // OCTAVIA
    case 'octavia':
      switch (paramName) {
        case 'fuzz':
          // Fuzz: 0-100 -> 0-1
          return normalized
        case 'octave':
          // Octave: 0-100 -> 0-1 (mix octave supérieure)
          return normalized
        case 'level':
          // Level: 0-100 -> 0-2
          return normalized * 2
        default:
          return normalized
      }

    // UNI-VIBE
    case 'univibe':
      switch (paramName) {
        case 'speed':
          // Speed: 0-100 -> 0.1-10 Hz
          return 0.1 + normalized * 9.9
        case 'intensity':
          // Intensity: 0-100 -> 0-1
          return normalized
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // PITCH SHIFTER / WHAMMY
    case 'pitch':
      switch (paramName) {
        case 'interval':
          // Interval: 0-100 -> -12 to +12 demi-tons
          return (normalized - 0.5) * 24
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        case 'tracking':
          // Tracking: 0-100 -> 0-1 (sensibilité)
          return normalized
        default:
          return normalized
      }

    // ROTARY
    case 'rotary':
      switch (paramName) {
        case 'speed':
          // Speed: 0-100 -> 0-1 (0=slow, 1=fast)
          return normalized
        case 'depth':
          // Depth: 0-100 -> 0-1
          return normalized
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // OCTAVER
    case 'octaver':
      switch (paramName) {
        case 'octave':
          // Octave: 0-100 -> -1, 0, +1
          return Math.round((normalized - 0.5) * 2)
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        case 'tracking':
          // Tracking: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // VOLUME
    case 'volume':
      switch (paramName) {
        case 'volume':
          // Volume: 0-100 -> 0-1
          return normalized
        case 'taper':
          // Taper: 0-100 -> 0-1 (0=lin, 100=log)
          return normalized
        default:
          return normalized
      }

    // RING MODULATOR
    case 'ringmod':
      switch (paramName) {
        case 'frequency':
          // Frequency: 0-100 -> 20-2000 Hz
          return 20 + normalized * 1980
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        case 'level':
          // Level: 0-100 -> 0-2
          return normalized * 2
        default:
          return normalized
      }

    // BIT CRUSHER
    case 'bitcrusher':
      switch (paramName) {
        case 'bits':
          // Bits: 0-100 -> 1-16 bits
          return 1 + normalized * 15
        case 'sampleRate':
          // Sample Rate: 0-100 -> 1000-44100 Hz
          return 1000 + normalized * 43100
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // LO-FI
    case 'lofi':
      switch (paramName) {
        case 'saturation':
          // Saturation: 0-100 -> 0-5
          return normalized * 5
        case 'wow':
          // Wow: 0-100 -> 0-1 (intensité)
          return normalized
        case 'flutter':
          // Flutter: 0-100 -> 0-1 (intensité)
          return normalized
        case 'tone':
          // Tone: 0-100 -> 500-5000 Hz
          return 500 + normalized * 4500
        default:
          return normalized
      }

    // TAPE DELAY
    case 'tapedelay':
      switch (paramName) {
        case 'time':
          // Time: 0-100 -> 0.01-2 seconds
          return 0.01 + normalized * 1.99
        case 'feedback':
          // Feedback: 0-100 -> 0-0.9
          return normalized * 0.9
        case 'saturation':
          // Saturation: 0-100 -> 0-3
          return normalized * 3
        case 'wow':
          // Wow: 0-100 -> 0-1
          return normalized
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // SPRING REVERB
    case 'springreverb':
      switch (paramName) {
        case 'decay':
          // Decay: 0-100 -> 0.1-5 seconds
          return 0.1 + normalized * 4.9
        case 'tone':
          // Tone: 0-100 -> 200-8000 Hz
          return 200 + normalized * 7800
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // SHIMMER REVERB
    case 'shimmerreverb':
      switch (paramName) {
        case 'decay':
          // Decay: 0-100 -> 0.1-10 seconds
          return 0.1 + normalized * 9.9
        case 'pitch':
          // Pitch: 0-100 -> -12 to +12 semitones
          return (normalized - 0.5) * 24
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // CABINET
    case 'cabinet':
      switch (paramName) {
        case 'mix':
          // Mix: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    // ROOM
    case 'room':
      switch (paramName) {
        case 'size':
          // Size: 0-100 -> 0-1
          return normalized
        case 'reverb':
          // Reverb: 0-100 -> 0-1
          return normalized
        case 'position':
          // Position: 0-100 -> 0-1
          return normalized
        case 'damping':
          // Damping: 0-100 -> 0-1
          return normalized
        default:
          return normalized
      }

    default:
      return normalized
  }
}

/**
 * Crée une configuration audio pour une pédale
 */
export function createPedalAudioConfig(
  pedalModel: PedalModel,
  parameters?: Record<string, number>
): PedalAudioConfig {
  const config: PedalAudioConfig = {
    pedalId: pedalModel.id,
    enabled: true,
    parameters: {}
  }

  // Initialiser les paramètres avec les valeurs par défaut ou fournies
  Object.entries(pedalModel.parameters).forEach(([name, def]) => {
    config.parameters[name] = parameters?.[name] ?? def.default
  })

  return config
}

/**
 * Valide une configuration de pedalboard
 */
export function validatePedalboardConfig(config: PedalboardConfig): boolean {
  if (!config.effects || !Array.isArray(config.effects)) {
    return false
  }

  return config.effects.every(effect => {
    return effect.pedalId && typeof effect.enabled === 'boolean'
  })
}

