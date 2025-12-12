// Bibliothèque de pédales d'effets inspirée des grands fabricants
import { 
  LucideIcon, 
  Radio, 
  Lightbulb,
  Waves,
  Sun,
  Gauge,
  RadioReceiver,
  RotateCcw,
  Music,
  CircleDot,
  Square,
  Triangle,
  Circle,
  Moon,
  Zap,
  Shield,
  Plus,
  Building2,
  Layers,
  Flower2,
  Cloud,
  Shuffle
} from 'lucide-react'
import { PEDAL_ACCENT_COLORS } from './pedalAccentColors'

export type ControlType = 'knob' | 'switch-vertical' | 'switch-horizontal' | 'slider' | 'switch-selector'

export interface PedalModel {
  id: string
  brand: string
  model: string
  type: 'distortion' | 'overdrive' | 'fuzz' | 'chorus' | 'delay' | 'reverb' | 'flanger' | 'tremolo' | 'phaser' | 'eq' | 'wah' | 'boost' | 'compressor' | 'octaver' | 'pitch' | 'rotary' | 'volume' | 'noisegate' | 'multifx' | 'vibe' | 'ringmod' | 'bitcrusher' | 'lofi' | 'tapedelay' | 'springreverb' | 'shimmerreverb' | 'tuner'
  description: string
  parameters: Record<string, { 
    min: number
    max: number
    default: number
    label: string
    controlType?: ControlType
    orientation?: 'vertical' | 'horizontal' // Pour slider
    labels?: string[] // Pour switch-selector
    icons?: LucideIcon[] // Pour switch-selector
  }>
  color: string
  accentColor: string
  style: 'vintage' | 'modern' | 'boutique'
}

