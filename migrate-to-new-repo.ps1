# Script PowerShell de migration vers le nouveau repository crm-racha-groupe
# Usage: .\migrate-to-new-repo.ps1

# Configuration
$NEW_REPO_NAME = "crm-racha-groupe"
$NEW_REPO_URL = "https://github.com/kiwiland007/crm-racha-groupe.git"
$GITHUB_USER = "kiwiland007"

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "    MIGRATION VERS NOUVEAU REPOSITORY" -ForegroundColor Cyan
Write-Host "    CRM RACHA GROUPE" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Repository source:" -ForegroundColor Yellow -NoNewline
Write-Host " racha-business-crm"
Write-Host "Repository cible:" -ForegroundColor Yellow -NoNewline
Write-Host " $NEW_REPO_NAME"
Write-Host "URL:" -ForegroundColor Yellow -NoNewline
Write-Host " $NEW_REPO_URL"
Write-Host ""

# Vérifications préalables
Write-Host "[INFO] Vérification des prérequis..." -ForegroundColor Blue

# Vérifier Git
try {
    git --version | Out-Null
} catch {
    Write-Host "[ERROR] Git n'est pas installé" -ForegroundColor Red
    exit 1
}

# Vérifier que nous sommes dans un repository Git
if (-not (Test-Path ".git")) {
    Write-Host "[ERROR] Ce n'est pas un repository Git" -ForegroundColor Red
    exit 1
}

# Vérifier l'état du repository
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "[WARNING] Il y a des changements non commitées" -ForegroundColor Yellow
    Write-Host "[INFO] Commit en cours..." -ForegroundColor Blue
    
    git add .
    git commit -m "feat: Préparation pour migration vers crm-racha-groupe

🔄 Migration préparée:
- Nom du projet: CRM Racha Groupe
- Repository cible: crm-racha-groupe
- Branding mis à jour: Racha Groupe
- Métadonnées actualisées

📝 Changements:
- README.md: Nouveau nom et URLs
- package.json: Nom du package mis à jour
- index.html: Titre et métadonnées
- Références: Racha Business Group → Racha Groupe

🎯 Prêt pour migration vers nouveau repository"
}

Write-Host "[SUCCESS] Prérequis validés" -ForegroundColor Green

# Instructions pour créer le nouveau repository
Write-Host ""
Write-Host "[INFO] Instructions pour créer le nouveau repository sur GitHub:" -ForegroundColor Blue
Write-Host ""
Write-Host "1. Aller sur GitHub:" -ForegroundColor Yellow
Write-Host "   https://github.com/new"
Write-Host ""
Write-Host "2. Paramètres du repository:" -ForegroundColor Yellow
Write-Host "   - Repository name: $NEW_REPO_NAME"
Write-Host "   - Description: 🏢 Système de gestion CRM professionnel pour Racha Groupe"
Write-Host "   - Visibility: Public (ou Private selon vos besoins)"
Write-Host "   - Initialize: ❌ NE PAS initialiser (pas de README, .gitignore, licence)"
Write-Host ""
Write-Host "3. Créer le repository" -ForegroundColor Yellow
Write-Host ""

Read-Host "Appuyez sur Entrée quand le repository est créé sur GitHub"

# Migration du code
Write-Host ""
Write-Host "[INFO] Migration du code vers le nouveau repository..." -ForegroundColor Blue

# Sauvegarder l'origine actuelle
$currentOrigin = git remote get-url origin
Write-Host "[INFO] Origin actuelle: $currentOrigin" -ForegroundColor Blue

# Changer l'origine vers le nouveau repository
Write-Host "[INFO] Changement de l'origine vers: $NEW_REPO_URL" -ForegroundColor Blue
git remote set-url origin $NEW_REPO_URL

# Vérifier la nouvelle origine
$newOrigin = git remote get-url origin
Write-Host "[SUCCESS] Nouvelle origine: $newOrigin" -ForegroundColor Green

# Push vers le nouveau repository
Write-Host "[INFO] Push vers le nouveau repository..." -ForegroundColor Blue
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Code migré avec succès vers $NEW_REPO_NAME" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Échec du push vers le nouveau repository" -ForegroundColor Red
    Write-Host "[INFO] Restauration de l'origine précédente..." -ForegroundColor Blue
    git remote set-url origin $currentOrigin
    exit 1
}

# Vérification post-migration
Write-Host ""
Write-Host "[INFO] Vérification de la migration..." -ForegroundColor Blue

# Vérifier que le repository est accessible
Write-Host "[INFO] Test d'accès au nouveau repository..." -ForegroundColor Blue
git ls-remote origin 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "[SUCCESS] Repository accessible" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Repository non accessible" -ForegroundColor Red
    exit 1
}

# Afficher les informations du repository
Write-Host "[INFO] Informations du nouveau repository:" -ForegroundColor Blue
Write-Host "  - URL: $NEW_REPO_URL"
Write-Host "  - Branche: main"
Write-Host "  - Derniers commits:"
git log --oneline -5

# Finalisation
Write-Host ""
Write-Host "[INFO] Finalisation de la migration..." -ForegroundColor Blue

# Mettre à jour les informations locales
git fetch origin
git branch --set-upstream-to=origin/main main

Write-Host "[SUCCESS] Migration finalisée" -ForegroundColor Green

# Informations finales
Write-Host ""
Write-Host "[SUCCESS] MIGRATION TERMINÉE AVEC SUCCÈS!" -ForegroundColor Green
Write-Host ""
Write-Host "Nouveau repository:" -ForegroundColor Yellow
Write-Host "  URL: $NEW_REPO_URL"
Write-Host "  Nom: $NEW_REPO_NAME"
Write-Host "  Branche: main"
Write-Host ""
Write-Host "Actions effectuées:" -ForegroundColor Yellow
Write-Host "  ✓ Code migré vers le nouveau repository"
Write-Host "  ✓ Branding mis à jour (Racha Groupe)"
Write-Host "  ✓ Métadonnées actualisées"
Write-Host "  ✓ Origin Git changée"
Write-Host "  ✓ Historique Git préservé"
Write-Host ""
Write-Host "Commandes utiles:" -ForegroundColor Green
Write-Host "  git remote -v                    # Vérifier les remotes"
Write-Host "  git log --oneline -10            # Voir l'historique"
Write-Host "  git push origin main             # Push vers le nouveau repo"
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Blue
Write-Host "  1. Vérifier le repository sur GitHub"
Write-Host "  2. Configurer les paramètres du repository"
Write-Host "  3. Ajouter une description et des topics"
Write-Host "  4. Configurer les branches de protection"
Write-Host "  5. Inviter des collaborateurs si nécessaire"
Write-Host ""
Write-Host "Repository accessible à:" -ForegroundColor Cyan
Write-Host "  https://github.com/$GITHUB_USER/$NEW_REPO_NAME"
