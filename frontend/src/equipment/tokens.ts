/**
 * Tokens du design system matériel WebAmp.
 * Couleurs, finitions, matériaux et textures des châssis.
 */
import type {
  EnclosureTexture,
  EquipmentColorId,
  EquipmentFinish,
  EquipmentMaterial,
  EquipmentSurfaceConfig,
  MeshPattern,
} from './types'

export interface EquipmentColorToken {
  id: EquipmentColorId
  label: string
  category: 'classic' | 'vintage' | 'modern'
  hex: string
  highlight: string
  shadow: string
  contrastText: string
}

export const EQUIPMENT_COLORS: Record<EquipmentColorId, EquipmentColorToken> = {
  black: { id: 'black', label: 'Black', category: 'classic', hex: '#141518', highlight: '#2e3138', shadow: '#070709', contrastText: '#f8fafc' },
  white: { id: 'white', label: 'White', category: 'classic', hex: '#f4f5f7', highlight: '#ffffff', shadow: '#cbd5e1', contrastText: '#0f172a' },
  'cream-ivory': { id: 'cream-ivory', label: 'Cream / Ivory', category: 'classic', hex: '#f3ead3', highlight: '#fffdf7', shadow: '#cbbba0', contrastText: '#1c1917' },
  silver: { id: 'silver', label: 'Silver', category: 'classic', hex: '#cbd5e1', highlight: '#f1f5f9', shadow: '#94a3b8', contrastText: '#0f172a' },
  chrome: { id: 'chrome', label: 'Chrome', category: 'classic', hex: '#e2e8f0', highlight: '#ffffff', shadow: '#64748b', contrastText: '#0f172a' },
  gold: { id: 'gold', label: 'Gold', category: 'classic', hex: '#d4af5a', highlight: '#f7df94', shadow: '#9c7521', contrastText: '#1c1917' },
  grey: { id: 'grey', label: 'Grey', category: 'classic', hex: '#71717a', highlight: '#a1a1aa', shadow: '#3f3f46', contrastText: '#f8fafc' },
  anthracite: { id: 'anthracite', label: 'Anthracite', category: 'classic', hex: '#27272a', highlight: '#3f3f46', shadow: '#111113', contrastText: '#f8fafc' },

  'british-racing-green': { id: 'british-racing-green', label: 'British Racing Green', category: 'vintage', hex: '#123c2a', highlight: '#1f5c41', shadow: '#081f15', contrastText: '#f0fdf4' },
  burgundy: { id: 'burgundy', label: 'Burgundy', category: 'vintage', hex: '#631d2b', highlight: '#8a2b3e', shadow: '#3b0e17', contrastText: '#fff1f2' },
  'wine-red': { id: 'wine-red', label: 'Wine Red', category: 'vintage', hex: '#7f1d2e', highlight: '#a6263d', shadow: '#4c0f1a', contrastText: '#fff1f2' },
  'mustard-yellow': { id: 'mustard-yellow', label: 'Mustard Yellow', category: 'vintage', hex: '#dfa41b', highlight: '#fde068', shadow: '#9a6b0a', contrastText: '#1c1917' },
  'vintage-orange': { id: 'vintage-orange', label: 'Vintage Tangerine', category: 'vintage', hex: '#dd6b20', highlight: '#f6ad55', shadow: '#9c4221', contrastText: '#ffffff' },
  'seafoam-green': { id: 'seafoam-green', label: 'Seafoam Green', category: 'vintage', hex: '#7bdcb5', highlight: '#b8f3da', shadow: '#449e7b', contrastText: '#064e3b' },
  turquoise: { id: 'turquoise', label: 'Turquoise', category: 'vintage', hex: '#14b8a6', highlight: '#5eead4', shadow: '#0f766e', contrastText: '#042f2e' },
  'baby-blue': { id: 'baby-blue', label: 'Baby Blue', category: 'vintage', hex: '#8ecae6', highlight: '#c4e7f7', shadow: '#4a90b0', contrastText: '#0c4a6e' },
  'vintage-brown': { id: 'vintage-brown', label: 'Vintage Brown', category: 'vintage', hex: '#5c3d28', highlight: '#7d553a', shadow: '#362113', contrastText: '#fef3c7' },
  'olive-green': { id: 'olive-green', label: 'Olive Green', category: 'vintage', hex: '#556b2f', highlight: '#768f48', shadow: '#35441b', contrastText: '#f7fee7' },

  'webamp-orange': { id: 'webamp-orange', label: 'WebAmp #F26A1B', category: 'modern', hex: '#F26A1B', highlight: '#ff934f', shadow: '#b44608', contrastText: '#ffffff' },
  'electric-blue': { id: 'electric-blue', label: 'Electric Blue', category: 'modern', hex: '#2563eb', highlight: '#60a5fa', shadow: '#1d4ed8', contrastText: '#ffffff' },
  'neon-green': { id: 'neon-green', label: 'Neon Green', category: 'modern', hex: '#22c55e', highlight: '#86efac', shadow: '#15803d', contrastText: '#052e16' },
  'hot-pink': { id: 'hot-pink', label: 'Hot Pink', category: 'modern', hex: '#ef2f83', highlight: '#ff8ec4', shadow: '#a3125a', contrastText: '#ffffff' },
  purple: { id: 'purple', label: 'Purple', category: 'modern', hex: '#7c3aed', highlight: '#a78bfa', shadow: '#5b21b6', contrastText: '#ffffff' },
  magenta: { id: 'magenta', label: 'Magenta', category: 'modern', hex: '#d946ef', highlight: '#f0abfc', shadow: '#a21caf', contrastText: '#ffffff' },
  crimson: { id: 'crimson', label: 'Crimson', category: 'modern', hex: '#e11d48', highlight: '#fb7185', shadow: '#9f1239', contrastText: '#ffffff' },
  coral: { id: 'coral', label: 'Coral', category: 'modern', hex: '#fb7185', highlight: '#fda4af', shadow: '#e11d48', contrastText: '#ffffff' },
  yellow: { id: 'yellow', label: 'Yellow', category: 'modern', hex: '#facc15', highlight: '#fef08a', shadow: '#ca8a04', contrastText: '#1c1917' },
  'metallic-blue': { id: 'metallic-blue', label: 'Metallic Blue', category: 'modern', hex: '#1e40af', highlight: '#60a5fa', shadow: '#0f172a', contrastText: '#eff6ff' },
  gunmetal: { id: 'gunmetal', label: 'Gunmetal', category: 'modern', hex: '#374151', highlight: '#6b7280', shadow: '#111827', contrastText: '#f9fafb' },
}

