import { ReactNode, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import { AuthProvider, useAuth } from './AuthProvider'
import {
  clearAuthDeepLinkFromUrl,
  parseAuthDeepLink,
  resolvePostAuthApp,
} from './authDeepLink'
import {
  AUTH_GATE_EVENT,
  intentToGateView,
  isAuthGateActive,
  peekAuthGateView,
  setAuthGateActive,
  setAuthGateView,
  setPostAuthApp,
} from './authGateSession'
import { analyticsService } from '../services/analytics'

const AuthGate = lazy(() =>
  import('./pages/AuthGate').then((m) => ({ default: m.AuthGate })),
)

interface Props {
  children: ReactNode
}

function GateFallback() {
  return <div className="neu-bg h-screen w-screen" aria-busy="true" />
}

function AppContent({ children }: Props) {
  const { user, initializing } = useAuth()
  const [gateOpen, setGateOpen] = useState(false)
  const [gateView, setGateView] = useState<'login' | 'signup' | 'forgot'>('login')
  const deepLinkHandled = useRef(false)

  useEffect(() => {
    if (initializing || deepLinkHandled.current) return
    deepLinkHandled.current = true

    const { auth, next } = parseAuthDeepLink(window.location.search)
    if (auth) {
      analyticsService.track('cta_open_webamp', { auth, next: next ?? undefined })
      setPostAuthApp(resolvePostAuthApp(next))
      clearAuthDeepLinkFromUrl()
      if (!user) {
        const view = intentToGateView(auth)
        setAuthGateView(view)
        setAuthGateActive(true)
        setGateView(view)
        setGateOpen(true)
        return
      }
      setAuthGateActive(false)
      return
    }

    if (!user && isAuthGateActive()) {
      setGateView(peekAuthGateView())
      setGateOpen(true)
    }
  }, [initializing, user])

  useEffect(() => {
    if (!gateOpen || !user) return
    setAuthGateActive(false)
    setGateOpen(false)
  }, [gateOpen, user])

  useEffect(() => {
    const onRequest = (event: Event) => {
      if (user) return
      const detail = (event as CustomEvent<{ view?: 'login' | 'signup' | 'forgot' }>).detail
      const view = detail?.view ?? peekAuthGateView()
      setGateView(view)
      setGateOpen(true)
    }
    window.addEventListener(AUTH_GATE_EVENT, onRequest)
    return () => window.removeEventListener(AUTH_GATE_EVENT, onRequest)
  }, [user])

  const handleAuthenticated = useCallback(() => {
    setAuthGateActive(false)
    setGateOpen(false)
  }, [])

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--neu-bg)]">
        <div className="neu-flat rounded-2xl px-6 py-4">
          <p className="text-sm font-medium text-[color:var(--neu-text-muted)]">Initialisation...</p>
        </div>
      </div>
    )
  }

  if (gateOpen && !user) {
    return (
      <Suspense fallback={<GateFallback />}>
        <AuthGate initialView={gateView} onAuthenticated={handleAuthenticated} />
      </Suspense>
    )
  }

  return <>{children}</>
}

export function AppWithAuth({ children }: Props) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  )
}
