/**
 * @deprecated Utilisez getSupabaseClient() depuis lib/supabase.ts à la place
 * 
 * Ce fichier est conservé pour compatibilité avec le code existant.
 * Tous les nouveaux imports doivent utiliser lib/supabase.ts
 */

import { 
  requireSupabaseClient, 
  isSupabaseEnabled,
  getSupabaseConfig,
  supabase
} from '../lib/supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

// Ré-exporter pour compatibilité
export { supabase, isSupabaseEnabled, getSupabaseConfig }

/**
 * @deprecated Utilisez requireSupabaseClient() depuis lib/supabase.ts
 */
export function requireSupabase(): SupabaseClient {
  return requireSupabaseClient()
}

