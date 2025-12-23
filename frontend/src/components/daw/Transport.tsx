import React, { useState, useEffect } from 'react'
import { Play, Pause, Square, SkipBack, Mic, ChevronUp, ChevronDown } from 'lucide-react'
import { CTA } from '../CTA'

interface TransportProps {
  isPlaying: boolean
  currentTime: number // en barres
  bpm: number
  timeSignature: [number, number]
  onPlay: () => void
  onPause: () => void
  onStop: () => void
  onRewind: () => void
  onRecord: () => void
  onBpmChange: (bpm: number) => void
  onTimeSignatureChange: (timeSignature: [number, number]) => void
}

export function Transport({
  isPlaying,
  currentTime,
  bpm,
  timeSignature,
  onPlay,
  onPause,
  onStop,
  onRewind,
  onRecord,
  onBpmChange,
  onTimeSignatureChange
}: TransportProps) {
  const [isEditingBpm, setIsEditingBpm] = useState(false)
  const [isEditingTimeSig, setIsEditingTimeSig] = useState(false)
  const [tempBpm, setTempBpm] = useState(bpm.toString())
  const [tempNumerator, setTempNumerator] = useState(timeSignature[0].toString())
  const [tempDenominator, setTempDenominator] = useState(timeSignature[1].toString())

  // Synchroniser les valeurs temporaires avec les props
  useEffect(() => {
    if (!isEditingBpm) {
      setTempBpm(bpm.toString())
    }
  }, [bpm, isEditingBpm])

  useEffect(() => {
    if (!isEditingTimeSig) {
      setTempNumerator(timeSignature[0].toString())
      setTempDenominator(timeSignature[1].toString())
    }
  }, [timeSignature, isEditingTimeSig])

  const formatTime = (bars: number) => {
    const bar = Math.floor(bars)
    const beat = Math.floor((bars % 1) * timeSignature[0])
    const sixteenth = Math.floor(((bars % 1) * timeSignature[0] - beat) * 4)
    return `${bar.toString().padStart(3, '0')}:${beat.toString().padStart(2, '0')}.${sixteenth.toString().padStart(2, '0')}`
  }

  const handleBpmChange = (newBpm: number) => {
    const clampedBpm = Math.max(20, Math.min(300, newBpm))
    onBpmChange(clampedBpm)
    setTempBpm(clampedBpm.toString())
  }

  const handleBpmSubmit = () => {
    const numBpm = parseInt(tempBpm, 10)
    if (!isNaN(numBpm) && numBpm >= 20 && numBpm <= 300) {
      onBpmChange(numBpm)
    } else {
      setTempBpm(bpm.toString())
    }
    setIsEditingBpm(false)
  }

  const handleTimeSigSubmit = () => {
    const num = parseInt(tempNumerator, 10)
    const den = parseInt(tempDenominator, 10)
    if (!isNaN(num) && !isNaN(den) && num >= 1 && num <= 32 && den >= 1 && den <= 32) {
      onTimeSignatureChange([num, den])
    } else {
      setTempNumerator(timeSignature[0].toString())
      setTempDenominator(timeSignature[1].toString())
    }
    setIsEditingTimeSig(false)
  }

  return (
    <div className="flex items-center gap-8">
      {/* Time Display */}
      <div className="font-mono text-2xl font-bold text-orange-500 dark:text-orange-400 w-36 text-center tracking-wider">
        {formatTime(currentTime)}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <CTA
          variant="icon-only"
          icon={<SkipBack size={16} fill="currentColor" />}
          onClick={onRewind}
          title="Retour au début"
        />
        <CTA
          variant={isPlaying ? 'important' : 'primary'}
          icon={isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          onClick={isPlaying ? onPause : onPlay}
          title={isPlaying ? 'Pause' : 'Lecture'}
          className={`w-14 h-14 min-w-[56px] min-h-[56px] rounded-full ${isPlaying ? 'scale-105' : ''}`}
        />
        <CTA
          variant="icon-only"
          icon={<Square size={16} fill="currentColor" />}
          onClick={onStop}
          title="Arrêt"
        />
        <CTA
          variant="danger"
          icon={<Mic size={18} />}
          onClick={onRecord}
          title="Enregistrer"
          className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full"
        />
      </div>

      {/* Metronome Info */}
      <div className="flex flex-col leading-none border-l border-black/10 dark:border-white/10 pl-6">
        {/* BPM */}
        <div className="flex items-center gap-1 group">
          {isEditingBpm ? (
            <input
              type="number"
              value={tempBpm}
              onChange={(e) => setTempBpm(e.target.value)}
              onBlur={handleBpmSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleBpmSubmit()
                if (e.key === 'Escape') {
                  setTempBpm(bpm.toString())
                  setIsEditingBpm(false)
                }
              }}
              min={20}
              max={300}
              className="text-lg font-bold text-black dark:text-white bg-transparent border-b-2 border-orange-500 dark:border-orange-400 w-16 text-center focus:outline-none"
              autoFocus
            />
          ) : (
            <span
              className="text-lg font-bold text-black dark:text-white cursor-pointer hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              onClick={() => setIsEditingBpm(true)}
            >
              {bpm}
            </span>
          )}
          <span className="text-[10px] text-black/50 dark:text-white/50 ml-1">BPM</span>
          {!isEditingBpm && (
            <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity ml-1">
              <button
                onClick={() => handleBpmChange(bpm + 1)}
                className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded"
              >
                <ChevronUp size={10} />
              </button>
              <button
                onClick={() => handleBpmChange(bpm - 1)}
                className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded"
              >
                <ChevronDown size={10} />
              </button>
            </div>
          )}
        </div>
        {/* Time Signature */}
        <div className="flex items-center gap-1 group">
          {isEditingTimeSig ? (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={tempNumerator}
                onChange={(e) => setTempNumerator(e.target.value)}
                onBlur={handleTimeSigSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTimeSigSubmit()
                  if (e.key === 'Escape') {
                    setTempNumerator(timeSignature[0].toString())
                    setTempDenominator(timeSignature[1].toString())
                    setIsEditingTimeSig(false)
                  }
                }}
                min={1}
                max={32}
                className="text-xs font-bold text-orange-500 dark:text-orange-400 bg-transparent border-b-2 border-orange-500 dark:border-orange-400 w-8 text-center focus:outline-none"
                autoFocus
              />
              <span className="text-xs font-bold text-orange-500 dark:text-orange-400">/</span>
              <input
                type="number"
                value={tempDenominator}
                onChange={(e) => setTempDenominator(e.target.value)}
                onBlur={handleTimeSigSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTimeSigSubmit()
                  if (e.key === 'Escape') {
                    setTempNumerator(timeSignature[0].toString())
                    setTempDenominator(timeSignature[1].toString())
                    setIsEditingTimeSig(false)
                  }
                }}
                min={1}
                max={32}
                className="text-xs font-bold text-orange-500 dark:text-orange-400 bg-transparent border-b-2 border-orange-500 dark:border-orange-400 w-8 text-center focus:outline-none"
              />
            </div>
          ) : (
            <>
              <span
                className="text-xs font-bold text-orange-500 dark:text-orange-400 cursor-pointer hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
                onClick={() => setIsEditingTimeSig(true)}
              >
                {timeSignature[0]}/{timeSignature[1]}
              </span>
              <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity ml-1">
                <button
                  onClick={() => {
                    const newNum = Math.min(32, timeSignature[0] + 1)
                    onTimeSignatureChange([newNum, timeSignature[1]])
                  }}
                  className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded"
                  title="Augmenter le numérateur"
                >
                  <ChevronUp size={10} />
                </button>
                <button
                  onClick={() => {
                    const newNum = Math.max(1, timeSignature[0] - 1)
                    onTimeSignatureChange([newNum, timeSignature[1]])
                  }}
                  className="p-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded"
                  title="Diminuer le numérateur"
                >
                  <ChevronDown size={10} />
                </button>
              </div>
            </>
          )}
          <span className="text-black/50 dark:text-white/50 ml-1 text-[10px]">SIG</span>
        </div>
      </div>
    </div>
  )
}

