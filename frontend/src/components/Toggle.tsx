import React from 'react'

interface ToggleProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}

const Toggle: React.FC<ToggleProps> = ({ options, value, onChange }) => {
  const isDark = document.documentElement.classList.contains('dark')
  
  return (
    <div 
      className="flex p-1 bg-[#f5f5f5] dark:bg-gray-700 rounded-full transition-colors duration-200"
      style={{
        boxShadow: isDark
          ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
          : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
      }}
    >
      {options.map((option) => {
        const isActive = value === option
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            onTouchStart={(e) => {
              e.preventDefault()
              onChange(option)
            }}
            className="relative px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-200 focus:outline-none select-none touch-manipulation"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              color: isActive 
                ? (isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.95)')
                : (isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'),
              backgroundColor: isActive 
                ? (isDark ? '#4b5563' : '#ffffff')
                : 'transparent',
              boxShadow: isActive 
                ? (isDark
                    ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
                    : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)')
                : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.color = isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
              }
            }}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

export default Toggle

