/**
 * Service d'administration pour gérer toutes les entités
 */
import { getSupabaseClient } from '../lib/supabaseClient'
import { Course, Lesson } from './supabase'
import { SupabasePedal, SupabaseAmplifier, SupabasePedalParameter, SupabaseAmplifierParameter } from './supabase/catalog'
import { createLogger } from './logger'

const logger = createLogger('AdminService')

// Types pour les marques
export interface Brand {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  logo_url_small: string | null
  website: string | null
  created_at: string
  updated_at: string
}

// Type pour les marques agrégées depuis amplis et pédales
export interface BrandFromProducts {
  name: string
  amplifierCount: number
  pedalCount: number
  brandData?: Brand // Données de la table brands si elle existe
}

// Types pour les configurations/presets
export interface Preset {
  id: string
  name: string
  description: string | null
  amplifier_id: string | null
  pedal_ids: string[]
  parameters: Record<string, any>
  is_public: boolean
  author_id: string | null
  created_at: string
  updated_at: string
}

// Types pour les packs DLC
export interface DLCPack {
  id: string
  name: string
  description: string | null
  type: 'brand' | 'style' | 'course' | 'artist' | 'genre'
  category: string
  thumbnail: string | null
  image_url: string | null
  price: number
  currency: string
  is_premium: boolean
  tags: string[]
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

// Types pour les feature flags
export interface FeatureFlag {
  id: string
  key: string
  name: string
  description: string | null
  enabled: boolean
  value: any
  created_at: string
  updated_at: string
}

class AdminService {
  private getClient() {
    const client = getSupabaseClient()
    if (!client) {
      throw new Error('Supabase client non initialisé')
    }
    return client
  }

  // ========== MARQUES ==========
  async getBrands(): Promise<Brand[]> {
    const { data, error } = await this.getClient()
      .from('brands')
      .select('*')
      .order('name', { ascending: true })
    
    // Si la table n'existe pas, retourner un tableau vide
    if (error) {
      if (error.code === '42P01') {
        return []
      }
      throw error
    }
    return data || []
  }

  // Récupérer les marques depuis les amplis et pédales
  async getBrandsFromProducts(): Promise<BrandFromProducts[]> {
    try {
      // Récupérer toutes les marques d'amplis
      const { data: amplifiers, error: ampError } = await this.getClient()
        .from('amplifiers')
        .select('brand')
      
      if (ampError && ampError.code !== '42P01') {
        throw ampError
      }

      // Récupérer toutes les marques de pédales
      const { data: pedals, error: pedalError } = await this.getClient()
        .from('pedals')
        .select('brand')
      
      if (pedalError && pedalError.code !== '42P01') {
        throw pedalError
      }

      // Compter les occurrences par marque
      const brandCounts: Record<string, { amplifierCount: number; pedalCount: number }> = {}
      
      if (amplifiers) {
        amplifiers.forEach((amp) => {
          if (amp.brand) {
            if (!brandCounts[amp.brand]) {
              brandCounts[amp.brand] = { amplifierCount: 0, pedalCount: 0 }
            }
            brandCounts[amp.brand].amplifierCount++
          }
        })
      }

      if (pedals) {
        pedals.forEach((pedal) => {
          if (pedal.brand) {
            if (!brandCounts[pedal.brand]) {
              brandCounts[pedal.brand] = { amplifierCount: 0, pedalCount: 0 }
            }
            brandCounts[pedal.brand].pedalCount++
          }
        })
      }

      // Récupérer les données des marques depuis la table brands
      const brands = await this.getBrands()
      const brandsMap = new Map(brands.map(b => [b.name.toLowerCase(), b]))

      // Créer le tableau de résultats
      const result: BrandFromProducts[] = Object.entries(brandCounts)
        .map(([name, counts]) => ({
          name,
          amplifierCount: counts.amplifierCount,
          pedalCount: counts.pedalCount,
          brandData: brandsMap.get(name.toLowerCase())
        }))
        .sort((a, b) => a.name.localeCompare(b.name))

      return result
    } catch (error) {
      // Si les tables n'existent pas, retourner un tableau vide
      if (error && typeof error === 'object' && 'code' in error && error.code === '42P01') {
        return []
      }
      throw error
    }
  }

