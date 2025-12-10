import { useEffect, useMemo, useState } from 'react'
import { Power, Link2 } from 'lucide-react'
import { Knob } from '../Knob'
import { Slider } from '../Slider'
import type { MonitoringStats } from './types'

interface MonitoringPanelProps {
  stats: MonitoringStats
}

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value))

const dbToPercent = (db: number) => {
  // Transforme une valeur en dB (pic) vers une échelle 0-120 pour donner plus d'amplitude au gros bouton
  const scaled = ((db + 60) / 60) * 120
  return clamp(isFinite(scaled) ? scaled : 0, 0, 120)
}

const badgeClass = (active: boolean) =>
  `px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 border ${
    active
      ? 'bg-black dark:bg-white text-white dark:text-black shadow-[0_8px_18px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_18px_rgba(255,255,255,0.2)] border-black dark:border-white'
      : 'bg-white dark:bg-gray-700 text-black/70 dark:text-white/70 border-black/15 dark:border-white/15 hover:border-black/25 dark:hover:border-white/25 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,1)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]'
  }`

export function MonitoringPanel({ stats }: MonitoringPanelProps) {
  const [level, setLevel] = useState(() => dbToPercent(stats.peakInput))
  const [width, setWidth] = useState(40)
  const [drive, setDrive] = useState(() => clamp(stats.cpu))
  const [output, setOutput] = useState(() => dbToPercent(stats.peakOutput))
  const [bias, setBias] = useState(50)
  const [tone, setTone] = useState(60)
  const [mix, setMix] = useState(100)

  const [low, setLow] = useState(60)
  const [mid, setMid] = useState(45)
  const [high, setHigh] = useState(70)
  const [air, setAir] = useState(85)

  const [mode, setMode] = useState<'fast' | 'slow' | 'auto'>('fast')
  const [eqEnabled, setEqEnabled] = useState(true)

  useEffect(() => {
    setDrive(clamp(stats.cpu))
    setOutput(dbToPercent(stats.peakOutput))
    setLevel(dbToPercent(stats.peakInput))
    setTone(clamp(40 + stats.latency * 4))
  }, [stats])

  const eqPolyline = useMemo(() => {
    const positions = [8, 32, 60, 88]
    const values = [low, mid, high, air]
    const coords = positions
      .map((x, index) => {
        const y = 90 - values[index] * 0.6
        return `${x},${y}`
      })
      .join(' ')
    return coords
  }, [low, mid, high, air])

  const eqFill = useMemo(() => `0,100 ${eqPolyline} 100,100`, [eqPolyline])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-black/85 dark:text-white/85">
      {/* Colonne gauche : niveau + width */}
      <section className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(40,40,40,0.5)] border border-black/5 dark:border-white/10 flex flex-col gap-6 min-w-[220px]">
        <div className="flex justify-center">
          <button
            className="w-10 h-10 rounded-full bg-[#f7f7f7] dark:bg-gray-700 border border-black/10 dark:border-white/10 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,1)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]"
            aria-label="Alimentation canal gauche"
          >
            <Power size={18} className="text-black/60 dark:text-white/60" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-6">
          <Knob
            size="lg"
            label="Level"
            value={level}
            min={0}
            max={120}
            onChange={setLevel}
            color="#4b5563"
            valueRawDisplayFn={(v: number) => `${Math.round((v / 120) * 12)} dB`}
          />
          <div className="flex justify-center">
            <Knob
              size="sm"
              label="Width"
              value={width}
              min={0}
              max={100}
              onChange={setWidth}
              color="#6b7280"
              valueRawDisplayFn={(v: number) => `${Math.round(v)}%`}
            />
          </div>
        </div>
      </section>

      {/* Colonne centre : EQ */}
      <section className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(40,40,40,0.5)] border border-black/5 dark:border-white/10 flex flex-col gap-5 min-w-[260px]">
        <div className="flex justify-center">
          <button
            onClick={() => setEqEnabled((prev) => !prev)}
            onTouchStart={(e) => {
              e.preventDefault()
              setEqEnabled((prev) => !prev)
            }}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 touch-manipulation ${
              eqEnabled
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[0_8px_18px_rgba(0,0,0,0.2)] dark:shadow-[0_8px_18px_rgba(255,255,255,0.2)]'
                : 'bg-[#f7f7f7] dark:bg-gray-700 text-black/60 dark:text-white/60 border-black/10 dark:border-white/10 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,1)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]'
            }`}
            aria-label="Activer EQ"
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            <Power size={18} />
          </button>
        </div>

        <div className="bg-[#f9fafb] dark:bg-gray-700 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-[inset_2px_2px_6px_rgba(0,0,0,0.04),inset_-2px_-2px_6px_rgba(255,255,255,1)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.5),inset_-2px_-2px_6px_rgba(60,60,60,0.5)]">
          <div className="flex justify-between text-[0.65rem] font-semibold text-black/50 dark:text-white/50 mb-2 px-1">
            <span>+12</span>
            <span>0</span>
            <span>-12</span>
          </div>
          <svg viewBox="0 0 100 100" className="w-full h-32">
            <defs>
              <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <g stroke="#e5e7eb" strokeWidth="0.5">
              {[20, 40, 60, 80].map((x) => (
                <line key={x} x1={x} x2={x} y1="6" y2="94" strokeDasharray="2 2" />
              ))}
              {[30, 50, 70].map((y) => (
                <line key={y} x1="4" x2="96" y1={y} y2={y} strokeDasharray="2 2" />
              ))}
            </g>
            <polygon points={eqFill} fill="url(#eqFill)" stroke="none" opacity={eqEnabled ? 1 : 0.35} />
            <polyline
              points={eqPolyline}
              fill="none"
              stroke={eqEnabled ? '#f97316' : '#9ca3af'}
              strokeWidth="1.8"
            />
            {[low, mid, high, air].map((value, index) => {
              const x = [8, 32, 60, 88][index]
              const y = 90 - value * 0.6
              return (
                <circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="2.6"
                  fill="#111827"
                  stroke="#f3f4f6"
                  strokeWidth="1"
                  opacity={eqEnabled ? 1 : 0.45}
                />
              )
            })}
          </svg>
          <div className="flex justify-between text-[0.65rem] text-black/50 dark:text-white/50 font-semibold px-1">
            <span>100 Hz</span>
            <span>500 Hz</span>
            <span>2 kHz</span>
            <span>10 kHz</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <Slider value={low} min={0} max={100} label="Low" onChange={(v) => setLow(clamp(v))} />
          <Slider value={mid} min={0} max={100} label="Mid" onChange={(v) => setMid(clamp(v))} />
          <Slider value={high} min={0} max={100} label="High" onChange={(v) => setHigh(clamp(v))} />
          <Slider value={air} min={0} max={100} label="Air" onChange={(v) => setAir(clamp(v))} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button 
              className={`${badgeClass(mode === 'fast')} touch-manipulation`} 
              onClick={() => setMode('fast')}
              onTouchStart={(e) => {
                e.preventDefault()
                setMode('fast')
              }}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              Fast
            </button>
            <button 
              className={`${badgeClass(mode === 'slow')} touch-manipulation`} 
              onClick={() => setMode('slow')}
              onTouchStart={(e) => {
                e.preventDefault()
                setMode('slow')
              }}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              Slow
            </button>
            <button 
              className={`${badgeClass(mode === 'auto')} touch-manipulation`} 
              onClick={() => setMode('auto')}
              onTouchStart={(e) => {
                e.preventDefault()
                setMode('auto')
              }}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              Auto
            </button>
          </div>
        </div>
      </section>

      {/* Colonne droite : drive / output / mix */}
      <section className="bg-white dark:bg-gray-800 rounded-[24px] p-6 shadow-[0_12px_28px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_12px_28px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(40,40,40,0.5)] border border-black/5 dark:border-white/10 flex flex-col gap-6 min-w-[240px]">
        <div className="flex justify-center">
          <button
            className="w-10 h-10 rounded-full bg-[#f7f7f7] dark:bg-gray-700 border border-black/10 dark:border-white/10 flex items-center justify-center shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05),inset_-2px_-2px_4px_rgba(255,255,255,1)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]"
            aria-label="Alimentation canal droit"
          >
            <Power size={18} className="text-black/60 dark:text-white/60" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Knob
            size="md"
            label="Drive"
            value={drive}
            min={0}
            max={100}
            onChange={(v) => setDrive(clamp(v))}
            color="#111827"
            valueRawDisplayFn={(v: number) => `${Math.round(v)}%`}
          />
          <Knob
            size="md"
            label="Output"
            value={output}
            min={0}
            max={120}
            onChange={setOutput}
            color="#6b7280"
            valueRawDisplayFn={(v: number) => `${Math.round((v / 120) * 12)} dB`}
          />
        </div>

        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 border border-black/10 dark:border-white/10 flex items-center justify-center shadow-[0_4px_10px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            <Link2 size={18} className="text-black/50 dark:text-white/50" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Knob
            size="sm"
            label="Bias"
            value={bias}
            min={0}
            max={100}
            onChange={(v) => setBias(clamp(v))}
            color="#4b5563"
            valueRawDisplayFn={(v: number) => `${Math.round(v)}%`}
          />
          <Knob
            size="sm"
            label="Tone"
            value={tone}
            min={0}
            max={100}
            onChange={(v) => setTone(clamp(v))}
            color="#6b7280"
            valueRawDisplayFn={(v: number) => `${Math.round(v)}%`}
          />
          <Knob
            size="sm"
            label="Mix"
            value={mix}
            min={0}
            max={100}
            onChange={(v) => setMix(clamp(v))}
            color="#0ea5e9"
            valueRawDisplayFn={(v: number) => `${Math.round(v)}%`}
          />
        </div>
      </section>
    </div>
  )
}

