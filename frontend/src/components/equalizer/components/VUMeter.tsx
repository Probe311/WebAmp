import { useState, useEffect, useMemo } from 'react'
import { Meter } from './Meter'

interface VUMeterProps {
  peakOutput?: number // Valeur en dB
}

export function VUMeter({ peakOutput }: VUMeterProps) {
  // Convertir peakOutput en valeur pour les meters (0-100)
  const dbToPercent = (db: number) => {
    const scaled = ((db + 60) / 60) * 100
    return Math.min(100, Math.max(0, isFinite(scaled) ? scaled : 0))
  }

  const [leftMeter, setLeftMeter] = useState(0)
  const [rightMeter, setRightMeter] = useState(0)

  useEffect(() => {
    if (peakOutput !== undefined) {
      const outputLevel = dbToPercent(peakOutput)
      // Simuler une légère différence stéréo
      setLeftMeter(outputLevel * 0.95)
      setRightMeter(outputLevel)
    } else {
      setLeftMeter(0)
      setRightMeter(0)
    }
  }, [peakOutput])

  const leftCluster = useMemo(() => [
    leftMeter,
    leftMeter * 0.82,
    leftMeter * 0.65,
  ].map(v => Math.max(0, Math.min(100, v))), [leftMeter])

  const rightCluster = useMemo(() => [
    rightMeter,
    rightMeter * 0.88,
    rightMeter * 0.7,
  ].map(v => Math.max(0, Math.min(100, v))), [rightMeter])

  return (
    <div className="flex items-end justify-center gap-8 h-48 mb-2">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end gap-2 h-40">
          {leftCluster.map((v, i) => (
            <Meter key={`L-${i}`} value={v} />
          ))}
        </div>
        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">L</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-end gap-2 h-40">
          {rightCluster.map((v, i) => (
            <Meter key={`R-${i}`} value={v} />
          ))}
        </div>
        <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">R</span>
      </div>
    </div>
  )
}

