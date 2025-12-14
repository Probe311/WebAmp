import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Search, Tag, Building2, Volume1, Volume2, BadgeCheck } from 'lucide-react'
import { Modal } from './Modal'
import { Dropdown, DropdownOption } from './Dropdown'
import { CTA } from './CTA'
// Tone.js sera importé dynamiquement pour éviter la création automatique du contexte
type ToneType = typeof import('tone')
let ToneModule: ToneType | null = null
import { getPedalPreviewConfig } from '../audio/pedalPreviewConfig'
import { useCatalog } from '../hooks/useCatalog'
import { getBrandLogo } from '../utils/brandLogos'
import walrusLogo from '../assets/logos/walrus_small.svg'

// Standard Tuning Frequencies (Hz)
// 0: Low E (E2), 1: A (A2), 2: D (D3), 3: G (G3), 4: B (B3), 5: High e (E4)
const STRING_FREQUENCIES = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]

const DEFAULT_TEMPO = 80 // BPM
const MAX_LOOPS = 4

// Types pour la tablature
interface TabNote {
  stringIdx: number
  fret: number | 'x'
}

interface TabColumn {
  id: string
  duration: number // En unités de 16ème de note
  notes: TabNote[]
}

// Helper pour créer une colonne de tablature
const createTabColumn = (notes: number[][], duration: number = 1): TabColumn => ({
  id: Math.random().toString(36).substr(2, 9),
  duration,
  notes: notes.map(([s, f]) => ({ stringIdx: s, fret: f === -1 ? 'x' : f } as TabNote)),
})

// --- DÉFINITIONS D'ACCORDS ---
// A Power Chord: E:5, A:7, D:7, G:6
const chordA = [[0, 5], [1, 7], [2, 7], [3, 6]]

// B Power Chord (Passing): E:7, A:9, D:9, G:8
const chordB = [[0, 7], [1, 9], [2, 9], [3, 8]]

// C Power Chord: E:8, A:10, D:10, G:9
const chordC = [[0, 8], [1, 10], [2, 10], [3, 9]]

// G Power Chord: E:3, A:5, D:5, G:4
const chordG = [[0, 3], [1, 5], [2, 5], [3, 4]]

// D Power Chord: A:5, D:7, G:7, B:7
const chordD = [[1, 5], [2, 7], [3, 7], [4, 7]]

// D Power Chord Variant (last hit): A:5, D:7, G:7, B:8
const chordD_var = [[1, 5], [2, 7], [3, 7], [4, 8]]

// Mutes (Dead notes on middle strings)
const mutes = [[1, -1], [2, -1], [3, -1], [4, -1]]

// --- SÉQUENCE DE TABLATURE ---
// Basée sur une grille de 16èmes de note
// Duration 2 = 8ème de note (note longue)
// Duration 1 = 16ème de note (staccato/chug)
// Total par mesure = 16 unités

const FLY_AWAY_TAB: TabColumn[] = [
  // === MESURE 1 (A -> B -> C) ===
  // A Chord Group
  createTabColumn(chordA, 2), // 6--- (8ème de note)
  createTabColumn(chordA, 1), // 6
  createTabColumn(chordA, 1), // 6
  createTabColumn(chordA, 1), // 6
  createTabColumn(chordA, 1), // 6
  
  // B Passing
  createTabColumn(chordB, 1), // 8
  
  // Mute Transition
  createTabColumn(mutes, 1),  // x
  
  // C Chord Group
  createTabColumn(chordC, 2), // 9---- (8ème de note)
  createTabColumn(chordC, 1), // 9
  createTabColumn(chordC, 1), // 9
  createTabColumn(chordC, 1), // 9
  createTabColumn(chordC, 1), // 9
  
  // End of Bar 1 Mutes
  createTabColumn(mutes, 1), // x
  createTabColumn(mutes, 1), // x
  
  // === MESURE 2 (G -> D) ===
  // G Chord Group
  createTabColumn(chordG, 2), // 4--- (8ème de note)
  createTabColumn(chordG, 1), // 4
  createTabColumn(chordG, 1), // 4
  createTabColumn(chordG, 1), // 4
  createTabColumn(chordG, 1), // 4
  
  // Mute Transition
  createTabColumn(mutes, 1), // x
  createTabColumn(mutes, 1), // x
  
  // D Chord Group
  createTabColumn(chordD, 2), // 7--- (8ème de note)
  createTabColumn(chordD, 1), // 7
  createTabColumn(chordD, 1), // 7
  createTabColumn(chordD, 1), // 7
  createTabColumn(chordD_var, 1), // 8 (La variante spéciale)
  
  // End of Bar 2 Mutes
  createTabColumn(mutes, 1), // x
  createTabColumn(mutes, 1), // x
]

