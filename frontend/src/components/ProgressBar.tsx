import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

export interface ProgressBarProps {
  value: number
  min?: number
  max?: number
  label?: string
  color?: string
  orientation?: 'vertical' | 'horizontal'
  height?: string
  width?: string
  showValue?: boolean
  onChange?: (value: number) => void
  disabled?: boolean
  className?: string
}

export function ProgressBar({
  value,
  min = 0,
  max = 100,
  label = '',
  color = '#fff',
  orientation = 'vertical',
  height,
  width,
  showValue = false,
  onChange,
  disabled = false,
  className = ''
}: ProgressBarProps) {
  const [isDragging, setIsDragging] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const startPosRef = useRef(0)
  const startValueRef = useRef(0)

  const percentage = useMemo(() => ((value - min) / (max - min)) * 100, [value, min, max])
  const isInteractive = onChange !== undefined && !disabled

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isInteractive) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    startPosRef.current = orientation === 'horizontal' ? e.clientX : e.clientY
    startValueRef.current = value
  }, [isInteractive, orientation, value])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isInteractive) return
    e.preventDefault()
    const range = max - min
    const sensitivity = range / 100
    const delta = orientation === 'horizontal'
      ? e.deltaX * sensitivity * 0.01
      : -e.deltaY * sensitivity * 0.01
    const newValue = Math.max(min, Math.min(max, value + delta))
    onChange?.(newValue)
  }, [isInteractive, min, max, orientation, value, onChange])

  useEffect(() => {
    if (!isDragging || !isInteractive) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!barRef.current) return
      const rect = barRef.current.getBoundingClientRect()
      const delta = orientation === 'horizontal'
        ? e.clientX - startPosRef.current
        : startPosRef.current - e.clientY
      const range = max - min
      const size = orientation === 'horizontal' ? rect.width : rect.height
      const sensitivity = range / size
      const valueDelta = delta * sensitivity
      const newValue = Math.max(min, Math.min(max, startValueRef.current + valueDelta))
      onChange?.(newValue)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isInteractive, min, max, onChange, orientation])

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isInteractive || !barRef.current || isDragging) return
    const rect = barRef.current.getBoundingClientRect()
    if (orientation === 'horizontal') {
      const clickX = e.clientX - rect.left
      const percentage = clickX / rect.width
      const newValue = min + (max - min) * percentage
      onChange?.(Math.max(min, Math.min(max, newValue)))
    } else {
      const clickY = e.clientY - rect.top
      const percentage = 1 - (clickY / rect.height)
      const newValue = min + (max - min) * percentage
      onChange?.(Math.max(min, Math.min(max, newValue)))
    }
  }, [isInteractive, isDragging, orientation, min, max, onChange])

  const defaultHeight = orientation === 'vertical' ? '120px' : '8px'
  const defaultWidth = orientation === 'horizontal' ? '200px' : '8px'
  // `#fff` est le sentinelle historique « couleur par défaut ».
  const fillColor = color !== '#fff' ? color : 'var(--td-primary)'

  const thumbClass =
    'absolute z-[2] grid place-items-center rounded-full border border-[var(--td-primary-strong)] bg-[var(--td-control-surface)] shadow-[var(--td-control-shadow)] transition-transform duration-100 hover:scale-110 active:scale-95 active:shadow-[var(--td-control-shadow-pressed)]'

  return (
    <div
      className={`progress-bar-container flex w-full min-w-0 items-center gap-2 ${
        orientation === 'horizontal' ? 'progress-bar-horizontal flex-row' : 'progress-bar-vertical flex-col'
      } ${className}`.trim()}
    >
      {label && (
        <label
          className={`min-w-[45px] text-[0.55rem] font-bold uppercase tracking-[0.5px] text-[var(--td-text-secondary)] ${
            orientation === 'horizontal' ? 'min-w-[50px] text-left' : 'text-center'
          }`}
        >
          {label}
        </label>
      )}
      <div
        ref={barRef}
        className={`relative flex select-none touch-none items-center justify-center transition-transform duration-100 ${
          orientation === 'horizontal' ? 'flex-1 px-2' : 'w-full py-2'
        } ${isInteractive && !disabled ? 'hover:scale-[1.02]' : ''} ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onClick={handleClick}
        style={{
          cursor: isInteractive && !disabled ? (isDragging ? 'grabbing' : 'grab') : 'default',
          height: height || defaultHeight,
          width: width || defaultWidth
        }}
      >
        <div
          className={`relative overflow-hidden rounded-[var(--td-radius-sm)] border border-[var(--td-edge-panel)] bg-[var(--td-control-track)] shadow-[var(--td-control-shadow-pressed)] ${
            orientation === 'horizontal' ? 'h-2 w-full' : 'h-full w-3'
          }`}
        >
          {orientation === 'horizontal' ? (
            <>
              <div
                className="absolute top-0 left-0 h-full opacity-80 transition-[width] duration-[50ms] ease-linear"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: fillColor
                }}
              />
              {isInteractive && (
                <div className={thumbClass} style={{ left: `${percentage}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 22, height: 22 }}>
                  <span className="absolute h-1.5 w-1.5 rounded-full bg-[var(--td-surface-inset)]" />
                </div>
              )}
            </>
          ) : (
            <>
              <div
                className="absolute bottom-0 left-0 right-0 opacity-80 transition-[height] duration-[50ms] ease-linear"
                style={{
                  height: `${percentage}%`,
                  backgroundColor: fillColor
                }}
              />
              {isInteractive && (
                <div className={thumbClass} style={{ bottom: `${percentage}%`, left: '50%', transform: 'translate(-50%, 50%)', width: 24, height: 24 }}>
                  <span className="absolute h-1.5 w-1.5 rounded-full bg-[var(--td-surface-inset)]" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showValue && (
        <div className="min-h-[0.9rem] min-w-[25px] text-center text-[0.6rem] font-bold tabular-nums text-[var(--td-text-primary)]">
          {Math.round(value)}
        </div>
      )}
    </div>
  )
}
