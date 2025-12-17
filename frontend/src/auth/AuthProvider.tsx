import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { useToast } from '../components/notifications/ToastProvider'
import { supabase, isSupabaseEnabled, requireSupabase } from './supabaseClient'
import { AuthContextValue } from './types'

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(false)
  const authEnabled = useMemo(() => isSupabaseEnabled && Boolean(supabase), [])

  useEffect(() => {
    if (!supabase) {
      setInitializing(false)
      return
    }

    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          return
        }
        setSession(data.session)
        setUser(data.session?.user ?? null)
      })
      .finally(() => setInitializing(false))

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const ensureClient = useCallback(() => {
    if (!authEnabled) {
      const errorMsg = 'Authentification non configurée. Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans frontend/.env.local.'
      showToast({
        variant: 'error',
        title: 'Auth indisponible',
        message: errorMsg
      })
      throw new Error(errorMsg)
    }
    return requireSupabase()
  }, [authEnabled, showToast])

  const login = useCallback(async (email: string, password: string) => {
    if (!authEnabled) {
      const errorMsg = 'Authentification non configurée. Ajoute VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.'
      showToast({
        variant: 'error',
        title: 'Connexion impossible',
        message: errorMsg
      })
      throw new Error(errorMsg)
    }
    setLoading(true)
    try {
      const client = ensureClient()
      const { error } = await client.auth.signInWithPassword({ email, password })
      if (error) throw error
      showToast({
        variant: 'success',
        title: 'Connexion réussie',
        message: 'Bienvenue de retour sur WebAmp.'
      })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Connexion impossible',
        message: error instanceof Error ? error.message : 'Vérifie tes identifiants.'
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [ensureClient, showToast])

  const signUp = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const client = ensureClient()
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      })
      if (error) throw error
      
      // Si l'utilisateur est immédiatement connecté (email confirmation désactivée)
      if (data.user && data.session) {
        setSession(data.session)
        setUser(data.user)
        showToast({
          variant: 'success',
          title: 'Compte créé',
          message: 'Ton compte a été créé avec succès !'
        })
        return true
      }
      
      // Sinon, confirmation email nécessaire
      showToast({
        variant: 'success',
        title: 'Compte créé',
        message: 'Vérifie tes emails pour confirmer ton adresse.'
      })
      return false
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? (error.message.includes('API key') || error.message.includes('Invalid')
          ? 'Configuration incorrecte. Vérifie les paramètres d\'authentification.'
          : error.message)
        : 'Impossible de créer le compte.'
      showToast({
        variant: 'error',
        title: 'Inscription échouée',
        message: errorMessage
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [ensureClient, showToast])

  const logout = useCallback(async () => {
    setLoading(true)
    try {
      const client = ensureClient()
      const { error } = await client.auth.signOut()
      if (error) throw error
      showToast({
        variant: 'info',
        title: 'Déconnexion',
        message: 'À bientôt sur WebAmp.'
      })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Déconnexion impossible',
        message: error instanceof Error ? error.message : 'Réessaie dans un instant.'
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [ensureClient, showToast])

  const resetPassword = useCallback(async (email: string) => {
    setLoading(true)
    try {
      const client = ensureClient()
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account`
      })
      if (error) throw error
      showToast({
        variant: 'info',
        title: 'E-mail envoyé',
        message: 'Consulte ta boîte mail pour réinitialiser ton mot de passe.'
      })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Impossible d\'envoyer l\'e-mail',
        message: error instanceof Error ? error.message : 'Vérifie l\'adresse saisie.'
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [ensureClient, showToast])

  const updatePassword = useCallback(async (newPassword: string) => {
    setLoading(true)
    try {
      const client = ensureClient()
      const { error } = await client.auth.updateUser({ password: newPassword })
      if (error) throw error
      showToast({
        variant: 'success',
        title: 'Mot de passe mis à jour',
        message: 'Ton mot de passe a bien été changé.'
      })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Mise à jour impossible',
        message: error instanceof Error ? error.message : 'Réessaie avec un autre mot de passe.'
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [ensureClient, showToast])

  const updateUserMetadata = useCallback(async (metadata: Record<string, any>) => {
    setLoading(true)
    try {
      const client = ensureClient()
      const { error } = await client.auth.updateUser({
        data: metadata
      })
      if (error) throw error
      
      // Rafraîchir la session pour obtenir les nouvelles métadonnées
      const { data: sessionData, error: sessionError } = await client.auth.getSession()
      if (!sessionError && sessionData.session) {
        setSession(sessionData.session)
        setUser(sessionData.session.user)
      }
      
      showToast({
        variant: 'success',
        title: 'Profil mis à jour',
        message: 'Tes informations ont été enregistrées.'
      })
    } catch (error) {
      showToast({
        variant: 'error',
        title: 'Mise à jour impossible',
        message: error instanceof Error ? error.message : 'Impossible de mettre à jour tes informations.'
      })
      throw error
    } finally {
      setLoading(false)
    }
  }, [ensureClient, showToast])

  const refreshSession = useCallback(async () => {
    const client = ensureClient()
    const { data, error } = await client.auth.getSession()
    if (error) {
      return
    }
    setSession(data.session)
    setUser(data.session?.user ?? null)
  }, [ensureClient])

  const value = useMemo<AuthContextValue>(() => ({
    session,
    user,
    initializing,
    loading,
    authEnabled,
    login,
    signUp,
    logout,
    resetPassword,
    updatePassword,
    updateUserMetadata,
    refreshSession
  }), [session, user, initializing, loading, authEnabled, login, signUp, logout, resetPassword, updatePassword, updateUserMetadata, refreshSession])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur de AuthProvider')
  }
  return context
}

export { AuthContext }

