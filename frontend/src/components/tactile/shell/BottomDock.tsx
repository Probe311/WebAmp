import type { ReactNode, Ref } from 'react'
import { cx } from '../../ui/cx'
import { DOCK_ORANGE } from './dockTile'

export interface DockItem {
  id: string
  label: string
  icon: ReactNode
  /** Pastille numérique (0 / undefined = masquée). */
  badge?: number
  /** Remplace `onChange` (ex. ouvrir un menu au lieu d'une app). */
  onSelect?: () => void
  /** Contenu flottant (menu) — positionné relative à l'item. */
  flyout?: ReactNode
  /** Ref sur le wrapper (ex. dismissible menu = bouton + flyout). */
  containerRef?: Ref<HTMLDivElement>
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export type DockEntry = DockItem | { type: 'separator'; id: string }

export interface BottomDockProps {
  items: readonly DockEntry[]
  /** Id focus actuel — chaîne vide si aucune fenêtre. */
  value: string
  onChange: (id: string) => void
  /** Ids des fenêtres ouvertes. */
  openIds?: readonly string[]
  label?: string
  className?: string
}

function isSeparator(entry: DockEntry): entry is { type: 'separator'; id: string } {
  return 'type' in entry && entry.type === 'separator'
}

/**
 * Dock d'icônes (kit NEU).
 * - cliqué / focus : neu-pressed + orange + ring
 * - ouvert (pas focus) : texte orange léger, relief plat
 * - fermé : neu-flat muted
 */
export function BottomDock({
  items,
  value,
  onChange,
  openIds,
  label = 'Navigation principale',
  className,
}: BottomDockProps) {
  const openSet = openIds ? new Set(openIds) : null

  return (
    <nav
      aria-label={label}
      className={cx(
        'neu-flat-lg neu-theme-transition flex items-center gap-2 rounded-3xl border border-[color:var(--neu-edge)] px-3 py-3 sm:gap-3 sm:px-4',
        className
      )}
    >
      {items.map((entry) => {
        if (isSeparator(entry)) {
          return (
            <span
              key={entry.id}
              role="separator"
              aria-hidden
              className="mx-1 h-8 w-px shrink-0 self-center bg-[color:var(--neu-edge)]"
            />
          )
        }

        const item = entry
        const isOpen = openSet ? openSet.has(item.id) : false
        const isActive = isOpen && item.id === value

        const hasMenu = Boolean(item.onSelect)

        return (
          <div
            key={item.id}
            ref={item.containerRef}
            className="group relative"
            onMouseEnter={item.onMouseEnter}
            onMouseLeave={item.onMouseLeave}
          >
            {!item.flyout && (
              <span
                role="tooltip"
                className="neu-flat pointer-events-none absolute -top-11 left-1/2 z-10 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-xl px-3 py-1 text-[11px] font-bold text-[color:var(--neu-text)] opacity-0 transition-all duration-200 ease-[var(--neu-ease)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
              >
                {item.label}
              </span>
            )}

            {/* Hors flux ; pb (pas mb) = pont hover jusqu'au bouton, sinon le menu se ferme. */}
            {item.flyout != null && (
              <div className="absolute bottom-full left-1/2 z-50 -translate-x-1/2 pb-2">
                {item.flyout}
              </div>
            )}

            <button
              type="button"
              data-dock-id={item.id}
              title={item.label}
              aria-label={item.label}
              aria-haspopup={hasMenu ? 'menu' : undefined}
              aria-expanded={hasMenu ? Boolean(item.flyout) : undefined}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => (item.onSelect ? item.onSelect() : onChange(item.id))}
              className={cx(
                'relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl transition-all duration-200 md:rounded-2xl',
                isActive
                  ? 'neu-pressed text-[#F26A1B] ring-2 ring-[#F26A1B]/30'
                  : isOpen
                    ? 'neu-flat text-[#F26A1B] hover:text-[#F26A1B] active:neu-pressed'
                    : 'neu-flat text-[color:var(--neu-text-muted)] hover:text-[color:var(--neu-text)] active:neu-pressed'
              )}
            >
              {item.icon}
              {!!item.badge && (
                <span
                  className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[9px] font-bold text-white"
                  style={{ backgroundColor: DOCK_ORANGE, boxShadow: `0 0 6px ${DOCK_ORANGE}` }}
                  aria-label={`${item.badge} notifications`}
                >
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </button>
          </div>
        )
      })}
    </nav>
  )
}
