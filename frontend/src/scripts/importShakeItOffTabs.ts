/**
 * Script pour importer et optimiser les tablatures HTML de "Shake It Off"
 * dans la leçon 4 "La tablature" du cours correspondant.
 * 
 * Usage:
 *   - Exécuter depuis la console du navigateur
 *   - Nécessite que le cours "Shake It Off" existe déjà dans Supabase
 *   - Le contenu HTML doit être passé en paramètre ou chargé depuis un fichier
 */

import { supabase } from '../services/supabase'

/**
 * Nettoie le HTML en supprimant les attributs et éléments inutiles
 * pour l'affichage dans Supabase.
 */
function optimizeHtml(html: string): string {
  let cleaned = html

  // Supprimer les attributs data-* (sauf ceux nécessaires pour l'affichage)
  cleaned = cleaned.replace(/\s+data-[^=]*="[^"]*"/g, '')
  
  // Supprimer les classes CSS spécifiques (garder seulement les classes essentielles pour le SVG)
  cleaned = cleaned.replace(/\s+class="[^"]*"/g, '')
  
  // Supprimer les attributs role, aria-label, etc. (sauf ceux nécessaires pour l'accessibilité SVG)
  cleaned = cleaned.replace(/\s+role="[^"]*"/g, '')
  cleaned = cleaned.replace(/\s+aria-label="[^"]*"/g, '')
  cleaned = cleaned.replace(/\s+aria-pressed="[^"]*"/g, '')
  
  // Supprimer les attributs style inline (sauf ceux nécessaires pour le viewBox)
  cleaned = cleaned.replace(/\s+style="[^"]*"/g, '')
  
  // Supprimer les éléments de contrôle interactifs (boutons, menus, etc.)
  cleaned = cleaned.replace(/<button[^>]*>[\s\S]*?<\/button>/gi, '')
  cleaned = cleaned.replace(/<div[^>]*data-tab-control[^>]*>[\s\S]*?<\/div>/gi, '')
  cleaned = cleaned.replace(/<g[^>]*data-tab-control[^>]*>[\s\S]*?<\/g>/gi, '')
  cleaned = cleaned.replace(/<g[^>]*data-testid[^>]*>[\s\S]*?<\/g>/gi, '')
  
  // Supprimer les divs de contrôle (bar-dots, etc.) mais garder le contenu SVG
  cleaned = cleaned.replace(/<div[^>]*data-player-key[^>]*>[\s\S]*?<\/div>/gi, '')
  
  // Supprimer les divs avec data-tab-control="bar-dots"
  cleaned = cleaned.replace(/<div[^>]*data-tab-control="bar-dots"[^>]*>[\s\S]*?<\/div>/gi, '')
  
  // Nettoyer les espaces multiples mais préserver la structure
  cleaned = cleaned.replace(/\s{2,}/g, ' ')
  
  // Nettoyer les retours à la ligne inutiles entre balises
  cleaned = cleaned.replace(/>\s+</g, '><')
  
  return cleaned.trim()
}

/**
 * Extrait les sections de tablature du fichier HTML
 * Utilise une approche plus robuste en cherchant les sections directement
 */
