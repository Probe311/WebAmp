import type { ReactNode } from 'react'
import { Award, TrendingUp } from 'lucide-react'
import { getLevelFromXP } from '../../utils/lmsLevelService'
import { cx } from '../ui/cx'

interface ProgressBadgeProps {
  xp: number
  completedCount?: number
  totalCount?: number
}

interface MetricProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  /** Compteur « écran » : puits encastré plutôt qu'un relief. */
  inset?: boolean
}

function Metric({ label, value, icon, inset = false }: MetricProps) {
  return (
    <div className={cx('flex items-center gap-2 rounded-2xl px-4 py-2', inset ? 'neu-inset' : 'neu-flat-sm')}>
      {icon && <span className="text-[color:var(--neu-accent)]">{icon}</span>}
      <div className="flex flex-col">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--neu-text-muted)]">
          {label}
        </span>
        <span className="font-mono text-lg font-bold tabular-nums text-[color:var(--neu-text)]">{value}</span>
      </div>
    </div>
  )
}

/** Lecture de progression — trois métriques, une seule primitive. */
export function ProgressBadge({ xp, completedCount = 0, totalCount = 0 }: ProgressBadgeProps) {
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Metric label="XP Total" value={xp} icon={<Award size={18} />} inset />
      <Metric label="Niveau" value={getLevelFromXP(xp)} icon={<TrendingUp size={18} />} />
      {totalCount > 0 && (
        <Metric label="Complété" value={`${completedCount}/${totalCount} (${completionPercentage} %)`} />
      )}
    </div>
  )
}
