import { motion } from 'motion/react'
import { ReactNode } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface FadeContentProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function FadeContent({
  children,
  className = '',
  delay = 0,
  y = 16,
}: FadeContentProps) {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
