import { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  widthClassName?: string
  className?: string
  bodyClassName?: string
  headerRight?: ReactNode
  showCloseButton?: boolean
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  widthClassName = 'max-w-4xl',
  className = '',
  bodyClassName = '',
  headerRight,
  showCloseButton = true
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`modal-content bg-white dark:bg-gray-800 rounded-2xl p-0 w-[90%] ${widthClassName} max-h-[85vh] overflow-hidden ${className} transition-colors duration-200`}
        style={{
          boxShadow: document.documentElement.classList.contains('dark')
            ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(40, 40, 40, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)'
            : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton || headerRight) && (
          <div className="flex items-center justify-between p-6 border-b border-black/10 dark:border-white/10">
            {title ? <h2 className="text-xl font-semibold text-black/85 dark:text-white/90 m-0">{title}</h2> : <div />}
            <div className="flex items-center gap-3">
              {headerRight}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white dark:bg-gray-700 rounded-lg text-black/85 dark:text-white/90 cursor-pointer flex items-center justify-center transition-all duration-200 touch-manipulation"
                  style={{
                    minWidth: '44px',
                    minHeight: '44px',
                    boxShadow: document.documentElement.classList.contains('dark')
                      ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                      : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                      ? '3px 3px 6px rgba(0, 0, 0, 0.6), -3px -3px 6px rgba(70, 70, 70, 0.6)'
                      : '3px 3px 6px rgba(0, 0, 0, 0.1), -3px -3px 6px rgba(255, 255, 255, 1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                      ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                      : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                      ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
                      : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.5)'
                    e.currentTarget.style.transform = 'scale(0.95)'
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.boxShadow = document.documentElement.classList.contains('dark')
                      ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                      : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    const target = e.currentTarget
                    target.style.boxShadow = document.documentElement.classList.contains('dark')
                      ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
                      : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.5)'
                    target.style.transform = 'scale(0.95)'
                    onClose()
                  }}
                  onTouchEnd={(e) => {
                    const target = e.currentTarget
                    target.style.boxShadow = document.documentElement.classList.contains('dark')
                      ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                      : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
                    target.style.transform = 'scale(1)'
                  }}
                  aria-label="Fermer le modal"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
        )}

        <div className={bodyClassName}>
          {children}
        </div>
      </div>
    </div>
  )
}

