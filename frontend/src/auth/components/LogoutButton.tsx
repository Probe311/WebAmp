import { LogOut } from 'lucide-react'
import { useAuth } from '../AuthProvider'
import { CTA } from '../../components/CTA'

interface Props {
  variant?: 'primary' | 'ghost'
}

export function LogoutButton({ variant = 'primary' }: Props) {
  const { logout, loading } = useAuth()

  if (variant === 'ghost') {
    return (
      <button
        type="button"
        disabled={loading}
        onClick={logout}
        className="text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-60 text-red-600 dark:text-red-400 flex items-center gap-2"
      >
        <LogOut size={16} />
        {loading ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    )
  }

  return (
    <CTA
      variant="danger"
      onClick={logout}
      disabled={loading}
      className="w-full"
      icon={<LogOut size={18} />}
    >
      {loading ? 'Déconnexion...' : 'Se déconnecter'}
    </CTA>
  )
}

