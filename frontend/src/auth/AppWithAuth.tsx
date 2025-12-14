import { ReactNode, useState, useEffect, useRef } from 'react'
import { AuthProvider, useAuth } from './AuthProvider'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { AuthView } from './types'
import { BrandSupportModal } from '../components/BrandSupportModal'
import { getPreference } from '../utils/userPreferences'

interface Props {
  children: ReactNode
}

function AppContent({ children }: Props) {
  const { user, initializing } = useAuth()
  const [view, setView] = useState<AuthView>('login')
  const [showBrandModal, setShowBrandModal] = useState(false)
  const previousUserRef = useRef<string | null>(null)

  // Afficher automatiquement la modale à chaque nouvelle connexion (si activé dans les préférences)
  useEffect(() => {
    if (!initializing && user) {
      const currentUserId = user.id
      const previousUserId = previousUserRef.current
      
      // Si l'utilisateur vient de se connecter (changement de null vers un ID)
      if (previousUserId === null && currentUserId) {
        // Vérifier la préférence utilisateur
        const shouldShowMessage = getPreference('showThankYouMessage')
        if (shouldShowMessage) {
          // Petit délai pour que l'interface se stabilise après le login
          setTimeout(() => {
            setShowBrandModal(true)
          }, 500)
        }
      }
      
      // Mettre à jour la référence
      previousUserRef.current = currentUserId
    } else if (!user) {
      // Réinitialiser l'état de la modale et la référence quand l'utilisateur se déconnecte
      setShowBrandModal(false)
      previousUserRef.current = null
    }
  }, [user, initializing])

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f5f5f5' }}>
        <div 
          className="rounded-xl px-6 py-4"
          style={{
            backgroundColor: '#ffffff',
            boxShadow: '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
          }}
        >
          <p className="text-sm font-medium" style={{ color: 'rgba(0, 0, 0, 0.7)' }}>
            Initialisation...
          </p>
        </div>
      </div>
    )
  }

  // Si pas connecté, afficher la page de login/signup/forgot
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#f5f5f5' }}>
        {view === 'login' && <LoginPage onSwitchView={setView} />}
        {view === 'signup' && <SignupPage onSwitchView={setView} />}
        {view === 'forgot' && <ForgotPasswordPage onSwitchView={setView} />}
      </div>
    )
  }

  // Si connecté, afficher l'app principale avec la modale si nécessaire
  return (
    <>
      <BrandSupportModal 
        isOpen={showBrandModal} 
        onClose={() => setShowBrandModal(false)} 
      />
      {children}
    </>
  )
}

export function AppWithAuth({ children }: Props) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  )
}

