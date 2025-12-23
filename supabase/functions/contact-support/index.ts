// Edge Function: contact-support
// Envoie un email de contact/support de manière sécurisée
// L'adresse email de destination est stockée dans les secrets Supabase

import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'

interface ContactMessageRequest {
  name: string
  email: string
  subject: string
  message: string
}

async function sendEmail(
  to: string,
  from: string,
  subject: string,
  html: string
): Promise<void> {
  // Utiliser Resend API pour envoyer l'email
  // Vous pouvez aussi utiliser SendGrid, Mailgun, ou un autre service
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY n\'est pas configuré')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: from,
      to: [to],
      subject: subject,
      html: html,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur lors de l'envoi de l'email: ${error}`)
  }
}

async function handleContactRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return createCorsJsonResponse({ ok: true })
  }

  if (req.method !== 'POST') {
    return createCorsErrorResponse('Method not allowed', 405)
  }

  try {
    const body = (await req.json()) as ContactMessageRequest

    // Validation des champs
    if (!body.name || !body.email || !body.subject || !body.message) {
      return createCorsErrorResponse('Tous les champs sont requis', 400)
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return createCorsErrorResponse('Adresse email invalide', 400)
    }

    // Récupérer l'adresse email de destination depuis les secrets Supabase
    // Cette adresse n'est jamais exposée au client
    const recipientEmail = Deno.env.get('CONTACT_EMAIL')
    
    if (!recipientEmail) {
      console.error('CONTACT_EMAIL n\'est pas configuré dans les secrets Supabase')
      return createCorsErrorResponse('Configuration serveur manquante', 500)
    }

    // Récupérer l'adresse email de l'expéditeur depuis les variables d'environnement
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@webamp.app'

    // Créer le contenu HTML de l'email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f97316; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #374151; }
            .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 4px; border: 1px solid #d1d5db; }
            .message { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">Nouveau message de contact WebAmp</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">Nom :</div>
                <div class="value">${escapeHtml(body.name)}</div>
              </div>
              <div class="field">
                <div class="label">Email :</div>
                <div class="value">${escapeHtml(body.email)}</div>
              </div>
              <div class="field">
                <div class="label">Sujet :</div>
                <div class="value">${escapeHtml(body.subject)}</div>
              </div>
              <div class="field">
                <div class="label">Message :</div>
                <div class="value message">${escapeHtml(body.message)}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    // Envoyer l'email
    await sendEmail(
      recipientEmail,
      fromEmail,
      `[WebAmp Contact] ${body.subject}`,
      htmlContent
    )

    return createCorsJsonResponse({
      ok: true,
      message: 'Message envoyé avec succès'
    })
  } catch (error) {
    console.error('Erreur dans contact-support:', error)
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    return createCorsErrorResponse(message, 500)
  }
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

Deno.serve((req: Request) => {
  return handleCors(req, handleContactRequest)
})

