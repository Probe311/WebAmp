/**
 * Service pour envoyer des messages de contact/support
 */

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

  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(message.email.trim())) {
    throw new Error('Adresse email invalide')
  }

  const endpoint =
    import.meta.env.VITE_SUPABASE_EDGE_URL_CONTACT ||
    '/functions/v1/contact-support'

  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })

  if (!resp.ok) {
    const text = await resp.text()
    let errorMessage = 'Impossible d\'envoyer le message'
    
    try {
      const data = JSON.parse(text)
      errorMessage = data.error || errorMessage
    } catch {
      // Si le parsing échoue, utiliser le texte brut ou un message par défaut
      if (text) {
        errorMessage = text
      }
    }
    
    throw new Error(errorMessage)
  }

  const data = await resp.json()
  
  if (!data.ok) {
    throw new Error(data.error || 'Erreur lors de l\'envoi du message')
  }
}

