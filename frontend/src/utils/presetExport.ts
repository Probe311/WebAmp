/**
 * Utilitaires pour l'export/import de presets
 */

export interface PresetExport {
  version: string
  name: string
  description?: string
  author?: string
  tags?: string[]
  amplifierId?: string
  amplifierParameters?: Record<string, number>
  effects: Array<{
    id: string
    type: string
    pedalId: string
    name: string
    bypassed: boolean
    parameters: Record<string, number>
    position: number
  }>
  metadata?: {
    createdAt: string
    updatedAt: string
    genre?: string
    style?: string
  }
}

const CURRENT_VERSION = '1.0.0'

/**
 * Exporte un preset au format JSON
 */
export function exportPreset(
  name: string,
  amplifierId: string | undefined,
  amplifierParameters: Record<string, number> | undefined,
  effects: Array<{
    id: string
    type: string
    pedalId: string
    name: string
    bypassed: boolean
    parameters: Record<string, number>
  }>,
  metadata?: {
    description?: string
    author?: string
    tags?: string[]
    genre?: string
    style?: string
  }
): PresetExport {
  const now = new Date().toISOString()
  
  return {
    version: CURRENT_VERSION,
    name,
    description: metadata?.description,
    author: metadata?.author,
    tags: metadata?.tags,
    amplifierId,
    amplifierParameters,
    effects: effects.map((effect, index) => ({
      id: effect.id,
      type: effect.type,
      pedalId: effect.pedalId,
      name: effect.name,
      bypassed: effect.bypassed,
      parameters: effect.parameters,
      position: index
    })),
    metadata: {
      createdAt: now,
      updatedAt: now,
      genre: metadata?.genre,
      style: metadata?.style
    }
  }
}

/**
 * Exporte un preset en fichier JSON téléchargeable
 */
export function downloadPreset(preset: PresetExport): void {
  const json = JSON.stringify(preset, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${preset.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Importe un preset depuis un fichier JSON
 */
export function importPreset(file: File): Promise<PresetExport> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const preset = JSON.parse(text) as PresetExport
        
        // Valider le preset
        if (!preset.version || !preset.name || !Array.isArray(preset.effects)) {
          reject(new Error('Format de preset invalide'))
          return
        }
        
        // Vérifier la version (pour compatibilité future)
        if (preset.version !== CURRENT_VERSION) {
          console.warn(`Version de preset différente: ${preset.version} (attendu: ${CURRENT_VERSION})`)
        }
        
        resolve(preset)
      } catch (error) {
        reject(new Error('Erreur lors du parsing du preset: ' + (error instanceof Error ? error.message : String(error))))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'))
    }
    
    reader.readAsText(file)
  })
}

/**
 * Valide un preset importé
 */
export function validatePreset(preset: PresetExport): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!preset.name || preset.name.trim().length === 0) {
    errors.push('Le nom du preset est requis')
  }
  
  if (!Array.isArray(preset.effects)) {
    errors.push('Les effets doivent être un tableau')
  } else {
    preset.effects.forEach((effect, index) => {
      if (!effect.type || !effect.pedalId) {
        errors.push(`Effet ${index + 1}: type et pedalId sont requis`)
      }
      if (!effect.parameters || typeof effect.parameters !== 'object') {
        errors.push(`Effet ${index + 1}: parameters doit être un objet`)
      }
    })
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

