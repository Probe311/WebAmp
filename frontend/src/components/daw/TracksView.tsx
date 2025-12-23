import React from 'react'
import { MoreHorizontal, Trash2, Plus, Settings } from 'lucide-react'
import { DawTrack } from '../../types/daw'
import { Slider } from '../Slider'
import { CTA } from '../CTA'
import { useTheme } from '../../contexts/ThemeContext'
import { TrackIcon } from '../../utils/trackIcons'

// Mapping des couleurs Tailwind vers leurs valeurs RGB
const COLOR_RGB_MAP: Record<string, string> = {
  'red-500': '239, 68, 68',
  'orange-500': '249, 115, 22',
  'amber-500': '245, 158, 11',
  'yellow-500': '234, 179, 8',
  'lime-500': '132, 204, 22',
  'green-500': '34, 197, 94',
  'emerald-500': '16, 185, 129',
  'teal-500': '20, 184, 166',
  'cyan-500': '6, 182, 212',
  'sky-500': '14, 165, 233',
  'blue-500': '59, 130, 246',
  'indigo-500': '99, 102, 241',
  'violet-500': '139, 92, 246',
  'purple-500': '168, 85, 247',
  'fuchsia-500': '217, 70, 239',
  'pink-500': '236, 72, 153',
  'rose-500': '244, 63, 94'
}

// Fonction helper pour obtenir la couleur avec opacité
const getColorWithOpacity = (colorClass: string, opacity: number = 0.2): string => {
  const colorKey = colorClass.replace('bg-', '')
  const rgb = COLOR_RGB_MAP[colorKey]
  if (rgb) {
    return `rgba(${rgb}, ${opacity})`
  }
  // Fallback pour les couleurs non mappées
  return colorClass
}

interface TracksViewProps {
  tracks: DawTrack[]
  selectedTrackId: string | null
  onTrackSelect: (trackId: string) => void
  onTrackDelete: (trackId: string) => void
  onTrackAdd: () => void
  onTrackUpdate: (trackId: string, updates: Partial<DawTrack>) => void
  onTrackCustomize?: (trackId: string) => void
  zoom: number
  currentTime: number
  onRegionMouseDown: (e: React.MouseEvent, trackId: string, regionId: string, type: 'move' | 'resize') => void
  onCanvasClick: (e: React.MouseEvent, trackId: string) => void
  scrollLeft: number
  onScroll: (scrollLeft: number) => void
}

