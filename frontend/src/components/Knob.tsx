import React, { useState, useRef, useEffect, useCallback } from 'react'

interface KnobProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  color?: string
  knobBaseColor?: 'black' | 'gold' | 'chrome' | 'gray' | 'silver'
  disabled?: boolean
  valueRawDisplayFn?: (value: number) => string
}

const sizeClasses: Record<NonNullable<KnobProps['size']>, string> = {
  sm: 'w-12 h-12',
  md: 'w-14 h-14',
  lg: 'w-24 h-24'
}

const tickRadiusMap: Record<NonNullable<KnobProps['size']>, number> = {
  sm: 32,
  md: 38,
  lg: 60
}

const SENSITIVITY = 0.5 // pixels per value unit

export const Knob: React.FC<KnobProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  size = 'md',
  showValue = false,
  color,
  knobBaseColor = 'gray',
  disabled = false,
  valueRawDisplayFn
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef<number>(0)
  const startValue = useRef<number>(0)

  const percent =
    max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)))
  const rotation = percent * 270 - 135

  const activeColor = color || '#60a5fa'
  const inactiveColor = 'rgba(209, 213, 219, 1)' // gray-300
  const tickRadius = tickRadiusMap[size]

  // Styles de base pour chaque couleur de knob
  const getKnobBaseStyle = () => {
    switch (knobBaseColor) {
      case 'black':
        return {
          background: '#1a1a1a',
          shadowLight: 'rgba(255, 255, 255, 0.1)',
          shadowDark: 'rgba(0, 0, 0, 0.8)',
          activeShadowLight: 'rgba(255, 255, 255, 0.05)',
          activeShadowDark: 'rgba(0, 0, 0, 0.9)'
        }
      case 'gold':
        return {
          background: 'linear-gradient(135deg, #d4af37 0%, #b8941f 100%)',
          shadowLight: 'rgba(255, 255, 255, 0.3)',
          shadowDark: 'rgba(0, 0, 0, 0.5)',
          activeShadowLight: 'rgba(255, 255, 255, 0.15)',
          activeShadowDark: 'rgba(0, 0, 0, 0.7)'
        }
      case 'chrome':
        return {
          background: 'linear-gradient(135deg, #e8e8e8 0%, #c0c0c0 100%)',
          shadowLight: 'rgba(255, 255, 255, 0.8)',
          shadowDark: 'rgba(0, 0, 0, 0.3)',
          activeShadowLight: 'rgba(255, 255, 255, 0.4)',
          activeShadowDark: 'rgba(0, 0, 0, 0.5)'
        }
      case 'silver':
        return {
          background: 'linear-gradient(135deg, #d3d3d3 0%, #a8a8a8 100%)',
          shadowLight: 'rgba(255, 255, 255, 0.6)',
          shadowDark: 'rgba(0, 0, 0, 0.4)',
          activeShadowLight: 'rgba(255, 255, 255, 0.3)',
          activeShadowDark: 'rgba(0, 0, 0, 0.6)'
        }
      case 'gray':
      default:
        return {
          background: '#EBECF0',
          shadowLight: '#ffffff',
          shadowDark: '#b8b9be',
          activeShadowLight: '#ffffff',
          activeShadowDark: '#b8b9be'
        }
    }
  }

  const baseStyle = getKnobBaseStyle()

  const startDrag = (clientY: number) => {
    if (disabled) return
    setIsDragging(true)
    startY.current = clientY
    startValue.current = value
    document.body.style.cursor = 'ns-resize'
    document.body.classList.add('no-select')
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    startDrag(e.clientY)
    const target = e.currentTarget as HTMLElement
    target.style.boxShadow = `inset 4px 4px 8px ${baseStyle.activeShadowDark}, inset -4px -4px 8px ${baseStyle.activeShadowLight}`
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.boxShadow = `6px 6px 12px ${baseStyle.shadowDark}, -6px -6px 12px ${baseStyle.shadowLight}`
  }

  const handleMouseLeave = (e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.boxShadow = `6px 6px 12px ${baseStyle.shadowDark}, -6px -6px 12px ${baseStyle.shadowLight}`
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    startDrag(e.touches[0].clientY)
  }

  const handleDrag = useCallback(
    (clientY: number) => {
      const deltaY = startY.current - clientY
      const deltaValue = deltaY * SENSITIVITY

      let newValue = startValue.current + deltaValue
      // Clamp la valeur entre min et max
      newValue = Math.max(min, Math.min(max, newValue))

      onChange(Math.round(newValue))
    },
    [min, max, onChange]
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      handleDrag(e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      handleDrag(e.touches[0].clientY)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = 'default'
      document.body.classList.remove('no-select')
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [isDragging, handleDrag])

  const renderTicks = () => {
    const ticks = []
    const numTicks = 28
    const startAngle = -135
    const endAngle = 135

    for (let i = 0; i <= numTicks; i++) {
      const angle = startAngle + (i / numTicks) * (endAngle - startAngle)
      const rad = (angle - 90) * (Math.PI / 180)
      const isActive = angle <= rotation

      ticks.push(
        <div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full transition-colors duration-200"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(${Math.cos(rad) * tickRadius}px, ${Math.sin(rad) * tickRadius}px)`,
            backgroundColor: isActive ? activeColor : inactiveColor
          }}
        />
      )
    }
    return ticks
  }

  const displayValue = valueRawDisplayFn ? valueRawDisplayFn(value) : Math.round(value).toString()

  // Calculer la taille du conteneur pour accommoder les ticks et les ombres
  const containerSize = size === 'md' ? 70 : size === 'lg' ? 96 : 48

  return (
    <div className="flex flex-col items-center gap-3 select-none group" style={{ padding: '8px' }}>
      <div className="relative flex items-center justify-center" style={{ width: `${containerSize}px`, height: `${containerSize}px` }}>
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: '100%', height: '100%', transform: 'translate(0, 0)' }}>
          {renderTicks()}
        </div>

        <div
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            flex items-center justify-center
            relative
            cursor-pointer
            transition-all duration-100 ease-out
            ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
          `}
          style={{
            background: baseStyle.background,
            boxShadow: `6px 6px 12px ${baseStyle.shadowDark}, -6px -6px 12px ${baseStyle.shadowLight}`
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          aria-label={label}
          role="slider"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          <div
            className="w-full h-full rounded-full absolute top-0 left-0 transition-transform duration-75 ease-linear will-change-transform"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-gray-600 rounded-full shadow-inner" />
          </div>

          {showValue && isDragging && (
            <span className="absolute text-[10px] font-bold text-gray-500 dark:text-gray-400 font-mono pointer-events-none">
              {displayValue}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-700 dark:text-gray-200">
          {label}
        </span>
        <span className="text-xs font-mono text-gray-700 dark:text-gray-300 h-4">{displayValue}</span>
      </div>
    </div>
  )
}

export default Knob

