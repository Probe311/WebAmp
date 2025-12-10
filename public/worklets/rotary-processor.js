/**
 * AudioWorklet Processor pour ROTARY / LESLIE
 * Doppler effect + crossfade entre horn (aigu) et drum (grave)
 */

class RotaryProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'speed', defaultValue: 0.5, minValue: 0, maxValue: 1 }, // 0=slow, 1=fast
      { name: 'depth', defaultValue: 0.5, minValue: 0, maxValue: 1 },
      { name: 'mix', defaultValue: 0.5, minValue: 0, maxValue: 1 }
    ]
  }

  constructor() {
    super()
    this.phase = 0
    this.hornDelay = new Float32Array(1024)
    this.drumDelay = new Float32Array(1024)
    this.hornIndex = 0
    this.drumIndex = 0
  }

  process(inputs, outputs, params) {
    const input = inputs[0]
    const output = outputs[0]

    if (!input || !input[0] || !output || !output[0]) {
      return true
    }

    const inputChannel = input[0]
    const outputChannel = output[0]
    const speed = params.speed[0]
    const depth = params.depth[0]
    const mix = params.mix[0]

    // Vitesse LFO selon mode slow/fast
    const lfoSpeed = speed < 0.5 ? 0.5 : 6.0 // Slow: 0.5Hz, Fast: 6Hz
    const phaseIncrement = (lfoSpeed * 2 * Math.PI) / sampleRate

    for (let i = 0; i < inputChannel.length; i++) {
      const x = inputChannel[i]

      // LFO pour doppler effect
      this.phase += phaseIncrement
      if (this.phase > 2 * Math.PI) this.phase -= 2 * Math.PI

      const lfo = Math.sin(this.phase)

      // Doppler : moduler le délai
      const hornDelayTime = 5 + lfo * depth * 3 // 5-8ms
      const drumDelayTime = 10 + lfo * depth * 5 // 10-15ms

      // Écrire dans les buffers de délai
      this.hornDelay[this.hornIndex] = x
      this.drumDelay[this.drumIndex] = x

      // Lire avec délai modulé
      const hornReadIndex = (this.hornIndex - Math.floor(hornDelayTime * sampleRate / 1000) + this.hornDelay.length) % this.hornDelay.length
      const drumReadIndex = (this.drumIndex - Math.floor(drumDelayTime * sampleRate / 1000) + this.drumDelay.length) % this.drumDelay.length

      const horn = this.hornDelay[hornReadIndex]
      const drum = this.drumDelay[drumReadIndex]

      // Crossfade entre horn et drum
      const hornGain = 0.5 + lfo * 0.3
      const drumGain = 0.5 - lfo * 0.3

      const y = horn * hornGain + drum * drumGain

      // Avancer les indices
      this.hornIndex = (this.hornIndex + 1) % this.hornDelay.length
      this.drumIndex = (this.drumIndex + 1) % this.drumDelay.length

      // Mix dry/wet
      outputChannel[i] = x * (1 - mix) + y * mix
    }

    return true
  }
}

registerProcessor('rotary-processor', RotaryProcessor)

