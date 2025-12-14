// Service pour interagir avec l'API Songsterr via Edge Function Supabase
// Documentation: https://www.songsterr.com/a/wa/api

import { supabase } from './supabase'

interface SongsterrSong {
  id: number
  title: string
  artist: {
    id: number
    name: string
  }
  type?: string
}

// Interface pour les données de tablature Songsterr (utilisée dans convertToTablatureFormat)
// interface SongsterrTabData {
//   id: number
//   title: string
//   artist: string
//   measures: any[]
//   tempo?: number
//   timeSignature?: string
//   key?: string
// }

class SongsterrService {
  private baseUrl = 'https://www.songsterr.com'
  
  /**
   * Appelle l'Edge Function Supabase pour contourner CORS
   */
  private async callEdgeFunction(action: 'search' | 'getTabData', params: {
    query?: string
    tabId?: number
  }): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('songsterr', {
        body: {
          action,
          ...params
        }
      })
      
      if (error) {
        console.error(`❌ SongsterrService - Erreur Edge Function (${action}):`, error)
        throw error
      }
      
      if (data && data.success) {
        return data.data
      }
      
      console.warn(`⚠️ SongsterrService - Réponse Edge Function invalide (${action}):`, data)
      return null
    } catch (error) {
      console.error(`❌ SongsterrService - Erreur appel Edge Function (${action}):`, error)
      throw error
    }
  }

  /**
   * Recherche la meilleure correspondance pour une requête
   * Utilise l'Edge Function Supabase pour contourner CORS
   * @param query Requête de recherche (ex: "shake it off taylor swift")
   */
  async searchBestMatch(query: string): Promise<SongsterrSong | null> {
    try {
      console.log('🌐 SongsterrService - Recherche via Edge Function:', query)
      
      const data = await this.callEdgeFunction('search', { query })
      
      if (!data) {
        return null
      }
      
      console.log('📦 SongsterrService - Réponse Edge Function reçue:', data)
      
      // La réponse peut être un tableau ou un objet unique
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ SongsterrService - Tableau reçu, premier résultat:', data[0])
        return data[0]
      } else if (data && data.id) {
        console.log('✅ SongsterrService - Objet unique reçu:', data)
        return data
      }

      console.log('⚠️ SongsterrService - Format de réponse non reconnu')
      return null
    } catch (error) {
      console.error('❌ SongsterrService - Erreur lors de la recherche:', error)
      return null
    }
  }

  /**
   * Recherche des chansons par titre et artiste
   * @param title Titre de la chanson
   * @param artist Nom de l'artiste
   */
  async searchByTitleAndArtist(title: string, artist: string): Promise<SongsterrSong | null> {
    // Construire la requête de recherche
    const query = `${title} ${artist}`.toLowerCase()
    console.log('🎵 SongsterrService - Recherche avec query:', query)
    const result = await this.searchBestMatch(query)
    if (result) {
      console.log('✅ SongsterrService - Résultat recherche:', {
        id: result.id,
        title: result.title,
        artist: result.artist.name
      })
    } else {
      console.log('❌ SongsterrService - Aucun résultat pour:', query)
    }
    return result
  }

  /**
   * Récupère les données complètes d'une tablature par ID
   * Utilise l'Edge Function Supabase pour contourner CORS
   * @param tabId ID de la tablature Songsterr
   */
  async getTabData(tabId: number): Promise<any | null> {
    try {
      console.log('🌐 SongsterrService - Récupération tablature via Edge Function:', tabId)
      
      const data = await this.callEdgeFunction('getTabData', { tabId })
      
      if (!data) {
        console.warn('⚠️ SongsterrService - Aucune donnée retournée par Edge Function')
        return null
      }
      
      console.log('✅ SongsterrService - Données tablature reçues via Edge Function')
      return data
    } catch (error) {
      console.error('❌ SongsterrService - Erreur récupération tablature:', error)
      return null
    }
  }

  /**
   * Convertit les données Songsterr au format attendu par notre application
   * @param tabData Données brutes de Songsterr (peut être du HTML ou du JSON)
   * @param _songsterrSong Informations de base de la chanson (optionnel, réservé pour usage futur)
   */
  convertToTablatureFormat(tabData: any, _songsterrSong?: SongsterrSong): TablatureMeasure[] | null {
    if (!tabData) {
      return []
    }

    // Si les données sont déjà dans un format structuré (JSON)
    if (tabData.measures && Array.isArray(tabData.measures)) {
      return tabData.measures.map((measure: any) => ({
        notes: measure.notes || [],
        timeSignature: measure.timeSignature || '4/4',
        chord: measure.chord,
        section: measure.section,
        instructions: measure.instructions || []
      }))
    }

    // Si on a des tracks avec des voices (format Songsterr)
    if (tabData.tracks && Array.isArray(tabData.tracks)) {
      const measures: TablatureMeasure[] = []
      
      // Prendre la première piste (guitar)
      const guitarTrack = tabData.tracks.find((t: any) => 
        t.instrument?.toLowerCase().includes('guitar') || 
        t.instrument?.toLowerCase().includes('bass')
      ) || tabData.tracks[0]

      if (guitarTrack && guitarTrack.measures) {
        guitarTrack.measures.forEach((measure: any) => {
          const notes: Array<{ string: number; fret: number; duration?: string; time?: number }> = []
          
          if (measure.voices && Array.isArray(measure.voices)) {
            measure.voices.forEach((voice: any) => {
              if (voice.beats && Array.isArray(voice.beats)) {
                voice.beats.forEach((beat: any) => {
                  if (beat.notes && Array.isArray(beat.notes)) {
                    beat.notes.forEach((note: any) => {
                      if (note.string !== undefined && note.fret !== undefined) {
                        notes.push({
                          string: note.string,
                          fret: note.fret,
                          duration: note.duration,
                          time: beat.start
                        })
                      }
                    })
                  }
                })
              }
            })
          }

          measures.push({
            notes,
            timeSignature: measure.timeSignature || '4/4',
            chord: measure.chord,
            section: measure.section,
            instructions: measure.instructions || []
          })
        })
      }

      return measures.length > 0 ? measures : []
    }

    // Si on n'a que du HTML, retourner un tableau vide
    // Le composant affichera un lien vers Songsterr
    if (tabData.html) {
      console.log('⚠️ SongsterrService - Données HTML non parsées, mesures vides retournées')
      return []
    }

    return []
  }

  /**
   * Construit l'URL Songsterr pour une chanson
   * @param song Données de la chanson Songsterr
   */
  private buildSongsterrUrl(song: SongsterrSong): string {
    // Format d'URL Songsterr : https://www.songsterr.com/a/wsa/{artist-slug}-{title-slug}-tab-s{id}
    const artistSlug = song.artist.name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    const titleSlug = song.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    return `https://www.songsterr.com/a/wsa/${artistSlug}-${titleSlug}-tab-s${song.id}`
  }

  /**
   * Récupère une tablature complète par ID Songsterr
   * @param songsterrId ID de la tablature Songsterr (ex: 468698)
   */
  async getTablatureBySongsterrId(songsterrId: number): Promise<{
    id: string
    title: string
    artist: string
    measures: TablatureMeasure[]
    tempo?: number
    timeSignature?: string
    key?: string
    songsterrUrl?: string
    songsterrId?: number
  } | null> {
    console.log('🎵 SongsterrService - Récupération tablature par ID via Edge Function:', songsterrId)
    
    try {
      // Récupérer les données de la tablature via Edge Function
      const tabData = await this.getTabData(songsterrId)
      
      if (!tabData) {
        console.warn(`❌ SongsterrService - Aucune donnée trouvée pour l'ID ${songsterrId}`)
        return null
      }
      
      // Construire l'URL Songsterr
      const songsterrUrl = `https://www.songsterr.com/a/wsa/taylor-swift-shake-it-off-tab-s${songsterrId}t1`
      
      // Convertir au format attendu
      const measures = this.convertToTablatureFormat(tabData, {
        id: songsterrId,
        title: tabData.title || 'Unknown',
        artist: { id: 0, name: tabData.artist || 'Unknown' }
      })
      
      const result = {
        id: `songsterr-${songsterrId}`,
        title: tabData.title || 'Shake It Off',
        artist: tabData.artist || 'Taylor Swift',
        measures: measures || [],
        tempo: tabData?.tempo,
        timeSignature: tabData?.timeSignature || '4/4',
        key: tabData?.key,
        songsterrUrl,
        songsterrId: songsterrId
      }
      
      console.log('✅ SongsterrService - Résultat par ID:', {
        id: result.id,
        title: result.title,
        artist: result.artist,
        measuresCount: result.measures.length,
        songsterrUrl: result.songsterrUrl
      })
      
      return result
    } catch (error) {
      console.error('❌ SongsterrService - Erreur récupération par ID:', error)
      return null
    }
  }

  /**
   * Récupère une tablature complète par titre et artiste
   * @param title Titre de la chanson
   * @param artist Nom de l'artiste
   */
  async getTablatureByTitleAndArtist(title: string, artist: string): Promise<{
    id: string
    title: string
    artist: string
    measures: TablatureMeasure[]
    tempo?: number
    timeSignature?: string
    key?: string
    songsterrUrl?: string
    songsterrId?: number
  } | null> {
    console.log('🎵 SongsterrService - Recherche tablature:', { title, artist })
    
    // 1. Rechercher la chanson
    console.log('🎵 SongsterrService - Appel searchByTitleAndArtist...')
    const song = await this.searchByTitleAndArtist(title, artist)
    if (!song) {
      console.warn(`❌ SongsterrService - Chanson non trouvée: "${title}" par ${artist}`)
      return null
    }

    console.log('✅ SongsterrService - Chanson trouvée:', {
      id: song.id,
      title: song.title,
      artist: song.artist.name
    })

    // 2. Récupérer les données supplémentaires de la tablature (si disponibles)
    console.log('🎵 SongsterrService - Récupération données tablature pour ID:', song.id)
    const tabData = await this.getTabData(song.id)
    
    if (tabData) {
      console.log('✅ SongsterrService - Données tablature reçues:', {
        tempo: tabData.tempo,
        timeSignature: tabData.timeSignature,
        key: tabData.key
      })
    } else {
      console.log('⚠️ SongsterrService - Aucune donnée tablature supplémentaire')
    }
    
    // 3. Construire l'URL Songsterr
    const songsterrUrl = this.buildSongsterrUrl(song)
    console.log('🔗 SongsterrService - URL Songsterr générée:', songsterrUrl)
    
    // 4. Convertir au format attendu
    // Note: Les mesures complètes nécessiteraient de parser le HTML retourné par Songsterr
    // Pour l'instant, on retourne un tableau vide et on affiche le lien vers Songsterr
    const measures = tabData ? this.convertToTablatureFormat(tabData, song) : []
    
    const result = {
      id: `songsterr-${song.id}`,
      title: song.title,
      artist: song.artist.name,
      measures: measures || [],
      tempo: tabData?.tempo,
      timeSignature: tabData?.timeSignature || '4/4',
      key: tabData?.key,
      songsterrUrl,
      songsterrId: song.id
    }
    
    console.log('✅ SongsterrService - Résultat final:', {
      id: result.id,
      title: result.title,
      artist: result.artist,
      measuresCount: result.measures.length,
      songsterrUrl: result.songsterrUrl
    })
    
    return result
  }

  /**
   * Recherche des chansons par pattern
   * @param pattern Mot-clé de recherche
   */
  async searchByPattern(pattern: string): Promise<SongsterrSong[]> {
    try {
      const url = `${this.baseUrl}/a/ra/songs.json?pattern=${encodeURIComponent(pattern)}`
      const response = await fetch(url)
      
      if (!response.ok) {
        console.error('Songsterr API error:', response.status, response.statusText)
        return []
      }

      const data = await response.json()
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error searching Songsterr:', error)
      return []
    }
  }
}

// Format attendu pour les mesures de tablature
interface TablatureMeasure {
  notes: Array<{
    string: number
    fret: number
    duration?: string
    time?: number
    technique?: string
  }>
  timeSignature?: string
  chord?: string
  section?: string
  instructions?: string[]
}

export const songsterrService = new SongsterrService()
