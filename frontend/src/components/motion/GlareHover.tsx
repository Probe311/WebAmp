import { ReactNode, useRef, useState, MouseEvent } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface GlareHoverProps {
  children: ReactNode
  className?: string
  glareColor?: string
}

export function GlareHover({
  children,
  className = '',
  glareColor = 'var(--td-glare)',
}: GlareHoverProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [active, setActive] = useState(false)

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={onMove}
    >
      {children}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, ${glareColor}, transparent 55%)`,
        }}
      />
    </div>
  )
}
