#!/bin/bash

# =====================================================
# SCRIPT DE CONNEXION MARIADB - RACHA BUSINESS CRM
# Version: 1.0.0
# Compatible: MariaDB v10.3.39+
# =====================================================

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration MariaDB
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="admin_crm"
DB_USER="kiwiland"
DB_PASSWORD="YOUR_SECURE_PASSWORD"

# Fonctions utilitaires
print_header() {
    echo -e "${BLUE}=================================================${NC}"
    echo -e "${BLUE}  CONNEXION MARIADB - RACHA BUSINESS CRM${NC}"
    echo -e "${BLUE}  MariaDB v10.3.39+${NC}"
    echo -e "${BLUE}=================================================${NC}"
    echo ""
}

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

# Vérifier la connexion MariaDB
test_connection() {
    print_status "Test de connexion à MariaDB..."
    
    # Test de connexion simple
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT VERSION();" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_success "Connexion MariaDB réussie"
        
        # Afficher les informations de version
        VERSION=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT VERSION();" -s -N 2>/dev/null)
        echo "  Version: $VERSION"
        
        return 0
    else
        print_error "Impossible de se connecter à MariaDB"
        echo "  Host: $DB_HOST:$DB_PORT"
        echo "  User: $DB_USER"
        echo "  Database: $DB_NAME"
        return 1
    fi
}

# Vérifier l'existence de la base de données
check_database() {
    print_status "Vérification de la base de données..."
    
    DB_EXISTS=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SHOW DATABASES LIKE '$DB_NAME';" -s -N 2>/dev/null)
    
    if [ -n "$DB_EXISTS" ]; then
        print_success "Base de données '$DB_NAME' trouvée"
        
        # Compter les tables
        TABLE_COUNT=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;" -s -N 2>/dev/null | wc -l)
        echo "  Tables: $TABLE_COUNT"
        
        return 0
    else
        print_warning "Base de données '$DB_NAME' non trouvée"
        return 1
    fi
}

# Lister les tables existantes
list_tables() {
    print_status "Tables dans la base de données:"
    
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "
    SELECT 
        TABLE_NAME as 'Table',
        TABLE_ROWS as 'Lignes',
        ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as 'Taille (MB)'
    FROM information_schema.TABLES 
    WHERE TABLE_SCHEMA = '$DB_NAME'
    ORDER BY TABLE_NAME;
    " 2>/dev/null
}

# Afficher les statistiques de la base
show_stats() {
    print_status "Statistiques de la base de données:"
    
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "
    SELECT 
        'Contacts' as Type,
        COUNT(*) as Total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as Actifs
    FROM contacts
    UNION ALL
    SELECT 
        'Produits' as Type,
        COUNT(*) as Total,
        SUM(CASE WHEN availability = 'available' THEN 1 ELSE 0 END) as Disponibles
    FROM products
    UNION ALL
    SELECT 
        'Devis' as Type,
        COUNT(*) as Total,
        SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) as Envoyés
    FROM quotes
    UNION ALL
    SELECT 
        'Factures' as Type,
        COUNT(*) as Total,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as Payées
    FROM invoices;
    " 2>/dev/null
}

# Ouvrir une session interactive
open_interactive() {
    print_status "Ouverture d'une session interactive MariaDB..."
    print_warning "Tapez 'exit' pour quitter la session"
    echo ""
    
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME"
}

# Exécuter une requête personnalisée
execute_query() {
    local query="$1"
    
    if [ -z "$query" ]; then
        read -p "Entrez votre requête SQL: " query
    fi
    
    print_status "Exécution de la requête..."
    echo "Query: $query"
    echo ""
    
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "$query" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        print_success "Requête exécutée avec succès"
    else
        print_error "Erreur lors de l'exécution de la requête"
    fi
}

