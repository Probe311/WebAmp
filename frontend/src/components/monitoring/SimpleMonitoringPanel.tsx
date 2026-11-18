import type { MonitoringStats } from './types'
import { MONITORING_TRACK, statusTextClass } from './monitoringStyles'

interface SimpleMonitoringPanelProps {
  stats: MonitoringStats
}

const formatDb = (db: number) => {
  if (db <= -96) return '-∞'
  return db.toFixed(1) + ' dB'
}

const peakColor = (peak: number) => {
  if (peak > -3) return 'var(--td-danger)'
  if (peak > -6) return 'var(--td-warning)'
  return 'var(--td-success)'
}

export function SimpleMonitoringPanel({ stats }: SimpleMonitoringPanelProps) {
  return (
    <div className="flex flex-col gap-6 text-[var(--td-text-primary)]">
      <div className="grid grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--td-text-muted)]">CPU</label>
          <div className="text-xl font-semibold tabular-nums text-[var(--td-text-primary)]">
            <span className={statusTextClass(stats.cpu, { good: 60, warning: 80 })}>{stats.cpu.toFixed(1)}%</span>
          </div>
          <div className={`h-2 ${MONITORING_TRACK}`}>
            <div
              className="h-full bg-[linear-gradient(90deg,var(--td-success),var(--td-warning),var(--td-danger))] transition-[width] duration-100 ease-linear"
              style={{ width: `${Math.min(stats.cpu, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--td-text-muted)]">Latence</label>
          <div className="text-xl font-semibold tabular-nums text-[var(--td-text-primary)]">
            <span className={statusTextClass(stats.latency, { good: 5, warning: 10 })}>
              {stats.latency.toFixed(2)} ms
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--td-text-muted)]">Input Peak</label>
          <div className="text-xl font-semibold tabular-nums text-[var(--td-text-primary)]">
            {formatDb(stats.peakInput)}
          </div>
          <div className={`relative h-3 ${MONITORING_TRACK}`}>
            <div
              className="h-full rounded-[var(--td-radius-sm)] transition-[width,background-color] duration-[50ms] ease-linear"
              style={{
                width: `${Math.max(0, Math.min(100, (stats.peakInput + 96) / 0.96))}%`,
                backgroundColor: peakColor(stats.peakInput)
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-[var(--td-text-muted)]">Output Peak</label>
          <div className="text-xl font-semibold tabular-nums text-[var(--td-text-primary)]">
            {formatDb(stats.peakOutput)}
          </div>
          <div className={`relative h-3 ${MONITORING_TRACK}`}>
            <div
              className="h-full rounded-[var(--td-radius-sm)] transition-[width,background-color] duration-[50ms] ease-linear"
              style={{
                width: `${Math.max(0, Math.min(100, (stats.peakOutput + 96) / 0.96))}%`,
                backgroundColor: peakColor(stats.peakOutput)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
