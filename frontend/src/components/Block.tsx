import { ReactNode } from 'react'
import { GlareHover, SpotlightCard, BorderGlow, FadeContent } from './motion'
import { Panel } from './tactile/primitives'
import { cx } from './ui/cx'

interface BlockProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  /** Soft orange spotlight that follows the pointer */
  spotlight?: boolean
  /** Glossy glare streak on hover */
  glare?: boolean
  /** Soft border glow that tracks the pointer */
  borderGlow?: boolean
  /** Fade / slide in when entering the viewport */
  fadeIn?: boolean
  fadeDelay?: number
  /** Profondeur : relief (défaut) ou creux */
  depth?: 'flat' | 'inset' | 'pressed'
}

/**
 * Carte app — façade kit `Panel` (raised / inset) + effets motion optionnels.
 */
export function Block({
  children,
  className = '',
  onClick,
  spotlight = false,
  glare = false,
  borderGlow = false,
  fadeIn = false,
  fadeDelay = 0,
  depth = 'flat',
}: BlockProps) {
  let inner: ReactNode = children

  if (spotlight) {
    inner = <SpotlightCard className="h-full rounded-3xl">{inner}</SpotlightCard>
  }

  if (glare) {
    inner = <GlareHover className="h-full rounded-3xl">{inner}</GlareHover>
  }

  if (borderGlow) {
    inner = <BorderGlow className="h-full rounded-3xl">{inner}</BorderGlow>
  }

  const content = (
    <Panel
      depth={depth === 'inset' ? 'inset' : depth === 'pressed' ? 'pressed' : 'flat'}
      className={cx(
        'h-full rounded-3xl p-4 text-[color:var(--neu-text)]',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {inner}
    </Panel>
  )

  if (fadeIn) {
    return <FadeContent delay={fadeDelay}>{content}</FadeContent>
  }

  return content
}
