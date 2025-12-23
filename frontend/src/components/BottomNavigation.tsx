import { LayoutDashboard, Music, BookOpen, Settings, User, Drum, Sliders, Store, Shield, Speaker, KeyboardMusic } from 'lucide-react'
import { useDrumMachine } from '../contexts/DrumMachineContext'
import { useFeatureFlags } from '../hooks/useFeatureFlags'

export type PageId = 'home' | 'webamp' | 'daw' | 'practice' | 'learn' | 'mixing' | 'drummachine' | 'gallery' | 'settings' | 'account' | 'admin'

interface BottomNavigationProps {
  currentPage: PageId
  onPageChange: (page: PageId) => void
  isAuthenticated?: boolean
  isAdmin?: boolean
}

interface NavItem {
  id: PageId
  icon: typeof LayoutDashboard
  label: string
  requiresAuth?: boolean
}

const navItems: NavItem[] = [
  { id: 'home', icon: LayoutDashboard, label: 'Accueil' },
  { id: 'webamp', icon: Speaker, label: 'WebAmp' },
  { id: 'daw', icon: KeyboardMusic, label: 'Studio' },
  { id: 'practice', icon: Music, label: 'Pratique' },
  { id: 'learn', icon: BookOpen, label: 'Apprendre' },
  { id: 'mixing', icon: Sliders, label: 'Mixage' },
  { id: 'drummachine', icon: Drum, label: 'Batterie' },
  { id: 'gallery', icon: Store, label: 'Gallery' },
  { id: 'settings', icon: Settings, label: 'Paramètres' },
  { id: 'account', icon: User, label: 'Compte', requiresAuth: true }
]

export function BottomNavigation({ currentPage, onPageChange, isAuthenticated = false, isAdmin = false }: BottomNavigationProps) {
  const { isActive: isDrumMachineActive } = useDrumMachine()
  const { isEnabled } = useFeatureFlags()

  // Mapping des pages vers leurs feature flags
  const pageFeatureFlags: Record<PageId, string | null> = {
    'home': null, // Toujours visible
    'webamp': null, // Toujours visible
    'daw': 'page_daw',
    'practice': 'page_practice',
    'learn': 'page_learn',
    'mixing': 'page_mixing',
    'drummachine': 'page_drummachine',
    'gallery': 'page_gallery',
    'settings': null, // Toujours visible
    'account': null, // Géré par requiresAuth
    'admin': null // Géré par isAdmin
  }

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white dark:bg-gray-700 rounded-3xl px-6 py-4 flex items-center gap-6 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] border border-black/10 dark:border-white/10">
        {navItems.map((item) => {
          // Masquer les éléments nécessitant une authentification si l'utilisateur n'est pas connecté
          if (item.requiresAuth && !isAuthenticated) {
            return null
          }

          // Vérifier le feature flag pour cette page
          const featureFlagKey = pageFeatureFlags[item.id]
          if (featureFlagKey && !isEnabled(featureFlagKey)) {
            return null
          }

          const isActive = currentPage === item.id
          const Icon = item.icon
          const isDrumMachineItem = item.id === 'drummachine'
          const shouldAnimate = isDrumMachineItem && isDrumMachineActive

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className="group flex flex-col items-center gap-1 relative touch-manipulation transition-all duration-300"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`
                  p-3 rounded-2xl transition-all duration-300
                  ${isActive
                    ? 'bg-orange-500 text-white shadow-[0_0_20px_rgba(245,158,11,0.5)] translate-y-[-4px]'
                    : 'text-black/70 dark:text-white/70 hover:bg-white/5 dark:hover:bg-white/5'
                  }
                `}
              >
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  style={shouldAnimate ? {
                    animation: 'pulse 1s ease-in-out infinite'
                  } : undefined}
                />
              </div>
              <span
                className={`
                  text-[10px] font-medium absolute -bottom-4 transition-opacity duration-300
                  ${isActive
                    ? 'opacity-100 text-orange-500 dark:text-orange-400'
                    : 'opacity-0 text-black/70 dark:text-white/70 group-hover:opacity-100'
                  }
                `}
              >
                {item.label}
              </span>
            </button>
          )
        })}
        
        {/* Bouton Admin - tout à droite, visible uniquement pour l'admin */}
        {isAdmin && (
          <button
            onClick={() => onPageChange('admin')}
            className="group flex flex-col items-center gap-1 relative touch-manipulation transition-all duration-300 ml-4 pl-4 border-l border-black/10 dark:border-white/10"
            aria-label="Administration"
            aria-current={currentPage === 'admin' ? 'page' : undefined}
          >
            <div
              className={`
                p-3 rounded-2xl transition-all duration-300
                ${currentPage === 'admin'
                  ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] translate-y-[-4px]'
                  : 'text-black/70 dark:text-white/70 hover:bg-white/5 dark:hover:bg-white/5'
                }
              `}
            >
              <Shield 
                size={24} 
                strokeWidth={currentPage === 'admin' ? 2.5 : 2}
              />
            </div>
            <span
              className={`
                text-[10px] font-medium absolute -bottom-4 transition-opacity duration-300
                ${currentPage === 'admin'
                  ? 'opacity-100 text-red-500 dark:text-red-400'
                  : 'opacity-0 text-black/70 dark:text-white/70 group-hover:opacity-100'
                }
              `}
            >
              Admin
            </span>
          </button>
        )}
      </div>
    </nav>
  )
}

