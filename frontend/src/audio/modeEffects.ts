/**
 * Effets avec support des modes (switch-selector)
 * 
 * Ces fonctions étendent les effets de base pour supporter
 * les modes des pédales multi-modes (Walrus Audio, etc.)
 */

// AudioContext est global dans le navigateur
import { mapParameterToAudioValue } from './config'
import { EffectNodes } from './effects'

/**
 * Overdrive avec modes (Smooth, Crunch, Bright)
 */
export function makeOverdriveWithMode(
  audioCtx: AudioContext,
  gain: number = 50,
  tone: number = 50,
  volume: number = 50,
  mode: number = 0, // 0: SMOOTH, 1: CRUNCH, 2: BRIGHT
  pedalId?: string // ID de la pédale pour config spécifique
): EffectNodes {
  const ws = audioCtx.createWaveShaper()
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const toneFilter = audioCtx.createBiquadFilter()
  const bassCut = audioCtx.createBiquadFilter()

  // Mapper les paramètres avec config spécifique de la pédale
  const gainValue = mapParameterToAudioValue('overdrive', 'gain', gain, pedalId)
  const toneValue = mapParameterToAudioValue('overdrive', 'tone', tone, pedalId)
  const volumeValue = mapParameterToAudioValue('overdrive', 'volume', volume, pedalId)

  // Courbes selon le mode
  function makeOverdriveCurve(drive: number, mode: number): Float32Array {
    const samples = 44100
    const curve = new Float32Array(samples)

    for (let i = 0; i < samples; ++i) {
      const x = (i * 2 / samples) - 1
      
      switch (mode) {
        case 0: // SMOOTH - doux au silicium
          curve[i] = ((1 + drive * 0.7) * x) / (1 + drive * 0.7 * Math.abs(x))
          break
        case 1: // CRUNCH - clipping silicium plus dur
          curve[i] = ((1 + drive * 1.2) * x) / (1 + drive * 1.2 * Math.abs(x))
          break
        case 2: // BRIGHT - Crunch + coupe-bas
          curve[i] = ((1 + drive * 1.2) * x) / (1 + drive * 1.2 * Math.abs(x))
          break
        default:
          curve[i] = ((1 + drive) * x) / (1 + drive * Math.abs(x))
      }
    }
    return curve
  }

  // @ts-expect-error - Float32Array type compatibility
  ws.curve = makeOverdriveCurve(gainValue, mode)
  ws.oversample = '4x'

  // Filtre tone
  toneFilter.type = 'lowpass'
  toneFilter.frequency.value = toneValue
  toneFilter.Q.value = 0.7

  // Coupe-bas pour mode BRIGHT
  if (mode === 2) {
    bassCut.type = 'highpass'
    bassCut.frequency.value = 200
    bassCut.Q.value = 0.7
  }

  inputGain.gain.value = 1.0
  outputGain.gain.value = volumeValue

  // Routing selon le mode
  inputGain.connect(ws)
  ws.connect(toneFilter)
  if (mode === 2) {
    toneFilter.connect(bassCut)
    bassCut.connect(outputGain)
  } else {
    toneFilter.connect(outputGain)
  }

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * Distortion avec modes (Dark, Si, LED)
 */
export function makeDistortionWithMode(
  audioCtx: AudioContext,
  gain: number = 50,
  tone: number = 50,
  volume: number = 50,
  mode: number = 1, // 0: DARK, 1: SI, 2: LED
  pedalId?: string // ID de la pédale pour config spécifique
): EffectNodes {
  const ws = audioCtx.createWaveShaper()
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const toneFilter = audioCtx.createBiquadFilter()
  const bassCut = audioCtx.createBiquadFilter()

  // Mapper les paramètres avec config spécifique de la pédale
  const gainValue = mapParameterToAudioValue('distortion', 'gain', gain, pedalId)
  const toneValue = mapParameterToAudioValue('distortion', 'tone', tone, pedalId)
  const volumeValue = mapParameterToAudioValue('distortion', 'volume', volume, pedalId)

  // Courbes selon le mode
  function makeDistortionCurve(amount: number, mode: number): Float32Array {
    const samples = 44100
    const curve = new Float32Array(samples)
    const k = amount

    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * 2 - 1
      
      switch (mode) {
        case 0: // DARK - clipping silicium asymétrique + coupe-bas
          curve[i] = (1 + k * 0.8) * x / (1 + k * 0.8 * Math.abs(x))
          break
        case 1: // SI - clipping silicium classique
          curve[i] = (1 + k) * x / (1 + k * Math.abs(x))
          break
        case 2: // LED - clipping via diodes LED, son plus dynamique
          curve[i] = Math.tanh(x * k * 1.5)
          break
        default:
          curve[i] = (1 + k) * x / (1 + k * Math.abs(x))
      }
    }
    return curve
  }

  // @ts-expect-error - Float32Array type compatibility
  ws.curve = makeDistortionCurve(gainValue, mode)
  ws.oversample = '4x'

  toneFilter.type = 'lowpass'
  toneFilter.frequency.value = toneValue
  toneFilter.Q.value = 0.7

  // Coupe-bas pour mode DARK
  if (mode === 0) {
    bassCut.type = 'highpass'
    bassCut.frequency.value = 150
    bassCut.Q.value = 0.7
  }

  inputGain.gain.value = 1.0
  outputGain.gain.value = volumeValue

  inputGain.connect(ws)
  ws.connect(toneFilter)
  if (mode === 0) {
    toneFilter.connect(bassCut)
    bassCut.connect(outputGain)
  } else {
    toneFilter.connect(outputGain)
  }

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * Fuzz avec modes (Gate, Classic, Mid+)
 */
export function makeFuzzWithMode(
  audioCtx: AudioContext,
  gain: number = 50,
  tone: number = 50,
  volume: number = 50,
  mode: number = 1, // 0: GATE, 1: CLASSIC, 2: MID+
  pedalId?: string // ID de la pédale pour config spécifique
): EffectNodes {
  const ws = audioCtx.createWaveShaper()
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const toneFilter = audioCtx.createBiquadFilter()
  const midBoost = audioCtx.createBiquadFilter()
  const gateGain = audioCtx.createGain()

  // Mapper les paramètres avec config spécifique de la pédale
  const gainValue = mapParameterToAudioValue('fuzz', 'gain', gain, pedalId)
  const toneValue = mapParameterToAudioValue('fuzz', 'tone', tone, pedalId)
  const volumeValue = mapParameterToAudioValue('fuzz', 'volume', volume, pedalId)

  // Courbes selon le mode
  function makeFuzzCurve(gain: number, mode: number): Float32Array {
    const samples = 44100
    const curve = new Float32Array(samples)

    for (let i = 0; i < samples; i++) {
      const x = (i * 2 / samples) - 1
      
      switch (mode) {
        case 0: // GATE - polarisation basse, son "haché/gate"
          // Hard clip avec gate
          curve[i] = Math.abs(x) > 0.1 ? Math.sign(x) * 0.1 : x * gain
          break
        case 1: // CLASSIC - fuzz classique avec scoop médiums
          curve[i] = Math.tanh(x * gain)
          break
        case 2: // MID+ - boost médiums
          curve[i] = Math.tanh(x * gain * 1.2)
          break
        default:
          curve[i] = Math.tanh(x * gain)
      }
    }
    return curve
  }

  // @ts-expect-error - Float32Array type compatibility
  ws.curve = makeFuzzCurve(gainValue, mode)
  ws.oversample = '4x'

  toneFilter.type = 'lowpass'
  toneFilter.frequency.value = toneValue
  toneFilter.Q.value = 0.7

  // Scoop médiums pour CLASSIC, boost pour MID+
  if (mode === 1) {
    midBoost.type = 'peaking'
    midBoost.frequency.value = 1000
    midBoost.Q.value = 1.0
    midBoost.gain.value = -6 // Scoop
  } else if (mode === 2) {
    midBoost.type = 'peaking'
    midBoost.frequency.value = 1000
    midBoost.Q.value = 1.0
    midBoost.gain.value = 6 // Boost
  }

  inputGain.gain.value = gainValue
  outputGain.gain.value = volumeValue

  // Gate pour mode GATE
  if (mode === 0) {
    gateGain.gain.value = 0.5 // Réduire le gain pour effet gate
  } else {
    gateGain.gain.value = 1.0
  }

  inputGain.connect(ws)
  ws.connect(toneFilter)
  
  if (mode === 1 || mode === 2) {
    toneFilter.connect(midBoost)
    midBoost.connect(gateGain)
  } else {
    toneFilter.connect(gateGain)
  }
  
  gateGain.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * Chorus avec modes (Light, Medium, Heavy)
 */
export function makeChorusWithMode(
  audioCtx: AudioContext,
  rate: number = 50,
  depth: number = 50,
  mix: number = 50,
  mode: number = 1 // 0: LIGHT, 1: MEDIUM, 2: HEAVY
): EffectNodes {
  const delay = audioCtx.createDelay(1.0)
  const lfo = audioCtx.createOscillator()
  const lfoGain = audioCtx.createGain()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)

  const rateValue = mapParameterToAudioValue('chorus', 'rate', rate)
  const depthValue = mapParameterToAudioValue('chorus', 'depth', depth)
  const mixValue = mapParameterToAudioValue('chorus', 'mix', mix)

  // Paramètres selon le mode
  let delayTime = 0.02
  let depthMultiplier = 1.0

  switch (mode) {
    case 0: // LIGHT - chorus doux, analog style
      delayTime = 0.015
      depthMultiplier = 0.7
      break
    case 1: // MEDIUM - multi-tap modéré
      delayTime = 0.02
      depthMultiplier = 1.0
      break
    case 2: // HEAVY - chorus trilinéaire prononcé
      delayTime = 0.03
      depthMultiplier = 1.5
      break
  }

  delay.delayTime.value = delayTime

  lfo.frequency.value = rateValue
  lfo.type = 'sine'
  lfoGain.gain.value = depthValue * depthMultiplier

  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue
  outputGain.gain.value = 1.0

  lfo.connect(lfoGain)
  lfoGain.connect(delay.delayTime)
  lfo.start()

  delay.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)

  return {
    input: dryGain,
    output: outputGain,
    cleanup: () => {
      lfo.stop()
    }
  }
}

