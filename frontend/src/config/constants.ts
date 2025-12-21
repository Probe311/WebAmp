/**
 * Constantes de l'application WebAmp
 * 
 * Toutes les constantes magiques doivent être définies ici
 */

// Configuration Admin
export const ADMIN_UUID = import.meta.env.VITE_ADMIN_UUID || 'd7725a82-1538-4bac-b158-ac5bf68f4504'

// Configuration WebSocket
export const WEBSOCKET_DEFAULT_URL = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8765'
export const WEBSOCKET_MAX_RECONNECT_ATTEMPTS = 5
export const WEBSOCKET_RECONNECT_DELAY = 1000 // ms
export const WEBSOCKET_ACK_TIMEOUT = 5000 // ms

// Configuration du chargement de profils
export const PROFILE_STATE_UPDATE_DELAY = 300 // ms
export const PROFILE_PEDAL_ADD_DELAY = 150 // ms

// Configuration du debouncing
export const PARAMETER_UPDATE_DEBOUNCE_DELAY = 50 // ms
export const SEARCH_DEBOUNCE_DELAY = 300 // ms

// Configuration audio
export const DEFAULT_SAMPLE_RATE = 44100
export const DEFAULT_AUDIO_ROUTING = 'serial' as const

// Configuration Supabase
export const SUPABASE_STORAGE_KEY_AUTH = 'webamp-auth'
export const SUPABASE_STORAGE_KEY_DATA = 'webamp-data'

