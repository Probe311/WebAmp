interface MeterProps {
  value: number // 0-100
}

export function Meter({ value }: MeterProps) {
  const segments = 20

  return (
    <div className="w-4 h-full bg-white dark:bg-gray-700 rounded-full shadow-[inset_1px_1px_3px_rgba(0,0,0,0.1),inset_-1px_-1px_3px_rgba(255,255,255,0.9),0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5),inset_-1px_-1px_3px_rgba(60,60,60,0.5),0_0_0_1px_rgba(60,60,60,0.8)] p-[2px] flex flex-col-reverse gap-[1px] transition-colors duration-200">
      {[...Array(segments)].map((_, i) => {
        const threshold = (i / segments) * 100
        const isActive = value > threshold

        // Color logic
        let colorClass = 'bg-green-400'
        if (i > segments * 0.7) colorClass = 'bg-yellow-400'
        if (i > segments * 0.9) colorClass = 'bg-red-500'

        return (
          <div
            key={i}
            className={`w-full flex-1 rounded-[1px] transition-colors duration-75 ${isActive ? colorClass : 'bg-gray-300/30 dark:bg-gray-600/30'}`}
            style={{ opacity: isActive ? 1 : 0.3 }}
          />
        )
      })}
    </div>
  )
}

