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
    
    // Debug: vérifier que les variables sont chargées (uniquement en développement)
    if (import.meta.env.DEV) {
      console.debug('Freesound config:', {
        hasApiKey: !!this.apiKey,
        hasClientId: !!this.clientId,
        hasClientSecret: !!this.clientSecret,
        clientIdLength: this.clientId?.length || 0,
        clientSecretLength: this.clientSecret?.length || 0,
      });
    }
  }

  /**
   * Obtient un token d'accès OAuth2 (si nécessaire)
   * Retourne null si OAuth2 n'est pas disponible, permettant l'utilisation de l'API key simple
   */
  async getAccessToken(): Promise<string | null> {
    if (this.accessToken) {
      return this.accessToken;
    }

    if (!this.clientId || !this.clientSecret) {
      // OAuth2 non configuré, on utilisera l'API key simple si disponible
      return null;
    }

    try {
      const requestBody = new URLSearchParams({
        client_id: this.clientId!,
        client_secret: this.clientSecret!,
        grant_type: 'client_credentials',
      });

      if (import.meta.env.DEV) {
        console.debug('Freesound OAuth2 request:', {
          url: `${this.baseUrl}/oauth2/access_token/`,
          clientId: this.clientId?.substring(0, 5) + '...',
          hasClientSecret: !!this.clientSecret,
        });
      }

      const response = await fetch(`${this.baseUrl}/oauth2/access_token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Freesound OAuth2 error: ${response.status}`;
        let errorDetails: any = {};
        try {
          errorDetails = JSON.parse(errorText);
          errorMessage = errorDetails.error_description || errorDetails.error || errorMessage;
        } catch {
          errorMessage = `${errorMessage} - ${errorText}`;
        }
        
        console.warn('Freesound OAuth2 authentication failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          details: errorDetails,
        });
        
        // Ne pas lancer d'erreur, retourner null pour permettre l'utilisation de l'API key
        return null;
      }

      const data = await response.json();
      this.accessToken = data.access_token || '';
      
      if (import.meta.env.DEV) {
        console.debug('Freesound OAuth2 token obtained successfully');
      }
      
      return this.accessToken || null;
    } catch (error) {
      console.warn('Freesound OAuth2 authentication error:', error);
      // Ne pas lancer d'erreur, retourner null pour permettre l'utilisation de l'API key
      return null;
    }
  }

  /**
   * Effectue une requête authentifiée à l'API Freesound
   * @param useOAuth2 Si true, essaie d'utiliser OAuth2 (pour les téléchargements). Si false, utilise l'API key (pour les recherches).
   */
  private async request<T>(
    endpoint: string,
    params: Record<string, string> = {},
    useOAuth2: boolean = false
  ): Promise<T> {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    
    // Pour les recherches, utiliser directement l'API key (plus simple et fiable)
    // Pour les téléchargements, utiliser OAuth2 si disponible
    if (useOAuth2) {
      // Essayer OAuth2 pour les téléchargements
      const token = this.accessToken || await this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (this.apiKey) {
        // Fallback vers API key si OAuth2 n'est pas disponible
        headers['Authorization'] = `Token ${this.apiKey}`;
      } else {
        throw new Error('Freesound API: OAuth2 authentication required for this operation. Please configure VITE_FREESOUND_CLIENT_ID and VITE_FREESOUND_CLIENT_SECRET.');
      }
    } else {
      // Pour les recherches, utiliser directement l'API key
      if (this.apiKey) {
        headers['Authorization'] = `Token ${this.apiKey}`;
      } else {
        // Si pas d'API key, essayer OAuth2 en dernier recours
        const token = this.accessToken || await this.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          throw new Error('Freesound API: No authentication method available. Please configure VITE_FREESOUND_API_KEY or OAuth2 credentials.');
        }
      }
    }

    const queryString = new URLSearchParams(params).toString();
    const url = `${this.baseUrl}/${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(url, {
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Freesound API error: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.detail || errorData.error || errorMessage;
        } catch {
          if (errorText) {
            errorMessage = `${errorMessage} - ${errorText}`;
          }
        }
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Recherche des sons dans Freesound
   * Utilise l'API key simple (pas OAuth2) pour les recherches
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

    // Utiliser l'API key directement pour les recherches (useOAuth2 = false)
    return await this.request<FreesoundSearchResult>('search/text', params, false);
  }

  /**
   * Recherche des samples pour machine à rythmes
   */
  async searchDrumSamples(
    type: 'kick' | 'snare' | 'hihat' | 'crash' | 'ride' | 'tom' | 'percussion',
    limit: number = 20
  ): Promise<FreesoundSound[]> {
    // Requêtes optimisées pour chaque type d'instrument
    const searchQueries: Record<string, string> = {
      kick: 'drum kick bass drum',
      snare: 'drum snare',
      hihat: 'drum hihat closed hi-hat',
      crash: 'drum crash cymbal',
      ride: 'drum ride cymbal',
      tom: 'drum tom',
      percussion: 'drum percussion'
    };

    const query = searchQueries[type] || `drum ${type}`;
    
    // Filtres pour obtenir des samples courts (pas des loops)
    // Durée max 2 secondes pour les samples individuels
    const result = await this.searchSounds(query, {
      filter: '(license:"Attribution" OR license:"Creative Commons 0") duration:[0 TO 2]',
      sort: 'downloads_desc',
      pageSize: limit,
      fields: 'id,name,tags,description,license,previews,username,duration,samplerate,download',
    });

    // Filtrer les résultats pour s'assurer qu'ils sont pertinents
    return result.results.filter(sound => {
      // Exclure les loops et les samples trop longs
      const name = sound.name.toLowerCase();
      const tags = sound.tags.join(' ').toLowerCase();
      const isLoop = name.includes('loop') || tags.includes('loop');
      const isTooLong = sound.duration > 2.5;
      
      return !isLoop && !isTooLong;
    });
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
   * Utilise l'API key simple (pas OAuth2) pour la lecture
   */
  async getSoundById(id: number): Promise<FreesoundSound> {
    // Utiliser l'API key directement pour la lecture (useOAuth2 = false)
    return await this.request<FreesoundSound>(`sounds/${id}`, {
      fields: 'id,name,tags,description,license,previews,username,duration,samplerate,download,analysis',
    }, false);
  }

  /**
   * Télécharge un son (nécessite authentification OAuth2)
   */
  async downloadSound(soundId: number): Promise<Blob> {
    const sound = await this.getSoundById(soundId);
    
    if (!sound.download) {
      throw new Error('Download URL not available for this sound');
    }

    const token = this.accessToken || await this.getAccessToken();
    if (!token) {
      throw new Error('OAuth2 authentication required for downloading sounds. Please configure VITE_FREESOUND_CLIENT_ID and VITE_FREESOUND_CLIENT_SECRET.');
    }

    const response = await fetch(sound.download, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Failed to download sound: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || errorData.error || errorMessage;
      } catch {
        if (errorText) {
          errorMessage = `${errorMessage} - ${errorText}`;
        }
      }
      throw new Error(errorMessage);
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
   * Utilise l'API key simple (pas OAuth2) pour la lecture
   */
  async getPackById(packId: number): Promise<FreesoundPack> {
    // Utiliser l'API key directement pour la lecture (useOAuth2 = false)
    return await this.request<FreesoundPack>(`packs/${packId}`, {
      format: 'json',
    }, false);
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

