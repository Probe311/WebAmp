import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useTheme } from '../contexts/ThemeContext'

export type SliderThumbShape = 'rect' | 'round'

interface SliderProps {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  orientation?: 'vertical' | 'horizontal'
  color?: string
  className?: string
  labelPosition?: 'side' | 'top'
  /** Mode compact pour EQ en boîtier taille 1 */
  compact?: boolean
  /** rect = Walrus classique ; round = thumb rond, moins large */
  thumbShape?: SliderThumbShape
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  orientation = 'vertical',
  color = '#F26A1B',
  className = '',
  labelPosition = 'side',
  compact = false,
  thumbShape = 'rect',
}) => {
  const { theme } = useTheme()
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const startPos = useRef<number>(0)
  const startValue = useRef<number>(0)
  const isDark = theme === 'dark'
  const isRound = thumbShape === 'round'

  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const isVertical = orientation === 'vertical'
  const isLabelOnTop = labelPosition === 'top' && !isVertical

  const addAlpha = (hexColor: string, alpha: number) => {
    if (!hexColor.startsWith('#') || (hexColor.length !== 7 && hexColor.length !== 4)) {
      return hexColor
    }
    const fullHex =
      hexColor.length === 4
        ? `#${hexColor[1]}${hexColor[1]}${hexColor[2]}${hexColor[2]}${hexColor[3]}${hexColor[3]}`
        : hexColor
    const r = parseInt(fullHex.slice(1, 3), 16)
    const g = parseInt(fullHex.slice(3, 5), 16)
    const b = parseInt(fullHex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const startDrag = (clientPos: number) => {
    setIsDragging(true)
    startPos.current = clientPos
    startValue.current = value
    document.body.style.cursor = isVertical ? 'ns-resize' : 'ew-resize'
    document.body.classList.add('no-select')
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    startDrag(isVertical ? e.clientY : e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    const touch = e.touches[0]
    startDrag(isVertical ? touch.clientY : touch.clientX)
  }

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (!trackRef.current || isDragging) return
      e.preventDefault()
      const rect = trackRef.current.getBoundingClientRect()
      const trackSize = isVertical ? rect.height : rect.width
      const clickPos = isVertical ? rect.bottom - e.clientY : e.clientX - rect.left
      const clickPercent = (clickPos / trackSize) * 100
      const valueRange = max - min
      const newValue = min + (clickPercent / 100) * valueRange
      const clampedValue = Math.max(min, Math.min(max, newValue))
      onChange(Math.round(clampedValue))
    },
    [isDragging, isVertical, min, max, onChange]
  )

  const handleDrag = useCallback(
    (clientPos: number) => {
      if (!trackRef.current) return
      const trackSize = isVertical ? trackRef.current.clientHeight : trackRef.current.clientWidth
      const delta = isVertical ? startPos.current - clientPos : clientPos - startPos.current
      const deltaPercent = (delta / trackSize) * 100
      const valueRange = max - min
      const deltaValue = (deltaPercent / 100) * valueRange
      let newValue = startValue.current + deltaValue
      newValue = Math.max(min, Math.min(max, newValue))
      onChange(Math.round(newValue))
    },
    [isVertical, min, max, onChange]
  )

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleDrag(isVertical ? e.clientY : e.clientX)
    }
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        document.body.style.cursor = 'default'
        document.body.classList.remove('no-select')
      }
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        const touch = e.touches[0]
        handleDrag(isVertical ? touch.clientY : touch.clientX)
      }
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, handleDrag, isVertical])

  const widthClass = className.includes('w-') ? '' : !isVertical && !isLabelOnTop ? 'w-full' : ''
  const vHeight = compact ? 'h-[160px]' : 'h-[220px]'
  const finalClassName =
    `${isVertical ? `flex-col items-center gap-1 ${vHeight} slider-vertical overflow-visible` : isLabelOnTop ? 'flex-col items-start gap-2.5 w-full slider-horizontal' : `flex-row items-center gap-2 ${widthClass} slider-horizontal`} ${className}`.trim()

  const thumbClass = isRound
    ? `absolute ${isVertical ? 'left-1/2 cursor-ns-resize' : 'top-1/2 cursor-ew-resize'} w-3.5 h-3.5 rounded-full z-10`
    : `absolute ${isVertical ? 'left-1/2 cursor-ns-resize' : 'top-1/2 cursor-ew-resize'} w-7 h-4 rounded-[var(--td-radius-control)] flex items-center justify-center after:content-[''] after:w-3 after:h-[2px] after:rounded-full after:bg-white/40 transition-colors z-10`

  return (
    <div className={finalClassName}>
      {label && (
        <span
          className={`text-[9px] uppercase tracking-widest font-semibold select-none shrink-0 ${
            isLabelOnTop
              ? 'text-left w-full'
              : 'text-center leading-tight max-w-[3.2rem] h-[1.65rem] flex items-end justify-center overflow-hidden'
          }`}
          style={{ color: '#1C1C1E' }}
        >
          {label}
        </span>
      )}

      <div
        className={`relative ${isVertical ? 'flex-1 w-full flex justify-center py-2.5 min-h-0' : 'w-full'}`}
      >
        <div
          ref={trackRef}
          className={`relative ${
            isVertical
              ? `h-full ${isRound ? 'w-1' : 'w-1.5'} ${compact ? 'min-h-[100px]' : 'min-h-[140px]'}`
              : 'h-1.5 w-full'
          } rounded-full cursor-pointer`}
          style={{
            background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
            boxShadow: 'none',
          }}
          onClick={handleTrackClick}
        >
          <div
            className={thumbClass}
            style={{
              ...(isVertical
                ? { bottom: `${percent}%`, transform: 'translate(-50%, 50%)' }
                : { left: `${percent}%`, transform: 'translate(-50%, -50%)' }),
              borderColor: color,
              borderWidth: '1px',
              color,
              background: '#1c1c1e',
              boxShadow: isRound ? `0 0 0 1px ${color}` : 'none',
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              handleMouseDown(e)
            }}
            onTouchStart={(e) => {
              e.stopPropagation()
              handleTouchStart(e)
            }}
          />

          <div
            className={`absolute ${isVertical ? 'bottom-0 left-0 w-full rounded-b-full' : 'left-0 top-0 h-full rounded-l-full'} pointer-events-none z-0`}
            style={{
              height: isVertical ? `${percent}%` : '100%',
              width: isVertical ? '100%' : `${percent}%`,
              backgroundColor: addAlpha(color, 0.35),
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Slider
