import { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from 'react'
import { DEFAULT_PATTERNS } from './patterns'

// Type pour Tone.js (importé dynamiquement)
type ToneType = typeof import('tone')
let ToneModule: ToneType | null = null

// Fonction helper pour charger Tone.js dynamiquement
const loadTone = async (): Promise<ToneType> => {
  if (!ToneModule) {
    ToneModule = await import('tone')
  }
  return ToneModule
}

// Types d'instruments de batterie
export type DrumInstrument = 'kick' | 'snare' | 'hihat' | 'openhat' | 'crash' | 'ride' | 'tom1' | 'tom2' | 'tom3'

export interface DrumStep {
  [key: string]: boolean // instrument -> activé ou non
}

export interface DrumPattern {
  name: string
  steps: DrumStep[]
  bpm?: number
  volumes?: Record<DrumInstrument, number>
}

interface DrumMachineContextType {
  isPlaying: boolean
  isActive: boolean
  masterVolume: number
  currentStep: number
  bpm: number
  pattern: DrumStep[]
  selectedPattern: number
  volumes: Record<DrumInstrument, number>
  setIsPlaying: (playing: boolean) => void
  setCurrentStep: (step: number | ((prev: number) => number)) => void
  setBpm: (bpm: number) => void
  setPattern: (pattern: DrumStep[]) => void
  setSelectedPattern: (index: number) => void
  setVolumes: (volumes: Record<DrumInstrument, number>) => void
  setMasterVolume: (value: number) => void
  playSound: (instrument: DrumInstrument) => void
  toggleStep: (stepIndex: number, instrument: DrumInstrument) => void
  handlePlayPause: () => void
  handleStop: () => void
  handlePatternChange: (index: number) => void
  handleVolumeChange: (instrument: DrumInstrument, value: number) => void
}

const DrumMachineContext = createContext<DrumMachineContextType | undefined>(undefined)

export function useDrumMachine() {
  const context = useContext(DrumMachineContext)
  if (!context) {
    throw new Error('useDrumMachine must be used within DrumMachineProvider')
  }
  return context
}

interface DrumMachineProviderProps {
  children: ReactNode
}

export function DrumMachineProvider({ children }: DrumMachineProviderProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStepState] = useState(0)
  const [bpm, setBpm] = useState(120)
  const [pattern, setPattern] = useState<DrumStep[]>(() => [...DEFAULT_PATTERNS[0].steps])
  const [selectedPattern, setSelectedPattern] = useState(0)
  const [volumes, setVolumes] = useState<Record<DrumInstrument, number>>({
    kick: DEFAULT_PATTERNS[0].volumes?.kick ?? 100,
    snare: DEFAULT_PATTERNS[0].volumes?.snare ?? 100,
    hihat: DEFAULT_PATTERNS[0].volumes?.hihat ?? 100,
    openhat: DEFAULT_PATTERNS[0].volumes?.openhat ?? 100,
    crash: DEFAULT_PATTERNS[0].volumes?.crash ?? 100,
    ride: DEFAULT_PATTERNS[0].volumes?.ride ?? 100,
    tom1: DEFAULT_PATTERNS[0].volumes?.tom1 ?? 100,
    tom2: DEFAULT_PATTERNS[0].volumes?.tom2 ?? 100,
    tom3: DEFAULT_PATTERNS[0].volumes?.tom3 ?? 100
  })
  const [masterVolume, setMasterVolume] = useState(80)

  // Références pour Tone.js
  const toneRef = useRef<ToneType | null>(null)
  const volumeNodesRef = useRef<Record<DrumInstrument, any> | null>(null)
  const masterGainRef = useRef<any | null>(null)
  const initializedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const synthCacheRef = useRef<Record<DrumInstrument, any | null>>({
    kick: null,
    snare: null,
    hihat: null,
    openhat: null,
    crash: null,
    ride: null,
    tom1: null,
    tom2: null,
    tom3: null
  })
  const snareNoiseRef = useRef<any | null>(null)
  const snareBodyRef = useRef<any | null>(null)
  
  // Références pour éviter les problèmes de closure
  const volumesRef = useRef(volumes)
  const bpmRef = useRef(bpm)
  const patternRef = useRef(pattern)
  
  useEffect(() => {
    volumesRef.current = volumes
  }, [volumes])
  
  useEffect(() => {
    bpmRef.current = bpm
  }, [bpm])
  
  useEffect(() => {
    patternRef.current = pattern
  }, [pattern])

  const setCurrentStep = useCallback((step: number | ((prev: number) => number)) => {
    if (typeof step === 'function') {
      setCurrentStepState(step)
    } else {
      setCurrentStepState(step)
    }
  }, [])

  // Initialiser Tone.js et les instruments
  const initializeTone = useCallback(async (): Promise<boolean> => {
    if (initializedRef.current && volumeNodesRef.current) {
      const Tone = toneRef.current
      if (Tone && Tone.context.state === 'suspended') {
        try {
          await Tone.start()
        } catch (error) {
          return false
        }
      }
      return true
    }

    try {
      const Tone = await loadTone()
      toneRef.current = Tone
      
      // Démarrer le contexte audio
      if (Tone.context.state === 'suspended' || Tone.context.state === 'closed') {
        try {
          await Tone.start()
        } catch (error) {
          return false
        }
      }
      
      // Créer le bus master
      const masterGain = new Tone.Gain(masterVolume / 100).toDestination()
      masterGainRef.current = masterGain

      // Créer les nœuds de volume pour chaque instrument
      const volumeNodes: Record<DrumInstrument, any> = {} as Record<DrumInstrument, any>
      const instruments: DrumInstrument[] = ['kick', 'snare', 'hihat', 'openhat', 'crash', 'ride', 'tom1', 'tom2', 'tom3']
      
      instruments.forEach(instrument => {
        const volumeNode = new Tone.Volume(0)
        volumeNode.connect(masterGain)
        volumeNodes[instrument] = volumeNode
      })
      
      volumeNodesRef.current = volumeNodes
      
      // Créer les synths
      const synthCache: Record<DrumInstrument, any | null> = {
        kick: null,
        snare: null,
        hihat: null,
        openhat: null,
        crash: null,
        ride: null,
        tom1: null,
        tom2: null,
        tom3: null
      }
      
      synthCache.kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 3,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 }
      }).connect(volumeNodes.kick)
      
      snareNoiseRef.current = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
      }).connect(volumeNodes.snare)
      snareBodyRef.current = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 1,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 }
      }).connect(volumeNodes.snare)
      
      synthCache.hihat = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
      }).connect(volumeNodes.hihat)
      
      synthCache.openhat = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
      }).connect(volumeNodes.openhat)
      
      synthCache.crash = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.5 }
      }).connect(volumeNodes.crash)
      
      synthCache.ride = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.35 }
      }).connect(volumeNodes.ride)
      
      synthCache.tom1 = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
      }).connect(volumeNodes.tom1)
      
      synthCache.tom2 = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
      }).connect(volumeNodes.tom2)
      
      synthCache.tom3 = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.25 }
      }).connect(volumeNodes.tom3)
      
      synthCacheRef.current = synthCache
      initializedRef.current = true
      return true
    } catch (error) {
      return false
    }
  }, [masterVolume])

  // Jouer un son individuel
  const playSound = useCallback(async (instrument: DrumInstrument) => {
    const initialized = await initializeTone()
    if (!initialized || !volumeNodesRef.current || !synthCacheRef.current) return

    const Tone = toneRef.current
    if (!Tone) return

    const volumeNode = volumeNodesRef.current[instrument]
    const volumeDb = (volumesRef.current[instrument] / 100) * 20 - 20
    if (Math.abs(volumeNode.volume.value - volumeDb) > 0.01) {
      volumeNode.volume.value = volumeDb
    }

    const now = Tone.now()

    try {
      switch (instrument) {
        case 'kick': {
          const synth = synthCacheRef.current.kick
          if (synth) synth.triggerAttackRelease('C2', '8n', now)
          break
        }
        case 'snare': {
          if (snareNoiseRef.current && snareBodyRef.current) {
            snareNoiseRef.current.triggerAttackRelease('8n', now)
            snareBodyRef.current.triggerAttackRelease('C3', '8n', now + 0.001)
          }
          break
        }
        case 'hihat': {
          const synth = synthCacheRef.current.hihat
          if (synth) synth.triggerAttackRelease('8n', now)
          break
        }
        case 'openhat': {
          const synth = synthCacheRef.current.openhat
          if (synth) synth.triggerAttackRelease('8n', now)
          break
        }
        case 'crash': {
          const synth = synthCacheRef.current.crash
          if (synth) synth.triggerAttackRelease('8n', now)
          break
        }
        case 'ride': {
          const synth = synthCacheRef.current.ride
          if (synth) synth.triggerAttackRelease('8n', now)
          break
        }
        case 'tom1': {
          const synth = synthCacheRef.current.tom1
          if (synth) synth.triggerAttackRelease('C3', '8n', now)
          break
        }
        case 'tom2': {
          const synth = synthCacheRef.current.tom2
          if (synth) synth.triggerAttackRelease('B2', '8n', now)
          break
        }
        case 'tom3': {
          const synth = synthCacheRef.current.tom3
          if (synth) synth.triggerAttackRelease('A2', '8n', now)
          break
        }
      }
    } catch (error) {
      // Échec silencieux de la lecture d'un instrument
    }
  }, [initializeTone])

  // Gérer la boucle de lecture avec setInterval (comme la version précédente fonctionnelle)
  useEffect(() => {
    if (isPlaying && pattern.length > 0) {
      // Initialiser Tone.js avant de démarrer la boucle
      initializeTone().then(() => {
        const NUM_STEPS = 16
        // Calculer la durée d'un step en ms basé sur le BPM (16th notes)
        // 60 secondes / BPM = durée d'une mesure en secondes
        // Diviser par 4 pour obtenir la durée d'un quart de note
        // Multiplier par 1000 pour convertir en millisecondes
        const stepDuration = (60 / bpm / 4) * 1000
        
        intervalRef.current = window.setInterval(() => {
          if (document.visibilityState !== 'visible') {
            return
          }
          setCurrentStepState(prev => {
            const nextStep = (prev + 1) % NUM_STEPS
            
            // Jouer les sons pour ce step
            const currentStepData = pattern[prev]
            if (currentStepData && volumeNodesRef.current && synthCacheRef.current) {
              const instruments: DrumInstrument[] = ['kick', 'snare', 'hihat', 'openhat', 'crash', 'ride', 'tom1', 'tom2', 'tom3']
              const Tone = toneRef.current
              if (!Tone) return nextStep
              
              // Obtenir le temps de base une seule fois
              const baseTime = Tone.now()
              let timeOffset = 0
              
              instruments.forEach(instrument => {
                if (currentStepData[instrument]) {
                  // Jouer le son de manière synchrone avec un offset pour éviter les conflits de timing
                  const volumeNode = volumeNodesRef.current![instrument]
                  const volumeDb = (volumesRef.current[instrument] / 100) * 20 - 20
                  if (Math.abs(volumeNode.volume.value - volumeDb) > 0.01) {
                    volumeNode.volume.value = volumeDb
                  }

                  // Utiliser un offset pour chaque instrument pour garantir des temps uniques
                  const now = baseTime + timeOffset
                  timeOffset += 0.001 // Incrémenter de 1ms pour chaque instrument suivant

                  try {
                    switch (instrument) {
                      case 'kick': {
                        const synth = synthCacheRef.current!.kick
                        if (synth) synth.triggerAttackRelease('C2', '8n', now)
                        break
                      }
                      case 'snare': {
                        if (snareNoiseRef.current && snareBodyRef.current) {
                          snareNoiseRef.current.triggerAttackRelease('8n', now)
                          snareBodyRef.current.triggerAttackRelease('C3', '8n', now + 0.001)
                        }
                        break
                      }
                      case 'hihat': {
                        const synth = synthCacheRef.current!.hihat
                        if (synth) synth.triggerAttackRelease('8n', now)
                        break
                      }
                      case 'openhat': {
                        const synth = synthCacheRef.current!.openhat
                        if (synth) synth.triggerAttackRelease('8n', now)
                        break
                      }
                      case 'crash': {
                        const synth = synthCacheRef.current!.crash
                        if (synth) synth.triggerAttackRelease('8n', now)
                        break
                      }
                      case 'ride': {
                        const synth = synthCacheRef.current!.ride
                        if (synth) synth.triggerAttackRelease('8n', now)
                        break
                      }
                      case 'tom1': {
                        const synth = synthCacheRef.current!.tom1
                        if (synth) synth.triggerAttackRelease('C3', '8n', now)
                        break
                      }
                      case 'tom2': {
                        const synth = synthCacheRef.current!.tom2
                        if (synth) synth.triggerAttackRelease('B2', '8n', now)
                        break
                      }
                      case 'tom3': {
                        const synth = synthCacheRef.current!.tom3
                        if (synth) synth.triggerAttackRelease('A2', '8n', now)
                        break
                      }
                    }
                  } catch (error) {
                    // Échec silencieux de la lecture d'un instrument
                  }
                }
              })
            }
            
            return nextStep
          })
        }, stepDuration)
      }).catch((error) => {
        // Échec silencieux de l'initialisation
      })
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, bpm, pattern, initializeTone])

  // Mettre à jour les volumes
  const updateVolumes = useCallback((newVolumes: Record<DrumInstrument, number>) => {
    setVolumes(newVolumes)
    if (volumeNodesRef.current) {
      Object.keys(newVolumes).forEach(instrument => {
        const volumeNode = volumeNodesRef.current![instrument as DrumInstrument]
        const newVolume = newVolumes[instrument as DrumInstrument]
        const volumeDb = (newVolume / 100) * 20 - 20
        if (Math.abs(volumeNode.volume.value - volumeDb) > 0.01) {
          volumeNode.volume.value = volumeDb
        }
      })
    }
  }, [])

  // Mettre à jour le master volume
  const updateMasterVolume = useCallback((value: number) => {
    setMasterVolume(value)
    if (masterGainRef.current) {
      const gainValue = value / 100
      if (Math.abs(masterGainRef.current.gain.value - gainValue) > 0.001) {
        masterGainRef.current.gain.value = gainValue
      }
    }
  }, [])

  // Gérer Play/Pause
  const handlePlayPause = useCallback(async () => {
    const initialized = await initializeTone()
    if (!initialized) {
      return
    }

    const Tone = toneRef.current
    if (!Tone) {
      return
    }
    
    if (Tone.context.state === 'suspended') {
      try {
        await Tone.start()
      } catch (error) {
        return
      }
    }
    
    setIsPlaying(prev => {
      const newPlaying = !prev
      if (newPlaying) {
        setIsActive(true)
      }
      return newPlaying
    })
  }, [initializeTone])

  // Gérer Stop
  const handleStop = useCallback(() => {
    setIsPlaying(false)
    setIsActive(false)
    setCurrentStepState(0)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // Gérer le changement de pattern
  const handlePatternChange = useCallback((index: number) => {
    setSelectedPattern(index)
    const selected = DEFAULT_PATTERNS[index]
    if (selected?.bpm) {
      setBpm(selected.bpm)
    }
    if (selected?.volumes) {
      updateVolumes({
        ...volumesRef.current,
        ...selected.volumes
      })
    }
  }, [updateVolumes])

  // Toggle un step
  const toggleStep = useCallback((stepIndex: number, instrument: DrumInstrument) => {
    setPattern(prev => {
      const newPattern = [...prev]
      const wasActive = newPattern[stepIndex]?.[instrument] || false
      newPattern[stepIndex] = {
        ...newPattern[stepIndex],
        [instrument]: !wasActive
      }
      
      if (!wasActive) {
        playSound(instrument)
      }
      
      return newPattern
    })
  }, [playSound])

  // Gérer le changement de volume
  const handleVolumeChange = useCallback((instrument: DrumInstrument, value: number) => {
    updateVolumes({
      ...volumesRef.current,
      [instrument]: value
    })
  }, [updateVolumes])

  // Nettoyer les ressources au démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      if (synthCacheRef.current) {
        Object.values(synthCacheRef.current).forEach(synth => {
          if (synth) synth.dispose()
        })
      }
      
      if (snareNoiseRef.current) {
        snareNoiseRef.current.dispose()
        snareNoiseRef.current = null
      }
      
      if (snareBodyRef.current) {
        snareBodyRef.current.dispose()
        snareBodyRef.current = null
      }
      
      if (volumeNodesRef.current) {
        Object.values(volumeNodesRef.current).forEach(node => {
          node.dispose()
        })
        volumeNodesRef.current = null
      }
      
      if (masterGainRef.current) {
        masterGainRef.current.dispose()
        masterGainRef.current = null
      }
    }
  }, [])

  return (
    <DrumMachineContext.Provider
      value={{
        isPlaying,
        isActive,
        masterVolume,
        currentStep: currentStep,
        bpm,
        pattern,
        selectedPattern,
        volumes,
        setIsPlaying,
        setCurrentStep,
        setBpm,
        setPattern,
        setSelectedPattern,
        setVolumes: updateVolumes,
        setMasterVolume: updateMasterVolume,
        playSound,
        toggleStep,
        handlePlayPause,
        handleStop,
        handlePatternChange,
        handleVolumeChange
      }}
    >
      {children}
    </DrumMachineContext.Provider>
  )
}
