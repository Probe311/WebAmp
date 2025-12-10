/**
 * Configuration de l'application WebAmp
 * 
 * Les variables d'environnement peuvent être définies via :
 * - Fichier .env.local (pour le développement local)
 * - Variables d'environnement système
 * - Valeurs par défaut ci-dessous
 */

// URL du serveur WebSocket (vide en dev si non configuré pour éviter les erreurs)
const envWebSocketUrl = import.meta.env.VITE_WEBSOCKET_URL
export const WEBSOCKET_URL = envWebSocketUrl !== undefined
  ? envWebSocketUrl
  : (import.meta.env.DEV ? '' : 'ws://localhost:8765')

// Timeout pour les acknowledgments (en ms)
export const ACK_TIMEOUT = 5000

// Nombre maximum de tentatives de reconnexion
export const MAX_RECONNECT_ATTEMPTS = 10

// Délai initial de reconnexion (en ms)
export const RECONNECT_DELAY = 1000

// Supabase
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

