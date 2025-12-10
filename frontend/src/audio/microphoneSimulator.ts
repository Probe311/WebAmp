/**
 * Simulateur de microphone avec position et type
 */

import { MicrophoneModel, MicrophonePosition, MicrophoneConfig } from '../data/microphones'

export interface MicrophoneNodes {
  input: AudioNode
  output: AudioNode
}

/**
 * Crée un simulateur de microphone
 */
export function makeMicrophoneSimulator(
  audioCtx: AudioContext,
  microphone: MicrophoneModel,
  position: MicrophonePosition,
  distance: number // cm
): MicrophoneNodes {
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  
  // Filtre de réponse en fréquence du microphone
  const eq = audioCtx.createBiquadFilter()
  eq.type = 'peaking'
  eq.frequency.value = microphone.frequencyResponse.peak || 3000
  eq.Q.value = 2.0
  eq.gain.value = getMicrophoneGain(microphone, position)
  
  // Filtre passe-bas pour simuler la réponse en fréquence
  const lowpass = audioCtx.createBiquadFilter()
  lowpass.type = 'lowpass'
  lowpass.frequency.value = microphone.frequencyResponse.high
  lowpass.Q.value = 1.0
  
  // Filtre passe-haut
  const highpass = audioCtx.createBiquadFilter()
  highpass.type = 'highpass'
  highpass.frequency.value = microphone.frequencyResponse.low
  highpass.Q.value = 1.0
  
  // Atténuation selon la distance
  const distanceGain = audioCtx.createGain()
  distanceGain.gain.value = calculateDistanceAttenuation(distance, position)
  
  // Routing
  inputGain.connect(eq)
  eq.connect(highpass)
  highpass.connect(lowpass)
  lowpass.connect(distanceGain)
  distanceGain.connect(outputGain)
  
  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * Calcule le gain selon le type de microphone et la position
 */
function getMicrophoneGain(mic: MicrophoneModel, position: MicrophonePosition): number {
  let baseGain = 0
  
  // Gain de base selon le type
  switch (mic.type) {
    case 'dynamic':
      baseGain = 0 // Neutre
      break
    case 'condenser':
      baseGain = 3 // +3dB
      break
    case 'ribbon':
      baseGain = -3 // -3dB (plus sensible)
      break
  }
  
  // Ajustement selon la position
  switch (position) {
    case 'on-axis':
      return baseGain
    case 'off-axis-15':
      return baseGain - 1
    case 'off-axis-30':
      return baseGain - 3
    case 'off-axis-45':
      return baseGain - 6
    case 'edge':
      return baseGain - 9
    case 'back':
      return baseGain - 20
    default:
      return baseGain
  }
}

/**
 * Calcule l'atténuation selon la distance
 */
function calculateDistanceAttenuation(distance: number, position: MicrophonePosition): number {
  // Atténuation inverse de la distance (loi en 1/r² approximée)
  const baseDistance = 5 // cm (distance de référence)
  const attenuation = baseDistance / Math.max(distance, 1)
  
  // Ajustement selon la position (off-axis atténue plus)
  let positionFactor = 1.0
  if (position.startsWith('off-axis')) {
    positionFactor = 0.8
  } else if (position === 'edge') {
    positionFactor = 0.6
  } else if (position === 'back') {
    positionFactor = 0.3
  }
  
  return Math.min(attenuation * positionFactor, 1.0)
}

/**
 * Crée un mixeur de plusieurs microphones
 */
export function makeMicrophoneMixer(
  audioCtx: AudioContext,
  configs: MicrophoneConfig[],
  microphoneLibrary: MicrophoneModel[]
): MicrophoneNodes {
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  
  const micNodes: MicrophoneNodes[] = []
  
  configs.forEach((config, index) => {
    const mic = microphoneLibrary.find(m => m.id === config.microphoneId)
    if (mic) {
      const micNode = makeMicrophoneSimulator(audioCtx, mic, config.position, config.distance)
      const mixGain = audioCtx.createGain()
      mixGain.gain.value = config.mix / 100
      
      inputGain.connect(micNode.input)
      micNode.output.connect(mixGain)
      mixGain.connect(merger, 0, index % 2)
      
      micNodes.push(micNode)
    }
  })
  
  merger.connect(outputGain)
  
  return {
    input: inputGain,
    output: outputGain
  }
}

