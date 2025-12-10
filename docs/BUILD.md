# Guide de Build - WebAmp

Ce document explique comment compiler WebAmp pour différentes plateformes.

## Prérequis

### Windows
- Visual Studio 2019 ou plus récent (ou MinGW)
- CMake 3.20+
- ASIO SDK (optionnel, pour support ASIO)
  - Télécharger depuis [Steinberg](https://www.steinberg.net/asiosdk)
  - Placer dans `native/third_party/asio/`

### macOS
- Xcode 12+ (ou Clang)
- CMake 3.20+
- CoreAudio (inclus dans macOS)

### Linux
- GCC 9+ ou Clang 10+
- CMake 3.20+
- libpipewire-dev (pour PipeWire)
  ```bash
  sudo apt install libpipewire-dev  # Debian/Ubuntu
  sudo dnf install pipewire-devel   # Fedora
  ```

## Compilation

### Windows

```powershell
cd native
mkdir build
cd build
cmake .. -DUSE_ASIO_SDK=ON  # Si ASIO SDK est disponible
cmake --build . --config Release
```

### macOS

```bash
cd native
mkdir build
cd build
cmake .. -DBUILD_COREAUDIO=ON
cmake --build . --config Release
```

### Linux

```bash
cd native
mkdir build
cd build
cmake .. -DBUILD_PIPEWIRE=ON
cmake --build . --config Release
```

## Options de Build

- `BUILD_ASIO` : Activer le support ASIO (Windows, défaut: ON)
- `BUILD_WASAPI` : Activer le support WASAPI (Windows, défaut: ON)
- `BUILD_COREAUDIO` : Activer le support CoreAudio (macOS, défaut: ON si Apple)
- `BUILD_PIPEWIRE` : Activer le support PipeWire (Linux, défaut: ON si disponible)
- `USE_ASIO_SDK` : Utiliser l'ASIO SDK (nécessite SDK dans third_party/asio)

## Drivers Audio

### Windows
- **WASAPI** : Toujours disponible, mode exclusif pour latence minimale
- **ASIO** : Nécessite ASIO SDK et un driver ASIO installé (ex: ASIO4ALL)

### macOS
- **CoreAudio** : Natif, utilise AudioUnit HAL pour latence minimale

### Linux
- **PipeWire** : Support natif avec émulation JACK automatique si configuré

## Détection automatique

L'application détecte automatiquement le meilleur driver disponible :
- Windows : ASIO → WASAPI (fallback)
- macOS : CoreAudio
- Linux : PipeWire

## Troubleshooting

### ASIO ne fonctionne pas
- Vérifier que l'ASIO SDK est dans `native/third_party/asio/`
- Vérifier que `USE_ASIO_SDK=ON` est défini
- Vérifier qu'un driver ASIO est installé (ex: ASIO4ALL)

### PipeWire non détecté
- Installer libpipewire-dev
- Vérifier que PipeWire est en cours d'exécution : `systemctl --user status pipewire`

### CoreAudio erreurs
- Vérifier les permissions microphone dans les Préférences Système
- Vérifier qu'aucune autre application n'utilise exclusivement l'audio
