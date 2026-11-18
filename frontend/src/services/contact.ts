/**
 * Service pour envoyer des messages de contact/support
 */
import { invokeEdge } from './invokeEdge'

export interface ContactMessage {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactMessage(message: ContactMessage): Promise<void> {
  if (!message.name.trim() || !message.email.trim() || !message.subject.trim() || !message.message.trim()) {
    throw new Error('Tous les champs sont requis')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(message.email.trim())) {
    throw new Error('Adresse email invalide')
  }

  const data = await invokeEdge<{ ok?: boolean; error?: string }>(
    'contact-support',
    message,
    { requireAuth: false }
  )

  if (!data.ok) {
    throw new Error(data.error || 'Erreur lors de l\'envoi du message')
  }
}
