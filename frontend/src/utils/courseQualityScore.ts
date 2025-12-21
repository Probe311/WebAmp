/**
 * Système de scoring de qualité pour les cours
 * Inspiré de Yoast SEO mais orienté learning
 */

import { Course, Lesson } from '../services/supabase'
import { parseLessonContent } from './lessonContentParser'

export interface CourseScore {
  totalScore: number
  breakdown: {
    quality: number
    length: number
    relevance: number
    structure: number
    engagement: number
    keyword: number // Nouveau : expression clé
    media: number // Nouveau : visuels/médias
  }
  recommendations: string[]
  keyword?: string // Expression clé détectée
}

/**
 * Calcule le score de qualité d'un cours (0-100)
 */
export function calculateCourseQualityScore(
  course: Course,
  lessons: Lesson[] = []
): CourseScore {
  // Détecter l'expression clé principale
  const keyword = detectMainKeyword(course, lessons)

  const breakdown = {
    quality: calculateQualityScore(course, lessons),
    length: calculateLengthScore(course, lessons),
    relevance: calculateRelevanceScore(course, lessons),
    structure: calculateStructureScore(course, lessons),
    engagement: calculateEngagementScore(course, lessons),
    keyword: calculateKeywordScore(course, lessons, keyword),
    media: calculateMediaScore(course, lessons)
  }

  // Poids adaptatifs selon le type de cours
  const isQuiz = course.type === 'quiz'
  const isSongCourse = course.title.toLowerCase().includes('apprendre') || 
                       course.title.toLowerCase().includes('jouer') ||
                       course.title.toLowerCase().includes('maîtriser')
  
  // Poids pour chaque critère (doit totaliser 100)
  // Ajusté pour inclure les nouveaux critères et adapter selon le type
  const weights = isQuiz ? {
    // Pour les quiz : moins d'importance sur la longueur et l'engagement, plus sur la pertinence
    quality: 30,      // Qualité des questions
    length: 10,       // Nombre de questions (moins important)
    relevance: 30,     // Pertinence des questions (plus important)
    structure: 15,     // Ordre logique des questions
    engagement: 5,     // Moins pertinent pour les quiz
    keyword: 5,        // Expression clé moins importante
    media: 5           // Médias moins pertinents
  } : isSongCourse ? {
    // Pour les cours "apprendre chanson" : plus d'importance sur la structure et les médias
    quality: 20,      // Qualité du contenu
    length: 15,       // Nombre de leçons
    relevance: 20,     // Tags et catégorie
    structure: 20,     // Structure spécifique (très important)
    engagement: 10,    // Engagement
    keyword: 5,        // Expression clé
    media: 10          // Médias très importants (tablatures, vidéos)
  } : {
    // Pour les tutoriels/guides : poids standard
    quality: 25,      // Réduit de 30 à 25
    length: 18,       // Réduit de 20 à 18
    relevance: 22,     // Réduit de 25 à 22
    structure: 13,     // Réduit de 15 à 13
    engagement: 10,    // Inchangé
    keyword: 7,        // Nouveau : expression clé
    media: 5           // Nouveau : visuels/médias
  }

  const totalScore = Math.round(
    breakdown.quality * (weights.quality / 100) +
    breakdown.length * (weights.length / 100) +
    breakdown.relevance * (weights.relevance / 100) +
    breakdown.structure * (weights.structure / 100) +
    breakdown.engagement * (weights.engagement / 100) +
    breakdown.keyword * (weights.keyword / 100) +
    breakdown.media * (weights.media / 100)
  )

  const recommendations = generateRecommendations(course, lessons, breakdown, keyword)

  return {
    totalScore,
    breakdown,
    recommendations,
    keyword
  }
}

/**
 * Score de qualité du contenu (0-100)
 * - Présence et longueur de la description
 * - Qualité du titre
 * - Richesse du contenu des leçons
 */
