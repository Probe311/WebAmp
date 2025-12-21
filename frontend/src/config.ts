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
// Note: Les variables VITE_* sont injectées au build time dans Vercel
// Assurez-vous que VITE_GEMINI_API_KEY est définie dans les variables d'environnement Vercel
// et redéployez l'application après l'ajout
export const GEMINI_API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || '').trim()

// Debug en développement (ne sera pas inclus en production)
if (import.meta.env.DEV) {
  console.log('[Config] GEMINI_API_KEY défini:', !!GEMINI_API_KEY && GEMINI_API_KEY.length > 0)
}

