import { Award, TrendingUp } from 'lucide-react'

interface ProgressBadgeProps {
  xp: number
  level?: number
  completedCount?: number
  totalCount?: number
}

export function ProgressBadge({ xp, level = 1, completedCount = 0, totalCount = 0 }: ProgressBadgeProps) {
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="flex items-center gap-4">
      {/* XP */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg">
        <Award size={18} />
        <div className="flex flex-col">
          <span className="text-xs opacity-90">XP Total</span>
          <span className="text-lg font-bold">{xp}</span>
        </div>
      </div>

      {/* Niveau */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-700 shadow-lg">
        <TrendingUp size={18} className="text-orange-500" />
        <div className="flex flex-col">
          <span className="text-xs text-black/60 dark:text-white/60">Niveau</span>
          <span className="text-lg font-bold text-black/85 dark:text-white/90">{level}</span>
        </div>
      </div>

      {/* Progression */}
      {totalCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-700 shadow-lg">
          <div className="flex flex-col">
            <span className="text-xs text-black/60 dark:text-white/60">Complété</span>
            <span className="text-lg font-bold text-black/85 dark:text-white/90">
              {completedCount}/{totalCount} ({completionPercentage}%)
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

