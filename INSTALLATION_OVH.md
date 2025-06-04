# 🚀 Installation Manuelle OVH - Racha Business CRM

## 📋 **Prérequis**

### **Serveur OVH VPS**
- **OS** : Ubuntu 20.04 LTS ou 22.04 LTS (recommandé)
- **RAM** : Minimum 2GB (4GB recommandé)
- **Stockage** : Minimum 20GB SSD
- **Accès** : SSH root ou utilisateur sudo

### **Domaine**
- Nom de domaine pointant vers votre VPS
- Exemple : `crm.rachabusiness.com`

---

## 🔧 **ÉTAPE 1 : Préparation du Serveur**

### **1.1 Connexion SSH**

```bash
# Connexion au serveur
ssh root@VOTRE_IP_VPS

# Ou avec utilisateur sudo
ssh utilisateur@VOTRE_IP_VPS
```

### **1.2 Mise à jour du système**

```bash
# Mise à jour des paquets
sudo apt update && sudo apt upgrade -y

# Installation des outils essentiels
sudo apt install -y curl wget git unzip software-properties-common
```

### **1.3 Installation de Nginx**

```bash
# Installation de Nginx
sudo apt install -y nginx

# Démarrage et activation
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérification du statut
sudo systemctl status nginx
```

### **1.4 Installation de Certbot (SSL)**

```bash
# Installation de Certbot
sudo apt install -y certbot python3-certbot-nginx

# Ou via snap (alternative)
sudo snap install --classic certbot
```

---

## 📁 **ÉTAPE 2 : Préparation des Fichiers**

### **2.1 Création des répertoires**

```bash
# Créer le répertoire web
sudo mkdir -p /var/www/racha-crm

# Définir les permissions
sudo chown -R www-data:www-data /var/www/racha-crm
sudo chmod -R 755 /var/www/racha-crm
```

### **2.2 Upload des fichiers**

**Option A : Via SCP (depuis votre machine locale)**

```bash
# Depuis votre machine locale (où se trouve le projet)
# Compresser le dossier dist
tar -czf racha-crm-dist.tar.gz dist/

# Upload vers le serveur
scp racha-crm-dist.tar.gz root@VOTRE_IP_VPS:/tmp/

# Sur le serveur, extraire les fichiers
cd /tmp
tar -xzf racha-crm-dist.tar.gz
sudo cp -r dist/* /var/www/racha-crm/
sudo chown -R www-data:www-data /var/www/racha-crm
```

**Option B : Via Git (recommandé)**

```bash
# Cloner le repository
cd /tmp
git clone https://github.com/VOTRE_USERNAME/racha-business-crm.git

# Installer Node.js (si build sur serveur)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build sur le serveur
cd racha-business-crm
npm install
npm run build

# Copier les fichiers
sudo cp -r dist/* /var/www/racha-crm/
sudo chown -R www-data:www-data /var/www/racha-crm
```

**Option C : Via FTP/SFTP**

Utilisez FileZilla ou WinSCP pour transférer le contenu du dossier `dist/` vers `/var/www/racha-crm/`

---

## ⚙️ **ÉTAPE 3 : Configuration Nginx**

### **3.1 Créer la configuration du site**

```bash
# Créer le fichier de configuration
sudo nano /etc/nginx/sites-available/racha-crm
```

**Contenu du fichier** :

```nginx
server {
    listen 80;
    server_name crm.rachabusiness.com www.crm.rachabusiness.com;
    root /var/www/racha-crm;
    index index.html;

    # Gestion des fichiers statiques
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache pour les assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Sécurité headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compression gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Logs
    access_log /var/log/nginx/racha-crm.access.log;
    error_log /var/log/nginx/racha-crm.error.log;
}
```

### **3.2 Activer le site**

```bash
# Créer le lien symbolique
sudo ln -s /etc/nginx/sites-available/racha-crm /etc/nginx/sites-enabled/

# Supprimer le site par défaut (optionnel)
sudo rm /etc/nginx/sites-enabled/default

# Tester la configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

---

## 🔒 **ÉTAPE 4 : Configuration SSL (HTTPS)**

### **4.1 Obtenir le certificat SSL**

```bash
# Obtenir le certificat Let's Encrypt
sudo certbot --nginx -d crm.rachabusiness.com -d www.crm.rachabusiness.com

# Suivre les instructions interactives
# Choisir de rediriger HTTP vers HTTPS (option 2)
```

### **4.2 Renouvellement automatique**

```bash
# Tester le renouvellement
sudo certbot renew --dry-run

# Le renouvellement automatique est configuré via cron
sudo crontab -l | grep certbot
```

---

## 🔥 **ÉTAPE 5 : Configuration du Firewall**

### **5.1 Configuration UFW**

```bash
# Activer UFW
sudo ufw enable

# Autoriser SSH
sudo ufw allow ssh

# Autoriser HTTP et HTTPS
sudo ufw allow 'Nginx Full'