function calculateQualityScore(course: Course, lessons: Lesson[]): number {
  let score = 0

  // Description du cours (0-30 points)
  if (course.description) {
    const descLength = course.description.length
    if (descLength >= 300) {
      score += 30
    } else if (descLength >= 150) {
      score += 20
    } else if (descLength >= 50) {
      score += 10
    }
  }

  // Qualité du titre (0-20 points)
  const titleLength = course.title.length
  if (titleLength >= 10 && titleLength <= 60) {
    score += 20
  } else if (titleLength >= 5 && titleLength <= 80) {
    score += 10
  }

  // Richesse du contenu des leçons (0-50 points)
  // Minimum recommandé : 500 mots ≈ 3000 caractères par leçon
  if (lessons.length > 0) {
    const avgLessonLength = lessons.reduce((sum, lesson) => {
      const contentLength = (lesson.description || '').length
      return sum + contentLength
    }, 0) / lessons.length

    if (avgLessonLength >= 3000) {
      score += 50 // 500+ mots - Excellent
    } else if (avgLessonLength >= 2000) {
      score += 40 // 300-400 mots - Très bon
    } else if (avgLessonLength >= 1500) {
      score += 30 // 200-250 mots - Bon
    } else if (avgLessonLength >= 1000) {
      score += 20 // 150-200 mots - Correct
    } else if (avgLessonLength >= 500) {
      score += 10 // 75-100 mots - Minimum acceptable
    }
  }

  return Math.min(score, 100)
}

/**
 * Détecte l'expression clé principale du cours
 * Extrait les mots-clés du titre et vérifie leur présence dans la description et les leçons
 */
