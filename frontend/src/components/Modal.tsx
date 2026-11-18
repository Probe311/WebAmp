import { ReactNode, useEffect } from 'react'
import { X } from 'lucide-react'
import { cx } from './ui/cx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  widthClassName?: string
  className?: string
  bodyClassName?: string
  headerRight?: ReactNode
  showCloseButton?: boolean
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

/**
 * Modale neumorphique — tokens `--neu-*` / classes `neu-*`.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  widthClassName = 'max-w-4xl',
  className = '',
  bodyClassName = '',
  headerRight,
  showCloseButton = true,
  confirmText,
  cancelText,
  onConfirm,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx(
          'neu-flat-lg neu-card flex max-h-[85vh] w-full flex-col overflow-hidden text-[color:var(--neu-text)]',
          widthClassName,
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton || headerRight) && (
          <div className="flex items-start justify-between gap-4 border-b border-[color:var(--neu-edge)] p-6">
            <div>
              {title ? (
                <h2 className="m-0 text-base font-bold text-[color:var(--neu-text)]">{title}</h2>
              ) : null}
              {description ? (
                <p className="mt-0.5 text-xs text-[color:var(--neu-text-faint)]">{description}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              {headerRight}
              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  title="Fermer"
                  className="neu-flat flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[color:var(--neu-text-faint)] transition-all hover:text-[color:var(--neu-text)] active:neu-pressed"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className={cx('overflow-y-auto', bodyClassName || 'p-6')}>{children}</div>

        {(confirmText || cancelText) && (
          <div className="flex items-center justify-end gap-3 border-t border-[color:var(--neu-edge)] p-4">
            {cancelText && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-xs font-semibold text-[color:var(--neu-text-muted)] hover:neu-flat"
              >
                {cancelText}
              </button>
            )}
            {confirmText && (
              <button
                type="button"
                onClick={() => {
                  onConfirm?.()
                  onClose()
                }}
                className="neu-accent-btn rounded-full px-6 py-2.5 text-sm font-semibold"
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
