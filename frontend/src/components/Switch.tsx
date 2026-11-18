import { SquishSwitch } from './motion'

interface SwitchProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

/** API historique — rendu SquishSwitch (React Bits–inspired). */
export function Switch({ label, checked, onChange }: SwitchProps) {
  return <SquishSwitch label={label} checked={checked} onChange={onChange} />
}
