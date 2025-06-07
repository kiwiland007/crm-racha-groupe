#!/bin/bash

# Script de correction du déploiement OVH - Racha Digital CRM
# Usage: ./deploy-ovh-fix.sh

set -e

# Configuration OVH Racha Digital
OVH_HOST="217.182.70.41"
OVH_USER="crm@rachadigital.com"
OVH_PASSWORD="G13c8c_f3"
OVH_DOMAIN="crm.rachadigital.com"
OVH_REMOTE_DIR="httpdocs"  # Dossier web standard OVH

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonctions utilitaires
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${CYAN}"
    echo "========================================================"
    echo "    CORRECTION DÉPLOIEMENT OVH - RACHA DIGITAL CRM"
    echo "========================================================"
    echo -e "${NC}"
    echo -e "${YELLOW}Problème détecté:${NC}"
    echo "  Le serveur essaie d'exécuter src/App.tsx au lieu des fichiers buildés"
    echo ""
    echo -e "${YELLOW}Solution:${NC}"
    echo "  Déployer uniquement le contenu du dossier dist/"
    echo "  Configurer le serveur pour servir des fichiers statiques"
    echo ""
}

# Vérifications préalables
check_requirements() {
    print_status "Vérification des prérequis..."
    
    # Vérifier que le build existe
    if [ ! -d "dist" ]; then
        print_error "Le dossier dist/ n'existe pas. Exécutez 'npm run build' d'abord."
        exit 1
    fi
    
    # Vérifier index.html
    if [ ! -f "dist/index.html" ]; then
        print_error "Le fichier dist/index.html n'existe pas."
        exit 1
    fi
    
    # Vérifier .htaccess
    if [ ! -f "public/.htaccess" ]; then
        print_warning "Fichier .htaccess non trouvé, création automatique..."
        create_htaccess
    fi
    
    print_success "Prérequis validés"
}

# Créer un .htaccess optimisé pour OVH
create_htaccess() {
    print_status "Création du fichier .htaccess pour OVH..."
    
    cat > public/.htaccess << 'EOF'
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
EOF
    
    print_success "Fichier .htaccess créé"
}

# Préparer les fichiers pour le déploiement
prepare_deployment() {
    print_status "Préparation des fichiers pour le déploiement..."
    
    # Copier .htaccess dans dist/
    cp public/.htaccess dist/
    
    # Vérifier la taille du déploiement
    DEPLOY_SIZE=$(du -sh dist/ | cut -f1)
    print_success "Taille du déploiement: $DEPLOY_SIZE"
    
    # Lister les fichiers principaux
    print_status "Fichiers à déployer:"
    echo "  ✓ index.html"
    echo "  ✓ .htaccess"
    echo "  ✓ assets/ ($(ls dist/assets/ | wc -l) fichiers)"
    echo "  ✓ images/ ($(ls dist/images/ | wc -l) fichiers)"
    echo "  ✓ robots.txt"
    echo "  ✓ favicons"
}

# Nettoyage du serveur distant
clean_remote_directory() {
    print_status "Nettoyage du répertoire distant..."
    
    # Commandes de nettoyage via SSH
    ssh "$OVH_USER@$OVH_HOST" << EOF
        cd $OVH_REMOTE_DIR
        
        # Sauvegarder .htaccess existant si présent
        if [ -f .htaccess ]; then
            cp .htaccess .htaccess.backup
        fi
        
        # Supprimer les anciens fichiers (sauf .htaccess.backup)
        find . -maxdepth 1 -type f ! -name '.htaccess.backup' -delete
        find . -maxdepth 1 -type d ! -name '.' -exec rm -rf {} +
        
        echo "Répertoire nettoyé"
EOF
    
    if [ $? -eq 0 ]; then
        print_success "Répertoire distant nettoyé"
    else
        print_warning "Impossible de nettoyer le répertoire distant"
    fi
}

# Déploiement via rsync
deploy_with_rsync() {
    print_status "Déploiement via rsync..."
    
    # Commande rsync optimisée pour OVH
    rsync -avz --delete \
          --exclude='.htaccess.backup' \
          dist/ "$OVH_USER@$OVH_HOST:$OVH_REMOTE_DIR/"
    
    if [ $? -eq 0 ]; then
        print_success "Déploiement rsync réussi"
        return 0
    else
        print_error "Échec du déploiement rsync"
        return 1
    fi
}

# Vérification post-déploiement
verify_deployment() {
    print_status "Vérification du déploiement..."
    
    # Vérifier les fichiers sur le serveur
    print_status "Vérification des fichiers sur le serveur..."
    ssh "$OVH_USER@$OVH_HOST" << EOF
        cd $OVH_REMOTE_DIR
        
        echo "Fichiers présents:"
        ls -la
        
        echo ""
        echo "Taille du répertoire:"
        du -sh .
        
        echo ""
        echo "Vérification index.html:"
        if [ -f index.html ]; then
            echo "✓ index.html présent"
        else
            echo "✗ index.html manquant"
        fi
        
        echo ""
        echo "Vérification .htaccess:"
        if [ -f .htaccess ]; then
            echo "✓ .htaccess présent"
        else
            echo "✗ .htaccess manquant"
        fi
EOF
    
    # Test HTTP
    print_status "Test de connectivité HTTP..."
    if command -v curl &> /dev/null; then
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$OVH_DOMAIN" || echo "000")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            print_success "Site accessible (HTTP 200)"
        else
            print_warning "Site non accessible (HTTP $HTTP_STATUS)"
            print_warning "Cela peut être normal si le DNS n'est pas encore propagé"
        fi
    else
        print_warning "curl non installé, impossible de tester l'accès HTTP"
    fi
}

# Affichage des informations finales
show_final_info() {
    echo ""
    print_success "CORRECTION DU DÉPLOIEMENT TERMINÉE!"
    echo ""
    echo -e "${YELLOW}Informations importantes:${NC}"
    echo "  URL: https://$OVH_DOMAIN"
    echo "  Répertoire: $OVH_REMOTE_DIR"
    echo "  Type: Application React SPA (fichiers statiques)"
    echo ""
    echo -e "${YELLOW}Fichiers déployés:${NC}"
    echo "  ✓ index.html - Point d'entrée de l'application"
    echo "  ✓ .htaccess - Configuration Apache pour SPA"
    echo "  ✓ assets/ - Fichiers JavaScript et CSS buildés"
    echo "  ✓ images/ - Assets statiques"
    echo ""
    echo -e "${GREEN}Actions effectuées:${NC}"
    echo "  1. Build de production vérifié"
    echo "  2. Fichiers source (src/) exclus du déploiement"
    echo "  3. Seuls les fichiers buildés (dist/) déployés"
    echo "  4. Configuration Apache (.htaccess) optimisée"
    echo "  5. Redirection HTTPS activée"
    echo ""
    echo -e "${BLUE}Si le site ne fonctionne pas encore:${NC}"
    echo "  1. Attendez la propagation DNS (jusqu'à 24h)"
    echo "  2. Vérifiez la configuration du domaine dans l'espace client OVH"
    echo "  3. Assurez-vous que le certificat SSL est activé"
    echo ""
}

# Fonction principale
main() {
    print_header
    
    # Vérifications
    check_requirements
    
    # Préparation
    prepare_deployment
    
    # Nettoyage distant
    clean_remote_directory
    
    # Déploiement
    deploy_with_rsync
    
    # Vérification
    verify_deployment
    
    # Informations finales
    show_final_info
}

# Gestion des erreurs
trap 'echo ""; print_error "Déploiement interrompu"; exit 1' INT TERM

# Exécution
main "$@"