function extractTablatureSections(htmlContent: string): {
  electricGuitar: string | null
  bass: string | null
  piano: string | null
} {
  const result = {
    electricGuitar: null as string | null,
    bass: null as string | null,
    piano: null as string | null
  }

  // Trouver toutes les sections <section id="tablature">...</section>
  // Utiliser une regex non-greedy mais qui capture les sections imbriquées
  const sectionRegex = /<section\s+id="tablature"[^>]*>([\s\S]*?)<\/section>/gi
  const sections: string[] = []
  let match

  while ((match = sectionRegex.exec(htmlContent)) !== null) {
    sections.push(match[0])
  }

  console.log(`📊 ${sections.length} sections de tablature trouvées`)

  if (sections.length === 0) {
    console.warn('⚠️ Aucune section trouvée avec la regex standard, tentative avec approche alternative...')
    // Approche alternative : chercher manuellement
    const lines = htmlContent.split('\n')
    let inSection = false
    let currentSection: string[] = []
    let sectionType: 'electricGuitar' | 'bass' | 'piano' | null = null
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const lineLower = line.toLowerCase().trim()
      
      // Détecter le début d'une section
      if (line.includes('<section id="tablature"')) {
        inSection = true
        currentSection = [line]
        
        // Déterminer le type en regardant les lignes précédentes
        for (let j = Math.max(0, i - 3); j < i; j++) {
          const prevLine = lines[j].toLowerCase()
          if (prevLine.includes('electric guitar') || prevLine.includes('guitare électrique')) {
            sectionType = 'electricGuitar'
            break
          } else if ((prevLine.includes('basse') || prevLine.includes('bass')) && !prevLine.includes('electric')) {
            sectionType = 'bass'
            break
          } else if (prevLine.includes('piano')) {
            sectionType = 'piano'
            break
          }
        }
        continue
      }
      
      // Collecter les lignes de la section
      if (inSection) {
        currentSection.push(line)
        
        // Détecter la fin de la section
        if (line.includes('</section>')) {
          const sectionHtml = currentSection.join('\n')
          const optimized = optimizeHtml(sectionHtml)
          
          if (sectionType === 'electricGuitar' && !result.electricGuitar) {
            result.electricGuitar = optimized
            console.log(`✅ Section guitare électrique extraite (${optimized.length} caractères)`)
          } else if (sectionType === 'bass' && !result.bass) {
            result.bass = optimized
            console.log(`✅ Section basse extraite (${optimized.length} caractères)`)
          } else if (sectionType === 'piano' && !result.piano) {
            result.piano = optimized
            console.log(`✅ Section piano extraite (${optimized.length} caractères)`)
          }
          
          inSection = false
          currentSection = []
          sectionType = null
        }
      }
    }
    
    return result
  }

  // Identifier chaque section par son contexte (lignes avant dans le fichier)
  const lines = htmlContent.split('\n')
  
  let currentSectionIndex = 0
  
  for (let i = 0; i < lines.length && currentSectionIndex < sections.length; i++) {
    const line = lines[i].toLowerCase().trim()
    
    // Chercher "Electric guitar" ou "Guitare électrique"
    if ((line.includes('electric guitar') || line.includes('guitare électrique')) && !result.electricGuitar) {
      // La section suivante devrait être la guitare électrique
      if (currentSectionIndex < sections.length) {
        result.electricGuitar = optimizeHtml(sections[currentSectionIndex])
        console.log(`✅ Section guitare électrique extraite (${result.electricGuitar.length} caractères)`)
        currentSectionIndex++
      }
    }
    
    // Chercher "Basse" ou "Bass"
    if ((line.includes('basse') || line.includes('bass')) && !line.includes('electric') && !result.bass) {
      if (currentSectionIndex < sections.length) {
        result.bass = optimizeHtml(sections[currentSectionIndex])
        console.log(`✅ Section basse extraite (${result.bass.length} caractères)`)
        currentSectionIndex++
      }
    }
    
    // Chercher "Piano"
    if (line.includes('piano') && !result.piano) {
      if (currentSectionIndex < sections.length) {
        result.piano = optimizeHtml(sections[currentSectionIndex])
        console.log(`✅ Section piano extraite (${result.piano.length} caractères)`)
        currentSectionIndex++
      }
    }
  }

  return result
}

/**
 * Fonction principale pour importer les tablatures
 * @param htmlContent Le contenu HTML du fichier (optionnel, peut être chargé depuis le fichier)
 */
