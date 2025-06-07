# 🚀 Guide de Déploiement OVH - Racha Business CRM

## 📋 Prérequis

### Hébergement OVH - Configuration Racha Digital
- **Host** : 217.182.70.41
- **User** : crm@rachadigital.com
- **Password** : G13c8c_f3
- **Domain** : crm.rachadigital.com
- **Hébergement web** avec support PHP/Apache
- **Espace disque** : minimum 100 MB
- **Base de données** : MariaDB v10.3.39

### Outils de développement
- Node.js 18+ 
- npm ou yarn
- Accès FTP/SFTP ou gestionnaire de fichiers OVH

## 🛠️ Préparation du Déploiement

### 1. Configuration de l'environnement

Créez un fichier `.env` basé sur `.env.example` :

```bash
cp .env.example .env
```

Configurez vos variables :
```env
NODE_ENV=production
VITE_APP_BASE_URL=https://votre-domaine.com
VITE_COMPANY_NAME="Racha Business Group"
# ... autres variables
```

### 2. Build de production

#### Option A : Script automatique (Linux/Mac)
```bash
./deploy-ovh.sh
```

#### Option B : Commandes manuelles
```bash
# Nettoyage
rm -rf dist/ node_modules/.cache/

# Installation des dépendances
npm ci --only=production

# Build de production
npm run build
```

## 📦 Déploiement sur OVH

### Méthode 1 : Gestionnaire de fichiers OVH

1. **Connectez-vous** à votre espace client OVH
2. **Accédez** à votre hébergement web
3. **Ouvrez** le gestionnaire de fichiers
4. **Naviguez** vers le dossier `www/`
5. **Supprimez** le contenu existant (si nécessaire)
6. **Uploadez** tout le contenu du dossier `dist/`
7. **Vérifiez** que le fichier `.htaccess` est présent

### Méthode 2 : FTP/SFTP

```bash
# Avec rsync (recommandé) - Racha Digital OVH
rsync -avz --delete dist/ crm@rachadigital.com@217.182.70.41:www/

# Avec scp - Racha Digital OVH
scp -r dist/* crm@rachadigital.com@217.182.70.41:www/

# Configuration FTP pour FileZilla
# Host: 217.182.70.41
# User: crm@rachadigital.com
# Password: G13c8c_f3
# Directory: www/
```

### Méthode 3 : Git (si disponible)

```bash
# Sur le serveur OVH (si accès SSH)
git clone https://github.com/votre-repo/racha-business-crm.git
cd racha-business-crm
npm ci --only=production
npm run build
cp -r dist/* ../www/
```

## ⚙️ Configuration Apache (.htaccess)

Le fichier `.htaccess` est automatiquement inclus et configure :

- **Réécriture d'URL** pour React Router
- **Cache des assets** statiques
- **Compression GZIP**
- **Headers de sécurité**
- **Redirection HTTPS**

## 🗄️ Configuration Base de Données (Optionnel)

### 1. Création de la base de données

Dans l'espace client OVH :
1. Créez une base de données MySQL
2. Notez les informations de connexion
3. Importez le schéma depuis `database/mysql-schema.sql`

### 2. Configuration de l'application

Mettez à jour vos variables d'environnement :
```env
# Production OVH - Racha Digital
VITE_DB_HOST=217.182.70.41
VITE_DB_PORT=3306
VITE_DB_NAME=admin_crm
VITE_DB_USER=kiwiland
VITE_DB_PASSWORD=8Z!ZHbm7uo9rjiv#

# Configuration OVH
OVH_HOST=217.182.70.41
OVH_USER=crm@rachadigital.com
OVH_PASSWORD=G13c8c_f3
OVH_DOMAIN=crm.rachadigital.com
```

**Note** : Le fichier `.env.production` est déjà configuré avec ces valeurs.

## 🔧 Vérifications Post-Déploiement

### 1. Tests fonctionnels
- [ ] Page d'accueil accessible
- [ ] Navigation entre les pages
- [ ] Formulaires fonctionnels
- [ ] Génération PDF
- [ ] Responsive design

### 2. Performance
- [ ] Temps de chargement < 3s
- [ ] Assets compressés
- [ ] Cache navigateur actif

### 3. SEO
- [ ] Robots.txt accessible
- [ ] Meta tags présents
- [ ] URLs propres

## 🚨 Dépannage

### Erreur 404 sur les routes
**Problème** : Les routes React ne fonctionnent pas
**Solution** : Vérifiez que le fichier `.htaccess` est présent et correct

### Assets non chargés
**Problème** : CSS/JS ne se chargent pas
**Solution** : Vérifiez les chemins dans `vite.config.ts` (base: './')

### Erreurs de CORS
**Problème** : Appels API bloqués
**Solution** : Configurez les headers CORS sur votre API backend

### Performance lente
**Problème** : Chargement lent
**Solutions** :
- Activez la compression GZIP
- Optimisez les images
- Utilisez un CDN

## 📊 Monitoring et Maintenance

### Logs d'erreurs
- Consultez les logs Apache dans l'espace client OVH
- Configurez Sentry pour le monitoring (optionnel)

### Mises à jour
```bash
# Développement local
git pull origin main
npm run build

# Upload des nouveaux fichiers
rsync -avz --delete dist/ user@ftp.votre-domaine.com:www/
```

### Sauvegarde
- Sauvegardez régulièrement votre base de données
- Gardez une copie des fichiers de configuration

## 🔐 Sécurité

### Recommandations
- [ ] Utilisez HTTPS (certificat SSL OVH)
- [ ] Masquez les informations sensibles
- [ ] Mettez à jour régulièrement
- [ ] Surveillez les logs d'accès

### Variables sensibles
Ne jamais exposer :
- Mots de passe de base de données
- Clés API privées
- Tokens d'authentification

## 📞 Support

### Documentation OVH
- [Guide hébergement web](https://docs.ovh.com/fr/hosting/)
- [Gestionnaire de fichiers](https://docs.ovh.com/fr/hosting/mutualise-gestionnaire-de-fichiers/)
- [Base de données](https://docs.ovh.com/fr/hosting/creer-base-de-donnees/)

### Support technique
- **OVH** : Support client pour l'hébergement
- **Racha Business** : contact@rachabusiness.com

---

## ✅ Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Build de production réalisé
- [ ] Fichiers uploadés sur OVH
- [ ] .htaccess présent et configuré
- [ ] Base de données configurée (si nécessaire)
- [ ] Tests fonctionnels validés
- [ ] Performance vérifiée
- [ ] SSL/HTTPS activé
- [ ] Monitoring configuré

**🎉 Votre Racha Business CRM est maintenant déployé sur OVH !**
