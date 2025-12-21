/**
 * Types pour The Gallery - Marketplace de Tones
 */

export interface TonePack {
  id: string
  name: string
  description: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  thumbnail?: string
  chain: TonePackEffect[]
  tags: string[]
  genre?: string
  style?: string
  isPremium: boolean
  price?: number
  currency?: string
  isArtistVerified: boolean
  stats: {
    downloads: number
    likes: number
    rating: number
    ratingCount: number
  }
  metadata?: {
    artist?: string
    album?: string
    songTitle?: string
    mood?: string
    instrument?: string
  }
  createdAt: string
  updatedAt: string
}

export interface TonePackEffect {
  type: 'amp' | 'cab' | 'pedal' | 'utility'
  id: string
  name: string
  enabled: boolean
  parameters: Record<string, number | string | boolean>
  position: number
}

export type GalleryFilter = {
  category?: 'popular' | 'new' | 'artist-picks' | 'clean' | 'high-gain' | 'all'
  genre?: string
  style?: string
  tags?: string[]
  isPremium?: boolean
  isFree?: boolean
  minRating?: number
}

export type GallerySort = 'popularity' | 'newest' | 'rating' | 'downloads' | 'likes'

export interface GalleryFilters {
  searchQuery?: string
  filter?: GalleryFilter
  sort?: GallerySort
  page?: number
  limit?: number
}

export interface GalleryResponse {
  packs: TonePack[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface UserRating {
  packId: string
  userId: string
  rating: number
  comment?: string
  createdAt: string
}

export interface UserFavorite {
  packId: string
  userId: string
  createdAt: string
}

