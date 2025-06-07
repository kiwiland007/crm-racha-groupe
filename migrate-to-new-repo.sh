#!/bin/bash

# Script de migration vers le nouveau repository crm-racha-groupe
# Usage: ./migrate-to-new-repo.sh

set -e

# Configuration
NEW_REPO_NAME="crm-racha-groupe"
NEW_REPO_URL="https://github.com/kiwiland007/crm-racha-groupe.git"
GITHUB_USER="kiwiland007"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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
    echo "    MIGRATION VERS NOUVEAU REPOSITORY"
    echo "    CRM RACHA GROUPE"
    echo "========================================================"
    echo -e "${NC}"
    echo -e "${YELLOW}Repository source:${NC} racha-business-crm"
    echo -e "${YELLOW}Repository cible:${NC} $NEW_REPO_NAME"
    echo -e "${YELLOW}URL:${NC} $NEW_REPO_URL"
    echo ""
}

# Vérifications préalables
check_requirements() {
    print_status "Vérification des prérequis..."
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        print_error "Git n'est pas installé"
        exit 1
    fi
    
    # Vérifier que nous sommes dans un repository Git
    if [ ! -d ".git" ]; then
        print_error "Ce n'est pas un repository Git"
        exit 1
    fi
    
    # Vérifier l'état du repository
    if [ -n "$(git status --porcelain)" ]; then
        print_warning "Il y a des changements non commitées"
        print_status "Commit en cours..."
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
    fi
    
    print_success "Prérequis validés"
}

# Instructions pour créer le nouveau repository
show_github_instructions() {
    print_status "Instructions pour créer le nouveau repository sur GitHub:"
    echo ""
    echo -e "${YELLOW}1. Aller sur GitHub:${NC}"
    echo "   https://github.com/new"
    echo ""
    echo -e "${YELLOW}2. Paramètres du repository:${NC}"
    echo "   - Repository name: $NEW_REPO_NAME"
    echo "   - Description: 🏢 Système de gestion CRM professionnel pour Racha Groupe"
    echo "   - Visibility: Public (ou Private selon vos besoins)"
    echo "   - Initialize: ❌ NE PAS initialiser (pas de README, .gitignore, licence)"
    echo ""
    echo -e "${YELLOW}3. Créer le repository${NC}"
    echo ""
    read -p "Appuyez sur Entrée quand le repository est créé sur GitHub..."
}

# Migration du code
migrate_code() {
    print_status "Migration du code vers le nouveau repository..."
    
    # Sauvegarder l'origine actuelle
    CURRENT_ORIGIN=$(git remote get-url origin)
    print_status "Origin actuelle: $CURRENT_ORIGIN"
    
    # Changer l'origine vers le nouveau repository
    print_status "Changement de l'origine vers: $NEW_REPO_URL"
    git remote set-url origin "$NEW_REPO_URL"
    
    # Vérifier la nouvelle origine
    NEW_ORIGIN=$(git remote get-url origin)
    print_success "Nouvelle origine: $NEW_ORIGIN"
    
    # Push vers le nouveau repository
    print_status "Push vers le nouveau repository..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        print_success "Code migré avec succès vers $NEW_REPO_NAME"
    else
        print_error "Échec du push vers le nouveau repository"
        print_status "Restauration de l'origine précédente..."
        git remote set-url origin "$CURRENT_ORIGIN"
        exit 1
    fi
}

# Vérification post-migration
verify_migration() {
    print_status "Vérification de la migration..."
    
    # Vérifier que le repository est accessible
    print_status "Test d'accès au nouveau repository..."
    git ls-remote origin &> /dev/null
    
    if [ $? -eq 0 ]; then
        print_success "Repository accessible"
    else
        print_error "Repository non accessible"
        exit 1
    fi
    
    # Afficher les informations du repository
    print_status "Informations du nouveau repository:"
    echo "  - URL: $NEW_REPO_URL"
    echo "  - Branche: main"
    echo "  - Derniers commits:"
    git log --oneline -5
}

# Nettoyage et finalisation
finalize_migration() {
    print_status "Finalisation de la migration..."
    
    # Mettre à jour les informations locales
    git fetch origin
    git branch --set-upstream-to=origin/main main
    
    print_success "Migration finalisée"
}

# Affichage des informations finales
show_final_info() {
    echo ""
    print_success "MIGRATION TERMINÉE AVEC SUCCÈS!"
    echo ""
    echo -e "${YELLOW}Nouveau repository:${NC}"
    echo "  URL: $NEW_REPO_URL"
    echo "  Nom: $NEW_REPO_NAME"
    echo "  Branche: main"
    echo ""
    echo -e "${YELLOW}Actions effectuées:${NC}"
    echo "  ✓ Code migré vers le nouveau repository"
    echo "  ✓ Branding mis à jour (Racha Groupe)"
    echo "  ✓ Métadonnées actualisées"
    echo "  ✓ Origin Git changée"
    echo "  ✓ Historique Git préservé"
    echo ""
    echo -e "${GREEN}Commandes utiles:${NC}"
    echo "  git remote -v                    # Vérifier les remotes"
    echo "  git log --oneline -10            # Voir l'historique"
    echo "  git push origin main             # Push vers le nouveau repo"
    echo ""
    echo -e "${BLUE}Prochaines étapes:${NC}"
    echo "  1. Vérifier le repository sur GitHub"
    echo "  2. Configurer les paramètres du repository"
    echo "  3. Ajouter une description et des topics"
    echo "  4. Configurer les branches de protection"
    echo "  5. Inviter des collaborateurs si nécessaire"
    echo ""
    echo -e "${CYAN}Repository accessible à:${NC}"
    echo "  https://github.com/$GITHUB_USER/$NEW_REPO_NAME"
}

# Fonction principale
main() {
    print_header
    
    # Vérifications
    check_requirements
    
    # Instructions GitHub
    show_github_instructions
    
    # Migration
    migrate_code
    
    # Vérification
    verify_migration
    
    # Finalisation
    finalize_migration
    
    # Informations finales
    show_final_info
}

# Gestion des erreurs
trap 'echo ""; print_error "Migration interrompue"; exit 1' INT TERM

# Exécution
main "$@"
