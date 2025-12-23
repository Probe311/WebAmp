import React from 'react'
import { MidiNote } from '../../types/daw'
import { useTheme } from '../../contexts/ThemeContext'

interface PianoRollProps {
  notes: MidiNote[]
  onAddNote: (note: MidiNote) => void
  onRemoveNote: (index: number) => void
  className?: string
}

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const BLACK_KEYS = [1, 3, 6, 8, 10] // Indices des touches noires

export function PianoRoll({ notes, onAddNote, onRemoveNote, className = '' }: PianoRollProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const handleGridClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left - 48) / 40) // 48px pour les touches, 40px par 16th note
    const y = Math.floor((e.clientY - rect.top) / (rect.height / 12))
    
    if (x >= 0 && y >= 0 && y < 12) {
      onAddNote({ x, y, w: 2, velocity: 100 })
    }
  }

  return (
    <div
      className={`flex h-full w-full rounded-xl overflow-hidden relative select-none ${className}`}
      style={{
        background: isDark ? '#1f2937' : '#ffffff',
        boxShadow: isDark
          ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)'
          : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
      }}
    >
      {/* Keys */}
      <div
        className="w-12 h-full flex flex-col border-r border-black/10 dark:border-white/10 shrink-0"
        style={{
          background: isDark ? '#374151' : '#f5f5f5',
          boxShadow: isDark
            ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
            : 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 border-b border-black/5 dark:border-white/5 relative flex items-center justify-end px-1 ${
              BLACK_KEYS.includes(i)
                ? 'bg-black/20 dark:bg-white/10'
                : 'bg-white dark:bg-gray-700'
            }`}
          >
            {i === 11 && (
              <span className="text-[8px] text-black/50 dark:text-white/50">C3</span>
            )}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div
        className="flex-1 relative overflow-hidden overflow-x-auto"
        onMouseDown={handleGridClick}
        style={{
          background: isDark ? '#374151' : '#f5f5f5'
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 8.33%'
          }}
        />

        {/* Notes */}
        {notes.map((note, i) => (
          <div
            key={i}
            className="absolute bg-orange-500 rounded-sm border border-black/20 hover:brightness-110 cursor-pointer z-10"
            style={{
              left: `${note.x * 40}px`,
              top: `${note.y * 8.33}%`,
              width: `${note.w * 40}px`,
              height: '8.33%',
              boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.1), -1px -1px 2px rgba(255, 255, 255, 0.5)'
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              onRemoveNote(i)
            }}
          />
        ))}
      </div>
    </div>
  )
}

