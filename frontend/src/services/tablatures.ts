// Service pour gérer les tablatures et la notation musicale
// Utilise VexFlow pour le rendu des tablatures

export interface TablatureNote {
  string: number // 1-6 (de la plus grave à la plus aiguë)
  fret: number // 0-24
  duration?: string // 'w', 'h', 'q', '8', '16', etc.
}

export interface TablatureMeasure {
  notes: TablatureNote[]
  timeSignature?: string // '4/4', '3/4', etc.
}

export interface Tablature {
  id: string
  title: string
  artist?: string
  tempo?: number // BPM
  timeSignature?: string
  key?: string // 'C', 'Am', etc.
  measures: TablatureMeasure[]
  presetId?: string // ID du preset associé dans WebAmp
}

export interface Chord {
  name: string // 'C', 'Am', 'Dm7', etc.
  frets: number[] // [0, 1, 0, 2, 3, 0] pour chaque corde (6 cordes)
  fingers?: number[] // [0, 1, 0, 2, 3, 0] pour indiquer les doigts
  baseFret?: number // Pour les accords barrés
}

class TablatureService {
  private tablatures: Map<string, Tablature> = new Map()
  private chords: Map<string, Chord> = new Map()

  constructor() {
    this.initializeChords()
    this.initializeExampleTablatures()
  }

