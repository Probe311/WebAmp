import { useState, useEffect } from 'react'
import { Save, Download, Trash2 } from 'lucide-react'
import { WebSocketClient } from '../services/websocket'
import { CTA } from './CTA'

interface Preset {
  name: string
  description: string
}

export function PresetManager() {
  const [presets, setPresets] = useState<Preset[]>([])
  const [currentPreset, setCurrentPreset] = useState<string>('')
  const [newPresetName, setNewPresetName] = useState('')
  const [newPresetDescription, setNewPresetDescription] = useState('')

  useEffect(() => {
    loadPresets()
  }, [])

  const loadPresets = () => {
    try {
      const stored = localStorage.getItem('webamp_presets')
      if (stored) {
        setPresets(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Erreur chargement presets:', error)
    }
  }

  const savePresets = (newPresets: Preset[]) => {
    try {
      localStorage.setItem('webamp_presets', JSON.stringify(newPresets))
      setPresets(newPresets)
    } catch (error) {
      console.error('Erreur sauvegarde presets:', error)
    }
  }

  const saveCurrentPreset = () => {
    if (!newPresetName.trim()) {
      alert('Veuillez entrer un nom pour le preset')
      return
    }

    WebSocketClient.getInstance().send({
      type: 'savePreset',
      name: newPresetName,
      description: newPresetDescription
    })

    const newPreset: Preset = {
      name: newPresetName,
      description: newPresetDescription
    }
    savePresets([...presets, newPreset])
    setNewPresetName('')
    setNewPresetDescription('')
  }

  const loadPreset = (name: string) => {
    WebSocketClient.getInstance().send({
      type: 'loadPreset',
      name: name
    })
    setCurrentPreset(name)
  }

  const deletePreset = (name: string) => {
    if (!confirm(`Supprimer le preset "${name}" ?`)) {
      return
    }

    WebSocketClient.getInstance().send({
      type: 'deletePreset',
      name: name
    })

    savePresets(presets.filter(p => p.name !== name))
    if (currentPreset === name) {
      setCurrentPreset('')
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto">
      <h3 className="text-black/90 dark:text-white/90 mb-2 text-lg font-bold">Presets</h3>
      
      <div className="bg-[#f5f5f5] dark:bg-gray-700 rounded-lg p-4 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]">
        <h4 className="text-black/90 dark:text-white/90 mb-3 text-sm font-semibold">Sauvegarder</h4>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Nom du preset"
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-600 border border-black/10 dark:border-white/10 rounded-md text-black/85 dark:text-white/85 text-sm shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,1),0_0_0_2px_rgba(0,0,0,0.05)] dark:focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(70,70,70,0.6),0_0_0_2px_rgba(255,255,255,0.1)] placeholder:text-black/50 dark:placeholder:text-white/50"
          />
          <input
            type="text"
            placeholder="Description (optionnel)"
            value={newPresetDescription}
            onChange={(e) => setNewPresetDescription(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-600 border border-black/10 dark:border-white/10 rounded-md text-black/85 dark:text-white/85 text-sm shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-2px_-2px_4px_rgba(255,255,255,1),0_0_0_2px_rgba(0,0,0,0.05)] dark:focus:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(70,70,70,0.6),0_0_0_2px_rgba(255,255,255,0.1)] placeholder:text-black/50 dark:placeholder:text-white/50"
          />
          <CTA
            onClick={saveCurrentPreset}
            icon={<Save size={16} />}
            className="bg-green-500 hover:bg-green-600 text-white border-none shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.1)]"
          >
            Sauvegarder
          </CTA>
        </div>
      </div>

      <div className="bg-[#f5f5f5] dark:bg-gray-700 rounded-lg p-4 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]">
        <h4 className="text-black/90 dark:text-white/90 mb-3 text-sm font-semibold">Charger</h4>
        {presets.length === 0 ? (
          <p className="text-black/50 dark:text-white/50 text-sm text-center py-4">Aucun preset sauvegardé</p>
        ) : (
          <div className="flex flex-col gap-2">
            {presets.map((preset) => (
              <div key={preset.name} className="flex justify-between items-center p-3 bg-white dark:bg-gray-600 rounded-md border border-black/10 dark:border-white/10 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)]">
                <div className="flex-1">
                  <div className="text-black/90 dark:text-white/90 font-medium mb-1">{preset.name}</div>
                  {preset.description && (
                    <div className="text-xs text-black/60 dark:text-white/60">{preset.description}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => loadPreset(preset.name)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs cursor-pointer transition-all duration-200 ${
                      currentPreset === preset.name
                        ? 'bg-green-500 border-2 border-green-500 text-white shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.1)]'
                        : 'bg-white dark:bg-gray-700 border border-black/20 dark:border-white/20 text-black/80 dark:text-white/80 hover:bg-black/8 dark:hover:bg-white/10 hover:border-black/30 dark:hover:border-white/30 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)]'
                    }`}
                  >
                    <Download size={16} />
                    Charger
                  </button>
                  <button
                    onClick={() => deletePreset(preset.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-red-500/40 dark:border-red-400/40 rounded-md text-xs text-red-500 dark:text-red-400 cursor-pointer transition-all duration-200 hover:bg-red-500/10 dark:hover:bg-red-400/10 hover:border-red-500 dark:hover:border-red-400"
                  >
                    <Trash2 size={16} />
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
