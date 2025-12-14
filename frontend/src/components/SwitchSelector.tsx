import { useRef, useEffect } from 'react'
import { LucideIcon } from 'lucide-react'

interface SwitchSelectorProps {
  value: number
  min: number
  max: number
  labels: string[]
  icons?: LucideIcon[]
  color?: string
  onChange: (value: number) => void
  className?: string
}

export function SwitchSelector({ value, min, max, labels, icons, color = '#fff', onChange, className }: SwitchSelectorProps) {
  const numPositions = labels.length
  const range = max - min
  const step = range / (numPositions - 1)
  const currentIndex = Math.round((value - min) / step)
  const clampedIndex = Math.max(0, Math.min(numPositions - 1, currentIndex))
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Réinitialiser les styles de tous les boutons
  const resetAllButtonStyles = () => {
    buttonRefs.current.forEach((button) => {
      if (button) {
        button.style.backgroundColor = ''
        button.style.color = ''
      }
    })
  }

  // Réinitialiser les styles quand l'index actif change
  useEffect(() => {
    resetAllButtonStyles()
  }, [clampedIndex])

  const handleClick = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.stopPropagation()
    // Réinitialiser tous les styles avant de changer la valeur
    resetAllButtonStyles()
    const newValue = min + (index * step)
    onChange(newValue)
  }

  return (
    <div className={`flex flex-col pt-1 items-center gap-1 w-full min-w-0 col-span-full shrink-0 ${className || ''}`.trim()}>
      <div className="flex flex-row gap-0.5 p-0.5 bg-neumorphic-light dark:bg-gray-700 rounded-lg shadow-neumorphic-inset dark:shadow-neumorphic-dark-inset" style={{ borderColor: color }}>
        {labels.map((label, index) => {
          const Icon = icons?.[index]
          const isActive = clampedIndex === index
          return (
            <button
              key={index}
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              className={`flex-1 min-w-0 px-2 py-1.5 border-none rounded-md cursor-pointer text-xs font-semibold uppercase tracking-[0.3px] transition-all duration-200 relative flex flex-col items-center justify-center gap-0.5 min-h-8 touch-manipulation ${
                isActive 
                  ? 'bg-white dark:bg-gray-600 shadow-neumorphic dark:shadow-neumorphic-dark text-black/95 dark:text-white/95 font-bold' 
                  : 'bg-transparent text-black/75 dark:text-white/75'
              }`}
              style={{
                minWidth: '44px',
                minHeight: '44px'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = document.documentElement.classList.contains('dark')
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.08)'
                  e.currentTarget.style.color = document.documentElement.classList.contains('dark')
                    ? 'rgba(255, 255, 255, 0.85)'
                    : 'rgba(0, 0, 0, 0.85)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = ''
                  e.currentTarget.style.color = ''
                }
              }}
              onClick={(e) => handleClick(e, index)}
              onTouchStart={(e) => {
                e.stopPropagation()
                handleClick(e, index)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title={label}
            >
              {Icon ? (
                <Icon size={16} strokeWidth={2} />
              ) : (
                <span className="text-[0.5rem] leading-tight text-center break-words">{label}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
