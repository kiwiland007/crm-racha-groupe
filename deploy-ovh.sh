#!/bin/bash

# Script de déploiement OVH VPS pour Racha Business Digital CRM
# Usage: ./deploy-ovh.sh [production|staging]

set -e

# Configuration
PROJECT_NAME="maroctactile-crm-hub"
BUILD_DIR="dist"
REMOTE_USER="root"  # ou votre utilisateur
REMOTE_HOST="votre-ip-ovh.ovh"  # Remplacer par l'IP de votre VPS
REMOTE_PATH="/var/www/html"  # Chemin sur le serveur
BACKUP_DIR="/var/backups/crm"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier rsync
    if ! command -v rsync &> /dev/null; then
        log_error "rsync n'est pas installé"
        exit 1
    fi
    
    log_success "Prérequis vérifiés"
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    npm ci --only=production
    log_success "Dépendances installées"
}

# Build de l'application
build_application() {
    log_info "Build de l'application pour la production..."
    
    # Nettoyer le dossier de build précédent
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        log_info "Ancien build supprimé"
    fi
    
    # Copier le fichier d'environnement OVH
    if [ -f ".env.ovh" ]; then
        cp .env.ovh .env.production
        log_info "Configuration OVH copiée"
    fi
    
    # Build
    npm run build
    
    if [ ! -d "$BUILD_DIR" ]; then
        log_error "Le build a échoué - dossier $BUILD_DIR non trouvé"
        exit 1
    fi
    
    log_success "Build terminé avec succès"
}

# Test du build
test_build() {
    log_info "Test du build..."
    
    # Vérifier que les fichiers essentiels existent
    if [ ! -f "$BUILD_DIR/index.html" ]; then
        log_error "index.html manquant dans le build"
        exit 1
    fi
    
    # Vérifier la taille du build
    BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
    log_info "Taille du build: $BUILD_SIZE"
    
    log_success "Build testé avec succès"
}

# Sauvegarde sur le serveur
backup_remote() {
    log_info "Sauvegarde de la version actuelle sur le serveur..."
    
    ssh "$REMOTE_USER@$REMOTE_HOST" "
        if [ -d '$REMOTE_PATH' ]; then
            mkdir -p '$BACKUP_DIR'
            BACKUP_NAME=\$(date +%Y%m%d_%H%M%S)
            cp -r '$REMOTE_PATH' '$BACKUP_DIR/backup_\$BACKUP_NAME'
            echo 'Sauvegarde créée: backup_\$BACKUP_NAME'
        fi
    "
    
    log_success "Sauvegarde terminée"
}

# Déploiement sur le serveur
deploy_to_server() {
    log_info "Déploiement sur le serveur OVH..."
    
    # Créer le dossier de destination si nécessaire
    ssh "$REMOTE_USER@$REMOTE_HOST" "mkdir -p '$REMOTE_PATH'"
    
    # Synchroniser les fichiers
    rsync -avz --delete \
        --exclude='.git' \
        --exclude='node_modules' \
        --exclude='.env*' \
        "$BUILD_DIR/" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"
    
    log_success "Fichiers déployés"
}

# Configuration du serveur web
configure_server() {
    log_info "Configuration du serveur web..."
    
    # Créer la configuration Nginx si nécessaire
    ssh "$REMOTE_USER@$REMOTE_HOST" "
        # Vérifier si Nginx est installé
        if command -v nginx &> /dev/null; then
            echo 'Nginx détecté'
            
            # Créer la configuration du site
            cat > /etc/nginx/sites-available/$PROJECT_NAME << 'EOF'
server {
    listen 80;
    server_name votre-domaine.ovh www.votre-domaine.ovh;
    root $REMOTE_PATH;
    index index.html;

    # Gestion des routes SPA
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache pour les assets statiques
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }

    # Sécurité
    add_header X-Frame-Options \"SAMEORIGIN\" always;
    add_header X-Content-Type-Options \"nosniff\" always;
    add_header X-XSS-Protection \"1; mode=block\" always;

    # Compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOF
            
            # Activer le site
            ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
            
            # Tester la configuration
            nginx -t && systemctl reload nginx
            
            echo 'Configuration Nginx mise à jour'
        else
            echo 'Nginx non détecté - configuration manuelle requise'
        fi
    "
    
    log_success "Configuration serveur terminée"
}

# Vérification post-déploiement
verify_deployment() {
    log_info "Vérification du déploiement..."
    
    # Vérifier que le site répond
    if command -v curl &> /dev/null; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://$REMOTE_HOST" || echo "000")
        if [ "$HTTP_CODE" = "200" ]; then
            log_success "Site accessible (HTTP $HTTP_CODE)"
        else
            log_warning "Site non accessible (HTTP $HTTP_CODE)"
        fi
    fi
    
    log_success "Déploiement vérifié"
}

# Nettoyage
cleanup() {
    log_info "Nettoyage..."
    
    # Supprimer le fichier d'environnement temporaire
    if [ -f ".env.production" ]; then
        rm .env.production
    fi
    
    log_success "Nettoyage terminé"
}

# Fonction principale
main() {
    log_info "🚀 Début du déploiement OVH VPS pour $PROJECT_NAME"
    
    check_prerequisites
    install_dependencies
    build_application
    test_build
    backup_remote
    deploy_to_server
    configure_server
    verify_deployment
    cleanup
    
    log_success "🎉 Déploiement terminé avec succès!"
    log_info "Votre CRM est maintenant accessible sur: http://$REMOTE_HOST"
    log_warning "N'oubliez pas de configurer SSL/HTTPS avec Let's Encrypt"
}

# Exécution
main "$@"
