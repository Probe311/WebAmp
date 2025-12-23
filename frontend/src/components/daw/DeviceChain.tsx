import React from 'react'
import { Zap, Plus } from 'lucide-react'
import { Knob } from '../Knob'
import { CTA } from '../CTA'
import { PluginSlot } from '../../types/daw'
import { useTheme } from '../../contexts/ThemeContext'

interface DeviceChainProps {
  trackName: string
  plugins?: PluginSlot[]
  onPluginAdd?: () => void
  onPluginEdit?: (pluginId: string) => void
  onPluginToggle?: (pluginId: string, active: boolean) => void
}

const DEFAULT_PLUGINS: PluginSlot[] = [
  { id: '1', name: 'EQ Eight', type: 'EQ', active: true, params: { freq: 50, gain: 30 } },
  { id: '2', name: 'Compressor', type: 'DYN', active: true, params: { threshold: 50, ratio: 30 } },
  { id: '3', name: 'Saturn 2', type: 'DIST', active: false, params: { drive: 50, tone: 30 } },
  { id: '4', name: 'Pro-R', type: 'REV', active: true, params: { mix: 50, decay: 30 } }
]

export function DeviceChain({
  trackName,
  plugins = DEFAULT_PLUGINS,
  onPluginAdd,
  onPluginEdit,
  onPluginToggle
}: DeviceChainProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="h-full w-full flex items-center gap-4 px-4 overflow-x-auto">
      {/* Header */}
      <div
        className="w-64 h-full rounded-xl p-4 flex flex-col justify-center items-center shrink-0"
        style={{
          background: isDark ? '#1f2937' : '#ffffff',
          boxShadow: isDark
            ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)'
            : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
        }}
      >
        <Zap size={40} className="text-orange-500 dark:text-orange-400 mb-4 opacity-50" />
        <h3 className="text-xl font-bold text-black dark:text-white">{trackName} FX Chain</h3>
        <p className="text-sm text-black/50 dark:text-white/50">4 emplacements disponibles</p>
      </div>

      {/* Plugin Cards */}
      {plugins.map((dev, i) => (
        <div
          key={dev.id}
          className={`w-32 h-48 rounded-xl p-3 flex flex-col justify-between group relative shrink-0 ${
            dev.active ? 'ring-2 ring-orange-500/30' : ''
          }`}
          style={{
            background: isDark ? '#1f2937' : '#ffffff',
            boxShadow: dev.active
              ? isDark
                ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8), 0 0 0 2px rgba(245, 158, 11, 0.3)'
                : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 0 0 2px rgba(245, 158, 11, 0.3)'
              : isDark
              ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)'
              : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
          }}
        >
          <div className="flex justify-between items-start">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
              style={{
                background: isDark ? '#374151' : '#f5f5f5',
                boxShadow: isDark
                  ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
                  : 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)',
                color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
              }}
            >
              {dev.type}
            </span>
            <div
              className={`w-2 h-2 rounded-full ${dev.active ? 'bg-green-500' : 'bg-red-500'}`}
            />
          </div>
          <div className="text-center my-auto">
            <div className="text-xs font-bold text-black dark:text-white mb-2">{dev.name}</div>
            <div className="flex justify-center gap-2">
              <Knob
                label=""
                value={Object.values(dev.params)[0] || 50}
                onChange={() => {}}
                min={0}
                max={100}
                size="sm"
              />
              <Knob
                label=""
                value={Object.values(dev.params)[1] || 30}
                onChange={() => {}}
                min={0}
                max={100}
                size="sm"
              />
            </div>
          </div>
          <CTA
            variant="secondary"
            onClick={() => onPluginEdit?.(dev.id)}
            className="text-[9px] w-full text-center py-1"
          >
            ÉDITER PLUGIN
          </CTA>
        </div>
      ))}

      {/* Add Plugin Button */}
      <div
        className="w-32 h-48 border-2 border-dashed rounded-xl flex items-center justify-center text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white cursor-pointer transition-colors shrink-0"
        onClick={onPluginAdd}
        style={{
          borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          background: isDark ? '#374151' : '#f5f5f5',
          boxShadow: isDark
            ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
            : 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
        }}
      >
        <Plus size={24} />
      </div>
    </div>
  )
}

