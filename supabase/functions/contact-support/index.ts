// Edge Function: contact-support
// RESEND_API_KEY / CONTACT_EMAIL / RESEND_FROM_EMAIL via secrets Supabase.

import {
  handleCors,
  createCorsJsonResponse,
  createCorsErrorResponse,
} from '../_shared/cors.ts'
import { clientIp, rateLimit, safeClientError } from '../_shared/rateLimit.ts'

interface ContactMessageRequest {
  name: string
  email: string
  subject: string
  message: string
}

const MAX_NAME = 120
const MAX_SUBJECT = 200
const MAX_MESSAGE = 5000

async function sendEmail(
  to: string,
  from: string,
  subject: string,
  html: string
): Promise<void> {
  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY n'est pas configuré")
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Erreur lors de l'envoi de l'email: ${error}`)
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

async function handleContactRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return createCorsJsonResponse({ ok: true }, 200, {}, req.headers.get('Origin'))
  }

  if (req.method !== 'POST') {
    return createCorsErrorResponse('Method not allowed', 405, {}, req.headers.get('Origin'))
  }

  const origin = req.headers.get('Origin')
  const ip = clientIp(req)
  const rl = rateLimit(`contact:${ip}`, { limit: 4, windowMs: 60_000 })
  if (!rl.ok) {
    return createCorsErrorResponse(
      `Trop de requêtes. Réessayez dans ${rl.retryAfterSec}s.`,
      429,
      {},
      origin
    )
  }

  try {
    const body = (await req.json()) as ContactMessageRequest

    if (!body.name || !body.email || !body.subject || !body.message) {
      return createCorsErrorResponse('Tous les champs sont requis', 400, {}, origin)
    }

    if (
      body.name.length > MAX_NAME ||
      body.subject.length > MAX_SUBJECT ||
      body.message.length > MAX_MESSAGE
    ) {
      return createCorsErrorResponse('Champ trop long', 400, {}, origin)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email) || body.email.length > 254) {
      return createCorsErrorResponse('Adresse email invalide', 400, {}, origin)
    }

    const recipientEmail = Deno.env.get('CONTACT_EMAIL')
    if (!recipientEmail) {
      console.error("CONTACT_EMAIL n'est pas configuré dans les secrets Supabase")
      return createCorsErrorResponse('Configuration serveur manquante', 500, {}, origin)
    }

    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@webamp.studio'

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head><meta charset="UTF-8"></head>
        <body>
          <h2>Nouveau message de contact WebAmp</h2>
          <p><strong>Nom :</strong> ${escapeHtml(body.name)}</p>
          <p><strong>Email :</strong> ${escapeHtml(body.email)}</p>
          <p><strong>Sujet :</strong> ${escapeHtml(body.subject)}</p>
          <p><strong>Message :</strong></p>
          <pre>${escapeHtml(body.message)}</pre>
        </body>
      </html>
    `

    await sendEmail(
      recipientEmail,
      fromEmail,
      `[WebAmp Contact] ${body.subject}`,
      htmlContent
    )

    return createCorsJsonResponse(
      { ok: true, message: 'Message envoyé avec succès' },
      200,
      {},
      origin
    )
  } catch (error) {
    console.error('Erreur dans contact-support:', error)
    return createCorsErrorResponse(safeClientError(error, 'Erreur serveur'), 500, {}, origin)
  }
}

Deno.serve((req: Request) => handleCors(req, handleContactRequest))
