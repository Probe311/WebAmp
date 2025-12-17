import { Zap } from 'lucide-react'
import { Block } from '../components/Block'
import { PartnerLogosCarousel } from '../components/PartnerLogosCarousel'
import { LearningProgress } from '../components/learn/LearningProgress'
import { ContinueLearning } from '../components/learn/ContinueLearning'
import { useAuth } from '../auth/AuthProvider'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

interface HomePageProps {
  onNavigateToLearn?: () => void
}

export function HomePage({ onNavigateToLearn }: HomePageProps) {
  const { user } = useAuth()
  
  const getFirstName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }
    return null
  }

  const firstName = getFirstName()
  const greeting = getGreeting()

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* Message de bienvenue */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-black/85 dark:text-white/90 mb-2">
            {greeting}{firstName ? ',' : ' !'}
          </h1>
          {firstName && (
            <h2 className="text-5xl font-bold text-orange-500 dark:text-orange-400 mb-2">
              {firstName}
            </h2>
          )}
          <p className="text-xl text-black/70 dark:text-white/70">
            {firstName ? 'Prêt à créer de la musique ?' : 'Bienvenue sur WebAmp'}
          </p>
        </div>
        {/* Grille Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Carte 1 - Continue Learning (Grande) */}
          <ContinueLearning onNavigateToLearn={onNavigateToLearn} />

          {/* Carte 2 - Carrousel des logos partenaires */}
          <Block className="flex flex-col items-center justify-center overflow-hidden min-h-[280px]">
            <PartnerLogosCarousel />
          </Block>

          {/* Carte 3 - Progression de l'apprentissage */}
          <LearningProgress />

          {/* Carte 4 - Daily Jam */}
          <div className="bg-orange-500 dark:bg-orange-600 rounded-2xl p-6 shadow-[8px_8px_16px_rgba(0,0,0,0.2),-8px_-8px_16px_rgba(255,255,255,0.1)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(60,60,60,0.6)] min-h-[280px] flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Daily Jam</h3>
              <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold rounded-full">
                ACTIVE
              </span>
            </div>
            <p className="text-sm text-white/90 mb-2">Clean Reverb Preset</p>
            <Zap className="text-yellow-300 opacity-50" size={32} />
          </div>

          {/* Carte 5 - Weekly Practice */}
          <Block className="min-h-[280px] flex flex-col justify-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-4">
              Weekly Practice
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-black/85 dark:text-white/90">4.2</span>
              <span className="text-lg text-black/70 dark:text-white/70">hours</span>
            </div>
          </Block>
        </div>
      </div>
    </div>
  )
}

