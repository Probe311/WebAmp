# Drivers Audio - Documentation

Ce document décrit l'implémentation des drivers audio pour WebAmp.

## Architecture

Tous les drivers implémentent l'interface `AudioDriver` qui fournit :
- Initialisation et arrêt
- Démarrage/arrêt du streaming
- Configuration (sample rate, buffer size, canaux)
- Gestion de la latence
- Callback audio pour le traitement DSP

## ASIO Driver (Windows)

### Implémentation
- Support complet des callbacks ASIO (bufferSwitchTimeInfo, sampleRateChanged, asioMessage)
- Double buffering pour latence minimale
- Conversion automatique de formats (Int16, Int24, Int32, Float32, Float64)
- Support multi-canal (jusqu'à 32 canaux)
- Détection automatique des drivers ASIO installés
- Gestion des changements de périphérique à chaud

### Prérequis
- ASIO SDK de Steinberg dans `native/third_party/asio/`
- Un driver ASIO installé (ex: ASIO4ALL, Focusrite ASIO, etc.)

### Utilisation
```cpp
auto driver = std::make_unique<ASIODriver>();
driver->selectDriver("ASIO4ALL");  // Optionnel
driver->initialize(48000, 128);
driver->start();
```

## CoreAudio Driver (macOS)

### Implémentation
- Utilise AudioUnit HAL pour latence minimale
- Support natif multi-canal
- Gestion automatique de la latence variable
- Support des formats haute résolution (32-bit float)
- Structure prête pour Aggregate Device (nécessite permissions)

### Prérequis
- macOS 10.9+ (CoreAudio natif)
- Permissions microphone si entrée audio nécessaire

### Utilisation
```cpp
auto driver = std::make_unique<CoreAudioDriver>();
driver->initialize(48000, 128);
driver->start();
```

## PipeWire Driver (Linux)

### Implémentation
- Support natif PipeWire
- Émulation JACK automatique si JACK_SERVER défini
- Support multi-canal
- Gestion des permissions via PipeWire
- Détection automatique des périphériques

### Prérequis
- libpipewire-dev installé
- PipeWire en cours d'exécution

### Utilisation
```cpp
auto driver = std::make_unique<PipeWireDriver>();
driver->initialize(48000, 128);
driver->start();
```

## Détection automatique

L'`AudioEngine` détecte automatiquement le meilleur driver :
- Windows : ASIO (si disponible) → WASAPI (fallback)
- macOS : CoreAudio
- Linux : PipeWire

## Notes de développement

- Tous les drivers utilisent des buffers float32 en interne
- La conversion de format est gérée automatiquement
- Les callbacks sont thread-safe
- La latence est calculée automatiquement depuis les devices