function detectMainKeyword(course: Course, lessons: Lesson[]): string | undefined {
  // Extraire les mots significatifs du titre (exclure les mots vides)
  const stopWords = new Set(['de', 'du', 'des', 'le', 'la', 'les', 'un', 'une', 'et', 'ou', 'à', 'pour', 'avec', 'sur', 'dans', 'par', 'les', 'maîtriser', 'apprendre', 'cours', 'guide', 'tutoriel'])
  
  const titleWords = course.title
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
  
  // Trouver le mot ou groupe de mots le plus fréquent dans le titre
  const wordFreq = new Map<string, number>()
  titleWords.forEach(word => {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
  })
  
  // Chercher des expressions de 2-3 mots dans le titre
  const phrases: string[] = []
  for (let i = 0; i < titleWords.length - 1; i++) {
    const twoWord = `${titleWords[i]} ${titleWords[i + 1]}`
    if (twoWord.length > 5) phrases.push(twoWord)
    if (i < titleWords.length - 2) {
      const threeWord = `${titleWords[i]} ${titleWords[i + 1]} ${titleWords[i + 2]}`
      if (threeWord.length > 8) phrases.push(threeWord)
    }
  }
  
  // Vérifier la présence dans la description et les leçons
  const allContent = [
    course.description || '',
    ...lessons.map(l => l.title + ' ' + (l.description || ''))
  ].join(' ').toLowerCase()
  
  // Trouver l'expression la plus pertinente (présente dans le contenu)
  let bestKeyword: string | undefined
  let bestScore = 0
  
  // D'abord vérifier les expressions de 2-3 mots
  for (const phrase of phrases) {
    const count = (allContent.match(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length
    if (count > bestScore) {
      bestScore = count
      bestKeyword = phrase
    }
  }
  
  // Sinon, prendre le mot le plus fréquent du titre qui apparaît dans le contenu
  if (!bestKeyword || bestScore < 2) {
    for (const [word] of wordFreq.entries()) {
      const count = (allContent.match(new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')) || []).length
      if (count > bestScore) {
        bestScore = count
        bestKeyword = word
      }
    }
  }
  
  return bestKeyword && bestScore >= 2 ? bestKeyword : undefined
}

/**
 * Score d'expression clé (0-100)
 * - Présence d'une expression clé claire dans le titre
 * - Récurrence de l'expression clé dans la description
 * - Utilisation de l'expression clé dans les leçons
 */
function calculateKeywordScore(course: Course, lessons: Lesson[], keyword?: string): number {
  if (!keyword) {
    return 0
  }
  
  let score = 0
  const keywordLower = keyword.toLowerCase()
  
  // Présence dans le titre (0-30 points)
  if (course.title.toLowerCase().includes(keywordLower)) {
    score += 30
  }
  
  // Présence dans la description (0-40 points)
  if (course.description) {
    const descLower = course.description.toLowerCase()
    const count = (descLower.match(new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')) || []).length
    if (count >= 3) {
      score += 40 // 3+ occurrences - Excellent
    } else if (count >= 2) {
      score += 30 // 2 occurrences - Bon
    } else if (count >= 1) {
      score += 20 // 1 occurrence - Correct
    }
  }
  
  // Utilisation dans les leçons (0-30 points)
  if (lessons.length > 0) {
    const lessonsWithKeyword = lessons.filter(lesson => {
      const content = (lesson.title + ' ' + (lesson.description || '')).toLowerCase()
      return content.includes(keywordLower)
    }).length
    
    const ratio = lessonsWithKeyword / lessons.length
    if (ratio >= 0.5) {
      score += 30 // 50%+ leçons - Excellent
    } else if (ratio >= 0.3) {
      score += 20 // 30-49% - Bon
    } else if (ratio >= 0.1) {
      score += 10 // 10-29% - Correct
    }
  }
  
  return Math.min(score, 100)
}

/**
 * Score de médias/visuels (0-100)
 * - Présence de vidéos YouTube
 * - Présence de références visuelles (accords, tablatures, HTML)
 * - Diversité des médias
 */
function calculateMediaScore(_course: Course, lessons: Lesson[]): number {
  if (lessons.length === 0) {
    return 0
  }
  
  let score = 0
  
  // Compter les médias dans toutes les leçons
  let youtubeCount = 0
  let visualCount = 0
  
  lessons.forEach(lesson => {
    const description = lesson.description || ''
    const parsed = parseLessonContent(description)
    
    // Vidéos YouTube
    if (parsed.youtubeLinks && parsed.youtubeLinks.length > 0) {
      youtubeCount += parsed.youtubeLinks.length
    }
    
    // Contenu visuel (accords, tablatures, HTML, artistes)
    if (parsed.chordNames && parsed.chordNames.length > 0) {
      visualCount++
    }
    if (parsed.tablatureId) {
      visualCount++
    }
    if (parsed.htmlBlocks && parsed.htmlBlocks.length > 0) {
      visualCount++
    }
    if (parsed.artistName) {
      visualCount++
    }
  })
  
  // Score pour les vidéos YouTube (0-50 points)
  const youtubeRatio = youtubeCount / lessons.length
  if (youtubeRatio >= 0.5) {
    score += 50 // 50%+ leçons avec YouTube - Excellent
  } else if (youtubeRatio >= 0.3) {
    score += 35 // 30-49% - Bon
  } else if (youtubeRatio >= 0.1) {
    score += 20 // 10-29% - Correct
  } else if (youtubeCount > 0) {
    score += 10 // Au moins une vidéo
  }
  
  // Score pour le contenu visuel (0-50 points)
  const visualRatio = visualCount / lessons.length
  if (visualRatio >= 0.8) {
    score += 50 // 80%+ leçons avec visuels - Excellent
  } else if (visualRatio >= 0.5) {
    score += 35 // 50-79% - Bon
  } else if (visualRatio >= 0.3) {
    score += 20 // 30-49% - Correct
  } else if (visualCount > 0) {
    score += 10 // Au moins un visuel
  }
  
  return Math.min(score, 100)
}

/**
 * Score de longueur (0-100)
 * - Nombre de leçons (8+ recommandé)
 * - Durée totale (60+ min recommandé)
 * - Longueur totale du contenu (5000+ chars recommandé)
 * Aligné avec le prompt Gemini : 8+ leçons, durée 60+ min, contenu total 5000+ chars
 */
function calculateLengthScore(course: Course, lessons: Lesson[]): number {
  let score = 0

  // Nombre de leçons (0-40 points)
  // Aligné avec "8+ leçons" du prompt
  if (lessons.length >= 8) {
    score += 40 // 8+ leçons - Score maximum
  } else if (lessons.length >= 5) {
    score += 30 // 5-7 leçons - Bon
  } else if (lessons.length >= 3) {
    score += 20 // 3-4 leçons - Correct
  } else if (lessons.length >= 1) {
    score += 10 // 1-2 leçons - Minimum
  }

  // Durée totale (0-30 points)
  // Aligné avec "durée 60+ min" du prompt
  if (course.duration) {
    if (course.duration >= 60) {
      score += 30 // 60+ min - Score maximum
    } else if (course.duration >= 30) {
      score += 20 // 30-59 min - Bon
    } else if (course.duration >= 15) {
      score += 10 // 15-29 min - Correct
    }
  }

  // Longueur totale du contenu (0-30 points)
  // Aligné avec "contenu total 5000+ chars" du prompt
  const totalContentLength = lessons.reduce((sum, lesson) => {
    return sum + (lesson.description || '').length
  }, 0) + (course.description || '').length

  if (totalContentLength >= 5000) {
    score += 30 // 5000+ chars - Score maximum
  } else if (totalContentLength >= 3000) {
    score += 20 // 3000-4999 chars - Bon
  } else if (totalContentLength >= 1500) {
    score += 10 // 1500-2999 chars - Correct
  }

  return Math.min(score, 100)
}

/**
 * Score de pertinence (0-100)
 * - Présence et qualité des tags (5+ tags recommandés, 5-8 tags idéal)
 * - Catégorie bien définie
 * - Difficulté indiquée
 * Aligné avec le prompt Gemini : 5+ tags, catégorie bien définie, difficulté indiquée
 */
function calculateRelevanceScore(course: Course, _lessons: Lesson[]): number {
  let score = 0

  // Tags (0-50 points) - Aligné avec "5+ tags" du prompt
  // Le prompt recommande 5-8 tags pertinents (qualité > quantité)
  if (course.tags && course.tags.length > 0) {
    if (course.tags.length >= 5 && course.tags.length <= 8) {
      // Zone idéale : 5-8 tags pertinents
      score += 50
    } else if (course.tags.length >= 3 && course.tags.length < 5) {
      // Minimum acceptable
      score += 35
    } else if (course.tags.length > 8) {
      // Trop de tags (peut indiquer manque de pertinence)
      score += 40
    } else if (course.tags.length >= 1) {
      // Très peu de tags
      score += 20
    }
  }

  // Catégorie (0-25 points)
  if (course.category && course.category.trim().length > 0) {
    score += 25
  }

  // Difficulté (0-25 points)
  if (course.difficulty) {
    score += 25
  }

  return Math.min(score, 100)
}

/**
 * Score de structure (0-100)
 * - Ordre des leçons
 * - Présence d'une progression logique
 * - Diversité des types de contenu
 */
function calculateStructureScore(_course: Course, lessons: Lesson[]): number {
  let score = 0

  // Progression logique (0-50 points)
  if (lessons.length >= 3) {
    const hasOrder = lessons.every((lesson, index) => 
      lesson.order_index === index || lesson.order_index === index + 1
    )
    if (hasOrder) {
      score += 50
    } else {
      score += 25
    }
  } else if (lessons.length > 0) {
    score += 30
  }

  // Diversité des types de contenu (0-50 points)
  const contentTypeCount = new Set(lessons.map(l => l.content_type)).size
  if (contentTypeCount >= 3) {
    score += 50
  } else if (contentTypeCount >= 2) {
    score += 30
  } else if (contentTypeCount >= 1) {
    score += 15
  }

  return Math.min(score, 100)
}

/**
 * Score d'engagement (0-100)
 * - 50%+ leçons interactives (aligné avec le prompt Gemini)
 * - Contenu riche (accords, tablatures, HTML)
 * Aligné avec le prompt Gemini : 50%+ leçons interactives, contenu riche
 */
function calculateEngagementScore(_course: Course, lessons: Lesson[]): number {
  let score = 0

  if (lessons.length === 0) {
    return 0
  }

  // Actions interactives (0-50 points)
  // Aligné avec "50%+ leçons interactives" du prompt
  const interactiveLessons = lessons.filter(lesson => 
    lesson.action_type && lesson.action_target
  ).length

  const interactiveRatio = interactiveLessons / lessons.length
  
  if (interactiveRatio >= 0.5) {
    // 50%+ leçons interactives - Score maximum
    score += 50
  } else if (interactiveRatio >= 0.3) {
    // 30-49% - Bon
    score += 35
  } else if (interactiveRatio >= 0.1) {
    // 10-29% - Correct
    score += 20
  } else if (interactiveRatio > 0) {
    // < 10% - Minimum
    score += 10
  }

  // Contenu riche (0-50 points)
  // Aligné avec "contenu riche (accords, tablatures, HTML)" du prompt
  const richContentLessons = lessons.filter(lesson => {
    const desc = lesson.description || ''
    return desc.includes('[chord:') || 
           desc.includes('[tablature:') || 
           desc.includes('[fulltablature:') ||
           desc.includes('[html]') ||
           desc.includes('[artist:') ||
           desc.includes('youtube.com') ||
           desc.includes('youtu.be')
  }).length

  const richContentRatio = richContentLessons / lessons.length
  
  if (richContentRatio >= 0.5) {
    // 50%+ leçons avec contenu riche - Score maximum
    score += 50
  } else if (richContentRatio >= 0.3) {
    // 30-49% - Bon
    score += 35
  } else if (richContentRatio >= 0.1) {
    // 10-29% - Correct
    score += 20
  } else if (richContentRatio > 0) {
    // < 10% - Minimum
    score += 10
  }

  return Math.min(score, 100)
}

/**
 * Génère des recommandations pour améliorer le score
 */
function generateRecommendations(
  course: Course,
  lessons: Lesson[],
  breakdown: CourseScore['breakdown'],
  keyword?: string
): string[] {
  const recommendations: string[] = []

  if (breakdown.quality < 70) {
    if (!course.description || course.description.length < 300) {
      recommendations.push('Ajoutez une description plus détaillée et engageante (minimum 300 caractères, idéalement 400-600)')
    }
    if (lessons.length > 0) {
      const avgLength = lessons.reduce((sum, l) => sum + (l.description || '').length, 0) / lessons.length
      if (avgLength < 3000) {
        recommendations.push(`Enrichissez massivement le contenu des leçons (minimum 500 mots ≈ 3000 caractères par leçon, actuellement ${Math.round(avgLength)} caractères en moyenne)`)
      } else if (avgLength < 2000) {
        recommendations.push(`Enrichissez davantage le contenu des leçons (objectif 500 mots ≈ 3000 caractères par leçon, actuellement ${Math.round(avgLength)} caractères en moyenne)`)
      }
    }
  }

  if (breakdown.length < 70) {
    if (lessons.length < 8) {
      recommendations.push(`Ajoutez plus de leçons (actuellement ${lessons.length}, recommandé: 8+ leçons)`)
    }
    if (!course.duration || course.duration < 60) {
      recommendations.push('Indiquez une durée plus réaliste (minimum 60 minutes recommandé)')
    }
    const totalContentLength = lessons.reduce((sum, l) => sum + (l.description || '').length, 0) + (course.description || '').length
    if (totalContentLength < 5000) {
      recommendations.push(`Enrichissez le contenu total (actuellement ${totalContentLength} caractères, recommandé: 5000+ caractères)`)
    }
  }

  if (breakdown.relevance < 70) {
    if (!course.tags || course.tags.length < 5) {
      recommendations.push('Ajoutez 5-8 tags pertinents pour améliorer la découvrabilité (qualité > quantité)')
    } else if (course.tags.length > 8) {
      recommendations.push('Réduisez le nombre de tags à 5-8 tags vraiment pertinents (qualité > quantité)')
    }
  }

  if (breakdown.structure < 70) {
    if (lessons.length > 0) {
      const hasMixedTypes = new Set(lessons.map(l => l.content_type)).size > 1
      if (!hasMixedTypes) {
        recommendations.push('Variez les types de contenu (text, video, interactive)')
      }
    }
  }

  if (breakdown.engagement < 70) {
    const interactiveRatio = lessons.filter(l => l.action_type && l.action_target).length / Math.max(lessons.length, 1)
    if (interactiveRatio < 0.5) {
      recommendations.push('Ajoutez des actions interactives dans au moins 50% des leçons (objectif : 50%+ leçons interactives)')
    }
    
    const richContentRatio = lessons.filter(l => {
      const desc = l.description || ''
      return desc.includes('[chord:') || 
             desc.includes('[tablature:') || 
             desc.includes('[html]') ||
             desc.includes('[artist:') ||
             desc.includes('youtube.com') ||
             desc.includes('youtu.be')
    }).length / Math.max(lessons.length, 1)
    
    if (richContentRatio < 0.5) {
      recommendations.push('Enrichissez le contenu avec des références [chord:], [tablature:], [html], [artist:] ou des liens YouTube')
    }
  }

  // Recommandations pour l'expression clé
  if (breakdown.keyword < 70) {
    if (!keyword) {
      recommendations.push('Définissez une expression clé principale dans le titre et utilisez-la dans la description et les leçons')
    } else {
      const keywordLower = keyword.toLowerCase()
      const descCount = (course.description || '').toLowerCase().split(keywordLower).length - 1
      if (descCount < 2) {
        recommendations.push(`Utilisez l'expression clé "${keyword}" au moins 2-3 fois dans la description du cours`)
      }
      const lessonsWithKeyword = lessons.filter(l => {
        const content = (l.title + ' ' + (l.description || '')).toLowerCase()
        return content.includes(keywordLower)
      }).length
      if (lessonsWithKeyword < lessons.length * 0.5) {
        recommendations.push(`Utilisez l'expression clé "${keyword}" dans au moins 50% des leçons pour améliorer la cohérence`)
      }
    }
  }

  // Recommandations pour les médias
  if (breakdown.media < 70) {
    const youtubeCount = lessons.reduce((sum, l) => {
      const parsed = parseLessonContent(l.description || '')
      return sum + (parsed.youtubeLinks?.length || 0)
    }, 0)
    
    if (youtubeCount === 0) {
      recommendations.push('Ajoutez des vidéos YouTube pertinentes dans les leçons pour enrichir le contenu multimédia')
    } else if (youtubeCount < lessons.length * 0.3) {
      recommendations.push(`Ajoutez plus de vidéos YouTube (actuellement ${youtubeCount}, recommandé: 30%+ des leçons)`)
    }
    
    const visualCount = lessons.filter(l => {
      const parsed = parseLessonContent(l.description || '')
      return (parsed.chordNames && parsed.chordNames.length > 0) ||
             parsed.tablatureId ||
             (parsed.htmlBlocks && parsed.htmlBlocks.length > 0) ||
             parsed.artistName
    }).length
    
    if (visualCount < lessons.length * 0.5) {
      recommendations.push('Ajoutez plus de contenu visuel (accords, tablatures, diagrammes HTML) dans les leçons')
    }
  }

  return recommendations
}

/**
 * Obtient la couleur selon le score
 */
export function getScoreColor(score: number): 'red' | 'orange' | 'green' {
  if (score < 70) return 'red'
  if (score < 90) return 'orange'
  return 'green'
}

/**
 * Score de qualité d'une leçon individuelle (0-100)
 */
export interface LessonScore {
  totalScore: number
  breakdown: {
    length: number
    richness: number
    title: number
    interactivity: number
  }
  recommendations: string[]
}

/**
 * Calcule le score de qualité d'une leçon (0-100)
 */
export function calculateLessonQualityScore(lesson: Lesson, courseDifficulty?: 'beginner' | 'intermediate' | 'advanced'): LessonScore {
  const breakdown = {
    length: calculateLessonLengthScore(lesson),
    richness: calculateLessonRichnessScore(lesson),
    title: calculateLessonTitleScore(lesson),
    interactivity: calculateLessonInteractivityScore(lesson)
  }

  // Poids pour chaque critère (doit totaliser 100)
  const weights = {
    length: 40,      // La longueur est le critère principal (500 mots minimum)
    richness: 35,    // Richesse du contenu (références, exemples)
    title: 10,       // Qualité du titre
    interactivity: 15 // Actions interactives
  }

  const totalScore = Math.round(
    breakdown.length * (weights.length / 100) +
    breakdown.richness * (weights.richness / 100) +
    breakdown.title * (weights.title / 100) +
    breakdown.interactivity * (weights.interactivity / 100)
  )

  const recommendations = generateLessonRecommendations(lesson, breakdown, courseDifficulty)

  return {
    totalScore,
    breakdown,
    recommendations
  }
}

/**
 * Score de longueur du contenu (0-100)
 * Minimum recommandé : 500 mots ≈ 3000 caractères
 */
function calculateLessonLengthScore(lesson: Lesson): number {
  const contentLength = (lesson.description || '').length
  
  if (contentLength >= 3000) {
    return 100 // 500+ mots - Excellent
  } else if (contentLength >= 2000) {
    return 80  // 300-400 mots - Très bon
  } else if (contentLength >= 1500) {
    return 60  // 200-250 mots - Bon
  } else if (contentLength >= 1000) {
    return 40  // 150-200 mots - Correct
  } else if (contentLength >= 500) {
    return 20  // 75-100 mots - Minimum acceptable
  } else {
    return 0   // Insuffisant
  }
}

/**
 * Score de richesse du contenu (0-100)
 * - Références d'accords [chord:]
 * - Références de tablatures [tablature:]
 * - Références d'artistes [artist:]
 * - Blocs HTML/SVG [html]
 */
function calculateLessonRichnessScore(lesson: Lesson): number {
  const description = lesson.description || ''
  let score = 0

  // Longueur de base du texte (hors références) - 0-40 points
  const textContent = description
    .replace(/\[chord:[^\]]+\]/g, '')
    .replace(/\[tablature:[^\]]+\]/g, '')
    .replace(/\[artist:[^\]]+\]/g, '')
    .replace(/\[html[^\]]*\][\s\S]*?\[\/html\]/g, '')
    .trim()

  const textLength = textContent.length
  if (textLength >= 2000) {
    score += 40
  } else if (textLength >= 1500) {
    score += 30
  } else if (textLength >= 1000) {
    score += 20
  } else if (textLength >= 500) {
    score += 10
  }

  // Références d'accords - 0-20 points
  const chordMatches = (description.match(/\[chord:[^\]]+\]/g) || []).length
  if (chordMatches >= 3) {
    score += 20
  } else if (chordMatches >= 2) {
    score += 15
  } else if (chordMatches >= 1) {
    score += 10
  }

  // Références de tablatures - 0-20 points
  const tabMatches = (description.match(/\[tablature:[^\]]+\]/g) || []).length
  if (tabMatches >= 1) {
    score += 20
  } else if (description.includes('[fulltablature:')) {
    score += 20
  }

  // Références d'artistes - 0-10 points
  if (description.includes('[artist:')) {
    score += 10
  }

  // Blocs HTML/SVG - 0-10 points
  if (description.includes('[html]')) {
    score += 10
  }

  return Math.min(score, 100)
}

