interface SimpleSwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function SimpleSwitch({ label, checked, onChange }: SimpleSwitchProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
        {label}
      </span>
      <button
        onClick={() => onChange(!checked)}
        onTouchStart={(e) => {
          e.preventDefault()
          onChange(!checked)
        }}
        className={`
          w-10 h-5 rounded-full relative transition-colors duration-300 ease-in-out
          shadow-[inset_2px_2px_5px_rgba(0,0,0,0.1),inset_-2px_-2px_5px_rgba(255,255,255,0.9),0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(60,60,60,0.5),0_0_0_1px_rgba(60,60,60,0.8)]
          focus:outline-none touch-manipulation
          ${checked ? 'bg-blue-500/30' : 'bg-white dark:bg-gray-700'}
        `}
        aria-pressed={checked}
        style={{ minWidth: '44px', minHeight: '44px' }}
      >
        <div
          className={`
            absolute top-1 left-1 w-3 h-3 rounded-full 
            transition-transform duration-300 ease-in-out
            ${checked ? 'translate-x-5 bg-blue-500' : 'translate-x-0 bg-gray-400 dark:bg-gray-500'}
            shadow-sm
          `}
        />
      </button>
    </div>
  )
}

