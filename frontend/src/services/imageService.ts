/**
 * Service d'images open source
 * Utilise Pexels et Pixabay APIs
 */
import { createLogger } from './logger'

const logger = createLogger('ImageService')

export interface ImageSearchResult {
  id: string
  url: string
  thumbnail: string
  author: string
  authorUrl: string
  description?: string
  width: number
  height: number
}

export interface ImageServiceConfig {
  apiKey?: string
  provider?: 'pexels' | 'pixabay'
}

class ImageService {
  private apiKey: string = ''
  private provider: 'pexels' | 'pixabay' = 'pexels'

  constructor(config: ImageServiceConfig = {}) {
    // Détecter automatiquement le meilleur provider disponible
    const pexelsKey = import.meta.env.VITE_PEXELS_API_KEY
    const pixabayKey = import.meta.env.VITE_PIXABAY_API_KEY

    // Priorité : Pexels > Pixabay
    if (config.provider) {
      this.provider = config.provider
      this.apiKey = config.apiKey || ''
    } else if (pexelsKey) {
      this.provider = 'pexels'
      this.apiKey = pexelsKey
    } else if (pixabayKey) {
      this.provider = 'pixabay'
      this.apiKey = pixabayKey
    } else {
      // Fallback sur Pexels si aucune clé n'est disponible
      this.provider = 'pexels'
      this.apiKey = config.apiKey || ''
    }

    // Si une clé est fournie dans la config, l'utiliser
    if (config.apiKey) {
      this.apiKey = config.apiKey
    }
  }

  /**
   * Recherche d'images via Pexels (gratuit, 200 req/heure)
   */
  private async searchPexels(query: string, limit: number = 10): Promise<ImageSearchResult[]> {
    const apiKey = this.apiKey || import.meta.env.VITE_PEXELS_API_KEY || ''
    if (!apiKey) {
      logger.warn('Pexels API key not found')
      return []
    }

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${limit}`,
        {
          headers: {
            'Authorization': apiKey
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`)
      }

      const data = await response.json()
      
      return (data.photos || []).map((photo: any) => ({
        id: photo.id.toString(),
        url: photo.src.large,
        thumbnail: photo.src.medium,
        author: photo.photographer,
        authorUrl: photo.photographer_url,
        description: photo.alt,
        width: photo.width,
        height: photo.height
      }))
    } catch (error) {
      logger.error('Erreur Pexels', error)
      return []
    }
  }

  /**
   * Recherche d'images via Pixabay (gratuit, 5000 req/jour)
   */
  private async searchPixabay(query: string, limit: number = 10): Promise<ImageSearchResult[]> {
    const apiKey = this.apiKey || import.meta.env.VITE_PIXABAY_API_KEY || ''
    if (!apiKey) {
      logger.warn('Pixabay API key not found')
      return []
    }

    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=${limit}&safesearch=true`
      )

      if (!response.ok) {
        throw new Error(`Pixabay API error: ${response.status}`)
      }

      const data = await response.json()
      
      return (data.hits || []).map((photo: any) => ({
        id: photo.id.toString(),
        url: photo.largeImageURL,
        thumbnail: photo.previewURL,
        author: photo.user,
        authorUrl: `https://pixabay.com/users/${photo.user}-${photo.user_id}/`,
        description: photo.tags,
        width: photo.imageWidth,
        height: photo.imageHeight
      }))
    } catch (error) {
      logger.error('Erreur Pixabay', error)
      return []
    }
  }

  /**
   * Recherche d'images (utilise le provider configuré avec fallback automatique)
   */
  async searchImages(query: string, limit: number = 10): Promise<ImageSearchResult[]> {
    // Essayer le provider configuré en premier
    let results: ImageSearchResult[] = []
    
    try {
      switch (this.provider) {
        case 'pexels':
          results = await this.searchPexels(query, limit)
          break
        case 'pixabay':
        default:
          results = await this.searchPixabay(query, limit)
          break
      }

      // Si on a des résultats, les retourner
      if (results.length > 0) {
        return results
      }
    } catch (error) {
      logger.warn(`Erreur avec ${this.provider}, tentative avec un autre provider...`, { provider: this.provider, error })
    }

    // Fallback : essayer les autres providers si le premier échoue
    const providers: Array<'pexels' | 'pixabay'> = ['pexels', 'pixabay']
    const otherProviders = providers.filter(p => p !== this.provider)

    for (const provider of otherProviders) {
      try {
        switch (provider) {
          case 'pexels':
            if (import.meta.env.VITE_PEXELS_API_KEY) {
              results = await this.searchPexels(query, limit)
            }
            break
          case 'pixabay':
            if (import.meta.env.VITE_PIXABAY_API_KEY) {
              results = await this.searchPixabay(query, limit)
            }
            break
        }

        if (results.length > 0) {
          logger.info(`Fallback réussi avec ${provider}`, { provider })
          return results
        }
      } catch (error) {
        // Continuer avec le prochain provider
        continue
      }
    }

    return results
  }

  /**
   * Récupère une image pour une marque de pédale/ampli
   */
  async getImageForBrand(brand: string, type: 'pedal' | 'amplifier' | 'course' = 'pedal'): Promise<ImageSearchResult | null> {
    const queries = [
      `${brand} ${type} guitar`,
      `${brand} ${type} music equipment`,
      `${brand} ${type}`,
      `${brand} guitar gear`
    ]

    for (const query of queries) {
      const results = await this.searchImages(query, 1)
      if (results.length > 0) {
        return results[0]
      }
    }

    return null
  }

  /**
   * Récupère une image pour un style/genre musical
   */
  async getImageForStyle(style: string): Promise<ImageSearchResult | null> {
    const queries = [
      `${style} guitar music`,
      `${style} rock music`,
      `${style} guitar player`
    ]

    for (const query of queries) {
      const results = await this.searchImages(query, 1)
      if (results.length > 0) {
        return results[0]
      }
    }

    return null
  }

  /**
   * Récupère une image pour un cours/tutoriel
   */
  async getImageForCourse(courseTitle: string, category?: string): Promise<ImageSearchResult | null> {
    const queries = [
      `${courseTitle} guitar lesson`,
      `${category} guitar tutorial`,
      `guitar lesson ${category}`,
      `music education`
    ]

    for (const query of queries) {
      const results = await this.searchImages(query, 1)
      if (results.length > 0) {
        return results[0]
      }
    }

    return null
  }
}

// Instance singleton avec détection automatique du meilleur provider
export const imageService = new ImageService()

export default imageService

