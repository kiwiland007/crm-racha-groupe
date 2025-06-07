#!/bin/bash

# =====================================================
# SCRIPT DE DÉPLOIEMENT MYSQL - RACHA BUSINESS CRM
# Version: 1.0.0
# Date: 2024-12-19
# =====================================================

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration par défaut - MariaDB v10.3.39
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="admin_crm"
DB_USER="your_username"
DB_PASSWORD="your_password"
MYSQL_ROOT_PASSWORD=""

# Fonctions utilitaires
print_header() {
    echo -e "${BLUE}=================================================${NC}"
    echo -e "${BLUE}  DÉPLOIEMENT BASE DE DONNÉES MYSQL${NC}"
    echo -e "${BLUE}  Racha Business CRM v1.0.0${NC}"
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

# Vérifier les prérequis
check_prerequisites() {
    print_status "Vérification des prérequis..."
    
    # Vérifier MySQL
    if ! command -v mysql &> /dev/null; then
        print_error "MySQL client n'est pas installé"
        echo "Installation sur Ubuntu/Debian: sudo apt install mysql-client"
        echo "Installation sur CentOS/RHEL: sudo yum install mysql"
        exit 1
    fi
    
    # Vérifier le fichier de schéma
    if [ ! -f "mysql-schema.sql" ]; then
        print_error "Fichier mysql-schema.sql non trouvé"
        exit 1
    fi
    
    print_success "Prérequis vérifiés"
}

# Tester la connexion MySQL
test_connection() {
    print_status "Test de connexion à MySQL..."
    
    if [ -n "$MYSQL_ROOT_PASSWORD" ]; then
        mysql -h"$DB_HOST" -P"$DB_PORT" -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SELECT 1;" &> /dev/null
    else
        mysql -h"$DB_HOST" -P"$DB_PORT" -uroot -e "SELECT 1;" &> /dev/null
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Connexion MySQL réussie"
    else
        print_error "Impossible de se connecter à MySQL"
        echo "Vérifiez que MySQL est démarré et que les identifiants sont corrects"
        exit 1
    fi
}

# Créer la base de données et l'utilisateur
create_database() {
    print_status "Création de la base de données et de l'utilisateur..."
    
    # Commandes SQL pour la création (MariaDB compatible)
    SQL_COMMANDS="
    CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
    CREATE USER IF NOT EXISTS '$DB_USER'@'%' IDENTIFIED BY '$DB_PASSWORD';
    GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
    GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'%';
    GRANT PROCESS ON *.* TO '$DB_USER'@'localhost';
    GRANT PROCESS ON *.* TO '$DB_USER'@'%';
    FLUSH PRIVILEGES;
    "
    
    if [ -n "$MYSQL_ROOT_PASSWORD" ]; then
        echo "$SQL_COMMANDS" | mysql -h"$DB_HOST" -P"$DB_PORT" -uroot -p"$MYSQL_ROOT_PASSWORD"
    else
        echo "$SQL_COMMANDS" | mysql -h"$DB_HOST" -P"$DB_PORT" -uroot
    fi
    
    if [ $? -eq 0 ]; then
        print_success "Base de données et utilisateur créés"
    else
        print_error "Erreur lors de la création de la base de données"
        exit 1
    fi
}

# Importer le schéma
import_schema() {
    print_status "Importation du schéma de base de données..."
    
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < mysql-schema.sql
    
    if [ $? -eq 0 ]; then
        print_success "Schéma importé avec succès"
    else
        print_error "Erreur lors de l'importation du schéma"
        exit 1
    fi
}

# Test de connexion utilisateur
test_user_connection() {
    print_status "Test de connexion avec l'utilisateur $DB_USER..."

    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT VERSION() as version, DATABASE() as current_db;" 2>/dev/null

    if [ $? -eq 0 ]; then
        print_success "Connexion utilisateur réussie"

        # Test avec Node.js si disponible
        if command -v node &> /dev/null && [ -f "test-connection.js" ]; then
            print_status "Test de connexion Node.js..."
            DB_HOST="$DB_HOST" DB_PORT="$DB_PORT" DB_NAME="$DB_NAME" DB_USER="$DB_USER" DB_PASSWORD="$DB_PASSWORD" node test-connection.js
        fi
    else
        print_error "Échec de la connexion utilisateur"
        print_warning "Vérifiez les credentials: $DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
    fi
}

# Vérifier l'installation
verify_installation() {
    print_status "Vérification de l'installation..."

    # Test de connexion utilisateur
    test_user_connection

    # Compter les tables créées
    TABLE_COUNT=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;" | wc -l)
    TABLE_COUNT=$((TABLE_COUNT - 1)) # Soustraire la ligne d'en-tête

    if [ $TABLE_COUNT -gt 0 ]; then
        print_success "$TABLE_COUNT tables créées"

        # Lister les tables principales
        echo ""
        print_status "Tables principales créées:"
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;" | grep -E "(users|contacts|products|quotes|invoices)" | while read table; do
            echo "  ✓ $table"
        done
    else
        print_error "Aucune table créée"
        exit 1
    fi
}

# Créer un fichier de configuration
create_config() {
    print_status "Création du fichier de configuration..."
    
    cat > database-config.json << EOF
{
  "database": {
    "host": "$DB_HOST",
    "port": $DB_PORT,
    "name": "$DB_NAME",
    "user": "$DB_USER",
    "password": "$DB_PASSWORD",
    "charset": "utf8mb4",
    "timezone": "+00:00"
  },
  "deployment": {
    "date": "$(date -u +"%Y-%m-%d %H:%M:%S UTC")",
    "version": "1.0.0",
    "status": "deployed"
  },
  "backup": {
    "user": "backup_user",
    "password": "backup_password_2024!",
    "schedule": "daily",
    "retention_days": 30
  }
}
EOF
    
    print_success "Configuration sauvegardée dans database-config.json"
}

# Créer un script de sauvegarde
create_backup_script() {
    print_status "Création du script de sauvegarde..."
    
    cat > backup-database.sh << 'EOF'
#!/bin/bash

# Script de sauvegarde automatique
DB_HOST="localhost"
DB_NAME="racha_business_crm"
DB_USER="backup_user"
DB_PASSWORD="backup_password_2024!"
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")

# Créer le dossier de sauvegarde
mkdir -p "$BACKUP_DIR"

# Effectuer la sauvegarde
mysqldump -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASSWORD" \
  --single-transaction \
  --routines \
  --triggers \
  "$DB_NAME" > "$BACKUP_DIR/racha_crm_backup_$DATE.sql"

# Compresser la sauvegarde
gzip "$BACKUP_DIR/racha_crm_backup_$DATE.sql"

# Nettoyer les anciennes sauvegardes (garder 30 jours)
find "$BACKUP_DIR" -name "racha_crm_backup_*.sql.gz" -mtime +30 -delete

echo "Sauvegarde créée: $BACKUP_DIR/racha_crm_backup_$DATE.sql.gz"
EOF
    
    chmod +x backup-database.sh
    print_success "Script de sauvegarde créé: backup-database.sh"
}

# Afficher les informations de connexion
show_connection_info() {
    echo ""
    print_success "DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!"
    echo ""
    echo -e "${YELLOW}Informations de connexion:${NC}"
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    echo "  Password: $DB_PASSWORD"
    echo ""
    echo -e "${YELLOW}Commande de connexion:${NC}"
    echo "  mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME"
    echo ""
    echo -e "${YELLOW}Fichiers créés:${NC}"
    echo "  ✓ database-config.json - Configuration de la base"
    echo "  ✓ backup-database.sh - Script de sauvegarde"
    echo ""
    echo -e "${YELLOW}Prochaines étapes:${NC}"
    echo "  1. Configurer l'application pour utiliser cette base"
    echo "  2. Programmer les sauvegardes automatiques"
    echo "  3. Configurer la surveillance"
    echo ""
}

# Menu interactif
show_menu() {
    echo ""
    echo "Options de déploiement:"
    echo "1. Déploiement complet (recommandé)"
    echo "2. Créer seulement la base et l'utilisateur"
    echo "3. Importer seulement le schéma"
    echo "4. Vérifier l'installation existante"
    echo "5. Créer les scripts de maintenance"
    echo "6. Quitter"
    echo ""
    read -p "Choisissez une option (1-6): " choice
    
    case $choice in
        1)
            full_deployment
            ;;
        2)
            create_database
            ;;
        3)
            import_schema
            ;;
        4)
            verify_installation
            ;;
        5)
            create_backup_script
            create_config
            ;;
        6)
            echo "Au revoir!"
            exit 0
            ;;
        *)
            print_error "Option invalide"
            show_menu
            ;;
    esac
}

# Déploiement complet
full_deployment() {
    print_header
    check_prerequisites
    test_connection
    create_database
    import_schema
    verify_installation
    create_config
    create_backup_script
    show_connection_info
}

# Point d'entrée principal
main() {
    # Vérifier les arguments
    if [ "$1" = "--auto" ]; then
        full_deployment
    else
        print_header
        show_menu
    fi
}

# Gestion des signaux
trap 'echo ""; print_error "Déploiement interrompu"; exit 1' INT TERM

# Exécuter le script
main "$@"
