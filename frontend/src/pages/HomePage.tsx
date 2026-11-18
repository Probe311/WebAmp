import { Block } from '../components/Block'
import { PartnerLogosCarousel } from '../components/PartnerLogosCarousel'
import { LearningProgress } from '../components/learn/LearningProgress'
import { ContinueLearning } from '../components/learn/ContinueLearning'
import { DailyJam } from '../components/home/DailyJam'
import { WeeklyPractice } from '../components/home/WeeklyPractice'
import { useAuth } from '../auth/AuthProvider'
import { useFeatureFlags } from '../hooks/useFeatureFlags'
import { MusicianSpotlight } from '../components/home/MusicianSpotlight'
import { PedalOfTheDay } from '../components/home/PedalOfTheDay'
import { EffectSpotlight } from '../components/home/EffectSpotlight'
import { SplitText, BlurText, FadeContent } from '../components/motion'
import { HeartHandshake } from 'lucide-react'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bonjour'
  if (hour < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

interface HomePageProps {
  onNavigateToLearn?: () => void
  onNavigateToPedalboard?: (pedalId?: string) => void
}

export function HomePage({ onNavigateToLearn, onNavigateToPedalboard }: HomePageProps) {
  const { user } = useAuth()
  const { isEnabled, loading: flagsLoading } = useFeatureFlags()

  const getFirstName = () => {
    if (user?.user_metadata?.first_name) {
      return user.user_metadata.first_name
    }
    return null
  }

  const firstName = getFirstName()
  const greeting = getGreeting()
  const useAlternateContent = !flagsLoading && !isEnabled('page_learn') && !isEnabled('page_gallery')

  return (
    <div className="custom-scrollbar h-full overflow-y-auto bg-[color:var(--neu-bg)] px-4 pb-5 pt-4 sm:px-5 sm:pt-5">
      <div className="w-full">
        <div className="mb-6">
          <SplitText
            text={`${greeting}${firstName ? ',' : ' !'}`}
            tag="h1"
            className="mb-1 text-3xl font-bold text-[color:var(--neu-text)] sm:text-4xl"
          />
          {firstName && (
            <BlurText
              text={firstName}
              tag="h2"
              className="mb-1 text-3xl font-bold text-[color:var(--neu-accent)] sm:text-4xl"
              delay={0.25}
            />
          )}
          <FadeContent delay={0.35}>
            <p className="text-base text-[color:var(--neu-text-muted)] sm:text-lg">
              {firstName ? 'Prêt à créer de la musique ?' : 'Bienvenue sur WebAmp'}
            </p>
          </FadeContent>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <FadeContent delay={0.05} className="h-full min-w-0">
            {useAlternateContent ? (
              <MusicianSpotlight />
            ) : (
              <ContinueLearning onNavigateToLearn={onNavigateToLearn} />
            )}
          </FadeContent>

          <Block className="relative z-10 flex h-full min-w-0 flex-col justify-between" spotlight glare fadeIn fadeDelay={0.1}>
            <div className="mb-4 flex items-center gap-2">
              <HeartHandshake size={18} className="text-[color:var(--neu-accent)]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-accent)]">
                Merci à
              </span>
            </div>
            <PartnerLogosCarousel />
          </Block>

          <FadeContent delay={0.15} className="h-full min-w-0">
            {useAlternateContent ? (
              <PedalOfTheDay onOpenPedalboard={onNavigateToPedalboard} />
            ) : (
              <LearningProgress />
            )}
          </FadeContent>

          <FadeContent delay={0.2} className="h-full min-w-0">
            <DailyJam onOpenPedalboard={() => onNavigateToPedalboard?.()} />
          </FadeContent>

          <FadeContent delay={0.25} className="h-full min-w-0">
            {useAlternateContent ? <EffectSpotlight /> : <WeeklyPractice />}
          </FadeContent>
        </div>
      </div>
    </div>
  )
}
