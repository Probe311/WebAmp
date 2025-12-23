import React from 'react'
import { DawTrack } from '../../types/daw'
import { Slider } from '../Slider'
import { Knob } from '../Knob'
import { CTA } from '../CTA'
import { useTheme } from '../../contexts/ThemeContext'
import { TrackIcon } from '../../utils/trackIcons'

interface MixerProps {
  tracks: DawTrack[]
  selectedTrackId: string | null
  onTrackSelect: (trackId: string) => void
  onTrackUpdate: (trackId: string, updates: Partial<DawTrack>) => void
  meters: Record<string, number> // VU meters par track
  masterVolume: number
  onMasterVolumeChange: (volume: number) => void
}

export function Mixer({
  tracks,
  selectedTrackId,
  onTrackSelect,
  onTrackUpdate,
  meters,
  masterVolume,
  onMasterVolumeChange
}: MixerProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="flex h-full gap-3 px-2 items-center overflow-x-auto">
      {tracks.map((track) => {
        const currentMeter = meters[track.id] || 0
        return (
          <div
            key={track.id}
            onClick={() => onTrackSelect(track.id)}
            className={`w-20 h-full rounded-2xl p-3 flex flex-col items-center relative group transition-all cursor-pointer ${
              selectedTrackId === track.id
                ? 'ring-2 ring-orange-500/50'
                : ''
            }`}
            style={{
              background: isDark ? '#1f2937' : '#ffffff',
              boxShadow: selectedTrackId === track.id
                ? isDark
                  ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8), 0 0 0 2px rgba(245, 158, 11, 0.3)'
                  : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 0 0 2px rgba(245, 158, 11, 0.3)'
                : isDark
                ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)'
                : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
            }}
          >
            {/* Indicateur de couleur en haut */}
            <div
              className={`absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1.5 rounded-b-full ${track.color} shadow-[0_0_10px_currentColor]`}
            />

            {/* Boutons M/S */}
            <div className="flex gap-1.5 mb-3 mt-2 w-full justify-center">
              <CTA
                variant={track.muted ? 'primary' : 'secondary'}
                active={track.muted}
                onClick={(e) => {
                  e.stopPropagation()
                  onTrackUpdate(track.id, { muted: !track.muted })
                }}
                className="w-6 h-6 min-w-[24px] min-h-[24px] p-0 text-[8px] font-bold"
                title="Mute"
              >
                M
              </CTA>
              <CTA
                variant={track.solo ? 'important' : 'secondary'}
                active={track.solo}
                onClick={(e) => {
                  e.stopPropagation()
                  onTrackUpdate(track.id, { solo: !track.solo })
                }}
                className="w-6 h-6 min-w-[24px] min-h-[24px] p-0 text-[8px] font-bold"
                title="Solo"
              >
                S
              </CTA>
            </div>

            {/* Fader avec VU Meter */}
            <div className="flex-1 w-full flex justify-center py-2 relative mb-2">
              <div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: isDark ? '#1f2937' : '#EBECF0',
                  boxShadow: isDark
                    ? 'inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -3px -3px 6px rgba(60, 60, 60, 0.45)'
                    : 'inset 3px 3px 6px rgba(0, 0, 0, 0.08), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
                }}
              />
              {/* Fader */}
              <Slider
                orientation="vertical"
                value={track.volume}
                onChange={(v) => onTrackUpdate(track.id, { volume: v })}
                className="w-2 group-hover:w-3 transition-all z-10"
                min={0}
                max={100}
                color="#f97316"
              />

              {/* VU Meter */}
              <div
                className="absolute top-2 bottom-2 right-4 w-1 rounded-full overflow-hidden flex flex-col-reverse gap-[1px]"
                style={{
                  background: isDark ? '#1f2937' : '#EBECF0',
                  boxShadow: isDark
                    ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
                    : 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
                }}
              >
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-full h-[6%] rounded-sm transition-colors duration-75 ${
                      currentMeter > i * 6.5
                        ? i > 12
                          ? 'bg-red-500'
                          : 'bg-green-500'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Volume display */}
            <div className="text-[10px] font-bold font-mono text-orange-500 dark:text-orange-400">
              {(track.volume / 10).toFixed(1)}
            </div>

            {/* Pan indicator */}
            <div
              className="w-10 h-1 mt-1 rounded-full overflow-hidden relative"
              style={{
                background: isDark ? '#1f2937' : '#EBECF0',
                boxShadow: isDark
                  ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
                  : 'inset 2px 2px 4px rgba(0, 0, 0, 0.08), inset -2px -2px 4px rgba(255, 255, 255, 0.9)'
              }}
            >
              <div
                className="absolute top-0 bottom-0 w-1 bg-black/40 dark:bg-white/40 -ml-0.5 rounded-full"
                style={{ left: `${50 + track.pan}%` }}
              />
            </div>

            {/* Track name */}
            <span className="text-[9px] text-black/50 dark:text-white/50 truncate w-full text-center mt-1">
              {track.name}
            </span>
          </div>
        )
      })}

      {/* Master Channel */}
      <div
        className="w-24 h-full rounded-2xl p-3 flex flex-col items-center ml-4 relative"
        style={{
          background: isDark ? '#1f2937' : '#ffffff',
          boxShadow: isDark
            ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(60, 60, 60, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8), 0 0 0 2px rgba(245, 158, 11, 0.3)'
            : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8), 0 0 0 2px rgba(245, 158, 11, 0.3)'
        }}
      >
        <span className="text-[9px] font-black text-orange-500 dark:text-orange-400 uppercase tracking-widest mb-3">
          MASTER
        </span>
        <div
          className="flex-1 w-full flex gap-1.5 justify-center px-2 rounded-xl py-2"
          style={{
            background: isDark ? '#1f2937' : '#EBECF0',
            boxShadow: isDark
              ? 'inset 3px 3px 6px rgba(0, 0, 0, 0.5), inset -3px -3px 6px rgba(60, 60, 60, 0.45)'
              : 'inset 3px 3px 6px rgba(0, 0, 0, 0.08), inset -3px -3px 6px rgba(255, 255, 255, 0.9)'
          }}
        >
          <div
            className="w-3 rounded-full overflow-hidden flex flex-col-reverse gap-0.5 p-0.5"
            style={{
              background: '#1f2937',
              boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const active = Object.values(meters).some((v) => v > i * 4)
              return (
                <div
                  key={i}
                  className={`w-full h-[3%] rounded-sm ${
                    i > 18
                      ? 'bg-red-500'
                      : i > 12
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  } ${active ? 'opacity-100' : 'opacity-20'} transition-opacity duration-75`}
                />
              )
            })}
          </div>
          <div
            className="w-3 rounded-full overflow-hidden flex flex-col-reverse gap-0.5 p-0.5"
            style={{
              background: '#1f2937',
              boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -2px -2px 4px rgba(60, 60, 60, 0.5)'
            }}
          >
            {Array.from({ length: 24 }).map((_, i) => {
              const active = Object.values(meters).some((v) => v > i * 4)
              return (
                <div
                  key={i}
                  className={`w-full h-[3%] rounded-sm ${
                    i > 18
                      ? 'bg-red-500'
                      : i > 12
                      ? 'bg-orange-500'
                      : 'bg-green-500'
                  } ${active ? 'opacity-100' : 'opacity-20'} transition-opacity duration-75`}
                />
              )
            })}
          </div>
        </div>
        <div className="mt-2 w-12 h-12">
          <Knob
            label="Master"
            value={masterVolume}
            onChange={onMasterVolumeChange}
            min={0}
            max={100}
            size="sm"
          />
        </div>
      </div>
    </div>
  )
}

