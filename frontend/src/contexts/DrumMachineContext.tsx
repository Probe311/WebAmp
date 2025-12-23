import { createContext, useContext, useState, useRef, useCallback, ReactNode, useEffect } from 'react'
import { DEFAULT_PATTERNS } from './patterns'
import { createLogger } from '../services/logger'
import type { FreesoundSound } from '../services/freesound'

const logger = createLogger('DrumMachineContext')

// Type pour Tone.js (importé dynamiquement)
type ToneType = typeof import('tone')
let ToneModule: ToneType | null = null

// Types pour les nœuds Tone.js
// Utilisation de unknown au lieu de any pour une meilleure sécurité de type
// Note: Les types Tone.js complets sont complexes, on utilise unknown avec des assertions de type
// Helpers pour accéder aux propriétés de manière sûre
type ToneVolumeNode = {
  volume: {
    value: number
  }
  connect: (destination: unknown) => unknown
  dispose: () => void
}

type ToneSynth = {
  triggerAttackRelease: (note: string | number, duration: string, time?: number) => void
  dispose: () => void
  connect: (destination: unknown) => unknown
}

type ToneNoiseSynth = {
  triggerAttackRelease: (duration: string, time?: number) => void
  dispose: () => void
  connect: (destination: unknown) => unknown
}

type ToneSamplePlayer = {
  start: (time?: number) => void
  load: (url?: string) => Promise<unknown>
  loaded: boolean
  dispose: () => void
  connect: (destination: unknown) => unknown
}

