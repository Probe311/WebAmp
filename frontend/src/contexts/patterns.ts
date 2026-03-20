import { DrumPattern } from './DrumMachineContext'

export const DEFAULT_PATTERNS: DrumPattern[] = [
  {
    name: 'Rock',
    bpm: 110,
    volumes: { kick: 95, snare: 90, hihat: 60, openhat: 75, crash: 80, ride: 65, chinese: 70, tom1: 75, tom2: 75, tom3: 80 },
    steps: [
      { kick: true, snare: false, hihat: true, openhat: false, crash: true, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }, // Crash sur le 1
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }, // Backbeat
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }, // Kick double
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }, // Ouverture HH
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: true, tom2: false, tom3: false }, // Fill léger début
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: true, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: true }, // Snare + Tom
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Hard Rock',
    bpm: 125,
    volumes: { kick: 98, snare: 92, hihat: 50, openhat: 70, crash: 85, ride: 80, chinese: 75, tom1: 80, tom2: 80, tom3: 85 },
    steps: [
      { kick: true, snare: false, hihat: false, openhat: false, crash: true, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Metal',
    bpm: 160,
    volumes: { kick: 100, snare: 95, hihat: 65, openhat: 80, crash: 85, ride: 70, chinese: 90, tom1: 85, tom2: 85, tom3: 90 },
    steps: [
      { kick: true, snare: false, hihat: true, openhat: false, crash: true, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: true, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: true, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Funk',
    bpm: 95,
    volumes: { kick: 88, snare: 85, hihat: 70, openhat: 80, crash: 60, ride: 55, chinese: 60, tom1: 70, tom2: 70, tom3: 75 },
    steps: [
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }, // Syncopation
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Hip-Hop',
    bpm: 90,
    volumes: { kick: 95, snare: 92, hihat: 65, openhat: 55, crash: 60, ride: 60, chinese: 50, tom1: 70, tom2: 70, tom3: 75 },
    steps: [
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }, // Kick "lazy"
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Jazz',
    bpm: 140,
    volumes: { kick: 60, snare: 65, hihat: 55, openhat: 50, crash: 70, ride: 85, chinese: 65, tom1: 70, tom2: 70, tom3: 75 },
    steps: [
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false }, // Kick feutré (feathering)
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false }, // HH au pied sur le 2 et 4
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false }, // Le "ta" du swing
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false }, // Snare ghost note
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Reggae',
    bpm: 75,
    volumes: { kick: 90, snare: 88, hihat: 65, openhat: 75, crash: 70, ride: 60, chinese: 65, tom1: 75, tom2: 75, tom3: 80 },
    steps: [
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }, // Silence sur le 1
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }, // Le drop (Kick + Snare sur le 3)
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Disco',
    bpm: 120,
    volumes: { kick: 95, snare: 88, hihat: 60, openhat: 85, crash: 75, ride: 65, chinese: 60, tom1: 75, tom2: 75, tom3: 80 },
    steps: [
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }, // HH ouvert sur le "et"
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Latin',
    bpm: 115,
    volumes: { kick: 85, snare: 80, hihat: 70, openhat: 60, crash: 65, ride: 75, chinese: 60, tom1: 75, tom2: 75, tom3: 80 },
    steps: [
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false }, // Snare en rim click simulé
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: false, crash: false, ride: true, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Punk',
    bpm: 180,
    volumes: { kick: 95, snare: 95, hihat: 80, openhat: 90, crash: 85, ride: 70, chinese: 60, tom1: 75, tom2: 75, tom3: 80 },
    steps: [
      { kick: true, snare: false, hihat: false, openhat: true, crash: true, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: false, openhat: true, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Drum & Bass',
    bpm: 174,
    volumes: { kick: 95, snare: 92, hihat: 75, openhat: 65, crash: 70, ride: 60, chinese: 65, tom1: 70, tom2: 70, tom3: 75 },
    steps: [
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Blues',
    bpm: 90,
    volumes: { kick: 85, snare: 80, hihat: 70, openhat: 65, crash: 65, ride: 70, chinese: 60, tom1: 75, tom2: 75, tom3: 80 },
    steps: [
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Soul',
    bpm: 105,
    volumes: { kick: 90, snare: 92, hihat: 80, openhat: 60, crash: 70, ride: 65, chinese: 50, tom1: 75, tom2: 75, tom3: 80 },
    steps: [
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }, // Snare accentuée
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false }
    ]
  },
  {
    name: 'Pop',
    bpm: 70,
    volumes: { kick: 92, snare: 85, hihat: 55, openhat: 65, crash: 75, ride: 60, chinese: 50, tom1: 80, tom2: 80, tom3: 85 },
    steps: [
      { kick: true, snare: false, hihat: true, openhat: false, crash: true, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: true, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: true, hihat: true, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: true, tom2: false, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: true, tom3: false },
      { kick: false, snare: false, hihat: false, openhat: false, crash: false, ride: false, chinese: false, tom1: false, tom2: false, tom3: true }
    ]
  }
]