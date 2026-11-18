import type { PointerEvent } from 'react'
import type { ResizeEdge } from '../../../workspace/layoutMath'

export interface WindowResizeHandlers {
  onStart: (edge: ResizeEdge, e: PointerEvent<HTMLElement>) => void
  onPointerMove: (e: PointerEvent<HTMLElement>) => void
  onPointerUp: (e: PointerEvent<HTMLElement>) => void
  onPointerCancel: (e: PointerEvent<HTMLElement>) => void
}

const HANDLES: Array<{ edge: ResizeEdge; className: string }> = [
  { edge: 'n', className: '-top-1 left-3 right-3 h-2 cursor-ns-resize' },
  { edge: 's', className: '-bottom-1 left-3 right-3 h-2 cursor-ns-resize' },
  { edge: 'w', className: '-left-1 top-3 bottom-3 w-2 cursor-ew-resize' },
  { edge: 'e', className: '-right-1 top-3 bottom-3 w-2 cursor-ew-resize' },
  { edge: 'nw', className: '-left-1 -top-1 h-3.5 w-3.5 cursor-nwse-resize' },
  { edge: 'ne', className: '-right-1 -top-1 h-3.5 w-3.5 cursor-nesw-resize' },
  { edge: 'sw', className: '-bottom-1 -left-1 h-3.5 w-3.5 cursor-nesw-resize' },
  { edge: 'se', className: '-bottom-1 -right-1 h-3.5 w-3.5 cursor-nwse-resize' },
]

/** Points de saisie du redimensionnement sur le pourtour. */
export function WindowResizeHandles({ handlers }: { handlers: WindowResizeHandlers }) {
  return (
    <>
      {HANDLES.map(({ edge, className }) => (
        <div
          key={edge}
          aria-hidden="true"
          data-resize-handle={edge}
          className={`absolute z-30 touch-none ${className}`}
          onPointerDown={(e) => handlers.onStart(edge, e)}
          onPointerMove={handlers.onPointerMove}
          onPointerUp={handlers.onPointerUp}
          onPointerCancel={handlers.onPointerCancel}
        />
      ))}
    </>
  )
}
