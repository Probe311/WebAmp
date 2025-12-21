import { useState } from 'react'
import { Sparkles, Loader2, Music } from 'lucide-react'
import { Modal } from '../Modal'
import { CTA } from '../CTA'
import { generateBeatFromDescription, BeatPattern } from '../../services/ai'
import { useToast } from '../notifications/ToastProvider'
import { useFeatureFlags } from '../../hooks/useFeatureFlags'

interface AIBeatArchitectProps {
  onApplyPattern: (pattern: BeatPattern) => void
  currentTempo?: number
  renderAsButton?: boolean
}

export function AIBeatArchitect({
  onApplyPattern,
  currentTempo = 120,
  renderAsButton = false,
}: AIBeatArchitectProps) {
  const { isEnabled, getFlag } = useFeatureFlags()
  const [isOpen, setIsOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const { showToast } = useToast()

  // Vérifier si les fonctions IA sont activées
  const aiFeaturesFlag = getFlag('ai_features')
  const aiFunctionsFlag = getFlag('ai_functions')
  const aiBeatFlag = getFlag('ai_beat_architect')
  
  // Si un flag global existe et est désactivé, désactiver toutes les fonctions IA
  if ((aiFeaturesFlag && !aiFeaturesFlag.enabled) || (aiFunctionsFlag && !aiFunctionsFlag.enabled)) {
    return null
  }
  
  // Si le flag spécifique existe, utiliser son état
  // Sinon, activer par défaut (rétrocompatibilité)
  if (aiBeatFlag && !aiBeatFlag.enabled) {
    return null
  }

  const handleGenerate = async () => {
    if (!description.trim()) {
      showToast({
        variant: 'error',
        message: 'Veuillez entrer une description du style de rythme'
      })
      return
    }

    setIsGenerating(true)
    try {
      const pattern = await generateBeatFromDescription(description, {
        tempo: currentTempo,
        timeSignature: '4/4',
        complexity: 'medium',
      })

      if (pattern.steps && pattern.steps.length > 0) {
        onApplyPattern(pattern)
        setIsOpen(false)
        setDescription('')
        showToast({
          variant: 'success',
          message: `Pattern "${pattern.name}" généré avec ${pattern.steps.length} steps !`
        })
      } else {
        showToast({
          variant: 'error',
          message: "Aucun pattern généré. Essayez une description plus précise."
        })
      }
    } catch (error) {
      console.error('Erreur génération pattern IA:', error)
      showToast({
        variant: 'error',
        message: error instanceof Error
          ? error.message
          : 'Erreur lors de la génération du pattern'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {/* Bouton pour ouvrir la modale */}
      <CTA
        variant={renderAsButton ? "ai-beat" : "secondary"}
        onClick={() => setIsOpen(true)}
        icon={<Sparkles size={18} />}
        title="AI Beat Architect - Générer un rythme avec l'IA"
      >
        {renderAsButton ? 'AI Beat' : 'AI Beat Architect'}
      </CTA>

      {/* Modale */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setDescription('')
        }}
        title="AI Beat Architect"
        className="max-w-2xl"
        bodyClassName="p-6"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <Music className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-900 dark:text-amber-100 font-medium mb-1.5">
                Générez un pattern de batterie avec l'IA
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                Décrivez le style de rythme souhaité (ex: "Groove funk à la James Brown",
                "Beat rock énergique", "Pattern jazz swing") et l'IA créera une grille de
                séquençage sur 16 pas prête à être jouée.
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="beat-description"
              className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2.5"
            >
              Description du style de rythme
            </label>
            <textarea
              id="beat-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Groove funk à la James Brown avec des accents sur le kick..."
              className="w-full h-32 px-4 py-3 rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-800 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              disabled={isGenerating}
            />
          </div>

          {isGenerating && (
            <div className="flex items-center gap-3 p-3.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <Loader2 className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />
              <p className="text-sm text-amber-900 dark:text-amber-100">
                Génération du pattern en cours...
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
              variant="ai-beat"
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
                  Générer le pattern
                </>
              )}
            </CTA>
          </div>
        </div>
      </Modal>
    </>
  )
}

