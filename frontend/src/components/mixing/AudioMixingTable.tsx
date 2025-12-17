import { useState } from 'react'
import { Volume2, VolumeX, Mic } from 'lucide-react'
import { Slider } from '../Slider'
import { Knob } from '../Knob'
import { CTA } from '../CTA'

interface Track {
  id: string
  name: string
  volume: number
  pan: number
  muted: boolean
  solo: boolean
  peak: number
  color: string
  send1?: number
  send2?: number
  eq?: {
    low: number
    mid: number
    high: number
  }
}

interface AudioMixingTableProps {
  tracks?: Track[]
}

export function AudioMixingTable({ tracks: initialTracks }: AudioMixingTableProps) {
  const [tracks, setTracks] = useState<Track[]>(
    initialTracks || [
      { id: '1', name: 'Guitar', volume: 75, pan: 0, muted: false, solo: false, peak: -12, color: '#ef4444', send1: 30, send2: 0, eq: { low: 0, mid: 0, high: 0 } },
      { id: '2', name: 'Bass', volume: 70, pan: 0, muted: false, solo: false, peak: -15, color: '#3b82f6', send1: 0, send2: 0, eq: { low: 0, mid: 0, high: 0 } },
      { id: '3', name: 'Drums', volume: 80, pan: 0, muted: false, solo: false, peak: -8, color: '#f59e0b', send1: 40, send2: 20, eq: { low: 0, mid: 0, high: 0 } },
      { id: '4', name: 'Vocals', volume: 65, pan: 0, muted: false, solo: false, peak: -18, color: '#10b981', send1: 50, send2: 0, eq: { low: 0, mid: 0, high: 0 } },
      { id: '5', name: 'Keys', volume: 60, pan: 0, muted: false, solo: false, peak: -20, color: '#8b5cf6', send1: 25, send2: 0, eq: { low: 0, mid: 0, high: 0 } }
    ]
  )
  const [masterVolume, setMasterVolume] = useState(85)
  const [masterMute, setMasterMute] = useState(false)

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const toggleMute = (id: string) => {
    updateTrack(id, { muted: !tracks.find(t => t.id === id)?.muted })
  }

  const toggleSolo = (id: string) => {
    const track = tracks.find(t => t.id === id)
    if (track?.solo) {
      setTracks(tracks.map(t => ({ ...t, solo: false })))
    } else {
      setTracks(tracks.map(t => ({ ...t, solo: t.id === id })))
    }
  }

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <div className="min-w-[1200px]">
        {/* En-tête avec contrôles master */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] border border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold uppercase tracking-wider text-black/85 dark:text-white/90">
                Master
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMasterMute(!masterMute)}
                  className={`
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                    ${masterMute
                      ? 'bg-red-500 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                      : 'bg-white dark:bg-gray-600 text-black/70 dark:text-white/70 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)]'
                    }
                  `}
                >
                  {masterMute ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <div className="flex items-center gap-2">
                  <Volume2 size={16} className="text-black/50 dark:text-white/50" />
                  <Slider
                    value={masterVolume}
                    onChange={setMasterVolume}
                    min={0}
                    max={100}
                    orientation="horizontal"
                    className="w-32"
                  />
                  <span className="text-xs font-mono text-black/70 dark:text-white/70 w-8">{masterVolume}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CTA
                variant="secondary"
                icon={<Mic size={16} />}
                className="text-xs"
              >
                Monitor
              </CTA>
            </div>
          </div>
        </div>

        {/* Table de mixage avec faders verticaux */}
        <div className="grid grid-cols-[repeat(5,1fr)_200px] gap-4">
          {/* Pistes */}
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] border border-black/10 dark:border-white/10 flex flex-col items-center gap-3"
            >
              {/* Nom de la piste */}
              <div className="flex flex-col items-center gap-2 w-full">
                <div className="flex items-center gap-2 w-full justify-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: track.color }}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-black/85 dark:text-white/90 truncate">
                    {track.name}
                  </span>
                </div>
              </div>

              {/* Boutons Mute/Solo */}
              <div className="flex gap-2 w-full justify-center">
                <button
                  onClick={() => toggleMute(track.id)}
                  className={`
                    flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200
                    ${track.muted
                      ? 'bg-red-500 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                      : 'bg-white dark:bg-gray-600 text-black/70 dark:text-white/70 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)]'
                    }
                  `}
                >
                  M
                </button>
                <button
                  onClick={() => toggleSolo(track.id)}
                  className={`
                    flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200
                    ${track.solo
                      ? 'bg-yellow-500 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                      : 'bg-white dark:bg-gray-600 text-black/70 dark:text-white/70 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)]'
                    }
                  `}
                >
                  S
                </button>
              </div>

              {/* Fader vertical Volume */}
              <div className="flex flex-col items-center gap-2 flex-1 min-h-[200px] w-full">
                <Slider
                  value={track.volume}
                  onChange={(val) => updateTrack(track.id, { volume: val })}
                  min={0}
                  max={100}
                  orientation="vertical"
                  className="flex-1 h-full"
                />
                <span className="text-xs font-mono text-black/70 dark:text-white/70">
                  {track.volume}
                </span>
              </div>

              {/* Pan Knob */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-black/70 dark:text-white/70">
                  Pan
                </span>
                <Knob
                  label=""
                  value={track.pan}
                  onChange={(val) => updateTrack(track.id, { pan: val })}
                  min={-100}
                  max={100}
                  size="sm"
                  showValue
                />
              </div>

              {/* Peak Meter */}
              <div className="w-full">
                <div className="h-20 bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden relative flex flex-col justify-end p-1">
                  <div
                    className={`w-full transition-all duration-75 ${
                      track.peak > -6 ? 'bg-red-500' :
                      track.peak > -12 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ height: `${Math.max(0, Math.min(100, ((track.peak + 60) / 60) * 100))}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-white font-bold">
                      {track.peak > -60 ? track.peak.toFixed(0) : '-∞'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Colonne Master */}
          <div className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)] border border-black/10 dark:border-white/10 flex flex-col items-center gap-3">
            <div className="flex flex-col items-center gap-2 w-full">
              <span className="text-xs font-bold uppercase tracking-wider text-black/85 dark:text-white/90">
                Master
              </span>
            </div>

            <div className="flex gap-2 w-full justify-center">
              <button
                onClick={() => setMasterMute(!masterMute)}
                className={`
                  flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200
                  ${masterMute
                    ? 'bg-red-500 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.3)]'
                    : 'bg-white dark:bg-gray-600 text-black/70 dark:text-white/70 shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)]'
                  }
                `}
              >
                M
              </button>
            </div>

            <div className="flex flex-col items-center gap-2 flex-1 min-h-[200px] w-full">
              <Slider
                value={masterVolume}
                onChange={setMasterVolume}
                min={0}
                max={100}
                orientation="vertical"
                className="flex-1 h-full"
              />
              <span className="text-xs font-mono text-black/70 dark:text-white/70">
                {masterVolume}
              </span>
            </div>

            <div className="w-full">
              <div className="h-20 bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden relative flex flex-col justify-end p-1">
                <div
                  className="w-full bg-green-500 transition-all duration-75"
                  style={{ height: '60%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
