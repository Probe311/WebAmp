import { useState, type ReactNode } from 'react'
import { Modal } from '../Modal'
import { SystemMonitoringPanel } from '../monitoring/SystemMonitoringPanel'
import { SearchBar } from '../SearchBar'
import { ThemeSwitch } from './ThemeSwitch'
import { WebAmpBrandLogo } from './WebAmpBrandLogo'
import { cx } from '../ui/cx'
import { FaIcon } from '../../icons/fa'
import { DOCK_TILE_CLASS } from '../tactile/shell/dockTile'

interface ShellHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onLogoClick: () => void
  /** Actions supplémentaires alignées à droite. */
  actions?: ReactNode
}

/**
 * En-tête du shell — panneau kit NEU (marque, Search, ThemeSwitch, actions).
 */
export function ShellHeader({ searchQuery, onSearchChange, onLogoClick, actions }: ShellHeaderProps) {
  const [showMonitoring, setShowMonitoring] = useState(false)

  return (
    <>
      <header
        className={cx(
          'neu-flat neu-theme-transition relative z-[var(--td-z-header,30)] mx-[var(--td-shell-gap,0.75rem)] mt-[var(--td-shell-gap,0.75rem)]',
          'flex flex-shrink-0 items-center gap-3 rounded-3xl border border-[color:var(--neu-edge)] px-3 py-2'
        )}
      >
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center rounded-full px-2 py-1 transition hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/50"
          aria-label="Revenir à l'accueil"
        >
          <WebAmpBrandLogo className="h-10 sm:h-11" />
        </button>

        <div className="min-w-0 max-w-[520px] flex-1">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Rechercher..."
            appearance="neumorphic"
            className="w-full"
          />
        </div>

        <div className="ml-auto flex flex-none items-center gap-2">
          {actions}
          <ThemeSwitch />
          <button
            type="button"
            aria-label="Monitoring système"
            title="Monitoring système"
            aria-pressed={showMonitoring}
            onClick={() => setShowMonitoring(true)}
            className={cx(
              DOCK_TILE_CLASS,
              showMonitoring && 'neu-pressed text-[color:var(--neu-accent)] ring-2 ring-[color:var(--neu-accent)]/30'
            )}
          >
            <FaIcon icon="wave-pulse" className="h-5 w-5" />
          </button>
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
