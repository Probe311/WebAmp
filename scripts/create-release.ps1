# Script pour créer une release Git
# Usage: .\scripts\create-release.ps1 -Version "1.1.3" -Message "Description de la release"

param(
    [Parameter(Mandatory=$true)]
    [string]$Version,
    
    [Parameter(Mandatory=$false)]
    [string]$Message = "Release $Version"
)

# Fonction pour trouver Git
function Find-Git {
    $gitPaths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "$env:LOCALAPPDATA\Programs\Git\bin\git.exe",
        "git"  # Si dans le PATH
    )
    
    foreach ($path in $gitPaths) {
        if ($path -eq "git") {
            try {
                $null = Get-Command git -ErrorAction Stop
                return "git"
            } catch {
                continue
            }
        } else {
            if (Test-Path $path) {
                return $path
            }
        }
    }
    
    return $null
}

# Vérifier si Git est disponible
$git = Find-Git
if (-not $git) {
    Write-Host "❌ Git n'est pas trouvé sur ce système." -ForegroundColor Red
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Yellow
    Write-Host "1. Installer Git depuis https://git-scm.com/download/win" -ForegroundColor Cyan
    Write-Host "2. Utiliser GitHub Desktop: https://desktop.github.com/" -ForegroundColor Cyan
    Write-Host "3. Créer la release manuellement sur GitHub.com" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pour créer la release manuellement:" -ForegroundColor Yellow
    Write-Host "1. Allez sur https://github.com/Probe311/WebAmp/releases/new" -ForegroundColor Cyan
    Write-Host "2. Créez un nouveau tag: v$Version" -ForegroundColor Cyan
    Write-Host "3. Titre: Release $Version" -ForegroundColor Cyan
    Write-Host "4. Description: $Message" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ Git trouvé: $git" -ForegroundColor Green
Write-Host ""

# Vérifier si on est dans un dépôt Git
$isGitRepo = & $git rev-parse --git-dir 2>$null
if (-not $isGitRepo) {
    Write-Host "❌ Ce répertoire n'est pas un dépôt Git." -ForegroundColor Red
    Write-Host "Initialisation du dépôt Git..." -ForegroundColor Yellow
    
    & $git init
    & $git branch -M main
    
    Write-Host "⚠️  Le dépôt a été initialisé. Vous devez:" -ForegroundColor Yellow
    Write-Host "1. Ajouter un remote: git remote add origin <url>" -ForegroundColor Cyan
    Write-Host "2. Faire un premier commit" -ForegroundColor Cyan
    Write-Host "3. Pousser vers GitHub" -ForegroundColor Cyan
    exit 1
}

# Vérifier s'il y a des changements non commités
$status = & $git status --porcelain
if ($status) {
    Write-Host "⚠️  Il y a des changements non commités:" -ForegroundColor Yellow
    Write-Host $status
    Write-Host ""
    $response = Read-Host "Voulez-vous les commiter avant de créer la release? (o/n)"
    if ($response -eq "o" -or $response -eq "O") {
        Write-Host "Ajout des fichiers..." -ForegroundColor Yellow
        & $git add .
        $commitMessage = Read-Host "Message de commit"
        if (-not $commitMessage) {
            $commitMessage = "Prepare release $Version"
        }
        & $git commit -m $commitMessage
    }
}

# Vérifier si le tag existe déjà
$tagExists = & $git tag -l "v$Version"
if ($tagExists) {
    Write-Host "❌ Le tag v$Version existe déjà." -ForegroundColor Red
    exit 1
}

# Créer le tag
Write-Host "Création du tag v$Version..." -ForegroundColor Yellow
& $git tag -a "v$Version" -m "$Message"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la création du tag." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Tag v$Version créé avec succès!" -ForegroundColor Green
Write-Host ""

# Vérifier si un remote existe
$remote = & $git remote -v
if (-not $remote) {
    Write-Host "⚠️  Aucun remote configuré." -ForegroundColor Yellow
    Write-Host "Le tag a été créé localement mais n'a pas été poussé." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour pousser le tag:" -ForegroundColor Cyan
    Write-Host "  git remote add origin <url>" -ForegroundColor White
    Write-Host "  git push origin v$Version" -ForegroundColor White
    exit 0
}

# Demander si on veut pousser
$response = Read-Host "Voulez-vous pousser le tag vers GitHub? (o/n)"
if ($response -eq "o" -or $response -eq "O") {
    Write-Host "Poussage du tag vers GitHub..." -ForegroundColor Yellow
    & $git push origin "v$Version"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Tag poussé avec succès!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📦 Pour créer la release sur GitHub:" -ForegroundColor Cyan
        Write-Host "   https://github.com/Probe311/WebAmp/releases/new" -ForegroundColor White
        Write-Host "   Tag: v$Version" -ForegroundColor White
        Write-Host "   Titre: Release $Version" -ForegroundColor White
    } else {
        Write-Host "❌ Erreur lors du push du tag." -ForegroundColor Red
        Write-Host "Vous pouvez pousser manuellement avec: git push origin v$Version" -ForegroundColor Yellow
    }
} else {
    Write-Host "Tag créé localement. Pour le pousser:" -ForegroundColor Yellow
    Write-Host "  git push origin v$Version" -ForegroundColor Cyan
}

