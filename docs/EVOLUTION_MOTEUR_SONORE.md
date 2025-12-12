# Évolution du Moteur Sonore

**Note** : Le mode MIDI a été supprimé. Ce document est conservé à titre de référence historique.

## 📋 Table des matières

1. [État actuel du moteur sonore](#état-actuel-du-moteur-sonore)
2. [Limitations et besoins](#limitations-et-besoins)
3. [Synthèse MIDI : Vue d'ensemble](#synthèse-midi--vue-densemble)
4. [Options techniques](#options-techniques)
5. [Architecture proposée](#architecture-proposée)
6. [Avantages pour le réalisme sonore](#avantages-pour-le-réalisme-sonore)
7. [Plan d'implémentation](#plan-dimplémentation)
8. [Références et ressources](#références-et-ressources)

---

## État actuel du moteur sonore

### Architecture actuelle

WebAmp utilise actuellement une architecture hybride :

#### Frontend Web (React/TypeScript)
- **Web Audio API** pour le traitement audio dans le navigateur
- **PedalboardEngine** : Chaîne d'effets modulaire avec routing série
- **Effets DSP** : WaveShaper, BiquadFilter, Delay, Convolver, etc.
- **AudioWorklet** : Pour les effets complexes nécessitant un traitement sample-accurate (wah, octavia, pitch shifter, rotary, univibe)
- **Configuration spécifique par pédale** : Mapping des paramètres vers les valeurs audio réelles basé sur les spécifications constructeur

#### Native Helper (C++)
- **Traitement audio temps réel** avec latence < 10ms
- **Drivers audio** : ASIO (Windows, latence minimale), WASAPI (Windows), CoreAudio (macOS), PipeWire (Linux)
- **Pipeline DSP** : Chaîne d'effets optimisée avec SIMD
- **Buffer size** : 64-128 samples @ 48kHz (~1.3-2.5ms de latence)
- **Sample rate** : 48kHz (support jusqu'à 192kHz)
- **Communication WebSocket** : Synchronisation frontend/backend

### Flux audio actuel

```
Entrée USB/Micro/Ligne (48kHz / 24 bits)
    ↓
[Driver Audio: ASIO/WASAPI/CoreAudio]
    ↓
[Buffer d'entrée (64-128 samples)]
    ↓
[Gain Input]
    ↓
[Noise Gate]
    ↓
[Compressor]
    ↓
[EQ / Tone Stack]
    ↓
[Overdrive/Distortion/Fuzz]
    ↓
[Modulation: Chorus/Flanger/Phaser/Tremolo]
    ↓
[Time-based: Delay/Reverb]
    ↓
[Cabinet Simulator (IR Convolution)]
    ↓
[Gain Output / Master]
    ↓
[Buffer de sortie]
    ↓
Sortie Audio
```

**Note** : Cette structure correspond à la chaîne DSP professionnelle standard utilisée par les plateformes d'émulation d'ampli (Guitar Rig, Bias FX, etc.).

### Points forts actuels

✅ **Latence très faible** : < 5ms avec le native helper (64 samples @ 48kHz = ~1.3ms)  
✅ **Drivers professionnels** : Support ASIO (Windows) pour latence minimale, CoreAudio (Mac)  
✅ **Effets réalistes** : Configuration spécifique par pédale basée sur les analyses techniques réelles  
✅ **Modularité** : Chaîne d'effets réordonnable  
✅ **AudioWorklet** : Traitement sample-accurate pour les effets complexes  
✅ **Impulse Responses** : Support des IR personnalisées pour cabinet et reverb  
✅ **Architecture hybride** : Frontend Web + Native Helper C++ pour performance optimale  

---

## Limitations et besoins

### Limitations actuelles

1. **Pas de génération de son** : L'application nécessite une entrée audio réelle (micro ou ligne)
2. **Pas de simulation d'instrument** : Impossible de jouer des tablatures ou des partitions MIDI directement
3. **Son dépendant de l'entrée** : La qualité du son dépend entièrement de la source audio externe
4. **Pas de contrôle précis des notes** : Impossible de contrôler précisément les fréquences jouées
5. **Difficulté de test** : Nécessite un instrument réel pour tester les réglages

### Besoins identifiés

🎯 **Objectif principal** : Avoir un son plus réaliste, plus proche des réglages hardware des pédales et amplis

Pour atteindre cet objectif, il faut :

1. **Génération de son à partir de tablatures** : Convertir les tablatures en messages MIDI
2. **Synthèse MIDI** : Jouer les notes avec des instruments réalistes (guitare, basse)
3. **Contrôle précis des fréquences** : Permettre de tester les réglages avec des notes précises
4. **Simulation d'instrument** : Générer le son d'une guitare/basse sans avoir besoin de l'instrument physique

---

## Synthèse MIDI : Vue d'ensemble

### Qu'est-ce que la synthèse MIDI ?

**⚠️ IMPORTANT : Approche adaptée pour entrée audio réelle**

La synthèse MIDI dans WebAmp fonctionne avec une **entrée audio réelle** (micro/USB) plutôt que des tablatures :

1. **Capture de l'entrée audio** :
   - L'utilisateur connecte sa guitare/basse via USB ou micro
   - Le signal audio est capturé en temps réel via Web Audio API

2. **Détection de pitch** :
   - L'algorithme YIN détecte la fréquence fondamentale du signal
   - Conversion automatique en messages MIDI (note ON/OFF, vélocité)
   - Détection en temps réel avec faible latence

3. **Synthèse améliorée** :
   - Les notes détectées sont resynthétisées avec un son plus réaliste
   - Utilisation de modélisation physique pour guitare/basse
   - Le signal synthétisé passe ensuite dans la chaîne d'effets existante

4. **Avantages** :
   - Son plus réaliste grâce à la synthèse améliorée
   - Réglages hardware fidèles grâce au contrôle précis des fréquences
   - Pas besoin de tablatures, fonctionne avec l'instrument réel

### Flux proposé avec synthèse MIDI (V2)

```
Entrée Audio Réelle (Micro/USB)
    ↓
[Capture Audio (getUserMedia)]
    ↓
[Détection de Pitch (YIN Algorithm)]
    ↓
[Conversion → Messages MIDI]
    ↓
[Synthèse d'instrument améliorée]
    ↓
[Signal Audio Généré (plus réaliste)]
    ↓
[Chaîne d'effets existante]
    ↓
[Sortie Audio]
```

---

## Options techniques

### Option 1 : Web Audio API + MIDI Instruments (Recommandé)

#### Avantages
- ✅ **Intégration native** : Utilise déjà Web Audio API
- ✅ **Pas de dépendances externes** : Tout dans le navigateur
- ✅ **Latence faible** : Traitement direct dans le navigateur
- ✅ **Contrôle total** : Personnalisation complète du son

#### Inconvénients
- ⚠️ **Développement nécessaire** : Besoin d'implémenter la synthèse d'instrument
- ⚠️ **Qualité dépendante** : La qualité du son dépend de l'implémentation

#### Implémentation

```typescript
// Exemple de structure
class MIDIEngine {
  private audioCtx: AudioContext
  private oscillators: Map<number, OscillatorNode>
  private gainNodes: Map<number, GainNode>
  
  // Synthèse de guitare avec modélisation physique
  playNote(note: number, velocity: number, duration: number) {
    // Génération d'enveloppe ADSR réaliste
    // Filtrage pour simuler les caractéristiques de la guitare
    // Ajout de bruit et d'harmoniques
  }
}
```

#### Bibliothèques utiles
- **Tone.js** : Framework audio pour le web (peut être utilisé pour la synthèse)
- **Web Audio API** : API native du navigateur

---

### Option 2 : FluidSynth (C/C++ ou bindings)

#### Avantages
- ✅ **Qualité professionnelle** : Synthèse de très haute qualité
- ✅ **Soundfonts** : Support des soundfonts (bibliothèques d'instruments)
- ✅ **Réalisme** : Son très proche des instruments réels
- ✅ **Mature** : Bibliothèque bien établie et testée

#### Inconvénients
- ⚠️ **Intégration complexe** : Nécessite compilation C/C++ ou bindings
- ⚠️ **Taille** : Les soundfonts peuvent être volumineux
- ⚠️ **Latence potentielle** : Selon l'implémentation

#### Implémentation

**Option A : Native Helper (C++)**
```cpp
// Intégration dans le native helper
#include <fluidsynth.h>

class MIDISynthesizer {
    fluid_synth_t* synth;
    fluid_settings_t* settings;
    
    void playNote(int note, int velocity, int duration);
    void loadSoundfont(const char* path);
};
```

**Option B : Bindings JavaScript**
- **fluidsynth-js** : Binding JavaScript de FluidSynth (WebAssembly)
- **node-fluidsynth** : Pour Node.js (si serveur nécessaire)

---

### Option 3 : Tone.js / MIDI.js (JavaScript)

#### Avantages
- ✅ **Facilité d'intégration** : Pure JavaScript, pas de compilation
- ✅ **API simple** : Interface haut niveau facile à utiliser
- ✅ **Communauté active** : Bonne documentation et support
- ✅ **Flexibilité** : Facile à personnaliser

#### Inconvénients
- ⚠️ **Qualité limitée** : Moins réaliste que FluidSynth
- ⚠️ **Performance** : Peut être moins performant pour des polyphonies complexes

#### Implémentation

```typescript
import * as Tone from 'tone'
import { Midi } from '@tonejs/midi'

// Charger un fichier MIDI
const midi = new Midi(midiFile)

// Créer un synthétiseur de guitare
const guitarSynth = new Tone.PolySynth(Tone.Synth).toDestination()

// Jouer les notes
midi.tracks.forEach(track => {
  track.notes.forEach(note => {
    guitarSynth.triggerAttackRelease(
      note.name,
      note.duration,
      note.time,
      note.velocity
    )
  })
})
```

---

## Architecture proposée

### Architecture hybride recommandée

Nous recommandons une **approche hybride** combinant les avantages de chaque option :

#### Frontend : Web Audio API + Tone.js (pour la synthèse de base)

```typescript
// frontend/src/audio/midiEngine.ts
export class MIDIEngine {
  private audioCtx: AudioContext
  private pedalboardEngine: PedalboardEngine
  private synth: Tone.PolySynth
  
  constructor(pedalboardEngine: PedalboardEngine) {
    this.audioCtx = pedalboardEngine.getAudioContext()!
    this.pedalboardEngine = pedalboardEngine
    
    // Créer un synthétiseur de guitare personnalisé
    this.synth = new Tone.PolySynth({
      oscillator: {
        type: 'sawtooth' // Base pour guitare
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.5
      }
    })
    
    // Connecter au pedalboard au lieu de la destination directe
    this.synth.connect(pedalboardEngine.getInput())
  }
  
  async playMIDIFile(midiData: ArrayBuffer) {
    const midi = new Midi(midiData)
    
    midi.tracks.forEach(track => {
      track.notes.forEach(note => {
        this.synth.triggerAttackRelease(
          note.name,
          note.duration,
          note.time,
          note.velocity / 127
        )
      })
    })
  }
  
  async playTablature(tablature: string) {
    // Parser la tablature
    const midiMessages = this.parseTablature(tablature)
    
    // Jouer les messages MIDI
    midiMessages.forEach(msg => {
      if (msg.type === 'noteOn') {
        this.synth.triggerAttack(msg.note, msg.time, msg.velocity)
      } else if (msg.type === 'noteOff') {
        this.synth.triggerRelease(msg.note, msg.time)
      }
    })
  }
  
  private parseTablature(tablature: string): MIDIMessage[] {
    // Implémentation du parser de tablature
    // Format supporté : ASCII tab, Guitar Pro, etc.
  }
}
```

#### Native Helper : FluidSynth (optionnel, pour qualité maximale)

Si une qualité maximale est nécessaire, FluidSynth peut être intégré dans le native helper :

```cpp
// native/src/midi_synthesizer.cpp
class MIDISynthesizer {
public:
    bool initialize(const std::string& soundfontPath);
    void playNote(int note, int velocity, int duration);
    void process(float* output, uint32_t frameCount);
    
private:
    fluid_synth_t* synth_;
    fluid_settings_t* settings_;
    fluid_audio_driver_t* audio_driver_;
};
```

### Intégration avec le moteur existant

```
┌─────────────────────────────────────┐
│         MIDI Engine                 │
│  ┌──────────────────────────────┐  │
│  │  Tablature Parser            │  │
│  │  → Messages MIDI             │  │
│  └──────────────┬───────────────┘  │
│                 ↓                   │
│  ┌──────────────────────────────┐  │
│  │  MIDI Playback Engine        │  │
│  │  → Timing & Scheduling       │  │
│  └──────────────┬───────────────┘  │
│                 ↓                   │
│  ┌──────────────────────────────┐  │
│  │  Instrument Synthesizer     │  │
│  │  (Guitare/Basse)             │  │
│  └──────────────┬───────────────┘  │
└─────────────────┼───────────────────┘
                  ↓
┌─────────────────────────────────────┐
│      PedalboardEngine (existant)    │
│  ┌──────────────────────────────┐  │
│  │  Input Gain                  │  │
│  │  → Effects Chain              │  │
│  │  → Output Gain                │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Avantages pour le réalisme sonore

### 1. Contrôle précis des fréquences

Avec la synthèse MIDI, chaque note est générée avec une fréquence précise :

```typescript
// Exemple : Tester un accord de Mi majeur
const eMajorChord = [
  { note: 'E2', time: 0 },    // Mi grave
  { note: 'E3', time: 0 },    // Mi médium
  { note: 'G#3', time: 0 },   // Sol# médium
  { note: 'B3', time: 0 },    // Si médium
  { note: 'E4', time: 0 }     // Mi aigu
]

midiEngine.playNotes(eMajorChord)
```

Cela permet de :
- ✅ Tester les réglages avec des fréquences exactes
- ✅ Comparer le comportement des pédales sur différentes notes
- ✅ Valider les réglages de tone/eq avec précision

### 2. Répétabilité

Le même fichier MIDI/tablature produit toujours le même résultat :

- ✅ Tests reproductibles
- ✅ Comparaison avant/après modification de réglages
- ✅ Démonstrations cohérentes

### 3. Simulation d'instrument réaliste

Avec des soundfonts de qualité ou une modélisation physique avancée :

- ✅ Son de guitare/basse réaliste sans avoir besoin de l'instrument
- ✅ Différents types d'instruments (Stratocaster, Les Paul, etc.)
- ✅ Techniques de jeu (picking, fingerstyle, slap, etc.)

### 4. Intégration avec les réglages hardware

Les réglages des pédales peuvent être calibrés avec précision :

```typescript
// Exemple : Calibration d'une pédale de distorsion
const testNotes = ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'] // Cordes de guitare

testNotes.forEach(note => {
  // Jouer la note avec différents réglages de gain
  for (let gain = 0; gain <= 100; gain += 10) {
    pedalboardEngine.updateEffectParameters('distortion-1', { gain })
    midiEngine.playNote(note, 0.8, 1.0)
    // Analyser le résultat pour calibrer
  }
})
```

### 5. Validation des réglages

Permet de valider que les réglages correspondent aux spécifications hardware :

- ✅ Comparaison avec les analyses techniques réelles (ElectroSmash, etc.)
- ✅ Validation des courbes de réponse fréquentielle
- ✅ Vérification du comportement des pédales sur différentes fréquences

---

## Plan d'implémentation

### Phase 1 : Infrastructure de base (2-3 semaines) ✅ EN COURS

#### 1.1 Détection de pitch depuis audio
- [x] Implémenter l'algorithme YIN pour détection de pitch
- [x] Créer `PitchDetector` avec conversion fréquence → MIDI
- [x] Gestion des seuils de confiance et filtrage

**Fichiers créés** :
- ✅ `frontend/src/audio/pitchDetector.ts`
- ✅ `frontend/src/audio/midiTypes.ts`

#### 1.2 Détecteur MIDI depuis entrée audio
- [x] Créer `MIDIDetector` pour capture audio (getUserMedia)
- [x] Détection en temps réel avec conversion automatique en MIDI
- [x] Gestion des événements Note On/Off avec seuils configurables

**Fichiers créés** :
- ✅ `frontend/src/audio/midiDetector.ts`

#### 1.3 Synthétiseur d'instrument
- [x] Créer `GuitarSynth` pour synthèse de guitare
- [x] Créer `BassSynth` pour synthèse de basse
- [x] Enveloppe ADSR réaliste
- [x] Harmoniques et filtrage pour réalisme
- [x] Bruit réaliste (frottement des cordes)
- [x] Support de différentes techniques de jeu (pick, finger, slide)

**Fichiers créés** :
- ✅ `frontend/src/audio/instruments/guitarSynth.ts`
- ✅ `frontend/src/audio/instruments/bassSynth.ts`

#### 1.4 Moteur MIDI principal
- [x] Créer `MIDIEngine` qui coordonne détection + synthèse
- [x] Intégration avec `PedalboardEngine`
- [x] Gestion du routing audio (Synthèse → Pedalboard → Output)

**Fichiers créés** :
- ✅ `frontend/src/audio/midiEngine.ts`

#### 1.5 Interface utilisateur
- [x] Créer `MIDIModeToggle` pour activer/désactiver le mode MIDI
- [x] Intégration dans l'interface principale
- [x] Contrôles (type d'instrument, volume)
- [x] Visualisation de la détection de pitch
- [x] Statistiques en temps réel (notes actives, taux de détection, confiance)

**Fichiers créés** :
- ✅ `frontend/src/components/MIDIModeToggle.tsx`
- ✅ `frontend/src/components/PitchVisualizer.tsx`

#### 1.6 Améliorations de la détection
- [x] Système anti-glitch avec historique de fréquences
- [x] Filtrage médian pour réduire les erreurs
- [x] Moyenne de confiance pour stabilité

**Fichiers modifiés** :
- ✅ `frontend/src/audio/midiDetector.ts`

#### 1.7 Optimisations de performance et mémoire
- [x] Pool de buffers pour éviter les allocations répétées
- [x] Nettoyage automatique des oscillateurs et nœuds audio
- [x] Déconnexion sécurisée pour éviter les fuites mémoire
- [x] Méthode `stopAllNotes()` pour arrêter toutes les notes
- [x] Méthode `cleanup()` pour libérer toutes les ressources

**Fichiers modifiés** :
- ✅ `frontend/src/audio/instruments/guitarSynth.ts`
- ✅ `frontend/src/audio/instruments/bassSynth.ts`
- ✅ `frontend/src/audio/midiEngine.ts`

#### 1.8 Améliorations de la synthèse
- [x] Vibrato léger pendant le sustain pour plus de réalisme
- [x] Enveloppes dynamiques améliorées pour les harmoniques
- [x] Gestion propre des ressources (harmoniques, bruit)

**Fichiers créés** :
- ✅ `frontend/src/audio/instruments/instrumentBase.ts` (utilitaires communs)

#### 1.9 Visualisation et statistiques
- [x] Composant `PitchVisualizer` pour visualiser la détection en temps réel
- [x] Graphique de l'historique des fréquences
- [x] Affichage de la note actuelle et de la confiance
- [x] Collecteur de statistiques (`MIDIStatsCollector`)
- [x] Métriques : notes actives, total jouées, taux de détection, confiance moyenne

**Fichiers créés** :
- ✅ `frontend/src/components/PitchVisualizer.tsx`
- ✅ `frontend/src/audio/midiStats.ts`

#### 1.7 Tests d'intégration
- [ ] Tests unitaires pour pitch detection
- [ ] Tests d'intégration MIDI → Pedalboard
- [ ] Tests de latence et performance

### Phase 2 : Synthèse d'instrument (3-4 semaines)

#### 2.1 Synthèse de guitare basique
- [ ] Implémenter un synthétiseur de guitare avec Web Audio API
- [ ] Enveloppe ADSR réaliste
- [ ] Filtrage pour simuler les caractéristiques de la guitare

**Fichiers à créer** :
- `frontend/src/audio/instruments/guitarSynth.ts`
- `frontend/src/audio/instruments/instrumentBase.ts`

#### 2.2 Synthèse de basse
- [ ] Implémenter un synthétiseur de basse
- [ ] Caractéristiques spécifiques (sustain, attack)

**Fichiers à créer** :
- `frontend/src/audio/instruments/bassSynth.ts`

#### 2.3 Amélioration du réalisme
- [ ] Ajout de bruit et d'harmoniques
- [ ] Simulation de différentes techniques de jeu
- [ ] Support de différents types d'instruments

**Fichiers à modifier** :
- `frontend/src/audio/instruments/guitarSynth.ts`
- `frontend/src/audio/instruments/bassSynth.ts`

### Phase 3 : Interface utilisateur (2-3 semaines)

#### 3.1 Composant de lecture MIDI
- [ ] Créer un composant pour charger/jouer des fichiers MIDI
- [ ] Contrôles de lecture (play, pause, stop, vitesse)
- [ ] Visualisation de la tablature/MIDI

**Fichiers à créer** :
- `frontend/src/components/MIDIPlayer.tsx`
- `frontend/src/components/TablatureViewer.tsx`

#### 3.2 Intégration dans l'interface
- [ ] Ajouter un onglet "MIDI/Tablature" dans l'interface
- [ ] Intégration avec le système de presets
- [ ] Sauvegarde des réglages avec les fichiers MIDI

**Fichiers à modifier** :
- `frontend/src/App.tsx`
- `frontend/src/components/Pedalboard.tsx`

### Phase 4 : Optimisation et qualité (2-3 semaines)

#### 4.1 Performance
- [ ] Optimisation du scheduling MIDI
- [ ] Gestion de la polyphonie (plusieurs notes simultanées)
- [ ] Réduction de la latence

#### 4.2 Qualité sonore
- [ ] Intégration optionnelle de FluidSynth (si nécessaire)
- [ ] Support des soundfonts
- [ ] Amélioration de la modélisation physique

**Optionnel** :
- `native/src/midi_synthesizer.cpp` (si FluidSynth intégré)

### Phase 5 : Tests et documentation (1-2 semaines)

#### 5.1 Tests
- [ ] Tests unitaires pour le parser de tablature
- [ ] Tests d'intégration MIDI → Pedalboard
- [ ] Tests de performance

#### 5.2 Documentation
- [ ] Documentation utilisateur (comment utiliser la synthèse MIDI)
- [ ] Documentation développeur (architecture, API)
- [ ] Exemples de tablatures et fichiers MIDI

### Phase 6 : Modélisation physique avancée (Améliorations futures)

#### 6.1 Modélisation d'amplificateur améliorée

Pour un réalisme maximal, modéliser les composants physiques des amplis :

**Composants à modéliser** :

1. **Préampli** :
   - Saturation progressive des tubes (12AX7)
   - Réponse fréquentielle (EQ actif)
   - Compression naturelle

2. **Poweramp** :
   - Saturation des tubes de puissance (6L6, EL34, etc.)
   - Réponse non-linéaire
   - Compression de puissance

3. **Transformateur** :
   - Réponse fréquentielle complexe
   - Saturation magnétique
   - Impédance de sortie

**Implémentation proposée** :

```typescript
class TubeAmpModel {
  // Modélisation de la saturation tube
  private tubeSaturation(input: number, gain: number): number {
    // Modèle de tube avec courbe caractéristique
    const drive = input * gain
    // Saturation asymétrique (caractéristique des tubes)
    return Math.tanh(drive * 0.5) * (1 + 0.1 * Math.sin(drive * 2))
  }
  
  // Réponse fréquentielle du transformateur
  private transformerResponse(frequency: number): number {
    // Filtre passe-bas avec résonance
    const resonance = 2000 // Hz
    const Q = 2.0
    return this.biquadFilter(frequency, resonance, Q)
  }
  
  process(input: AudioBuffer, ampSettings: AmpSettings): AudioBuffer {
    // 1. Préampli avec saturation tube
    let signal = this.preamp.process(input, ampSettings.gain)
    
    // 2. EQ (Bass, Middle, Treble, Presence)
    signal = this.eq.process(signal, ampSettings.eq)
    
    // 3. Poweramp avec saturation progressive
    signal = this.poweramp.process(signal, ampSettings.master)
    
    // 4. Transformateur
    signal = this.transformer.process(signal)
    
    return signal
  }
}
```

**Techniques de modélisation** :

1. **Circuit Modeling (WDF)** :
   - Simulation des circuits analogiques réels
   - Modélisation des tubes (triodes/pentodes)
   - Bias, saturation, compression dynamique
   - **Technologie** : WDF (Wave Digital Filters) via Faust

2. **Neural Modeling (AI)** :
   - Modèles entraînés sur amplis réels
   - Qualité professionnelle (équivalent Neural DSP)
   - **Technologie** : NAM (Neural Amp Modeler) ou RTNeural

**Fichiers à créer** :
- `native/src/amp_model/tube_amp_model.cpp` (C++ pour performance)
- `native/src/amp_model/preamp_model.cpp`
- `native/src/amp_model/poweramp_model.cpp`
- `native/src/amp_model/transformer_model.cpp`
- `native/src/amp_model/wdf_circuit.cpp` (si WDF utilisé)

#### 6.2 Modélisation de cabinet physique

Au-delà des IR, modéliser physiquement :

- **Réponse des haut-parleurs** : Résonances, distorsion non-linéaire
- **Position du micro** : Distance, angle, type de micro
- **Résonances du cabinet** : Modes de résonance

**Implémentation proposée** :

```typescript
class PhysicalCabinetModel {
  private speakerResponse: SpeakerModel
  private microphone: MicrophoneModel
  private cabinetResonances: ResonanceModel
  
  process(input: AudioBuffer, micSettings: MicSettings): AudioBuffer {
    // 1. Réponse du haut-parleur
    let signal = this.speakerResponse.process(input)
    
    // 2. Résonances du cabinet
    signal = this.cabinetResonances.process(signal)
    
    // 3. Position du micro
    signal = this.microphone.process(signal, micSettings)
    
    return signal
  }
}
```

**Techniques de modélisation** :

1. **IR Convolution (actuel)** :
   - Convolution FIR avec 2k-20k taps
   - **Librairies** : WDL-OL fast convolution, JUCE Convolution, Faust convolver
   - **FFT** : DNNE, KissFFT, FFTW pour optimisation

2. **Physical Modeling (futur)** :
   - Réponse des haut-parleurs (résonances, distorsion non-linéaire)
   - Position du micro (distance, angle, type)
   - Résonances du cabinet (modes de résonance)

**Fichiers à créer** :
- `native/src/cabinet_model/physical_cabinet_model.cpp` (C++ pour performance)
- `native/src/cabinet_model/speaker_model.cpp`
- `native/src/cabinet_model/microphone_model.cpp`
- `native/src/cabinet_model/resonance_model.cpp`
- `native/src/cabinet_model/fast_convolution.cpp` (optimisation IR)

#### 6.3 Synthèse hybride (samples + physical modeling)

Pour un réalisme optimal, combiner :

- **Samples** : Pour les attaques réalistes
- **Physical Modeling** : Pour le sustain expressif

```typescript
class HybridSynthesizer {
  private sampler: Sampler  // Pour les attaques réalistes
  private physicalModel: KarplusStrong  // Pour le sustain
  
  async synthesize(note: MIDINote): Promise<AudioBuffer> {
    // Attaque : sample
    const attack = await this.sampler.play(note)
    
    // Sustain : physical modeling
    const sustain = this.physicalModel.generate(note)
    
    // Mixer les deux avec crossfade
    return this.mix(attack, sustain)
  }
}
```

**Avantages** :
- ✅ Attaques réalistes grâce aux samples
- ✅ Sustain expressif grâce à la modélisation physique
- ✅ Taille réduite (samples courts + modèle physique léger)

**Techniques de synthèse** :

1. **Karplus-Strong** :
   - Algorithme classique pour synthèse de cordes
   - Modélisation physique des vibrations
   - **Avantages** : Expressif, réaliste, taille réduite

2. **Waveguide Synthesis** :
   - Modélisation des ondes dans les cordes
   - Plus avancé que Karplus-Strong

3. **Modal Synthesis** :
   - Résonances modales des instruments
   - Pour différents types de guitares/basses

**Fichiers à créer** :
- `frontend/src/audio/instruments/hybridSynthesizer.ts`
- `frontend/src/audio/instruments/karplusStrong.ts`
- `native/src/instruments/waveguide_synth.cpp` (C++ pour performance si nécessaire)

**Note** : Cette phase est optionnelle et peut être implémentée après les phases principales selon les besoins de réalisme.

---

## Analyse des technologies professionnelles

### Comparaison avec les plateformes d'émulation d'ampli

D'après l'analyse des plateformes professionnelles (Guitar Rig, Bias FX, Neural DSP, Line 6), voici les éléments clés :

#### ✅ WebAmp : Points forts actuels

1. **Architecture hybride** : Frontend Web + Native Helper C++
   - ✅ Déjà optimal pour combiner interface moderne et performance

2. **Drivers audio professionnels** :
   - ✅ ASIO supporté (Windows) → latence minimale
   - ✅ CoreAudio supporté (macOS) → déjà très performant
   - ✅ PipeWire supporté (Linux)

3. **Latence au niveau professionnel** :
   - ✅ Buffer 64 samples @ 48kHz = **~1.3 ms** (niveau Neural DSP)
   - ✅ Buffer 128 samples @ 48kHz = **~2.5 ms** (niveau Guitar Rig)
   - ✅ Sample rate 48kHz (standard professionnel)

4. **Structure DSP** :
   - ✅ Suit la chaîne professionnelle standard
   - ✅ Support IR pour cabinets
   - ✅ Chaîne d'effets modulaire

#### 🔮 Améliorations possibles (basées sur l'étude)

**Court terme** :
- Optimisation de la convolution IR (fast convolution avec FFT)
- Amélioration des distorsions (waveshaping non-linéaire avancé)

**Moyen terme** :
- Intégration Faust DSP pour nouveaux effets complexes
- Modélisation d'amplis avec circuit modeling (WDF)

**Long terme** :
- Neural Amp Modeler (NAM) pour émulation d'amplis de très haute qualité
- JUCE Framework si besoin de support VST/AU

### Technologies recommandées (par ordre de priorité)

#### 1. Fast Convolution pour IR (Priorité haute)

**Problème actuel** : La convolution IR peut être coûteuse en CPU

**Solutions** :
- **WDL-OL fast convolution** : Optimisation FFT pour IR
- **JUCE Convolution** : Si migration vers JUCE
- **Faust convolver** : Si utilisation de Faust

**Bénéfice** : Réduction CPU de 30-50% pour les IR cabinets

#### 2. Faust DSP (Priorité moyenne)

**Pourquoi** : Créer de nouveaux effets complexes facilement

**Cas d'usage** :
- Distorsions avancées (waveshaping non-linéaire)
- Filtres analogiques complexes
- Simulateurs d'ampli (circuit modeling)

**Avantages** :
- Syntaxe déclarative pour DSP
- Génère C++ optimisé automatiquement
- S'intègre avec le native helper

#### 3. Neural Amp Modeler (Priorité basse - qualité maximale)

**Pourquoi** : Émulation d'amplis de très haute qualité

**Technologie** :
- Modèles AI entraînés sur amplis réels
- Qualité équivalente à Neural DSP
- Temps réel (CPU & GPU)

**Inconvénients** :
- Complexité d'intégration
- Nécessite des modèles pré-entraînés ou entraînement propre
- CPU plus élevé

**Recommandation** : À considérer seulement si qualité maximale requise

#### 4. JUCE Framework (Priorité très basse - refonte complète)

**Pourquoi** : Standard industriel pour applications audio professionnelles

**Avantages** :
- Performance ultra-optimisée
- Support natif VST/AU
- Bibliothèque DSP complète

**Inconvénients** :
- Refonte complète nécessaire
- Courbe d'apprentissage
- Licence commerciale pour usage commercial

**Recommandation** : Seulement si besoin de support VST/AU ou refonte complète

---

## Références et ressources

### Bibliothèques et outils utilisés

#### Web Audio API
- **Documentation officielle** : https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Tutoriels** : https://www.html5rocks.com/en/tutorials/webaudio/intro/
- ✅ **Déjà intégré** : Utilisé dans `PedalboardEngine`

#### Tone.js
- **Documentation** : https://tonejs.github.io/
- ✅ **Déjà installé** : Version 15.0.4 dans `package.json`
- **Utilisation** : Peut être utilisé pour améliorer la synthèse si nécessaire
- ⚠️ **Note** : Actuellement, nous utilisons une implémentation native Web Audio API pour plus de contrôle

#### MIDI
- **MIDI Specification** : https://www.midi.org/specifications
- **MIDI.js** : https://github.com/mudcube/MIDI.js (non utilisé actuellement)

#### Détection de pitch
- **Algorithme YIN** : 
  - Article original : "YIN, a fundamental frequency estimator for speech and music" (de Cheveigné & Kawahara)
  - Implémentation : `frontend/src/audio/pitchDetector.ts`
- **Alternatives possibles** :
  - Essentia.js : https://mtg.github.io/essentia.js/ (analyse audio avancée)
  - ml5.js : https://ml5js.org/ (machine learning pour pitch detection)

#### Technologies pour améliorations professionnelles

**JUCE Framework** :
- **Site officiel** : https://juce.com/
- **Documentation** : https://juce.com/learn/documentation
- **Modules** : `juce_audio_devices`, `juce_dsp`, `juce_audio_processors`
- **Utilisé par** : Neural DSP, Line 6, Universal Audio, IK Multimedia, Waves
- ⚠️ **Note** : À considérer pour refonte complète du native helper

**Faust DSP** :
- **Site officiel** : https://faust.grame.fr/
- **Documentation** : https://faust.grame.fr/doc/manual/
- **Avantages** : Langage spécialisé DSP, génère C++ optimisé
- **Parfait pour** : Distorsions, filtres analogiques, circuit modeling
- ⚠️ **Note** : Idéal pour créer de nouveaux effets complexes

**Neural Amp Modeler (NAM)** :
- **GitHub** : https://github.com/sdatkinson/NeuralAmpModeler
- **Technologie** : Modèles AI pour émulation d'amplis
- **Qualité** : Équivalente à Neural DSP
- **Alternatives** : RTNeural, AIDA DSP
- ⚠️ **Note** : Pour émulation d'amplis de très haute qualité

**WDF (Wave Digital Filters)** :
- **Technique** : Modélisation de circuits analogiques
- **Librairies** : Faust (excellent support), Jatin Chowdhury DSP
- ⚠️ **Note** : Pour modélisation physique précise des composants

**Fast Convolution (IR)** :
- **Librairies** : WDL-OL, JUCE Convolution, Faust convolver
- **FFT** : DNNE, KissFFT, FFTW
- ⚠️ **Note** : Pour optimisation des IR cabinets

#### FluidSynth (Optionnel, pour qualité maximale)
- **Site officiel** : http://www.fluidsynth.org/
- **Documentation** : http://www.fluidsynth.org/api/
- **Soundfonts** : https://musical-artifacts.com/artifacts?formats=soundfont
- ⚠️ **Note** : Non utilisé actuellement, peut être intégré dans le native helper si nécessaire

### Ressources externes nécessaires

#### Aucune clé API requise
✅ **Tout fonctionne localement** : Pas besoin de clés API externes

#### Permissions navigateur
- ⚠️ **getUserMedia** : Nécessite la permission du navigateur pour accéder au micro
- ✅ **Géré automatiquement** : Le navigateur demande la permission lors du premier appel

#### Dépendances npm
- ✅ **Tone.js** : Déjà installé (`tone@15.0.4`)
- ✅ **Aucune autre dépendance** : Tout est implémenté avec Web Audio API natif

### Ressources optionnelles (améliorations futures)

#### Soundfonts (pour FluidSynth)
- **Téléchargement gratuit** : https://musical-artifacts.com/artifacts?formats=soundfont
- **Exemples** : 
  - FluidR3_GM.sf2 (General MIDI)
  - Guitare électrique : Rechercher "electric guitar soundfont"
- ⚠️ **Taille** : Les soundfonts peuvent être volumineux (10-100 MB)

#### Modèles ML pour pitch detection (optionnel)
- **Essentia.js** : Modèles pré-entraînés pour analyse audio
- **ml5.js** : Modèles Pitch Detection pré-entraînés
- ⚠️ **Note** : Actuellement, l'algorithme YIN natif est suffisant

### Articles et ressources

#### Synthèse de guitare
- **Physical Modeling** : Modélisation physique des instruments
- **Karplus-Strong Algorithm** : Algorithme pour synthèse de cordes
- **Wavetable Synthesis** : Synthèse par table d'ondes

#### MIDI et tablatures
- **MIDI Specification** : https://www.midi.org/specifications
- **Guitar Tablature Formats** : Formats de tablatures courants

### Exemples de code

#### Exemple 1 : Synthèse basique avec Web Audio API

```typescript
class SimpleGuitarSynth {
  private audioCtx: AudioContext
  private gainNode: GainNode
  
  constructor(audioCtx: AudioContext) {
    this.audioCtx = audioCtx
    this.gainNode = audioCtx.createGain()
    this.gainNode.gain.value = 0.3
  }
  
  playNote(frequency: number, duration: number, velocity: number = 1.0) {
    const oscillator = this.audioCtx.createOscillator()
    const gain = this.audioCtx.createGain()
    
    oscillator.type = 'sawtooth'
    oscillator.frequency.value = frequency
    
    // Enveloppe ADSR
    const now = this.audioCtx.currentTime
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(velocity, now + 0.01) // Attack
    gain.gain.exponentialRampToValueAtTime(velocity * 0.7, now + 0.1) // Decay
    gain.gain.setValueAtTime(velocity * 0.7, now + duration - 0.1) // Sustain
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration) // Release
    
    oscillator.connect(gain)
    gain.connect(this.gainNode)
    
    oscillator.start(now)
    oscillator.stop(now + duration)
    
    return this.gainNode
  }
  
  connect(destination: AudioNode) {
    this.gainNode.connect(destination)
  }
}
```

#### Exemple 2 : Parser de tablature ASCII simple

```typescript
interface TablatureNote {
  string: number  // 1-6 pour guitare
  fret: number
  time: number
  duration: number
}

class TablatureParser {
  parse(asciiTab: string): TablatureNote[] {
    const lines = asciiTab.split('\n')
    const notes: TablatureNote[] = []
    
    // Parser simplifié pour format ASCII tab
    // Format attendu :
    // E|--0--3--5--|
    // B|--1--3--5--|
    // ...
    
    lines.forEach((line, lineIndex) => {
      const match = line.match(/^([A-G])\|(.+)$/)
      if (!match) return
      
      const stringName = match[1]
      const frets = match[2]
      const stringNumber = this.getStringNumber(stringName)
      
      // Parser les frets
      let time = 0
      const fretRegex = /(\d+)/g
      let match2
      
      while ((match2 = fretRegex.exec(frets)) !== null) {
        const fret = parseInt(match2[1])
        const position = match2.index
        
        notes.push({
          string: stringNumber,
          fret,
          time: position * 0.1, // Timing approximatif
          duration: 0.5 // Durée par défaut
        })
      }
    })
    
    return notes.sort((a, b) => a.time - b.time)
  }
  
  private getStringNumber(stringName: string): number {
    const map: Record<string, number> = {
      'E': 6, 'A': 5, 'D': 4, 'G': 3, 'B': 2, 'e': 1
    }
    return map[stringName] || 1
  }
}
```

---

## Analyse des technologies professionnelles

### Comparaison avec les plateformes d'émulation d'ampli

D'après l'analyse des plateformes professionnelles (Guitar Rig, Bias FX, Neural DSP, Line 6), voici les éléments clés :

#### ✅ WebAmp : Points forts actuels

1. **Architecture hybride** : Frontend Web + Native Helper C++
   - ✅ Déjà optimal pour combiner interface moderne et performance

2. **Drivers audio professionnels** :
   - ✅ ASIO supporté (Windows) → latence minimale
   - ✅ CoreAudio supporté (macOS) → déjà très performant
   - ✅ PipeWire supporté (Linux)

3. **Latence au niveau professionnel** :
   - ✅ Buffer 64 samples @ 48kHz = **~1.3 ms** (niveau Neural DSP)
   - ✅ Buffer 128 samples @ 48kHz = **~2.5 ms** (niveau Guitar Rig)
   - ✅ Sample rate 48kHz (standard professionnel)

4. **Structure DSP** :
   - ✅ Suit la chaîne professionnelle standard
   - ✅ Support IR pour cabinets
   - ✅ Chaîne d'effets modulaire

#### 🔮 Améliorations possibles (basées sur l'étude)

**Court terme** :
- Optimisation de la convolution IR (fast convolution avec FFT)
- Amélioration des distorsions (waveshaping non-linéaire avancé)

**Moyen terme** :
- Intégration Faust DSP pour nouveaux effets complexes
- Modélisation d'amplis avec circuit modeling (WDF)

**Long terme** :
- Neural Amp Modeler (NAM) pour émulation d'amplis de très haute qualité
- JUCE Framework si besoin de support VST/AU

### Technologies recommandées (par ordre de priorité)

#### 1. Fast Convolution pour IR (Priorité haute)

**Problème actuel** : La convolution IR peut être coûteuse en CPU

**Solutions** :
- **WDL-OL fast convolution** : Optimisation FFT pour IR
- **JUCE Convolution** : Si migration vers JUCE
- **Faust convolver** : Si utilisation de Faust

**Bénéfice** : Réduction CPU de 30-50% pour les IR cabinets

**Ressources** :
- WDL-OL : https://github.com/olilarkin/wdl-ol
- KissFFT : https://github.com/mborgerding/kissfft
- FFTW : http://www.fftw.org/

#### 2. Faust DSP (Priorité moyenne)

**Pourquoi** : Créer de nouveaux effets complexes facilement

**Cas d'usage** :
- Distorsions avancées (waveshaping non-linéaire)
- Filtres analogiques complexes
- Simulateurs d'ampli (circuit modeling)

**Avantages** :
- Syntaxe déclarative pour DSP
- Génère C++ optimisé automatiquement
- S'intègre avec le native helper

**Ressources** :
- Site officiel : https://faust.grame.fr/
- Documentation : https://faust.grame.fr/doc/manual/
- Exemples : https://faust.grame.fr/examples/

#### 3. Neural Amp Modeler (Priorité basse - qualité maximale)

**Pourquoi** : Émulation d'amplis de très haute qualité

**Technologie** :
- Modèles AI entraînés sur amplis réels
- Qualité équivalente à Neural DSP
- Temps réel (CPU & GPU)

**Inconvénients** :
- Complexité d'intégration
- Nécessite des modèles pré-entraînés ou entraînement propre
- CPU plus élevé

**Recommandation** : À considérer seulement si qualité maximale requise

**Ressources** :
- GitHub : https://github.com/sdatkinson/NeuralAmpModeler
- RTNeural : https://github.com/jatinchowdhury18/RTNeural
- AIDA DSP : https://github.com/AidaDSP/AidaDSP

#### 4. JUCE Framework (Priorité très basse - refonte complète)

**Pourquoi** : Standard industriel pour applications audio professionnelles

**Avantages** :
- Performance ultra-optimisée
- Support natif VST/AU
- Bibliothèque DSP complète

**Inconvénients** :
- Refonte complète nécessaire
- Courbe d'apprentissage
- Licence commerciale pour usage commercial

**Recommandation** : Seulement si besoin de support VST/AU ou refonte complète

**Ressources** :
- Site officiel : https://juce.com/
- Documentation : https://juce.com/learn/documentation
- Modules : `juce_audio_devices`, `juce_dsp`, `juce_audio_processors`

### Notes importantes sur l'entrée USB

#### ⚠️ Limitation Web Audio API

**Important** : L'étude mentionne que le Web Audio API ne peut pas accéder directement aux interfaces USB avec latence <10ms.

**Solution WebAmp** :
- ✅ **Native Helper C++** : Gère l'entrée USB via ASIO/WASAPI/CoreAudio
- ✅ **Latence** : < 5ms atteignable avec le native helper
- ⚠️ **Frontend Web** : Utilise `getUserMedia` qui peut avoir une latence plus élevée (~20-50ms)

**Recommandation** :
- Pour latence minimale (<10ms) : Utiliser le **native helper** (déjà implémenté)
- Pour interface web simple : Utiliser `getUserMedia` (acceptable pour la plupart des cas)

#### Format audio USB standard

Les interfaces USB guitare/basse exposent généralement :
- **Sample rate** : 48 kHz (standard)
- **Bit depth** : 24 bits
- **Channels** : Stéréo (ou mono selon interface)

**WebAmp supporte déjà** :
- ✅ 48 kHz (sample rate par défaut)
- ✅ 32 bits float (meilleur que 24 bits pour traitement)
- ✅ Stéréo et mono

---

## Roadmap résumée

### Court terme (Phases 1-3) : Fonctionnalité de base
- ✅ Synthèse MIDI depuis entrée audio réelle
- ✅ Intégration avec la chaîne d'effets existante
- ✅ Détection de pitch en temps réel

### Moyen terme (Phases 4-5) : Qualité et optimisation
- ✅ Amélioration de la qualité sonore
- 🔮 Optimisation convolution IR (fast convolution)
- ✅ Tests et documentation complète

### Long terme (Phase 6) : Réalisme maximal
- 🔮 Modélisation physique des amplificateurs (tubes, transformateurs)
- 🔮 Modélisation physique des cabinets (haut-parleurs, position micro)
- 🔮 Synthèse hybride (samples + physical modeling)
- 🔮 Neural Amp Modeler (si qualité maximale requise)

## Conclusion

L'intégration de la synthèse MIDI dans WebAmp permettra :

1. ✅ **Son plus réaliste** : Contrôle précis des fréquences et validation des réglages
2. ✅ **Meilleure expérience utilisateur** : Possibilité de tester sans instrument réel
3. ✅ **Tests reproductibles** : Validation cohérente des réglages
4. ✅ **Fonctionnalité unique** : Distinction par rapport aux autres applications
5. 🔮 **Évolutivité** : Base solide pour des améliorations futures (modélisation physique)

### Approche recommandée

**Phase initiale** : Commencer avec **Web Audio API + Tone.js** pour une intégration rapide et une fonctionnalité immédiate.

**Phase d'amélioration** : Envisager **FluidSynth** si une qualité maximale est nécessaire pour les soundfonts.

**Phase avancée** : Implémenter la **modélisation physique** pour un réalisme hardware maximal, en particulier pour les amplificateurs et cabinets.

---

---

## État d'implémentation V2

### ✅ Phase 1 : Infrastructure de base - COMPLÉTÉE

**Modules créés** :

1. **`midiTypes.ts`** ✅
   - Types TypeScript pour le système MIDI
   - Interfaces : `MIDINote`, `MIDIMessage`, `PitchDetectionResult`, `MIDIDetectorConfig`, `SynthesizerConfig`

2. **`pitchDetector.ts`** ✅
   - Implémentation de l'algorithme YIN pour détection de pitch
   - Conversion fréquence ↔ MIDI
   - Classes : `YINPitchDetector`, `TonePitchDetector` (non utilisé actuellement)

3. **`midiDetector.ts`** ✅
   - Capture audio depuis `getUserMedia`
   - Détection de pitch en temps réel
   - Génération automatique de messages MIDI (Note On/Off)
   - Gestion des seuils de confiance et filtrage

4. **`instruments/guitarSynth.ts`** ✅
   - Synthétiseur de guitare électrique
   - Enveloppe ADSR réaliste
   - Harmoniques et filtrage selon type de micro (single/humbucker)

5. **`instruments/bassSynth.ts`** ✅
   - Synthétiseur de basse électrique
   - Caractéristiques spécifiques (sustain plus long, moins d'harmoniques)
   - Support de différents types de cordes et positions de micro

6. **`midiEngine.ts`** ✅
   - Moteur principal coordonnant détection + synthèse
   - Intégration avec `PedalboardEngine`
   - Gestion du routing audio (Synthèse → Pedalboard → Output)

### 📝 Documentation créée

- **`README_MIDI.md`** : Documentation complète du système MIDI V2
  - Architecture
  - Exemples d'utilisation
  - Configuration
  - Limitations et améliorations futures

### 🔄 Prochaines étapes

1. **Tests** : Créer des tests unitaires pour chaque module
2. **Interface utilisateur** : Ajouter un toggle pour activer/désactiver le mode MIDI
3. **Optimisation** : Améliorer la performance et réduire la latence
4. **Polyphonie** : Ajouter le support de plusieurs notes simultanées

### 📦 Ressources utilisées

- ✅ **Tone.js** : Déjà installé (v15.0.4) - peut être utilisé pour améliorations futures
- ✅ **Web Audio API** : API native du navigateur
- ✅ **getUserMedia** : Capture audio (permission navigateur requise)
- ✅ **Native Helper C++** : Drivers ASIO/WASAPI/CoreAudio pour latence minimale
- ✅ **Sample rate** : 48kHz (standard professionnel)
- ✅ **Buffer size** : 64-128 samples (latence 1.3-2.5ms, niveau professionnel)
- ⚠️ **Aucune clé API** : Tout fonctionne localement

### 🔑 Ressources externes nécessaires (pour améliorations futures)

#### Aucune ressource externe requise actuellement

✅ **Tout fonctionne localement** : Pas besoin de clés API, services cloud, ou ressources externes

#### Ressources optionnelles pour améliorations

**Fast Convolution (optimisation IR)** :
- ⚠️ **WDL-OL** : Bibliothèque C++ pour fast convolution (open-source)
- ⚠️ **KissFFT** : Bibliothèque FFT légère (open-source)
- ⚠️ **FFTW** : Bibliothèque FFT optimisée (open-source)
- **Note** : À intégrer dans le native helper si optimisation nécessaire

**Faust DSP (nouveaux effets)** :
- ⚠️ **Faust compiler** : Compilateur Faust → C++ (open-source)
- **Note** : À installer localement pour générer du code C++

**Neural Amp Modeler (qualité maximale)** :
- ⚠️ **Modèles pré-entraînés** : Téléchargeables depuis la communauté NAM
- ⚠️ **Entraînement propre** : Nécessite Python + PyTorch (si entraînement)
- **Note** : Optionnel, seulement si qualité maximale requise

**JUCE Framework (refonte complète)** :
- ⚠️ **Licence** : Open-source (GPL) ou commerciale (pour usage commercial)
- **Note** : Seulement si refonte complète ou support VST/AU nécessaire

### 🎯 Technologies à considérer pour améliorations futures

**Court terme** :
- ✅ Architecture actuelle suffisante pour la plupart des cas d'usage
- ✅ Optimisations de buffer déjà au niveau professionnel

**Moyen terme** :
- 🔮 **Faust DSP** : Pour créer de nouveaux effets complexes (distorsions avancées)
- 🔮 **Fast Convolution** : Optimisation des IR cabinets (WDL-OL, KissFFT)

**Long terme** :
- 🔮 **JUCE Framework** : Pour refonte complète si besoin de VST/AU support
- 🔮 **Neural Amp Modeler** : Pour émulation d'amplis de très haute qualité
- 🔮 **WDF** : Pour modélisation physique précise des composants

### 🎯 Fonctionnalités implémentées

- ✅ Détection de pitch depuis entrée audio réelle
- ✅ Conversion automatique en messages MIDI
- ✅ Synthèse de guitare avec enveloppe ADSR
- ✅ Synthèse de basse avec caractéristiques spécifiques
- ✅ Bruit réaliste (frottement des cordes)
- ✅ Support de différentes techniques de jeu
- ✅ Vibrato léger pour plus de réalisme
- ✅ Système anti-glitch pour détection stable
- ✅ Interface utilisateur pour activer/désactiver le mode MIDI
- ✅ Intégration avec la chaîne d'effets existante
- ✅ Gestion des seuils de détection configurables
- ✅ Optimisation mémoire (pool de buffers, nettoyage automatique)
- ✅ Gestion propre des ressources (déconnexion, arrêt sécurisé)
- ✅ Visualisation de la détection de pitch en temps réel
- ✅ Statistiques de performance (notes actives, taux de détection, confiance)

### ⚠️ Limitations actuelles

- Détection monophonique uniquement (une note à la fois)
- Qualité dépendante de la qualité du signal d'entrée
- Latence : ~20ms (détection + synthèse)

---

**Dernière mise à jour** : 2024  
**Auteur** : Équipe WebAmp  
**Version** : 2.0 (Phase 1 complétée)

