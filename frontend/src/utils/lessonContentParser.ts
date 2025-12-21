/**
 * Parser et nettoyeur de contenu de leçons
 * 
 * Ce module centralise toute la logique de parsing et de nettoyage des blocs
 * de contenu dans les descriptions de leçons stockées dans Supabase.
 * 
 * Formats supportés :
 * - [tablature:id] ou [fulltablature:id] : références à des tablatures
 * - [chord:name] : références à des diagrammes d'accords
 * - [artist:name] : références à des profils d'artistes
 * - [block:id] : références à des blocs personnalisés (customLessonBlocks)
 * - [html instrument="..." title="..."]...[/html] : blocs HTML/SVG de tablatures
 */

/**
 * Bloc HTML/SVG de tablature extrait d'une description
 */
export interface HtmlTabBlock {
  html: string
  instrument?: string
  title?: string
}

/**
 * Lien YouTube extrait d'une description
 */
export interface YouTubeLink {
  videoId: string
  title?: string
  url: string
}

/**
 * Contenu parsé d'une description de leçon
 */
export interface ParsedLessonContent {
  /** ID de la tablature référencée (si présente) */
  tablatureId?: string
  /** Indique si c'est une tablature complète */
  isFullTablature?: boolean
  /** Liste des noms d'accords référencés */
  chordNames?: string[]
  /** Nom de l'artiste référencé */
  artistName?: string
  /** Liste des IDs de blocs personnalisés référencés */
  blockIds?: string[]
  /** Liste des blocs HTML/SVG de tablatures */
  htmlBlocks?: HtmlTabBlock[]
  /** Liste des liens YouTube détectés */
  youtubeLinks?: YouTubeLink[]
}

/**
 * Parse une description de leçon et extrait tous les blocs de contenu référencés.
 * 
 * @param description - La description brute de la leçon
 * @returns Un objet contenant tous les éléments détectés
 */
export function parseLessonContent(description: string): ParsedLessonContent {
  const content: ParsedLessonContent = {}

  // Détecter les références de tablatures complètes
  // Format: [fulltablature:example-001] ou [tablature:example-001:full]
  const fullTabMatch = description.match(/\[fulltablature:([^\]]+)\]/) || 
                       description.match(/\[tablature:([^\]]+):full\]/)
  if (fullTabMatch) {
    content.tablatureId = fullTabMatch[1]
    content.isFullTablature = true
  } else {
    // Détecter les références de tablatures simples
    // Format: [tablature:example-001]
    const tabMatch = description.match(/\[tablature:([^\]]+)\]/)
    if (tabMatch) {
      content.tablatureId = tabMatch[1]
      content.isFullTablature = false
    }
  }

  // Détecter TOUTES les références d'accords
  // Format: [chord:C] ou [chord:Am]
  const chordMatches = description.matchAll(/\[chord:([^\]]+)\]/g)
  const chordNames: string[] = []
  for (const match of chordMatches) {
    chordNames.push(match[1])
  }
  if (chordNames.length > 0) {
    content.chordNames = chordNames
  }

  // Détecter les références d'artistes
  // Format: [artist:Jimi Hendrix]
  const artistMatch = description.match(/\[artist:([^\]]+)\]/)
  if (artistMatch) {
    content.artistName = artistMatch[1]
  }

  // Détecter les blocs personnalisés
  // Format: [block:solo_intro_svg]
  const blockMatches = description.matchAll(/\[block:([^\]]+)\]/g)
  const blockIds: string[] = []
  for (const match of blockMatches) {
    blockIds.push(match[1])
  }
  if (blockIds.length > 0) {
    content.blockIds = blockIds
  }

  // Détecter les blocs HTML/SVG stockés dans Supabase
  // Format: [html instrument="Guitare lead" title="Solo - Intro"]...[/html]
  // Supporte plusieurs blocs dans une même description et des attributs
  const htmlBlocks: HtmlTabBlock[] = []
  const htmlBlockRegex = /\[html([^\]]*)\]([\s\S]*?)\[\/html\]/g
  let htmlMatch
  while ((htmlMatch = htmlBlockRegex.exec(description)) !== null) {
    const attrsString = htmlMatch[1] || ''
    const html = htmlMatch[2].trim()

    // Parser les attributs (format: key="value")
    const attrs: Record<string, string> = {}
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

  // Détecter les liens YouTube
  // Formats supportés :
  // - [Titre](https://youtube.com/watch?v=VIDEO_ID) ou [Titre](https://youtu.be/VIDEO_ID)
  // - https://youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  const youtubeLinks: YouTubeLink[] = []
  const processedVideoIds = new Set<string>()
  
  // Détecter les liens Markdown [Titre](URL)
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:[^\s\)]*)?)\)/g
  let markdownMatch
  while ((markdownMatch = markdownLinkRegex.exec(description)) !== null) {
    const title = markdownMatch[1]
    const url = markdownMatch[2]
    const videoId = markdownMatch[3]
    if (!processedVideoIds.has(videoId)) {
      youtubeLinks.push({
        videoId,
        title: title !== url ? title : undefined, // Ne garder le titre que s'il est différent de l'URL
        url
      })
      processedVideoIds.add(videoId)
    }
  }
  
  // Détecter les URLs YouTube directes (en évitant celles déjà dans des liens Markdown)
  // On remplace temporairement les liens Markdown pour éviter les doublons
  const tempDescription = description.replace(/\[([^\]]+)\]\(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:[^\s\)]*)?\)/g, '')
  const directUrlRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:[^\s\)]*)?/g
  let directMatch
  while ((directMatch = directUrlRegex.exec(tempDescription)) !== null) {
    const videoId = directMatch[1]
    const url = directMatch[0]
    if (!processedVideoIds.has(videoId)) {
      youtubeLinks.push({
        videoId,
        url
      })
      processedVideoIds.add(videoId)
    }
  }
  
  if (youtubeLinks.length > 0) {
    content.youtubeLinks = youtubeLinks
  }

  return content
}

/**
 * Nettoie une description de leçon en retirant tous les tags de blocs de contenu.
 * 
 * Cette fonction est utilisée pour afficher uniquement le texte brut de la description,
 * sans les tags de référence qui seront rendus séparément dans l'UI.
 * 
 * @param description - La description brute de la leçon
 * @returns La description nettoyée, sans les tags de blocs
 */
export function cleanLessonDescription(description: string): string {
  return description
    // Retirer les références de tablatures
    .replace(/\[tablature:[^\]]+\]/g, '')
    .replace(/\[fulltablature:[^\]]+\]/g, '')
    // Retirer les références d'accords
    .replace(/\[chord:[^\]]+\]/g, '')
    // Retirer les références d'artistes
    .replace(/\[artist:[^\]]+\]/g, '')
    // Retirer les références de blocs personnalisés
    .replace(/\[block:[^\]]+\]/g, '')
    // Retirer les blocs HTML/SVG complets
    .replace(/\[html[^\]]*\][\s\S]*?\[\/html\]/g, '')
    // Retirer les liens YouTube Markdown [Titre](URL)
    .replace(/\[([^\]]+)\]\((https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)[a-zA-Z0-9_-]{11}(?:[^\s\)]*)?)\)/g, '')
    // Retirer les URLs YouTube directes (mais garder le texte autour)
    .replace(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})(?:[^\s\)]*)?/g, '')
}

