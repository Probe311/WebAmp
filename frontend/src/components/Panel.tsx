import React from 'react'
import { cx } from './ui/cx'

interface PanelProps {
  children: React.ReactNode
  icon?: React.ReactNode
  title?: string
  className?: string
  depth?: 'flat' | 'inset' | 'pressed'
}

const Panel: React.FC<PanelProps> = ({
  children,
  icon,
  title,
  className = '',
  depth = 'flat',
}) => {
  const surface =
    depth === 'inset' ? 'neu-inset' : depth === 'pressed' ? 'neu-pressed' : 'neu-flat'

  return (
    <div
      className={cx(
        surface,
        'neu-card rounded-3xl border-white/80 bg-[color:var(--neu-bg)] p-4 text-[color:var(--neu-text)]',
        className
      )}
    >
      {(icon || title) && (
        <div className="mb-2 flex items-center gap-2">
          {icon && <div className="text-[color:var(--neu-text-muted)]">{icon}</div>}
          {title && (
            <h3 className="text-xs font-bold uppercase tracking-wider text-[color:var(--neu-text)]">
              {title}
            </h3>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default Panel
