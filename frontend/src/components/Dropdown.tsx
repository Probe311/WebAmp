import { useState, useRef, useEffect, ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

export interface DropdownOption {
  value: string
  label: string
  icon?: ReactNode
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
  disabled?: boolean
}

export function Dropdown({
  options,
  value,
  placeholder = 'Sélectionner...',
  onChange,
  className = '',
  disabled = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('touchstart', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (optionValue: string) => {
    if (onChange && !options.find(opt => opt.value === optionValue)?.disabled) {
      onChange(optionValue)
      setIsOpen(false)
    }
  }

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onTouchStart={(e) => {
          if (!disabled) {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        disabled={disabled}
        className={`
          w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-left
          text-black/85 dark:text-white/90 text-sm font-medium
          cursor-pointer transition-all duration-200
          flex items-center justify-between gap-2
          shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)]
          dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)]
          hover:shadow-[3px_3px_6px_rgba(0,0,0,0.12),-3px_-3px_6px_rgba(255,255,255,1)]
          dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(70,70,70,0.6)]
          active:scale-[0.98]
          touch-manipulation
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isOpen ? 'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]' : ''}
        `.trim().replace(/\s+/g, ' ')}
        style={{ minHeight: '44px' }}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {selectedOption?.icon && (
            <span className="flex-shrink-0 text-black/60 dark:text-white/60">
              {selectedOption.icon}
            </span>
          )}
          <span className={selectedOption ? 'text-black/85 dark:text-white/90' : 'text-black/50 dark:text-white/50'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-black/50 dark:text-white/50 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && !disabled && (
        <div
          className="
            absolute z-50 w-full mt-2 bg-white dark:bg-gray-700 rounded-xl
            shadow-[8px_8px_16px_rgba(0,0,0,0.15),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)]
            dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)]
            overflow-hidden
            max-h-60 overflow-y-auto custom-scrollbar
          "
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              onTouchStart={(e) => {
                if (!option.disabled) {
                  e.preventDefault()
                  handleSelect(option.value)
                }
              }}
              disabled={option.disabled}
              className={`
                w-full px-4 py-3 text-left text-sm font-medium
                transition-all duration-150
                flex items-center gap-2
                touch-manipulation
                ${option.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/10 active:bg-black/10 dark:active:bg-white/15'
                }
                ${value === option.value 
                  ? 'bg-black/8 dark:bg-white/10 text-black/90 dark:text-white/90 font-semibold' 
                  : 'text-black/85 dark:text-white/85'
                }
              `.trim().replace(/\s+/g, ' ')}
              style={{ minHeight: '44px' }}
            >
              {option.icon && (
                <span className="flex-shrink-0 text-black/60 dark:text-white/60">
                  {option.icon}
                </span>
              )}
              <span className="flex-1">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

