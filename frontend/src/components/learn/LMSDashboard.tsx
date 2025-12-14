// Dashboard LMS pour afficher les statistiques et la progression
import { useUserStats } from '../../hooks/useLMS'
import { Block } from '../Block'
import { Loader } from '../Loader'
import { Award, BookOpen, CheckCircle2, Flame } from 'lucide-react'

interface LMSDashboardProps {
  userId: string
}

export function LMSDashboard({ userId }: LMSDashboardProps) {
  const { stats, loading } = useUserStats(userId)

  if (loading) {
    return (
      <Block className="p-8">
        <Loader size="md" text="Chargement des statistiques..." showText={true} />
      </Block>
    )
  }

  if (!stats) {
    return (
      <Block className="p-8">
        <p className="text-center text-black/70 dark:text-white/70">
          Aucune statistique disponible
        </p>
      </Block>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* XP Total */}
      <Block className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-yellow-500/10 dark:bg-yellow-500/20">
            <Award className="text-yellow-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-black/60 dark:text-white/60">XP Total</p>
            <p className="text-2xl font-bold text-black/85 dark:text-white/90">
              {stats.total_xp.toLocaleString()}
            </p>
          </div>
        </div>
      </Block>

      {/* Cours complétés */}
      <Block className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-green-500/10 dark:bg-green-500/20">
            <CheckCircle2 className="text-green-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-black/60 dark:text-white/60">Cours complétés</p>
            <p className="text-2xl font-bold text-black/85 dark:text-white/90">
              {stats.courses_completed}
            </p>
          </div>
        </div>
      </Block>

      {/* Leçons complétées */}
      <Block className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 dark:bg-blue-500/20">
            <BookOpen className="text-blue-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-black/60 dark:text-white/60">Leçons complétées</p>
            <p className="text-2xl font-bold text-black/85 dark:text-white/90">
              {stats.lessons_completed}
            </p>
          </div>
        </div>
      </Block>

      {/* Série de jours */}
      <Block className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-500/10 dark:bg-orange-500/20">
            <Flame className="text-orange-500" size={24} />
          </div>
          <div>
            <p className="text-sm text-black/60 dark:text-white/60">Série de jours</p>
            <p className="text-2xl font-bold text-black/85 dark:text-white/90">
              {stats.current_streak}
            </p>
          </div>
        </div>
      </Block>

      {/* Badges */}
      {stats.badges && stats.badges.length > 0 && (
        <Block className="p-6 md:col-span-2 lg:col-span-4">
          <h3 className="text-lg font-bold text-black/85 dark:text-white/90 mb-4">
            Badges obtenus
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.badges.map((badge: string, index: number) => (
              <div
                key={index}
                className="px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium"
              >
                {badge}
              </div>
            ))}
          </div>
        </Block>
      )}
    </div>
  )
}

