import { Block } from '../components/Block'
import { PartnerLogosCarousel } from '../components/PartnerLogosCarousel'
import { LearningProgress } from '../components/learn/LearningProgress'
import { ContinueLearning } from '../components/learn/ContinueLearning'
import { DailyJam } from '../components/home/DailyJam'
import { WeeklyPractice } from '../components/home/WeeklyPractice'
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
          <DailyJam />

          {/* Carte 5 - Weekly Practice */}
          <WeeklyPractice />
        </div>
      </div>
    </div>
  )
}

