/**
 * Service pour interagir avec l'API Google Gemini
 * Utilise Gemini 3 Pro Preview (gratuit) pour l'optimisation de contenu
 */

import { GEMINI_API_KEY } from '../config'
import { Course, Lesson, QuizQuestion } from './supabase'
import { CourseScore, calculateCourseQualityScore } from '../utils/courseQualityScore'
import { musicBrainzService } from './musicbrainz'
import { freesoundService } from './freesound'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent'
const GEMINI_IMAGE_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'

export interface OptimizedCourse {
  course: Partial<Course>
  lessons?: Array<Partial<Lesson> & { 
    id?: string // ID existant si mise à jour, absent si nouvelle leçon
    order_index?: number // Position dans l'ordre
    action?: 'create' | 'update' | 'delete' // Action à effectuer
  }>
  quizQuestions?: Array<Partial<QuizQuestion> & {
    id?: string // ID existant si mise à jour, absent si nouvelle question
    order_index?: number // Position dans l'ordre
    action?: 'create' | 'update' | 'delete' // Action à effectuer
  }>
  deletedLessonIds?: string[] // IDs des leçons à supprimer
  deletedQuestionIds?: string[] // IDs des questions à supprimer (pour les quiz)
}

export interface OptimizationResult {
  optimized: OptimizedCourse
  originalScore: number
  estimatedNewScore: number
  changes: string[]
  validation?: ValidationResult
  biasAnalysis?: import('../utils/courseQualityScore').BiasAnalysis
}

export interface ValidationResult {
  isValid: boolean
  issues: Array<{
    type: 'coherence' | 'duplicate' | 'youtube' | 'tags' | 'plagiarism'
    severity: 'error' | 'warning' | 'info'
    message: string
    suggestion?: string
  }>
}

/**
 * Optimise un cours et ses leçons en utilisant Gemini AI
 */
export async function optimizeCourseWithAI(
  course: Course,
  lessons: Lesson[],
  quizQuestions?: QuizQuestion[]
): Promise<OptimizationResult> {
  if (!GEMINI_API_KEY) {
    throw new Error('Clé API Gemini non configurée. Ajoutez VITE_GEMINI_API_KEY dans votre .env')
  }

  // Calculer le score actuel
  const currentScore = calculateCourseQualityScore(course, lessons)

  // Préparer le prompt pour Gemini
  const prompt = buildOptimizationPrompt(course, lessons, currentScore, quizQuestions)

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 65536,
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Erreur API Gemini: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      )
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Réponse invalide de l\'API Gemini')
    }

    const generatedText = data.candidates[0].content.parts[0].text
    
    // Vérifier si la réponse est complète (finishReason doit être STOP, pas MAX_TOKENS)
    const finishReason = data.candidates[0].finishReason
    if (finishReason === 'MAX_TOKENS') {
      console.warn('La réponse de Gemini a été tronquée (MAX_TOKENS). Le JSON peut être incomplet.')
      // On continue quand même, le parsing essaiera de réparer le JSON
    }

    // Parser la réponse JSON
    const optimized = parseOptimizedContent(generatedText, course, lessons, quizQuestions)

    // Validation multi-critères
    const validation = await validateOptimizedContent(optimized, course, lessons, quizQuestions)

    // Détection de biais et suggestions
    const { detectBiasesAndSuggestions } = await import('../utils/courseQualityScore')
    const biasAnalysis = detectBiasesAndSuggestions(course, lessons, currentScore)

    // Pour les quiz, on ne calcule pas de score estimé avec les leçons
    const isQuiz = course.type === 'quiz'
    
    if (isQuiz) {
      // Pour les quiz, on ne peut pas calculer un score estimé précis sans les questions
      // On retourne le score actuel comme estimation
      const estimatedScore = currentScore
      
      // Générer la liste des changements
      const changes = generateChangesList(course, lessons, optimized, quizQuestions)
      
      return {
        optimized,
        originalScore: currentScore.totalScore,
        estimatedNewScore: estimatedScore.totalScore,
        changes
      }
    }
    
    // Calculer le score estimé avec TOUTES les leçons (modifiées, créées, et non modifiées)
    // On commence par copier toutes les leçons existantes
    const estimatedLessons: Lesson[] = lessons.map(lesson => ({ ...lesson }))
    
    // Créer un Set des IDs des leçons qui seront supprimées
    const deletedLessonIds = new Set(optimized.deletedLessonIds || [])
    
    // Filtrer les leçons supprimées
    const remainingLessons = estimatedLessons.filter(lesson => !deletedLessonIds.has(lesson.id))
    
    // Traiter les leçons optimisées (mises à jour et créations)
    if (optimized.lessons) {
      for (const optimizedLesson of optimized.lessons) {
      if (optimizedLesson.action === 'update' && optimizedLesson.id) {
        // Mettre à jour la leçon existante dans la liste
        const lessonIndex = remainingLessons.findIndex(l => l.id === optimizedLesson.id)
        if (lessonIndex !== -1) {
          remainingLessons[lessonIndex] = {
            ...remainingLessons[lessonIndex],
            ...optimizedLesson,
            course_id: course.id
          } as Lesson
        }
      } else if (optimizedLesson.action === 'create') {
        // Ajouter la nouvelle leçon
        remainingLessons.push({
          id: `temp-${Date.now()}-${Math.random()}`,
          course_id: course.id,
          title: optimizedLesson.title || 'Nouvelle leçon',
          description: optimizedLesson.description || '',
          content_type: (optimizedLesson.content_type || 'text') as Lesson['content_type'],
          order_index: optimizedLesson.order_index || 0,
          action_type: optimizedLesson.action_type || null,
          action_target: optimizedLesson.action_target || null,
          action_value: optimizedLesson.action_value || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }
    }
    
      // Trier les leçons par order_index pour refléter la réorganisation
      remainingLessons.sort((a, b) => {
        const orderA = optimized.lessons!.find(l => l.id === a.id)?.order_index ?? a.order_index
        const orderB = optimized.lessons!.find(l => l.id === b.id)?.order_index ?? b.order_index
        return orderA - orderB
      })
    }
    
    // Calculer le score estimé avec toutes les leçons (y compris les non modifiées)
    const estimatedScore = calculateCourseQualityScore(
      { ...course, ...optimized.course } as Course,
      remainingLessons
    )

    // Générer la liste des changements
    const changes = generateChangesList(course, lessons, optimized, quizQuestions)

    return {
      optimized,
      originalScore: currentScore.totalScore,
      estimatedNewScore: estimatedScore.totalScore,
      changes
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erreur inconnue lors de l\'optimisation')
  }
}

/**
 * Interface pour le contexte enrichi
 */
interface EnrichedContext {
  musicBrainz?: {
    artists?: Array<{ name: string; tags?: string[] }>
    releases?: Array<{ title: string; date?: string }>
    tags?: string[]
  }
  freesound?: {
    samples?: Array<{ name: string; tags: string[]; description: string; license: string }>
    irs?: Array<{ name: string; tags: string[]; description: string }>
  }
  similarCourses?: Array<{ title: string; category: string; tags: string[] }>
}

