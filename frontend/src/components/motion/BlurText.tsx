import { motion } from 'motion/react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'

interface BlurTextProps {
  text: string
  className?: string
  tag?: TextTag
  delay?: number
}

export function BlurText({
  text,
  className = '',
  tag = 'p',
  delay = 0.15,
}: BlurTextProps) {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    if (tag === 'h1') return <h1 className={className}>{text}</h1>
    if (tag === 'h2') return <h2 className={className}>{text}</h2>
    if (tag === 'h3') return <h3 className={className}>{text}</h3>
    if (tag === 'h4') return <h4 className={className}>{text}</h4>
    if (tag === 'span') return <span className={className}>{text}</span>
    return <p className={className}>{text}</p>
  }

  const anim = {
    initial: { opacity: 0, filter: 'blur(12px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  }

  if (tag === 'h1') return <motion.h1 className={className} {...anim}>{text}</motion.h1>
  if (tag === 'h2') return <motion.h2 className={className} {...anim}>{text}</motion.h2>
  if (tag === 'h3') return <motion.h3 className={className} {...anim}>{text}</motion.h3>
  if (tag === 'h4') return <motion.h4 className={className} {...anim}>{text}</motion.h4>
  if (tag === 'span') return <motion.span className={className} {...anim}>{text}</motion.span>
  return <motion.p className={className} {...anim}>{text}</motion.p>
}
