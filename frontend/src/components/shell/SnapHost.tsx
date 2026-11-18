import { createContext, useContext, useState, ReactNode } from 'react'
import type { SnapZone } from '../../workspace/types'
import { SnapOverlay } from './SnapOverlay'

interface SnapHostValue {
  zone: SnapZone | null
  setZone: (z: SnapZone | null) => void
}

const SnapHostContext = createContext<SnapHostValue | null>(null)

export function SnapHostProvider({ children }: { children: ReactNode }) {
  const [zone, setZone] = useState<SnapZone | null>(null)
  return (
    <SnapHostContext.Provider value={{ zone, setZone }}>
      <div className="relative h-full w-full min-h-0">
        {children}
        <SnapOverlay zone={zone} />
      </div>
    </SnapHostContext.Provider>
  )
}

export function useSnapHost() {
  const ctx = useContext(SnapHostContext)
  if (!ctx) throw new Error('useSnapHost within SnapHostProvider')
  return ctx
}
