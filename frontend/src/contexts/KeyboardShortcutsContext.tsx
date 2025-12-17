import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { KeyboardShortcut, KeyboardShortcutsConfig, ShortcutKey } from '../types/keyboardShortcuts'

interface KeyboardShortcutsContextType {
  config: KeyboardShortcutsConfig
  registerShortcut: (id: string, shortcut: KeyboardShortcut) => void
  updateShortcut: (id: string, key: ShortcutKey) => void
  toggleShortcut: (id: string) => void
  setKeyboardOnlyMode: (enabled: boolean) => void
  getShortcut: (id: string) => KeyboardShortcut | undefined
  parseKey: (keyString: string) => { key: string; ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean }
  formatKey: (key: string, modifiers?: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean }) => string
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined)

// Raccourcis par défaut
const defaultShortcuts: Record<string, KeyboardShortcut> = {
  // Pédales (1-9)
  'pedal-1': {
    id: 'pedal-1',
    name: 'Pédale 1',
    description: 'Activer/Désactiver la première pédale',
    defaultKey: '1',
    currentKey: '1',
    category: 'pedal',
    enabled: true
  },
  'pedal-2': {
    id: 'pedal-2',
    name: 'Pédale 2',
    description: 'Activer/Désactiver la deuxième pédale',
    defaultKey: '2',
    currentKey: '2',
    category: 'pedal',
    enabled: true
  },
  'pedal-3': {
    id: 'pedal-3',
    name: 'Pédale 3',
    description: 'Activer/Désactiver la troisième pédale',
    defaultKey: '3',
    currentKey: '3',
    category: 'pedal',
    enabled: true
  },
  'pedal-4': {
    id: 'pedal-4',
    name: 'Pédale 4',
    description: 'Activer/Désactiver la quatrième pédale',
    defaultKey: '4',
    currentKey: '4',
    category: 'pedal',
    enabled: true
  },
  'pedal-5': {
    id: 'pedal-5',
    name: 'Pédale 5',
    description: 'Activer/Désactiver la cinquième pédale',
    defaultKey: '5',
    currentKey: '5',
    category: 'pedal',
    enabled: true
  },
  'pedal-6': {
    id: 'pedal-6',
    name: 'Pédale 6',
    description: 'Activer/Désactiver la sixième pédale',
    defaultKey: '6',
    currentKey: '6',
    category: 'pedal',
    enabled: true
  },
  'pedal-7': {
    id: 'pedal-7',
    name: 'Pédale 7',
    description: 'Activer/Désactiver la septième pédale',
    defaultKey: '7',
    currentKey: '7',
    category: 'pedal',
    enabled: true
  },
  'pedal-8': {
    id: 'pedal-8',
    name: 'Pédale 8',
    description: 'Activer/Désactiver la huitième pédale',
    defaultKey: '8',
    currentKey: '8',
    category: 'pedal',
    enabled: true
  },
  'pedal-9': {
    id: 'pedal-9',
    name: 'Pédale 9',
    description: 'Activer/Désactiver la neuvième pédale',
    defaultKey: '9',
    currentKey: '9',
    category: 'pedal',
    enabled: true
  },
  // Actions
  'openLibrary': {
    id: 'openLibrary',
    name: 'Ouvrir la bibliothèque',
    description: 'Ouvrir la bibliothèque de pédales',
    defaultKey: 'Ctrl+L',
    currentKey: 'Ctrl+L',
    category: 'action',
    enabled: true
  },
  'openSettings': {
    id: 'openSettings',
    name: 'Ouvrir les paramètres',
    description: 'Ouvrir le panneau de paramètres',
    defaultKey: 'Ctrl+,',
    currentKey: 'Ctrl+,',
    category: 'action',
    enabled: true
  },
  'openProfiles': {
    id: 'openProfiles',
    name: 'Ouvrir les profils',
    description: 'Ouvrir la sélection de profils',
    defaultKey: 'Ctrl+P',
    currentKey: 'Ctrl+P',
    category: 'action',
    enabled: true
  },
  'saveProfile': {
    id: 'saveProfile',
    name: 'Sauvegarder le profil',
    description: 'Sauvegarder le profil actuel',
    defaultKey: 'Ctrl+S',
    currentKey: 'Ctrl+S',
    category: 'action',
    enabled: true
  },
  'clearPedalboard': {
    id: 'clearPedalboard',
    name: 'Vider le pedalboard',
    description: 'Supprimer toutes les pédales',
    defaultKey: 'Ctrl+Shift+C',
    currentKey: 'Ctrl+Shift+C',
    category: 'action',
    enabled: true
  },
  // Outils
  'toggleMetronome': {
    id: 'toggleMetronome',
    name: 'Métronome',
    description: 'Ouvrir/Fermer le métronome',
    defaultKey: 'Ctrl+M',
    currentKey: 'Ctrl+M',
    category: 'tool',
    enabled: true
  },
  'toggleLooper': {
    id: 'toggleLooper',
    name: 'Looper',
    description: 'Ouvrir/Fermer le looper',
    defaultKey: 'Ctrl+Shift+L',
    currentKey: 'Ctrl+Shift+L',
    category: 'tool',
    enabled: true
  },
  'toggleTuner': {
    id: 'toggleTuner',
    name: 'Tuner',
    description: 'Ouvrir/Fermer le tuner',
    defaultKey: 'Ctrl+T',
    currentKey: 'Ctrl+T',
    category: 'tool',
    enabled: true
  },
  'toggleDrumMachine': {
    id: 'toggleDrumMachine',
    name: 'Machine à rythmes',
    description: 'Ouvrir/Fermer la machine à rythmes',
    defaultKey: 'Ctrl+D',
    currentKey: 'Ctrl+D',
    category: 'tool',
    enabled: true
  },
  'toggleRoomSimulator': {
    id: 'toggleRoomSimulator',
    name: 'Simulateur de pièce',
    description: 'Ouvrir/Fermer le simulateur de pièce',
    defaultKey: 'Ctrl+R',
    currentKey: 'Ctrl+R',
    category: 'tool',
    enabled: true
  }
}

