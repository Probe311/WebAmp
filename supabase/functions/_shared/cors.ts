/**
 * Service CORS réutilisable pour les Edge Functions Supabase
 */

export interface CorsOptions {
  origin?: string | string[]
  methods?: string[]
  allowedHeaders?: string[]
  exposedHeaders?: string[]
  credentials?: boolean
  maxAge?: number
}

function allowedOrigins(): string[] {
  const raw = Deno.env.get('CORS_ALLOWED_ORIGINS')?.trim()
  if (raw) {
    return raw.split(',').map((s) => s.trim()).filter(Boolean)
  }
  // Dev defaults ; en prod définir CORS_ALLOWED_ORIGINS
  // Auth + API : origine app uniquement (pas la LP webamp.studio)
  return [
    'https://app.webamp.studio',
    'http://localhost:10000',
    'http://127.0.0.1:10000',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
  ]
}

function resolveOrigin(requestOrigin: string | null, configured: string | string[]): string {
  const list = Array.isArray(configured) ? configured : [configured]
  if (list.includes('*')) return '*'
  if (requestOrigin && list.includes(requestOrigin)) return requestOrigin
  return list[0] || 'null'
}

const DEFAULT_OPTIONS: CorsOptions = {
  origin: allowedOrigins(),
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-client-info',
    'apikey',
  ],
  exposedHeaders: [],
  credentials: false,
  maxAge: 86400,
}

export function createCorsPreflightResponse(
  options: CorsOptions = {},
  requestOrigin: string | null = null
): Response {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const headers = new Headers()
  headers.set('Access-Control-Allow-Origin', resolveOrigin(requestOrigin, opts.origin || allowedOrigins()))
  headers.set('Vary', 'Origin')
  if (opts.methods?.length) {
    headers.set('Access-Control-Allow-Methods', opts.methods.join(', '))
  }
  if (opts.allowedHeaders?.length) {
    headers.set('Access-Control-Allow-Headers', opts.allowedHeaders.join(', '))
  }
  if (opts.exposedHeaders?.length) {
    headers.set('Access-Control-Expose-Headers', opts.exposedHeaders.join(', '))
  }
  if (opts.credentials) {
    headers.set('Access-Control-Allow-Credentials', 'true')
  }
  if (opts.maxAge) {
    headers.set('Access-Control-Max-Age', opts.maxAge.toString())
  }
  return new Response(null, { status: 204, headers })
}

export function addCorsHeaders(
  response: Response,
  options: CorsOptions = {},
  requestOrigin: string | null = null
): Response {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', resolveOrigin(requestOrigin, opts.origin || allowedOrigins()))
  headers.set('Vary', 'Origin')
  if (opts.credentials) {
    headers.set('Access-Control-Allow-Credentials', 'true')
  }
  if (opts.exposedHeaders?.length) {
    headers.set('Access-Control-Expose-Headers', opts.exposedHeaders.join(', '))
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

export function createCorsJsonResponse(
  data: unknown,
  status: number = 200,
  options: CorsOptions = {},
  requestOrigin: string | null = null
): Response {
  const response = new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
  return addCorsHeaders(response, options, requestOrigin)
}

export function createCorsErrorResponse(
  error: string | Error,
  status: number = 500,
  options: CorsOptions = {},
  requestOrigin: string | null = null
): Response {
  const message = error instanceof Error ? error.message : error
  return createCorsJsonResponse({ error: message }, status, options, requestOrigin)
}

export function handleCors(
  request: Request,
  handler: (request: Request) => Promise<Response>,
  options: CorsOptions = {}
): Promise<Response> {
  const origin = request.headers.get('Origin')
  if (request.method === 'OPTIONS') {
    return Promise.resolve(createCorsPreflightResponse(options, origin))
  }
  return handler(request).then((response) => addCorsHeaders(response, options, origin))
}
