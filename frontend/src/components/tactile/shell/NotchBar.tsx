import { useState, type ReactNode } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import { cx } from '../../ui/cx'

export interface NotchTab {
  id: string
  label: string
  icon?: ReactNode
}

export interface NotchBarProps {
  tabs: readonly NotchTab[]
  value: string
  onChange: (id: string) => void
  label?: string
  /** Panneau de démo optionnel (réglages), ouvert via un bouton dans l'encoche. */
  controls?: ReactNode
  className?: string
}

/** Coin concave en SVG qui raccorde l'encoche au bord supérieur. */
function Corner({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 20 20"
      className={cx('absolute top-0 fill-[var(--neu-bg)]', side === 'left' ? '-left-5' : '-right-5 -scale-x-100')}
    >
      <path d="M0 0H20V20C20 9 11 0 0 0Z" />
    </svg>
  )
}

/** Barre d'onglets en encoche, accrochée au haut de son conteneur (`relative`). */
export function NotchBar({ tabs, value, onChange, label = 'Sections', controls, className }: NotchBarProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className={cx('absolute left-1/2 top-0 z-30 -translate-x-1/2', className)}>
      <div className="relative flex items-center gap-1 rounded-b-3xl border-x border-b border-[color:var(--neu-edge)] bg-[color:var(--neu-bg)] px-4 pb-2 pt-1.5 shadow-[0_12px_24px_rgba(var(--neu-shadow-dark),0.35)]">
        <Corner side="left" />
        <Corner side="right" />

        <div role="tablist" aria-label={label} className="flex items-center gap-1">
          {tabs.map((tab) => {
            const isActive = tab.id === value
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.id)}
                className={cx(
                  'flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                  isActive
                    ? 'neu-pressed font-bold text-[color:var(--neu-accent)]'
                    : 'text-[color:var(--neu-text-muted)] hover:neu-flat-sm hover:text-[color:var(--neu-text)]'
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            )
          })}
        </div>

        {controls && (
          <button
            type="button"
            aria-label="Réglages de démonstration"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cx(
              'ml-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[color:var(--neu-text-muted)] transition-colors hover:text-[color:var(--neu-text)]',
              open && 'neu-pressed text-[color:var(--neu-accent)]'
            )}
          >
            <SlidersHorizontal size={14} />
          </button>
        )}

        {controls && open && (
          <div className="neu-flat-lg absolute left-1/2 top-full mt-3 w-72 -translate-x-1/2 rounded-3xl border border-[color:var(--neu-edge)] p-4 text-xs text-[color:var(--neu-text-muted)]">
            {controls}
          </div>
        )}
      </div>
    </div>
  )
}