  async createBrand(brand: Omit<Brand, 'id' | 'created_at' | 'updated_at'>): Promise<Brand> {
    // Ne pas inclure logo_url_small si la colonne n'existe pas dans le schéma
    // On crée un objet sans logo_url_small si elle n'est pas définie
    const brandData: any = {
      name: brand.name,
      description: brand.description,
      logo_url: brand.logo_url,
      website: brand.website,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Ajouter logo_url_small seulement si elle est définie
    // Si la colonne n'existe pas, on l'omettra silencieusement
    if (brand.logo_url_small !== undefined && brand.logo_url_small !== null) {
      brandData.logo_url_small = brand.logo_url_small
    }
    
    const { data, error } = await this.getClient()
      .from('brands')
      .insert(brandData)
      .select()
      .single()
    
    if (error) {
      // Si l'erreur est due à logo_url_small, réessayer sans
      if (error.message?.includes('logo_url_small')) {
        delete brandData.logo_url_small
        const { data: retryData, error: retryError } = await this.getClient()
          .from('brands')
          .insert(brandData)
          .select()
          .single()
        
        if (retryError) throw retryError
        return retryData
      }
      throw error
    }
    return data
  }

  async updateBrand(id: string, updates: Partial<Brand>): Promise<Brand> {
    // Ne pas inclure logo_url_small si la colonne n'existe pas dans le schéma
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    // Si logo_url_small n'est pas défini dans updates, ne pas l'inclure
    // Si elle est définie mais que la colonne n'existe pas, on gérera l'erreur
    if (updates.logo_url_small === undefined) {
      delete updateData.logo_url_small
    }
    
    const { data, error } = await this.getClient()
      .from('brands')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      // Si l'erreur est due à logo_url_small, réessayer sans
      if (error.message?.includes('logo_url_small')) {
        delete updateData.logo_url_small
        const { data: retryData, error: retryError } = await this.getClient()
          .from('brands')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()
        
        if (retryError) {
          const errorMessage = retryError.message || 'Erreur inconnue lors de la mise à jour'
          const errorCode = retryError.code || 'UNKNOWN'
          const enhancedError = new Error(`${errorMessage} (Code: ${errorCode})`)
          ;(enhancedError as any).originalError = retryError
          throw enhancedError
        }
        
        if (!retryData) {
          throw new Error('Aucune donnée retournée après la mise à jour')
        }
        
        return retryData
      }
      
      // Améliorer le message d'erreur pour le débogage
      const errorMessage = error.message || 'Erreur inconnue lors de la mise à jour'
      const errorCode = error.code || 'UNKNOWN'
      const enhancedError = new Error(`${errorMessage} (Code: ${errorCode})`)
      ;(enhancedError as any).originalError = error
      throw enhancedError
    }
    
    if (!data) {
      throw new Error('Aucune donnée retournée après la mise à jour')
    }
    
    return data
  }

