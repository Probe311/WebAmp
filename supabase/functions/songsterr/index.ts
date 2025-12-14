/**
 * Edge Function Supabase pour les appels à l'API Songsterr
 * Contourne les restrictions CORS en faisant les appels depuis le serveur
 * 
 * Note: Cette fonction utilise Deno, pas Node.js
 * Les imports avec URLs HTTPS sont normaux pour Deno
 * Les erreurs TypeScript dans l'IDE sont normales et n'empêchent pas le déploiement
 */

// @ts-ignore - Deno import, normal pour Edge Functions
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @ts-ignore - Deno import avec extension .ts
import { createCorsJsonResponse, createCorsErrorResponse, handleCors } from '../_shared/cors.ts'

const SONGSTERR_BASE_URL = 'https://www.songsterr.com'

interface SongsterrRequest {
  action: 'search' | 'getTab' | 'getTabData'
  query?: string // Pour search: "title artist"
  tabId?: number // Pour getTab et getTabData
}

/**
 * Recherche une chanson sur Songsterr
 */
async function searchSongsterr(query: string): Promise<any> {
  const url = `${SONGSTERR_BASE_URL}/a/wa/bestMatchForQueryStringPart?s=${encodeURIComponent(query)}`
  
  console.log('🔍 Songsterr search:', url)
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Songsterr API error: ${response.status} ${response.statusText}`)
  }
  
  const data = await response.json()
  console.log('✅ Songsterr search result:', data)
  
  return data
}

/**
 * Récupère les données complètes d'une tablature
 */
async function getTabData(tabId: number): Promise<any> {
  const url = `${SONGSTERR_BASE_URL}/a/wa/view?r=${tabId}`
  
  console.log('📥 Songsterr getTabData:', url)
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  })
  
  if (!response.ok) {
    throw new Error(`Songsterr API error: ${response.status} ${response.statusText}`)
  }
  
  const html = await response.text()
  
  // Essayer d'extraire les données JSON du HTML
  // Songsterr inclut généralement les données dans un script JavaScript
  try {
    // Chercher les données dans les scripts JavaScript
    const scriptMatch = html.match(/<script[^>]*>[\s\S]*?var\s+tab\s*=\s*({[\s\S]*?});/i) ||
                       html.match(/<script[^>]*>[\s\S]*?window\.tab\s*=\s*({[\s\S]*?});/i)
    
    if (scriptMatch && scriptMatch[1]) {
      try {
        const tabData = JSON.parse(scriptMatch[1])
        console.log('✅ Tab data extracted from HTML')
        return tabData
      } catch (parseError) {
        console.warn('⚠️ Error parsing tab data:', parseError)
      }
    }
    
    // Chercher les métadonnées dans JSON-LD
    const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i)
    if (jsonLdMatch && jsonLdMatch[1]) {
      try {
        const jsonLd = JSON.parse(jsonLdMatch[1])
        console.log('✅ JSON-LD metadata found')
        return {
          ...jsonLd,
          html // Inclure le HTML pour un parsing ultérieur si nécessaire
        }
      } catch (parseError) {
        console.warn('⚠️ Error parsing JSON-LD:', parseError)
      }
    }
    
    // Si on ne trouve pas de données structurées, retourner au moins le HTML
    console.log('⚠️ No structured data found, returning HTML')
    return {
      html,
      id: tabId
    }
  } catch (extractionError) {
    console.warn('⚠️ Error extracting data:', extractionError)
    return {
      html,
      id: tabId
    }
  }
}

/**
 * Handler principal de la fonction
 */
async function handler(request: Request): Promise<Response> {
  try {
    // Vérifier la méthode
    if (request.method !== 'POST') {
      return createCorsErrorResponse('Method not allowed. Use POST.', 405)
    }
    
    // Parser le body
    let body: SongsterrRequest
    try {
      body = await request.json()
    } catch (error) {
      return createCorsErrorResponse('Invalid JSON in request body', 400)
    }
    
    // Valider la requête
    if (!body.action) {
      return createCorsErrorResponse('Missing "action" field in request body', 400)
    }
    
    let result: any
    
    switch (body.action) {
      case 'search':
        if (!body.query) {
          return createCorsErrorResponse('Missing "query" field for search action', 400)
        }
        result = await searchSongsterr(body.query)
        break
        
      case 'getTabData':
        if (!body.tabId) {
          return createCorsErrorResponse('Missing "tabId" field for getTabData action', 400)
        }
        result = await getTabData(body.tabId)
        break
        
      default:
        return createCorsErrorResponse(`Unknown action: ${body.action}`, 400)
    }
    
    return createCorsJsonResponse({
      success: true,
      data: result
    })
    
  } catch (error) {
    console.error('❌ Error in songsterr function:', error)
    return createCorsErrorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500
    )
  }
}

// Serveur Deno avec gestion CORS
serve((request: Request) => {
  return handleCors(request, handler, {
    origin: '*', // En production, spécifier les origines autorisées
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-client-info', // Header envoyé par Supabase JS SDK
      'apikey' // Header pour l'authentification Supabase
    ],
    credentials: false
  })
})

