# Web Audio API Pedalboard Engine

Architecture complète de pedalboard avec Web Audio API native pour WebAmp.

## Architecture

```
Input → NoiseGate → Compressor → EQ → Overdrive → Distortion → Fuzz
      → Chorus → Flanger → Phaser → Tremolo
      → Delay → Reverb → CabSimulator → Output
```

## Structure des fichiers

- **`config.ts`** : Configuration globale et mapping des paramètres (0-100 → valeurs Web Audio API)
- **`effects.ts`** : Implémentations de tous les effets Web Audio API
- **`PedalboardEngine.ts`** : Moteur de routing modulaire
- **`__tests__/effects.test.ts`** : Tests unitaires

## Utilisation de base

```typescript
import { PedalboardEngine } from './audio/PedalboardEngine'
import { pedalLibrary } from '../data/pedals'

// 1. Créer le moteur
const engine = new PedalboardEngine({
  sampleRate: 44100,
  routing: 'serial'
})

// 2. Ajouter des effets
const ds1 = pedalLibrary.find(p => p.id === 'boss-ds1')
if (ds1) {
  await engine.addEffect(ds1, {
    distortion: 60,
    tone: 50,
    level: 70
  })
}

const chorus = pedalLibrary.find(p => p.id === 'boss-ch1')
if (chorus) {
  await engine.addEffect(chorus, {
    rate: 40,
    depth: 60,
    level: 50
  })
}

// 3. Connecter une source audio
const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
const source = engine.getAudioContext().createMediaStreamSource(stream)
source.connect(engine.getInput())

// 4. Démarrer
await engine.start()
```

## Mise à jour des paramètres

```typescript
// Mettre à jour les paramètres d'un effet
await engine.updateEffectParameters('boss-ds1', {
  distortion: 80,
  tone: 60
})

// Activer/désactiver un effet
engine.setEffectEnabled('boss-ds1', false)
```

## Suppression d'effets

```typescript
// Supprimer un effet
engine.removeEffect('boss-ds1')
```

## Nettoyage

```typescript
// Nettoyer toutes les ressources
engine.dispose()
```

## Mapping des paramètres

Tous les paramètres sont mappés de 0-100 (interface utilisateur) vers les valeurs Web Audio API appropriées :

- **Gain/Drive** : 0-100 → 0.1-30 (multiplicateur)
- **Tone** : 0-100 → 200-8000 Hz (fréquence de filtre)
- **Rate** : 0-100 → 0.1-15 Hz (LFO)
- **Time** : 0-100 → 0.01-1 second (delay)
- **EQ** : 0-100 → -15/+15 dB (gain)

Voir `config.ts` pour tous les mappings détaillés.

## Effets disponibles

### Distorsion
- ✅ Overdrive (WaveShaper + filtre)
- ✅ Distortion (WaveShaper agressif)
- ✅ Fuzz (Hard clipping)

### Modulation
- ✅ Chorus (Delay + LFO)
- ✅ Flanger (Delay + feedback + LFO)
- ✅ Phaser (4× allpass filters + LFO)
- ✅ Tremolo (Gain + LFO)

### Time-based
- ✅ Delay (Feedback delay)
- ✅ Reverb (Convolver avec IR)

### Utilitaires
- ✅ EQ (3 bandes : bass, mid, treble)
- ✅ Compressor (DynamicsCompressorNode)
- ✅ Noise Gate (Analyser + Gain dynamique)
- ✅ Cabinet Simulator (Convolver avec IR)

## Tests

```bash
npm test -- effects.test.ts
```

Tous les effets ont des tests unitaires vérifiant :
- Création correcte des nœuds
- Présence de input/output
- Fonctions de cleanup (pour LFO, etc.)

## Notes techniques

- **Oversampling** : WaveShaper utilise `oversample: '4x'` pour réduire l'aliasing
- **LFO** : Tous les effets avec LFO ont une fonction `cleanup()` pour arrêter les oscillateurs
- **Feedback loops** : Delay et Flanger utilisent des boucles de feedback
- **IR** : Reverb et Cabinet Simulator utilisent des Impulse Responses (fichiers ou générées)

## Prochaines étapes

- [ ] Support des modes pour les pédales multi-modes (Walrus Audio, etc.)
- [ ] IR loader pour charger des fichiers IR personnalisés
- [ ] Routing parallèle (en plus du routing série)

