import { Calendar, BookOpen, Award, Clock, Trophy } from 'lucide-react'
import { Block } from '../Block'
import { useUserStats, useAllCoursesProgress } from '../../hooks/useLMS'
import { useAuth } from '../../auth/AuthProvider'
import { useMemo } from 'react'
import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

export function WeeklyPractice() {
  const { user } = useAuth()
  const { stats } = useUserStats(user?.id)
  const { progressMap } = useAllCoursesProgress(user?.id)
  const [weeklyLessons, setWeeklyLessons] = useState(0)
  const [weeklyCourses, setWeeklyCourses] = useState(0)

  // Calculer les statistiques de la semaine
  useEffect(() => {
    const calculateWeeklyStats = async () => {
      if (!user?.id) return

      try {
        if (!supabase) return
        
        // Récupérer les progressions de la semaine dernière
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
          // Compter les cours complétés cette semaine
          const completedThisWeek = new Set(
            recentProgress
              .filter((p) => p.is_completed)
              .map((p) => p.course_id)
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

  // Calculer les heures estimées de pratique (basé sur les leçons complétées)
  const estimatedHours = useMemo(() => {
    if (!stats?.lessons_completed) return 0
    // Estimation : ~15 minutes par leçon en moyenne
    return Math.round((stats.lessons_completed * 15) / 60 * 10) / 10
  }, [stats?.lessons_completed])

  // Calculer le pourcentage de progression de la semaine
  const weeklyProgress = useMemo(() => {
    // Objectif : 5 heures par semaine
    const weeklyGoal = 5
    return Math.min((estimatedHours / weeklyGoal) * 100, 100)
  }, [estimatedHours])

  // Message de motivation
  const motivationMessage = useMemo(() => {
    if (estimatedHours === 0) {
      return "Commencez votre première session cette semaine !"
    }
    if (estimatedHours < 2) {
      return "Continuez, vous êtes sur la bonne voie !"
    }
    if (estimatedHours < 5) {
      return "Excellent travail cette semaine !"
    }
    return "Objectif hebdomadaire atteint !"
  }, [estimatedHours])

  if (!user) {
    return (
      <Block className="min-h-[280px] flex flex-col justify-center">
        <h3 className="text-sm font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-4">
          Pratique Hebdomadaire
        </h3>
        <p className="text-sm text-black/50 dark:text-white/50 text-center">
          Connectez-vous pour voir vos statistiques
        </p>
      </Block>
    )
  }

  return (
    <Block className="min-h-[280px] flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={18} className="text-orange-500 dark:text-orange-400" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-black/70 dark:text-white/70">
          Pratique Hebdomadaire
        </h3>
      </div>

      {/* Heures de pratique */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-5xl font-bold text-black/85 dark:text-white/90">
            {estimatedHours.toFixed(1)}
          </span>
          <span className="text-lg text-black/70 dark:text-white/70">heures</span>
        </div>
        
        {/* Barre de progression */}
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
            style={{ width: `${weeklyProgress}%` }}
          />
        </div>
        <div className="flex items-center gap-1">
          {estimatedHours >= 5 && (
            <Trophy size={12} className="text-orange-500 dark:text-orange-400" />
          )}
          <p className="text-xs text-black/60 dark:text-white/60">
            {motivationMessage}
          </p>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-2 gap-4 mt-auto">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-orange-500 dark:text-orange-400" />
          <div>
            <p className="text-xs text-black/60 dark:text-white/60">Cours</p>
            <p className="text-lg font-bold text-black/85 dark:text-white/90">
              {stats?.courses_completed || 0}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Award size={16} className="text-orange-500 dark:text-orange-400" />
          <div>
            <p className="text-xs text-black/60 dark:text-white/60">Leçons</p>
            <p className="text-lg font-bold text-black/85 dark:text-white/90">
              {stats?.lessons_completed || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Série de jours si disponible */}
      {stats && stats.current_streak > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-orange-500 dark:text-orange-400" />
            <span className="text-xs text-black/70 dark:text-white/70">
              Série de <span className="font-bold">{stats.current_streak}</span> jour{stats.current_streak > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </Block>
  )
}

