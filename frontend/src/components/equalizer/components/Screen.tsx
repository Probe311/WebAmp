import { Power } from 'lucide-react'

interface ScreenProps {
  title: string
  type?: 'dynamics' | 'eq' | 'static'
}

export function Screen({ title, type = 'static' }: ScreenProps) {
  return (
    <div className="h-20 rounded-xl bg-gray-900 dark:bg-gray-950 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.1)] relative overflow-hidden flex flex-col items-center justify-center p-3 group">
      {/* Main Content */}
      <div className="flex flex-col items-center gap-1 z-10">
        <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 group-hover:text-blue-400 group-hover:border-blue-400/50 transition-colors duration-500">
          {type === 'eq' ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          ) : type === 'dynamics' ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ) : (
            <Power size={16} />
          )}
        </div>
        <span className="text-[10px] font-bold text-gray-300 tracking-[0.2em]">{title}</span>
      </div>
      {/* Visual Background */}
      {type === 'dynamics' && (
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 100 60">
          <path d="M0 60 L40 60 Q 60 60 70 30 L 100 10" fill="none" stroke="#fff" strokeWidth="1" />
        </svg>
      )}
      {type === 'static' && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />
      )}
    </div>
  )
}

