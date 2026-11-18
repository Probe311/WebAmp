import { normalizeAppId, type AppId } from '../workspace/types'

export type AuthIntent = 'login' | 'signup' | 'recovery'

export interface AuthDeepLink {
  auth: AuthIntent | null
  next: AppId | null
}

const AUTH_VALUES = new Set<string>(['login', 'signup', 'recovery'])

/** Parse `?auth=` + `?next=` (next = AppId allowlisté uniquement). */
export function parseAuthDeepLink(search: string): AuthDeepLink {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const rawAuth = params.get('auth')
  const auth = rawAuth && AUTH_VALUES.has(rawAuth) ? (rawAuth as AuthIntent) : null
  const rawNext = params.get('next')
  const next = rawNext ? normalizeAppId(rawNext) : null
  return { auth, next }
}

/** App cible après login : `next` allowlisté ou home. */
export function resolvePostAuthApp(next: AppId | null): AppId {
  return next ?? 'home'
}

/** Retire auth/next de l’URL sans recharger. */
export function clearAuthDeepLinkFromUrl(): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  if (!url.searchParams.has('auth') && !url.searchParams.has('next')) return
  url.searchParams.delete('auth')
  url.searchParams.delete('next')
  const qs = url.searchParams.toString()
  const nextUrl = `${url.pathname}${qs ? `?${qs}` : ''}${url.hash}`
  window.history.replaceState(window.history.state, '', nextUrl)
}
