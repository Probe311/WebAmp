/**
 * Service CORS réutilisable pour les Edge Functions Supabase
 * Gère les en-têtes CORS de manière standardisée
 */

export interface CorsOptions {
  origin?: string | string[]
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

const DEFAULT_OPTIONS: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-client-info', // Header envoyé par Supabase JS SDK
    'apikey' // Header pour l'authentification Supabase
  ],
  exposedHeaders: [],
  credentials: false,
  maxAge: 86400 // 24 heures
}

/**
 * Crée une réponse CORS préflight (OPTIONS)
 */
export function createCorsPreflightResponse(options: CorsOptions = {}): Response {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  const headers = new Headers()
  
  // Origin
  if (Array.isArray(opts.origin)) {
    headers.set('Access-Control-Allow-Origin', opts.origin[0])
  } else {
    headers.set('Access-Control-Allow-Origin', opts.origin || '*')
  }
  
  // Methods
  if (opts.methods && opts.methods.length > 0) {
    headers.set('Access-Control-Allow-Methods', opts.methods.join(', '))
  }
  
  // Headers
  if (opts.allowedHeaders && opts.allowedHeaders.length > 0) {
    headers.set('Access-Control-Allow-Headers', opts.allowedHeaders.join(', '))
  }
  
  // Exposed headers
  if (opts.exposedHeaders && opts.exposedHeaders.length > 0) {
    headers.set('Access-Control-Expose-Headers', opts.exposedHeaders.join(', '))
  }
  
  // Credentials
  if (opts.credentials) {
    headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  // Max age
  if (opts.maxAge) {
    headers.set('Access-Control-Max-Age', opts.maxAge.toString())
  }
  
  return new Response(null, { status: 204, headers })
}

/**
 * Ajoute les en-têtes CORS à une réponse existante
 */
export function addCorsHeaders(response: Response, options: CorsOptions = {}): Response {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  const headers = new Headers(response.headers)
  
  // Origin
  if (Array.isArray(opts.origin)) {
    headers.set('Access-Control-Allow-Origin', opts.origin[0])
  } else {
    headers.set('Access-Control-Allow-Origin', opts.origin || '*')
  }
  
  // Credentials
  if (opts.credentials) {
    headers.set('Access-Control-Allow-Credentials', 'true')
  }
  
  // Exposed headers
  if (opts.exposedHeaders && opts.exposedHeaders.length > 0) {
    headers.set('Access-Control-Expose-Headers', opts.exposedHeaders.join(', '))
  }
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  })
}

/**
 * Crée une réponse JSON avec en-têtes CORS
 */
export function createCorsJsonResponse(
  data: unknown,
  status: number = 200,
  options: CorsOptions = {}
): Response {
  const response = new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
  return addCorsHeaders(response, options)
}

/**
 * Crée une réponse d'erreur avec en-têtes CORS
 */
export function createCorsErrorResponse(
  error: string | Error,
  status: number = 500,
  options: CorsOptions = {}
): Response {
  const message = error instanceof Error ? error.message : error
  
  return createCorsJsonResponse(
    { error: message },
    status,
    options
  )
}

/**
 * Gère les requêtes CORS préflight et ajoute les en-têtes aux réponses
 */
export function handleCors(
  request: Request,
  handler: (request: Request) => Promise<Response>,
  options: CorsOptions = {}
): Promise<Response> {
  // Gérer les requêtes OPTIONS (preflight)
  if (request.method === 'OPTIONS') {
    return Promise.resolve(createCorsPreflightResponse(options))
  }
  
  // Exécuter le handler et ajouter les en-têtes CORS
  return handler(request).then(response => addCorsHeaders(response, options))
}

