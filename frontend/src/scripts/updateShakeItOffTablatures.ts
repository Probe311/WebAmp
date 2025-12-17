/**
 * Script pour mettre à jour la leçon "La tablature" du cours "Shake It Off"
 * avec les 3 tablatures HTML/SVG (Electric guitar, Basse, Piano)
 */

import { supabase } from '../services/supabase'
import { shakeItOffTablatures } from './shakeItOffTablaturesData'

/**
 * Met à jour la description de la leçon "La tablature" avec les 3 tablatures
 */
export async function updateShakeItOffTablatures() {
  try {
    // 1. Trouver le cours "Shake It Off"
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .ilike('title', '%Shake It Off%')
      .maybeSingle()

    if (courseError) {
      return {
        success: false,
        error: `Erreur lors de la recherche du cours : ${courseError.message}`
      }
    }

    if (!course) {
      return {
        success: false,
        error: 'Cours "Shake It Off" non trouvé'
      }
    }

    console.log(`✓ Cours trouvé : ${course.title} (ID: ${course.id})`)

    // 2. Trouver la leçon "La tablature" pour ce cours
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, description, order_index')
      .eq('course_id', course.id)
      .ilike('title', '%tablature%')
      .maybeSingle()

    if (lessonError) {
      return {
        success: false,
        error: `Erreur lors de la recherche de la leçon : ${lessonError.message}`
      }
    }

    if (!lesson) {
      return {
        success: false,
        error: 'Leçon "La tablature" non trouvée pour ce cours'
      }
    }

    console.log(`✓ Leçon trouvée : ${lesson.title} (ID: ${lesson.id}, ordre: ${lesson.order_index})`)

    // 3. Construire la nouvelle description avec les 3 tablatures
    const newDescription = `La tablature complète est disponible ci-dessous pour les différents instruments :

[html instrument="Guitare électrique" title="Shake It Off – Guitare électrique"]
${shakeItOffTablatures.electricGuitar}
[/html]

[html instrument="Basse" title="Shake It Off – Basse"]
${shakeItOffTablatures.bass}
[/html]

[html instrument="Piano" title="Shake It Off – Piano"]
${shakeItOffTablatures.piano}
[/html]

Vous pouvez sélectionner l'instrument que vous souhaitez apprendre en utilisant les onglets ci-dessus.`

    // 4. Mettre à jour la description de la leçon
    const { error: updateError } = await supabase
      .from('lessons')
      .update({
        description: newDescription,
        updated_at: new Date().toISOString()
      })
      .eq('id', lesson.id)

    if (updateError) {
      return {
        success: false,
        error: `Erreur lors de la mise à jour : ${updateError.message}`
      }
    }

    console.log('✓ Description mise à jour avec succès')

    return {
      success: true,
      course: {
        id: course.id,
        title: course.title
      },
      lesson: {
        id: lesson.id,
        title: lesson.title,
        order_index: lesson.order_index
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: `Erreur inattendue : ${error.message}`
    }
  }
}

/**
 * Fonction helper pour mettre à jour avec des tablatures personnalisées
 * @param electricGuitarHtml HTML/SVG de la guitare électrique
 * @param bassHtml HTML/SVG de la basse
 * @param pianoHtml HTML/SVG du piano
 */
export async function updateShakeItOffTablaturesCustom(
  electricGuitarHtml: string,
  bassHtml: string,
  pianoHtml: string
) {
  try {
    // 1. Trouver le cours "Shake It Off"
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .ilike('title', '%Shake It Off%')
      .maybeSingle()

    if (courseError) {
      return {
        success: false,
        error: `Erreur lors de la recherche du cours : ${courseError.message}`
      }
    }

    if (!course) {
      return {
        success: false,
        error: 'Cours "Shake It Off" non trouvé'
      }
    }

    // 2. Trouver la leçon "La tablature" pour ce cours
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, description, order_index')
      .eq('course_id', course.id)
      .ilike('title', '%tablature%')
      .maybeSingle()

    if (lessonError) {
      return {
        success: false,
        error: `Erreur lors de la recherche de la leçon : ${lessonError.message}`
      }
    }

    if (!lesson) {
      return {
        success: false,
        error: 'Leçon "La tablature" non trouvée pour ce cours'
      }
    }

    // 3. Construire la nouvelle description avec les 3 tablatures
    const newDescription = `La tablature complète est disponible ci-dessous pour les différents instruments :

[html instrument="Guitare électrique" title="Shake It Off – Guitare électrique"]
${electricGuitarHtml}
[/html]

[html instrument="Basse" title="Shake It Off – Basse"]
${bassHtml}
[/html]

[html instrument="Piano" title="Shake It Off – Piano"]
${pianoHtml}
[/html]

Vous pouvez sélectionner l'instrument que vous souhaitez apprendre en utilisant les onglets ci-dessus.`

    // 4. Mettre à jour la description de la leçon
    const { error: updateError } = await supabase
      .from('lessons')
      .update({
        description: newDescription,
        updated_at: new Date().toISOString()
      })
      .eq('id', lesson.id)

    if (updateError) {
      return {
        success: false,
        error: `Erreur lors de la mise à jour : ${updateError.message}`
      }
    }

    return {
      success: true,
      course: {
        id: course.id,
        title: course.title
      },
      lesson: {
        id: lesson.id,
        title: lesson.title,
        order_index: lesson.order_index
      }
    }
  } catch (error: any) {
    return {
      success: false,
      error: `Erreur inattendue : ${error.message}`
    }
  }
}

// Importer la fonction d'import depuis le fichier HTML
import { importShakeItOffTablatures } from './importShakeItOffTabs'

// Exposer les fonctions globalement pour la console du navigateur
if (typeof window !== 'undefined') {
  ;(window as any).updateShakeItOffTablatures = updateShakeItOffTablatures
  ;(window as any).updateShakeItOffTablaturesCustom = updateShakeItOffTablaturesCustom
  ;(window as any).importShakeItOffTablatures = importShakeItOffTablatures
  console.log('💡 Fonctions disponibles:')
  console.log('   - window.updateShakeItOffTablatures()')
  console.log('   - window.updateShakeItOffTablaturesCustom(electricGuitar, bass, piano)')
  console.log('   - window.importShakeItOffTablatures(htmlContent?)')
}

