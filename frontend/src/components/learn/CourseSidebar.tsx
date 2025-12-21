import { CheckCircle2, Award, ChevronLeft, ChevronRight } from 'lucide-react'
import { TutorialStep } from '../../data/tutorials'
import { Block } from '../Block'

interface CourseSidebarProps {
  steps: TutorialStep[]
  currentStepIndex: number
  completedSteps: Set<number>
  totalXP: number
  onStepClick: (index: number) => void
  onPrevious: () => void
  onNext: () => void
  canGoPrevious: boolean
  canGoNext: boolean
  isCompleted: boolean
}

export function CourseSidebar({
  steps,
  currentStepIndex,
  completedSteps,
  totalXP,
  onStepClick,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  isCompleted
}: CourseSidebarProps) {
  const progress = steps.length > 0 ? Math.round(((currentStepIndex + 1) / steps.length) * 100) : 0

  return (
    <Block className="w-80 flex-shrink-0 self-start">
      <div className="p-6 space-y-6">
        {/* XP et récompense */}
        <Block className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-yellow-500/10">
              <Award size={20} className="text-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-black/60 dark:text-white/60 font-medium">
                Récompense
              </p>
              <p className="text-lg font-bold text-black/85 dark:text-white/90">
                {totalXP} XP
              </p>
            </div>
          </div>
        </Block>

        {/* Barre de progression */}
        <div>
          <div className="flex items-center justify-between text-xs text-black/60 dark:text-white/60 mb-2">
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                isCompleted ? 'bg-green-500' : 'bg-orange-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Liste des étapes */}
        <div>
          <h3 className="text-sm font-bold text-black/85 dark:text-white/90 mb-4">
            Étapes du tutoriel
          </h3>
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isCurrent = index === currentStepIndex
              const isStepCompleted = completedSteps.has(index)
              // Si le cours est complété, toutes les sections sont accessibles
              const isAccessible = isCompleted || index <= currentStepIndex || isStepCompleted

              return (
                <button
                  key={step.id}
                  onClick={() => isAccessible && onStepClick(index)}
                  disabled={!isAccessible}
                  className={`
                    w-full flex items-start gap-3 p-3 rounded-lg transition-all duration-200 text-left
                    ${isCurrent
                      ? 'bg-orange-500/10 dark:bg-orange-500/20 border-2 border-orange-500 shadow-sm'
                      : isStepCompleted
                      ? 'bg-green-500/10 dark:bg-green-500/20 border border-green-500/30'
                      : 'bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
                    }
                    ${isAccessible 
                      ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600' 
                      : 'opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isStepCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-black/50 dark:text-white/50'
                    }
                  `}>
                    {isStepCompleted ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`
                      text-sm font-medium truncate
                      ${isCurrent
                        ? 'text-orange-600 dark:text-orange-400'
                        : isStepCompleted
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-black/70 dark:text-white/70'
                      }
                    `}>
                      {step.title}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`
                flex-1 flex items-center justify-center px-3 py-3 rounded-xl font-medium transition-all duration-200
                ${!canGoPrevious
                  ? 'bg-gray-200 dark:bg-gray-700 text-black/30 dark:text-white/30 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-700 text-black/70 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-lg'
                }
              `}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`
                flex-1 flex items-center justify-center px-3 py-3 rounded-xl font-medium transition-all duration-200
                ${!canGoNext
                  ? 'bg-gray-200 dark:bg-gray-700 text-black/30 dark:text-white/30 cursor-not-allowed'
                  : 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl'
                }
              `}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </Block>
  )
}