type ToneGainNode = {
  gain: {
    value: number
  }
  toDestination: () => unknown
  dispose: () => void
}

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
  sampleSources: Record<DrumInstrument, string | null>
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
  loadSample: (instrument: DrumInstrument, audioUrl: string | Blob, name?: string) => Promise<void>
  clearSample: (instrument: DrumInstrument) => void
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
  // Note: Utilisation de unknown au lieu de any pour une meilleure sécurité de type
  const toneRef = useRef<ToneType | null>(null)
  const volumeNodesRef = useRef<Record<DrumInstrument, unknown> | null>(null)
  const masterGainRef = useRef<unknown | null>(null)
  const initializedRef = useRef(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const synthCacheRef = useRef<Partial<Record<DrumInstrument, unknown>>>({
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
  const snareNoiseRef = useRef<unknown | null>(null)
  const snareBodyRef = useRef<unknown | null>(null)
  
  // Samples audio chargés depuis Freesound ou autres sources
  const samplePlayersRef = useRef<Record<DrumInstrument, unknown | null>>({
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
  const [sampleSources, setSampleSources] = useState<Record<DrumInstrument, string | null>>({
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
      const volumeNodes: Record<DrumInstrument, ToneVolumeNode> = {} as Record<DrumInstrument, ToneVolumeNode>
      const instruments: DrumInstrument[] = ['kick', 'snare', 'hihat', 'openhat', 'crash', 'ride', 'tom1', 'tom2', 'tom3']
      
      instruments.forEach(instrument => {
        const volumeNode = new Tone.Volume(0) as unknown as ToneVolumeNode
        volumeNode.connect(masterGain as unknown)
        volumeNodes[instrument] = volumeNode
      })
      
      volumeNodesRef.current = volumeNodes
      
      // Créer les synths
      // Note: Utilisation de types partiels avec unknown pour une meilleure sécurité de type que any
      const synthCache: Partial<Record<DrumInstrument, ToneSynth | ToneNoiseSynth | undefined>> = {
        kick: undefined,
        snare: undefined,
        hihat: undefined,
        openhat: undefined,
        crash: undefined,
        ride: undefined,
        tom1: undefined,
        tom2: undefined,
        tom3: undefined
      }
      
      synthCache.kick = (new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 3,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 }
      }) as any).connect(volumeNodes.kick as any) as unknown as ToneSynth
      
      snareNoiseRef.current = (new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.1 }
      }) as any).connect(volumeNodes.snare as any) as unknown as ToneNoiseSynth
      snareBodyRef.current = (new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 1,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.05 }
      }) as any).connect(volumeNodes.snare as any) as unknown as ToneSynth
      
      synthCache.hihat = (new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.05 }
      }) as any).connect(volumeNodes.hihat as any) as unknown as ToneNoiseSynth
      
      synthCache.openhat = (new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
      }) as any).connect(volumeNodes.openhat as any) as unknown as ToneNoiseSynth
      
      synthCache.crash = (new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.5, sustain: 0, release: 0.5 }
      }) as any).connect(volumeNodes.crash as any) as unknown as ToneNoiseSynth
      
      synthCache.ride = (new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.001, decay: 0.35, sustain: 0, release: 0.35 }
      }) as any).connect(volumeNodes.ride as any) as unknown as ToneNoiseSynth
      
      synthCache.tom1 = (new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
      }) as any).connect(volumeNodes.tom1 as any) as unknown as ToneSynth
      
      synthCache.tom2 = (new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.2 }
      }) as any).connect(volumeNodes.tom2 as any) as unknown as ToneSynth
      
      synthCache.tom3 = (new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 2,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.25, sustain: 0, release: 0.25 }
      }) as any).connect(volumeNodes.tom3 as any) as unknown as ToneSynth
      
      synthCacheRef.current = synthCache
      initializedRef.current = true
      return true
    } catch (error) {
      return false
    }
  }, [masterVolume])

  // Charger un sample audio pour un instrument
  const loadSample = useCallback(async (
    instrument: DrumInstrument,
    audioUrl: string | Blob,
    name?: string
  ): Promise<void> => {
    const initialized = await initializeTone()
    if (!initialized || !volumeNodesRef.current) return

    const Tone = toneRef.current
    if (!Tone) return

    try {
      // Disposer de l'ancien sample s'il existe
      const existingPlayer = samplePlayersRef.current[instrument] as ToneSamplePlayer | null
      if (existingPlayer) {
        existingPlayer.dispose()
        samplePlayersRef.current[instrument] = null
      }

      const volumeNode = volumeNodesRef.current?.[instrument]
      if (!volumeNode) return
      
      // Créer un nouveau Player pour le sample
      let url: string
      if (audioUrl instanceof Blob) {
        url = URL.createObjectURL(audioUrl)
      } else {
        url = audioUrl
      }

      const player = ((new Tone.Player({
        url,
        volume: 0,
        autostart: false
      }) as any).connect(volumeNode as any) as unknown) as ToneSamplePlayer

      await player.load()
      
      // Vérifier que le sample est bien chargé
      if (!player.loaded) {
        logger.debug(`Le sample pour ${instrument} n'est pas chargé après load()`, { url, name })
        // Essayer de recharger après un court délai
        await new Promise(resolve => setTimeout(resolve, 100))
        if (!player.loaded) {
          logger.debug(`Le sample pour ${instrument} n'est toujours pas chargé`, { url, name })
          player.dispose()
          return
        }
      }
      
      samplePlayersRef.current[instrument] = player
      
      // Stocker la source du sample
      setSampleSources(prev => ({
        ...prev,
        [instrument]: name || (typeof audioUrl === 'string' ? audioUrl : 'Sample chargé')
      }))
      
      logger.debug(`Sample chargé avec succès pour ${instrument}`, { name, loaded: player.loaded })
    } catch (error) {
      logger.debug(`Erreur lors du chargement du sample pour ${instrument}`, { error, name })
      // Ne pas relancer l'erreur : on restera sur les sons synthétisés par défaut
      return
    }
  }, [initializeTone])

  // Effacer un sample (revenir au synth)
  const clearSample = useCallback((instrument: DrumInstrument) => {
    const player = samplePlayersRef.current[instrument] as ToneSamplePlayer | null
    if (player) {
      player.dispose()
      samplePlayersRef.current[instrument] = null
    }
    setSampleSources(prev => ({
      ...prev,
      [instrument]: null
    }))
  }, [])

  // Charger les samples par défaut depuis Freesound
  const loadDefaultSamples = useCallback(async () => {
    try {
      // Importer dynamiquement le service Freesound pour éviter les erreurs au chargement
      const freesoundModule = await import('../services/freesound')
      const { freesoundService } = freesoundModule
      
      // Vérifier si Freesound est configuré
      if (!import.meta.env.VITE_FREESOUND_API_KEY && !import.meta.env.VITE_FREESOUND_CLIENT_ID) {
        logger.debug('Freesound non configuré, utilisation des sons synthétisés par défaut')
        return
      }

      const initialized = await initializeTone()
      if (!initialized || !volumeNodesRef.current) return

      // Charger un sample par défaut pour chaque instrument
      const loadPromises: Promise<void>[] = []
      
      for (const instrument of ['kick', 'snare', 'hihat', 'openhat', 'crash', 'ride', 'tom1', 'tom2', 'tom3'] as DrumInstrument[]) {
        // Vérifier si un sample est déjà chargé
        if (samplePlayersRef.current[instrument]) {
          continue
        }

        const loadPromise = (async () => {
          try {
            let samples: FreesoundSound[] = []
            
            // Recherche spécifique selon l'instrument
            if (instrument === 'kick') {
              samples = await freesoundService.searchDrumSamples('kick', 5)
            } else if (instrument === 'snare') {
              samples = await freesoundService.searchDrumSamples('snare', 5)
            } else if (instrument === 'hihat') {
              samples = await freesoundService.searchDrumSamples('hihat', 5)
            } else if (instrument === 'openhat') {
              // Recherche spécifique pour hihat ouvert
              const searchResult = await freesoundService.searchSounds('drum hihat open', {
                filter: '(license:"Attribution" OR license:"Creative Commons 0") duration:[0 TO 2]',
                sort: 'downloads_desc',
                pageSize: 5,
                fields: 'id,name,tags,description,license,previews,username,duration,samplerate,download'
              })
              samples = searchResult.results.filter(sound => {
                const name = sound.name.toLowerCase()
                const tags = sound.tags.join(' ').toLowerCase()
                return !name.includes('loop') && !tags.includes('loop') && sound.duration <= 2.5
              })
            } else if (instrument === 'crash') {
              samples = await freesoundService.searchDrumSamples('crash', 5)
            } else if (instrument === 'ride') {
              samples = await freesoundService.searchDrumSamples('ride', 5)
            } else if (instrument === 'tom1' || instrument === 'tom2' || instrument === 'tom3') {
              samples = await freesoundService.searchDrumSamples('tom', 5)
            }
            
            if (samples.length > 0) {
              // Chercher un sample avec un preview (priorité OGG, puis MP3)
              let sample: FreesoundSound | null = null
              let previewUrl: string | undefined
              
              for (const s of samples) {
                const url = s.previews?.['preview-hq-ogg']
                  || s.previews?.['preview-lq-ogg']
                  || s.previews?.['preview-hq-mp3']
                  || s.previews?.['preview-lq-mp3']
                if (url) {
                  sample = s
                  previewUrl = url
                  break
                }
              }
              
              if (sample && previewUrl) {
                try {
                  // Télécharger le preview en blob d'abord (comme dans DrumSampleSelector)
                  const response = await fetch(previewUrl)
                  if (response.ok) {
                    const blob = await response.blob()
                    // Charger le sample depuis le blob
                    await loadSample(instrument, blob, sample.name)
                    logger.debug(`Sample Freesound chargé pour ${instrument}: ${sample.name} (preview)`)
                  } else {
                    logger.debug(`Impossible de télécharger le preview pour ${instrument}`, { 
                      status: response.status,
                      previewUrl 
                    })
                  }
                } catch (loadError) {
                  // Si le chargement échoue, on log et on garde le synth par défaut
                  logger.debug(`Impossible de charger le preview pour ${instrument}, utilisation du synth par défaut`, { loadError })
                }
              }
            }
          } catch (error) {
            // En cas d'erreur, on continue avec les autres instruments
            logger.debug(`Erreur lors du chargement du sample par défaut pour ${instrument}`, { error })
          }
        })()

        loadPromises.push(loadPromise)
      }

      // Attendre que tous les samples soient chargés (ou échouent)
      await Promise.allSettled(loadPromises)
      logger.debug('Chargement des samples par défaut terminé')
    } catch (error) {
      // Capturer toutes les erreurs pour éviter qu'elles remontent à React
      logger.debug('Erreur globale lors du chargement des samples par défaut', { error })
      // Ne pas relancer l'erreur pour éviter de faire planter le composant
    }
  }, [initializeTone, loadSample])

  // Jouer un son individuel
  const playSound = useCallback(async (instrument: DrumInstrument) => {
    const initialized = await initializeTone()
    if (!initialized || !volumeNodesRef.current) return

    const Tone = toneRef.current
    if (!Tone) return

    const volumeNode = volumeNodesRef.current[instrument] as ToneVolumeNode
    const volumeDb = (volumesRef.current[instrument] / 100) * 20 - 20
    if (Math.abs(volumeNode.volume.value - volumeDb) > 0.01) {
      volumeNode.volume.value = volumeDb
    }

    const now = Tone.now()

    try {
      // Utiliser le sample si disponible, sinon utiliser le synth
      const samplePlayer = samplePlayersRef.current[instrument] as ToneSamplePlayer | null
      if (samplePlayer) {
        if (samplePlayer.loaded) {
          samplePlayer.start(now)
          return
        } else {
          logger.debug(`Sample pour ${instrument} pas encore chargé lors de la lecture`, { 
            hasPlayer: !!samplePlayer,
            loaded: samplePlayer.loaded 
          })
        }
      }

      // Fallback sur les synths
      if (!synthCacheRef.current) return

      switch (instrument) {
        case 'kick': {
          const synth = synthCacheRef.current.kick as ToneSynth | undefined
          if (synth && 'triggerAttackRelease' in synth) {
            synth.triggerAttackRelease('C2', '8n', now)
          }
          break
        }
        case 'snare': {
          const noiseSynth = snareNoiseRef.current as ToneNoiseSynth | null
          const bodySynth = snareBodyRef.current as ToneSynth | null
          if (noiseSynth && bodySynth && 'triggerAttackRelease' in noiseSynth && 'triggerAttackRelease' in bodySynth) {
            noiseSynth.triggerAttackRelease('8n', now)
            bodySynth.triggerAttackRelease('C3', '8n', now + 0.001)
          }
          break
        }
        case 'hihat': {
          const synth = synthCacheRef.current.hihat as ToneNoiseSynth | undefined
          if (synth && 'triggerAttackRelease' in synth) {
            synth.triggerAttackRelease('8n', now)
          }
          break
        }
        case 'openhat': {
          const synth = synthCacheRef.current.openhat as ToneNoiseSynth | undefined
          if (synth && 'triggerAttackRelease' in synth) {
            synth.triggerAttackRelease('8n', now)
          }
          break
        }
        case 'crash': {
          const synth = synthCacheRef.current.crash as ToneNoiseSynth | undefined
          if (synth && 'triggerAttackRelease' in synth) {
            synth.triggerAttackRelease('8n', now)
          }
          break
        }
        case 'ride': {
          const synth = synthCacheRef.current.ride as ToneNoiseSynth | undefined
          if (synth && 'triggerAttackRelease' in synth) {
            synth.triggerAttackRelease('8n', now)
          }
          break
        }
        case 'tom1': {
          const synth = synthCacheRef.current.tom1 as ToneSynth | undefined
          if (synth && 'triggerAttackRelease' in synth) {
            synth.triggerAttackRelease('C3', '8n', now)
          }
          break
        }
        case 'tom2': {
          const synth = synthCacheRef.current.tom2 as ToneSynth | undefined
          if (synth && 'triggerAttackRelease' in synth) {
            synth.triggerAttackRelease('B2', '8n', now)
          }
          break
        }
        case 'tom3': {
          const synth = synthCacheRef.current.tom3 as ToneSynth | undefined
          if (synth && 'triggerAttackRelease' in synth) {
            synth.triggerAttackRelease('A2', '8n', now)
          }
          break
        }
      }
    } catch (error) {
      logger.debug('Erreur lors de la lecture d\'un instrument (preview)', { error, instrument })
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
                  const volumeNode = volumeNodesRef.current![instrument] as ToneVolumeNode
                  const volumeDb = (volumesRef.current[instrument] / 100) * 20 - 20
                  if (Math.abs(volumeNode.volume.value - volumeDb) > 0.01) {
                    volumeNode.volume.value = volumeDb
                  }

                  // Utiliser un offset pour chaque instrument pour garantir des temps uniques
                  const now = baseTime + timeOffset
                  timeOffset += 0.001 // Incrémenter de 1ms pour chaque instrument suivant

                  try {
                    // Utiliser le sample si disponible, sinon utiliser le synth
                    const samplePlayer = samplePlayersRef.current[instrument] as ToneSamplePlayer | null
                    if (samplePlayer) {
                      // Vérifier si le sample est chargé
                      if (samplePlayer.loaded) {
                        samplePlayer.start(now)
                      } else {
                        // Le sample n'est pas encore chargé, utiliser le synth en attendant
                        logger.debug(`Sample pour ${instrument} pas encore chargé, utilisation du synth`, { 
                          hasPlayer: !!samplePlayer,
                          loaded: samplePlayer.loaded 
                        })
                        // Fallback sur les synths
                      }
                    } else {
                      // Fallback sur les synths
                      switch (instrument) {
                        case 'kick': {
                          const synth = synthCacheRef.current!.kick as ToneSynth | undefined
                          if (synth) synth.triggerAttackRelease('C2', '8n', now)
                          break
                        }
                        case 'snare': {
                          const noiseSynth = snareNoiseRef.current as ToneNoiseSynth | null
                          const bodySynth = snareBodyRef.current as ToneSynth | null
                          if (noiseSynth && bodySynth) {
                            noiseSynth.triggerAttackRelease('8n', now)
                            bodySynth.triggerAttackRelease('C3', '8n', now + 0.001)
                          }
                          break
                        }
                        case 'hihat': {
                          const synth = synthCacheRef.current!.hihat as ToneNoiseSynth | undefined
                          if (synth) {
                            synth.triggerAttackRelease('8n', now)
                          }
                          break
                        }
                        case 'openhat': {
                          const synth = synthCacheRef.current!.openhat as ToneNoiseSynth | undefined
                          if (synth) {
                            synth.triggerAttackRelease('8n', now)
                          }
                          break
                        }
                        case 'crash': {
                          const synth = synthCacheRef.current!.crash as ToneNoiseSynth | undefined
                          if (synth) {
                            synth.triggerAttackRelease('8n', now)
                          }
                          break
                        }
                        case 'ride': {
                          const synth = synthCacheRef.current!.ride as ToneNoiseSynth | undefined
                          if (synth) {
                            synth.triggerAttackRelease('8n', now)
                          }
                          break
                        }
                        case 'tom1': {
                          const synth = synthCacheRef.current!.tom1 as ToneSynth | undefined
                          if (synth) synth.triggerAttackRelease('C3', '8n', now)
                          break
                        }
                        case 'tom2': {
                          const synth = synthCacheRef.current!.tom2 as ToneSynth | undefined
                          if (synth) synth.triggerAttackRelease('B2', '8n', now)
                          break
                        }
                        case 'tom3': {
                          const synth = synthCacheRef.current!.tom3 as ToneSynth | undefined
                          if (synth) synth.triggerAttackRelease('A2', '8n', now)
                          break
                        }
                      }
                    }
                  } catch (error) {
                    logger.debug('Erreur lors de la lecture d\'un instrument', { error, instrument })
                  }
                }
              })
            }
            
            return nextStep
          })
        }, stepDuration)
      }).catch((error) => {
        logger.error('Erreur lors de l\'initialisation de Tone.js pour la machine à rythmes', error)
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
        const volumeNode = volumeNodesRef.current![instrument as DrumInstrument] as ToneVolumeNode
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
      const masterGain = masterGainRef.current as ToneGainNode
      const gainValue = value / 100
      if (Math.abs(masterGain.gain.value - gainValue) > 0.001) {
        masterGain.gain.value = gainValue
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

  // Charger les samples par défaut depuis Freesound après la première interaction utilisateur
  const [samplesLoaded, setSamplesLoaded] = useState(false)
  
  useEffect(() => {
    // Ne charger les samples qu'après une interaction utilisateur (pour respecter la politique d'auto-play)
    const handleUserInteraction = () => {
      if (!samplesLoaded) {
        setSamplesLoaded(true)
        // Charger les samples de manière asynchrone après l'interaction
        Promise.resolve()
          .then(() => loadDefaultSamples())
          .catch(error => {
            // Capturer toutes les erreurs pour éviter qu'elles remontent à React
            logger.debug('Erreur lors du chargement des samples par défaut', { error })
            // Ne pas relancer l'erreur pour éviter de faire planter le composant
          })
      }
    }

    // Écouter les interactions utilisateur
    document.addEventListener('click', handleUserInteraction, { once: true })
    document.addEventListener('keydown', handleUserInteraction, { once: true })
    document.addEventListener('touchstart', handleUserInteraction, { once: true })

    return () => {
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('keydown', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }
  }, [loadDefaultSamples, samplesLoaded])

  // Nettoyer les ressources au démontage
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }

      if (synthCacheRef.current) {
        Object.values(synthCacheRef.current).forEach(synth => {
          if (synth) {
            const typedSynth = synth as ToneSynth | ToneNoiseSynth
            typedSynth.dispose()
          }
        })
      }
      
      if (snareNoiseRef.current) {
        const noiseSynth = snareNoiseRef.current as ToneNoiseSynth
        noiseSynth.dispose()
        snareNoiseRef.current = null
      }
      
      if (snareBodyRef.current) {
        const bodySynth = snareBodyRef.current as ToneSynth
        bodySynth.dispose()
        snareBodyRef.current = null
      }
      
      if (volumeNodesRef.current) {
        Object.values(volumeNodesRef.current).forEach(node => {
          const volumeNode = node as ToneVolumeNode
          volumeNode.dispose()
        })
        volumeNodesRef.current = null
      }
      
      if (masterGainRef.current) {
        const masterGain = masterGainRef.current as ToneGainNode
        masterGain.dispose()
        masterGainRef.current = null
      }

      // Nettoyer les samples
      Object.values(samplePlayersRef.current).forEach(player => {
        if (player) {
          const typedPlayer = player as ToneSamplePlayer
          typedPlayer.dispose()
        }
      })
      samplePlayersRef.current = {
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
        sampleSources,
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
        handleVolumeChange,
        loadSample,
        clearSample
      }}
    >
      {children}
    </DrumMachineContext.Provider>
  )
}