/**
 * Delay avec modes (Digital, Analog, Reverse)
 */
export function makeDelayWithMode(
  audioCtx: AudioContext,
  time: number = 50,
  feedback: number = 50,
  mix: number = 50,
  mode: number = 0 // 0: DIGITAL, 1: ANALOG, 2: REVERSE
): EffectNodes {
  const delay = audioCtx.createDelay(2.0)
  const feedbackGain = audioCtx.createGain()
  const toneFilter = audioCtx.createBiquadFilter()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)

  const timeValue = mapParameterToAudioValue('delay', 'time', time)
  const feedbackValue = mapParameterToAudioValue('delay', 'feedback', feedback)
  const mixValue = mapParameterToAudioValue('delay', 'mix', mix)

  delay.delayTime.value = timeValue
  feedbackGain.gain.value = feedbackValue

  // Filtre tone pour mode ANALOG
  if (mode === 1) {
    toneFilter.type = 'lowpass'
    toneFilter.frequency.value = 4000
    toneFilter.Q.value = 0.7
  }

  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue
  outputGain.gain.value = 1.0

  // Feedback loop
  delay.connect(feedbackGain)
  feedbackGain.connect(delay)

  // Routing selon le mode
  if (mode === 2) {
    // REVERSE - inverser le signal (nécessite un buffer)
    // Pour l'instant, on simule avec un délai plus long
    delay.delayTime.value = timeValue * 1.5
  }

  delay.connect(mode === 1 ? toneFilter : wetGain)
  if (mode === 1) {
    toneFilter.connect(wetGain)
  }
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)

  return {
    input: dryGain,
    output: outputGain
  }
}

