/**
 * Hook pour charger le catalogue (pédales et amplis) depuis Supabase
 * Fallback sur les données statiques si Supabase n'est pas disponible
 */
import { useState, useEffect } from 'react'
import { PedalModel, availablePedals, isPedalAvailable } from '../data/pedals'
import { AmplifierModel, amplifierLibrary } from '../data/amplifiers'
import { loadPedalsFromSupabase, loadAmplifiersFromSupabase } from '../services/supabase/catalog'
import { getSupabaseClient } from '../lib/supabaseClient'

export function useCatalog() {
  const [pedals, setPedals] = useState<PedalModel[]>(availablePedals)
  const [amplifiers, setAmplifiers] = useState<AmplifierModel[]>(amplifierLibrary)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadCatalog() {
      const supabase = getSupabaseClient()
      
      // Si Supabase n'est pas configuré, utiliser les données statiques
      if (!supabase) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const [loadedPedals, loadedAmps] = await Promise.all([
          loadPedalsFromSupabase(),
          loadAmplifiersFromSupabase()
        ])

        // Tables vides ≠ erreur réseau : garder le catalogue statique
        // sinon la modal liste encore le fallback (memo figé) et le find live rate.
        // Seules les marques validées sont proposées, même si la table en contient d'autres.
        const curated = loadedPedals.filter(isPedalAvailable)
        setPedals(curated.length > 0 ? curated : availablePedals)
        setAmplifiers(loadedAmps.length > 0 ? loadedAmps : amplifierLibrary)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
        // Fallback sur les données statiques en cas d'erreur
        setPedals(availablePedals)
        setAmplifiers(amplifierLibrary)
      } finally {
        setLoading(false)
      }
    }

    loadCatalog()
  }, [])

  return { pedals, amplifiers, loading, error }
}

