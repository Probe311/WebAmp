/** Décor musical SVG — ambiance gate, zéro asset externe. */
export function AuthMusicScene() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Vagues / fréquences */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.55]"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="waveA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--neu-accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--neu-accent)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="waveB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path
          fill="url(#waveA)"
          d="M0 420 C180 360 280 500 460 440 C640 380 720 300 900 360 C1040 410 1120 390 1200 350 L1200 800 L0 800 Z"
        />
        <path
          fill="url(#waveB)"
          d="M0 520 C200 480 320 580 500 540 C700 490 820 430 1000 490 C1100 525 1160 510 1200 490 L1200 800 L0 800 Z"
        />
      </svg>

      {/* Vinyle */}
      <div
        className="neu-flat absolute left-[8%] top-[18%] hidden h-56 w-56 rounded-full sm:block lg:left-[12%] lg:h-72 lg:w-72"
        style={{ background: 'var(--neu-bg)' }}
      >
        <div className="absolute inset-[14%] rounded-full neu-inset" />
        <div
          className="absolute inset-[38%] rounded-full"
          style={{
            background: 'linear-gradient(145deg, #e0590e, var(--neu-accent))',
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.2)',
          }}
        />
        <div className="absolute inset-[46%] rounded-full bg-[color:var(--neu-bg)]" />
      </div>

      {/* Pédale / amp bloc */}
      <div className="neu-flat absolute bottom-[16%] left-[28%] hidden h-28 w-40 rounded-[1.25rem] sm:block lg:left-[34%]">
        <div className="absolute left-4 top-4 h-3 w-3 rounded-full bg-[color:var(--neu-accent)] opacity-80" />
        <div className="absolute right-5 top-5 h-8 w-8 rounded-full neu-convex" />
        <div className="absolute bottom-4 left-4 right-4 h-2 rounded-full neu-inset" />
      </div>

      {/* Notes */}
      <svg className="absolute right-[42%] top-[22%] h-24 w-24 opacity-40" viewBox="0 0 64 64" fill="none">
        <path
          d="M40 8v32.5a8 8 0 1 1-4-6.9V18l16-4v25.5a8 8 0 1 1-4-6.9V8h-8z"
          fill="var(--neu-accent)"
          fillOpacity="0.55"
        />
      </svg>
      <svg className="absolute bottom-[28%] left-[18%] h-16 w-16 opacity-30" viewBox="0 0 64 64" fill="none">
        <path
          d="M36 10v30a7 7 0 1 1-3.5-6V18L48 14v24a7 7 0 1 1-3.5-6V10H36z"
          fill="currentColor"
          className="text-[color:var(--neu-text-muted)]"
        />
      </svg>
    </div>
  )
}
