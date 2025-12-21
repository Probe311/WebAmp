/**
 * Client Supabase centralisé pour toute l'application
 * 
 * Ce fichier remplace tous les autres clients Supabase dispersés dans le codebase.
 * Utilisez cette fonction pour obtenir le client Supabase partout dans l'application.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../config'
import { SUPABASE_STORAGE_KEY_AUTH } from '../config/constants'

let supabaseClient: SupabaseClient | null = null

/**
 * Vérifie si Supabase est configuré
 */
export function isSupabaseEnabled(): boolean {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    SUPABASE_URL.length > 0 && 
    SUPABASE_ANON_KEY.length > 0
  )
}

/**
 * Obtient le client Supabase (singleton)
 * 
 * @returns Le client Supabase ou null si non configuré
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseEnabled()) {
    return null
  }

  if (!supabaseClient) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: SUPABASE_STORAGE_KEY_AUTH
      }
    })
  }

  return supabaseClient
}

/**
 * Obtient le client Supabase ou lance une erreur si non configuré
 * 
 * @returns Le client Supabase
 * @throws Error si Supabase n'est pas configuré
 */
export function requireSupabaseClient(): SupabaseClient {
  const client = getSupabaseClient()
  if (!client) {
    throw new Error(
      'Authentification non configurée. Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans frontend/.env.local.'
    )
  }
  return client
}

/**
 * Obtient la configuration Supabase (pour compatibilité)
 */
export function getSupabaseConfig() {
  return {
    url: SUPABASE_URL ?? '',
    anonKey: SUPABASE_ANON_KEY ?? ''
  }
}

// Export du client pour compatibilité avec le code existant
// ⚠️ Utilisez getSupabaseClient() de préférence
export const supabase = getSupabaseClient()

