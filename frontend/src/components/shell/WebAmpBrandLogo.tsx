import logoSvg from '../../assets/brand/webamp-logo.svg?raw'
import { cx } from '../ui/cx'

interface WebAmpBrandLogoProps {
  className?: string
}

/**
 * Logo marque inline (pas `<img>`) pour que `.logo-studio` suive le thème.
 * Light → #1C1A18 · Dark → blanc. Le wordmark orange reste #f26a1b.
 */
export function WebAmpBrandLogo({ className }: WebAmpBrandLogoProps) {
  return (
    <span
      className={cx(
        'webamp-brand-logo inline-flex [&_svg]:h-full [&_svg]:w-auto',
        className
      )}
      role="img"
      aria-label="WebAmp"
      dangerouslySetInnerHTML={{ __html: logoSvg }}
    />
  )
}
