// Edge Function: ai-voice-intent
// Interprétation des commandes vocales (déjà transcrites en texte) en actions structurées pour WebAmp.

import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'

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
  const apiKey = Deno.env.get('OPENROUTER_API_KEY') || Deno.env.get('OPENAI_API_KEY')
  const baseUrl = Deno.env.get('OPENROUTER_BASE_URL') || 'https://openrouter.ai/api/v1'
  const model = Deno.env.get('WEBAMP_VOICE_MODEL') || 'gpt-4.1'

  if (!apiKey) {
    throw new Error('Missing OPENROUTER_API_KEY / OPENAI_API_KEY')
  }

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
`

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  }

  const resp = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!resp.ok) {
    const text = await resp.text()
    console.error('LLM API error (ai-voice-intent)', resp.status, text)
    throw new Error(`LLM API error: ${resp.status}`)
  }

  const data = await resp.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('Empty LLM response')
  }

  try {
    const parsed = JSON.parse(content) as VoiceIntentResponse
    return parsed
  } catch (err) {
    console.error('Failed to parse LLM JSON content (ai-voice-intent)', content, err)
    throw new Error('Invalid JSON from LLM')
  }
}

async function handler(req: Request): Promise<Response> {
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

serve((req) => handleCors(req, handler))


