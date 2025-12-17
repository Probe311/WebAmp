import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { pedalLibrary } from '../../data/pedals'
import { PedalFrame } from './PedalFrame'
import { SwitchSelector } from '../SwitchSelector'
import type { PedalComponentProps } from './types'
import { PEDAL_BUTTON_COLORS } from '../../utils/pedalColors'

const pedalId = 'boss-tu3'

// Notes de guitare standard (E2, A2, D3, G3, B3, E4)
const GUITAR_NOTES = ['E', 'A', 'D', 'G', 'B', 'E']
const GUITAR_FREQUENCIES = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]

// Notes chromatiques (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTE_FREQUENCIES: Record<string, number[]> = {
  'C': [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50],
  'C#': [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73],
  'D': [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66],
  'D#': [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51],
  'E': [20.60, 41.20, 82.41, 164.81, 329.63, 659.25, 1318.51],
  'F': [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91],
  'F#': [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98],
  'G': [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98],
  'G#': [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22],
  'A': [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00],
  'A#': [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66],
  'B': [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53]
}

// Trouve la note la plus proche d'une fréquence donnée
function findClosestNote(frequency: number, isGuitarMode: boolean): { note: string; octave: number; cents: number } {
  if (frequency < 20 || frequency > 2000) {
    return { note: '-', octave: 0, cents: 0 }
  }

  if (isGuitarMode) {
    // Mode guitare : seulement les 6 cordes
    let closestNote = 'E'
    let closestFreq = GUITAR_FREQUENCIES[0]
    let minDiff = Math.abs(frequency - closestFreq)
    
    for (let i = 0; i < GUITAR_NOTES.length; i++) {
      const diff = Math.abs(frequency - GUITAR_FREQUENCIES[i])
      if (diff < minDiff) {
        minDiff = diff
        closestNote = GUITAR_NOTES[i]
        closestFreq = GUITAR_FREQUENCIES[i]
      }
    }
    
    const cents = 1200 * Math.log2(frequency / closestFreq)
    return { note: closestNote, octave: 0, cents }
  } else {
    // Mode chromatique : toutes les notes
    let closestNote = 'C'
    let closestFreq = NOTE_FREQUENCIES['C'][3] // Octave 3 par défaut
    let minDiff = Infinity
    
    for (const note of CHROMATIC_NOTES) {
      const octaves = NOTE_FREQUENCIES[note]
      for (let octave = 0; octave < octaves.length; octave++) {
        const freq = octaves[octave]
        const diff = Math.abs(frequency - freq)
        if (diff < minDiff) {
          minDiff = diff
          closestNote = note
          closestFreq = freq
        }
      }
    }
    
    const cents = 1200 * Math.log2(frequency / closestFreq)
    // Déterminer l'octave approximative
    const octave = Math.round(Math.log2(frequency / NOTE_FREQUENCIES[closestNote][0]))
    return { note: closestNote, octave, cents }
  }
}

// Détecte la fréquence dominante avec Autocorrelation
function detectPitch(buffer: Float32Array, sampleRate: number): number {
  const minPeriod = Math.floor(sampleRate / 2000) // 2000 Hz max
  const maxPeriod = Math.floor(sampleRate / 80) // 80 Hz min
  const correlation = new Float32Array(maxPeriod - minPeriod)
  
  let maxCorrelation = 0
  let bestPeriod = 0
  
  for (let period = minPeriod; period < maxPeriod; period++) {
    let sum = 0
    for (let i = 0; i < buffer.length - period; i++) {
      sum += buffer[i] * buffer[i + period]
    }
    correlation[period - minPeriod] = sum
    if (sum > maxCorrelation) {
      maxCorrelation = sum
      bestPeriod = period
    }
  }
  
  if (maxCorrelation < 0.1 || bestPeriod === 0) {
    return 0
  }
  
  return sampleRate / bestPeriod
}

