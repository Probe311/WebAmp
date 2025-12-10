import React from 'react'

interface PanelProps {
  children: React.ReactNode
  icon?: React.ReactNode
  title?: string
}

const Panel: React.FC<PanelProps> = ({ children, icon }) => {
  return (
    <div
      style={{
        borderRadius: '1rem', // 16px - correspond à rounded-2xl
        boxShadow: document.documentElement.classList.contains('dark')
          ? '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(40, 40, 40, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)'
          : '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
      }}
    >
      {icon && <div className="text-black/50 dark:text-white/50 mb-2">{icon}</div>}
      {children}
    </div>
  )
}

export default Panel

