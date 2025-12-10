/**
 * Effets Web Audio API utilisant AudioWorklet pour DSP temps réel
 * 
 * Ces effets nécessitent un rendu sample-accurate impossible avec les nodes standards :
 * - Wah (filtre bandpass modulé)
 * - Uni-Vibe (4 all-pass modulés en parallèle)
 * - Octavia (redressement demi-onde + fuzz)
 * - Whammy (pitch shifting granular)
 * - Rotary (doppler effect + crossfade)
 * - Octaver polyphonique (FFT + resynthèse)
 */

import { mapParameterToAudioValue } from './config'

/**
 * WAH - Filtre bandpass modulé (Vox, Cry Baby, Slash, KH95, RMC)
 */
export async function makeWah(
  audioCtx: AudioContext,
  sweep: number = 50,
  Q: number = 50,
  level: number = 50
): Promise<{ input: AudioNode; output: AudioNode }> {
  // Charger le worklet processor
  await audioCtx.audioWorklet.addModule('/worklets/wah-processor.js')
  
  const sweepValue = mapParameterToAudioValue('wah', 'sweep', sweep)
  const QValue = mapParameterToAudioValue('wah', 'Q', Q)
  const levelValue = mapParameterToAudioValue('wah', 'level', level)
  
  const wahNode = new AudioWorkletNode(audioCtx, 'wah-processor', {
    parameterData: {
      sweep: sweepValue,
      Q: QValue,
      level: levelValue
    }
  })
  
  const outputGain = audioCtx.createGain()
  outputGain.gain.value = levelValue
  
  wahNode.connect(outputGain)
  
  return {
    input: wahNode,
    output: outputGain
  }
}

/**
 * BOOST - Gain + EQ simple (Colorsound, Clean, MC-402)
 * Utilise des nodes natifs (pas besoin d'AudioWorklet)
 */
export function makeBoost(
  audioCtx: AudioContext,
  gain: number = 50,
  treble: number = 50,
  bass: number = 50
): { input: AudioNode; output: AudioNode } {
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const trebleFilter = audioCtx.createBiquadFilter()
  const bassFilter = audioCtx.createBiquadFilter()
  
  const gainValue = mapParameterToAudioValue('boost', 'gain', gain)
  const trebleValue = mapParameterToAudioValue('boost', 'treble', treble)
  const bassValue = mapParameterToAudioValue('boost', 'bass', bass)
  
  // Treble (highshelf)
  trebleFilter.type = 'highshelf'
  trebleFilter.frequency.value = 3000
  trebleFilter.gain.value = (trebleValue - 50) * 0.4 // ±20 dB
  
  // Bass (lowshelf)
  bassFilter.type = 'lowshelf'
  bassFilter.frequency.value = 200
  bassFilter.gain.value = (bassValue - 50) * 0.4 // ±20 dB
  
  inputGain.gain.value = gainValue
  outputGain.gain.value = 1.0
  
  inputGain.connect(bassFilter)
  bassFilter.connect(trebleFilter)
  trebleFilter.connect(outputGain)
  
  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * OCTAVIA - Redressement demi-onde + fuzz + LPF (Roger Mayer)
 */
export async function makeOctavia(
  audioCtx: AudioContext,
  fuzz: number = 50,
  octave: number = 50,
  level: number = 50
): Promise<{ input: AudioNode; output: AudioNode }> {
  await audioCtx.audioWorklet.addModule('/worklets/octavia-processor.js')
  
  const fuzzValue = mapParameterToAudioValue('octavia', 'fuzz', fuzz)
  const octaveValue = mapParameterToAudioValue('octavia', 'octave', octave)
  const levelValue = mapParameterToAudioValue('octavia', 'level', level)
  
  const octaviaNode = new AudioWorkletNode(audioCtx, 'octavia-processor', {
    parameterData: {
      fuzz: fuzzValue,
      octave: octaveValue,
      level: levelValue
    }
  })
  
  // LPF à 1kHz
  const lpf = audioCtx.createBiquadFilter()
  lpf.type = 'lowpass'
  lpf.frequency.value = 1000
  lpf.Q.value = 0.7
  
  const outputGain = audioCtx.createGain()
  outputGain.gain.value = levelValue
  
  octaviaNode.connect(lpf)
  lpf.connect(outputGain)
  
  return {
    input: octaviaNode,
    output: outputGain
  }
}

/**
 * UNI-VIBE - 4 all-pass modulés par LFO (Shin-Ei)
 */
export async function makeUniVibe(
  audioCtx: AudioContext,
  speed: number = 50,
  intensity: number = 50,
  mix: number = 50
): Promise<{ input: AudioNode; output: AudioNode; cleanup: () => void }> {
  await audioCtx.audioWorklet.addModule('/worklets/univibe-processor.js')
  
  const speedValue = mapParameterToAudioValue('univibe', 'speed', speed)
  const intensityValue = mapParameterToAudioValue('univibe', 'intensity', intensity)
  const mixValue = mapParameterToAudioValue('univibe', 'mix', mix)
  
  const univibeNode = new AudioWorkletNode(audioCtx, 'univibe-processor', {
    parameterData: {
      speed: speedValue,
      intensity: intensityValue,
      mix: mixValue
    }
  })
  
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  
  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue
  
  univibeNode.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)
  
  return {
    input: dryGain,
    output: outputGain,
    cleanup: () => {
      // Cleanup si nécessaire
    }
  }
}

