import { useState } from 'react'
import { Activity, Zap } from 'lucide-react'
import { CTA } from './CTA'
import { Modal } from './Modal'
import { SystemMonitoringPanel } from './monitoring/SystemMonitoringPanel'
import { SearchBar } from './SearchBar'

interface TopBannerProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  stats: {
    cpu: number
    latency: number
    peakInput: number
    peakOutput: number
  }
  onProfileSelect?: (profileName: string) => void
  onLogoClick?: () => void
}

export function TopBanner({
  searchQuery,
  onSearchChange,
  stats: _stats,
  onProfileSelect: _onProfileSelect,
  onLogoClick
}: TopBannerProps) {
  const [showMonitoring, setShowMonitoring] = useState(false)


  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 rounded-b-3xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] z-[100] transition-colors duration-200">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onLogoClick}
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-lg transition hover:opacity-90"
            aria-label="Revenir à l'accueil"
          >
            <Zap 
              size={28} 
              className="text-orange-500 dark:text-orange-400"
              style={{
                animation: 'logoAnimation 2s ease-in-out infinite'
              }}
            />
            <span className="text-2xl font-bold text-black/85 dark:text-white/90 tracking-[2px] uppercase">WebAmp</span>
          </button>
        </div>
        
        <div className="flex-1 max-w-[500px] mx-8">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Rechercher..."
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <CTA
            variant="icon-only"
            icon={<Activity size={20} />}
            onClick={() => setShowMonitoring(true)}
            title="Monitoring système"
            active={showMonitoring}
          />
        </div>
      </header>

      <Modal
        isOpen={showMonitoring}
        onClose={() => setShowMonitoring(false)}
        title="Monitoring système"
        widthClassName="max-w-6xl"
        bodyClassName="p-6 overflow-y-auto custom-scrollbar max-h-[calc(80vh-80px)]"
      >
        <SystemMonitoringPanel />
      </Modal>
    </>
  )
}
