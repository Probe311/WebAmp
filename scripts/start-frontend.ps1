# Script de démarrage pour le Frontend
Write-Host "=== Démarrage WebAmp Frontend ===" -ForegroundColor Green

# Vérifier si node_modules existe
if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installation des dépendances..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host "Démarrage du serveur de développement sur http://localhost:10000" -ForegroundColor Cyan
Set-Location frontend
npm run dev

