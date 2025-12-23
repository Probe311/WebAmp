import React from 'react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: (e: React.MouseEvent) => void
}

export function Checkbox({
  checked,
  onChange,
  label,
  disabled = false,
  className = '',
  size = 'md',
  onClick
}: CheckboxProps) {
  const isDark = document.documentElement.classList.contains('dark')
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14
  }
  
  // Ombres neumorphic pour le checkbox
  const checkboxShadow = isDark
    ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
    : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
  
  const checkboxShadowChecked = isDark
    ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5), inset 1px 1px 2px rgba(0, 0, 0, 0.3)'
    : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9), inset 1px 1px 2px rgba(0, 0, 0, 0.1)'
  
  const checkboxBackground = checked
    ? (isDark ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.2)')
    : (isDark ? '#374151' : '#f5f5f5')
  
  const checkboxBorder = checked
    ? (isDark ? 'rgba(249, 115, 22, 0.6)' : 'rgba(249, 115, 22, 0.4)')
    : (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.15)')

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  return (
    <div 
      className={`flex items-center gap-2 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={(e) => {
        if (onClick) {
          onClick(e)
        }
        if (!disabled) {
          handleClick()
        }
      }}
    >
      <div
        className={`
          ${sizeClasses[size]} rounded border-2 transition-all duration-200 relative
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          ${!disabled ? 'hover:scale-105 active:scale-95' : ''}
        `}
        style={{
          background: checkboxBackground,
          borderColor: checkboxBorder,
          boxShadow: checked ? checkboxShadowChecked : checkboxShadow
        }}
        role="checkbox"
        aria-checked={checked}
        aria-disabled={disabled}
      >
        {checked && (
          <svg
            className="absolute inset-0 m-auto"
            width={iconSizes[size]}
            height={iconSizes[size]}
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDark ? '#f97316' : '#f97316'}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {label && (
        <label
          className={`
            text-sm font-medium transition-colors duration-200 select-none
            ${checked 
              ? 'text-black dark:text-white' 
              : 'text-gray-600 dark:text-gray-400'
            }
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          onClick={(e) => {
            if (!disabled) {
              e.stopPropagation()
              handleClick()
            }
          }}
        >
          {label}
        </label>
      )}
    </div>
  )
}

export default Checkbox

