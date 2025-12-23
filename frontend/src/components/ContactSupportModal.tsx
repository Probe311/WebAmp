import { useState, useEffect } from 'react'
import { Modal } from './Modal'
import { CTA } from './CTA'
import { sendContactMessage } from '../services/contact'
import { useToast } from './notifications/ToastProvider'
import { useAuth } from '../auth/AuthProvider'

interface ContactSupportModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ContactSupportModal({ isOpen, onClose }: ContactSupportModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()
  const { user } = useAuth()

  // Pré-remplir l'email uniquement lors de l'ouverture de la modale
  useEffect(() => {
    if (isOpen && user?.email && email === '') {
      setEmail(user.email)
    }
  }, [isOpen, user?.email]) // Ne pas inclure 'email' dans les dépendances pour éviter les réinitialisations

  // Réinitialiser le formulaire quand la modale se ferme
  useEffect(() => {
    if (!isOpen) {
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      showToast({
        variant: 'error',
        title: 'Champs manquants',
        message: 'Veuillez remplir tous les champs du formulaire.'
      })
      return
    }

    // Validation basique de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      showToast({
        variant: 'error',
        title: 'Email invalide',
        message: 'Veuillez entrer une adresse email valide.'
      })
      return
    }

    setIsSubmitting(true)

    try {
      await sendContactMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      })

      showToast({
        variant: 'success',
        title: 'Message envoyé',
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
      })

      // Fermer la modale (le formulaire sera réinitialisé par l'useEffect)
      onClose()
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Erreur',
        message: error instanceof Error ? error.message : 'Impossible d\'envoyer le message. Veuillez réessayer plus tard.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact & Support"
      widthClassName="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-black/85 dark:text-white/90 mb-2">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border-2 border-black/15 dark:border-white/15 text-black/90 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors"
              placeholder="Votre nom"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-black/85 dark:text-white/90 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border-2 border-black/15 dark:border-white/15 text-black/90 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors"
              placeholder="votre@email.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-semibold text-black/85 dark:text-white/90 mb-2">
              Sujet <span className="text-red-500">*</span>
            </label>
            <input
              id="subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border-2 border-black/15 dark:border-white/15 text-black/90 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors"
              placeholder="Sujet de votre message"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-semibold text-black/85 dark:text-white/90 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border-2 border-black/15 dark:border-white/15 text-black/90 dark:text-white/90 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors resize-none"
              placeholder="Décrivez votre question ou problème..."
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10 dark:border-white/10">
          <CTA
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuler
          </CTA>
          <CTA
            type="submit"
            variant="important"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer'}
          </CTA>
        </div>
      </form>
    </Modal>
  )
}

