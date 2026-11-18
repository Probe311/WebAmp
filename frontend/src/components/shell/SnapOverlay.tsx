import { GRID, WINDOW_GAP, type SnapZone } from '../../workspace/types'
import { rectForSnap } from '../../workspace/layoutMath'

interface SnapOverlayProps {
  zone: SnapZone | null
}

const GAP = WINDOW_GAP

/** Aperçu de la zone d'ancrage, aligné sur les rectangles réels du bureau. */
export function SnapOverlay({ zone }: SnapOverlayProps) {
  if (!zone) return null
  const rect = rectForSnap(zone)
  const half = GAP / 2

  return (
    <div className="pointer-events-none absolute inset-0 z-[500]">
      <div
        className="absolute rounded-[var(--td-radius-card)] border border-[var(--td-primary)]/70 bg-[color-mix(in_srgb,var(--td-primary)_8%,transparent)] transition-[left,top,width,height,opacity] duration-150 ease-out"
        style={{
          left: `calc(${(rect.col / GRID) * 100}% + ${half}px)`,
          top: `calc(${(rect.row / GRID) * 100}% + ${half}px)`,
          width: `calc(${(rect.w / GRID) * 100}% - ${GAP}px)`,
          height: `calc(${(rect.h / GRID) * 100}% - ${GAP}px)`,
        }}
      />
    </div>
  )
}
