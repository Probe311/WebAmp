import { LucideIcon } from 'lucide-react'

interface SwitchSelectorProps {
  value: number
  min: number
  max: number
  labels: string[]
  icons?: LucideIcon[]
  color?: string
  onChange: (value: number) => void
  className?: string
}

export function SwitchSelector({ value, min, max, labels, icons, color = '#fff', onChange, className }: SwitchSelectorProps) {
  const numPositions = labels.length
  const range = max - min
  const step = range / (numPositions - 1)
  const currentIndex = Math.round((value - min) / step)
  const clampedIndex = Math.max(0, Math.min(numPositions - 1, currentIndex))

  const handleClick = (e: React.MouseEvent | React.TouchEvent, index: number) => {
    e.stopPropagation()
    onChange(min + index * step)
  }

  return (
    <div className={`flex flex-col pt-1 items-center gap-1 w-full min-w-0 col-span-full shrink-0 ${className || ''}`.trim()}>
      <div
        className="flex flex-row gap-0.5 p-0.5 bg-black/5 dark:bg-white/10 rounded-[var(--td-radius-control)] border"
        style={{ borderColor: color }}
      >
        {labels.map((label, index) => {
          const Icon = icons?.[index]
          const isActive = clampedIndex === index
          return (
            <button
              key={index}
              type="button"
              className={`flex-1 min-w-0 px-2 py-1.5 border-none rounded-[var(--td-radius-control)] cursor-pointer text-xs font-semibold uppercase tracking-[0.3px] transition-colors duration-200 relative flex flex-col items-center justify-center gap-0.5 min-h-8 touch-manipulation ${
                isActive ? 'font-bold' : ''
              }`}
              style={{
                minWidth: '44px',
                minHeight: '44px',
                color: '#1C1C1E',
                backgroundColor: isActive ? color : 'transparent'
              }}
              onClick={(e) => handleClick(e, index)}
              onTouchStart={(e) => {
                e.stopPropagation()
                handleClick(e, index)
              }}
              onMouseDown={(e) => e.stopPropagation()}
              title={label}
            >
              {Icon ? (
                <Icon size={16} strokeWidth={2} />
              ) : (
                <span className="text-[0.5rem] leading-tight text-center break-words">{label}</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
