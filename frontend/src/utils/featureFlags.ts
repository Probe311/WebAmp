/**
 * Utilitaire pour vérifier les feature flags
 * Utilise le hook useFeatureFlags pour accéder aux flags depuis n'importe où
 */

import { getSupabaseClient } from '../lib/supabaseClient'

// Cache des feature flags (mis à jour périodiquement)
let featureFlagsCache: Map<string, boolean> = new Map()
let lastCacheUpdate = 0
const CACHE_DURATION = 60000 // 1 minute

/**
 * Charge les feature flags depuis Supabase (avec cache)
 */
async function loadFeatureFlags(): Promise<Map<string, boolean>> {
  const now = Date.now()
  
  // Utiliser le cache si récent
  if (now - lastCacheUpdate < CACHE_DURATION && featureFlagsCache.size > 0) {
    return featureFlagsCache
  }

  const supabase = getSupabaseClient()
  if (!supabase) {
    return new Map()
  }

  try {
    const { data, error } = await supabase
      .from('feature_flags')
      .select('key, enabled')

    if (error) {
      if (error.code === '42P01') {
        // Table n'existe pas encore
        return new Map()
      }
      console.error('Erreur lors du chargement des feature flags:', error)
      return featureFlagsCache
    }

    const flags = new Map<string, boolean>()
    data?.forEach(flag => {
      flags.set(flag.key, flag.enabled)
    })

    featureFlagsCache = flags
    lastCacheUpdate = now
    return flags
  } catch (error) {
    console.error('Erreur lors du chargement des feature flags:', error)
    return featureFlagsCache
  }
}

/**
 * Vérifie si une fonctionnalité est activée
 * @param key Clé du feature flag
 * @param defaultValue Valeur par défaut si le flag n'existe pas
 */
export async function isFeatureEnabled(key: string, defaultValue: boolean = false): Promise<boolean> {
  const flags = await loadFeatureFlags()
  return flags.get(key) ?? defaultValue
}

/**
 * Vérifie si une fonctionnalité est activée (synchrone, utilise le cache)
 * @param key Clé du feature flag
 * @param defaultValue Valeur par défaut si le flag n'existe pas
 */
export function isFeatureEnabledSync(key: string, defaultValue: boolean = false): boolean {
  return featureFlagsCache.get(key) ?? defaultValue
}

/**
 * Force le rechargement du cache
 */
export async function refreshFeatureFlags(): Promise<void> {
  lastCacheUpdate = 0
  await loadFeatureFlags()
}

// Charger les flags au démarrage
if (typeof window !== 'undefined') {
  loadFeatureFlags()
  
  // Écouter les changements en temps réel
  const supabase = getSupabaseClient()
  if (supabase) {
    supabase
      .channel('feature_flags_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flags'
        },
        () => {
          lastCacheUpdate = 0
          loadFeatureFlags()
        }
      )
      .subscribe()
  }
}

