import { ReactNode, useCallback, useRef, useState, MouseEvent, CSSProperties } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface Spark {
  id: number
  x: number
  y: number
  angle: number
}

interface ClickSparkProps {
  children: ReactNode
  className?: string
  color?: string
  sparkCount?: number
  disabled?: boolean
}

let sparkId = 0

export function ClickSpark({
  children,
  className = '',
  color = '#F26A1B',
  sparkCount = 8,
  disabled = false,
}: ClickSparkProps) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [sparks, setSparks] = useState<Spark[]>([])

  const burst = useCallback(
    (e: MouseEvent) => {
      if (disabled || reduced) return
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const next: Spark[] = Array.from({ length: sparkCount }, (_, i) => ({
        id: ++sparkId,
        x,
        y,
        angle: (360 / sparkCount) * i,
      }))
      setSparks((prev) => [...prev, ...next])
      window.setTimeout(() => {
        setSparks((prev) => prev.filter((s) => !next.some((n) => n.id === s.id)))
      }, 500)
    },
    [disabled, reduced, sparkCount]
  )

  return (
    <div ref={ref} className={`relative ${className}`} onClick={burst}>
      {children}
      {!reduced &&
        sparks.map((s) => {
          const style: CSSProperties = {
            left: s.x,
            top: s.y,
            background: color,
            ['--spark-angle' as string]: `${s.angle}deg`,
          }
          return <span key={s.id} aria-hidden className="click-spark-particle" style={style} />
        })}
    </div>
  )
}