export const BossTu3Controls = ({
  values = {},
  onChange,
  bypassed = false,
  accentColor
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  // Utiliser accentColor depuis les props, avec fallback sur model.accentColor
  const pedalAccentColor = accentColor || model.accentColor

  const [detectedNote, setDetectedNote] = useState<string>('-')
  const [detectedFrequency, setDetectedFrequency] = useState<number>(0)
  const [cents, setCents] = useState<number>(0)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [autoTune, setAutoTune] = useState<boolean>(false)
  
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const bufferRef = useRef(new Float32Array(4096))

  const mode = values.mode ?? 0
  const isGuitarMode = mode === 1

  // Initialiser l'audio context et l'analyser
  const initializeAudio = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      sourceRef.current = source
      
      const analyser = audioContextRef.current.createAnalyser()
      analyser.fftSize = 8192
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser
      
      source.connect(analyser)
    } catch (error) {
      // échec silencieux d'accès au microphone
    }
  }, [])

  // Arrêter l'audio
  const stopAudio = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    
    if (analyserRef.current) {
      analyserRef.current.disconnect()
      analyserRef.current = null
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }, [])

  // Analyser le signal audio
  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current || bypassed) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }

    analyserRef.current.getFloatTimeDomainData(bufferRef.current)
    
    // Calculer le niveau RMS pour détecter si un signal est présent
    let rms = 0
    for (let i = 0; i < bufferRef.current.length; i++) {
      rms += bufferRef.current[i] * bufferRef.current[i]
    }
    rms = Math.sqrt(rms / bufferRef.current.length)
    
    const threshold = 0.01
    if (rms < threshold) {
      setDetectedNote('-')
      setDetectedFrequency(0)
      setCents(0)
    } else {
      const frequency = detectPitch(bufferRef.current, audioContextRef.current.sampleRate)
      
      if (frequency > 0) {
        setDetectedFrequency(frequency)
        const { note, cents: detectedCents } = findClosestNote(frequency, isGuitarMode)
        setDetectedNote(note)
        setCents(detectedCents)
      }
    }
    
    // Continuer l'analyse
    animationFrameRef.current = requestAnimationFrame(analyzeAudio)
  }, [bypassed, isGuitarMode])
  
  // Référence stable pour analyzeAudio
  const analyzeAudioRef = useRef(analyzeAudio)
  useEffect(() => {
    analyzeAudioRef.current = analyzeAudio
  }, [analyzeAudio])

  // Démarrer/arrêter l'analyse
  useEffect(() => {
    if (!bypassed && isActive) {
      initializeAudio().then(() => {
        if (analyserRef.current && !bypassed) {
          const loop = () => {
            if (!analyserRef.current || !audioContextRef.current || bypassed) {
              return
            }
            analyzeAudioRef.current()
          }
          animationFrameRef.current = requestAnimationFrame(loop)
        }
      })
    } else {
      stopAudio()
      setDetectedNote('-')
      setDetectedFrequency(0)
      setCents(0)
      setIsActive(false)
    }
    
    return () => {
      stopAudio()
    }
  }, [bypassed, isActive, initializeAudio, stopAudio])

  const handleSoundA = () => {
    // Jouer la note A4 (440 Hz) comme référence
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    
    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)
    
    oscillator.frequency.value = 440
    oscillator.type = 'sine'
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1)
    
    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + 1)
  }

  const handleTuneA = () => {
    // Activer/désactiver l'accordage
    setIsActive(!isActive)
  }

  const handleAutoTune = () => {
    setAutoTune(!autoTune)
  }

  const hasDetection = detectedNote !== '-' && detectedFrequency > 0
  // Plus d'aiguille : on conserve juste la détection pour la couleur de la barre

  // Notes à afficher selon le mode
  const displayNotes = isGuitarMode ? GUITAR_NOTES : CHROMATIC_NOTES.slice(0, 7) // Afficher les 7 premières notes chromatiques

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Switch Selector pour le mode */}
      {model.parameters.mode && (
        <div className="w-full mb-1.5">
          <SwitchSelector
            value={mode}
            min={model.parameters.mode.min}
            max={model.parameters.mode.max}
            labels={model.parameters.mode.labels || []}
            icons={model.parameters.mode.icons}
            color={pedalAccentColor}
            onChange={(v) => onChange?.('mode', v)}
            className="switch-selector-full-width"
          />
        </div>
      )}

      {/* Affichage type VU horizontal basé sur les cents (-50 à +50) */}
      <div className="w-full max-w-[240px] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-black/70 px-1">
          <span>-50</span>
          <span>0</span>
          <span>+50</span>
        </div>
        <div
          className="w-full rounded-md px-2 py-2"
          style={{
            background: PEDAL_BUTTON_COLORS.bypassed.backgroundColor,
            boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.05), inset -1px -1px 2px rgba(255,255,255,0.8)'
          }}
        >
          {(() => {
            const clamped = Math.max(-50, Math.min(50, cents))
            const ratio = (clamped + 50) / 100 // 0 à 1
            const segments = 21
            const activeUntil = Math.round(ratio * (segments - 1))
            return (
              <div className="grid grid-cols-21 gap-[3px] h-4">
                {Array.from({ length: segments }).map((_, idx) => {
                  const pos = idx / (segments - 1) // 0 à 1
                  // Couleur du segment : rouge (-50) -> jaune (0) -> vert (+50)
                  const hue = 0 + (120 * pos)
                  const bg = idx <= activeUntil ? `hsl(${hue}deg 80% 55%)` : 'rgba(0,0,0,0.1)'
                  return (
                    <div
                      key={idx}
                      className="rounded-sm"
                      style={{ background: bg }}
                    />
                  )
                })}
              </div>
            )
          })()}
        </div>
      </div>

      {/* Affichage de la note et fréquence */}
      <div className="flex flex-col items-center gap-1 w-full">
        <div className="flex items-center gap-2">
          <span
            className="text-6xl font-bold text-black/90"
            style={{
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
            }}
          >
            {detectedNote}
          </span>
          {hasDetection && (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
        {detectedFrequency > 0 && (
          <span className="text-sm text-black/75">
            {detectedFrequency.toFixed(1)} Hz
          </span>
        )}
      </div>

      {/* Barre de sélection de notes */}
      <div
        className="w-full px-1.5 py-1.5 rounded-lg"
        style={{
          background: PEDAL_BUTTON_COLORS.bypassed.backgroundColor,
          boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.05), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
        }}
      >
        <div className="flex justify-around items-center gap-1">
          {displayNotes.map((note) => (
            <div
              key={note}
              className={`flex-1 text-center py-1.5 px-2 rounded transition-all ${
                detectedNote === note && isActive
                  ? 'bg-red-500 text-white'
                  : 'text-black/60'
              }`}
              style={{
                boxShadow:
                  detectedNote === note && isActive
                    ? '2px 2px 4px rgba(0, 0, 0, 0.1), -2px -2px 4px rgba(255, 255, 255, 0.9)'
                    : 'none'
              }}
            >
              <span className="text-sm font-semibold">{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 w-full px-1.5">
        <button
          onClick={handleSoundA}
          className="flex-1 py-1.5 px-2.5 rounded-lg text-sm font-semibold text-black/70 transition-all"
          style={{
            background: PEDAL_BUTTON_COLORS.active.backgroundColor,
            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow = 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
          }}
        >
          Sound A
        </button>
        <button
          onClick={handleTuneA}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-sm font-semibold transition-all ${
            isActive ? 'text-white' : 'text-black/70'
          }`}
          style={{
            background: isActive ? pedalAccentColor : '#ffffff',
            boxShadow: isActive
              ? '2px 2px 4px rgba(0, 0, 0, 0.15), -2px -2px 4px rgba(255, 255, 255, 0.9)'
              : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow = 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.boxShadow = isActive
              ? '2px 2px 4px rgba(0, 0, 0, 0.15), -2px -2px 4px rgba(255, 255, 255, 0.9)'
              : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
          }}
        >
          Tune A
        </button>
        <button
          onClick={handleAutoTune}
          className={`flex-1 py-1.5 px-2.5 rounded-lg text-sm font-semibold transition-all ${
            autoTune ? 'text-white' : 'text-black/70'
          }`}
          style={{
            background: autoTune ? pedalAccentColor : '#ffffff',
            boxShadow: autoTune
              ? '2px 2px 4px rgba(0, 0, 0, 0.15), -2px -2px 4px rgba(255, 255, 255, 0.9)'
              : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.boxShadow = 'inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.boxShadow = autoTune
              ? '2px 2px 4px rgba(0, 0, 0, 0.15), -2px -2px 4px rgba(255, 255, 255, 0.9)'
              : '2px 2px 4px rgba(0, 0, 0, 0.08), -2px -2px 4px rgba(255, 255, 255, 0.9)'
          }}
        >
          Auto Tune
        </button>
      </div>
    </div>
  )
}

/**
 * Composant complet de la pédale Boss TU-3
 * Layout flex : tuner avec détection audio complexe
 * Taille L requise pour afficher tous les éléments du tuner
 */
export function BossTu3Pedal({
  values = {},
  onChange,
  bypassed = false,
  onBypassToggle,
  bottomActions,
  accentColor
}: PedalComponentProps) {
  const model = useMemo(() => pedalLibrary.find((p) => p.id === pedalId), [])
  
  if (!model) return null

  return (
    <PedalFrame
      model={model}
      size="L"
      layout="flex"
      bypassed={bypassed}
      onBypassToggle={onBypassToggle}
      showFootswitch={false}
      bottomActions={bottomActions}
    >
      <BossTu3Controls values={values} onChange={onChange} bypassed={bypassed} accentColor={accentColor} />
    </PedalFrame>
  )
}

// Export pour compatibilité avec l'ancien système
export const BossTu3 = ({
  values = {},
  onChange,
  bypassed = false
}: PedalComponentProps) => {
  const model = pedalLibrary.find((p) => p.id === pedalId)
  if (!model) return null

  return (
    <div className="relative select-none">
      {/* Utiliser PedalFrame pour la nouvelle architecture */}
      <BossTu3Pedal 
        values={values} 
        onChange={onChange} 
        bypassed={bypassed}
      />
    </div>
  )
}

export default BossTu3Pedal

