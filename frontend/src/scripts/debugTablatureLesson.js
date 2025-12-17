/**
 * Script de debug pour vérifier le contenu de la leçon "La tablature"
 * et tester le parsing des blocs HTML
 */

import { supabase } from '../services/supabase.js'
import { parseLessonContent } from '../utils/lessonContentParser.js'

async function debugTablatureLesson() {
  try {
    console.log('🔍 Recherche du cours "Shake It Off"...')
    
    // 1. Trouver le cours
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('id, title')
      .ilike('title', '%Shake It Off%')
      .eq('is_published', true)

    if (courseError || !courses || courses.length === 0) {
      console.error('❌ Cours non trouvé:', courseError)
      return
    }

    const course = courses[0]
    console.log('✅ Cours trouvé:', course.title, '(ID:', course.id + ')')

    // 2. Trouver la leçon "La tablature"
    const { data: lessons, error: lessonError } = await supabase
      .from('lessons')
      .select('id, title, description, order_index')
      .eq('course_id', course.id)
      .ilike('title', '%tablature%')
      .order('order_index', { ascending: true })

    if (lessonError || !lessons || lessons.length === 0) {
      console.error('❌ Leçon non trouvée:', lessonError)
      return
    }

    const lesson = lessons[0]
    console.log('✅ Leçon trouvée:', lesson.title, '(ID:', lesson.id + ', ordre:', lesson.order_index + ')')
    console.log('\n📄 Description brute (premiers 500 caractères):')
    console.log(lesson.description?.substring(0, 500) || '(vide)')
    console.log('\n📄 Description brute (longueur totale):', lesson.description?.length || 0)

    // 3. Tester le parsing
    console.log('\n🔍 Test du parsing...')
    const parsed = parseLessonContent(lesson.description || '')
    
    console.log('📊 Résultats du parsing:')
    console.log('  - htmlBlocks trouvés:', parsed.htmlBlocks?.length || 0)
    
    if (parsed.htmlBlocks && parsed.htmlBlocks.length > 0) {
      parsed.htmlBlocks.forEach((block, index) => {
        console.log(`\n  Bloc ${index + 1}:`)
        console.log('    - instrument:', block.instrument || '(aucun)')
        console.log('    - title:', block.title || '(aucun)')
        console.log('    - html length:', block.html?.length || 0)
        console.log('    - html preview (100 premiers caractères):', block.html?.substring(0, 100) || '(vide)')
      })
    } else {
      console.log('\n⚠️ Aucun bloc HTML trouvé!')
      console.log('\n🔍 Recherche manuelle de [html] dans la description...')
      const hasHtmlTag = lesson.description?.includes('[html')
      const hasHtmlClose = lesson.description?.includes('[/html]')
      console.log('  - Contient [html:', hasHtmlTag)
      console.log('  - Contient [/html]:', hasHtmlClose)
      
      if (hasHtmlTag || hasHtmlClose) {
        // Extraire un extrait autour des tags
        const htmlIndex = lesson.description?.indexOf('[html')
        if (htmlIndex !== undefined && htmlIndex !== -1) {
          const excerpt = lesson.description.substring(
            Math.max(0, htmlIndex - 50),
            Math.min(lesson.description.length, htmlIndex + 200)
          )
          console.log('\n  Extrait autour de [html:')
          console.log('  ', excerpt)
        }
      }
    }

    // 4. Vérifier la regex
    console.log('\n🔍 Test de la regex de parsing...')
    const htmlBlockRegex = /\[html([^\]]*)\]([\s\S]*?)\[\/html\]/g
    const matches = []
    let match
    while ((match = htmlBlockRegex.exec(lesson.description || '')) !== null) {
      matches.push({
        fullMatch: match[0].substring(0, 200),
        attrs: match[1],
        htmlLength: match[2].trim().length
      })
    }
    console.log('  - Nombre de matches regex:', matches.length)
    matches.forEach((m, i) => {
      console.log(`  Match ${i + 1}:`, m)
    })

  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

// Exposer globalement pour la console
if (typeof window !== 'undefined') {
  window.debugTablatureLesson = debugTablatureLesson
  console.log('💡 Fonction disponible: window.debugTablatureLesson()')
}

export { debugTablatureLesson }

