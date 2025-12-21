import { Zap, Music, Target, TrendingUp, Guitar, Radio, Piano, Flame, Sparkles } from 'lucide-react'
import { useUserStats } from '../../hooks/useLMS'
import { useAuth } from '../../auth/AuthProvider'
import { useMemo } from 'react'
import { LucideIcon } from 'lucide-react'

// Presets recommandés du jour (rotation basée sur le jour de la semaine)
const dailyPresets: Array<{ name: string; style: string; Icon: LucideIcon }> = [
  { name: 'Clean Reverb', style: 'Clean', Icon: Guitar },
  { name: 'Blues Drive', style: 'Blues', Icon: Music },
  { name: 'Rock Crunch', style: 'Rock', Icon: Guitar },
  { name: 'Jazz Warm', style: 'Jazz', Icon: Piano },
  { name: 'Metal Distortion', style: 'Metal', Icon: Flame },
  { name: 'Ambient Space', style: 'Ambient', Icon: Sparkles },
  { name: 'Funk Rhythm', style: 'Funk', Icon: Radio }
]

// Challenges du jour
const dailyChallenges = [
  'Pratiquez 15 minutes avec un nouveau preset',
  'Explorez un nouveau style musical',
  'Créez votre propre preset personnalisé',
  'Apprenez une nouvelle technique de pédale',
  'Jouez avec le métronome à différents tempos',
  'Expérimentez avec les effets de modulation',
  'Revisitez un cours que vous avez complété'
]

export function DailyJam() {
  const { user } = useAuth()
  const { stats } = useUserStats(user?.id)

  // Sélectionner un preset et un challenge basés sur le jour de la semaine
  const dayOfWeek = useMemo(() => new Date().getDay(), [])
  const dailyPreset = dailyPresets[dayOfWeek]
  const dailyChallenge = dailyChallenges[dayOfWeek]

  // Calculer le message de motivation basé sur la série
  const motivationMessage = useMemo(() => {
    if (!stats?.current_streak) {
      return "Commencez votre série aujourd'hui !"
    }
    if (stats.current_streak === 1) {
      return 'Continuez demain pour maintenir votre série !'
    }
    if (stats.current_streak < 7) {
      return `${stats.current_streak} jours consécutifs !`
    }
    if (stats.current_streak < 30) {
      return `Série impressionnante de ${stats.current_streak} jours !`
    }
    return `${stats.current_streak} jours de pratique !`
  }, [stats?.current_streak])

  // Déterminer si l'utilisateur a été actif aujourd'hui
  const isActiveToday = useMemo(() => {
    if (!stats?.last_activity_at) return false
    const lastActivity = new Date(stats.last_activity_at)
    const today = new Date()
    return (
      lastActivity.getDate() === today.getDate() &&
      lastActivity.getMonth() === today.getMonth() &&
      lastActivity.getFullYear() === today.getFullYear()
    )
  }, [stats?.last_activity_at])

  return (
    <div className="bg-orange-500 dark:bg-orange-600 rounded-2xl p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.2),-8px_-8px_16px_rgba(255,255,255,0.1)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(60,60,60,0.6)] min-h-[280px] flex flex-col justify-between relative overflow-hidden">
      {/* Élément décoratif */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Music size={18} />
            Jam Quotidien
          </h3>
          <span
            className={`px-2 py-1 text-xs font-bold rounded-full ${
              isActiveToday
                ? 'bg-yellow-400 text-black'
                : 'bg-white/20 text-white'
            }`}
          >
            {isActiveToday ? 'ACTIF' : 'NOUVEAU'}
          </span>
        </div>

        {/* Preset du jour */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <dailyPreset.Icon size={24} className="text-white" />
            <div>
              <p className="text-sm font-semibold text-white">
                Preset du jour
              </p>
              <p className="text-xs text-white/80">{dailyPreset.name}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <Target size={12} className="text-white/70" />
            <p className="text-xs text-white/90">{dailyChallenge}</p>
          </div>
        </div>

        {/* Série de jours */}
        {stats && stats.current_streak > 0 && (
          <div className="mb-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-yellow-300" />
              <div>
                <p className="text-xs text-white/80">Série actuelle</p>
                <p className="text-sm font-bold text-white">
                  {stats.current_streak} jour{stats.current_streak > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <p className="text-xs text-white/70 mt-1">{motivationMessage}</p>
          </div>
        )}

        {/* Message pour nouveaux utilisateurs */}
        {(!stats || stats.current_streak === 0) && (
          <div className="mb-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-300" />
              <p className="text-xs text-white/90">
                Commencez votre première session aujourd'hui !
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

