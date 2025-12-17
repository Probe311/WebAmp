/**
 * Neural Amp Modeler (NAM) Loader
 * 
 * Utilitaire pour charger et gérer les modèles NAM (.nam)
 * Support des modèles NAM pour modélisation d'amplis/pédales par IA
 * 
 * Documentation : https://neuralampmodeler.com
 * Format NAM : Modèles d'ampli/pédale exportables
 */

export interface NAMModelMetadata {
  name: string;
  author?: string;
  description?: string;
  modelType: 'amp' | 'pedal' | 'cabinet';
  version?: string;
  sampleRate: number;
  inputGain?: number;
  outputGain?: number;
  toneStack?: string;
  createdAt?: string;
  tags?: string[];
}

export interface NAMModel {
  metadata: NAMModelMetadata;
  modelData: ArrayBuffer;
  fileSize: number;
  fileName: string;
}

export interface NAMModelLibrary {
  models: NAMModel[];
  categories: Record<string, NAMModel[]>;
}

class NAMLoader {
  private modelCache: Map<string, NAMModel> = new Map();
  private libraryCache: NAMModelLibrary | null = null;

  /**
   * Charge un modèle NAM depuis un fichier
   */
  async loadFromFile(file: File): Promise<NAMModel> {
    // Vérifier le cache
    const cacheKey = `${file.name}-${file.size}`;
    if (this.modelCache.has(cacheKey)) {
      return this.modelCache.get(cacheKey)!;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const metadata = await this.parseNAMMetadata(arrayBuffer);
      
      const model: NAMModel = {
        metadata,
        modelData: arrayBuffer,
        fileSize: file.size,
        fileName: file.name,
      };

      this.modelCache.set(cacheKey, model);
      return model;
    } catch (error) {
      throw new Error(`Failed to load NAM model: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Charge un modèle NAM depuis une URL
   */
  async loadFromURL(url: string, fileName?: string): Promise<NAMModel> {
    // Vérifier le cache
    if (this.modelCache.has(url)) {
      return this.modelCache.get(url)!;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch NAM model: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const metadata = await this.parseNAMMetadata(arrayBuffer);
      
      const model: NAMModel = {
        metadata,
        modelData: arrayBuffer,
        fileSize: arrayBuffer.byteLength,
        fileName: fileName || url.split('/').pop() || 'model.nam',
      };

      this.modelCache.set(url, model);
      return model;
    } catch (error) {
      throw new Error(`Failed to load NAM model from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse les métadonnées d'un fichier NAM
   * Format NAM : Header JSON + données binaires du modèle
   */
  private async parseNAMMetadata(arrayBuffer: ArrayBuffer): Promise<NAMModelMetadata> {
    try {
      // Les fichiers NAM commencent généralement par un header JSON
      const textDecoder = new TextDecoder('utf-8');
      const headerSize = 1024; // Taille approximative du header
      const headerBytes = arrayBuffer.slice(0, Math.min(headerSize, arrayBuffer.byteLength));
      const headerText = textDecoder.decode(headerBytes);

      // Chercher le JSON dans le header
      const jsonStart = headerText.indexOf('{');
      const jsonEnd = headerText.lastIndexOf('}') + 1;

      if (jsonStart === -1 || jsonEnd === 0) {
        // Si pas de JSON, créer des métadonnées par défaut
        return {
          name: 'Unknown Model',
          modelType: 'amp',
          sampleRate: 48000,
        };
      }

      const jsonText = headerText.substring(jsonStart, jsonEnd);
      const metadata = JSON.parse(jsonText);

      return {
        name: metadata.name || 'Unknown Model',
        author: metadata.author,
        description: metadata.description,
        modelType: metadata.model_type || metadata.modelType || 'amp',
        version: metadata.version,
        sampleRate: metadata.sample_rate || metadata.sampleRate || 48000,
        inputGain: metadata.input_gain || metadata.inputGain,
        outputGain: metadata.output_gain || metadata.outputGain,
        toneStack: metadata.tone_stack || metadata.toneStack,
        createdAt: metadata.created_at || metadata.createdAt,
        tags: metadata.tags || [],
      };
    } catch (error) {
      return {
        name: 'Unknown Model',
        modelType: 'amp',
        sampleRate: 48000,
      };
    }
  }

  /**
   * Charge une bibliothèque de modèles NAM pré-chargés
   */
  async loadLibrary(libraryPath: string): Promise<NAMModelLibrary> {
    if (this.libraryCache) {
      return this.libraryCache;
    }

    try {
      const response = await fetch(libraryPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch NAM library: ${response.status}`);
      }

      const libraryData = await response.json();
      const library: NAMModelLibrary = {
        models: [],
        categories: {},
      };

      // Charger chaque modèle de la bibliothèque
      for (const modelEntry of libraryData.models || []) {
        try {
          const model = await this.loadFromURL(modelEntry.url, modelEntry.name);
          library.models.push(model);

          // Organiser par catégorie
          const category = model.metadata.modelType || 'other';
          if (!library.categories[category]) {
            library.categories[category] = [];
          }
          library.categories[category].push(model);
        } catch (error) {
          // échec silencieux du chargement d'un modèle individuel
        }
      }

      this.libraryCache = library;
      return library;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Récupère un modèle depuis le cache
   */
  getCachedModel(key: string): NAMModel | undefined {
    return this.modelCache.get(key);
  }

  /**
   * Liste tous les modèles en cache
   */
  getCachedModels(): NAMModel[] {
    return Array.from(this.modelCache.values());
  }

  /**
   * Supprime un modèle du cache
   */
  removeFromCache(key: string): boolean {
    return this.modelCache.delete(key);
  }

  /**
   * Vide le cache
   */
  clearCache(): void {
    this.modelCache.clear();
    this.libraryCache = null;
  }

  /**
   * Exporte un modèle NAM (pour partage)
   */
  async exportModel(model: NAMModel): Promise<Blob> {
    return new Blob([model.modelData], { type: 'application/octet-stream' });
  }

  /**
   * Valide un fichier NAM
   */
  async validateNAMFile(file: File): Promise<{ valid: boolean; error?: string }> {
    try {
      // Vérifier l'extension
      if (!file.name.toLowerCase().endsWith('.nam')) {
        return { valid: false, error: 'File must have .nam extension' };
      }

      // Vérifier la taille (les modèles NAM sont généralement > 1MB)
      if (file.size < 1024) {
        return { valid: false, error: 'File too small to be a valid NAM model' };
      }

      // Essayer de parser les métadonnées
      const arrayBuffer = await file.arrayBuffer();
      await this.parseNAMMetadata(arrayBuffer);

      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Unknown validation error',
      };
    }
  }

  /**
   * Partage de modèles NAM entre utilisateurs
   * Prépare les données pour l'upload
   */
  prepareForSharing(model: NAMModel): {
    metadata: NAMModelMetadata;
    fileSize: number;
    fileName: string;
  } {
    return {
      metadata: model.metadata,
      fileSize: model.fileSize,
      fileName: model.fileName,
    };
  }
}

// Instance singleton
export const namLoader = new NAMLoader();

// Export du loader pour utilisation dans les composants
export default namLoader;

