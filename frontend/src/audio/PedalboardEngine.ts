/**
 * Moteur de pedalboard modulaire avec Web Audio API
 * 
 * Architecture de routing:
 * Input → NoiseGate → Compressor → EQ → Overdrive → Distortion → Fuzz
 *      → Chorus → Flanger → Phaser → Tremolo
 *      → Delay → Reverb → CabSimulator → Output
 */

// AudioContext est global dans le navigateur
import { PedalModel, pedalLibrary } from '../data/pedals'
import { PedalAudioConfig, createPedalAudioConfig } from './config'
import {
  makeOverdrive,
  makeDistortion,
  makeFuzz,
  makeEQ,
  makeCompressor,
  makeChorus,
  makeFlanger,
  makePhaser,
  makeTremolo,
  makeDelay,
  makeReverb,
  makeNoiseGate,
  EffectNodes
} from './effects'
import {
  makeOverdriveWithMode,
  makeDistortionWithMode,
  makeFuzzWithMode,
  makeChorusWithMode,
  makeDelayWithMode,
  makeReverbWithMode,
  makeTremoloWithMode
} from './modeEffects'

export interface PedalboardEngineConfig {
  sampleRate?: number
  routing?: 'serial' | 'parallel' | 'custom'
}

export class PedalboardEngine {
  private audioCtx: AudioContext | null = null
  private input: GainNode | null = null
  private output: GainNode | null = null
  private effects: Map<string, EffectNodes> = new Map()
  private effectConfigs: Map<string, PedalAudioConfig> = new Map()
  private cleanupFunctions: (() => void)[] = []
  private impulseResponses: Map<string, string> = new Map() // effectId -> IR URL
  private config: PedalboardEngineConfig

  constructor(config: PedalboardEngineConfig = {}) {
    // Stocker la config pour créer l'AudioContext plus tard (lazy initialization)
    this.config = config
    // L'AudioContext sera créé lors du premier appel à ensureAudioContext()
  }

  /**
   * Crée l'AudioContext de manière paresseuse (seulement quand nécessaire)
   * pour respecter la politique autoplay du navigateur
   */
  private ensureAudioContext(): AudioContext {
    if (!this.audioCtx) {
      // Créer l'AudioContext - il sera en état 'suspended' par défaut
      // C'est normal et attendu, on ne doit pas essayer de le résumer automatiquement
      try {
        this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: this.config.sampleRate
        })

        // Créer les nœuds d'entrée et de sortie
        this.input = this.audioCtx.createGain()
        this.output = this.audioCtx.createGain()

        // Connecter input à output par défaut
        this.input.connect(this.output)
        this.output.connect(this.audioCtx.destination)
      } catch (error) {
        // Si l'AudioContext ne peut pas être créé (politique autoplay), 
        // on laisse l'appelant gérer l'erreur
        throw error
      }
      
