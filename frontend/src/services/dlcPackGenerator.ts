/**
 * Service de génération de packs DLC
 * Analyse les cours, pédales, amplis et marques pour créer des packs premium
 */
import { pedalLibrary } from '../data/pedals'
import { amplifierLibrary } from '../data/amplifiers'
import { imageService, ImageSearchResult } from './imageService'
import { TonePack, TonePackEffect } from '../types/gallery'
import { Course } from '../services/supabase'
import { createLogger } from './logger'

const logger = createLogger('DLCPackGenerator')

export interface DLCPack {
  id: string
  name: string
  description: string
  type: 'brand' | 'style' | 'course' | 'artist' | 'genre'
  category: string
  thumbnail?: string
  image?: ImageSearchResult
  content: {
    pedals?: string[]
    amplifiers?: string[]
    courses?: string[]
    presets?: TonePack[]
  }
  price: number
  currency: string
  isPremium: boolean
  tags: string[]
  metadata: {
    brand?: string
    style?: string
    genre?: string
    artist?: string
  }
}

/**
 * Analyse les marques disponibles dans les pédales et amplis
 */
export function analyzeBrands(): Map<string, { pedals: number; amplifiers: number; total: number }> {
  const brands = new Map<string, { pedals: number; amplifiers: number; total: number }>()

  // Analyser les pédales
  pedalLibrary.forEach(pedal => {
    const brand = pedal.brand.toLowerCase()
    const existing = brands.get(brand) || { pedals: 0, amplifiers: 0, total: 0 }
    existing.pedals++
    existing.total++
    brands.set(brand, existing)
  })

  // Analyser les amplis
  amplifierLibrary.forEach(amp => {
    const brand = amp.brand.toLowerCase()
    const existing = brands.get(brand) || { pedals: 0, amplifiers: 0, total: 0 }
    existing.amplifiers++
    existing.total++
    brands.set(brand, existing)
  })

  return brands
}

/**
 * Identifie les marques qui peuvent être des DLC (minimum 3 produits)
 */
export function getDLCBrands(): string[] {
  const brands = analyzeBrands()
  const dlcBrands: string[] = []

  brands.forEach((stats, brand) => {
    if (stats.total >= 3) {
      dlcBrands.push(brand)
    }
  })

  return dlcBrands.sort()
}

/**
 * Crée un pack DLC pour une marque
 */