interface PedalLibraryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPedal: (pedalId: string) => void
  searchQuery?: string
}

export function PedalLibraryModal({ isOpen, onClose, onSelectPedal, searchQuery = '' }: PedalLibraryModalProps) {
  const { pedals: pedalLibrary } = useCatalog()
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(undefined)
  const [internalSearchQuery, setInternalSearchQuery] = useState('')
  const [previewingPedalId, setPreviewingPedalId] = useState<string | null>(null)
  const previewTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previewSynthRef = useRef<any | null>(null)
  const previewEffectRef = useRef<any | null>(null)
  const previewNodesRef = useRef<any[]>([])
  const audioNodesRef = useRef<AudioNode[]>([])
  
  const activeSearchQuery = searchQuery || internalSearchQuery

  const filteredPedals = useMemo(() => {
    return pedalLibrary.filter(pedal => {
      const matchesSearch = activeSearchQuery === '' || 
        pedal.brand.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        pedal.model.toLowerCase().includes(activeSearchQuery.toLowerCase()) ||
        pedal.type.toLowerCase().includes(activeSearchQuery.toLowerCase())
      const matchesType = selectedType === undefined || pedal.type === selectedType
      const matchesBrand = selectedBrand === undefined || pedal.brand === selectedBrand
      return matchesSearch && matchesType && matchesBrand
    })
  }, [activeSearchQuery, selectedType, selectedBrand])

  // Grouper par type et trier par ordre alphabétique dans chaque catégorie
  const pedalsByType = useMemo(() => {
    const grouped = filteredPedals.reduce((acc, pedal) => {
      if (!acc[pedal.type]) {
        acc[pedal.type] = []
      }
      acc[pedal.type].push(pedal)
      return acc
    }, {} as Record<string, typeof pedalLibrary>)
    
    // Trier les pédales par ordre alphabétique dans chaque catégorie (marque puis modèle)
    Object.keys(grouped).forEach(type => {
      grouped[type].sort((a, b) => {
        const brandCompare = a.brand.localeCompare(b.brand, 'fr', { sensitivity: 'base' })
        if (brandCompare !== 0) return brandCompare
        return a.model.localeCompare(b.model, 'fr', { sensitivity: 'base' })
      })
    })
    
    return grouped
  }, [filteredPedals])

  // Types uniques pour le dropdown
  const typeOptions = useMemo<DropdownOption[]>(() => {
    const types = Array.from(new Set(pedalLibrary.map(p => p.type))).sort()
    return [
      { value: '', label: 'Tous les types', icon: <Tag size={16} /> },
      ...types.map(type => ({
        value: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
        icon: <Tag size={16} />
      }))
    ]
  }, [])

  // Marques uniques pour le dropdown
  const brandOptions = useMemo<DropdownOption[]>(() => {
    const brands = Array.from(new Set(pedalLibrary.map(p => p.brand))).sort()
    return [
      { value: '', label: 'Toutes les marques', icon: <Building2 size={16} /> },
      ...brands.map(brand => ({
        value: brand,
        label: brand,
        icon: <Building2 size={16} />
      }))
    ]
  }, [])

  // Charger Tone.js dynamiquement pour éviter la création automatique du contexte
  const loadTone = useCallback(async () => {
    if (!ToneModule) {
      ToneModule = await import('tone')
    }
    return ToneModule
  }, [])

  // Service audio amélioré pour la prévisualisation
  // Utiliser le contexte Tone.js au lieu de créer un nouveau contexte
  const getAudioContext = useCallback(async () => {
    const Tone = await loadTone()
    // Ne pas démarrer automatiquement - le contexte sera démarré dans App.tsx après interaction
    // Si le contexte est suspendu, retourner quand même le contexte (sera démarré plus tard)
    return Tone.getContext().rawContext as AudioContext
  }, [loadTone])

  const createGuitarAudioChain = useCallback((ctx: AudioContext) => {
    // Master Volume seulement - pas d'effets, ils seront appliqués par la pédale
    const masterGain = ctx.createGain()
    masterGain.gain.value = 0.5 // Volume de base pour la prévisualisation

    // Créer un nœud de destination intermédiaire pour connecter aux effets Tone.js
    const outputNode = ctx.createGain()
    outputNode.connect(masterGain)
    // Ne pas connecter masterGain à destination ici - sera connecté via Tone.js après interaction utilisateur

    return { outputNode, masterGain }
  }, [])

  const getFrequency = useCallback((stringIdx: number, fret: number) => {
    const rootFreq = STRING_FREQUENCIES[stringIdx]
    // fn = f0 * (a)^n où a est 2^(1/12)
    return rootFreq * Math.pow(2, fret / 12)
  }, [])

  const scheduleTabColumn = useCallback((
    column: TabColumn,
    startTime: number,
    destinationNode: AudioNode,
    ctx: AudioContext,
    tempo: number = DEFAULT_TEMPO,
    audioConfig?: ReturnType<typeof getPedalPreviewConfig>
  ) => {
    // Durée réelle en secondes basée sur le tempo
    // À 160 BPM, une noire = 60/160 = 0.375s
    // Une 16ème de note = 0.375/4 = 0.09375s
    const sixteenthNoteDuration = (60 / tempo) / 4
    const noteDuration = column.duration * sixteenthNoteDuration

    // Utiliser la configuration spécifique de la pédale ou des valeurs par défaut
    const synthType = audioConfig?.synthType || 'sawtooth'
    const filterFreq = audioConfig?.filterFreq ?? 2200
    const filterQ = audioConfig?.filterQ ?? 0.6
    const filterType = audioConfig?.filterType || 'lowpass'
    const envelope = audioConfig?.synthEnvelope || {
      attack: 0.01,
      decay: 0.3,
      sustain: 0.3,
      release: 0.4
    }

    // Parcourir les notes de la colonne
    column.notes.forEach((note, index) => {
      // Effet de strumming: légèrement retarder les cordes graves vs aiguës
      // Pour un downstroke, les cordes graves se déclenchent en premier
      const strumDelay = index * 0.005 // Délai de 5ms entre chaque corde
      const noteTime = startTime + strumDelay

      // Créer Oscillator
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      // Filtre avec configuration spécifique de la pédale
      const filter = ctx.createBiquadFilter()
      filter.type = filterType
      filter.frequency.value = filterFreq
      filter.Q.value = filterQ

      // Connecter: Osc -> Gain -> Filter -> Destination (qui passera par l'effet de pédale)
      osc.connect(gain)
      gain.connect(filter)
      filter.connect(destinationNode)

      audioNodesRef.current.push(osc, gain, filter)

      if (note.fret === 'x') {
        // NOTE MORTE PERCUSSIVE
        // Utiliser du bruit ou une fréquence aléatoire désaccordée pour un "thud"
        osc.type = synthType
        // Choisir une fréquence aléatoire autour de la note ouverte de la corde pour la texture
        osc.frequency.value = STRING_FREQUENCIES[note.stringIdx] * 0.8
        
        // Enveloppe: Très courte, pas de sustain
        gain.gain.setValueAtTime(0, noteTime)
        gain.gain.linearRampToValueAtTime(0.5, noteTime + envelope.attack)
        gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.05)
        
        osc.start(noteTime)
        osc.stop(noteTime + 0.1)

      } else {
        // NOTE TONALE
        const freq = getFrequency(note.stringIdx, note.fret as number)
        
        osc.type = synthType // Utiliser le type spécifique de la pédale
        osc.frequency.value = freq

        // Enveloppe (ADSR) avec configuration spécifique de la pédale
        // Si la durée est > 1, c'est une note longue, ajuster le sustain
        const baseSustain = envelope.sustain
        const sustainLevel = column.duration > 1 
          ? Math.min(0.7, baseSustain * 1.3)  // Légèrement plus de sustain pour notes longues, max 0.7
          : Math.max(0.15, baseSustain * 0.8)  // Moins de sustain pour notes courtes, min 0.15
        
        gain.gain.setValueAtTime(0, noteTime)
        // Attack (Pincement)
        gain.gain.linearRampToValueAtTime(0.7, noteTime + envelope.attack)
        // Decay vers Sustain
        gain.gain.exponentialRampToValueAtTime(sustainLevel, noteTime + envelope.attack + envelope.decay)
        // Release
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + noteDuration + envelope.release)

        osc.start(noteTime)
        osc.stop(noteTime + noteDuration + 0.1)
      }
    })
  }, [getFrequency])

  const stopPreview = useCallback(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current)
      previewTimeoutRef.current = null
    }

    // Arrêter tous les nœuds audio
    audioNodesRef.current.forEach(node => {
      try {
        if (node instanceof OscillatorNode) {
          node.stop()
        }
        if (node instanceof GainNode) {
          node.gain.cancelScheduledValues(0)
          node.gain.setValueAtTime(0, 0)
        }
        node.disconnect()
      } catch (err) {
        // Ignorer les erreurs de nettoyage
      }
    })
    audioNodesRef.current = []

    // Ne pas fermer le contexte Tone.js car il est partagé

    if (previewSynthRef.current) {
      try {
        previewSynthRef.current.releaseAll()
        previewSynthRef.current.dispose()
      } catch (err) {
        console.warn('[PedalLibraryModal] Erreur arrêt synth:', err)
      }
      previewSynthRef.current = null
    }

    // Nettoyer tous les effets Tone.js
    previewNodesRef.current.forEach(node => {
      try {
        node.dispose()
      } catch (err) {
        // Ignorer les erreurs de nettoyage
      }
    })
    previewNodesRef.current = []

    if (previewEffectRef.current) {
      try {
        previewEffectRef.current.dispose()
      } catch (err) {
        // Ignorer les erreurs de nettoyage
      }
      previewEffectRef.current = null
    }

    setPreviewingPedalId(null)
  }, [])

  // Fonction pour créer l'effet selon le type de pédale avec configuration spécifique
  const createPedalEffect = useCallback(async (pedalModel: any, parameters: Record<string, number>, audioConfig: any): Promise<any> => {
    const Tone = await loadTone()
    const type = pedalModel.type
    let effect: any | null = null
    const effectConfig = audioConfig.effectConfig || {}

    switch (type) {
      case 'distortion':
        // Distortion : Metal, agressif, tranchant
        const distortionAmount = effectConfig.distortionAmount || 0.8
        const distortionParam = (parameters.distortion || parameters.gain || 50) / 100
        effect = new Tone.Distortion({
          distortion: distortionAmount * distortionParam * 1.2, // Plus agressif que l'overdrive
          wet: 1
        })
        break

      case 'overdrive':
        // Overdrive : rond et chaud, moins agressif
        const overdriveAmount = effectConfig.overdriveAmount || 0.25
        const driveParam = (parameters.drive || parameters.gain || 50) / 100
        effect = new Tone.Chebyshev({
          order: Math.max(1, Math.floor(overdriveAmount * driveParam * 30)), // Moins d'ordre pour plus de rondeur
          wet: 1
        })
        break

      case 'fuzz':
        // Fuzz : niveau au-dessus de la distortion, extrême
        const fuzzAmount = effectConfig.distortionAmount || 1.5
        const fuzzParam = (parameters.fuzz || parameters.sustain || parameters.gain || 50) / 100
        effect = new Tone.Distortion({
          distortion: Math.min(1, fuzzAmount * fuzzParam * 2.0), // Beaucoup plus que la distortion
          wet: 1
        })
        break

      case 'reverb':
        // Reverb : réverbération spatiale réaliste avec decay
        const reverbDecay = (parameters.decay || parameters.reverb || 50) / 100 * 5 // 0-5 secondes de decay
        const reverb = new Tone.Reverb(reverbDecay)
        // Le reverb a besoin d'être généré (asynchrone, mais on peut l'utiliser immédiatement)
        reverb.generate()
        reverb.wet.value = (parameters.mix || parameters.level || 50) / 100
        effect = reverb
        break

      case 'delay':
        const delayTime = effectConfig.delayTime || 0.3
        const delayParam = (parameters.time || parameters.delay || 50) / 1000
        effect = new Tone.FeedbackDelay({
          delayTime: delayTime + delayParam,
          feedback: (parameters.feedback || parameters.repeat || 50) / 100,
          wet: (parameters.mix || parameters.blend || parameters.level || 50) / 100
        })
        break

      case 'chorus':
        const chorusRate = effectConfig.chorusRate || 1.5
        effect = new Tone.Chorus({
          frequency: chorusRate + ((parameters.rate || 50) / 10),
          delayTime: 3.5,
          depth: (parameters.depth || 50) / 100,
          wet: (parameters.mix || parameters.level || 50) / 100
        })
        break

      case 'flanger':
        effect = new Tone.Vibrato({
          frequency: (parameters.rate || 50) / 10,
          depth: (parameters.depth || 50) / 100
        })
        break

      case 'phaser':
        const phaserRate = effectConfig.phaserRate || 1.2
        effect = new Tone.Phaser({
          frequency: phaserRate + ((parameters.rate || 50) / 10),
          octaves: (parameters.depth || 50) / 50,
          baseFrequency: 1000,
          wet: 0.5
        })
        break

      case 'tremolo':
        const tremoloRate = effectConfig.tremoloRate || 4
        effect = new Tone.Tremolo({
          frequency: tremoloRate + ((parameters.rate || parameters.speed || 50) / 10),
          depth: (parameters.depth || 50) / 100,
          wet: 0.5
        })
        break

      case 'eq':
        const eqBoost = effectConfig.eqBoost || { bass: 0, mid: 0, treble: 0 }
        effect = new Tone.EQ3({
          low: eqBoost.bass + (((parameters.bass || parameters.low || 50) - 50) / 50 * 20),
          mid: eqBoost.mid + (((parameters.middle || parameters.mid || 50) - 50) / 50 * 20),
          high: eqBoost.treble + (((parameters.treble || parameters.high || 50) - 50) / 50 * 20)
        })
        break

      case 'wah':
        // Wah : effet wah wah qui suit chaque note (auto-wah)
        effect = new Tone.AutoWah({
          baseFrequency: 200, // Fréquence de base pour le wah
          octaves: 4, // Large plage de fréquences
          sensitivity: (parameters.Q || parameters.sweep || 50) / 100 * 2, // Sensibilité élevée pour suivre les notes
          Q: 10, // Q élevé pour l'effet wah caractéristique
          follower: 0.3, // Suit rapidement les notes
          wet: 0.7 // Plus de mix pour l'effet wah wah
        })
        break

      case 'compressor':
        // Compressor : écrase le son avec compression agressive
        effect = new Tone.Compressor({
          threshold: -((parameters.sensitivity || 50) / 100) * 40 - 20, // Threshold plus bas pour écraser plus
          ratio: 12, // Ratio très élevé pour écraser le son
          attack: 0.001, // Attack très rapide
          release: 0.2, // Release plus long pour maintenir la compression
          knee: 0 // Knee dur pour compression agressive
        })
        break

      case 'rotary':
        // Rotary : simulation d'un haut-parleur rotatif (effet de rotation spatiale)
        // Combinaison de tremolo (rotation) + chorus (effet spatial) + pan (rotation stéréo)
        const rotarySpeed = (parameters.speed || 50) / 10
        const rotaryDepth = (parameters.depth || 50) / 100
        
        // Tremolo pour simuler la rotation du haut-parleur
        const rotaryTremolo = new Tone.Tremolo({
          frequency: rotarySpeed,
          depth: rotaryDepth,
          wet: 0.6
        })
        
        // Chorus pour l'effet spatial
        const rotaryChorus = new Tone.Chorus({
          frequency: rotarySpeed * 0.5, // Légèrement décalé du tremolo
          delayTime: 3.5,
          depth: rotaryDepth * 0.8,
          wet: 0.4
        })
        
        // Pan pour la rotation stéréo
        const rotaryPan = new Tone.Panner(0)
        // Animer le pan pour créer l'effet de rotation
        const panLFO = new Tone.LFO({
          frequency: rotarySpeed,
          min: -1,
          max: 1
        })
        panLFO.connect(rotaryPan.pan)
        panLFO.start()
        
        // Chaîner les effets
        rotaryTremolo.connect(rotaryChorus)
        rotaryChorus.connect(rotaryPan)
        
        // Stocker les références pour le cleanup
        previewNodesRef.current.push(rotaryTremolo, rotaryChorus, rotaryPan, panLFO)
        
        effect = rotaryPan
        break

      case 'octaver':
        // Octaver : ajoute une octave en dessous ou au-dessus
        const octaveInterval = (parameters.octave || parameters.interval || 50) / 50 // 0-2 (une octave en dessous à une octave au-dessus)
        const octaveMix = (parameters.mix || parameters.level || 50) / 100
        
        // Utiliser PitchShift pour créer l'octave
        const pitchShift = new Tone.PitchShift({
          pitch: (octaveInterval - 1) * 12, // -12 à +12 demi-tons
          wet: octaveMix
        })
        
        effect = pitchShift
        break

      default:
        return null
    }

    if (effect) {
      previewNodesRef.current.push(effect)
    }

    return effect
  }, [loadTone])

  // Fonction de prévisualisation audio
  const handlePreview = useCallback(async (e: React.MouseEvent, pedalId: string) => {
    e.stopPropagation()
    e.preventDefault()

    const pedalModel = pedalLibrary.find(p => p.id === pedalId)
    if (!pedalModel) {
      return
    }

    // Si déjà en train de prévisualiser cette pédale, arrêter
    if (previewingPedalId === pedalId) {
      stopPreview()
      return
    }

    // Arrêter une éventuelle prévisualisation en cours
    stopPreview()

    try {
      // Charger Tone.js dynamiquement (seulement après interaction utilisateur)
      const Tone = await loadTone()

      // Ne pas démarrer automatiquement - le contexte sera démarré dans App.tsx après interaction
      // Si le contexte est suspendu, on continue quand même (sera démarré automatiquement)
      // Utiliser le contexte Tone.js au lieu de créer un nouveau contexte
      // Cela doit être fait AVANT la création des effets pour s'assurer que le contexte est prêt
      const ctx = await getAudioContext()

      // Obtenir la configuration audio spécifique de la pédale
      const audioConfig = getPedalPreviewConfig(pedalModel)

      // Charger la pédale avec ses paramètres par défaut
      const defaults: Record<string, number> = {}
      Object.entries(pedalModel.parameters).forEach(([name, def]) => {
        defaults[name] = def.default
      })

      // Créer l'effet de la pédale avec la configuration spécifique
      // Fait APRÈS que le contexte soit prêt
      const effect = await createPedalEffect(pedalModel, defaults, audioConfig)

      // Stocker les références
      previewEffectRef.current = effect

      // Mettre à jour l'état
      setPreviewingPedalId(pedalId)

      // Créer la chaîne audio de base (sans effets - ils seront appliqués par la pédale)
      const { outputNode, masterGain } = createGuitarAudioChain(ctx)

      // Créer un nœud d'entrée pour les effets Tone.js
      const pedalInput = ctx.createGain()
      outputNode.connect(pedalInput)
      
      // Si un effet Tone.js existe, l'intégrer dans la chaîne
      let finalDestination: AudioNode = pedalInput
      
      if (effect) {
        // Connecter pedalInput directement à l'input de l'effet Tone.js
        try {
          // Tous les effets Tone.js devraient avoir une propriété .input
          // Si ce n'est pas le cas, on essaie d'utiliser Tone.connect directement
          const effectInput = (effect as any).input
          if (effectInput && effectInput instanceof AudioNode) {
            // Connecter directement pedalInput à l'input de l'effet
            pedalInput.connect(effectInput)
            // Connecter l'effet à la destination Tone.js
            effect.toDestination()
            // Les oscillateurs se connectent à pedalInput qui passe par l'effet Tone.js
            finalDestination = pedalInput
          } else {
            // Si pas d'input accessible, utiliser Tone.connect pour connecter à la destination
            // Cela peut arriver avec certains effets Tone.js qui n'exposent pas directement .input
            console.warn('Pas d\'input accessible sur l\'effet Tone.js, utilisation de Tone.connect')
            pedalInput.connect(masterGain)
            // Utiliser Tone.connect pour connecter un AudioNode natif à la destination Tone.js
            Tone.connect(masterGain, Tone.getDestination())
            finalDestination = pedalInput
          }
        } catch (err) {
          console.error('Erreur connexion effet Tone.js:', err)
          // En cas d'erreur, utiliser Tone.connect pour connecter à la destination
          try {
            pedalInput.connect(masterGain)
            Tone.connect(masterGain, Tone.getDestination())
            finalDestination = pedalInput
          } catch (connectErr) {
            console.error('[PedalLibraryModal] Erreur lors de la connexion à la destination:', connectErr)
            // Dernière tentative : connecter directement à destination du contexte audio
            pedalInput.connect(ctx.destination)
            finalDestination = pedalInput
          }
        }
      } else {
        // Pas d'effet, connecter directement au master gain puis à la destination Tone.js
        try {
          pedalInput.connect(masterGain)
          // Utiliser Tone.connect pour connecter un AudioNode natif à la destination Tone.js
          Tone.connect(masterGain, Tone.getDestination())
          finalDestination = pedalInput
        } catch (err) {
          console.error('[PedalLibraryModal] Erreur connexion sans effet:', err)
          // Fallback : connecter directement à destination du contexte audio
          pedalInput.connect(ctx.destination)
          finalDestination = pedalInput
        }
      }

      // Calculer la durée d'une 16ème de note au tempo donné
      const sixteenthNoteDuration = (60 / DEFAULT_TEMPO) / 4

      // Répéter la tablature 4 fois
      const fullTab: TabColumn[] = []
      for (let i = 0; i < MAX_LOOPS; i++) {
        fullTab.push(...FLY_AWAY_TAB)
      }

      // Programmer chaque colonne de la tablature
      // Le signal passera par l'effet de pédale si présent
      const startTime = ctx.currentTime + 0.1 // Petit délai pour éviter les problèmes de timing
      let currentTime = startTime

      fullTab.forEach((column) => {
        scheduleTabColumn(column, currentTime, finalDestination, ctx, DEFAULT_TEMPO, audioConfig)
        // Avancer le temps selon la durée de la colonne
        currentTime += column.duration * sixteenthNoteDuration
      })

      // Calculer la durée totale
      const totalDuration = fullTab.reduce((sum, col) => sum + col.duration, 0) * sixteenthNoteDuration

      // Arrêter après la fin de la mélodie
      previewTimeoutRef.current = setTimeout(() => {
        stopPreview()
      }, totalDuration * 1000 + 500)
    } catch (error) {
      console.error('[PedalLibraryModal] Erreur lors de la prévisualisation:', error)
      setPreviewingPedalId(null)
    }
    }, [stopPreview, previewingPedalId, createPedalEffect, getAudioContext, createGuitarAudioChain, scheduleTabColumn, loadTone, getFrequency, pedalLibrary])

  // Nettoyer les prévisualisations à la fermeture du modal
  const handleClose = () => {
    stopPreview()
    onClose()
  }

  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      stopPreview()
    }
  }, [stopPreview])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bibliothèque de Pédales"
      className="flex flex-col"
      bodyClassName="overflow-y-auto flex-1 p-4 min-h-0"
    >
      {!searchQuery && (
        <div className="p-4 border-b border-black/10 dark:border-white/10 shrink-0">
          <div className="relative flex items-center mb-4">
            <Search size={18} className="absolute left-4 text-black/40 dark:text-white/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher par marque, modèle ou type..."
              value={internalSearchQuery}
              onChange={(e) => setInternalSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#f5f5f5] dark:bg-gray-700 border-2 border-black/10 dark:border-white/10 rounded-lg text-black/85 dark:text-white/85 text-sm transition-all duration-200 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-white dark:focus:bg-gray-600 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,1),0_0_0_2px_rgba(0,0,0,0.05)] dark:focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(70,70,70,0.6),0_0_0_2px_rgba(255,255,255,0.1)] placeholder:text-black/40 dark:placeholder:text-white/40"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Type
              </label>
              <Dropdown
                options={typeOptions}
                value={selectedType || ''}
                placeholder="Tous les types"
                onChange={(value) => setSelectedType(value === '' ? undefined : value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
                Marque
              </label>
              <Dropdown
                options={brandOptions}
                value={selectedBrand || ''}
                placeholder="Toutes les marques"
                onChange={(value) => setSelectedBrand(value === '' ? undefined : value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="overflow-y-auto flex-1 p-4 min-h-0">
        {Object.keys(pedalsByType).length === 0 ? (
          <div className="text-center py-12 text-black/50 dark:text-white/50 text-base">
            Aucune pédale trouvée
          </div>
        ) : (
          Object.entries(pedalsByType).map(([type, pedals]) => (
            <div key={type} className="mb-8">
              <div className="text-sm text-black/50 dark:text-white/50 uppercase tracking-[2px] mb-3 font-semibold">{type.toUpperCase()}</div>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                {pedals.map(pedal => (
                  <div
                    key={pedal.id}
                    className="relative bg-white dark:bg-gray-800 border-2 rounded-xl p-0 cursor-pointer transition-all duration-300 overflow-hidden"
                    style={{ 
                      borderColor: pedal.accentColor,
                      boxShadow: document.documentElement.classList.contains('dark')
                        ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                        : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                        ? '3px 3px 6px rgba(0, 0, 0, 0.6), -3px -3px 6px rgba(70, 70, 70, 0.6)'
                        : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 1)'
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                        ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                        : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div
                      onClick={(e) => {
                        // Ne pas sélectionner la pédale si on clique sur le bouton de prévisualisation
                        if ((e.target as HTMLElement).closest('button')) {
                          return
                        }
                        // Sélectionner la pédale pour l'ajouter au pedalboard
                        onSelectPedal(pedal.id)
                        // Ne pas fermer le modal pour permettre la sélection multiple
                      }}
                      className="w-full text-left"
                      onMouseDown={(e) => {
                        // Ne pas gérer le mousedown si on clique sur le bouton de prévisualisation
                        if ((e.target as HTMLElement).closest('button')) {
                          return
                        }
                        const container = e.currentTarget.closest('div')
                        if (container) {
                          container.style.boxShadow = document.documentElement.classList.contains('dark')
                            ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
                            : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.5)'
                          container.style.transform = 'scale(0.98)'
                        }
                      }}
                      onMouseUp={(e) => {
                        // Ne pas gérer le mouseup si on clique sur le bouton de prévisualisation
                        if ((e.target as HTMLElement).closest('button')) {
                          return
                        }
                        const container = e.currentTarget.closest('div')
                        if (container) {
                          container.style.boxShadow = document.documentElement.classList.contains('dark')
                            ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                            : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
                          container.style.transform = 'scale(1)'
                        }
                      }}
                    >
                      {(() => {
                        // Choisir la couleur de texte selon la luminosité du fond
                        const hex = pedal.color?.replace('#', '') || 'ffffff'
                        const r = parseInt(hex.substring(0, 2), 16) || 255
                        const g = parseInt(hex.substring(2, 4), 16) || 255
                        const b = parseInt(hex.substring(4, 6), 16) || 255
                        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
                        const isLight = luminance > 0.7
                        const textColor = isLight ? '#0f172a' : '#ffffff'
                        const subTextColor = isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.8)'
                        const ctaBg = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)'
                        const ctaHover = isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.25)'

                        const isWalrusAudio = pedal.brand === 'Walrus Audio'
                        const brandLogo = isWalrusAudio ? walrusLogo : getBrandLogo(pedal.brand)

                        return (
                          <div className="p-4 border-b border-black/10 dark:border-white/10 relative" style={{ backgroundColor: pedal.color, color: textColor }}>
                            <div className="flex items-center gap-2 mb-1">
                              {isWalrusAudio && brandLogo ? (
                                <div className="flex items-center gap-2">
                                  <img
                                    src={brandLogo}
                                    alt={pedal.brand}
                                    className="h-4 object-contain"
                                    style={{ filter: isLight ? 'none' : 'brightness(0) invert(1)' }}
                                  />
                                  <BadgeCheck 
                                    className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0"
                                  />
                                  <span className="sr-only">Matériel certifié</span>
                                </div>
                              ) : (
                                <div className="text-xs uppercase tracking-[1px] font-medium" style={{ color: subTextColor }}>{pedal.brand}</div>
                              )}
                            </div>
                            <div className="text-base font-bold" style={{ color: textColor }}>{pedal.model}</div>
                            <div className="absolute top-2 right-2 z-10">
                              <CTA
                                variant="icon-only"
                                icon={previewingPedalId === pedal.id ? <Volume2 size={16} /> : <Volume1 size={16} />}
                                title={previewingPedalId === pedal.id ? "Arrêter la prévisualisation" : "Prévisualiser le son"}
                                active={previewingPedalId === pedal.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  handlePreview(e, pedal.id)
                                }}
                                onMouseDown={(e) => {
                                  e.stopPropagation()
                                }}
                                onMouseUp={(e) => {
                                  e.stopPropagation()
                                }}
                                className="border border-transparent"
                                style={{
                                  background: ctaBg,
                                  color: textColor,
                                  borderColor: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.25)',
                                }}
                                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = ctaHover }}
                                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ctaBg }}
                              />
                            </div>
                          </div>
                        )
                      })()}
                      <div className="px-3 py-3 text-xs text-black/60 dark:text-white/60 leading-relaxed">{pedal.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  )
}
