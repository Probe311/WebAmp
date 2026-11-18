import { SettingsPanel } from '../components/SettingsPanel'
import { AppPageShell } from '../components/shell/AppPageShell'

export function SettingsPage() {
  return (
    <AppPageShell description="Thème, audio, raccourcis">
      <SettingsPanel />
    </AppPageShell>
  )
}
