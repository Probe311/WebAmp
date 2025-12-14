import { ReactNode } from 'react'

interface BlockProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export function Block({ children, className = '', onClick }: BlockProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-2xl p-6
        shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(255,255,255,0.8)]
        dark:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(60,60,60,0.5),inset_0_0_0_1px_rgba(60,60,60,0.8)]
        ${className}
      `.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </div>
  )
}

