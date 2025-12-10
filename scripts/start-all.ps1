# Script pour démarrer tous les services
Write-Host "=== Démarrage WebAmp ===" -ForegroundColor Green

# Démarrer le Native Helper en arrière-plan
Write-Host "Démarrage du Native Helper..." -ForegroundColor Cyan
$nativeJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    $buildPath = "native\build\Release\webamp_native.exe"
    if (Test-Path $buildPath) {
        & $buildPath
    } else {
        Write-Host "ERREUR: Exécutable non trouvé. Build nécessaire." -ForegroundColor Red
    }
}

# Attendre un peu pour que le serveur démarre
Start-Sleep -Seconds 2

# Démarrer le Frontend
Write-Host "Démarrage du Frontend..." -ForegroundColor Cyan
Set-Location frontend
if (-not (Test-Path "node_modules")) {
    Write-Host "Installation des dépendances..." -ForegroundColor Yellow
    npm install
}

Write-Host "`n=== Services démarrés ===" -ForegroundColor Green
Write-Host "Native Helper: Port 8765 (WebSocket)" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:10000" -ForegroundColor Cyan
Write-Host "`nAppuyez sur Ctrl+C pour arrêter tous les services" -ForegroundColor Yellow

# Démarrer le frontend (bloquant)
npm run dev

# Nettoyage à l'arrêt
Stop-Job $nativeJob
Remove-Job $nativeJob

