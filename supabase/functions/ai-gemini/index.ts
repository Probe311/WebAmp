/**
 * Admin-only Gemini proxy — keeps API key off the browser bundle.
 * JSON: { prompt, systemPrompt?, model?, temperature?, maxOutputTokens? }
 * Image: { mode: 'image', prompt, model? } → { imageBase64 }
 */
import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'
import { guardAuthedPost, safeClientError } from '../_shared/guard.ts'
import { callGemini, callGeminiText } from '../_shared/gemini.ts'

const MAX_PROMPT = 200_000

async function generateImage(prompt: string, model?: string): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY')
  const m = model || Deno.env.get('GEMINI_IMAGE_MODEL') || 'gemini-2.5-flash-image'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 1, maxOutputTokens: 8192 },
    }),
  })
  if (!resp.ok) {
    const text = await resp.text()
    console.error('Gemini image error', resp.status, text)
    throw new Error(`Gemini image error: ${resp.status}`)
  }
  const data = await resp.json()
  const parts = data.candidates?.[0]?.content?.parts || []
  for (const part of parts) {
    if (part.inlineData?.data) {
      return `data:image/png;base64,${part.inlineData.data}`
    }
  }
  throw new Error('Aucune image générée')
}

async function handler(req: Request): Promise<Response> {
  const gate = await guardAuthedPost(req, 'ai-gemini', { admin: true, limit: 10 })
  if (!gate.ok) return gate.response
  const { origin } = gate

  try {
    const body = (await req.json()) as {
      mode?: 'json' | 'text' | 'image'
      prompt?: string
      systemPrompt?: string
      model?: string
      temperature?: number
      maxOutputTokens?: number
    }

    if (!body.prompt || typeof body.prompt !== 'string') {
      return createCorsErrorResponse('prompt is required', 400, {}, origin)
    }
    if (body.prompt.length > MAX_PROMPT) {
      return createCorsErrorResponse('prompt too long', 400, {}, origin)
    }

    if (body.mode === 'image') {
      const imageBase64 = await generateImage(body.prompt, body.model)
      return createCorsJsonResponse({ ok: true, imageBase64 }, 200, {}, origin)
    }

    const systemPrompt =
      typeof body.systemPrompt === 'string' && body.systemPrompt.trim()
        ? body.systemPrompt.slice(0, 20_000)
        : body.mode === 'text'
          ? 'Tu es un assistant utile. Réponds en texte clair.'
          : 'Réponds STRICTEMENT en JSON valide, sans markdown ni backticks.'

    if (body.mode === 'text') {
      const text = await callGeminiText(systemPrompt, body.prompt, {
        model: body.model,
        temperature: body.temperature ?? 0.7,
        maxOutputTokens: body.maxOutputTokens ?? 8192,
      })
      return createCorsJsonResponse({ ok: true, result: text }, 200, {}, origin)
    }

    const result = await callGemini<unknown>(systemPrompt, body.prompt, {
      model: body.model,
      temperature: body.temperature ?? 0.7,
      maxOutputTokens: body.maxOutputTokens ?? 8192,
    })

    return createCorsJsonResponse({ ok: true, result }, 200, {}, origin)
  } catch (e) {
    console.error('ai-gemini error', e)
    return createCorsErrorResponse(safeClientError(e, 'Gemini unavailable'), 500, {}, origin)
  }
}

Deno.serve((req) => handleCors(req, handler))
