import { useState, useEffect } from 'react'
import { MusicBrainzArtist, musicBrainzService } from '../../services/musicbrainz'
import { Block } from '../Block'
import { User, Tag, Globe, Calendar } from 'lucide-react'
import { Loader } from '../Loader'

interface ArtistProfileProps {
  artistName: string
}

export function ArtistProfile({ artistName }: ArtistProfileProps) {
  const [artist, setArtist] = useState<MusicBrainzArtist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArtist = async () => {
      setLoading(true)
      setError(null)

      try {
        // Rechercher l'artiste
        const artists = await musicBrainzService.searchArtist(artistName, 1)
        
        if (artists.length === 0) {
          setError(`Artiste "${artistName}" non trouvé`)
          setLoading(false)
          return
        }

        // Récupérer les détails complets
        const artistDetails = await musicBrainzService.getArtistById(artists[0].id)
        setArtist(artistDetails)
      } catch (err) {
        console.error('Error fetching artist:', err)
        setError('Erreur lors de la récupération des informations de l\'artiste')
      } finally {
        setLoading(false)
      }
    }

    if (artistName) {
      fetchArtist()
    }
  }, [artistName])

  if (loading) {
    return (
      <Block className="p-8">
        <Loader size="md" text="Chargement des informations..." showText={true} />
      </Block>
    )
  }

  if (error) {
    return (
      <Block className="p-8">
        <div className="text-center text-red-500">
          {error}
        </div>
      </Block>
    )
  }

  if (!artist) {
    return null
  }

  const tags = artist.tags?.slice(0, 10) || []
  const country = artist.country || artist['life-span']?.begin

  return (
    <Block className="p-6">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-4 rounded-xl bg-orange-500/10 dark:bg-orange-500/20">
          <User size={32} className="text-orange-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black/85 dark:text-white/90 mb-2">
            {artist.name}
          </h2>
          {artist.disambiguation && (
            <p className="text-sm text-black/60 dark:text-white/60 mb-2">
              {artist.disambiguation}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-black/70 dark:text-white/70">
            {country && (
              <div className="flex items-center gap-1">
                <Globe size={14} />
                <span>{country}</span>
              </div>
            )}
            {artist['life-span']?.begin && (
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>
                  {artist['life-span'].begin}
                  {artist['life-span'].end && ` - ${artist['life-span'].end}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-black/70 dark:text-white/70 mb-2 flex items-center gap-2">
            <Tag size={16} />
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-black/70 dark:text-white/70 text-xs"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </Block>
  )
}

