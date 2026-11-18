import { AccountPanel } from '../auth/components/AccountPanel'
import { AppPageShell } from '../components/shell/AppPageShell'

export function AccountPage() {
  return (
    <AppPageShell description="Profil, abonnement, préférences">
      <AccountPanel />
    </AppPageShell>
  )
}
