/**
 * Configuration de l'application WebAmp
 * 
 * Les variables d'environnement peuvent être définies via :
 * - Fichier .env.local (pour le développement local)
 * - Variables d'environnement système
 * - Valeurs par défaut ci-dessous
 */

// Supabase
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Freesound API
export const FREESOUND_CLIENT_ID = import.meta.env.VITE_FREESOUND_CLIENT_ID || ''
export const FREESOUND_CLIENT_SECRET = import.meta.env.VITE_FREESOUND_CLIENT_SECRET || ''
export const FREESOUND_API_KEY = import.meta.env.VITE_FREESOUND_API_KEY || ''

// Google Gemini API
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

