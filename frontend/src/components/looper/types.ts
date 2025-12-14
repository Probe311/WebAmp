export interface LooperTrack {
  id: string
  name: string
  muted: boolean
  solo: boolean
  volume: number
  waveformData: number[] // Pourcentage de hauteur pour chaque barre (0-100)
  color: string // Classe Tailwind pour la couleur
  audioBuffer?: Float32Array // Buffer audio réel
}

export interface LooperProject {
  name: string
  tempo: number // BPM
  tracks: LooperTrack[]
}

