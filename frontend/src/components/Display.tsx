import React from 'react'

const Display: React.FC = () => {
  const surfaceShadow =
    '8px 8px 16px rgba(0, 0, 0, 0.1), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.8)'
  const gridStroke = 'rgba(0, 0, 0, 0.12)'
  const gridMinorStroke = 'rgba(0, 0, 0, 0.08)'
  const accentStroke = '#ef4444'
  const secondaryStroke = 'rgba(0, 0, 0, 0.6)'
  const fillTone = 'rgba(0, 0, 0, 0.18)'

  const darkSurfaceShadow = '8px 8px 16px rgba(0, 0, 0, 0.5), -8px -8px 16px rgba(40, 40, 40, 0.5), inset 0 0 0 1px rgba(60, 60, 60, 0.8)'
  const darkGridStroke = 'rgba(255, 255, 255, 0.12)'
  const darkGridMinorStroke = 'rgba(255, 255, 255, 0.08)'
  const darkSecondaryStroke = 'rgba(255, 255, 255, 0.6)'
  const darkFillTone = 'rgba(255, 255, 255, 0.18)'
  
  const isDark = document.documentElement.classList.contains('dark')
  
  return (
    <div
      className="relative w-full h-32 rounded-2xl bg-white dark:bg-gray-800 p-3 overflow-hidden transition-colors duration-200"
      style={{ boxShadow: isDark ? darkSurfaceShadow : surfaceShadow }}
    >
      <div className="absolute inset-0 p-3 pointer-events-none" style={{ opacity: 0.35 }}>
        <div
          className="grid h-full w-full grid-cols-4 grid-rows-3 gap-0 border"
          style={{ borderColor: isDark ? darkGridStroke : gridStroke }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="border-b border-r last:border-b-0 last:border-r-0"
              style={{ borderColor: isDark ? darkGridMinorStroke : gridMinorStroke }}
            />
          ))}
        </div>
      </div>

      <svg className="h-full w-full" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0 100 L0 60 C 20 60, 40 50, 60 70 C 80 90, 100 40, 120 50 C 140 60, 160 30, 180 35 L 200 40 L 200 100 Z"
          fill={isDark ? darkFillTone : fillTone}
          className="opacity-25"
        />
        <path
          d="M0 60 C 20 60, 40 50, 60 70 C 80 90, 100 40, 120 50 C 140 60, 160 30, 180 35 L 200 40"
          fill="none"
          stroke={accentStroke}
          strokeWidth="1.5"
          className="drop-shadow-md opacity-80"
        />
        <path
          d="M0 55 C 30 55, 50 65, 70 60 C 90 55, 110 50, 140 55 L 200 50"
          fill="none"
          stroke={isDark ? darkSecondaryStroke : secondaryStroke}
          strokeWidth="1"
          strokeDasharray="4 2"
          className="opacity-60"
        />
      </svg>

      <div className="absolute bottom-1 left-2 font-mono text-[10px] text-black/50 dark:text-white/50">
        20Hz
      </div>
      <div className="absolute bottom-1 right-2 font-mono text-[10px] text-black/50 dark:text-white/50">
        20kHz
      </div>
    </div>
  )
}

export default Display