import type { PointerEvent } from 'react'
import { FaIcon } from '../../../icons/fa'
import type { SizeId } from '../../../workspace/types'
import { cx } from '../../ui/cx'
import {
  DOCK_ORANGE,
  WINDOW_CHROME_TILE_CLASS,
  WINDOW_CHROME_TOOLBAR_CLASS,
} from '../../tactile/shell/dockTile'
import { WindowSizeMenu } from './WindowSizeMenu'

export interface WindowDragHandlers {
  onPointerDown: (e: PointerEvent<HTMLElement>) => void
  onPointerMove: (e: PointerEvent<HTMLElement>) => void
  onPointerUp: (e: PointerEvent<HTMLElement>) => void
  onPointerCancel: (e: PointerEvent<HTMLElement>) => void
}

interface WindowTitleBarProps {
  title: string
  focused?: boolean
  pinned: boolean
  sizeId: SizeId | null
  draggable: boolean
  dragHandlers: WindowDragHandlers
  onTogglePin: () => void
  onSelectSize: (sizeId: SizeId) => void
  onClose: () => void
}

/**
 * Entête alignée sur `tactile/shell/Window` :
 * px-4 py-2.5, contrôles ghost carrés arrondis, marge au bord, pas de well inset.
 */
export function WindowTitleBar({
  title,
  focused = false,
  pinned,
  sizeId,
  draggable,
  dragHandlers,
  onTogglePin,
  onSelectSize,
  onClose,
}: WindowTitleBarProps) {
  return (
    <div
      className={cx(
        'flex w-full shrink-0 touch-none select-none items-center gap-2 rounded-t-[var(--td-radius-panel)] border-b border-[color:var(--neu-edge)] bg-[color:var(--neu-bg)] px-4 py-2.5',
        draggable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default',
        focused ? 'text-[color:var(--neu-text)]' : 'text-[color:var(--neu-text-muted)]'
      )}
      {...(draggable ? dragHandlers : {})}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span
          aria-hidden
          className={cx(
            'h-2 w-2 shrink-0 rounded-full transition-colors duration-200',
            focused
              ? 'shadow-[0_0_6px_var(--neu-accent-glow)]'
              : 'bg-[color:var(--neu-text-faint)]'
          )}
          style={focused ? { backgroundColor: DOCK_ORANGE } : undefined}
        />
        <h2 className="min-w-0 truncate text-xs font-bold tracking-[0.02em]">{title}</h2>
      </div>

      <div
        role="toolbar"
        aria-label="Contrôles de la fenêtre"
        className={WINDOW_CHROME_TOOLBAR_CLASS}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          title={pinned ? 'Désépingler la fenêtre' : 'Épingler la fenêtre'}
          aria-label={pinned ? 'Désépingler la fenêtre' : 'Épingler la fenêtre'}
          aria-pressed={pinned}
          onClick={onTogglePin}
          className={cx(
            WINDOW_CHROME_TILE_CLASS,
            pinned && 'neu-pressed text-[#F26A1B]'
          )}
        >
          <FaIcon icon="thumbtack" className="h-3 w-3" />
        </button>

        <WindowSizeMenu sizeId={sizeId} onSelect={onSelectSize} />

        <button
          type="button"
          title="Fermer"
          aria-label="Fermer"
          onClick={onClose}
          className={cx(WINDOW_CHROME_TILE_CLASS, 'hover:text-rose-500')}
        >
          <FaIcon icon="xmark" className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
