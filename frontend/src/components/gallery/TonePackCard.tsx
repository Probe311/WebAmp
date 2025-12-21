import { Heart, Download, Star, Zap, Crown, CheckCircle2, User } from 'lucide-react'
import { TonePack } from '../../types/gallery'
import { Block } from '../Block'
import { CTA } from '../CTA'
import { useState } from 'react'
import { RatingModal } from './RatingModal'
import { PurchaseModal } from './PurchaseModal'

interface TonePackCardProps {
  pack: TonePack
  onLoad?: (packId: string) => void
  onLike?: (packId: string, liked: boolean) => void
  onRated?: () => void
  isLiked?: boolean
  isLoading?: boolean
}

export function TonePackCard({
  pack,
  onLoad,
  onLike,
  onRated,
  isLiked = false,
  isLoading = false
}: TonePackCardProps) {
  const [localLiked, setLocalLiked] = useState(isLiked)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newLikedState = !localLiked
    setLocalLiked(newLikedState)
    onLike?.(pack.id, newLikedState)
  }

  const handleLoad = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Si premium et pas d'achat, afficher la modale d'achat
    if (pack.isPremium && !pack.price) {
      setShowPurchaseModal(true)
      return
    }
    
    onLoad?.(pack.id)
  }

  // Générer une preview visuelle de la chaîne d'effets
  const chainPreview = pack.chain.slice(0, 5).map(effect => effect.name).join(' → ')

  return (
    <Block className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <div className="flex flex-col gap-4">
        {/* En-tête avec thumbnail et badges */}
        <div className="flex items-start gap-4">
          {/* Thumbnail ou placeholder */}
          <div className={`
            w-24 h-24 rounded-xl flex items-center justify-center flex-shrink-0
            bg-gradient-to-br from-orange-500/20 to-red-500/20
            dark:from-orange-500/30 dark:to-red-500/30
            group-hover:scale-110 transition-transform duration-300
          `}>
            {pack.thumbnail ? (
              <img 
                src={pack.thumbnail} 
                alt={pack.name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <Zap size={32} className="text-orange-500" />
            )}
          </div>

          {/* Infos principales */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-black/85 dark:text-white/90 mb-1 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors truncate">
                  {pack.name}
                </h3>
                <p className="text-sm text-black/70 dark:text-white/70 line-clamp-2">
                  {pack.description}
                </p>
              </div>

              {/* Bouton Like */}
              <button
                onClick={handleLike}
                className={`
                  p-2 rounded-lg transition-all duration-200 flex-shrink-0
                  ${localLiked
                    ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20'
                    : 'text-black/50 dark:text-white/50 hover:text-red-500 hover:bg-red-500/10'
                  }
                `}
                aria-label={localLiked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart size={20} fill={localLiked ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {pack.isPremium && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  <Crown size={12} />
                  PACK PRO
                </span>
              )}
              {pack.isArtistVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <CheckCircle2 size={12} />
                  Artiste Vérifié
                </span>
              )}
              {pack.genre && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-black/70 dark:text-white/70">
                  {pack.genre}
                </span>
              )}
              {pack.style && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-black/70 dark:text-white/70">
                  {pack.style}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Auteur */}
        <div className="flex items-center gap-2 text-sm text-black/60 dark:text-white/60">
          <User size={14} />
          <span>{pack.author.name}</span>
        </div>

        {/* Preview de la chaîne d'effets */}
        {chainPreview && (
          <div className="p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
            <div className="text-xs text-black/50 dark:text-white/50 mb-1">Chaîne d'effets :</div>
            <div className="text-sm text-black/70 dark:text-white/70 font-mono truncate">
              {chainPreview}
              {pack.chain.length > 5 && ` ... (+${pack.chain.length - 5} autres)`}
            </div>
          </div>
        )}

        {/* Tags */}
        {pack.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {pack.tags.slice(0, 5).map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400"
              >
                #{tag}
              </span>
            ))}
            {pack.tags.length > 5 && (
              <span className="text-xs text-black/50 dark:text-white/50">
                +{pack.tags.length - 5} autres
              </span>
            )}
          </div>
        )}

        {/* Statistiques */}
        <div className="flex items-center gap-4 text-sm text-black/60 dark:text-white/60">
          <div className="flex items-center gap-1">
            <Download size={14} />
            <span>{pack.stats.downloads.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={14} />
            <span>{pack.stats.likes.toLocaleString()}</span>
          </div>
          {pack.stats.rating > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowRatingModal(true)
              }}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              title="Noter ce pack"
            >
              <Star size={14} className="text-yellow-500" fill="currentColor" />
              <span>{pack.stats.rating.toFixed(1)} ({pack.stats.ratingCount})</span>
            </button>
          )}
          {pack.stats.rating === 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowRatingModal(true)
              }}
              className="flex items-center gap-1 text-black/40 dark:text-white/40 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
              title="Soyez le premier à noter"
            >
              <Star size={14} />
              <span className="text-xs">Noter</span>
            </button>
          )}
          {pack.isPremium && pack.price && (
            <div className="ml-auto font-semibold text-orange-500">
              {pack.price} {pack.currency || 'EUR'}
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        <div className="flex items-center gap-2">
          <CTA
            onClick={handleLoad}
            disabled={isLoading}
            className="flex-1"
            variant="primary"
          >
            <Zap size={16} />
            {isLoading ? 'Chargement...' : 'CHARGEMENT INSTANTANÉ'}
          </CTA>
          {pack.isPremium && !pack.price && (
            <CTA
              variant="secondary"
              className="flex items-center gap-1"
            >
              <Crown size={16} />
              Premium
            </CTA>
          )}
        </div>
      </div>

      {/* Modal de notation */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        packId={pack.id}
        packName={pack.name}
        onRated={onRated}
      />

      {/* Modal d'achat */}
      {pack.isPremium && (
        <PurchaseModal
          isOpen={showPurchaseModal}
          onClose={() => setShowPurchaseModal(false)}
          pack={pack}
          onPurchase={(packId) => {
            // TODO: Implémenter l'achat via Stripe/PayPal
            console.log('Achat du pack:', packId)
          }}
          onSubscribe={() => {
            // TODO: Implémenter l'abonnement
            console.log('Abonnement premium')
          }}
        />
      )}
    </Block>
  )
}

