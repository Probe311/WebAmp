// Edge Function: ai-analyze
// Analyse intelligente à partir de métadonnées (genre, artiste, contexte)
// et suggestions d'effets/presets adaptés via Gemini API.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'
import { callGemini } from '../_shared/gemini.ts'

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
  // Utilise Gemini API via le helper partagé
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

  return await callGemini<AnalysisResult>(systemPrompt, prompt, {
    temperature: 0.7,
    maxOutputTokens: 4096
  })
}

async function handleAnalysisRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return createCorsJsonResponse({ ok: true })
  }

  if (req.method !== 'POST') {
    return createCorsErrorResponse('Method not allowed', 405)
  }

  try {
    let body: AnalyzeRequest
    try {
      body = await req.json() as AnalyzeRequest
    } catch {
      return createCorsErrorResponse('Invalid JSON body', 400)
    }

    // Validation des entrées
    if (!body || typeof body !== 'object') {
      return createCorsErrorResponse('Invalid request body', 400)
    }

    // Validation et sanitisation des champs
    const sanitizedBody: AnalyzeRequest = {
      genre: body.genre && typeof body.genre === 'string' ? body.genre.trim().slice(0, 100) : undefined,
      artist: body.artist && typeof body.artist === 'string' ? body.artist.trim().slice(0, 100) : undefined,
      songTitle: body.songTitle && typeof body.songTitle === 'string' ? body.songTitle.trim().slice(0, 200) : undefined,
      mood: body.mood && typeof body.mood === 'string' ? body.mood.trim().slice(0, 50) : undefined,
      instrument: body.instrument && ['guitar', 'bass', 'other'].includes(body.instrument) ? body.instrument : undefined
    }

    if (!sanitizedBody.genre && !sanitizedBody.artist && !sanitizedBody.songTitle && !sanitizedBody.mood) {
      return createCorsErrorResponse(
        'Au moins un champ parmi genre, artist, songTitle ou mood est requis',
        400,
      )
    }

    const parts: string[] = []
    if (sanitizedBody.genre) parts.push(`Genre: ${sanitizedBody.genre}`)
    if (sanitizedBody.artist) parts.push(`Artiste: ${sanitizedBody.artist}`)
    if (sanitizedBody.songTitle) parts.push(`Morceau: ${sanitizedBody.songTitle}`)
    if (sanitizedBody.mood) parts.push(`Ambiance: ${sanitizedBody.mood}`)
    if (sanitizedBody.instrument) parts.push(`Instrument: ${sanitizedBody.instrument}`)

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

serve((req) => handleCors(req, handleAnalysisRequest))


