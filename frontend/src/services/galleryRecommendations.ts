/**
 * Service de recommandations pour The Gallery
 * Recommandations basées sur l'historique utilisateur et les préférences
 */
import { fetchTonePacks } from './gallery'
import { TonePack } from '../types/gallery'
import { useAIPreferences } from '../hooks/useAIPreferences'

/**
 * Récupère les recommandations pour un utilisateur
 * Basé sur l'historique d'utilisation (presets, pédales, amplis)
 */
export async function getRecommendedTonePacks(userId: string, limit: number = 10): Promise<TonePack[]> {
  // Récupérer l'historique depuis localStorage
  const historyJson = localStorage.getItem('aiPreferencesHistory')
  if (!historyJson) {
    // Si pas d'historique, retourner les packs populaires
    const response = await fetchTonePacks({
      filter: { category: 'popular' },
      sort: 'popularity',
      limit
    })
    return response.packs
  }

  try {
    const history = JSON.parse(historyJson)
    
    // Extraire les préférences depuis l'historique
    const pedalIds = new Set<string>()
    const genres = new Set<string>()
    const styles = new Set<string>()
    const tags = new Set<string>()

    // Analyser l'historique des presets
    if (history.presets && Array.isArray(history.presets)) {
      history.presets.forEach((preset: any) => {
        if (preset.genre) genres.add(preset.genre)
        if (preset.style) styles.add(preset.style)
        if (preset.tags && Array.isArray(preset.tags)) {
          preset.tags.forEach((tag: string) => tags.add(tag))
        }
      })
    }

    // Analyser l'historique des pédales
    if (history.pedals && Array.isArray(history.pedals)) {
      history.pedals.forEach((pedal: any) => {
        if (pedal.pedalId) pedalIds.add(pedal.pedalId)
      })
    }

    // Construire les filtres de recherche
    const filter: any = {}
    if (genres.size > 0) {
      filter.genre = Array.from(genres)[0] // Prendre le premier genre le plus fréquent
    }
    if (styles.size > 0) {
      filter.style = Array.from(styles)[0]
    }
    if (tags.size > 0) {
      filter.tags = Array.from(tags).slice(0, 3) // Limiter à 3 tags
    }

    // Récupérer les packs correspondants
    const response = await fetchTonePacks({
      filter: Object.keys(filter).length > 0 ? filter : { category: 'popular' },
      sort: 'rating',
      limit
    })

    return response.packs
  } catch (error) {
    console.error('Erreur lors de la récupération des recommandations:', error)
    // Fallback sur les packs populaires
    const response = await fetchTonePacks({
      filter: { category: 'popular' },
      sort: 'popularity',
      limit
    })
    return response.packs
  }
}

/**
 * Récupère les packs similaires à un pack donné
 */
export async function getSimilarTonePacks(pack: TonePack, limit: number = 5): Promise<TonePack[]> {
  const filter: any = {}
  
  if (pack.genre) {
    filter.genre = pack.genre
  }
  if (pack.style) {
    filter.style = pack.style
  }
  if (pack.tags && pack.tags.length > 0) {
    filter.tags = pack.tags.slice(0, 3)
  }

  const response = await fetchTonePacks({
    filter: Object.keys(filter).length > 0 ? filter : undefined,
    sort: 'rating',
    limit: limit + 1 // +1 pour exclure le pack original
  })

  // Exclure le pack original
  return response.packs.filter(p => p.id !== pack.id).slice(0, limit)
}

