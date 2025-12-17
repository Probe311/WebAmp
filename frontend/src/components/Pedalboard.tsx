import { useState, useEffect, useMemo, memo, useCallback } from 'react'
import { Plus, GripVertical, X, Trash2, Save, Power, Plug, PlugZap, Users } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { WebSocketClient } from '../services/websocket'
import { pedalControls, pedalComponents, determinePedalSize } from './pedals'
import { Potentiometer } from './Potentiometer'
import { Slider } from './Slider'
import { SwitchSelector } from './SwitchSelector'
import { Pedal } from './Pedal'
import { PedalLibraryModal } from './PedalLibraryModal'
import { Modal } from './Modal'
import { CTA } from './CTA'
import { useCatalog } from '../hooks/useCatalog'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'
import { useToast } from './notifications/ToastProvider'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { ShortcutAction } from '../types/keyboardShortcuts'
import { analyzeControlTypes, analyzeControlTypesFromModel, determineKnobSize } from '../utils/pedalControlHelpers'
import { syncEffectToAudio, syncEffectToWebSocket, removeEffectFromAudio, updateEffectParametersInAudio, setEffectEnabledInAudio } from '../utils/pedalboardSync'
import { PEDAL_BUTTON_COLORS, getContrastTextColor } from '../utils/pedalColors'
import { formatDateFrench } from '../utils/dateFormatter'

export interface Effect {
  id: string
  type: string
  pedalId: string
  name: string
  bypassed: boolean
  parameters: Record<string, number>
}

interface SortableEffectProps {
  effect: Effect
  onRemove: (id: string) => void
  onToggleBypass: (id: string) => void
  onUpdateParameter: (id: string, paramName: string, value: number) => void
  isLast: boolean
}

