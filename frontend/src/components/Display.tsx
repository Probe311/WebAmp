import React from 'react'

/**
 * Écran d'oscilloscope décoratif.
 *
 * Tout est piloté par les tokens de graphique : plus de branches
 * `classList.contains('dark')` ni de doubles jeux de couleurs.
 */
const Display: React.FC = () => {
  return (
    <div
      className="relative h-32 w-full overflow-hidden rounded-[var(--td-radius-xl)] border border-[var(--td-edge-panel)] bg-[var(--td-surface-elevated)] p-3 transition-colors duration-[var(--td-duration-base)] [box-shadow:var(--td-elevation-2)]"
    >
      <div className="pointer-events-none absolute inset-0 p-3" style={{ opacity: 0.35 }}>
        <div
          className="grid h-full w-full grid-cols-4 grid-rows-3 border"
          style={{ borderColor: 'var(--td-chart-grid)' }}
        >
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="border-b border-r last:border-b-0 last:border-r-0"
              style={{ borderColor: 'var(--td-chart-grid-minor)' }}
            />
          ))}
        </div>
      </div>

      <svg className="h-full w-full" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden>
        <path
          d="M0 100 L0 60 C 20 60, 40 50, 60 70 C 80 90, 100 40, 120 50 C 140 60, 160 30, 180 35 L 200 40 L 200 100 Z"
          fill="var(--td-primary)"
          className="opacity-25"
        />
        <path
          d="M0 60 C 20 60, 40 50, 60 70 C 80 90, 100 40, 120 50 C 140 60, 160 30, 180 35 L 200 40"
          fill="none"
          stroke="var(--td-primary)"
          strokeWidth="1.5"
          className="opacity-80"
        />
        <path
          d="M0 55 C 30 55, 50 65, 70 60 C 90 55, 110 50, 140 55 L 200 50"
          fill="none"
          stroke="var(--td-text-secondary)"
          strokeWidth="1"
          strokeDasharray="4 2"
          className="opacity-60"
        />
      </svg>

      <div className="absolute bottom-1 left-2 font-mono text-[10px] text-[var(--td-text-muted)]">20Hz</div>
      <div className="absolute bottom-1 right-2 font-mono text-[10px] text-[var(--td-text-muted)]">20kHz</div>
    </div>
  )
}

export default Display
