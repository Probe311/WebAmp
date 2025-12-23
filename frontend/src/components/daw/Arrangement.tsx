import React from 'react'
import { Layout } from 'lucide-react'
import { DawTrack, Tool, DraggingState, MidiNote } from '../../types/daw'
import { Tools } from './Tools'
import { Timeline } from './Timeline'
import { TracksView } from './TracksView'
import { Block } from '../Block'

interface ArrangementProps {
  tracks: DawTrack[]
  selectedTrackId: string | null
  activeTool: Tool
  snapGrid: boolean
  zoom: number
  currentTime: number
  scrollLeft: number
  onTrackSelect: (id: string) => void
  onTrackDelete: (id: string) => void
  onTrackAdd: () => void
  onTrackUpdate: (id: string, updates: Partial<DawTrack>) => void
  onTrackCustomize: (id: string) => void
  onToolChange: (tool: Tool) => void
  onSnapToggle: (snap: boolean) => void
  onZoomChange: (zoom: number) => void
  onTimeClick: (time: number) => void
  onRegionMouseDown: (
    e: React.MouseEvent,
    trackId: string,
    regionId: string,
    type: 'move' | 'resize'
  ) => void
  onCanvasClick: (e: React.MouseEvent, trackId: string) => void
  onScroll: (scrollLeft: number) => void
}

export function Arrangement({
  tracks,
  selectedTrackId,
  activeTool,
  snapGrid,
  zoom,
  currentTime,
  scrollLeft,
  onTrackSelect,
  onTrackDelete,
  onTrackAdd,
  onTrackUpdate,
  onTrackCustomize,
  onToolChange,
  onSnapToggle,
  onZoomChange,
  onTimeClick,
  onRegionMouseDown,
  onCanvasClick,
  onScroll
}: ArrangementProps) {
  return (
    <Block className="flex-1 flex flex-col relative min-h-[400px] p-0">
      {/* Header */}
      <div className="py-4 border-b border-black/10 dark:border-white/10 flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 dark:text-orange-400">
          <Layout size={20} />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-black dark:text-white">
          Arrangement
        </span>
      </div>

      {/* Timeline Toolbar */}
      <Tools
        activeTool={activeTool}
        snapGrid={snapGrid}
        zoom={zoom}
        onToolChange={onToolChange}
        onSnapToggle={onSnapToggle}
        onZoomChange={onZoomChange}
      />

      <div className="flex-1 flex flex-col relative">
        {/* Timeline Ruler */}
        <Timeline
          currentTime={currentTime}
          zoom={zoom}
          totalBars={32}
          onTimeClick={onTimeClick}
          scrollLeft={scrollLeft}
          onScroll={onScroll}
        />

        {/* Tracks View */}
        <TracksView
          tracks={tracks}
          selectedTrackId={selectedTrackId}
          onTrackSelect={onTrackSelect}
          onTrackDelete={onTrackDelete}
          onTrackAdd={onTrackAdd}
          onTrackUpdate={onTrackUpdate}
          onTrackCustomize={onTrackCustomize}
          zoom={zoom}
          currentTime={currentTime}
          onRegionMouseDown={onRegionMouseDown}
          onCanvasClick={onCanvasClick}
          scrollLeft={scrollLeft}
          onScroll={onScroll}
        />
      </div>
    </Block>
  )
}

