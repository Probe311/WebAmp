# Script PowerShell pour exécuter le seed Supabase
# Usage: .\supabase\seed.ps1

$ErrorActionPreference = "Stop"

# Configuration Supabase (à adapter selon votre environnement)
$env:NODE_PATH = "$PSScriptRoot\..\frontend\node_modules"
$env:SUPABASE_URL = "https://obsatctfkwanwxextiyz.supabase.co"
$env:SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ic2F0Y3Rma3dhbnd4ZXh0aXl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM0NDgzMiwiZXhwIjoyMDgwOTIwODMyfQ.ejssoqVNQEgycnnhLeTKiWQGckeQIkv-E-bmhpDJjEk"

Write-Host "🌱 Démarrage du seed Supabase..." -ForegroundColor Cyan
Write-Host "📦 NODE_PATH: $env:NODE_PATH" -ForegroundColor Gray
Write-Host "🔗 SUPABASE_URL: $env:SUPABASE_URL" -ForegroundColor Gray

# Exécuter le script de seed
Push-Location "$PSScriptRoot\..\frontend"
try {
    npx tsx ../supabase/seed/seed_catalog.ts
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Seed terminé avec succès!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors du seed (code: $LASTEXITCODE)" -ForegroundColor Red
        exit $LASTEXITCODE
    }
} catch {
    Write-Host "❌ Erreur: $_" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}
