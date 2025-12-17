import { AccountPanel } from '../auth/components/AccountPanel'
import { Block } from '../components/Block'

export function AccountPage() {
  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black/85 dark:text-white/90 mb-6">
          Compte
        </h1>
        <Block>
          <AccountPanel />
        </Block>
      </div>
    </div>
  )
}