/**
 * Enrichit le contexte du cours avec MusicBrainz et Freesound
 */
async function enrichCourseContext(
  course: Course,
  lessons: Lesson[]
): Promise<EnrichedContext> {
  const context: EnrichedContext = {}

  try {
    // Extraire les noms d'artistes mentionnés dans le cours
    const artistMatches = [
      ...(course.description || '').matchAll(/\[artist:([^\]]+)\]/g),
      ...lessons.flatMap(l => (l.description || '').matchAll(/\[artist:([^\]]+)\]/g))
    ]
    const artistNames = [...new Set(Array.from(artistMatches, m => m[1]))]

    if (artistNames.length > 0) {
      // Rechercher les artistes dans MusicBrainz
      const artists = await Promise.all(
        artistNames.slice(0, 3).map(name => 
          musicBrainzService.searchArtist(name, 1).catch(() => [])
        )
      )
      const foundArtists = artists.flat()
      
      if (foundArtists.length > 0) {
        context.musicBrainz = {
          artists: foundArtists.map(a => ({
            name: a.name,
            tags: a.tags?.map(t => t.name) || []
          })),
          tags: [...new Set(foundArtists.flatMap(a => a.tags?.map(t => t.name) || []))]
        }
      }
    }

    // Rechercher des samples/IRs pertinents dans Freesound
    const courseKeywords = [
      ...(course.tags || []),
      course.category,
      ...(course.title.toLowerCase().split(/\s+/).filter(w => w.length > 3))
    ].slice(0, 3)

    if (courseKeywords.length > 0) {
      try {
        // Rechercher des IRs (impulse responses)
        const irResults = await freesoundService.searchSounds({
          query: `impulse response ${courseKeywords[0]}`,
          filter: 'tag:impulse-response OR tag:ir',
          page_size: 3
        }).catch(() => ({ results: [] }))

        // Rechercher des samples musicaux
        const sampleResults = await freesoundService.searchSounds({
          query: courseKeywords.join(' '),
          filter: 'license:"Attribution" OR license:"Creative Commons 0"',
          page_size: 3
        }).catch(() => ({ results: [] }))

        context.freesound = {
          irs: irResults.results.slice(0, 2).map(s => ({
            name: s.name,
            tags: s.tags || [],
            description: s.description || ''
          })),
          samples: sampleResults.results.slice(0, 2).map(s => ({
            name: s.name,
            tags: s.tags || [],
            description: s.description || '',
            license: s.license
          }))
        }
      } catch (error) {
        console.warn('Erreur lors de la recherche Freesound:', error)
      }
    }
  } catch (error) {
    console.warn('Erreur lors de l\'enrichissement du contexte:', error)
  }

  return context
}

/**
 * Détecte si un cours est de type "apprendre [chanson]"
 */
function isSongLearningCourse(course: Course): boolean {
  const titleLower = course.title.toLowerCase()
  return titleLower.includes('apprendre') || 
         titleLower.includes('jouer') ||
         titleLower.includes('maîtriser') ||
         (titleLower.includes('cours') && (titleLower.includes('guitare') || titleLower.includes('basse') || titleLower.includes('piano')))
}

/**
 * Génère des instructions personnalisées selon la catégorie
 */
function getCategorySpecificInstructions(category: string): string {
  const categoryMap: Record<string, string> = {
    'effects': `
**CATÉGORIE : EFFETS**

Vocabulaire et références spécifiques :
- Utilisez des termes techniques précis : "modulation", "feedback", "LFO", "wet/dry", "time", "depth", "rate"
- Références d'artistes emblématiques pour chaque effet :
  * Chorus : The Police, The Cure, Andy Summers
  * Flanger : Eddie Van Halen, David Gilmour
  * Phaser : Jimi Hendrix, Tame Impala
  * Distortion : Tony Iommi, Kurt Cobain, Slash
  * Delay : The Edge, David Gilmour, U2
- Exemples concrets de morceaux utilisant ces effets
- Comparaisons entre modèles de pédales (Boss, MXR, Electro-Harmonix)
- Conseils de placement dans la chaîne d'effets
- Paramètres typiques pour différents styles musicaux
`,
    'amps': `
**CATÉGORIE : AMPLIFICATEURS**

Vocabulaire et références spécifiques :
- Terminologie technique : "preamp", "power amp", "tone stack", "gain staging", "headroom", "sag"
- Références d'amplis légendaires :
  * Fender : Twin Reverb, Deluxe Reverb, Bassman
  * Marshall : JCM800, Plexi, JTM45
  * Vox : AC30, AC15
  * Mesa Boogie : Dual Rectifier, Mark V
- Styles musicaux associés à chaque type d'ampli
- Techniques de réglage selon le contexte (studio, live, enregistrement)
- Comparaisons entre tubes et solid-state
- Conseils de maintenance et de remplacement de tubes
- Interaction avec les micros de guitare (humbucker vs single coil)
`,
    'basics': `
**CATÉGORIE : BASES**

Vocabulaire et références spécifiques :
- Termes pédagogiques accessibles : "fondamentales", "harmoniques", "fréquences", "dynamique"
- Références d'artistes pour illustrer les concepts :
  * Techniques de base : Eric Clapton, B.B. King, Chuck Berry
  * Théorie musicale : The Beatles, Pink Floyd
- Exemples progressifs du simple au complexe
- Analogies et métaphores pour faciliter la compréhension
- Exercices pratiques étape par étape
- Erreurs courantes à éviter
- Ressources complémentaires pour approfondir
`,
    'techniques': `
**CATÉGORIE : TECHNIQUES**

Vocabulaire et références spécifiques :
- Terminologie technique avancée : "bending", "vibrato", "legato", "staccato", "palm muting", "tapping"
- Maîtres de chaque technique :
  * Bending : B.B. King, Stevie Ray Vaughan
  * Tapping : Eddie Van Halen, Steve Vai
  * Sweep picking : Yngwie Malmsteen, Jason Becker
  * Fingerpicking : Tommy Emmanuel, Chet Atkins
- Démonstrations visuelles et audio
- Progression technique du débutant à l'expert
- Exercices spécifiques pour développer chaque technique
- Analyse de solos emblématiques
- Conseils pour éviter les blessures (tendinite, etc.)
`
  }

  return categoryMap[category] || `
**CATÉGORIE : ${category.toUpperCase()}**

Adaptez le vocabulaire et les références selon le sujet spécifique du cours.
Utilisez des exemples concrets et des références d'artistes pertinents.
`
}

/**
 * Construit le prompt pour l'optimisation
 */