      // Ne pas essayer de résumer ici - l'état 'suspended' est normal
      // Il sera résumé lors de la première interaction utilisateur via resumeAudioContext()
    }
    return this.audioCtx
  }

  /**
   * Ajoute un effet au pedalboard
   */
  async addEffect(
    pedalModel: PedalModel,
    parameters?: Record<string, number>,
    effectId?: string
  ): Promise<string> {
    const config = createPedalAudioConfig(pedalModel, parameters)
    const finalEffectId = effectId || config.pedalId

    // Vérifier si l'effet existe déjà
    if (this.effects.has(finalEffectId)) {
      this.removeEffect(finalEffectId)
    }

    // Créer l'effet selon le type
    let effectNodes: EffectNodes

    try {
      // Vérifier si la pédale a un paramètre "mode" (switch-selector)
      const hasMode = 'mode' in config.parameters
      const modeValue = hasMode ? config.parameters.mode : undefined

      // S'assurer que l'AudioContext est créé avant d'ajouter un effet
      const audioCtx = this.ensureAudioContext()

      switch (pedalModel.type) {
        case 'overdrive':
          if (hasMode && modeValue !== undefined) {
            // Utiliser la version avec modes
            effectNodes = makeOverdriveWithMode(
              audioCtx,
              config.parameters.gain ?? config.parameters.drive ?? 50,
              config.parameters.tone ?? 50,
              config.parameters.volume ?? config.parameters.level ?? 50,
              modeValue,
              pedalModel.id // Passer l'ID de la pédale
            )
          } else {
            effectNodes = makeOverdrive(
              audioCtx,
              config.parameters.drive ?? config.parameters.gain ?? 50,
              config.parameters.tone ?? 50,
              config.parameters.level ?? config.parameters.volume ?? 50,
              pedalModel.id // Passer l'ID de la pédale pour config spécifique
            )
          }
          break

        case 'distortion':
          if (hasMode && modeValue !== undefined) {
            // Utiliser la version avec modes
            effectNodes = makeDistortionWithMode(
              audioCtx,
              config.parameters.gain ?? config.parameters.distortion ?? 50,
              config.parameters.tone ?? 50,
              config.parameters.vol ?? config.parameters.volume ?? config.parameters.level ?? 50,
              modeValue,
              pedalModel.id // Passer l'ID de la pédale
            )
          } else {
            effectNodes = makeDistortion(
              audioCtx,
              config.parameters.distortion ?? config.parameters.gain ?? 50,
              config.parameters.tone ?? 50,
              config.parameters.level ?? config.parameters.volume ?? 50,
              pedalModel.id // Passer l'ID de la pédale pour config spécifique
            )
          }
          break

        case 'fuzz':
          if (hasMode && modeValue !== undefined) {
            // Utiliser la version avec modes
            effectNodes = makeFuzzWithMode(
              audioCtx,
              config.parameters.gain ?? config.parameters.fuzz ?? config.parameters.sustain ?? 50,
              config.parameters.tone ?? 50,
              config.parameters.vol ?? config.parameters.volume ?? 50,
              modeValue,
              pedalModel.id // Passer l'ID de la pédale
            )
          } else {
            effectNodes = makeFuzz(
              audioCtx,
              config.parameters.fuzz ?? config.parameters.sustain ?? config.parameters.gain ?? 50,
              config.parameters.tone ?? 50,
              config.parameters.volume ?? 50,
              config.parameters.gate,
              pedalModel.id // Passer l'ID de la pédale pour config spécifique
            )
          }
          break

        case 'eq':
          effectNodes = makeEQ(
            audioCtx,
            config.parameters.bass ?? config.parameters.low ?? 50,
            config.parameters.middle ?? config.parameters.mid ?? 50,
            config.parameters.treble ?? config.parameters.high ?? 50,
            config.parameters.level ?? 50
          )
          break

        case 'compressor':
          effectNodes = makeCompressor(
            audioCtx,
            config.parameters.output ?? 50,
            config.parameters.sensitivity ?? 50
          )
          break

        case 'chorus':
          if (hasMode && modeValue !== undefined) {
            effectNodes = makeChorusWithMode(
              audioCtx,
              config.parameters.rate ?? 50,
              config.parameters.depth ?? 50,
              config.parameters.mix ?? 50,
              modeValue
            )
          } else {
            effectNodes = makeChorus(
              audioCtx,
              config.parameters.rate ?? 50,
              config.parameters.depth ?? 50,
              config.parameters.level ?? 50,
              config.parameters.mix ?? 50
            )
          }
          break

        case 'flanger':
          effectNodes = makeFlanger(
            audioCtx,
            config.parameters.rate ?? 50,
            config.parameters.depth ?? 50,
            config.parameters.feedback ?? config.parameters.regen ?? 50
          )
          break

        case 'phaser':
          effectNodes = makePhaser(
            audioCtx,
            config.parameters.rate ?? 50,
            config.parameters.depth ?? 50,
            config.parameters.feedback ?? 50,
            config.parameters.resonance
          )
          break

        case 'tremolo':
          if (hasMode && config.parameters.wave !== undefined) {
            effectNodes = makeTremoloWithMode(
              audioCtx,
              config.parameters.rate ?? config.parameters.speed ?? 50,
              config.parameters.depth ?? 50,
              config.parameters.volume ?? config.parameters.vol ?? 50,
              config.parameters.wave
            )
          } else {
            effectNodes = makeTremolo(
              audioCtx,
              config.parameters.rate ?? config.parameters.speed ?? 50,
              config.parameters.depth ?? 50,
              config.parameters.volume ?? config.parameters.vol ?? 50,
              config.parameters.wave
            )
          }
          break

        case 'delay':
          if (hasMode && modeValue !== undefined) {
            effectNodes = await makeDelayWithMode(
              audioCtx,
              config.parameters.time ?? config.parameters.delay ?? 50,
              config.parameters.feedback ?? config.parameters.repeat ?? 50,
              config.parameters.mix ?? config.parameters.blend ?? config.parameters.level ?? 50,
              modeValue
            )
          } else {
            effectNodes = makeDelay(
              audioCtx,
              config.parameters.time ?? config.parameters.delay ?? 50,
              config.parameters.feedback ?? config.parameters.repeat ?? 50,
              config.parameters.mix ?? config.parameters.blend ?? config.parameters.level ?? 50
            )
          }
          break

        case 'reverb':
          const reverbIrUrl = this.impulseResponses.get(finalEffectId)
          if (hasMode && modeValue !== undefined) {
            effectNodes = await makeReverbWithMode(
              audioCtx,
              config.parameters.decay ?? config.parameters.reverb ?? 50,
              config.parameters.tone ?? 50,
              config.parameters.mix ?? config.parameters.level ?? 50,
              modeValue,
              reverbIrUrl
            )
          } else {
            effectNodes = await makeReverb(
              audioCtx,
              config.parameters.decay ?? config.parameters.reverb ?? 50,
              config.parameters.tone ?? 50,
              config.parameters.mix ?? config.parameters.level ?? 50,
              reverbIrUrl
            )
          }
          break

        case 'noisegate':
          effectNodes = makeNoiseGate(
            audioCtx,
            config.parameters.threshold ?? 50,
            config.parameters.release ?? 50
          )
          break

        case 'ringmod':
          const { makeRingModulator } = await import('./effects')
          effectNodes = makeRingModulator(
            audioCtx,
            config.parameters.frequency ?? 50,
            config.parameters.mix ?? 50,
            config.parameters.level ?? 50
          )
          break

        case 'bitcrusher':
          const { makeBitCrusher } = await import('./effects')
          effectNodes = makeBitCrusher(
            audioCtx,
            config.parameters.bits ?? 50,
            config.parameters.sampleRate ?? 50,
            config.parameters.mix ?? 50
          )
          break

        case 'lofi':
          const { makeLoFi } = await import('./effects')
          effectNodes = makeLoFi(
            audioCtx,
            config.parameters.saturation ?? 50,
            config.parameters.wow ?? 50,
            config.parameters.flutter ?? 50,
            config.parameters.tone ?? 50
          )
          break

        case 'tapedelay':
          const { makeTapeDelay } = await import('./effects')
          effectNodes = makeTapeDelay(
            audioCtx,
            config.parameters.time ?? 50,
            config.parameters.feedback ?? 50,
            config.parameters.saturation ?? 50,
            config.parameters.wow ?? 30,
            config.parameters.mix ?? 50
          )
          break

        case 'springreverb':
          const { makeSpringReverb } = await import('./effects')
          effectNodes = makeSpringReverb(
            audioCtx,
            config.parameters.decay ?? 50,
            config.parameters.tone ?? 50,
            config.parameters.mix ?? 50
          )
          break

        case 'shimmerreverb':
          const { makeShimmerReverb } = await import('./effects')
          const shimmerIrUrl = this.impulseResponses.get(finalEffectId)
          effectNodes = await makeShimmerReverb(
            audioCtx,
            config.parameters.decay ?? 50,
            config.parameters.pitch ?? 50,
            config.parameters.mix ?? 50,
            shimmerIrUrl
          )
          break

        case 'wah':
          const { makeWah } = await import('./workletEffects')
          effectNodes = await makeWah(
            audioCtx,
            config.parameters.sweep ?? 50,
            config.parameters.Q ?? 50,
            config.parameters.level ?? config.parameters.volume ?? 50
          )
          break

        case 'boost':
          const { makeBoost } = await import('./workletEffects')
          effectNodes = makeBoost(
            audioCtx,
            config.parameters.gain ?? config.parameters.level ?? 50,
            config.parameters.treble ?? 50,
            config.parameters.bass ?? 50
          )
          break

        case 'octaver':
          const { makeOctavia } = await import('./workletEffects')
          effectNodes = await makeOctavia(
            audioCtx,
            config.parameters.fuzz ?? 50,
            config.parameters.octave ?? 50,
            config.parameters.level ?? 50
          )
          break

        case 'vibe':
          const { makeUniVibe } = await import('./workletEffects')
          effectNodes = await makeUniVibe(
            audioCtx,
            config.parameters.speed ?? 50,
            config.parameters.intensity ?? 50,
            config.parameters.mix ?? 50
          )
          break

        case 'pitch':
          const { makePitchShifter } = await import('./workletEffects')
          effectNodes = await makePitchShifter(
            audioCtx,
            config.parameters.interval ?? 50,
            config.parameters.mix ?? 50,
            config.parameters.tracking ?? 50
          )
          break

        case 'rotary':
          const { makeRotary } = await import('./workletEffects')
          effectNodes = await makeRotary(
            audioCtx,
            config.parameters.speed ?? 50,
            config.parameters.depth ?? 50,
            config.parameters.mix ?? 50
          )
          break

        case 'volume':
          const { makeVolume } = await import('./workletEffects')
          effectNodes = makeVolume(
            audioCtx,
            config.parameters.volume ?? 50,
            config.parameters.taper ?? 50
          )
          break

        default:
          throw new Error(`Type d'effet non supporté: ${pedalModel.type}`)
      }

      // Nettoyer l'ancien effet s'il existe (éviter les fuites mémoire)
      const oldEffect = this.effects.get(finalEffectId)
      if (oldEffect && oldEffect.cleanup) {
        try {
          oldEffect.cleanup()
        } catch (error) {
          // échec silencieux du cleanup d'un ancien effet
        }
      }
      
      // Stocker l'effet et sa config
      this.effects.set(finalEffectId, effectNodes)
      this.effectConfigs.set(finalEffectId, config)

      // Stocker la fonction de cleanup si elle existe (pour dispose global)
      if (effectNodes.cleanup) {
        this.cleanupFunctions.push(effectNodes.cleanup)
      }

      // Reconstruire le routing
      this.rebuildRouting()

      return finalEffectId
    } catch (error) {
      throw error
    }
  }

  /**
   * Supprime un effet du pedalboard
   * Optimisé pour le cleanup des ressources
   */
  removeEffect(effectId: string): void {
    const effect = this.effects.get(effectId)
    if (effect) {
      // Appeler la fonction de cleanup si elle existe
      const config = this.effectConfigs.get(effectId)
      if (config && effect.cleanup) {
        try {
          effect.cleanup()
        } catch (error) {
          // échec silencieux du cleanup d'effet
        }
      }
      
      // Déconnecter les nœuds de manière sécurisée
      try {
        if (effect.input) {
          effect.input.disconnect()
        }
      } catch (e) {
        // Ignorer les erreurs si déjà déconnecté
      }
      
      try {
        if (effect.output) {
          effect.output.disconnect()
        }
      } catch (e) {
        // Ignorer les erreurs si déjà déconnecté
      }

      this.effects.delete(effectId)
      this.effectConfigs.delete(effectId)

      // Reconstruire le routing
      this.rebuildRouting()
    }
  }

  /**
   * Met à jour les paramètres d'un effet
   */
  async updateEffectParameters(
    effectId: string,
    parameters: Record<string, number>
  ): Promise<void> {
    const config = this.effectConfigs.get(effectId)
    if (!config) {
      throw new Error(`Effet ${effectId} non trouvé`)
    }

    // Mettre à jour les paramètres
    Object.assign(config.parameters, parameters)

    // Recréer l'effet avec les nouveaux paramètres
    const pedalModel = this.getPedalModelFromConfig(config)
    if (pedalModel) {
      await this.addEffect(pedalModel, config.parameters, effectId)
    }
  }

  /**
   * Active/désactive un effet
   */
  setEffectEnabled(effectId: string, enabled: boolean): void {
    const config = this.effectConfigs.get(effectId)
    if (config) {
      config.enabled = enabled
      this.rebuildRouting()
    }
  }

  /**
   * Reconstruit le routing selon l'ordre des effets
   * Optimisé pour éviter les allocations inutiles
   */
  private rebuildRouting(): void {
    // S'assurer que l'AudioContext est créé
    if (!this.input || !this.output) {
      this.ensureAudioContext()
      return
    }
    
    // Déconnecter tout de manière optimisée
    try {
      this.input!.disconnect()
    } catch (e) {
      // Ignorer les erreurs si déjà déconnecté
    }
    
    try {
      this.output!.disconnect()
    } catch (e) {
      // Ignorer les erreurs si déjà déconnecté
    }

    // Déconnecter tous les effets de manière optimisée
    this.effects.forEach(effect => {
      try {
        if (effect.input) effect.input.disconnect()
      } catch (e) {
        // Ignorer les erreurs si déjà déconnecté
      }
      try {
        if (effect.output) effect.output.disconnect()
      } catch (e) {
        // Ignorer les erreurs si déjà déconnecté
      }
    })

    // Ordre recommandé des effets
    const effectOrder = [
      'noisegate',
      'compressor',
      'eq',
      'overdrive',
      'distortion',
      'fuzz',
      'chorus',
      'flanger',
      'phaser',
      'tremolo',
      'delay',
      'reverb'
    ]

    // Filtrer les effets activés et les trier
    const activeEffects = Array.from(this.effectConfigs.entries())
      .filter(([_, config]) => config.enabled)
      .sort(([idA], [idB]) => {
        const configA = this.effectConfigs.get(idA)!
        const configB = this.effectConfigs.get(idB)!
        const pedalA = this.getPedalModelFromConfig(configA)
        const pedalB = this.getPedalModelFromConfig(configB)
        
        if (!pedalA || !pedalB) return 0
        
        const indexA = effectOrder.indexOf(pedalA.type)
        const indexB = effectOrder.indexOf(pedalB.type)
        
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
      })

    // Connecter en série
    let current: AudioNode = this.input!

    activeEffects.forEach(([effectId]) => {
      const effect = this.effects.get(effectId)
      if (effect) {
        current.connect(effect.input)
        current = effect.output
      }
    })

    // Connecter à la sortie
    current.connect(this.output!)
  }

  /**
   * Obtient le modèle de pédale depuis la config (helper)
   */
  private getPedalModelFromConfig(config: PedalAudioConfig): PedalModel | null {
    return pedalLibrary.find(p => p.id === config.pedalId) || null
  }

  /**
   * Charge une Impulse Response personnalisée pour un effet
   */
  async loadImpulseResponse(effectId: string, irUrl: string): Promise<void> {
    const config = this.effectConfigs.get(effectId)
    if (!config) {
      throw new Error(`Effet ${effectId} non trouvé`)
    }

    // Stocker l'URL de l'IR
    this.impulseResponses.set(effectId, irUrl)

    // Recréer l'effet avec la nouvelle IR
    const pedalModel = this.getPedalModelFromConfig(config)
    if (pedalModel && (pedalModel.type === 'reverb' || pedalModel.type === 'delay')) {
      await this.addEffect(pedalModel, config.parameters)
    }
  }

  /**
   * Charge une Impulse Response depuis Freesound
   * Utilise le service Freesound pour rechercher et télécharger des IRs
   */
  async loadImpulseResponseFromFreesound(
    effectId: string,
    freesoundSoundId: number
  ): Promise<void> {
    const config = this.effectConfigs.get(effectId)
    if (!config) {
      throw new Error(`Effet ${effectId} non trouvé`)
    }

    try {
      // Importer dynamiquement pour éviter les dépendances circulaires
      const { freesoundService } = await import('../services/freesound')
      
      // Télécharger le son depuis Freesound
      const blob = await freesoundService.downloadSound(freesoundSoundId)
      
      // Créer une URL temporaire pour l'IR
      const url = URL.createObjectURL(blob)
      
      // Stocker l'URL de l'IR
      this.impulseResponses.set(effectId, url)
      
      // Recréer l'effet avec la nouvelle IR
      const pedalModel = this.getPedalModelFromConfig(config)
      if (pedalModel && (pedalModel.type === 'reverb' || pedalModel.type === 'delay')) {
        await this.addEffect(pedalModel, config.parameters)
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Obtient l'entrée audio (pour connecter une source)
   */
  getInput(): GainNode {
    this.ensureAudioContext()
    return this.input!
  }

  /**
   * Obtient la sortie audio
   */
  getOutput(): GainNode {
    this.ensureAudioContext()
    return this.output!
  }

  /**
   * Obtient le contexte audio
   */
  getAudioContext(): AudioContext | null {
    return this.audioCtx
  }

  /**
   * Démarre le moteur audio
   * Résume l'AudioContext si suspendu (nécessite un geste utilisateur)
   */
  async start(): Promise<void> {
    const audioCtx = this.ensureAudioContext()
    if (audioCtx.state === 'suspended') {
      try {
        await audioCtx.resume()
      } catch (error) {
        // Ne pas lever d'erreur, l'utilisateur devra interagir avec la page
      }
    }
  }
  
  /**
   * Résume l'AudioContext de manière explicite
   * À appeler après un geste utilisateur pour respecter la politique autoplay
   */
  async resumeAudioContext(): Promise<void> {
    const audioCtx = this.ensureAudioContext()
    if (audioCtx.state === 'suspended') {
      try {
        await audioCtx.resume()
        // Pas de log - silencieux
      } catch (error) {
        // Ignorer silencieusement - l'utilisateur devra interagir avec la page
      }
    }
  }

  /**
   * Arrête le moteur audio
   */
  stop(): void {
    if (this.audioCtx && this.audioCtx.state === 'running') {
      this.audioCtx.suspend()
    }
  }

  /**
   * Nettoie toutes les ressources
   */
  dispose(): void {
    // Appeler toutes les fonctions de cleanup
    this.cleanupFunctions.forEach(cleanup => cleanup())
    this.cleanupFunctions = []

    // Supprimer tous les effets
    this.effects.forEach(effect => {
      if (effect.input) effect.input.disconnect()
      if (effect.output) effect.output.disconnect()
    })
    this.effects.clear()
    this.effectConfigs.clear()

    // Déconnecter input/output si ils existent
    if (this.input) {
      this.input.disconnect()
    }
    if (this.output) {
      this.output.disconnect()
    }

    // Fermer le contexte audio
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close()
    }
    this.audioCtx = null
    this.input = null
    this.output = null
  }
}

