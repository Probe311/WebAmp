/**
 * Composant pour l'authentification (connexion/inscription)
 */
import { useState } from 'react'
import { LogIn, UserPlus } from 'lucide-react'
import { Modal } from './Modal'
import { CTA } from './CTA'
import { useToast } from './notifications/ToastProvider'
import { useAuth } from '../beta/auth/AuthProvider'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, signUp, loading } = useAuth()
  const { showToast } = useToast()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      showToast({
        variant: 'error',
        title: 'Champs requis',
        message: 'Veuillez remplir tous les champs'
      })
      return
    }

    try {
      if (mode === 'login') {
        await login(email, password)
        // Le toast est géré dans AuthProvider
      } else {
        await signUp(email, password)
        // Le toast est géré dans AuthProvider
      }
      onClose()
      setEmail('')
      setPassword('')
    } catch (error) {
      // L'erreur est déjà gérée dans AuthProvider avec un toast
      console.error('Erreur auth:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Connexion' : 'Inscription'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20"
            placeholder="votre@email.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black/70 dark:text-white/70 mb-2">
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-black/20 dark:border-white/20"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        <div className="flex gap-2">
          <CTA
            variant="primary"
            icon={mode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'S\'inscrire'}
          </CTA>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
          >
            {mode === 'login' ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