/**
 * Reverb avec modes (Hall, Spring, Plate)
 */
export async function makeReverbWithMode(
  audioCtx: AudioContext,
  decay: number = 50,
  tone: number = 50,
  mix: number = 50,
  mode: number = 0, // 0: HALL, 1: SPRING, 2: PLATE
  impulseUrl?: string
): Promise<EffectNodes> {
  const convolver = audioCtx.createConvolver()
  const toneFilter = audioCtx.createBiquadFilter()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)

  const decayValue = mapParameterToAudioValue('reverb', 'decay', decay)
  const toneValue = mapParameterToAudioValue('reverb', 'tone', tone)
  const mixValue = mapParameterToAudioValue('reverb', 'mix', mix)

  // Créer IR selon le mode
  function createModeIR(audioCtx: AudioContext, decay: number, mode: number): AudioBuffer {
    const sampleRate = audioCtx.sampleRate
    const length = sampleRate * decay
    const buffer = audioCtx.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel)
      
      switch (mode) {
        case 0: // HALL - grande salle
          for (let i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.5)
          }
          break
        case 1: // SPRING - ressorts
          for (let i = 0; i < length; i++) {
            const t = i / sampleRate
            channelData[i] = Math.sin(t * 1000) * Math.exp(-t * 2) * Math.pow(1 - i / length, 2)
          }
          break
        case 2: // PLATE - dense
          for (let i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3)
          }
          break
        default:
          for (let i = 0; i < length; i++) {
            channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
          }
      }
    }

    return buffer
  }

  // Charger IR ou créer selon le mode
  if (impulseUrl) {
    try {
      const response = await fetch(impulseUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
      convolver.buffer = audioBuffer
    } catch (error) {
      console.warn('Erreur chargement IR, utilisation IR synthétique', error)
      convolver.buffer = createModeIR(audioCtx, decayValue, mode)
    }
  } else {
    convolver.buffer = createModeIR(audioCtx, decayValue, mode)
  }

  toneFilter.type = 'lowpass'
  toneFilter.frequency.value = toneValue
  toneFilter.Q.value = 0.7

  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue
  outputGain.gain.value = 1.0

  convolver.connect(toneFilter)
  toneFilter.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)

  return {
    input: dryGain,
    output: outputGain
  }
}

