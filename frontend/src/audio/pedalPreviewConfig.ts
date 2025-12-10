/**
 * Configuration audio spécifique pour chaque pédale
 * Chaque pédale a son propre timbre et caractéristiques sonores
 */

import { PedalModel } from '../data/pedals'

export interface PedalPreviewConfig {
  // Configuration du synth
  synthType: 'sawtooth' | 'square' | 'triangle' | 'sine'
  synthEnvelope: {
    attack: number
    decay: number
    sustain: number
    release: number
  }
  
  // Configuration du filtre guitare
  filterFreq: number
  filterQ: number
  filterType: 'lowpass' | 'highpass' | 'bandpass'
  
  // Configuration de l'effet (sera combiné avec les paramètres de la pédale)
  effectConfig?: {
    distortionAmount?: number
    overdriveAmount?: number
    reverbRoom?: number
    delayTime?: number
    chorusRate?: number
    phaserRate?: number
    tremoloRate?: number
    eqBoost?: { bass: number; mid: number; treble: number }
  }
  
  // Accords spécifiques (optionnel, sinon utilise les accords par défaut)
  chords?: string[][]
}

// Configuration par pédale
const pedalConfigs: Record<string, PedalPreviewConfig> = {
  // DISTORTION - Metal, agressif, tranchant
  // BOSS DS-1 : mid-scooped, aggressive, silicon hard clipping
  // Source: distortion: 0.2-0.85 (default: 0.55), tone: 0.3-0.8 (default: 0.5), level: 0.5-1.2 (default: 0.8)
  'boss-ds1': {
    synthType: 'sawtooth', // Riche en harmoniques pour le clipping dur
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.4 }, // Attaque instantanée, sustain faible
    filterFreq: 3500, // Filtre haut pour maintenir la brillance malgré le scoop médian
    filterQ: 2.5, // Q élevé pour le caractère mordant
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 0.55, // Valeur par défaut de la source (0.55)
      eqBoost: { bass: 2, mid: -3, treble: 4 } // Scoop médian à ~500Hz, accentue basses et aigus
    }
  },
  // ProCo RAT : grainy, fat mids, filter-based tone control
  // Source: distortion: 0.3-1.0 (default: 0.7), filter: 0.0-1.0 (default: 0.5), volume: 0.5-1.3 (default: 0.9)
  'proco-rat': {
    synthType: 'square', // Son synthétique caractéristique
    synthEnvelope: { attack: 0.01, decay: 0.4, sustain: 0.3, release: 0.5 }, // Sustain modéré pour la tenue
    filterFreq: 1200, // Cible la bosse médiane à ~1kHz (au lieu de 3200Hz)
    filterQ: 3.5, // Q très élevé pour accentuer la résonance médiane
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 0.7, // Valeur par défaut de la source (0.7)
      eqBoost: { bass: 0, mid: 4, treble: 1 } // Bosse médiane autour de 1kHz
    }
  },
  // Ibanez Tube Screamer : mid-hump, smooth clipping
  // Source: drive: 0.1-0.75 (default: 0.4), tone: 0.25-0.7 (default: 0.5), level: 0.6-1.3 (default: 0.9)
  'ibanez-tube-screamer': {
    synthType: 'sawtooth', // Riche pour la saturation douce
    synthEnvelope: { attack: 0.01, decay: 0.25, sustain: 0.4, release: 0.3 }, // Sustain modéré pour la douceur
    filterFreq: 750, // Cible la bosse médiane à 700-800Hz (au lieu de 2200Hz)
    filterQ: 1.5, // Q modéré pour centrer la bosse médiane
    filterType: 'lowpass',
    effectConfig: {
      overdriveAmount: 0.4, // Valeur par défaut de la source (0.4)
      eqBoost: { bass: -2, mid: 5, treble: -2 } // Bosse médiane, atténue extrêmes (aigus >723Hz et graves <720Hz)
    }
  },
  // Electro-Harmonix Big Muff : scooped mids, huge sustain
  // Source: sustain: 0.4-1.0 (default: 0.75), tone: 0.2-0.9 (default: 0.6), volume: 0.6-1.4 (default: 1.0)
  'electro-harmonix-big-muff': {
    synthType: 'square', // Riche en harmoniques pour le sustain légendaire
    synthEnvelope: { attack: 0.01, decay: 0.5, sustain: 0.5, release: 0.6 }, // Sustain modéré pour le son épais et soutenu
    filterFreq: 1000, // Creux marqué autour de 1kHz (tone control passif en fin de chaîne)
    filterQ: 0.5, // Q bas pour simuler l'atténuation centrale, met en avant basses et hautes
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 0.75 // Valeur par défaut de la source (0.75)
    }
  },
  // Walrus Audio Distortion : mode-dependent (DARK, SI, LED)
  // Source: gain: 0.2-1.0 (default: 0.7), tone: 0.2-0.8 (default: 0.5), vol: 0.6-1.3 (default: 0.9)
  'walrus-audio-distortion': {
    synthType: 'sawtooth', // Forme riche pour le metal
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 }, // Attaque instantanée, sustain faible
    filterFreq: 3400, // Filtre haut pour ne pas atténuer les aigus
    filterQ: 2.2, // Q élevé pour l'agressivité
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 0.7 // Valeur par défaut de la source (0.7)
    }
  },
  
  // OVERDRIVE - Rond, chaud, hardrock/blues
  // BOSS SD-1 : asymmetric clipping, bright TS-type drive
  // Source: drive: 0.15-0.8 (default: 0.45), tone: 0.3-0.75 (default: 0.55), level: 0.6-1.2 (default: 0.9)
  'boss-sd1': {
    synthType: 'triangle', // Plus rond que sawtooth, proche du TS mais plus transparent
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.4 }, // Sustain élevé pour la chaleur
    filterFreq: 2000, // Filtre modéré pour rester dans le registre
    filterQ: 0.8, // Q bas pour la douceur
    filterType: 'lowpass',
    effectConfig: {
      overdriveAmount: 0.45, // Valeur par défaut de la source (0.45)
      eqBoost: { bass: -1, mid: 4, treble: -1 } // Bosse médiane similaire au TS
    }
  },
  // Fulltone OCD : amp-like, wide frequency, modes HP/LP
  // Source: drive: 0.1-0.9 (default: 0.5), tone: 0.3-0.85 (default: 0.6), volume: 0.6-1.4 (default: 1.0)
  'fulltone-ocd': {
    synthType: 'triangle', // Douceur du MOSFET clipping
    synthEnvelope: { attack: 0.01, decay: 0.35, sustain: 0.6, release: 0.45 }, // Sustain élevé pour le grain ouvert et dynamique
    filterFreq: 2100, // Filtre modéré pour ne pas trop trancher
    filterQ: 0.9, // Q modéré
    filterType: 'lowpass',
    effectConfig: {
      overdriveAmount: 0.5 // Valeur par défaut de la source (0.5)
    }
  },
  // Klon Centaur : clean+drive blending, transparent, mid sweetener
  // Source: gain: 0.05-0.6 (default: 0.25), treble: 0.3-0.7 (default: 0.55), output: 0.8-1.5 (default: 1.1)
  'klon-centaur': {
    synthType: 'sine', // Le plus rond et transparent
    synthEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.7, release: 0.3 }, // Sustain très élevé pour l'ouverture
    filterFreq: 2400, // Filtre modéré pour laisser passer le bas du spectre
    filterQ: 0.7, // Q très doux
    filterType: 'lowpass',
    effectConfig: {
      overdriveAmount: 0.25, // Valeur par défaut de la source (0.25)
      eqBoost: { bass: 2, mid: 4, treble: 1 } // Bosse légère mid-low pour la rondeur, "ouvre le son"
    }
  },
  // Ibanez TS Mini : TS-9 but darker and rounder
  // Source: drive: 0.15-0.8 (default: 0.45), tone: 0.2-0.7 (default: 0.5), level: 0.6-1.2 (default: 0.9)
  'ibanez-tube-screamer-mini': {
    synthType: 'sawtooth', // Même base que le TS808 mais plus sombre
    synthEnvelope: { attack: 0.01, decay: 0.25, sustain: 0.4, release: 0.3 }, // Même enveloppe que le TS
    filterFreq: 700, // Légèrement plus bas pour le caractère "darker"
    filterQ: 1.3, // Q légèrement plus bas pour plus de rondeur
    filterType: 'lowpass',
    effectConfig: {
      overdriveAmount: 0.45, // Valeur par défaut de la source (0.45)
      eqBoost: { bass: -2, mid: 5, treble: -2 } // Même bosse médiane caractéristique
    }
  },
  // Walrus Audio Drive : modes (SMOOTH, CRUNCH, BRIGHT)
  // Source: gain: 0.2-0.9 (default: 0.5), tone: 0.25-0.85 (default: 0.6), vol: 0.6-1.3 (default: 1.0)
  'walrus-audio-drive': {
    synthType: 'triangle',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.4 },
    filterFreq: 2200,
    filterQ: 0.9,
    filterType: 'lowpass',
    effectConfig: {
      overdriveAmount: 0.5 // Valeur par défaut de la source (0.5)
    }
  },
  
  // FUZZ - Niveau au-dessus de la distortion, extrême
  // Dunlop Fuzz Face : warm, vintage, dynamic, germanium-like cleanup
  // Source: fuzz: 0.4-1.0 (default: 0.75), volume: 0.7-1.4 (default: 1.0)
  'dunlop-fuzz-face': {
    synthType: 'square', // Très riche en harmoniques pour le clipping asymétrique puis dur
    synthEnvelope: { attack: 0.01, decay: 0.7, sustain: 0.7, release: 0.8 }, // Enveloppe très longue pour le sustain "flou"
    filterFreq: 800, // Très bas pour couper massivement les hautes fréquences
    filterQ: 0.4, // Q très bas pour le son épais et peu clair
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 0.75 // Valeur par défaut de la source (0.75)
    }
  },
  // ZVEX Fuzz Factory : unstable, oscillating, experimental
  // Source: gate: 0.0-1.0 (default: 0.2), comp: 0.2-0.8 (default: 0.5), drive: 0.4-1.0 (default: 0.7), stab: 0.2-1.0 (default: 0.9), volume: 0.7-1.5 (default: 1.0)
  'zvex-fuzz-factory': {
    synthType: 'square', // Circuit complexe avec transistors multiples et feedbacks
    synthEnvelope: { attack: 0.01, decay: 0.8, sustain: 0.8, release: 0.9 }, // Sustain extrême
    filterFreq: 600, // Encore plus bas pour écraser le signal
    filterQ: 0.3, // Q très très bas
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 0.7 // Valeur par défaut de la source (0.7)
    }
  },
  // Electro-Harmonix Muff : same as Big Muff Pi
  // Source: sustain: 0.4-1.0 (default: 0.75), tone: 0.2-0.9 (default: 0.6), volume: 0.6-1.4 (default: 1.0)
  'electro-harmonix-muff': {
    synthType: 'square', // Riche en harmoniques
    synthEnvelope: { attack: 0.01, decay: 0.5, sustain: 0.5, release: 0.6 }, // Sustain long pour le son épais
    filterFreq: 1000, // Creux marqué autour de 1kHz (tone control passif)
    filterQ: 0.5, // Q bas pour simuler l'atténuation centrale
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 0.75 // Valeur par défaut de la source (0.75)
    }
  },
  
  // CHORUS - Modulation lente du délai avec LFO pour varier le pitch
  // BOSS CH-1 : digital, bright, wide stereo
  // Source: rate: 0.2-6 (default: 1.6), depth: 0.1-0.8 (default: 0.5), equalizer: 0.3-0.7 (default: 0.5), level: 0.4-1.0 (default: 0.7)
  'boss-ch1': {
    synthType: 'sine', // Doux pour la modulation
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 }, // Enveloppe modérée pour laisser le LFO s'entendre
    filterFreq: 3000, // Filtre standard pour ne pas abaisser les modulations
    filterQ: 1,
    filterType: 'lowpass',
    effectConfig: {
      chorusRate: 1.6 // Valeur par défaut de la source (1.6)
    }
  },
  // BOSS CE-2 : classic warm analog
  // Source: rate: 0.3-7 (default: 1.2), depth: 0.3-0.9 (default: 0.7), level: 0.4-1.0 (default: 0.7)
  'boss-ce2': {
    synthType: 'sine', // Doux pour la modulation
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 }, // Enveloppe modérée pour laisser le LFO s'entendre
    filterFreq: 3000, // Filtre standard pour ne pas abaisser les modulations
    filterQ: 1,
    filterType: 'lowpass',
    effectConfig: {
      chorusRate: 1.2 // Valeur par défaut de la source (1.2)
    }
  },
  // Electro-Harmonix Small Clone : warm, deep, analog
  // Source: rate: 0.1-4 (default: 1.2), depth: 0.5-1.0 (default: 0.75)
  'electro-harmonix-small-clone': {
    synthType: 'sine', // Vintage simple
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3100,
    filterQ: 0.9,
    filterType: 'lowpass',
    effectConfig: {
      chorusRate: 1.2 // Valeur par défaut de la source (1.2)
    }
  },
  // Walrus Audio Chorus : modes (LIGHT, MEDIUM, HEAVY)
  // Source: rate: 0.1-5 (default: 1.5), depth: 0.2-0.9 (default: 0.6), mix: 0.2-0.8 (default: 0.5)
  'walrus-audio-chorus': {
    synthType: 'sine', // Moderne
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      chorusRate: 1.5 // Valeur par défaut de la source (1.5)
    }
  },
  // Electro-Harmonix Oceans 11 Chorus
  // Source: rate: 0.1-5 (default: 1.3), depth: 0.1-0.8 (default: 0.6), mix: 0.2-0.8 (default: 0.5)
  'electro-harmonix-oceans-11': {
    synthType: 'sine', // Multi-effets Chorus/Vibrato + Reverb
    synthEnvelope: { attack: 0.01, decay: 0.45, sustain: 0.3, release: 0.65 },
    filterFreq: 3100,
    filterQ: 1.05,
    filterType: 'lowpass',
    effectConfig: {
      chorusRate: 1.3 // Valeur par défaut de la source (1.3)
    }
  },
  // BOSS CE-1 : classic warm analog
  // Source: rate: 0.3-7 (default: 1.2), depth: 0.3-0.9 (default: 0.7), level: 0.4-1.0 (default: 0.7)
  'boss-ce1': {
    synthType: 'sine', // Vintage stéréo
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 2800, // Légèrement plus bas pour le caractère vintage
    filterQ: 0.8,
    filterType: 'lowpass',
    effectConfig: {
      chorusRate: 1.2 // Valeur par défaut de la source (1.2)
    }
  },
  // MXR Analog Chorus
  // Source: rate: 0.2-6 (default: 1.6), depth: 0.2-0.8 (default: 0.6), level: 0.4-1.0 (default: 0.7)
  'mxr-analog-chorus': {
    synthType: 'sine', // Analogique chaud
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 2900,
    filterQ: 1.2, // Q légèrement plus élevé pour la chaleur
    filterType: 'lowpass',
    effectConfig: {
      chorusRate: 1.6 // Valeur par défaut de la source (1.6)
    }
  },
  
  // DELAY - Digital vs Analog/Tape
  // BOSS DD-3 : clean digital delay
  // Source: time: 0.02-0.8 (default: 0.45), feedback: 0.1-0.9 (default: 0.4), level: 0.2-1.0 (default: 0.5)
  'boss-dd3': {
    synthType: 'sawtooth', // Neutre/brillant pour delay numérique
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 }, // Enveloppe rapide, le delay ne modifie pas l'attaque
    filterFreq: 3000, // Filtre haut pour delay numérique clair
    filterQ: 1.0, // Q modéré
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.45 // Valeur par défaut de la source (0.45)
    }
  },
  // TC Electronic Flashback
  // Source: time: 0.02-1.5 (default: 0.45), feedback: 0.1-0.95 (default: 0.4), mix: 0.2-0.8 (default: 0.5)
  'tc-electronic-flashback': {
    synthType: 'sawtooth', // Digital avec modes multiples
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000, // Filtre haut pour clarté numérique
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.45 // Valeur par défaut de la source (0.45)
    }
  },
  // Walrus Audio Delay : modes (DIGITAL, ANALOG, REVERSE)
  // Source: time: 0.02-1.5 (default: 0.4), feedback: 0.1-0.95 (default: 0.5), mix: 0.2-0.8 (default: 0.5)
  'walrus-audio-delay': {
    synthType: 'sawtooth', // Modes analog/digital/reverse
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000, // Filtre haut pour modes numériques
    filterQ: 1.2,
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.4 // Valeur par défaut de la source (0.4)
    }
  },
  // Strymon Timeline : studio-grade digital delay
  // Source: time: 0.01-2.0 (default: 0.45), repeats: 0.1-0.95 (default: 0.45), mix: 0.2-0.8 (default: 0.4)
  'strymon-timeline': {
    synthType: 'sawtooth', // Neutre pour multi-modes
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000, // Filtre haut pour clarté professionnelle
    filterQ: 1.2,
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.45 // Valeur par défaut de la source (0.45)
    }
  },
  // Echoplex EP-3 : tape delay with preamp coloration
  // Source: time: 0.07-0.7 (default: 0.35), repeat: 0.1-0.85 (default: 0.45), mix: 0.2-0.8 (default: 0.5)
  'echoplex-tape-delay': {
    synthType: 'sawtooth', // Tape delay chaud et organique
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2500, // Filtre plus bas pour perte de hautes fréquences de la bande
    filterQ: 0.9, // Q bas pour le caractère chaud
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.35 // Valeur par défaut de la source (0.35)
    }
  },
  // Binson Echorec : multi-head magnetic drum echo
  // Source: repeat: 0.1-0.9 (default: 0.5), tone: 0.2-0.8 (default: 0.5)
  'binson-echorec': {
    synthType: 'sawtooth', // Delay à disque magnétique
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2700, // Filtre modéré pour caractère vintage
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.45 // Caractère emblématique
    }
  },
  // Deluxe Memory Man : analog BBD delay, dark, modulated
  // Source: delay: 0.03-0.55 (default: 0.3), feedback: 0.1-0.85 (default: 0.45), blend: 0.2-0.8 (default: 0.5)
  'memory-man-delay': {
    synthType: 'sawtooth', // Delay analogique doux et chaleureux
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2600, // Filtre bas pour perte analogique
    filterQ: 0.8, // Q bas pour la douceur
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.3 // Valeur par défaut de la source (0.3)
    }
  },
  // Roland RE-201 : tape echo with wow/flutter
  // Source: repeat: 0.1-0.95 (default: 0.5), intensity: 0.1-0.95 (default: 0.6), echo_volume: 0.2-1.0 (default: 0.5)
  'roland-space-echo': {
    synthType: 'sawtooth', // Echo bande à ressorts
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2800, // Filtre modéré
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.5 // Temps long caractéristique
    }
  },
  // TC 2290 : 80s high-definition digital delay
  // Source: delay: 0.02-1.0 (default: 0.45), feedback: 0.1-0.9 (default: 0.5), mix: 0.2-0.8 (default: 0.4)
  'tc-delay': {
    synthType: 'sawtooth', // Digital 2290 style, clair et précis
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3100, // Filtre haut pour clarté numérique
    filterQ: 1.2,
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.45 // Valeur par défaut de la source (0.45)
    }
  },
  
  // REVERB - Différents types selon room size et decay
  // BOSS RV-6
  // Source: decay: 0.3-8.0 (default: 2.5), tone: 0.2-0.8 (default: 0.5), level: 0.2-1.0 (default: 0.5)
  'boss-rv6': {
    synthType: 'sine', // Doux pour l'effet diffus
    synthEnvelope: { attack: 0.01, decay: 0.4, sustain: 0.3, release: 0.6 }, // Decay modéré pour multi-mode
    filterFreq: 3000, // Filtre standard
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      reverbRoom: 0.6 // Room size modéré pour multi-mode
    }
  },
  // Electro-Harmonix Holy Grail
  // Source: reverb: 0.2-1.0 (default: 0.6)
  'electro-harmonix-holy-grail': {
    synthType: 'sine', // Reverb spring classique
    synthEnvelope: { attack: 0.01, decay: 0.4, sustain: 0.3, release: 0.6 },
    filterFreq: 3000, // Filtre pour laisser passer les médiums (résonance métallique du ressort)
    filterQ: 0.9, // Q modéré
    filterType: 'lowpass',
    effectConfig: {
      reverbRoom: 0.5 // Room size court, typique du ressort "confiné"
    }
  },
  // Walrus Audio Reverb : modes (HALL, SPRING, PLATE)
  // Source: decay: 0.3-10.0 (default: 3.0), tone: 0.2-0.8 (default: 0.5), mix: 0.2-0.8 (default: 0.5)
  'walrus-audio-reverb': {
    synthType: 'sine', // Modes hall/spring/plate
    synthEnvelope: { attack: 0.01, decay: 0.45, sustain: 0.3, release: 0.65 },
    filterFreq: 3100,
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      reverbRoom: 0.7 // Room size modéré pour modes variés
    }
  },
  // Strymon BigSky
  // Source: decay: 0.3-12.0 (default: 4.0), tone: 0.2-0.8 (default: 0.5), mix: 0.2-0.8 (default: 0.5)
  'strymon-bigsky': {
    synthType: 'sine', // Doux pour réverb professionnelle
    synthEnvelope: { attack: 0.01, decay: 0.5, sustain: 0.3, release: 0.7 }, // Decay long pour grandes salles
    filterFreq: 3200, // Filtre haut pour clarté
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      reverbRoom: 0.8 // Grande salle pour réverb professionnelle multi-modes
    }
  },
  
  // TREMOLO - Modulation d'amplitude avec LFO
  // BOSS TR-2
  // Source: rate: 0.1-12 (default: 4), depth: 0.2-1.0 (default: 0.7)
  'boss-tr2': {
    synthType: 'sawtooth', // Forme franche pour tremolo optique
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 }, // Enveloppe rapide
    filterFreq: 2800,
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      tremoloRate: 4.0 // Valeur par défaut de la source (4.0)
    }
  },
  // Walrus Audio Tremolo : modes (SINE, SQUARE, RANDOM)
  // Source: rate: 0.1-12 (default: 5), depth: 0.2-1.0 (default: 0.7), vol: 0.5-1.5 (default: 1)
  'walrus-audio-tremolo': {
    synthType: 'sawtooth', // Formes d'onde variées
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2800,
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      tremoloRate: 5.0 // Valeur par défaut de la source (5.0)
    }
  },
  // Fulltone Supa-Trem
  // Source: speed: 0.1-12 (default: 4), depth: 0.2-1.0 (default: 0.7), volume: 0.7-1.5 (default: 1)
  'fulltone-supatrem': {
    synthType: 'sawtooth', // Tremolo optique vintage avec tube amp emulation
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2900, // Légèrement plus haut pour le caractère "passe haut"
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      tremoloRate: 4.0 // Valeur par défaut de la source (4.0)
    }
  },
  // Strymon Flint
  // Source: rate: 0.1-12 (default: 3), depth: 0.2-1.0 (default: 0.6), intensity: 0.2-1.0 (default: 0.8)
  'strymon-flint': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2900,
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      tremoloRate: 3.0 // Valeur par défaut de la source (3.0)
    }
  },
  
  // PHASER - Modulation de phase avec notches balayant le spectre
  // BOSS PH-3
  // Source: rate: 0.2-8 (default: 1.2), depth: 0.2-1.0 (default: 0.7), resonance: 0.2-0.9 (default: 0.5)
  'boss-ph3': {
    synthType: 'sine', // Doux pour la modulation
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 }, // Enveloppe douce
    filterFreq: 3000, // Filtre pour balayage dans médiums/aigus
    filterQ: 1.2, // Q modéré pour notches prononcées
    filterType: 'lowpass',
    effectConfig: {
      phaserRate: 1.2 // Valeur par défaut de la source (1.2)
    }
  },
  // Electro-Harmonix Small Stone
  // Source: rate: 0.2-7 (default: 1.1), color: 0.0-1.0 (default: 0.5)
  'electro-harmonix-small-stone': {
    synthType: 'sine',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3200,
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      phaserRate: 0.8 // Phaser très lent pour effet subtil
    }
  },
  // Mooer Phase 90
  // Source: rate: 0.2-6 (default: 1.2), depth: 0.2-1.0 (default: 0.7)
  'mooer-phaser': {
    synthType: 'sine', // Compact
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      phaserRate: 1.0 // Rate standard pour Phase 90 style
    }
  },
  // Walrus Audio Phaser
  // Source: rate: 0.2-8 (default: 1.3), feedback: 0.1-0.9 (default: 0.6), depth: 0.2-1.0 (default: 0.7)
  'walrus-audio-phaser': {
    synthType: 'sine', // Moderne avec modes
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.2, // Q légèrement plus élevé
    filterType: 'lowpass',
    effectConfig: {
      phaserRate: 1.3 // Valeur par défaut de la source (1.3)
    }
  },
  // MXR Phase 90
  // Source: rate: 0.2-6 (default: 1.2), mix: 0.2-0.8 (default: 0.6)
  'mxr-phase90': {
    synthType: 'sine', // Phaser 4 étages emblématique
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000, // Filtre pour balayage
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      phaserRate: 1.0 // Valeur par défaut de la source (1.2)
    }
  },
  
  // EQ
  'boss-ge7': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1,
    filterType: 'lowpass',
    effectConfig: {
      eqBoost: { bass: 3, mid: 2, treble: 4 }
    }
  },
  
  // WAH - Filtre passe-bande résonant balayé (comme la bouche)
  'dunlop-crybaby': {
    synthType: 'sawtooth', // Forme riche pour le filtre
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 }, // Attaque rapide pour laisser place à la modulation
    filterFreq: 2000, // Centre le pic en haut du spectre, typique d'une wah classique
    filterQ: 5, // Q très élevé pour créer un pic très marqué (résonance)
    filterType: 'bandpass', // Filtre passe-bande résonant caractéristique
    effectConfig: {}
  },
  
  // COMPRESSOR
  'boss-cs3': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1,
    filterType: 'lowpass',
    effectConfig: {}
  },
  'mxr-dyna-comp': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1,
    filterType: 'lowpass',
    effectConfig: {}
  },
  
  // Walrus Audio Fuzz : modes (GATE, CLASSIC, MID+)
  // Source: gain: 0.3-1.0 (default: 0.75), tone: 0.2-0.9 (default: 0.6), vol: 0.7-1.5 (default: 1.0)
  'walrus-audio-fuzz': {
    synthType: 'square',
    synthEnvelope: { attack: 0.01, decay: 0.65, sustain: 0.65, release: 0.75 },
    filterFreq: 850,
    filterQ: 0.45,
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 0.75 // Valeur par défaut de la source (0.75)
    }
  },
  // Eventide Harmonizer : Pitch shifting multi-voix
  'eventide-harmonizer': {
    synthType: 'sine', // Pitch shifting multi-voix
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3200, // Plus haut pour la clarté
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      chorusRate: 2.0 // Rate plus rapide pour harmonizer
    }
  },
  'vox-time-machine': {
    synthType: 'sawtooth', // Signature Satriani, modes vintage/modern
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000, // Filtre modéré
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.4
    }
  },
  'neunaber-reverb': {
    synthType: 'sine', // Ambient stéréo, textures spatiales
    synthEnvelope: { attack: 0.01, decay: 0.5, sustain: 0.3, release: 0.7 }, // Decay long pour ambient
    filterFreq: 3200, // Filtre haut pour clarté
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      reverbRoom: 0.8 // Grande salle pour textures spatiales
    }
  },
  
  // FLANGER (suite)
  'boss-bf3': {
    synthType: 'sine',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.2,
    filterType: 'lowpass',
    effectConfig: {}
  },
  'electro-harmonix-electric-mistress': {
    synthType: 'sine',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3100,
    filterQ: 1.1,
    filterType: 'lowpass',
    effectConfig: {}
  },
  'walrus-audio-flanger': {
    synthType: 'sine',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.2,
    filterType: 'lowpass',
    effectConfig: {}
  },
  'mooer-e-lady': {
    synthType: 'sine',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 2900,
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {}
  },
  'mxr-flanger-117': {
    synthType: 'sine',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.3,
    filterType: 'lowpass',
    effectConfig: {}
  },
  
  // TREMOLO (suite)
  'killswitch-stutter': {
    synthType: 'sawtooth', // Interrupteur momentané pour couper le signal
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1.2,
    filterType: 'lowpass',
    effectConfig: {
      tremoloRate: 8.0 // Rate très rapide pour effet stutter extrême
    }
  },
  
  // PHASER (suite)
  'morley-bad-horsie': {
    synthType: 'sine', // Wah optique signature Vai
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.2,
    filterType: 'lowpass',
    effectConfig: {
      phaserRate: 1.1 // Rate modéré pour balayage large
    }
  },
  'dunlop-crybaby-classic': {
    synthType: 'sine', // Wah classique à induction
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      phaserRate: 0.9 // Rate lent pour effet subtil
    }
  },
  
  // EQ (suite)
  'mxr-10-band-eq': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1,
    filterType: 'lowpass',
    effectConfig: {
      eqBoost: { bass: 2, mid: 1, treble: 2 }
    }
  },
  'source-audio-programmable-eq': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1,
    filterType: 'lowpass',
    effectConfig: {
      eqBoost: { bass: 1, mid: 2, treble: 1 }
    }
  },
  'empress-paraeq': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1,
    filterType: 'lowpass',
    effectConfig: {
      eqBoost: { bass: 1, mid: 1, treble: 1 }
    }
  },
  
  // WAH (suite)
  'vox-v847-wah': {
    synthType: 'sawtooth', // Wah classique et brillante des années 60
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2000, // Centre le pic
    filterQ: 5, // Q élevé pour résonance
    filterType: 'bandpass', // Filtre passe-bande résonant
    effectConfig: {}
  },
  'cry-baby-wah': {
    synthType: 'sawtooth', // La référence des wah modernes
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2000, // Centre le pic
    filterQ: 5.5, // Q légèrement plus élevé
    filterType: 'bandpass',
    effectConfig: {}
  },
  'slash-wah-sw95': {
    synthType: 'sawtooth', // Signature Slash avec boost intégré
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2100, // Légèrement plus haut
    filterQ: 6, // Q plus élevé pour plus de résonance
    filterType: 'bandpass',
    effectConfig: {}
  },
  'evh-wah': {
    synthType: 'sawtooth', // Voicing EVH avec courbe agressive
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2200, // Plus haut pour courbe agressive
    filterQ: 6.5, // Q très élevé
    filterType: 'bandpass',
    effectConfig: {}
  },
  'kh95-wah': {
    synthType: 'sawtooth', // Signature Kirk Hammett pour leads saturés
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2100,
    filterQ: 6.5, // Q très élevé
    filterType: 'bandpass',
    effectConfig: {}
  },
  'rmc-wah': {
    synthType: 'sawtooth', // Wah boutique à plage étendue
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2000,
    filterQ: 6, // Q élevé pour plage étendue
    filterType: 'bandpass',
    effectConfig: {}
  },
  
  // BOOST
  'power-booster': {
    synthType: 'triangle',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.4 },
    filterFreq: 2500,
    filterQ: 0.9,
    filterType: 'lowpass',
    effectConfig: {}
  },
  'light-boost': {
    synthType: 'triangle',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.4 },
    filterFreq: 3000,
    filterQ: 0.8,
    filterType: 'lowpass',
    effectConfig: {}
  },
  'mxr-mc402': {
    synthType: 'triangle',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.4 },
    filterFreq: 2400,
    filterQ: 0.9,
    filterType: 'lowpass',
    effectConfig: {
      overdriveAmount: 0.2
    }
  },
  
  // OVERDRIVE (suite)
  'treble-booster': {
    synthType: 'triangle', // Boost aigu légendaire pour pousser ampli Vox/Marshall
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.4 }, // Sustain élevé
    filterFreq: 3500, // Highpass à 3500Hz pour accentuer les aigus
    filterQ: 0.7, // Q doux
    filterType: 'highpass', // Filtre passe-haut pour couper les basses
    effectConfig: {
      overdriveAmount: 0.15, // Légère saturation
      eqBoost: { bass: -5, mid: 0, treble: 8 } // Fort boost des aigus, coupe basses
    }
  },
  'mesa-grid-slammer': {
    synthType: 'triangle',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.4 },
    filterFreq: 2200,
    filterQ: 0.85,
    filterType: 'lowpass',
    effectConfig: {
      overdriveAmount: 0.3
    }
  },
  'boss-od1': {
    synthType: 'triangle',
    synthEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.3 },
    filterFreq: 2100,
    filterQ: 0.8,
    filterType: 'lowpass',
    effectConfig: {
      overdriveAmount: 0.22
    }
  },
  'jhs-at-drive': {
    synthType: 'triangle',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.4 },
    filterFreq: 2300,
    filterQ: 0.85,
    filterType: 'lowpass',
    effectConfig: {
      overdriveAmount: 0.28
    }
  },
  
  // DISTORTION (suite)
  'ibanez-jemini': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.35, sustain: 0.25, release: 0.45 },
    filterFreq: 3400,
    filterQ: 2.5,
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 0.85
    }
  },
  'satchurator': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.4 },
    filterFreq: 3600,
    filterQ: 2.8,
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 0.9
    }
  },
  
  // OCTAVER
  'octavia-fuzz': {
    synthType: 'square',
    synthEnvelope: { attack: 0.01, decay: 0.6, sustain: 0.6, release: 0.7 },
    filterFreq: 1000,
    filterQ: 0.5,
    filterType: 'lowpass',
    effectConfig: {
      distortionAmount: 1.4
    }
  },
  
  // VIBE
  'univibe': {
    synthType: 'sine',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      phaserRate: 0.7
    }
  },
  
  // PITCH
  'digitech-whammy': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {}
  },
  
  // ROTARY
  'leslie-rotary': {
    synthType: 'sine',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      tremoloRate: 5.0
    }
  },
  
  // VOLUME
  'boss-volume-expression': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1,
    filterType: 'lowpass',
    effectConfig: {}
  },
  
  // NOISE GATE
  'noise-gate': {
    synthType: 'sawtooth',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1,
    filterType: 'lowpass',
    effectConfig: {}
  },
  
  // MULTIFX
  'tc-gmajor2': {
    synthType: 'sine',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      chorusRate: 1.5
    }
  },
  
  // RING MODULATOR
  'moog-mf-ring': {
    synthType: 'sine',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
    filterFreq: 3000,
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {}
  },
  
  // BIT CRUSHER
  'red-panda-bitmap': {
    synthType: 'square',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2000,
    filterQ: 0.8,
    filterType: 'lowpass',
    effectConfig: {}
  },
  
  // LO-FI
  'zvex-lo-fi-junky': {
    synthType: 'square',
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 1500,
    filterQ: 0.6,
    filterType: 'lowpass',
    effectConfig: {}
  },
  
  // SHIMMER REVERB
  'strymon-bigsky-shimmer': {
    synthType: 'sine', // Reverb avec pitch shifting pour effet céleste
    synthEnvelope: { attack: 0.01, decay: 0.6, sustain: 0.3, release: 0.8 }, // Decay très long pour shimmer
    filterFreq: 3200, // Filtre haut pour clarté
    filterQ: 1.0,
    filterType: 'lowpass',
    effectConfig: {
      reverbRoom: 0.9 // Room size extra-longue enrichie d'octaves/harmonies (shimmer)
    }
  },
  
  // TAPE DELAY
  'strymon-el-capistan': {
    synthType: 'sawtooth', // Delay à bande magnétique avec saturation et wow
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 2500, // Filtre bas pour perte de hautes fréquences de la bande
    filterQ: 0.9, // Q bas pour caractère chaud
    filterType: 'lowpass',
    effectConfig: {
      delayTime: 0.45 // Temps modéré avec modulation interne (wow/flutter)
    }
  },
  
  // SPRING REVERB
  'surfybear-metal': {
    synthType: 'sine', // Reverb à ressorts authentique
    synthEnvelope: { attack: 0.01, decay: 0.4, sustain: 0.3, release: 0.6 },
    filterFreq: 3000, // Filtre pour résonance métallique
    filterQ: 0.8, // Q bas pour caractère "vert" et court
    filterType: 'lowpass',
    effectConfig: {
      reverbRoom: 0.4 // Room size court, réverb dominante basse et saturée
    }
  }
}

