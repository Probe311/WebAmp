import { SearchField } from './tactile/forms/TextField'
import { cx } from './ui/cx'

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
  /** `shell` : champ du header ; `neumorphic` : inset NEU. */
  appearance?: 'neumorphic' | 'shell'
}

/**
 * Barre de recherche app — façade kit `SearchField`.
 */
export function SearchBar({
  value,
  onChange,
  placeholder = 'Rechercher...',
  onEnter,
  showClearButton = true,
  showSearchButton = false,
  onSearchClick,
  className = '',
  disabled = false,
  appearance = 'neumorphic',
}: SearchBarProps) {
  return (
    <div className={cx('relative', className)}>
      <SearchField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClear={showClearButton ? () => onChange('') : undefined}
        onSearch={() => {
          onEnter?.()
          onSearchClick?.()
        }}
        placeholder={placeholder}
        disabled={disabled}
        className={cx(
          appearance === 'shell' && 'rounded-[var(--td-radius-well)]',
          showSearchButton && 'pr-16'
        )}
      />
      {showSearchButton && (
        <button
          type="button"
          onClick={onSearchClick}
          className="neu-accent-btn absolute right-2 top-1/2 -translate-y-1/2 rounded-full px-3 py-1 text-xs font-bold"
        >
          OK
        </button>
      )}
    </div>
  )
}