export const pedalLibrary: PedalModel[] = [
  // DISTORTION (4+ pédales)
  {
    id: 'boss-ds1',
    brand: 'BOSS',
    model: 'DS-1',
    type: 'distortion',
    description: 'Distortion classique iconique',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#ff9500',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_DARK,
    style: 'vintage'
  },
  {
    id: 'proco-rat',
    brand: 'Pro Co',
    model: 'RAT',
    type: 'distortion',
    description: 'Distortion avec filtre caractéristique',
    parameters: {
      distortion: { min: 0, max: 100, default: 50, label: 'Distortion' },
      filter: { min: 0, max: 100, default: 50, label: 'Filter' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.RED,
    style: 'vintage'
  },
  {
    id: 'ibanez-tube-screamer',
    brand: 'Ibanez',
    model: 'Tube Screamer TS9',
    type: 'distortion',
    description: 'Overdrive/Distortion avec boost des médiums',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#00ff00',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'vintage'
  },
  {
    id: 'electro-harmonix-big-muff',
    brand: 'Electro-Harmonix',
    model: 'Big Muff Pi',
    type: 'distortion',
    description: 'Fuzz/Distortion légendaire',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: '#ff6b35',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE,
    style: 'vintage'
  },
  {
    id: 'walrus-audio-distortion',
    brand: 'Walrus Audio',
    model: 'Fundamental Distortion',
    type: 'distortion',
    description: 'Distortion à trois modes couvrant une large plage de sons, du dark et doom jusqu\'aux leads tranchants et percutants.',
    parameters: {
      gain: { min: 0, max: 100, default: 50, label: 'Gain', controlType: 'slider', orientation: 'horizontal' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone', controlType: 'slider', orientation: 'horizontal' },
      volume: { min: 0, max: 100, default: 50, label: 'Vol', controlType: 'slider', orientation: 'horizontal' },
      mode: { min: 0, max: 2, default: 1, label: 'Mode', controlType: 'switch-selector', labels: ['DARK', 'SI', 'LED'], icons: [Moon, Zap, Sun] }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_WALRUS,
    style: 'modern'
  },
  // OVERDRIVE (4+ pédales)
  {
    id: 'boss-sd1',
    brand: 'BOSS',
    model: 'SD-1',
    type: 'overdrive',
    description: 'Super Overdrive classique',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#ffd700',
    accentColor: PEDAL_ACCENT_COLORS.YELLOW,
    style: 'vintage'
  },
  {
    id: 'fulltone-ocd',
    brand: 'Fulltone',
    model: 'OCD',
    type: 'overdrive',
    description: 'Overdrive boutique polyvalente',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' },
      mode: { min: 0, max: 1, default: 0, label: 'Mode', controlType: 'switch-selector', labels: ['HP', 'LP'], icons: [Radio, Radio] }
    },
    color: '#8b4513',
    accentColor: PEDAL_ACCENT_COLORS.BROWN,
    style: 'boutique'
  },
  {
    id: 'klon-centaur',
    brand: 'Klon',
    model: 'Centaur',
    type: 'overdrive',
    description: 'Overdrive transparent légendaire',
    parameters: {
      gain: { min: 0, max: 100, default: 50, label: 'Gain' },
      treble: { min: 0, max: 100, default: 50, label: 'Treble' },
      output: { min: 0, max: 100, default: 50, label: 'Output' }
    },
    color: '#daa520',
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_DARK,
    style: 'boutique'
  },
  {
    id: 'ibanez-tube-screamer-mini',
    brand: 'Ibanez',
    model: 'TS Mini',
    type: 'overdrive',
    description: 'Overdrive compact',
    parameters: {
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#00ff00',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'modern'
  },
  {
    id: 'walrus-audio-drive',
    brand: 'Walrus Audio',
    model: 'Fundamental Drive',
    type: 'overdrive',
    description: 'Overdrive polyvalent permettant une large plage de tons grâce à son switch à trois modes. L\'outil parfait en début de chaîne pour définir le ton de tout votre rig.',
    parameters: {
      gain: { min: 0, max: 100, default: 50, label: 'Gain', controlType: 'slider', orientation: 'horizontal' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone', controlType: 'slider', orientation: 'horizontal' },
      volume: { min: 0, max: 100, default: 50, label: 'Vol', controlType: 'slider', orientation: 'horizontal' },
      mode: { min: 0, max: 2, default: 1, label: 'Mode', controlType: 'switch-selector', labels: ['SMOOTH', 'CRUNCH', 'BRIGHT'], icons: [CircleDot, Square, Sun] }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.PINK_WALRUS,
    style: 'modern'
  },
  // FUZZ (4+ pédales)
  {
    id: 'dunlop-fuzz-face',
    brand: 'Dunlop',
    model: 'Fuzz Face',
    type: 'fuzz',
    description: 'Fuzz vintage iconique',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: '#ff0000',
    accentColor: PEDAL_ACCENT_COLORS.RED_DARK,
    style: 'vintage'
  },
  {
    id: 'zvex-fuzz-factory',
    brand: 'ZVEX',
    model: 'Fuzz Factory',
    type: 'fuzz',
    description: 'Fuzz extrême avec contrôles avancés',
    parameters: {
      gate: { min: 0, max: 100, default: 50, label: 'Gate' },
      comp: { min: 0, max: 100, default: 50, label: 'Comp' },
      drive: { min: 0, max: 100, default: 50, label: 'Drive' },
      stab: { min: 0, max: 100, default: 50, label: 'Stab' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: '#ffff00',
    accentColor: PEDAL_ACCENT_COLORS.YELLOW,
    style: 'boutique'
  },
  {
    id: 'electro-harmonix-muff',
    brand: 'Electro-Harmonix',
    model: 'Big Muff',
    type: 'fuzz',
    description: 'Fuzz sustain légendaire',
    parameters: {
      sustain: { min: 0, max: 100, default: 50, label: 'Sustain' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: '#ff6b35',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE,
    style: 'vintage'
  },
  {
    id: 'walrus-audio-fuzz',
    brand: 'Walrus Audio',
    model: 'Fundamental Fuzz',
    type: 'fuzz',
    description: 'Fuzz agressif à trois modes avec une large plage tonale. Peut être placé n\'importe où dans votre chaîne : alimentez-le avec votre overdrive préféré ou poussez-le dans une autre distorsion folle.',
    parameters: {
      gain: { min: 0, max: 100, default: 50, label: 'Gain', controlType: 'slider', orientation: 'horizontal' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone', controlType: 'slider', orientation: 'horizontal' },
      volume: { min: 0, max: 100, default: 50, label: 'Vol', controlType: 'slider', orientation: 'horizontal' },
      mode: { min: 0, max: 2, default: 1, label: 'Mode', controlType: 'switch-selector', labels: ['GATE', 'CLASSIC', 'MID+'], icons: [Shield, CircleDot, Plus] }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_FUZZ,
    style: 'modern'
  },
  // CHORUS (4+ pédales)
  {
    id: 'boss-ch1',
    brand: 'BOSS',
    model: 'CH-1',
    type: 'chorus',
    description: 'Chorus stéréo classique',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      equalizer: { min: 0, max: 100, default: 50, label: 'Equalizer' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#00bfff',
    accentColor: PEDAL_ACCENT_COLORS.BLUE,
    style: 'vintage'
  },
  {
    id: 'electro-harmonix-small-clone',
    brand: 'Electro-Harmonix',
    model: 'Small Clone',
    type: 'chorus',
    description: 'Chorus vintage simple',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      mode: { min: 0, max: 1, default: 0, label: 'Mode', controlType: 'switch-selector', labels: ['CHORUS', 'VIBRATO'], icons: [Waves, Radio] }
    },
    color: '#00ff00',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'vintage'
  },
  {
    id: 'walrus-audio-chorus',
    brand: 'Walrus Audio',
    model: 'Fundamental Chorus',
    type: 'chorus',
    description: 'Émulation digitale d\'un chorus analogique classique, recréant la modulation bucket brigade. Trois algorithmes de chorus pour des sons allant de la modulation douce jusqu\'au tri-chorus des années 80.',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate', controlType: 'slider', orientation: 'horizontal' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth', controlType: 'slider', orientation: 'horizontal' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix', controlType: 'slider', orientation: 'horizontal' },
      mode: { min: 0, max: 2, default: 1, label: 'Mode', controlType: 'switch-selector', labels: ['LIGHT', 'MEDIUM', 'HEAVY'], icons: [CircleDot, Square, Circle] }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_CHORUS,
    style: 'modern'
  },
  {
    id: 'electro-harmonix-oceans-11',
    brand: 'Electro-Harmonix',
    model: 'Oceans 11',
    type: 'chorus',
    description: 'Multi-effets Chorus/Vibrato + Reverb',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      mode: { min: 0, max: 10, default: 0, label: 'Mode', controlType: 'switch-selector', labels: ['SPRING', 'HALL', 'PLATE', 'MOD', 'REVERSE', 'ECHO', 'SHIMMER', 'DYNA', 'POLY', 'AUTO', 'MANUAL'], icons: [Waves, Music, Waves, Radio, RotateCcw, Waves, Sun, Gauge, RadioReceiver, CircleDot, Square] }
    },
    color: '#00ff00',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'boutique'
  },
  // DELAY (4+ pédales)
  {
    id: 'boss-dd3',
    brand: 'BOSS',
    model: 'DD-3',
    type: 'delay',
    description: 'Delay numérique classique',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      level: { min: 0, max: 100, default: 50, label: 'Level' },
      memory: { min: 0, max: 2, default: 1, label: 'Memory', controlType: 'switch-selector', labels: ['S', 'M', 'L'], icons: [CircleDot, CircleDot, CircleDot] }
    },
    color: '#00bfff',
    accentColor: PEDAL_ACCENT_COLORS.BLUE,
    style: 'vintage'
  },
  {
    id: 'tc-electronic-flashback',
    brand: 'TC Electronic',
    model: 'Flashback',
    type: 'delay',
    description: 'Delay avec modes multiples',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.GREEN,
    style: 'modern'
  },
  {
    id: 'walrus-audio-delay',
    brand: 'Walrus Audio',
    model: 'Fundamental Delay',
    type: 'delay',
    description: 'Delay offrant les sons fondamentaux des effets de répétition. Avec trois algorithmes de delay, vous pouvez passer d\'un feedback digital propre à une émulation de delay analogique, ainsi qu\'à des trails inversés.',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time', controlType: 'slider', orientation: 'horizontal' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback', controlType: 'slider', orientation: 'horizontal' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix', controlType: 'slider', orientation: 'horizontal' },
      mode: { min: 0, max: 2, default: 1, label: 'Mode', controlType: 'switch-selector', labels: ['DIGITAL', 'ANALOG', 'REVERSE'], icons: [Radio, RadioReceiver, RotateCcw] }
    },
    color: '#00ff00',
    accentColor: PEDAL_ACCENT_COLORS.GREEN,
    style: 'modern'
  },
  {
    id: 'strymon-timeline',
    brand: 'Strymon',
    model: 'Timeline',
    type: 'delay',
    description: 'Delay professionnel multi-modes',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#2d2d2d',
    accentColor: PEDAL_ACCENT_COLORS.GREEN,
    style: 'boutique'
  },
  // REVERB (4+ pédales)
  {
    id: 'boss-rv6',
    brand: 'BOSS',
    model: 'RV-6',
    type: 'reverb',
    description: 'Reverb multi-mode',
    parameters: {
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' },
      mode: { min: 0, max: 7, default: 0, label: 'Mode', controlType: 'switch-selector', labels: ['HALL', 'ROOM', 'PLATE', 'MODULATE', 'SHIMMER', 'DYNAMIC', '+DELAY', 'SPRING'], icons: [Music, Music, Waves, Radio, Sun, Gauge, Waves, Waves] }
    },
    color: '#00bfff',
    accentColor: PEDAL_ACCENT_COLORS.BLUE,
    style: 'modern'
  },
  {
    id: 'electro-harmonix-holy-grail',
    brand: 'Electro-Harmonix',
    model: 'Holy Grail',
    type: 'reverb',
    description: 'Reverb spring classique',
    parameters: {
      reverb: { min: 0, max: 100, default: 50, label: 'Reverb' }
    },
    color: '#00ff00',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'vintage'
  },
  {
    id: 'walrus-audio-reverb',
    brand: 'Walrus Audio',
    model: 'Fundamental Reverb',
    type: 'reverb',
    description: 'Reverb offrant les sons fondamentaux des effets ambiants. Avec trois algorithmes de reverb, vous pouvez passer d\'un hall ambiant à une émulation spring analogique, ainsi qu\'à une émulation plate brillante.',
    parameters: {
      decay: { min: 0, max: 100, default: 50, label: 'Decay', controlType: 'slider', orientation: 'horizontal' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone', controlType: 'slider', orientation: 'horizontal' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix', controlType: 'slider', orientation: 'horizontal' },
      mode: { min: 0, max: 2, default: 1, label: 'Mode', controlType: 'switch-selector', labels: ['HALL', 'SPRING', 'PLATE'], icons: [Building2, Waves, Layers] }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.CYAN_WALRUS_REVERB,
    style: 'modern'
  },
  {
    id: 'walrus-audio-ambient',
    brand: 'Walrus Audio',
    model: 'Fundamental Ambient',
    type: 'reverb',
    description: 'Trois algorithmes de reverb atmosphériques pour explorer de vastes paysages sonores avec un temps de decay généreux pour des décroissances douces et pad-like.',
    parameters: {
      decay: { min: 0, max: 100, default: 50, label: 'Decay', controlType: 'slider', orientation: 'horizontal' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone', controlType: 'slider', orientation: 'horizontal' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix', controlType: 'slider', orientation: 'horizontal' },
      mode: { min: 0, max: 2, default: 1, label: 'Mode', controlType: 'switch-selector', labels: ['DEEP', 'LUSH', 'HAZE'], icons: [Layers, Flower2, Cloud] }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.CYAN_WALRUS_AMBIENT,
    style: 'modern'
  },
  {
    id: 'strymon-bigsky',
    brand: 'Strymon',
    model: 'BigSky',
    type: 'reverb',
    description: 'Reverb professionnel multi-modes',
    parameters: {
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#2d2d2d',
    accentColor: PEDAL_ACCENT_COLORS.GREEN,
    style: 'boutique'
  },
  // FLANGER (4+ pédales)
  {
    id: 'boss-bf3',
    brand: 'BOSS',
    model: 'BF-3',
    type: 'flanger',
    description: 'Flanger stéréo',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      manual: { min: 0, max: 100, default: 50, label: 'Manual' },
      resonance: { min: 0, max: 100, default: 50, label: 'Resonance' }
    },
    color: '#9370db',
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_SLATE,
    style: 'modern'
  },
  {
    id: 'electro-harmonix-electric-mistress',
    brand: 'Electro-Harmonix',
    model: 'Electric Mistress',
    type: 'flanger',
    description: 'Flanger vintage',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      range: { min: 0, max: 100, default: 50, label: 'Range' },
      color: { min: 0, max: 100, default: 50, label: 'Color' }
    },
    color: '#00ff00',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'vintage'
  },
  {
    id: 'walrus-audio-flanger',
    brand: 'Walrus Audio',
    model: 'Fundamental Flanger',
    type: 'flanger',
    description: 'Flanger moderne',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate', controlType: 'slider', orientation: 'horizontal' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth', controlType: 'slider', orientation: 'horizontal' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback', controlType: 'slider', orientation: 'horizontal' },
      mode: { min: 0, max: 2, default: 1, label: 'Mode', controlType: 'switch-selector', labels: ['LIGHT', 'MEDIUM', 'HEAVY'], icons: [CircleDot, Square, Triangle] }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.RED_PINK,
    style: 'modern'
  },
  {
    id: 'mooer-e-lady',
    brand: 'Mooer',
    model: 'E-Lady',
    type: 'flanger',
    description: 'Flanger compact',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      range: { min: 0, max: 100, default: 50, label: 'Range' },
      color: { min: 0, max: 100, default: 50, label: 'Color' }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.RED,
    style: 'modern'
  },
  // TREMOLO (4+ pédales)
  {
    id: 'boss-tr2',
    brand: 'BOSS',
    model: 'TR-2',
    type: 'tremolo',
    description: 'Tremolo classique',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      wave: { min: 0, max: 1, default: 0, label: 'Wave', controlType: 'switch-selector', labels: ['SINE', 'SQUARE'], icons: [CircleDot, Square] }
    },
    color: '#ff6b35',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE,
    style: 'vintage'
  },
  {
    id: 'walrus-audio-tremolo',
    brand: 'Walrus Audio',
    model: 'Fundamental Tremolo',
    type: 'tremolo',
    description: 'Tremolo optique classique avec mouvement iconique. Trois formes d\'onde : smooth et apaisant, ou glitchy, wild et crazy.',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate', controlType: 'slider', orientation: 'horizontal' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth', controlType: 'slider', orientation: 'horizontal' },
      volume: { min: 0, max: 100, default: 50, label: 'Vol', controlType: 'slider', orientation: 'horizontal' },
      wave: { min: 0, max: 2, default: 0, label: 'Wave', controlType: 'switch-selector', labels: ['SINE', 'SQUARE', 'RANDOM'], icons: [Waves, Square, Shuffle] }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_WALRUS,
    style: 'modern'
  },
  {
    id: 'fulltone-supatrem',
    brand: 'Fulltone',
    model: 'Supatrem',
    type: 'tremolo',
    description: 'Tremolo optique',
    parameters: {
      speed: { min: 0, max: 100, default: 50, label: 'Speed' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: '#8b4513',
    accentColor: PEDAL_ACCENT_COLORS.BROWN,
    style: 'boutique'
  },
  {
    id: 'strymon-flint',
    brand: 'Strymon',
    model: 'Flint',
    type: 'tremolo',
    description: 'Tremolo + Reverb',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      intensity: { min: 0, max: 100, default: 50, label: 'Intensity' },
      tremoloWave: { min: 0, max: 2, default: 0, label: 'Tremolo Wave', controlType: 'switch-selector', labels: ['BIAS', 'HARMONIC', 'SQUARE'], icons: [CircleDot, Waves, Square] },
      reverbType: { min: 0, max: 2, default: 0, label: 'Reverb Type', controlType: 'switch-selector', labels: ['61', '65', '80'], icons: [Music, Music, Music] }
    },
    color: '#2d2d2d',
    accentColor: PEDAL_ACCENT_COLORS.GREEN,
    style: 'boutique'
  },
  // PHASER (4+ pédales)
  {
    id: 'boss-ph3',
    brand: 'BOSS',
    model: 'PH-3',
    type: 'phaser',
    description: 'Phaser multi-mode',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      resonance: { min: 0, max: 100, default: 50, label: 'Resonance' },
      mode: { min: 0, max: 7, default: 0, label: 'Mode', controlType: 'switch-selector', labels: ['4-STAGE', '8-STAGE', '10-STAGE', '12-STAGE', 'UNI-V', 'STEP', 'RISE', 'FALL'], icons: [CircleDot, CircleDot, CircleDot, CircleDot, Radio, Square, Triangle, RotateCcw] }
    },
    color: '#00ff00',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'modern'
  },
  {
    id: 'electro-harmonix-small-stone',
    brand: 'Electro-Harmonix',
    model: 'Small Stone',
    type: 'phaser',
    description: 'Phaser vintage simple',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      color: { min: 0, max: 1, default: 0, label: 'Color', controlType: 'switch-selector', labels: ['OFF', 'ON'], icons: [CircleDot, CircleDot] }
    },
    color: '#00ff00',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_DARK,
    style: 'vintage'
  },
  {
    id: 'mooer-phaser',
    brand: 'Mooer',
    model: 'Phase 90',
    type: 'phaser',
    description: 'Phaser compact',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.RED,
    style: 'modern'
  },
  {
    id: 'walrus-audio-phaser',
    brand: 'Walrus Audio',
    model: 'Fundamental Phaser',
    type: 'phaser',
    description: 'Phaser polyvalent, émulation digitale d\'un phaser classique. Avec trois types d\'algorithmes de phaser, vous pouvez obtenir des sons allant de la modulation tonale légère à un phaser hautement modulé et résonant.',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate', controlType: 'slider', orientation: 'horizontal' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback', controlType: 'slider', orientation: 'horizontal' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth', controlType: 'slider', orientation: 'horizontal' },
      mode: { min: 0, max: 2, default: 1, label: 'Mode', controlType: 'switch-selector', labels: ['LIGHT', 'MEDIUM', 'HEAVY'], icons: [CircleDot, Square, Circle] }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.PINK_PHASER,
    style: 'modern'
  },
  // EQ (4+ pédales)
  {
    id: 'boss-ge7',
    brand: 'BOSS',
    model: 'GE-7',
    type: 'eq',
    description: 'Equalizer graphique 7 bandes',
    parameters: {
      '100hz': { min: -15, max: 15, default: 0, label: '100Hz', controlType: 'slider', orientation: 'vertical' },
      '200hz': { min: -15, max: 15, default: 0, label: '200Hz', controlType: 'slider', orientation: 'vertical' },
      '400hz': { min: -15, max: 15, default: 0, label: '400Hz', controlType: 'slider', orientation: 'vertical' },
      '800hz': { min: -15, max: 15, default: 0, label: '800Hz', controlType: 'slider', orientation: 'vertical' },
      '1.6khz': { min: -15, max: 15, default: 0, label: '1.6kHz', controlType: 'slider', orientation: 'vertical' },
      '3.2khz': { min: -15, max: 15, default: 0, label: '3.2kHz', controlType: 'slider', orientation: 'vertical' },
      '6.4khz': { min: -15, max: 15, default: 0, label: '6.4kHz', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_ROYAL,
    style: 'vintage'
  },
  {
    id: 'mxr-10-band-eq',
    brand: 'MXR',
    model: '10-Band EQ',
    type: 'eq',
    description: 'Equalizer graphique 10 bandes',
    parameters: {
      '31hz': { min: -12, max: 12, default: 0, label: '31Hz', controlType: 'slider', orientation: 'vertical' },
      '62hz': { min: -12, max: 12, default: 0, label: '62Hz', controlType: 'slider', orientation: 'vertical' },
      '125hz': { min: -12, max: 12, default: 0, label: '125Hz', controlType: 'slider', orientation: 'vertical' },
      '250hz': { min: -12, max: 12, default: 0, label: '250Hz', controlType: 'slider', orientation: 'vertical' },
      '500hz': { min: -12, max: 12, default: 0, label: '500Hz', controlType: 'slider', orientation: 'vertical' },
      '1khz': { min: -12, max: 12, default: 0, label: '1kHz', controlType: 'slider', orientation: 'vertical' },
      '2khz': { min: -12, max: 12, default: 0, label: '2kHz', controlType: 'slider', orientation: 'vertical' },
      '4khz': { min: -12, max: 12, default: 0, label: '4kHz', controlType: 'slider', orientation: 'vertical' },
      '8khz': { min: -12, max: 12, default: 0, label: '8kHz', controlType: 'slider', orientation: 'vertical' },
      '16khz': { min: -12, max: 12, default: 0, label: '16kHz', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.RED,
    style: 'modern'
  },
  {
    id: 'source-audio-programmable-eq',
    brand: 'Source Audio',
    model: 'Programmable EQ',
    type: 'eq',
    description: 'EQ paramétrique programmable',
    parameters: {
      low: { min: -18, max: 18, default: 0, label: 'Low', controlType: 'slider', orientation: 'vertical' },
      lowMid: { min: -18, max: 18, default: 0, label: 'Low Mid', controlType: 'slider', orientation: 'vertical' },
      mid: { min: -18, max: 18, default: 0, label: 'Mid', controlType: 'slider', orientation: 'vertical' },
      highMid: { min: -18, max: 18, default: 0, label: 'High Mid', controlType: 'slider', orientation: 'vertical' },
      high: { min: -18, max: 18, default: 0, label: 'High', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: '#2d2d2d',
    accentColor: PEDAL_ACCENT_COLORS.GREEN,
    style: 'boutique'
  },
  {
    id: 'empress-paraeq',
    brand: 'Empress',
    model: 'ParaEQ',
    type: 'eq',
    description: 'EQ paramétrique 3 bandes',
    parameters: {
      low: { min: -12, max: 12, default: 0, label: 'Low', controlType: 'slider', orientation: 'vertical' },
      mid: { min: -12, max: 12, default: 0, label: 'Mid', controlType: 'slider', orientation: 'vertical' },
      high: { min: -12, max: 12, default: 0, label: 'High', controlType: 'slider', orientation: 'vertical' },
      level: { min: 0, max: 100, default: 50, label: 'Level', controlType: 'slider', orientation: 'vertical' }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_CORAL,
    style: 'boutique'
  },
  // WAH
  {
    id: 'vox-v847-wah',
    brand: 'Vox',
    model: 'V847 Wah',
    type: 'wah',
    description: 'Wah classique et brillante des années 60',
    parameters: {
      sweep: { min: 0, max: 100, default: 50, label: 'Sweep' },
      q: { min: 0, max: 100, default: 50, label: 'Q' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#1f2937',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_EMERALD,
    style: 'vintage'
  },
  {
    id: 'cry-baby-wah',
    brand: 'Dunlop',
    model: 'Cry Baby',
    type: 'wah',
    description: 'La référence des wah modernes',
    parameters: {
      sweep: { min: 0, max: 100, default: 50, label: 'Sweep' },
      q: { min: 0, max: 100, default: 55, label: 'Q' },
      volume: { min: 0, max: 100, default: 50, label: 'Volume' }
    },
    color: '#0f172a',
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_BRIGHT,
    style: 'modern'
  },
  {
    id: 'slash-wah-sw95',
    brand: 'Dunlop',
    model: 'Slash SW95',
    type: 'wah',
    description: 'Signature Slash avec boost intégré',
    parameters: {
      sweep: { min: 0, max: 100, default: 50, label: 'Sweep' },
      q: { min: 0, max: 100, default: 60, label: 'Q' },
      boost: { min: 0, max: 15, default: 6, label: 'Boost' }
    },
    color: '#7f1d1d',
    accentColor: PEDAL_ACCENT_COLORS.RED_LIGHT,
    style: 'boutique'
  },
  {
    id: 'evh-wah',
    brand: 'EVH',
    model: 'Signature Wah',
    type: 'wah',
    description: 'Voicing EVH avec courbe agressive',
    parameters: {
      sweep: { min: 0, max: 100, default: 60, label: 'Sweep' },
      q: { min: 0, max: 100, default: 65, label: 'Q' },
      volume: { min: 0, max: 100, default: 55, label: 'Volume' }
    },
    color: '#111827',
    accentColor: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    style: 'modern'
  },
  {
    id: 'kh95-wah',
    brand: 'Dunlop',
    model: 'KH95 Wah',
    type: 'wah',
    description: 'Signature Kirk Hammett pour leads saturés',
    parameters: {
      sweep: { min: 0, max: 100, default: 55, label: 'Sweep' },
      q: { min: 0, max: 100, default: 65, label: 'Q' },
      gain: { min: 0, max: 100, default: 50, label: 'Gain' }
    },
    color: '#0b132b',
    accentColor: PEDAL_ACCENT_COLORS.PURPLE,
    style: 'modern'
  },
  {
    id: 'rmc-wah',
    brand: 'RMC',
    model: 'Custom Wah',
    type: 'wah',
    description: 'Wah boutique à plage étendue',
    parameters: {
      sweep: { min: 0, max: 100, default: 55, label: 'Sweep' },
      q: { min: 0, max: 100, default: 60, label: 'Q' },
      bass: { min: 0, max: 100, default: 50, label: 'Bass' }
    },
    color: '#1f2937',
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_MAGENTA,
    style: 'boutique'
  },
  // BOOST
  {
    id: 'power-booster',
    brand: 'Colorsound',
    model: 'Power Booster',
    type: 'boost',
    description: 'Boost vintage transparent à large gain',
    parameters: {
      gain: { min: 0, max: 100, default: 50, label: 'Gain' },
      treble: { min: -20, max: 20, default: 0, label: 'Treble' },
      bass: { min: -20, max: 20, default: 0, label: 'Bass' }
    },
    color: '#f59e0b',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BROWN,
    style: 'vintage'
  },
  {
    id: 'light-boost',
    brand: 'Custom',
    model: 'Clean Boost',
    type: 'boost',
    description: 'Boost léger pour relever le signal',
    parameters: {
      level: { min: 0, max: 100, default: 60, label: 'Level' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: '#f3f4f6',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_EMERALD,
    style: 'modern'
  },
  {
    id: 'mxr-mc402',
    brand: 'MXR',
    model: 'MC-402 Boost/OD',
    type: 'boost',
    description: 'Boost + overdrive doux combinés',
    parameters: {
      boost: { min: 0, max: 100, default: 50, label: 'Boost' },
      drive: { min: 0, max: 100, default: 40, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: '#111827',
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_BRIGHT,
    style: 'modern'
  },
  // COMPRESSOR
  {
    id: 'mxr-dyna-comp',
    brand: 'MXR',
    model: 'Dyna Comp',
    type: 'compressor',
    description: 'Compresseur simple pour lisser la dynamique',
    parameters: {
      output: { min: 0, max: 100, default: 50, label: 'Output' },
      sensitivity: { min: 0, max: 100, default: 50, label: 'Sensitivity' }
    },
    color: '#dc2626',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    style: 'vintage'
  },
  // OCTAVER / VIBE / PITCH / ROTARY / UTILITAIRES
  {
    id: 'octavia-fuzz',
    brand: 'Roger Mayer',
    model: 'Octavia',
    type: 'octaver',
    description: 'Fuzz avec octave supérieure iconique',
    parameters: {
      fuzz: { min: 0, max: 100, default: 50, label: 'Fuzz' },
      octave: { min: 0, max: 100, default: 60, label: 'Octave' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#4b5563',
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_BRIGHT,
    style: 'vintage'
  },
  {
    id: 'univibe',
    brand: 'Shin-ei',
    model: 'Uni-Vibe',
    type: 'vibe',
    description: 'Effet vibrato/phaser à lampe',
    parameters: {
      speed: { min: 0, max: 100, default: 50, label: 'Speed' },
      intensity: { min: 0, max: 100, default: 50, label: 'Intensity' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#0f172a',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_LIGHT,
    style: 'vintage'
  },
  {
    id: 'digitech-whammy',
    brand: 'DigiTech',
    model: 'Whammy',
    type: 'pitch',
    description: 'Pitch shifter iconique contrôlé au pied',
    parameters: {
      interval: { min: -12, max: 12, default: 0, label: 'Interval' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      tracking: { min: 0, max: 100, default: 70, label: 'Tracking' }
    },
    color: '#991b1b',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    style: 'modern'
  },
  {
    id: 'leslie-rotary',
    brand: 'Leslie',
    model: 'Rotary Simulator',
    type: 'rotary',
    description: 'Simulation d\'enceinte rotative',
    parameters: {
      speed: { min: 0, max: 100, default: 50, label: 'Speed' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#1f2937',
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_DARK,
    style: 'boutique'
  },
  {
    id: 'boss-volume-expression',
    brand: 'BOSS',
    model: 'Volume/Expression',
    type: 'volume',
    description: 'Contrôle de volume ou expression polyvalent',
    parameters: {
      volume: { min: 0, max: 100, default: 50, label: 'Volume' },
      taper: { min: 0, max: 100, default: 50, label: 'Taper' }
    },
    color: '#e5e7eb',
    accentColor: PEDAL_ACCENT_COLORS.GRAY,
    style: 'modern'
  },
  {
    id: 'noise-gate',
    brand: 'ISP',
    model: 'Decimator',
    type: 'noisegate',
    description: 'Noise gate pour rig high-gain',
    parameters: {
      threshold: { min: 0, max: 100, default: 50, label: 'Threshold' },
      release: { min: 0, max: 100, default: 50, label: 'Release' }
    },
    color: '#111827',
    accentColor: PEDAL_ACCENT_COLORS.GRAY_LIGHT,
    style: 'modern'
  },
  {
    id: 'tc-gmajor2',
    brand: 'TC Electronic',
    model: 'G-Major 2',
    type: 'multifx',
    description: 'Multi-effets rack delays/modulations',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      type: { min: 0, max: 5, default: 2, label: 'Type', controlType: 'switch-selector', labels: ['DELAY', 'CHORUS', 'FLANGE', 'PITCH', 'REVERB', 'COMP'], icons: [Waves, Gauge, RotateCcw, Lightbulb, Music, CircleDot] },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#0f172a',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_CYAN,
    style: 'modern'
  },
  // CHORUS additions
  {
    id: 'boss-ce1',
    brand: 'BOSS',
    model: 'CE-1',
    type: 'chorus',
    description: 'Chorus/vibrato stéréo vintage',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' },
      mode: { min: 0, max: 1, default: 0, label: 'Mode', controlType: 'switch-selector', labels: ['CHORUS', 'VIBRATO'], icons: [Waves, Radio] }
    },
    color: '#2563eb',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_DARK,
    style: 'vintage'
  },
  {
    id: 'mxr-analog-chorus',
    brand: 'MXR',
    model: 'Analog Chorus',
    type: 'chorus',
    description: 'Chorus analogique chaud',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#38bdf8',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_SKY,
    style: 'modern'
  },
  // PHASER addition
  {
    id: 'mxr-phase90',
    brand: 'MXR',
    model: 'Phase 90',
    type: 'phaser',
    description: 'Phaser 4 étages emblématique',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#f97316',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_DARK_AMBER,
    style: 'vintage'
  },
  // FLANGER addition
  {
    id: 'mxr-flanger-117',
    brand: 'MXR',
    model: 'Flanger 117',
    type: 'flanger',
    description: 'Flanger analogique signature Van Halen',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      width: { min: 0, max: 100, default: 50, label: 'Width' },
      regen: { min: 0, max: 100, default: 50, label: 'Regen' },
      manual: { min: 0, max: 100, default: 50, label: 'Manual' }
    },
    color: '#0f172a',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_BRIGHT,
    style: 'vintage'
  },
  // DELAY additions
  {
    id: 'echoplex-tape-delay',
    brand: 'Maestro',
    model: 'Echoplex',
    type: 'delay',
    description: 'Delay à bande chaud et organique',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      repeat: { min: 0, max: 100, default: 45, label: 'Repeat' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#4338ca',
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_LIGHT,
    style: 'vintage'
  },
  // RING MODULATOR
  {
    id: 'moog-mf-ring',
    brand: 'Moog',
    model: 'MF Ring',
    type: 'ringmod',
    description: 'Modulation en anneau analogique',
    parameters: {
      frequency: { min: 0, max: 100, default: 50, label: 'Frequency' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#1a1a1a',
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_BRIGHT,
    style: 'vintage'
  },
  // BIT CRUSHER
  {
    id: 'red-panda-bitmap',
    brand: 'Red Panda',
    model: 'Bitmap',
    type: 'bitcrusher',
    description: 'Bit crusher avec contrôle de résolution et sample rate',
    parameters: {
      bits: { min: 0, max: 100, default: 50, label: 'Bits' },
      sampleRate: { min: 0, max: 100, default: 50, label: 'Sample Rate' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#dc2626',
    accentColor: PEDAL_ACCENT_COLORS.RED_PALE,
    style: 'modern'
  },
  // LO-FI
  {
    id: 'zvex-lo-fi-junky',
    brand: 'Z.Vex',
    model: 'Lo-Fi Junky',
    type: 'lofi',
    description: 'Effet lo-fi avec saturation et modulation',
    parameters: {
      saturation: { min: 0, max: 100, default: 50, label: 'Saturation' },
      wow: { min: 0, max: 100, default: 30, label: 'Wow' },
      flutter: { min: 0, max: 100, default: 30, label: 'Flutter' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: '#7c3aed',
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_PALE,
    style: 'boutique'
  },
  // TAPE DELAY
  {
    id: 'strymon-el-capistan',
    brand: 'Strymon',
    model: 'El Capistan',
    type: 'tapedelay',
    description: 'Delay à bande magnétique avec saturation et wow',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 45, label: 'Feedback' },
      saturation: { min: 0, max: 100, default: 50, label: 'Saturation' },
      wow: { min: 0, max: 100, default: 30, label: 'Wow' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#1e293b',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_LIGHT,
    style: 'modern'
  },
  // SPRING REVERB
  {
    id: 'surfybear-metal',
    brand: 'SurfyBear',
    model: 'Metal',
    type: 'springreverb',
    description: 'Reverb à ressorts authentique',
    parameters: {
      decay: { min: 0, max: 100, default: 50, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#92400e',
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_BRIGHT,
    style: 'vintage'
  },
  // SHIMMER REVERB
  {
    id: 'strymon-bigsky-shimmer',
    brand: 'Strymon',
    model: 'BigSky Shimmer',
    type: 'shimmerreverb',
    description: 'Reverb avec pitch shifting pour effet céleste',
    parameters: {
      decay: { min: 0, max: 100, default: 60, label: 'Decay' },
      pitch: { min: 0, max: 100, default: 50, label: 'Pitch' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#0f172a',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_PURPLE,
    style: 'modern'
  },
  {
    id: 'binson-echorec',
    brand: 'Binson',
    model: 'Echorec',
    type: 'delay',
    description: 'Delay à disque magnétique emblématique',
    parameters: {
      repeat: { min: 0, max: 100, default: 50, label: 'Repeat' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      heads: { min: 0, max: 2, default: 1, label: 'Heads', controlType: 'switch-selector', labels: ['4', '6', '8'], icons: [CircleDot, CircleDot, CircleDot] }
    },
    color: '#0f172a',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_TEAL,
    style: 'vintage'
  },
  {
    id: 'memory-man-delay',
    brand: 'Electro-Harmonix',
    model: 'Memory Man',
    type: 'delay',
    description: 'Delay analogique doux et chaleureux',
    parameters: {
      delay: { min: 0, max: 100, default: 50, label: 'Delay' },
      feedback: { min: 0, max: 100, default: 50, label: 'Feedback' },
      blend: { min: 0, max: 100, default: 50, label: 'Blend' }
    },
    color: '#991b1b',
    accentColor: PEDAL_ACCENT_COLORS.RED_LIGHT,
    style: 'vintage'
  },
  {
    id: 'roland-space-echo',
    brand: 'Roland',
    model: 'Space Echo',
    type: 'delay',
    description: 'Echo bande à ressorts',
    parameters: {
      repeat: { min: 0, max: 100, default: 50, label: 'Repeat' },
      intensity: { min: 0, max: 100, default: 50, label: 'Intensity' },
      echoVolume: { min: 0, max: 100, default: 50, label: 'Echo Volume' },
      heads: { min: 0, max: 2, default: 1, label: 'Heads', controlType: 'switch-selector', labels: ['3', '5', '8'], icons: [CircleDot, CircleDot, CircleDot] }
    },
    color: '#064e3b',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_TEAL,
    style: 'vintage'
  },
  {
    id: 'tc-delay',
    brand: 'TC Electronic',
    model: '2290 Style',
    type: 'delay',
    description: 'Delay numérique clair et précis',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 45, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 45, label: 'Mix' }
    },
    color: '#0ea5e9',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_SKY,
    style: 'modern'
  },
  // Ajouts profils rock stars
  {
    id: 'ibanez-jemini',
    brand: 'Ibanez',
    model: 'Jemini Distortion',
    type: 'distortion',
    description: 'Double canal distortion/fuzz signature Steve Vai',
    parameters: {
      gainA: { min: 0, max: 100, default: 55, label: 'Gain A' },
      gainB: { min: 0, max: 100, default: 65, label: 'Gain B' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#7c3aed',
    accentColor: PEDAL_ACCENT_COLORS.PURPLE_LIGHT,
    style: 'modern'
  },
  {
    id: 'eventide-harmonizer',
    brand: 'Eventide',
    model: 'Harmonizer',
    type: 'chorus',
    description: 'Pitch shifting / harmonizer multi-voix emblématique',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      shift: { min: -12, max: 12, default: 0, label: 'Shift' },
      feedback: { min: 0, max: 100, default: 30, label: 'Feedback' }
    },
    color: '#0f172a',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_TEAL,
    style: 'modern'
  },
  {
    id: 'morley-bad-horsie',
    brand: 'Morley',
    model: 'Bad Horsie Wah',
    type: 'phaser',
    description: 'Wah optique signature Vai, balayage large',
    parameters: {
      sweep: { min: 0, max: 100, default: 60, label: 'Sweep' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#111827',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_TEAL,
    style: 'modern'
  },
  {
    id: 'satchurator',
    brand: 'Vox',
    model: 'Satchurator',
    type: 'distortion',
    description: 'Distortion signature Satriani, grain compressé',
    parameters: {
      gain: { min: 0, max: 100, default: 60, label: 'Gain' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      volume: { min: 0, max: 100, default: 55, label: 'Volume' }
    },
    color: '#b91c1c',
    accentColor: PEDAL_ACCENT_COLORS.RED_LIGHT,
    style: 'modern'
  },
  {
    id: 'vox-time-machine',
    brand: 'Vox',
    model: 'Time Machine',
    type: 'delay',
    description: 'Delay signature Satriani, modes vintage/modern',
    parameters: {
      time: { min: 0, max: 100, default: 50, label: 'Time' },
      feedback: { min: 0, max: 100, default: 45, label: 'Feedback' },
      mix: { min: 0, max: 100, default: 50, label: 'Mix' }
    },
    color: '#0f766e',
    accentColor: PEDAL_ACCENT_COLORS.GREEN_CYAN,
    style: 'modern'
  },
  {
    id: 'dunlop-crybaby-classic',
    brand: 'Dunlop',
    model: 'Cry Baby Wah',
    type: 'phaser',
    description: 'Wah classique à induction, balayage médiums',
    parameters: {
      sweep: { min: 0, max: 100, default: 55, label: 'Sweep' },
      q: { min: 0, max: 100, default: 50, label: 'Q' }
    },
    color: '#1f2937',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_CYAN,
    style: 'vintage'
  },
  {
    id: 'killswitch-stutter',
    brand: 'Custom',
    model: 'Killswitch',
    type: 'tremolo',
    description: 'Interrupteur momentané pour couper le signal (stutter)',
    parameters: {
      speed: { min: 0, max: 100, default: 80, label: 'Speed' },
      depth: { min: 0, max: 100, default: 100, label: 'Depth' }
    },
    color: '#0f172a',
    accentColor: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    style: 'modern'
  },
  {
    id: 'treble-booster',
    brand: 'Rangemaster',
    model: 'Treble Booster',
    type: 'overdrive',
    description: 'Boost aigu légendaire pour pousser un ampli Vox/Marshall',
    parameters: {
      boost: { min: 0, max: 100, default: 60, label: 'Boost' },
      level: { min: 0, max: 100, default: 50, label: 'Level' }
    },
    color: '#f59e0b',
    accentColor: PEDAL_ACCENT_COLORS.ORANGE_RUST,
    style: 'vintage'
  },
  {
    id: 'mesa-grid-slammer',
    brand: 'Mesa Boogie',
    model: 'Grid Slammer',
    type: 'overdrive',
    description: 'Overdrive clair et serré pour resserrer un high-gain',
    parameters: {
      gain: { min: 0, max: 100, default: 45, label: 'Gain' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 55, label: 'Level' }
    },
    color: '#0ea5e9',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_LIGHT,
    style: 'modern'
  },
  {
    id: 'boss-ce2',
    brand: 'BOSS',
    model: 'CE-2',
    type: 'chorus',
    description: 'Chorus analogique classique, son CE des années 80',
    parameters: {
      rate: { min: 0, max: 100, default: 50, label: 'Rate' },
      depth: { min: 0, max: 100, default: 50, label: 'Depth' }
    },
    color: '#3b82f6',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_DARK,
    style: 'vintage'
  },
  {
    id: 'boss-od1',
    brand: 'BOSS',
    model: 'OD-1',
    type: 'overdrive',
    description: 'Overdrive jaune historique, grain doux et médiums',
    parameters: {
      level: { min: 0, max: 100, default: 50, label: 'Level' },
      overdrive: { min: 0, max: 100, default: 50, label: 'Overdrive' }
    },
    color: '#fbbf24',
    accentColor: PEDAL_ACCENT_COLORS.YELLOW_AMBER,
    style: 'vintage'
  },
  {
    id: 'jhs-at-drive',
    brand: 'JHS',
    model: 'AT Drive',
    type: 'overdrive',
    description: 'Overdrive signature Andy Timmons, clair et dynamique',
    parameters: {
      drive: { min: 0, max: 100, default: 55, label: 'Drive' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' },
      level: { min: 0, max: 100, default: 55, label: 'Level' }
    },
    color: '#b91c1c',
    accentColor: PEDAL_ACCENT_COLORS.RED_LIGHT,
    style: 'modern'
  },
  {
    id: 'neunaber-reverb',
    brand: 'Neunaber',
    model: 'Ambient',
    type: 'reverb',
    description: 'Reverb ambient stéréo, textures spatiales',
    parameters: {
      mix: { min: 0, max: 100, default: 50, label: 'Mix' },
      decay: { min: 0, max: 100, default: 55, label: 'Decay' },
      tone: { min: 0, max: 100, default: 50, label: 'Tone' }
    },
    color: '#0ea5e9',
    accentColor: PEDAL_ACCENT_COLORS.BLUE_INDIGO,
    style: 'modern'
  },
  {
    id: 'boss-tu3',
    brand: 'BOSS',
    model: 'TU-3',
    type: 'tuner',
    description: 'Tuner chromatique professionnel',
    parameters: {
      mode: { min: 0, max: 1, default: 0, label: 'Mode', controlType: 'switch-selector', labels: ['CHROMATIC', 'GUITAR'], icons: [Music, Music] }
    },
    color: '#ffffff',
    accentColor: PEDAL_ACCENT_COLORS.RED_BRIGHT,
    style: 'modern'
  },
]

