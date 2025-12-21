import { Star, X } from 'lucide-react'
import { Modal } from '../Modal'
import { CTA } from '../CTA'
import { useState } from 'react'
import { rateTonePack } from '../../services/gallery'
import { useAuth } from '../../auth/AuthProvider'
import { useToast } from '../notifications/ToastProvider'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  packId: string
  packName: string
  currentRating?: number
  currentComment?: string
  onRated?: () => void
}

export function RatingModal({
  isOpen,
  onClose,
  packId,
  packName,
  currentRating = 0,
  currentComment = '',
  onRated
}: RatingModalProps) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [rating, setRating] = useState(currentRating)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState(currentComment)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      showToast({
        variant: 'error',
        title: 'Connexion requise',
        message: 'Vous devez être connecté pour noter un pack'
      })
      return
    }

    if (rating === 0) {
      showToast({
        variant: 'error',
        title: 'Note requise',
        message: 'Veuillez sélectionner une note'
      })
      return
    }

    try {
      setIsSubmitting(true)
      await rateTonePack(packId, user.id, rating, comment || undefined)
      
      showToast({
        variant: 'success',
        title: 'Note enregistrée',
        message: 'Votre note a été enregistrée avec succès'
      })

      onRated?.()
      onClose()
    } catch (error) {
      console.error('Erreur lors de la notation:', error)
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Impossible d\'enregistrer la note'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(currentRating)
    setComment(currentComment)
    setHoveredRating(0)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Noter "${packName}"`}>
      <div className="space-y-6">
        {/* Sélection de la note */}
        <div>
          <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-3">
            Votre note
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="p-2 transition-transform hover:scale-110"
                aria-label={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
              >
                <Star
                  size={32}
                  className={`
                    transition-colors
                    ${(hoveredRating >= star || (!hoveredRating && rating >= star))
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300 dark:text-gray-600'
                    }
                  `}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-black/60 dark:text-white/60">
                {rating}/5
              </span>
            )}
          </div>
        </div>

        {/* Commentaire */}
        <div>
          <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
            Votre avis (optionnel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Partagez votre expérience avec ce pack..."
            rows={4}
            className="
              w-full px-4 py-2 rounded-lg
              bg-white dark:bg-gray-700
              border border-black/10 dark:border-white/10
              text-black/90 dark:text-white/90
              placeholder:text-black/40 dark:placeholder:text-white/40
              focus:outline-none focus:ring-2 focus:ring-orange-500/50
              resize-none
            "
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <CTA
            onClick={handleClose}
            variant="secondary"
            disabled={isSubmitting}
          >
            Annuler
          </CTA>
          <CTA
            onClick={handleSubmit}
            variant="primary"
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </CTA>
        </div>
      </div>
    </Modal>
  )
}