const SortableEffect = memo(function SortableEffect({ effect, onRemove, onToggleBypass, onUpdateParameter, isLast }: SortableEffectProps) {
  const { pedals: pedalLibrary } = useCatalog()
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: effect.id })

  const pedalModel = useMemo(() => 
    pedalLibrary.find(p => p.id === effect.pedalId) || 
    pedalLibrary.find(p => p.type === effect.type) || 
    pedalLibrary[0],
    [effect.pedalId, effect.type, pedalLibrary]
  )

  const pedalSize = useMemo(() => determinePedalSize(pedalModel), [pedalModel])
  
  // Couleur principale de la pédale - utilisée de manière cohérente partout
  const accentColor = pedalModel.accentColor

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Construire les actions en bas de pédale
  const bottomActions = useMemo(() => (
    <div className={`flex items-center gap-1.5 w-full ${pedalSize === 'S' ? 'gap-1' : ''}`}>
      <CTA
        variant="icon-only"
        icon={<GripVertical size={pedalSize === 'S' ? 14 : 16} />}
        title="Glisser pour réorganiser"
        className={`cursor-grab active:cursor-grabbing px-1.5 py-1.5 rounded-md flex-[0.25] touch-manipulation ${pedalSize === 'S' ? 'min-w-[44px] min-h-[44px] px-1 py-1' : 'min-w-[44px] min-h-[44px]'}`}
        {...attributes}
        {...listeners}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      />
      <CTA
        variant="icon-only"
        icon={<Power size={pedalSize === 'S' ? 14 : 16} />}
        title={effect.bypassed ? 'Activer la pédale' : 'Bypasser la pédale'}
        className={`rounded-md flex-[0.5] touch-manipulation ${pedalSize === 'S' ? 'min-w-[44px] min-h-[44px] px-1 py-1' : 'min-w-[44px] min-h-[44px]'}`}
        style={{
          backgroundColor: effect.bypassed ? PEDAL_BUTTON_COLORS.bypassed.backgroundColor : accentColor,
          color: effect.bypassed ? PEDAL_BUTTON_COLORS.bypassed.textColor : getContrastTextColor(accentColor),
          borderColor: effect.bypassed ? PEDAL_BUTTON_COLORS.bypassed.borderColor : accentColor
        }}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onToggleBypass(effect.id)
        }}
      />
      <CTA
        variant="icon-only"
        icon={<X size={pedalSize === 'S' ? 14 : 16} />}
        title="Supprimer la pédale"
        className={`border-red-500/30 text-red-500/90 hover:bg-red-500/10 hover:border-red-500/60 hover:text-red-500 px-1.5 py-1.5 rounded-md flex-[0.25] touch-manipulation ${pedalSize === 'S' ? 'min-w-[44px] min-h-[44px] px-1 py-1' : 'min-w-[44px] min-h-[44px]'}`}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onRemove(effect.id)
        }}
      />
    </div>
  ), [pedalSize, effect.bypassed, accentColor, attributes, listeners, onToggleBypass, effect.id, onRemove])

  // Essayer d'utiliser le composant complet de pédale (nouveau système)
  const CompletePedalComponent = useMemo(() => {
    return pedalComponents[effect.pedalId]
  }, [effect.pedalId])

  // Si un composant complet existe, l'utiliser
  if (CompletePedalComponent) {
    return (
      <div ref={setNodeRef} style={style} className="flex items-center gap-0 shrink-0 pedal-enter">
        <div className="relative select-none">
          <CompletePedalComponent
            values={effect.parameters}
            onChange={(param: string, val: number) => onUpdateParameter(effect.id, param, val)}
            bypassed={effect.bypassed}
            onBypassToggle={() => onToggleBypass(effect.id)}
            bottomActions={bottomActions}
            accentColor={accentColor}
          />
        </div>
        {!isLast && (
          <div className="flex items-center gap-2 mx-2 shrink-0">
            <div className="text-2xl text-black/40 dark:text-white/40">→</div>
          </div>
        )}
      </div>
    )
  }

  // Rendu des contrôles (priorité aux composants dédiés) - Ancien système
  const controls = useMemo(() => {
    const CustomControls = pedalControls[effect.pedalId]
    if (CustomControls) {
      return (
        <CustomControls
          values={effect.parameters}
          onChange={(param: string, val: number) => onUpdateParameter(effect.id, param, val)}
          accentColor={accentColor}
        />
      )
    }

    // Fallback legacy - utiliser les helpers pour analyser les types de contrôles
    const controlAnalysis = analyzeControlTypes(effect.parameters, pedalModel)
    const { sliders, switchSelectors, others, potentiometers, hasThreeKnobs, hasSwitchSelectorWithKnobs, isEQ } = controlAnalysis
    
    let knobIndex = 0
    // G-Major 2 : knobs d'abord, puis switch-selector
    const isGmajor2 = pedalModel.id === 'tc-gmajor2'
    const orderedParams = isGmajor2
      ? [...others, ...switchSelectors]
      : hasSwitchSelectorWithKnobs 
      ? [...switchSelectors, ...others]
      : [...sliders, ...switchSelectors, ...others]
    
    return orderedParams.map(([paramName, value]) => {
      const paramDef = pedalModel.parameters[paramName]
      if (!paramDef) return null
      
      const controlType = paramDef.controlType || 'knob'
      
      if (controlType === 'slider') {
        const sliderOrientation = isEQ ? 'vertical' : (paramDef.orientation || 'vertical')
        return (
          <Slider
            key={paramName}
            value={value}
            min={paramDef.min}
            max={paramDef.max}
            label={paramDef.label}
            orientation={sliderOrientation}
            color={accentColor}
            onChange={(newValue) => onUpdateParameter(effect.id, paramName, newValue)}
          />
        )
      }
      
      if (controlType === 'switch-vertical' || controlType === 'switch-horizontal') {
        return (
          <Slider
            key={paramName}
            value={value}
            min={paramDef.min}
            max={paramDef.max}
            label={paramDef.label}
            color={accentColor}
            orientation={isEQ ? 'horizontal' : (controlType === 'switch-vertical' ? 'vertical' : 'horizontal')}
            onChange={(newValue) => onUpdateParameter(effect.id, paramName, newValue)}
          />
        )
      }
      
      if (controlType === 'switch-selector' && paramDef.labels) {
        const isGmajor2Switch = pedalModel.id === 'tc-gmajor2'
        return (
          <SwitchSelector
            key={paramName}
            value={value}
            min={paramDef.min}
            max={paramDef.max}
            labels={paramDef.labels}
            icons={paramDef.icons}
            color={accentColor}
            onChange={(newValue) => onUpdateParameter(effect.id, paramName, newValue)}
            className={hasSwitchSelectorWithKnobs || isGmajor2Switch ? 'switch-selector-full-width' : ''}
          />
        )
      }
      
      const isPotentiometer = controlType === 'knob' || (!controlType && paramDef && controlType !== 'switch-vertical' && controlType !== 'switch-horizontal')
      if (isPotentiometer) {
        knobIndex++
      }
      const isThirdKnob = hasThreeKnobs && isPotentiometer && knobIndex === 3
      
      const knobSize = determineKnobSize(potentiometers.length, hasSwitchSelectorWithKnobs)
      
      return (
        <Potentiometer
          key={paramName}
          value={value}
          min={paramDef.min}
          max={paramDef.max}
          label={paramDef.label}
          color={accentColor}
          size={knobSize}
          onChange={(newValue) => onUpdateParameter(effect.id, paramName, newValue)}
          className={isThirdKnob ? 'knob-center' : ''}
        />
      )
    })
  }, [effect.parameters, effect.id, pedalModel, accentColor, onUpdateParameter])
  
  const hasThreeKnobsOnly = useMemo(() => {
    const analysis = analyzeControlTypesFromModel(pedalModel)
    return analysis.hasThreeKnobs
  }, [pedalModel])

  const hasSwitchSelectorWithKnobs = useMemo(() => {
    const analysis = analyzeControlTypes(effect.parameters, pedalModel)
    return analysis.hasSwitchSelectorWithKnobs
  }, [effect.parameters, pedalModel])

  // Détecter s'il y a des sliders horizontaux pour ajouter une marge
  const hasHorizontalSliders = useMemo(() => {
    const params = Object.entries(effect.parameters)
    const sliders = params.filter(([paramName]) => {
      const paramDef = pedalModel.parameters[paramName]
      return paramDef?.controlType === 'slider' && paramDef?.orientation === 'horizontal'
    })
    return sliders.length > 0
  }, [effect.parameters, pedalModel])

  // Détecter les pédales de taille L avec grille 3x2 pour les knobs
  const hasLSizeGrid3x2 = useMemo(() => {
    if (pedalSize !== 'L') return false
    const params = Object.entries(pedalModel.parameters)
    const knobs = params.filter(([, paramDef]) => {
      const controlType = paramDef?.controlType || 'knob'
      return (controlType === 'knob' || !paramDef.controlType) && 
             paramDef?.controlType !== 'switch-vertical' && 
             paramDef?.controlType !== 'switch-horizontal'
    })
    // Pédales spécifiques : Fuzz Factory (5 knobs), Oceans 11, RV-6, Flint, PH-3 (3 knobs + switch-selectors)
    const pedalIds = ['zvex-fuzz-factory', 'electro-harmonix-oceans-11', 'boss-rv6', 'strymon-flint', 'boss-ph3']
    return pedalIds.includes(pedalModel.id) && knobs.length >= 3
  }, [pedalSize, pedalModel])

  // Forcer un layout flex custom sur certaines pédales
  const useFlexLayout = useMemo(() => {
    const flexIds = ['zvex-fuzz-factory', 'electro-harmonix-oceans-11', 'boss-rv6', 'strymon-flint', 'boss-ph3']
    return flexIds.includes(pedalModel.id)
  }, [pedalModel])

  // Détecter G-Major 2 pour disposition spéciale (knobs puis switch-selector)
  const isGmajor2 = useMemo(() => {
    return pedalModel.id === 'tc-gmajor2'
  }, [pedalModel])

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-0 shrink-0 pedal-enter">
      <div className="relative select-none">
        <Pedal
          brand={pedalModel.brand}
          model={pedalModel.model}
          accentColor={accentColor}
          size={pedalSize}
          bypassed={effect.bypassed}
          onBypassToggle={() => onToggleBypass(effect.id)}
          showFootswitch={false}
          className={`${isDragging ? 'opacity-50 cursor-grabbing' : ''} ${hasThreeKnobsOnly ? 'has-three-knobs' : ''} ${pedalModel.type === 'eq' ? 'is-eq-pedal' : ''} ${hasSwitchSelectorWithKnobs ? 'has-switch-selector-with-knobs' : ''} ${hasHorizontalSliders ? 'has-horizontal-sliders' : ''} ${hasLSizeGrid3x2 ? 'has-l-grid-3x2' : ''} ${isGmajor2 ? 'is-gmajor2' : ''} ${useFlexLayout ? 'use-flex-layout' : ''}`}
          bottomActions={bottomActions}
        >
          {controls}
        </Pedal>
      </div>
      {!isLast && (
        <div className="flex items-center gap-2 mx-2 shrink-0">
          <div className="text-2xl text-black/40 dark:text-white/40">→</div>
        </div>
      )}
    </div>
  )
})

