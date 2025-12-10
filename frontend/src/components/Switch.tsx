import React from 'react'

interface SwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const Switch: React.FC<SwitchProps> = ({ label, checked, onChange }) => {
  const isDark = document.documentElement.classList.contains('dark')
  
  const trackShadow = isDark
    ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
    : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
  
  const thumbShadow = isDark
    ? '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(60, 60, 60, 0.5)'
    : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'

  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
        {label}
      </span>
      
      <button
        onClick={() => onChange(!checked)}
        className="w-10 h-5 rounded-full relative transition-colors duration-300 ease-in-out focus:outline-none touch-manipulation"
        style={{
          background: isDark ? '#374151' : '#f5f5f5',
          boxShadow: trackShadow
        }}
        aria-pressed={checked}
      >
        <div
          className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-300 ease-in-out"
          style={{
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            background: checked 
              ? (isDark ? 'rgba(59, 130, 246, 0.8)' : '#3b82f6')
              : (isDark ? '#6b7280' : '#9ca3af'),
            boxShadow: thumbShadow
          }}
        />
      </button>
    </div>
  )
}

export { Switch }
