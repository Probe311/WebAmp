/**
 * Helper partagé pour appeler l'API Gemini (Google AI)
 * Utilise l'API REST de Gemini avec support JSON mode
 */

export interface GeminiMessage {
  role: 'user' | 'model' | 'system'
  parts: Array<{ text: string }>
}

export interface GeminiRequest {
  contents: GeminiMessage[]
  generationConfig?: {
    temperature?: number
    topK?: number
    topP?: number
    maxOutputTokens?: number
    responseMimeType?: string
  }
  systemInstruction?: {
    parts: Array<{ text: string }>
  }
}

export interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{ text: string }>
    }
    finishReason?: string
  }>
  error?: {
    code: number
    message: string
    status: string
  }
}

/**
 * Appelle l'API Gemini avec un prompt et retourne la réponse JSON parsée
 */
export async function callGemini<T = any>(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    model?: string
    temperature?: number
    maxOutputTokens?: number
  }
): Promise<T> {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  const model = options?.model || Deno.env.get('GEMINI_MODEL') || 'gemini-1.5-flash'

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY environment variable')
  }

  // Gemini utilise un format différent d'OpenAI
  // On utilise systemInstruction pour le prompt système
  const request: GeminiRequest = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxOutputTokens ?? 8192,
      responseMimeType: 'application/json'
    }
  }

  // Utiliser le header x-goog-api-key au lieu de la query string pour éviter que la clé soit loggée
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify(request)
  })

  if (!resp.ok) {
    const text = await resp.text()
    console.error('Gemini API error', resp.status, text)
    throw new Error(`Gemini API error: ${resp.status} - ${text}`)
  }

  const data: GeminiResponse = await resp.json()

  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.message}`)
  }

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) {
    throw new Error('Empty Gemini response')
  }

  try {
    // Gemini retourne déjà du JSON grâce à responseMimeType
    const parsed = JSON.parse(content) as T
    return parsed
  } catch (err) {
    console.error('Failed to parse Gemini JSON content', content, err)
    throw new Error('Invalid JSON from Gemini')
  }
}

/**
 * Appelle Gemini avec un prompt simple (sans JSON strict)
 */
export async function callGeminiText(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    model?: string
    temperature?: number
    maxOutputTokens?: number
  }
): Promise<string> {
  const apiKey = Deno.env.get('GEMINI_API_KEY')
  const model = options?.model || Deno.env.get('GEMINI_MODEL') || 'gemini-1.5-flash'

  if (!apiKey) {
    throw new Error('Missing GEMINI_API_KEY environment variable')
  }

  const request: GeminiRequest = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      maxOutputTokens: options?.maxOutputTokens ?? 8192
      // Pas de responseMimeType pour du texte libre
    }
  }

  // Utiliser le header x-goog-api-key au lieu de la query string pour éviter que la clé soit loggée
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey
    },
    body: JSON.stringify(request)
  })

  if (!resp.ok) {
    const text = await resp.text()
    console.error('Gemini API error', resp.status, text)
    throw new Error(`Gemini API error: ${resp.status} - ${text}`)
  }

  const data: GeminiResponse = await resp.json()

  if (data.error) {
    throw new Error(`Gemini API error: ${data.error.message}`)
  }

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) {
    throw new Error('Empty Gemini response')
  }

  return content
}