export function TracksView({
  tracks,
  selectedTrackId,
  onTrackSelect,
  onTrackDelete,
  onTrackAdd,
  onTrackUpdate,
  onTrackCustomize,
  zoom,
  currentTime,
  onRegionMouseDown,
  onCanvasClick,
  scrollLeft,
  onScroll
}: TracksViewProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll(e.currentTarget.scrollLeft)
  }

  return (
    <div className="flex-1 flex overflow-hidden relative" style={{ maxWidth: '100%' }}>
      {/* Track Headers Column (Sticky) */}
      <div
        className="w-72 shrink-0 border-r flex flex-col z-10 sticky left-0"
        style={{
          background: isDark ? '#1f2937' : '#ffffff',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
          boxShadow: isDark
            ? '4px 0 24px rgba(0, 0, 0, 0.5)'
            : '4px 0 24px rgba(0, 0, 0, 0.1)'
        }}
      >
        {tracks.map((track) => (
          <div
            key={track.id}
            onClick={() => onTrackSelect(track.id)}
            className="h-24 border-b flex flex-col justify-center px-4 gap-2 group transition-all relative cursor-pointer"
            style={{
              borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
              background:
                selectedTrackId === track.id
                  ? isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(245, 158, 11, 0.1)'
                  : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (selectedTrackId !== track.id) {
                e.currentTarget.style.background = isDark
                  ? 'rgba(255, 255, 255, 0.02)'
                  : 'rgba(0, 0, 0, 0.02)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedTrackId !== track.id) {
                e.currentTarget.style.background = 'transparent'
              }
            }}
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${track.color} transition-opacity`}
              style={{
                opacity: selectedTrackId === track.id ? 1 : 0
              }}
            />

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center ${track.color.replace('bg-', 'text-')} shrink-0`}
                  style={{ backgroundColor: getColorWithOpacity(track.color, 0.2) }}
                >
                  <TrackIcon iconName={track.iconName} trackType={track.type} size={14} />
                </div>
                <span
                  className={`text-sm font-bold ${
                    selectedTrackId === track.id
                      ? 'text-black dark:text-white'
                      : 'text-black/70 dark:text-white/70'
                  }`}
                >
                  {track.name}
                </span>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onTrackCustomize && (
                  <CTA
                    variant="icon-only"
                    icon={<Settings size={12} />}
                    onClick={(e) => {
                      e.stopPropagation()
                      onTrackCustomize(track.id)
                    }}
                    title="Personnaliser"
                    className="text-blue-500 hover:text-blue-600"
                  />
                )}
                <CTA
                  variant="icon-only"
                  icon={<Trash2 size={12} />}
                  onClick={(e) => {
                    e.stopPropagation()
                    onTrackDelete(track.id)
                  }}
                  title="Supprimer"
                  className="text-red-500 hover:text-red-600"
                />
                <CTA
                  variant="icon-only"
                  icon={<MoreHorizontal size={14} />}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                  title="Options"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                {['M', 'S', 'R'].map((btn, i) => {
                  const isActive =
                    i === 0 ? track.muted : i === 1 ? track.solo : track.armed
                  const activeVariant =
                    i === 0
                      ? 'primary'
                      : i === 1
                      ? 'important'
                      : 'danger'
                  return (
                    <CTA
                      key={btn}
                      variant={isActive ? activeVariant : 'secondary'}
                      active={isActive}
                      onClick={(e) => {
                        e.stopPropagation()
                        const key = i === 0 ? 'muted' : i === 1 ? 'solo' : 'armed'
                        onTrackUpdate(track.id, { [key]: !track[key] })
                      }}
                      className="w-6 h-6 min-w-[24px] min-h-[24px] p-0 text-[10px] font-bold"
                      title={i === 0 ? 'Mute' : i === 1 ? 'Solo' : 'Arm (Armement)'}
                    >
                      {btn}
                    </CTA>
                  )
                })}
              </div>
              <div className="flex-1 min-w-0">
                <Slider
                  value={track.volume}
                  onChange={(v) => onTrackUpdate(track.id, { volume: v })}
                  className="w-full h-1.5"
                  min={0}
                  max={100}
                  orientation="horizontal"
                  color="#f97316"
                />
              </div>
            </div>
          </div>
        ))}
        <div
          onClick={onTrackAdd}
          className="h-24 flex items-center justify-center border-b border-dashed cursor-pointer transition-colors"
          style={{
            borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
            color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = isDark ? '#ffffff' : '#000000'
            e.currentTarget.style.background = isDark
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <Plus size={24} />
            <span className="text-xs font-bold uppercase tracking-widest">Ajouter une piste</span>
          </div>
        </div>
      </div>

      {/* Timeline Grid (Scrollable) */}
      <div
        className="flex-1 relative overflow-x-auto overflow-y-hidden"
        onClick={(e) => {
          const trackId = tracks[0]?.id
          if (trackId) onCanvasClick(e, trackId)
        }}
        onScroll={handleScroll}
        style={{
          background: isDark ? '#111827' : '#f5f5f5',
          width: '100%',
          maxWidth: '100%'
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 64 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-r"
              style={{
                left: `${i * zoom}px`,
                borderColor:
                  i % 4 === 0
                    ? isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)'
                    : isDark
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.05)'
              }}
            />
          ))}
        </div>

        {/* Playhead Line Full Height */}
        <div
          className="absolute top-0 bottom-0 w-px bg-orange-500 z-30 pointer-events-none transition-transform duration-75 ease-linear shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          style={{ transform: `translateX(${currentTime * zoom * 4}px)` }}
        />

        {tracks.map((track) => (
          <div
            key={track.id}
            className="h-24 border-b relative"
            style={{
              borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
              background:
                selectedTrackId === track.id
                  ? isDark
                    ? 'rgba(255, 255, 255, 0.02)'
                    : 'rgba(245, 158, 11, 0.05)'
                  : 'transparent'
            }}
            onClick={(e) => onCanvasClick(e, track.id)}
          >
            {track.regions.map((region) => (
              <div
                key={region.id}
                onMouseDown={(e) => onRegionMouseDown(e, track.id, region.id, 'move')}
                className={`absolute top-2 bottom-2 rounded-xl ${region.color} bg-opacity-90 border-t border-b border-white/20 shadow-lg flex items-center overflow-hidden hover:brightness-110 cursor-grab active:cursor-grabbing ring-2 ${
                  selectedTrackId === track.id ? 'ring-white/10' : 'ring-transparent'
                } group`}
                style={{
                  left: `${region.start * zoom * 4}px`,
                  width: `${region.duration * zoom * 4}px`,
                  zIndex: 10
                }}
              >
                <span className="text-[10px] font-bold text-white px-3 truncate drop-shadow-md z-10 select-none pointer-events-none">
                  {region.name}
                </span>

                {/* Resize Handle Right */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-white/20 z-20"
                  onMouseDown={(e) => onRegionMouseDown(e, track.id, region.id, 'resize')}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

