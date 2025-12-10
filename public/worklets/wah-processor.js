/**
 * AudioWorklet Processor pour WAH (Vox, Cry Baby, Slash, KH95, RMC)
 * Filtre bandpass modulé en continu
 */

class WahProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'sweep', defaultValue: 0.5, minValue: 0, maxValue: 1 },
      { name: 'Q', defaultValue: 5, minValue: 0.1, maxValue: 20 },
      { name: 'level', defaultValue: 1.0, minValue: 0, maxValue: 2 }
    ]
  }

  constructor() {
    super()
    this.state = { hp: 0, bp: 0 }
  }

  process(inputs, outputs, params) {
    const input = inputs[0]
    const output = outputs[0]

    if (!input || !input[0] || !output || !output[0]) {
      return true
    }

    const inputChannel = input[0]
    const outputChannel = output[0]
    const sweep = params.sweep[0]
    const Q = params.Q[0]
    const level = params.level[0]

    // Fréquence du filtre : 300Hz → 2kHz selon sweep (0-1)
    const f = 300 + sweep * 1700
    const w = 2 * Math.PI * f / sampleRate

    for (let i = 0; i < inputChannel.length; i++) {
      const x = inputChannel[i]

      // Filtre bandpass modulé
      this.state.bp += w * (x - this.state.bp - this.state.hp * Q)
      this.state.hp = x - this.state.bp - this.state.hp * Q

      outputChannel[i] = this.state.bp * level
    }

    return true
  }
}

registerProcessor('wah-processor', WahProcessor)

