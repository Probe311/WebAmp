import { Search, X } from 'lucide-react'
import { useState } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Rechercher un tutoriel...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative">
      <div className={`
        flex items-center gap-3 px-4 py-3 rounded-xl
        bg-white dark:bg-gray-700
        shadow-[inset_2px_2px_5px_#d1d9e6,inset_-2px_-2px_5px_#ffffff] 
        dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(60,60,60,0.5)]
        transition-all duration-200
        ${isFocused ? 'ring-2 ring-orange-500' : ''}
      `}>
        <Search 
          size={20} 
          className="text-black/40 dark:text-white/40 flex-shrink-0" 
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            flex-1 bg-transparent border-none outline-none
            text-black/85 dark:text-white/90
            placeholder:text-black/40 dark:placeholder:text-white/40
          "
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <X size={16} className="text-black/40 dark:text-white/40" />
          </button>
        )}
      </div>
    </div>
  )
}

