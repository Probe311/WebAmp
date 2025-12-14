import { useState } from 'react'
import { Activity, Zap } from 'lucide-react'
import { CTA } from './CTA'
import { Modal } from './Modal'
import { SystemMonitoringPanel } from './monitoring/SystemMonitoringPanel'

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
}

export function TopBanner({
  searchQuery,
  onSearchChange,
  stats: _stats,
  onProfileSelect: _onProfileSelect
}: TopBannerProps) {
  const [showMonitoring, setShowMonitoring] = useState(false)


  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 rounded-b-3xl shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)] z-[100] transition-colors duration-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Zap 
              size={28} 
              className="text-orange-500 dark:text-orange-400"
              style={{
                animation: 'logoAnimation 2s ease-in-out infinite'
              }}
            />
            <span className="text-2xl font-bold text-black/85 dark:text-white/90 tracking-[2px] uppercase">WebAmp</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-[500px] mx-8">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-6 py-3 bg-white dark:bg-gray-700 rounded-3xl text-black/85 dark:text-white/90 text-sm transition-all duration-200
              shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
              dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]
              focus:outline-none focus:border-black/10 dark:focus:border-white/20
              focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.07),inset_-3px_-3px_6px_rgba(255,255,255,1)]
              dark:focus:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-3px_-3px_6px_rgba(70,70,70,0.6)]
              placeholder:text-black/50 dark:placeholder:text-white/50 placeholder:font-medium"
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
        bodyClassName="p-6 overflow-y-auto max-h-[calc(80vh-80px)]"
      >
        <SystemMonitoringPanel />
      </Modal>
    </>
  )
}
