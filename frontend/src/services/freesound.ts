/**
 * Freesound API Service
 * 
 * Service pour l'intégration avec l'API Freesound
 * Bibliothèque de samples pour machine à rythmes, IRs et sons sous licence Creative Commons
 * 
 * Documentation : https://freesound.org/docs/api/
 * Note : Nécessite une clé API (gratuite) - https://freesound.org/apiv2/apply/
 */

export interface FreesoundSound {
  id: number;
  name: string;
  tags: string[];
  description: string;
  geotag?: string;
  created: string;
  license: string;
  type: string;
  channels: number;
  filesize: number;
  bitrate: number;
  bitdepth: number;
  duration: number;
  samplerate: number;
  username: string;
  pack?: string;
  pack_name?: string;
  download?: string;
  previews: {
    'preview-hq-mp3'?: string;
    'preview-hq-ogg'?: string;
    'preview-lq-mp3'?: string;
    'preview-lq-ogg'?: string;
  };
  images?: {
    waveform_m?: string;
    waveform_l?: string;
    spectral_m?: string;
    spectral_l?: string;
  };
  num_downloads: number;
  avg_rating: number;
  num_ratings: number;
  rate?: string;
  comments?: string;
  num_comments?: number;
  comment?: string;
  similar_sounds?: string;
  analysis?: {
    lowlevel?: Record<string, any>;
    rhythm?: Record<string, any>;
    tonal?: Record<string, any>;
  };
}

export interface FreesoundSearchResult {
  count: number;
  next?: string;
  previous?: string;
  results: FreesoundSound[];
}

export interface FreesoundPack {
  id: number;
  url: string;
  name: string;
  username: string;
  description: string;
  created: string;
  num_sounds: number;
  sounds: string;
  num_downloads: number;
}

export interface FreesoundConfig {
  apiKey?: string;
  baseUrl?: string;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
}

class FreesoundService {
  private baseUrl: string;
  private apiKey?: string;
  private accessToken?: string;
  private clientId?: string;
  private clientSecret?: string;

  constructor(config: FreesoundConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://freesound.org/apiv2';
    this.apiKey = config.apiKey || import.meta.env.VITE_FREESOUND_API_KEY;
    this.accessToken = config.accessToken;
    this.clientId = config.clientId || import.meta.env.VITE_FREESOUND_CLIENT_ID;
    this.clientSecret = config.clientSecret || import.meta.env.VITE_FREESOUND_CLIENT_SECRET;
  }

