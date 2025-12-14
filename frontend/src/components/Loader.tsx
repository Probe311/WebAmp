import { Zap } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export interface LoaderProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showText?: boolean
  text?: string
  fullScreen?: boolean
  variant?: 'full' | 'light'
}

export function Loader({ 
  size = 'md', 
  className = '', 
  showText = true,
  text = 'Chargement...',
  fullScreen = false,
  variant = 'full'
}: LoaderProps) {
  const { theme } = useTheme()
  
  const sizeClasses = {
    sm: 24,
    md: 48,
    lg: 72
  }

  const iconSize = sizeClasses[size]

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-gray-900'
    : `flex flex-col items-center justify-center ${className}`

  // Version light : uniquement l'éclair avec animation
  if (variant === 'light') {
    return (
      <div className={containerClasses}>
        <Zap 
          size={iconSize} 
          className="text-orange-500 dark:text-orange-400 lightning-bolt"
        />
      </div>
    )
  }

  // Version complète (par défaut)
  return (
    <div className={containerClasses}>
      <div className="relative flex flex-col items-center justify-center">
        {/* Logo Zap avec animation */}
        <Zap 
          size={iconSize} 
          className="text-orange-500 dark:text-orange-400 transition-all duration-300"
          style={{
            animation: 'logoAnimation 2s ease-in-out infinite'
          }}
        />
        
        {/* Effet de brillance animé */}
        <div 
          className="absolute inset-0 opacity-20 rounded-full"
          style={{
            background: `radial-gradient(circle, ${
              theme === 'dark' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'
            } 0%, transparent 70%)`,
            animation: 'pulse 1.5s ease-in-out infinite',
            width: `${iconSize * 1.5}px`,
            height: `${iconSize * 1.5}px`,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
      
      {/* Texte WebAmp */}
      {showText && (
        <div className="mt-6 flex flex-col items-center gap-2">
          <span className={`text-2xl font-bold ${
            theme === 'dark' ? 'text-white/90' : 'text-black/85'
          } tracking-[2px] uppercase`}>
            WebAmp
          </span>
          <p className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {text}
          </p>
        </div>
      )}
    </div>
  )
}

