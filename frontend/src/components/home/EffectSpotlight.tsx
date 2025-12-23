import { useMemo } from 'react'
import { Block } from '../Block'
import { effectInfos } from '../../data/effectsInfo'
import { Sparkles } from 'lucide-react'

export function EffectSpotlight() {
  const effect = useMemo(() => {
    const shuffled = [...effectInfos].sort(() => Math.random() - 0.5)
    return shuffled[0]
  }, [])

  return (
    <Block className="min-h-[280px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-gray-900/85 dark:via-gray-900/70 dark:to-gray-800/60" />

      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-orange-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
            Effet à (re)découvrir
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase text-black/60 dark:text-white/60 mb-1">{effect.type}</p>
            <h3 className="text-xl font-bold text-black/85 dark:text-white leading-tight">{effect.name}</h3>
            <p className="text-sm text-black/75 dark:text-white/80 mt-2">{effect.tagline}</p>
          </div>

          <p className="text-sm text-black/70 dark:text-white/70 line-clamp-4">{effect.description}</p>

          {effect.notableUse && (
            <div className="text-xs text-black/65 dark:text-white/65 bg-black/5 dark:bg-white/5 rounded-md px-3 py-2 border border-black/5 dark:border-white/5">
              <span className="font-semibold text-black/80 dark:text-white/80 mr-2">On l’entend chez</span>
              {effect.notableUse}
            </div>
          )}
        </div>
      </div>
    </Block>
  )
}

