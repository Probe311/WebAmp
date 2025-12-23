import React, { ReactNode, ButtonHTMLAttributes, isValidElement } from 'react'

type IconType = React.ComponentType<{ size?: number; className?: string }>

interface CTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  icon?: ReactNode | IconType
  variant?: 'primary' | 'icon-only' | 'secondary' | 'danger' | 'important' | 'ai-tone' | 'ai-beat'
  active?: boolean
  iconSize?: number
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
  iconSize = 16,
  ...rest
}: CTAProps) {
  const isIconOnly = variant === 'icon-only'
  
  const isColoredVariant = variant === 'danger' || variant === 'important' || variant === 'ai-tone' || variant === 'ai-beat'
  
  const baseClasses = `
    flex items-center justify-center gap-2 px-4 py-2 rounded-lg
    ${!isColoredVariant ? 'bg-white dark:bg-gray-700 text-black/90 dark:text-white/90' : ''}
    font-semibold text-sm
    cursor-pointer transition-all duration-200 select-none touch-manipulation
    ${!isColoredVariant ? `
      shadow-[2px_2px_4px_rgba(0,0,0,0.08),-2px_-2px_4px_rgba(255,255,255,0.9)]
      dark:shadow-[2px_2px_4px_rgba(0,0,0,0.5),-2px_-2px_4px_rgba(60,60,60,0.5)]
      hover:shadow-[3px_3px_6px_rgba(0,0,0,0.12),-3px_-3px_6px_rgba(255,255,255,1)]
      dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.6),-3px_-3px_6px_rgba(70,70,70,0.6)]
    ` : `
      shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)]
      dark:shadow-[2px_2px_4px_rgba(0,0,0,0.6),-2px_-2px_4px_rgba(60,60,60,0.3)]
      hover:shadow-[3px_3px_6px_rgba(0,0,0,0.25),-3px_-3px_6px_rgba(255,255,255,0.15)]
      dark:hover:shadow-[3px_3px_6px_rgba(0,0,0,0.7),-3px_-3px_6px_rgba(70,70,70,0.4)]
    `}
    hover:-translate-y-0.5 active:scale-95
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20 focus-visible:ring-offset-2
  `.trim()
  
  const iconOnlyClasses = isIconOnly ? 'p-2 min-w-[44px] min-h-[44px]' : ''
  
  const activeClasses = active && !isColoredVariant ? `
    bg-black/8 dark:bg-white/10 border-2 border-black/30 dark:border-white/30 font-bold
    shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.5)]
    dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5),inset_-2px_-2px_4px_rgba(60,60,60,0.5)]
    hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.12),inset_-2px_-2px_4px_rgba(255,255,255,0.6)]
    dark:hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(70,70,70,0.6)]
  `.trim() : !isColoredVariant ? 'border-2 border-black/15 dark:border-white/15' : ''
  
  // Classes pour les variantes de couleur
  const variantClasses = variant === 'secondary' 
    ? 'bg-[#f5f5f5] dark:bg-gray-600 border-2 border-black/15 dark:border-white/15' 
    : variant === 'danger'
    ? 'bg-red-500 dark:bg-red-600 text-white border-2 border-red-600 dark:border-red-700 hover:bg-red-600 dark:hover:bg-red-700'
    : variant === 'important'
    ? 'bg-orange-500 dark:bg-orange-600 text-white border-2 border-orange-600 dark:border-orange-700 hover:bg-orange-600 dark:hover:bg-orange-700'
    : variant === 'ai-tone' || variant === 'ai-beat'
    ? 'bg-gradient-to-r from-[#d23cfb] to-[#fb923c] text-white border-2 border-[#d23cfb]/50 hover:from-[#c02ae8] hover:to-[#f07a2a] hover:border-[#c02ae8]/50'
    : ''
  
  const combinedClasses = `${baseClasses} ${iconOnlyClasses} ${activeClasses} ${variantClasses} ${className}`.trim().replace(/\s+/g, ' ')

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
          {renderIcon(icon, iconSize)}
        </span>
      )}
      {!isIconOnly && children && (
        <span>{children}</span>
      )}
    </button>
  )
}

function renderIcon(icon: ReactNode | IconType, size: number): ReactNode {
  if (!icon) return null
  
  // Si c'est déjà un élément React valide, le retourner tel quel
  if (isValidElement(icon)) {
    return icon
  }
  
  // Si c'est un composant React (fonction)
  // Les composants lucide-react sont des fonctions qui retournent des éléments React
  if (typeof icon === 'function') {
    const IconComponent = icon as IconType
    // Créer l'élément React avec le composant
    return React.createElement(IconComponent, { size })
  }
  
  // Si c'est un objet (peut-être un composant forwardRef ou memo)
  if (icon && typeof icon === 'object') {
    // Essayer de l'utiliser comme composant
    try {
      const IconComponent = icon as any
      if ('render' in IconComponent || '$$typeof' in IconComponent) {
        return React.createElement(IconComponent, { size })
      }
    } catch (error) {
      // Ignorer l'erreur et continuer
    }
  }
  
  // Sinon, retourner tel quel (string, number, etc.)
  return icon as ReactNode
}

