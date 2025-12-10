import { MonitoringPanel } from './monitoring/MonitoringPanel'
import type { MonitoringStats } from './monitoring/types'

export type Stats = MonitoringStats

interface StatsPanelProps {
  stats: MonitoringStats
}

export function StatsPanel({ stats }: StatsPanelProps) {
  return <MonitoringPanel stats={stats} />
}
