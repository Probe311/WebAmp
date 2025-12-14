import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useTheme } from '../contexts/ThemeContext'

interface SliderProps {
  label?: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  orientation?: 'vertical' | 'horizontal'
  color?: string
  className?: string
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  orientation = 'vertical',
  color = '#f97316',
  className = ''
}) => {
  const { theme } = useTheme()
  const [isDragging, setIsDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const startPos = useRef<number>(0)
  const startValue = useRef<number>(0)
  const isDark = theme === 'dark'

  const percent = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))
  const isVertical = orientation === 'vertical'

  const addAlpha = (hexColor: string, alpha: number) => {
    if (!hexColor.startsWith('#') || (hexColor.length !== 7 && hexColor.length !== 4)) {
      return hexColor
    }
    const fullHex = hexColor.length === 4
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

  const handleDrag = useCallback(
    (clientPos: number) => {
      if (!trackRef.current) return
      const trackSize = isVertical ? trackRef.current.clientHeight : trackRef.current.clientWidth
      const delta = isVertical ? startPos.current - clientPos : clientPos - startPos.current
      const deltaPercent = (delta / trackSize) * 100
      const valueRange = max - min
      const deltaValue = (deltaPercent / 100) * valueRange

      let newValue = startValue.current + deltaValue
      // Clamp la valeur entre min et max
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

  return (
    <div
      className={`flex ${isVertical ? 'flex-col items-center gap-2 h-48 slider-vertical' : 'flex-col gap-2 w-full slider-horizontal'} px-1 py-1 ${className}`.trim()}
    >
      {label && (
        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 select-none text-center">
          {label}
        </span>
      )}

      <div 
        ref={trackRef}
        className={`relative ${isVertical ? 'flex-1 w-2 min-h-[120px]' : 'h-3 w-full min-w-[140px]'} rounded-full`}
        style={{
          background: isDark ? '#1f2937' : 'var(--neumorphic-bg-track, #EBECF0)',
          boxShadow: isDark
            ? 'inset 3px 3px 6px rgba(0,0,0,0.55), inset -3px -3px 6px rgba(60,60,60,0.45)'
            : 'inset 3px 3px 6px rgba(0,0,0,0.08), inset -3px -3px 6px rgba(255,255,255,0.9)'
        }}
      >
        <div
          className={`absolute ${isVertical ? 'left-1/2' : 'top-1/2'} -translate-x-1/2 w-8 h-5 rounded-[6px] cursor-${isVertical ? 'ns' : 'ew'}-resize flex items-center justify-center after:content-[''] after:w-4 after:h-[2px] after:rounded-full transition-colors`}
                style={{ 
            ...(isVertical
              ? { bottom: `${percent}%`, transform: 'translate(-50%, 50%)' }
              : { left: `${percent}%`, top: '50%', transform: 'translate(-50%, -50%)' }),
            borderColor: color,
            borderWidth: '1px',
            color,
            background: isDark ? '#111827' : 'var(--neumorphic-bg-track, #EBECF0)',
            boxShadow: isDark
              ? '3px 3px 6px rgba(0,0,0,0.65), -3px -3px 6px rgba(60,60,60,0.5)'
              : '3px 3px 6px rgba(0,0,0,0.08), -3px -3px 6px rgba(255,255,255,0.9)',
            backdropFilter: 'blur(2px)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />

        <div 
          className={`absolute ${isVertical ? 'bottom-0 left-0 w-full rounded-b-full' : 'left-0 top-0 h-full rounded-l-full'} pointer-events-none`}
          style={{ 
            height: isVertical ? `${percent}%` : '100%',
            width: isVertical ? '100%' : `${percent}%`,
            backgroundColor: addAlpha(color, 0.2)
          }}
        />
      </div>
    </div>
  )
}

export default Slider
