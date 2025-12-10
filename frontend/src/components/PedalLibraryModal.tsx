import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Search, Tag, Building2, Volume1, Volume2 } from 'lucide-react'
import { Modal } from './Modal'
import { Dropdown, DropdownOption } from './Dropdown'
import { CTA } from './CTA'
import * as Tone from 'tone'
import { getPedalPreviewConfig } from '../audio/pedalPreviewConfig'
import { useCatalog } from '../hooks/useCatalog'

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
  const previewSynthRef = useRef<Tone.PolySynth | null>(null)
  const previewEffectRef = useRef<Tone.ToneAudioNode | null>(null)
  const previewNodesRef = useRef<Tone.ToneAudioNode[]>([])
  
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

  const stopPreview = useCallback(() => {
    if (previewTimeoutRef.current) {
      clearTimeout(previewTimeoutRef.current)
      previewTimeoutRef.current = null
    }

    if (previewSynthRef.current) {
      try {
        previewSynthRef.current.releaseAll()
        previewSynthRef.current.dispose()
      } catch (err) {
        console.warn('[PedalLibraryModal] Erreur arrêt synth:', err)
      }
      previewSynthRef.current = null
    }

    // Nettoyer tous les effets
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
  const createPedalEffect = useCallback((pedalModel: any, parameters: Record<string, number>, audioConfig: any): Tone.ToneAudioNode | null => {
    const type = pedalModel.type
    let effect: Tone.ToneAudioNode | null = null
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
  }, [])

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
      // Initialiser Tone.js si nécessaire
      if (Tone.context.state === 'suspended') {
        await Tone.start()
      }

      // Obtenir la configuration audio spécifique de la pédale
      const audioConfig = getPedalPreviewConfig(pedalModel)

      // Charger la pédale avec ses paramètres par défaut
      const defaults: Record<string, number> = {}
      Object.entries(pedalModel.parameters).forEach(([name, def]) => {
        defaults[name] = def.default
      })

      // Créer un synth polyphonique avec la configuration spécifique
      const synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: audioConfig.synthType },
        envelope: audioConfig.synthEnvelope
      })

      // Créer un filtre avec la configuration spécifique
      const filter = new Tone.Filter({
        type: audioConfig.filterType,
        frequency: audioConfig.filterFreq,
        Q: audioConfig.filterQ
      })

      // Créer l'effet de la pédale avec la configuration spécifique
      const effect = createPedalEffect(pedalModel, defaults, audioConfig)

      // Construire la chaîne audio
      synth.connect(filter)
      
      if (effect) {
        filter.connect(effect)
        effect.toDestination()
      } else {
        filter.toDestination()
      }

      // Stocker les références
      previewSynthRef.current = synth
      previewEffectRef.current = effect

      // Mettre à jour l'état
      setPreviewingPedalId(pedalId)

      // Utiliser les accords spécifiques de la config ou les accords par défaut
      const chords = audioConfig.chords || [
        ['C3', 'E3', 'G3'], // Do majeur
        ['G2', 'B2', 'D3'], // Sol majeur
        ['A2', 'C3', 'E3']  // La mineur
      ]

      // Jouer les accords avec un timing de 5 secondes
      const chordDuration = 1.4 // ~1.4 secondes par accord pour 5 secondes total
      const startTime = Tone.now()

      chords.forEach((chord, index) => {
        const time = startTime + index * chordDuration
        synth.triggerAttack(chord, time)
        synth.triggerRelease(chord, time + chordDuration - 0.1)
      })

      // Arrêter après 5 secondes
      previewTimeoutRef.current = setTimeout(() => {
        stopPreview()
      }, 5000)
    } catch (error) {
      console.error('[PedalLibraryModal] Erreur lors de la prévisualisation:', error)
      setPreviewingPedalId(null)
    }
  }, [stopPreview, previewingPedalId, createPedalEffect])

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

                        return (
                          <div className="p-4 border-b border-black/10 dark:border-white/10 relative" style={{ backgroundColor: pedal.color, color: textColor }}>
                            <div className="text-xs uppercase tracking-[1px] mb-1 font-medium" style={{ color: subTextColor }}>{pedal.brand}</div>
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