  async deleteBrand(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from('brands')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // ========== AMPLIS ==========
  async getAmplifiers(): Promise<SupabaseAmplifier[]> {
    const { data, error } = await this.getClient()
      .from('amplifiers')
      .select('*')
      .order('brand', { ascending: true })
      .order('model', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  async getAmplifierParameters(amplifierId: string): Promise<SupabaseAmplifierParameter[]> {
    const { data, error } = await this.getClient()
      .from('amplifier_parameters')
      .select('*')
      .eq('amplifier_id', amplifierId)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  async createAmplifier(amplifier: Omit<SupabaseAmplifier, 'id'>): Promise<SupabaseAmplifier> {
    const { data, error } = await this.getClient()
      .from('amplifiers')
      .insert(amplifier)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateAmplifier(id: string, updates: Partial<SupabaseAmplifier>): Promise<SupabaseAmplifier> {
    const { data, error } = await this.getClient()
      .from('amplifiers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteAmplifier(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from('amplifiers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  async updateAmplifierParameters(amplifierId: string, parameters: Omit<SupabaseAmplifierParameter, 'id' | 'amplifier_id'>[]): Promise<void> {
    // Supprimer les anciens paramètres
    await this.getClient()
      .from('amplifier_parameters')
      .delete()
      .eq('amplifier_id', amplifierId)
    
    // Insérer les nouveaux
    if (parameters.length > 0) {
      const { error } = await this.getClient()
        .from('amplifier_parameters')
        .insert(parameters.map(p => ({ ...p, amplifier_id: amplifierId })))
      
      if (error) throw error
    }
  }

  // ========== PÉDALES ==========
  async getPedals(): Promise<SupabasePedal[]> {
    const { data, error } = await this.getClient()
      .from('pedals')
      .select('*')
      .order('brand', { ascending: true })
      .order('model', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  async getPedalParameters(pedalId: string): Promise<SupabasePedalParameter[]> {
    const { data, error } = await this.getClient()
      .from('pedal_parameters')
      .select('*')
      .eq('pedal_id', pedalId)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  async createPedal(pedal: Omit<SupabasePedal, 'id'>): Promise<SupabasePedal> {
    const { data, error } = await this.getClient()
      .from('pedals')
      .insert(pedal)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updatePedal(id: string, updates: Partial<SupabasePedal>): Promise<SupabasePedal> {
    const { data, error } = await this.getClient()
      .from('pedals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deletePedal(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from('pedals')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  async updatePedalParameters(pedalId: string, parameters: Omit<SupabasePedalParameter, 'id' | 'pedal_id'>[]): Promise<void> {
    // Supprimer les anciens paramètres
    await this.getClient()
      .from('pedal_parameters')
      .delete()
      .eq('pedal_id', pedalId)
    
    // Insérer les nouveaux
    if (parameters.length > 0) {
      const { error } = await this.getClient()
        .from('pedal_parameters')
        .insert(parameters.map(p => ({ ...p, pedal_id: pedalId })))
      
      if (error) throw error
    }
  }

  // ========== CONFIGURATIONS/PRESETS ==========
  async getPresets(): Promise<Preset[]> {
    const { data, error } = await this.getClient()
      .from('presets')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Si la table n'existe pas, retourner un tableau vide
    if (error) {
      if (error.code === '42P01') {
        return []
      }
      throw error
    }
    return data || []
  }

  async createPreset(preset: Omit<Preset, 'id' | 'created_at' | 'updated_at'>): Promise<Preset> {
    const { data, error } = await this.getClient()
      .from('presets')
      .insert({
        ...preset,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updatePreset(id: string, updates: Partial<Preset>): Promise<Preset> {
    const { data, error } = await this.getClient()
      .from('presets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deletePreset(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from('presets')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // ========== COURS ==========
  async getCourses(): Promise<Course[]> {
    const { data, error } = await this.getClient()
      .from('courses')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  async createCourse(course: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    const { data, error } = await this.getClient()
      .from('courses')
      .insert({
        ...course,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateCourse(id: string, updates: Partial<Course>): Promise<Course> {
    const { data, error } = await this.getClient()
      .from('courses')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteCourse(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from('courses')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  async getCourseWithLessons(courseId: string): Promise<{ course: Course; lessons: Lesson[] } | null> {
    const course = await this.getClient()
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()
    
    if (course.error || !course.data) {
      return null
    }

    const lessons = await this.getLessons(courseId)
    
    return {
      course: course.data,
      lessons
    }
  }

  // ========== LEÇONS ==========
  async getLessons(courseId?: string): Promise<Lesson[]> {
    let query = this.getClient()
      .from('lessons')
      .select('*')
      .order('order_index', { ascending: true })
    
    if (courseId) {
      query = query.eq('course_id', courseId)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data || []
  }

  async createLesson(lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Promise<Lesson> {
    const { data, error } = await this.getClient()
      .from('lessons')
      .insert({
        ...lesson,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateLesson(id: string, updates: Partial<Lesson>): Promise<Lesson> {
    try {
      const { data, error } = await this.getClient()
        .from('lessons')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) {
        logger.error('Erreur lors de la mise à jour de la leçon', error, {
          lessonId: id,
          updates,
          errorCode: error.code,
          errorMessage: error.message,
          errorDetails: error.details,
          errorHint: error.hint
        })
        throw error
      }
      
      logger.info('Leçon mise à jour avec succès', {
        lessonId: id,
        updates,
        newOrderIndex: updates.order_index
      })
      
      return data
    } catch (error) {
      logger.error('Exception lors de la mise à jour de la leçon', error, {
        lessonId: id,
        updates
      })
      throw error
    }
  }

  async deleteLesson(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from('lessons')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // ========== PACKS DLC ==========
  async getDLCPacks(): Promise<DLCPack[]> {
    const { data, error } = await this.getClient()
      .from('dlc_packs')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  async getDLCPackContent(packId: string): Promise<Array<{ id: number; pack_id: string; content_type: string; content_id: string; position: number }>> {
    const { data, error } = await this.getClient()
      .from('dlc_pack_content')
      .select('*')
      .eq('pack_id', packId)
      .order('position', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  async getDLCPackCourses(packId: string): Promise<Course[]> {
    const content = await this.getDLCPackContent(packId)
    const courseIds = content
      .filter(c => c.content_type === 'course')
      .map(c => c.content_id)
    
    if (courseIds.length === 0) {
      return []
    }

    const { data, error } = await this.getClient()
      .from('courses')
      .select('*')
      .in('id', courseIds)
      .order('order_index', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  async linkCourseToPack(packId: string, courseId: string, position?: number): Promise<void> {
    // Récupérer la position max si non fournie
    if (position === undefined) {
      const content = await this.getDLCPackContent(packId)
      const maxPosition = content.length > 0 
        ? Math.max(...content.map(c => c.position)) + 1 
        : 0
      position = maxPosition
    }

    const { error } = await this.getClient()
      .from('dlc_pack_content')
      .upsert({
        pack_id: packId,
        content_type: 'course',
        content_id: courseId,
        position
      }, {
        onConflict: 'pack_id,content_type,content_id'
      })
    
    if (error) throw error
  }

  async unlinkCourseFromPack(packId: string, courseId: string): Promise<void> {
    const { error } = await this.getClient()
      .from('dlc_pack_content')
      .delete()
      .eq('pack_id', packId)
      .eq('content_type', 'course')
      .eq('content_id', courseId)
    
    if (error) throw error
  }

  async createDLCPack(pack: Omit<DLCPack, 'id' | 'created_at' | 'updated_at'>): Promise<DLCPack> {
    const { data, error } = await this.getClient()
      .from('dlc_packs')
      .insert({
        ...pack,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateDLCPack(id: string, updates: Partial<DLCPack>): Promise<DLCPack> {
    const { data, error } = await this.getClient()
      .from('dlc_packs')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteDLCPack(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from('dlc_packs')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  // ========== FEATURE FLAGS ==========
  async getFeatureFlags(): Promise<FeatureFlag[]> {
    const { data, error } = await this.getClient()
      .from('feature_flags')
      .select('*')
      .order('key', { ascending: true })
    
    if (error) {
      // Si la table n'existe pas, retourner un tableau vide
      if (error.code === '42P01') {
        return []
      }
      throw error
    }
    return data || []
  }

  async createFeatureFlag(flag: Omit<FeatureFlag, 'id' | 'created_at' | 'updated_at'>): Promise<FeatureFlag> {
    const { data, error } = await this.getClient()
      .from('feature_flags')
      .insert({
        ...flag,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateFeatureFlag(id: string, updates: Partial<FeatureFlag>): Promise<FeatureFlag> {
    const { data, error } = await this.getClient()
      .from('feature_flags')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async deleteFeatureFlag(id: string): Promise<void> {
    const { error } = await this.getClient()
      .from('feature_flags')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

export const adminService = new AdminService()

