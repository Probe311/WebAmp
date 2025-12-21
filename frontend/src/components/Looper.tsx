import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Looper as LooperEngine } from '../audio/looper'
import { Play, Pause, Mic, Square, Save, Settings2, Volume2, Headphones, Edit2, Check, X } from 'lucide-react'
import { Slider } from './Slider'
import { CTA } from './CTA'
import { usePedalboardEngine } from '../hooks/usePedalboardEngine'
import { LooperTrack } from './looper/types'
import { audioBufferToTrack, generateWaveformData } from './looper/utils'

export function Looper() {
  const { engine } = usePedalboardEngine()
  const looperRef = useRef<LooperEngine | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [tracks, setTracks] = useState<LooperTrack[]>([])
  const [currentPosition, setCurrentPosition] = useState(0)
  const [loopLength, setLoopLength] = useState(0)
  const [projectName, setProjectName] = useState('Sunday Jam #4')
  const [isEditingProjectName, setIsEditingProjectName] = useState(false)
  const [tempProjectName, setTempProjectName] = useState('Sunday Jam #4')
  const [tempo] = useState(110)
  const positionUpdateIntervalRef = useRef<number | null>(null)
  const projectNameInputRef = useRef<HTMLInputElement>(null)

  // Initialiser le looper avec le moteur audio
  useEffect(() => {
    if (!engine) return

    const initLooper = async () => {
      try {
        await engine.start()
        const audioCtx = engine.getAudioContext()
        if (!audioCtx) return

        if (audioCtx.state === 'suspended') {
          await audioCtx.resume()
        }

        if (!looperRef.current) {
          looperRef.current = new LooperEngine(audioCtx, {
            maxLength: 60,
            sampleRate: audioCtx.sampleRate
          })
          
          const output = engine.getOutput()
          if (output) {
            looperRef.current.connectInput(output)
          }
        }
      } catch (error) {
        // échec silencieux de l'initialisation du looper
      }
    }

    initLooper()

    return () => {
      if (looperRef.current) {
        looperRef.current.stopPlayback()
        looperRef.current.stopRecording()
      }
      if (positionUpdateIntervalRef.current) {
        window.clearInterval(positionUpdateIntervalRef.current)
        positionUpdateIntervalRef.current = null
      }
    }
  }, [engine])

  // Mettre à jour la position et l'état
  useEffect(() => {
    if (!looperRef.current) return

    const interval = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      const state = looperRef.current?.getState()
      if (state) {
        setIsPlaying(state.isPlaying)
        setIsRecording(state.isRecording)
        setCurrentPosition(state.currentPosition)
        setLoopLength(state.loopLength)
        
        // Synchroniser les tracks avec les buffers audio
        if (state.tracks.length !== tracks.length) {
          setTracks(prevTracks => {
            const newTracks: LooperTrack[] = state.tracks.map((buffer, index) => {
              const existingTrack = prevTracks.find(t => t.id === `track-${index}`)
              if (existingTrack) {
                return {
                  ...existingTrack,
                  audioBuffer: buffer,
                  waveformData: generateWaveformData(buffer)
                }
              }
              return audioBufferToTrack(buffer, index, `track-${index}`)
            })
            return newTracks
          })
        } else {
          // Mettre à jour les buffers audio existants si nécessaire
          setTracks(prevTracks => {
            return prevTracks.map((track, index) => {
              if (state.tracks[index] && track.audioBuffer !== state.tracks[index]) {
                return {
                  ...track,
                  audioBuffer: state.tracks[index],
                  waveformData: generateWaveformData(state.tracks[index])
                }
              }
              return track
            })
          })
        }
      }
    }, 100)

    positionUpdateIntervalRef.current = interval

    return () => {
      window.clearInterval(interval)
      positionUpdateIntervalRef.current = null
    }
  }, [tracks.length])

  const toggleTrackMute = useCallback((id: string) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, muted: !t.muted } : t))
  }, [tracks])

  const toggleTrackSolo = useCallback((id: string) => {
    const isSoloing = tracks.find(t => t.id === id)?.solo
    if (isSoloing) {
      setTracks(tracks.map(t => ({ ...t, solo: false })))
    } else {
      setTracks(tracks.map(t => ({ ...t, solo: t.id === id })))
    }
  }, [tracks])

  const updateVolume = useCallback((id: string, val: number) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, volume: val } : t))
  }, [tracks])

  const handleRecord = async () => {
    if (!looperRef.current || !engine) return

    try {
      await engine.start()
      const audioCtx = engine.getAudioContext()
      if (!audioCtx) return

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume()
      }

      if (isRecording) {
        looperRef.current.stopRecording()
        setIsRecording(false)
      } else {
        if (audioCtx.state === 'running') {
          looperRef.current.startRecording()
          setIsRecording(true)
        }
      }
    } catch (error) {
      // échec silencieux de l'enregistrement
    }
  }

  const handlePlay = async () => {
    if (!looperRef.current || !engine) return

    try {
      await engine.start()
      const audioCtx = engine.getAudioContext()
      if (!audioCtx) return

      if (audioCtx.state === 'suspended') {
        await audioCtx.resume()
      }

      if (isPlaying) {
        looperRef.current.stopPlayback()
        setIsPlaying(false)
      } else {
        if (audioCtx.state === 'running' && tracks.length > 0) {
          looperRef.current.startPlayback()
          setIsPlaying(true)
        }
      }
    } catch (error) {
      // échec silencieux de la lecture
    }
  }

  const handleStop = () => {
    if (looperRef.current) {
      looperRef.current.stopPlayback()
      setIsPlaying(false)
    }
  }

  const handleAddTrack = () => {
    // Cette fonctionnalité sera implémentée plus tard
  }

  const handleStartEditProjectName = () => {
    setTempProjectName(projectName)
    setIsEditingProjectName(true)
    setTimeout(() => {
      projectNameInputRef.current?.focus()
      projectNameInputRef.current?.select()
    }, 0)
  }

  const handleSaveProjectName = () => {
    if (tempProjectName.trim()) {
      setProjectName(tempProjectName.trim())
    }
    setIsEditingProjectName(false)
  }

  const handleCancelEditProjectName = () => {
    setTempProjectName(projectName)
    setIsEditingProjectName(false)
  }

  const handleProjectNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveProjectName()
    } else if (e.key === 'Escape') {
      handleCancelEditProjectName()
    }
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    const centis = Math.floor((seconds % 1) * 100)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${centis.toString().padStart(2, '0')}`
  }

  // Générer des données de waveform pour les tracks sans buffer
  const getWaveformData = (track: LooperTrack): number[] => {
    if (track.waveformData.length > 0) {
      return track.waveformData
    }
    if (track.audioBuffer) {
      return generateWaveformData(track.audioBuffer)
    }
    // Générer des données aléatoires pour la démo
    return Array(64).fill(0).map(() => Math.random() * 60 + 20)
  }

  return (
    <div className="h-full flex flex-col p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end mb-6">
        <div className="flex-1">
          <div className="text-neutral-500 dark:text-neutral-400 text-sm mb-1">
            Projet :
          </div>
          {isEditingProjectName ? (
            <div className="flex items-center gap-2">
              <input
                ref={projectNameInputRef}
                type="text"
                value={tempProjectName}
                onChange={(e) => setTempProjectName(e.target.value)}
                onBlur={handleSaveProjectName}
                onKeyDown={handleProjectNameKeyDown}
                className="text-3xl font-bold text-black dark:text-white bg-transparent border-b-2 border-blue-500 dark:border-blue-400 focus:outline-none focus:border-blue-600 dark:focus:border-blue-300 px-1"
                style={{ minWidth: '200px' }}
              />
              <button
                onClick={handleSaveProjectName}
                className="p-1 text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                title="Enregistrer"
              >
                <Check size={20} />
              </button>
              <button
                onClick={handleCancelEditProjectName}
                className="p-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                title="Annuler"
              >
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <h2 className="text-3xl font-bold text-black dark:text-white">
                {projectName}
              </h2>
              <button
                onClick={handleStartEditProjectName}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-neutral-400 hover:text-black dark:hover:text-white"
                title="Éditer le nom du projet"
              >
                <Edit2 size={18} />
              </button>
            </div>
          )}
        </div>
        <div className="text-3xl font-mono text-red-500 dark:text-red-400 tracking-widest bg-white dark:bg-gray-800 px-4 py-2 rounded-lg border border-black/10 dark:border-white/10">
          {formatTime(currentPosition)}
        </div>
      </div>

      {/* Tracks Area */}
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto custom-scrollbar mb-6 pr-2">
        {tracks.map(track => {
          const waveformData = getWaveformData(track)
          
          const isSoloActive = tracks.some(t => t.solo)
          const isMuted = track.muted || (isSoloActive && !track.solo)

          return (
            <div 
              key={track.id} 
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-4 group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-black/10 dark:border-white/10"
            >
              {/* Controls */}
              <div className="flex flex-col gap-2 w-24 flex-shrink-0">
                <span className="text-xs font-bold uppercase text-neutral-400 dark:text-neutral-500 truncate">
                  {track.name}
                </span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleTrackMute(track.id)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold border transition-colors ${
                      track.muted 
                        ? 'bg-red-500/20 text-red-500 border-red-500 dark:bg-red-500/30 dark:text-red-400' 
                        : 'bg-gray-100 dark:bg-gray-900 text-neutral-500 dark:text-neutral-400 border-transparent'
                    }`}
                  >
                    M
                  </button>
                  <button 
                    onClick={() => toggleTrackSolo(track.id)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold border transition-colors ${
                      track.solo 
                        ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500 dark:bg-yellow-500/30 dark:text-yellow-400' 
                        : 'bg-gray-100 dark:bg-gray-900 text-neutral-500 dark:text-neutral-400 border-transparent'
                    }`}
                  >
                    S
                  </button>
                </div>
              </div>

              {/* Waveform */}
              <div className="flex-1 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg relative overflow-hidden flex items-center px-2 gap-1">
                {/* Playhead */}
                {isPlaying && loopLength > 0 && (
                  <div 
                    className="absolute top-0 bottom-0 bg-white dark:bg-white z-10 transition-all ease-linear" 
                    style={{ 
                      width: 2,
                      left: `${(currentPosition / loopLength) * 100}%`,
                      transitionDuration: '100ms'
                    }} 
                  />
                )}
                
                {waveformData.map((height, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      isMuted 
                        ? 'bg-neutral-300 dark:bg-neutral-800' 
                        : track.color
                    }`} 
                    style={{ 
                      height: `${height}%`, 
                      opacity: isMuted ? 0.3 : 0.8 
                    }} 
                  />
                ))}
              </div>

              {/* Volume */}
              <div className="h-full w-32 flex items-center gap-3 px-2">
                <Volume2 size={16} className="text-neutral-500 dark:text-neutral-400" />
                <Slider 
                  value={track.volume} 
                  onChange={(v) => updateVolume(track.id, v)}
                  min={0}
                  max={100}
                  orientation="horizontal"
                />
              </div>
            </div>
          )
        })}
        
        {/* Add Track Placeholder */}
        <div 
          onClick={handleAddTrack}
          className="h-24 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex items-center justify-center text-gray-400 dark:text-gray-600 hover:text-black dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition-colors cursor-pointer"
        >
          <span className="font-medium flex items-center gap-2">Ajouter une piste</span>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-6 rounded-3xl border border-black/10 dark:border-white/10 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-neutral-300 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
            <Settings2 size={20} />
          </button>
          <div className="flex flex-col">
            <span className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Tempo</span>
            <span className="font-mono text-xl text-black dark:text-white">
              {tempo} <span className="text-xs text-neutral-500 dark:text-neutral-400">BPM</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={handleRecord}
            className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 text-white border-red-500 hover:bg-red-600'
                : 'bg-red-500/10 text-red-500 border-red-500/50 hover:bg-red-500/20 dark:bg-red-500/20 dark:text-red-400'
            }`}
          >
            <Mic size={24} fill={isRecording ? "currentColor" : "none"} />
          </button>
          <CTA
            onClick={handlePlay}
            variant="important"
            className="w-20 h-20 rounded-full"
            icon={isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          />
          <button 
            onClick={handleStop}
            className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-black dark:text-white flex items-center justify-center transition-all"
          >
            <Square size={24} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex flex-col items-center gap-1 text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
            <Headphones size={20} />
            <span className="text-[10px]">Moniteur</span>
          </button>
          <CTA
            variant="important"
            className="flex flex-col items-center gap-1"
            icon={<Save size={20} />}
          >
            <span className="text-[10px]">Enregistrer</span>
          </CTA>
        </div>
      </div>
    </div>
  )
}
