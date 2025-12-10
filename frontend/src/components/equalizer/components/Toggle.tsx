interface ToggleProps {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export function Toggle({ options, value, onChange }: ToggleProps) {
  return (
    <div className="flex p-1 bg-[#EBECF0] dark:bg-gray-700 rounded-full shadow-[inset_3px_3px_6px_#d1d9e6,inset_-3px_-3px_6px_#ffffff] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(60,60,60,0.5)] transition-colors duration-200 w-auto">
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
            className={`
              relative px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all duration-200
              focus:outline-none select-none touch-manipulation
              ${isActive 
                ? 'text-gray-600 dark:text-gray-200 shadow-[3px_3px_6px_#b8b9be,-3px_-3px_6px_#ffffff] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(60,60,60,0.6)] bg-white dark:bg-gray-600' 
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 bg-transparent'
              }
            `}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

