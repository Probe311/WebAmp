// Types pour le DAW (Digital Audio Workstation)

export type TrackType = 'audio' | 'midi' | 'drums'

export interface AudioRegion {
  id: string
  start: number // en barres (bars)
  duration: number // en barres
  name: string
  color: string
  audioBuffer?: AudioBuffer // Buffer audio chargé
  filePath?: string // Chemin vers le fichier audio
}

export interface MidiNote {
  x: number // Position en 16th notes depuis le début de la région
  y: number // Pitch (0-11, où 0 = C, 1 = C#, etc.)
  w: number // Durée en 16th notes
  velocity?: number // Vélocité (0-127)
}

export interface MidiRegion {
  id: string
  start: number // en barres
  duration: number // en barres
  name: string
  color: string
  notes: MidiNote[]
}

export type Region = AudioRegion | MidiRegion

export interface DawTrack {
  id: string
  name: string
  type: TrackType
  color: string
  iconName?: string // Nom de l'icône Lucide (ex: 'Piano', 'Activity', 'Guitar', etc.)
  muted: boolean
  solo: boolean
  armed: boolean
  volume: number // 0-100
  pan: number // -50 à +50
  regions: Region[]
}

export interface DawProject {
  id: string
  name: string
  bpm: number
  timeSignature: [number, number] // [numérateur, dénominateur]
  tracks: DawTrack[]
  createdAt: Date
  updatedAt: Date
}

export type Tool = 'pointer' | 'pencil' | 'scissors' | 'hand'

export interface DraggingState {
  trackId: string
  regionId: string
  startX: number
  initialStart: number
  type: 'move' | 'resize'
}

export interface PluginSlot {
  id: string
  name: string
  type: 'EQ' | 'DYN' | 'DIST' | 'REV' | 'MOD' | 'DELAY'
  active: boolean
  params: Record<string, number>
}

