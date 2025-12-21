/**
 * @deprecated Utilisez getSupabaseClient() depuis lib/supabase.ts à la place
 * 
 * Ce fichier est conservé pour compatibilité avec le code existant.
 */

import { getSupabaseClient as getSupabaseClientFromLib } from './supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * @deprecated Utilisez getSupabaseClient() depuis lib/supabase.ts
 */
export function getSupabaseClient(): SupabaseClient | null {
  return getSupabaseClientFromLib()
}

