import type { AppId } from '../workspace/types'
import { normalizeAppId } from '../workspace/types'
import type { AuthIntent } from './authDeepLink'

const POST_AUTH_KEY = 'webamp-post-auth-app'
const GATE_VIEW_KEY = 'webamp-auth-gate-view'
const GATE_ACTIVE_KEY = 'webamp-auth-gate'

export function setPostAuthApp(appId: AppId): void {
  try {
    sessionStorage.setItem(POST_AUTH_KEY, appId)
  } catch {
    /* ignore */
  }
}

export function consumePostAuthApp(): AppId | null {
  try {
    const raw = sessionStorage.getItem(POST_AUTH_KEY)
    sessionStorage.removeItem(POST_AUTH_KEY)
    return raw ? normalizeAppId(raw) : null
  } catch {
    return null
  }
}

export function setAuthGateActive(active: boolean): void {
  try {
    if (active) sessionStorage.setItem(GATE_ACTIVE_KEY, '1')
    else sessionStorage.removeItem(GATE_ACTIVE_KEY)
  } catch {
    /* ignore */
  }
}

export function isAuthGateActive(): boolean {
  try {
    return sessionStorage.getItem(GATE_ACTIVE_KEY) === '1'
  } catch {
    return false
  }
}

export function setAuthGateView(view: 'login' | 'signup' | 'forgot'): void {
  try {
    sessionStorage.setItem(GATE_VIEW_KEY, view)
  } catch {
    /* ignore */
  }
}

export function peekAuthGateView(): 'login' | 'signup' | 'forgot' {
  try {
    const raw = sessionStorage.getItem(GATE_VIEW_KEY)
    if (raw === 'signup' || raw === 'forgot') return raw
    return 'login'
  } catch {
    return 'login'
  }
}

export function intentToGateView(auth: AuthIntent): 'login' | 'signup' | 'forgot' {
  return auth === 'signup' ? 'signup' : 'login'
}

/** Event runtime pour ouvrir AuthGate hors deep-link (ex. dock Compte). */
export const AUTH_GATE_EVENT = 'webamp:open-auth-gate'

export function requestAuthGate(
  view: 'login' | 'signup' | 'forgot' = 'login',
  next?: AppId,
): void {
  setAuthGateView(view)
  setAuthGateActive(true)
  if (next) setPostAuthApp(next)
  try {
    window.dispatchEvent(new CustomEvent(AUTH_GATE_EVENT, { detail: { view } }))
  } catch {
    /* ignore (SSR / tests) */
  }
}
