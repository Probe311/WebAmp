/**
 * Système de logging centralisé pour WebAmp
 * 
 * Fournit une interface unifiée pour le logging avec :
 * - Filtrage automatique en production
 * - Support pour différents niveaux de log
 * - Intégration future avec services de monitoring (Sentry, etc.)
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogContext {
  [key: string]: unknown
}

const isDev = import.meta.env.DEV
const isProd = import.meta.env.PROD

// Niveau de log minimum (en production, seuls WARN et ERROR sont loggés)
const minLogLevel = isDev ? LogLevel.DEBUG : LogLevel.WARN

/**
 * Formate un message de log avec contexte
 */
function formatMessage(level: string, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString()
  const contextStr = context ? ` ${JSON.stringify(context)}` : ''
  return `[${timestamp}] [${level}] ${message}${contextStr}`
}

/**
 * Envoie un log à un service de monitoring externe (à implémenter)
 */
function sendToMonitoring(_level: LogLevel, _message: string, _error?: Error, _context?: LogContext): void {
  if (!isProd) return

  // TODO: Intégrer avec Sentry ou autre service de monitoring
  // Exemple :
  // if (level >= LogLevel.ERROR && typeof window !== 'undefined' && (window as any).Sentry) {
  //   (window as any).Sentry.captureException(error || new Error(message), { extra: context })
  // }
}

/**
 * Logger principal
 */
export const logger = {
  /**
   * Log de débogage (uniquement en développement)
   */
  debug: (message: string, context?: LogContext): void => {
    if (minLogLevel <= LogLevel.DEBUG) {
      console.debug(formatMessage('DEBUG', message, context))
    }
  },

  /**
   * Log d'information
   */
  info: (message: string, context?: LogContext): void => {
    if (minLogLevel <= LogLevel.INFO) {
      console.info(formatMessage('INFO', message, context))
    }
  },

  /**
   * Log d'avertissement
   */
  warn: (message: string, context?: LogContext): void => {
    if (minLogLevel <= LogLevel.WARN) {
      console.warn(formatMessage('WARN', message, context))
    }
    sendToMonitoring(LogLevel.WARN, message, undefined, context)
  },

  /**
   * Log d'erreur
   * Toujours loggé, même en production
   */
  error: (message: string, error?: Error | unknown, context?: LogContext): void => {
    // Toujours logger les erreurs
    const errorObj = error instanceof Error ? error : new Error(String(error))
    console.error(formatMessage('ERROR', message, context), errorObj)
    
    // Envoyer à un service de monitoring en production
    sendToMonitoring(LogLevel.ERROR, message, errorObj, context)
  },

  /**
   * Log d'erreur avec stack trace
   */
  errorWithStack: (message: string, error?: Error | unknown, context?: LogContext): void => {
    const errorObj = error instanceof Error ? error : new Error(String(error))
    logger.error(message, errorObj, context)
    
    if (isDev && errorObj.stack) {
      console.error('Stack trace:', errorObj.stack)
    }
  },
}

/**
 * Crée un logger avec un préfixe (pour les modules spécifiques)
 */
export function createLogger(prefix: string) {
  return {
    debug: (message: string, context?: LogContext) => 
      logger.debug(`[${prefix}] ${message}`, context),
    info: (message: string, context?: LogContext) => 
      logger.info(`[${prefix}] ${message}`, context),
    warn: (message: string, context?: LogContext) => 
      logger.warn(`[${prefix}] ${message}`, context),
    error: (message: string, error?: Error | unknown, context?: LogContext) => 
      logger.error(`[${prefix}] ${message}`, error, context),
    errorWithStack: (message: string, error?: Error | unknown, context?: LogContext) => 
      logger.errorWithStack(`[${prefix}] ${message}`, error, context),
  }
}

