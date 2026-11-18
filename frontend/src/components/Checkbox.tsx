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
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14
  }

  const handleClick = () => {
    if (!disabled) {
      onChange(!checked)
    }
  }

  return (
    <div
      className={`flex items-center gap-2 ${className} ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
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
          ${sizeClasses[size]} relative rounded-[var(--td-radius-xs)] border transition-[background-color,box-shadow,transform] duration-[var(--td-duration-base)]
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer enabled:hover:scale-105 active:scale-95'}
          ${checked ? 'border-[var(--td-primary-strong)] bg-[var(--td-surface-selected)]' : 'border-[var(--td-edge-control)] bg-[var(--td-control-surface)]'}
        `}
        style={{
          boxShadow: checked ? 'var(--td-elevation-1)' : 'var(--td-control-shadow-pressed)'
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
            stroke="var(--td-primary-strong)"
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
            select-none text-sm font-medium transition-colors duration-[var(--td-duration-base)]
            ${checked ? 'text-[var(--td-text-primary)]' : 'text-[var(--td-text-secondary)]'}
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
