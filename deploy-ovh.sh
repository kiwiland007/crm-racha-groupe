#!/bin/bash

# Script de déploiement pour OVH - Racha Business CRM
# Usage: ./deploy-ovh.sh

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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
    echo -e "${BLUE}"
    echo "=================================================="
    echo "    DÉPLOIEMENT RACHA BUSINESS CRM SUR OVH"
    echo "=================================================="
    echo -e "${NC}"
}

# Vérifications préalables
check_requirements() {
    print_status "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier la version de Node
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ requis (version actuelle: $(node --version))"
        exit 1
    fi
    
    print_success "Prérequis validés"
}

# Nettoyage avant build
clean_project() {
    print_status "Nettoyage du projet..."
    
    # Supprimer les anciens builds
    rm -rf dist/
    rm -rf node_modules/.cache/
    rm -rf .vite/
    
    print_success "Projet nettoyé"
}

# Installation des dépendances
install_dependencies() {
    print_status "Installation des dépendances..."
    
    # Installer les dépendances
    npm ci --only=production
    
    print_success "Dépendances installées"
}

# Build de production
build_project() {
    print_status "Build de production en cours..."
    
    # Variables d'environnement pour la production
    export NODE_ENV=production
    export VITE_APP_ENV=production
    
    # Build
    npm run build
    
    if [ ! -d "dist" ]; then
        print_error "Le build a échoué - dossier dist non créé"
        exit 1
    fi
    
    print_success "Build terminé avec succès"
}

# Optimisation des assets
optimize_assets() {
    print_status "Optimisation des assets..."
    
    # Copier le .htaccess
    if [ -f "public/.htaccess" ]; then
        cp public/.htaccess dist/
        print_success ".htaccess copié"
    fi
    
    # Vérifier la taille du build
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    print_success "Taille du build: $BUILD_SIZE"
    
    # Lister les fichiers principaux
    print_status "Fichiers générés:"
    ls -la dist/assets/ | head -10
}

# Validation du build
validate_build() {
    print_status "Validation du build..."
    
    # Vérifier les fichiers essentiels
    if [ ! -f "dist/index.html" ]; then
        print_error "index.html manquant"
        exit 1
    fi
    
    if [ ! -d "dist/assets" ]; then
        print_error "Dossier assets manquant"
        exit 1
    fi
    
    # Compter les fichiers
    FILE_COUNT=$(find dist/ -type f | wc -l)
    print_success "Build validé ($FILE_COUNT fichiers)"
}

# Instructions de déploiement
show_deployment_instructions() {
    print_status "Instructions de déploiement OVH:"
    echo ""
    echo -e "${YELLOW}1. Connectez-vous à votre espace client OVH${NC}"
    echo -e "${YELLOW}2. Accédez à votre hébergement web${NC}"
    echo -e "${YELLOW}3. Utilisez le gestionnaire de fichiers ou FTP${NC}"
    echo -e "${YELLOW}4. Uploadez tout le contenu du dossier 'dist/' vers le dossier 'www/' de votre hébergement${NC}"
    echo -e "${YELLOW}5. Assurez-vous que le fichier .htaccess est bien présent${NC}"
    echo ""
    echo -e "${GREEN}Commandes FTP alternatives:${NC}"
    echo "rsync -avz --delete dist/ user@your-domain.com:www/"
    echo "ou"
    echo "scp -r dist/* user@your-domain.com:www/"
    echo ""
    echo -e "${BLUE}Fichiers à uploader:${NC}"
    echo "- Tout le contenu du dossier dist/"
    echo "- Le fichier .htaccess (pour la configuration Apache)"
    echo ""
    echo -e "${GREEN}URL de votre application:${NC}"
    echo "https://votre-domaine.com"
}

# Fonction principale
main() {
    print_header
    
    # Vérifications
    check_requirements
    
    # Nettoyage
    clean_project
    
    # Installation
    install_dependencies
    
    # Build
    build_project
    
    # Optimisation
    optimize_assets
    
    # Validation
    validate_build
    
    # Instructions
    show_deployment_instructions
    
    print_success "Déploiement préparé avec succès!"
    print_status "Le dossier 'dist/' contient tous les fichiers à uploader sur OVH"
}

# Exécution
main "$@"
