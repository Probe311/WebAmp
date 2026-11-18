import { ReactNode, useRef, useState, PointerEvent } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface SwipeToastProps {
  children: ReactNode
  duration: number
  onDismiss: () => void
  className?: string
}

export function SwipeToast({ children, duration, onDismiss, className = '' }: SwipeToastProps) {
  const reduced = usePrefersReducedMotion()
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-160, 0, 160], [0, 1, 0])
  const startX = useRef(0)
  const [dragging, setDragging] = useState(false)

  const dismiss = () => {
    animate(x, 220, { duration: 0.2 }).then(onDismiss)
  }

  const onPointerDown = (e: PointerEvent) => {
    if (reduced) return
    startX.current = e.clientX
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!dragging || reduced) return
    x.set(e.clientX - startX.current)
  }

  const onPointerUp = () => {
    if (!dragging) return
    setDragging(false)
    if (Math.abs(x.get()) > 80) {
      dismiss()
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 })
    }
  }

  if (reduced) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {duration > 0 && (
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-orange-500/70"
            style={{ width: '100%', animation: `toast-fuse ${duration}ms linear forwards` }}
          />
        )}
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={`relative overflow-hidden touch-pan-y ${className}`}
      style={{ x, opacity }}
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {duration > 0 && (
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-orange-500/70 origin-left"
          style={{ animation: `toast-fuse ${duration}ms linear forwards` }}
        />
      )}
      {children}
    </motion.div>
  )
}
