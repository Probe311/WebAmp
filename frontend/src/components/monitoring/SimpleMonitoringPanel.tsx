import type { MonitoringStats } from './types'

interface SimpleMonitoringPanelProps {
  stats: MonitoringStats
}

const formatDb = (db: number) => {
  if (db <= -96) return '-∞'
  return db.toFixed(1) + ' dB'
}

export function SimpleMonitoringPanel({ stats }: SimpleMonitoringPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-black/70 dark:text-white/70 text-xs font-medium">CPU</label>
          <div className="text-xl font-semibold text-black/85 dark:text-white/90">
            <span className={stats.cpu > 80 ? 'text-red-500' : stats.cpu > 60 ? 'text-yellow-500' : 'text-green-500'}>
              {stats.cpu.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-2 bg-[#f5f5f5] dark:bg-gray-700 rounded-md overflow-hidden shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-[width] duration-100 ease-linear"
              style={{ width: `${Math.min(stats.cpu, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-black/70 dark:text-white/70 text-xs font-medium">Latence</label>
          <div className="text-xl font-semibold text-black/85 dark:text-white/90">
            <span className={stats.latency > 10 ? 'text-red-500' : stats.latency > 5 ? 'text-yellow-500' : 'text-green-500'}>
              {stats.latency.toFixed(2)} ms
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-black/70 dark:text-white/70 text-xs font-medium">Input Peak</label>
          <div className="text-xl font-semibold text-black/85 dark:text-white/90">
            {formatDb(stats.peakInput)}
          </div>
          <div className="w-full h-3 bg-[#f5f5f5] dark:bg-gray-700 rounded-md overflow-hidden relative shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]">
            <div 
              className="h-full rounded-md transition-[width,background-color] duration-[50ms] ease-linear"
              style={{ 
                width: `${Math.max(0, Math.min(100, (stats.peakInput + 96) / 0.96))}%`,
                backgroundColor: stats.peakInput > -3 ? '#ef4444' : stats.peakInput > -6 ? '#f59e0b' : '#22c55e'
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-black/70 dark:text-white/70 text-xs font-medium">Output Peak</label>
          <div className="text-xl font-semibold text-black/85 dark:text-white/90">
            {formatDb(stats.peakOutput)}
          </div>
          <div className="w-full h-3 bg-[#f5f5f5] dark:bg-gray-700 rounded-md overflow-hidden relative shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]">
            <div 
              className="h-full rounded-md transition-[width,background-color] duration-[50ms] ease-linear"
              style={{ 
                width: `${Math.max(0, Math.min(100, (stats.peakOutput + 96) / 0.96))}%`,
                backgroundColor: stats.peakOutput > -3 ? '#ef4444' : stats.peakOutput > -6 ? '#f59e0b' : '#22c55e'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

