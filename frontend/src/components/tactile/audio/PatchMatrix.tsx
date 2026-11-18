import { Network } from 'lucide-react'
import { cx } from '../../ui/cx'
import { PillButton } from '../forms/PillButton'
import { Panel } from '../primitives'

/** Matrice de connexions : `value[entrée][sortie]`. */
export type PatchGrid = boolean[][]

export interface PatchPreset {
  name: string
  build: (inputs: number, outputs: number) => PatchGrid
}

const makeGrid = (inputs: number, outputs: number, connected: (input: number, output: number) => boolean): PatchGrid =>
  Array.from({ length: inputs }, (_, i) => Array.from({ length: outputs }, (_, o) => connected(i, o)))

export const EMPTY_PATCH = (inputs: number, outputs: number): PatchGrid => makeGrid(inputs, outputs, () => false)

export const DEFAULT_PATCH_PRESETS: readonly PatchPreset[] = [
  { name: 'Vider', build: EMPTY_PATCH },
  { name: 'Direct', build: (inputs, outputs) => makeGrid(inputs, outputs, (i, o) => i === o) },
  { name: 'Tout → 1', build: (inputs, outputs) => makeGrid(inputs, outputs, (_, o) => o === 0) },
]

export interface PatchMatrixProps {
  inputs: readonly string[]
  outputs: readonly string[]
  value: PatchGrid
  onChange: (value: PatchGrid) => void
  presets?: readonly PatchPreset[]
  label?: string
  className?: string
}

/** Patchbay N entrées × M sorties : un point de croisement par connexion. */
export function PatchMatrix({
  inputs,
  outputs,
  value,
  onChange,
  presets = DEFAULT_PATCH_PRESETS,
  label = 'PATCHBAY',
  className,
}: PatchMatrixProps) {
  const isOn = (input: number, output: number) => value[input]?.[output] === true
  const connections = inputs.reduce((sum, _, i) => sum + outputs.filter((_, o) => isOn(i, o)).length, 0)

  const toggle = (input: number, output: number) =>
    onChange(makeGrid(inputs.length, outputs.length, (i, o) => (i === input && o === output ? !isOn(i, o) : isOn(i, o))))

  return (
    <Panel depth="flat" className={cx('flex w-fit max-w-full flex-col gap-4 rounded-3xl p-5', className)}>
      <div className="flex items-center justify-between gap-6 border-b border-[color:var(--neu-edge)] pb-3">
        <div className="flex items-center gap-2.5">
          <span className="neu-flat-sm grid h-8 w-8 place-items-center rounded-full text-[color:var(--neu-accent)]">
            <Network className="h-4 w-4" />
          </span>
          <h4 className="text-xs font-bold tracking-tight text-[color:var(--neu-text)]">{label}</h4>
        </div>
        <span className="font-mono text-[10px] font-bold text-[color:var(--neu-text-muted)]">
          {connections} / {inputs.length * outputs.length}
        </span>
      </div>

      <div className="overflow-x-auto p-1">
        <table aria-label={label} className="border-separate border-spacing-1.5">
          <thead>
            <tr>
              <th scope="col" className="text-[9px] font-bold uppercase tracking-wider text-[color:var(--neu-text-faint)]">
                IN \ OUT
              </th>
              {outputs.map((output) => (
                <th key={output} scope="col" className="px-1 text-center text-[10px] font-bold text-[color:var(--neu-text-muted)]">
                  {output}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inputs.map((input, i) => (
              <tr key={input}>
                <th scope="row" className="pr-2 text-left text-[10px] font-bold text-[color:var(--neu-text-muted)]">
                  {input}
                </th>
                {outputs.map((output, o) => {
                  const on = isOn(i, o)
                  return (
                    <td key={output} className="text-center">
                      <button
                        type="button"
                        aria-pressed={on}
                        aria-label={`${input} vers ${output}`}
                        onClick={() => toggle(i, o)}
                        className={cx(
                          'grid h-9 w-9 cursor-pointer place-items-center rounded-full transition-shadow duration-150',
                          on ? 'neu-pressed' : 'neu-flat-sm'
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cx(
                            'h-3 w-3 rounded-full transition-[background-color,box-shadow] duration-150',
                            on
                              ? 'bg-[color:var(--neu-accent)] shadow-[0_0_6px_var(--neu-accent)]'
                              : 'bg-[color:var(--neu-bg-hollow)]'
                          )}
                        />
                      </button>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {presets.map((preset) => (
          <PillButton key={preset.name} size="sm" onClick={() => onChange(preset.build(inputs.length, outputs.length))}>
            {preset.name}
          </PillButton>
        ))}
      </div>
    </Panel>
  )
}
