// Edge Function: ai-beat-architect
// Génération de rythmes de batterie intelligents basés sur des descriptions de style via Gemini API
// Retourne une grille de séquençage sur 16 pas pour la machine à rythmes

import { handleCors, createCorsJsonResponse, createCorsErrorResponse } from '../_shared/cors.ts'
import { callGemini } from '../_shared/gemini.ts'

interface BeatArchitectRequest {
  description: string
  context?: {
    tempo?: number
    timeSignature?: '4/4' | '3/4' | '2/4' | '6/8' | '7/8'
    complexity?: 'simple' | 'medium' | 'complex'
  }
}

interface DrumStep {
  step: number // 0-15
  instruments: Array<'kick' | 'snare' | 'hihat' | 'openhat' | 'crash' | 'ride' | 'tom1' | 'tom2' | 'tom3'>
}

interface BeatPattern {
  name: string
  description?: string
  steps: DrumStep[]
  tempo?: number
  timeSignature?: string
}

async function handleBeatArchitectRequest(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return createCorsJsonResponse({ ok: true })
  }

  if (req.method !== 'POST') {
    return createCorsErrorResponse('Method not allowed', 405)
  }

  try {
    const body = (await req.json()) as BeatArchitectRequest

    if (!body.description || typeof body.description !== 'string') {
      return createCorsErrorResponse('description is required', 400)
    }

    const systemPrompt = `
Tu es un expert en rythmes de batterie et programmation de patterns.
On te donne une description de style (ex: "Groove funk à la James Brown", "Beat rock énergique", "Pattern jazz swing") et tu dois générer une grille de séquençage sur 16 pas.

Retourne STRICTEMENT un JSON valide de type BeatPattern :
{
  "name": "Nom du pattern (ex: 'Funk Groove', 'Rock Beat')",
  "description": "Description courte du style",
  "steps": [
    {
      "step": 0-15,
      "instruments": ["kick", "snare", "hihat", ...]
    },
    ...
  ],
  "tempo": 120,
  "timeSignature": "4/4"
}

Instruments disponibles :
- "kick" : Grosse caisse
- "snare" : Caisse claire
- "hihat" : Charley fermé
- "openhat" : Charley ouvert
- "crash" : Cymbale crash
- "ride" : Cymbale ride
- "tom1", "tom2", "tom3" : Toms

Contraintes :
- Génère exactement 16 steps (step 0 à 15).
- Chaque step peut avoir 0 à plusieurs instruments activés.
- Les patterns typiques :
  * Kick souvent sur les temps forts (0, 4, 8, 12)
  * Snare souvent sur les temps 2 et 4 (4, 12)
  * Hihat peut être régulier ou syncopé selon le style
- Adapte le pattern selon la description (funk = syncopé, rock = simple et puissant, jazz = complexe).
- Ne renvoie AUCUN texte hors du JSON.
- Retourne un objet JSON valide directement, sans wrapper.
`

    const contextParts: string[] = []
    if (body.context?.tempo) contextParts.push(`Tempo: ${body.context.tempo} BPM`)
    if (body.context?.timeSignature) contextParts.push(`Signature: ${body.context.timeSignature}`)
    if (body.context?.complexity) contextParts.push(`Complexité: ${body.context.complexity}`)

    const contextText = contextParts.length > 0 ? `\nContexte: ${contextParts.join(', ')}` : ''

    const userPrompt = `Génère un pattern de batterie pour ce style :\n"${body.description}"${contextText}\n\nRetourne UNIQUEMENT le JSON BeatPattern avec 16 steps.`

    const result = await callGemini<BeatPattern>(systemPrompt, userPrompt, {
      temperature: 0.7, // Équilibre créativité/cohérence
      maxOutputTokens: 2048
    })

    return createCorsJsonResponse(
      {
        ok: true,
        pattern: result,
      },
      200,
    )
  } catch (error) {
    console.error('ai-beat-architect error:', error)
    return createCorsErrorResponse(
      error instanceof Error ? error.message : 'Unknown error',
      500,
    )
  }
}

// Gérer CORS via le helper partagé
serve((req) => handleCors(req, handleBeatArchitectRequest))

