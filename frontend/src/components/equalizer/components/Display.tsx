interface DisplayProps {
  variant?: 'default' | 'flat'
  bands?: {
    low: number
    mid: number
    high: number
    air: number
  }
}

export function Display({ variant = 'default', bands }: DisplayProps) {
  const containerClasses = variant === 'default'
    ? "w-full h-32 rounded-xl bg-white dark:bg-gray-700 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-3px_-3px_6px_rgba(255,255,255,0.9),0_0_0_1px_rgba(255,255,255,0.8)] dark:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.5),inset_-3px_-3px_6px_rgba(60,60,60,0.5),0_0_0_1px_rgba(60,60,60,0.8)] p-3 relative overflow-hidden group transition-colors duration-200"
    : "w-full h-full rounded-lg bg-transparent border border-gray-300/30 dark:border-gray-600/30 relative overflow-hidden group opacity-80"

  const safeBands = bands || { low: 60, mid: 50, high: 70, air: 80 }

  // Map 0-100 -> 80 (low energy) to 20 (high energy) for better readability
  const mapValueToY = (value: number) => {
    const y = 80 - (value / 100) * 60
    return Math.max(10, Math.min(90, y))
  }

  const points = [
    { x: 0, y: 60 }, // baseline start
    { x: 20, y: mapValueToY(safeBands.low) },
    { x: 60, y: mapValueToY(safeBands.mid) },
    { x: 120, y: mapValueToY(safeBands.high) },
    { x: 180, y: mapValueToY(safeBands.air) },
    { x: 200, y: 55 } // baseline end
  ]

  const toSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return ''
    const d: string[] = [`M ${pts[0].x} ${pts[0].y}`]

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[i + 2] || p2

      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6

      d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`)
    }

    return d.join(' ')
  }

  const linePath = toSmoothPath(points)

  const fillPath = `${linePath} L 200 100 L 0 100 Z`

  return (
    <div className={containerClasses}>
      {/* Grid Background */}
      <div className="absolute inset-0 p-3 opacity-30 pointer-events-none">
        <div className="w-full h-full border border-gray-400/30 dark:border-gray-600/30 grid grid-cols-4 grid-rows-3 gap-0">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="border-r border-b border-gray-400/20 dark:border-gray-600/20 last:border-r-0 last:border-b-0" />
          ))}
        </div>
      </div>
      {/* Frequency Curve */}
      <svg className="w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="none">
        <path
          d={fillPath}
          fill="#A0AEC0"
          className="opacity-15 dark:opacity-10 transition-all duration-200"
        />
        <path
          d={linePath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          className="drop-shadow-md opacity-90 transition-all duration-200"
        />
        <path
          d="M0 55 L200 55"
          fill="none"
          stroke="#718096"
          strokeWidth="1"
          strokeDasharray="4 2"
          className="opacity-40"
        />
      </svg>
      {/* Overlay labels */}
      {variant === 'default' && (
        <>
          <div className="absolute bottom-1 left-2 text-[8px] text-gray-400 dark:text-gray-500 font-mono">20Hz</div>
          <div className="absolute bottom-1 right-2 text-[8px] text-gray-400 dark:text-gray-500 font-mono">20kHz</div>
        </>
      )}
    </div>
  )
}

