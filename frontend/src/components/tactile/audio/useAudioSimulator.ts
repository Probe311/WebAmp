import { useEffect, useRef, useState } from 'react'

export interface AudioSimulatorState {
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  /** Signal global normalisé 0 → 1. */
  level: number
  leftLevel: number
  rightLevel: number
  peakHold: number
  /** Niveau VU en dB, pour alimenter `VuMeter`. */
  vuDecibels: number
  gain: number
  setGain: (gain: number) => void
}

const PEAK_HOLD_MS = 1000
const PEAK_RELEASE_PER_SECOND = 0.7

/**
 * Signal synthétique pour les démonstrations de l'interface audio, sans
 * `AudioContext`. Une seule boucle pilote les deux canaux et les crêtes.
 */
export function useAudioSimulator(initialPlaying = true): AudioSimulatorState {
  const [isPlaying, setIsPlaying] = useState(initialPlaying)
  const [gain, setGain] = useState(1)
  const [level, setLevel] = useState(0.42)
  const [leftLevel, setLeftLevel] = useState(0.4)
  const [rightLevel, setRightLevel] = useState(0.45)
  const [peakHold, setPeakHold] = useState(0.55)
  const [vuDecibels, setVuDecibels] = useState(-6.5)

  const gainRef = useRef(gain)
  gainRef.current = gain

  useEffect(() => {
    if (!isPlaying) {
      setLevel(0)
      setLeftLevel(0)
      setRightLevel(0)
      setPeakHold(0)
      setVuDecibels(-20)
      return
    }

    let frameId = 0
    let elapsed = 0
    let previousTime = performance.now()
    let peakValue = 0
    let peakAt = 0

    const update = (now: number) => {
      const deltaSeconds = Math.min(0.05, (now - previousTime) / 1000)
      previousTime = now
      elapsed += 0.045

      const currentGain = gainRef.current
      const kick = Math.sin(elapsed * 1.8) > 0.82 ? Math.pow(Math.sin(elapsed * 1.8), 6) * 0.42 : 0
      const snare = Math.sin(elapsed * 3.6 + 1.2) > 0.88 ? 0.28 : 0
      const bass = Math.sin(elapsed * 0.9) * 0.18 + Math.cos(elapsed * 2.3) * 0.12 + 0.35
      const jitter = (Math.random() - 0.5) * 0.05

      const signal = Math.max(0.01, Math.min(1, (bass + kick + snare + jitter) * currentGain))
      const pan = Math.sin(elapsed * 1.1) * 0.08
      const nextLeft = Math.max(0.01, Math.min(1, signal * (1 + pan)))
      const nextRight = Math.max(0.01, Math.min(1, signal * (1 - pan)))

      if (Math.max(nextLeft, nextRight) > peakValue) {
        peakValue = Math.max(nextLeft, nextRight)
        peakAt = now
      } else if (now - peakAt > PEAK_HOLD_MS) {
        peakValue = Math.max(0, peakValue - deltaSeconds * PEAK_RELEASE_PER_SECOND)
      }

      const db = Math.max(-20, Math.min(3.2, -20 + Math.pow(signal, 0.65) * 23))

      setLevel(signal)
      setLeftLevel(nextLeft)
      setRightLevel(nextRight)
      setPeakHold(peakValue)
      setVuDecibels(Math.round(db * 10) / 10)

      frameId = requestAnimationFrame(update)
    }

    frameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frameId)
  }, [isPlaying])

  return { isPlaying, setIsPlaying, level, leftLevel, rightLevel, peakHold, vuDecibels, gain, setGain }
}
