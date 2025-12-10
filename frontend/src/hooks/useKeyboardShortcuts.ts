import { useEffect, useRef } from 'react'
import { useKeyboardShortcuts as useKeyboardShortcutsContext } from '../contexts/KeyboardShortcutsContext'
import { ShortcutHandler } from '../types/keyboardShortcuts'

/**
 * Hook pour utiliser les raccourcis clavier
 */
export function useKeyboardShortcuts(handler: ShortcutHandler) {
  const { config, parseKey } = useKeyboardShortcutsContext()
  const handlerRef = useRef(handler)

  // Mettre à jour la référence du handler
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorer si on est dans un input, textarea, ou contenteditable
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Permettre les raccourcis avec Ctrl/Cmd même dans les inputs
        if (!event.ctrlKey && !event.metaKey) {
          return
        }
      }

      // Construire la représentation de la touche
      const modifiers: string[] = []
      if (event.ctrlKey || event.metaKey) modifiers.push('Ctrl')
      if (event.shiftKey) modifiers.push('Shift')
      if (event.altKey) modifiers.push('Alt')
      
      const key = event.key.length === 1 ? event.key.toUpperCase() : event.key
      // keyString non utilisé, supprimé

      // Chercher le raccourci correspondant
      for (const shortcut of Object.values(config.shortcuts)) {
        if (!shortcut.enabled) continue

        const parsed = parseKey(shortcut.currentKey)
        const matchesKey = parsed.key === key || parsed.key.toUpperCase() === key.toUpperCase()
        const matchesCtrl = parsed.ctrl === (event.ctrlKey || event.metaKey)
        const matchesShift = parsed.shift === event.shiftKey
        const matchesAlt = parsed.alt === event.altKey

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
          event.preventDefault()
          event.stopPropagation()

          // Déterminer l'action selon le type de raccourci
          if (shortcut.id.startsWith('pedal-')) {
            const pedalIndex = parseInt(shortcut.id.split('-')[1]) - 1
            handlerRef.current({ type: 'togglePedal', pedalIndex })
          } else {
            switch (shortcut.id) {
              case 'openLibrary':
                handlerRef.current({ type: 'openLibrary' })
                break
              case 'openSettings':
                handlerRef.current({ type: 'openSettings' })
                break
              case 'openProfiles':
                handlerRef.current({ type: 'openProfiles' })
                break
              case 'saveProfile':
                handlerRef.current({ type: 'saveProfile' })
                break
              case 'clearPedalboard':
                handlerRef.current({ type: 'clearPedalboard' })
                break
              case 'toggleMetronome':
                handlerRef.current({ type: 'toggleMetronome' })
                break
              case 'toggleLooper':
                handlerRef.current({ type: 'toggleLooper' })
                break
              case 'toggleTuner':
                handlerRef.current({ type: 'toggleTuner' })
                break
              case 'toggleDrumMachine':
                handlerRef.current({ type: 'toggleDrumMachine' })
                break
              case 'toggleRoomSimulator':
                handlerRef.current({ type: 'toggleRoomSimulator' })
                break
            }
          }
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [config.shortcuts, parseKey])
}