function buildOptimizationPrompt(
  course: Course,
  lessons: Lesson[],
  score: CourseScore,
  quizQuestions?: QuizQuestion[],
  enrichedContext?: EnrichedContext
): string {
  const difficultyMap: Record<string, string> = {
    'beginner': 'débutant',
    'intermediate': 'intermédiaire',
    'advanced': 'avancé'
  }
  const difficultyFr = difficultyMap[course.difficulty] || course.difficulty
  
  // Détecter le type de cours
  const isQuiz = course.type === 'quiz'
  const isSongCourse = isSongLearningCourse(course)
  const isPreset = course.type === 'preset'
  
  // Déterminer le nombre de questions cible pour les quiz selon la difficulté
  let targetQuestions = 10
  if (isQuiz) {
    if (course.difficulty === 'beginner') {
      targetQuestions = 5
    } else if (course.difficulty === 'intermediate') {
      targetQuestions = 10
    } else if (course.difficulty === 'advanced') {
      targetQuestions = 20
    }
  }

  let typeSpecificInstructions = ''
  
  if (isQuiz) {
    typeSpecificInstructions = `
**TYPE DE COURS : QUIZ**

Ce cours est un QUIZ. Tu dois optimiser les QUESTIONS, pas les leçons.

**RÈGLES SPÉCIFIQUES POUR LES QUIZ** :
- Nombre de questions cible selon la difficulté :
  * Débutant : 5-8 questions
  * Intermédiaire : 10-15 questions  
  * Avancé : 15-20 questions
- Chaque question doit avoir :
  * Une question claire et précise (50-150 caractères)
  * 4 options de réponse (une seule correcte)
  * Une explication détaillée de la bonne réponse (100-300 caractères)
  * Un niveau de difficulté cohérent avec "${difficultyFr}"
- Les questions doivent couvrir différents aspects du sujet
- Progression logique : questions de base → intermédiaires → avancées
- Évite les questions trop faciles ou trop difficiles pour le niveau
`
  } else if (isSongCourse) {
    typeSpecificInstructions = `
**TYPE DE COURS : APPRENDRE UNE CHANSON**

Ce cours est de type "apprendre [titre de chanson]". Il doit avoir une structure spécifique :

**STRUCTURE OBLIGATOIRE** :
1. **Introduction à la chanson** : Contexte, artiste, style, difficulté
2. **Analyse harmonique** : Accords utilisés, progression, tonalité
3. **Rythme et tempo** : Pattern rythmique, tempo, signature rythmique
4. **Tablature complète** : [fulltablature:id] ou tablature détaillée
5. **Passages difficiles** : Techniques spécifiques, passages à travailler
6. **Conseils d'interprétation** : Nuances, phrasé, style
7. **Exercices progressifs** : Du rythme simple à la version complète
8. **Ressources complémentaires** : Vidéos YouTube, références d'artistes

**CONTENU SPÉCIFIQUE** :
- Références d'accords : [chord:Nom] pour tous les accords de la chanson
- Tablature complète : [fulltablature:id] ou [tablature:id]
- Référence d'artiste : [artist:Nom de l'artiste]
- Vidéos YouTube : Tutoriels de la chanson, versions live, analyses
- Structure claire : Chaque section doit correspondre à une partie de la chanson (intro, couplet, refrain, solo, outro)
`
  } else if (isPreset) {
    typeSpecificInstructions = `
**TYPE DE COURS : PRESET**

Ce cours est un PRESET. Il doit expliquer comment utiliser un preset de son.

**STRUCTURE RECOMMANDÉE** :
1. **Présentation du preset** : Type de son, style musical, contexte d'utilisation
2. **Paramètres détaillés** : Explication de chaque réglage
3. **Applications pratiques** : Morceaux, styles où utiliser ce preset
4. **Variations** : Comment modifier le preset pour d'autres sons
5. **Conseils de mixage** : Comment intégrer ce preset dans un mix
`
  } else {
    typeSpecificInstructions = `
**TYPE DE COURS : ${course.type.toUpperCase()}**

Ce cours est un ${course.type === 'tutorial' ? 'TUTORIEL' : 'GUIDE'}. Il doit être composé de leçons structurées.
`
  }

  // Instructions personnalisées selon la catégorie
  const categoryInstructions = getCategorySpecificInstructions(course.category)

  // Contexte enrichi avec MusicBrainz et Freesound
  let enrichedContextSection = ''
  if (enrichedContext) {
    if (enrichedContext.musicBrainz && (enrichedContext.musicBrainz.artists?.length || enrichedContext.musicBrainz.tags?.length)) {
      enrichedContextSection += `
**RESSOURCES MUSICBRAINZ DISPONIBLES** :
${enrichedContext.musicBrainz.artists?.length ? `- Artistes trouvés : ${enrichedContext.musicBrainz.artists.map(a => a.name).join(', ')}\n` : ''}
${enrichedContext.musicBrainz.tags?.length ? `- Tags musicaux pertinents : ${enrichedContext.musicBrainz.tags.slice(0, 10).join(', ')}\n` : ''}
Utilise ces références pour enrichir le contenu avec des informations précises sur les artistes et styles musicaux.
`
    }
    if (enrichedContext.freesound && (enrichedContext.freesound.irs?.length || enrichedContext.freesound.samples?.length)) {
      enrichedContextSection += `
**RESSOURCES FREESOUND DISPONIBLES** :
${enrichedContext.freesound.irs?.length ? `- IRs (Impulse Responses) : ${enrichedContext.freesound.irs.map(ir => `"${ir.name}" (${ir.tags.join(', ')})`).join(', ')}\n` : ''}
${enrichedContext.freesound.samples?.length ? `- Samples audio : ${enrichedContext.freesound.samples.map(s => `"${s.name}" (${s.tags.join(', ')})`).join(', ')}\n` : ''}
Ces ressources peuvent être mentionnées dans le contenu comme ressources complémentaires (sous licence Creative Commons).
`
    }
  }

  return `Tu es un journaliste musical et professeur d'instrument très expérimenté.
Tu maîtrises la guitare, la basse, la batterie et le piano à un niveau professionnel.
Tu possèdes une grande expertise en matériel, effets, amplis, modélisation numérique et home-studio.
Tu as une culture musicale très étendue : styles, courants, artistes, albums de référence, contexte historique et esthétique.

**OBJECTIF CRITIQUE** :
Enrichir et développer le contenu pédagogique de cours de musique pour obtenir un score de qualité optimal de **90% MINIMUM**. 

⚠️ **IMPORTANT** : Si le score actuel est très bas (ex: 32%), tu dois faire des modifications MASSIVES et ambitieuses pour atteindre 90%+ :
- Créer plusieurs nouvelles leçons complètes (objectif 8+ leçons total)
- Enrichir massivement TOUTES les leçons existantes (500+ mots chacune)
- Ajouter de nombreux tags pertinents (10+ tags)
- Optimiser la description du cours (400-600 caractères)
- Assurer une progression pédagogique logique et structurée

**BARÈME DE SCORING (0-100%)** :
1. **Qualité (30%)** : Description détaillée (300+ chars), titre optimal (10-60 chars), contenu riche des leçons (500+ MOTS par leçon)
2. **Longueur (20%)** : 8+ leçons, durée 60+ min, contenu total 5000+ chars
3. **Pertinence (25%)** : 5+ tags, catégorie bien définie, difficulté indiquée
4. **Structure (15%)** : Ordre logique des leçons, 3+ types de contenu différents
5. **Engagement (10%)** : 50%+ leçons interactives, contenu riche (accords, tablatures, HTML)

${typeSpecificInstructions}

**COURS ACTUEL** :
Titre: ${course.title}
Type: ${course.type}
Description: ${course.description || '(vide)'}
Catégorie: ${course.category}
Difficulté: ${difficultyFr}
Tags: ${course.tags?.join(', ') || '(aucun)'}
Durée: ${course.duration || 'non définie'} minutes
${isQuiz ? `Nombre de questions: ${quizQuestions?.length || 0}` : `Nombre de leçons: ${lessons.length}`}

**SCORE ACTUEL** : ${score.totalScore}%
- Qualité: ${score.breakdown.quality}% (${score.breakdown.quality < 70 ? 'À améliorer' : 'Bon'})
- Longueur: ${score.breakdown.length}% (${score.breakdown.length < 70 ? 'À améliorer' : 'Bon'})
- Pertinence: ${score.breakdown.relevance}% (${score.breakdown.relevance < 70 ? 'À améliorer' : 'Bon'})
- Structure: ${score.breakdown.structure}% (${score.breakdown.structure < 70 ? 'À améliorer' : 'Bon'})
- Engagement: ${score.breakdown.engagement}% (${score.breakdown.engagement < 70 ? 'À améliorer' : 'Bon'})

**RECOMMANDATIONS AUTOMATIQUES** :
${score.recommendations.map(r => `- ${r}`).join('\n')}

${isQuiz ? `
**QUESTIONS ACTUELLES** :
${(quizQuestions || []).map((question, idx) => `
${idx + 1}. ID: ${question.id}
   Question: ${question.question}
   Position: ${question.order_index}
   Options: ${question.options?.join(' | ') || '(aucune)'}
   Bonne réponse: Option ${question.correct_answer + 1}
   Explication: ${question.explanation || '(vide)'}
`).join('\n')}
` : `
**LEÇONS ACTUELLES** :
${lessons.map((lesson, idx) => `
${idx + 1}. ID: ${lesson.id}
   Titre: ${lesson.title}
   Position: ${lesson.order_index}
   Type: ${lesson.content_type}
   Contenu actuel (${(lesson.description || '').length} caractères): ${(lesson.description || '').substring(0, 300)}${(lesson.description || '').length > 300 ? '...' : ''}
   Action interactive: ${lesson.action_type || 'aucune'}
`).join('\n')}
`}

**RÈGLES GÉNÉRALES POUR L'ENRICHISSEMENT** :

1. **Longueur minimale** : Chaque leçon doit contenir au minimum **500 MOTS** (≈ 3000+ caractères). Si le contenu actuel est plus court, enrichis-le considérablement.

2. **Ton et style** :
   - Pédagogique, inspirant et professionnel
   - Comme un professeur passionné qui écrit pour des musiciens
   - Niveau de complexité cohérent avec le niveau "${difficultyFr}"
   - Clair, structuré et progressif

3. **Structure du contenu enrichi** (pour chaque leçon) :
   - **Mise en contexte musicale** : Pourquoi cette leçon est importante pour le musicien
   - **Explication technique détaillée** : Notions théoriques expliquées simplement, applications pratiques
   - **Références concrètes** : Artistes, styles, morceaux emblématiques en lien avec la notion
   - **Conseils de professeur** : Erreurs fréquentes, astuces, bonnes pratiques
   - **Lien avec la musique réelle** : Comment cette notion se manifeste dans des morceaux connus
   - **Exercices concrets** : Propositions d'exercices pratiques
   - **Conseils de travail** : Comment intégrer cela dans sa pratique quotidienne
   - **Variantes** : Selon l'instrument si pertinent (guitare/basse/batterie/piano)
   - **Ressources externes pertinentes** : 
     * Tu PEUX et DOIS utiliser des ressources externes pertinentes pour enrichir le contenu
     * Références YouTube : Inclus des liens vers des tutoriels YouTube pertinents avec explication de pourquoi cette vidéo est utile
     * Format : "Pour approfondir, je recommande ce tutoriel : [Titre de la vidéo](https://youtube.com/watch?v=...). Cette vidéo montre concrètement..."
     * Diagrammes d'accords : Utilise [chord:Nom] pour afficher des diagrammes d'accords avec le module existant de la plateforme
     * Les ressources externes doivent être vraiment pertinentes et ajouter de la valeur pédagogique

4. **Références à utiliser dans le contenu** :
   - Utilise des références [chord:Nom] pour les diagrammes d'accords (le module les affichera automatiquement)
   - Utilise [tablature:id] pour référencer des tablatures
   - Utilise [artist:Nom] pour référencer des artistes
   - Utilise [html]...[/html] pour des blocs HTML/SVG de diagrammes si pertinent
   - Utilise des liens YouTube pertinents pour des tutoriels complémentaires (format Markdown : [Titre](URL))

5. **Description du cours** :
   - Minimum 300 caractères, idéalement 400-600
   - Présente le cours de manière engageante
   - Indique ce que l'apprenant va apprendre
   - Mette en contexte dans l'apprentissage global

6. **Tags** (IMPORTANT mais qualité > quantité) :
   - **5-8 tags pertinents et utiles** suffisent pour un bon score de pertinence
   - Privilégie la QUALITÉ et la PERTINENCE plutôt que la quantité
   - Chaque tag doit être vraiment utile pour la recherche et la découverte du cours
   - Évite les tags redondants, trop génériques ou non pertinents
   - Focus sur : styles musicaux pertinents, techniques enseignées, instruments concernés, concepts clés
   - Ne pas ajouter de tags juste pour augmenter le nombre

**TÂCHE URGENTE** :
Analyse le cours et optimise-le intelligemment pour obtenir un score de **90% MINIMUM ABSOLU**. 

⚠️ **CONTRAINTE STRICTE** : Tu dois atteindre 90%+ sans exception. Si le score actuel est faible (ex: 32%), tu dois être TRÈS ambitieux et créer/enrichir massivement :

1. **Nombre de leçons** : Si le cours a moins de 8 leçons, crée des leçons complètes (500+ mots chacune) jusqu'à atteindre au moins 8 leçons
2. **Enrichissement** : Chaque leçon existante doit contenir minimum 500 mots (≈3000 caractères). Si une leçon est courte, enrichis-la massivement.
3. **Tags** : Ajoute au minimum 10 tags pertinents pour maximiser le score de pertinence
4. **Description** : La description doit faire 400-600 caractères minimum
5. **Progression** : Assure une progression logique avec des order_index bien ordonnés (1, 2, 3...)

Tu peux :
1. Enrichir les leçons existantes
2. CRÉER de nouvelles leçons si nécessaire (pour atteindre 8+ leçons recommandées)
3. SUPPRIMER des leçons redondantes, obsolètes ou de faible qualité
4. RÉORGANISER l'ordre des leçons pour une progression pédagogique logique

Réponds UNIQUEMENT avec un JSON valide au format suivant (sans markdown, sans commentaires) :

${isQuiz ? `
{
  "course": {
    "title": "Titre optimisé (si nécessaire)",
    "description": "Description enrichie et détaillée (400-600 caractères, engageante, présente les objectifs)",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"]
  },
  "quizQuestions": [
    {
      "id": "uuid-existing-question-id", // ID de la question existante si mise à jour/suppression
      "order_index": 1, // Position dans l'ordre (commence à 1)
      "action": "update", // "create" | "update" | "delete"
      "question": "Question claire et précise (50-150 caractères)",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"], // Toujours 4 options
      "correct_answer": 0, // Index de la bonne réponse (0-3)
      "explanation": "Explication détaillée de la bonne réponse (100-300 caractères)"
    },
    {
      "order_index": 2,
      "action": "create", // Nouvelle question à créer
      "question": "Nouvelle question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 1,
      "explanation": "Explication de la bonne réponse"
    }
  ],
  "deletedQuestionIds": ["uuid-to-delete-1", "uuid-to-delete-2"], // IDs des questions à supprimer
  "changes": [
    "Description enrichie de X à Y caractères",
    "Question 1 : Amélioration de la clarté et enrichissement de l'explication",
    "Création de 5 nouvelles questions pour atteindre ${targetQuestions} questions",
    "Suppression de 2 questions redondantes",
    "Réorganisation de l'ordre pour une progression logique",
    "Ajout de 3 tags pertinents",
    "..."
  ]
}
` : `
{
  "course": {
    "title": "Titre optimisé (si nécessaire)",
    "description": "Description enrichie et détaillée (400-600 caractères, engageante, présente les objectifs)",
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"]
  },
  "lessons": [
    {
      "id": "uuid-existing-lesson-id", // ID de la leçon existante si mise à jour/suppression
      "order_index": 1, // Position dans l'ordre (commence à 1)
      "action": "update", // "create" | "update" | "delete"
      "title": "Titre de la leçon (optimisé si nécessaire)",
      "description": "Contenu ENRICHI avec minimum 500 mots (≈3000+ caractères). Structure : contexte → explication technique → références artistes/morceaux → conseils → exercices → ressources. Utilise [chord:], [tablature:], [artist:] quand pertinent.",
      "content_type": "text|video|interactive"
    },
    {
      "order_index": 2,
      "action": "create", // Nouvelle leçon à créer
      "title": "Nouveau titre de leçon",
      "description": "Contenu complet de la nouvelle leçon (minimum 500 mots)...",
      "content_type": "text"
    }
  ],
  "deletedLessonIds": ["uuid-to-delete-1", "uuid-to-delete-2"], // IDs des leçons à supprimer
  "changes": [
    "Description enrichie de X à Y caractères",
    "Leçon 1 : Ajout de 2000+ caractères avec contexte musical, références artistes, exercices",
    "Création de 3 nouvelles leçons pour compléter la progression pédagogique",
    "Suppression de 2 leçons redondantes",
    "Réorganisation de l'ordre pour une progression logique",
    "Ajout de 3 tags pertinents",
    "..."
  ]
}
`}

**RÈGLES PÉDAGOGIQUES IMPORTANTES** :

1. **Création de nouvelles leçons** (CRITIQUE pour atteindre 90%) :
   - Si le cours a moins de 8 leçons, tu DOIS créer des leçons pour atteindre 8+ leçons
   - Chaque nouvelle leçon doit être complète (500+ mots ≈ 3000+ caractères) dès la création
   - Assure une progression logique et structurée (bases → intermédiaire → avancé)
   - Insère les nouvelles leçons au bon endroit dans la séquence pédagogique (order_index séquentiels)
   - Les nouvelles leçons doivent apporter une vraie valeur pédagogique et compléter le parcours d'apprentissage

2. **Suppression de leçons** :
   - Supprime uniquement les leçons redondantes, obsolètes ou de très faible qualité
   - Ne supprime pas si cela réduirait le nombre total en dessous de 5 leçons
   - Justifie la suppression dans le champ "changes"

3. **Réorganisation** :
   - Réorganise pour une progression pédagogique logique : bases → intermédiaire → avancé
   - Assure que chaque leçon s'appuie sur les connaissances des précédentes
   - Les order_index doivent être séquentiels (1, 2, 3, ...)

4. **Enrichissement** :
   - Enrichis MASSIVEMENT chaque leçon existante pour atteindre 500+ mots minimum
   - Le contenu doit être profond, pédagogique et inspirant, pas juste plus long
   - Utilise ta culture musicale pour enrichir avec des références pertinentes

**IMPORTANT** :
- Sois intelligent et pédagogique : chaque modification doit améliorer l'apprentissage
${isQuiz ? `
- Pour les questions existantes à mettre à jour : inclus leur "id" et "action": "update"
- Pour les nouvelles questions : n'inclus PAS d'id, utilise "action": "create"
- Pour les questions à supprimer : utilise "action": "delete" dans la question OU liste-les dans "deletedQuestionIds"
- Chaque question DOIT avoir exactement 4 options
- Le "correct_answer" est l'index (0-3) de la bonne réponse dans le tableau "options"
` : `
- Pour les leçons existantes à mettre à jour : inclus leur "id" et "action": "update"
- Pour les nouvelles leçons : n'inclus PAS d'id, utilise "action": "create"
- Pour les leçons à supprimer : utilise "action": "delete" dans la leçon OU liste-les dans "deletedLessonIds"
`}
- Assure-toi que le JSON est valide et parsable`
}