  /**
   * Obtient un token d'accès OAuth2 (si nécessaire)
   */
  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Freesound API: clientId and clientSecret are required for OAuth2');
    }

    try {
      const response = await fetch(`${this.baseUrl}/oauth2/access_token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error(`Freesound OAuth2 error: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token || '';
      return this.accessToken || '';
    } catch (error) {
      console.error('Freesound OAuth2 failed:', error);
      throw error;
    }
  }

  /**
   * Effectue une requête authentifiée à l'API Freesound
   */
  private async request<T>(
    endpoint: string,
    params: Record<string, string> = {},
    useToken: boolean = true
  ): Promise<T> {
    const token = useToken ? (this.accessToken || await this.getAccessToken()) : undefined;
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else if (this.apiKey) {
      headers['Authorization'] = `Token ${this.apiKey}`;
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(url, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`Freesound API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Freesound API request failed:', error);
      throw error;
    }
  }

  /**
   * Recherche des sons dans Freesound
   */
  async searchSounds(
    query: string,
    options: {
      filter?: string;
      sort?: 'score' | 'duration_desc' | 'duration_asc' | 'created_desc' | 'created_asc' | 'downloads_desc' | 'downloads_asc' | 'rating_desc' | 'rating_asc';
      fields?: string;
      page?: number;
      pageSize?: number;
    } = {}
  ): Promise<FreesoundSearchResult> {
    const params: Record<string, string> = {
      query,
      format: 'json',
    };

    if (options.filter) params.filter = options.filter;
    if (options.sort) params.sort = options.sort;
    if (options.fields) params.fields = options.fields;
    if (options.page) params.page = options.page.toString();
    if (options.pageSize) params.page_size = options.pageSize.toString();

    return await this.request<FreesoundSearchResult>('search/text', params);
  }

  /**
   * Recherche des samples pour machine à rythmes
   */
  async searchDrumSamples(
    type: 'kick' | 'snare' | 'hihat' | 'crash' | 'ride' | 'tom' | 'percussion',
    limit: number = 20
  ): Promise<FreesoundSound[]> {
    const query = `drum ${type} loop`;
    const result = await this.searchSounds(query, {
      filter: 'license:"Attribution" OR license:"Creative Commons 0"',
      sort: 'downloads_desc',
      pageSize: limit,
      fields: 'id,name,tags,description,license,previews,username,duration,samplerate',
    });

    return result.results;
  }

  /**
   * Recherche des IRs (Impulse Responses)
   */
  async searchImpulseResponses(
    query: string = 'impulse response',
    limit: number = 20
  ): Promise<FreesoundSound[]> {
    const result = await this.searchSounds(query, {
      filter: 'tag:impulse-response license:"Attribution" OR license:"Creative Commons 0"',
      sort: 'downloads_desc',
      pageSize: limit,
      fields: 'id,name,tags,description,license,previews,username,duration,samplerate',
    });

    return result.results;
  }

  /**
   * Récupère les détails d'un son par ID
   */
  async getSoundById(id: number): Promise<FreesoundSound> {
    return await this.request<FreesoundSound>(`sounds/${id}`, {
      fields: 'id,name,tags,description,license,previews,username,duration,samplerate,download,analysis',
    });
  }

  /**
   * Télécharge un son (nécessite authentification)
   */
  async downloadSound(soundId: number): Promise<Blob> {
    const sound = await this.getSoundById(soundId);
    
    if (!sound.download) {
      throw new Error('Download URL not available for this sound');
    }

    const token = this.accessToken || await this.getAccessToken();
    const response = await fetch(sound.download, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download sound: ${response.status}`);
    }

    return await response.blob();
  }

  /**
   * Recherche et import de contenus audio
   * Recherche des sons avec filtres de licence Creative Commons
   */
  async searchCreativeCommons(
    query: string,
    licenseTypes: string[] = ['Attribution', 'Creative Commons 0'],
    limit: number = 20
  ): Promise<FreesoundSound[]> {
    const licenseFilter = licenseTypes
      .map(license => `license:"${license}"`)
      .join(' OR ');

    const result = await this.searchSounds(query, {
      filter: licenseFilter,
      sort: 'downloads_desc',
      pageSize: limit,
      fields: 'id,name,tags,description,license,previews,username,duration,samplerate',
    });

    return result.results;
  }

  /**
   * Récupère un pack de sons
   */
  async getPackById(packId: number): Promise<FreesoundPack> {
    return await this.request<FreesoundPack>(`packs/${packId}`, {
      format: 'json',
    });
  }

  /**
   * Récupère les sons d'un pack
   */
  async getPackSounds(packId: number): Promise<FreesoundSound[]> {
    const pack = await this.getPackById(packId);
    const soundsUrl = pack.sounds;
    
    // Extraire l'ID du pack depuis l'URL
    const response = await fetch(soundsUrl, {
      headers: {
        'Authorization': this.accessToken 
          ? `Bearer ${this.accessToken}` 
          : this.apiKey 
            ? `Token ${this.apiKey}` 
            : '',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get pack sounds: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  }

  /**
   * Vérifie la licence d'un son
   */
  isCreativeCommons(sound: FreesoundSound): boolean {
    const ccLicenses = [
      'Attribution',
      'Creative Commons 0',
      'Attribution Noncommercial',
      'Creative Commons Sampling Plus',
    ];
    
    return ccLicenses.some(license => sound.license.includes(license));
  }
}

// Instance singleton
export const freesoundService = new FreesoundService();

// Export du service pour utilisation dans les composants
export default freesoundService;

