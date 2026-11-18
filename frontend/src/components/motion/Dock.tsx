import { ReactNode, useEffect, useRef, useState, MouseEvent } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export type DockItemData = {
  icon?: ReactNode
  label?: string
  onClick?: () => void
  className?: string
  active?: boolean
  open?: boolean
  badge?: ReactNode
  separator?: boolean
}

export type DockProps = {
  items?: DockItemData[]
  className?: string
  accentColor?: string
  baseItemSize?: number
  magnification?: number
  showLabels?: boolean
}

/** Demi-largeur sur laquelle un item réagit à la proximité du pointeur (px). */
const INFLUENCE = 120

/**
 * Dock style macOS (inspiré React Bits Dock).
 *
 * La magnification passe par `transform: scale()` et non par `width`/`height` :
 * le panneau garde sa hauteur et aucun layout n'est recalculé au survol. Les
 * centres des items sont mis en cache (jamais de `getBoundingClientRect` par
 * mouvement) et les mouvements sont coalescés dans une frame.
 *
 * @see https://reactbits.dev/components/dock
 */
export function Dock({
  items = [],
  className = '',
  accentColor = 'var(--td-accent)',
  baseItemSize = 48,
  magnification = 64,
  showLabels = true,
}: DockProps) {
  const reduced = usePrefersReducedMotion()
  const rowRef = useRef<HTMLDivElement>(null)
  const centersRef = useRef<number[]>([])
  const pointerRef = useRef<number | null>(null)
  const frameRef = useRef(0)
  const [pointerX, setPointerX] = useState<number | null>(null)

  const measure = () => {
    const row = rowRef.current
    if (!row) return
    centersRef.current = Array.from(
      row.querySelectorAll<HTMLElement>('[data-dock-item]'),
      (item) => {
        const rect = item.getBoundingClientRect()
        return rect.left + rect.width / 2
      },
    )
  }

  useEffect(() => {
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [items.length])

  useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    },
    [],
  )

  const onMove = (event: MouseEvent) => {
    if (reduced) return
    pointerRef.current = event.clientX
    if (frameRef.current) return
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0
      setPointerX(pointerRef.current)
    })
  }

  const onLeave = () => {
    pointerRef.current = null
    setPointerX(null)
  }

  const scaleFor = (index: number) => {
    const center = centersRef.current[index]
    if (reduced || pointerX === null || center === undefined) return 1
    const falloff = Math.max(0, 1 - Math.abs(pointerX - center) / INFLUENCE)
    return 1 + (magnification / baseItemSize - 1) * falloff * falloff
  }

  let itemIndex = 0

  return (
    <div
      className={`pointer-events-auto flex items-end gap-2 rounded-[var(--td-radius-panel)] border border-[var(--td-edge-panel)] bg-[color-mix(in_srgb,var(--td-surface-elevated)_88%,transparent)] px-3 py-2 [box-shadow:var(--td-elevation-2)] backdrop-blur-xl ${className}`}
      style={{ ['--dock-accent' as string]: accentColor }}
      onMouseMove={onMove}
      onMouseEnter={measure}
      onMouseLeave={onLeave}
      ref={rowRef}
      role="toolbar"
      aria-label="Applications"
    >
      {items.map((item, index) => {
        if (item.separator) {
          return (
            <div
              key={`sep-${index}`}
              className="mx-1 w-px self-stretch bg-[var(--td-edge-panel)]"
              aria-hidden
            />
          )
        }
        const slot = itemIndex++
        return (
          <DockItemButton
            key={item.label ?? index}
            item={item}
            baseItemSize={baseItemSize}
            scale={scaleFor(slot)}
            showLabels={showLabels}
            accentColor={accentColor}
          />
        )
      })}
    </div>
  )
}

function DockItemButton({
  item,
  baseItemSize,
  scale,
  showLabels,
  accentColor,
}: {
  item: DockItemData
  baseItemSize: number
  scale: number
  showLabels: boolean
  accentColor: string
}) {
  return (
    <button
      type="button"
      data-dock-item=""
      onClick={item.onClick}
      className={`group relative flex flex-none items-center justify-center outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--td-focus)] ${item.className ?? ''}`}
      style={{ width: baseItemSize, height: baseItemSize }}
      aria-label={item.label}
      aria-current={item.active ? 'page' : undefined}
    >
      {showLabels && item.label && (
        <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-[var(--td-radius-control)] border border-[var(--td-edge-panel)] bg-[var(--td-surface-elevated)] px-2 py-1 text-[11px] font-medium text-[var(--td-text-primary)] opacity-0 [box-shadow:var(--td-elevation-2)] transition-opacity duration-[var(--td-duration-fast)] ease-[var(--td-ease-out)] group-hover:opacity-100 group-focus-visible:opacity-100">
          {item.label}
        </span>
      )}
      <span
        className={`flex h-full w-full items-center justify-center rounded-[var(--td-radius-card)] transition-[background-color,color,box-shadow,transform] duration-[var(--td-duration-fast)] ease-[var(--td-ease-out)] motion-reduce:transition-none ${
          item.active
            ? 'text-[var(--td-on-energy)]'
            : 'bg-[var(--td-surface-raised)] text-[var(--td-text-primary)] group-hover:bg-[var(--td-surface-elevated)]'
        }`}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'bottom center',
          background: item.active ? accentColor : undefined,
          boxShadow: item.active ? `0 6px 18px -6px ${accentColor}` : undefined,
        }}
      >
        <span className="flex scale-[1.1] items-center justify-center [&_svg]:h-[55%] [&_svg]:w-[55%]">
          {item.icon}
        </span>
        {item.badge != null && item.badge !== false && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[var(--td-danger)] px-1 text-[9px] font-bold text-[var(--td-on-danger)]">
            {item.badge}
          </span>
        )}
      </span>
      {item.open && (
        <span
          className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full"
          style={{
            background: item.active ? accentColor : 'var(--td-text-muted)',
            opacity: 0.7,
          }}
          aria-hidden
        />
      )}
    </button>
  )
}
