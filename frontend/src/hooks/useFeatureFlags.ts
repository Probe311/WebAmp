/**
 * Hook pour gérer les feature flags depuis Supabase
 */
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../lib/supabaseClient'
import { FeatureFlag } from '../services/admin'

export function useFeatureFlags() {
  const [flags, setFlags] = useState<Map<string, FeatureFlag>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFlags()
    
    // Écouter les changements en temps réel
    const supabase = getSupabaseClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    const channel = supabase
      .channel('feature_flags_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feature_flags'
        },
        () => {
          loadFlags()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadFlags = async () => {
    const supabase = getSupabaseClient()
    if (!supabase) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*')

      if (error) {
        // Si la table n'existe pas, continuer avec un Map vide
        if (error.code === '42P01') {
          setFlags(new Map())
          setLoading(false)
          return
        }
        console.error('Erreur lors du chargement des feature flags:', error)
        setFlags(new Map())
      } else {
        const flagsMap = new Map<string, FeatureFlag>()
        data?.forEach(flag => {
          flagsMap.set(flag.key, flag)
        })
        setFlags(flagsMap)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des feature flags:', error)
      setFlags(new Map())
    } finally {
      setLoading(false)
    }
  }

  /**
   * Vérifie si une fonctionnalité est activée
   */
  const isEnabled = (key: string): boolean => {
    const flag = flags.get(key)
    return flag?.enabled ?? false
  }

  /**
   * Récupère la valeur d'un feature flag
   */
  const getValue = (key: string): any => {
    const flag = flags.get(key)
    return flag?.value ?? null
  }

  /**
   * Récupère le feature flag complet
   */
  const getFlag = (key: string): FeatureFlag | undefined => {
    return flags.get(key)
  }

  return {
    flags,
    loading,
    isEnabled,
    getValue,
    getFlag,
    refresh: loadFlags
  }
}

