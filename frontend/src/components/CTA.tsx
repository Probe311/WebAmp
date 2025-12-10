import { ReactNode, ButtonHTMLAttributes } from 'react'

interface CTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  icon?: ReactNode
  variant?: 'primary' | 'icon-only' | 'secondary'
  active?: boolean
}

export function CTA({ 
  children, 
  icon, 
  onClick, 
  title, 
  variant = 'primary',
  active = false,
  className = '',
  type = 'button',
  ...rest
}: CTAProps) {
  const isIconOnly = variant === 'icon-only'
  
  const baseClasses = `
    flex items-center justify-center gap-2 px-4 py-2 rounded-lg
    bg-white dark:bg-gray-700 text-black/90 dark:text-white/90 font-semibold text-sm
    cursor-pointer transition-all duration-200 select-none touch-manipulation
    shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)]
    dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)]
    hover:shadow-[3px_3px_6px_rgba(0,0,0,0.12),-3px_-3px_6px_rgba(255,255,255,1)]
    dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(70,70,70,0.6)]
    hover:-translate-y-0.5 active:scale-95
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20 focus-visible:ring-offset-2
  `.trim()
  
  const iconOnlyClasses = isIconOnly ? 'p-2 min-w-[44px] min-h-[44px]' : ''
  
  const activeClasses = active ? `
    bg-black/8 dark:bg-white/10 border-2 border-black/30 dark:border-white/30 font-bold
    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
    dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]
    hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.12),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]
    dark:hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(70,70,70,0.6)]
  `.trim() : 'border-2 border-black/15 dark:border-white/15'
  
  const secondaryClasses = variant === 'secondary' ? 'bg-[#f5f5f5] dark:bg-gray-600' : ''
  
  const combinedClasses = `${baseClasses} ${iconOnlyClasses} ${activeClasses} ${secondaryClasses} ${className}`.trim().replace(/\s+/g, ' ')

  return (
    <button
      type={type}
      onClick={onClick}
      title={title}
      className={combinedClasses}
      {...rest}
    >
      {icon && (
        <span className={isIconOnly ? '' : 'flex-shrink-0'}>
          {icon}
        </span>
      )}
      {!isIconOnly && children && (
        <span>{children}</span>
      )}
    </button>
  )
}

