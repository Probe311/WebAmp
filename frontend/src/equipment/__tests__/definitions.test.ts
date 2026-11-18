import { describe, it, expect } from 'vitest'
import { pedalLibrary } from '../../data/pedals'
import { amplifierLibrary } from '../../data/amplifiers'
import { pedalEquipment, pedalEquipmentList } from '../definitions/pedals'
import { ampEquipment, ampEquipmentList } from '../definitions/amplifiers'
import { validateEquipmentDefinition, type PedalArchetype } from '../types'
import { PEDAL_DIMENSIONS } from '../layouts'
import { PEDAL_RESEARCH, PEDAL_RESEARCH_DOUBTS } from '../specs'

/** Types couverts par les lots L1–L5 (recherche web fiche par fiche). */
const LOT_TYPES = new Set([
  'overdrive',
  'distortion',
  'fuzz',
  'chorus',
  'flanger',
  'phaser',
  'tremolo',
  'vibe',
  'delay',
  'tapedelay',
  'reverb',
  'springreverb',
  'shimmerreverb',
  'eq',
  'wah',
  'volume',
])
const researchedLot = pedalLibrary.filter((p) => LOT_TYPES.has(p.type))

describe('equipment definitions', () => {
  it('couvre tout le catalogue', () => {
    expect(pedalEquipmentList).toHaveLength(pedalLibrary.length)
    expect(pedalEquipmentList.length).toBe(233)
    expect(ampEquipmentList).toHaveLength(amplifierLibrary.length)
    expect(ampEquipmentList.length).toBe(44)
  })

  it('ids uniques et alignés sur le catalogue', () => {
    const ids = new Set(pedalEquipmentList.map((d) => d.id))
    expect(ids.size).toBe(pedalEquipmentList.length)
    for (const model of pedalLibrary) expect(pedalEquipment[model.id]).toBeDefined()
    for (const amp of amplifierLibrary) expect(ampEquipment[amp.id]).toBeDefined()
  })

  it('chaque définition de pédale est valide', () => {
    const invalid = pedalEquipmentList
      .map((d) => ({ id: d.id, result: validateEquipmentDefinition(d) }))
      .filter((x) => !x.result.valid)
    expect(invalid.map((x) => `${x.id}: ${x.result.errors.join(', ')}`)).toEqual([])
  })

  it('chaque définition d’ampli est valide', () => {
    const invalid = ampEquipmentList
      .map((d) => ({ id: d.id, result: validateEquipmentDefinition(d) }))
      .filter((x) => !x.result.valid)
    expect(invalid.map((x) => `${x.id}: ${x.result.errors.join(', ')}`)).toEqual([])
  })

  it('tous les paramètres audio sont mappés sur un contrôle', () => {
    for (const model of pedalLibrary) {
      const def = pedalEquipment[model.id]
      const mapped = new Set([
        ...def.controls.map((c) => c.id),
        ...(def.sliders ?? []).map((s) => s.id),
        ...(def.multiSwitches ?? []).map((m) => m.id),
        ...(def.rotarySelectors ?? []).map((r) => r.id),
      ])
      for (const param of Object.keys(model.parameters)) {
        expect(mapped.has(param), `${model.id} → ${param}`).toBe(true)
      }
      // Interrupteur d'activation présent (footswitch / stomp pad)
      expect(def.switches.some((s) => s.id === 'active')).toBe(true)
    }

    for (const amp of amplifierLibrary) {
      const def = ampEquipment[amp.id]
      const mapped = new Set(def.controls.map((c) => c.id))
      for (const param of Object.keys(amp.parameters)) {
        expect(mapped.has(param), `${amp.id} → ${param}`).toBe(true)
      }
      // Le tone stack audio lit bass/middle/treble/presence/master
      expect(def.switches.some((s) => s.id === 'power')).toBe(true)
    }
  })

  it('marque blanche : aucune marque réelle dans le branding affiché', () => {
    for (const model of pedalLibrary) {
      const branding = pedalEquipment[model.id].branding
      // Marque licenciée (Walrus) : nom constructeur affiché tel quel, quel
      // que soit le modèle — jamais de code généré à la place du nom.
      if (model.brand === 'Walrus Audio') {
        expect(branding.brandName).toBe('Walrus Audio')
        expect(branding.modelName).toBe(model.model)
        continue
      }
      // Gamme maison Webamp Classic : marque affichée, pas de marque tierce.
      if (model.brand === 'Webamp Classic') {
        expect(branding.brandName).toBe('Webamp Classic')
        expect(branding.modelName).toBe(model.model)
        continue
      }
      expect(branding.brandName).toBe('WebAmp Studio')
      expect(branding.modelName.toLowerCase()).not.toContain(model.brand.toLowerCase())
    }
    for (const amp of amplifierLibrary) {
      const branding = ampEquipment[amp.id].branding
      expect(branding.brandName).toBe('WebAmp')
      expect(branding.modelName.toLowerCase()).not.toContain(amp.brand.toLowerCase())
    }
  })

  it('chaque modèle des lots L1–L5 a une fiche dans specs/', () => {
    const missing = researchedLot.filter((p) => !PEDAL_RESEARCH[p.id]).map((p) => p.id)
    expect(missing).toEqual([])
  })

  it('habillage : chrome Walrus réservé aux Fundamental, chrome Webamp à la gamme maison', () => {
    for (const def of pedalEquipmentList) {
      const model = pedalLibrary.find((m) => m.id === def.id)
      const fundamental =
        model?.brand === 'Walrus Audio' && model.model.startsWith('Fundamental')
      const webamp = model?.brand === 'Webamp Classic'
      expect(def.chrome?.kind, def.id).toBe(
        fundamental ? 'walrus-fundamental' : webamp ? 'webamp-classic' : undefined
      )
      const archetypeWidth = PEDAL_DIMENSIONS[def.chassisVariant as PedalArchetype].width
      // −20 % sur la série Walrus Fundamental et sur la gamme Webamp Classic,
      // qui partagent le même boîtier 304 × 460.
      expect(def.dimensions.width, def.id).toBe(
        webamp ? 304 : fundamental ? Math.round(archetypeWidth * 0.8) : archetypeWidth
      )
      if (webamp) expect(def.dimensions.height, def.id).toBe(460)
    }
    for (const amp of ampEquipmentList) expect(amp.chrome).toBeUndefined()
  })

  it('chaque fiche L1–L5 porte une URL constructeur ou une justification explicite', () => {
    const unjustified = researchedLot
      .filter((p) => {
        const research = PEDAL_RESEARCH[p.id]
        if (!research) return true
        if (research.house) return false
        if (research.url) return false
        return research.urlKind !== 'none' || !research.note
      })
      .map((p) => p.id)
    expect(unjustified).toEqual([])
  })

  it('les URLs douteuses sont marquées et documentées', () => {
    const bad = PEDAL_RESEARCH_DOUBTS.filter((d) => {
      const research = PEDAL_RESEARCH[d.id]
      return !research?.url || !d.doubt.trim()
    }).map((d) => d.id)
    expect(bad).toEqual([])
    expect(PEDAL_RESEARCH_DOUBTS.length).toBeGreaterThan(0)
  })

  it('dispositions dans le canevas (0-100 %)', () => {
    for (const def of [...pedalEquipmentList, ...ampEquipmentList]) {
      const positions = [
        ...def.controls.map((c) => c.position),
        ...(def.sliders ?? []).map((s) => s.position),
        ...(def.multiSwitches ?? []).map((m) => m.position),
        ...def.switches.map((s) => s.position),
        ...def.leds.map((l) => l.position),
      ]
      for (const pos of positions) {
        expect(pos.x).toBeGreaterThanOrEqual(0)
        expect(pos.x).toBeLessThanOrEqual(100)
        expect(pos.y).toBeGreaterThanOrEqual(0)
        expect(pos.y).toBeLessThanOrEqual(100)
      }
    }
  })
})