export const EQUIPMENT_FINISHES: Record<
  EquipmentFinish,
  { id: EquipmentFinish; label: string; glossOpacity: number; grainOpacity: number; borderStyle: string }
> = {
  gloss: { id: 'gloss', label: 'Gloss', glossOpacity: 0.42, grainOpacity: 0.02, borderStyle: 'rgba(255,255,255,0.55)' },
  matte: { id: 'matte', label: 'Matte', glossOpacity: 0.05, grainOpacity: 0.12, borderStyle: 'rgba(255,255,255,0.1)' },
  satin: { id: 'satin', label: 'Satin', glossOpacity: 0.18, grainOpacity: 0.06, borderStyle: 'rgba(255,255,255,0.28)' },
  brushed: { id: 'brushed', label: 'Brushed', glossOpacity: 0.24, grainOpacity: 0.22, borderStyle: 'rgba(255,255,255,0.45)' },
  polished: { id: 'polished', label: 'Polished', glossOpacity: 0.56, grainOpacity: 0.01, borderStyle: 'rgba(255,255,255,0.72)' },
  'powder-coated': { id: 'powder-coated', label: 'Powder Coated', glossOpacity: 0.12, grainOpacity: 0.24, borderStyle: 'rgba(255,255,255,0.2)' },
  'chrome-plated': { id: 'chrome-plated', label: 'Chrome Plated', glossOpacity: 0.65, grainOpacity: 0.02, borderStyle: 'rgba(255,255,255,0.85)' },
  'gold-plated': { id: 'gold-plated', label: 'Gold Plated', glossOpacity: 0.54, grainOpacity: 0.04, borderStyle: 'rgba(253,224,71,0.65)' },
  aged: { id: 'aged', label: 'Aged', glossOpacity: 0.08, grainOpacity: 0.34, borderStyle: 'rgba(120,53,15,0.4)' },
  'aged-worn': { id: 'aged-worn', label: 'Aged Worn', glossOpacity: 0.12, grainOpacity: 0.32, borderStyle: 'rgba(255,255,255,0.18)' },
}

export const EQUIPMENT_MATERIALS: Record<
  EquipmentMaterial,
  { id: EquipmentMaterial; label: string; sheen: number; baseHex: string }
> = {
  aluminum: { id: 'aluminum', label: 'Aluminum', sheen: 0.72, baseHex: '#cbd5e1' },
  chrome: { id: 'chrome', label: 'Chrome', sheen: 0.96, baseHex: '#e2e8f0' },
  steel: { id: 'steel', label: 'Steel', sheen: 0.62, baseHex: '#64748b' },
  brass: { id: 'brass', label: 'Brass', sheen: 0.78, baseHex: '#d4af5a' },
  'abs-plastic': { id: 'abs-plastic', label: 'ABS Plastic', sheen: 0.38, baseHex: '#27272a' },
  tolex: { id: 'tolex', label: 'Tolex', sheen: 0.24, baseHex: '#1f2024' },
  'natural-wood': { id: 'natural-wood', label: 'Natural Wood', sheen: 0.34, baseHex: '#8b5a2b' },
  rubber: { id: 'rubber', label: 'Rubber', sheen: 0.08, baseHex: '#18181b' },
}

export const EQUIPMENT_TEXTURES: readonly EnclosureTexture[] = [
  'smooth',
  'matte',
  'glossy',
  'satin',
  'brushed-metal',
  'anodized-metal',
  'powder-coated',
  'hammered-metal',
  'textured-paint',
  'aged-worn',
  'tolex',
  'wood-grain',
  'carbon-fiber',
] as const

export const EQUIPMENT_MESHES: readonly MeshPattern[] = [
  'metal-mesh',
  'perforated-metal',
  'honeycomb-mesh',
  'speaker-cloth',
  'woven-fabric',
  'diamond-mesh',
  'vintage-grill-cloth',
] as const

/** Couleur d'accent de la marque WebAmp. */
export const WEBAMP_ORANGE = '#F26A1B'

/** Résout la couleur de base d'une surface (token ou hex libre). */
export function resolveSurfaceColor(
  surface?: EquipmentSurfaceConfig,
  fallback: EquipmentColorId = 'black'
): EquipmentColorToken {
  if (surface?.customHex) {
    const token = EQUIPMENT_COLORS[fallback]
    return { ...token, hex: surface.customHex }
  }
  return EQUIPMENT_COLORS[surface?.color ?? fallback]
}
