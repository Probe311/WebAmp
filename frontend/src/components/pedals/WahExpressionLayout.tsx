import { ReactNode, useMemo } from 'react'
import type { PedalModel } from '../../data/pedals'

/**
 * Layout wah : treadle d'expression à gauche (2/3) jusqu'au pied + colonne potards 1/3.
 */
export function WahExpressionLayout({
  model,
  values = {},
  onChange,
  accentColor,
  children,
}: {
  model: PedalModel
  values?: Record<string, number>
  onChange?: (param: string, value: number) => void
  accentColor: string
  children: ReactNode
}) {
  const sweepKey = useMemo(() => {
    if (model.parameters.sweep) return 'sweep'
    const firstKnob = Object.entries(model.parameters).find(
      ([, d]) => !d.controlType || d.controlType === 'knob'
    )
    return firstKnob?.[0] ?? Object.keys(model.parameters)[0]
  }, [model])

  const sweepDef = model.parameters[sweepKey]
  const sweep = values[sweepKey] ?? sweepDef?.default ?? 50
  const tilt =
    ((sweep - (sweepDef?.min ?? 0)) / ((sweepDef?.max ?? 100) - (sweepDef?.min ?? 0))) * 22 - 11

  return (
    <div className="flex flex-row items-stretch gap-2 w-full h-full min-h-0 flex-1 self-stretch py-2">
      {/* Expression 2/3 — marges haut/bas autour du treadle */}
      <div className="basis-2/3 min-w-0 min-h-0 flex flex-col self-stretch py-1">
        <div
          className="relative flex-1 rounded-md border overflow-hidden cursor-ns-resize select-none min-h-[200px]"
          style={{
            borderColor: accentColor,
            background: '#171717',
            transform: `perspective(480px) rotateX(${tilt}deg)`,
            transformOrigin: 'center bottom',
          }}
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (!sweepKey || !onChange) return
            const startY = e.clientY
            const start = sweep
            const min = sweepDef?.min ?? 0
            const max = sweepDef?.max ?? 100
            const move = (ev: MouseEvent) => {
              const next = Math.max(min, Math.min(max, start + (startY - ev.clientY) * 0.45))
              onChange(sweepKey, Math.round(next))
            }
            const up = () => {
              window.removeEventListener('mousemove', move)
              window.removeEventListener('mouseup', up)
            }
            window.addEventListener('mousemove', move)
            window.addEventListener('mouseup', up)
          }}
        >
          <div
            className="absolute inset-0 opacity-90"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, #262626 0 5px, #0a0a0a 5px 10px)',
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1">
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: accentColor }}
            >
              Expression
            </span>
            <span className="text-lg font-semibold tabular-nums" style={{ color: '#fafafa' }}>
              {Math.round(sweep)}
            </span>
          </div>
        </div>
      </div>

      {/* Potards 1/3 */}
      <div className="basis-1/3 min-w-0 flex flex-col items-center justify-start gap-1 py-1">
        {children}
      </div>
    </div>
  )
}
