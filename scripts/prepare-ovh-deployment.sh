#!/bin/bash

# 🚀 Script de Préparation Déploiement OVH - Racha Business CRM
# Bash Script pour Linux/macOS

echo "🚀 Préparation du déploiement OVH - Racha Business CRM"
echo "============================================================"

# Variables
PROJECT_NAME="racha-business-crm"
BUILD_DIR="dist"
OUTPUT_DIR="ovh-deployment"
ARCHIVE_NAME="racha-crm-production.tar.gz"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Fonction d'affichage coloré
print_status() {
    echo -e "${2}${1}${NC}"
}

# Étape 1: Vérification des prérequis
print_status "📋 Vérification des prérequis..." $YELLOW

if [ ! -d "$BUILD_DIR" ]; then
    print_status "❌ Dossier 'dist' non trouvé. Lancement du build..." $RED
    npm run build
    if [ $? -ne 0 ]; then
        print_status "❌ Erreur lors du build. Arrêt du script." $RED
        exit 1
    fi
else
    print_status "✅ Dossier 'dist' trouvé" $GREEN
fi

# Étape 2: Création du dossier de déploiement
print_status "📁 Création du dossier de déploiement..." $YELLOW

if [ -d "$OUTPUT_DIR" ]; then
    rm -rf "$OUTPUT_DIR"
fi
mkdir -p "$OUTPUT_DIR"

# Étape 3: Copie des fichiers de production
print_status "📦 Copie des fichiers de production..." $YELLOW

# Copier le contenu du dossier dist
cp -r "$BUILD_DIR"/* "$OUTPUT_DIR/"

# Copier les fichiers de configuration
cp "INSTALLATION_OVH.md" "$OUTPUT_DIR/" 2>/dev/null || true
cp "README.md" "$OUTPUT_DIR/" 2>/dev/null || true
cp "package.json" "$OUTPUT_DIR/" 2>/dev/null || true

print_status "✅ Fichiers copiés avec succès" $GREEN

# Étape 4: Création de l'archive
print_status "🗜️ Création de l'archive de déploiement..." $YELLOW

if [ -f "$ARCHIVE_NAME" ]; then
    rm "$ARCHIVE_NAME"
fi

# Créer l'archive tar.gz
tar -czf "$ARCHIVE_NAME" -C "$OUTPUT_DIR" .

print_status "✅ Archive créée: $ARCHIVE_NAME" $GREEN

# Étape 5: Génération des informations de déploiement
print_status "📊 Génération des informations de déploiement..." $YELLOW

ARCHIVE_SIZE=$(du -h "$ARCHIVE_NAME" | cut -f1)
CURRENT_DATE=$(date "+%Y-%m-%d %H:%M:%S")

cat > "$OUTPUT_DIR/DEPLOY_INFO.md" << EOF
# 🚀 Informations de Déploiement - Racha Business CRM

## 📦 Archive de Production
- **Fichier**: $ARCHIVE_NAME
- **Date**: $CURRENT_DATE
- **Taille**: $ARCHIVE_SIZE

## 📁 Contenu de l'Archive
- Fichiers de production (HTML, CSS, JS)
- Assets (logos, images, favicon)
- Guide d'installation OVH
- Documentation

## 🔧 Commandes de Déploiement OVH

### Upload via SCP
\`\`\`bash
# Upload de l'archive
scp $ARCHIVE_NAME root@VOTRE_IP_VPS:/tmp/

# Sur le serveur OVH
ssh root@VOTRE_IP_VPS
cd /tmp
tar -xzf $ARCHIVE_NAME
sudo cp -r * /var/www/racha-crm/
sudo chown -R www-data:www-data /var/www/racha-crm
sudo systemctl reload nginx
\`\`\`

### Upload via SFTP
1. Ouvrir FileZilla/WinSCP
2. Se connecter au serveur OVH
3. Naviguer vers /var/www/racha-crm/
4. Extraire et uploader le contenu de l'archive

## 🌐 Après Déploiement
- Tester: https://crm.rachabusiness.com
- Vérifier les logs: sudo tail -f /var/log/nginx/racha-crm.access.log
- Monitoring: htop

## 📞 Support
- Documentation: INSTALLATION_OVH.md
- Logs serveur: /var/log/nginx/
- Configuration: /etc/nginx/sites-available/racha-crm
EOF

print_status "✅ Informations de déploiement générées" $GREEN

# Étape 6: Affichage du résumé
echo ""
print_status "🎉 PRÉPARATION TERMINÉE AVEC SUCCÈS !" $GREEN
echo "============================================================"
echo ""
print_status "📦 Archive créée: $ARCHIVE_NAME" $CYAN
print_status "📁 Dossier: $OUTPUT_DIR" $CYAN
print_status "📊 Taille: $ARCHIVE_SIZE" $CYAN
echo ""
print_status "🚀 PROCHAINES ÉTAPES:" $YELLOW
echo "1. Transférer $ARCHIVE_NAME vers votre serveur OVH"
echo "2. Suivre le guide INSTALLATION_OVH.md"
echo "3. Configurer Nginx et SSL"
echo "4. Tester l'application en production"
echo ""
print_status "📚 Documentation disponible dans: $OUTPUT_DIR/INSTALLATION_OVH.md" $CYAN
echo ""

# Étape 7: Ouverture du dossier (optionnel)
read -p "Ouvrir le dossier de déploiement ? (o/n): " open_folder
if [[ $open_folder == "o" || $open_folder == "O" ]]; then
    if command -v xdg-open > /dev/null; then
        xdg-open "$OUTPUT_DIR"
    elif command -v open > /dev/null; then
        open "$OUTPUT_DIR"
    else
        print_status "📁 Dossier: $(pwd)/$OUTPUT_DIR" $CYAN
    fi
fi

print_status "✅ Script terminé avec succès !" $GREEN
