import { createContext, useCallback, useContext, useMemo, useRef, useState, ReactNode } from 'react'
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react'

export type ToastVariant = 'success' | 'info' | 'warning' | 'error'

interface ToastInput {
  title?: string
  message: string
  variant?: ToastVariant
  duration?: number
}

interface Toast extends ToastInput {
  id: string
  variant: ToastVariant
  duration: number
}

interface ToastContextValue {
  showToast: (toast: ToastInput) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

const DEFAULT_DURATION = 4200
const CONTAINER_CLASSES = 'fixed top-4 right-4 z-[200] flex flex-col gap-3 max-w-sm'
const CARD_BASE_CLASSES = 'flex w-full items-start gap-3 rounded-2xl border shadow-[4px_6px_12px_rgba(0,0,0,0.15)]'

const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: JSX.Element }> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-600',
    icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />
  },
  info: {
    bg: 'bg-sky-50',
    border: 'border-sky-600',
    icon: <Info className="w-5 h-5 text-sky-600" />
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-600',
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
  },
  error: {
    bg: 'bg-rose-50',
    border: 'border-rose-600',
    icon: <AlertCircle className="w-5 h-5 text-rose-600" />
  }
}

let toastCounter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
    const timer = timers.current[id]
    if (timer) {
      clearTimeout(timer)
      delete timers.current[id]
    }
  }, [])

  const showToast = useCallback((toast: ToastInput) => {
    const id = `toast-${Date.now()}-${toastCounter++}`
    const duration = toast.duration ?? DEFAULT_DURATION
    const nextToast: Toast = {
      id,
      duration,
      title: toast.title,
      message: toast.message,
      variant: toast.variant ?? 'info'
    }

    setToasts((prev) => [...prev, nextToast])

    if (duration > 0) {
      timers.current[id] = setTimeout(() => hideToast(id), duration)
    }
  }, [hideToast])

  const value = useMemo(() => ({ showToast, hideToast }), [showToast, hideToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={CONTAINER_CLASSES}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast doit être utilisé à l’intérieur d’un ToastProvider')
  }
  return context
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const style = variantStyles[toast.variant]

  return (
    <div
      className={`${CARD_BASE_CLASSES} ${style.bg} ${style.border}`}
      role="status"
      aria-live="polite"
    >
      <div className="pl-4 pr-2 py-3">
        {style.icon}
      </div>
      <div className="flex-1 py-3 pr-4">
        {toast.title && <p className="text-sm font-semibold text-gray-900">{toast.title}</p>}
        <p className="text-sm text-gray-800 leading-relaxed">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        aria-label="Fermer la notification"
        className="p-2 text-gray-500 hover:text-gray-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