/**
 * Parse le contenu optimisé depuis la réponse de Gemini
 */
function parseOptimizedContent(
  responseText: string,
  originalCourse: Course,
  originalLessons: Lesson[],
  originalQuizQuestions?: QuizQuestion[]
): OptimizedCourse {
  // Extraire le JSON de la réponse (peut contenir du markdown)
  let jsonText = responseText.trim()
  
  // Supprimer les blocs de code markdown si présents
  jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '')
  
  // Extraire le JSON entre accolades (en utilisant une approche plus robuste)
  const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    jsonText = jsonMatch[0]
  }

  // Essayer de réparer un JSON potentiellement tronqué
  // Si le JSON est incomplet (par exemple, dernière chaîne ou dernière leçon coupée)
  // On essaie de fermer les structures ouvertes
  let repairedJson = jsonText
  let openBraces = (jsonText.match(/\{/g) || []).length
  let closeBraces = (jsonText.match(/\}/g) || []).length
  
  // Si le JSON semble tronqué (plus d'accolades ouvertes que fermées)
  if (openBraces > closeBraces) {
    console.warn('JSON potentiellement tronqué détecté, tentative de réparation...')
    
    // Compter les crochets ouverts/fermés dans les tableaux
    let openBrackets = (jsonText.match(/\[/g) || []).length
    let closeBrackets = (jsonText.match(/\]/g) || []).length
    
    // Si on est dans une chaîne (nombre impair de guillemets depuis le début)
    // on essaie de trouver où la chaîne se termine
    let inString = false
    let escaped = false
    for (let i = 0; i < repairedJson.length; i++) {
      const char = repairedJson[i]
      if (escaped) {
        escaped = false
        continue
      }
      if (char === '\\') {
        escaped = true
        continue
      }
      if (char === '"') {
        inString = !inString
      }
    }
    
    // Si on est dans une chaîne à la fin, la fermer
    if (inString) {
      repairedJson += '"'
    }
    
    // Fermer les tableaux ouverts (mais seulement si on n'est pas dans une chaîne)
    while (openBrackets > closeBrackets && !inString) {
      repairedJson += ']'
      closeBrackets++
    }
    
    // Fermer les objets ouverts
    while (openBraces > closeBraces) {
      repairedJson += '}'
      closeBraces++
    }
    
    console.log('JSON réparé, nouveaux compteurs:', {
      openBraces: (repairedJson.match(/\{/g) || []).length,
      closeBraces: (repairedJson.match(/\}/g) || []).length,
      openBrackets: (repairedJson.match(/\[/g) || []).length,
      closeBrackets: (repairedJson.match(/\]/g) || []).length
    })
  }

  try {
    const parsed = JSON.parse(repairedJson)
    
    // Traiter les leçons avec leurs actions
    const optimizedLessons: OptimizedCourse['lessons'] = []
    
    if (parsed.lessons && Array.isArray(parsed.lessons)) {
      for (const lesson of parsed.lessons) {
        // Si c'est une suppression, on l'ignore ici (gérée par deletedLessonIds)
        if (lesson.action === 'delete') {
          continue
        }
        
        // Pour les mises à jour, utiliser les données originales comme base
        if (lesson.action === 'update' && lesson.id) {
          const originalLesson = originalLessons.find(l => l.id === lesson.id)
          if (originalLesson) {
            optimizedLessons.push({
              id: lesson.id,
              order_index: lesson.order_index !== undefined ? lesson.order_index : originalLesson.order_index,
              action: 'update',
              title: lesson.title || originalLesson.title,
              description: lesson.description || originalLesson.description,
              content_type: lesson.content_type || originalLesson.content_type,
              action_type: lesson.action_type !== undefined ? lesson.action_type : originalLesson.action_type,
              action_target: lesson.action_target !== undefined ? lesson.action_target : originalLesson.action_target,
              action_value: lesson.action_value !== undefined ? lesson.action_value : originalLesson.action_value
            })
          }
        } 
        // Pour les créations, utiliser uniquement les nouvelles données
        else if (lesson.action === 'create' || !lesson.id) {
          optimizedLessons.push({
            order_index: lesson.order_index || optimizedLessons.length + 1,
            action: 'create',
            title: lesson.title || 'Nouvelle leçon',
            description: lesson.description || '',
            content_type: lesson.content_type || 'text',
            action_type: lesson.action_type || null,
            action_target: lesson.action_target || null,
            action_value: lesson.action_value || null
          })
        }
      }
    }
    
    // Si aucune leçon n'a été traitée, garder les originales (cas de régression)
    if (optimizedLessons.length === 0 && originalLessons.length > 0) {
      optimizedLessons.push(...originalLessons.map(l => ({
        id: l.id,
        order_index: l.order_index,
        action: 'update' as const,
        title: l.title,
        description: l.description,
        content_type: l.content_type,
        action_type: l.action_type,
        action_target: l.action_target,
        action_value: l.action_value
      })))
    }
    
    // Traiter les questions de quiz si présentes
    const optimizedQuizQuestions: OptimizedCourse['quizQuestions'] = []
    const isQuiz = originalCourse.type === 'quiz'
    
    if (isQuiz && parsed.quizQuestions && Array.isArray(parsed.quizQuestions)) {
      for (const question of parsed.quizQuestions) {
        if (question.action === 'delete') {
          continue
        }
        
        if (question.action === 'update' && question.id) {
          const originalQuestion = originalQuizQuestions?.find(q => q.id === question.id)
          if (originalQuestion) {
            optimizedQuizQuestions.push({
              id: question.id,
              order_index: question.order_index !== undefined ? question.order_index : originalQuestion.order_index,
              action: 'update',
              question: question.question || originalQuestion.question,
              options: question.options || originalQuestion.options,
              correct_answer: question.correct_answer !== undefined ? question.correct_answer : originalQuestion.correct_answer,
              explanation: question.explanation !== undefined ? question.explanation : originalQuestion.explanation
            })
          }
        } else if (question.action === 'create' || !question.id) {
          optimizedQuizQuestions.push({
            order_index: question.order_index || optimizedQuizQuestions.length + 1,
            action: 'create',
            question: question.question || 'Nouvelle question',
            options: question.options || ['Option A', 'Option B', 'Option C', 'Option D'],
            correct_answer: question.correct_answer !== undefined ? question.correct_answer : 0,
            explanation: question.explanation || ''
          })
        }
      }
    }
    
    return {
      course: {
        title: parsed.course?.title || originalCourse.title,
        description: parsed.course?.description || originalCourse.description,
        tags: parsed.course?.tags || originalCourse.tags || []
      },
      lessons: isQuiz ? undefined : optimizedLessons,
      quizQuestions: isQuiz ? optimizedQuizQuestions : undefined,
      deletedLessonIds: isQuiz ? undefined : (parsed.deletedLessonIds || []),
      deletedQuestionIds: isQuiz ? (parsed.deletedQuestionIds || []) : undefined
    }
  } catch (error) {
    console.error('Erreur de parsing JSON:', error)
    console.error('Texte reçu (premiers 1000 chars):', responseText.substring(0, 1000))
    console.error('Texte reçu (derniers 1000 chars):', responseText.substring(Math.max(0, responseText.length - 1000)))
    console.error('JSON réparé (premiers 1000 chars):', repairedJson.substring(0, 1000))
    console.error('JSON réparé (derniers 1000 chars):', repairedJson.substring(Math.max(0, repairedJson.length - 1000)))
    
    // Si le JSON est vraiment invalide, retourner une structure minimale avec les données originales
    // plutôt que de faire échouer complètement l'optimisation
    console.warn('JSON invalide, utilisation des données originales comme fallback')
    return {
      course: {
        title: originalCourse.title,
        description: originalCourse.description,
        tags: originalCourse.tags || []
      },
      lessons: originalLessons.map(l => ({
        id: l.id,
        order_index: l.order_index,
        action: 'update' as const,
        title: l.title,
        description: l.description,
        content_type: l.content_type,
        action_type: l.action_type,
        action_target: l.action_target,
        action_value: l.action_value
      })),
      deletedLessonIds: []
    }
  }
}

