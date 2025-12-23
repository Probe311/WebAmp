import React from 'react'
import { Scissors, Activity } from 'lucide-react'
import { CTA } from '../CTA'
import { useTheme } from '../../contexts/ThemeContext'

interface WaveformEditorProps {
  color: string
  className?: string
}

export function WaveformEditor({ color, className = '' }: WaveformEditorProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  // Génération de waveform mock (à remplacer par un vrai waveform depuis AudioBuffer)
  const waveformData = Array.from({ length: 100 }).map(() => Math.random() * 100)

  return (
    <div
      className={`flex h-full w-full rounded-xl overflow-hidden relative items-center justify-center ${className}`}
      style={{
        background: isDark ? '#1f2937' : '#ffffff',
        boxShadow: isDark
          ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)'
          : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
      }}
    >
      <div className="absolute inset-0 flex items-center px-4">
        <div className="w-full h-32 flex items-center gap-[2px]">
          {waveformData.map((height, i) => (
            <div
              key={i}
              className={`flex-1 rounded-full opacity-80 ${color}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 border-b border-black/10 dark:border-white/10 top-1/2" />
      <div className="absolute top-2 right-2 flex gap-2">
        <CTA
          variant="icon-only"
          icon={<Scissors size={14} />}
          onClick={() => {}}
          title="Découper"
        />
        <CTA
          variant="icon-only"
          icon={<Activity size={14} />}
          onClick={() => {}}
          title="Traitement"
        />
      </div>
    </div>
  )
}

