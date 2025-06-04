# ⚡ Démarrage Rapide OVH - Racha Business CRM

## 🎯 **Installation en 15 minutes**

### **📋 Prérequis**
- ✅ VPS OVH avec Ubuntu 20.04/22.04
- ✅ Nom de domaine configuré (ex: crm.rachabusiness.com)
- ✅ Accès SSH au serveur

---

## 🚀 **ÉTAPE 1 : Préparation Locale (2 min)**

### **Sur votre machine locale :**

```bash
# Windows (PowerShell)
.\scripts\prepare-ovh-deployment.ps1

# Linux/macOS (Bash)
./scripts/prepare-ovh-deployment.sh
```

**Résultat** : Archive `racha-crm-production.zip` créée

---

## 🔧 **ÉTAPE 2 : Configuration Serveur (8 min)**

### **Connexion et mise à jour :**

```bash
# Connexion SSH
ssh root@VOTRE_IP_VPS

# Mise à jour système
apt update && apt upgrade -y

# Installation des outils
apt install -y nginx certbot python3-certbot-nginx unzip
```

### **Création des répertoires :**

```bash
# Créer le répertoire web
mkdir -p /var/www/racha-crm
chown -R www-data:www-data /var/www/racha-crm
chmod -R 755 /var/www/racha-crm
```

---

## 📦 **ÉTAPE 3 : Upload des Fichiers (3 min)**

### **Option A : SCP (Recommandé)**

```bash
# Depuis votre machine locale
scp racha-crm-production.zip root@VOTRE_IP_VPS:/tmp/

# Sur le serveur
cd /tmp
unzip racha-crm-production.zip
cp -r * /var/www/racha-crm/
chown -R www-data:www-data /var/www/racha-crm
```

### **Option B : SFTP/FTP**

1. Ouvrir FileZilla/WinSCP
2. Se connecter au serveur
3. Extraire l'archive localement
4. Uploader le contenu vers `/var/www/racha-crm/`

---

## ⚙️ **ÉTAPE 4 : Configuration Nginx (2 min)**

```bash
# Copier la configuration
cp /var/www/racha-crm/nginx-racha-crm.conf /etc/nginx/sites-available/racha-crm

# Modifier le nom de domaine dans le fichier
nano /etc/nginx/sites-available/racha-crm
# Remplacer "crm.rachabusiness.com" par votre domaine

# Activer le site
ln -s /etc/nginx/sites-available/racha-crm /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default

# Tester et recharger
nginx -t && systemctl reload nginx
```

---

## 🔒 **ÉTAPE 5 : SSL et Sécurité (2 min)**

```bash
# Obtenir le certificat SSL
certbot --nginx -d VOTRE_DOMAINE.com

# Configurer le firewall
ufw enable
ufw allow ssh
ufw allow 'Nginx Full'
```

---

## ✅ **VÉRIFICATION FINALE**

### **Tests à effectuer :**

1. **HTTP → HTTPS** : http://votre-domaine.com → redirection automatique
2. **Accès HTTPS** : https://votre-domaine.com → Site accessible
3. **Logo affiché** : Vérifier que le logo Racha Digital s'affiche
4. **Connexion** : Tester la page de connexion
5. **Responsive** : Tester sur mobile

### **Commandes de vérification :**

```bash
# Statut des services
systemctl status nginx
systemctl status ufw

# Logs en temps réel
tail -f /var/log/nginx/racha-crm.access.log

# Test SSL
curl -I https://votre-domaine.com
```

---

## 🔄 **Mise à Jour Rapide**

Pour les futures mises à jour :

```bash
# Sur votre machine locale
./scripts/prepare-ovh-deployment.sh

# Upload vers le serveur
scp racha-crm-production.zip root@VOTRE_IP_VPS:/tmp/

# Sur le serveur
cd /tmp
unzip -o racha-crm-production.zip
cp -r * /var/www/racha-crm/
chown -R www-data:www-data /var/www/racha-crm
systemctl reload nginx
```

---

## 🆘 **Dépannage Express**

### **Site non accessible :**
```bash
# Vérifier Nginx
nginx -t
systemctl restart nginx

# Vérifier les permissions
chown -R www-data:www-data /var/www/racha-crm
chmod -R 755 /var/www/racha-crm
```

### **Erreur SSL :**
```bash
# Renouveler le certificat
certbot renew
systemctl reload nginx
```

### **Logs d'erreur :**
```bash
# Voir les erreurs Nginx
tail -f /var/log/nginx/racha-crm.error.log

# Voir les erreurs système
journalctl -u nginx -f
```

---

## 📊 **Monitoring Simple**

### **Commandes utiles :**

```bash
# Utilisation des ressources
htop

# Espace disque
df -h

# Mémoire
free -h

# Connexions actives
ss -tuln

# Logs d'accès en temps réel
tail -f /var/log/nginx/racha-crm.access.log
```

---

## 🎉 **Félicitations !**

Votre **Racha Business CRM** est maintenant :

- ✅ **Accessible** en HTTPS
- ✅ **Sécurisé** avec SSL et firewall
- ✅ **Optimisé** pour les performances
- ✅ **Prêt** pour la production

### **URLs importantes :**
- **Application** : https://votre-domaine.com
- **Documentation** : `/var/www/racha-crm/INSTALLATION_OVH.md`
- **Configuration** : `/etc/nginx/sites-available/racha-crm`
- **Logs** : `/var/log/nginx/racha-crm.*.log`

---

<div align="center">
  <p><strong>🚀 Racha Business CRM déployé avec succès sur OVH !</strong></p>
  <p>Temps total d'installation : ~15 minutes</p>
</div>
