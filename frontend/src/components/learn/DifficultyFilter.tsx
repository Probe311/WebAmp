import { TutorialDifficulty, difficultyLabels } from '../../data/tutorials'
import { CheckCircle2 } from 'lucide-react'
import { FILTER_ROW_CLASS, filterChipClass } from './filterChip'

interface DifficultyFilterProps {
  activeDifficulty: TutorialDifficulty | 'all'
  onDifficultyChange: (difficulty: TutorialDifficulty | 'all') => void
}

/** Filtre de niveau — puces au langage du kit (relief → enfoncé + accent). */
export function DifficultyFilter({ activeDifficulty, onDifficultyChange }: DifficultyFilterProps) {
  const difficulties: (TutorialDifficulty | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced', 'pro']

  return (
    <div className={FILTER_ROW_CLASS}>
      {difficulties.map((difficulty) => {
        const isActive = activeDifficulty === difficulty
        const label = difficulty === 'all' ? 'Tous les niveaux' : difficultyLabels[difficulty as TutorialDifficulty]

        return (
          <button
            key={difficulty}
            type="button"
            aria-pressed={isActive}
            onClick={() => onDifficultyChange(difficulty)}
            className={filterChipClass(isActive)}
          >
            {isActive && difficulty !== 'all' && <CheckCircle2 size={14} aria-hidden="true" />}
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
