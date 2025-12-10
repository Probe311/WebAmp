/**
 * Types pour le système de raccourcis clavier
 */

export type ShortcutKey = string // Format: "Ctrl+Shift+K" ou "1", "2", etc.

export interface KeyboardShortcut {
  id: string
  name: string
  description: string
  defaultKey: ShortcutKey
  currentKey: ShortcutKey
  category: 'pedal' | 'navigation' | 'action' | 'tool'
  enabled: boolean
}

export interface KeyboardShortcutsConfig {
  shortcuts: Record<string, KeyboardShortcut>
  keyboardOnlyMode: boolean
}

export type ShortcutAction = 
  | { type: 'togglePedal'; pedalIndex: number }
  | { type: 'addPedal'; pedalId?: string }
  | { type: 'removePedal'; pedalIndex?: number }
  | { type: 'clearPedalboard' }
  | { type: 'openLibrary' }
  | { type: 'openSettings' }
  | { type: 'openProfiles' }
  | { type: 'toggleMetronome' }
  | { type: 'toggleLooper' }
  | { type: 'toggleTuner' }
  | { type: 'toggleDrumMachine' }
  | { type: 'toggleRoomSimulator' }
  | { type: 'saveProfile' }
  | { type: 'loadProfile'; profileName?: string }

export interface ShortcutHandler {
  (action: ShortcutAction): void
}

