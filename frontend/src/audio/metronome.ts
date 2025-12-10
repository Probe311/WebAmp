/**
 * Metronome - Métronome intégré
 */

export interface MetronomeConfig {
  tempo: number // BPM (30-300)
  timeSignature: [number, number] // [beats, noteValue] ex: [4, 4] = 4/4
  subdivisions: number // 1, 2, 4, 8 (noires, croches, doubles, triples)
  accentFirstBeat: boolean
}

export interface MetronomeState {
  isPlaying: boolean
  currentBeat: number
  currentSubdivision: number
}

export class Metronome {
  private audioCtx: AudioContext
  private config: MetronomeConfig
  private state: MetronomeState
  private intervalId: number | null = null

  constructor(audioCtx: AudioContext, config: MetronomeConfig) {
    this.audioCtx = audioCtx
    this.config = config
    this.state = {
      isPlaying: false,
      currentBeat: 0,
      currentSubdivision: 0
    }
  }

  /**
   * Démarrer le métronome
   */
  start(): void {
    if (this.state.isPlaying) {
      return
    }

    // Vérifier que l'AudioContext est actif
    if (this.audioCtx.state !== 'running') {
      console.warn('Métronome: AudioContext non actif, état:', this.audioCtx.state)
      return
    }

    this.state.isPlaying = true
    this.state.currentBeat = 0
    this.state.currentSubdivision = 0

    // Calculer l'intervalle entre les subdivisions
    const beatDuration = 60 / this.config.tempo // secondes par beat
    const subdivisionDuration = beatDuration / this.config.subdivisions
    const intervalMs = subdivisionDuration * 1000

    console.log('Métronome: Démarrage avec intervalle', intervalMs, 'ms, tempo:', this.config.tempo, 'subdivisions:', this.config.subdivisions)

    // Démarrer le timer
    this.intervalId = window.setInterval(() => {
      this.playTick()
    }, intervalMs)

    // Jouer le premier tick immédiatement
    this.playTick()
    console.log('Métronome: Premier tick joué')
  }

  /**
   * Arrêter le métronome
   */
  stop(): void {
    if (!this.state.isPlaying) {
      return
    }

    this.state.isPlaying = false

    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  /**
   * Jouer un tick
   */
  private playTick(): void {
    // Vérifier que l'AudioContext est toujours actif
    if (this.audioCtx.state !== 'running') {
      console.warn('Métronome: AudioContext non actif lors du tick, état:', this.audioCtx.state)
      return
    }

    const isFirstBeat = this.state.currentSubdivision === 0
    const isAccent = this.config.accentFirstBeat && isFirstBeat

    // Fréquence et volume selon le type de tick
    const frequency = isAccent ? 800 : 400
    const volume = isAccent ? 0.3 : 0.1

    try {
      // Créer un nouveau gain pour l'enveloppe
      const envelope = this.audioCtx.createGain()
      envelope.gain.setValueAtTime(0, this.audioCtx.currentTime)
      envelope.gain.linearRampToValueAtTime(volume, this.audioCtx.currentTime + 0.001)
      envelope.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.05)

      // Créer un oscillateur temporaire pour le tick
      const tickOsc = this.audioCtx.createOscillator()
      tickOsc.type = 'sine'
      tickOsc.frequency.value = frequency
      tickOsc.connect(envelope)
      envelope.connect(this.audioCtx.destination)

      tickOsc.start()
      tickOsc.stop(this.audioCtx.currentTime + 0.1)
    } catch (error) {
      console.error('Métronome: Erreur lors de la création du tick:', error)
      return
    }

    // Mettre à jour l'état
    this.state.currentSubdivision++
    if (this.state.currentSubdivision >= this.config.subdivisions) {
      this.state.currentSubdivision = 0
      this.state.currentBeat++
      if (this.state.currentBeat >= this.config.timeSignature[0]) {
        this.state.currentBeat = 0
      }
    }
  }

  /**
   * Définir le tempo
   */
  setTempo(tempo: number): void {
    this.config.tempo = Math.max(30, Math.min(300, tempo))
    
    // Redémarrer si en cours
    if (this.state.isPlaying) {
      this.stop()
      this.start()
    }
  }

  /**
   * Définir la signature rythmique
   */
  setTimeSignature(beats: number, noteValue: number): void {
    this.config.timeSignature = [beats, noteValue]
    this.state.currentBeat = 0
    
    // Redémarrer si en cours
    if (this.state.isPlaying) {
      this.stop()
      this.start()
    }
  }

  /**
   * Définir les subdivisions
   */
  setSubdivisions(subdivisions: number): void {
    this.config.subdivisions = subdivisions
    this.state.currentSubdivision = 0
    
    // Redémarrer si en cours
    if (this.state.isPlaying) {
      this.stop()
      this.start()
    }
  }

  /**
   * Activer/désactiver l'accent sur le premier temps
   */
  setAccentFirstBeat(accent: boolean): void {
    this.config.accentFirstBeat = accent
  }

  /**
   * Obtient l'état actuel
   */
  getState(): MetronomeState {
    return { ...this.state }
  }

  /**
   * Obtient la configuration
   */
  getConfig(): MetronomeConfig {
    return { ...this.config }
  }
}

