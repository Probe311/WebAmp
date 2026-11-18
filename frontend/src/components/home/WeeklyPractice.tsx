import { Calendar, BookOpen, Award, Clock, Trophy } from 'lucide-react'
import { Block } from '../Block'
import { useUserStats, useAllCoursesProgress } from '../../hooks/useLMS'
import { useAuth } from '../../auth/AuthProvider'
import { useMemo, useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

export function WeeklyPractice() {
  const { user } = useAuth()
  const { stats } = useUserStats(user?.id)
  const { progressMap } = useAllCoursesProgress(user?.id)
  const [weeklyLessons, setWeeklyLessons] = useState(0)
  const [weeklyCourses, setWeeklyCourses] = useState(0)

  useEffect(() => {
    const calculateWeeklyStats = async () => {
      if (!user?.id || !supabase) return

      try {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)

        const { data: recentProgress, error } = await supabase
          .from('user_progress')
          .select('course_id, is_completed, updated_at')
          .eq('user_id', user.id)
          .gte('updated_at', weekAgo.toISOString())

        if (error) {
          console.error('Erreur récupération progressions:', error)
          return
        }

        if (recentProgress) {
          const completedThisWeek = new Set(
            recentProgress.filter((p) => p.is_completed).map((p) => p.course_id)
          ).size
          setWeeklyCourses(completedThisWeek)
          setWeeklyLessons(recentProgress.length)
        }
      } catch (error) {
        console.error('Erreur calcul stats hebdomadaires:', error)
      }
    }

    calculateWeeklyStats()
  }, [user?.id, progressMap])

  const estimatedHours = useMemo(() => {
    if (!stats?.lessons_completed) return 0
    return Math.round((stats.lessons_completed * 15) / 60 * 10) / 10
  }, [stats?.lessons_completed])

  const weeklyProgress = useMemo(() => Math.min((estimatedHours / 5) * 100, 100), [estimatedHours])

  const motivationMessage = useMemo(() => {
    if (estimatedHours === 0) return 'Commencez votre première session cette semaine !'
    if (estimatedHours < 2) return 'Continuez, vous êtes sur la bonne voie !'
    if (estimatedHours < 5) return 'Excellent travail cette semaine !'
    return 'Objectif hebdomadaire atteint !'
  }, [estimatedHours])

  if (!user) {
    return (
      <Block className="flex min-h-[280px] flex-col justify-center">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]">
          Pratique Hebdomadaire
        </h3>
        <p className="text-center text-sm text-[color:var(--neu-text-faint)]">
          Connectez-vous pour voir vos statistiques
        </p>
      </Block>
    )
  }

  return (
    <Block className="flex min-h-[280px] flex-col">
      <div className="mb-4 flex items-center gap-2">
        <Calendar size={18} className="text-[color:var(--neu-accent)]" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-[color:var(--neu-text-muted)]">
          Pratique Hebdomadaire
        </h3>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-baseline gap-2">
          <span className="text-5xl font-bold text-[color:var(--neu-text)]">{estimatedHours.toFixed(1)}</span>
          <span className="text-lg text-[color:var(--neu-text-muted)]">heures</span>
        </div>

        <div className="neu-inset mb-2 h-2 w-full overflow-hidden rounded-full">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--neu-accent)] to-[color:var(--neu-accent-hover)] transition-all duration-500"
            style={{ width: `${weeklyProgress}%` }}
          />
        </div>
        <div className="flex items-center gap-1">
          {estimatedHours >= 5 && <Trophy size={12} className="text-[color:var(--neu-accent)]" />}
          <p className="text-xs text-[color:var(--neu-text-faint)]">{motivationMessage}</p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-[color:var(--neu-accent)]" />
          <div>
            <p className="text-xs text-[color:var(--neu-text-faint)]">Cours</p>
            <p className="text-lg font-bold text-[color:var(--neu-text)]">
              {weeklyCourses || stats?.courses_completed || 0}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Award size={16} className="text-[color:var(--neu-accent)]" />
          <div>
            <p className="text-xs text-[color:var(--neu-text-faint)]">Leçons</p>
            <p className="text-lg font-bold text-[color:var(--neu-text)]">
              {weeklyLessons || stats?.lessons_completed || 0}
            </p>
          </div>
        </div>
      </div>

      {stats && stats.current_streak > 0 && (
        <div className="mt-4 border-t border-[color:var(--neu-edge)] pt-4">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-[color:var(--neu-accent)]" />
            <span className="text-xs text-[color:var(--neu-text-muted)]">
              Série de <span className="font-bold text-[color:var(--neu-text)]">{stats.current_streak}</span>{' '}
              jour{stats.current_streak > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </Block>
  )
}
