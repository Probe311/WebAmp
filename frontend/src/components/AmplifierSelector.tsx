import { useState, useEffect } from 'react'
import { Plus, Settings, Plug } from 'lucide-react'
import { WebSocketClient } from '../services/websocket'
import { Knob } from './Knob'
import { AmplifierLibraryModal } from './AmplifierLibraryModal'
import { getBrandLogo } from '../utils/brandLogos'
import { CTA } from './CTA'
import { useCatalog } from '../hooks/useCatalog'

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
  const [parameters, setParameters] = useState<Record<string, number>>({})
  const [isPowered, setIsPowered] = useState(true)

  const currentAmp = selected ? amplifierLibrary.find(amp => amp.id === selected) : null

  // Synchroniser le state interne avec la prop externe
  useEffect(() => {
    if (selectedAmplifier && selectedAmplifier !== selected) {
      setSelected(selectedAmplifier)
      if (selectedAmplifier) {
        const ws = WebSocketClient.getInstance()
        if (ws.isConnected()) {
          ws.send({
            type: 'setAmplifier',
            amplifierId: selectedAmplifier
          }).catch((error) => {
            console.error('Erreur set ampli WebSocket:', error)
          })
        }
      }
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
    
    const ws = WebSocketClient.getInstance()
    if (ws.isConnected()) {
      ws.send({
        type: 'setAmplifier',
        amplifierId: ampId
      }).catch((error) => {
        console.error('Erreur set ampli WebSocket:', error)
      })
    }
  }

  const handleParameterChange = (paramName: string, value: number) => {
    if (!selected || !currentAmp) return
    
    // Valider et clamp la valeur
    const paramDef = currentAmp.parameters[paramName as keyof typeof currentAmp.parameters]
    if (!paramDef) return
    
    const clampedValue = Math.max(paramDef.min, Math.min(paramDef.max, value))
    
    setParameters(prev => ({ ...prev, [paramName]: clampedValue }))
    
    const ws = WebSocketClient.getInstance()
    if (ws.isConnected()) {
      ws.send({
        type: 'setAmplifierParameter',
        amplifierId: selected,
        parameter: paramName,
        value: clampedValue
      }).catch((error) => {
        console.error('Erreur envoi paramètre ampli WebSocket:', error)
      })
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
    return 'flex-[0_0_75%] flex justify-start items-center gap-4 flex-nowrap overflow-x-auto py-2'
  }

  return (
    <>
      <div className="flex flex-col h-full w-full p-0 bg-transparent overflow-hidden">
        <div 
          className={`w-full h-full bg-white dark:bg-gray-800 ${getBorderStyle()} rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.9),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(40,40,40,0.5),0_0_0_1px_rgba(60,60,60,0.8)] flex flex-col transition-all duration-300 overflow-hidden`}
          style={{ borderColor: currentAmp.color }}
        >
          {/* Ligne 1 : Potentiomètres de réglages (75%) + Master Volume + Interrupteur (25%) */}
          <div 
            className="flex items-center p-6 border-b-2 border-black/20 dark:border-white/20 gap-4 rounded-t-l overflow-hidden" 
            style={{ 
              overflow: 'visible', 
              minHeight: '140px',
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
                <div key={paramName} className="flex flex-col items-center flex-shrink-0" style={{ minWidth: '80px' }}>
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
            
            <div className="flex-[0_0_25%] flex items-center gap-6 justify-center">
              {currentAmp.parameters.master && (
                <div className="flex flex-col items-center">
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
              
              <div className="flex justify-center items-center">
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
                        console.error('Erreur set power ampli WebSocket:', error)
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
              className="relative flex-1 h-full flex items-center justify-start pl-12 overflow-hidden rounded-2xl"
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
              <div className="relative z-[1] flex items-center justify-start h-full">
                {getBrandLogo(currentAmp.brand) ? (
                  <img 
                    src={getBrandLogo(currentAmp.brand)} 
                    alt={currentAmp.brand}
                    className={`h-[100px] w-auto max-w-[400px] opacity-95 transition-all duration-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.7),0_0_40px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.5)] hover:drop-shadow-[0_4px_16px_rgba(0,0,0,0.8),0_0_50px_rgba(255,255,255,0.5),0_2px_6px_rgba(0,0,0,0.6)] hover:scale-102 hover:opacity-100 ${
                      currentAmp.brand === 'Marshall' ? 'brightness-0 invert opacity-90' : ''
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      const fallback = target.nextElementSibling as HTMLElement
                      if (fallback) fallback.style.display = 'block'
                    }}
                  />
                ) : null}
                <div 
                  className={`text-[4.5rem] font-extrabold tracking-[8px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.7),0_0_40px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.5)] font-['Arial','Helvetica',sans-serif] uppercase transition-all duration-300 ${
                    currentAmp.brand === 'Marshall' ? 'text-white/85' : 'text-white/98'
                  }`}
                  style={{ display: getBrandLogo(currentAmp.brand) ? 'none' : 'block' }}
                >
                  {currentAmp.brand}
                </div>
              </div>
            </div>
            
            <CTA
              variant="icon-only"
              icon={<Settings size={20} />}
              onClick={() => setShowLibrary(true)}
              title="Changer d'ampli"
              className="absolute bottom-8 right-8 w-[52px] h-[52px] z-10"
            />
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
