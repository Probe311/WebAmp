import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { cx } from '../ui/cx'

/**
 * Interrupteur clair/sombre — piste `neu-inset`, curseur `neu-flat`.
 */
export function ThemeSwitch() {
  const { theme, toggleTheme } = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      aria-label="Thème sombre"
      title={dark ? 'Passer en thème clair' : 'Passer en thème sombre'}
      onClick={toggleTheme}
      className="neu-inset relative flex h-10 w-[74px] flex-none items-center rounded-full px-1 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neu-accent)]/50"
    >
      <span
        aria-hidden="true"
        className={cx(
          'neu-flat absolute left-1 top-1 h-8 w-8 rounded-full transition-transform duration-[var(--neu-duration-base)] ease-[var(--neu-ease)]',
          dark ? 'translate-x-8' : 'translate-x-0'
        )}
      />
      <span
        className={cx(
          'relative z-10 flex h-8 w-8 items-center justify-center transition-colors duration-[var(--neu-duration-base)]',
          dark ? 'text-[color:var(--neu-text-faint)]' : 'text-[color:var(--neu-accent)]'
        )}
      >
        <Sun size={16} aria-hidden="true" />
      </span>
      <span
        className={cx(
          'relative z-10 flex h-8 w-8 items-center justify-center transition-colors duration-[var(--neu-duration-base)]',
          dark ? 'text-[color:var(--neu-accent)]' : 'text-[color:var(--neu-text-faint)]'
        )}
      >
        <Moon size={16} aria-hidden="true" />
      </span>
    </button>
  )
}
