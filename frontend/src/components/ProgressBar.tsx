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
  const fillColor = color !== '#fff' ? color : 'rgba(0, 0, 0, 0.4)'

  return (
    <div
      className={`progress-bar-container flex items-center gap-2 w-full min-w-0 ${
        orientation === 'horizontal' ? 'progress-bar-horizontal flex-row' : 'progress-bar-vertical flex-col'
      } ${className}`.trim()}
    >
      {label && (
        <label className={`text-[0.55rem] text-black/90 dark:text-white/90 uppercase tracking-[0.5px] font-bold min-w-[45px] ${
          orientation === 'horizontal' ? 'text-left min-w-[50px]' : 'text-center'
        }`}>
          {label}
        </label>
      )}
      <div 
        ref={barRef}
        className={`relative flex items-center justify-center select-none touch-none transition-transform duration-100 ${
          orientation === 'horizontal' ? 'px-2 flex-1' : 'py-2 w-full'
        } ${isInteractive && !disabled ? 'hover:scale-102' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
          className={`relative bg-[#f5f5f5] dark:bg-gray-700 rounded-lg shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(60,60,60,0.5),0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden ${
            orientation === 'horizontal' ? 'w-full h-2' : 'w-3 h-full'
          }`}
        >
          {orientation === 'horizontal' ? (
            <>
              <div 
                className="absolute top-0 left-0 h-full rounded-l-lg transition-[width] duration-[50ms] linear shadow-[inset_-2px_0_4px_rgba(0,0,0,0.15)] opacity-60"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: fillColor
                }}
              />
              {isInteractive && (
                <div 
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full bg-[#4a4a4a] shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.1),inset_0_0_0_1px_rgba(0,0,0,0.3)] cursor-grab transition-transform duration-100 hover:scale-110 hover:shadow-[5px_5px_10px_rgba(0,0,0,0.25),-5px_-5px_10px_rgba(255,255,255,0.15),inset_0_0_0_1px_rgba(0,0,0,0.4)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.1),0_0_0_1px_rgba(0,0,0,0.2)] z-[2] active:cursor-grabbing"
                  style={{ left: `${percentage}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black/30 rounded-full" />
                </div>
              )}
            </>
          ) : (
            <>
              <div 
                className="absolute bottom-0 left-0 right-0 rounded-b-lg transition-[height] duration-[50ms] linear shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)] opacity-60"
                style={{ 
                  height: `${percentage}%`,
                  backgroundColor: fillColor
                }}
              />
              {isInteractive && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#4a4a4a] shadow-[4px_4px_8px_rgba(0,0,0,0.2),-4px_-4px_8px_rgba(255,255,255,0.1),inset_0_0_0_1px_rgba(0,0,0,0.3)] cursor-grab transition-transform duration-100 hover:scale-110 hover:shadow-[5px_5px_10px_rgba(0,0,0,0.25),-5px_-5px_10px_rgba(255,255,255,0.15),inset_0_0_0_1px_rgba(0,0,0,0.4)] active:scale-95 active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.1),0_0_0_1px_rgba(0,0,0,0.2)] z-[2] active:cursor-grabbing"
                  style={{ bottom: `${percentage}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-black/30 rounded-full" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showValue && (
        <div className="text-[0.6rem] text-black/85 dark:text-white/85 font-bold min-h-[0.9rem] min-w-[25px] text-center">
          {Math.round(value)}
        </div>
      )}
    </div>
  )
}
