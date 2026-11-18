import { usePrefersReducedMotion } from './usePrefersReducedMotion'

export interface LogoLoopItem {
  name: string
  src: string
}

interface LogoLoopProps {
  logos: LogoLoopItem[]
  className?: string
  /** durée d’un cycle complet en secondes */
  duration?: number
  imgClassName?: string
}

export function LogoLoop({
  logos,
  className = '',
  duration = 28,
  imgClassName = 'h-16 w-auto max-w-[140px] object-contain opacity-80 dark:opacity-100 dark:brightness-0 dark:invert',
}: LogoLoopProps) {
  const reduced = usePrefersReducedMotion()

  if (logos.length === 0) return null

  if (reduced || logos.length === 1) {
    return (
      <div className={`flex items-center justify-center gap-8 p-4 ${className}`}>
        {logos.map((logo) => (
          <img key={logo.name} src={logo.src} alt={logo.name} className={imgClassName} />
        ))}
      </div>
    )
  }

  const track = [...logos, ...logos]

  return (
    <div className={`relative w-full overflow-hidden py-4 ${className}`}>
      <div
        className="flex w-max items-center gap-12 animate-logo-loop hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map((logo, i) => (
          <img
            key={`${logo.name}-${i}`}
            src={logo.src}
            alt={logo.name}
            className={`flex-shrink-0 ${imgClassName}`}
            draggable={false}
          />
        ))}
      </div>
    </div>
  )
}
