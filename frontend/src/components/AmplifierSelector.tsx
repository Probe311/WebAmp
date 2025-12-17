import { useState, useEffect } from 'react'
import { Plus, Settings, Plug, Brain } from 'lucide-react'
import { Knob } from './Knob'
import { AmplifierLibraryModal } from './AmplifierLibraryModal'
import { getBrandLogo } from '../utils/brandLogos'
import { CTA } from './CTA'
import { useCatalog } from '../hooks/useCatalog'
import { WebSocketClient } from '../services/websocket'
import { type NAMModel, namLoader } from '../utils/namLoader'
import { Modal } from './Modal'
import { Loader } from './Loader'

interface AmplifierSelectorProps {
  selectedAmplifier?: string | null
  onAmplifierChange?: (amplifierId: string) => void
  onParametersChange?: (parameters: Record<string, number>) => void
  hasPedals?: boolean
}

export function AmplifierSelector({ selectedAmplifier, onAmplifierChange, onParametersChange, hasPedals = false }: AmplifierSelectorProps) {
  const { amplifiers: amplifierLibrary } = useCatalog()
  const [selected, setSelected] = useState<string | null>(selectedAmplifier || null)
  const [showLibrary, setShowLibrary] = useState(false)
  const [showNamLibrary, setShowNamLibrary] = useState(false)
  const [parameters, setParameters] = useState<Record<string, number>>({})
  const [isPowered, setIsPowered] = useState(true)
  const [namModel, setNamModel] = useState<NAMModel | null>(null)
  const [namLibraryLoading, setNamLibraryLoading] = useState(false)
  const [namLibraryError, setNamLibraryError] = useState<string | null>(null)
  const [namLibrary, setNamLibrary] = useState<import('../utils/namLoader').NAMModelLibrary | null>(null)

  const currentAmp = selected ? amplifierLibrary.find(amp => amp.id === selected) : null

  // Synchroniser le state interne avec la prop externe
  useEffect(() => {
    if (selectedAmplifier && selectedAmplifier !== selected) {
      setSelected(selectedAmplifier)
    } else if (!selectedAmplifier && selected) {
      setSelected(null)
    }
  }, [selectedAmplifier])

  // Initialiser les paramètres quand un ampli est sélectionné
  useEffect(() => {
    if (currentAmp) {
      const initialParams: Record<string, number> = {}
      Object.entries(currentAmp.parameters).forEach(([name, def]) => {
        if (def) {
        initialParams[name] = def.default
        }
      })
      setParameters(initialParams)
      setIsPowered(true) // Réinitialiser le power à ON quand on change d'ampli
      if (onParametersChange) {
        onParametersChange(initialParams)
      }
    }
  }, [selected, currentAmp, onParametersChange])

  // Notifier les changements de paramètres
  useEffect(() => {
    if (onParametersChange && Object.keys(parameters).length > 0) {
      onParametersChange(parameters)
    }
  }, [parameters, onParametersChange])

  const handleSelectAmplifier = (ampId: string) => {
    setSelected(ampId)
    if (onAmplifierChange) {
      onAmplifierChange(ampId)
    }
  }

  const handleParameterChange = (paramName: string, value: number) => {
    if (!selected || !currentAmp) return
    
    // Valider et clamp la valeur
    const paramDef = currentAmp.parameters[paramName as keyof typeof currentAmp.parameters]
    if (!paramDef) return
    
    const clampedValue = Math.max(paramDef.min, Math.min(paramDef.max, value))
    
    setParameters(prev => ({ ...prev, [paramName]: clampedValue }))
  }

  const handleLoadNAMModel = async (file: File) => {
    try {
      const model = await namLoader.loadFromFile(file)
      setNamModel(model)
    } catch (error) {
      // échec silencieux du chargement du modèle NAM
    }
  }

  const handleOpenNamLibrary = async () => {
    setShowNamLibrary(true)
    if (namLibrary || namLibraryLoading) return

    try {
      setNamLibraryLoading(true)
      setNamLibraryError(null)
      // Bibliothèque locale pré‑chargée
      const library = await namLoader.loadLibrary('/src/data/nam-library.json')
      setNamLibrary(library)
    } catch (error) {
      setNamLibraryError(error instanceof Error ? error.message : 'Erreur inconnue lors du chargement de la bibliothèque NAM')
    } finally {
      setNamLibraryLoading(false)
    }
  }

  if (!currentAmp) {
    return (
      <>
        <div className="flex flex-col h-full w-full p-0 bg-transparent overflow-hidden">
          <div className="flex items-center justify-center p-8">
            <div className="text-center text-black/70 dark:text-white/70">
              <p className="mb-6 text-base font-medium">Aucun amplificateur sélectionné</p>
              <CTA
                onClick={() => setShowLibrary(true)}
                icon={<Plus size={24} />}
              >
                Ajouter un ampli
              </CTA>
            </div>
          </div>
        </div>
        
        <AmplifierLibraryModal
          isOpen={showLibrary}
          onClose={() => setShowLibrary(false)}
          onSelectAmplifier={handleSelectAmplifier}
          selectedAmplifier={selected || undefined}
        />
      </>
    )
  }

  // Séparer les paramètres : réglages (sans master) et master + power
  const regularParams = Object.entries(currentAmp.parameters).filter(([name]) => name !== 'master')
  // Créer un paramètre master par défaut s'il n'existe pas
  const masterParam = currentAmp.parameters.master || { min: 0, max: 10, default: 5 }

  // Fonction pour générer le pattern de grille selon le style
  const getGrillePattern = () => {
    const { grillePattern } = currentAmp.uiStyle
    switch (grillePattern) {
      case 'horizontal':
        return `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px)
        `
      case 'vertical':
        return `
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px)
        `
      case 'grid':
        return `
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)
        `
      case 'diagonal':
        return `
          repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.12) 2px, rgba(0, 0, 0, 0.12) 4px),
          repeating-linear-gradient(-45deg, transparent, transparent 2px, rgba(0, 0, 0, 0.12) 2px, rgba(0, 0, 0, 0.12) 4px)
        `
      case 'none':
      default:
        return 'none'
    }
  }

  // Bordure harmonisée avec les pédales : simple trait uniforme
  const getBorderStyle = () => 'border-[3px]'

  // Fonction pour obtenir les classes de layout des knobs - toujours une seule ligne avec max 10
  const getKnobLayoutClasses = () => {
    return 'flex-1 flex justify-start items-center gap-4 flex-nowrap overflow-x-auto custom-scrollbar py-2 min-w-0 max-w-full'
  }

  return (
    <>
      <div className="flex flex-col h-full w-full p-0 bg-transparent overflow-hidden">
        <div 
          className={`w-full h-full bg-white dark:bg-gray-800 ${getBorderStyle()} rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(60,60,60,0.5),0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col transition-all duration-300 overflow-hidden`}
          style={{ borderColor: currentAmp.color }}
        >
          {/* Ligne 1 : Potentiomètres de réglages (75%) + Master Volume + Interrupteur (25%) */}
          <div 
            className="flex items-center p-6 border-b-2 border-black/20 dark:border-white/20 gap-4 rounded-t-l overflow-hidden min-h-[140px] min-w-0 max-w-full" 
            style={{ 
              background: currentAmp.brand === 'Marshall' 
                ? 'linear-gradient(135deg, #d4af37 0%, #b8941f 50%, #9d7a1a 100%)'
                : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent)'
            }}
          >
            {/* Entrée Jack de l'ampli */}
            <div className="flex flex-col items-center shrink-0" id="amplifier-input">
              <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                hasPedals && selected
                  ? 'bg-green-500/20 border-3 border-green-500'
                  : 'bg-gray-200/50 border-3 border-gray-400/50'
              }`}>
                <Plug className={`w-8 h-8 transition-colors duration-300 ${
                  hasPedals && selected
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`} />
                {hasPedals && selected && (
                  <div className="absolute inset-0 rounded-full bg-green-500/30 animate-pulse" />
                )}
              </div>
            </div>
            
            <div className={getKnobLayoutClasses()}>
              {regularParams.slice(0, 10).map(([paramName, paramDef]) => (
                <div key={paramName} className="flex flex-col items-center flex-shrink-0" style={{ minWidth: '80px', maxWidth: '100px' }}>
                  <Knob
                    value={parameters[paramName] ?? paramDef.default}
                    min={paramDef.min}
                    max={paramDef.max}
                    label={paramName.toUpperCase()}
                    onChange={(value) => handleParameterChange(paramName, value)}
                    color={currentAmp.knobColor}
                    knobBaseColor={currentAmp.knobBaseColor}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4 justify-center shrink-0 min-w-0 max-w-full overflow-hidden">
              {currentAmp.parameters.master && (
                <div className="flex flex-col items-center shrink-0">
                  <Knob
                    value={parameters.master ?? masterParam.default}
                    min={masterParam.min}
                    max={masterParam.max}
                    label="MASTER VOLUME"
                    onChange={(value) => handleParameterChange('master', value)}
                    color={currentAmp.knobColor}
                    knobBaseColor={currentAmp.knobBaseColor}
                  />
                </div>
              )}
              
              <div className="flex justify-center items-center shrink-0">
                <div 
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => {
                    setIsPowered(!isPowered)
                    const ws = WebSocketClient.getInstance()
                    if (ws.isConnected() && selected) {
                      ws.send({
                        type: 'setAmplifierPower',
                        amplifierId: selected,
                        powered: !isPowered
                      }).catch((error) => {
                        // échec silencieux côté WebSocket
                      })
                    }
                  }}
                >
                  <div className={`w-10 h-5 rounded-[10px] relative shadow-[0_0_10px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.2)] transition-all duration-300 ${
                    isPowered ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                  }`}>
                    <div className={`absolute w-4 h-4 bg-white rounded-full top-0.5 shadow-[0_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300 ${
                      isPowered ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </div>
                  <label className="text-[0.625rem] text-black/70 dark:text-white/70 uppercase tracking-[1px] font-medium">POWER</label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ligne 2 : Grille avec logo à gauche et bouton paramètre en bas à droite */}
          <div 
            className="flex-1 relative flex items-center justify-start p-8 min-h-[200px] rounded-b-l overflow-hidden"
            style={{ backgroundColor: currentAmp.brand === 'Marshall' ? '#161616' : undefined }}
          >
            <div 
              className="relative flex-1 h-full flex items-center justify-start pl-8 pr-8 overflow-hidden rounded-2xl min-w-0"
              style={{
                background: `linear-gradient(to bottom right, ${currentAmp.uiStyle.grilleGradient[0]}, ${currentAmp.uiStyle.grilleGradient[1]})`
              }}
            >
              <div 
                className="absolute inset-0" 
                style={{
                  backgroundImage: getGrillePattern(),
                  opacity: 0.55
                }}
              />
              {currentAmp.brand === 'Marshall' && (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity: 0.18,
                      backgroundImage: `
                        repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 6px),
                        repeating-linear-gradient(-45deg, rgba(0,0,0,0.2) 0, rgba(0,0,0,0.2) 1px, transparent 1px, transparent 6px)
                      `,
                      backgroundSize: '12px 12px'
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      opacity: 0.1,
                      background: `
                        radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 45%),
                        radial-gradient(circle at 80% 60%, rgba(0,0,0,0.25) 0%, transparent 50%)
                      `
                    }}
                  />
                </>
              )}
              <div className="relative z-[1] flex items-center justify-start h-full min-w-0 max-w-full">
                {getBrandLogo(currentAmp.brand) ? (
                  <img 
                    src={getBrandLogo(currentAmp.brand)} 
                    alt={currentAmp.brand}
                    className={`h-[100px] w-auto opacity-95 transition-all duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.7),0_0_40px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_4px_16px_rgba(0,0,0,0.8),0_0_50px_rgba(255,255,255,0.5),0_2px_6px_rgba(0,0,0,0.6)] hover:scale-102 hover:opacity-100 ${
                      currentAmp.brand === 'Marshall' ? 'brightness-0 invert opacity-90' : ''
                    }`}
                    style={{ maxWidth: 'min(400px, calc(100% - 120px))' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'block'
                    }}
                  />
                ) : null}
                <div 
                  className={`text-[4.5rem] font-extrabold tracking-[8px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.7),0_0_40px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.5)] font-['Arial','Helvetica',sans-serif] uppercase transition-all duration-300 truncate max-w-full ${
                    currentAmp.brand === 'Marshall' ? 'text-white/85' : 'text-white/98'
                  }`}
                  style={{ display: getBrandLogo(currentAmp.brand) ? 'none' : 'block' }}
                >
                  {currentAmp.brand}
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8 flex gap-2 z-10 shrink-0">
              {/* Bouton pour charger un modèle NAM depuis un fichier local */}
              <input
                type="file"
                accept=".nam"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleLoadNAMModel(file)
                  }
                }}
                className="hidden"
                id="nam-file-input"
              />
              <label htmlFor="nam-file-input">
                <CTA
                  variant="icon-only"
                  icon={<Brain size={20} />}
                  title="Charger un modèle NAM"
                  className="w-[52px] h-[52px]"
                />
              </label>

              {/* Bouton pour ouvrir la bibliothèque NAM pré‑chargée */}
              <CTA
                variant="icon-only"
                icon={<Brain size={20} />}
                onClick={handleOpenNamLibrary}
                title="Bibliothèque NAM"
                className="w-[52px] h-[52px]"
              />

              <CTA
                variant="icon-only"
                icon={<Settings size={20} />}
                onClick={() => setShowLibrary(true)}
                title="Changer d'ampli"
                className="w-[52px] h-[52px]"
              />
            </div>

            {/* Affichage du modèle NAM */}
            {namModel && (
              <div className="absolute top-4 right-4 z-10 bg-black/70 dark:bg-gray-900/90 rounded-lg p-2 text-xs text-white/90 max-w-xs">
                <div className="flex items-center gap-1 mb-1">
                  <Brain size={12} />
                  <span className="font-semibold">Modèle NAM</span>
                </div>
                <div className="text-white/70">{namModel.metadata.name}</div>
                {namModel.metadata.author && (
                  <div className="text-white/50">Par {namModel.metadata.author}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <AmplifierLibraryModal
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        onSelectAmplifier={handleSelectAmplifier}
        selectedAmplifier={selected || undefined}
      />

      {/* Modal de bibliothèque NAM pré‑chargée */}
      <Modal
        isOpen={showNamLibrary}
        onClose={() => setShowNamLibrary(false)}
        title="Bibliothèque de modèles NAM"
        className="flex flex-col"
        bodyClassName="flex-1 overflow-y-auto custom-scrollbar p-4"
      >
        {namLibraryLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader label="Chargement de la bibliothèque NAM..." />
          </div>
        )}

        {namLibraryError && !namLibraryLoading && (
          <div className="text-sm text-red-600 dark:text-red-400 py-4">
            {namLibraryError}
          </div>
        )}

        {!namLibraryLoading && namLibrary && (
          <div className="space-y-4">
            {Object.entries(namLibrary.categories).map(([category, models]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold uppercase tracking-[1px] text-black/60 dark:text-white/60 mb-2">
                  {category === 'amp' ? 'Amplis' : category === 'pedal' ? 'Pédales' : 'Autres modèles'}
                </h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
                  {models.map((model) => (
                    <button
                      key={model.fileName}
                      onClick={async () => {
                        setNamModel(model)
                        setShowNamLibrary(false)
                      }}
                      className="w-full text-left bg-white dark:bg-gray-800 border border-black/10 dark:border-white/10 rounded-lg p-3 hover:shadow-md dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.7)] transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-black/85 dark:text-white/90 truncate">
                          {model.metadata.name}
                        </span>
                      </div>
                      {model.metadata.author && (
                        <div className="text-[0.7rem] text-black/50 dark:text-white/50 mb-1 truncate">
                          par {model.metadata.author}
                        </div>
                      )}
                      {model.metadata.description && (
                        <div className="text-[0.7rem] text-black/60 dark:text-white/60 line-clamp-2">
                          {model.metadata.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  )
}
