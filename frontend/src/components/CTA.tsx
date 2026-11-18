import React, { ReactNode, ButtonHTMLAttributes, isValidElement, MouseEvent } from 'react'
import { ClickSpark } from './motion'
import { PillButton, type PillButtonVariant } from './tactile/forms/PillButton'
import { cx } from './ui/cx'

type IconType = React.ComponentType<{ size?: number; className?: string }>

interface CTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  icon?: ReactNode | IconType
  variant?: 'primary' | 'icon-only' | 'secondary' | 'danger' | 'important' | 'ai-tone' | 'ai-beat'
  active?: boolean
  iconSize?: number
  /** Désactive les étincelles au clic */
  noSpark?: boolean
}

/** Couleurs d'étincelle : canvas n'accepte pas `var()`, d'où ces constantes. */
const SPARK_ENERGY = '#f28a36'
const SPARK_SECONDARY = '#e34f9b'

function mapVariant(variant: CTAProps['variant'], active: boolean): PillButtonVariant {
  if (variant === 'danger') return 'danger'
  if (variant === 'important' || variant === 'primary') return 'primary'
  if (variant === 'ai-tone' || variant === 'ai-beat') return 'primary'
  if (active) return 'pressed'
  if (variant === 'secondary' || variant === 'icon-only') return 'neutral'
  return 'primary'
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
  noSpark = false,
  ...rest
}: CTAProps) {
  const isIconOnly = variant === 'icon-only'
  const pillVariant = mapVariant(variant, active)
  const renderedIcon = renderIcon(icon, iconSize)

  const button = (
    <PillButton
      type={type}
      title={title}
      variant={pillVariant}
      size={isIconOnly ? 'md' : 'md'}
      iconLeft={!isIconOnly || renderedIcon ? renderedIcon : undefined}
      onClick={onClick as ((e: MouseEvent<HTMLButtonElement>) => void) | undefined}
      className={cx(
        isIconOnly && 'h-11 w-11 min-h-11 min-w-11 px-0 py-0',
        // important sans label = tuile icône carrée arrondie (pas capsule)
        !isIconOnly && children == null && 'h-11 w-11 min-h-11 min-w-11 px-0 py-0',
        (variant === 'ai-tone' || variant === 'ai-beat') &&
          'border border-[color:var(--neu-accent)] [background-image:linear-gradient(135deg,#f28a36,#e34f9b)]',
        className
      )}
      {...rest}
    >
      {!isIconOnly ? children : isIconOnly && !renderedIcon ? children : null}
    </PillButton>
  )

  if (noSpark || variant === 'danger') return button

  const stretch = /\bflex-1\b|\bw-full\b/.test(className)
  const sparkColor =
    variant === 'ai-tone' || variant === 'ai-beat' ? SPARK_SECONDARY : SPARK_ENERGY

  return (
    <ClickSpark color={sparkColor} className={stretch ? 'block w-full' : 'inline-block'}>
      {button}
    </ClickSpark>
  )
}

function renderIcon(icon: ReactNode | IconType, size: number): ReactNode {
  if (!icon) return null
  if (isValidElement(icon)) return icon
  if (typeof icon === 'function') {
    return React.createElement(icon as IconType, { size })
  }
  if (icon && typeof icon === 'object') {
    try {
      const IconComponent = icon as { render?: unknown; $$typeof?: unknown }
      if ('render' in IconComponent || '$$typeof' in IconComponent) {
        return React.createElement(IconComponent as IconType, { size })
      }
    } catch {
      // ignore
    }
  }
  return icon as ReactNode
}