/**
 * WHAMMY / PITCH SHIFTER - Granular pitch shifting (DigiTech)
 */
export async function makePitchShifter(
  audioCtx: AudioContext,
  interval: number = 50, // -12 à +12 demi-tons
  mix: number = 50,
  tracking: number = 50
): Promise<{ input: AudioNode; output: AudioNode }> {
  await audioCtx.audioWorklet.addModule('/worklets/pitch-shifter-processor.js')
  
  // Convertir interval (0-100) en demi-tons (-12 à +12)
  const intervalValue = ((interval - 50) / 50) * 12
  const mixValue = mapParameterToAudioValue('pitch', 'mix', mix)
  const trackingValue = mapParameterToAudioValue('pitch', 'tracking', tracking)
  
  const pitchNode = new AudioWorkletNode(audioCtx, 'pitch-shifter-processor', {
    parameterData: {
      interval: intervalValue,
      mix: mixValue,
      tracking: trackingValue
    }
  })
  
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  
  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue
  
  pitchNode.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)
  
  return {
    input: dryGain,
    output: outputGain
  }
}

/**
 * ROTARY - Simulation Leslie (doppler effect + crossfade)
 */
export async function makeRotary(
  audioCtx: AudioContext,
  speed: number = 50,
  depth: number = 50,
  mix: number = 50
): Promise<{ input: AudioNode; output: AudioNode; cleanup: () => void }> {
  await audioCtx.audioWorklet.addModule('/worklets/rotary-processor.js')
  
  const speedValue = mapParameterToAudioValue('rotary', 'speed', speed)
  const depthValue = mapParameterToAudioValue('rotary', 'depth', depth)
  const mixValue = mapParameterToAudioValue('rotary', 'mix', mix)
  
  const rotaryNode = new AudioWorkletNode(audioCtx, 'rotary-processor', {
    parameterData: {
      speed: speedValue,
      depth: depthValue,
      mix: mixValue
    }
  })
  
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  
  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue
  
  rotaryNode.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)
  
  return {
    input: dryGain,
    output: outputGain,
    cleanup: () => {
      // Cleanup si nécessaire
    }
  }
}

/**
 * OCTAVER POLYPHONIQUE - FFT + resynthèse (pour octave supérieure/inférieure)
 */
export async function makeOctaver(
  audioCtx: AudioContext,
  octave: number = 50, // -1, 0, +1 octave
  mix: number = 50,
  tracking: number = 50
): Promise<{ input: AudioNode; output: AudioNode }> {
  await audioCtx.audioWorklet.addModule('/worklets/octaver-processor.js')
  
  // Convertir octave (0-100) en -1, 0, +1
  const octaveValue = Math.round((octave / 50) - 1) // -1, 0, ou 1
  const mixValue = mapParameterToAudioValue('octaver', 'mix', mix)
  const trackingValue = mapParameterToAudioValue('octaver', 'tracking', tracking)
  
  const octaverNode = new AudioWorkletNode(audioCtx, 'octaver-processor', {
    parameterData: {
      octave: octaveValue,
      mix: mixValue,
      tracking: trackingValue
    }
  })
  
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  
  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue
  
  octaverNode.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)
  
  return {
    input: dryGain,
    output: outputGain
  }
}

/**
 * VOLUME PEDAL - Gain avec taper log/lin (BOSS FV/25)
 */
export function makeVolume(
  audioCtx: AudioContext,
  volume: number = 50,
  taper: number = 50 // 0=lin, 100=log
): { input: AudioNode; output: AudioNode } {
  const gainNode = audioCtx.createGain()
  
  const volumeValue = mapParameterToAudioValue('volume', 'volume', volume)
  const taperValue = taper / 100 // 0 à 1
  
  // Taper logarithmique ou linéaire
  const gain = taperValue > 0.5
    ? Math.pow(volumeValue, 2) // Logarithmique
    : volumeValue // Linéaire
  
  gainNode.gain.value = gain
  
  return {
    input: gainNode,
    output: gainNode
  }
}

