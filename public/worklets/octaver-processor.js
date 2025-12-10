/**
 * AudioWorklet Processor pour OCTAVER POLYPHONIQUE
 * FFT + resynthèse pour octave supérieure/inférieure
 * Version simplifiée avec pitch shifting
 */

class OctaverProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'octave', defaultValue: 0, minValue: -1, maxValue: 1 }, // -1, 0, ou 1
      { name: 'mix', defaultValue: 0.5, minValue: 0, maxValue: 1 },
      { name: 'tracking', defaultValue: 0.5, minValue: 0, maxValue: 1 }
    ]
  }

  constructor() {
    super()
    this.bufferSize = 2048
    this.buffer = new Float32Array(this.bufferSize)
    this.writeIndex = 0
    this.readIndex = 0
  }

  process(inputs, outputs, params) {
    const input = inputs[0]
    const output = outputs[0]

    if (!input || !input[0] || !output || !output[0]) {
      return true
    }

    const inputChannel = input[0]
    const outputChannel = output[0]
    const octave = params.octave[0]
    const mix = params.mix[0]
    const tracking = params.tracking[0]

    // Ratio selon l'octave : -1 = 0.5x, 0 = 1x, +1 = 2x
    const ratio = octave === -1 ? 0.5 : octave === 1 ? 2.0 : 1.0

    for (let i = 0; i < inputChannel.length; i++) {
      const x = inputChannel[i]

      // Écrire dans le buffer
      this.buffer[this.writeIndex] = x
      this.writeIndex = (this.writeIndex + 1) % this.bufferSize

      // Lire avec le ratio d'octave
      const readPos = this.readIndex
      const index1 = Math.floor(readPos) % this.bufferSize
      const index2 = (index1 + 1) % this.bufferSize
      const frac = readPos - Math.floor(readPos)

      // Interpolation linéaire
      const y = this.buffer[index1] * (1 - frac) + this.buffer[index2] * frac

      // Avancer le read index selon le ratio
      this.readIndex = (this.readIndex + ratio) % this.bufferSize

      // Mix dry/wet
      outputChannel[i] = x * (1 - mix) + y * mix * tracking
    }

    return true
  }
}

registerProcessor('octaver-processor', OctaverProcessor)