/**
 * Génère la liste des changements effectués
 */
function generateChangesList(
  originalCourse: Course,
  originalLessons: Lesson[],
  optimized: OptimizedCourse,
  originalQuizQuestions?: QuizQuestion[]
): string[] {
  const changes: string[] = []

  if (optimized.course.title && optimized.course.title !== originalCourse.title) {
    changes.push(`Titre modifié: "${originalCourse.title}" → "${optimized.course.title}"`)
  }

  if (optimized.course.description) {
    const originalLength = (originalCourse.description || '').length
    const newLength = optimized.course.description.length
    if (newLength > originalLength) {
      changes.push(`Description enrichie: ${originalLength} → ${newLength} caractères (+${newLength - originalLength})`)
    }
  }

  if (optimized.course.tags) {
    const originalCount = (originalCourse.tags || []).length
    const newCount = optimized.course.tags.length
    if (newCount > originalCount) {
      changes.push(`Tags ajoutés: ${originalCount} → ${newCount} tags`)
      const newTags = optimized.course.tags.filter(t => !originalCourse.tags?.includes(t))
      if (newTags.length > 0) {
        changes.push(`Nouveaux tags: ${newTags.join(', ')}`)
      }
    }
  }

  // Pour les quiz, traiter les questions
  const isQuiz = originalCourse.type === 'quiz'
  if (isQuiz && optimized.quizQuestions) {
    const createdQuestions = optimized.quizQuestions.filter(q => q.action === 'create')
    const deletedQuestions = optimized.deletedQuestionIds || []
    const updatedQuestions = optimized.quizQuestions.filter(q => q.action === 'update')

    if (createdQuestions.length > 0) {
      changes.push(`${createdQuestions.length} nouvelle(s) question(s) créée(s)`)
      createdQuestions.forEach((question) => {
        changes.push(`  - Nouvelle question "${question.question?.substring(0, 50)}..." (position ${question.order_index})`)
      })
    }

    if (deletedQuestions.length > 0) {
      const deletedQuestionTexts = deletedQuestions
        .map(id => originalQuizQuestions?.find(q => q.id === id)?.question)
        .filter(Boolean)
      changes.push(`${deletedQuestions.length} question(s) supprimée(s): ${deletedQuestionTexts.map(q => `"${q?.substring(0, 30)}..."`).join(', ')}`)
    }

    if (updatedQuestions.length > 0) {
      changes.push(`${updatedQuestions.length} question(s) mise(s) à jour`)
      updatedQuestions.forEach(optimizedQuestion => {
        const originalQuestion = originalQuizQuestions?.find(q => q.id === optimizedQuestion.id)
        if (!originalQuestion) return

        const questionChanges: string[] = []
        
        if (optimizedQuestion.question && optimizedQuestion.question !== originalQuestion.question) {
          questionChanges.push(`question modifiée`)
        }

        if (optimizedQuestion.explanation && optimizedQuestion.explanation !== originalQuestion.explanation) {
          const originalLength = (originalQuestion.explanation || '').length
          const newLength = optimizedQuestion.explanation.length
          if (newLength > originalLength) {
            questionChanges.push(`explication enrichie (${originalLength} → ${newLength} caractères)`)
          }
        }

        if (questionChanges.length > 0) {
          changes.push(`  - Question "${originalQuestion.question.substring(0, 50)}...": ${questionChanges.join(', ')}`)
        }
      })
    }

    return changes
  }

  // Pour les cours avec leçons
  if (!optimized.lessons) {
    return changes
  }

  // Compter les créations, suppressions et mises à jour
  const createdLessons = optimized.lessons.filter(l => l.action === 'create')
  const deletedLessons = optimized.deletedLessonIds || []
  const updatedLessons = optimized.lessons.filter(l => l.action === 'update')

  if (createdLessons.length > 0) {
    changes.push(`${createdLessons.length} nouvelle(s) leçon(s) créée(s)`)
    createdLessons.forEach((lesson) => {
      changes.push(`  - Nouvelle leçon "${lesson.title}" (position ${lesson.order_index})`)
    })
  }

  if (deletedLessons.length > 0) {
    const deletedTitles = deletedLessons
      .map(id => originalLessons.find(l => l.id === id)?.title)
      .filter(Boolean)
    changes.push(`${deletedLessons.length} leçon(s) supprimée(s): ${deletedTitles.join(', ')}`)
  }

  if (updatedLessons.length > 0) {
    changes.push(`${updatedLessons.length} leçon(s) mise(s) à jour`)
    updatedLessons.forEach(optimizedLesson => {
      const originalLesson = originalLessons.find(l => l.id === optimizedLesson.id)
      if (!originalLesson) return

      const lessonChanges: string[] = []
      
      if (optimizedLesson.title && optimizedLesson.title !== originalLesson.title) {
        lessonChanges.push(`titre modifié`)
      }

      if (optimizedLesson.description) {
        const originalLength = (originalLesson.description || '').length
        const newLength = optimizedLesson.description.length
        if (newLength > originalLength) {
          lessonChanges.push(`contenu enrichi (${originalLength} → ${newLength} caractères)`)
        }
      }

      if (optimizedLesson.content_type && optimizedLesson.content_type !== originalLesson.content_type) {
        lessonChanges.push(`type changé en "${optimizedLesson.content_type}"`)
      }

      if (optimizedLesson.order_index !== undefined && optimizedLesson.order_index !== originalLesson.order_index) {
        lessonChanges.push(`réorganisée (position ${originalLesson.order_index} → ${optimizedLesson.order_index})`)
      }

      if (lessonChanges.length > 0) {
        changes.push(`  - "${originalLesson.title}": ${lessonChanges.join(', ')}`)
      }
    })
  }

  // Vérifier s'il y a eu réorganisation générale
  const hasReorganization = optimized.lessons.some((lesson) => {
    if (lesson.action === 'update' && lesson.id) {
      const original = originalLessons.find(l => l.id === lesson.id)
      return original && lesson.order_index !== undefined && lesson.order_index !== original.order_index
    }
    return false
  })

  if (hasReorganization && updatedLessons.length > 1) {
    changes.push('Réorganisation de la progression pédagogique pour une meilleure cohérence')
  }

  return changes
}

