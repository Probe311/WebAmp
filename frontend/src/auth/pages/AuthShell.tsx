import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from '../AuthProvider'
import { AuthView } from '../types'
import { LoginPage } from './LoginPage'
import { SignupPage } from './SignupPage'
import { ForgotPasswordPage } from './ForgotPasswordPage'
import { AccountPage } from './AccountPage'

function AuthContent() {
  const { user, initializing } = useAuth()
  const [view, setView] = useState<AuthView>('login')

  useEffect(() => {
    if (user) {
      setView('account')
    }
  }, [user])

  if (initializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[color:var(--neu-bg)]">
        <div className="neu-flat rounded-2xl px-6 py-4">
          <p className="text-sm text-[color:var(--neu-text-muted)]">Initialisation de Supabase Auth...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--neu-bg)] p-6">
      {view === 'login' && <LoginPage onSwitchView={setView} />}
      {view === 'signup' && <SignupPage onSwitchView={setView} />}
      {view === 'forgot' && <ForgotPasswordPage onSwitchView={setView} />}
      {view === 'account' && <AccountPage onSwitchView={setView} />}
    </div>
  )
}

export function AuthShell() {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  )
}
