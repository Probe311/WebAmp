/**
 * Tuner - Accordeur intégré avec détection de note
 */

export interface TunerState {
  note: string | null
  cents: number // -50 à +50 (écart en cents)
  frequency: number // Hz
  isInTune: boolean
}

export type Tuning = 'standard' | 'dropD' | 'dropC' | 'openG' | 'openD' | 'dadgad'

export const TUNING_NOTES: Record<Tuning, string[]> = {
  standard: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  dropD: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
  dropC: ['C2', 'G2', 'C3', 'F3', 'A3', 'D4'],
  openG: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
  openD: ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'],
  dadgad: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4']
}

// Fréquences des notes (A4 = 440Hz)
const NOTE_FREQUENCIES: Record<string, number> = {
  'C0': 16.35, 'C#0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'E0': 20.60, 'F0': 21.83,
  'F#0': 23.12, 'G0': 24.50, 'G#0': 25.96, 'A0': 27.50, 'A#0': 29.14, 'B0': 30.87,
  'C1': 32.70, 'C#1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'E1': 41.20, 'F1': 43.65,
  'F#1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'A1': 55.00, 'A#1': 58.27, 'B1': 61.74,
  'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
  'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
  'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
  'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
  'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77
}

export class Tuner {
  private audioCtx: AudioContext
  private analyser: AnalyserNode
  private dataArray: Uint8Array<ArrayBuffer>
  private state: TunerState
  private tuning: Tuning = 'standard'
  private threshold: number = 0.01 // Seuil minimum pour détecter une note

  constructor(audioCtx: AudioContext, analyserNode: AnalyserNode) {
    this.audioCtx = audioCtx
    this.analyser = analyserNode
    this.analyser.fftSize = 8192
    this.analyser.smoothingTimeConstant = 0.3
    this.dataArray = new Uint8Array(
      new ArrayBuffer(this.analyser.frequencyBinCount)
    ) as Uint8Array<ArrayBuffer>
    
    this.state = {
      note: null,
      cents: 0,
      frequency: 0,
      isInTune: false
    }
  }

  /**
   * Détecte la note actuelle
   */
  detectNote(): TunerState {
    this.analyser.getByteFrequencyData(this.dataArray)

    // Trouver la fréquence dominante
    let maxIndex = 0
    let maxValue = 0

    for (let i = 0; i < this.dataArray.length; i++) {
      if (this.dataArray[i] > maxValue) {
        maxValue = this.dataArray[i]
        maxIndex = i
      }
    }

    // Convertir l'index en fréquence
    const nyquist = this.audioCtx.sampleRate / 2
    const frequency = (maxIndex * nyquist) / this.dataArray.length

    // Vérifier le seuil
    const normalizedValue = maxValue / 255
    if (normalizedValue < this.threshold) {
      this.state = {
        note: null,
        cents: 0,
        frequency: 0,
        isInTune: false
      }
      return this.state
    }

    // Trouver la note la plus proche
    const note = this.findClosestNote(frequency)
    const targetFreq = NOTE_FREQUENCIES[note]
    
    // Calculer l'écart en cents
    const cents = 1200 * Math.log2(frequency / targetFreq)
    const isInTune = Math.abs(cents) < 5 // ±5 cents = accordé

    this.state = {
      note,
      cents: Math.max(-50, Math.min(50, cents)),
      frequency,
      isInTune
    }

    return this.state
  }

  /**
   * Trouve la note la plus proche d'une fréquence
   */
  private findClosestNote(frequency: number): string {
    let closestNote = 'A4'
    let minDiff = Infinity

    for (const [note, noteFreq] of Object.entries(NOTE_FREQUENCIES)) {
      const diff = Math.abs(frequency - noteFreq)
      if (diff < minDiff) {
        minDiff = diff
        closestNote = note
      }
    }

    return closestNote
  }

  /**
   * Définit l'accordage
   */
  setTuning(tuning: Tuning): void {
    this.tuning = tuning
  }

  /**
   * Obtient l'état actuel
   */
  getState(): TunerState {
    return { ...this.state }
  }

  /**
   * Obtient les notes de l'accordage actuel
   */
  getTuningNotes(): string[] {
    return TUNING_NOTES[this.tuning]
  }
}

