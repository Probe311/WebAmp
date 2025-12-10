# Script de démarrage pour le Native Helper
Write-Host "=== Démarrage WebAmp Native Helper ===" -ForegroundColor Green

# Vérifier si le build existe
$buildPath = "native\build\Release\webamp_native.exe"
if (-not (Test-Path $buildPath)) {
    Write-Host "L'exécutable n'existe pas. Build nécessaire." -ForegroundColor Yellow
    Write-Host "Exécutez: scripts\build-native.bat" -ForegroundColor Yellow
    exit 1
}

Write-Host "Démarrage du serveur WebSocket sur le port 8765..." -ForegroundColor Cyan
& $buildPath