/**
 * Valide le contenu optimisé selon plusieurs critères
 */
async function validateOptimizedContent(
  optimized: OptimizedCourse,
  originalCourse: Course,
  originalLessons: Lesson[],
  originalQuizQuestions?: QuizQuestion[]
): Promise<ValidationResult> {
  const issues: ValidationResult['issues'] = []

  // 1. Vérification de la cohérence pédagogique
  if (optimized.lessons && optimized.lessons.length > 0) {
    const orderIndices = optimized.lessons
      .filter(l => l.order_index !== undefined)
      .map(l => l.order_index!)
      .sort((a, b) => a - b)
    
    // Vérifier qu'il n'y a pas de doublons dans les order_index
    const duplicates = orderIndices.filter((val, idx) => orderIndices.indexOf(val) !== idx)
    if (duplicates.length > 0) {
      issues.push({
        type: 'coherence',
        severity: 'error',
        message: `Doublons détectés dans les order_index : ${duplicates.join(', ')}`,
        suggestion: 'Assurez-vous que chaque leçon a un order_index unique et séquentiel'
      })
    }

    // Vérifier la progression logique (order_index séquentiels)
    for (let i = 0; i < orderIndices.length - 1; i++) {
      if (orderIndices[i + 1] - orderIndices[i] > 1) {
        issues.push({
          type: 'coherence',
          severity: 'warning',
          message: `Gap détecté dans la séquence : ${orderIndices[i]} → ${orderIndices[i + 1]}`,
          suggestion: 'Les order_index devraient être séquentiels (0, 1, 2, 3...)'
        })
      }
    }
  }

  // 2. Détection de contenu dupliqué (plagiat simple)
  if (optimized.course.description) {
    const descWords = optimized.course.description.toLowerCase().split(/\s+/).filter(w => w.length > 4)
    const originalDescWords = (originalCourse.description || '').toLowerCase().split(/\s+/).filter(w => w.length > 4)
    
    // Si la nouvelle description est identique à l'originale, c'est suspect
    if (descWords.length > 0 && descWords.join(' ') === originalDescWords.join(' ')) {
      issues.push({
        type: 'plagiarism',
        severity: 'warning',
        message: 'La description n\'a pas été modifiée',
        suggestion: 'Enrichissez la description pour améliorer le score de qualité'
      })
    }
  }

  // 3. Validation des liens YouTube
  if (optimized.lessons) {
    const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/g
    const allDescriptions = optimized.lessons
      .map(l => l.description || '')
      .join(' ')
    const youtubeMatches = allDescriptions.match(youtubeRegex) || []
    
    // Vérifier que les URLs YouTube sont valides (format)
    for (const url of youtubeMatches) {
      const videoIdMatch = url.match(/([a-zA-Z0-9_-]{11})/)
      if (!videoIdMatch || videoIdMatch[1].length !== 11) {
        issues.push({
          type: 'youtube',
          severity: 'error',
          message: `URL YouTube invalide : ${url}`,
          suggestion: 'Utilisez le format : https://youtube.com/watch?v=VIDEO_ID ou https://youtu.be/VIDEO_ID'
        })
      }
    }
  }

  // 4. Vérification de la pertinence des tags
  if (optimized.course.tags && optimized.course.tags.length > 0) {
    // Vérifier qu'il n'y a pas de tags vides ou trop courts
    const invalidTags = optimized.course.tags.filter(tag => !tag || tag.length < 2)
    if (invalidTags.length > 0) {
      issues.push({
        type: 'tags',
        severity: 'warning',
        message: `Tags invalides détectés : ${invalidTags.join(', ')}`,
        suggestion: 'Supprimez les tags vides ou trop courts (minimum 2 caractères)'
      })
    }

    // Vérifier qu'il n'y a pas de doublons (insensible à la casse)
    const tagLower = optimized.course.tags.map(t => t.toLowerCase())
    const duplicates = tagLower.filter((tag, idx) => tagLower.indexOf(tag) !== idx)
    if (duplicates.length > 0) {
      issues.push({
        type: 'tags',
        severity: 'warning',
        message: `Tags dupliqués détectés : ${[...new Set(duplicates)].join(', ')}`,
        suggestion: 'Supprimez les tags en double'
      })
    }

    // Recommander 5-8 tags (qualité > quantité)
    if (optimized.course.tags.length > 10) {
      issues.push({
        type: 'tags',
        severity: 'info',
        message: `Trop de tags (${optimized.course.tags.length}), privilégiez la qualité (5-8 tags recommandés)`,
        suggestion: 'Gardez uniquement les tags les plus pertinents'
      })
    }
  }

  return {
    isValid: issues.filter(i => i.severity === 'error').length === 0,
    issues
  }
}

