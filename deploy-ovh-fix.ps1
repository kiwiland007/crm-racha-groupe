# Script PowerShell de correction du déploiement OVH - Racha Digital CRM
# Usage: .\deploy-ovh-fix.ps1

# Configuration OVH Racha Digital
$OVH_HOST = "217.182.70.41"
$OVH_USER = "crm@rachadigital.com"
$OVH_DOMAIN = "crm.rachadigital.com"
$OVH_REMOTE_DIR = "httpdocs"

# Fonctions utilitaires
function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Header {
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "    CORRECTION DÉPLOIEMENT OVH - RACHA DIGITAL CRM" -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Problème détecté:" -ForegroundColor Yellow
    Write-Host "  Le serveur essaie d'exécuter src/App.tsx au lieu des fichiers buildés"
    Write-Host ""
    Write-Host "Solution:" -ForegroundColor Yellow
    Write-Host "  Déployer uniquement le contenu du dossier dist/"
    Write-Host "  Configurer le serveur pour servir des fichiers statiques"
    Write-Host ""
}

# Vérifications préalables
function Test-Requirements {
    Write-Status "Vérification des prérequis..."
    
    # Vérifier que le build existe
    if (-not (Test-Path "dist")) {
        Write-Error "Le dossier dist/ n'existe pas. Exécutez 'npm run build' d'abord."
        exit 1
    }
    
    # Vérifier index.html
    if (-not (Test-Path "dist/index.html")) {
        Write-Error "Le fichier dist/index.html n'existe pas."
        exit 1
    }
    
    # Vérifier .htaccess
    if (-not (Test-Path "public/.htaccess")) {
        Write-Warning "Fichier .htaccess non trouvé, création automatique..."
        New-HtaccessFile
    }
    
    Write-Success "Prérequis validés"
}

# Créer un .htaccess optimisé pour OVH
function New-HtaccessFile {
    Write-Status "Création du fichier .htaccess pour OVH..."
    
    $htaccessContent = @"
# Configuration Apache pour Racha Business CRM sur OVH
# Application React SPA

# Activer la réécriture d'URL
RewriteEngine On

# Forcer HTTPS (recommandé pour OVH)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Gestion des routes React (SPA)
# Rediriger toutes les requêtes vers index.html sauf les fichiers existants
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Configuration du cache pour les assets statiques
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Cache des images (1 mois)
    ExpiresByType image/jpg "access plus 1 month"
    ExpiresByType image/jpeg "access plus 1 month"
    ExpiresByType image/gif "access plus 1 month"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType image/webp "access plus 1 month"
    ExpiresByType image/ico "access plus 1 month"
    
    # Cache des fichiers CSS et JS (1 semaine)
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
    ExpiresByType text/javascript "access plus 1 week"
    
    # Pas de cache pour HTML (pour les mises à jour)
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Configuration de la compression GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Sécurité - Headers de sécurité
<IfModule mod_headers.c>
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Bloquer l'accès aux fichiers sensibles
<Files ~ "^\.">
    Order allow,deny
    Deny from all
</Files>

# Configuration pour les erreurs personnalisées
ErrorDocument 404 /index.html
ErrorDocument 403 /index.html
"@
    
    $htaccessContent | Out-File -FilePath "public/.htaccess" -Encoding UTF8
    Write-Success "Fichier .htaccess créé"
}

