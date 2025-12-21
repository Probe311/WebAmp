import { Crown, CreditCard, X } from 'lucide-react'
import { Modal } from '../Modal'
import { CTA } from '../CTA'
import { TonePack } from '../../types/gallery'

interface PurchaseModalProps {
  isOpen: boolean
  onClose: () => void
  pack: TonePack
  onPurchase?: (packId: string) => void
  onSubscribe?: () => void
}

export function PurchaseModal({
  isOpen,
  onClose,
  pack,
  onPurchase,
  onSubscribe
}: PurchaseModalProps) {
  const handlePurchase = () => {
    onPurchase?.(pack.id)
    onClose()
  }

  const handleSubscribe = () => {
    onSubscribe?.()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Acheter "${pack.name}"`}>
      <div className="space-y-6">
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-3">
            <Crown className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Pack Premium
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-200">
                Ce pack nécessite un achat ou un abonnement premium pour être utilisé.
              </p>
            </div>
          </div>
        </div>

        {pack.price && (
          <div className="text-center py-4">
            <div className="text-3xl font-bold text-black/85 dark:text-white/90 mb-2">
              {pack.price} {pack.currency || 'EUR'}
            </div>
            <p className="text-sm text-black/60 dark:text-white/60">
              Achat unique - Accès permanent
            </p>
          </div>
        )}

        <div className="space-y-3">
          <CTA
            onClick={handlePurchase}
            variant="primary"
            className="w-full"
            disabled={!pack.price}
          >
            <CreditCard size={16} />
            {pack.price ? `Acheter pour ${pack.price} ${pack.currency || 'EUR'}` : 'Achat non disponible'}
          </CTA>

          <CTA
            onClick={handleSubscribe}
            variant="secondary"
            className="w-full"
          >
            <Crown size={16} />
            S'abonner pour accès illimité
          </CTA>
        </div>

        <div className="text-xs text-black/50 dark:text-white/50 text-center">
          En achetant, vous acceptez nos conditions d'utilisation.
          Les paiements sont sécurisés via Stripe/PayPal.
        </div>
      </div>
    </Modal>
  )
}

