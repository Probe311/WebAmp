// Edge Function: ai-analyze
// Analyse intelligente à partir de métadonnées (genre, artiste, contexte)
// et suggestions d'effets/presets adaptés via LLM.

import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'

interface AnalyzeRequest {
  genre?: string
  artist?: string
  songTitle?: string
  mood?: string
  instrument?: 'guitar' | 'bass' | 'other'
}

interface SuggestedEffect {
  id: string
  type: 'amp' | 'cab' | 'pedal' | 'utility'
  name: string
  description?: string
  parameters?: Record<string, number | string | boolean>
  position?: number
}

interface AnalysisResult {
  inferredGenre?: string
  inferredMood?: string
  notes?: string
  suggestedEffects: SuggestedEffect[]
}

async function callLLMForAnalysis(prompt: string): Promise<AnalysisResult> {
  const apiKey = Deno.env.get('OPENROUTER_API_KEY') || Deno.env.get('OPENAI_API_KEY')
  const baseUrl = Deno.env.get('OPENROUTER_BASE_URL') || 'https://openrouter.ai/api/v1'
  const model = Deno.env.get('WEBAMP_ANALYSIS_MODEL') || 'gpt-4.1'

  if (!apiKey) {
    throw new Error('Missing OPENROUTER_API_KEY / OPENAI_API_KEY')
  }

  const systemPrompt = `
Tu es un assistant WebAmp qui recommande des chaînes d'effets pour guitare/basse.
Tu dois analyser le contexte (genre, artiste, morceau, humeur) et proposer
une liste d'effets (ampli, pédales, utilitaires) adaptée.

Répond STRICTEMENT avec un JSON valide de type AnalysisResult :
{
  "inferredGenre": "string",
  "inferredMood": "string",
  "notes": "quelques phrases de contexte (français)",
  "suggestedEffects": [
    {
      "id": "slug interne (ex: 'ts9-overdrive', 'modern-metal-amp')",
      "type": "amp" | "cab" | "pedal" | "utility",
      "name": "Nom lisible",
      "description": "Description courte",
      "parameters": {
        "gain": 0-100,
        "bass": 0-100,
        "mid": 0-100,
        "treble": 0-100,
        "...": "autres paramètres numériques pertinents"
      },
      "position": 0
    }
  ]
}

Contraintes :
- Mets entre 3 et 8 effets maximum dans "suggestedEffects".
- Utilise des ids cohérents avec l'univers guitare (amps/pédales classiques).
- Ne renvoie AUCUN autre texte que le JSON.
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
    console.error('LLM API error (ai-analyze)', resp.status, text)
    throw new Error(`LLM API error: ${resp.status}`)
  }

  const data = await resp.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('Empty LLM response')
  }

  try {
    const parsed = JSON.parse(content) as AnalysisResult
    return parsed
  } catch (err) {
    console.error('Failed to parse LLM JSON content (ai-analyze)', content, err)
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
    const body = (await req.json()) as AnalyzeRequest

    if (!body.genre && !body.artist && !body.songTitle && !body.mood) {
      return createCorsErrorResponse(
        'Au moins un champ parmi genre, artist, songTitle ou mood est requis',
        400,
      )
    }

    const parts: string[] = []
    if (body.genre) parts.push(`Genre: ${body.genre}`)
    if (body.artist) parts.push(`Artiste: ${body.artist}`)
    if (body.songTitle) parts.push(`Morceau: ${body.songTitle}`)
    if (body.mood) parts.push(`Ambiance: ${body.mood}`)
    if (body.instrument) parts.push(`Instrument: ${body.instrument}`)

    const prompt = `Analyse ce contexte pour WebAmp et propose une chaîne d'effets appropriée.\n${parts.join(
      '\n',
    )}\n\nRetourne UNIQUEMENT le JSON AnalysisResult.`

    const analysis = await callLLMForAnalysis(prompt)

    return createCorsJsonResponse(
      {
        ok: true,
        analysis,
      },
      200,
    )
  } catch (error) {
    console.error('ai-analyze error:', error)
    return createCorsErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500,
    )
  }
}

serve((req) => handleCors(req, handler))


