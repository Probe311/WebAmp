/**
 * Service d'analytics cookieless et léger
 * Utilise sessionStorage/localStorage pour tracker les événements sans cookies
 */

import { createLogger } from './logger'

const logger = createLogger('Analytics')

export interface AnalyticsEvent {
  id: string
  type: 'page_view' | 'event' | 'click' | 'error'
  name: string
  properties?: Record<string, unknown>
  timestamp: number
  sessionId: string
  userId?: string
  userAgent: string
  referrer?: string
  path: string
}

export interface AnalyticsSession {
  id: string
  startTime: number
  lastActivity: number
  pageViews: number
  events: number
  userId?: string
}

export interface AnalyticsStats {
  totalSessions: number
  totalPageViews: number
  totalEvents: number
  uniqueUsers: number
  averageSessionDuration: number
  pageViews: Record<string, number>
  events: Record<string, number>
  topPages: Array<{ path: string; views: number }>
  topEvents: Array<{ name: string; count: number }>
  sessionsByDay: Record<string, number>
  sessionsByCountry: Record<string, number>
  sessionsByDevice: Record<string, number>
  sessionsByBrowser: Record<string, number>
  sessionsByOS: Record<string, number>
  evolutionData: Array<{ date: string; sessions: number; pageViews: number; users: number }>
}

const SESSION_STORAGE_KEY = 'webamp_analytics_session'
const EVENTS_STORAGE_KEY = 'webamp_analytics_events'
const MAX_EVENTS_IN_STORAGE = 1000

class AnalyticsService {
  private sessionId: string | null = null
  private events: AnalyticsEvent[] = []
  private isInitialized = false

  /**
   * Initialise le service analytics
   */
  init(userId?: string) {
    if (this.isInitialized) return

    // Récupérer ou créer une session
    const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (sessionData) {
      try {
        const session: AnalyticsSession = JSON.parse(sessionData)
        // Vérifier si la session est toujours valide (moins de 30 minutes d'inactivité)
        const now = Date.now()
        if (now - session.lastActivity < 30 * 60 * 1000) {
          this.sessionId = session.id
          session.lastActivity = now
          if (userId) session.userId = userId
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
        } else {
          // Créer une nouvelle session
          this.createNewSession(userId)
        }
      } catch {
        this.createNewSession(userId)
      }
    } else {
      this.createNewSession(userId)
    }

    // Charger les événements depuis localStorage
    this.loadEventsFromStorage()

    this.isInitialized = true
  }

  /**
   * Crée une nouvelle session
   */
  private createNewSession(userId?: string) {
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session: AnalyticsSession = {
      id: this.sessionId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      pageViews: 0,
      events: 0,
      userId
    }
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
  }

  /**
   * Charge les événements depuis localStorage
   */
  private loadEventsFromStorage() {
    try {
      const stored = localStorage.getItem(EVENTS_STORAGE_KEY)
      if (stored) {
        this.events = JSON.parse(stored)
      }
    } catch {
      this.events = []
    }
  }

