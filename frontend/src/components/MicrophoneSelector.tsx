import { useState } from 'react'
import { microphoneLibrary, MicrophoneConfig, MicrophonePosition } from '../data/microphones'
import { Modal } from './Modal'
import { Slider } from './Slider'

interface MicrophoneSelectorProps {
  microphones: MicrophoneConfig[]
  onMicrophonesChange: (configs: MicrophoneConfig[]) => void
}

export function MicrophoneSelector({
  microphones,
  onMicrophonesChange
}: MicrophoneSelectorProps) {
  const [showModal, setShowModal] = useState(false)

  const positions: { value: MicrophonePosition; label: string }[] = [
    { value: 'on-axis', label: 'On-Axis' },
    { value: 'off-axis-15', label: 'Off-Axis 15°' },
    { value: 'off-axis-30', label: 'Off-Axis 30°' },
    { value: 'off-axis-45', label: 'Off-Axis 45°' },
    { value: 'edge', label: 'Edge' },
    { value: 'back', label: 'Back' }
  ]

  const handleAddMicrophone = (micId: string) => {
    if (microphones.length < 4) {
      const newConfig: MicrophoneConfig = {
        microphoneId: micId,
        position: 'on-axis',
        distance: 5,
        mix: 100 / (microphones.length + 1)
      }
      onMicrophonesChange([...microphones, newConfig])
    }
  }

  const handleRemoveMicrophone = (index: number) => {
    const newConfigs = microphones.filter((_, i) => i !== index)
    onMicrophonesChange(newConfigs)
  }

  const handleUpdateConfig = (index: number, config: Partial<MicrophoneConfig>) => {
    const newConfigs = [...microphones]
    newConfigs[index] = { ...newConfigs[index], ...config }
    onMicrophonesChange(newConfigs)
  }

  return (
    <div className="microphone-selector">
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
      >
        Microphones ({microphones.length})
      </button>

      {microphones.length > 0 && (
        <div className="mt-2 space-y-2">
          {microphones.map((config, index) => {
            const mic = microphoneLibrary.find(m => m.id === config.microphoneId)
            return (
              <div key={index} className="p-2 border border-gray-200 dark:border-gray-700 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-black dark:text-white">
                    {mic?.brand} {mic?.model}
                  </span>
                  <button
                    onClick={() => handleRemoveMicrophone(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-2">
                  <select
                    value={config.position}
                    onChange={(e) => handleUpdateConfig(index, { position: e.target.value as MicrophonePosition })}
                    className="w-full px-2 py-1 rounded bg-white dark:bg-gray-700 text-sm"
                  >
                    {positions.map(pos => (
                      <option key={pos.value} value={pos.value}>{pos.label}</option>
                    ))}
                  </select>
                  <Slider
                    value={config.distance}
                    min={1}
                    max={50}
                    label="Distance (cm)"
                    onChange={(value) => handleUpdateConfig(index, { distance: value })}
                  />
                  <Slider
                    value={config.mix}
                    min={0}
                    max={100}
                    label="Mix"
                    onChange={(value) => handleUpdateConfig(index, { mix: value })}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Sélectionner un Microphone"
      >
        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto custom-scrollbar">
          {microphoneLibrary.map(mic => (
            <button
              key={mic.id}
              onClick={() => {
                handleAddMicrophone(mic.id)
                setShowModal(false)
              }}
              disabled={microphones.length >= 4}
              className="p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-left disabled:opacity-50"
            >
              <div className="font-semibold text-black dark:text-white">
                {mic.brand} {mic.model}
              </div>
              <div className="text-sm text-black/70 dark:text-white/70 mt-1">
                {mic.type} - {mic.polarPattern}
              </div>
              <div className="text-xs text-black/50 dark:text-white/50 mt-1">
                {mic.description}
              </div>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  )
}

