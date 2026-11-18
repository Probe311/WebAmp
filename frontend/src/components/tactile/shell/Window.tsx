import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { Maximize2, Minimize2, Minus, Pin, X } from 'lucide-react'
import { cx } from '../../ui/cx'
import { WINDOW_CHROME_TILE_CLASS, WINDOW_CHROME_TOOLBAR_CLASS } from './dockTile'

export type WindowSize = 'sm' | 'md' | 'lg'

const SIZES: Record<WindowSize, { w: number; h: number }> = {
  sm: { w: 320, h: 240 },
  md: { w: 480, h: 340 },
  lg: { w: 680, h: 460 },
}

export interface WindowProps {
  title: string
  icon?: ReactNode
  children: ReactNode
  initialPosition?: { x: number; y: number }
  initialSize?: WindowSize
  /** Alias doc kit — mappe sur `initialSize` md si seuls w/h sont passés. */
  initialWidth?: number
  initialHeight?: number
  onClose?: () => void
  className?: string
}

/**
 * Fenêtre flottante kit (`position: fixed`) — source de vérité chrome.
 * Shell workspace réutilise les mêmes tuiles via `WINDOW_CHROME_*`.
 */
export function Window({
  title,
  icon,
  children,
  initialPosition = { x: 80, y: 80 },
  initialSize = 'md',
  initialWidth,
  initialHeight,
  onClose,
  className,
}: WindowProps) {
  const [pos, setPos] = useState(initialPosition)
  const [size, setSize] = useState<WindowSize>(initialSize)
  const [pinned, setPinned] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const drag = useRef<{ dx: number; dy: number } | null>(null)

  const canDrag = !pinned && !maximized
  const customBox =
    initialWidth != null && initialHeight != null
      ? { w: initialWidth, h: initialHeight }
      : null

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!canDrag || (e.target as HTMLElement).closest('button')) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y }
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    const w = customBox?.w ?? SIZES[size].w
    setPos({
      x: Math.min(Math.max(e.clientX - drag.current.dx, 0), window.innerWidth - Math.min(w, 120)),
      y: Math.min(Math.max(e.clientY - drag.current.dy, 0), window.innerHeight - 40),
    })
  }

  const endDrag = () => {
    drag.current = null
  }

  const box = maximized
    ? { inset: 16 }
    : {
        left: pos.x,
        top: pos.y,
        width: customBox?.w ?? SIZES[size].w,
        height: minimized ? undefined : customBox?.h ?? SIZES[size].h,
      }

  return (
    <section
      role="dialog"
      aria-label={title}
      className={cx(
        // overflow-visible : l'ombre neu-window ne doit pas être mangée par un parent serré
        'neu-window fixed flex flex-col overflow-visible rounded-[var(--td-radius-panel)] border border-[color:var(--neu-edge)] bg-[color:var(--neu-bg)]',
        pinned ? 'z-50' : 'z-40',
        className
      )}
      style={box}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => setMaximized((v) => !v)}
        className={cx(
          'flex shrink-0 touch-none select-none items-center gap-2 rounded-t-[var(--td-radius-panel)] px-4 py-2.5',
          canDrag ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        )}
      >
        {icon && <span className="text-[color:var(--neu-accent)]">{icon}</span>}
        <h2 className="min-w-0 flex-1 truncate text-xs font-bold text-[color:var(--neu-text)]">
          {title}
        </h2>

        {!maximized && !customBox && (
          <div
            className="mr-1 flex items-center gap-0.5 rounded-lg bg-[color:var(--neu-bg-track)] p-0.5"
            role="group"
            aria-label="Taille"
          >
            {(Object.keys(SIZES) as WindowSize[]).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={size === s}
                onClick={() => setSize(s)}
                className={cx(
                  'h-6 w-6 cursor-pointer rounded-md text-[9px] font-bold uppercase transition-colors',
                  size === s
                    ? 'neu-pressed text-[color:var(--neu-accent)]'
                    : 'text-[color:var(--neu-text-faint)] hover:text-[color:var(--neu-text)]'
                )}
              >
                {s[0]}
              </button>
            ))}
          </div>
        )}

        <div className={WINDOW_CHROME_TOOLBAR_CLASS} role="toolbar" aria-label="Contrôles">
          <button
            type="button"
            aria-label="Épingler"
            aria-pressed={pinned}
            onClick={() => setPinned((v) => !v)}
            className={cx(WINDOW_CHROME_TILE_CLASS, pinned && 'neu-pressed text-[color:var(--neu-accent)]')}
          >
            <Pin size={12} />
          </button>
          <button
            type="button"
            aria-label={minimized ? 'Restaurer' : 'Réduire'}
            onClick={() => setMinimized((v) => !v)}
            className={WINDOW_CHROME_TILE_CLASS}
          >
            <Minus size={12} />
          </button>
          <button
            type="button"
            aria-label={maximized ? 'Réduire la taille' : 'Agrandir'}
            onClick={() => setMaximized((v) => !v)}
            className={WINDOW_CHROME_TILE_CLASS}
          >
            {maximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
          {onClose && (
            <button
              type="button"
              aria-label="Fermer"
              onClick={onClose}
              className={cx(WINDOW_CHROME_TILE_CLASS, 'hover:text-rose-500')}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {!minimized && (
        <div className="neu-inset m-3 mt-0 min-h-0 flex-1 overflow-auto rounded-2xl p-4 text-xs text-[color:var(--neu-text-muted)]">
          {children}
        </div>
      )}
    </section>
  )
}
