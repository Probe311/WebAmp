/**
 * Simulateur de cabinet avec support multi-cabinets et mix
 */

import { mapParameterToAudioValue } from './config'

export interface CabinetNodes {
  input: AudioNode
  output: AudioNode
  cleanup?: () => void
}

/**
 * Crée un simulateur de cabinet avec support multi-IR et mix
 */
export async function makeCabinetSimulator(
  audioCtx: AudioContext,
  cabinetIrUrls: string[], // Plusieurs IR pour mix
  mix: number[] = [], // Mix pour chaque cabinet (0-100)
  overallMix: number = 100
): Promise<CabinetNodes> {
  const inputGain = audioCtx.createGain()
  const outputGain = audioCtx.createGain()
  const merger = audioCtx.createChannelMerger(2)
  const dryGain = audioCtx.createGain()
  const wetGain = audioCtx.createGain()
  const finalMerger = audioCtx.createChannelMerger(2)

  const mixValue = mapParameterToAudioValue('cabinet', 'mix', overallMix)
  
  // Créer un convolver pour chaque cabinet
  const convolvers: ConvolverNode[] = []
  const cabinetGains: GainNode[] = []

  for (let i = 0; i < cabinetIrUrls.length; i++) {
    const convolver = audioCtx.createConvolver()
    const cabinetGain = audioCtx.createGain()
    
    try {
      const response = await fetch(cabinetIrUrls[i])
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
      convolver.buffer = audioBuffer
    } catch (error) {
      // Créer une IR simple en fallback
      convolver.buffer = createSimpleCabinetIR(audioCtx)
    }

    // Mix pour ce cabinet (normalisé)
    const cabinetMix = i < mix.length ? mix[i] / 100 : 1.0 / cabinetIrUrls.length
    cabinetGain.gain.value = cabinetMix

    convolvers.push(convolver)
    cabinetGains.push(cabinetGain)

    inputGain.connect(convolver)
    convolver.connect(cabinetGain)
    cabinetGain.connect(merger, 0, i % 2) // Alterner les canaux
  }

  // Si un seul cabinet, connecter directement
  if (convolvers.length === 1) {
    inputGain.connect(convolvers[0])
    convolvers[0].connect(cabinetGains[0])
    cabinetGains[0].connect(wetGain)
  } else {
    // Mixer tous les cabinets
    merger.connect(wetGain)
  }

  dryGain.gain.value = 1 - mixValue
  wetGain.gain.value = mixValue
  outputGain.gain.value = 1.0

  wetGain.connect(finalMerger, 0, 0)
  dryGain.connect(finalMerger, 0, 1)
  finalMerger.connect(outputGain)

  return {
    input: inputGain,
    output: outputGain,
    cleanup: () => {
      convolvers.forEach(conv => {
        try {
          conv.disconnect()
        } catch (e) {
          // Ignorer
        }
      })
    }
  }
}

/**
 * Crée une IR simple pour cabinet (fallback)
 */
function createSimpleCabinetIR(audioCtx: AudioContext): AudioBuffer {
  const sampleRate = audioCtx.sampleRate
  const length = Math.floor(sampleRate * 0.1) // 100ms
  const buffer = audioCtx.createBuffer(2, length, sampleRate)
  
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch)
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate
      // Réponse impulsionnelle simple (décroissance exponentielle)
      data[i] = Math.exp(-t * 10) * Math.sin(2 * Math.PI * 2000 * t) * 0.3
    }
  }
  
  return buffer
}

