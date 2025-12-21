import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle2, PlayCircle } from 'lucide-react'
import ConfettiBoom from 'react-confetti-boom'
import { Tutorial, TutorialStep } from '../../data/tutorials'
import { Block } from '../Block'
import { useToast } from '../notifications/ToastProvider'
import { TutorialContentRenderer } from './TutorialContentRenderer'
import { CourseSidebar } from './CourseSidebar'
import { useLMS } from '../../hooks/useLMS'
import { lmsService } from '../../services/lms'

interface TutorialViewerProps {
  tutorial: Tutorial
  onBack: () => void
  onComplete?: (tutorialId: string) => void
  onLoadPreset?: (presetId: string) => void
  onAddPedal?: (pedalId: string) => void
}

export function TutorialViewer({ 
  tutorial, 
  onBack, 
  onComplete,
  onLoadPreset,
  onAddPedal
}: TutorialViewerProps) {
  const { showToast } = useToast()
  const { userId } = useLMS()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [isCompleted, setIsCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null)
  const [stepEnterTime, setStepEnterTime] = useState<number>(() => Date.now())

  // Charger la progression depuis Supabase ou localStorage (fallback)
  useEffect(() => {
    const loadProgress = async () => {
      if (userId) {
        // Charger depuis Supabase
        const progress = await lmsService.getUserProgress(userId, tutorial.id)
        const courseProgress = progress.find(p => !p.lesson_id)
        
        if (courseProgress?.is_completed) {
          setIsCompleted(true)
          // Ne pas afficher l'écran de célébration au chargement, seulement lors de la complétion
          // setShowCelebration(true)
          // Si le cours est complété, marquer toutes les sections comme complétées pour navigation libre
          const steps = tutorial.content?.steps || []
          const allCompleted = new Set<number>()
          steps.forEach((_step, index) => {
            allCompleted.add(index)
          })
          setCompletedSteps(allCompleted)
          // Par défaut, commencer à la première section
          setCurrentStepIndex(0)
        } else {
          // Trouver la dernière leçon complétée
          const completedLessons = progress.filter(p => p.is_completed && p.lesson_id)
          if (completedLessons.length > 0) {
            const lastCompleted = completedLessons[completedLessons.length - 1]
            const lessonIndex = tutorial.content?.steps?.findIndex(s => s.id === lastCompleted.lesson_id) || 0
            setCurrentStepIndex(Math.max(0, lessonIndex))
            
            const completed = new Set<number>()
            completedLessons.forEach(p => {
              const idx = tutorial.content?.steps?.findIndex(s => s.id === p.lesson_id) ?? -1
              if (idx >= 0) completed.add(idx)
            })
            setCompletedSteps(completed)
          }
        }
      } else {
        // Fallback sur localStorage
        const savedCompleted = localStorage.getItem(`tutorial-completed-${tutorial.id}`)
        const savedStep = localStorage.getItem(`tutorial-step-${tutorial.id}`)
        
        if (savedCompleted === 'true') {
          setIsCompleted(true)
          // Si le cours est complété, marquer toutes les sections comme complétées pour navigation libre
          const steps = tutorial.content?.steps || []
          const allCompleted = new Set<number>()
          steps.forEach((_step, index) => {
            allCompleted.add(index)
          })
          setCompletedSteps(allCompleted)
          // Par défaut, commencer à la première section
          setCurrentStepIndex(0)
        } else if (savedStep) {
          const step = parseInt(savedStep, 10)
          setCurrentStepIndex(step)
          
          const completed = new Set<number>()
          for (let i = 0; i < step; i++) {
            completed.add(i)
          }
          setCompletedSteps(completed)
        }
      }
    }

    loadProgress()
  }, [tutorial.id, userId])

  // Mettre à jour le timestamp d'entrée à chaque changement d'étape
  useEffect(() => {
    setStepEnterTime(Date.now())
  }, [currentStepIndex])

  // Quand on affiche l'écran de célébration, démarrer le compte à rebours et la redirection
  useEffect(() => {
    if (!showCelebration) return

    setRedirectCountdown(5)

    const intervalId = window.setInterval(() => {
      setRedirectCountdown(prev => {
        const next = (prev ?? 5) - 1
        return next <= 0 ? 0 : next
      })
    }, 1000)

    const timeoutId = window.setTimeout(onBack, 5000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [showCelebration, onBack])

  const steps = tutorial.content?.steps || []
  const currentStep = steps[currentStepIndex]

  const handleNext = async () => {
    const now = Date.now()
    const timeSpentSeconds = (now - stepEnterTime) / 1000

    if (currentStepIndex < steps.length - 1) {
      const newIndex = currentStepIndex + 1
      setCurrentStepIndex(newIndex)
      setCompletedSteps(new Set([...completedSteps, currentStepIndex]))
      
      // Sauvegarder la progression
      const progress = Math.round(((newIndex + 1) / steps.length) * 100)
      const currentStep = steps[currentStepIndex]
      
      if (userId) {
        // Sauvegarder dans Supabase
        await lmsService.updateProgress(
          userId,
          tutorial.id,
          currentStep.id,
          progress,
          true,
          timeSpentSeconds
        )
      } else {
        // Fallback sur localStorage
        localStorage.setItem(`tutorial-progress-${tutorial.id}`, progress.toString())
        localStorage.setItem(`tutorial-step-${tutorial.id}`, newIndex.toString())
      }
    } else {
      // Tutoriel complété
      await handleComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      const newIndex = currentStepIndex - 1
      setCurrentStepIndex(newIndex)
      localStorage.setItem(`tutorial-step-${tutorial.id}`, newIndex.toString())
    }
  }

  const handleComplete = async () => {
    // Marquer le tutoriel comme complété côté UI
    setIsCompleted(true)
    setShowCelebration(true)
    
    // Marquer toutes les étapes comme complétées (y compris la dernière)
    const steps = tutorial.content?.steps || []
    const allCompleted = new Set<number>()
    steps.forEach((_step, index) => {
      allCompleted.add(index)
    })
    setCompletedSteps(allCompleted)
    
    const currentStep = steps[currentStepIndex]
    const now = Date.now()
    const timeSpentSeconds = (now - stepEnterTime) / 1000
    
    if (userId) {
      // Sauvegarder dans Supabase
      await lmsService.updateProgress(
        userId,
        tutorial.id,
        currentStep?.id || null,
        100,
        true,
        timeSpentSeconds
      )
    } else {
      // Fallback sur localStorage
      localStorage.setItem(`tutorial-completed-${tutorial.id}`, 'true')
      localStorage.setItem(`tutorial-progress-${tutorial.id}`, '100')
      localStorage.setItem(`tutorial-step-${tutorial.id}`, (steps.length - 1).toString())
      
      // Ajouter les XP
      const currentXP = parseInt(localStorage.getItem('user-xp') || '0', 10)
      const newXP = currentXP + tutorial.rewards.xp
      localStorage.setItem('user-xp', newXP.toString())
    }
    
    showToast({
      variant: 'success',
      title: 'Tutoriel complété !',
      message: `Vous avez gagné ${tutorial.rewards.xp} XP !`
    })
    
    if (onComplete) {
      onComplete(tutorial.id)
    }
  }

  const handleStepAction = (step: TutorialStep) => {
    if (!step.action) return

    switch (step.action.type) {
      case 'addPedal':
        if (onAddPedal) {
          onAddPedal(step.action.target)
          showToast({
            variant: 'info',
            title: 'Action suggérée',
            message: `Ajoutez la pédale ${step.action.target} à votre pédalier`
          })
        }
        break
      case 'loadPreset':
        if (onLoadPreset && step.action.target) {
          onLoadPreset(step.action.target)
          showToast({
            variant: 'info',
            title: 'Preset chargé',
            message: 'Le preset éducatif a été chargé'
          })
        }
        break
      default:
        break
    }
  }

  return (
    <div className="h-full overflow-y-auto p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Header en pleine largeur */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-black/70 dark:text-white/70 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Retour aux tutoriels</span>
          </button>

          {/* Titre */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-2">
              {tutorial.title}
            </h1>
            <p className="text-black/70 dark:text-white/70 mb-4">
              {tutorial.description}
            </p>
          </div>
        </div>

        {/* Layout avec sidebar et contenu */}
        <div className="flex gap-6 items-start">
          {/* Sidebar qui défile avec le contenu */}
          <CourseSidebar
            steps={steps}
            currentStepIndex={currentStepIndex}
            completedSteps={completedSteps}
            totalXP={tutorial.rewards.xp}
            onStepClick={(index) => {
              // Si le cours est complété, permettre la navigation libre vers toutes les sections
              if (isCompleted || index <= currentStepIndex) {
                setCurrentStepIndex(index)
              }
            }}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoPrevious={currentStepIndex > 0}
            // On autorise toujours le clic sur "Suivant/Terminer" tant
            // que l'écran de célébration n'est pas affiché
            canGoNext={!showCelebration && steps.length > 0}
            isCompleted={isCompleted}
          />

          {/* Contenu principal */}
          <div className="flex-1 min-w-0 pr-0">

        {/* Contenu du tutoriel */}
        {steps.length === 0 ? (
          <Block className="p-12">
            <div className="text-center">
              <p className="text-lg text-black/70 dark:text-white/70">
                Ce tutoriel n'a pas encore de contenu détaillé.
              </p>
            </div>
          </Block>
        ) : (
          <>
            {/* Étape actuelle ou écran de célébration */}
            {showCelebration ? (
              <Block className="p-8 mb-6 relative overflow-hidden">
                {/* Confettis */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <ConfettiBoom
                    mode="boom"
                    shapeSize={10}
                    particleCount={120}
                    spreadDeg={90}
                    x={0.5}
                    y={0.2}
                    colors={['#22c55e', '#f97316', '#eab308', '#38bdf8', '#6366f1']}
                  />
                </div>

                <div className="flex flex-col items-center text-center relative">
                  <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/40">
                    <CheckCircle2 size={40} className="text-green-500" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-black/90 dark:text-white mb-2">
                    Bravo, tutoriel terminé !
                  </h2>
                  <p className="text-sm uppercase tracking-[0.2em] text-green-500 dark:text-green-400 mb-4">
                    Félicitations
                  </p>
                  <p className="text-base text-black/70 dark:text-white/70 max-w-xl mb-6">
                    Tu as complété toutes les étapes de « {tutorial.title} ». 
                    Prends un moment pour savourer ta progression, puis reviens sur les étapes si tu veux revoir un passage.
                  </p>
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-green-500/10 border border-green-500/40 text-sm text-green-700 dark:text-green-300">
                    <span className="font-semibold">{tutorial.rewards.xp} XP remportés</span>
                    <span className="w-1 h-1 rounded-full bg-green-500" />
                    <span>Cours marqué comme terminé</span>
                  </div>

                  <p className="mt-4 text-xs text-black/60 dark:text-white/60">
                    Retour aux cours dans {redirectCountdown ?? 5} seconde{(redirectCountdown ?? 5) > 1 ? 's' : ''}...
                  </p>
                </div>
              </Block>
            ) : (
            <Block className="p-4 mb-6">
              <div className="flex items-start gap-4 mb-6">
                {/* Numéro d'étape */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  ${completedSteps.has(currentStepIndex)
                    ? 'bg-green-500 text-white'
                      : 'bg-orange-500 text-white'
                  }
                `}>
                  {completedSteps.has(currentStepIndex) ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    currentStepIndex + 1
                  )}
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-black/85 dark:text-white/90 mb-3">
                    {currentStep.title}
                  </h2>
                      <TutorialContentRenderer
                        step={currentStep}
                        courseId={tutorial.id}
                        courseTitle={tutorial.title}
                        onLoadPreset={onLoadPreset}
                        onAddPedal={onAddPedal}
                      />

                  {/* Action suggérée */}
                  {currentStep.action && (
                    <div className="mt-4 p-4 bg-orange-500/10 dark:bg-orange-500/20 rounded-xl border border-orange-500/20">
                      <div className="flex items-start gap-3">
                        <PlayCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
                        <div>
                          <p className="text-sm font-medium text-black/85 dark:text-white/90 mb-1">
                            Action suggérée :
                          </p>
                          <button
                            onClick={() => handleStepAction(currentStep)}
                            className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                          >
                            {currentStep.action.type === 'addPedal' && `Ajouter la pédale ${currentStep.action.target}`}
                            {currentStep.action.type === 'loadPreset' && `Charger le preset ${currentStep.action.target}`}
                            {currentStep.action.type === 'setParameter' && `Ajuster ${currentStep.action.target}`}
                            {currentStep.action.type === 'test' && 'Tester votre son'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Block>
            )}

            </>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}

