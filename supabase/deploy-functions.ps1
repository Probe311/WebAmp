# Script PowerShell pour déployer les Edge Functions Supabase
# Télécharge Supabase CLI si nécessaire et déploie les fonctions

$ErrorActionPreference = "Stop"

$CLI_DIR = Join-Path $PSScriptRoot ".temp\cli"
$CLI_EXE = Join-Path $CLI_DIR "supabase.exe"
$CLI_URL = "https://github.com/supabase/cli/releases/latest/download/supabase_windows_amd64.exe"

# Créer le dossier CLI si nécessaire
if (-not (Test-Path $CLI_DIR)) {
    New-Item -ItemType Directory -Path $CLI_DIR -Force | Out-Null
}

# Télécharger Supabase CLI si nécessaire
if (-not (Test-Path $CLI_EXE)) {
    Write-Host "📥 Téléchargement de Supabase CLI..." -ForegroundColor Cyan
    try {
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $CLI_URL -OutFile $CLI_EXE -UseBasicParsing
        Write-Host "✅ Supabase CLI téléchargé avec succès" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erreur lors du téléchargement de Supabase CLI" -ForegroundColor Red
        Write-Host "Veuillez télécharger manuellement depuis: $CLI_URL" -ForegroundColor Yellow
        Write-Host "Et placer l'exécutable dans: $CLI_DIR" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✅ Supabase CLI trouvé" -ForegroundColor Green
}

# Vérifier la version
Write-Host "🔍 Vérification de la version..." -ForegroundColor Cyan
& $CLI_EXE --version

# Vérifier si l'utilisateur est connecté
Write-Host "`n🔐 Vérification de la connexion..." -ForegroundColor Cyan
try {
    & $CLI_EXE projects list 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "⚠️ Vous n'êtes pas connecté à Supabase" -ForegroundColor Yellow
        Write-Host "Exécution de 'supabase login'..." -ForegroundColor Cyan
        & $CLI_EXE login
    }
} catch {
    Write-Host "⚠️ Connexion requise. Exécution de 'supabase login'..." -ForegroundColor Yellow
    & $CLI_EXE login
}

# Vérifier si le projet est lié
$CONFIG_FILE = Join-Path $PSScriptRoot ".temp\config.toml"
if (-not (Test-Path $CONFIG_FILE)) {
    Write-Host "`n⚠️ Projet non lié" -ForegroundColor Yellow
    Write-Host "Pour lier votre projet, exécutez:" -ForegroundColor Cyan
    Write-Host "  .\supabase\.temp\cli\supabase.exe link --project-ref VOTRE_PROJECT_REF" -ForegroundColor White
    Write-Host "`nOu exécutez cette commande maintenant:" -ForegroundColor Cyan
    $projectRef = Read-Host "Entrez votre project-ref Supabase"
    if ($projectRef) {
        & $CLI_EXE link --project-ref $projectRef
    } else {
        Write-Host "❌ Déploiement annulé" -ForegroundColor Red
        exit 1
    }
}

# Exemple : déployer une fonction nommée "my-function"
# Write-Host "`n🚀 Déploiement de la fonction my-function..." -ForegroundColor Cyan
# & $CLI_EXE functions deploy my-function

Write-Host "`nℹ️ Aucune fonction spécifique à déployer (l'intégration Songsterr a été retirée)." -ForegroundColor Yellow

