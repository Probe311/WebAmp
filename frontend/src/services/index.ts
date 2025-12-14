/**
 * Services Index
 * 
 * Export centralisé de tous les services API
 */

export { default as musicBrainzService, type MusicBrainzArtist, type MusicBrainzRelease, type MusicBrainzRecording } from './musicbrainz';
export { default as freesoundService, type FreesoundSound, type FreesoundSearchResult } from './freesound';
export { WebSocketClient } from './websocket';

