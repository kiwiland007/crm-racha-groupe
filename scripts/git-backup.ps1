# =====================================================
# SCRIPT DE SAUVEGARDE GIT - RACHA BUSINESS CRM
# Version: 1.0.0 - PowerShell
# =====================================================

param(
    [string]$Message = "",
    [string]$Type = "chore",
    [string]$Version = "",
    [switch]$Auto,
    [switch]$Push,
    [switch]$Tag,
    [switch]$Help
)

# Configuration
$PROJECT_NAME = "racha-business-crm"
$PROJECT_VERSION = "1.0.0"
$REMOTE_NAME = "origin"

# Couleurs PowerShell
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header {
    Write-ColorOutput "=================================================" "Cyan"
    Write-ColorOutput "  SAUVEGARDE GIT - RACHA BUSINESS CRM" "Cyan"
    Write-ColorOutput "  Version: $PROJECT_VERSION" "Cyan"
    Write-ColorOutput "=================================================" "Cyan"
    Write-Host ""
}

function Write-Status {
    param([string]$Message)
    Write-ColorOutput "[INFO] $Message" "Blue"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "[SUCCESS] $Message" "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "[WARNING] $Message" "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "[ERROR] $Message" "Red"
}

# Afficher l'aide
function Show-Help {
    Write-Host "Usage: .\git-backup.ps1 [options]"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Message <msg>    Message de commit"
    Write-Host "  -Type <type>      Type de commit (feature/fix/docs/chore)"
    Write-Host "  -Version <ver>    Version pour le tag"
    Write-Host "  -Auto             Mode automatique"
    Write-Host "  -Push             Pousser vers remote"
    Write-Host "  -Tag              Créer un tag"
    Write-Host "  -Help             Afficher cette aide"
    Write-Host ""
    Write-Host "Exemples:"
    Write-Host "  .\git-backup.ps1 -Message 'Ajout fonctionnalité' -Type feature"
    Write-Host "  .\git-backup.ps1 -Auto -Push"
    Write-Host "  .\git-backup.ps1 -Message 'Release v1.0.1' -Version '1.0.1' -Tag -Push"
}

# Vérifier les prérequis
function Test-Prerequisites {
    Write-Status "Vérification des prérequis..."
    
    # Vérifier Git
    try {
        $gitVersion = git --version
        Write-Success "Git installé: $gitVersion"
    }
    catch {
        Write-Error "Git n'est pas installé ou accessible"
        return $false
    }
    
    # Vérifier si on est dans un repo Git
    try {
        git rev-parse --git-dir | Out-Null
        Write-Success "Repository Git détecté"
    }
    catch {
        Write-Warning "Pas dans un repository Git. Initialisation..."
        git init
        Write-Success "Repository Git initialisé"
    }
    
    return $true
}

# Nettoyer le projet
function Invoke-ProjectCleanup {
    Write-Status "Nettoyage du projet..."
    
    # Supprimer les fichiers temporaires
    Get-ChildItem -Path . -Recurse -Include "*.tmp", "*.temp", "*.log" -ErrorAction SilentlyContinue | Remove-Item -Force
    Get-ChildItem -Path . -Recurse -Name ".DS_Store" -ErrorAction SilentlyContinue | Remove-Item -Force
    
    # Nettoyer les caches
    if (Test-Path "node_modules\.cache") { Remove-Item "node_modules\.cache" -Recurse -Force -ErrorAction SilentlyContinue }
    if (Test-Path ".vite") { Remove-Item ".vite" -Recurse -Force -ErrorAction SilentlyContinue }
    if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force -ErrorAction SilentlyContinue }
    
    Write-Success "Projet nettoyé"
}

# Vérifier l'état Git
function Test-GitStatus {
    Write-Status "Vérification de l'état Git..."
    
    $status = git status --porcelain
    if ($status) {
        Write-Warning "Modifications non commitées détectées:"
        git status --short
        Write-Host ""
        
        if (-not $Auto) {
            $confirm = Read-Host "Continuer avec ces modifications? (y/N)"
            if ($confirm -ne "y" -and $confirm -ne "Y") {
                Write-Error "Sauvegarde annulée"
                exit 1
            }
        }
    }
    
    Write-Success "État Git vérifié"
}

