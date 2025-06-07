#!/bin/bash

# Script de déploiement automatique OVH - Racha Digital CRM
# Usage: ./deploy-ovh-auto.sh

set -e

# Configuration OVH Racha Digital
OVH_HOST="217.182.70.41"
OVH_USER="crm@rachadigital.com"
OVH_PASSWORD="G13c8c_f3"
OVH_DOMAIN="crm.rachadigital.com"
OVH_REMOTE_DIR="www"

# Configuration base de données
DB_HOST="217.182.70.41"
DB_PORT="3306"
DB_NAME="admin_crm"
DB_USER="kiwiland"
DB_PASSWORD="8Z!ZHbm7uo9rjiv#"

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
    echo "    DÉPLOIEMENT AUTOMATIQUE OVH - RACHA DIGITAL CRM"
    echo "========================================================"
    echo -e "${NC}"
    echo -e "${YELLOW}Configuration:${NC}"
    echo "  Domain: $OVH_DOMAIN"
    echo "  Host: $OVH_HOST"
    echo "  User: $OVH_USER"
    echo "  Database: $DB_HOST:$DB_PORT/$DB_NAME"
    echo ""
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
    
    # Vérifier rsync ou scp
    if ! command -v rsync &> /dev/null && ! command -v scp &> /dev/null; then
        print_error "rsync ou scp requis pour le déploiement"
        exit 1
    fi
    
    print_success "Prérequis validés"
}

# Préparation de l'environnement
prepare_environment() {
    print_status "Préparation de l'environnement de production..."
    
    # Copier le fichier .env.production
    if [ -f ".env.production" ]; then
        cp .env.production .env
        print_success "Fichier .env.production copié"
    else
        print_warning "Fichier .env.production non trouvé, utilisation des valeurs par défaut"
    fi
    
    # Définir les variables d'environnement
    export NODE_ENV=production
    export VITE_APP_BASE_URL="https://$OVH_DOMAIN"
    export VITE_DB_HOST="$DB_HOST"
    export VITE_DB_PORT="$DB_PORT"
    export VITE_DB_NAME="$DB_NAME"
    export VITE_DB_USER="$DB_USER"
    export VITE_DB_PASSWORD="$DB_PASSWORD"
    
    print_success "Environnement configuré pour la production"
}

# Build de production
build_project() {
    print_status "Build de production en cours..."
    
    # Nettoyage
    rm -rf dist/
    rm -rf node_modules/.cache/
    
    # Installation des dépendances
    npm ci --only=production
    
    # Build
    npm run build
    
    if [ ! -d "dist" ]; then
        print_error "Le build a échoué - dossier dist non créé"
        exit 1
    fi
    
    # Vérifier la taille du build
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    print_success "Build terminé avec succès (Taille: $BUILD_SIZE)"
}

# Test de connexion à la base de données
test_database_connection() {
    print_status "Test de connexion à la base de données OVH..."
    
    if command -v mysql &> /dev/null; then
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT VERSION() as version, DATABASE() as current_db;" 2>/dev/null
        
        if [ $? -eq 0 ]; then
            print_success "Connexion à la base de données réussie"
        else
            print_warning "Impossible de tester la connexion à la base de données"
            print_warning "Vérifiez manuellement: mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME"
        fi
    else
        print_warning "MySQL client non installé, impossible de tester la connexion"
    fi
}

# Déploiement via rsync
deploy_with_rsync() {
    print_status "Déploiement via rsync..."
    
    # Commande rsync avec options optimisées
    rsync -avz --delete \
          --exclude='.git*' \
          --exclude='node_modules' \
          --exclude='src' \
          --exclude='*.md' \
          --exclude='package*.json' \
          --exclude='vite.config.ts' \
          --exclude='tsconfig*.json' \
          --exclude='.env*' \
          dist/ "$OVH_USER@$OVH_HOST:$OVH_REMOTE_DIR/"
    
    if [ $? -eq 0 ]; then
        print_success "Déploiement rsync réussi"
        return 0
    else
        print_error "Échec du déploiement rsync"
        return 1
    fi
}

# Déploiement via scp
deploy_with_scp() {
    print_status "Déploiement via scp..."
    
    # Créer une archive temporaire
    tar -czf temp_deploy.tar.gz -C dist .
    
    # Upload de l'archive
    scp temp_deploy.tar.gz "$OVH_USER@$OVH_HOST:~/"
    
    # Extraction sur le serveur
    ssh "$OVH_USER@$OVH_HOST" "cd $OVH_REMOTE_DIR && rm -rf * && tar -xzf ~/temp_deploy.tar.gz && rm ~/temp_deploy.tar.gz"
    
    # Nettoyage local
    rm temp_deploy.tar.gz
    
    if [ $? -eq 0 ]; then
        print_success "Déploiement scp réussi"
        return 0
    else
        print_error "Échec du déploiement scp"
        return 1
    fi
}

# Déploiement principal
deploy_to_ovh() {
    print_status "Déploiement vers OVH..."
    
    # Essayer rsync en premier
    if command -v rsync &> /dev/null; then
        if deploy_with_rsync; then
            return 0
        fi
    fi
    
    # Fallback vers scp
    if command -v scp &> /dev/null; then
        if deploy_with_scp; then
            return 0
        fi
    fi
    
    print_error "Tous les méthodes de déploiement ont échoué"
    exit 1
}

# Vérification post-déploiement
verify_deployment() {
    print_status "Vérification du déploiement..."
    
    # Test HTTP
    if command -v curl &> /dev/null; then
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$OVH_DOMAIN" || echo "000")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            print_success "Site accessible (HTTP 200)"
        else
            print_warning "Site non accessible (HTTP $HTTP_STATUS)"
        fi
    else
        print_warning "curl non installé, impossible de tester l'accès HTTP"
    fi
}

# Affichage des informations finales
show_final_info() {
    echo ""
    print_success "DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"
    echo ""
    echo -e "${YELLOW}Informations de déploiement:${NC}"
    echo "  URL: https://$OVH_DOMAIN"
    echo "  Host: $OVH_HOST"
    echo "  User: $OVH_USER"
    echo ""
    echo -e "${YELLOW}Base de données:${NC}"
    echo "  Host: $DB_HOST:$DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo ""
    echo -e "${GREEN}Prochaines étapes:${NC}"
    echo "  1. Vérifiez que le site fonctionne: https://$OVH_DOMAIN"
    echo "  2. Testez les fonctionnalités principales"
    echo "  3. Configurez les sauvegardes automatiques"
    echo "  4. Surveillez les logs d'erreur"
    echo ""
}

# Fonction principale
main() {
    print_header
    
    # Vérifications
    check_requirements
    
    # Préparation
    prepare_environment
    
    # Build
    build_project
    
    # Test base de données
    test_database_connection
    
    # Déploiement
    deploy_to_ovh
    
    # Vérification
    verify_deployment
    
    # Informations finales
    show_final_info
}

# Gestion des erreurs
trap 'echo ""; print_error "Déploiement interrompu"; exit 1' INT TERM

# Exécution
main "$@"