/**
 * Tremolo avec modes (Sine, Square, Random)
 */
export function makeTremoloWithMode(
  audioCtx: AudioContext,
  rate: number = 50,
  depth: number = 50,
  volume: number = 50,
  wave: number = 0 // 0: SINE, 1: SQUARE, 2: RANDOM
): EffectNodes {
  const gain = audioCtx.createGain()
  const lfo = audioCtx.createOscillator()
  const lfoGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const offset = audioCtx.createConstantSource()

  const rateValue = mapParameterToAudioValue('tremolo', 'rate', rate)
  const depthValue = mapParameterToAudioValue('tremolo', 'depth', depth)
  const volumeValue = mapParameterToAudioValue('tremolo', 'volume', volume)

  // Type d'onde selon le mode
  const waveType = wave === 0 ? 'sine' : wave === 1 ? 'square' : 'sawtooth'

  lfo.frequency.value = rateValue
  lfo.type = waveType as OscillatorType
  lfoGain.gain.value = depthValue

  offset.offset.value = 1.0 - depthValue / 2
  outputGain.gain.value = volumeValue

  lfo.connect(lfoGain)
  lfoGain.connect(offset.offset)
  offset.connect(gain.gain)
  lfo.start()
  offset.start()

  gain.connect(outputGain)

  return {
    input: gain,
    output: outputGain,
    cleanup: () => {
      lfo.stop()
      offset.stop()
    }
  }
}

