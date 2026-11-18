import { motion } from 'motion/react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

type TextTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'

interface SplitTextProps {
  text: string
  className?: string
  tag?: TextTag
  delay?: number
  stagger?: number
}

export function SplitText({
  text,
  className = '',
  tag = 'p',
  delay = 0,
  stagger = 0.03,
}: SplitTextProps) {
  const reduced = usePrefersReducedMotion()
  const chars = Array.from(text)

  const body = reduced ? (
    text
  ) : (
    chars.map((char, i) => (
      <motion.span
        key={`${char}-${i}`}
        className="inline-block whitespace-pre"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay: delay + i * stagger,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {char}
      </motion.span>
    ))
  )

  if (tag === 'h1') return <motion.h1 className={className} aria-label={text}>{body}</motion.h1>
  if (tag === 'h2') return <motion.h2 className={className} aria-label={text}>{body}</motion.h2>
  if (tag === 'h3') return <motion.h3 className={className} aria-label={text}>{body}</motion.h3>
  if (tag === 'h4') return <motion.h4 className={className} aria-label={text}>{body}</motion.h4>
  if (tag === 'span') return <motion.span className={className} aria-label={text}>{body}</motion.span>
  return <motion.p className={className} aria-label={text}>{body}</motion.p>
}