export async function importShakeItOffTablatures(htmlContent?: string) {
  try {
    console.log('🎸 Début de l\'importation des tablatures "Shake It Off"...')

    // 1. Charger le contenu HTML
    if (!htmlContent) {
      // Si exécuté depuis le navigateur, on peut charger via fetch
      if (typeof window !== 'undefined') {
        console.log('📖 Chargement du fichier HTML via fetch...')
        const response = await fetch('/docs/tabs/Shake it off.htm')
        if (!response.ok) {
          throw new Error(`Impossible de charger le fichier HTML: ${response.statusText}`)
        }
        htmlContent = await response.text()
      } else {
        throw new Error('Le contenu HTML doit être fourni en paramètre ou le script doit être exécuté depuis le navigateur')
      }
    }
    
    console.log(`✅ Contenu HTML chargé (${htmlContent.length} caractères)`)

    // 2. Extraire les sections de tablature
    console.log('🔍 Extraction des sections de tablature...')
    const sections = extractTablatureSections(htmlContent)
    
    if (!sections.electricGuitar && !sections.bass && !sections.piano) {
      throw new Error('Aucune section de tablature trouvée dans le fichier HTML')
    }

    console.log(`✅ Sections trouvées:`)
    console.log(`   - Guitare électrique: ${sections.electricGuitar ? '✅' : '❌'}`)
    console.log(`   - Basse: ${sections.bass ? '✅' : '❌'}`)
    console.log(`   - Piano: ${sections.piano ? '✅' : '❌'}`)

    // 3. Trouver le cours "Shake It Off" dans Supabase
    console.log('🔍 Recherche du cours "Shake It Off"...')
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .ilike('title', '%Shake It Off%')
      .eq('is_published', true)

    if (courseError) {
      throw new Error(`Erreur lors de la recherche du cours: ${courseError.message}`)
    }

    if (!courses || courses.length === 0) {
      throw new Error('Cours "Shake It Off" non trouvé dans Supabase')
    }

    const course = courses[0]
    console.log(`✅ Cours trouvé: ${course.title} (ID: ${course.id})`)

    // 4. Trouver la leçon 4 "La tablature"
    console.log('🔍 Recherche de la leçon "La tablature"...')
    const { data: lessons, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, description, order_index')
      .eq('course_id', course.id)
      .ilike('title', '%tablature%')
      .order('order_index', { ascending: true })

    if (lessonError) {
      throw new Error(`Erreur lors de la recherche de la leçon: ${lessonError.message}`)
    }

    if (!lessons || lessons.length === 0) {
      throw new Error('Leçon "La tablature" non trouvée dans Supabase')
    }

    // Prendre la première leçon qui contient "tablature" dans le titre
    const lesson = lessons[0]
    console.log(`✅ Leçon trouvée: ${lesson.title} (ID: ${lesson.id}, ordre: ${lesson.order_index})`)

    // 5. Construire la nouvelle description avec les blocs HTML
    const htmlBlocks: string[] = []
    
    if (sections.electricGuitar) {
      htmlBlocks.push(
        `[html instrument="Guitare électrique" title="Shake It Off - Guitare électrique"]\n${sections.electricGuitar}\n[/html]`
      )
    }
    
    if (sections.bass) {
      htmlBlocks.push(
        `[html instrument="Basse" title="Shake It Off - Basse"]\n${sections.bass}\n[/html]`
      )
    }
    
    if (sections.piano) {
      htmlBlocks.push(
        `[html instrument="Piano" title="Shake It Off - Piano"]\n${sections.piano}\n[/html]`
      )
    }

    // Construire la description complète
    const newDescription = `La tablature complète est disponible ci-dessous pour différents instruments :

${htmlBlocks.join('\n\n')}

Utilisez le sélecteur ci-dessus pour choisir l'instrument que vous souhaitez apprendre.`

    // 6. Mettre à jour la leçon dans Supabase
    console.log('💾 Mise à jour de la leçon dans Supabase...')
    const { error: updateError } = await supabase
      .from('lessons')
      .update({
        description: newDescription,
        updated_at: new Date().toISOString()
      })
      .eq('id', lesson.id)

    if (updateError) {
      throw new Error(`Erreur lors de la mise à jour: ${updateError.message}`)
    }

    console.log('✅ Leçon mise à jour avec succès!')
    console.log(`📊 Statistiques:`)
    console.log(`   - Taille de la description: ${newDescription.length} caractères`)
    console.log(`   - Nombre de blocs HTML: ${htmlBlocks.length}`)
    console.log(`   - Taille guitare électrique: ${sections.electricGuitar?.length || 0} caractères`)
    console.log(`   - Taille basse: ${sections.bass?.length || 0} caractères`)
    console.log(`   - Taille piano: ${sections.piano?.length || 0} caractères`)

    return {
      success: true,
      courseId: course.id,
      lessonId: lesson.id,
      blocksCount: htmlBlocks.length
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'importation:', error)
    throw error
  }
}

// Exposer la fonction globalement pour l'exécution depuis la console du navigateur
if (typeof window !== 'undefined') {
  (window as any).importShakeItOffTablatures = importShakeItOffTablatures
  console.log('💡 Fonction disponible: window.importShakeItOffTablatures()')
  console.log('💡 Ou avec contenu HTML: window.importShakeItOffTablatures(htmlContent)')
}

