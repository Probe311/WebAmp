import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { WindowTitleBar, type WindowDragHandlers } from './WindowTitleBar'
import type { SizeId } from '../../../workspace/types'
import { cx } from '../../ui/cx'

interface WindowFrameProps {
  title: string
  focused: boolean
  pinned: boolean
  sizeId: SizeId | null
  draggable: boolean
  resizeHandles?: ReactNode
  interacting?: boolean
  closing?: boolean
  /** Repli vers l'icône dock (`data-dock-id`). */
  minimized?: boolean
  dockId?: string
  dragHandlers: WindowDragHandlers
  onTogglePin: () => void
  onSelectSize: (sizeId: SizeId) => void
  onClose: () => void
  onFocus: () => void
  style: CSSProperties
  className?: string
  children: ReactNode
}

/** Sortie : alignée sur `--neu-duration-fast` / `--td-duration-fast`. */
export const WINDOW_CLOSE_MS = 160
export const WINDOW_MINIMIZE_MS = 220
const WINDOW_ENTER_MS = 220

type FramePhase = 'enter' | 'idle' | 'settled' | 'exit' | 'minimize' | 'stowed'

const PHASE_CLASSES: Record<FramePhase, string> = {
  enter: 'origin-bottom translate-y-4 scale-[0.97] opacity-0',
  idle: 'origin-bottom translate-y-0 scale-100 opacity-100',
  settled: '',
  exit: 'origin-bottom translate-y-3 scale-[0.97] opacity-0',
  minimize: 'opacity-0',
  stowed: 'pointer-events-none opacity-0',
}

function transformToDock(frame: HTMLElement, dockId: string): string | null {
  const dock = document.querySelector<HTMLElement>(`[data-dock-id="${dockId}"]`)
  if (!dock) return null
  const a = frame.getBoundingClientRect()
  const b = dock.getBoundingClientRect()
  const dx = b.left + b.width / 2 - (a.left + a.width / 2)
  const dy = b.top + b.height / 2 - (a.top + a.height / 2)
  return `translate(${dx}px, ${dy}px) scale(0.08)`
}

/**
 * Chrome d'une fenêtre : relief NEU, bordure `--neu-edge` 1px, entrée/sortie / minimize dock.
 */
export function WindowFrame({
  title,
  focused,
  pinned,
  sizeId,
  draggable,
  resizeHandles,
  interacting = false,
  closing = false,
  minimized = false,
  dockId,
  dragHandlers,
  onTogglePin,
  onSelectSize,
  onClose,
  onFocus,
  style,
  className = '',
  children,
}: WindowFrameProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<FramePhase>(closing ? 'exit' : minimized ? 'stowed' : 'enter')
  const [dockTransform, setDockTransform] = useState<string | undefined>()

  useEffect(() => {
    if (closing) {
      setPhase('exit')
      setDockTransform(undefined)
      return
    }

    if (minimized) {
      const el = frameRef.current
      const transform =
        el && dockId ? transformToDock(el, dockId) : 'translateY(48px) scale(0.12)'
      setDockTransform(transform ?? 'translateY(48px) scale(0.12)')
      // ponytail: FLIP CSS one-shot ; upgrade = GSAP genie si besoin de courbes.
      requestAnimationFrame(() => setPhase('minimize'))
      const stow = setTimeout(() => setPhase('stowed'), WINDOW_MINIMIZE_MS)
      return () => clearTimeout(stow)
    }

    setDockTransform(undefined)
    if (phase === 'stowed' || phase === 'minimize') {
      setPhase('enter')
    }
    const frame = requestAnimationFrame(() => setPhase('idle'))
    const settle = setTimeout(() => setPhase('settled'), WINDOW_ENTER_MS + 40)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settle)
    }
    // phase volontairement omise : on ne relance l'entrée que sur minimized/closing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing, minimized, dockId])

  const stowed = phase === 'stowed'
  const motion = interacting
    ? 'transition-none'
    : closing || phase === 'minimize'
      ? 'transition-[left,top,width,height,opacity,transform,box-shadow] duration-200 ease-[var(--neu-ease)]'
      : 'transition-[left,top,width,height,opacity,transform,box-shadow] duration-200 ease-[var(--neu-ease)]'

  return (
    <div
      ref={frameRef}
      data-window-frame=""
      data-window-phase={phase}
      aria-hidden={closing || minimized || undefined}
      className={cx(
        // Softube panel radius ; overflow-visible : menu taille + resize
        'absolute flex min-h-0 min-w-0 flex-col overflow-visible rounded-[var(--td-radius-panel)] bg-[color:var(--neu-bg)]',
        PHASE_CLASSES[phase],
        motion,
        (closing || minimized) && 'pointer-events-none',
        stowed && 'invisible',
        focused && !minimized ? 'neu-window-focus' : 'neu-window',
        className
      )}
      style={{
        ...style,
        transform: dockTransform && (phase === 'minimize' || phase === 'stowed') ? dockTransform : style.transform,
      }}
      onPointerDown={onFocus}
    >
      <WindowTitleBar
        title={title}
        focused={focused && !minimized}
        pinned={pinned}
        sizeId={sizeId}
        draggable={draggable}
        dragHandlers={dragHandlers}
        onTogglePin={onTogglePin}
        onSelectSize={onSelectSize}
        onClose={onClose}
      />
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-b-[var(--td-radius-panel)] bg-[color:var(--neu-bg)]">
        <div className="custom-scrollbar h-full min-h-0 overflow-y-auto">{children}</div>
      </div>
      {resizeHandles}
    </div>
  )
}
