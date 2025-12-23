import { ReactNode } from 'react'

interface MainBlockProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  title?: string
  headerActions?: ReactNode
}

/**
 * Composant Block principal pour le contenu central
 * Style neumorphic standard avec support pour un en-tête optionnel
 */
export function MainBlock({ children, className = '', onClick, title, headerActions }: MainBlockProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl
        shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)]
        dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)]
        ${title ? 'flex flex-col' : ''}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {title && (
        <div className="px-4 py-3 border-b-2 border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            {title}
          </h3>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      )}
      <div className={title ? 'flex-1 min-h-0' : ''}>
        {children}
      </div>
    </div>
  )
}

