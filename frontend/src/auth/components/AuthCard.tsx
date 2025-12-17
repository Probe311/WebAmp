import { ReactNode } from 'react'
import { Zap } from 'lucide-react'

interface Props {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  showLogo?: boolean
}

export function AuthCard({ title, subtitle, children, footer, showLogo = true }: Props) {
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
        {showLogo && (
          <div className="flex justify-center">
            <div className="flex items-center gap-3">
              <Zap
                size={26}
                className="text-orange-500"
                style={{ animation: 'logoAnimation 2s ease-in-out infinite' }}
              />
              <span className="text-xl font-bold tracking-[2px] uppercase" style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
                WebAmp
              </span>
            </div>
          </div>
        )}
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

