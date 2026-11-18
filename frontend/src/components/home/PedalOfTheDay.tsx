import { useEffect, useMemo, useState } from 'react'
import { Block } from '../Block'
import { availablePedals, PedalModel } from '../../data/pedals'
import { imageService, ImageSearchResult } from '../../services/imageService'
import { Sparkles, Waves } from 'lucide-react'

function getPedalOfTheDay(): PedalModel {
  const today = new Date()
  const seed = Number(today.toISOString().slice(0, 10).replace(/-/g, ''))
  const index = seed % availablePedals.length
  return availablePedals[index]
}

interface PedalOfTheDayProps {
  onOpenPedalboard?: (pedalId: string) => void
}

export function PedalOfTheDay({ onOpenPedalboard }: PedalOfTheDayProps) {
  const pedal = useMemo(() => getPedalOfTheDay(), [])
  const [image, setImage] = useState<ImageSearchResult | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      const result = await imageService.getImageForBrand(pedal.brand, 'pedal')
      if (isMounted) {
        setImage(result)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [pedal.brand])

  return (
    <Block className="min-h-[280px] relative overflow-hidden">
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 dark:opacity-15"
          style={{ backgroundImage: `url(${image.url})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-gray-950/70 dark:via-gray-950/60 dark:to-gray-900/40" />

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-orange-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
            Pédale du jour
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase text-[color:var(--neu-text-muted)] mb-1">{pedal.brand}</p>
            <h3 className="text-xl font-bold text-[color:var(--neu-text)] dark:text-white leading-tight">{pedal.model}</h3>
            <p className="text-sm text-[color:var(--neu-text)]/75 dark:text-white/80 mt-2 line-clamp-3">{pedal.description}</p>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[color:var(--neu-text-muted)]">
            <Waves size={14} />
            <span className="px-2 py-1 rounded-[var(--td-radius-control)] bg-black/5 text-[color:var(--neu-text)]/80 dark:bg-white/10 dark:text-white">
              {pedal.type}
            </span>
            <span className="px-2 py-1 rounded-[var(--td-radius-control)] bg-black/5 text-[color:var(--neu-text)]/80 dark:bg-white/10 dark:text-white">
              {pedal.style}
            </span>
          </div>

          <button
            onClick={() => onOpenPedalboard?.(pedal.id)}
            className="mt-2 w-full px-4 py-2 bg-orange-500 text-white font-semibold rounded-[var(--td-radius-well)] text-sm shadow-[2px_2px_4px_rgba(0,0,0,0.15)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.2)] transition-all duration-150"
          >
            Tester cette pédale dans le pedalboard
          </button>
        </div>
      </div>
    </Block>
  )
}

