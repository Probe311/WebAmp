import { ReactNode, useRef, useState, MouseEvent } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'color-mix(in srgb, var(--td-energy) 18%, transparent)',
}: SpotlightCardProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={onMove}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 55%)`,
        }}
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  )
}