  /**
   * Sauvegarde les événements dans localStorage
   */
  private saveEventsToStorage() {
    try {
      // Garder seulement les N derniers événements
      const eventsToSave = this.events.slice(-MAX_EVENTS_IN_STORAGE)
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(eventsToSave))
    } catch (error) {
      logger.warn('Impossible de sauvegarder les événements analytics', { error })
    }
  }

  /**
   * Met à jour la session
   */
  private updateSession(incrementPageViews = false, incrementEvents = false) {
    if (!this.sessionId) return

    try {
      const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (sessionData) {
        const session: AnalyticsSession = JSON.parse(sessionData)
        session.lastActivity = Date.now()
        if (incrementPageViews) session.pageViews++
        if (incrementEvents) session.events++
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      }
    } catch (error) {
      logger.warn('Impossible de mettre à jour la session', { error })
    }
  }

  /**
   * Track un événement
   */
  track(eventName: string, properties?: Record<string, unknown>, userId?: string) {
    if (!this.isInitialized || !this.sessionId) {
      this.init(userId)
    }

    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'event',
      name: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId!,
      userId: userId || this.getSessionUserId(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
      path: window.location.pathname
    }

    this.events.push(event)
    this.updateSession(false, true)
    this.saveEventsToStorage()

    // Optionnel: envoyer à un backend (Supabase)
    this.sendToBackend(event).catch(() => {
      // Silencieux en cas d'erreur
    })
  }

  /**
   * Track une vue de page
   */
  pageView(path: string, userId?: string) {
    if (!this.isInitialized || !this.sessionId) {
      this.init(userId)
    }

    const event: AnalyticsEvent = {
      id: `page_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'page_view',
      name: 'page_view',
      properties: { path },
      timestamp: Date.now(),
      sessionId: this.sessionId!,
      userId: userId || this.getSessionUserId(),
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
      path
    }

    this.events.push(event)
    this.updateSession(true, false)
    this.saveEventsToStorage()

    // Optionnel: envoyer à un backend
    this.sendToBackend(event).catch(() => {
      // Silencieux en cas d'erreur
    })
  }

  /**
   * Track un clic
   */
  click(elementName: string, properties?: Record<string, unknown>, userId?: string) {
    this.track('click', { element: elementName, ...properties }, userId)
  }

  /**
   * Track une erreur
   */
  error(errorName: string, errorDetails?: unknown, userId?: string) {
    this.track('error', {
      error: errorName,
      details: errorDetails instanceof Error ? errorDetails.message : String(errorDetails)
    }, userId)
  }

  /**
   * Récupère l'ID utilisateur de la session
   */
  private getSessionUserId(): string | undefined {
    try {
      const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (sessionData) {
        const session: AnalyticsSession = JSON.parse(sessionData)
        return session.userId
      }
    } catch {
      // Ignorer les erreurs
    }
    return undefined
  }

  /**
   * Envoie un événement au backend (optionnel)
   */
  private async sendToBackend(_event: AnalyticsEvent): Promise<void> {
    // TODO: Implémenter l'envoi à Supabase si nécessaire
    // Pour l'instant, on garde tout en local
  }

  /**
   * Récupère toutes les sessions depuis sessionStorage (pour l'admin)
   */
  getAllSessions(): AnalyticsSession[] {
    // On ne peut pas lire toutes les sessions depuis sessionStorage car c'est par domaine
    // On utilise les événements pour reconstruire les sessions
    const sessionMap = new Map<string, AnalyticsSession>()
    
    this.events.forEach(event => {
      if (!sessionMap.has(event.sessionId)) {
        sessionMap.set(event.sessionId, {
          id: event.sessionId,
          startTime: event.timestamp,
          lastActivity: event.timestamp,
          pageViews: 0,
          events: 0,
          userId: event.userId
        })
      }
      
      const session = sessionMap.get(event.sessionId)!
      if (event.type === 'page_view') {
        session.pageViews++
      } else {
        session.events++
      }
      session.lastActivity = Math.max(session.lastActivity, event.timestamp)
    })
    
    return Array.from(sessionMap.values())
  }

  /**
   * Récupère tous les événements
   */
  getAllEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  /**
   * Parse le userAgent pour extraire le device
   */
  private parseDevice(userAgent: string): string {
    const ua = userAgent.toLowerCase()
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) {
      if (ua.includes('tablet') || ua.includes('ipad')) {
        return 'Tablet'
      }
      return 'Mobile'
    }
    return 'Desktop'
  }

  /**
   * Parse le userAgent pour extraire le navigateur
   */
  private parseBrowser(userAgent: string): string {
    const ua = userAgent.toLowerCase()
    if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome'
    if (ua.includes('firefox')) return 'Firefox'
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari'
    if (ua.includes('edg')) return 'Edge'
    if (ua.includes('opera') || ua.includes('opr')) return 'Opera'
    return 'Other'
  }

  /**
   * Parse le userAgent pour extraire l'OS
   */
  private parseOS(userAgent: string): string {
    const ua = userAgent.toLowerCase()
    if (ua.includes('windows')) return 'Windows'
    if (ua.includes('mac os') || ua.includes('macos')) return 'macOS'
    if (ua.includes('linux')) return 'Linux'
    if (ua.includes('android')) return 'Android'
    if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) return 'iOS'
    return 'Other'
  }

  /**
   * Détecte le pays depuis la langue du navigateur (approximation)
   * Note: Cette méthode est simplifiée. Pour une détection précise, utiliser une API IP
   */
  private detectCountry(_userAgent?: string): string {
    // Pour l'instant, on utilise une valeur par défaut
    // TODO: Implémenter une détection plus précise via API IP ou stocker la langue dans les événements
    return 'Unknown'
  }

  /**
   * Calcule les statistiques
   */
  getStats(): AnalyticsStats {
    const events = this.getAllEvents()
    const sessions = this.getAllSessions()
    
    const pageViews: Record<string, number> = {}
    const eventsByName: Record<string, number> = {}
    const sessionsByDay: Record<string, number> = {}
    const sessionsByCountry: Record<string, number> = {}
    const sessionsByDevice: Record<string, number> = {}
    const sessionsByBrowser: Record<string, number> = {}
    const sessionsByOS: Record<string, number> = {}
    const evolutionDataMap: Record<string, { sessions: number; pageViews: number; users: Set<string> }> = {}
    const uniqueUsers = new Set<string>()
    
    let totalPageViews = 0
    let totalEvents = 0
    
    events.forEach(event => {
      if (event.userId) {
        uniqueUsers.add(event.userId)
      }
      
      if (event.type === 'page_view') {
        totalPageViews++
        const path: string = event.path || (event.properties?.path as string | undefined) || 'unknown'
        pageViews[path] = (pageViews[path] || 0) + 1
      } else {
        totalEvents++
        const eventName: string = event.name
        eventsByName[eventName] = (eventsByName[eventName] || 0) + 1
      }
      
      // Sessions par jour
      const date = new Date(event.timestamp).toISOString().split('T')[0]
      sessionsByDay[date] = (sessionsByDay[date] || 0) + 1
      
      // Données d'évolution
      if (!evolutionDataMap[date]) {
        evolutionDataMap[date] = { sessions: 0, pageViews: 0, users: new Set() }
      }
      if (event.type === 'page_view') {
        evolutionDataMap[date].pageViews++
      }
      if (event.userId) {
        evolutionDataMap[date].users.add(event.userId)
      }
      
      // Analyser le userAgent pour device, browser, OS
      const device = this.parseDevice(event.userAgent)
      const browser = this.parseBrowser(event.userAgent)
      const os = this.parseOS(event.userAgent)
      
      sessionsByDevice[device] = (sessionsByDevice[device] || 0) + 1
      sessionsByBrowser[browser] = (sessionsByBrowser[browser] || 0) + 1
      sessionsByOS[os] = (sessionsByOS[os] || 0) + 1
      
      // Pour le pays, on utilise une approximation basée sur la langue du navigateur
      // Stockée dans les propriétés de l'événement si disponible
      const country = (event.properties?.country as string) || this.detectCountry(event.userAgent)
      sessionsByCountry[country] = (sessionsByCountry[country] || 0) + 1
    })
    
    // Compter les sessions uniques par jour
    const sessionMap = new Map<string, Set<string>>()
    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0]
      if (!sessionMap.has(date)) {
        sessionMap.set(date, new Set())
      }
      sessionMap.get(date)!.add(event.sessionId)
    })
    
    sessionMap.forEach((sessionIds, date) => {
      if (evolutionDataMap[date]) {
        evolutionDataMap[date].sessions = sessionIds.size
      }
    })
    
    // Convertir evolutionDataMap en tableau trié
    const evolutionData = Object.entries(evolutionDataMap)
      .map(([date, data]) => ({
        date,
        sessions: data.sessions,
        pageViews: data.pageViews,
        users: data.users.size
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    // Calculer la durée moyenne des sessions
    let totalDuration = 0
    sessions.forEach(session => {
      totalDuration += session.lastActivity - session.startTime
    })
    const averageSessionDuration = sessions.length > 0 ? totalDuration / sessions.length : 0
    
    // Top pages
    const topPages = Object.entries(pageViews)
      .map(([path, views]) => ({ path, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)
    
    // Top événements
    const topEvents = Object.entries(eventsByName)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
    
    return {
      totalSessions: sessions.length,
      totalPageViews,
      totalEvents,
      uniqueUsers: uniqueUsers.size,
      averageSessionDuration: Math.round(averageSessionDuration / 1000), // en secondes
      pageViews,
      events: eventsByName,
      topPages,
      topEvents,
      sessionsByDay,
      sessionsByCountry,
      sessionsByDevice,
      sessionsByBrowser,
      sessionsByOS,
      evolutionData
    }
  }

  /**
   * Efface toutes les données analytics (pour l'admin)
   */
  clearAll() {
    this.events = []
    localStorage.removeItem(EVENTS_STORAGE_KEY)
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
    this.isInitialized = false
    this.sessionId = null
  }

  /**
   * Exporte les données (pour l'admin)
   */
  exportData() {
    return {
      events: this.getAllEvents(),
      sessions: this.getAllSessions(),
      stats: this.getStats()
    }
  }
}

// Instance singleton
export const analyticsService = new AnalyticsService()

