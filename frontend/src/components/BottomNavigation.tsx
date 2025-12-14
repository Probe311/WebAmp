import { LayoutDashboard, Repeat, Music, BookOpen, Settings, User, Drum, Sliders, BoomBox } from 'lucide-react'
import { useDrumMachine } from '../contexts/DrumMachineContext'

export type PageId = 'home' | 'webamp' | 'looper' | 'practice' | 'learn' | 'mixing' | 'drummachine' | 'settings' | 'account'

interface BottomNavigationProps {
  currentPage: PageId
  onPageChange: (page: PageId) => void
  isAuthenticated?: boolean
}

interface NavItem {
  id: PageId
  icon: typeof LayoutDashboard
  label: string
  requiresAuth?: boolean
}

const navItems: NavItem[] = [
  { id: 'home', icon: LayoutDashboard, label: 'Home' },
  { id: 'webamp', icon: BoomBox, label: 'WebAmp' },
  { id: 'looper', icon: Repeat, label: 'Looper' },
  { id: 'practice', icon: Music, label: 'Practice' },
  { id: 'learn', icon: BookOpen, label: 'Learn' },
  { id: 'mixing', icon: Sliders, label: 'Mix' },
  { id: 'drummachine', icon: Drum, label: 'Drums' },
  { id: 'settings', icon: Settings, label: 'Settings' },
  { id: 'account', icon: User, label: 'Account', requiresAuth: true }
]

export function BottomNavigation({ currentPage, onPageChange, isAuthenticated = false }: BottomNavigationProps) {
  const { isActive: isDrumMachineActive } = useDrumMachine()

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-white dark:bg-gray-700 rounded-3xl px-6 py-4 flex items-center gap-6 shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] border border-black/10 dark:border-white/10">
        {navItems.map((item) => {
          // Masquer les éléments nécessitant une authentification si l'utilisateur n'est pas connecté
          if (item.requiresAuth && !isAuthenticated) {
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
      </div>
    </nav>
  )
}

