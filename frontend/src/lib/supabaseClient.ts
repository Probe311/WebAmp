import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config'

let supabase: SupabaseClient | null = null

// Utiliser une clé de stockage différente pour éviter les conflits avec auth/supabaseClient.ts
const STORAGE_KEY = 'webamp-data'

export function getSupabaseClient(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return null
  }
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: STORAGE_KEY
      },
    })
  }
  return supabase
}

