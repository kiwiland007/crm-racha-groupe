# Script de déploiement Racha Business CRM (PowerShell)
# Usage: .\deploy.ps1

param(
    [string]$Environment = "production",
    [switch]$SkipBackup = $false
)

# Configuration
$ProjectName = "crm-racha-groupe"
$BuildDir = "dist"
$BackupDir = "backup"
$Date = Get-Date -Format "yyyyMMdd_HHmmss"

# Fonctions utilitaires
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Vérification des prérequis
function Test-Prerequisites {
    Write-Info "Vérification des prérequis..."
    
    # Vérifier Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error "Node.js n'est pas installé"
        exit 1
    }
    
    # Vérifier npm
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Error "npm n'est pas installé"
        exit 1
    }
    
    # Vérifier Git
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "Git n'est pas installé"
        exit 1
    }
    
    Write-Success "Tous les prérequis sont satisfaits"
}

# Nettoyage
function Clear-Project {
    Write-Info "Nettoyage du projet..."
    
    # Supprimer le dossier dist
    if (Test-Path $BuildDir) {
        Remove-Item -Recurse -Force $BuildDir
        Write-Success "Dossier $BuildDir supprimé"
    }
    
    # Nettoyer le cache npm
    npm cache clean --force
    Write-Success "Cache npm nettoyé"
}

# Installation des dépendances
function Install-Dependencies {
    Write-Info "Installation des dépendances..."
    
    # Installer les dépendances
    npm ci --production=false
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Dépendances installées"
    } else {
        Write-Error "Échec de l'installation des dépendances"
        exit 1
    }
}

# Tests
function Invoke-Tests {
    Write-Info "Exécution des tests..."
    
    # Vérifier la syntaxe TypeScript
    $typeCheckResult = npm run type-check 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Vérification TypeScript réussie"
    } else {
        Write-Warning "Pas de script type-check défini ou erreurs TypeScript"
    }
    
    # Linter
    $lintResult = npm run lint 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Linting réussi"
    } else {
        Write-Warning "Pas de script lint défini ou erreurs de linting"
    }
}

# Build de production
function Build-Production {
    Write-Info "Build de production..."
    
    # Définir l'environnement de production
    $env:NODE_ENV = "production"
    
    # Build
    npm run build
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path $BuildDir)) {
        Write-Success "Build de production réussi"
        
        # Afficher la taille du build
        $BuildSize = (Get-ChildItem $BuildDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-Info "Taille du build: $([math]::Round($BuildSize, 2)) MB"
    } else {
        Write-Error "Échec du build de production"
        exit 1
    }
}

# Optimisation du build
function Optimize-Build {
    Write-Info "Optimisation du build..."
    
    # Créer un fichier de version
    $version = @{
        version = (Get-Date -Format "yyyy.MM.dd-HHmmss")
        build = $Date
        commit = (git rev-parse --short HEAD)
    }
    
    $version | ConvertTo-Json | Out-File -FilePath "$BuildDir\version.json" -Encoding UTF8
    Write-Success "Fichier de version créé"
}

# Sauvegarde
function New-Backup {
    if ((Test-Path $BuildDir) -and -not $SkipBackup) {
        Write-Info "Création d'une sauvegarde..."
        
        if (-not (Test-Path $BackupDir)) {
            New-Item -ItemType Directory -Path $BackupDir | Out-Null
        }
        
        $BackupFile = "$BackupDir\build_$Date.zip"
        Compress-Archive -Path $BuildDir -DestinationPath $BackupFile -Force
        
        Write-Success "Sauvegarde créée: $BackupFile"
        
        # Garder seulement les 5 dernières sauvegardes
        Get-ChildItem "$BackupDir\build_*.zip" | Sort-Object LastWriteTime -Descending | Select-Object -Skip 5 | Remove-Item -Force
        Write-Info "Anciennes sauvegardes nettoyées"
    }
}

# Validation du déploiement
function Test-Deployment {
    Write-Info "Validation du déploiement..."
    
    # Vérifier les fichiers essentiels
    $RequiredFiles = @("index.html", "assets", "favicon.ico")
    
    foreach ($file in $RequiredFiles) {
        if (-not (Test-Path "$BuildDir\$file")) {
            Write-Error "Fichier manquant: $file"
            exit 1
        }
    }
    
    Write-Success "Validation du déploiement réussie"
}

# Instructions de déploiement
function Show-DeploymentInstructions {
    Write-Info "Instructions de déploiement:"
    Write-Host ""
    Write-Host "📁 Dossier de build: $BuildDir" -ForegroundColor Cyan
    
    $BuildSize = (Get-ChildItem $BuildDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "📊 Taille: $([math]::Round($BuildSize, 2)) MB" -ForegroundColor Cyan
    
    Write-Host "🔗 Fichiers principaux:" -ForegroundColor Cyan
    Write-Host "   - index.html (point d'entrée)"
    Write-Host "   - assets/ (JS, CSS, images)"
    Write-Host "   - favicon.ico"
    Write-Host ""
    
    Write-Host "🚀 Déploiement manuel:" -ForegroundColor Yellow
    Write-Host "   1. Uploadez le contenu du dossier '$BuildDir' vers votre serveur web"
    Write-Host "   2. Configurez votre serveur pour servir index.html pour toutes les routes"
    Write-Host "   3. Assurez-vous que les headers de cache sont configurés"
    Write-Host ""
    
    Write-Host "☁️ Déploiement Cloudflare Pages:" -ForegroundColor Yellow
    Write-Host "   1. Connectez votre repository GitHub"
    Write-Host "   2. Build command: npm run build"
    Write-Host "   3. Build output directory: $BuildDir"
    Write-Host ""
    
    Write-Host "🗄️ Configuration base de données:" -ForegroundColor Yellow
    Write-Host "   - Host: localhost:3306"
    Write-Host "   - Database: admin_crm"
    Write-Host "   - User: kiwiland"
    Write-Host "   - Importez: database/schema.sql"
    Write-Host ""
    
    Write-Success "Déploiement prêt !"
}

# Fonction principale
function Main {
    Write-Host "🚀 Déploiement $ProjectName" -ForegroundColor Magenta
    Write-Host "================================" -ForegroundColor Magenta
    
    # Vérifications
    Test-Prerequisites
    
    # Nettoyage
    Clear-Project
    
    # Installation
    Install-Dependencies
    
    # Tests
    Invoke-Tests
    
    # Build
    Build-Production
    
    # Optimisation
    Optimize-Build
    
    # Sauvegarde
    New-Backup
    
    # Validation
    Test-Deployment
    
    # Instructions
    Show-DeploymentInstructions
}

# Exécution
try {
    Main
} catch {
    Write-Error "Erreur lors du déploiement: $_"
    exit 1
}