interface PedalboardProps {
  searchQuery?: string
  onAddEffectRef?: (fn: (pedalId: string) => void) => void
  onClearEffectsRef?: (fn: () => void) => void
  onEffectsChange?: (pedalIds: string[]) => void
  currentPedalIds?: string[]
  currentAmplifierId?: string
  peakInput?: number
  onOpenProfiles?: () => void
}

export function Pedalboard({ 
  searchQuery: externalSearchQuery = '',
  onAddEffectRef,
  onClearEffectsRef,
  onEffectsChange,
  currentPedalIds = [],
  currentAmplifierId,
  peakInput = -96,
  onOpenProfiles
}: PedalboardProps) {
  const { pedals: pedalLibrary, amplifiers: amplifierLibrary } = useCatalog()
  const { showToast } = useToast()
  const [effects, setEffects] = useState<Effect[]>([])
  const [showPedalLibrary, setShowPedalLibrary] = useState(false)
  const [showSaveProfileModal, setShowSaveProfileModal] = useState(false)
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false)
  const [newProfileName, setNewProfileName] = useState('')
  const [newProfileStyle, setNewProfileStyle] = useState('')

  // Initialiser le moteur audio
  const {
    engine,
    isInitialized,
    addEffect: addAudioEffect,
    removeEffect: removeAudioEffect,
    updateEffectParameters: updateAudioParameters,
    setEffectEnabled,
  } = usePedalboardEngine({
    autoStart: false,
    enableAudioInput: false // Désactivé par défaut, peut être activé via UI
  })
  
  // Notifier le parent quand les effets changent
  useEffect(() => {
    if (onEffectsChange) {
      const pedalIds = effects.map(e => e.pedalId)
      onEffectsChange(pedalIds)
    }
  }, [effects, onEffectsChange])
  
  // Gestion des raccourcis clavier
  useKeyboardShortcuts((action: ShortcutAction) => {
    switch (action.type) {
      case 'togglePedal':
        if (action.pedalIndex >= 0 && action.pedalIndex < effects.length) {
          const effect = effects[action.pedalIndex]
          toggleBypass(effect.id)
        }
        break
      case 'openLibrary':
        setShowPedalLibrary(true)
        break
      case 'clearPedalboard':
        setShowClearConfirmModal(true)
        break
      case 'saveProfile':
        setShowSaveProfileModal(true)
        break
    }
  })
  
  const searchQuery = externalSearchQuery

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addEffect = useCallback(async (pedalId: string) => {
    const pedalModel = pedalLibrary.find(p => p.id === pedalId)
    if (!pedalModel) return

    const defaultParams: Record<string, number> = {}
    Object.entries(pedalModel.parameters).forEach(([name, def]) => {
      defaultParams[name] = def.default
    })

    const newEffect: Effect = {
      id: `effect-${Date.now()}-${Math.random()}`,
      type: pedalModel.type,
      pedalId: pedalModel.id,
      name: `${pedalModel.brand} ${pedalModel.model}`,
      bypassed: false,
      parameters: defaultParams
    }
    
    // Utiliser la forme fonctionnelle de setEffects pour éviter les problèmes de closure
    setEffects(prevEffects => {
      const updatedEffects = [...prevEffects, newEffect]
    
      // Synchroniser avec le moteur audio
      syncEffectToAudio(newEffect, isInitialized, engine, addAudioEffect)
    
      // Synchroniser avec WebSocket
      syncEffectToWebSocket({
        type: 'addEffect',
        effectType: pedalModel.type,
        pedalId: pedalModel.id,
        position: prevEffects.length,
        effectId: newEffect.id
      })
      
      return updatedEffects
    })
  }, [isInitialized, engine, addAudioEffect])

  const clearEffects = useCallback(() => {
    setEffects(prevEffects => {
      const count = prevEffects.length
    
      // Synchroniser avec WebSocket
      syncEffectToWebSocket({
        type: 'clearEffects'
      })
      
      if (count > 0) {
        showToast({
          variant: 'success',
          title: 'Pedalboard vidé',
          message: `${count} pédale${count > 1 ? 's' : ''} supprimée${count > 1 ? 's' : ''}`
        })
      }
      
      return []
    })
  }, [showToast])

  const removeEffect = useCallback((id: string) => {
    setEffects(prevEffects => {
      const effect = prevEffects.find(e => e.id === id)
      const pedalModel = effect ? pedalLibrary.find(p => p.id === effect.pedalId) : null
      const pedalName = pedalModel ? `${pedalModel.brand} ${pedalModel.model}` : 'Pédale'
    
      // Supprimer l'effet du moteur audio
      removeEffectFromAudio(id, isInitialized, engine, removeAudioEffect)
    
      // Synchroniser avec WebSocket
      syncEffectToWebSocket({
        type: 'removeEffect',
        effectId: id
      })
      
      // Afficher une notification de suppression
      showToast({
        variant: 'success',
        title: 'Pédale supprimée',
        message: `${pedalName} a été retirée du pedalboard`
      })
      
      return prevEffects.filter(e => e.id !== id)
    })
  }, [isInitialized, engine, removeAudioEffect, showToast, pedalLibrary])

  const toggleBypass = useCallback((id: string) => {
    setEffects(prevEffects => {
      const effect = prevEffects.find(e => e.id === id)
      if (!effect) return prevEffects
      
      const newBypassed = !effect.bypassed
    
      // Mettre à jour l'état dans le moteur audio
      setEffectEnabledInAudio(id, !newBypassed, isInitialized, engine, setEffectEnabled)
    
      // Synchroniser avec WebSocket
      syncEffectToWebSocket({
        type: 'toggleBypass',
        effectId: id,
        bypassed: newBypassed
      })
      
      return prevEffects.map(e => 
        e.id === id ? { ...e, bypassed: newBypassed } : e
      )
    })
  }, [isInitialized, engine, setEffectEnabled])

  const updateParameter = useCallback(async (id: string, paramName: string, value: number) => {
    setEffects(prevEffects => {
      // Trouver l'effet et valider la valeur
      const effect = prevEffects.find(e => e.id === id)
      if (!effect) return prevEffects
      
      const pedalModel = pedalLibrary.find(p => p.id === effect.pedalId)
      if (!pedalModel) return prevEffects
      
      const paramDef = pedalModel.parameters[paramName]
      if (!paramDef) return prevEffects
      
      // Clamp la valeur entre min et max
      const clampedValue = Math.max(paramDef.min, Math.min(paramDef.max, value))
    
      // Mettre à jour les paramètres dans le moteur audio
      const updatedParams = { ...effect.parameters, [paramName]: clampedValue }
      updateEffectParametersInAudio(id, updatedParams, isInitialized, engine, updateAudioParameters)
    
      // Synchroniser avec WebSocket
      syncEffectToWebSocket({
        type: 'setParameter',
        effectId: id,
        parameter: paramName,
        value: clampedValue
      })
      
      return prevEffects.map(e => {
        if (e.id === id) {
          return {
            ...e,
            parameters: updatedParams
          }
        }
        return e
      })
    })
  }, [isInitialized, engine, updateAudioParameters, pedalLibrary])

  useEffect(() => {
    if (onAddEffectRef) {
      onAddEffectRef(addEffect)
    }
    if (onClearEffectsRef) {
      onClearEffectsRef(clearEffects)
    }
  }, [onAddEffectRef, onClearEffectsRef, addEffect, clearEffects])

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setEffects((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        
        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Synchroniser avec WebSocket
        syncEffectToWebSocket({
          type: 'moveEffect',
          effectId: active.id,
          fromPosition: oldIndex,
          toPosition: newIndex
        })
        
        return newItems
      })
    }
  }

  // Synchroniser les effets avec le moteur audio au démarrage
  useEffect(() => {
    if (isInitialized && engine && effects.length > 0) {
      // Ajouter tous les effets existants au moteur
      const syncEffects = async () => {
        for (const effect of effects) {
          try {
            await addAudioEffect(effect)
            setEffectEnabled(effect.id, !effect.bypassed)
          } catch (error) {
            // échec silencieux de la synchro d'un effet
          }
        }
      }
      syncEffects()
    }
  }, [isInitialized, engine, addAudioEffect, setEffectEnabled, effects])

  // Synchroniser l'état initial depuis le serveur
  useEffect(() => {
    const ws = WebSocketClient.getInstance()
    
    const handleStateSync = (state: any) => {
      if (state.effects && Array.isArray(state.effects)) {
        // Reconstruire les effets depuis l'état du serveur
        const syncedEffects: Effect[] = state.effects.map((serverEffect: any) => {
          const pedalModel = pedalLibrary.find(p => p.id === serverEffect.pedalId || p.type === serverEffect.type)
          if (!pedalModel) return null
          
          // Initialiser les paramètres avec les valeurs du serveur ou les défauts
          const parameters: Record<string, number> = {}
          Object.entries(pedalModel.parameters).forEach(([name, def]) => {
            parameters[name] = serverEffect.parameters?.[name] ?? def.default
          })
          
          return {
            id: serverEffect.id || `effect-${Date.now()}-${Math.random()}`,
            type: serverEffect.type || pedalModel.type,
            pedalId: serverEffect.pedalId || pedalModel.id,
            name: serverEffect.name || `${pedalModel.brand} ${pedalModel.model}`,
            bypassed: serverEffect.bypassed || false,
            parameters
          }
        }).filter((e: Effect | null): e is Effect => e !== null)
        
        if (syncedEffects.length > 0) {
          setEffects(syncedEffects)
      }
      }
    }
    
    ws.onStateSync = handleStateSync
    
    return () => {
      ws.onStateSync = null
    }
  }, [])


  const handleSaveProfile = () => {
    if (!newProfileName.trim()) {
      alert('Veuillez entrer un nom pour le profil')
      return
    }

    const pedalIds = effects.length > 0 ? effects.map(e => e.pedalId) : currentPedalIds
    if (pedalIds.length === 0 && !currentAmplifierId) {
      alert('Aucune pédale ou ampli à sauvegarder')
      return
    }

    // Récupérer les noms des pédales depuis la bibliothèque
    const pedalNames = pedalIds.map(id => {
      const pedal = pedalLibrary.find(p => p.id === id)
      return pedal ? `${pedal.brand} ${pedal.model}` : id
    })

    // Récupérer le nom de l'ampli
    const ampNames = currentAmplifierId
      ? [
          (() => {
            const amp = amplifierLibrary.find(a => a.id === currentAmplifierId)
            return amp ? `${amp.brand} ${amp.model}` : currentAmplifierId
          })()
        ]
      : []

    const newProfile = {
      name: newProfileName,
      style: newProfileStyle || 'Custom',
      amps: ampNames,
      pedals: pedalNames,
      notes: `Profil sauvegardé le ${formatDateFrench(new Date())}`
    }

    try {
      const saved = localStorage.getItem('webamp_custom_profiles')
      const existingProfiles = saved ? JSON.parse(saved) : []
      const updatedProfiles = [...existingProfiles, newProfile]
      localStorage.setItem('webamp_custom_profiles', JSON.stringify(updatedProfiles))
      setNewProfileName('')
      setNewProfileStyle('')
      setShowSaveProfileModal(false)
      alert('Profil sauvegardé avec succès !')
    } catch (error) {
      alert('Erreur lors de la sauvegarde')
    }
  }

  return (
    <>
      <div className="flex flex-col h-full p-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between mb-4 px-2">
          <CTA
            onClick={() => setShowPedalLibrary(true)}
            icon={<Plus size={20} />}
          >
            Ajouter une pédale
          </CTA>
          <div className="flex items-center gap-2">
            <CTA
              onClick={() => setShowSaveProfileModal(true)}
              icon={<Save size={20} />}
              variant="important"
              title="Sauvegarder le profil actuel"
            />
            {onOpenProfiles && (
              <CTA
                onClick={onOpenProfiles}
                icon={<Users size={20} />}
                variant="icon-only"
                title="Profils"
              />
            )}
            {effects.length > 0 && (
              <CTA
                onClick={() => setShowClearConfirmModal(true)}
                icon={<Trash2 size={20} />}
                variant="icon-only"
                title="Supprimer toutes les pédales"
                className="border-red-500/30 text-red-500/90 hover:bg-red-500/10 hover:border-red-500/60 hover:text-red-500"
              />
            )}
          </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-[#f5f5f5] dark:bg-gray-700 rounded-xl min-h-[400px] shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] pb-6">
          {effects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-black/70 dark:text-white/70 gap-2 p-6">
              <p>Ajoutez des pédales pour commencer</p>
              <p className="text-sm text-black/50 dark:text-white/50 font-medium">Glissez-déposez pour réorganiser</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={effects.map(e => e.id)} strategy={horizontalListSortingStrategy}>
                <div className="flex items-center gap-4 min-h-[400px] px-8 py-6 pb-8">
                  {/* Indicateur d'entrée */}
                  <div className="flex flex-col items-center shrink-0" id="pedalboard-input">
                    <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      peakInput > -60 
                        ? 'bg-green-500/20 border-3 border-green-500' 
                        : peakInput > -70 
                        ? 'bg-orange-500/20 border-3 border-orange-500'
                        : 'bg-red-500/20 border-3 border-red-500'
                    }`}>
                      {peakInput > -60 ? (
                        <PlugZap className="w-8 h-8 text-green-600" />
                      ) : peakInput > -70 ? (
                        <Plug className="w-8 h-8 text-orange-600" />
                      ) : (
                        <Plug className="w-8 h-8 text-red-600" />
                      )}
                      {peakInput > -60 && (
                        <div className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse" />
                      )}
                    </div>
                  </div>
                  
                  {effects.map((effect, index) => (
                    <SortableEffect
                      key={effect.id}
                      effect={effect}
                      onRemove={removeEffect}
                      onToggleBypass={toggleBypass}
                      onUpdateParameter={updateParameter}
                      isLast={index === effects.length - 1}
                    />
                  ))}
                  
                  {/* Indicateur de sortie */}
                  <div className="flex flex-col items-center shrink-0" id="pedalboard-output">
                    <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                      effects.length > 0 && currentAmplifierId
                        ? 'bg-green-500/20 border-3 border-green-500'
                        : 'bg-gray-200/50 border-3 border-gray-400/50'
                    }`}>
                      <Plug className={`w-8 h-8 rotate-180 transition-colors duration-300 ${
                        effects.length > 0 && currentAmplifierId
                          ? 'text-green-600'
                          : 'text-gray-500'
                      }`} />
                      {effects.length > 0 && currentAmplifierId && (
                        <div className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
      
      <PedalLibraryModal
        isOpen={showPedalLibrary}
        onClose={() => setShowPedalLibrary(false)}
        onSelectPedal={addEffect}
        searchQuery={searchQuery}
      />


      <Modal
        isOpen={showSaveProfileModal}
        onClose={() => {
          setShowSaveProfileModal(false)
          setNewProfileName('')
          setNewProfileStyle('')
        }}
        title="Sauvegarder le profil actuel"
        widthClassName="max-w-md"
      >
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black/90 dark:text-white/90">Nom du profil</label>
            <input
              type="text"
              placeholder="Nom du profil"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-black/10 dark:border-white/10 rounded-md text-black/85 dark:text-white/85 text-sm shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,1),0_0_0_2px_rgba(0,0,0,0.05)] dark:focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(70,70,70,0.6),0_0_0_2px_rgba(255,255,255,0.1)] placeholder:text-black/50 dark:placeholder:text-white/50"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-black/90 dark:text-white/90">Style (optionnel)</label>
            <input
              type="text"
              placeholder="Style (optionnel)"
              value={newProfileStyle}
              onChange={(e) => setNewProfileStyle(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-black/10 dark:border-white/10 rounded-md text-black/85 dark:text-white/85 text-sm shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,1),0_0_0_2px_rgba(0,0,0,0.05)] dark:focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(70,70,70,0.6),0_0_0_2px_rgba(255,255,255,0.1)] placeholder:text-black/50 dark:placeholder:text-white/50"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <CTA
              onClick={() => {
                setShowSaveProfileModal(false)
                setNewProfileName('')
                setNewProfileStyle('')
              }}
              variant="secondary"
            >
              Annuler
            </CTA>
            <CTA
              onClick={handleSaveProfile}
              icon={<Save size={16} />}
              variant="important"
            >
              Sauvegarder
            </CTA>
          </div>
          {(effects.length > 0 || currentPedalIds.length > 0) && (
            <p className="text-xs text-black/60 dark:text-white/60 mt-2">
              {effects.length > 0 ? effects.length : currentPedalIds.length} pédale(s) et {currentAmplifierId ? '1 ampli' : 'aucun ampli'} seront sauvegardés
            </p>
          )}
        </div>
      </Modal>

      {/* Modale de confirmation pour supprimer toutes les pédales */}
      <Modal
        isOpen={showClearConfirmModal}
        onClose={() => setShowClearConfirmModal(false)}
        title="Supprimer toutes les pédales ?"
        widthClassName="max-w-md"
      >
        <div className="flex flex-col gap-4 p-6">
          <p className="text-sm text-black/85 dark:text-white/90">
            Êtes-vous sûr de vouloir supprimer toutes les pédales du pedalboard ? Cette action est irréversible.
          </p>
          <div className="flex gap-3 justify-end">
            <CTA
              onClick={() => setShowClearConfirmModal(false)}
              variant="secondary"
            >
              Annuler
            </CTA>
            <CTA
              onClick={() => {
                clearEffects()
                setShowClearConfirmModal(false)
              }}
              variant="primary"
              className="border-red-500/30 text-red-500/90 hover:bg-red-500/10 hover:border-red-500/60 hover:text-red-500"
            >
              Supprimer
            </CTA>
          </div>
        </div>
      </Modal>
    </>
  )
}
