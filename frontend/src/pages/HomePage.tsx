import { useState } from 'react'
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
import { ContactSupportModal } from '../components/ContactSupportModal'
import { CTA } from '../components/CTA'
import { HeartHandshake, HelpCircle } from 'lucide-react'

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
  const [showContactModal, setShowContactModal] = useState(false)
  
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
    <>
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-24">
      <div className="w-full">
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
          {useAlternateContent ? (
            <MusicianSpotlight />
          ) : (
            <ContinueLearning onNavigateToLearn={onNavigateToLearn} />
          )}

          {/* Carte 2 - Carrousel des logos partenaires */}
          <Block className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <HeartHandshake size={18} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              Merci à
            </span>
          </div>
            <PartnerLogosCarousel />
          </Block>

          {/* Carte 3 - Progression de l'apprentissage */}
          {useAlternateContent ? (
            <PedalOfTheDay onOpenPedalboard={onNavigateToPedalboard} />
          ) : (
            <LearningProgress />
          )}

          {/* Carte 4 - Daily Jam */}
          <DailyJam onOpenPedalboard={() => onNavigateToPedalboard?.()} />

          {/* Carte 5 - Weekly Practice */}
          {useAlternateContent ? <EffectSpotlight /> : <WeeklyPractice />}
        </div>
      </div>
    </div>

      {/* Bouton CTA Contact/Support en bas à droite, aligné sur la navbar */}
      <div className="fixed bottom-6 right-6 z-50">
        <CTA
          variant="icon-only"
          icon={<HelpCircle size={24} />}
          onClick={() => setShowContactModal(true)}
          title="Contact & Support"
          className="min-w-[56px] min-h-[56px] rounded-full shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5)] hover:shadow-[10px_10px_20px_rgba(0,0,0,0.15),-10px_-10px_20px_rgba(255,255,255,1)] dark:hover:shadow-[10px_10px_20px_rgba(0,0,0,0.6),-10px_-10px_20px_rgba(70,70,70,0.6)]"
        />
      </div>

      {/* Modale de contact/support */}
      <ContactSupportModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </>
  )
}

