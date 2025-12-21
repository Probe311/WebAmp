// Edge Function: ai-presets
// Génération de presets WebAmp à partir d'une description textuelle via Gemini API
// Cette fonction renvoie un JSON structuré de preset exploitable par le frontend.

import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'
import { callGemini } from '../_shared/gemini.ts'

interface GeneratePresetRequest {
  description: string
  context?: {
    instrument?: 'guitar' | 'bass' | 'other'
    genre?: string
    artist?: string
    songTitle?: string
    level?: 'beginner' | 'intermediate' | 'advanced'
  }
}

interface WebAmpPreset {
  id: string
  name: string
  description?: string
  tags?: string[]
  genre?: string
  mood?: string
  instrument?: string
  // Chaîne d'effets structurée
  chain: Array<{
    type: 'amp' | 'cab' | 'pedal' | 'utility'
    id: string
    enabled: boolean
    parameters: Record<string, number | string | boolean>
  }>
}

async function callLLMForPreset(prompt: string): Promise<WebAmpPreset> {
  const systemPrompt = `
Tu es un designer de presets pour WebAmp (simulateur d'ampli/pédales guitare).
Tu dois répondre STRICTEMENT en JSON valide correspondant au type WebAmpPreset suivant :

{
  "id": "string (slug, ex: 'modern-metal-lead')",
  "name": "Nom lisible du preset",
  "description": "Courte description",
  "tags": ["metal", "lead", "modern"],
  "genre": "metal",
  "mood": "aggressive",
  "instrument": "guitar",
  "chain": [
    {
      "type": "amp" | "cab" | "pedal" | "utility",
      "id": "identifiant interne du modèle (ex: 'mesa-dual-rectifier', 'ts9', 'noise-gate')",
      "enabled": true,
      "parameters": {
        "gain": 0-100,
        "bass": 0-100,
        "mid": 0-100,
        "treble": 0-100,
        "...": "autres paramètres numériques pertinents"
      }
    }
  ]
}

Contraintes :
- Utilise des ids cohérents avec un univers standard guitare (Marshall, Mesa, Fender, TS9, etc.).
- Les valeurs de "parameters" doivent rester entre 0 et 100 pour les contrôles continus.
- Ne mets AUCUN texte hors du JSON (pas de commentaires, pas de backticks).
- Retourne un objet JSON valide directement, sans wrapper.
`

  return await callGemini<WebAmpPreset>(systemPrompt, prompt, {
    temperature: 0.8, // Créativité pour les presets
    maxOutputTokens: 2048
  })
}

async function handlePresetGenerationRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return createCorsJsonResponse({ ok: true })
  }

  if (req.method !== 'POST') {
    return createCorsErrorResponse('Method not allowed', 405)
  }

  try {
    const body = (await req.json()) as GeneratePresetRequest

    if (!body.description || typeof body.description !== 'string') {
      return createCorsErrorResponse('description is required', 400)
    }

    const contextParts: string[] = []
    if (body.context?.instrument) contextParts.push(`Instrument: ${body.context.instrument}`)
    if (body.context?.genre) contextParts.push(`Genre: ${body.context.genre}`)
    if (body.context?.artist) contextParts.push(`Artiste: ${body.context.artist}`)
    if (body.context?.songTitle) contextParts.push(`Chanson: ${body.context.songTitle}`)
    if (body.context?.level) contextParts.push(`Niveau: ${body.context.level}`)

    const contextText = contextParts.length > 0 ? `\nContexte: ${contextParts.join(', ')}` : ''

    const prompt = `Génère un preset WebAmp pour la description suivante :\n"${body.description}"${contextText}\n\nRetourne UNIQUEMENT le JSON du preset.`

    const preset = await callLLMForPreset(prompt)

    return createCorsJsonResponse(
      {
        ok: true,
        preset,
      },
      200,
    )
  } catch (error) {
    console.error('ai-presets error:', error)
    return createCorsErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500,
    )
  }
}

// Gérer CORS via le helper partagé
serve((req) => handleCors(req, handlePresetGenerationRequest))


