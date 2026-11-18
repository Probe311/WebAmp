import { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  showLogo?: boolean
}

/**
 * Carte d'authentification — surface `neu-flat-lg` du design system.
 * Aucune ombre ni couleur en dur : tout vient des tokens `--neu-*`.
 */
export function AuthCard({ title, subtitle, children, footer, showLogo = true }: Props) {
  return (
    <div className="mx-auto w-full max-w-md px-4 sm:px-6">
      <div className="neu-flat-lg neu-card space-y-6 border border-[color:var(--neu-edge)] bg-[color:var(--neu-bg)] p-8">
        {showLogo && (
          <div className="flex justify-center">
            <p
              className="hello-write select-none text-4xl lowercase leading-none text-[color:var(--neu-accent)]"
              aria-label="webamp"
            >
              <span className="hello-write__ink" aria-hidden>
                webamp
              </span>
            </p>
          </div>
        )}
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-[color:var(--neu-text)]">{title}</h1>
          {subtitle && <p className="text-sm text-[color:var(--neu-text-muted)]">{subtitle}</p>}
        </header>
        <div className="space-y-4">{children}</div>
        {footer && (
          <footer className="border-t border-[color:var(--neu-edge)] pt-4 text-xs text-[color:var(--neu-text-muted)]">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}
