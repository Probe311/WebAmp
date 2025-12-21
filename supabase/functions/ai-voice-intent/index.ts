// Edge Function: ai-voice-intent
// Interprétation des commandes vocales (déjà transcrites en texte) en actions structurées pour WebAmp.
// Utilise Gemini API (Google AI)

import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'
import { callGemini } from '../_shared/gemini.ts'

interface VoiceIntentRequest {
  text: string
  language?: string // 'fr' | 'en' | ...
  context?: {
    presetId?: string
    instrument?: 'guitar' | 'bass' | 'other'
  }
}

type WebAmpCommandType =
  | 'setPreset'
  | 'setAmplifier'
  | 'setParameter'
  | 'togglePedal'
  | 'bypassAll'
  | 'setMetronome'
  | 'setLooper'
  | 'noOp'

interface WebAmpCommand {
  type: WebAmpCommandType
  payload?: Record<string, unknown>
  // Pour debug/UX
  naturalLanguageSummary?: string
}

interface VoiceIntentResponse {
  command: WebAmpCommand
}

async function callLLMForIntent(prompt: string): Promise<VoiceIntentResponse> {
  const systemPrompt = `
Tu es l'assistant vocal de WebAmp (simulateur d'amplis/pédales).
On te donne UNE commande utilisateur déjà transcrite en texte.

Tu dois la convertir en une commande JSON de type WebAmpCommand :
{
  "type": "setPreset" | "setAmplifier" | "setParameter" | "togglePedal" | "bypassAll" | "setMetronome" | "setLooper" | "noOp",
  "payload": { ... },
  "naturalLanguageSummary": "résumé court de l'action (en français)"
}

Exemples de mapping :
- "mets un son clean fender" -> { "type": "setPreset", "payload": { "style": "clean", "brand": "Fender" } }
- "baisse un peu le gain de la disto" -> { "type": "setParameter", "payload": { "target": "distortion", "parameter": "gain", "delta": -10 } }
- "coupe toutes les pédales" -> { "type": "bypassAll", "payload": { "bypassed": true } }
- "mets le métronome à 120" -> { "type": "setMetronome", "payload": { "bpm": 120 } }

Contraintes :
- Si la commande est ambiguë ou non pertinente, renvoie "type": "noOp".
- Ne renvoie AUCUN texte hors du JSON.
- Retourne un objet JSON valide avec la structure exacte : { "command": { "type": "...", "payload": {...}, "naturalLanguageSummary": "..." } }
`

  return await callGemini<VoiceIntentResponse>(systemPrompt, prompt, {
    temperature: 0.3, // Plus déterministe pour les commandes
    maxOutputTokens: 512
  })
}

async function handleVoiceIntentRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return createCorsJsonResponse({ ok: true })
  }

  if (req.method !== 'POST') {
    return createCorsErrorResponse('Method not allowed', 405)
  }

  try {
    const body = (await req.json()) as VoiceIntentRequest

    if (!body.text || typeof body.text !== 'string') {
      return createCorsErrorResponse('text is required', 400)
    }

    const lang = body.language || 'fr'
    const contextLines: string[] = []
    contextLines.push(`Langue: ${lang}`)
    if (body.context?.instrument) contextLines.push(`Instrument: ${body.context.instrument}`)
    if (body.context?.presetId) contextLines.push(`Preset actuel: ${body.context.presetId}`)

    const prompt = `
Commande utilisateur:
"${body.text}"

Contexte:
${contextLines.join('\n')}

Interprète cette commande en WebAmpCommand. Retourne UNIQUEMENT le JSON.
`

    const intent = await callLLMForIntent(prompt)

    return createCorsJsonResponse(
      {
        ok: true,
        intent,
      },
      200,
    )
  } catch (error) {
    console.error('ai-voice-intent error:', error)
    return createCorsErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500,
    )
  }
}

serve((req) => handleCors(req, handleVoiceIntentRequest))


