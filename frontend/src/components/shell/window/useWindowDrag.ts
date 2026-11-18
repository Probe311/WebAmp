import { useCallback, useRef, useState, type PointerEvent } from 'react'
import { GRID, type DesktopRect, type SnapZone } from '../../../workspace/types'
import { rectAfterDrag, rectForSnap, snapZoneFromPoint } from '../../../workspace/layoutMath'

interface UseWindowDragOptions {
  rect: DesktopRect
  desktopRef: React.RefObject<HTMLElement | null>
  enabled: boolean
  /** Aperçu pendant le déplacement (null pour revenir à la position réelle). */
  onPreview: (rect: DesktopRect | null) => void
  /** Validation au relâchement. */
  onCommit: (rect: DesktopRect) => void
  onZoneChange: (zone: SnapZone | null) => void
}

interface DragSession {
  pointerId: number
  startX: number
  startY: number
  origin: DesktopRect
  cellW: number
  cellH: number
}

/**
 * Déplacement d'une fenêtre par sa barre de titre.
 * Le rectangle est aligné sur la grille du bureau ; à l'approche d'un bord,
 * la zone d'ancrage est proposée et prend le relais au relâchement.
 */
export function useWindowDrag({
  rect,
  desktopRef,
  enabled,
  onPreview,
  onCommit,
  onZoneChange,
}: UseWindowDragOptions) {
  const session = useRef<DragSession | null>(null)
  const [dragging, setDragging] = useState(false)

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (!enabled || e.button !== 0) return
      const desktop = desktopRef.current
      if (!desktop) return
      const box = desktop.getBoundingClientRect()
      session.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        origin: rect,
        cellW: box.width / GRID,
        cellH: box.height / GRID,
      }
      setDragging(true)
      // La capture peut échouer si le pointeur n'est plus actif : le drag reste utilisable.
      try {
        e.currentTarget.setPointerCapture?.(e.pointerId)
      } catch {
        /* ignore */
      }
    },
    [desktopRef, enabled, rect]
  )

  const onPointerMove = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      const s = session.current
      const desktop = desktopRef.current
      if (!s || !desktop) return
      const box = desktop.getBoundingClientRect()
      const nx = (e.clientX - box.left) / box.width
      const ny = (e.clientY - box.top) / box.height
      const zone = snapZoneFromPoint(nx, ny)
      onZoneChange(zone)
      // Fenêtre suit le curseur même en zone snap (l’overlay montre la cible ; plus de téléport).
      onPreview(
        rectAfterDrag(s.origin, (e.clientX - s.startX) / s.cellW, (e.clientY - s.startY) / s.cellH)
      )
    },
    [desktopRef, onPreview, onZoneChange]
  )

  const end = useCallback(
    (e: PointerEvent<HTMLElement>, cancelled: boolean) => {
      const s = session.current
      if (!s) return
      session.current = null
      setDragging(false)
      try {
        e.currentTarget.releasePointerCapture?.(s.pointerId)
      } catch {
        /* ignore */
      }

      const desktop = desktopRef.current
      if (cancelled || !desktop) {
        onPreview(null)
        onZoneChange(null)
        return
      }

      const box = desktop.getBoundingClientRect()
      const nx = (e.clientX - box.left) / box.width
      const ny = (e.clientY - box.top) / box.height
      const zone = snapZoneFromPoint(nx, ny)
      onZoneChange(null)
      onPreview(null)
      onCommit(
        zone
          ? rectForSnap(zone)
          : rectAfterDrag(
              s.origin,
              (e.clientX - s.startX) / s.cellW,
              (e.clientY - s.startY) / s.cellH
            )
      )
    },
    [desktopRef, onCommit, onPreview, onZoneChange]
  )

  const onPointerUp = useCallback((e: PointerEvent<HTMLElement>) => end(e, false), [end])
  const onPointerCancel = useCallback((e: PointerEvent<HTMLElement>) => end(e, true), [end])

  return { dragging, onPointerDown, onPointerMove, onPointerUp, onPointerCancel }
}