const STORAGE_KEY = 'webamp_keyboard_shortcuts'

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<KeyboardShortcutsConfig>(() => {
    // Charger depuis le localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          shortcuts: { ...defaultShortcuts, ...parsed.shortcuts },
          keyboardOnlyMode: parsed.keyboardOnlyMode ?? false
        }
      }
    } catch (error) {
      // échec silencieux du chargement des raccourcis
    }
    return {
      shortcuts: defaultShortcuts,
      keyboardOnlyMode: false
    }
  })

  // Sauvegarder dans le localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch (error) {
      // échec silencieux de la sauvegarde des raccourcis
    }
  }, [config])

  const registerShortcut = useCallback((id: string, shortcut: KeyboardShortcut) => {
    setConfig(prev => ({
      ...prev,
      shortcuts: {
        ...prev.shortcuts,
        [id]: shortcut
      }
    }))
  }, [])

  const updateShortcut = useCallback((id: string, key: ShortcutKey) => {
    setConfig(prev => {
      const shortcut = prev.shortcuts[id]
      if (!shortcut) return prev
      return {
        ...prev,
        shortcuts: {
          ...prev.shortcuts,
          [id]: {
            ...shortcut,
            currentKey: key
          }
        }
      }
    })
  }, [])

  const toggleShortcut = useCallback((id: string) => {
    setConfig(prev => {
      const shortcut = prev.shortcuts[id]
      if (!shortcut) return prev
      return {
        ...prev,
        shortcuts: {
          ...prev.shortcuts,
          [id]: {
            ...shortcut,
            enabled: !shortcut.enabled
          }
        }
      }
    })
  }, [])

  const setKeyboardOnlyMode = useCallback((enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      keyboardOnlyMode: enabled
    }))
  }, [])

  const getShortcut = useCallback((id: string) => {
    return config.shortcuts[id]
  }, [config.shortcuts])

  const parseKey = useCallback((keyString: string) => {
    const parts = keyString.split('+').map(s => s.trim())
    const key = parts[parts.length - 1]
    const modifiers = {
      ctrl: parts.some(p => p.toLowerCase() === 'ctrl' || p.toLowerCase() === 'control'),
      shift: parts.some(p => p.toLowerCase() === 'shift'),
      alt: parts.some(p => p.toLowerCase() === 'alt'),
      meta: parts.some(p => p.toLowerCase() === 'meta' || p.toLowerCase() === 'cmd')
    }
    return { key, ...modifiers }
  }, [])

  const formatKey = useCallback((key: string, modifiers?: { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean }) => {
    const parts: string[] = []
    if (modifiers?.ctrl) parts.push('Ctrl')
    if (modifiers?.shift) parts.push('Shift')
    if (modifiers?.alt) parts.push('Alt')
    if (modifiers?.meta) parts.push('Meta')
    parts.push(key)
    return parts.join('+')
  }, [])

  return (
    <KeyboardShortcutsContext.Provider
      value={{
        config,
        registerShortcut,
        updateShortcut,
        toggleShortcut,
        setKeyboardOnlyMode,
        getShortcut,
        parseKey,
        formatKey
      }}
    >
      {children}
    </KeyboardShortcutsContext.Provider>
  )
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext)
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within KeyboardShortcutsProvider')
  }
  return context
}