# Sauvegarder la base de données
backup_database() {
    local backup_dir="./backups"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$backup_dir/admin_crm_backup_$timestamp.sql"
    
    print_status "Sauvegarde de la base de données..."
    
    # Créer le dossier de sauvegarde
    mkdir -p "$backup_dir"
    
    # Effectuer la sauvegarde
    mysqldump -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" \
        --single-transaction \
        --routines \
        --triggers \
        --add-drop-database \
        --databases "$DB_NAME" > "$backup_file"
    
    if [ $? -eq 0 ]; then
        # Compresser la sauvegarde
        gzip "$backup_file"
        
        local size=$(du -h "$backup_file.gz" | cut -f1)
        print_success "Sauvegarde créée: $(basename "$backup_file.gz") ($size)"
        
        # Nettoyer les anciennes sauvegardes (garder 10 dernières)
        cd "$backup_dir"
        ls -t admin_crm_backup_*.sql.gz | tail -n +11 | xargs rm -f 2>/dev/null
        cd ..
        
        return 0
    else
        print_error "Erreur lors de la sauvegarde"
        return 1
    fi
}

# Restaurer une sauvegarde
restore_database() {
    local backup_dir="./backups"
    
    print_status "Sauvegardes disponibles:"
    ls -la "$backup_dir"/admin_crm_backup_*.sql.gz 2>/dev/null | awk '{print $9, $5, $6, $7, $8}'
    
    echo ""
    read -p "Nom du fichier de sauvegarde: " backup_file
    
    if [ ! -f "$backup_dir/$backup_file" ]; then
        print_error "Fichier de sauvegarde non trouvé"
        return 1
    fi
    
    print_warning "ATTENTION: Cette opération va écraser la base de données existante!"
    read -p "Continuer? (y/N): " confirm
    
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_error "Restauration annulée"
        return 1
    fi
    
    print_status "Restauration en cours..."
    
    # Décompresser et restaurer
    if [[ $backup_file == *.gz ]]; then
        gunzip -c "$backup_dir/$backup_file" | mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD"
    else
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" < "$backup_dir/$backup_file"
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Base de données restaurée avec succès"
    else
        print_error "Erreur lors de la restauration"
        return 1
    fi
}

# Menu principal
show_menu() {
    echo ""
    echo "Options disponibles:"
    echo "1. Tester la connexion"
    echo "2. Vérifier la base de données"
    echo "3. Lister les tables"
    echo "4. Afficher les statistiques"
    echo "5. Session interactive"
    echo "6. Exécuter une requête"
    echo "7. Sauvegarder la base"
    echo "8. Restaurer une sauvegarde"
    echo "9. Informations de connexion"
    echo "0. Quitter"
    echo ""
    read -p "Choisissez une option (0-9): " choice
    
    case $choice in
        1)
            test_connection
            show_menu
            ;;
        2)
            check_database
            show_menu
            ;;
        3)
            list_tables
            show_menu
            ;;
        4)
            show_stats
            show_menu
            ;;
        5)
            open_interactive
            show_menu
            ;;
        6)
            execute_query
            show_menu
            ;;
        7)
            backup_database
            show_menu
            ;;
        8)
            restore_database
            show_menu
            ;;
        9)
            show_connection_info
            show_menu
            ;;
        0)
            echo "Au revoir!"
            exit 0
            ;;
        *)
            print_error "Option invalide"
            show_menu
            ;;
    esac
}

# Afficher les informations de connexion
show_connection_info() {
    echo ""
    echo -e "${YELLOW}Informations de connexion MariaDB:${NC}"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo "  Password: $DB_PASSWORD"
    echo ""
    echo -e "${YELLOW}Commande de connexion directe:${NC}"
    echo "  mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME"
    echo ""
    echo -e "${YELLOW}URL de connexion:${NC}"
    echo "  mysql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
    echo ""
}

# Vérification rapide
quick_check() {
    print_header
    test_connection
    if [ $? -eq 0 ]; then
        check_database
        if [ $? -eq 0 ]; then
            list_tables
            show_stats
        fi
    fi
}

# Point d'entrée principal
main() {
    case "$1" in
        "--check")
            quick_check
            ;;
        "--interactive")
            print_header
            open_interactive
            ;;
        "--backup")
            print_header
            backup_database
            ;;
        "--stats")
            print_header
            show_stats
            ;;
        "--info")
            show_connection_info
            ;;
        *)
            print_header
            show_menu
            ;;
    esac
}

# Gestion des signaux
trap 'echo ""; print_error "Opération interrompue"; exit 1' INT TERM

# Exécuter le script
main "$@"
