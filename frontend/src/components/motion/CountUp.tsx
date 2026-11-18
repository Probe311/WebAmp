import { useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface CountUpProps {
  to: number
  from?: number
  duration?: number
  className?: string
  formatter?: (n: number) => string
}

export function CountUp({
  to,
  from = 0,
  duration = 1.1,
  className = '',
  formatter = (n) => Math.round(n).toLocaleString(),
}: CountUpProps) {
  const reduced = usePrefersReducedMotion()
  const [value, setValue] = useState(reduced ? to : from)
  const raf = useRef<number>(0)
  const prevTo = useRef(to)

  useEffect(() => {
    if (reduced) {
      setValue(to)
      return
    }

    const start = performance.now()
    const fromVal = prevTo.current === to ? from : value
    prevTo.current = to

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(fromVal + (to - fromVal) * eased)
      if (t < 1) raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- animate when `to` changes
  }, [to, duration, reduced, from])

  return <span className={className}>{formatter(value)}</span>
}