/**
 * Obtient la configuration audio pour une pédale spécifique
 * Retourne une configuration par défaut si la pédale n'est pas dans la liste
 */
export function getPedalPreviewConfig(pedalModel: PedalModel): PedalPreviewConfig {
  const config = pedalConfigs[pedalModel.id]
  
  if (config) {
    return config
  }
  
  // Configuration par défaut basée sur le type (basée sur analyses techniques)
  const defaultConfigs: Record<string, PedalPreviewConfig> = {
    distortion: {
      synthType: 'sawtooth', // Riche en harmoniques pour clipping dur
      synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.4 }, // Attaque instantanée, sustain faible
      filterFreq: 3300, // Filtre haut pour ne pas atténuer les aigus
      filterQ: 2.2, // Q élevé pour l'agressivité
      filterType: 'lowpass',
      effectConfig: { distortionAmount: 0.8 } // Clipping dur, saturation agressive
    },
    overdrive: {
      synthType: 'triangle', // Rond et chaud, clipping doux (diodes en feedback)
      synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.6, release: 0.4 }, // Sustain élevé pour la chaleur
      filterFreq: 2000, // Filtre modéré pour rondeur
      filterQ: 0.8, // Q doux pour le caractère chaud
      filterType: 'lowpass',
      effectConfig: { overdriveAmount: 0.25 } // Clipping doux, moins agressif
    },
    fuzz: {
      synthType: 'square', // Très riche en harmoniques pour clipping sévère
      synthEnvelope: { attack: 0.01, decay: 0.7, sustain: 0.7, release: 0.8 }, // Enveloppe très longue pour sustain "flou"
      filterFreq: 800, // Très bas pour couper massivement les hautes fréquences
      filterQ: 0.4, // Q très bas pour son épais et peu clair
      filterType: 'lowpass',
      effectConfig: { distortionAmount: 1.5 } // Énorme, bien plus d'harmoniques qu'une disto
    },
    chorus: {
      synthType: 'sine',
      synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
      filterFreq: 3000,
      filterQ: 1,
      filterType: 'lowpass',
      effectConfig: { chorusRate: 1.5 }
    },
    delay: {
      synthType: 'sawtooth',
      synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
      filterFreq: 2800,
      filterQ: 1,
      filterType: 'lowpass',
      effectConfig: { delayTime: 0.3 }
    },
    reverb: {
      synthType: 'sine',
      synthEnvelope: { attack: 0.01, decay: 0.4, sustain: 0.3, release: 0.6 },
      filterFreq: 3000,
      filterQ: 1,
      filterType: 'lowpass',
      effectConfig: { reverbRoom: 0.6 }
    },
    tremolo: {
      synthType: 'sawtooth',
      synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
      filterFreq: 2800,
      filterQ: 1,
      filterType: 'lowpass',
      effectConfig: { tremoloRate: 4 }
    },
    phaser: {
      synthType: 'sine',
      synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.4, release: 0.5 },
      filterFreq: 3000,
      filterQ: 1.2,
      filterType: 'lowpass',
      effectConfig: { phaserRate: 1.2 }
    }
  }
  
  const defaultConfig: PedalPreviewConfig = defaultConfigs[pedalModel.type] || {
    synthType: 'sawtooth' as const,
    synthEnvelope: { attack: 0.01, decay: 0.3, sustain: 0.3, release: 0.4 },
    filterFreq: 3000,
    filterQ: 1,
    filterType: 'lowpass' as const
  }
  
  if (config) {
    const mergedConfig: PedalPreviewConfig = {
      synthType: (config as PedalPreviewConfig).synthType || defaultConfig.synthType,
      synthEnvelope: (config as PedalPreviewConfig).synthEnvelope || defaultConfig.synthEnvelope,
      filterFreq: (config as PedalPreviewConfig).filterFreq ?? defaultConfig.filterFreq,
      filterQ: (config as PedalPreviewConfig).filterQ ?? defaultConfig.filterQ,
      filterType: (config as PedalPreviewConfig).filterType || defaultConfig.filterType,
      effectConfig: (config as PedalPreviewConfig).effectConfig || defaultConfig.effectConfig,
      chords: (config as PedalPreviewConfig).chords || defaultConfig.chords
    }
    return mergedConfig
  }
  
  return defaultConfig
}

