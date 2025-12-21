import { useState } from 'react'
import { Sparkles, Loader2, X } from 'lucide-react'
import { Modal } from '../Modal'
import { CTA } from '../CTA'
import { generateToneFromDescription, EffectModule } from '../../services/ai'
import { useToast } from '../notifications/ToastProvider'
import { useFeatureFlags } from '../../hooks/useFeatureFlags'

interface AIToneAssistantProps {
  onApplyEffects: (effects: EffectModule[]) => void
  currentEffects?: Array<{
    id: string
    type: string
    enabled: boolean
  }>
  instrument?: 'guitar' | 'bass' | 'other'
  renderAsButton?: boolean
}

export function AIToneAssistant({
  onApplyEffects,
  currentEffects,
  instrument = 'guitar',
  renderAsButton = false,
}: AIToneAssistantProps) {
  const { isEnabled, getFlag } = useFeatureFlags()
  const [isOpen, setIsOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { showToast } = useToast()

  // Vérifier si les fonctions IA sont activées
  const aiFeaturesFlag = getFlag('ai_features')
  const aiFunctionsFlag = getFlag('ai_functions')
  const aiToneFlag = getFlag('ai_tone_assistant')
  
  // Si un flag global existe et est désactivé, désactiver toutes les fonctions IA
  if ((aiFeaturesFlag && !aiFeaturesFlag.enabled) || (aiFunctionsFlag && !aiFunctionsFlag.enabled)) {
    return null
  }
  
  // Si le flag spécifique existe, utiliser son état
  // Sinon, activer par défaut (rétrocompatibilité)
  if (aiToneFlag && !aiToneFlag.enabled) {
    return null
  }

  const handleGenerate = async () => {
    if (!description.trim()) {
      showToast({
        variant: 'error',
        message: 'Veuillez entrer une description du ton désiré'
      })
      return
    }

    setIsGenerating(true)
    try {
      const result = await generateToneFromDescription(description, {
        instrument,
        currentEffects,
      })

      if (result.effects && result.effects.length > 0) {
        onApplyEffects(result.effects)
        setIsOpen(false)
        setDescription('')
        showToast({
          variant: 'success',
          message: `Chaîne d'effets générée avec ${result.effects.length} effets !`
        })
      } else {
        showToast({
          variant: 'error',
          message: "Aucun effet généré. Essayez une description plus précise."
        })
      }
    } catch (error) {
      console.error('Erreur génération ton IA:', error)
      showToast({
        variant: 'error',
        message: error instanceof Error
          ? error.message
          : 'Erreur lors de la génération du ton'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {/* Bouton CTA ou flottant selon renderAsButton */}
      {renderAsButton ? (
        <CTA
          onClick={() => setIsOpen(true)}
          icon={<Sparkles size={20} />}
          variant="ai-tone"
          title="AI Tone Assistant - Générer un ton avec l'IA"
        >
          AI Tone
        </CTA>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[#d23cfb] to-[#fb923c] shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group hover:scale-110 hover:from-[#c02ae8] hover:to-[#f07a2a]"
          title="AI Tone Assistant - Générer un ton avec l'IA"
          aria-label="Ouvrir l'assistant IA pour générer un ton"
        >
          <Sparkles className="w-7 h-7 text-white group-hover:rotate-12 transition-transform" />
          <div className="absolute inset-0 rounded-full bg-[#d23cfb]/30 animate-pulse" />
        </button>
      )}

      {/* Modale */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setDescription('')
        }}
        title="AI Tone Assistant"
        className="max-w-2xl"
        bodyClassName="p-6"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-1.5">
                Générez une chaîne d'effets complète avec l'IA
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                Décrivez le ton que vous souhaitez (ex: "Son clean Fender avec un peu de reverb",
                "Distortion metal moderne", "Overdrive blues vintage") et l'IA créera une chaîne
                d'effets optimisée pour vous.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="tone-description"
              className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2.5"
            >
              Description du ton désiré
            </label>
            <textarea
              id="tone-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Son clean Fender avec un peu de reverb et un léger delay..."
              className="w-full h-32 px-4 py-3 rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              disabled={isGenerating}
            />
          </div>

          {isGenerating && (
            <div className="flex items-center gap-3 p-3.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Loader2 className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />
              <p className="text-sm text-amber-900 dark:text-amber-100">
                Génération du ton en cours...
              </p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-5 mt-2 border-t border-black/10 dark:border-white/10">
            <CTA
              variant="secondary"
              onClick={() => {
                setIsOpen(false)
                setDescription('')
              }}
              disabled={isGenerating}
            >
              Annuler
            </CTA>
            <CTA
              variant="ai-tone"
              onClick={handleGenerate}
              disabled={isGenerating || !description.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Génération...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer le ton
                </>
              )}
            </CTA>
          </div>
        </div>
      </Modal>
    </>
  )
}

