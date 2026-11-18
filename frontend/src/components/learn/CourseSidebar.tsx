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
 <Block className="p-4 bg-[color:var(--neu-accent-soft)]">
 <div className="flex items-center gap-3">
 <div className="p-3 rounded-[var(--td-radius-well)] bg-[var(--td-warning-surface)]">
 <Award size={20} className="text-[var(--td-warning)]" />
 </div>
 <div>
              <p className="text-xs text-[color:var(--neu-text-muted)] font-medium">
 Récompense
 </p>
              <p className="text-lg font-bold text-[color:var(--neu-text)]">
 {totalXP} XP
 </p>
 </div>
 </div>
 </Block>

 {/* Barre de progression */}
 <div>
          <div className="flex items-center justify-between text-xs text-[color:var(--neu-text-muted)] mb-2">
 <span>Progression</span>
 <span>{progress}%</span>
 </div>
          <div className="h-2 bg-[color:var(--neu-bg-hollow)] rounded-full overflow-hidden">
 <div 
 className={`h-full transition-all duration-300 ${
 isCompleted ? 'bg-[var(--td-success)]' : 'bg-[color:var(--neu-accent)]'
 }`}
 style={{ width: `${progress}%` }}
 />
 </div>
 </div>

 {/* Liste des étapes */}
 <div>
          <h3 className="text-sm font-bold text-[color:var(--neu-text)] mb-4">
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
 w-full flex items-start gap-3 p-3 rounded-[var(--td-radius-control)] transition-all duration-200 text-left
 ${isCurrent
 ? 'bg-[color:var(--neu-accent-soft)] border-2 border-[color:var(--neu-accent)] shadow-sm'
 : isStepCompleted
 ? 'bg-[var(--td-success-surface)] border border-[var(--td-success)]/30'
                      : 'bg-[color:var(--neu-bg-track)]/50 border border-[color:var(--neu-edge)]'
 }
 ${isAccessible 
                      ? 'cursor-pointer hover:bg-[color:var(--neu-bg-hollow)]' 
 : 'opacity-50 cursor-not-allowed'
 }
 `}
 >
 <div className={`
 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
 ${isStepCompleted
 ? 'bg-[var(--td-success)] text-white'
 : isCurrent
 ? 'neu-accent-btn'
                      : 'bg-[color:var(--neu-bg-hollow)] text-[color:var(--neu-text-faint)]'
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
 ? 'text-[color:var(--neu-accent)] '
 : isStepCompleted
 ? 'text-[var(--td-success)] '
                        : 'text-[color:var(--neu-text-muted)]'
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
        <div className="pt-4 border-t border-[color:var(--neu-edge)]">
 <div className="flex gap-2">
 <button
 onClick={onPrevious}
 disabled={!canGoPrevious}
 className={`
 flex-1 flex items-center justify-center px-3 py-3 rounded-[var(--td-radius-well)] font-medium transition-all duration-200
 ${!canGoPrevious
                  ? 'bg-[color:var(--neu-bg-hollow)] text-[color:var(--neu-text-faint)] cursor-not-allowed'
                  : 'neu-inset text-[color:var(--neu-text-muted)] hover:bg-[color:var(--neu-bg-track)] shadow-lg'
 }
 `}
 >
 <ChevronLeft size={20} />
 </button>

 <button
 onClick={onNext}
 disabled={!canGoNext}
 className={`
 flex-1 flex items-center justify-center px-3 py-3 rounded-[var(--td-radius-well)] font-medium transition-all duration-200
 ${!canGoNext
                  ? 'bg-[color:var(--neu-bg-hollow)] text-[color:var(--neu-text-faint)] cursor-not-allowed'
 : 'neu-accent-btn'
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

