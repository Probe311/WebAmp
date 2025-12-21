import { useState, useEffect, useCallback } from 'react'
import { DLCPackCard } from '../components/gallery'
import { GalleryFilters, GalleryFilter } from '../components/gallery/GalleryFilters'
import { useToast } from '../components/notifications/ToastProvider'
import { fetchDLCPacksFromSupabase, hasUserPurchasedPack } from '../services/dlcPacks'
import { DLCPack } from '../services/dlcPackGenerator'
import { Loader } from '../components/Loader'
import { useAuth } from '../auth/AuthProvider'

interface GalleryPageProps {
  onNavigateToWebAmp?: () => void
}

export function GalleryPage({ onNavigateToWebAmp }: GalleryPageProps) {
  const { showToast } = useToast()
  const { user } = useAuth()
  const [dlcPacks, setDlcPacks] = useState<DLCPack[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<GalleryFilter>({ category: 'all', premium: 'all' })
  const [unlockedPacks, setUnlockedPacks] = useState<Set<string>>(new Set())

  // Charger les packs depuis Supabase au montage et quand les filtres changent
  useEffect(() => {
    const loadPacks = async () => {
      try {
        setLoading(true)
        const packs = await fetchDLCPacksFromSupabase({
          category: filter.category,
          premium: filter.premium,
          searchQuery
        })
        setDlcPacks(packs)
      } catch (error) {
        setDlcPacks([])
        showToast({
          variant: 'error',
          title: 'Erreur',
          message: 'Impossible de charger les packs.'
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadPacks()
  }, [filter, searchQuery, showToast])

  // Charger les packs débloqués par l'utilisateur
  useEffect(() => {
    const loadUnlockedPacks = async () => {
      if (!user) {
        setUnlockedPacks(new Set())
        return
      }

      try {
        const newUnlockedPacks = new Set<string>()
        for (const pack of dlcPacks) {
          if (pack.isPremium && pack.price > 0) {
            const isUnlocked = await hasUserPurchasedPack(pack.id, user.id)
            if (isUnlocked) {
              newUnlockedPacks.add(pack.id)
            }
          }
        }
        setUnlockedPacks(newUnlockedPacks)
      } catch (error) {
        // Erreur silencieuse
      }
    }

    if (dlcPacks.length > 0) {
      loadUnlockedPacks()
    }
  }, [user, dlcPacks])

  const handleFilterChange = useCallback((newFilter: GalleryFilter) => {
    setFilter(newFilter)
  }, [])

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query)
  }, [])

  const handleResetFilters = useCallback(() => {
    setFilter({ category: 'all', premium: 'all' })
    setSearchQuery('')
  }, [])

  const handlePurchase = useCallback(async (packId: string) => {
    if (!user) {
      showToast({
        variant: 'error',
        title: 'Connexion requise',
        message: 'Connectez-vous pour acheter des packs.'
      })
      return
    }

    const pack = dlcPacks.find(p => p.id === packId)
    if (!pack) return

    // TODO: Implémenter le flux d'achat réel (Stripe, PayPal, etc.)
    showToast({
      variant: 'info',
      title: 'Achat de pack',
      message: `L'achat du pack "${pack.name}" sera bientôt disponible.`
    })
  }, [user, dlcPacks, showToast])

  const handleView = useCallback((packId: string) => {
    const pack = dlcPacks.find(p => p.id === packId)
    if (pack) {
      const coursesCount = pack.content.courses?.length || 0
      const pedalsCount = pack.content.pedals?.length || 0
      const ampsCount = pack.content.amplifiers?.length || 0
      const presetsCount = pack.content.presets?.length || 0
      const priceInfo = pack.isPremium && pack.price > 0
        ? `Prix: ${pack.price} ${pack.currency}`
        : 'Gratuit'

      showToast({
        variant: 'info',
        title: pack.name,
        message: `${coursesCount} cours, ${pedalsCount} pédales, ${ampsCount} amplis, ${presetsCount} presets - ${priceInfo}`
      })
    }
  }, [dlcPacks, showToast])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader text="Chargement de La Galerie..." />
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-2">
            La Galerie
          </h1>
          <p className="text-sm text-black/70 dark:text-white/70">
            Marketplace de Tones - Découvrez et partagez vos presets
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <GalleryFilters
            searchQuery={searchQuery}
            filter={filter}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Packs */}
        {dlcPacks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-black/85 dark:text-white/90">
                Packs
              </h2>
              <div className="flex items-center gap-4 text-sm text-black/60 dark:text-white/60">
                <span>
                  {dlcPacks.length} pack{dlcPacks.length > 1 ? 's' : ''} premium disponible{dlcPacks.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dlcPacks.map(pack => (
                <DLCPackCard
                  key={pack.id}
                  pack={pack}
                  isLocked={pack.isPremium && pack.price > 0 && !unlockedPacks.has(pack.id)}
                  onPurchase={handlePurchase}
                  onView={handleView}
                />
              ))}
            </div>
          </div>
        )}

        {/* Message si aucun pack */}
        {dlcPacks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-black/70 dark:text-white/70 mb-2">
              Aucun pack trouvé
            </p>
            <p className="text-sm text-black/50 dark:text-white/50">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
