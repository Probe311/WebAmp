import { useCallback, useRef, useState, type PointerEvent } from 'react'
import { GRID, type DesktopRect } from '../../../workspace/types'
import { rectAfterResize, type ResizeEdge } from '../../../workspace/layoutMath'

interface UseWindowResizeOptions {
  rect: DesktopRect
  desktopRef: React.RefObject<HTMLElement | null>
  enabled: boolean
  /** Aperçu pendant le redimensionnement (null pour revenir au rectangle réel). */
  onPreview: (rect: DesktopRect | null) => void
  /** Validation au relâchement. */
  onCommit: (rect: DesktopRect) => void
  /** Taille mini grille (ex. clavier MIDI). */
  minW?: number
  minH?: number
}

interface ResizeSession {
  pointerId: number
  edge: ResizeEdge
  origin: DesktopRect
  startX: number
  startY: number
  cellW: number
  cellH: number
}

/**
 * Redimensionnement d'une fenêtre par ses bords et coins.
 * Le bord saisi suit le pointeur, le bord opposé reste fixe ; la taille
 * est alignée sur la grille et bornée en largeur/hauteur minimales.
 */
export function useWindowResize({
  rect,
  desktopRef,
  enabled,
  onPreview,
  onCommit,
  minW,
  minH,
}: UseWindowResizeOptions) {
  const session = useRef<ResizeSession | null>(null)
  const [resizing, setResizing] = useState(false)

  const startResize = useCallback(
    (edge: ResizeEdge, e: PointerEvent<HTMLElement>) => {
      if (!enabled || e.button !== 0) return
      const desktop = desktopRef.current
      if (!desktop) return
      const box = desktop.getBoundingClientRect()
      e.preventDefault()
      session.current = {
        pointerId: e.pointerId,
        edge,
        origin: rect,
        startX: e.clientX,
        startY: e.clientY,
        cellW: box.width / GRID,
        cellH: box.height / GRID,
      }
      setResizing(true)
      // La capture peut échouer si le pointeur n'est plus actif : la poignée reste utilisable.
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId)
      } catch {
        /* ignore */
      }
    },
    [desktopRef, enabled, rect]
  )

  const rectFor = useCallback(
    (s: ResizeSession, clientX: number, clientY: number) => {
      return rectAfterResize(
        s.origin,
        s.edge,
        (clientX - s.startX) / s.cellW,
        (clientY - s.startY) / s.cellH,
        minW,
        minH
      )
    },
    [minH, minW]
  )

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const s = session.current
      if (!s) return
      onPreview(rectFor(s, e.clientX, e.clientY))
    },
    [onPreview, rectFor]
  )

  const end = useCallback(
    (e: PointerEvent<HTMLElement>, cancelled: boolean) => {
      const s = session.current
      if (!s) return
      session.current = null
      setResizing(false)
      try {
        e.currentTarget.releasePointerCapture?.(s.pointerId)
      } catch {
        /* ignore */
      }
      onPreview(null)
      if (!cancelled) onCommit(rectFor(s, e.clientX, e.clientY))
    },
    [onCommit, onPreview, rectFor]
  )

  const onPointerUp = useCallback((e: PointerEvent<HTMLElement>) => end(e, false), [end])
  const onPointerCancel = useCallback((e: PointerEvent<HTMLElement>) => end(e, true), [end])

  return { resizing, startResize, onPointerMove, onPointerUp, onPointerCancel }
}
