import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim()
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const hasConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && 
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0)

if (!hasConfig) {
  console.warn('[Auth] Authentification non configurée. Crée un fichier .env.local dans frontend/ avec :')
  console.warn('[Auth] VITE_SUPABASE_URL=https://ton-projet.supabase.co')
  console.warn('[Auth] VITE_SUPABASE_ANON_KEY=ton_cle_anon')
}

// Utiliser une clé de stockage unique pour éviter les conflits avec d'autres instances
const STORAGE_KEY = 'webamp-auth'

const client: SupabaseClient | null = hasConfig
  ? createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: STORAGE_KEY
      }
    })
  : null

export const supabase = client
export const isSupabaseEnabled = hasConfig

export function requireSupabase(): SupabaseClient {
  if (!client) {
    throw new Error('Authentification non configurée. Vérifie les variables d\'environnement.')
  }
  return client
}

export function getSupabaseConfig() {
  return {
    url: SUPABASE_URL ?? '',
    anonKey: SUPABASE_ANON_KEY ?? ''
  }
}

