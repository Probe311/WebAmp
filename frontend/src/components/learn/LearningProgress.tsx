import { BookOpen, Award, Target, TrendingUp } from 'lucide-react'
import { Block } from '../Block'
import { CountUp } from '../motion'
import { useUserStats, useAllCoursesProgress } from '../../hooks/useLMS'
import { useAuth } from '../../auth/AuthProvider'
import { lmsService } from '../../services/lms'
import { useEffect, useState } from 'react'
import { computeCompletedCoursesCount, computeTotalXPFromProgress } from '../../utils/learningStats'

export function LearningProgress() {
  const { user } = useAuth()
  const { stats, loading } = useUserStats(user?.id)
  const { progressMap } = useAllCoursesProgress(user?.id)
  const [totalXP, setTotalXP] = useState(0)
  const [coursesCompleted, setCoursesCompleted] = useState(0)
  const [lessonsCompleted, setLessonsCompleted] = useState(0)

  useEffect(() => {
    const computeFromProgress = async () => {
      if (!user) {
        setTotalXP(0)
        setCoursesCompleted(0)
        setLessonsCompleted(0)
        return
      }

      const completedCount = computeCompletedCoursesCount(progressMap)
      if (completedCount === 0) {
        setTotalXP(0)
        setCoursesCompleted(0)
        setLessonsCompleted(0)
        return
      }

      const completedCourseIds = Array.from(progressMap.entries())
        .filter(([, p]) => p.completed)
        .map(([courseId]) => courseId)

      const rewardsMap = await lmsService.getAllCourseRewards(completedCourseIds)
      setTotalXP(computeTotalXPFromProgress(progressMap, rewardsMap))
      setCoursesCompleted(completedCount)
      if (stats) setLessonsCompleted(stats.lessons_completed || 0)
    }

    computeFromProgress()
  }, [user, stats, progressMap])

  if (!user) {
    return (
      <Block className="flex min-h-[280px] flex-col justify-center">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-[color:var(--neu-accent)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-accent)]">
            Progression
          </span>
        </div>
        <p className="text-center text-sm text-[color:var(--neu-text-faint)]">
          Connectez-vous pour suivre votre progression
        </p>
      </Block>
    )
  }

  if (loading && !stats) {
    return (
      <Block className="flex min-h-[280px] flex-col justify-center">
        <div className="text-center text-[color:var(--neu-text-faint)]">Chargement...</div>
      </Block>
    )
  }

  const badges = stats?.badges || []
  const streak = stats?.current_streak || 0

  return (
    <Block className="flex min-h-[280px] flex-col" spotlight glare>
      <div className="mb-4 flex items-center gap-2">
        <BookOpen size={18} className="text-[color:var(--neu-accent)]" />
        <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-accent)]">
          Progression
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div className="mb-4">
          <div className="mb-2 flex items-baseline gap-2">
            <CountUp to={totalXP} className="text-4xl font-bold text-[color:var(--neu-text)]" />
            <span className="text-sm text-[color:var(--neu-text-muted)]">XP</span>
          </div>
          <div className="neu-inset h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[color:var(--neu-accent)] to-[color:var(--neu-accent-hover)] transition-all duration-500"
              style={{ width: `${Math.min((totalXP % 1000) / 10, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-[color:var(--neu-text-faint)]">
            {1000 - (totalXP % 1000)} XP jusqu&apos;au prochain niveau
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-[color:var(--neu-text-faint)]" />
            <div>
              <CountUp
                to={coursesCompleted}
                className="text-lg font-bold text-[color:var(--neu-text)]"
              />
              <div className="text-xs text-[color:var(--neu-text-muted)]">Cours terminés</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-[color:var(--neu-text-faint)]" />
            <div>
              <CountUp
                to={lessonsCompleted}
                className="text-lg font-bold text-[color:var(--neu-text)]"
              />
              <div className="text-xs text-[color:var(--neu-text-muted)]">Leçons complétées</div>
            </div>
          </div>
        </div>

        {(badges.length > 0 || streak > 0) && (
          <div className="mt-4 flex items-center justify-between border-t border-[color:var(--neu-edge)] pt-4">
            {badges.length > 0 && (
              <div className="flex items-center gap-2">
                <Award size={16} className="text-[var(--td-warning)]" />
                <span className="text-sm font-medium text-[color:var(--neu-text)]">
                  {badges.length} badge{badges.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
            {streak > 0 && (
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-[color:var(--neu-accent)]" />
                <span className="text-sm font-medium text-[color:var(--neu-text)]">
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
