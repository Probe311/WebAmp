// Edge Function: ai-tone-assistant
// Génération de chaînes d'effets complètes à partir d'une description de ton via Gemini API
// Utilise gemini-1.5-flash pour des réponses rapides avec JSON schema

import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'
import { callGemini } from '../_shared/gemini.ts'

interface ToneAssistantRequest {
  description: string
  context?: {
    instrument?: 'guitar' | 'bass' | 'other'
    genre?: string
    artist?: string
    currentEffects?: Array<{
      id: string
      type: string
      enabled: boolean
    }>
  }
}

interface EffectModule {
  type: 'amp' | 'cab' | 'pedal' | 'utility'
  id: string
  enabled: boolean
  parameters: Record<string, number | string | boolean>
  position?: number
}

interface ToneAssistantResponse {
  effects: EffectModule[]
  name?: string
  description?: string
  notes?: string
}

async function handleToneAssistantRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return createCorsJsonResponse({ ok: true })
  }

  if (req.method !== 'POST') {
    return createCorsErrorResponse('Method not allowed', 405)
  }

  try {
    const body = (await req.json()) as ToneAssistantRequest

    if (!body.description || typeof body.description !== 'string') {
      return createCorsErrorResponse('description is required', 400)
    }

    const systemPrompt = `
Tu es un expert en design de sons pour guitare/basse (WebAmp).
On te donne une description de ton désiré et tu dois générer une chaîne d'effets complète.

Retourne STRICTEMENT un JSON valide de type ToneAssistantResponse :
{
  "effects": [
    {
      "type": "amp" | "cab" | "pedal" | "utility",
      "id": "identifiant interne (ex: 'mesa-dual-rectifier', 'ts9-overdrive', 'noise-gate')",
      "enabled": true,
      "parameters": {
        "gain": 0-100,
        "bass": 0-100,
        "mid": 0-100,
        "treble": 0-100,
        "...": "autres paramètres numériques pertinents selon l'effet"
      },
      "position": 0
    }
  ],
  "name": "Nom du preset généré (optionnel)",
  "description": "Description courte (optionnel)",
  "notes": "Notes sur le choix des effets (optionnel)"
}

Contraintes :
- Génère entre 3 et 10 effets dans "effects".
- Utilise des ids cohérents avec l'univers guitare (Marshall, Mesa, Fender, TS9, Big Muff, etc.).
- Les valeurs de "parameters" doivent être entre 0 et 100 pour les contrôles continus.
- L'ordre des effets est important : généralement noise gate → pédales → ampli → cab → utilitaires.
- Ne renvoie AUCUN texte hors du JSON.
- Retourne un objet JSON valide directement, sans wrapper.
`

    const contextParts: string[] = []
    if (body.context?.instrument) contextParts.push(`Instrument: ${body.context.instrument}`)
    if (body.context?.genre) contextParts.push(`Genre: ${body.context.genre}`)
    if (body.context?.artist) contextParts.push(`Artiste: ${body.context.artist}`)
    if (body.context?.currentEffects?.length) {
      contextParts.push(`Effets actuels: ${body.context.currentEffects.map(e => e.id).join(', ')}`)
    }

    const contextText = contextParts.length > 0 ? `\nContexte: ${contextParts.join(', ')}` : ''

    const userPrompt = `Génère une chaîne d'effets WebAmp pour ce ton :\n"${body.description}"${contextText}\n\nRetourne UNIQUEMENT le JSON ToneAssistantResponse.`

    const result = await callGemini<ToneAssistantResponse>(systemPrompt, userPrompt, {
      temperature: 0.8, // Créativité pour les presets
      maxOutputTokens: 2048
    })

    return createCorsJsonResponse(
      {
        ok: true,
        result,
      },
      200,
    )
  } catch (error) {
    console.error('ai-tone-assistant error:', error)
    return createCorsErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500,
    )
  }
}

// Gérer CORS via le helper partagé
serve((req) => handleCors(req, handleToneAssistantRequest))

