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

// Freesound API (clé publique / client id seulement — jamais de client_secret en VITE_*)
export const FREESOUND_CLIENT_ID = import.meta.env.VITE_FREESOUND_CLIENT_ID || ''
export const FREESOUND_API_KEY = import.meta.env.VITE_FREESOUND_API_KEY || ''

// Gemini : clé uniquement en secret Edge Function (GEMINI_API_KEY) — jamais VITE_*

