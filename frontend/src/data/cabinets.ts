// Bibliothèque de cabinets avec Impulse Responses
export interface CabinetModel {
  id: string
  brand: string
  model: string
  type: '1x12' | '2x12' | '4x12' | '1x15' | '2x15' | '4x10' | '8x10'
  speakers: string[]
  description: string
  irUrl?: string // URL de l'IR si disponible
  color: string
  style: 'vintage' | 'modern' | 'boutique'
}

export const cabinetLibrary: CabinetModel[] = [
  // Fender
  {
    id: 'fender-2x12-deluxe',
    brand: 'Fender',
    model: '2x12 Deluxe',
    type: '2x12',
    speakers: ['Jensen C12N'],
    description: 'Cabinet 2x12 classique avec haut-parleurs Jensen',
    color: '#92400e',
    style: 'vintage'
  },
  {
    id: 'fender-4x10-bassman',
    brand: 'Fender',
    model: '4x10 Bassman',
    type: '4x10',
    speakers: ['Jensen P10R'],
    description: 'Cabinet 4x10 légendaire pour basse',
    color: '#78350f',
    style: 'vintage'
  },
  // Marshall
  {
    id: 'marshall-1960a',
    brand: 'Marshall',
    model: '1960A',
    type: '4x12',
    speakers: ['Celestion G12T-75'],
    description: 'Cabinet 4x12 iconique avec Celestion G12T-75',
    color: '#1a1a1a',
    style: 'vintage'
  },
  {
    id: 'marshall-1960b',
    brand: 'Marshall',
    model: '1960B',
    type: '4x12',
    speakers: ['Celestion G12M-25'],
    description: 'Cabinet 4x12 avec Greenbacks',
    color: '#0f172a',
    style: 'vintage'
  },
  // Mesa Boogie
  {
    id: 'mesa-4x12-rectifier',
    brand: 'Mesa Boogie',
    model: '4x12 Rectifier',
    type: '4x12',
    speakers: ['Celestion V30'],
    description: 'Cabinet 4x12 avec Celestion Vintage 30',
    color: '#1a1a1a',
    style: 'modern'
  },
  // Orange
  {
    id: 'orange-ppc412',
    brand: 'Orange',
    model: 'PPC412',
    type: '4x12',
    speakers: ['Celestion V30'],
    description: 'Cabinet 4x12 Orange avec V30',
    color: '#ea580c',
    style: 'modern'
  },
  // Vox
  {
    id: 'vox-ac30-2x12',
    brand: 'Vox',
    model: 'AC30 2x12',
    type: '2x12',
    speakers: ['Celestion Alnico Blue'],
    description: 'Cabinet 2x12 avec Alnico Blue',
    color: '#0f766e',
    style: 'vintage'
  },
  // Ampeg
  {
    id: 'ampeg-8x10-svt',
    brand: 'Ampeg',
    model: '8x10 SVT',
    type: '8x10',
    speakers: ['Eminence 10"'],
    description: 'Cabinet 8x10 pour basse',
    color: '#1a1a1a',
    style: 'vintage'
  }
]

