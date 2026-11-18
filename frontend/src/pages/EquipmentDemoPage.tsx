import { useMemo, useState } from 'react'
import { ampEquipmentList, availablePedalEquipmentList, pedalEquipmentList } from '../equipment'
import type { EquipmentDefinition } from '../equipment/types'
import { EquipmentShell } from '../equipment/EquipmentShell'

/**
 * Page démo du design system matériel : les pédales et 44 amplis en
 * marque blanche, rendus par le même shell.
 * Accès : /#equipment-demo
 */
export function EquipmentDemoPage() {
  const [tab, setTab] = useState<'pedals' | 'amplifiers'>('pedals')
  const [values, setValues] = useState<Record<string, Record<string, number>>>({})
  const [multi, setMulti] = useState<Record<string, Record<string, string>>>({})
  const [switches, setSwitches] = useState<Record<string, Record<string, boolean>>>({})

  const list = tab === 'pedals' ? availablePedalEquipmentList : ampEquipmentList

  const defaultSwitches = useMemo(() => {
    const map: Record<string, Record<string, boolean>> = {}
    for (const def of [...pedalEquipmentList, ...ampEquipmentList]) {
      map[def.id] = Object.fromEntries(def.switches.map((s) => [s.id, s.defaultValue]))
    }
    return map
  }, [])

  const defaultMulti = useMemo(() => {
    const map: Record<string, Record<string, string>> = {}
    for (const def of pedalEquipmentList) {
      map[def.id] = Object.fromEntries((def.multiSwitches ?? []).map((m) => [m.id, m.defaultValue]))
    }
    return map
  }, [])

  const card = (def: EquipmentDefinition) => {
    const width = def.type === 'pedal' ? 230 : 620
    return (
      // Largeur fixée : sans cela la carte (w-fit) se dimensionne sur son titre
      // et chaque pédale rendue change de taille d'une fiche à l'autre.
      <div
        key={def.id}
        style={{ width: width + 32 }}
        className="flex flex-col items-center gap-2 rounded-3xl bg-white/60 p-4 shadow-sm"
      >
        <div className="text-center">
          <div className="text-[11px] font-bold uppercase tracking-widest text-[#F26A1B]">{def.branding.modelName}</div>
        </div>
        <EquipmentShell
          definition={def}
          values={values[def.id] ?? {}}
          multiValues={multi[def.id] ?? defaultMulti[def.id] ?? {}}
          switchStates={{ ...defaultSwitches[def.id], ...switches[def.id] }}
          onControlChange={(id, value) =>
            setValues((prev) => ({ ...prev, [def.id]: { ...prev[def.id], [id]: value } }))
          }
          onMultiSwitchChange={(id, value) =>
            setMulti((prev) => ({ ...prev, [def.id]: { ...prev[def.id], [id]: value } }))
          }
          onSwitchChange={(id, checked) =>
            setSwitches((prev) => ({ ...prev, [def.id]: { ...prev[def.id], [id]: checked } }))
          }
          maxWidth={width}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-200 p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-black uppercase tracking-widest text-neutral-800">WebAmp Studio — équipement</h1>
          <p className="text-xs text-neutral-600">
            {availablePedalEquipmentList.length} pédales validées sur {pedalEquipmentList.length} ·{' '}
            {ampEquipmentList.length} amplis · marque blanche data-driven
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTab('pedals')}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
              tab === 'pedals' ? 'bg-[#F26A1B] text-white' : 'bg-white text-neutral-600'
            }`}
          >
            Pédales ({availablePedalEquipmentList.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('amplifiers')}
            className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${
              tab === 'amplifiers' ? 'bg-[#F26A1B] text-white' : 'bg-white text-neutral-600'
            }`}
          >
            Amplis ({ampEquipmentList.length})
          </button>
        </div>
      </header>

      <div className="flex flex-wrap items-start gap-6">
        {list.map(card)}
      </div>
    </div>
  )
}