export async function createBrandDLCPack(brand: string): Promise<DLCPack | null> {
  const brandLower = brand.toLowerCase()
  
  // Trouver toutes les pédales de cette marque
  const pedals = pedalLibrary.filter(p => p.brand.toLowerCase() === brandLower)
  
  // Trouver tous les amplis de cette marque
  const amplifiers = amplifierLibrary.filter(a => a.brand.toLowerCase() === brandLower)

  if (pedals.length === 0 && amplifiers.length === 0) {
    return null
  }

  // Récupérer une image pour la marque
  const image = await imageService.getImageForBrand(brand, pedals.length > amplifiers.length ? 'pedal' : 'amplifier')

  // Créer le nom du pack
  const brandFormatted = brand.charAt(0).toUpperCase() + brand.slice(1)
  const packName = `Pack ${brandFormatted} - Collection Complète`

  // Créer la description
  const description = `Collection complète ${brandFormatted} avec ${pedals.length} pédale${pedals.length > 1 ? 's' : ''} et ${amplifiers.length} amplificateur${amplifiers.length > 1 ? 's' : ''}. Découvrez le son authentique ${brandFormatted}.`

  // Créer des presets de démonstration
  const presets: TonePack[] = []
  
  // Preset 1 : Setup classique
  if (pedals.length > 0 && amplifiers.length > 0) {
    const chain: TonePackEffect[] = []
    
    // Ajouter quelques pédales représentatives
    pedals.slice(0, 3).forEach((pedal, index) => {
      chain.push({
        type: pedal.type as any,
        id: pedal.id,
        name: `${pedal.brand} ${pedal.model}`,
        enabled: true,
        parameters: Object.fromEntries(
          Object.entries(pedal.parameters).map(([key, param]) => [key, param.default])
        ),
        position: index
      })
    })

    presets.push({
      id: `preset-${brandLower}-classic`,
      name: `${brandFormatted} Classic Setup`,
      description: `Configuration classique ${brandFormatted}`,
      author: {
        id: 'system',
        name: 'WebAmp'
      },
      chain,
      tags: [brandLower, 'classic', 'setup'],
      isPremium: true,
      isArtistVerified: false,
      stats: {
        downloads: 0,
        likes: 0,
        rating: 0,
        ratingCount: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  return {
    id: `dlc-brand-${brandLower}`,
    name: packName,
    description,
    type: 'brand',
    category: 'brand',
    thumbnail: image?.thumbnail,
    image,
    content: {
      pedals: pedals.map(p => p.id),
      amplifiers: amplifiers.map(a => a.id),
      presets
    },
    price: calculatePackPrice(pedals.length + amplifiers.length),
    currency: 'EUR',
    isPremium: true,
    tags: [brandLower, 'brand', 'collection', 'dlc'],
    metadata: {
      brand: brandFormatted
    }
  }
}

/**
 * Analyse les styles/genres pour créer des packs thématiques
 */
export function analyzeStyles(): Map<string, { pedals: number; amplifiers: number }> {
  const styles = new Map<string, { pedals: number; amplifiers: number }>()

  // Analyser les styles des pédales
  pedalLibrary.forEach(pedal => {
    const style = pedal.style
    const existing = styles.get(style) || { pedals: 0, amplifiers: 0 }
    existing.pedals++
    styles.set(style, existing)
  })

  // Analyser les styles des amplis
  amplifierLibrary.forEach(amp => {
    const style = amp.style
    const existing = styles.get(style) || { pedals: 0, amplifiers: 0 }
    existing.amplifiers++
    styles.set(style, existing)
  })

  return styles
}

/**
 * Crée un pack DLC pour un style
 */
export async function createStyleDLCPack(style: string): Promise<DLCPack | null> {
  const styleLower = style.toLowerCase()
  
  // Trouver toutes les pédales de ce style
  const pedals = pedalLibrary.filter(p => p.style === style)
  
  // Trouver tous les amplis de ce style
  const amplifiers = amplifierLibrary.filter(a => a.style === style)

  if (pedals.length === 0 && amplifiers.length === 0) {
    return null
  }

  // Récupérer une image pour le style
  const image = await imageService.getImageForStyle(style)

  const styleFormatted = style.charAt(0).toUpperCase() + style.slice(1)
  const packName = `Pack ${styleFormatted} - Collection Complète`

  const description = `Collection ${styleFormatted} avec ${pedals.length} pédale${pedals.length > 1 ? 's' : ''} et ${amplifiers.length} amplificateur${amplifiers.length > 1 ? 's' : ''}. Explorez le son ${styleFormatted}.`

  return {
    id: `dlc-style-${styleLower}`,
    name: packName,
    description,
    type: 'style',
    category: 'style',
    thumbnail: image?.thumbnail,
    image,
    content: {
      pedals: pedals.map(p => p.id),
      amplifiers: amplifiers.map(a => a.id)
    },
    price: calculatePackPrice(pedals.length + amplifiers.length),
    currency: 'EUR',
    isPremium: true, // Sera modifié lors de la génération pour 50/50
    tags: [styleLower, 'style', 'collection', 'dlc'],
    metadata: {
      style: styleFormatted
    }
  }
}

/**
 * Analyse les cours pour créer des packs thématiques basés sur REFERENCE_COURS.md
 * Génère 5 à 10 packs thématiques selon les cours disponibles
 */
export function analyzeCourseThemes(courses: Course[]): Map<string, Course[]> {
  const themes = new Map<string, Course[]>()
  
  // Filtrer uniquement les cours premium (non gratuits)
  // Si aucun cours n'est marqué premium, on considère tous les cours comme potentiellement premium
  const premiumCourses = courses.filter(c => {
    // Si is_premium n'est pas défini ou false, mais qu'il y a un prix > 0, on le considère comme premium
    if (c.price && c.price > 0) {
      return true
    }
    // Sinon, on vérifie is_premium explicitement
    return c.is_premium === true && c.price && c.price > 0
  })
  
  // Si aucun cours premium trouvé, utiliser tous les cours (pour développement)
  const coursesToUse = premiumCourses.length > 0 ? premiumCourses : courses
  
  logger.info(`Analyse de ${coursesToUse.length} cours (${premiumCourses.length} premium, ${courses.length - premiumCourses.length} gratuits)`, {
    total: coursesToUse.length,
    premium: premiumCourses.length,
    free: courses.length - premiumCourses.length
  })
  
  if (coursesToUse.length === 0) {
    logger.warn('Aucun cours disponible pour créer des packs')
    return themes
  }
  
  // Pack 1 : Hard Rock & Metal (Metallica, AC/DC, Deep Purple, etc.)
  const hardRockKeywords = ['metallica', 'ac/dc', 'deep purple', 'enter sandman', 'smoke on the water', 'sweet home alabama', 'seven nation army', 'thunderstruck', 'zombie', 'cranberries', 'hotel california', 'eagles', 'led zeppelin', 'iron maiden']
  const hardRockCourses = coursesToUse.filter(c => {
    const titleLower = c.title.toLowerCase()
    const tags = (c.tags || []).map(t => t.toLowerCase())
    return hardRockKeywords.some(keyword => titleLower.includes(keyword) || tags.some(t => t.includes(keyword)))
  })
  logger.debug(`Hard Rock & Metal: ${hardRockCourses.length} cours trouvés`, { count: hardRockCourses.length })
  if (hardRockCourses.length >= 2) { // Réduit à 2 minimum
    themes.set('hard-rock-metal', hardRockCourses)
    logger.info(`Pack créé avec ${hardRockCourses.length} cours`, { theme: 'hard-rock-metal', count: hardRockCourses.length })
  }
  
  // Pack 2 : Effets Avancés (tous les cours avancés/pro sur les effets)
  const effectsCourses = coursesToUse.filter(c => {
    const category = c.category?.toLowerCase() || ''
    const difficulty = c.difficulty?.toLowerCase() || ''
    const titleLower = c.title.toLowerCase()
    const tags = (c.tags || []).map(t => t.toLowerCase())
    
    const isEffectRelated = category === 'effects' || 
                           titleLower.includes('effet') || 
                           titleLower.includes('pédale') ||
                           titleLower.includes('distortion') ||
                           titleLower.includes('overdrive') ||
                           titleLower.includes('delay') ||
                           titleLower.includes('reverb') ||
                           titleLower.includes('chorus') ||
                           titleLower.includes('flanger') ||
                           titleLower.includes('phaser') ||
                           titleLower.includes('wah') ||
                           titleLower.includes('octaver') ||
                           tags.some(t => t.includes('effet') || t.includes('pédale'))
    
    // Si aucun cours premium, on accepte tous les cours sur les effets (pas besoin d'être avancé)
    const isAdvanced = premiumCourses.length === 0 
      ? true // Accepter tous les cours sur les effets si pas de premium
      : (difficulty === 'advanced' || 
         difficulty === 'pro' || 
         titleLower.includes('avancé') || 
         titleLower.includes('pro') ||
         titleLower.includes('maîtriser') ||
         titleLower.includes('guide'))
    
    return isEffectRelated && isAdvanced
  })
  logger.debug(`Effets Avancés: ${effectsCourses.length} cours trouvés`, { count: effectsCourses.length })
  if (effectsCourses.length >= 2) { // Réduit à 2 minimum
    themes.set('effects-advanced', effectsCourses)
    logger.info(`Pack créé avec ${effectsCourses.length} cours`, { theme: 'effects-advanced', count: effectsCourses.length })
  }
  
  // Pack 3 : Styles Musicaux (Rock, Blues, Jazz, Country, etc.)
  const stylesKeywords = ['rock', 'blues', 'metal', 'jazz', 'country', 'folk', 'pop', 'post-rock', 'shoegaze']
  const stylesCourses = coursesToUse.filter(c => {
    const category = c.category?.toLowerCase() || ''
    const titleLower = c.title.toLowerCase()
    const tags = (c.tags || []).map(t => t.toLowerCase())
    return category === 'styles' || 
           stylesKeywords.some(keyword => titleLower.includes(keyword) || tags.some(t => t.includes(keyword)))
  })
  logger.debug(`Styles Musicaux: ${stylesCourses.length} cours trouvés`, { count: stylesCourses.length })
  if (stylesCourses.length >= 2) { // Réduit à 2 minimum
    themes.set('styles-musicaux', stylesCourses)
    logger.info(`Pack créé avec ${stylesCourses.length} cours`, { theme: 'styles-musicaux', count: stylesCourses.length })
  }
  
  // Pack 4 : Techniques Avancées (tapping, sweep picking, palm muting, etc.)
  const techniquesCourses = coursesToUse.filter(c => {
    const category = c.category?.toLowerCase() || ''
    const difficulty = c.difficulty?.toLowerCase() || ''
    const titleLower = c.title.toLowerCase()
    const tags = (c.tags || []).map(t => t.toLowerCase())
    
    const isTechnique = category === 'techniques' ||
                       titleLower.includes('tapping') ||
                       titleLower.includes('sweep') ||
                       titleLower.includes('palm muting') ||
                       titleLower.includes('fingerpicking') ||
                       titleLower.includes('slide') ||
                       titleLower.includes('technique') ||
                       tags.some(t => t.includes('technique'))
    
    // Si aucun cours premium, on accepte tous les cours sur les techniques
    const isAdvanced = premiumCourses.length === 0 
      ? true 
      : (difficulty === 'advanced' || difficulty === 'pro')
    
    return isTechnique && isAdvanced
  })
  logger.debug(`Techniques Avancées: ${techniquesCourses.length} cours trouvés`, { count: techniquesCourses.length })
  if (techniquesCourses.length >= 2) { // Réduit à 2 minimum
    themes.set('techniques-advanced', techniquesCourses)
    logger.info(`Pack créé avec ${techniquesCourses.length} cours`, { theme: 'techniques-advanced', count: techniquesCourses.length })
  }
  
  // Pack 5 : Amplificateurs (Mesa, Orange, Marshall, etc.)
  const ampsCourses = coursesToUse.filter(c => {
    const category = c.category?.toLowerCase() || ''
    const titleLower = c.title.toLowerCase()
    const tags = (c.tags || []).map(t => t.toLowerCase())
    return category === 'amps' || 
           titleLower.includes('ampli') || 
           titleLower.includes('mesa') || 
           titleLower.includes('orange') || 
           titleLower.includes('marshall') ||
           titleLower.includes('fender') ||
           titleLower.includes('vox') ||
           tags.some(t => t.includes('ampli') || t.includes('amp'))
  })
  logger.debug(`Amplificateurs: ${ampsCourses.length} cours trouvés`, { count: ampsCourses.length })
  if (ampsCourses.length >= 1) { // Réduit à 1 minimum
    themes.set('amplificateurs', ampsCourses)
    logger.info(`Pack créé avec ${ampsCourses.length} cours`, { theme: 'amplificateurs', count: ampsCourses.length })
  }
  
  // Pack 6 : Théorie Musicale (modes, gammes, accords enrichis, etc.)
  const theoryCourses = coursesToUse.filter(c => {
    const category = c.category?.toLowerCase() || ''
    const titleLower = c.title.toLowerCase()
    const tags = (c.tags || []).map(t => t.toLowerCase())
    return (category === 'basics' || category === 'theory') && 
           (titleLower.includes('théorie') || 
            titleLower.includes('mode') || 
            titleLower.includes('gamme') || 
            titleLower.includes('accord') ||
            titleLower.includes('rythme') ||
            tags.some(t => t.includes('théorie') || t.includes('mode') || t.includes('gamme')))
  })
  logger.debug(`Théorie Musicale: ${theoryCourses.length} cours trouvés`, { count: theoryCourses.length })
  if (theoryCourses.length >= 2) { // Réduit à 2 minimum
    themes.set('theorie-musicale', theoryCourses)
    logger.info(`Pack créé avec ${theoryCourses.length} cours`, { theme: 'theorie-musicale', count: theoryCourses.length })
  }
  
  // Pack 7 : Chaînes d'Effets (création de chaînes pour studio, live, etc.)
  const chainsCourses = coursesToUse.filter(c => {
    const category = c.category?.toLowerCase() || ''
    const titleLower = c.title.toLowerCase()
    const tags = (c.tags || []).map(t => t.toLowerCase())
    return category === 'chains' ||
           titleLower.includes('chaîne') ||
           titleLower.includes('studio') ||
           titleLower.includes('live') ||
           titleLower.includes('fingerpicking') ||
           titleLower.includes('shoegaze') ||
           tags.some(t => t.includes('chaîne') || t.includes('chain'))
  })
  logger.debug(`Chaînes d'Effets: ${chainsCourses.length} cours trouvés`, { count: chainsCourses.length })
  if (chainsCourses.length >= 1) { // Réduit à 1 minimum
    themes.set('chaines-effets', chainsCourses)
    logger.info(`Pack créé avec ${chainsCourses.length} cours`, { theme: 'chaines-effets', count: chainsCourses.length })
  }
  
  // Pack 8 : Créativité & Expérimentation (création, expérimentation, etc.)
  const creativityCourses = coursesToUse.filter(c => {
    const category = c.category?.toLowerCase() || ''
    const titleLower = c.title.toLowerCase()
    const tags = (c.tags || []).map(t => t.toLowerCase())
    return category === 'creativity' ||
           titleLower.includes('créer') ||
           titleLower.includes('expérimenter') ||
           titleLower.includes('boucle') ||
           titleLower.includes('looper') ||
           titleLower.includes('créativité') ||
           tags.some(t => t.includes('créativité') || t.includes('création'))
  })
  logger.debug(`Créativité & Expérimentation: ${creativityCourses.length} cours trouvés`, { count: creativityCourses.length })
  if (creativityCourses.length >= 1) { // Réduit à 1 minimum
    themes.set('creativite', creativityCourses)
    logger.info(`Pack créé avec ${creativityCourses.length} cours`, { theme: 'creativite', count: creativityCourses.length })
  }
  
  // Pack 9 : Chansons Populaires (toutes les chansons d'artistes célèbres)
  const songsKeywords = ['apprendre', 'jolene', 'wagon wheel', 'nothing else matters', 'hotel california', 'thunderstruck', 'smoke on the water', 'sweet home alabama', 'zombie']
  const songsCourses = coursesToUse.filter(c => {
    const titleLower = c.title.toLowerCase()
    const tags = (c.tags || []).map(t => t.toLowerCase())
    // Accepter les cours qui contiennent "apprendre" OU un mot-clé de chanson
    return (titleLower.includes('apprendre') || songsKeywords.some(keyword => titleLower.includes(keyword))) ||
           tags.some(t => t.includes('chanson') || t.includes('song'))
  })
  logger.debug(`Chansons Populaires: ${songsCourses.length} cours trouvés`, { count: songsCourses.length })
  if (songsCourses.length >= 2) { // Réduit à 2 minimum
    themes.set('chansons-populaires', songsCourses)
    logger.info(`Pack créé avec ${songsCourses.length} cours`, { theme: 'chansons-populaires', count: songsCourses.length })
  }
  
  // Pack 10 : Bases & Fondamentaux (cours de base avancés)
  const basicsCourses = coursesToUse.filter(c => {
    const category = c.category?.toLowerCase() || ''
    const titleLower = c.title.toLowerCase()
    const tags = (c.tags || []).map(t => t.toLowerCase())
    return category === 'basics' &&
           (titleLower.includes('base') ||
            titleLower.includes('fondamental') ||
            titleLower.includes('premier') ||
            titleLower.includes('essentiel') ||
            tags.some(t => t.includes('base') || t.includes('fondamental')))
  })
  logger.debug(`Bases & Fondamentaux: ${basicsCourses.length} cours trouvés`, { count: basicsCourses.length })
  if (basicsCourses.length >= 2) { // Réduit à 2 minimum
    themes.set('bases-fondamentaux', basicsCourses)
    logger.info(`Pack créé avec ${basicsCourses.length} cours`, { theme: 'bases-fondamentaux', count: basicsCourses.length })
  }
  
  // Pack 11 : Parcours Débutant (cours du parcours débutant recommandé)
  const beginnerCourseTitles = [
    'votre premier preset',
    'comprendre les amplis',
    'les accords de base pour débutants',
    'maîtriser le rythme et le tempo',
    'découvrir les effets de base',
    'créer votre première chaîne d\'effets',
    'apprendre votre première chanson',
    'quiz : les bases de la guitare'
  ]
  // Fonction de normalisation
  const normalize = (str: string) => 
    str.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/g, '')
      .trim()
  
  // Mots communs à ignorer
  const COMMON_WORDS = new Set([
    'maitriser', 'maîtriser', 'comprendre', 'explorer', 'decouvrir', 'découvrir',
    'creer', 'créer', 'apprendre', 'techniques', 'technique', 'les', 'le', 'la',
    'de', 'des', 'du', 'et', 'ou', 'pour', 'avec', 'sur', 'dans', 'par'
  ])
  
  // Fonction de calcul de similarité améliorée
  const calculateSimilarity = (searchTitle: string, courseTitle: string): number => {
    const normalizedSearch = normalize(searchTitle)
    const normalizedCourse = normalize(courseTitle)
    
    if (normalizedSearch === normalizedCourse) return 1.0
    if (normalizedCourse.includes(normalizedSearch) || normalizedSearch.includes(normalizedCourse)) {
      const lengthDiff = Math.abs(normalizedSearch.length - normalizedCourse.length)
      const maxLength = Math.max(normalizedSearch.length, normalizedCourse.length)
      if (lengthDiff / maxLength > 0.5) return 0
      return 1.0 - (lengthDiff / maxLength) * 0.3
    }
    
    // Extraire les mots significatifs (4+ caractères, pas de mots communs)
    const searchWords = normalizedSearch.split(' ')
      .filter(w => w.length >= 4 && !COMMON_WORDS.has(w))
    const courseWords = normalizedCourse.split(' ')
      .filter(w => w.length >= 4 && !COMMON_WORDS.has(w))
    
    if (searchWords.length === 0) return 0
    
    const matchingWords = searchWords.filter(sw => {
      const match = courseWords.find(cw => {
        if (cw === sw) return true
        if (cw.includes(sw) || sw.includes(cw)) {
          const wordLengthDiff = Math.abs(sw.length - cw.length)
          return wordLengthDiff <= Math.max(sw.length, cw.length) * 0.4
        }
        return false
      })
      return !!match
    }).length
    
    const wordScore = matchingWords / searchWords.length
    if (wordScore < 0.6) return 0
    
    const importantWords = searchWords.slice(0, Math.min(3, searchWords.length))
    const importantMatches = importantWords.filter(sw => 
      courseWords.some(cw => cw === sw || (cw.includes(sw) || sw.includes(cw)))
    ).length
    const importantScore = importantMatches / importantWords.length
    
    const finalScore = (wordScore * 0.7) + (importantScore * 0.3)
    return finalScore >= 0.6 ? finalScore : 0
  }
  
  const beginnerCourses = coursesToUse.filter(c => {
    const difficulty = c.difficulty?.toLowerCase() || ''
    
    // Calculer le meilleur score de similarité avec les titres attendus
    const bestScore = Math.max(...beginnerCourseTitles.map(searchTitle => 
      calculateSimilarity(searchTitle, c.title)
    ))
    
    // Seuil minimum de 0.6 pour accepter une correspondance (plus strict)
    return bestScore >= 0.6 ||
           (difficulty === 'beginner' && (normalize(c.title).includes('premier') || normalize(c.title).includes('base')))
  })
  logger.debug(`Parcours Débutant: ${beginnerCourses.length} cours trouvés`, { count: beginnerCourses.length })
  if (beginnerCourses.length >= 3) { // Minimum 3 cours pour un parcours
    themes.set('parcours-debutant', beginnerCourses)
    logger.info(`Pack créé avec ${beginnerCourses.length} cours`, { theme: 'parcours-debutant', count: beginnerCourses.length })
  }
  
  // Pack 12 : Parcours Intermédiaire (cours du parcours intermédiaire recommandé)
  const intermediateCourseTitles = [
    'techniques avancées de picking',
    'maîtriser les gammes pentatoniques',
    'maîtriser les effets de modulation',
    'explorer les styles de jeu',
    'créer des presets professionnels',
    'maîtriser les bends et vibrato',
    'maîtriser les accords barrés',
    'explorer les possibilités du delay',
    'improviser en blues',
    'quiz : techniques intermédiaires'
  ]
  const intermediateCourses = coursesToUse.filter(c => {
    const difficulty = c.difficulty?.toLowerCase() || ''
    
    // Calculer le meilleur score de similarité avec les titres attendus
    const bestScore = Math.max(...intermediateCourseTitles.map(searchTitle => 
      calculateSimilarity(searchTitle, c.title)
    ))
    
    // Seuil minimum de 0.6 pour accepter une correspondance (plus strict)
    return bestScore >= 0.6 ||
           (difficulty === 'intermediate' && (normalize(c.title).includes('technique') || normalize(c.title).includes('maitriser')))
  })
  logger.debug(`Parcours Intermédiaire: ${intermediateCourses.length} cours trouvés`, { count: intermediateCourses.length })
  if (intermediateCourses.length >= 3) { // Minimum 3 cours pour un parcours
    themes.set('parcours-intermediaire', intermediateCourses)
    logger.info(`Pack créé avec ${intermediateCourses.length} cours`, { theme: 'parcours-intermediaire', count: intermediateCourses.length })
  }
  
  // Pack 13 : Parcours Avancé (cours du parcours avancé recommandé)
  const advancedCourseTitles = [
    'maîtriser le tapping à deux mains',
    'comprendre les modes et gammes modales',
    'maîtriser le pitch shifting et l\'harmonisation',
    'improviser en jazz',
    'maîtriser le legato',
    'créer des textures sonores complexes',
    'maîtriser le slide',
    'explorer les nuances de la distortion',
    'improviser en metal',
    'quiz : techniques avancées'
  ]
  const advancedCourses = coursesToUse.filter(c => {
    const difficulty = c.difficulty?.toLowerCase() || ''
    
    // Calculer le meilleur score de similarité avec les titres attendus
    const bestScore = Math.max(...advancedCourseTitles.map(searchTitle => 
      calculateSimilarity(searchTitle, c.title)
    ))
    
    // Seuil minimum de 0.6 pour accepter une correspondance (plus strict)
    return bestScore >= 0.6 ||
           (difficulty === 'advanced' && (normalize(c.title).includes('avance') || normalize(c.title).includes('maitriser')))
  })
  logger.debug(`Parcours Avancé: ${advancedCourses.length} cours trouvés`, { count: advancedCourses.length })
  if (advancedCourses.length >= 3) { // Minimum 3 cours pour un parcours
    themes.set('parcours-avance', advancedCourses)
    logger.info(`Pack créé avec ${advancedCourses.length} cours`, { theme: 'parcours-avance', count: advancedCourses.length })
  }
  
  // Si aucun pack n'a été créé, créer des packs basés uniquement sur les catégories
  if (themes.size === 0) {
    logger.warn('Aucun pack créé avec les critères actuels. Création de packs par catégorie...')
    
    // Grouper les cours par catégorie
    const coursesByCategory = new Map<string, Course[]>()
    coursesToUse.forEach(course => {
      const category = course.category?.toLowerCase() || 'other'
      if (!coursesByCategory.has(category)) {
        coursesByCategory.set(category, [])
      }
      coursesByCategory.get(category)!.push(course)
    })
    
    // Créer un pack pour chaque catégorie avec au moins 2 cours
    coursesByCategory.forEach((categoryCourses, category) => {
      if (categoryCourses.length >= 2) {
        const themeKey = `category-${category}`
        themes.set(themeKey, categoryCourses)
        logger.info(`Pack créé pour catégorie "${category}": ${categoryCourses.length} cours`, { theme: themeKey, category, count: categoryCourses.length })
      }
    })
  }
  
  logger.info(`Total: ${themes.size} packs thématiques créés`, { total: themes.size })
  return themes
}

/**
 * Crée un pack DLC thématique pour plusieurs cours
 */
export async function createThematicCoursePack(theme: string, courses: Course[]): Promise<DLCPack | null> {
  if (courses.length === 0) {
    return null
  }
  
  // Les cours sont déjà filtrés dans analyzeCourseThemes
  // On utilise directement les cours fournis
  const coursesToInclude = courses
  
  if (coursesToInclude.length === 0) {
    return null
  }
  
  logger.info(`Création du pack "${theme}" avec ${coursesToInclude.length} cours...`, { theme, count: coursesToInclude.length })
  
  // Récupérer une image pour le thème
  const image = await imageService.getImageForStyle(theme)
  
  const themeLabels: Record<string, string> = {
    'hard-rock-metal': 'Hard Rock & Metal',
    'effects-advanced': 'Effets Avancés',
    'styles-musicaux': 'Styles Musicaux',
    'techniques-advanced': 'Techniques Avancées',
    'amplificateurs': 'Amplificateurs',
    'theorie-musicale': 'Théorie Musicale',
    'chaines-effets': 'Chaînes d\'Effets',
    'creativite': 'Créativité & Expérimentation',
    'chansons-populaires': 'Chansons Populaires',
    'bases-fondamentaux': 'Bases & Fondamentaux',
    'parcours-debutant': 'Parcours Débutant',
    'parcours-intermediaire': 'Parcours Intermédiaire',
    'parcours-avance': 'Parcours Avancé'
  }
  
  // Gérer les thèmes basés sur les catégories
  let themeLabel = themeLabels[theme]
  if (!themeLabel && theme.startsWith('category-')) {
    const category = theme.replace('category-', '')
    themeLabel = category.charAt(0).toUpperCase() + category.slice(1)
  }
  if (!themeLabel) {
    themeLabel = theme.charAt(0).toUpperCase() + theme.slice(1)
  }
  
  // Personnaliser le nom et la description pour les parcours
  let packName = `Pack ${themeLabel}`
  let description = `Collection complète de ${coursesToInclude.length} cours sur ${themeLabel.toLowerCase()}. Maîtrisez ${themeLabel.toLowerCase()} avec des cours approfondis et des techniques avancées.`
  
  if (theme === 'parcours-debutant') {
    packName = 'Parcours Débutant - Pack Complet'
    description = `Parcours complet pour débutants avec ${coursesToInclude.length} cours essentiels. Apprenez les bases de la guitare, des effets et des amplis avec un programme structuré et progressif.`
  } else if (theme === 'parcours-intermediaire') {
    packName = 'Parcours Intermédiaire - Pack Complet'
    description = `Parcours complet pour guitaristes intermédiaires avec ${coursesToInclude.length} cours avancés. Développez vos techniques, maîtrisez les effets et explorez différents styles musicaux.`
  } else if (theme === 'parcours-avance') {
    packName = 'Parcours Avancé - Pack Complet'
    description = `Parcours complet pour guitaristes avancés avec ${coursesToInclude.length} cours experts. Maîtrisez les techniques avancées, l'improvisation et la création de textures sonores complexes.`
  }
  
  // Collecter tous les tags uniques
  const allTags = new Set<string>()
  coursesToInclude.forEach(course => {
    if (course.tags) {
      course.tags.forEach(tag => allTags.add(tag.toLowerCase()))
    }
  })
  allTags.add(theme)
  allTags.add('course')
  allTags.add('education')
  
  // Tous les packs thématiques sont premium (boutique uniquement)
  allTags.add('premium')
  
  // Calculer le prix basé sur le nombre de cours (minimum 9.99€)
  const packPrice = calculateCoursePackPrice(coursesToInclude.length)
  
  // S'assurer que le prix est toujours > 0 (pas de packs gratuits)
  const finalPrice = packPrice > 0 ? packPrice : 9.99
  
  return {
    id: `dlc-theme-${theme}`,
    name: packName,
    description,
    type: 'course',
    category: theme,
    thumbnail: image?.thumbnail,
    image,
    content: {
      courses: coursesToInclude.map(c => c.id)
    },
    price: finalPrice,
    currency: 'EUR',
    isPremium: true, // Tous les packs sont premium (boutique)
    tags: Array.from(allTags),
    metadata: {
      genre: theme,
      courseCount: coursesToInclude.length
    }
  }
}

/**
 * Calcule le prix d'un pack de cours basé sur le nombre de cours
 */
function calculateCoursePackPrice(courseCount: number): number {
  if (courseCount <= 3) return 9.99
  if (courseCount <= 5) return 14.99
  if (courseCount <= 10) return 19.99
  if (courseCount <= 15) return 24.99
  return 29.99
}

/**
 * Calcule le prix d'un pack basé sur le nombre d'éléments
 */
function calculatePackPrice(itemCount: number): number {
  if (itemCount <= 5) return 4.99
  if (itemCount <= 10) return 9.99
  if (itemCount <= 20) return 19.99
  return 29.99
}

/**
 * Génère tous les packs DLC disponibles
 * Répartition : 50% gratuit, 50% payant
 */
export async function generateAllDLCPacks(courses?: Course[]): Promise<DLCPack[]> {
  const packs: DLCPack[] = []

  // UNIQUEMENT des packs thématiques de cours (5 à 10 packs)
  // Suppression des packs marques et styles
  const coursePacks: DLCPack[] = []
  if (courses && courses.length > 0) {
    const courseThemes = analyzeCourseThemes(courses)
    
    // Limiter à 13 packs maximum (10 thématiques + 3 parcours)
    const themesArray = Array.from(courseThemes.entries()).slice(0, 13)
    
    for (const [theme, themeCourses] of themesArray) {
      const pack = await createThematicCoursePack(theme, themeCourses)
      if (pack) {
        coursePacks.push(pack)
      }
    }
  }

  // Répartir les packs : 50% gratuit, 50% payant
  const markPacksAsFree = (packsList: DLCPack[], percentage: number = 0.5) => {
    const freeCount = Math.floor(packsList.length * percentage)
    // Mélanger pour une répartition aléatoire
    const shuffled = [...packsList].sort(() => Math.random() - 0.5)
    shuffled.forEach((pack, index) => {
      if (index < freeCount) {
        pack.isPremium = false
        pack.price = 0
      }
    })
    return shuffled
  }

  // Marquer 50% des packs de cours comme gratuits
  const freeCoursePacks = markPacksAsFree(coursePacks, 0.5)

  // Ajouter uniquement les packs de cours
  packs.push(...freeCoursePacks)

  return packs
}

