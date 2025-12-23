import { useEffect, useMemo, useState } from 'react'
import { Block } from '../Block'
import { Music2, Sparkles } from 'lucide-react'
import { musicianProfiles, MusicianProfile } from '../../data/musicians'
import { imageService, ImageSearchResult } from '../../services/imageService'

function pickRandomMusician(): MusicianProfile {
  const shuffled = [...musicianProfiles].sort(() => Math.random() - 0.5)
  return shuffled[0]
}

export function MusicianSpotlight() {
  const musician = useMemo(() => pickRandomMusician(), [])
  const [backgroundImage, setBackgroundImage] = useState<ImageSearchResult | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadImage = async () => {
      const queries = [
        musician.imageQuery,
        `${musician.name} ${musician.instrument} live`,
        `${musician.name} portrait`,
        `${musician.instrument} player ${musician.genres[0]}`
      ].filter(Boolean) as string[]

      for (const query of queries) {
        const results = await imageService.searchImages(query, 1)
        if (!isMounted) return
        if (results.length > 0) {
          setBackgroundImage(results[0])
          return
        }
      }

      setBackgroundImage(null)
    }

    loadImage()
    return () => {
      isMounted = false
    }
  }, [musician])

  return (
    <Block className="md:col-span-2 lg:col-span-2 min-h-[280px] relative overflow-hidden">
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 dark:opacity-15 transition-opacity duration-500"
          style={{ backgroundImage: `url(${backgroundImage.url})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/70 to-white/60 dark:from-gray-900/70 dark:via-gray-900/55 dark:to-gray-800/45" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4">
          <Music2 size={18} className="text-orange-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
            Focus musicien
          </span>
        </div>

        <div className="flex-1 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-black/85 dark:text-white drop-shadow">
                {musician.name}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/5 text-black/80 dark:bg-white/15 dark:text-white">
                {musician.instrument}
              </span>
            </div>
            <p className="text-sm text-black/75 dark:text-white/80 mb-3">{musician.bio}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {musician.genres.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-black/5 text-black/70 dark:bg-white/10 dark:text-white/80"
                >
                  {genre}
                </span>
              ))}
            </div>
            {musician.highlight && (
              <div className="flex items-center gap-2 text-xs text-black/65 dark:text-white/75">
                <Sparkles size={14} />
                <span>{musician.highlight}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Block>
  )
}