/**
 * Score de qualité du titre (0-100)
 */
function calculateLessonTitleScore(lesson: Lesson): number {
  const titleLength = lesson.title.length
  
  // Titre optimal : 20-60 caractères
  if (titleLength >= 20 && titleLength <= 60) {
    return 100
  } else if (titleLength >= 10 && titleLength <= 80) {
    return 70
  } else if (titleLength >= 5 && titleLength <= 100) {
    return 40
  } else if (titleLength > 0) {
    return 20
  }
  
  return 0
}

/**
 * Score d'interactivité (0-100)
 */
function calculateLessonInteractivityScore(lesson: Lesson): number {
  let score = 0

  // Action interactive présente - 0-100 points
  if (lesson.action_type && lesson.action_target) {
    score += 100
  }

  return score
}

/**
 * Génère des recommandations pour améliorer le score de la leçon
 */
function generateLessonRecommendations(
  lesson: Lesson,
  breakdown: LessonScore['breakdown'],
  courseDifficulty?: 'beginner' | 'intermediate' | 'advanced'
): string[] {
  const recommendations: string[] = []
  const contentLength = (lesson.description || '').length

  if (breakdown.length < 70) {
    if (contentLength < 3000) {
      recommendations.push(`Enrichissez massivement le contenu (minimum 500 mots ≈ 3000 caractères, actuellement ${contentLength} caractères)`)
    } else if (contentLength < 2000) {
      recommendations.push(`Enrichissez davantage le contenu (objectif 500 mots ≈ 3000 caractères, actuellement ${contentLength} caractères)`)
    }
  }

  if (breakdown.richness < 70) {
    const description = lesson.description || ''
    const hasChords = description.includes('[chord:')
    const hasTabs = description.includes('[tablature:') || description.includes('[fulltablature:')
    const hasArtist = description.includes('[artist:')
    const hasHtml = description.includes('[html]')

    if (!hasChords && !hasTabs && !hasArtist && !hasHtml) {
      recommendations.push('Ajoutez des références enrichies : [chord:], [tablature:], [artist:] ou [html]')
    } else {
      if (!hasChords) recommendations.push('Ajoutez des références d\'accords avec [chord:Nom]')
      if (!hasTabs) recommendations.push('Ajoutez des références de tablatures avec [tablature:id]')
      if (!hasArtist && courseDifficulty !== 'beginner') recommendations.push('Ajoutez des références d\'artistes avec [artist:Nom]')
    }

    // Vérifier la longueur du texte sans références
    const textOnly = description
      .replace(/\[chord:[^\]]+\]/g, '')
      .replace(/\[tablature:[^\]]+\]/g, '')
      .replace(/\[artist:[^\]]+\]/g, '')
      .replace(/\[html[^\]]*\][\s\S]*?\[\/html\]/g, '')
      .trim()
    
    if (textOnly.length < 1500) {
      recommendations.push('Développez le texte explicatif (contexte, explications détaillées, exemples)')
    }
  }

  if (breakdown.title < 70) {
    const titleLength = lesson.title.length
    if (titleLength < 10) {
      recommendations.push('Le titre est trop court (minimum 10 caractères recommandé)')
    } else if (titleLength > 80) {
      recommendations.push('Le titre est trop long (maximum 80 caractères recommandé)')
    }
  }

  if (breakdown.interactivity < 100) {
    if (!lesson.action_type || !lesson.action_target) {
      recommendations.push('Ajoutez une action interactive pour améliorer l\'engagement (action_type et action_target)')
    }
  }

  return recommendations
}

