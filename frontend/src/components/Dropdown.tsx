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
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`
          flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-2 rounded-[var(--td-radius-lg)]
          border border-[var(--td-edge-panel)] bg-[var(--td-control-surface)] px-4 py-3 text-left
          text-sm font-medium text-[var(--td-text-primary)] touch-manipulation
          transition-[box-shadow,transform] duration-150 active:scale-[0.98]
          disabled:cursor-not-allowed disabled:opacity-50
          ${isOpen ? 'shadow-[var(--td-control-shadow-pressed)]' : 'shadow-[var(--td-control-shadow)] hover:bg-[var(--td-surface-raised)]'}
        `.trim()}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {selectedOption?.icon && (
            <span className="flex-shrink-0 text-[var(--td-text-muted)]">{selectedOption.icon}</span>
          )}
          <span className={selectedOption ? 'text-[var(--td-text-primary)]' : 'text-[var(--td-text-muted)]'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-[var(--td-text-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && !disabled && (
        <div
          role="listbox"
          className="absolute z-[var(--td-z-menu)] mt-2 max-h-60 w-full overflow-y-auto rounded-[var(--td-radius-lg)] border border-[var(--td-edge-panel)] bg-[var(--td-menu-surface)] p-1 [box-shadow:var(--td-menu-shadow)]"
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={value === option.value}
              onClick={() => handleSelect(option.value)}
              onTouchStart={(e) => {
                if (!option.disabled) {
                  e.preventDefault()
                  handleSelect(option.value)
                }
              }}
              disabled={option.disabled}
              className={`
                flex min-h-[44px] w-full items-center gap-2 rounded-[var(--td-radius-md)] px-3 py-2.5 text-left
                text-sm font-medium touch-manipulation transition-colors duration-150
                ${
                  option.disabled
                    ? 'cursor-not-allowed opacity-50'
                    : 'cursor-pointer hover:bg-[var(--td-surface-hover)] active:bg-[var(--td-surface-active)]'
                }
                ${
                  value === option.value
                    ? 'bg-[var(--td-surface-selected)] font-semibold text-[var(--td-text-primary)]'
                    : 'text-[var(--td-text-secondary)]'
                }
              `.trim()}
            >
              {option.icon && <span className="flex-shrink-0 text-[var(--td-text-muted)]">{option.icon}</span>}
              <span className="flex-1">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
