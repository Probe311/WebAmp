/**
 * Fond soft type React Bits Aurora (https://reactbits.dev/backgrounds/aurora)
 * CSS only — pas de WebGL par pédale (ponytail). Teinté via accent.
 */
export function PedalAuroraBg({ accent }: { accent: string }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] opacity-[0.55]"
      aria-hidden
    >
      <div
        className="absolute -top-1/4 left-[-20%] right-[-20%] h-[70%] blur-2xl animate-[pedal-aurora_8s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${accent} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-[10%] left-[-10%] w-[70%] h-[50%] blur-3xl animate-[pedal-aurora_11s_ease-in-out_infinite_reverse]"
        style={{
          background: `radial-gradient(ellipse at center, color-mix(in srgb, ${accent} 55%, #fff) 0%, transparent 65%)`,
        }}
      />
      <div
        className="absolute top-[5%] right-[-15%] w-[55%] h-[45%] blur-2xl opacity-70 animate-[pedal-aurora_9s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(ellipse at center, color-mix(in srgb, ${accent} 40%, #93c5fd) 0%, transparent 70%)`,
        }}
      />
      <style>{`
        @keyframes pedal-aurora {
          0%, 100% { transform: translateX(0) translateY(0) scale(1); }
          33% { transform: translateX(4%) translateY(2%) scale(1.04); }
          66% { transform: translateX(-3%) translateY(1%) scale(0.98); }
        }
      `}</style>
    </div>
  )
}
