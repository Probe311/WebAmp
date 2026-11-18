/**
 * JWT verification for Edge Functions (anon key + user access token).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

export async function requireUser(req: Request): Promise<{ id: string; email?: string }> {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    throw new AuthError('Authentication required', 401)
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !anonKey) {
    throw new AuthError('Server misconfigured', 500)
  }

  const client = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await client.auth.getUser()
  if (error || !data.user) {
    throw new AuthError('Invalid or expired session', 401)
  }

  return { id: data.user.id, email: data.user.email }
}

export async function requireAdmin(req: Request): Promise<{ id: string }> {
  const user = await requireUser(req)
  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')
  if (!supabaseUrl || !anonKey) {
    throw new AuthError('Server misconfigured', 500)
  }

  const auth = req.headers.get('Authorization')!
  const client = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: auth } },
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await client.rpc('is_admin')
  if (error || data !== true) {
    throw new AuthError('Admin only', 403)
  }
  return user
}

export class AuthError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}
