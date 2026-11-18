import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

/**
 * Préférence de thème : `system` suit `prefers-color-scheme` en direct.
 * `theme` reste le thème *résolu* (`light` | `dark`) pour tous les composants
 * existants qui font `theme === 'dark'` : aucune migration d'appelant requise.
 */
export type ThemeMode = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  /** Thème effectivement appliqué. */
  theme: ResolvedTheme
  /** Préférence choisie (peut valoir `system`). */
  mode: ThemeMode
  setTheme: (theme: ThemeMode) => void
  setMode: (theme: ThemeMode) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Clé conservée : les sessions existantes gardent leur préférence.
const STORAGE_KEY = 'webamp-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

function readStoredMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    // Préférence explicite light/dark uniquement — `system` migré vers light.
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
  } catch {
    // localStorage indisponible : light par défaut
  }
  return 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(readStoredMode)
  const [preferred, setPreferred] = useState<ResolvedTheme>(systemTheme)

  // Suivre les changements système tant que la préférence est `system`
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }
    const query = window.matchMedia(DARK_QUERY)
    const onChange = (event: MediaQueryListEvent) => {
      setPreferred(event.matches ? 'dark' : 'light')
    }
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const theme: ResolvedTheme = mode === 'system' ? preferred : mode

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('light', theme === 'light')
    root.style.colorScheme = theme
    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch {
      // préférence non persistable : le thème reste appliqué pour la session
    }
  }, [theme, mode])

  const setTheme = useCallback((next: ThemeMode) => setMode(next), [])

  const toggleTheme = useCallback(() => {
    setMode(current => {
      const resolved: ResolvedTheme =
        current === 'system' ? systemTheme() : current
      return resolved === 'dark' ? 'light' : 'dark'
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, mode, setTheme, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
