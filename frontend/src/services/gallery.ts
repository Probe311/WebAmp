/**
 * Service Gallery - Marketplace de Tones
 * Gère les appels API vers Supabase pour la marketplace de presets
 * 
 * NOTE: Ce service nécessite les tables Supabase suivantes :
 * - tone_packs : Table principale des Tone Packs
 * - tone_pack_favorites : Table des favoris utilisateurs
 * - tone_pack_ratings : Table des notes/avis utilisateurs
 * - profiles : Table des profils utilisateurs (relation avec tone_packs via author_id)
 * 
 * Voir le ROADMAP.md pour plus de détails sur la structure attendue.
 */
import { getSupabaseClient } from '../lib/supabaseClient'
import { TonePack, GalleryFilters as GalleryFiltersType, GalleryResponse, UserRating, UserFavorite } from '../types/gallery'

/**
 * Récupère les Tone Packs avec filtres et tri
 */
export async function fetchTonePacks(filters?: GalleryFiltersType): Promise<GalleryResponse> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const {
    searchQuery = '',
    filter,
    sort = 'popularity',
    page = 1,
    limit = 20
  } = filters || {}

  let query = supabase
    .from('tone_packs')
    .select('*, author:profiles!tone_packs_author_id_fkey(id, name, avatar)', { count: 'exact' })

  // Recherche textuelle
  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
  }

  // Filtres
  if (filter) {
    if (filter.category) {
      switch (filter.category) {
        case 'popular':
          query = query.order('downloads', { ascending: false })
          break
        case 'new':
          query = query.order('created_at', { ascending: false })
          break
        case 'artist-picks':
          query = query.eq('is_artist_verified', true)
          break
        case 'clean':
          query = query.eq('style', 'clean')
          break
        case 'high-gain':
          query = query.eq('style', 'high-gain')
          break
      }
    }

    if (filter.genre) {
      query = query.eq('genre', filter.genre)
    }

    if (filter.style) {
      query = query.eq('style', filter.style)
    }

    if (filter.tags && filter.tags.length > 0) {
      query = query.contains('tags', filter.tags)
    }

    if (filter.isPremium !== undefined) {
      query = query.eq('is_premium', filter.isPremium)
    }

    if (filter.minRating !== undefined) {
      query = query.gte('rating', filter.minRating)
    }
  }

  // Tri
  switch (sort) {
    case 'popularity':
      query = query.order('downloads', { ascending: false })
      break
    case 'newest':
      query = query.order('created_at', { ascending: false })
      break
    case 'rating':
      query = query.order('rating', { ascending: false })
      break
    case 'downloads':
      query = query.order('downloads', { ascending: false })
      break
    case 'likes':
      query = query.order('likes', { ascending: false })
      break
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    throw error
  }

  // Transformer les données de Supabase en format TonePack
  const packs: TonePack[] = (data || []).map((pack: any) => ({
    id: pack.id,
    name: pack.name,
    description: pack.description || '',
    author: {
      id: pack.author?.id || pack.author_id,
      name: pack.author?.name || 'Unknown',
      avatar: pack.author?.avatar
    },
    thumbnail: pack.thumbnail,
    chain: pack.chain || [],
    tags: pack.tags || [],
    genre: pack.genre,
    style: pack.style,
    isPremium: pack.is_premium || false,
    price: pack.price,
    currency: pack.currency || 'EUR',
    isArtistVerified: pack.is_artist_verified || false,
    stats: {
      downloads: pack.downloads || 0,
      likes: pack.likes || 0,
      rating: pack.rating || 0,
      ratingCount: pack.rating_count || 0
    },
    metadata: pack.metadata || {},
    createdAt: pack.created_at,
    updatedAt: pack.updated_at
  }))

  return {
    packs,
    total: count || 0,
    page,
    limit,
    hasMore: count ? (page * limit) < count : false
  }
}

/**
 * Récupère un Tone Pack par ID
 */
export async function fetchTonePackById(id: string): Promise<TonePack | null> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data, error } = await supabase
    .from('tone_packs')
    .select('*, author:profiles!tone_packs_author_id_fkey(id, name, avatar)')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  if (!data) {
    return null
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    author: {
      id: data.author?.id || data.author_id,
      name: data.author?.name || 'Unknown',
      avatar: data.author?.avatar
    },
    thumbnail: data.thumbnail,
    chain: data.chain || [],
    tags: data.tags || [],
    genre: data.genre,
    style: data.style,
    isPremium: data.is_premium || false,
    price: data.price,
    currency: data.currency || 'EUR',
    isArtistVerified: data.is_artist_verified || false,
    stats: {
      downloads: data.downloads || 0,
      likes: data.likes || 0,
      rating: data.rating || 0,
      ratingCount: data.rating_count || 0
    },
    metadata: data.metadata || {},
    createdAt: data.created_at,
    updatedAt: data.updated_at
  }
}

