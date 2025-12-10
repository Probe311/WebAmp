/**
 * Service Supabase pour la gestion des Impulse Responses (IR)
 */
import { getSupabaseClient } from '../../lib/supabaseClient'

export interface ImpulseResponse {
  id: string
  user_id: string | null
  name: string
  description: string | null
  file_path: string
  mime_type: string | null
  sample_rate: number | null
  length_ms: number | null
  is_public: boolean
  created_at: string
}

export interface IRCreate {
  name: string
  description?: string
  file: File
  is_public?: boolean
  sample_rate?: number
  length_ms?: number
}

/**
 * Charge les IR de l'utilisateur connecté
 */
export async function loadUserIRs(): Promise<ImpulseResponse[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data: irs, error } = await supabase
    .from('impulse_responses')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return irs || []
}

/**
 * Charge les IR publiques
 */
export async function loadPublicIRs(limit = 50): Promise<ImpulseResponse[]> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: irs, error } = await supabase
    .from('impulse_responses')
    .select('*')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return irs || []
}

/**
 * Upload un fichier IR
 */
export async function uploadIR(ir: IRCreate): Promise<ImpulseResponse> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  // Générer le chemin de fichier : {user_id}/{timestamp}-{filename}
  const timestamp = Date.now()
  const sanitizedFilename = ir.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `${user.id}/${timestamp}-${sanitizedFilename}`

  // Upload du fichier dans le bucket
  const { error: uploadError } = await supabase.storage
    .from('ir')
    .upload(filePath, ir.file, {
      contentType: ir.file.type || 'audio/wav',
      upsert: false
    })

  if (uploadError) throw uploadError

  // Créer l'entrée dans la table
  const { data: irData, error: dbError } = await supabase
    .from('impulse_responses')
    .insert({
      user_id: user.id,
      name: ir.name,
      description: ir.description || null,
      file_path: filePath,
      mime_type: ir.file.type || null,
      sample_rate: ir.sample_rate || null,
      length_ms: ir.length_ms || null,
      is_public: ir.is_public || false
    })
    .select()
    .single()

  if (dbError) {
    // En cas d'erreur, supprimer le fichier uploadé
    await supabase.storage.from('ir').remove([filePath])
    throw dbError
  }

  return irData
}

/**
 * Télécharge un fichier IR (retourne l'URL signée)
 */
export async function getIRDownloadUrl(irId: string, expiresIn = 3600): Promise<string> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  // Récupérer le chemin du fichier
  const { data: ir, error: fetchError } = await supabase
    .from('impulse_responses')
    .select('file_path, is_public, user_id')
    .eq('id', irId)
    .single()

  if (fetchError) throw fetchError
  if (!ir) throw new Error('IR non trouvé')

  // Vérifier les permissions
  const { data: { user } } = await supabase.auth.getUser()
  if (!ir.is_public && ir.user_id !== user?.id) {
    throw new Error('Accès non autorisé à ce fichier IR')
  }

  // Générer l'URL signée
  const { data: urlData, error: urlError } = await supabase.storage
    .from('ir')
    .createSignedUrl(ir.file_path, expiresIn)

  if (urlError) throw urlError
  if (!urlData) throw new Error('Erreur lors de la génération de l\'URL')

  return urlData.signedUrl
}

/**
 * Supprime un IR
 */
export async function deleteIR(irId: string): Promise<void> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  // Récupérer le chemin du fichier
  const { data: ir, error: fetchError } = await supabase
    .from('impulse_responses')
    .select('file_path, user_id')
    .eq('id', irId)
    .single()

  if (fetchError) throw fetchError
  if (!ir || ir.user_id !== user.id) {
    throw new Error('IR non trouvé ou accès non autorisé')
  }

  // Supprimer le fichier du storage
  const { error: storageError } = await supabase.storage
    .from('ir')
    .remove([ir.file_path])

  if (storageError) throw storageError

  // Supprimer l'entrée de la base (cascade si nécessaire)
  const { error: dbError } = await supabase
    .from('impulse_responses')
    .delete()
    .eq('id', irId)

  if (dbError) throw dbError
}

/**
 * Met à jour les métadonnées d'un IR
 */
export async function updateIR(irId: string, updates: {
  name?: string
  description?: string
  is_public?: boolean
}): Promise<ImpulseResponse> {
  const supabase = getSupabaseClient()
  if (!supabase) {
    throw new Error('Supabase client non initialisé')
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Utilisateur non connecté')
  }

  // Vérifier que l'IR appartient à l'utilisateur
  const { data: existing } = await supabase
    .from('impulse_responses')
    .select('user_id')
    .eq('id', irId)
    .single()

  if (!existing || existing.user_id !== user.id) {
    throw new Error('IR non trouvé ou accès non autorisé')
  }

  const { data: updated, error } = await supabase
    .from('impulse_responses')
    .update(updates)
    .eq('id', irId)
    .select()
    .single()

  if (error) throw error
  if (!updated) throw new Error('Erreur lors de la mise à jour')

  return updated
}

