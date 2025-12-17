import { TutorialDifficulty, difficultyLabels, difficultyColors } from '../../data/tutorials'
import { CheckCircle2 } from 'lucide-react'

interface DifficultyFilterProps {
  activeDifficulty: TutorialDifficulty | 'all'
  onDifficultyChange: (difficulty: TutorialDifficulty | 'all') => void
}

export function DifficultyFilter({ activeDifficulty, onDifficultyChange }: DifficultyFilterProps) {
  const difficulties: (TutorialDifficulty | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced', 'pro']

  return (
    <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2">
      {difficulties.map((difficulty) => {
        const isActive = activeDifficulty === difficulty
        const label = difficulty === 'all' ? 'Tous les niveaux' : difficultyLabels[difficulty as TutorialDifficulty]
        const color = difficulty === 'all' 
          ? 'bg-gray-500' 
          : difficultyColors[difficulty as TutorialDifficulty]

        return (
          <button
            key={difficulty}
            onClick={() => onDifficultyChange(difficulty)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
              transition-all duration-200 whitespace-nowrap touch-manipulation
              ${isActive
                ? `${color} text-white shadow-lg`
                : 'bg-white dark:bg-gray-700 text-black/70 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-gray-600'
              }
            `}
          >
            {isActive && difficulty !== 'all' && (
              <CheckCircle2 size={14} />
            )}
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}

