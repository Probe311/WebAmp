import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { ADMIN_UUID } from '../config/constants'
import { getSupabaseClient } from '../lib/supabase'

/**
 * Admin UI gate: env UUID (fast) AND/OR DB is_admin() when session exists.
 * Writes remain enforced by RLS regardless of this hook.
 */
export function useIsAdmin(): boolean {
  const { user } = useAuth()
  const uuidMatch = Boolean(ADMIN_UUID) && user?.id === ADMIN_UUID
  const [dbAdmin, setDbAdmin] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!user) {
      setDbAdmin(false)
      return
    }
    const client = getSupabaseClient()
    if (!client) {
      setDbAdmin(false)
      return
    }
    // `rpc()` renvoie un thenable Postgrest (PromiseLike) : pas de `.catch`
    // dessus, on le normalise en Promise avant d'ajouter le gestionnaire.
    void Promise.resolve(client.rpc('is_admin'))
      .then(({ data, error }) => {
        if (!cancelled) setDbAdmin(!error && data === true)
      })
      .catch(() => {
        if (!cancelled) setDbAdmin(false)
      })
    return () => {
      cancelled = true
    }
  }, [user?.id])

  return uuidMatch || dbAdmin
}
