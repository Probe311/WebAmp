/**
 * MusicBrainz API Service
 * 
 * Service pour l'intégration avec l'API MusicBrainz
 * Enrichissement des métadonnées de presets (artiste, album, genre)
 * 
 * Documentation : https://musicbrainz.org/doc/MusicBrainz_API
 */

export interface MusicBrainzArtist {
  id: string;
  name: string;
  'sort-name'?: string;
  disambiguation?: string;
  country?: string;
  'life-span'?: {
    begin?: string;
    end?: string;
    ended?: boolean;
  };
  tags?: Array<{ name: string; count: number }>;
}

export interface MusicBrainzRelease {
  id: string;
  title: string;
  'release-group'?: {
    id: string;
    title: string;
    'primary-type'?: string;
    'secondary-types'?: string[];
  };
  date?: string;
  country?: string;
  'release-events'?: Array<{
    date?: string;
    area?: { name: string };
  }>;
  media?: Array<{
    format?: string;
    'track-count'?: number;
  }>;
}

export interface MusicBrainzRecording {
  id: string;
  title: string;
  length?: number;
  disambiguation?: string;
  'first-release-date'?: string;
  releases?: MusicBrainzRelease[];
  'artist-credit'?: Array<{
    artist: MusicBrainzArtist;
    name: string;
  }>;
  tags?: Array<{ name: string; count: number }>;
}

export interface MusicBrainzSearchResult<T> {
  created: string;
  count: number;
  offset: number;
  'musicbrainz-query': string;
  [key: string]: T[] | string | number;
}

export interface MusicBrainzConfig {
  baseUrl?: string;
  userAgent?: string;
  rateLimitDelay?: number;
}

class MusicBrainzService {
  private baseUrl: string;
  private userAgent: string;
  private rateLimitDelay: number;
  private lastRequestTime: number = 0;

  constructor(config: MusicBrainzConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://musicbrainz.org/ws/2';
    this.userAgent = config.userAgent || 'WebAmp/1.0.0 (https://github.com/your-repo)';
    this.rateLimitDelay = config.rateLimitDelay || 1000; // 1 requête par seconde par défaut
  }

  /**
   * Respecte le rate limiting de MusicBrainz (1 requête/seconde)
   */
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await new Promise(resolve => 
        setTimeout(resolve, this.rateLimitDelay - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  /**
   * Effectue une requête à l'API MusicBrainz
   */
  private async request<T>(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<T> {
    await this.rateLimit();

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`MusicBrainz API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('MusicBrainz API request failed:', error);
      throw error;
    }
  }

  /**
   * Recherche un artiste par nom
   */
  async searchArtist(query: string, limit: number = 10): Promise<MusicBrainzArtist[]> {
    const result = await this.request<MusicBrainzSearchResult<MusicBrainzArtist>>(
      'artist',
      {
        query: `artist:"${query}"`,
        limit: limit.toString(),
        fmt: 'json',
      }
    );

    return (result.artists || []) as MusicBrainzArtist[];
  }

  /**
   * Recherche un album/release par titre
   */
  async searchRelease(query: string, limit: number = 10): Promise<MusicBrainzRelease[]> {
    const result = await this.request<MusicBrainzSearchResult<MusicBrainzRelease>>(
      'release',
      {
        query: `release:"${query}"`,
        limit: limit.toString(),
        fmt: 'json',
      }
    );

    return (result.releases || []) as MusicBrainzRelease[];
  }

  /**
   * Recherche un enregistrement par titre
   */
  async searchRecording(query: string, limit: number = 10): Promise<MusicBrainzRecording[]> {
    const result = await this.request<MusicBrainzSearchResult<MusicBrainzRecording>>(
      'recording',
      {
        query: `recording:"${query}"`,
        limit: limit.toString(),
        fmt: 'json',
      }
    );

    return (result.recordings || []) as MusicBrainzRecording[];
  }

  /**
   * Récupère les détails d'un artiste par ID
   */
  async getArtistById(id: string): Promise<MusicBrainzArtist> {
    return await this.request<MusicBrainzArtist>(`artist/${id}`, {
      inc: 'tags',
      fmt: 'json',
    });
  }

  /**
   * Récupère les détails d'un release par ID
   */
  async getReleaseById(id: string): Promise<MusicBrainzRelease> {
    return await this.request<MusicBrainzRelease>(`release/${id}`, {
      inc: 'release-groups',
      fmt: 'json',
    });
  }

  /**
   * Auto-complétion des tags depuis MusicBrainz
   * Recherche les tags associés à un artiste ou un album
   */
  async getTagsForArtist(artistName: string): Promise<string[]> {
    const artists = await this.searchArtist(artistName, 1);
    
    if (artists.length === 0) {
      return [];
    }

    const artist = await this.getArtistById(artists[0].id);
    return (artist.tags || []).map(tag => tag.name);
  }

  /**
   * Recherche de presets par métadonnées musicales
   * Retourne les suggestions basées sur les tags MusicBrainz
   */
  async searchByMetadata(
    artist?: string,
    album?: string
  ): Promise<{
    artists: MusicBrainzArtist[];
    releases: MusicBrainzRelease[];
    tags: string[];
  }> {
    const results = {
      artists: [] as MusicBrainzArtist[],
      releases: [] as MusicBrainzRelease[],
      tags: [] as string[],
    };

    if (artist) {
      results.artists = await this.searchArtist(artist, 5);
      if (results.artists.length > 0) {
        const artistDetails = await this.getArtistById(results.artists[0].id);
        results.tags = (artistDetails.tags || []).map(tag => tag.name);
      }
    }

    if (album) {
      results.releases = await this.searchRelease(album, 5);
    }

    return results;
  }

  /**
   * Association presets ↔ artistes/albums
   * Crée une association entre un preset et des métadonnées MusicBrainz
   */
  async associatePresetWithMetadata(
    presetId: string,
    artistId?: string,
    releaseId?: string,
    recordingId?: string
  ): Promise<{
    presetId: string;
    artist?: MusicBrainzArtist;
    release?: MusicBrainzRelease;
    recording?: MusicBrainzRecording;
  }> {
    const association: any = { presetId };

    if (artistId) {
      association.artist = await this.getArtistById(artistId);
    }

    if (releaseId) {
      association.release = await this.getReleaseById(releaseId);
    }

    if (recordingId) {
      association.recording = await this.request<MusicBrainzRecording>(
        `recording/${recordingId}`,
        { fmt: 'json' }
      );
    }

    return association;
  }
}

// Instance singleton
export const musicBrainzService = new MusicBrainzService();

// Export du service pour utilisation dans les composants
export default musicBrainzService;
