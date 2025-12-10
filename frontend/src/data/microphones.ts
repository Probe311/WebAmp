// Types de microphones pour simulation
export interface MicrophoneModel {
  id: string
  brand: string
  model: string
  type: 'dynamic' | 'condenser' | 'ribbon'
  frequencyResponse: {
    low: number // Hz
    high: number // Hz
    peak?: number // Hz (fréquence de pic)
  }
  polarPattern: 'cardioid' | 'omni' | 'figure8' | 'supercardioid'
  description: string
  color: string
}

export const microphoneLibrary: MicrophoneModel[] = [
  // Dynamic
  {
    id: 'shure-sm57',
    brand: 'Shure',
    model: 'SM57',
    type: 'dynamic',
    frequencyResponse: {
      low: 40,
      high: 15000,
      peak: 5000
    },
    polarPattern: 'cardioid',
    description: 'Microphone dynamique classique, idéal pour guitare',
    color: '#1a1a1a'
  },
  {
    id: 'shure-sm58',
    brand: 'Shure',
    model: 'SM58',
    type: 'dynamic',
    frequencyResponse: {
      low: 50,
      high: 15000,
      peak: 2000
    },
    polarPattern: 'cardioid',
    description: 'Microphone dynamique vocal, polyvalent',
    color: '#1a1a1a'
  },
  {
    id: 'sennheiser-md421',
    brand: 'Sennheiser',
    model: 'MD 421',
    type: 'dynamic',
    frequencyResponse: {
      low: 30,
      high: 17000,
      peak: 3000
    },
    polarPattern: 'cardioid',
    description: 'Microphone dynamique professionnel',
    color: '#0f172a'
  },
  // Condenser
  {
    id: 'neumann-u87',
    brand: 'Neumann',
    model: 'U87',
    type: 'condenser',
    frequencyResponse: {
      low: 20,
      high: 20000,
      peak: 5000
    },
    polarPattern: 'cardioid',
    description: 'Microphone à condensateur studio professionnel',
    color: '#92400e'
  },
  {
    id: 'akg-c414',
    brand: 'AKG',
    model: 'C414',
    type: 'condenser',
    frequencyResponse: {
      low: 20,
      high: 20000,
      peak: 4000
    },
    polarPattern: 'cardioid',
    description: 'Microphone à condensateur polyvalent',
    color: '#1a1a1a'
  },
  // Ribbon
  {
    id: 'royer-r121',
    brand: 'Royer',
    model: 'R-121',
    type: 'ribbon',
    frequencyResponse: {
      low: 30,
      high: 15000,
      peak: 3000
    },
    polarPattern: 'figure8',
    description: 'Microphone ruban pour son chaud et naturel',
    color: '#78350f'
  }
]

// Positions de microphone
export type MicrophonePosition = 'on-axis' | 'off-axis-15' | 'off-axis-30' | 'off-axis-45' | 'edge' | 'back'

export interface MicrophoneConfig {
  microphoneId: string
  position: MicrophonePosition
  distance: number // cm (distance du micro au baffle)
  mix: number // 0-100 (si plusieurs micros)
}

