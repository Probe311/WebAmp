import { RoomConfig } from '../audio/roomSimulator'
import { Slider } from './Slider'

interface RoomSimulatorProps {
  config: RoomConfig
  onConfigChange: (config: RoomConfig) => void
}

export function RoomSimulator({ config, onConfigChange }: RoomSimulatorProps) {
  const handleChange = (key: keyof RoomConfig, value: number) => {
    onConfigChange({ ...config, [key]: value })
  }

  return (
    <div className="space-y-6 text-black/85 dark:text-white/90">
      <div className="p-4 bg-white dark:bg-gray-700 rounded-xl border border-black/10 dark:border-white/10">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Slider
              value={config.size}
              min={0}
              max={100}
              label="Taille"
              onChange={(value) => handleChange('size', value)}
              orientation="vertical"
            />
          </div>
          <div>
            <Slider
              value={config.reverb}
              min={0}
              max={100}
              label="Réverbération"
              onChange={(value) => handleChange('reverb', value)}
              orientation="vertical"
            />
          </div>
          <div>
            <Slider
              value={config.position}
              min={0}
              max={100}
              label="Position"
              onChange={(value) => handleChange('position', value)}
              orientation="vertical"
            />
          </div>
          <div>
            <Slider
              value={config.damping}
              min={0}
              max={100}
              label="Amortissement"
              onChange={(value) => handleChange('damping', value)}
              orientation="vertical"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
