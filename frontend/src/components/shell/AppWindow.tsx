import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { OpenWindow } from '../../workspace/types'
import { APP_LABELS, APP_MIN_SIZE, GRID, WINDOW_GAP } from '../../workspace/types'
import { sizeIdForRect, zIndexFor } from '../../workspace/layoutMath'
import { useWorkspace } from '../../workspace/WorkspaceContext'
import { useSnapHost } from './SnapHost'
import { WindowFrame, WINDOW_CLOSE_MS } from './window/WindowFrame'
import { WindowResizeHandles } from './window/WindowResizeHandles'
import { useWindowDrag } from './window/useWindowDrag'
import { useWindowResize } from './window/useWindowResize'

interface AppWindowProps {
  window: OpenWindow
  /** Rang d'empilement (ordre croissant = devant). */
  index: number
  children: ReactNode
  desktopRef: React.RefObject<HTMLElement | null>
}

const GAP = WINDOW_GAP

/** Adaptateur bureau → chrome de fenêtre : position, drag, tailles, épinglage. */
export function AppWindow({ window: win, index, children, desktopRef }: AppWindowProps) {
  const { focusWindow, closeWindow, setRect, resizeWindow, togglePinned, isMobileLayout } =
    useWorkspace()
  const { setZone } = useSnapHost()
  const [preview, setPreview] = useState<OpenWindow['rect'] | null>(null)
  const [closing, setClosing] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // La fenêtre reste montée le temps de l'animation de sortie : son contenu
  // n'est pas démonté puis remonté, il s'efface simplement avec le cadre.
  const requestClose = () => {
    if (closing) return
    setClosing(true)
    closeTimer.current = setTimeout(() => closeWindow(win.id), WINDOW_CLOSE_MS)
  }

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const editable = !isMobileLayout

  const drag = useWindowDrag({
    rect: win.rect,
    desktopRef,
    enabled: editable,
    onPreview: setPreview,
    onCommit: (rect) => setRect(win.id, rect),
    onZoneChange: setZone,
  })

  const minSize = APP_MIN_SIZE[win.appId]
  const resize = useWindowResize({
    rect: win.rect,
    desktopRef,
    enabled: editable,
    onPreview: setPreview,
    onCommit: (rect) => setRect(win.id, rect),
    minW: minSize?.w,
    minH: minSize?.h,
  })

  const rect = preview ?? win.rect
  const half = GAP / 2
  const style = {
    left: `calc(${(rect.col / GRID) * 100}% + ${half}px)`,
    top: `calc(${(rect.row / GRID) * 100}% + ${half}px)`,
    width: `calc(${(rect.w / GRID) * 100}% - ${GAP}px)`,
    height: `calc(${(rect.h / GRID) * 100}% - ${GAP}px)`,
    zIndex: zIndexFor(win, index),
  }

  const dockId =
    win.appId === 'webamp'
      ? 'pedalboard'
      : win.appId === 'metronome' || win.appId === 'chords' || win.appId === 'tuner'
        ? 'practice'
        : win.appId

  return (
    <WindowFrame
      title={APP_LABELS[win.appId]}
      focused={win.focused && !win.minimized}
      pinned={win.pinned}
      sizeId={sizeIdForRect(win.rect)}
      draggable={editable && !win.minimized}
      interacting={drag.dragging || resize.resizing}
      closing={closing}
      minimized={win.minimized}
      dockId={dockId}
      resizeHandles={
        editable && !win.minimized ? (
          <WindowResizeHandles
            handlers={{
              onStart: resize.startResize,
              onPointerMove: resize.onPointerMove,
              onPointerUp: resize.onPointerUp,
              onPointerCancel: resize.onPointerCancel,
            }}
          />
        ) : null
      }
      dragHandlers={{
        onPointerDown: drag.onPointerDown,
        onPointerMove: drag.onPointerMove,
        onPointerUp: drag.onPointerUp,
        onPointerCancel: drag.onPointerCancel,
      }}
      onTogglePin={() => togglePinned(win.id)}
      onSelectSize={(sizeId) => resizeWindow(win.id, sizeId)}
      onClose={requestClose}
      onFocus={() => focusWindow(win.id)}
      style={style}
    >
      {children}
    </WindowFrame>
  )
}
