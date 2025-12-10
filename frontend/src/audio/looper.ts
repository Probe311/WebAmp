/**
 * Looper - Enregistrement et lecture de boucles
 */

export interface LooperConfig {
  maxLength: number // secondes
  sampleRate: number
}

export interface LooperState {
  isRecording: boolean
  isPlaying: boolean
  loopLength: number // secondes
  currentPosition: number // secondes
  tracks: Float32Array[] // Pistes enregistrées
}

export class Looper {
  private audioCtx: AudioContext
  private config: LooperConfig
  private state: LooperState
  private recordingBuffer: Float32Array | null = null
  private recordingStartTime: number = 0
  private loopNode: ScriptProcessorNode | null = null
  private recordingNode: ScriptProcessorNode | null = null
  private inputSource: AudioNode | null = null
  private isReversed: boolean = false
  private playbackSpeed: number = 1.0 // 0.5 = half-speed, 2.0 = double-speed

  constructor(audioCtx: AudioContext, config: LooperConfig) {
    this.audioCtx = audioCtx
    this.config = config
    this.state = {
      isRecording: false,
      isPlaying: false,
      loopLength: 0,
      currentPosition: 0,
      tracks: []
    }
  }

  /**
   * Connecte une source audio pour l'enregistrement
   */
  connectInput(source: AudioNode): void {
    this.inputSource = source
  }

  /**
   * Démarrer l'enregistrement
   */
  startRecording(): void {
    if (this.state.isRecording || !this.inputSource) {
      return
    }

    this.state.isRecording = true
    this.recordingStartTime = this.audioCtx.currentTime
    const bufferSize = Math.floor(this.config.maxLength * this.config.sampleRate)
    this.recordingBuffer = new Float32Array(bufferSize)

    // Créer un ScriptProcessorNode pour capturer l'audio
    this.recordingNode = this.audioCtx.createScriptProcessor(4096, 2, 0)
    let bufferIndex = 0

    this.recordingNode.onaudioprocess = (e) => {
      if (!this.recordingBuffer || !this.state.isRecording) {
        return
      }

      const inputL = e.inputBuffer.getChannelData(0)
      const inputR = e.inputBuffer.getChannelData(1)
      
      for (let i = 0; i < inputL.length && bufferIndex < this.recordingBuffer.length; i++) {
        // Mixer stéréo en mono
        this.recordingBuffer[bufferIndex++] = (inputL[i] + inputR[i]) / 2
      }
    }

    // Connecter la source à l'enregistrement
    this.inputSource.connect(this.recordingNode)
    // Connecter aussi à la destination pour entendre pendant l'enregistrement
    this.recordingNode.connect(this.audioCtx.destination)
  }

  /**
   * Arrêter l'enregistrement et créer une piste
   */
  stopRecording(): void {
    if (!this.state.isRecording) {
      return
    }

    this.state.isRecording = false
    
    if (this.recordingNode) {
      this.recordingNode.disconnect()
      this.recordingNode = null
    }

    const recordingTime = this.audioCtx.currentTime - this.recordingStartTime
    
    if (this.recordingBuffer && recordingTime > 0) {
      // Créer une piste avec la longueur enregistrée
      const trackLength = Math.floor(recordingTime * this.config.sampleRate)
      const track = new Float32Array(trackLength)
      track.set(this.recordingBuffer.subarray(0, trackLength))
      
      this.state.tracks.push(track)
      this.state.loopLength = Math.max(this.state.loopLength, recordingTime)
    }

    this.recordingBuffer = null
  }

