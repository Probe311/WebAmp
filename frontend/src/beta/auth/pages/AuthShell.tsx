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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-6 py-4 shadow">
          <p className="text-sm text-gray-700 dark:text-gray-200">Initialisation de Supabase Auth...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
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

