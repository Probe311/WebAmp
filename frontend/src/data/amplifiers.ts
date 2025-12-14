// Bibliothèque d'amplis avec marque et modèle
export interface AmplifierModel {
  id: string
  brand: string
  model: string
  type: 'combo' | 'head'
  description: string
  parameters: {
    volume?: { min: number; max: number; default: number }
    gain?: { min: number; max: number; default: number }
    bass?: { min: number; max: number; default: number }
    middle?: { min: number; max: number; default: number }
    treble?: { min: number; max: number; default: number }
    presence?: { min: number; max: number; default: number }
    master?: { min: number; max: number; default: number }
    reverb?: { min: number; max: number; default: number }
    resonance?: { min: number; max: number; default: number }
    depth?: { min: number; max: number; default: number }
    tone?: { min: number; max: number; default: number }
  }
  color: string
  style: 'vintage' | 'modern' | 'high-gain'
  knobColor: string
  knobBaseColor: 'black' | 'gold' | 'chrome' | 'gray' | 'silver'
  uiStyle: {
    grilleGradient: string[]
    grillePattern: 'horizontal' | 'vertical' | 'grid' | 'diagonal' | 'none'
    knobLayout: 'horizontal' | 'vertical' | 'grid' | 'compact'
    borderStyle: 'solid' | 'double' | 'dashed'
  }
}

