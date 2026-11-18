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
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'
import { getAmpToneStack } from '../audio/ampToneStack'
import { AmpHeadView } from '../equipment/AmpHeadView'
import { useToast } from './notifications/ToastProvider'

/** ArrayBuffer → base64 (chunks : évite le dépassement d'arguments de String.fromCharCode). */
const toBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  let binary = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

interface AmplifierSelectorProps {
  selectedAmplifier?: string | null
  onAmplifierChange?: (amplifierId: string) => void
  onParametersChange?: (parameters: Record<string, number>) => void
  hasPedals?: boolean
}

export function AmplifierSelector({ selectedAmplifier, onAmplifierChange, onParametersChange, hasPedals = false }: AmplifierSelectorProps) {
  const { amplifiers: amplifierLibrary } = useCatalog()
  const { engine, start } = usePedalboardEngine()
  const [stackReady, setStackReady] = useState(false)
  const [selected, setSelected] = useState<string | null>(selectedAmplifier || null)
  const [showLibrary, setShowLibrary] = useState(false)
  const [showNamLibrary, setShowNamLibrary] = useState(false)
  const [parameters, setParameters] = useState<Record<string, number>>({})
  const [isPowered, setIsPowered] = useState(true)
  const [namModel, setNamModel] = useState<NAMModel | null>(null)
  const [namLibraryLoading, setNamLibraryLoading] = useState(false)
  const [namLibraryError, setNamLibraryError] = useState<string | null>(null)
  const [namLibrary, setNamLibrary] = useState<import('../utils/namLoader').NAMModelLibrary | null>(null)
  const [namStatus, setNamStatus] = useState<'idle' | 'loading' | 'active' | 'error'>('idle')
  const { showToast } = useToast()

  const currentAmp = selected ? amplifierLibrary.find(amp => amp.id === selected) : null

  useEffect(() => {
    let cancelled = false
    const boot = async () => {
      try {
        await start()
        const ctx = engine.getAudioContext()
        const out = engine.getOutput()
        if (!ctx || !out || cancelled) return
        // Insertion de la chaîne si la session ne l'a pas déjà fait (aucun mixer ouvert)
        const stack = getAmpToneStack(ctx)
        if (!stack.isAttached()) stack.attach(out, ctx.destination)
        if (!cancelled) setStackReady(true)
      } catch {
        /* ignore */
      }
    }
    void boot()
    return () => {
      cancelled = true
    }
  }, [engine, start])

  useEffect(() => {
    const ctx = engine.getAudioContext()
    if (!ctx || !stackReady) return
    getAmpToneStack(ctx).applyParameters(parameters, isPowered)
  }, [engine, parameters, isPowered, stackReady])

  /** Le helper ne voit pas le disque du navigateur : on envoie le .nam en base64. */
  const loadNamIntoHelper = async (model: NAMModel) => {
    const ws = WebSocketClient.getInstance()
    if (!ws.isConnected()) {
      setNamStatus('idle')
      showToast({
        title: 'NAM',
        message: 'Native Helper non connecté : tone stack navigateur actif, DSP NAM indisponible.',
        variant: 'warning',
      })
      return
    }
    try {
      setNamStatus('loading')
      const data = toBase64(model.modelData)
      // Transfert + décodage + parse côté helper : marge proportionnelle à la taille
      const ackTimeout = Math.min(120000, 10000 + Math.ceil(data.length / (1024 * 1024)) * 2000)
      // loadNAMModelFromMemory active déjà le modèle côté pipeline
      await ws.send({ type: 'loadNAMModel', fileName: model.fileName, data }, true, ackTimeout)
      setNamStatus('active')
      // Honnête : le helper traite SON pipeline, pas le signal Web Audio du navigateur.
      showToast({
        title: 'NAM accepté par le helper',
        message: `« ${model.metadata.name} » est chargé côté helper, mais le son du navigateur ne passe pas par lui : le tone stack reste actif.`,
        variant: 'info',
      })
    } catch (error) {
      setNamStatus('error')
      showToast({
        title: 'NAM refusé par le helper',
        message: error instanceof Error ? error.message : 'Échec du chargement du modèle NAM.',
        variant: 'error',
      })
    }
  }

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
    onAmplifierChange?.(ampId)
    const ws = WebSocketClient.getInstance()
    if (ws.isConnected()) {
      void ws.send({ type: 'setAmplifier', amplifierId: ampId }).catch(() => {})
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
      void ws
        .send({
          type: 'setAmplifierParameter',
          amplifierId: selected,
          parameter: paramName,
          value: clampedValue,
        })
        .catch(() => {})
    }
  }

  const handleLoadNAMModel = async (file: File) => {
    try {
      const model = await namLoader.loadFromFile(file)
      setNamModel(model)
      await loadNamIntoHelper(model)
    } catch (error) {
      showToast({
        title: 'NAM',
        message: error instanceof Error ? error.message : 'Fichier NAM illisible.',
        variant: 'error',
      })
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
      if (library.models.length === 0) {
        setNamLibraryError('Aucun modèle NAM disponible (fichiers /nam manquants).')
      }
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
            <div className="text-center text-[color:var(--neu-text-muted)]">
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

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-transparent p-0">
        <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[color:var(--neu-bg)]">
          <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden px-3 pb-3 pt-2">
            {/* Softube-style : CTA carré inset, pas collé à l'entête ni à l'ampli */}
            <div className="mb-3 flex shrink-0 items-center justify-end">
              <CTA
                variant="icon-only"
                icon={<Settings size={18} />}
                onClick={() => setShowLibrary(true)}
                title="Changer d'ampli"
              />
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col justify-center">
              <AmpHeadView
                ampId={selected ?? ''}
                values={parameters}
                isPowered={isPowered}
                onParameterChange={handleParameterChange}
                onPowerChange={(next) => {
                  setIsPowered(next)
                  const ws = WebSocketClient.getInstance()
                  if (ws.isConnected() && selected) {
                    void ws
                      .send({ type: 'setAmplifierPower', amplifierId: selected, powered: next })
                      .catch(() => {})
                  }
                }}
                maxWidth={760}
              />

              {namModel && (
                <div className="neu-flat absolute bottom-2 left-2 z-10 max-w-[12rem] rounded-xl p-1.5 text-[0.65rem] text-[color:var(--neu-text)]">
                  <div className="mb-0.5 flex items-center gap-1">
                    <Brain size={10} />
                    <span className="font-semibold">NAM</span>
                  </div>
                  <div className="truncate text-[color:var(--neu-text-muted)]">{namModel.metadata.name}</div>
                  <div className={'mt-0.5 text-[0.6rem] ' + (namStatus === 'error' ? 'text-rose-500' : 'text-[color:var(--neu-accent)]')}>
                    {namStatus === 'loading' && 'Chargement helper…'}
                    {namStatus === 'active' && 'Helper OK (hors signal navigateur)'}
                    {namStatus === 'error' && 'Échec helper — tone stack'}
                    {namStatus === 'idle' && 'Tone stack navigateur'}
                  </div>
                </div>
              )}
            </div>
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
            <Loader text="Chargement de la bibliothèque NAM..." />
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
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-[1px] text-[color:var(--neu-text-muted)]">
                  {category === 'amp' ? 'Amplis' : category === 'pedal' ? 'Pédales' : 'Autres modèles'}
                </h3>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
                  {models.map((model) => (
                    <button
                      key={model.fileName}
                      onClick={() => {
                        setNamModel(model)
                        void loadNamIntoHelper(model)
                        setShowNamLibrary(false)
                      }}
                      className="neu-flat w-full cursor-pointer rounded-2xl border border-[color:var(--neu-edge)] p-3 text-left transition-all duration-200 active:neu-pressed"
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <span className="truncate text-sm font-semibold text-[color:var(--neu-text)]">
                          {model.metadata.name}
                        </span>
                      </div>
                      {model.metadata.author && (
                        <div className="mb-1 truncate text-[0.7rem] text-[color:var(--neu-text-faint)]">
                          par {model.metadata.author}
                        </div>
                      )}
                      {model.metadata.description && (
                        <div className="line-clamp-2 text-[0.7rem] text-[color:var(--neu-text-muted)]">
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
