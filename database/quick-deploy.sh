#!/bin/bash

# =====================================================
# DÉPLOIEMENT RAPIDE MARIADB - RACHA BUSINESS CRM
# Version: 1.0.0
# =====================================================

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="admin_crm"
DB_USER="kiwiland"
DB_PASSWORD="a16rC_44t"

echo -e "${BLUE}🚀 DÉPLOIEMENT RAPIDE MARIADB${NC}"
echo -e "${BLUE}==============================${NC}"
echo ""

# Test de connexion
echo -e "${BLUE}[1/4]${NC} Test de connexion MariaDB..."
if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" &>/dev/null; then
    echo -e "${GREEN}✓ Connexion réussie${NC}"
else
    echo -e "${RED}✗ Échec de connexion${NC}"
    echo "Vérifiez vos identifiants MariaDB"
    exit 1
fi

# Vérification de la base
echo -e "${BLUE}[2/4]${NC} Vérification de la base de données..."
DB_EXISTS=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SHOW DATABASES LIKE '$DB_NAME';" -s -N 2>/dev/null)

if [ -n "$DB_EXISTS" ]; then
    echo -e "${GREEN}✓ Base de données '$DB_NAME' trouvée${NC}"
else
    echo -e "${YELLOW}⚠ Base de données '$DB_NAME' non trouvée${NC}"
    echo "Création de la base de données..."
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    echo -e "${GREEN}✓ Base de données créée${NC}"
fi

# Import du schéma
echo -e "${BLUE}[3/4]${NC} Import du schéma..."
if [ -f "mysql-schema.sql" ]; then
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < mysql-schema.sql
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Schéma importé avec succès${NC}"
    else
        echo -e "${RED}✗ Erreur lors de l'import du schéma${NC}"
        exit 1
    fi
else
    echo -e "${RED}✗ Fichier mysql-schema.sql non trouvé${NC}"
    exit 1
fi

# Vérification finale
echo -e "${BLUE}[4/4]${NC} Vérification finale..."
TABLE_COUNT=$(mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;" -s -N 2>/dev/null | wc -l)

if [ $TABLE_COUNT -gt 0 ]; then
    echo -e "${GREEN}✓ $TABLE_COUNT tables créées${NC}"
    
    # Lister quelques tables importantes
    echo ""
    echo "Tables principales:"
    mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" -e "SHOW TABLES;" -s -N | head -5 | while read table; do
        echo "  ✓ $table"
    done
else
    echo -e "${RED}✗ Aucune table créée${NC}"
    exit 1
fi

# Succès
echo ""
echo -e "${GREEN}🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS!${NC}"
echo ""
echo -e "${YELLOW}Informations de connexion:${NC}"
echo "  Host: $DB_HOST:$DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo ""
echo -e "${YELLOW}Commande de connexion:${NC}"
echo "  mysql -h$DB_HOST -P$DB_PORT -u$DB_USER -p$DB_PASSWORD $DB_NAME"
echo ""
echo -e "${YELLOW}Prochaines étapes:${NC}"
echo "  1. Tester la connexion: ./connect-mariadb.sh --check"
echo "  2. Configurer l'application avec ces paramètres"
echo "  3. Lancer l'application CRM"
echo ""
