// Auto-généré par scripts/generate-pedals-expansion.mjs — ne pas éditer à la main
import type { PedalModel } from './pedals'
import { PEDAL_ACCENT_COLORS } from './pedalAccentColors'

export const pedalsExpansion: PedalModel[] = [
  {
    id: 'boss-cs3',
    brand: 'BOSS',
    model: 'CS-3',
    type: 'compressor',
    description: 'Compresseur compact classique',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain', controlType: 'slider', orientation: 'vertical' },
      attack: { min: 0, max: 100, default: 50, label: 'Attack', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_AMBER,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_AMBER,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'sliders' }
  },
  {
    id: 'keeley-compressor-plus',
    brand: 'Keeley',
    model: 'Compressor Plus',
    type: 'compressor',
    description: 'Compresseur boutique transparent',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain', controlType: 'slider', orientation: 'vertical' },
      attack: { min: 0, max: 100, default: 50, label: 'Attack', controlType: 'slider', orientation: 'vertical' },
      blend: { min: 0, max: 100, default: 50, label: 'Blend', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_SKY,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_SKY,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'sliders' }
  },
  {
    id: 'wampler-ego',
    brand: 'Wampler',
    model: 'Ego Compressor',
    type: 'compressor',
    description: 'Compresseur à blend parallèle',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain', controlType: 'slider', orientation: 'vertical' },
      attack: { min: 0, max: 100, default: 50, label: 'Attack', controlType: 'slider', orientation: 'vertical' },
      blend: { min: 0, max: 100, default: 50, label: 'Blend', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'sliders' }
  },
  {
    id: 'diamond-compressor',
    brand: 'Diamond',
    model: 'Compressor',
    type: 'compressor',
    description: 'Opto compressor canadien',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain', controlType: 'slider', orientation: 'vertical' },
      attack: { min: 0, max: 100, default: 50, label: 'Attack', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_DARK,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_DARK,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'sliders' }
  },
  {
    id: 'mxr-studio-comp',
    brand: 'MXR',
    model: 'Studio Compressor',
    type: 'compressor',
    description: 'Compresseur studio à ratio',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain', controlType: 'slider', orientation: 'vertical' },
      attack: { min: 0, max: 100, default: 50, label: 'Attack', controlType: 'slider', orientation: 'vertical' },
      blend: { min: 0, max: 100, default: 50, label: 'Blend', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE,
    accentColor: PEDAL_ACCENT_COLORS.BLUE,
    style: 'modern',
    ui: { skin: 'flat', layout: 'sliders' }
  },
  {
    id: 'orange-squeezer',
    brand: 'Dan Armstrong',
    model: 'Orange Squeezer',
    type: 'compressor',
    description: 'Compresseur vintage squashy',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain', controlType: 'slider', orientation: 'vertical' },
      attack: { min: 0, max: 100, default: 50, label: 'Attack', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'sliders' }
  },
  {
    id: 'origin-cali76',
    brand: 'Origin Effects',
    model: 'Cali76 Compact',
    type: 'compressor',
    description: '1176 en boîtier pédale',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain', controlType: 'slider', orientation: 'vertical' },
      attack: { min: 0, max: 100, default: 50, label: 'Attack', controlType: 'slider', orientation: 'vertical' },
      blend: { min: 0, max: 100, default: 50, label: 'Blend', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_DARK,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_DARK,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'sliders' }
  },
  {
    id: 'boss-ns2',
    brand: 'BOSS',
    model: 'NS-2',
    type: 'noisegate',
    description: 'Noise suppressor classique',
    parameters: {
      threshold: { min: 0, max: 100, default: 50, label: 'Threshold' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' }
    },
    color: PEDAL_ACCENT_COLORS.GRAY,
    accentColor: PEDAL_ACCENT_COLORS.GRAY,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'stack' }
  },
  {
    id: 'tc-sentry',
    brand: 'TC Electronic',
    model: 'Sentry',
    type: 'noisegate',
    description: 'Noise gate multibande',
    parameters: {
      threshold: { min: 0, max: 100, default: 50, label: 'Threshold' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.GRAY_LIGHT,
    accentColor: PEDAL_ACCENT_COLORS.GRAY_LIGHT,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'empress-noise-gate',
    brand: 'Empress',
    model: 'Noise Gate',
    type: 'noisegate',
    description: 'Gate boutique ultra rapide',
    parameters: {
      threshold: { min: 0, max: 100, default: 50, label: 'Threshold' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'xotic-ep-booster',
    brand: 'Xotic',
    model: 'EP Booster',
    type: 'boost',
    description: 'Boost style Echoplex preamp',
    parameters: {
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'single' }
  },
  {
    id: 'mxr-micro-amp',
    brand: 'MXR',
    model: 'Micro Amp',
    type: 'boost',
    description: 'Clean boost transparent',
    parameters: {
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_DARK,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_DARK,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'single' }
  },
  {
    id: 'ehx-lpb1',
    brand: 'Electro-Harmonix',
    model: 'LPB-1',
    type: 'boost',
    description: 'Linear Power Booster historique',
    parameters: {
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.RED,
    accentColor: PEDAL_ACCENT_COLORS.RED,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'single' }
  },
  {
    id: 'jackson-bloom',
    brand: 'Jackson Audio',
    model: 'Bloom',
    type: 'boost',
    description: 'Boost + compressor modulable',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain' },
      attack: { min: 0, max: 100, default: 50, label: 'Attack' },
      blend: { min: 0, max: 100, default: 50, label: 'Blend' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.GREEN_EMERALD,
    accentColor: PEDAL_ACCENT_COLORS.GREEN_EMERALD,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'single' }
  },
  {
    id: 'boss-rc5',
    brand: 'BOSS',
    model: 'RC-5',
    type: 'multifx',
    description: 'Looper compact 99 phrases',
    parameters: {
      level: { min: 0, max: 100, default: 50, label: 'Level' },
      speed: { min: 0, max: 100, default: 50, label: 'Speed' }
    },
    color: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    style: 'modern',
    ui: { skin: 'flat', layout: 'row' }
  },
  {
    id: 'tc-ditto',
    brand: 'TC Electronic',
    model: 'Ditto',
    type: 'multifx',
    description: 'Looper one-knob minimal',
    parameters: {
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.RED_PINK,
    accentColor: PEDAL_ACCENT_COLORS.RED_PINK,
    style: 'modern',
    ui: { skin: 'flat', layout: 'single' }
  },
  {
    id: 'ehx-720',
    brand: 'Electro-Harmonix',
    model: '720 Stereo Looper',
    type: 'multifx',
    description: 'Looper stéréo 12 minutes',
    parameters: {
      level: { min: 0, max: 100, default: 50, label: 'Level' },
      speed: { min: 0, max: 100, default: 50, label: 'Speed' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_CORAL,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_CORAL,
    style: 'modern',
    ui: { skin: 'flat', layout: 'row' }
  },
  {
    id: 'ernie-ball-vp-jr',
    brand: 'Ernie Ball',
    model: 'VP Jr',
    type: 'volume',
    description: 'Pédale de volume passive',
    parameters: {
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.GRAY,
    accentColor: PEDAL_ACCENT_COLORS.GRAY,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'single' }
  },
  {
    id: 'boss-bd2',
    brand: 'BOSS',
    model: 'BD-2',
    type: 'overdrive',
    description: 'Blues Driver dynamique',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE,
    accentColor: PEDAL_ACCENT_COLORS.BLUE,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-od3',
    brand: 'BOSS',
    model: 'OD-3',
    type: 'overdrive',
    description: 'Dual-stage overdrive',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_AMBER,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_AMBER,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ibanez-ts808',
    brand: 'Ibanez',
    model: 'TS808',
    type: 'overdrive',
    description: 'Tube Screamer original 808',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.GREEN_DARK,
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'marshall-bluesbreaker',
    brand: 'Marshall',
    model: 'Bluesbreaker',
    type: 'overdrive',
    description: 'Overdrive transparent Marshall',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_BROWN,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BROWN,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'analog-man-kot',
    brand: 'Analog Man',
    model: 'King of Tone',
    type: 'overdrive',
    description: 'Double overdrive mythique',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_DARK,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_DARK,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'paul-cochrane-timmy',
    brand: 'Paul Cochrane',
    model: 'Timmy',
    type: 'overdrive',
    description: 'Overdrive transparent à stack',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'wampler-tumnus',
    brand: 'Wampler',
    model: 'Tumnus',
    type: 'overdrive',
    description: 'Klon-style compact',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'jhs-morning-glory',
    brand: 'JHS',
    model: 'Morning Glory',
    type: 'overdrive',
    description: 'Bluesbreaker modernisé',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_LIGHT,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_LIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'bondi-sick-as',
    brand: 'Bondi',
    model: 'Sick As',
    type: 'overdrive',
    description: 'KOT australien dual channel',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.RED_LIGHT,
    accentColor: PEDAL_ACCENT_COLORS.RED_LIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'origin-revivaldrive',
    brand: 'Origin Effects',
    model: 'RevivalDRIVE',
    type: 'overdrive',
    description: 'Amp-in-a-box vintage British',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.BROWN,
    accentColor: PEDAL_ACCENT_COLORS.BROWN,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'friedman-be-od',
    brand: 'Friedman',
    model: 'BE-OD',
    type: 'overdrive',
    description: 'Brown Eye amp-in-a-box',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_DARK_AMBER,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_DARK_AMBER,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'suhr-riot',
    brand: 'Suhr',
    model: 'Riot',
    type: 'distortion',
    description: 'Distortion high-gain Suhr',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.RED_DARK,
    accentColor: PEDAL_ACCENT_COLORS.RED_DARK,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'greer-lightspeed',
    brand: 'Greer',
    model: 'Lightspeed',
    type: 'overdrive',
    description: 'Organic overdrive transparent',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_BRIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'jackson-prism',
    brand: 'Jackson Audio',
    model: 'Prism',
    type: 'boost',
    description: 'Boost / EQ / buffer modulable',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_BRIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'single' }
  },
  {
    id: 'nobels-odr1',
    brand: 'Nobels',
    model: 'ODR-1',
    type: 'overdrive',
    description: 'Overdrive allemand légendaire',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.GREEN_TEAL,
    accentColor: PEDAL_ACCENT_COLORS.GREEN_TEAL,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'keeley-katana',
    brand: 'Keeley',
    model: 'Katana',
    type: 'boost',
    description: 'Clean boost transparent',
    parameters: {
      boost: { min: 0, max: 100, default: 50, label: 'Boost' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_CYAN,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_CYAN,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'single' }
  },
  {
    id: 'jhs-angry-charlie',
    brand: 'JHS',
    model: 'Angry Charlie',
    type: 'distortion',
    description: 'Marshall-in-a-box JHS',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.RED,
    accentColor: PEDAL_ACCENT_COLORS.RED,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ethos-overdrive',
    brand: 'Ethos',
    model: 'Overdrive',
    type: 'overdrive',
    description: 'Overdrive Dumble-inspired',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_RUST,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_RUST,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-hm2',
    brand: 'BOSS',
    model: 'HM-2',
    type: 'distortion',
    description: 'Heavy Metal buzzsaw suédois',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_DARK,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_DARK,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-mt2',
    brand: 'BOSS',
    model: 'MT-2',
    type: 'distortion',
    description: 'Metal Zone mid-scoop iconique',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.GRAY,
    accentColor: PEDAL_ACCENT_COLORS.GRAY,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'marshall-guvnor',
    brand: 'Marshall',
    model: 'Guv\'nor',
    type: 'distortion',
    description: 'Distortion Marshall classique',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_BROWN,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BROWN,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ehx-metal-muff',
    brand: 'Electro-Harmonix',
    model: 'Metal Muff',
    type: 'distortion',
    description: 'Distortion métal à scoop',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.RED_DARK,
    accentColor: PEDAL_ACCENT_COLORS.RED_DARK,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'tech21-sansamp-gt2',
    brand: 'Tech 21',
    model: 'SansAmp GT2',
    type: 'distortion',
    description: 'Amp simulator original',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_INDIGO,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_INDIGO,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'joyo-american-sound',
    brand: 'Joyo',
    model: 'American Sound',
    type: 'overdrive',
    description: 'Fender Twin-in-a-box budget',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_SKY,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_SKY,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'uafx-dream65',
    brand: 'Universal Audio',
    model: 'Dream \'65',
    type: 'overdrive',
    description: 'Twin Reverb UAFX',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_ROYAL,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_ROYAL,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'proco-turbo-rat',
    brand: 'Pro Co',
    model: 'Turbo RAT',
    type: 'distortion',
    description: 'RAT plus gain et LED clipping',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'mesa-throttle-box',
    brand: 'Mesa Boogie',
    model: 'Throttle Box',
    type: 'distortion',
    description: 'High-gain Mesa en pédale',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'bogner-ecstasy-red',
    brand: 'Bogner',
    model: 'Ecstasy Red',
    type: 'distortion',
    description: 'Ecstasy amp-in-a-box',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.RED,
    accentColor: PEDAL_ACCENT_COLORS.RED,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-ml2',
    brand: 'BOSS',
    model: 'ML-2',
    type: 'distortion',
    description: 'Metal Core agressif',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.GRAY_LIGHT,
    accentColor: PEDAL_ACCENT_COLORS.GRAY_LIGHT,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'wampler-plexi-drive',
    brand: 'Wampler',
    model: 'Plexi-Drive',
    type: 'overdrive',
    description: 'Plexi Marshall-in-a-box',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_DARK_AMBER,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_DARK_AMBER,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'tone-bender-mkii',
    brand: 'Sola Sound',
    model: 'Tone Bender MKII',
    type: 'fuzz',
    description: 'Fuzz britannique légendaire',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.GRAY,
    accentColor: PEDAL_ACCENT_COLORS.GRAY,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'mosrite-fuzzrite',
    brand: 'Mosrite',
    model: 'Fuzzrite',
    type: 'fuzz',
    description: 'Fuzz silicon vintage US',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.RED_PINK,
    accentColor: PEDAL_ACCENT_COLORS.RED_PINK,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ehx-russian-muff',
    brand: 'Electro-Harmonix',
    model: 'Green Russian Big Muff',
    type: 'fuzz',
    description: 'Big Muff russe sombre',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.GREEN_DARK,
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'way-huge-swollen-pickle',
    brand: 'Way Huge',
    model: 'Swollen Pickle',
    type: 'fuzz',
    description: 'Jumbo fuzz à scoop',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.GREEN_WALRUS,
    accentColor: PEDAL_ACCENT_COLORS.GREEN_WALRUS,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'eqd-hoof',
    brand: 'EarthQuaker Devices',
    model: 'Hoof',
    type: 'fuzz',
    description: 'Fuzz germanium/silicon hybride',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_FUZZ,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_FUZZ,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'catalinbread-fuzzrite',
    brand: 'Catalinbread',
    model: 'Fuzzrite',
    type: 'fuzz',
    description: 'Recréation Fuzzrite',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_CORAL,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_CORAL,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'death-by-audio-fuzz-war',
    brand: 'Death By Audio',
    model: 'Fuzz War',
    type: 'fuzz',
    description: 'Fuzz extrême brooklyn',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'fuzzrocious-demon',
    brand: 'Fuzzrocious',
    model: 'Demon',
    type: 'fuzz',
    description: 'Fuzz gated bizarre',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_MAGENTA,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_MAGENTA,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'behringer-sf300',
    brand: 'Behringer',
    model: 'SF300',
    type: 'fuzz',
    description: 'Super Fuzz budget 3 modes',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.GRAY_LIGHT,
    accentColor: PEDAL_ACCENT_COLORS.GRAY_LIGHT,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'dunlop-jh-f1',
    brand: 'Dunlop',
    model: 'JH-F1 Fuzz Face',
    type: 'fuzz',
    description: 'Fuzz Face signature Hendrix',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.RED_DARK,
    accentColor: PEDAL_ACCENT_COLORS.RED_DARK,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'crowther-hot-cake',
    brand: 'Crowther',
    model: 'Hot Cake',
    type: 'overdrive',
    description: 'Overdrive/fuzz NZ culte',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'devi-ever-shoe-gazer',
    brand: 'Devi Ever',
    model: 'Shoe Gazer',
    type: 'fuzz',
    description: 'Fuzz shoegaze self-oscillant',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.PINK_PHASER,
    accentColor: PEDAL_ACCENT_COLORS.PINK_PHASER,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-vb2',
    brand: 'BOSS',
    model: 'VB-2',
    type: 'chorus',
    description: 'Vibrato analogique rare',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_CHORUS,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_CHORUS,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-mo2',
    brand: 'BOSS',
    model: 'MO-2',
    type: 'chorus',
    description: 'Multi Overtone harmonique',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_LIGHT,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_LIGHT,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ehx-stereo-pulsar',
    brand: 'Electro-Harmonix',
    model: 'Stereo Pulsar',
    type: 'tremolo',
    description: 'Tremolo / pan stéréo',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_WALRUS,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_WALRUS,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'chase-bliss-gravitas',
    brand: 'Chase Bliss',
    model: 'Gravitas',
    type: 'tremolo',
    description: 'Tremolo analogique MIDI',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_DARK,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_DARK,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'chase-bliss-mood',
    brand: 'Chase Bliss',
    model: 'Mood',
    type: 'delay',
    description: 'Micro-looper / delay granulaire',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'eqd-sea-machine',
    brand: 'EarthQuaker Devices',
    model: 'Sea Machine',
    type: 'chorus',
    description: 'Chorus animé chorus/vibrato',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_CYAN,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_CYAN,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'eqd-grand-orbiter',
    brand: 'EarthQuaker Devices',
    model: 'Grand Orbiter',
    type: 'phaser',
    description: 'Phaser 4 modes',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_SLATE,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_SLATE,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'stack' }
  },
  {
    id: 'eqd-pyramids',
    brand: 'EarthQuaker Devices',
    model: 'Pyramids',
    type: 'flanger',
    description: 'Flanger stéréo 5 modes',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      regen: { min: 0, max: 100, default: 50, label: 'Regen' },
      manual: { min: 0, max: 100, default: 50, label: 'Manual' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_BRIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'grid2' }
  },
  {
    id: 'meris-ottobit',
    brand: 'Meris',
    model: 'Ottobit Jr',
    type: 'bitcrusher',
    description: 'Bitcrusher sequencer',
    parameters: {
      bits: { min: 0, max: 100, default: 50, label: 'Bits' },
      sample: { min: 0, max: 100, default: 50, label: 'Sample' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'walrus-julianna',
    brand: 'Walrus Audio',
    model: 'Julianna',
    type: 'chorus',
    description: 'Chorus/vibrato stéréo',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_CHORUS,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_CHORUS,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'strymon-deco',
    brand: 'Strymon',
    model: 'Deco',
    type: 'chorus',
    description: 'Tape saturation + doubletracker',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_BROWN,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BROWN,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'strymon-mobius',
    brand: 'Strymon',
    model: 'Mobius',
    type: 'multifx',
    description: 'Modulation multi-algorithmes',
    parameters: {
      a: { min: 0, max: 100, default: 50, label: 'A' },
      b: { min: 0, max: 100, default: 50, label: 'B' },
      c: { min: 0, max: 100, default: 50, label: 'C' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_INDIGO,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_INDIGO,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'row' }
  },
  {
    id: 'tc-corona',
    brand: 'TC Electronic',
    model: 'Corona Chorus',
    type: 'chorus',
    description: 'Chorus TonePrint',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_SKY,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_SKY,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-dc2',
    brand: 'BOSS',
    model: 'DC-2',
    type: 'chorus',
    description: 'Dimension C spatial',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_PALE,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_PALE,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'fairfield-shallow-water',
    brand: 'Fairfield Circuitry',
    model: 'Shallow Water',
    type: 'chorus',
    description: 'K-field modulator weird',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.GREEN_TEAL,
    accentColor: PEDAL_ACCENT_COLORS.GREEN_TEAL,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'mxr-univibe',
    brand: 'MXR',
    model: 'Uni-Vibe',
    type: 'vibe',
    description: 'Uni-Vibe MXR moderne',
    parameters: {
      speed: { min: 0, max: 100, default: 50, label: 'Speed' },
      intensity: { min: 0, max: 100, default: 50, label: 'Intensity' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_SLATE,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_SLATE,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-dm2',
    brand: 'BOSS',
    model: 'DM-2',
    type: 'delay',
    description: 'Delay analogique bucket brigade',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_DARK,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_DARK,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-dd8',
    brand: 'BOSS',
    model: 'DD-8',
    type: 'delay',
    description: 'Delay digital polyvalent',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ehx-canyon',
    brand: 'Electro-Harmonix',
    model: 'Canyon',
    type: 'delay',
    description: 'Delay/looper 11 modes',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_CORAL,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_CORAL,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'catalinbread-belle-epoch',
    brand: 'Catalinbread',
    model: 'Belle Epoch',
    type: 'tapedelay',
    description: 'Echoplex EP-3 en pédale',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_DARK,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_DARK,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'chase-bliss-tonal-recall',
    brand: 'Chase Bliss',
    model: 'Tonal Recall',
    type: 'delay',
    description: 'Delay analogique MIDI boutique',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_PURPLE,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_PURPLE,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'meris-polymoon',
    brand: 'Meris',
    model: 'Polymoon',
    type: 'delay',
    description: 'Delay modulé supermoon',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_BRIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'empress-echosystem',
    brand: 'Empress',
    model: 'Echosystem',
    type: 'delay',
    description: 'Dual delay 12 algorithmes',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'line6-dl4',
    brand: 'Line 6',
    model: 'DL4',
    type: 'delay',
    description: 'Delay modeler iconique',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.GREEN_EMERALD,
    accentColor: PEDAL_ACCENT_COLORS.GREEN_EMERALD,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'keeley-caverns',
    brand: 'Keeley',
    model: 'Caverns',
    type: 'delay',
    description: 'Delay + reverb compact',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_CYAN,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_CYAN,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'walrus-arp87',
    brand: 'Walrus Audio',
    model: 'ARP-87',
    type: 'delay',
    description: 'Delay multi-mode boutique',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_WALRUS,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_WALRUS,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'strymon-brigadier',
    brand: 'Strymon',
    model: 'Brigadier',
    type: 'delay',
    description: 'BBD delay numérique',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.GREEN_DARK,
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'malekko-ekko-616',
    brand: 'Malekko',
    model: 'Ekko 616',
    type: 'delay',
    description: 'Delay analogique dark',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.GRAY,
    accentColor: PEDAL_ACCENT_COLORS.GRAY,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ehx-deluxe-memory-man',
    brand: 'Electro-Harmonix',
    model: 'Deluxe Memory Man',
    type: 'delay',
    description: 'Analog delay + chorus/vibrato',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-rv5',
    brand: 'BOSS',
    model: 'RV-5',
    type: 'reverb',
    description: 'Reverb numérique polyvalente',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_SKY,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_SKY,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ehx-cathedral',
    brand: 'Electro-Harmonix',
    model: 'Cathedral',
    type: 'reverb',
    description: 'Reverb 8 modes stéréo',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      predelay: { min: 0, max: 100, default: 50, label: 'Predelay' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_PALE,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_PALE,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'meris-mercury7',
    brand: 'Meris',
    model: 'Mercury7',
    type: 'reverb',
    description: 'Reverb spatiale Blade Runner',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      predelay: { min: 0, max: 100, default: 50, label: 'Predelay' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_INDIGO,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_INDIGO,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'walrus-slo',
    brand: 'Walrus Audio',
    model: 'Slö',
    type: 'reverb',
    description: 'Reverb ambient multi-texture',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.CYAN_WALRUS_AMBIENT,
    accentColor: PEDAL_ACCENT_COLORS.CYAN_WALRUS_AMBIENT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'eqd-afterneath',
    brand: 'EarthQuaker Devices',
    model: 'Afterneath',
    type: 'reverb',
    description: 'Reverb granulaire cavernous',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.GREEN_WALRUS,
    accentColor: PEDAL_ACCENT_COLORS.GREEN_WALRUS,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'eqd-ghost-echo',
    brand: 'EarthQuaker Devices',
    model: 'Ghost Echo',
    type: 'reverb',
    description: 'Spring-ish ambient pre-delay',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.GRAY_LIGHT,
    accentColor: PEDAL_ACCENT_COLORS.GRAY_LIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'chase-bliss-habit',
    brand: 'Chase Bliss',
    model: 'Habit',
    type: 'delay',
    description: 'Delay mémoire / experimental',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_DARK,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_DARK,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'obne-dark-star',
    brand: 'Old Blood Noise',
    model: 'Dark Star',
    type: 'reverb',
    description: 'Reverb pad / freeze',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_MAGENTA,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_MAGENTA,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'caroline-meteore',
    brand: 'Caroline',
    model: 'Météore',
    type: 'reverb',
    description: 'Reverb lo-fi Caroline',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_RUST,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_RUST,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'strymon-bluesky',
    brand: 'Strymon',
    model: 'blueSky',
    type: 'reverb',
    description: 'Reverb plate/room/spring',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE,
    accentColor: PEDAL_ACCENT_COLORS.BLUE,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'eventide-space',
    brand: 'Eventide',
    model: 'Space',
    type: 'reverb',
    description: 'Reverb Eventide studio',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      predelay: { min: 0, max: 100, default: 50, label: 'Predelay' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_ROYAL,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_ROYAL,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'neunaber-immerse',
    brand: 'Neunaber',
    model: 'Immerse',
    type: 'reverb',
    description: 'Reverb stéréo Immersion',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_PURPLE,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_PURPLE,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ehx-pog2',
    brand: 'Electro-Harmonix',
    model: 'POG2',
    type: 'octaver',
    description: 'Polyphonic octave generator',
    parameters: {
      octave: { min: 0, max: 100, default: 50, label: 'Octave' },
      dry: { min: 0, max: 100, default: 50, label: 'Dry' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_CORAL,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_CORAL,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ehx-pitch-fork',
    brand: 'Electro-Harmonix',
    model: 'Pitch Fork',
    type: 'pitch',
    description: 'Pitch shifter polyphonique',
    parameters: {
      pitch: { min: 0, max: 100, default: 50, label: 'Pitch' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ehx-mel9',
    brand: 'Electro-Harmonix',
    model: 'Mel9',
    type: 'multifx',
    description: 'Tape replay machine mellotron',
    parameters: {
      pitch: { min: 0, max: 100, default: 50, label: 'Pitch' },
      filter: { min: 0, max: 100, default: 50, label: 'Filter' },
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_AMBER,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_AMBER,
    style: 'modern',
    ui: { skin: 'flat', layout: 'row' }
  },
  {
    id: 'boss-ps6',
    brand: 'BOSS',
    model: 'PS-6',
    type: 'pitch',
    description: 'Harmonist intelligent',
    parameters: {
      pitch: { min: 0, max: 100, default: 50, label: 'Pitch' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_DARK,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_DARK,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'tc-sub-n-up',
    brand: 'TC Electronic',
    model: 'Sub \'N\' Up',
    type: 'octaver',
    description: 'Octaver polyphonique TonePrint',
    parameters: {
      octave: { min: 0, max: 100, default: 50, label: 'Octave' },
      dry: { min: 0, max: 100, default: 50, label: 'Dry' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_BRIGHT,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'digitech-drop',
    brand: 'DigiTech',
    model: 'Drop',
    type: 'pitch',
    description: 'Drop tune polyphonic',
    parameters: {
      pitch: { min: 0, max: 100, default: 50, label: 'Pitch' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'eventide-pitchfactor',
    brand: 'Eventide',
    model: 'PitchFactor',
    type: 'pitch',
    description: 'Pitch / harmonizer Eventide',
    parameters: {
      pitch: { min: 0, max: 100, default: 50, label: 'Pitch' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_INDIGO,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_INDIGO,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'boss-oc5',
    brand: 'BOSS',
    model: 'OC-5',
    type: 'octaver',
    description: 'Octave poly + vintage',
    parameters: {
      octave: { min: 0, max: 100, default: 50, label: 'Octave' },
      dry: { min: 0, max: 100, default: 50, label: 'Dry' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_DARK,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_DARK,
    style: 'modern',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'ehx-q-tron',
    brand: 'Electro-Harmonix',
    model: 'Q-Tron',
    type: 'wah',
    description: 'Envelope filter Mu-Tron style',
    parameters: {
      freq: { min: 0, max: 100, default: 50, label: 'Freq' },
      res: { min: 0, max: 100, default: 50, label: 'Res' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'stack' }
  },
  {
    id: 'mutron-iii',
    brand: 'Mu-Tron',
    model: 'III',
    type: 'wah',
    description: 'Envelope filter original',
    parameters: {
      freq: { min: 0, max: 100, default: 50, label: 'Freq' },
      res: { min: 0, max: 100, default: 50, label: 'Res' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.ORANGE_WALRUS,
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_WALRUS,
    style: 'vintage',
    ui: { skin: 'flat', layout: 'stack' }
  },
  {
    id: 'boss-aw3',
    brand: 'BOSS',
    model: 'AW-3',
    type: 'wah',
    description: 'Dynamic wah envelope',
    parameters: {
      freq: { min: 0, max: 100, default: 50, label: 'Freq' },
      res: { min: 0, max: 100, default: 50, label: 'Res' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_AMBER,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_AMBER,
    style: 'modern',
    ui: { skin: 'flat', layout: 'stack' }
  },
  {
    id: 'chase-bliss-condor',
    brand: 'Chase Bliss',
    model: 'Condor',
    type: 'eq',
    description: 'Filter / EQ analogique MIDI',
    parameters: {
      freq: { min: 0, max: 100, default: 50, label: 'Freq' },
      res: { min: 0, max: 100, default: 50, label: 'Res' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.GREEN_EMERALD,
    accentColor: PEDAL_ACCENT_COLORS.GREEN_EMERALD,
    style: 'boutique',
    ui: { skin: 'eq', layout: 'sliders' }
  },
  {
    id: 'chase-bliss-brothers',
    brand: 'Chase Bliss',
    model: 'Brothers',
    type: 'overdrive',
    description: 'Dual drive / boost / fuzz',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.YELLOW_DARK,
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_DARK,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'fairfield-accountant',
    brand: 'Fairfield Circuitry',
    model: 'The Accountant',
    type: 'compressor',
    description: 'Compresseur weird Fairfield',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain', controlType: 'slider', orientation: 'vertical' },
      attack: { min: 0, max: 100, default: 50, label: 'Attack', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: PEDAL_ACCENT_COLORS.GRAY,
    accentColor: PEDAL_ACCENT_COLORS.GRAY,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'sliders' }
  },
  {
    id: 'red-panda-particle',
    brand: 'Red Panda',
    model: 'Particle',
    type: 'delay',
    description: 'Granular delay / pitch',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mod: { min: 0, max: 100, default: 50, label: 'Mod' }
    },
    color: PEDAL_ACCENT_COLORS.RED_PINK,
    accentColor: PEDAL_ACCENT_COLORS.RED_PINK,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'meris-enzo',
    brand: 'Meris',
    model: 'Enzo',
    type: 'multifx',
    description: 'Multi-voice synth pedal',
    parameters: {
      pitch: { min: 0, max: 100, default: 50, label: 'Pitch' },
      filter: { min: 0, max: 100, default: 50, label: 'Filter' },
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_BRIGHT,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_BRIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'row' }
  },
  {
    id: 'obne-excess',
    brand: 'Old Blood Noise',
    model: 'Excess',
    type: 'distortion',
    description: 'Distortion + delay/chorus',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.RED_LIGHT,
    accentColor: PEDAL_ACCENT_COLORS.RED_LIGHT,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'caroline-somersault',
    brand: 'Caroline',
    model: 'Somersault',
    type: 'chorus',
    description: 'Lo-fi modulator Caroline',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: PEDAL_ACCENT_COLORS.BLUE_CYAN,
    accentColor: PEDAL_ACCENT_COLORS.BLUE_CYAN,
    style: 'boutique',
    ui: { skin: 'flat', layout: 'triangle' }
  },
  {
    id: 'digitech-synth-wah',
    brand: 'DigiTech',
    model: 'Synth Wah',
    type: 'wah',
    description: 'Envelope filter / synth wah',
    parameters: {
      freq: { min: 0, max: 100, default: 50, label: 'Freq' },
      res: { min: 0, max: 100, default: 50, label: 'Res' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: PEDAL_ACCENT_COLORS.PURPLE_MAGENTA,
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_MAGENTA,
    style: 'modern',
    ui: { skin: 'flat', layout: 'stack' }
  }
]

export const pedalsExpansionIds = pedalsExpansion.map((p) => p.id)
