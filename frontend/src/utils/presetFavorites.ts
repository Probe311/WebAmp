/**
 * Gestion des presets favoris
 */

const FAVORITES_STORAGE_KEY = 'webamp_preset_favorites'

export interface PresetFavorite {
  id: string
  name: string
  amplifierId?: string
  effects: Array<{
    type: string
    pedalId: string
    parameters: Record<string, number>
  }>
  createdAt: string
}

/**
 * Récupère tous les favoris
 */
export function getFavorites(): PresetFavorite[] {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Erreur chargement favoris:', error)
    return []
  }
}

/**
 * Ajoute un preset aux favoris
 */
export function addFavorite(
  name: string,
  amplifierId: string | undefined,
  effects: Array<{
    type: string
    pedalId: string
    parameters: Record<string, number>
  }>
): PresetFavorite {
  const favorites = getFavorites()
  const newFavorite: PresetFavorite = {
    id: `favorite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    amplifierId,
    effects,
    createdAt: new Date().toISOString()
  }
  
  favorites.push(newFavorite)
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  
  return newFavorite
}

/**
 * Supprime un favori
 */
export function removeFavorite(id: string): boolean {
  const favorites = getFavorites()
  const filtered = favorites.filter(f => f.id !== id)
  
  if (filtered.length === favorites.length) {
    return false // Pas trouvé
  }
  
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(filtered))
  return true
}

/**
 * Vérifie si un preset est dans les favoris
 */
export function isFavorite(
  amplifierId: string | undefined,
  effects: Array<{
    type: string
    pedalId: string
    parameters: Record<string, number>
  }>
): PresetFavorite | null {
  const favorites = getFavorites()
  
  return favorites.find(f => {
    if (f.amplifierId !== amplifierId) return false
    if (f.effects.length !== effects.length) return false
    
    return f.effects.every((fe, i) => {
      const e = effects[i]
      return fe.type === e.type && 
             fe.pedalId === e.pedalId &&
             JSON.stringify(fe.parameters) === JSON.stringify(e.parameters)
    })
  }) || null
}