/**
 * Génère un visuel pour un cours en utilisant Gemini 2.5 Flash Image
 * Retourne l'image en base64 (data URI)
 */
export async function generateCourseVisual(course: Course): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Clé API Gemini non configurée. Ajoutez VITE_GEMINI_API_KEY dans votre .env')
  }

  const prompt = `Crée une infographie pédagogique professionnelle et moderne pour un cours de musique intitulé : "${course.title}".
Catégorie : ${course.category}. 
Contenu : ${(course.description || '').substring(0, 300)}.
Style visuel : Épuré, journalistique, expert, type magazine de musique haut de gamme. 
Inclus des éléments graphiques liés à l'instrument ou au matériel (boutons, ondes sonores, diagrammes techniques stylisés).
Pas de texte illisible, focus sur l'esthétique et la clarté conceptuelle.`

  try {
    const response = await fetch(`${GEMINI_IMAGE_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 65536,
        },
        imageConfig: {
          aspectRatio: "16:9"
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Erreur API Gemini Image: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      )
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Réponse invalide de l\'API Gemini Image')
    }

    // Chercher l'image dans les parts de la réponse
    const parts = data.candidates[0].content.parts || []
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`
      }
    }

    throw new Error("Aucune image générée dans la réponse")
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erreur inconnue lors de la génération du visuel')
  }
}

