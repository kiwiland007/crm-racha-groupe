# =====================================================
# SCRIPT DE NETTOYAGE - RACHA BUSINESS CRM
# Version: 1.0.0
# =====================================================

param(
    [switch]$Deep,
    [switch]$Cache,
    [switch]$Build,
    [switch]$All,
    [switch]$Help
)

# Couleurs
$Green = "Green"
$Blue = "Blue"
$Yellow = "Yellow"
$Red = "Red"

function Write-Header {
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host "  NETTOYAGE PROJET - RACHA BUSINESS CRM" -ForegroundColor Cyan
    Write-Host "  Version: 1.0.0" -ForegroundColor Cyan
    Write-Host "=================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Show-Help {
    Write-Host "Usage: .\cleanup.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Cache    Nettoyer les caches (npm, vite, etc.)"
    Write-Host "  -Build    Nettoyer les dossiers de build"
    Write-Host "  -Deep     Nettoyage approfondi"
    Write-Host "  -All      Nettoyage complet"
    Write-Host "  -Help     Afficher cette aide"
    Write-Host ""
    Write-Host "Exemples:"
    Write-Host "  .\cleanup.ps1 -Cache"
    Write-Host "  .\cleanup.ps1 -All"
}

function Get-FolderSize {
    param([string]$Path)
    if (Test-Path $Path) {
        $size = (Get-ChildItem $Path -Recurse -ErrorAction SilentlyContinue | 
                Measure-Object -Property Length -Sum).Sum
        return [math]::Round($size / 1MB, 2)
    }
    return 0
}

function Remove-SafeDirectory {
    param([string]$Path, [string]$Description)
    
    if (Test-Path $Path) {
        $size = Get-FolderSize $Path
        Write-Status "Suppression de $Description ($size MB)..."
        try {
            Remove-Item $Path -Recurse -Force -ErrorAction Stop
            Write-Success "$Description supprimé"
            return $size
        }
        catch {
            Write-Warning "Impossible de supprimer $Description : $($_.Exception.Message)"
            return 0
        }
    }
    else {
        Write-Status "$Description n'existe pas"
        return 0
    }
}

function Clear-Cache {
    Write-Status "Nettoyage des caches..."
    $totalSaved = 0
    
    # Cache npm
    Write-Status "Nettoyage du cache npm..."
    try {
        npm cache clean --force 2>$null
        Write-Success "Cache npm nettoyé"
    }
    catch {
        Write-Warning "Erreur lors du nettoyage du cache npm"
    }
    
    # Cache Vite
    $totalSaved += Remove-SafeDirectory "node_modules\.vite" "Cache Vite"
    $totalSaved += Remove-SafeDirectory ".vite" "Cache Vite local"
    
    # Cache ESLint
    $totalSaved += Remove-SafeDirectory ".eslintcache" "Cache ESLint"
    
    # Cache TypeScript
    Get-ChildItem -Recurse -Filter "*.tsbuildinfo" -ErrorAction SilentlyContinue | 
        ForEach-Object { 
            Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
            Write-Status "Supprimé: $($_.Name)"
        }
    
    Write-Success "Caches nettoyés (${totalSaved} MB libérés)"
    return $totalSaved
}

function Clear-Build {
    Write-Status "Nettoyage des dossiers de build..."
    $totalSaved = 0
    
    $totalSaved += Remove-SafeDirectory "dist" "Dossier dist"
    $totalSaved += Remove-SafeDirectory "build" "Dossier build"
    $totalSaved += Remove-SafeDirectory "dist-ssr" "Dossier dist-ssr"
    
    Write-Success "Dossiers de build nettoyés (${totalSaved} MB libérés)"
    return $totalSaved
}

function Clear-Temporary {
    Write-Status "Nettoyage des fichiers temporaires..."
    $totalSaved = 0
    
    # Fichiers temporaires
    $tempFiles = Get-ChildItem -Recurse -Include "*.tmp", "*.temp", "*.log" -ErrorAction SilentlyContinue
    foreach ($file in $tempFiles) {
        $size = $file.Length / 1MB
        Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
        $totalSaved += $size
        Write-Status "Supprimé: $($file.Name)"
    }
    
    # Dossiers temporaires
    $totalSaved += Remove-SafeDirectory "tmp" "Dossier tmp"
    $totalSaved += Remove-SafeDirectory "temp" "Dossier temp"
    
    # Fichiers de sauvegarde
    $backupFiles = Get-ChildItem -Recurse -Include "*.bak", "*.backup", "*.old" -ErrorAction SilentlyContinue
    foreach ($file in $backupFiles) {
        $size = $file.Length / 1MB
        Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
        $totalSaved += $size
        Write-Status "Supprimé: $($file.Name)"
    }
    
    Write-Success "Fichiers temporaires nettoyés (${totalSaved} MB libérés)"
    return $totalSaved
}

