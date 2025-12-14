import { LooperTrack } from './types'

/**
 * Génère des données de waveform à partir d'un buffer audio
 * @param buffer Buffer audio (Float32Array)
 * @param numBars Nombre de barres à générer
 * @returns Tableau de pourcentages (0-100) pour chaque barre
 */
export function generateWaveformData(buffer: Float32Array, numBars: number = 64): number[] {
  if (!buffer || buffer.length === 0) {
    return Array(numBars).fill(0)
  }

  const samplesPerBar = Math.floor(buffer.length / numBars)
  const waveform: number[] = []

  for (let i = 0; i < numBars; i++) {
    const start = i * samplesPerBar
    const end = Math.min(start + samplesPerBar, buffer.length)
    
    // Calculer la valeur RMS (Root Mean Square) pour cette section
    let sumSquares = 0
    let count = 0
    
    for (let j = start; j < end; j++) {
      const sample = Math.abs(buffer[j])
      sumSquares += sample * sample
      count++
    }
    
    const rms = count > 0 ? Math.sqrt(sumSquares / count) : 0
    // Convertir en pourcentage (0-100)
    const percentage = Math.min(100, Math.max(0, rms * 100 * 2)) // Multiplier par 2 pour plus de visibilité
    waveform.push(percentage)
  }

  return waveform
}

/**
 * Génère une couleur aléatoire pour une piste
 */
export function generateTrackColor(trackIndex: number): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
    'bg-teal-500',
    'bg-cyan-500'
  ]
  return colors[trackIndex % colors.length]
}

/**
 * Génère un nom de piste par défaut
 */
export function generateTrackName(trackIndex: number): string {
  return `Track ${trackIndex + 1}`
}

/**
 * Convertit un Float32Array en LooperTrack
 */
export function audioBufferToTrack(
  buffer: Float32Array,
  trackIndex: number,
  trackId: string
): LooperTrack {
  return {
    id: trackId,
    name: generateTrackName(trackIndex),
    muted: false,
    solo: false,
    volume: 100,
    waveformData: generateWaveformData(buffer),
    color: generateTrackColor(trackIndex),
    audioBuffer: buffer
  }
}

