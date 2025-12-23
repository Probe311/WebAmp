import React, { useState, useEffect, useRef, useCallback } from 'react'
import { DawTrack, MidiNote, Tool, DraggingState } from '../types/daw'
import { Transport } from '../components/daw/Transport'
import { Library } from '../components/daw/Library'
import { Arrangement } from '../components/daw/Arrangement'
import { BottomPanel, BottomTab } from '../components/daw/BottomPanel'
import { TrackCustomizationModal } from '../components/daw/TrackCustomizationModal'
import { Block } from '../components/Block'

// Initial tracks (empty by default)
const INITIAL_TRACKS: DawTrack[] = []

export function DawPage() {
  // DAW State
  const [tracks, setTracks] = useState<DawTrack[]>(INITIAL_TRACKS)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0) // en barres
  const [zoom, setZoom] = useState(40) // pixels par barre
  const [bpm, setBpm] = useState(128)
  const [timeSignature, setTimeSignature] = useState<[number, number]>([4, 4])
  const [activeBottomTab, setActiveBottomTab] = useState<BottomTab>('mixer')
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)
  const [meters, setMeters] = useState<Record<string, number>>({})
  const [masterVolume, setMasterVolume] = useState(80)

  // Tools & Interaction
  const [activeTool, setActiveTool] = useState<Tool>('pointer')
  const [snapGrid, setSnapGrid] = useState(true)
  const [draggingRegion, setDraggingRegion] = useState<DraggingState | null>(null)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [customizingTrackId, setCustomizingTrackId] = useState<string | null>(null)
  const [isCreatingNewTrack, setIsCreatingNewTrack] = useState(false)

  const playReqRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  // Audio Engine Simulation (Transport)
  const animate = useCallback((time: number) => {
    if (lastTimeRef.current !== 0) {
      const delta = time - lastTimeRef.current
      // Calcul basé sur la signature rythmique : (bpm / 60) / timeSignature[0] donne les barres par seconde
      const barsPerSecond = (bpm / 60) / timeSignature[0]
      const increment = barsPerSecond * (delta / 1000)

      setCurrentTime((prev) => {
        if (prev > 8) return 0 // Loop 8 bars
        return prev + increment
      })
    }
    lastTimeRef.current = time
    if (isPlaying) {
      playReqRef.current = requestAnimationFrame(animate)
    }
  }, [isPlaying, bpm, timeSignature])

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0
      playReqRef.current = requestAnimationFrame(animate)

      // VU Meters Simulation
      const meterInterval = setInterval(() => {
        const newMeters: Record<string, number> = {}
        tracks.forEach((t) => {
          newMeters[t.id] = !t.muted && Math.random() > 0.3 ? Math.random() * 80 + 10 : 0
        })
        setMeters(newMeters)
      }, 100)
      return () => {
        clearInterval(meterInterval)
        cancelAnimationFrame(playReqRef.current)
      }
    } else {
      setMeters({})
      cancelAnimationFrame(playReqRef.current)
    }
  }, [isPlaying, tracks, animate])

  // Interaction Logic
  const handleTimelineClick = useCallback((time: number) => {
    const snap = snapGrid ? Math.round(time * 4) / 4 : time
    setCurrentTime(Math.max(0, snap))
  }, [snapGrid])

  const handleRegionMouseDown = useCallback((
    e: React.MouseEvent,
    trackId: string,
    regionId: string,
    type: 'move' | 'resize'
  ) => {
    e.stopPropagation()
    if (activeTool === 'scissors') {
      // Split region logic here
      return
    }
    if (activeTool === 'pencil') return

    const track = tracks.find((t) => t.id === trackId)
    const region = track?.regions.find((r) => r.id === regionId)
    if (!region) return

    setSelectedTrackId(trackId)
    setDraggingRegion({
      trackId,
      regionId,
      startX: e.clientX,
      initialStart: type === 'move' ? region.start : region.duration,
      type
    })
  }, [activeTool, tracks])

  // Global Mouse Move for Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRegion) return

      const trackIndex = tracks.findIndex((t) => t.id === draggingRegion.trackId)
      if (trackIndex === -1) return

      const deltaX = e.clientX - draggingRegion.startX
      const deltaBars = deltaX / (zoom * 4)

      setTracks((prevTracks) => {
        const newTracks = [...prevTracks]
        const regionIndex = newTracks[trackIndex].regions.findIndex(
          (r) => r.id === draggingRegion.regionId
        )
        const region = newTracks[trackIndex].regions[regionIndex]

        if (draggingRegion.type === 'move') {
          let newStart = draggingRegion.initialStart + deltaBars
          if (snapGrid) newStart = Math.round(newStart * 4) / 4
          newStart = Math.max(0, newStart)
          newTracks[trackIndex].regions[regionIndex] = { ...region, start: newStart }
        } else {
          // Resize
          let newDuration = draggingRegion.initialStart + deltaBars
          if (snapGrid) newDuration = Math.round(newDuration * 4) / 4
          newDuration = Math.max(0.25, newDuration)
          newTracks[trackIndex].regions[regionIndex] = { ...region, duration: newDuration }
        }

        return newTracks
      })
    }

    const handleMouseUp = () => {
      setDraggingRegion(null)
    }

    if (draggingRegion) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggingRegion, tracks, zoom, snapGrid])

  // Track Management
  const addTrack = useCallback(() => {
    setIsCreatingNewTrack(true)
  }, [])

  const handleCreateTrack = useCallback((updates: { name: string; color: string; iconName: string; type?: 'audio' | 'midi' | 'drums' }) => {
    const newId = `t${Date.now()}`
    setTracks((prev) => [
      ...prev,
      {
        id: newId,
        name: updates.name,
        type: updates.type || 'midi',
        color: updates.color,
        iconName: updates.iconName,
        muted: false,
        solo: false,
        armed: false,
        volume: 70,
        pan: 0,
        regions: []
      }
    ])
    setSelectedTrackId(newId)
    setIsCreatingNewTrack(false)
  }, [])

  const deleteTrack = useCallback((id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id))
    if (selectedTrackId === id) {
      setSelectedTrackId(tracks.find((t) => t.id !== id)?.id || null)
    }
  }, [selectedTrackId, tracks])

  const updateTrack = useCallback((id: string, updates: Partial<DawTrack>) => {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }, [])

  const handleTrackCanvasClick = useCallback((e: React.MouseEvent, trackId: string) => {
    if (activeTool === 'pencil') {
      const rect = e.currentTarget.getBoundingClientRect()
      const clickX = e.clientX - rect.left + scrollLeft
      let start = clickX / (zoom * 4)
      if (snapGrid) start = Math.floor(start)

      setTracks((prev) => {
        const newTracks = [...prev]
        const trackIdx = newTracks.findIndex((t) => t.id === trackId)
        if (trackIdx === -1) return prev

        const track = newTracks[trackIdx]
        newTracks[trackIdx] = {
          ...track,
          regions: [
            ...track.regions,
            {
              id: `r_${Date.now()}`,
              start: start,
              duration: 1,
              name: 'Nouveau clip',
              color: track.color
            }
          ]
        }
        return newTracks
      })
    }
  }, [activeTool, zoom, snapGrid, scrollLeft])

  const selectedTrack = tracks.find((t) => t.id === selectedTrackId)

  // Get MIDI notes for selected track
  const getMidiNotes = (): MidiNote[] => {
    if (!selectedTrack || (selectedTrack.type !== 'midi' && selectedTrack.type !== 'drums')) {
      return []
    }
    // Mock notes - à remplacer par les vraies notes depuis les régions MIDI
    return [
      { x: 0, y: 0, w: 2 },
      { x: 4, y: 4, w: 2 },
      { x: 8, y: 0, w: 2 },
      { x: 12, y: 4, w: 2 }
    ]
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-24">
      <div className="w-full">
        {/* Header */}
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-2">
          Studio
        </h1>
        <p className="text-sm text-black/70 dark:text-white/70 mb-6">
          Digital Audio Workstation - Enregistrez, éditez et mixez vos projets audio
        </p>

        {/* Zone de contrôle principal */}
        <Block className="mb-6">
          <div className="flex items-center justify-center">
            <Transport
              isPlaying={isPlaying}
              currentTime={currentTime}
              bpm={bpm}
              timeSignature={timeSignature}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onStop={() => {
                setIsPlaying(false)
                setCurrentTime(0)
              }}
              onRewind={() => {
                setIsPlaying(false)
                setCurrentTime(0)
              }}
              onRecord={() => {}}
              onBpmChange={setBpm}
              onTimeSignatureChange={(sig) => setTimeSignature(sig)}
            />
          </div>
        </Block>

        {/* Main Content Grid */}
        <div className="flex gap-6">
          {/* Library Sidebar */}
          <Library />

          {/* Center Column */}
          <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col gap-6 p-2">
              {/* Arrangement Block */}
              <Arrangement
                tracks={tracks}
                selectedTrackId={selectedTrackId}
                activeTool={activeTool}
                snapGrid={snapGrid}
                zoom={zoom}
                currentTime={currentTime}
                scrollLeft={scrollLeft}
                onTrackSelect={setSelectedTrackId}
                onTrackDelete={deleteTrack}
                onTrackAdd={addTrack}
                onTrackUpdate={updateTrack}
                onTrackCustomize={setCustomizingTrackId}
                onToolChange={setActiveTool}
                onSnapToggle={setSnapGrid}
                onZoomChange={setZoom}
                onTimeClick={handleTimelineClick}
                onRegionMouseDown={handleRegionMouseDown}
                onCanvasClick={handleTrackCanvasClick}
                onScroll={setScrollLeft}
              />

              {/* Bottom Panel (Mixer/Editor) */}
              <BottomPanel
                activeTab={activeBottomTab}
                onTabChange={setActiveBottomTab}
                tracks={tracks}
                selectedTrackId={selectedTrackId}
                selectedTrack={selectedTrack}
                onTrackSelect={setSelectedTrackId}
                onTrackUpdate={updateTrack}
                meters={meters}
                masterVolume={masterVolume}
                onMasterVolumeChange={setMasterVolume}
                getMidiNotes={getMidiNotes}
              />
            </div>
          </div>
      </div>

      {/* Track Customization Modal */}
      <TrackCustomizationModal
        isOpen={customizingTrackId !== null || isCreatingNewTrack}
        onClose={() => {
          setCustomizingTrackId(null)
          setIsCreatingNewTrack(false)
        }}
        track={customizingTrackId ? tracks.find((t) => t.id === customizingTrackId) || null : null}
        isNewTrack={isCreatingNewTrack}
        onSave={(updates) => {
          if (isCreatingNewTrack) {
            handleCreateTrack(updates)
          } else if (customizingTrackId) {
            updateTrack(customizingTrackId, {
              name: updates.name,
              color: updates.color,
              iconName: updates.iconName
            })
            setCustomizingTrackId(null)
          }
        }}
      />
    </div>
  </div>
  )
}

