/**
 * Simulateur d'environnement (Room)
 */

import { mapParameterToAudioValue } from './config'

export interface RoomConfig {
  size: number // 0-100 (petit -> grand)
  reverb: number // 0-100 (réverbération ambiante)
  position: number // 0-100 (position dans la pièce: 0=centre, 100=bord)
  damping: number // 0-100 (amortissement)
}

export interface RoomNodes {
  input: AudioNode
  output: AudioNode
  cleanup?: () => void
}

/**
 * Crée un simulateur de pièce
 */
export function makeRoomSimulator(
  audioCtx: AudioContext,
  config: RoomConfig
): RoomNodes {
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  
  // Taille de la pièce (affecte la réverbération)
  const sizeValue = mapParameterToAudioValue('room', 'size', config.size)
  const reverbValue = mapParameterToAudioValue('room', 'reverb', config.reverb)
  const positionValue = mapParameterToAudioValue('room', 'position', config.position)
  const dampingValue = mapParameterToAudioValue('room', 'damping', config.damping)
  
  // Créer une IR de room basée sur les paramètres
  const convolver = audioCtx.createConvolver()
  convolver.buffer = createRoomIR(audioCtx, sizeValue, reverbValue, dampingValue)
  
  // Filtre pour simuler la position dans la pièce
  const positionFilter = audioCtx.createBiquadFilter()
  positionFilter.type = 'lowpass'
  // Plus on est près du bord, plus les hautes fréquences sont atténuées
  positionFilter.frequency.value = 2000 + (1 - positionValue) * 8000
  positionFilter.Q.value = 1.0
  
  // Mix dry/wet
  dryGain.gain.value = 1 - reverbValue
  wetGain.gain.value = reverbValue
  
  // Routing
  inputGain.connect(convolver)
  convolver.connect(positionFilter)
  positionFilter.connect(wetGain)
  wetGain.connect(merger, 0, 0)
  dryGain.connect(merger, 0, 1)
  merger.connect(outputGain)
  
  return {
    input: inputGain,
    output: outputGain
  }
}

/**
 * Crée une IR de pièce basée sur les paramètres
 */
function createRoomIR(
  audioCtx: AudioContext,
  size: number, // 0-1
  reverb: number, // 0-1
  damping: number // 0-1
): AudioBuffer {
  const sampleRate = audioCtx.sampleRate
  // Durée de la réverbération selon la taille (0.1s à 3s)
  const decayTime = 0.1 + size * 2.9
  const length = Math.floor(sampleRate * decayTime)
  const buffer = audioCtx.createBuffer(2, length, sampleRate)
  
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch)
    
    // Générer plusieurs réflexions
    const numReflections = Math.floor(5 + size * 20)
    
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      
      // Réverbération principale (décroissance exponentielle)
      let value = Math.exp(-t / decayTime) * Math.random() * 0.1
      
      // Ajouter des réflexions
      for (let r = 0; r < numReflections; r++) {
        const delay = (r + 1) * (decayTime / numReflections)
        if (i >= delay * sampleRate) {
          const reflectionTime = t - delay
          const reflection = Math.exp(-reflectionTime / (decayTime * (1 - damping))) 
            * Math.sin(2 * Math.PI * (1000 + r * 500) * reflectionTime) 
            * 0.05
          value += reflection
        }
      }
      
      data[i] = value * reverb
    }
  }
  
  return buffer
}

