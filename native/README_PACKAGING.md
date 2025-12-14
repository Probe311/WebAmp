# Guide de Packaging du Native Helper

Ce guide explique comment créer les packages distribuables du Native Helper pour Windows, macOS et Linux.

## Prérequis

### Windows
- Visual Studio 2019+ ou Build Tools
- CMake 3.20+
- NSIS (optionnel, pour créer un installateur) : https://nsis.sourceforge.io/Download

### macOS
- Xcode Command Line Tools
- CMake 3.20+
- create-dmg (optionnel, pour créer un DMG) : `brew install create-dmg`

### Linux
- GCC 9+ ou Clang 10+
- CMake 3.20+
- appimagetool (optionnel, pour créer un AppImage) : https://github.com/AppImage/AppImageKit/releases

## Étapes de packaging

### 1. Build du Native Helper

#### Windows
```powershell
.\scripts\build-native.bat
```

#### macOS/Linux
```bash
./scripts/build-native.sh
```

### 2. Création du package

#### Windows
```powershell
.\scripts\package-windows.ps1
```

Cela créera :
- `dist/windows/webamp-native-helper-setup.exe` (installateur NSIS, si NSIS est installé)
- `dist/webamp-native-helper-windows-v1.0.0.zip` (archive ZIP)

#### macOS
```bash
chmod +x scripts/package-macos.sh
./scripts/package-macos.sh
```

Cela créera :
- `dist/macos/WebAmp Native Helper.app` (application macOS)
- `dist/webamp-native-helper-macos-v1.0.0.zip` (archive ZIP)
- `dist/webamp-native-helper-macos-v1.0.0.dmg` (DMG, si create-dmg est installé)

#### Linux
```bash
chmod +x scripts/package-linux.sh
./scripts/package-linux.sh
```

Cela créera :
- `dist/linux/webamp-native-helper-linux-v1.0.0.tar.gz` (archive TAR.GZ)
- `dist/webamp-native-helper-linux-v1.0.0.AppImage` (AppImage, si appimagetool est installé)

## Distribution

### GitHub Releases (Recommandé)

1. Créez une nouvelle release sur GitHub
2. Téléversez les fichiers créés dans `dist/`
3. Les utilisateurs pourront télécharger depuis l'interface WebAmp

### Configuration dans WebAmp

Les URLs de téléchargement sont configurées dans `frontend/src/utils/nativeHelperDownload.ts`.

Par défaut, elles pointent vers GitHub Releases :
- Format : `https://github.com/{REPO}/releases/latest/download/{FILENAME}`

Vous pouvez personnaliser les URLs via les variables d'environnement :
- `VITE_GITHUB_REPO` : Repository GitHub (défaut: `Probe311/WebAmp`)
- `VITE_NATIVE_HELPER_VERSION` : Version ou tag (défaut: `latest`)
- `VITE_NATIVE_HELPER_WIN_INSTALLER` : URL personnalisée pour l'installateur Windows
- `VITE_NATIVE_HELPER_WIN_ZIP` : URL personnalisée pour l'archive Windows
- etc.

## Structure des fichiers créés

### Windows
```
dist/
├── windows/
│   ├── webamp_native.exe
│   ├── start-webamp-native.bat
│   ├── README.txt
│   └── webamp-native-helper-setup.exe (si NSIS disponible)
└── webamp-native-helper-windows-v1.0.0.zip
```

### macOS
```
dist/
├── macos/
│   └── WebAmp Native Helper.app/
│       ├── Contents/
│       │   ├── Info.plist
│       │   ├── MacOS/
│       │   │   └── webamp_native
│       │   └── Resources/
│       │       └── README.txt
└── webamp-native-helper-macos-v1.0.0.zip
└── webamp-native-helper-macos-v1.0.0.dmg (si create-dmg disponible)
```

### Linux
```
dist/
├── linux/
│   ├── webamp_native
│   ├── start-webamp-native.sh
│   ├── README.txt
│   └── webamp-native-helper.desktop
└── webamp-native-helper-linux-v1.0.0.tar.gz
└── webamp-native-helper-linux-v1.0.0.AppImage (si appimagetool disponible)
```

## Notes importantes

1. **Version** : La version est définie dans les scripts de packaging. Modifiez-la avant de créer les packages.

2. **Dépendances** : Assurez-vous que toutes les dépendances sont incluses ou documentées dans le README.

3. **Code signing** : Pour macOS et Windows, considérez signer les applications pour éviter les avertissements de sécurité.

4. **Tests** : Testez les packages sur des machines propres avant de les distribuer.

5. **Documentation** : Les README.txt sont inclus dans chaque package pour guider les utilisateurs.