# Créer un commit
function New-GitCommit {
    param(
        [string]$CommitMessage,
        [string]$CommitType
    )
    
    Write-Status "Création du commit..."
    
    # Ajouter tous les fichiers
    git add .
    
    # Vérifier s'il y a des changements à commiter
    $changes = git diff --cached --name-only
    if (-not $changes) {
        Write-Warning "Aucune modification à commiter"
        return $false
    }
    
    # Formater le message de commit
    $formattedMessage = switch ($CommitType) {
        "feature" { "feat: $CommitMessage" }
        "fix" { "fix: $CommitMessage" }
        "docs" { "docs: $CommitMessage" }
        "style" { "style: $CommitMessage" }
        "refactor" { "refactor: $CommitMessage" }
        "test" { "test: $CommitMessage" }
        "chore" { "chore: $CommitMessage" }
        "release" { "release: $CommitMessage" }
        default { $CommitMessage }
    }
    
    # Créer le commit
    git commit -m $formattedMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Commit créé: $formattedMessage"
        return $true
    }
    else {
        Write-Error "Erreur lors de la création du commit"
        return $false
    }
}

# Créer un tag
function New-GitTag {
    param(
        [string]$TagVersion,
        [string]$TagMessage
    )
    
    Write-Status "Création du tag de version..."
    
    # Vérifier si le tag existe déjà
    $existingTag = git tag -l "v$TagVersion"
    if ($existingTag) {
        Write-Warning "Le tag v$TagVersion existe déjà"
        if (-not $Auto) {
            $confirm = Read-Host "Supprimer et recréer le tag? (y/N)"
            if ($confirm -eq "y" -or $confirm -eq "Y") {
                git tag -d "v$TagVersion"
                Write-Success "Tag existant supprimé"
            }
            else {
                return $false
            }
        }
        else {
            return $false
        }
    }
    
    # Créer le tag
    git tag -a "v$TagVersion" -m $TagMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Tag v$TagVersion créé"
        return $true
    }
    else {
        Write-Error "Erreur lors de la création du tag"
        return $false
    }
}

# Pousser vers remote
function Invoke-GitPush {
    param([bool]$PushTags = $false)
    
    Write-Status "Push vers le remote..."
    
    # Vérifier si un remote existe
    $remotes = git remote
    if (-not $remotes) {
        Write-Warning "Aucun remote configuré"
        if (-not $Auto) {
            $remoteUrl = Read-Host "URL du repository distant (optionnel)"
            if ($remoteUrl) {
                git remote add $REMOTE_NAME $remoteUrl
                Write-Success "Remote ajouté: $remoteUrl"
            }
            else {
                Write-Warning "Pas de push vers remote"
                return $false
            }
        }
        else {
            Write-Warning "Mode auto: pas de push vers remote"
            return $false
        }
    }
    
    # Push des commits
    $currentBranch = git branch --show-current
    git push $REMOTE_NAME $currentBranch
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Commits poussés vers $REMOTE_NAME"
    }
    else {
        Write-Error "Erreur lors du push des commits"
        return $false
    }
    
    # Push des tags si demandé
    if ($PushTags) {
        git push $REMOTE_NAME --tags
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Tags poussés vers $REMOTE_NAME"
        }
        else {
            Write-Error "Erreur lors du push des tags"
            return $false
        }
    }
    
    return $true
}

# Créer une archive de sauvegarde
function New-BackupArchive {
    $backupDir = ".\backups"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $archiveName = "${PROJECT_NAME}_backup_${timestamp}.zip"
    $archivePath = Join-Path $backupDir $archiveName
    
    Write-Status "Création de l'archive de sauvegarde..."
    
    # Créer le dossier de sauvegarde
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    
    # Créer l'archive en excluant les dossiers inutiles
    $excludePatterns = @(
        "node_modules",
        "dist",
        ".git",
        "*.log",
        "*.tmp",
        ".cache",
        "backups"
    )
    
    try {
        # Utiliser 7-Zip si disponible, sinon PowerShell
        if (Get-Command "7z" -ErrorAction SilentlyContinue) {
            $excludeArgs = $excludePatterns | ForEach-Object { "-x!$_" }
            & 7z a $archivePath . $excludeArgs | Out-Null
        }
        else {
            # Méthode PowerShell (plus lente mais fonctionne partout)
            $tempDir = Join-Path $env:TEMP "crm_backup_temp"
            if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
            New-Item -ItemType Directory -Path $tempDir | Out-Null
            
            # Copier les fichiers en excluant les patterns
            robocopy . $tempDir /E /XD node_modules dist .git .cache backups /XF *.log *.tmp | Out-Null
            
            # Créer l'archive
            Compress-Archive -Path "$tempDir\*" -DestinationPath $archivePath -Force
            
            # Nettoyer
            Remove-Item $tempDir -Recurse -Force
        }
        
        $size = (Get-Item $archivePath).Length / 1MB
        Write-Success "Archive créée: $archiveName ($([math]::Round($size, 2)) MB)"
        
        # Nettoyer les anciennes archives (garder 10 dernières)
        Get-ChildItem $backupDir -Filter "${PROJECT_NAME}_backup_*.zip" | 
            Sort-Object LastWriteTime -Descending | 
            Select-Object -Skip 10 | 
            Remove-Item -Force
        
        return $true
    }
    catch {
        Write-Error "Erreur lors de la création de l'archive: $($_.Exception.Message)"
        return $false
    }
}

