import { ReactNode } from 'react'

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="max-w-md w-full mx-auto px-4 sm:px-6">
      <div 
        className="bg-white rounded-2xl p-8 space-y-6"
        style={{
          boxShadow: `
            8px 8px 16px rgba(0, 0, 0, 0.1),
            -8px -8px 16px rgba(255, 255, 255, 0.9),
            inset 0 0 0 1px rgba(255, 255, 255, 0.8)
          `
        }}
      >
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold" style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm" style={{ color: 'rgba(0, 0, 0, 0.7)' }}>
              {subtitle}
            </p>
          )}
        </header>
        <div className="space-y-4">
          {children}
        </div>
        {footer && (
          <footer 
            className="pt-4 border-t text-xs"
            style={{ 
              borderColor: 'rgba(0, 0, 0, 0.1)',
              color: 'rgba(0, 0, 0, 0.7)'
            }}
          >
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

