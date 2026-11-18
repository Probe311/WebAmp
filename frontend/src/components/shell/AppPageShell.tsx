import type { ReactNode } from 'react'
import { cx } from '../ui/cx'

export interface AppPageShellProps {
  /** Sous-titre court — le titre vit dans la barre de fenêtre. */
  description?: string
  /** Remplit la hauteur (outils type DAW / clavier) sans scroll page. */
  fill?: boolean
  className?: string
  children: ReactNode
}

/**
 * Cadre commun des pages dock : padding NEU, plus de pb-28 legacy,
 * pas de H1 dupliqué (label = title bar).
 */
export function AppPageShell({ description, fill = false, className, children }: AppPageShellProps) {
  return (
    <div
      className={cx(
        'custom-scrollbar bg-[color:var(--neu-bg)]',
        // pas d'overflow-hidden : coupe les glows neu-accent-btn / tuiles près du bord
        fill ? 'flex h-full min-h-0 flex-col' : 'h-full overflow-y-auto',
        /* px/pb : bleed ombres CTA Softube (elevate bas ~14px) */
        'px-5 pb-6 pt-4 sm:px-6 sm:pb-7 sm:pt-5',
        className
      )}
    >
      {description ? (
        <p className="mb-4 shrink-0 text-sm text-[color:var(--neu-text-muted)]">{description}</p>
      ) : null}
      <div className={cx(fill && 'flex min-h-0 flex-1 flex-col')}>{children}</div>
    </div>
  )
}