/**
 * Applique un Tone Pack au pedalboard (Cloud Sync)
 * Retourne le pack pour qu'il puisse être chargé sur le pedalboard
 */
export async function applyTonePackToPedalboard(packId: string): Promise<TonePack> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  // Récupérer le pack
  const pack = await fetchTonePackById(packId)
  if (!pack) {
    throw new Error('Tone Pack introuvable')
  }

  // Vérifier si premium et si l'utilisateur a accès
  if (pack.isPremium) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('Connexion requise pour les packs premium')
    }

    // TODO: Vérifier l'abonnement ou l'achat du pack
    // Pour l'instant, on laisse passer
  }

  // Incrémenter le compteur de téléchargements
  await supabase
    .from('tone_packs')
    .update({ downloads: (pack.stats.downloads || 0) + 1 })
    .eq('id', packId)

  // Stocker le pack dans localStorage pour qu'il soit chargé lors de la navigation
  localStorage.setItem('pendingTonePack', JSON.stringify(pack))

  return pack
}

/**
 * Like/Unlike un Tone Pack
 */
export async function toggleTonePackLike(packId: string, userId: string): Promise<boolean> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  // Vérifier si déjà liké
  const { data: existing } = await supabase
    .from('tone_pack_favorites')
    .select('id')
    .eq('pack_id', packId)
    .eq('user_id', userId)
    .single()

  if (existing) {
    // Unlike
    await supabase
      .from('tone_pack_favorites')
      .delete()
      .eq('pack_id', packId)
      .eq('user_id', userId)

    // Décrémenter le compteur
    const pack = await fetchTonePackById(packId)
    if (pack) {
      await supabase
        .from('tone_packs')
        .update({ likes: Math.max(0, (pack.stats.likes || 0) - 1) })
        .eq('id', packId)
    }

    return false
  } else {
    // Like
    await supabase
      .from('tone_pack_favorites')
      .insert({ pack_id: packId, user_id: userId })

    // Incrémenter le compteur
    const pack = await fetchTonePackById(packId)
    if (pack) {
      await supabase
        .from('tone_packs')
        .update({ likes: (pack.stats.likes || 0) + 1 })
        .eq('id', packId)
    }

    return true
  }
}

/**
 * Noter un Tone Pack
 */
export async function rateTonePack(
  packId: string,
  userId: string,
  rating: number,
  comment?: string
): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  if (rating < 1 || rating > 5) {
    throw new Error('La note doit être entre 1 et 5')
  }

  // Upsert la note
  const { error } = await supabase
    .from('tone_pack_ratings')
    .upsert({
      pack_id: packId,
      user_id: userId,
      rating,
      comment
    }, {
      onConflict: 'pack_id,user_id'
    })

  if (error) {
    throw error
  }

  // Recalculer la note moyenne
  const { data: ratings } = await supabase
    .from('tone_pack_ratings')
    .select('rating')
    .eq('pack_id', packId)

  if (ratings && ratings.length > 0) {
    const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    await supabase
      .from('tone_packs')
      .update({
        rating: avgRating,
        rating_count: ratings.length
      })
      .eq('id', packId)
  }
}

/**
 * Récupère les favoris d'un utilisateur
 */
export async function fetchUserFavorites(userId: string): Promise<TonePack[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data, error } = await supabase
    .from('tone_pack_favorites')
    .select('pack_id, tone_packs(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  // Transformer les données
  const packs: TonePack[] = (data || [])
    .map((item: any) => {
      const pack = item.tone_packs
      if (!pack) return null

      return {
        id: pack.id,
        name: pack.name,
        description: pack.description || '',
        author: {
          id: pack.author_id,
          name: 'Unknown'
        },
        thumbnail: pack.thumbnail,
        chain: pack.chain || [],
        tags: pack.tags || [],
        genre: pack.genre,
        style: pack.style,
        isPremium: pack.is_premium || false,
        price: pack.price,
        currency: pack.currency || 'EUR',
        isArtistVerified: pack.is_artist_verified || false,
        stats: {
          downloads: pack.downloads || 0,
          likes: pack.likes || 0,
          rating: pack.rating || 0,
          ratingCount: pack.rating_count || 0
        },
        metadata: pack.metadata || {},
        createdAt: pack.created_at,
        updatedAt: pack.updated_at
      }
    })
    .filter(Boolean) as TonePack[]

  return packs
}