export const amplifierLibrary: AmplifierModel[] = [
  // Fender
  {
    id: 'fender-65-twin',
    brand: 'Fender',
    model: '65 Twin Reverb',
    type: 'combo',
    description: 'Amplificateur combo « blackface » classique, réputé pour son son clair cristallin et sa réverbération à ressort intégrée',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      reverb: { min: 0, max: 10, default: 5 }
    },
    color: '#1a1a1a',
    style: 'vintage',
    knobColor: '#3b82f6', // Bleu Fender
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#92400e', '#78350f'],
      grillePattern: 'horizontal',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'fender-deluxe-reverb',
    brand: 'Fender',
    model: 'Deluxe Reverb',
    type: 'combo',
    description: 'Combo classique « blackface », 2×10″, son chaud et légèrement compressé à fort volume, idéal pour blues, rock et country',
    parameters: {
      volume: { min: 0, max: 10, default: 4 },
      bass: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      reverb: { min: 0, max: 10, default: 4 }
    },
    color: '#2d2d2d',
    style: 'vintage',
    knobColor: '#2563eb', // Bleu foncé Fender
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#a16207', '#854d0e'],
      grillePattern: 'grid',
      knobLayout: 'compact',
      borderStyle: 'solid'
    }
  },
  // Marshall
  {
    id: 'marshall-jcm800',
    brand: 'Marshall',
    model: 'JCM 800',
    type: 'head',
    description: 'Tête légendaire des années 1980, son Marshall saturé très typique. Idéale hard rock/metal',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#000000',
    style: 'high-gain',
    knobColor: '#d4af37', // Or Marshall
    knobBaseColor: 'gold',
    uiStyle: {
      grilleGradient: ['#111827', '#0b1016'],
      grillePattern: 'vertical',
      knobLayout: 'grid',
      borderStyle: 'double'
    }
  },
  {
    id: 'marshall-plexi',
    brand: 'Marshall',
    model: 'Plexi 1959',
    type: 'head',
    description: 'Tête Marshall historique (« Plexi »), son clair-chauffé emblématique, saturant uniquement à fort volume',
    parameters: {
      volume: { min: 0, max: 10, default: 6 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 }
    },
    color: '#000000',
    style: 'vintage',
    knobColor: '#d4af37', // Or Marshall
    knobBaseColor: 'gold',
    uiStyle: {
      grilleGradient: ['#111827', '#0b1016'],
      grillePattern: 'diagonal',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  // Orange
  {
    id: 'orange-rockerverb',
    brand: 'Orange',
    model: 'Rockerverb 100',
    type: 'head',
    description: 'Tête 100 W, deux canaux (Clean/Dirty), avec réverbération à ressort intégrée. Haut headroom, son « Orange » chaud et rond',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      gain: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      reverb: { min: 0, max: 10, default: 4 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#ff6b35',
    style: 'modern',
    knobColor: '#f97316', // Orange vif
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#ea580c', '#c2410c'],
      grillePattern: 'grid',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  {
    id: 'orange-tiny-terror',
    brand: 'Orange',
    model: 'Tiny Terror',
    type: 'head',
    description: 'Tête compacte 15 W (switchable 7/15W) de style « lunchbox ». Son saturé même à bas volume, très dynamique',
    parameters: {
      gain: { min: 0, max: 10, default: 6 },
      tone: { min: 0, max: 10, default: 5 },
      volume: { min: 0, max: 10, default: 5 }
    },
    color: '#ff8c42',
    style: 'modern',
    knobColor: '#fb923c', // Orange clair
    knobBaseColor: 'silver',
    uiStyle: {
      grilleGradient: ['#f97316', '#ea580c'],
      grillePattern: 'horizontal',
      knobLayout: 'compact',
      borderStyle: 'solid'
    }
  },
  // Mesa Boogie
  {
    id: 'mesa-dual-rectifier',
    brand: 'Mesa Boogie',
    model: 'Dual Rectifier',
    type: 'head',
    description: 'Tête multi-canaux (3 canaux) haute performance, son très aggressif. Multi-Mode (Raw/Vintage/Modern) par canal',
    parameters: {
      gain: { min: 0, max: 10, default: 7 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      resonance: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#1a1a1a',
    style: 'high-gain',
    knobColor: '#8b5cf6', // Violet Mesa
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0f0f0f', '#1a1a1a'],
      grillePattern: 'vertical',
      knobLayout: 'grid',
      borderStyle: 'double'
    }
  },
  // Vox
  {
    id: 'vox-ac30',
    brand: 'Vox',
    model: 'AC30',
    type: 'combo',
    description: 'Combo britannique emblématique (2×12″). Son clair brillant et drive doux, très utilisé depuis les années 1960',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#8b7355',
    style: 'vintage',
    knobColor: '#10b981', // Vert Vox
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#78716c', '#57534e'],
      grillePattern: 'diagonal',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'vox-ac15',
    brand: 'Vox',
    model: 'AC15',
    type: 'combo',
    description: 'Version compacte de l\'AC30 (1×12″). Son similaire mais moitié moins de watts (15 W), idéal studio/petits concerts',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#a0826d',
    style: 'vintage',
    knobColor: '#34d399', // Vert clair Vox
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#a8a29e', '#78716c'],
      grillePattern: 'grid',
      knobLayout: 'compact',
      borderStyle: 'solid'
    }
  },
  // Peavey
  {
    id: 'peavey-5150',
    brand: 'Peavey',
    model: '5150',
    type: 'head',
    description: 'Tête signature Eddie Van Halen, très saturée et réactive. Idéale metal agressif',
    parameters: {
      gain: { min: 0, max: 10, default: 7 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      resonance: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#1a1a1a',
    style: 'high-gain',
    knobColor: '#f59e0b', // Jaune/Or Peavey
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#171717', '#0a0a0a'],
      grillePattern: 'vertical',
      knobLayout: 'grid',
      borderStyle: 'dashed'
    }
  },
  // Ajouts profils rock stars
  {
    id: 'gibson-ga40',
    brand: 'Gibson',
    model: 'GA-40',
    type: 'combo',
    description: 'Combo tweed 50s, clean chaud légèrement compressé',
    parameters: {
      volume: { min: 0, max: 10, default: 6 },
      bass: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#6b4f2a',
    style: 'vintage',
    knobColor: '#fbbf24',
    knobBaseColor: 'gold',
    uiStyle: {
      grilleGradient: ['#a16207', '#854d0e'],
      grillePattern: 'horizontal',
      knobLayout: 'compact',
      borderStyle: 'solid'
    }
  },
  {
    id: 'carvin-legacy',
    brand: 'Carvin',
    model: 'Legacy',
    type: 'head',
    description: 'Tête signature Steve Vai, lead chantant et clair cristal',
    parameters: {
      gain: { min: 0, max: 10, default: 6 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#2f2a4a',
    style: 'modern',
    knobColor: '#a855f7',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#1f2937', '#0b1020'],
      grillePattern: 'grid',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  {
    id: 'synergy-modules',
    brand: 'Synergy',
    model: 'Modular',
    type: 'head',
    description: 'Plateforme modulaire multi-préamps (live récents Vai/Petrucci)',
    parameters: {
      gain: { min: 0, max: 10, default: 6 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'modern',
    knobColor: '#22c55e',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0f172a', '#111827'],
      grillePattern: 'vertical',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  {
    id: 'marshall-jvm410hjs',
    brand: 'Marshall',
    model: 'JVM410HJS',
    type: 'head',
    description: 'Tête signature Satriani, 4 canaux, polyvalente high-gain',
    parameters: {
      gain: { min: 0, max: 10, default: 6 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#0f0f0f',
    style: 'high-gain',
    knobColor: '#eab308',
    knobBaseColor: 'gold',
    uiStyle: {
      grilleGradient: ['#111827', '#0b1016'],
      grillePattern: 'diagonal',
      knobLayout: 'grid',
      borderStyle: 'double'
    }
  },
  {
    id: 'peavey-jsx',
    brand: 'Peavey',
    model: 'JSX',
    type: 'head',
    description: 'Tête signature Satriani, trois canaux (Clean/Crunch/Ultra)',
    parameters: {
      gain: { min: 0, max: 10, default: 6 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      resonance: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#111827',
    style: 'high-gain',
    knobColor: '#22d3ee',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#0b111b', '#0f172a'],
      grillePattern: 'vertical',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  {
    id: 'lab-series-l5',
    brand: 'Lab Series',
    model: 'L5',
    type: 'combo',
    description: 'Combo solid-state jazz/blues très clean, EQ actif',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 }
    },
    color: '#111827',
    style: 'modern',
    knobColor: '#38bdf8',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#0f172a', '#1f2937'],
      grillePattern: 'grid',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'marshall-jtm45',
    brand: 'Marshall',
    model: 'JTM45',
    type: 'head',
    description: 'Premier modèle Marshall, clean chaleureux et crunch doux',
    parameters: {
      volume: { min: 0, max: 10, default: 6 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 }
    },
    color: '#0f0f0f',
    style: 'vintage',
    knobColor: '#d4af37',
    knobBaseColor: 'gold',
    uiStyle: {
      grilleGradient: ['#1f2937', '#0f172a'],
      grillePattern: 'vertical',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'marshall-1959slp',
    brand: 'Marshall',
    model: '1959SLP',
    type: 'head',
    description: 'Version reissue plexi Super Lead, grand headroom rock',
    parameters: {
      volume: { min: 0, max: 10, default: 6 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 }
    },
    color: '#111111',
    style: 'vintage',
    knobColor: '#eab308',
    knobBaseColor: 'gold',
    uiStyle: {
      grilleGradient: ['#0f172a', '#111827'],
      grillePattern: 'diagonal',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'soldano-slo100',
    brand: 'Soldano',
    model: 'SLO-100',
    type: 'head',
    description: 'Tête high-gain culte, sustain et définition haut de gamme',
    parameters: {
      gain: { min: 0, max: 10, default: 7 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'high-gain',
    knobColor: '#60a5fa',
    knobBaseColor: 'silver',
    uiStyle: {
      grilleGradient: ['#0b1020', '#111827'],
      grillePattern: 'grid',
      knobLayout: 'grid',
      borderStyle: 'double'
    }
  },
  {
    id: 'fender-vibrolux',
    brand: 'Fender',
    model: 'Vibrolux',
    type: 'combo',
    description: 'Combo 2x10" clair et légèrement compressé, tremolo intégré',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      reverb: { min: 0, max: 10, default: 4 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#374151',
    style: 'vintage',
    knobColor: '#3b82f6',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#6b7280', '#4b5563'],
      grillePattern: 'horizontal',
      knobLayout: 'compact',
      borderStyle: 'solid'
    }
  },
  {
    id: 'mesa-mark1',
    brand: 'Mesa Boogie',
    model: 'Mark I',
    type: 'combo',
    description: 'Mark I : clean Fender-like + drive chantant Santana',
    parameters: {
      gain: { min: 0, max: 10, default: 6 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#1f2937',
    style: 'vintage',
    knobColor: '#c084fc',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#312e81', '#1e1b4b'],
      grillePattern: 'grid',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'polytone-minibrute',
    brand: 'Polytone',
    model: 'Mini-Brute',
    type: 'combo',
    description: 'Combo jazz transistor, son rond et neutre',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'modern',
    knobColor: '#22c55e',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0b1020', '#0f172a'],
      grillePattern: 'horizontal',
      knobLayout: 'compact',
      borderStyle: 'solid'
    }
  },
  {
    id: 'standel-custom',
    brand: 'Standel',
    model: 'Custom',
    type: 'combo',
    description: 'Combo vintage haut de gamme, clean chaud et ample',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#4b5563',
    style: 'vintage',
    knobColor: '#f59e0b',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#6b7280', '#4b5563'],
      grillePattern: 'vertical',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'roland-jc120',
    brand: 'Roland',
    model: 'JC-120',
    type: 'combo',
    description: 'Combo stéréo transistor, chorus/delay intégrés, clean hifi',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'modern',
    knobColor: '#22d3ee',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#0b1020', '#111827'],
      grillePattern: 'grid',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'engl-powerball',
    brand: 'Engl',
    model: 'Powerball',
    type: 'head',
    description: 'Tête metal serrée, gros bas et clarté des aigus',
    parameters: {
      gain: { min: 0, max: 10, default: 7 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#111827',
    style: 'high-gain',
    knobColor: '#06b6d4',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0b1020', '#0f172a'],
      grillePattern: 'diagonal',
      knobLayout: 'grid',
      borderStyle: 'double'
    }
  },
  {
    id: 'randall-rg100es',
    brand: 'Randall',
    model: 'RG100ES',
    type: 'head',
    description: 'Transistor culte Dimebag, grain sec et agressif',
    parameters: {
      gain: { min: 0, max: 10, default: 7 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'high-gain',
    knobColor: '#f97316',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0b0f1a', '#0f172a'],
      grillePattern: 'vertical',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  {
    id: 'mesa-mark-iic-plus',
    brand: 'Mesa Boogie',
    model: 'Mark IIC+',
    type: 'head',
    description: 'Version mythique IIC+, compression et punch signature',
    parameters: {
      gain: { min: 0, max: 10, default: 7 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#1f2937',
    style: 'high-gain',
    knobColor: '#c084fc',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#111827', '#0b1020'],
      grillePattern: 'vertical',
      knobLayout: 'grid',
      borderStyle: 'double'
    }
  },
  {
    id: 'mesa-jp2c',
    brand: 'Mesa Boogie',
    model: 'JP2C',
    type: 'head',
    description: 'Signature Petrucci : Mark IIC+ modernisé, MIDI, 3 canaux',
    parameters: {
      gain: { min: 0, max: 10, default: 7 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'high-gain',
    knobColor: '#38bdf8',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0b1020', '#0f172a'],
      grillePattern: 'grid',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  {
    id: 'mesa-mark-v',
    brand: 'Mesa Boogie',
    model: 'Mark V',
    type: 'head',
    description: 'Tête polyvalente multi-modes (I, IIC+, IV), 3 canaux',
    parameters: {
      gain: { min: 0, max: 10, default: 6 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#111827',
    style: 'modern',
    knobColor: '#22d3ee',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0b1020', '#0f172a'],
      grillePattern: 'diagonal',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  {
    id: 'mesa-lonestar',
    brand: 'Mesa Boogie',
    model: 'Lonestar',
    type: 'combo',
    description: 'Combo boutique 6L6, clean ample et lead crémeux',
    parameters: {
      gain: { min: 0, max: 10, default: 6 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#1f2937',
    style: 'vintage',
    knobColor: '#f59e0b',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#78350f', '#451a03'],
      grillePattern: 'grid',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'hartley-thompson',
    brand: 'Hartley Thompson',
    model: 'Custom',
    type: 'head',
    description: 'Tête rare solid-state utilisée par Holdsworth, clean hifi',
    parameters: {
      gain: { min: 0, max: 10, default: 4 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 }
    },
    color: '#0b1020',
    style: 'modern',
    knobColor: '#22c55e',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0f172a', '#0b1020'],
      grillePattern: 'horizontal',
      knobLayout: 'compact',
      borderStyle: 'solid'
    }
  },
  {
    id: 'yamaha-dg80',
    brand: 'Yamaha',
    model: 'DG80',
    type: 'combo',
    description: 'Combo numérique modélisation 90s, son propre et direct',
    parameters: {
      gain: { min: 0, max: 10, default: 5 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'modern',
    knobColor: '#f97316',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#0b1020', '#1f2937'],
      grillePattern: 'grid',
      knobLayout: 'compact',
      borderStyle: 'solid'
    }
  },
  {
    id: 'fractal-axe-fx',
    brand: 'Fractal',
    model: 'Axe-FX',
    type: 'head',
    description: 'Processeur/modeleur haut de gamme, usage Tosin Abasi',
    parameters: {
      gain: { min: 0, max: 10, default: 5 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'modern',
    knobColor: '#22d3ee',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0b1020', '#0f172a'],
      grillePattern: 'none',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  {
    id: 'neural-quad-cortex',
    brand: 'Neural DSP',
    model: 'Quad Cortex',
    type: 'head',
    description: 'Pedalboard numérique/amp modeler, sons high-end modernes',
    parameters: {
      gain: { min: 0, max: 10, default: 5 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'modern',
    knobColor: '#a855f7',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0b0f1a', '#111827'],
      grillePattern: 'none',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  // Mesa Boogie
  {
    id: 'mesa-mark-v-alt',
    brand: 'Mesa Boogie',
    model: 'Mark V',
    type: 'head',
    description: 'Amplificateur haute-gain polyvalent, 5 canaux, son moderne et agressif',
    parameters: {
      gain: { min: 0, max: 10, default: 6 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#1a1a1a',
    style: 'high-gain',
    knobColor: '#fbbf24',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0f172a', '#1e293b'],
      grillePattern: 'grid',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  {
    id: 'mesa-dual-rectifier-alt',
    brand: 'Mesa Boogie',
    model: 'Dual Rectifier',
    type: 'head',
    description: 'Amplificateur high-gain légendaire, son rectifier caractéristique',
    parameters: {
      gain: { min: 0, max: 10, default: 7 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 6 },
      middle: { min: 0, max: 10, default: 4 },
      treble: { min: 0, max: 10, default: 6 },
      presence: { min: 0, max: 10, default: 5 },
      master: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'high-gain',
    knobColor: '#fbbf24',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0a0e1a', '#1a1f2e'],
      grillePattern: 'grid',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  // Orange
  {
    id: 'orange-rockerverb-alt',
    brand: 'Orange',
    model: 'Rockerverb 50',
    type: 'head',
    description: 'Amplificateur britannique, son chaud et organique avec reverb intégrée',
    parameters: {
      gain: { min: 0, max: 10, default: 5 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      middle: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 },
      reverb: { min: 0, max: 10, default: 4 }
    },
    color: '#ea580c',
    style: 'modern',
    knobColor: '#ffffff',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#c2410c', '#ea580c'],
      grillePattern: 'grid',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'orange-tiny-terror-alt',
    brand: 'Orange',
    model: 'Tiny Terror',
    type: 'head',
    description: 'Amplificateur compact 15W, son vintage chaud et saturé',
    parameters: {
      gain: { min: 0, max: 10, default: 6 },
      volume: { min: 0, max: 10, default: 5 },
      tone: { min: 0, max: 10, default: 5 }
    },
    color: '#ea580c',
    style: 'vintage',
    knobColor: '#ffffff',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#c2410c', '#ea580c'],
      grillePattern: 'grid',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  // Vox
  {
    id: 'vox-ac30-alt',
    brand: 'Vox',
    model: 'AC30',
    type: 'combo',
    description: 'Amplificateur combo britannique classique, son clair brillant et crunch caractéristique',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      tone: { min: 0, max: 10, default: 5 },
      reverb: { min: 0, max: 10, default: 4 }
    },
    color: '#0f766e',
    style: 'vintage',
    knobColor: '#ffffff',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#134e4a', '#0f766e'],
      grillePattern: 'vertical',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'vox-ac15-alt',
    brand: 'Vox',
    model: 'AC15',
    type: 'combo',
    description: 'Amplificateur combo 15W, son vintage chaud et saturé',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      tone: { min: 0, max: 10, default: 5 },
      reverb: { min: 0, max: 10, default: 4 }
    },
    color: '#0d9488',
    style: 'vintage',
    knobColor: '#ffffff',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#0f766e', '#0d9488'],
      grillePattern: 'vertical',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  // Peavey
  {
    id: 'peavey-5150-alt',
    brand: 'Peavey',
    model: '5150',
    type: 'head',
    description: 'Amplificateur high-gain légendaire, son agressif et puissant',
    parameters: {
      gain: { min: 0, max: 10, default: 7 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 6 },
      middle: { min: 0, max: 10, default: 4 },
      treble: { min: 0, max: 10, default: 6 },
      presence: { min: 0, max: 10, default: 5 },
      resonance: { min: 0, max: 10, default: 5 }
    },
    color: '#1a1a1a',
    style: 'high-gain',
    knobColor: '#ef4444',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0f172a', '#1e293b'],
      grillePattern: 'grid',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  {
    id: 'peavey-6505',
    brand: 'Peavey',
    model: '6505',
    type: 'head',
    description: 'Évolution du 5150, son high-gain moderne et agressif',
    parameters: {
      gain: { min: 0, max: 10, default: 7 },
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 6 },
      middle: { min: 0, max: 10, default: 4 },
      treble: { min: 0, max: 10, default: 6 },
      presence: { min: 0, max: 10, default: 5 },
      resonance: { min: 0, max: 10, default: 5 }
    },
    color: '#0f172a',
    style: 'high-gain',
    knobColor: '#ef4444',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0a0e1a', '#1a1f2e'],
      grillePattern: 'grid',
      knobLayout: 'grid',
      borderStyle: 'solid'
    }
  },
  // Supro
  {
    id: 'supro-blues-king',
    brand: 'Supro',
    model: 'Blues King 12',
    type: 'combo',
    description: 'Amplificateur combo vintage, son blues chaud et organique',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      tone: { min: 0, max: 10, default: 5 },
      reverb: { min: 0, max: 10, default: 4 }
    },
    color: '#78350f',
    style: 'vintage',
    knobColor: '#fbbf24',
    knobBaseColor: 'chrome',
    uiStyle: {
      grilleGradient: ['#92400e', '#a16207'],
      grillePattern: 'horizontal',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  },
  {
    id: 'supro-black-magick',
    brand: 'Supro',
    model: 'Black Magick',
    type: 'head',
    description: 'Amplificateur boutique, son vintage chaud avec saturation organique',
    parameters: {
      volume: { min: 0, max: 10, default: 5 },
      bass: { min: 0, max: 10, default: 5 },
      treble: { min: 0, max: 10, default: 5 },
      tone: { min: 0, max: 10, default: 5 },
      presence: { min: 0, max: 10, default: 5 }
    },
    color: '#1a1a1a',
    style: 'vintage',
    knobColor: '#fbbf24',
    knobBaseColor: 'black',
    uiStyle: {
      grilleGradient: ['#0f172a', '#1e293b'],
      grillePattern: 'grid',
      knobLayout: 'horizontal',
      borderStyle: 'solid'
    }
  }
]

