/**
 * Script console pour déboguer la leçon "La tablature"
 * À exécuter dans la console du navigateur
 * 
 * Usage: copier-coller tout le contenu de ce fichier dans la console
 */

// Fonction de parsing (copie de lessonContentParser.ts)
function parseLessonContent(description) {
  const content = {}
  
  // Détecter les blocs HTML/SVG
  const htmlBlocks = []
  const htmlBlockRegex = /\[html([^\]]*)\]([\s\S]*?)\[\/html\]/g
  let htmlMatch
  while ((htmlMatch = htmlBlockRegex.exec(description)) !== null) {
    const attrsString = htmlMatch[1] || ''
    const html = htmlMatch[2].trim()

    // Parser les attributs
    const attrs = {}
    const attrRegex = /(\w+)="([^"]*)"/g
    let attrMatch
    while ((attrMatch = attrRegex.exec(attrsString)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2]
    }

    htmlBlocks.push({
      html,
      instrument: attrs.instrument,
      title: attrs.title,
    })
  }
  if (htmlBlocks.length > 0) {
    content.htmlBlocks = htmlBlocks
  }

  return content
}

// Script principal
(async function debugTablature() {
  try {
    // Importer supabase depuis le module (si disponible)
    let supabase
    try {
      const supabaseModule = await import('../services/supabase.js')
      supabase = supabaseModule.supabase
    } catch (e) {
      console.error('❌ Impossible d\'importer supabase. Utilisez ce script depuis l\'app WebAmp.')
      return
    }

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

    // 5. Afficher un extrait de la description complète pour inspection
    console.log('\n📋 Extrait de la description (autour des blocs HTML):')
    const htmlStart = lesson.description?.indexOf('[html')
    if (htmlStart !== undefined && htmlStart !== -1) {
      const excerpt = lesson.description.substring(
        Math.max(0, htmlStart - 100),
        Math.min(lesson.description.length, htmlStart + 500)
      )
      console.log(excerpt)
    }

  } catch (error) {
    console.error('❌ Erreur:', error)
    console.error(error.stack)
  }
})()

