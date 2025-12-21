import { Crown, Package, Music, Zap, ShoppingCart, Download, Lock } from 'lucide-react'
import { DLCPack } from '../../services/dlcPackGenerator'
import { Block } from '../Block'
import { CTA } from '../CTA'

interface DLCPackCardProps {
  pack: DLCPack
  isLocked?: boolean
  onPurchase?: (packId: string) => void
  onView?: (packId: string) => void
}

export function DLCPackCard({
  pack,
  isLocked = false,
  onPurchase,
  onView
}: DLCPackCardProps) {
  const itemCount = (pack.content.pedals?.length || 0) + 
                   (pack.content.amplifiers?.length || 0) + 
                   (pack.content.courses?.length || 0) +
                   (pack.content.presets?.length || 0)

  const getTypeIcon = () => {
    switch (pack.type) {
      case 'brand':
        return <Package size={20} />
      case 'style':
        return <Music size={20} />
      case 'course':
        return <Zap size={20} />
      default:
        return <Crown size={20} />
    }
  }

  const getTypeLabel = () => {
    switch (pack.type) {
      case 'brand':
        return 'Marque'
      case 'style':
        return 'Style'
      case 'course':
        return 'Cours'
      case 'artist':
        return 'Artiste'
      case 'genre':
        return 'Genre'
      default:
        return 'Pack'
    }
  }

  return (
    <Block className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <div className="flex flex-col gap-4">
        {/* Thumbnail avec image */}
        <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20">
          {pack.image ? (
            <img 
              src={pack.image.url} 
              alt={pack.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : pack.thumbnail ? (
            <img 
              src={pack.thumbnail} 
              alt={pack.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Crown size={48} className="text-orange-500" />
            </div>
          )}
          
          {/* Badge Pack */}
          <div className="absolute top-3 right-3">
            {pack.isPremium && pack.price > 0 ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-lg">
                <Crown size={12} />
                PREMIUM
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-lg">
                <Package size={12} />
                GRATUIT
              </span>
            )}
          </div>

          {/* Overlay de lock si premium non acheté */}
          {isLocked && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <div className="text-center">
                <Lock size={48} className="text-white mx-auto mb-2" />
                <p className="text-white font-bold text-sm">Pack Premium</p>
                <p className="text-white/80 text-xs">Achetez pour débloquer</p>
              </div>
            </div>
          )}

          {/* Badge type */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
              {getTypeIcon()}
              {getTypeLabel()}
            </span>
          </div>
        </div>

        {/* Infos principales */}
        <div>
          <h3 className="text-lg font-bold text-black/85 dark:text-white/90 mb-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
            {pack.name}
          </h3>
          <p className="text-sm text-black/70 dark:text-white/70 line-clamp-2 mb-3">
            {pack.description}
          </p>

          {/* Contenu du pack */}
          <div className="flex flex-wrap gap-2 mb-3">
            {pack.content.pedals && pack.content.pedals.length > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                {pack.content.pedals.length} pédale{pack.content.pedals.length > 1 ? 's' : ''}
              </span>
            )}
            {pack.content.amplifiers && pack.content.amplifiers.length > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-600 dark:text-purple-400">
                {pack.content.amplifiers.length} ampli{pack.content.amplifiers.length > 1 ? 's' : ''}
              </span>
            )}
            {pack.content.courses && pack.content.courses.length > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                {pack.content.courses.length} cours
              </span>
            )}
            {pack.content.presets && pack.content.presets.length > 0 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400">
                {pack.content.presets.length} preset{pack.content.presets.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Tags */}
          {pack.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {pack.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 dark:bg-gray-700 text-black/70 dark:text-white/70"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Prix et actions */}
        <div className="flex items-center justify-between pt-3 border-t border-black/10 dark:border-white/10">
          <div className="flex flex-col">
            {pack.isPremium && pack.price > 0 ? (
              <div className="text-2xl font-bold text-orange-500">
                {pack.price} {pack.currency}
              </div>
            ) : (
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                Gratuit
              </div>
            )}
            <div className="text-xs text-black/50 dark:text-white/50">
              {itemCount} élément{itemCount > 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLocked ? (
              <CTA
                onClick={() => onPurchase?.(pack.id)}
                variant="primary"
                className="text-xs w-full justify-center bg-amber-500 hover:bg-amber-600"
              >
                <Lock size={14} />
                Débloquer ({pack.price} {pack.currency})
              </CTA>
            ) : (
              <>
                {onView && !isLocked && (
                  <CTA
                    onClick={() => onView(pack.id)}
                    variant="secondary"
                    className="text-xs"
                  >
                    Voir
                  </CTA>
                )}
                {isLocked ? (
                  <CTA
                    onClick={() => onPurchase?.(pack.id)}
                    variant="primary"
                    className="text-xs flex-1 justify-center bg-amber-500 hover:bg-amber-600"
                  >
                    <ShoppingCart size={14} />
                    Acheter {pack.price} {pack.currency}
                  </CTA>
                ) : (
                  <CTA
                    onClick={() => onView?.(pack.id)}
                    variant="primary"
                    className="text-xs flex-1 justify-center bg-green-500 hover:bg-green-600"
                  >
                    <Download size={14} />
                    {isLocked ? 'Débloquer' : 'Télécharger'}
                  </CTA>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Block>
  )
}