# Préparer les fichiers pour le déploiement
function Initialize-Deployment {
    Write-Status "Préparation des fichiers pour le déploiement..."
    
    # Copier .htaccess dans dist/
    Copy-Item "public/.htaccess" "dist/"
    
    # Vérifier la taille du déploiement
    $deploySize = (Get-ChildItem "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Success "Taille du déploiement: $([math]::Round($deploySize, 2)) MB"
    
    # Lister les fichiers principaux
    Write-Status "Fichiers à déployer:"
    Write-Host "  ✓ index.html"
    Write-Host "  ✓ .htaccess"
    $assetsCount = (Get-ChildItem "dist/assets" -ErrorAction SilentlyContinue | Measure-Object).Count
    Write-Host "  ✓ assets/ ($assetsCount fichiers)"
    $imagesCount = (Get-ChildItem "dist/images" -ErrorAction SilentlyContinue | Measure-Object).Count
    Write-Host "  ✓ images/ ($imagesCount fichiers)"
    Write-Host "  ✓ robots.txt"
    Write-Host "  ✓ favicons"
}

# Instructions de déploiement manuel
function Show-DeploymentInstructions {
    Write-Status "Instructions de déploiement manuel:"
    Write-Host ""
    Write-Host "ÉTAPE 1 - Nettoyer le serveur OVH:" -ForegroundColor Yellow
    Write-Host "1. Connectez-vous à l'espace client OVH"
    Write-Host "2. Accédez au gestionnaire de fichiers"
    Write-Host "3. Naviguez vers crm.rachadigital.com/"
    Write-Host "4. SUPPRIMEZ TOUT le contenu existant (surtout src/)"
    Write-Host ""
    
    Write-Host "ÉTAPE 2 - Uploader les fichiers buildés:" -ForegroundColor Yellow
    Write-Host "1. Uploadez UNIQUEMENT le contenu du dossier dist/"
    Write-Host "2. NE PAS uploader src/, node_modules/, package.json, etc."
    Write-Host "3. Assurez-vous que index.html est à la racine"
    Write-Host ""
    
    Write-Host "ÉTAPE 3 - Vérifier la structure:" -ForegroundColor Yellow
    Write-Host "Racine web doit contenir:"
    Write-Host "  ✓ index.html"
    Write-Host "  ✓ .htaccess"
    Write-Host "  ✓ assets/"
    Write-Host "  ✓ images/"
    Write-Host "  ✓ robots.txt"
    Write-Host ""
    
    Write-Host "COMMANDES FTP ALTERNATIVES:" -ForegroundColor Green
    Write-Host "# Avec WinSCP ou FileZilla:"
    Write-Host "Host: $OVH_HOST"
    Write-Host "User: $OVH_USER"
    Write-Host "Directory: $OVH_REMOTE_DIR"
    Write-Host ""
    Write-Host "# Avec rsync (si disponible):"
    Write-Host "rsync -avz --delete dist/ ${OVH_USER}@${OVH_HOST}:${OVH_REMOTE_DIR}/"
    Write-Host ""
}

# Test de connectivité
function Test-Deployment {
    Write-Status "Test de connectivité..."
    
    try {
        $response = Invoke-WebRequest -Uri "https://$OVH_DOMAIN" -Method Head -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "Site accessible (HTTP 200)"
        } else {
            Write-Warning "Site retourne HTTP $($response.StatusCode)"
        }
    } catch {
        Write-Warning "Impossible de tester la connectivité HTTP"
        Write-Warning "Cela peut être normal si le DNS n'est pas encore propagé"
    }
}

# Affichage des informations finales
function Show-FinalInfo {
    Write-Host ""
    Write-Success "PRÉPARATION DE LA CORRECTION TERMINÉE!"
    Write-Host ""
    Write-Host "Informations importantes:" -ForegroundColor Yellow
    Write-Host "  URL: https://$OVH_DOMAIN"
    Write-Host "  Type: Application React SPA (fichiers statiques)"
    Write-Host ""
    Write-Host "Fichiers préparés dans dist/:" -ForegroundColor Yellow
    Write-Host "  ✓ index.html - Point d'entrée de l'application"
    Write-Host "  ✓ .htaccess - Configuration Apache pour SPA"
    Write-Host "  ✓ assets/ - Fichiers JavaScript et CSS buildés"
    Write-Host "  ✓ images/ - Assets statiques"
    Write-Host ""
    Write-Host "Actions à effectuer manuellement:" -ForegroundColor Green
    Write-Host "  1. Nettoyer complètement le serveur OVH"
    Write-Host "  2. Uploader UNIQUEMENT le contenu de dist/"
    Write-Host "  3. Vérifier que index.html est à la racine"
    Write-Host "  4. Tester l'application sur https://$OVH_DOMAIN"
    Write-Host ""
    Write-Host "Si le site ne fonctionne pas encore:" -ForegroundColor Blue
    Write-Host "  1. Attendez la propagation DNS (jusqu'à 24h)"
    Write-Host "  2. Vérifiez la configuration du domaine dans l'espace client OVH"
    Write-Host "  3. Assurez-vous que le certificat SSL est activé"
    Write-Host ""
}

# Fonction principale
function Main {
    Write-Header
    
    # Vérifications
    Test-Requirements
    
    # Préparation
    Initialize-Deployment
    
    # Instructions
    Show-DeploymentInstructions
    
    # Test (si possible)
    Test-Deployment
    
    # Informations finales
    Show-FinalInfo
}

# Gestion des erreurs
trap {
    Write-Host ""
    Write-Error "Script interrompu: $_"
    exit 1
}

# Exécution
Main