function Clear-DeepClean {
    Write-Status "Nettoyage approfondi..."
    $totalSaved = 0
    
    # Coverage
    $totalSaved += Remove-SafeDirectory "coverage" "Dossier coverage"
    
    # Logs
    $totalSaved += Remove-SafeDirectory "logs" "Dossier logs"
    
    # Archives
    $archiveFiles = Get-ChildItem -Recurse -Include "*.zip", "*.tar.gz", "*.rar" -ErrorAction SilentlyContinue
    foreach ($file in $archiveFiles) {
        if ($file.Name -notmatch "racha.*backup") {  # Garder les sauvegardes importantes
            $size = $file.Length / 1MB
            Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
            $totalSaved += $size
            Write-Status "Supprimé: $($file.Name)"
        }
    }
    
    # Fichiers de rapport temporaires
    $reportFiles = Get-ChildItem -Filter "*-report-*.json" -ErrorAction SilentlyContinue
    foreach ($file in $reportFiles) {
        $size = $file.Length / 1MB
        Remove-Item $file.FullName -Force -ErrorAction SilentlyContinue
        $totalSaved += $size
        Write-Status "Supprimé: $($file.Name)"
    }
    
    Write-Success "Nettoyage approfondi terminé (${totalSaved} MB libérés)"
    return $totalSaved
}

function Show-ProjectStats {
    Write-Status "Statistiques du projet..."
    
    $totalSize = Get-FolderSize "."
    $nodeModulesSize = Get-FolderSize "node_modules"
    $srcSize = Get-FolderSize "src"
    $publicSize = Get-FolderSize "public"
    $databaseSize = Get-FolderSize "database"
    
    Write-Host ""
    Write-Host "Taille du projet:" -ForegroundColor Cyan
    Write-Host "  Total: $totalSize MB" -ForegroundColor White
    Write-Host "  node_modules: $nodeModulesSize MB" -ForegroundColor Yellow
    Write-Host "  src: $srcSize MB" -ForegroundColor Green
    Write-Host "  public: $publicSize MB" -ForegroundColor Green
    Write-Host "  database: $databaseSize MB" -ForegroundColor Green
    Write-Host ""
    
    # Compter les fichiers
    $totalFiles = (Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
    $srcFiles = (Get-ChildItem "src" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
    $componentFiles = (Get-ChildItem "src\components" -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
    
    Write-Host "Nombre de fichiers:" -ForegroundColor Cyan
    Write-Host "  Total: $totalFiles fichiers" -ForegroundColor White
    Write-Host "  Source: $srcFiles fichiers" -ForegroundColor Green
    Write-Host "  Composants: $componentFiles fichiers" -ForegroundColor Green
    Write-Host ""
}

function Main {
    if ($Help) {
        Show-Help
        return
    }
    
    Write-Header
    
    $initialSize = Get-FolderSize "."
    $totalSaved = 0
    
    if ($Cache -or $All) {
        $totalSaved += Clear-Cache
        Write-Host ""
    }
    
    if ($Build -or $All) {
        $totalSaved += Clear-Build
        Write-Host ""
    }
    
    if ($Deep -or $All) {
        $totalSaved += Clear-Temporary
        $totalSaved += Clear-DeepClean
        Write-Host ""
    }
    
    if (-not ($Cache -or $Build -or $Deep -or $All)) {
        # Nettoyage par défaut
        $totalSaved += Clear-Cache
        $totalSaved += Clear-Build
        Write-Host ""
    }
    
    $finalSize = Get-FolderSize "."
    $actualSaved = $initialSize - $finalSize
    
    Write-Host "Résumé du nettoyage:" -ForegroundColor Cyan
    Write-Host "  Taille initiale: $initialSize MB" -ForegroundColor White
    Write-Host "  Taille finale: $finalSize MB" -ForegroundColor White
    Write-Host "  Espace libéré: $actualSaved MB" -ForegroundColor Green
    Write-Host ""
    
    Show-ProjectStats
    
    Write-Success "Nettoyage terminé avec succès!"
}

# Gestion des erreurs
trap {
    Write-Error "Erreur inattendue: $($_.Exception.Message)"
    exit 1
}

# Exécuter le script
Main
