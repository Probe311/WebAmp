import { useAuth } from '../AuthProvider'

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
        className="text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-60"
        style={{ color: 'rgba(0, 0, 0, 0.7)' }}
      >
        {loading ? 'Déconnexion...' : 'Se déconnecter'}
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={logout}
      className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%)',
        boxShadow: loading
          ? 'inset 2px 2px 4px rgba(0, 0, 0, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.1)'
          : '2px 2px 4px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.1)',
        transform: loading ? 'scale(0.98)' : 'scale(1)'
      }}
      onMouseDown={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = 'scale(0.98)'
          e.currentTarget.style.boxShadow = 'inset 2px 2px 4px rgba(0, 0, 0, 0.3), inset -2px -2px 4px rgba(255, 255, 255, 0.1)'
        }
      }}
      onMouseUp={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.1)'
        }
      }}
      onMouseLeave={(e) => {
        if (!loading) {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.2), -2px -2px 4px rgba(255, 255, 255, 0.1)'
        }
      }}
    >
      {loading ? 'Déconnexion...' : 'Se déconnecter'}
    </button>
  )
}

