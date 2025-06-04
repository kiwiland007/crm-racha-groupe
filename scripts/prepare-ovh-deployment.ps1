# 🚀 Script de Préparation Déploiement OVH - Racha Business CRM
# PowerShell Script pour Windows

Write-Host "🚀 Préparation du déploiement OVH - Racha Business CRM" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Variables
$ProjectName = "racha-business-crm"
$BuildDir = "dist"
$OutputDir = "ovh-deployment"
$ArchiveName = "racha-crm-production.zip"

# Étape 1: Vérification des prérequis
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow

if (!(Test-Path $BuildDir)) {
    Write-Host "❌ Dossier 'dist' non trouvé. Lancement du build..." -ForegroundColor Red
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors du build. Arrêt du script." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dossier 'dist' trouvé" -ForegroundColor Green
}

# Étape 2: Création du dossier de déploiement
Write-Host "📁 Création du dossier de déploiement..." -ForegroundColor Yellow

if (Test-Path $OutputDir) {
    Remove-Item -Recurse -Force $OutputDir
}
New-Item -ItemType Directory -Path $OutputDir | Out-Null

# Étape 3: Copie des fichiers de production
Write-Host "📦 Copie des fichiers de production..." -ForegroundColor Yellow

# Copier le contenu du dossier dist
Copy-Item -Recurse -Path "$BuildDir\*" -Destination $OutputDir

# Copier les fichiers de configuration
Copy-Item -Path "INSTALLATION_OVH.md" -Destination $OutputDir -ErrorAction SilentlyContinue
Copy-Item -Path "README.md" -Destination $OutputDir -ErrorAction SilentlyContinue
Copy-Item -Path "package.json" -Destination $OutputDir -ErrorAction SilentlyContinue

Write-Host "✅ Fichiers copiés avec succès" -ForegroundColor Green

# Étape 4: Création de l'archive
Write-Host "🗜️ Création de l'archive de déploiement..." -ForegroundColor Yellow

if (Test-Path $ArchiveName) {
    Remove-Item $ArchiveName
}

# Utiliser PowerShell pour créer l'archive
Compress-Archive -Path "$OutputDir\*" -DestinationPath $ArchiveName -CompressionLevel Optimal

Write-Host "✅ Archive créée: $ArchiveName" -ForegroundColor Green

# Étape 5: Génération des informations de déploiement
Write-Host "📊 Génération des informations de déploiement..." -ForegroundColor Yellow

$DeployInfo = @"
# 🚀 Informations de Déploiement - Racha Business CRM

## 📦 Archive de Production
- **Fichier**: $ArchiveName
- **Date**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
- **Taille**: $([math]::Round((Get-Item $ArchiveName).Length / 1MB, 2)) MB

## 📁 Contenu de l'Archive
- Fichiers de production (HTML, CSS, JS)
- Assets (logos, images, favicon)
- Guide d'installation OVH
- Documentation

## 🔧 Commandes de Déploiement OVH

### Upload via SCP
``````bash
# Upload de l'archive
scp $ArchiveName root@VOTRE_IP_VPS:/tmp/

# Sur le serveur OVH
ssh root@VOTRE_IP_VPS
cd /tmp
unzip $ArchiveName
sudo cp -r * /var/www/racha-crm/
sudo chown -R www-data:www-data /var/www/racha-crm
sudo systemctl reload nginx
``````

### Upload via SFTP
1. Ouvrir FileZilla/WinSCP
2. Se connecter au serveur OVH
3. Naviguer vers /var/www/racha-crm/
4. Extraire et uploader le contenu de l'archive

## 🌐 Après Déploiement
- Tester: https://crm.rachabusiness.com
- Vérifier les logs: sudo tail -f /var/log/nginx/racha-crm.access.log
- Monitoring: htop

## 📞 Support
- Documentation: INSTALLATION_OVH.md
- Logs serveur: /var/log/nginx/
- Configuration: /etc/nginx/sites-available/racha-crm
"@

$DeployInfo | Out-File -FilePath "$OutputDir\DEPLOY_INFO.md" -Encoding UTF8

Write-Host "✅ Informations de déploiement générées" -ForegroundColor Green

# Étape 6: Affichage du résumé
Write-Host ""
Write-Host "🎉 PRÉPARATION TERMINÉE AVEC SUCCÈS !" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""
Write-Host "📦 Archive créée: $ArchiveName" -ForegroundColor Cyan
Write-Host "📁 Dossier: $OutputDir" -ForegroundColor Cyan
Write-Host "📊 Taille: $([math]::Round((Get-Item $ArchiveName).Length / 1MB, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host "1. Transférer $ArchiveName vers votre serveur OVH" -ForegroundColor White
Write-Host "2. Suivre le guide INSTALLATION_OVH.md" -ForegroundColor White
Write-Host "3. Configurer Nginx et SSL" -ForegroundColor White
Write-Host "4. Tester l'application en production" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation disponible dans: $OutputDir\INSTALLATION_OVH.md" -ForegroundColor Cyan
Write-Host ""

# Étape 7: Ouverture du dossier (optionnel)
$OpenFolder = Read-Host "Ouvrir le dossier de déploiement ? (o/n)"
if ($OpenFolder -eq "o" -or $OpenFolder -eq "O") {
    Invoke-Item $OutputDir
}

Write-Host "✅ Script terminé avec succès !" -ForegroundColor Green
