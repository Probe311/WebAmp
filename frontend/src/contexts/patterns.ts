import { DrumPattern } from './DrumMachineContext'

export const DEFAULT_PATTERNS: DrumPattern[] = [
  {
    name: 'Rock',
    bpm: 120,
    volumes: { kick: 88, snare: 85, hihat: 50, openhat: 70, crash: 75, ride: 60, tom1: 78, tom2: 78, tom3: 78 },
    steps: [
      // Pattern rock classique avec variations
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: true, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Metal',
    bpm: 160,
    volumes: { kick: 92, snare: 88, hihat: 58, openhat: 70, crash: 78, ride: 68, tom1: 82, tom2: 82, tom3: 82 },
    steps: [
      // Pattern metal thrash avec double kick
      { kick: true, snare: false, hihat: false, openhat: false, crash: true, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Funk',
    bpm: 108,
    volumes: { kick: 82, snare: 88, hihat: 58, openhat: 65, crash: 62, ride: 58, tom1: 72, tom2: 72, tom3: 72 },
    steps: [
      // Pattern funk avec syncopes caractéristiques
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: true, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Jazz',
    bpm: 135,
    volumes: { kick: 72, snare: 78, hihat: 58, openhat: 52, crash: 62, ride: 65, tom1: 68, tom2: 68, tom3: 68 },
    steps: [
      // Pattern jazz swing avec ride cymbal
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Hip-Hop',
    bpm: 95,
    volumes: { kick: 88, snare: 85, hihat: 68, openhat: 65, crash: 58, ride: 58, tom1: 72, tom2: 72, tom3: 72 },
    steps: [
      // Pattern trap/hip-hop avec hi-hats rapides
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: true, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Blues',
    bpm: 118,
    volumes: { kick: 84, snare: 80, hihat: 70, openhat: 67, crash: 67, ride: 62, tom1: 74, tom2: 74, tom3: 74 },
    steps: [
      // Pattern shuffle blues caractéristique
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: true, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Country',
    bpm: 125,
    volumes: { kick: 82, snare: 79, hihat: 64, openhat: 61, crash: 64, ride: 59, tom1: 71, tom2: 71, tom3: 71 },
    steps: [
      // Pattern country avec groove caractéristique
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: true, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Pop',
    bpm: 132,
    volumes: { kick: 87, snare: 84, hihat: 62, openhat: 68, crash: 73, ride: 65, tom1: 77, tom2: 77, tom3: 77 },
    steps: [
      // Pattern pop énergique avec variations
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: true, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Reggae',
    bpm: 80,
    volumes: { kick: 78, snare: 74, hihat: 68, openhat: 63, crash: 62, ride: 58, tom1: 68, tom2: 68, tom3: 68 },
    steps: [
      // Pattern reggae one drop caractéristique
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: true, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Disco',
    bpm: 126,
    volumes: { kick: 90, snare: 84, hihat: 68, openhat: 72, crash: 72, ride: 67, tom1: 80, tom2: 80, tom3: 80 },
    steps: [
      // Pattern disco four on floor
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: true, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Latin',
    bpm: 110,
    volumes: { kick: 82, snare: 80, hihat: 70, openhat: 67, crash: 67, ride: 55, tom1: 74, tom2: 74, tom3: 74 },
    steps: [
      // Pattern samba avec ride et hi-hats alternés
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Breakbeat',
    bpm: 130,
    volumes: { kick: 90, snare: 86, hihat: 72, openhat: 70, crash: 70, ride: 64, tom1: 80, tom2: 80, tom3: 80 },
    steps: [
      // Pattern breakbeat classique avec syncopes
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: true, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Shuffle',
    bpm: 118,
    volumes: { kick: 84, snare: 80, hihat: 70, openhat: 67, crash: 67, ride: 62, tom1: 74, tom2: 74, tom3: 74 },
    steps: [
      // Pattern shuffle avec groove caractéristique
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: true, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Minimal',
    bpm: 128,
    volumes: { kick: 85, snare: 78, hihat: 65, openhat: 62, crash: 58, ride: 58, tom1: 70, tom2: 70, tom3: 70 },
    steps: [
      // Pattern minimal techno épuré
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, tom1: false, tom2: false, tom3: false }
    ]
  }
]
