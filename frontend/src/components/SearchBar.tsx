import { Search, X } from 'lucide-react'
import { useState } from 'react'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onEnter?: () => void
  showClearButton?: boolean
  showSearchButton?: boolean
  onSearchClick?: () => void
  className?: string
  disabled?: boolean
}

export function SearchBar({ 
  value, 
  onChange, 
  placeholder = 'Rechercher...',
  onEnter,
  showClearButton = true,
  showSearchButton = false,
  onSearchClick,
  className = '',
  disabled = false
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter()
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`
        flex items-center gap-3 transition-all duration-200
        px-6 py-3 rounded-3xl
        bg-white dark:bg-gray-700
        shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]
        dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]
        focus-within:outline-none focus-within:border-black/10 dark:focus-within:border-white/20
        focus-within:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.07),inset_-3px_-3px_6px_rgba(255,255,255,1)]
        dark:focus-within:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),inset_-3px_-3px_6px_rgba(70,70,70,0.6)]
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
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className="
            flex-1 bg-transparent border-none outline-none
            text-black/85 dark:text-white/90
            placeholder:text-black/50 dark:placeholder:text-white/50 placeholder:font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        />
        {showClearButton && value && (
          <button
            onClick={() => onChange('')}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            type="button"
            aria-label="Effacer la recherche"
          >
            <X size={16} className="text-black/40 dark:text-white/40" />
          </button>
        )}
        {showSearchButton && onSearchClick && (
          <button
            onClick={onSearchClick}
            disabled={disabled || !value.trim()}
            className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white text-sm font-medium"
            type="button"
            aria-label="Rechercher"
          >
            <Search size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