# Générer un rapport de sauvegarde
function New-BackupReport {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC"
    $commitHash = git rev-parse HEAD
    $branch = git branch --show-current
    $commitCount = git rev-list --count HEAD
    
    $report = @{
        project = $PROJECT_NAME
        version = $PROJECT_VERSION
        backup = @{
            timestamp = $timestamp
            commit_hash = $commitHash
            branch = $branch
            commit_count = [int]$commitCount
            status = "completed"
        }
        git = @{
            remotes = @(git remote -v)
            branches = @(git branch -a | ForEach-Object { $_.Trim() -replace '^\*\s*', '' })
            tags = @(git tag)
        }
        files = @{
            total = (Get-ChildItem -Recurse -File | Measure-Object).Count
            source_files = (Get-ChildItem src -Recurse -Include "*.ts", "*.tsx" -ErrorAction SilentlyContinue | Measure-Object).Count
            config_files = (Get-ChildItem . -Include "*.json", "*.js", "*.ts" -Depth 0 | Measure-Object).Count
        }
    }
    
    $reportJson = $report | ConvertTo-Json -Depth 3
    $reportPath = "backup-report.json"
    $reportJson | Out-File -FilePath $reportPath -Encoding UTF8
    
    Write-Success "Rapport de sauvegarde généré: $reportPath"
}

# Sauvegarde complète
function Invoke-FullBackup {
    param(
        [string]$CommitMessage,
        [string]$CommitType,
        [string]$TagVersion = "",
        [bool]$DoPush = $false,
        [bool]$DoTag = $false
    )
    
    Write-Header
    
    if (-not (Test-Prerequisites)) { exit 1 }
    
    Invoke-ProjectCleanup
    Test-GitStatus
    
    if (New-GitCommit $CommitMessage $CommitType) {
        if ($DoTag -and $TagVersion) {
            $tagMessage = "Release v${TagVersion}: ${CommitMessage}"
            New-GitTag $TagVersion $tagMessage | Out-Null
        }
        
        if ($DoPush) {
            Invoke-GitPush $DoTag | Out-Null
        }
        
        New-BackupArchive | Out-Null
        New-BackupReport
        
        Write-Success "Sauvegarde complète terminée!"
    }
}

# Point d'entrée principal
function Main {
    if ($Help) {
        Show-Help
        return
    }
    
    if ($Auto) {
        $autoMessage = "Sauvegarde automatique - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        Invoke-FullBackup $autoMessage "chore" "" $Push $Tag
    }
    elseif ($Message) {
        Invoke-FullBackup $Message $Type $Version $Push $Tag
    }
    else {
        # Mode interactif
        Write-Header
        
        $commitMessage = Read-Host "Message de commit"
        if (-not $commitMessage) {
            Write-Error "Message de commit requis"
            exit 1
        }
        
        $commitType = Read-Host "Type de commit (feature/fix/docs/chore) [chore]"
        if (-not $commitType) { $commitType = "chore" }
        
        $createTag = Read-Host "Créer un tag de version? (y/N)"
        $tagVersion = ""
        if ($createTag -eq "y" -or $createTag -eq "Y") {
            $tagVersion = Read-Host "Version (ex: 1.0.1)"
        }
        
        $pushRemote = Read-Host "Pousser vers remote? (y/N)"
        $doPush = ($pushRemote -eq "y" -or $pushRemote -eq "Y")
        
        Invoke-FullBackup $commitMessage $commitType $tagVersion $doPush ($tagVersion -ne "")
    }
}

# Gestion des erreurs
trap {
    Write-Error "Erreur inattendue: $($_.Exception.Message)"
    exit 1
}

# Exécuter le script
Main