/**
 * Génère un visuel pour une leçon en utilisant Gemini 2.5 Flash Image
 * Retourne l'image en base64 (data URI)
 */
export async function generateLessonVisual(lesson: Lesson, courseTitle?: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('Clé API Gemini non configurée. Ajoutez VITE_GEMINI_API_KEY dans votre .env')
  }

  const prompt = `Crée une illustration pédagogique professionnelle et moderne pour une leçon de musique intitulée : "${lesson.title}".
${courseTitle ? `Cours : ${courseTitle}.` : ''}
Contenu : ${(lesson.description || '').substring(0, 300)}.
Style visuel : Épuré, journalistique, expert, type magazine de musique haut de gamme. 
Inclus des éléments graphiques liés au contenu de la leçon (diagrammes, schémas techniques stylisés, ondes sonores).
Pas de texte illisible, focus sur l'esthétique et la clarté conceptuelle.`

  try {
    const response = await fetch(`${GEMINI_IMAGE_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        imageConfig: {
          aspectRatio: "16:9"
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Erreur API Gemini Image: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      )
    }

    const data = await response.json()

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Réponse invalide de l\'API Gemini Image')
    }

    // Chercher l'image dans les parts de la réponse
    const parts = data.candidates[0].content.parts || []
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`
      }
    }

    throw new Error("Aucune image générée dans la réponse")
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Erreur inconnue lors de la génération du visuel')
  }
}

