/**
 * Implémentations Web Audio API pour tous les effets de pédales
 * 
 * Chaque fonction retourne un objet avec input et output AudioNode
 * pour permettre un routing modulaire.
 */

import { mapParameterToAudioValue } from './config'

export interface EffectNodes {
  input: AudioNode
  output: AudioNode
  cleanup?: () => void
}

// Cache pour les courbes WaveShaper (optimisation)
const curveCache = new Map<string, Float32Array>()

/**
 * Génère ou récupère une courbe de distorsion depuis le cache
 */
function getOrCreateCurve(key: string, generator: () => Float32Array): Float32Array {
  if (curveCache.has(key)) {
    return curveCache.get(key)!
  }
  const curve = generator()
  curveCache.set(key, curve)
  return curve
}

/**
 * OVERDRIVE - WaveShaper avec courbe douce
 * Optimisé avec cache de courbes
 */
export function makeOverdrive(
  audioCtx: AudioContext,
  drive: number = 50, // 0-100
  tone: number = 50,
  level: number = 50,
  pedalId?: string // ID de la pédale pour config spécifique
): EffectNodes {
  const ws = audioCtx.createWaveShaper()
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const toneFilter = audioCtx.createBiquadFilter()

  // Mapper les paramètres avec config spécifique de la pédale
  const driveValue = mapParameterToAudioValue('overdrive', 'drive', drive, pedalId)
  const toneValue = mapParameterToAudioValue('overdrive', 'tone', tone, pedalId)
  const levelValue = mapParameterToAudioValue('overdrive', 'level', level, pedalId)

  // Courbe de distorsion douce (tube-like) avec cache
  const curveKey = `overdrive-${Math.round(driveValue * 100)}`
  const curve = getOrCreateCurve(curveKey, () => {
    const samples = 44100
    const curve = new Float32Array(samples)

    for (let i = 0; i < samples; ++i) {
      const x = (i * 2 / samples) - 1
      // Courbe asymétrique pour son tube
      curve[i] = ((1 + driveValue) * x) / (1 + driveValue * Math.abs(x))
    }
    return curve
  })

  // @ts-expect-error - Float32Array type compatibility
  ws.curve = curve
  ws.oversample = '4x'

  // Filtre tone (passe-bas après distorsion)
  toneFilter.type = 'lowpass'
  toneFilter.frequency.value = toneValue
  toneFilter.Q.value = 0.7

  // Gains
  inputGain.gain.value = 1.0
  outputGain.gain.value = levelValue

  // Routing
  inputGain.connect(ws)
  ws.connect(toneFilter)
  toneFilter.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * DISTORTION - WaveShaper agressif
 * Optimisé avec cache de courbes
 */
export function makeDistortion(
  audioCtx: AudioContext,
  distortion: number = 50,
  tone: number = 50,
  level: number = 50,
  pedalId?: string // ID de la pédale pour config spécifique
): EffectNodes {
  const ws = audioCtx.createWaveShaper()
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const toneFilter = audioCtx.createBiquadFilter()

  // Mapper les paramètres avec config spécifique de la pédale
  const distValue = mapParameterToAudioValue('distortion', 'distortion', distortion, pedalId)
  const toneValue = mapParameterToAudioValue('distortion', 'tone', tone, pedalId)
  const levelValue = mapParameterToAudioValue('distortion', 'level', level, pedalId)

  // Courbe de distorsion agressive avec cache
  const curveKey = `distortion-${Math.round(distValue * 100)}`
  const curve = getOrCreateCurve(curveKey, () => {
    const samples = 44100
    const curve = new Float32Array(samples)
    const k = distValue

    for (let i = 0; i < samples; i++) {
      const x = (i / samples) * 2 - 1
      curve[i] = (1 + k) * x / (1 + k * Math.abs(x))
    }
    return curve
  })

  // @ts-expect-error - Float32Array type compatibility
  ws.curve = curve
  ws.oversample = '4x'

  toneFilter.type = 'lowpass'
  toneFilter.frequency.value = toneValue
  toneFilter.Q.value = 0.7

  inputGain.gain.value = 1.0
  outputGain.gain.value = levelValue

  inputGain.connect(ws)
  ws.connect(toneFilter)
  toneFilter.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * FUZZ - Clipping brutal avec gate optionnel
 * Optimisé avec cache de courbes et gate dynamique
 */
export function makeFuzz(
  audioCtx: AudioContext,
  fuzz: number = 50,
  tone: number = 50,
  volume: number = 50,
  gate?: number,
  pedalId?: string // ID de la pédale pour config spécifique
): EffectNodes {
  const ws = audioCtx.createWaveShaper()
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const toneFilter = audioCtx.createBiquadFilter()
  const gateGain = audioCtx.createGain()

  // Mapper les paramètres avec config spécifique de la pédale
  const fuzzValue = mapParameterToAudioValue('fuzz', 'fuzz', fuzz, pedalId)
  const toneValue = mapParameterToAudioValue('fuzz', 'tone', tone, pedalId)
  const volumeValue = mapParameterToAudioValue('fuzz', 'volume', volume, pedalId)

  // Hard clipping avec cache
  const curveKey = `fuzz-${Math.round(fuzzValue * 100)}`
  const curve = getOrCreateCurve(curveKey, () => {
    const samples = 44100
    const curve = new Float32Array(samples)

    for (let i = 0; i < samples; i++) {
      const x = (i * 2 / samples) - 1
      // Hard clip avec légère saturation avant
      curve[i] = Math.tanh(x * fuzzValue)
    }
    return curve
  })

  // @ts-expect-error - Float32Array type compatibility
  ws.curve = curve
  ws.oversample = '4x'

  toneFilter.type = 'lowpass'
  toneFilter.frequency.value = toneValue
  toneFilter.Q.value = 0.7

  inputGain.gain.value = fuzzValue
  outputGain.gain.value = volumeValue

  if (gate !== undefined) {
    // Gate dynamique avec analyser
    const analyser = audioCtx.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.8
    
    const gateThreshold = mapParameterToAudioValue('fuzz', 'gate', gate)
    let gateState = false
    let cleanupCalled = false
    
    function updateGate() {
      if (cleanupCalled) return
      
      const data = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(data)
      
      const volume = data.reduce((a, b) => a + b, 0) / data.length
      const db = volume > 0 ? 20 * Math.log10(volume / 255) : -Infinity
      
      if (db > gateThreshold) {
        gateState = true
        gateGain.gain.value = 1.0
      } else if (gateState && db < gateThreshold - 5) {
        gateState = false
        gateGain.gain.value = 0.0
      }
      
      if (!cleanupCalled) {
        requestAnimationFrame(updateGate)
      }
    }
    
    // Connecter l'analyser après le tone filter pour analyser le signal traité
    toneFilter.connect(analyser)
    gateGain.gain.value = 1.0
    updateGate()
    
    // Routing avec gate
    inputGain.connect(ws)
    ws.connect(toneFilter)
    toneFilter.connect(gateGain)
    gateGain.connect(outputGain)
    
    return {
      input: inputGain,
      output: outputGain,
      cleanup: () => {
        cleanupCalled = true
      }
    }
  }
  
  // Routing sans gate
  gateGain.gain.value = 1.0
  inputGain.connect(ws)
  ws.connect(toneFilter)
  toneFilter.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * EQ 3 bandes (Bass, Middle, Treble)
 */
export function makeEQ(
  audioCtx: AudioContext,
  bass: number = 50,
  middle: number = 50,
  treble: number = 50,
  level: number = 50
): EffectNodes {
  const lows = audioCtx.createBiquadFilter()
  const mids = audioCtx.createBiquadFilter()
  const highs = audioCtx.createBiquadFilter()
  const outputGain = audioCtx.createGain()

  const bassValue = mapParameterToAudioValue('eq', 'bass', bass)
  const midValue = mapParameterToAudioValue('eq', 'middle', middle)
  const trebleValue = mapParameterToAudioValue('eq', 'treble', treble)
  const levelValue = mapParameterToAudioValue('eq', 'level', level)

  lows.type = 'lowshelf'
  lows.frequency.value = 200
  lows.gain.value = bassValue

  mids.type = 'peaking'
  mids.frequency.value = 1000
  mids.Q.value = 1.0
  mids.gain.value = midValue

  highs.type = 'highshelf'
  highs.frequency.value = 3000
  highs.gain.value = trebleValue

  outputGain.gain.value = levelValue

  lows.connect(mids)
  mids.connect(highs)
  highs.connect(outputGain)

  return {
    input: lows,
    output: outputGain
  }
}

/**
 * COMPRESSOR
 */
export function makeCompressor(
  audioCtx: AudioContext,
  output: number = 50,
  sensitivity: number = 50
): EffectNodes {
  const comp = audioCtx.createDynamicsCompressor()
  const outputGain = audioCtx.createGain()

  const sensitivityValue = mapParameterToAudioValue('compressor', 'sensitivity', sensitivity)
  const outputValue = mapParameterToAudioValue('compressor', 'output', output)

  comp.threshold.value = sensitivityValue
  comp.knee.value = 40
  comp.ratio.value = 12
  comp.attack.value = 0.003
  comp.release.value = 0.25

  outputGain.gain.value = outputValue

  comp.connect(outputGain)

  return {
    input: comp,
    output: outputGain
  }
}

/**
 * CHORUS - Delay + LFO
 */
export function makeChorus(
  audioCtx: AudioContext,
  rate: number = 50,
  depth: number = 50,
  level: number = 50,
  mix: number = 50
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
  const levelValue = mapParameterToAudioValue('chorus', 'level', level)

  delay.delayTime.value = 0.02

  lfo.frequency.value = rateValue
  lfo.type = 'sine'
  lfoGain.gain.value = depthValue

  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue
  outputGain.gain.value = levelValue

  lfo.connect(lfoGain)
  lfoGain.connect(delay.delayTime)
  lfo.start()

  // Routing: dry + wet
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
 * FLANGER - Delay + feedback + LFO
 */
export function makeFlanger(
  audioCtx: AudioContext,
  rate: number = 50,
  depth: number = 50,
  feedback: number = 50
): EffectNodes {
  const delay = audioCtx.createDelay(0.02)
  const feedbackGain = audioCtx.createGain()
  const lfo = audioCtx.createOscillator()
  const lfoGain = audioCtx.createGain()
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()

  const rateValue = mapParameterToAudioValue('flanger', 'rate', rate)
  const depthValue = mapParameterToAudioValue('flanger', 'depth', depth)
  const feedbackValue = mapParameterToAudioValue('flanger', 'feedback', feedback)

  delay.delayTime.value = 0.005
  feedbackGain.gain.value = feedbackValue

  lfo.frequency.value = rateValue
  lfo.type = 'sine'
  lfoGain.gain.value = depthValue

  inputGain.gain.value = 1.0
  outputGain.gain.value = 1.0

  lfo.connect(lfoGain)
  lfoGain.connect(delay.delayTime)
  lfo.start()

  // Feedback loop
  delay.connect(feedbackGain)
  feedbackGain.connect(delay)

  inputGain.connect(delay)
  delay.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain,
    cleanup: () => {
      lfo.stop()
    }
  }
}

/**
 * PHASER - BiquadFilters + LFO
 */
export function makePhaser(
  audioCtx: AudioContext,
  rate: number = 50,
  depth: number = 50,
  feedback: number = 50,
  resonance?: number
): EffectNodes {
  // Créer plusieurs allpass filters en série pour effet phaser
  const filters: BiquadFilterNode[] = []
  const lfo = audioCtx.createOscillator()
  const lfoGain = audioCtx.createGain()
  const feedbackGain = audioCtx.createGain()
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()

  const rateValue = mapParameterToAudioValue('phaser', 'rate', rate)
  const depthValue = mapParameterToAudioValue('phaser', 'depth', depth)
  const feedbackValue = mapParameterToAudioValue('phaser', 'feedback', feedback)

  // 4 étages allpass (comme Phase 90)
  for (let i = 0; i < 4; i++) {
    const filter = audioCtx.createBiquadFilter()
    filter.type = 'allpass'
    filter.frequency.value = 800 + i * 200
    filter.Q.value = resonance !== undefined 
      ? mapParameterToAudioValue('phaser', 'resonance', resonance) / 4
      : 1.0
    filters.push(filter)
  }

  lfo.frequency.value = rateValue
  lfo.type = 'sine'
  lfoGain.gain.value = depthValue * 500

  feedbackGain.gain.value = feedbackValue

  // Connecter les filters en série
  let current: AudioNode = inputGain
  filters.forEach((filter) => {
    current.connect(filter)
    // Moduler la fréquence avec LFO (décalage par étage)
    lfoGain.connect(filter.frequency)
    current = filter
  })

  // Feedback
  current.connect(feedbackGain)
  feedbackGain.connect(inputGain)

  current.connect(outputGain)

  lfo.start()

  return {
    input: inputGain,
    output: outputGain,
    cleanup: () => {
      lfo.stop()
    }
  }
}

/**
 * TREMOLO - Gain + LFO
 */
export function makeTremolo(
  audioCtx: AudioContext,
  rate: number = 50,
  depth: number = 50,
  volume: number = 50,
  wave?: number
): EffectNodes {
  const gain = audioCtx.createGain()
  const lfo = audioCtx.createOscillator()
  const lfoGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const offset = audioCtx.createConstantSource()

  const rateValue = mapParameterToAudioValue('tremolo', 'rate', rate)
  const depthValue = mapParameterToAudioValue('tremolo', 'depth', depth)
  const volumeValue = mapParameterToAudioValue('tremolo', 'volume', volume)

  // Type d'onde selon paramètre
  const waveType = wave !== undefined 
    ? (wave < 33 ? 'sine' : wave < 66 ? 'square' : 'sawtooth')
    : 'sine'

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

/**
 * DELAY - Feedback delay
 */
export function makeDelay(
  audioCtx: AudioContext,
  time: number = 50,
  feedback: number = 50,
  mix: number = 50
): EffectNodes {
  const delay = audioCtx.createDelay(2.0)
  const feedbackGain = audioCtx.createGain()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)

  const timeValue = mapParameterToAudioValue('delay', 'time', time)
  const feedbackValue = mapParameterToAudioValue('delay', 'feedback', feedback)
  const mixValue = mapParameterToAudioValue('delay', 'mix', mix)

  delay.delayTime.value = timeValue
  feedbackGain.gain.value = feedbackValue

  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue
  outputGain.gain.value = 1.0

  // Feedback loop
  delay.connect(feedbackGain)
  feedbackGain.connect(delay)

  // Routing: dry + wet
  delay.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)

  return {
    input: dryGain,
    output: outputGain
  }
}

/**
 * REVERB - Convolver avec IR
 */
export async function makeReverb(
  audioCtx: AudioContext,
  decay: number = 50,
  tone: number = 50,
  mix: number = 50,
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

  // Charger IR ou créer une IR simple
  if (impulseUrl) {
    try {
      const response = await fetch(impulseUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
      convolver.buffer = audioBuffer
    } catch (error) {
      convolver.buffer = createSimpleIR(audioCtx, decayValue)
    }
  } else {
    convolver.buffer = createSimpleIR(audioCtx, decayValue)
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
 * Crée une IR simple pour reverb
 */
function createSimpleIR(audioCtx: AudioContext, decay: number): AudioBuffer {
  const sampleRate = audioCtx.sampleRate
  const length = sampleRate * decay
  const buffer = audioCtx.createBuffer(2, length, sampleRate)

  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel)
    for (let i = 0; i < length; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
    }
  }

  return buffer
}

/**
 * NOISE GATE
 */
export function makeNoiseGate(
  audioCtx: AudioContext,
  threshold: number = 50,
  release: number = 50
): EffectNodes {
  const analyser = audioCtx.createAnalyser()
  const gain = audioCtx.createGain()
  const inputGain = audioCtx.createGain()

  analyser.fftSize = 256
  analyser.smoothingTimeConstant = 0.8

  const thresholdValue = mapParameterToAudioValue('noisegate', 'threshold', threshold)
  const releaseValue = mapParameterToAudioValue('noisegate', 'release', release)

  let releaseTimer = 0

  function update() {
    const data = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(data)

    const volume = data.reduce((a, b) => a + b, 0) / data.length
    const db = 20 * Math.log10(volume / 255)

    if (db > thresholdValue) {
      releaseTimer = 0
      gain.gain.value = 1.0
    } else {
      releaseTimer += 1 / audioCtx.sampleRate
      if (releaseTimer > releaseValue) {
        gain.gain.value = 0.0
      }
    }

    requestAnimationFrame(update)
  }

  inputGain.gain.value = 1.0
  gain.gain.value = 0.0

  inputGain.connect(analyser)
  analyser.connect(gain)

  update()

  return {
    input: inputGain,
    output: gain
  }
}

/**
 * CABINET SIMULATOR - Convolver avec IR de baffle
 */
export async function makeCabinetSimulator(
  audioCtx: AudioContext,
  impulseUrl: string
): Promise<EffectNodes> {
  const convolver = audioCtx.createConvolver()
  const outputGain = audioCtx.createGain()

  try {
    const response = await fetch(impulseUrl)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
    convolver.buffer = audioBuffer
  } catch (error) {
    throw error
  }

  outputGain.gain.value = 1.0

  convolver.connect(outputGain)

  return {
    input: convolver,
    output: outputGain
  }
}

/**
 * RING MODULATOR - Modulation en anneau
 * Note: Utilise ScriptProcessorNode pour la vraie multiplication (ring modulation)
 */
export function makeRingModulator(
  audioCtx: AudioContext,
  frequency: number = 50,
  mix: number = 50,
  level: number = 50
): EffectNodes {
  const oscillator = audioCtx.createOscillator()
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1)

  const freqValue = mapParameterToAudioValue('ringmod', 'frequency', frequency)
  const mixValue = mapParameterToAudioValue('ringmod', 'mix', mix)
  const levelValue = mapParameterToAudioValue('ringmod', 'level', level)

  oscillator.type = 'sine'
  oscillator.frequency.value = freqValue
  oscillator.start()

  // Ring modulation: multiplier le signal d'entrée par l'oscillateur
  let oscPhase = 0
  const oscIncrement = (2 * Math.PI * freqValue) / audioCtx.sampleRate

  scriptProcessor.onaudioprocess = (e) => {
    const input = e.inputBuffer.getChannelData(0)
    const output = e.outputBuffer.getChannelData(0)

    for (let i = 0; i < input.length; i++) {
      const oscValue = Math.sin(oscPhase)
      output[i] = input[i] * oscValue
      oscPhase += oscIncrement
      if (oscPhase > 2 * Math.PI) oscPhase -= 2 * Math.PI
    }
  }

  inputGain.gain.value = 1.0
  outputGain.gain.value = levelValue
  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue

  inputGain.connect(scriptProcessor)
  scriptProcessor.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * BIT CRUSHER - Réduction de résolution
 */
export function makeBitCrusher(
  audioCtx: AudioContext,
  bits: number = 50,
  sampleRate: number = 50,
  mix: number = 50
): EffectNodes {
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1)

  const bitsValue = mapParameterToAudioValue('bitcrusher', 'bits', bits)
  const sampleRateValue = mapParameterToAudioValue('bitcrusher', 'sampleRate', sampleRate)
  const mixValue = mapParameterToAudioValue('bitcrusher', 'mix', mix)

  let lastSample = 0
  let sampleCounter = 0
  const sampleRateDivisor = Math.max(1, Math.floor(audioCtx.sampleRate / sampleRateValue))

  scriptProcessor.onaudioprocess = (e) => {
    const input = e.inputBuffer.getChannelData(0)
    const output = e.outputBuffer.getChannelData(0)
    const bitDepth = Math.max(1, Math.min(16, Math.floor(bitsValue)))
    const quantizationLevels = Math.pow(2, bitDepth)
    const step = 2 / quantizationLevels

    for (let i = 0; i < input.length; i++) {
      sampleCounter++
      if (sampleCounter >= sampleRateDivisor) {
        sampleCounter = 0
        const quantized = Math.floor(input[i] / step) * step
        lastSample = quantized
      }
      output[i] = lastSample
    }
  }

  inputGain.gain.value = 1.0
  outputGain.gain.value = 1.0
  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue

  inputGain.connect(scriptProcessor)
  scriptProcessor.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * LO-FI - Effet lo-fi avec saturation et filtres
 */
export function makeLoFi(
  audioCtx: AudioContext,
  saturation: number = 50,
  wow: number = 50,
  flutter: number = 50,
  tone: number = 50
): EffectNodes {
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const saturator = audioCtx.createWaveShaper()
  const toneFilter = audioCtx.createBiquadFilter()
  const wowOsc = audioCtx.createOscillator()
  const flutterOsc = audioCtx.createOscillator()
  const wowGain = audioCtx.createGain()
  const flutterGain = audioCtx.createGain()

  const satValue = mapParameterToAudioValue('lofi', 'saturation', saturation)
  const wowValue = mapParameterToAudioValue('lofi', 'wow', wow)
  const flutterValue = mapParameterToAudioValue('lofi', 'flutter', flutter)
  const toneValue = mapParameterToAudioValue('lofi', 'tone', tone)

  // Courbe de saturation douce
  const samples = 44100
  const curve = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    const x = (i * 2 / samples) - 1
    curve[i] = Math.tanh(x * (1 + satValue * 2))
  }
  saturator.curve = curve
  saturator.oversample = '4x'

  // Filtre tone (passe-bas pour son vintage)
  toneFilter.type = 'lowpass'
  toneFilter.frequency.value = toneValue
  toneFilter.Q.value = 0.7

  // Wow (modulation lente de la fréquence)
  wowOsc.type = 'sine'
  wowOsc.frequency.value = 0.1 + wowValue * 0.4 // 0.1-0.5 Hz
  wowGain.gain.value = wowValue * 0.02 // Modulation légère
  wowOsc.start()

  // Flutter (modulation rapide)
  flutterOsc.type = 'sine'
  flutterOsc.frequency.value = 1 + flutterValue * 9 // 1-10 Hz
  flutterGain.gain.value = flutterValue * 0.01
  flutterOsc.start()

  inputGain.gain.value = 1.0
  outputGain.gain.value = 1.0

  inputGain.connect(saturator)
  saturator.connect(toneFilter)
  toneFilter.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * TAPE DELAY - Simulation de delay à bande magnétique
 */
export function makeTapeDelay(
  audioCtx: AudioContext,
  time: number = 50,
  feedback: number = 50,
  saturation: number = 50,
  wow: number = 30,
  mix: number = 50
): EffectNodes {
  const delay = audioCtx.createDelay(2.0)
  const feedbackGain = audioCtx.createGain()
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  const saturator = audioCtx.createWaveShaper()
  const toneFilter = audioCtx.createBiquadFilter()
  const wowOsc = audioCtx.createOscillator()
  const wowGain = audioCtx.createGain()

  const timeValue = mapParameterToAudioValue('tapedelay', 'time', time)
  const feedbackValue = mapParameterToAudioValue('tapedelay', 'feedback', feedback)
  const satValue = mapParameterToAudioValue('tapedelay', 'saturation', saturation)
  const wowValue = mapParameterToAudioValue('tapedelay', 'wow', wow)
  const mixValue = mapParameterToAudioValue('tapedelay', 'mix', mix)

  delay.delayTime.value = timeValue
  feedbackGain.gain.value = feedbackValue

  // Saturation tape-like
  const samples = 44100
  const curve = new Float32Array(samples)
  for (let i = 0; i < samples; i++) {
    const x = (i * 2 / samples) - 1
    curve[i] = Math.tanh(x * (1 + satValue))
  }
  saturator.curve = curve
  saturator.oversample = '4x'

  // Filtre passe-bas pour simuler la bande magnétique
  toneFilter.type = 'lowpass'
  toneFilter.frequency.value = 3000 + satValue * 2000 // 3-5 kHz
  toneFilter.Q.value = 0.5

  // Wow (modulation lente)
  wowOsc.type = 'sine'
  wowOsc.frequency.value = 0.1 + wowValue * 0.3
  wowGain.gain.value = wowValue * 0.01
  wowOsc.start()

  inputGain.gain.value = 1.0
  outputGain.gain.value = 1.0
  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue

  // Routing avec feedback
  inputGain.connect(delay)
  delay.connect(saturator)
  saturator.connect(toneFilter)
  toneFilter.connect(feedbackGain)
  feedbackGain.connect(delay)
  toneFilter.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * SPRING REVERB - Simulation de reverb à ressorts
 */
export function makeSpringReverb(
  audioCtx: AudioContext,
  decay: number = 50,
  tone: number = 50,
  mix: number = 50
): EffectNodes {
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  const convolver = audioCtx.createConvolver()
  const toneFilter = audioCtx.createBiquadFilter()
  const allpass1 = audioCtx.createBiquadFilter()
  const allpass2 = audioCtx.createBiquadFilter()

  const decayValue = mapParameterToAudioValue('springreverb', 'decay', decay)
  const toneValue = mapParameterToAudioValue('springreverb', 'tone', tone)
  const mixValue = mapParameterToAudioValue('springreverb', 'mix', mix)

  // Créer une IR de spring reverb (caractéristique métallique)
  const sampleRate = audioCtx.sampleRate
  const length = Math.floor(sampleRate * decayValue)
  const buffer = audioCtx.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  // Simulation de résonances multiples (ressorts)
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate
    data[i] = Math.exp(-t * 2) * (
      Math.sin(2 * Math.PI * 800 * t) * 0.3 +
      Math.sin(2 * Math.PI * 1200 * t) * 0.2 +
      Math.sin(2 * Math.PI * 2000 * t) * 0.1 +
      Math.random() * 0.1 // Bruit caractéristique
    )
  }

  convolver.buffer = buffer

  // Filtre tone
  toneFilter.type = 'lowpass'
  toneFilter.frequency.value = toneValue
  toneFilter.Q.value = 0.7

  // Allpass filters pour diffusion
  allpass1.type = 'allpass'
  allpass1.frequency.value = 1000
  allpass1.Q.value = 0.5

  allpass2.type = 'allpass'
  allpass2.frequency.value = 2000
  allpass2.Q.value = 0.5

  inputGain.gain.value = 1.0
  outputGain.gain.value = 1.0
  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue

  inputGain.connect(convolver)
  convolver.connect(allpass1)
  allpass1.connect(allpass2)
  allpass2.connect(toneFilter)
  toneFilter.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * SHIMMER REVERB - Reverb avec pitch shifting
 */
export async function makeShimmerReverb(
  audioCtx: AudioContext,
  decay: number = 50,
  pitch: number = 50,
  mix: number = 50,
  impulseUrl?: string
): Promise<EffectNodes> {
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  const convolver = audioCtx.createConvolver()
  const pitchShifter = audioCtx.createDelay(0.1)
  const pitchGain = audioCtx.createGain()

  const decayValue = mapParameterToAudioValue('shimmerreverb', 'decay', decay)
  const pitchValue = mapParameterToAudioValue('shimmerreverb', 'pitch', pitch)
  const mixValue = mapParameterToAudioValue('shimmerreverb', 'mix', mix)

  // Pitch shift: 0-100 -> -12 to +12 demi-tons
  const semitones = (pitchValue - 0.5) * 24
  const pitchRatio = Math.pow(2, semitones / 12)

  // Charger IR ou créer une IR simple
  if (impulseUrl) {
    try {
      const response = await fetch(impulseUrl)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
      convolver.buffer = audioBuffer
    } catch (error) {
      convolver.buffer = createSimpleIR(audioCtx, decayValue)
    }
  } else {
    convolver.buffer = createSimpleIR(audioCtx, decayValue)
  }

  // Pitch shifting simplifié (delay avec modulation)
  pitchShifter.delayTime.value = 0.01
  pitchGain.gain.value = pitchRatio

  inputGain.gain.value = 1.0
  outputGain.gain.value = 1.0
  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue

  // Routing: reverb -> pitch shift -> output
  inputGain.connect(convolver)
  convolver.connect(pitchShifter)
  pitchShifter.connect(pitchGain)
  pitchGain.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain
  }
}

