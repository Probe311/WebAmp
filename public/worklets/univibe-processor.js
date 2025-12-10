/**
 * AudioWorklet Processor pour UNI-VIBE (Shin-Ei)
 * 4 filtres all-pass modulés par LFO sinusoïdal
 */

class UniVibeProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'speed', defaultValue: 0.5, minValue: 0.1, maxValue: 10 },
      { name: 'intensity', defaultValue: 0.5, minValue: 0, maxValue: 1 },
      { name: 'mix', defaultValue: 0.5, minValue: 0, maxValue: 1 }
    ]
  }

  constructor() {
    super()
    this.phase = 0
    // 4 étages all-pass
    this.stages = [
      { x1: 0, y1: 0 },
      { x1: 0, y1: 0 },
      { x1: 0, y1: 0 },
      { x1: 0, y1: 0 }
    ]
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
    const intensity = params.intensity[0]
    const mix = params.mix[0]

    const phaseIncrement = (speed * 2 * Math.PI) / sampleRate

    for (let i = 0; i < inputChannel.length; i++) {
      const x = inputChannel[i]

      // LFO sinusoïdal
      this.phase += phaseIncrement
      if (this.phase > 2 * Math.PI) this.phase -= 2 * Math.PI

      const lfo = Math.sin(this.phase)
      const a = 0.5 + lfo * intensity * 0.3 // Coefficient all-pass modulé

      // 4 étages all-pass en série
      let y = x
      for (let stage = 0; stage < 4; stage++) {
        const state = this.stages[stage]
        y = -a * y + state.x1 + a * state.y1
        state.x1 = y
        state.y1 = y
      }

      // Mix dry/wet
      outputChannel[i] = x * (1 - mix) + y * mix
    }

    return true
  }
}

registerProcessor('univibe-processor', UniVibeProcessor)

