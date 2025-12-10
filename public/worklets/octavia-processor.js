/**
 * AudioWorklet Processor pour OCTAVIA (Roger Mayer)
 * Redressement demi-onde + fuzz + LPF
 */

class OctaviaProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'fuzz', defaultValue: 0.5, minValue: 0, maxValue: 1 },
      { name: 'octave', defaultValue: 0.5, minValue: 0, maxValue: 1 },
      { name: 'level', defaultValue: 1.0, minValue: 0, maxValue: 2 }
    ]
  }

  constructor() {
    super()
  }

  process(inputs, outputs, params) {
    const input = inputs[0]
    const output = outputs[0]

    if (!input || !input[0] || !output || !output[0]) {
      return true
    }

    const inputChannel = input[0]
    const outputChannel = output[0]
    const fuzzAmount = params.fuzz[0]
    const octaveAmount = params.octave[0]
    const level = params.level[0]

    for (let i = 0; i < inputChannel.length; i++) {
      const x = inputChannel[i]

      // Redressement demi-onde pour l'octave supérieure
      const halfWave = x > 0 ? x : 0

      // Fuzz avec waveshaping
      const fuzzed = Math.tanh(x * (1 + fuzzAmount * 10))

      // Mix entre signal original et octave
      const mixed = fuzzed * (1 - octaveAmount) + halfWave * octaveAmount

      outputChannel[i] = mixed * level
    }

    return true
  }
}

registerProcessor('octavia-processor', OctaviaProcessor)

