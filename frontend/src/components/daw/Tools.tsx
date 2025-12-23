import React from 'react'
import { MousePointer2, PenTool, Scissors, Hand, Magnet, Wrench } from 'lucide-react'
import { Tool } from '../../types/daw'
import { CTA } from '../CTA'
import { Slider } from '../Slider'

interface ToolsProps {
  activeTool: Tool
  snapGrid: boolean
  zoom: number
  onToolChange: (tool: Tool) => void
  onSnapToggle: (snap: boolean) => void
  onZoomChange: (zoom: number) => void
}

const tools = [
  { id: 'pointer' as Tool, icon: MousePointer2, label: 'Pointer' },
  { id: 'pencil' as Tool, icon: PenTool, label: 'Pencil' },
  { id: 'scissors' as Tool, icon: Scissors, label: 'Scissors' },
  { id: 'hand' as Tool, icon: Hand, label: 'Hand' }
]

export function Tools({
  activeTool,
  snapGrid,
  zoom,
  onToolChange,
  onSnapToggle,
  onZoomChange
}: ToolsProps) {
  return (
    <div className="h-14 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <CTA
              key={tool.id}
              variant={activeTool === tool.id ? 'important' : 'secondary'}
              active={activeTool === tool.id}
              icon={<Icon size={16} />}
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
              className="p-2 min-w-[36px] min-h-[36px]"
            />
          )
        })}
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <CTA
          variant={snapGrid ? 'primary' : 'secondary'}
          active={snapGrid}
          icon={<Magnet size={14} />}
          onClick={() => onSnapToggle(!snapGrid)}
          className="text-xs font-bold uppercase"
        >
          Snap
        </CTA>

      <div className="flex items-center gap-2">
        <CTA
          variant="icon-only"
          icon={
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          }
          onClick={() => onZoomChange(Math.max(20, zoom - 5))}
          title="Dézoomer"
          className="p-1"
        />
        <div className="w-24 h-1.5">
          <Slider
            value={zoom}
            onChange={onZoomChange}
            min={20}
            max={100}
            orientation="horizontal"
            className="w-full"
          />
        </div>
        <CTA
          variant="icon-only"
          icon={
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          }
          onClick={() => onZoomChange(Math.min(100, zoom + 5))}
          title="Zoomer"
          className="p-1"
        />
      </div>
      </div>
    </div>
  )
}

