/**
 * Appels Edge Functions avec JWT session + anon key.
 */
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config'
import { getSupabaseClient } from '../lib/supabase'

export async function invokeEdge<T = unknown>(
  functionName: string,
  body?: unknown,
  opts?: { requireAuth?: boolean }
): Promise<T> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase non configuré')
  }

  const requireAuth = opts?.requireAuth !== false
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
  }

  if (requireAuth) {
    const client = getSupabaseClient()
    const { data } = await client?.auth.getSession() ?? { data: { session: null } }
    const token = data.session?.access_token
    if (!token) {
      throw new Error('Connexion requise pour cette action')
    }
    headers.Authorization = `Bearer ${token}`
  } else {
    headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`
  }

  const url = `${SUPABASE_URL.replace(/\/$/, '')}/functions/v1/${functionName}`
  const resp = await fetch(url, {
    method: 'POST',
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!resp.ok) {
    let detail = ''
    try {
      const j = await resp.json()
      detail = typeof j?.error === 'string' ? j.error : ''
    } catch {
      detail = await resp.text().catch(() => '')
    }
    throw new Error(detail || `Erreur serveur (${resp.status})`)
  }

  return (await resp.json()) as T
}