  /**
   * Initialise les accords de base
   */
  private initializeChords(): void {
    const basicChords: Chord[] = [
      // Accords majeurs
      { name: 'C', frets: [0, 1, 0, 2, 3, 0], fingers: [0, 1, 0, 2, 3, 0] },
      { name: 'D', frets: [0, 0, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2] },
      { name: 'E', frets: [0, 0, 1, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
      { name: 'G', frets: [3, 0, 0, 0, 2, 3], fingers: [3, 0, 0, 0, 1, 4] },
      { name: 'A', frets: [0, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0] },
      
      // Accords mineurs
      { name: 'Am', frets: [0, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0] },
      { name: 'Dm', frets: [0, 0, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1] },
      { name: 'Em', frets: [0, 0, 0, 2, 2, 0], fingers: [0, 0, 0, 1, 2, 0] },
      
      // Accords de 7ème
      { name: 'C7', frets: [0, 1, 0, 2, 1, 0], fingers: [0, 1, 0, 3, 2, 0] },
      { name: 'G7', frets: [3, 0, 0, 0, 2, 1], fingers: [3, 0, 0, 0, 2, 1] },
      { name: 'A7', frets: [0, 0, 2, 0, 2, 0], fingers: [0, 0, 2, 0, 3, 0] },
      { name: 'A7sus4', frets: [0, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] },
      
      // Accords majeurs supplémentaires
      { name: 'F', frets: [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1], baseFret: 1 },
      { name: 'F#', frets: [2, 4, 4, 3, 2, 2], fingers: [1, 3, 4, 2, 1, 1], baseFret: 2 },
      
      // Power chords (accords de puissance) - forme ouverte
      { name: 'E5', frets: [0, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] },
      { name: 'A5', frets: [0, 0, 2, 2, 0, 0], fingers: [0, 0, 1, 2, 0, 0] },
      { name: 'D5', frets: [0, 0, 0, 2, 3, 0], fingers: [0, 0, 0, 1, 2, 0] },
      { name: 'G5', frets: [3, 3, 0, 0, 0, 3], fingers: [1, 2, 0, 0, 0, 3] },
      { name: 'C5', frets: [3, 3, 5, 5, 3, 3], fingers: [1, 1, 3, 4, 1, 1], baseFret: 3 },
      { name: 'B5', frets: [2, 2, 4, 4, 2, 2], fingers: [1, 1, 3, 4, 1, 1], baseFret: 2 },
    ]

    basicChords.forEach(chord => {
      this.chords.set(chord.name, chord)
    })
  }

  /**
   * Initialise quelques tablatures d'exemple
   */
  private initializeExampleTablatures(): void {
    // Exemple : Progression d'accords simple
    const simpleProgression: Tablature = {
      id: 'example-001',
      title: 'Progression Blues Simple',
      artist: 'Exemple',
      tempo: 120,
      timeSignature: '4/4',
      key: 'A',
      measures: [
        {
          notes: [
            { string: 5, fret: 0, duration: 'q' }, // A
            { string: 5, fret: 0, duration: 'q' },
            { string: 5, fret: 0, duration: 'q' },
            { string: 5, fret: 0, duration: 'q' },
          ]
        },
        {
          notes: [
            { string: 4, fret: 2, duration: 'q' }, // D
            { string: 4, fret: 2, duration: 'q' },
            { string: 4, fret: 2, duration: 'q' },
            { string: 4, fret: 2, duration: 'q' },
          ]
        },
        {
          notes: [
            { string: 5, fret: 0, duration: 'q' }, // A
            { string: 5, fret: 0, duration: 'q' },
            { string: 5, fret: 0, duration: 'q' },
            { string: 5, fret: 0, duration: 'q' },
          ]
        },
        {
          notes: [
            { string: 4, fret: 0, duration: 'q' }, // E
            { string: 4, fret: 0, duration: 'q' },
            { string: 4, fret: 0, duration: 'q' },
            { string: 4, fret: 0, duration: 'q' },
          ]
        },
      ],
      presetId: 'blues-classic'
    }

    this.tablatures.set(simpleProgression.id, simpleProgression)

    // Tablature pour Wonderwall - Oasis
    const wonderwallTablature: Tablature = {
      id: 'wonderwall-001',
      title: 'Wonderwall - Oasis',
      artist: 'Oasis',
      tempo: 88,
      timeSignature: '4/4',
      key: 'Em',
      measures: [
        {
          notes: [
            { string: 6, fret: 0, duration: 'q' }, // Em
            { string: 5, fret: 0, duration: 'q' },
            { string: 4, fret: 2, duration: 'q' },
            { string: 3, fret: 2, duration: 'q' },
            { string: 2, fret: 0, duration: 'q' },
            { string: 1, fret: 0, duration: 'q' },
          ]
        },
        {
          notes: [
            { string: 6, fret: 3, duration: 'q' }, // G
            { string: 5, fret: 0, duration: 'q' },
            { string: 4, fret: 0, duration: 'q' },
            { string: 3, fret: 0, duration: 'q' },
            { string: 2, fret: 0, duration: 'q' },
            { string: 1, fret: 3, duration: 'q' },
          ]
        },
        {
          notes: [
            { string: 4, fret: 0, duration: 'q' }, // D
            { string: 3, fret: 2, duration: 'q' },
            { string: 2, fret: 3, duration: 'q' },
            { string: 1, fret: 2, duration: 'q' },
          ]
        },
        {
          notes: [
            { string: 5, fret: 0, duration: 'q' }, // A7sus4
            { string: 4, fret: 2, duration: 'q' },
            { string: 3, fret: 2, duration: 'q' },
            { string: 2, fret: 0, duration: 'q' },
            { string: 1, fret: 0, duration: 'q' },
          ]
        },
      ],
      presetId: 'oasis-wonderwall'
    }

    this.tablatures.set(wonderwallTablature.id, wonderwallTablature)
  }

  /**
   * Récupère un accord par nom
   */
  getChord(name: string): Chord | undefined {
    return this.chords.get(name)
  }

  /**
   * Récupère tous les accords disponibles
   */
  getAllChords(): Chord[] {
    return Array.from(this.chords.values())
  }

  /**
   * Recherche des accords par nom
   */
  searchChords(query: string): Chord[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.chords.values()).filter(chord =>
      chord.name.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Récupère une tablature par ID
   */
  getTablature(id: string): Tablature | undefined {
    return this.tablatures.get(id)
  }

  /**
   * Récupère toutes les tablatures
   */
  getAllTablatures(): Tablature[] {
    return Array.from(this.tablatures.values())
  }

  /**
   * Recherche des tablatures
   */
  searchTablatures(query: string): Tablature[] {
    const lowerQuery = query.toLowerCase()
    return Array.from(this.tablatures.values()).filter(tab =>
      tab.title.toLowerCase().includes(lowerQuery) ||
      (tab.artist && tab.artist.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Récupère les tablatures associées à un preset
   */
  getTablaturesByPreset(presetId: string): Tablature[] {
    return Array.from(this.tablatures.values()).filter(tab =>
      tab.presetId === presetId
    )
  }

  /**
   * Ajoute une nouvelle tablature
   */
  addTablature(tablature: Tablature): void {
    this.tablatures.set(tablature.id, tablature)
  }

  /**
   * Supprime une tablature
   */
  removeTablature(id: string): void {
    this.tablatures.delete(id)
  }
}

export const tablatureService = new TablatureService()