  /**
   * Démarrer la lecture
   */
  startPlayback(): void {
    if (this.state.isPlaying || this.state.tracks.length === 0) {
      return
    }

    this.state.isPlaying = true

    // Créer un ScriptProcessorNode pour la lecture
    this.loopNode = this.audioCtx.createScriptProcessor(4096, 0, 2)
    
    let position = 0
    
    this.loopNode.onaudioprocess = (e) => {
      const outputL = e.outputBuffer.getChannelData(0)
      const outputR = e.outputBuffer.getChannelData(1)
      const frameCount = outputL.length

      // Mixer toutes les pistes
      for (let i = 0; i < frameCount; i++) {
        let sampleL = 0
        let sampleR = 0

        if (this.state.tracks.length > 0) {
          for (const track of this.state.tracks) {
            const trackPosition = Math.floor(position * this.playbackSpeed) % track.length
            const sample = this.isReversed 
              ? track[track.length - 1 - trackPosition]
              : track[trackPosition]
            
            sampleL += sample
            sampleR += sample
          }

          // Normaliser
          const numTracks = this.state.tracks.length
          outputL[i] = sampleL / numTracks
          outputR[i] = sampleR / numTracks
        } else {
          outputL[i] = 0
          outputR[i] = 0
        }

        position++
        if (this.state.loopLength > 0) {
          const maxPosition = this.state.loopLength * this.config.sampleRate
          if (position >= maxPosition) {
            position = 0
          }
        }
      }

      this.state.currentPosition = this.state.loopLength > 0 
        ? (position / this.config.sampleRate) % this.state.loopLength
        : 0
    }

    this.loopNode.connect(this.audioCtx.destination)
  }

  /**
   * Arrêter la lecture
   */
  stopPlayback(): void {
    if (!this.state.isPlaying) {
      return
    }

    this.state.isPlaying = false
    if (this.loopNode) {
      this.loopNode.disconnect()
      this.loopNode = null
    }
  }

  /**
   * Overdub (enregistrer par-dessus)
   */
  startOverdub(): void {
    if (this.state.tracks.length === 0) {
      this.startRecording()
      return
    }

    // Enregistrer dans une nouvelle piste
    this.startRecording()
  }

  /**
   * Reverse (inverser la lecture)
   */
  toggleReverse(): void {
    this.isReversed = !this.isReversed
  }

  /**
   * Changer la vitesse de lecture
   */
  setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = Math.max(0.25, Math.min(4.0, speed)) // 0.25x à 4x
  }

  /**
   * Exporter la boucle en AudioBuffer
   */
  exportToAudioBuffer(): AudioBuffer | null {
    if (this.state.tracks.length === 0) {
      return null
    }

    const length = Math.floor(this.state.loopLength * this.config.sampleRate)
    const buffer = this.audioCtx.createBuffer(2, length, this.config.sampleRate)

    // Mixer toutes les pistes
    for (let i = 0; i < length; i++) {
      let sampleL = 0
      let sampleR = 0

      for (const track of this.state.tracks) {
        const sample = i < track.length ? track[i] : 0
        sampleL += sample
        sampleR += sample
      }

      const numTracks = this.state.tracks.length
      buffer.getChannelData(0)[i] = sampleL / numTracks
      buffer.getChannelData(1)[i] = sampleR / numTracks
    }

    return buffer
  }

  /**
   * Exporter en WAV (Blob)
   */
  async exportToWAV(): Promise<Blob | null> {
    const buffer = this.exportToAudioBuffer()
    if (!buffer) {
      return null
    }

    // Convertir AudioBuffer en WAV
    const wav = audioBufferToWav(buffer)
    return new Blob([wav], { type: 'audio/wav' })
  }

  /**
   * Effacer toutes les pistes
   */
  clear(): void {
    this.stopRecording()
    this.stopPlayback()
    this.state.tracks = []
    this.state.loopLength = 0
    this.state.currentPosition = 0
  }

  getState(): LooperState {
    return { ...this.state }
  }
}

/**
 * Convertit un AudioBuffer en WAV
 */
function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const length = buffer.length
  const sampleRate = buffer.sampleRate
  const numChannels = buffer.numberOfChannels
  const bytesPerSample = 2
  const blockAlign = numChannels * bytesPerSample
  const byteRate = sampleRate * blockAlign
  const dataSize = length * blockAlign
  const bufferSize = 44 + dataSize

  const arrayBuffer = new ArrayBuffer(bufferSize)
  const view = new DataView(arrayBuffer)

  // WAV header
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i))
    }
  }

  writeString(0, 'RIFF')
  view.setUint32(4, bufferSize - 8, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // fmt chunk size
  view.setUint16(20, 1, true) // audio format (PCM)
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, byteRate, true)
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, 16, true) // bits per sample
  writeString(36, 'data')
  view.setUint32(40, dataSize, true)

  // Audio data
  let offset = 44
  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]))
      view.setInt16(offset, sample * 0x7FFF, true)
      offset += 2
    }
  }

  return arrayBuffer
}

