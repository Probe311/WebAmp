import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'

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

/** Même UI ; S / M / L = échelle uniquement */
const sizeClasses: Record<NonNullable<KnobProps['size']>, string> = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-20 h-20',
}

/** Rayon SVG de l’arc (viewBox 100×100, centre 50) */
const ARC_RADIUS = 42
const ARC_SWEEP_DEG = 270
const ARC_START_DEG = -135

const SENSITIVITY = 0.5 // pixels per value unit

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

/** Arc SVG de startDeg → endDeg (sens horaire, sweep-flag 1) */
function describeArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, r, startDeg)
  const end = polar(cx, cy, r, endDeg)
  const delta = ((endDeg - startDeg) % 360 + 360) % 360
  const largeArc = delta > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`
}

export const Knob: React.FC<KnobProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  size = 'md',
  showValue = false,
  color,
  knobBaseColor = 'black',
  disabled = false,
  valueRawDisplayFn
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const startY = useRef<number>(0)
  const startValue = useRef<number>(0)

  const percent =
    max === min ? 0 : Math.min(1, Math.max(0, (value - min) / (max - min)))
  const rotation = percent * ARC_SWEEP_DEG + ARC_START_DEG
  const activeEndDeg = ARC_START_DEG + percent * ARC_SWEEP_DEG

  const activeColor = color || '#60a5fa'

  const getKnobBaseStyle = () => {
    switch (knobBaseColor) {
      case 'gold':
        return { background: '#b8941f' }
      case 'chrome':
      case 'silver':
        return { background: '#a8a8a8' }
      case 'gray':
        return { background: '#4b5563' }
      case 'black':
      default:
        return { background: '#1c1c1e' }
    }
  }

  const baseStyle = getKnobBaseStyle()

  const trackPath = useMemo(
    () => describeArc(50, 50, ARC_RADIUS, ARC_START_DEG, ARC_START_DEG + ARC_SWEEP_DEG),
    []
  )

  const valuePath = useMemo(() => {
    if (percent <= 0.001) return ''
    return describeArc(50, 50, ARC_RADIUS, ARC_START_DEG, activeEndDeg)
  }, [percent, activeEndDeg])

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

  const displayValue = valueRawDisplayFn ? valueRawDisplayFn(value) : Math.round(value).toString()

  const containerSize = size === 'md' ? 64 : size === 'lg' ? 84 : 44
  const wrapperPadding = size === 'sm' ? '2px' : '4px'
  const strokeW = size === 'lg' ? 5 : size === 'sm' ? 3.5 : 4.5
  const indicatorH = size === 'lg' ? 12 : size === 'sm' ? 7 : 11

  return (
    <div className="flex flex-col items-center gap-2 select-none group" style={{ padding: wrapperPadding }}>
      <div className="relative flex items-center justify-center" style={{ width: `${containerSize}px`, height: `${containerSize}px` }}>
        {/* Arc glow — piste + valeur */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <path
            d={trackPath}
            fill="none"
            stroke="rgba(63, 63, 70, 0.45)"
            strokeWidth={strokeW}
            strokeLinecap="round"
          />
          {valuePath && (
            <path
              d={valuePath}
              fill="none"
              stroke={activeColor}
              strokeWidth={strokeW}
              strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 6px ${activeColor}) drop-shadow(0 0 2px ${activeColor})` }}
            />
          )}
        </svg>

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
            boxShadow: 'none',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          aria-label={label}
          role="slider"
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
        >
          {/* Trait d’indicateur */}
          <div
            className="w-full h-full rounded-full absolute top-0 left-0 transition-transform duration-75 ease-linear will-change-transform"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-full"
              style={{
                top: '10%',
                width: 2,
                height: indicatorH,
                backgroundColor: '#f5f5f7'
              }}
            />
          </div>

          {showValue && isDragging && (
            <span className="absolute text-[10px] font-medium font-mono pointer-events-none" style={{ color: '#1C1C1E' }}>
              {displayValue}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-0.5">
        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: '#1C1C1E' }}>
          {label}
        </span>
        <span className="text-xs font-mono h-4" style={{ color: '#1C1C1E' }}>{displayValue}</span>
      </div>
    </div>
  )
}

export default Knob
