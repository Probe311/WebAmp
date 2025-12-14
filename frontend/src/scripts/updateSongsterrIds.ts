/**
 * Script pour mettre à jour les IDs Songsterr dans les tablatures
 */

import { supabase } from '../services/supabase'

/**
 * Mapping des slugs vers les IDs Songsterr
 */
const songsterrIdMap: Record<string, number> = {
  'shake-it-off-001': 468698
  // Ajouter d'autres mappings ici au fur et à mesure
}

/**
 * Met à jour l'ID Songsterr pour une tablature spécifique
 */
export async function updateSongsterrId(slug: string, songsterrId: number) {
  console.log(`🔄 Mise à jour de l'ID Songsterr pour "${slug}": ${songsterrId}`)
  
  // D'abord vérifier si la tablature existe
  const { data: existing } = await supabase
    .from('tablatures')
    .select('id, slug, songsterr_id')
    .eq('slug', slug)
    .maybeSingle()
  
  if (!existing) {
    console.warn(`⚠️ Tablature avec slug "${slug}" non trouvée`)
    return { success: false, error: 'Tablature not found' }
  }
  
  console.log(`📋 Tablature trouvée:`, {
    id: existing.id,
    slug: existing.slug,
    current_songsterr_id: existing.songsterr_id
  })
  
  const { data, error } = await supabase
    .from('tablatures')
    .update({
      songsterr_id: songsterrId,
      songsterr_url: `https://www.songsterr.com/a/wsa/taylor-swift-shake-it-off-tab-s${songsterrId}t1`
    })
    .eq('slug', slug)
    .select('id, slug, songsterr_id, songsterr_url')
  
  if (error) {
    console.error(`❌ Erreur lors de la mise à jour de "${slug}":`, error)
    return { success: false, error }
  }
  
  if (!data || data.length === 0) {
    console.warn(`⚠️ Aucune donnée retournée après la mise à jour de "${slug}"`)
    return { success: false, error: 'No data returned' }
  }
  
  console.log(`✅ ID Songsterr mis à jour pour "${slug}":`, {
    id: data[0].id,
    slug: data[0].slug,
    songsterr_id: data[0].songsterr_id,
    songsterr_url: data[0].songsterr_url
  })
  return { success: true, data: data[0] }
}

/**
 * Met à jour tous les IDs Songsterr définis dans le mapping
 */
export async function updateAllSongsterrIds() {
  console.log('🚀 Début de la mise à jour des IDs Songsterr...')
  
  const results = []
  for (const [slug, songsterrId] of Object.entries(songsterrIdMap)) {
    const result = await updateSongsterrId(slug, songsterrId)
    results.push({ slug, ...result })
    
    // Petite pause pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  const successCount = results.filter(r => r.success).length
  const errorCount = results.filter(r => !r.success).length
  
  console.log(`\n✅ Mise à jour terminée:`)
  console.log(`   - ${successCount} tablatures mises à jour avec succès`)
  console.log(`   - ${errorCount} erreurs`)
  
  return { success: errorCount === 0, results }
}

// Exposer les fonctions globalement pour la console du navigateur
if (typeof window !== 'undefined') {
  ;(window as any).updateSongsterrId = updateSongsterrId
  ;(window as any).updateAllSongsterrIds = updateAllSongsterrIds
  console.log('✅ Fonctions de mise à jour Songsterr disponibles globalement:')
  console.log('   - updateSongsterrId(slug, songsterrId) : Mettre à jour un ID Songsterr')
  console.log('   - updateAllSongsterrIds() : Mettre à jour tous les IDs Songsterr')
}

