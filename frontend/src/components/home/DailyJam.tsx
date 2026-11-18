import { Zap, Music, Target, TrendingUp, Guitar, Radio, Piano, Flame, Sparkles } from 'lucide-react'
import { useUserStats } from '../../hooks/useLMS'
import { useAuth } from '../../auth/AuthProvider'
import { useMemo } from 'react'
import { LucideIcon } from 'lucide-react'

const dailyPresets: Array<{ name: string; style: string; profile: string; Icon: LucideIcon }> = [
  { name: 'Clean Reverb', style: 'Clean', profile: 'David Gilmour', Icon: Guitar },
  { name: 'Blues Drive', style: 'Blues', profile: 'Stevie Ray Vaughan', Icon: Music },
  { name: 'Rock Crunch', style: 'Rock', profile: 'Jimmy Page', Icon: Guitar },
  { name: 'Jazz Warm', style: 'Jazz', profile: 'Wes Montgomery', Icon: Piano },
  { name: 'Metal Distortion', style: 'Metal', profile: 'Dimebag Darrell', Icon: Flame },
  { name: 'Ambient Space', style: 'Ambient', profile: 'The Edge', Icon: Sparkles },
  { name: 'Funk Rhythm', style: 'Funk', profile: 'Nile Rodgers', Icon: Radio },
]

const dailyChallenges = [
  'Pratiquez 15 minutes avec un nouveau preset',
  'Explorez un nouveau style musical',
  'Créez votre propre preset personnalisé',
  'Apprenez une nouvelle technique de pédale',
  'Jouez avec le métronome à différents tempos',
  'Expérimentez avec les effets de modulation',
  'Revisitez un cours que vous avez complété',
]

export const PENDING_DAILY_PROFILE_KEY = 'pendingRockStarProfile'

interface DailyJamProps {
  onOpenPedalboard?: () => void
}

export function DailyJam({ onOpenPedalboard }: DailyJamProps) {
  const { user } = useAuth()
  const { stats } = useUserStats(user?.id)

  const dayOfWeek = useMemo(() => new Date().getDay(), [])
  const dailyPreset = dailyPresets[dayOfWeek]
  const dailyChallenge = dailyChallenges[dayOfWeek]

  const motivationMessage = useMemo(() => {
    if (!stats?.current_streak) return "Commencez votre série aujourd'hui !"
    if (stats.current_streak === 1) return 'Continuez demain pour maintenir votre série !'
    if (stats.current_streak < 7) return `${stats.current_streak} jours consécutifs !`
    if (stats.current_streak < 30) return `Série impressionnante de ${stats.current_streak} jours !`
    return `${stats.current_streak} jours de pratique !`
  }, [stats?.current_streak])

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

  const startJam = () => {
    try {
      localStorage.setItem(PENDING_DAILY_PROFILE_KEY, dailyPreset.profile)
    } catch {
      /* ignore */
    }
    onOpenPedalboard?.()
  }

  return (
    <div className="neu-accent-surface neu-card relative flex min-h-[280px] flex-col justify-between rounded-3xl p-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl" aria-hidden>
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full bg-white/5" />
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
            <Music size={18} />
            Jam Quotidien
          </h3>
          <span
            className={`rounded-full px-2 py-1 text-xs font-bold ${
              isActiveToday ? 'bg-yellow-400 text-slate-900' : 'bg-white/20 text-white'
            }`}
          >
            {isActiveToday ? 'ACTIF' : 'NOUVEAU'}
          </span>
        </div>

        <div className="mb-4">
          <div className="mb-1 flex items-center gap-2">
            <dailyPreset.Icon size={24} className="text-white" />
            <div>
              <p className="text-sm font-semibold text-white">Preset du jour</p>
              <p className="text-xs text-white/85">
                {dailyPreset.name} · {dailyPreset.profile}
              </p>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1">
            <Target size={12} className="text-white/75" />
            <p className="text-xs text-white/90">{dailyChallenge}</p>
          </div>
        </div>

        {stats && stats.current_streak > 0 ? (
          <div className="mb-4 rounded-2xl bg-black/15 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-yellow-300" />
              <div>
                <p className="text-xs text-white/80">Série actuelle</p>
                <p className="text-sm font-bold text-white">
                  {stats.current_streak} jour{stats.current_streak > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <p className="mt-1 text-xs text-white/75">{motivationMessage}</p>
          </div>
        ) : (
          <div className="mb-4 rounded-2xl bg-black/15 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-yellow-300" />
              <p className="text-xs text-white/90">Commencez votre première session aujourd&apos;hui !</p>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10">
        <button
          type="button"
          onClick={startJam}
          className="neu-flat neu-pill mt-4 w-full px-4 py-2.5 text-sm font-semibold text-[color:var(--neu-accent)] transition-all duration-150 hover:-translate-y-0.5 active:neu-pressed"
        >
          Charger le preset et jammer
        </button>
      </div>
    </div>
  )
}
