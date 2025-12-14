import { useState } from 'react'
import { useKeyboardShortcuts } from '../contexts/KeyboardShortcutsContext'
import { Modal } from './Modal'
import { CTA } from './CTA'
import { Guitar, Zap, Wrench, Compass } from 'lucide-react'
// Imports non utilisés supprimés

interface KeyboardShortcutsConfigProps {
  isOpen: boolean
  onClose: () => void
}

export function KeyboardShortcutsConfig({ isOpen, onClose }: KeyboardShortcutsConfigProps) {
  const { config, updateShortcut, toggleShortcut, setKeyboardOnlyMode } = useKeyboardShortcuts()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [capturingKey, setCapturingKey] = useState<string | null>(null)

  const categories = [
    { id: 'pedal', name: 'Pédales', icon: Guitar },
    { id: 'action', name: 'Actions', icon: Zap },
    { id: 'tool', name: 'Outils', icon: Wrench },
    { id: 'navigation', name: 'Navigation', icon: Compass }
  ]

  const shortcutsByCategory = categories.map(cat => ({
    ...cat,
    shortcuts: Object.values(config.shortcuts).filter(s => s.category === cat.id)
  }))

  const handleKeyCapture = (shortcutId: string) => {
    setCapturingKey(shortcutId)
    setEditingId(shortcutId)

    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault()
      event.stopPropagation()

      const modifiers: string[] = []
      if (event.ctrlKey || event.metaKey) modifiers.push('Ctrl')
      if (event.shiftKey) modifiers.push('Shift')
      if (event.altKey) modifiers.push('Alt')

      const key = event.key.length === 1 ? event.key.toUpperCase() : event.key
      const keyString = modifiers.length > 0 
        ? `${modifiers.join('+')}+${key}`
        : key

      updateShortcut(shortcutId, keyString)
      setCapturingKey(null)
      setEditingId(null)
      window.removeEventListener('keydown', handleKeyDown)
    }

    window.addEventListener('keydown', handleKeyDown)
  }

  const handleReset = (shortcutId: string) => {
    const shortcut = config.shortcuts[shortcutId]
    if (shortcut) {
      updateShortcut(shortcutId, shortcut.defaultKey)
    }
  }

  const handleResetAll = () => {
    if (confirm('Réinitialiser tous les raccourcis aux valeurs par défaut ?')) {
      Object.values(config.shortcuts).forEach(shortcut => {
        updateShortcut(shortcut.id, shortcut.defaultKey)
      })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuration des raccourcis clavier"
      className="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Mode clavier uniquement */}
        <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                Mode clavier uniquement
              </h3>
              <p className="text-sm text-black/70 dark:text-white/70">
                Active le mode sans souris pour une navigation complète au clavier
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.keyboardOnlyMode}
                onChange={(e) => setKeyboardOnlyMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/20 dark:peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white"></div>
            </label>
          </div>
        </div>

        {/* Raccourcis par catégorie */}
        {shortcutsByCategory.map(category => {
          const IconComponent = category.icon
          return (
          <div key={category.id} className="space-y-3">
            <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
              <IconComponent size={20} />
              {category.name}
            </h3>
            <div className="space-y-2">
              {category.shortcuts.map(shortcut => (
                <div
                  key={shortcut.id}
                  className={`p-4 bg-white dark:bg-gray-700 rounded-xl border transition-all ${
                    editingId === shortcut.id
                      ? 'border-black/30 dark:border-white/30 shadow-lg'
                      : 'border-black/10 dark:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-black dark:text-white">
                          {shortcut.name}
                        </h4>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shortcut.enabled}
                            onChange={() => toggleShortcut(shortcut.id)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black/20 dark:peer-focus:ring-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black dark:peer-checked:bg-white"></div>
                        </label>
                      </div>
                      <p className="text-sm text-black/70 dark:text-white/70 mt-1">
                        {shortcut.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {capturingKey === shortcut.id ? (
                        <div className="px-4 py-2 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-lg font-mono text-sm border border-yellow-500/30">
                          Appuyez sur une touche...
                        </div>
                      ) : (
                        <>
                          <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-sm border border-black/10 dark:border-white/10 text-black dark:text-white">
                            {shortcut.currentKey}
                          </div>
                          <CTA
                            variant="secondary"
                            onClick={() => handleKeyCapture(shortcut.id)}
                            className="text-xs"
                          >
                            Modifier
                          </CTA>
                          {shortcut.currentKey !== shortcut.defaultKey && (
                            <CTA
                              variant="secondary"
                              onClick={() => handleReset(shortcut.id)}
                              className="text-xs"
                              title="Réinitialiser"
                            >
                              ↺
                            </CTA>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )
        })}

        {/* Actions globales */}
        <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
          <CTA
            variant="secondary"
            onClick={handleResetAll}
          >
            Réinitialiser tous les raccourcis
          </CTA>
          <CTA
            variant="primary"
            onClick={onClose}
          >
            Fermer
          </CTA>
        </div>
      </div>
    </Modal>
  )
}

