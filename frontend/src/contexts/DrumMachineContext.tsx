import { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from 'react'
import * as Tone from 'tone'
import { DEFAULT_PATTERNS } from './patterns'

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
  isActive: boolean // Indique si la machine est active (jouée ou en pause)
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
  const [isActive, setIsActive] = useState(false) // Active = jouée ou en pause
  const [currentStep, setCurrentStepState] = useState(0)
  
  const setCurrentStep = useCallback((step: number | ((prev: number) => number)) => {
    if (typeof step === 'function') {
      setCurrentStepState(step)
    } else {
      setCurrentStepState(step)
    }
  }, [])
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

  const volumeNodesRef = useRef<Record<DrumInstrument, Tone.Volume> | null>(null)
  const masterGainRef = useRef<Tone.Gain | null>(null)
  const initializedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Initialiser Tone.js et les instruments
  const initializeTone = useCallback(async () => {
    if (initializedRef.current && volumeNodesRef.current) return

    try {
      // Vérifier l'état du contexte avant de démarrer
      // Ne pas appeler Tone.start() si le contexte est suspendu (évite l'erreur)
      if (Tone.context.state === 'suspended') {
        // Essayer de résumer le contexte silencieusement
        try {
          await Tone.start()
        } catch (error) {
          // Si ça échoue, on attendra une interaction utilisateur
          // Ne pas lever d'erreur pour éviter les messages dans la console
          return
        }
      } else if (Tone.context.state === 'closed') {
        // Le contexte est fermé, on ne peut rien faire
        return
      }
      
      // Créer un bus master puis les nœuds de volume pour chaque instrument
      const masterGain = new Tone.Gain(masterVolume / 100).toDestination()
      masterGainRef.current = masterGain

      // Créer les nœuds de volume pour chaque instrument
      const volumeNodes: Record<DrumInstrument, Tone.Volume> = {} as Record<DrumInstrument, Tone.Volume>
      const instruments: DrumInstrument[] = ['kick', 'snare', 'hihat', 'openhat', 'crash', 'ride', 'tom1', 'tom2', 'tom3']
      
      instruments.forEach(instrument => {
        const volumeNode = new Tone.Volume(0)
        volumeNode.connect(masterGain)
        volumeNodes[instrument] = volumeNode
      })
      
      volumeNodesRef.current = volumeNodes
      initializedRef.current = true
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Tone.js:', error)
    }
  }, [])

  // Jouer un son avec Tone.js
  const playSound = useCallback(async (instrument: DrumInstrument) => {
    await initializeTone()
    
    if (!volumeNodesRef.current) return

    const volumeNode = volumeNodesRef.current[instrument]
    const volumeDb = (volumes[instrument] / 100) * 20 - 20 // Convertir 0-100% en dB (-20 à 0)
    volumeNode.volume.value = volumeDb

    // Créer le synth approprié selon l'instrument
    let synth: Tone.ToneAudioNode

    switch (instrument) {
      case 'kick':
        // Kick : MembraneSynth pour un son de grosse caisse
        synth = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 3,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 }
        }).connect(volumeNode)
        ;(synth as Tone.MembraneSynth).triggerAttackRelease('C2', '8n')
        break
      case 'snare':
        // Snare : NoiseSynth pour le bruit blanc + MembraneSynth pour le corps
        const snareNoise = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
        }).connect(volumeNode)
        const snareBody = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 1,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 }
        }).connect(volumeNode)
        snareNoise.triggerAttackRelease('8n')
        snareBody.triggerAttackRelease('C3', '8n')
        setTimeout(() => {
          snareNoise.dispose()
          snareBody.dispose()
        }, 500)
        return
      case 'hihat':
        // Hi-Hat : NoiseSynth pour un son métallique
        synth = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
        }).connect(volumeNode)
        ;(synth as Tone.NoiseSynth).triggerAttackRelease('8n')
        break
      case 'openhat':
        // Open Hat : NoiseSynth avec plus de sustain
        synth = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
        }).connect(volumeNode)
        ;(synth as Tone.NoiseSynth).triggerAttackRelease('8n')
        break
      case 'crash':
        // Crash : NoiseSynth avec beaucoup de sustain
        synth = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.5 }
        }).connect(volumeNode)
        ;(synth as Tone.NoiseSynth).triggerAttackRelease('8n')
        break
      case 'ride':
        // Ride : NoiseSynth pour un son métallique (comme les autres cymbales)
        // Decay/release intermédiaire entre hi-hat (0.05) et crash (0.5) pour un son de ride réaliste
        synth = new Tone.NoiseSynth({
          noise: { type: 'white' },
          envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.35 }
        }).connect(volumeNode)
        ;(synth as Tone.NoiseSynth).triggerAttackRelease('8n')
        break
      case 'tom1':
        // Tom 1 : MembraneSynth
        synth = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 2,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
        }).connect(volumeNode)
        ;(synth as Tone.MembraneSynth).triggerAttackRelease('C3', '8n')
        break
      case 'tom2':
        // Tom 2 : MembraneSynth (plus grave)
        synth = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 2,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
        }).connect(volumeNode)
        ;(synth as Tone.MembraneSynth).triggerAttackRelease('B2', '8n')
        break
      case 'tom3':
        // Tom 3 : MembraneSynth (encore plus grave)
        synth = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 2,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.25 }
        }).connect(volumeNode)
        ;(synth as Tone.MembraneSynth).triggerAttackRelease('A2', '8n')
        break
      default:
        return
    }

    // Nettoyer après la note
    setTimeout(() => {
      synth.dispose()
    }, 1000)
  }, [volumes, initializeTone])

  // Gérer la boucle de lecture dans le contexte (pour continuer même si la modale est fermée)
  useEffect(() => {
    if (isPlaying && pattern.length > 0) {
      const NUM_STEPS = 16
      const stepDuration = (60 / bpm / 4) * 1000 // Durée d'un step en ms (16th notes)
      
      intervalRef.current = setInterval(() => {
        setCurrentStepState(prev => {
          const nextStep = (prev + 1) % NUM_STEPS
          
          // Jouer les sons pour ce step
          const currentStepData = pattern[prev]
          if (currentStepData) {
            const instruments: DrumInstrument[] = ['kick', 'snare', 'hihat', 'openhat', 'crash', 'ride', 'tom1', 'tom2', 'tom3']
            instruments.forEach(instrument => {
              if (currentStepData[instrument]) {
                playSound(instrument)
              }
            })
          }
          
          return nextStep
        })
      }, stepDuration)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isPlaying, bpm, pattern, playSound])

  // Mettre à jour les volumes
  const updateVolumes = useCallback((newVolumes: Record<DrumInstrument, number>) => {
    setVolumes(newVolumes)
    if (volumeNodesRef.current) {
      Object.keys(newVolumes).forEach(instrument => {
        const volumeNode = volumeNodesRef.current![instrument as DrumInstrument]
        const volumeDb = (newVolumes[instrument as DrumInstrument] / 100) * 20 - 20
        volumeNode.volume.value = volumeDb
      })
    }
  }, [])

  // Mettre à jour le master volume (pour liaison avec égaliseur)
  const updateMasterVolume = useCallback((value: number) => {
    setMasterVolume(value)
    if (masterGainRef.current) {
      masterGainRef.current.gain.value = value / 100
    }
  }, [])

  const handlePlayPause = useCallback(() => {
    initializeTone()
    setIsPlaying(prev => {
      const newPlaying = !prev
      // Si on démarre la lecture, on active la machine
      if (newPlaying) {
        setIsActive(true)
      }
      return newPlaying
    })
  }, [initializeTone])

  const handleStop = useCallback(() => {
    setIsPlaying(false)
    setIsActive(false) // Stop désactive complètement la machine
    setCurrentStepState(0)
  }, [])

  const handlePatternChange = useCallback((index: number) => {
    setSelectedPattern(index)
    // Appliquer BPM et volumes du pattern
    const selected = DEFAULT_PATTERNS[index]
    if (selected?.bpm) {
      setBpm(selected.bpm)
    }
    if (selected?.volumes) {
      updateVolumes({
        ...volumes,
        ...selected.volumes
      })
    }
  }, [])

  const toggleStep = useCallback((stepIndex: number, instrument: DrumInstrument) => {
    setPattern(prev => {
      const newPattern = [...prev]
      const wasActive = newPattern[stepIndex]?.[instrument] || false
      newPattern[stepIndex] = {
        ...newPattern[stepIndex],
        [instrument]: !wasActive
      }
      
      // Jouer le son immédiatement si activé
      if (!wasActive) {
        playSound(instrument)
      }
      
      return newPattern
    })
  }, [playSound])

  const handleVolumeChange = useCallback((instrument: DrumInstrument, value: number) => {
    updateVolumes({
      ...volumes,
      [instrument]: value
    })
  }, [volumes, updateVolumes])

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

