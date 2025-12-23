import React, { useRef, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

interface TimelineProps {
  currentTime: number // en barres
  zoom: number // pixels par barre
  totalBars: number
  onTimeClick: (time: number) => void
  scrollLeft: number
  onScroll: (scrollLeft: number) => void
}

export function Timeline({
  currentTime,
  zoom,
  totalBars,
  onTimeClick,
  scrollLeft,
  onScroll
}: TimelineProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.scrollLeft = scrollLeft
    }
  }, [scrollLeft])

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const clickTime = Math.max(0, (x + scrollLeft) / (zoom * 4))
    onTimeClick(clickTime)
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll(e.currentTarget.scrollLeft)
  }

  return (
    <div
      className="h-8 border-b flex relative"
      style={{
        background: isDark ? '#1f2937' : '#ffffff',
        borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'
      }}
    >
      <div
        className="w-72 shrink-0 border-r flex items-center px-4"
        style={{
          background: isDark ? '#1f2937' : '#ffffff',
          borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'
        }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:text-white/50">
          Tracks ({totalBars})
        </span>
      </div>
      <div
        ref={timelineRef}
        className="flex-1 relative overflow-x-auto overflow-y-hidden cursor-pointer"
        onClick={handleClick}
        onScroll={handleScroll}
        style={{
          background: isDark ? '#111827' : '#f5f5f5',
          width: '100%',
          maxWidth: '100%'
        }}
      >
        {Array.from({ length: totalBars }).map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 border-l text-[10px] font-mono text-black/50 dark:text-white/50 pl-1 pt-2 select-none pointer-events-none"
            style={{
              left: `${i * zoom * 4}px`,
              borderColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            }}
          >
            {i + 1}
          </div>
        ))}
        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-px bg-orange-500 z-10 transition-transform duration-75 ease-linear pointer-events-none"
          style={{ transform: `translateX(${currentTime * zoom * 4}px)` }}
        >
          <div className="w-3 h-3 bg-orange-500 -ml-1.5 rotate-45 transform -mt-1.5 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
        </div>
      </div>
    </div>
  )
}

