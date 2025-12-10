/**
 * AudioWorklet Processor pour PITCH SHIFTER / WHAMMY (DigiTech)
 * Granular synthesis pour pitch shifting
 */

class PitchShifterProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'interval', defaultValue: 0, minValue: -12, maxValue: 12 }, // demi-tons
      { name: 'mix', defaultValue: 0.5, minValue: 0, maxValue: 1 },
      { name: 'tracking', defaultValue: 0.5, minValue: 0, maxValue: 1 }
    ]
  }

  constructor() {
    super()
    this.bufferSize = 4096
    this.buffer = new Float32Array(this.bufferSize)
    this.writeIndex = 0
    this.readIndex = 0
    this.ratio = 1.0
  }

  process(inputs, outputs, params) {
    const input = inputs[0]
    const output = outputs[0]

    if (!input || !input[0] || !output || !output[0]) {
      return true
    }

    const inputChannel = input[0]
    const outputChannel = output[0]
    const interval = params.interval[0]
    const mix = params.mix[0]
    const tracking = params.tracking[0]

    // Calculer le ratio de pitch (2^(interval/12))
    this.ratio = Math.pow(2, interval / 12)

    for (let i = 0; i < inputChannel.length; i++) {
      const x = inputChannel[i]

      // Écrire dans le buffer circulaire
      this.buffer[this.writeIndex] = x
      this.writeIndex = (this.writeIndex + 1) % this.bufferSize

      // Lire avec le ratio de pitch
      const readPos = this.readIndex
      const index1 = Math.floor(readPos) % this.bufferSize
      const index2 = (index1 + 1) % this.bufferSize
      const frac = readPos - Math.floor(readPos)

      // Interpolation linéaire
      const y = this.buffer[index1] * (1 - frac) + this.buffer[index2] * frac

      // Avancer le read index selon le ratio
      this.readIndex = (this.readIndex + this.ratio) % this.bufferSize

      // Mix dry/wet
      outputChannel[i] = x * (1 - mix) + y * mix * tracking
    }

    return true
  }
}

registerProcessor('pitch-shifter-processor', PitchShifterProcessor)

