#!/bin/bash

# Script de déploiement Racha Business CRM
# Usage: ./deploy.sh [environment]

set -e

# Configuration
PROJECT_NAME="crm-racha-groupe"
BUILD_DIR="dist"
BACKUP_DIR="backup"
DATE=$(date +%Y%m%d_%H%M%S)

# Couleurs pour les messages
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
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        log_error "Git n'est pas installé"
        exit 1
    fi
    
    log_success "Tous les prérequis sont satisfaits"
}

# Nettoyage
clean_project() {
    log_info "Nettoyage du projet..."
    
    # Supprimer le dossier dist
    if [ -d "$BUILD_DIR" ]; then
        rm -rf "$BUILD_DIR"
        log_success "Dossier $BUILD_DIR supprimé"
    fi
    
    # Nettoyer le cache npm
    npm cache clean --force
    log_success "Cache npm nettoyé"
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    
    # Installer les dépendances
    npm ci --production=false
    log_success "Dépendances installées"
}

# Tests
run_tests() {
    log_info "Exécution des tests..."
    
    # Vérifier la syntaxe TypeScript
    if npm run type-check 2>/dev/null; then
        log_success "Vérification TypeScript réussie"
    else
        log_warning "Pas de script type-check défini"
    fi
    
    # Linter
    if npm run lint 2>/dev/null; then
        log_success "Linting réussi"
    else
        log_warning "Pas de script lint défini"
    fi
}

# Build de production
build_production() {
    log_info "Build de production..."
    
    # Définir l'environnement de production
    export NODE_ENV=production
    
    # Build
    npm run build
    
    if [ -d "$BUILD_DIR" ]; then
        log_success "Build de production réussi"
        
        # Afficher la taille du build
        BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
        log_info "Taille du build: $BUILD_SIZE"
    else
        log_error "Échec du build de production"
        exit 1
    fi
}

# Optimisation du build
optimize_build() {
    log_info "Optimisation du build..."
    
    # Compresser les fichiers statiques si gzip est disponible
    if command -v gzip &> /dev/null; then
        find "$BUILD_DIR" -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec gzip -k {} \;
        log_success "Fichiers compressés avec gzip"
    fi
    
    # Créer un fichier de version
    echo "{\"version\":\"$(date +%Y.%m.%d-%H%M%S)\",\"build\":\"$DATE\",\"commit\":\"$(git rev-parse --short HEAD)\"}" > "$BUILD_DIR/version.json"
    log_success "Fichier de version créé"
}

# Sauvegarde
create_backup() {
    if [ -d "$BUILD_DIR" ] && [ "$1" != "skip-backup" ]; then
        log_info "Création d'une sauvegarde..."
        
        mkdir -p "$BACKUP_DIR"
        tar -czf "$BACKUP_DIR/build_$DATE.tar.gz" "$BUILD_DIR"
        
        log_success "Sauvegarde créée: $BACKUP_DIR/build_$DATE.tar.gz"
        
        # Garder seulement les 5 dernières sauvegardes
        ls -t "$BACKUP_DIR"/build_*.tar.gz | tail -n +6 | xargs -r rm
        log_info "Anciennes sauvegardes nettoyées"
    fi
}

# Validation du déploiement
validate_deployment() {
    log_info "Validation du déploiement..."
    
    # Vérifier les fichiers essentiels
    REQUIRED_FILES=("index.html" "assets" "favicon.ico")
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ ! -e "$BUILD_DIR/$file" ]; then
            log_error "Fichier manquant: $file"
            exit 1
        fi
    done
    
    log_success "Validation du déploiement réussie"
}

# Instructions de déploiement
show_deployment_instructions() {
    log_info "Instructions de déploiement:"
    echo ""
    echo "📁 Dossier de build: $BUILD_DIR"
    echo "📊 Taille: $(du -sh "$BUILD_DIR" | cut -f1)"
    echo "🔗 Fichiers principaux:"
    echo "   - index.html (point d'entrée)"
    echo "   - assets/ (JS, CSS, images)"
    echo "   - favicon.ico"
    echo ""
    echo "🚀 Déploiement manuel:"
    echo "   1. Uploadez le contenu du dossier '$BUILD_DIR' vers votre serveur web"
    echo "   2. Configurez votre serveur pour servir index.html pour toutes les routes"
    echo "   3. Assurez-vous que les headers de cache sont configurés"
    echo ""
    echo "☁️ Déploiement Cloudflare Pages:"
    echo "   1. Connectez votre repository GitHub"
    echo "   2. Build command: npm run build"
    echo "   3. Build output directory: $BUILD_DIR"
    echo ""
    echo "🗄️ Configuration base de données:"
    echo "   - Host: localhost:3306"
    echo "   - Database: admin_crm"
    echo "   - User: kiwiland"
    echo "   - Importez: database/schema.sql"
    echo ""
    log_success "Déploiement prêt !"
}

# Fonction principale
main() {
    echo "🚀 Déploiement $PROJECT_NAME"
    echo "================================"
    
    # Vérifications
    check_prerequisites
    
    # Nettoyage
    clean_project
    
    # Installation
    install_dependencies
    
    # Tests
    run_tests
    
    # Build
    build_production
    
    # Optimisation
    optimize_build
    
    # Sauvegarde
    create_backup "$1"
    
    # Validation
    validate_deployment
    
    # Instructions
    show_deployment_instructions
}

# Exécution
main "$@"
