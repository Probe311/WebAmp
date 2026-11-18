import { ReactNode, useRef, useState, MouseEvent } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface BorderGlowProps {
  children: ReactNode
  className?: string
  glowColor?: string
}

export function BorderGlow({
  children,
  className = '',
  glowColor = 'var(--td-energy)',
}: BorderGlowProps) {
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
      className={`relative ${className}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onMouseMove={onMove}
      style={{
        boxShadow: active
          ? `0 0 0 1px color-mix(in srgb, ${glowColor} 55%, transparent), 0 0 24px color-mix(in srgb, ${glowColor} 25%, transparent)`
          : undefined,
        backgroundImage: active
          ? `radial-gradient(circle at ${pos.x}% ${pos.y}%, color-mix(in srgb, ${glowColor} 55%, transparent), transparent 40%)`
          : undefined,
        backgroundOrigin: 'border-box',
        transition: 'box-shadow 0.25s ease',
      }}
    >
      {children}
    </div>
  )
}