# Vérifier le statut
sudo ufw status
```

---

## 📊 **ÉTAPE 6 : Monitoring et Logs**

### **6.1 Vérification des logs**

```bash
# Logs Nginx
sudo tail -f /var/log/nginx/racha-crm.access.log
sudo tail -f /var/log/nginx/racha-crm.error.log

# Logs système
sudo journalctl -u nginx -f
```

### **6.2 Monitoring des performances**

```bash
# Installer htop pour monitoring
sudo apt install -y htop

# Vérifier l'utilisation des ressources
htop

# Vérifier l'espace disque
df -h

# Vérifier la mémoire
free -h
```

---

## 🔄 **ÉTAPE 7 : Script de Déploiement Automatique**

Créer un script pour faciliter les mises à jour :

```bash
# Créer le script
sudo nano /usr/local/bin/deploy-racha-crm.sh
```

**Contenu du script** :

```bash
#!/bin/bash

# Script de déploiement Racha Business CRM
echo "🚀 Déploiement Racha Business CRM..."

# Variables
REPO_URL="https://github.com/VOTRE_USERNAME/racha-business-crm.git"
TEMP_DIR="/tmp/racha-crm-deploy"
WEB_DIR="/var/www/racha-crm"
BACKUP_DIR="/var/backups/racha-crm"

# Créer une sauvegarde
echo "📦 Création de la sauvegarde..."
sudo mkdir -p $BACKUP_DIR
sudo cp -r $WEB_DIR $BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)

# Cloner le repository
echo "📥 Téléchargement du code..."
rm -rf $TEMP_DIR
git clone $REPO_URL $TEMP_DIR

# Build (si Node.js installé)
if command -v npm &> /dev/null; then
    echo "🏗️ Build de l'application..."
    cd $TEMP_DIR
    npm install
    npm run build
    BUILD_DIR="$TEMP_DIR/dist"
else
    echo "⚠️ Node.js non installé, utilisation des fichiers pré-buildés"
    BUILD_DIR="$TEMP_DIR/dist"
fi

# Déployer les fichiers
echo "🚀 Déploiement des fichiers..."
sudo rm -rf $WEB_DIR/*
sudo cp -r $BUILD_DIR/* $WEB_DIR/
sudo chown -R www-data:www-data $WEB_DIR
sudo chmod -R 755 $WEB_DIR

# Recharger Nginx
echo "🔄 Rechargement de Nginx..."
sudo nginx -t && sudo systemctl reload nginx

# Nettoyage
rm -rf $TEMP_DIR

echo "✅ Déploiement terminé avec succès !"
echo "🌐 Site accessible sur : https://crm.rachabusiness.com"
```

**Rendre le script exécutable** :

```bash
sudo chmod +x /usr/local/bin/deploy-racha-crm.sh

# Utilisation
sudo deploy-racha-crm.sh
```

---

## ✅ **ÉTAPE 8 : Vérification Finale**

### **8.1 Tests de fonctionnement**

1. **Accès HTTP** : http://crm.rachabusiness.com
2. **Redirection HTTPS** : Vérifier la redirection automatique
3. **Fonctionnalités** : Tester la connexion et les principales fonctions
4. **Performance** : Vérifier les temps de chargement
5. **Mobile** : Tester sur mobile/tablette

### **8.2 Checklist de vérification**

- [ ] Site accessible en HTTPS
- [ ] Certificat SSL valide
- [ ] Redirection HTTP → HTTPS
- [ ] Logo Racha Digital affiché
- [ ] Connexion utilisateur fonctionnelle
- [ ] Génération PDF opérationnelle
- [ ] Responsive design OK
- [ ] Logs sans erreurs
- [ ] Firewall configuré
- [ ] Sauvegarde en place

---

## 🆘 **Dépannage**

### **Problèmes courants**

**1. Erreur 403 Forbidden**
```bash
# Vérifier les permissions
sudo chown -R www-data:www-data /var/www/racha-crm
sudo chmod -R 755 /var/www/racha-crm
```

**2. Erreur 502 Bad Gateway**
```bash
# Vérifier la configuration Nginx
sudo nginx -t
sudo systemctl restart nginx
```

**3. Certificat SSL non valide**
```bash
# Renouveler le certificat
sudo certbot renew
sudo systemctl reload nginx
```

**4. Site non accessible**
```bash
# Vérifier le DNS
nslookup crm.rachabusiness.com

# Vérifier le firewall
sudo ufw status
```

---

## 📞 **Support**

- **Logs Nginx** : `/var/log/nginx/racha-crm.*.log`
- **Configuration** : `/etc/nginx/sites-available/racha-crm`
- **Fichiers web** : `/var/www/racha-crm`
- **SSL** : `sudo certbot certificates`

---

<div align="center">
  <p><strong>🎉 Racha Business CRM installé avec succès sur OVH !</strong></p>
  <p>Votre CRM est maintenant accessible en production</p>
</div>
