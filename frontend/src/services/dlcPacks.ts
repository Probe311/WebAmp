/**
 * Service pour charger les packs depuis Supabase
 */
import { getSupabaseClient } from '../lib/supabaseClient'
import { DLCPack } from './dlcPackGenerator'
import { createLogger } from './logger'

const logger = createLogger('DLCPacks')

export interface DLCPackFromDB {
  id: string
  name: string
  description: string | null
  type: 'brand' | 'style' | 'course' | 'artist' | 'genre'
  category: string
  thumbnail: string | null
  image_url: string | null
  image_author: string | null
  image_author_url: string | null
  price: number
  currency: string
  is_premium: boolean
  tags: string[]
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

/**
 * Charge les packs depuis Supabase (limité à 15 packs premium)
 */
export async function fetchDLCPacksFromSupabase(
  filters?: {
    category?: 'all' | 'brands' | 'styles' | 'courses'
    premium?: 'all' | 'free' | 'premium'
    searchQuery?: string
  }
): Promise<DLCPack[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  try {
    // Construire la requête avec filtres
    let query = supabase
      .from('dlc_packs')
      .select('*')

    // Filtre par catégorie
    if (filters?.category && filters.category !== 'all') {
      const typeMap: Record<string, string> = {
        'brands': 'brand',
        'styles': 'style',
        'courses': 'course'
      }
      query = query.eq('type', typeMap[filters.category])
    }

    // Filtre premium/free
    // La galerie est une boutique, donc on affiche uniquement les packs premium par défaut
    if (filters?.premium && filters.premium !== 'all') {
      if (filters.premium === 'premium') {
        query = query.eq('is_premium', true).gt('price', 0)
      } else {
        // Option "free" retirée - la boutique ne propose que des packs premium
        query = query.eq('is_premium', true).gt('price', 0)
      }
    } else {
      // Par défaut, afficher uniquement les packs premium (boutique)
      query = query.eq('is_premium', true).gt('price', 0)
    }

    // Recherche textuelle
    if (filters?.searchQuery) {
      query = query.or(`name.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,tags.cs.{${filters.searchQuery}}`)
    }

    // Appliquer les filtres selon les critères
    // Si aucun filtre premium n'est spécifié ou si c'est 'all', on affiche tous les packs
    let filteredQuery = query
    
    // Le filtre premium/free est déjà appliqué plus haut (lignes 58-64)
    // Pas besoin de filtrer à nouveau ici

    const { data: packs, error: packsError } = await filteredQuery
      .order('is_premium', { ascending: false })
      .order('price', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(15)

    if (packsError) {
      throw packsError
    }

    if (!packs || packs.length === 0) {
      return []
    }

    // Récupérer le contenu pour chaque pack
    const packIds = packs.map(p => p.id)
    const { data: content, error: contentError } = await supabase
      .from('dlc_pack_content')
      .select('*')
      .in('pack_id', packIds)

    if (contentError) {
      logger.warn('Erreur lors du chargement du contenu', { error: contentError })
    }

    // Récupérer les presets pour chaque pack
    const { data: presets, error: presetsError } = await supabase
      .from('dlc_pack_presets')
      .select('*')
      .in('pack_id', packIds)

    if (presetsError) {
      logger.warn('Erreur lors du chargement des presets', { error: presetsError })
    }

    // Transformer les données Supabase en format DLCPack
    return packs.map((pack: DLCPackFromDB): DLCPack => {
      const packContent = content?.filter(c => c.pack_id === pack.id) || []
      const packPresets = presets?.filter(p => p.pack_id === pack.id) || []

      return {
        id: pack.id,
        name: pack.name,
        description: pack.description || '',
        type: pack.type,
        category: pack.category,
        thumbnail: pack.thumbnail || undefined,
        image: pack.image_url ? {
          id: pack.id,
          url: pack.image_url,
          thumbnail: pack.thumbnail || pack.image_url,
          author: pack.image_author || '',
          authorUrl: pack.image_author_url || '',
          description: pack.description || undefined,
          width: 0,
          height: 0
        } : undefined,
        content: {
          pedals: packContent
            .filter(c => c.content_type === 'pedal')
            .sort((a, b) => a.position - b.position)
            .map(c => c.content_id),
          amplifiers: packContent
            .filter(c => c.content_type === 'amplifier')
            .sort((a, b) => a.position - b.position)
            .map(c => c.content_id),
          courses: packContent
            .filter(c => c.content_type === 'course')
            .sort((a, b) => a.position - b.position)
            .map(c => c.content_id),
          presets: packPresets.map(p => ({
            id: p.preset_id,
            name: p.preset_name,
            description: p.preset_description || '',
            author: {
              id: 'system',
              name: 'WebAmp'
            },
            chain: p.preset_chain as any,
            tags: p.preset_tags || [],
            isPremium: true,
            isArtistVerified: false,
            stats: {
              downloads: 0,
              likes: 0,
              rating: 0,
              ratingCount: 0
            },
            createdAt: p.created_at,
            updatedAt: p.created_at
          }))
        },
        price: pack.price,
        currency: pack.currency,
        isPremium: pack.is_premium,
        tags: pack.tags || [],
        metadata: pack.metadata || {}
      }
    })
  } catch (error) {
    logger.error('Erreur lors du chargement des packs DLC depuis Supabase', error)
    throw error
  }
}

/**
 * Vérifie si un utilisateur a acheté/téléchargé un pack
 */
export async function hasUserPurchasedPack(packId: string, userId: string): Promise<boolean> {
  if (!userId) return false
  const supabase = getSupabaseClient()
  if (!supabase) {
    return false
  }

  try {
    // Utiliser maybeSingle() au lieu de single() pour éviter l'erreur 406 si aucun résultat
    const { data, error } = await supabase
      .from('dlc_pack_purchases')
      .select('id')
      .eq('pack_id', packId)
      .eq('user_id', userId)
      .maybeSingle()

    // Si erreur et ce n'est pas une erreur "not found", logger l'erreur
    if (error && error.code !== 'PGRST116') {
      logger.warn('Erreur lors de la vérification de l\'achat', { error })
      return false
    }

    return !!data
  } catch (error) {
    // Si la table n'existe pas encore, retourner false silencieusement
    logger.warn('Erreur lors de la vérification de l\'achat (table peut ne pas exister)', { error })
    return false
  }
}

/**
 * Enregistre l'achat/téléchargement d'un pack
 */
export async function recordPackPurchase(
  packId: string,
  userId: string,
  price: number,
  isFree: boolean
): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  try {
    const { error } = await supabase
      .from('dlc_pack_purchases')
      .upsert({
        user_id: userId,
        pack_id: packId,
        price_paid: price,
        is_free: isFree,
        purchased_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,pack_id'
      })

    if (error) {
      throw error
    }
  } catch (error) {
    logger.error('Erreur lors de l\'enregistrement de l\'achat', error)
    throw error
  }
}

