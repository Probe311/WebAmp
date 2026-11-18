import { cx } from './ui/cx'

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** Sous-titre optionnel — désactivé par défaut (écriture « webamp » seule). */
  showText?: boolean
  text?: string
  fullScreen?: boolean
  variant?: 'full' | 'light'
}

const WORD_SIZE: Record<NonNullable<LoaderProps['size']>, string> = {
  sm: 'text-3xl',
  md: 'text-5xl',
  lg: 'text-6xl sm:text-7xl',
}

/**
 * Loader d'écriture « webamp » — police Macintosh Skeletal Filled
 * ([npwitk/Macintosh-Skeletal-Filled](https://github.com/npwitk/Macintosh-Skeletal-Filled)).
 */
export function Loader({
  size = 'md',
  className = '',
  showText = false,
  text,
  fullScreen = false,
  variant = 'full',
}: LoaderProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[color:var(--neu-bg)]'
    : cx('flex flex-col items-center justify-center', className)

  return (
    <div className={containerClasses} role="status" aria-live="polite" aria-label="webamp">
      <p
        className={cx(
          'hello-write hello-write--loop select-none lowercase leading-none text-[#F26A1B]',
          WORD_SIZE[size]
        )}
        aria-hidden
      >
        <span className="hello-write__ink">webamp</span>
      </p>
      {variant !== 'light' && showText && text ? (
        <p className="mt-8 text-sm font-medium text-[color:var(--neu-text-muted)]">{text}</p>
      ) : null}
    </div>
  )
}
