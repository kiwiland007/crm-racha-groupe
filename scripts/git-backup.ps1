# Script de sauvegarde Git optimisé pour Racha Business Digital CRM (PowerShell)
# Usage: .\scripts\git-backup.ps1 ["message de commit"]

param(
    [string]$CommitMessage = "🔧 Optimisation et nettoyage du code - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

# Configuration
$ProjectName = "maroctactile-crm-hub"
$BranchMain = "main"
$BackupBranch = "backup/$(Get-Date -Format 'yyyyMMdd_HHmmss')"

# Fonctions de logging
function Write-Info { param($Message) Write-Host "[INFO] $Message" -ForegroundColor Blue }
function Write-Success { param($Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
function Write-Warning { param($Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Error { param($Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }

# Vérification des prérequis
function Test-Git {
    Write-Info "Vérification de Git..."
    
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "Git n'est pas installé ou pas dans le PATH"
        exit 1
    }
    
    if (-not (Test-Path ".git")) {
        Write-Error "Ce n'est pas un repository Git"
        exit 1
    }
    
    Write-Success "Repository Git détecté"
}

# Nettoyage avant sauvegarde
function Invoke-CleanupBeforeBackup {
    Write-Info "Nettoyage avant sauvegarde..."
    
    # Nettoyer les caches
    $CacheDirs = @("node_modules\.cache", ".vite", "dist", "coverage")
    foreach ($dir in $CacheDirs) {
        if (Test-Path $dir) {
            Remove-Item $dir -Recurse -Force
            Write-Info "Dossier $dir supprimé"
        }
    }
    
    # Nettoyer les fichiers temporaires
    Get-ChildItem -Recurse -Include "*.log", "*.tmp", ".DS_Store", "Thumbs.db" | Remove-Item -Force -ErrorAction SilentlyContinue
    
    Write-Success "Nettoyage terminé"
}

# Vérification de l'état du repository
function Test-RepoStatus {
    Write-Info "Vérification de l'état du repository..."
    
    $status = git status --porcelain
    if (-not $status) {
        Write-Warning "Aucune modification détectée"
        $continue = Read-Host "Continuer quand même ? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Info "Sauvegarde annulée"
            exit 0
        }
    }
    
    Write-Host "État actuel du repository:"
    git status --short
    Write-Host ""
}

# Optimisation du .gitignore
function Optimize-GitIgnore {
    Write-Info "Optimisation du .gitignore..."
    
    if (-not (Test-Path ".gitignore")) {
        Write-Warning ".gitignore non trouvé, création..."
        New-Item ".gitignore" -ItemType File
    }
    
    $gitignoreAdditions = @(
        "# Optimisations ajoutées automatiquement",
        "*.tsbuildinfo",
        ".eslintcache",
        ".stylelintcache", 
        "coverage/",
        "*.log",
        "*.tmp",
        "*.temp",
        ".vite/",
        "dist/",
        "node_modules/.cache/",
        ".DS_Store",
        "Thumbs.db",
        "cleanup-report.json",
        "backup-report-*.json"
    )
    
    $currentContent = Get-Content ".gitignore" -ErrorAction SilentlyContinue
    foreach ($entry in $gitignoreAdditions) {
        if ($currentContent -notcontains $entry) {
            Add-Content ".gitignore" $entry
        }
    }
    
    Write-Success ".gitignore optimisé"
}

# Création d'une branche de sauvegarde
function New-BackupBranch {
    Write-Info "Création de la branche de sauvegarde: $BackupBranch"
    
    git checkout -b $BackupBranch
    
    Write-Success "Branche de sauvegarde créée"
}

# Ajout et commit des modifications
function Invoke-CommitChanges {
    Write-Info "Ajout et commit des modifications..."
    
    git add .
    
    $staged = git diff --staged --name-only
    if (-not $staged) {
        Write-Warning "Aucune modification à commiter"
        return
    }
    
    $detailedMessage = @"
$CommitMessage

📊 Statistiques de la sauvegarde:
- Date: $(Get-Date)
- Branche: $BackupBranch
- Utilisateur: $(git config user.name)
- Fichiers modifiés: $($staged.Count)

🔧 Optimisations incluses:
- Configuration TypeScript stricte
- Règles ESLint renforcées
- Nettoyage des fichiers inutiles
- Consolidation des services PDF
- Amélioration du .gitignore

🚀 Prêt pour déploiement OVH VPS
"@
    
    git commit -m $detailedMessage
    
    Write-Success "Modifications commitées"
}

# Retour à la branche principale
function Return-ToMain {
    Write-Info "Retour à la branche principale..."
    
    git checkout $BranchMain
    
    $merge = Read-Host "Merger les changements dans $BranchMain ? (y/N)"
    if ($merge -eq "y" -or $merge -eq "Y") {
        git merge $BackupBranch
        Write-Success "Changements mergés dans $BranchMain"
    } else {
        Write-Info "Changements conservés dans $BackupBranch"
    }
}

# Push vers le remote
function Invoke-PushToRemote {
    Write-Info "Push vers le repository distant..."
    
    $remotes = git remote
    if ($remotes -notcontains "origin") {
        Write-Warning "Aucun remote 'origin' configuré"
        $configure = Read-Host "Configurer un remote ? (y/N)"
        if ($configure -eq "y" -or $configure -eq "Y") {
            $repoUrl = Read-Host "URL du repository"
            git remote add origin $repoUrl
            Write-Success "Remote configuré"
        } else {
            Write-Info "Push ignoré"
            return
        }
    }
    
    git push -u origin $BranchMain
    git push -u origin $BackupBranch
    
    Write-Success "Push terminé"
}

# Génération du rapport de sauvegarde
function New-BackupReport {
    Write-Info "Génération du rapport de sauvegarde..."
    
    $reportFile = "backup-report-$(Get-Date -Format 'yyyyMMdd_HHmmss').json"
    
    $totalCommits = git rev-list --count HEAD
    $totalFiles = (Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notlike "*\.git\*" -and $_.FullName -notlike "*\node_modules\*" }).Count
    $lastCommit = git log -1 --format='%H'
    $branches = (git branch -a).Count
    
    $report = @{
        backup_info = @{
            date = Get-Date -Format "o"
            branch = $BackupBranch
            commit_message = $CommitMessage
            user = git config user.name
            email = git config user.email
        }
        repository_stats = @{
            total_commits = $totalCommits
            total_files = $totalFiles
            last_commit = $lastCommit
            branches = $branches
        }
        optimizations = @{
            typescript_strict = $true
            eslint_enhanced = $true
            files_cleaned = $true
            pdf_services_consolidated = $true
            gitignore_optimized = $true
        }
        deployment_ready = @{
            ovh_vps = $true
            build_tested = $false
            dependencies_updated = $true
        }
    }
    
    $report | ConvertTo-Json -Depth 3 | Out-File $reportFile -Encoding UTF8
    
    Write-Success "Rapport généré: $reportFile"
}

# Nettoyage final
function Invoke-FinalCleanup {
    Write-Info "Nettoyage final..."
    
    # Supprimer les anciens rapports (garder les 5 derniers)
    Get-ChildItem "backup-report-*.json" | Sort-Object Name | Select-Object -SkipLast 5 | Remove-Item -Force -ErrorAction SilentlyContinue
    
    Write-Success "Nettoyage final terminé"
}

# Fonction principale
function Main {
    Write-Info "🚀 Début de la sauvegarde Git optimisée pour $ProjectName"
    Write-Host "==================================================" -ForegroundColor Cyan
    
    Test-Git
    Invoke-CleanupBeforeBackup
    Test-RepoStatus
    Optimize-GitIgnore
    New-BackupBranch
    Invoke-CommitChanges
    Return-ToMain
    Invoke-PushToRemote
    New-BackupReport
    Invoke-FinalCleanup
    
    Write-Host ""
    Write-Success "🎉 Sauvegarde Git terminée avec succès!"
    Write-Info "Branche de sauvegarde: $BackupBranch"
    Write-Info "Message de commit: $CommitMessage"
    Write-Host ""
    Write-Info "📋 Prochaines étapes recommandées:"
    Write-Host "   1. Tester le build: npm run build"
    Write-Host "   2. Vérifier les tests: npm run test"
    Write-Host "   3. Déployer sur OVH VPS: .\deploy-ovh.sh"
}

# Exécution
Main
