import { BookOpen, Award, Target, TrendingUp } from 'lucide-react'
import { Block } from '../Block'
import { useUserStats } from '../../hooks/useLMS'
import { useAuth } from '../../auth/AuthProvider'

export function LearningProgress() {
  const { user } = useAuth()
  const { stats, loading } = useUserStats(user?.id)

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <Block className="min-h-[280px] flex flex-col justify-center">
        <div className="text-center text-black/50 dark:text-white/50">
          Chargement...
        </div>
      </Block>
    )
  }

  const totalXP = stats?.total_xp || 0
  const coursesCompleted = stats?.courses_completed || 0
  const lessonsCompleted = stats?.lessons_completed || 0
  const badges = stats?.badges || []
  const streak = stats?.current_streak || 0

  return (
    <Block className="min-h-[280px] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={18} className="text-orange-500 dark:text-orange-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-orange-500 dark:text-orange-400">
          Progression
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-between">
        {/* XP Total */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-bold text-black/85 dark:text-white/90">
              {totalXP.toLocaleString()}
            </span>
            <span className="text-sm text-black/70 dark:text-white/70">XP</span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min((totalXP % 1000) / 10, 100)}%` }}
            />
          </div>
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            {1000 - (totalXP % 1000)} XP jusqu'au prochain niveau
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-black/50 dark:text-white/50" />
            <div>
              <div className="text-lg font-bold text-black/85 dark:text-white/90">
                {coursesCompleted}
              </div>
              <div className="text-xs text-black/70 dark:text-white/70">
                Cours terminés
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-black/50 dark:text-white/50" />
            <div>
              <div className="text-lg font-bold text-black/85 dark:text-white/90">
                {lessonsCompleted}
              </div>
              <div className="text-xs text-black/70 dark:text-white/70">
                Leçons complétées
              </div>
            </div>
          </div>
        </div>

        {/* Badges et Streak */}
        {(badges.length > 0 || streak > 0) && (
          <div className="mt-4 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
            {badges.length > 0 && (
              <div className="flex items-center gap-2">
                <Award size={16} className="text-yellow-500" />
                <span className="text-sm font-medium text-black/85 dark:text-white/90">
                  {badges.length} badge{badges.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
            {streak > 0 && (
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-orange-500 dark:text-orange-400" />
                <span className="text-sm font-medium text-black/85 dark:text-white/90">
                  {streak} jour{streak > 1 ? 's' : ''} consécutifs
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </Block>
  )
}
