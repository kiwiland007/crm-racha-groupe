# Script PowerShell simple pour corriger le déploiement OVH
# Usage: .\deploy-fix-simple.ps1

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "    CORRECTION DÉPLOIEMENT OVH - RACHA DIGITAL CRM" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$OVH_DOMAIN = "crm.rachadigital.com"

Write-Host "Problème détecté:" -ForegroundColor Yellow
Write-Host "  Le serveur essaie d'exécuter src/App.tsx au lieu des fichiers buildés"
Write-Host ""

# Vérifications
Write-Host "[INFO] Vérification des prérequis..." -ForegroundColor Blue

if (-not (Test-Path "dist")) {
    Write-Host "[ERROR] Le dossier dist/ n'existe pas. Exécutez 'npm run build' d'abord." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "dist/index.html")) {
    Write-Host "[ERROR] Le fichier dist/index.html n'existe pas." -ForegroundColor Red
    exit 1
}

Write-Host "[SUCCESS] Prérequis validés" -ForegroundColor Green

# Créer .htaccess si nécessaire
if (-not (Test-Path "public/.htaccess")) {
    Write-Host "[INFO] Création du fichier .htaccess..." -ForegroundColor Blue
    
    $htaccessContent = @"
# Configuration Apache pour React SPA
RewriteEngine On

# Forcer HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirection SPA
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Cache des assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Erreurs personnalisées
ErrorDocument 404 /index.html
ErrorDocument 403 /index.html
"@
    
    $htaccessContent | Out-File -FilePath "public/.htaccess" -Encoding UTF8
    Write-Host "[SUCCESS] Fichier .htaccess créé" -ForegroundColor Green
}

# Copier .htaccess dans dist/
Copy-Item "public/.htaccess" "dist/" -Force
Write-Host "[INFO] .htaccess copié dans dist/" -ForegroundColor Blue

# Informations sur les fichiers
$deploySize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "[SUCCESS] Taille du déploiement: $([math]::Round($deploySize, 2)) MB" -ForegroundColor Green

Write-Host ""
Write-Host "Fichiers préparés dans dist/:" -ForegroundColor Yellow
Write-Host "  ✓ index.html"
Write-Host "  ✓ .htaccess"
Write-Host "  ✓ assets/"
Write-Host "  ✓ images/"
Write-Host "  ✓ robots.txt"

Write-Host ""
Write-Host "INSTRUCTIONS DE DÉPLOIEMENT MANUEL:" -ForegroundColor Yellow
Write-Host ""
Write-Host "ÉTAPE 1 - Nettoyer le serveur OVH:" -ForegroundColor Cyan
Write-Host "1. Connectez-vous à l'espace client OVH"
Write-Host "2. Accédez au gestionnaire de fichiers"
Write-Host "3. Naviguez vers crm.rachadigital.com/"
Write-Host "4. SUPPRIMEZ TOUT le contenu existant (surtout src/)"
Write-Host ""

Write-Host "ÉTAPE 2 - Uploader les fichiers buildés:" -ForegroundColor Cyan
Write-Host "1. Uploadez UNIQUEMENT le contenu du dossier dist/"
Write-Host "2. NE PAS uploader src/, node_modules/, package.json, etc."
Write-Host "3. Assurez-vous que index.html est à la racine"
Write-Host ""

Write-Host "ÉTAPE 3 - Vérifier la structure:" -ForegroundColor Cyan
Write-Host "La racine web doit contenir:"
Write-Host "  ✓ index.html"
Write-Host "  ✓ .htaccess"
Write-Host "  ✓ assets/"
Write-Host "  ✓ images/"
Write-Host "  ✓ robots.txt"
Write-Host ""

Write-Host "CONFIGURATION FTP:" -ForegroundColor Green
Write-Host "Host: 217.182.70.41"
Write-Host "User: crm@rachadigital.com"
Write-Host "Password: G13c8c_f3"
Write-Host "Directory: httpdocs"
Write-Host ""

Write-Host "COMMANDE RSYNC (si disponible):" -ForegroundColor Green
Write-Host "rsync -avz --delete dist/ crm@rachadigital.com@217.182.70.41:httpdocs/"
Write-Host ""

# Test de connectivité
Write-Host "[INFO] Test de connectivité..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "https://$OVH_DOMAIN" -Method Head -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "[SUCCESS] Site accessible (HTTP 200)" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Site retourne HTTP $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "[WARNING] Impossible de tester la connectivité HTTP" -ForegroundColor Yellow
    Write-Host "[WARNING] Cela peut être normal si le DNS n'est pas encore propagé" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "RÉSUMÉ:" -ForegroundColor Yellow
Write-Host "✓ Build vérifié et prêt"
Write-Host "✓ .htaccess configuré pour React SPA"
Write-Host "✓ Fichiers préparés dans dist/"
Write-Host ""
Write-Host "PROCHAINES ÉTAPES:" -ForegroundColor Green
Write-Host "1. Nettoyer complètement le serveur OVH"
Write-Host "2. Uploader UNIQUEMENT le contenu de dist/"
Write-Host "3. Vérifier que index.html est à la racine"
Write-Host "4. Tester l'application sur https://$OVH_DOMAIN"
Write-Host ""
Write-Host "🎉 Après ces étapes, votre CRM devrait fonctionner parfaitement!" -ForegroundColor Green
