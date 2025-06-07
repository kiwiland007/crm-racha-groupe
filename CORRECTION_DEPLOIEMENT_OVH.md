# 🔧 Correction du Déploiement OVH - Erreur Node.js

## 🚨 **Problème Identifié**

L'erreur indique que le serveur OVH essaie d'exécuter les fichiers source TypeScript/React (`src/App.tsx`) au lieu des fichiers buildés pour la production.

```
SyntaxError: Cannot use import statement outside a module
    at /var/www/vhosts/rachadigital.com/crm.rachadigital.com/src/App.tsx:1
```

## 🎯 **Cause du Problème**

1. **Mauvais déploiement** : Les fichiers source (`src/`) ont été uploadés au lieu du build (`dist/`)
2. **Configuration serveur** : Le serveur pointe vers les sources au lieu des fichiers statiques
3. **Type d'application** : OVH traite l'app comme une app Node.js au lieu d'une SPA React

## ✅ **Solution : Déploiement Correct**

### **Étape 1 : Préparer le Build Local**

```bash
# Dans votre environnement de développement
npm run build

# Vérifier que le dossier dist/ est créé
ls -la dist/
```

### **Étape 2 : Vérifier le Contenu du Build**

Le dossier `dist/` doit contenir :
- ✅ `index.html` (point d'entrée)
- ✅ `assets/` (fichiers JS/CSS buildés)
- ✅ `images/` (assets statiques)
- ✅ `.htaccess` (configuration Apache)
- ✅ `robots.txt`, favicons, etc.

### **Étape 3 : Nettoyer le Serveur OVH**

#### **Via Gestionnaire de Fichiers OVH**
1. Connectez-vous à l'espace client OVH
2. Accédez au gestionnaire de fichiers
3. Naviguez vers `crm.rachadigital.com/`
4. **SUPPRIMEZ TOUT** le contenu existant (surtout le dossier `src/`)

#### **Via FTP/SFTP**
```bash
# Connexion FTP
Host: 217.182.70.41
User: crm@rachadigital.com
Password: G13c8c_f3

# Supprimer tout le contenu du dossier web
```

### **Étape 4 : Déployer Uniquement le Build**

#### **Méthode 1 : Gestionnaire de Fichiers OVH**
1. Uploadez **UNIQUEMENT** le contenu du dossier `dist/`
2. **NE PAS** uploader les dossiers `src/`, `node_modules/`, etc.
3. Assurez-vous que `index.html` est à la racine

#### **Méthode 2 : FTP/SFTP**
```bash
# Upload du contenu de dist/ vers la racine web
scp -r dist/* crm@rachadigital.com@217.182.70.41:httpdocs/

# Ou avec rsync
rsync -avz --delete dist/ crm@rachadigital.com@217.182.70.41:httpdocs/
```

#### **Méthode 3 : Script Automatique**
```bash
# Utiliser le script de correction
./deploy-ovh-fix.sh
```

### **Étape 5 : Configurer .htaccess**

Créez un fichier `.htaccess` à la racine avec ce contenu :

```apache
# Configuration Apache pour React SPA
RewriteEngine On

# Forcer HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirection SPA - toutes les routes vers index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]

# Cache des assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 week"
    ExpiresByType application/javascript "access plus 1 week"
    ExpiresByType text/html "access plus 0 seconds"
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>

# Erreurs personnalisées
ErrorDocument 404 /index.html
ErrorDocument 403 /index.html
```

## 🔍 **Vérification du Déploiement**

### **Structure Correcte sur le Serveur**
```
httpdocs/
├── index.html          ✅ Point d'entrée React
├── .htaccess          ✅ Configuration Apache
├── assets/            ✅ Fichiers JS/CSS buildés
│   ├── index-xxx.js   ✅ JavaScript principal
│   ├── index-xxx.css  ✅ Styles CSS
│   └── ...            ✅ Autres chunks
├── images/            ✅ Assets statiques
├── robots.txt         ✅ SEO
└── favicon.ico        ✅ Icône
```

### **Structure INCORRECTE (à éviter)**
```
httpdocs/
├── src/               ❌ Fichiers source (à supprimer)
├── node_modules/      ❌ Dépendances (à supprimer)
├── package.json       ❌ Config npm (à supprimer)
├── vite.config.ts     ❌ Config build (à supprimer)
└── ...                ❌ Autres fichiers de dev
```

## 🧪 **Tests de Validation**

### **1. Test de Fichiers**
```bash
# Vérifier via SSH
ssh crm@rachadigital.com@217.182.70.41
cd httpdocs
ls -la

# Doit afficher :
# index.html, .htaccess, assets/, images/, etc.
# PAS de src/, node_modules/, package.json
```

### **2. Test HTTP**
```bash
# Test de connectivité
curl -I https://crm.rachadigital.com

# Doit retourner : HTTP/1.1 200 OK
```

### **3. Test dans le Navigateur**
- Ouvrir : https://crm.rachadigital.com
- Vérifier que l'application React se charge
- Tester la navigation (routes SPA)

## 🚨 **Erreurs Communes à Éviter**

### **❌ Erreur 1 : Uploader les Sources**
```
# NE PAS faire ceci :
scp -r . crm@rachadigital.com@217.182.70.41:httpdocs/
```

### **❌ Erreur 2 : Mauvais Répertoire**
```
# Vérifier le bon répertoire :
# httpdocs/ (ou www/ selon la config OVH)
```

### **❌ Erreur 3 : Oublier .htaccess**
```
# Sans .htaccess, les routes React ne fonctionnent pas
```

## ✅ **Commandes de Déploiement Correctes**

### **Déploiement Complet**
```bash
# 1. Build local
npm run build

# 2. Nettoyage distant (optionnel)
ssh crm@rachadigital.com@217.182.70.41 "cd httpdocs && rm -rf *"

# 3. Upload du build uniquement
rsync -avz --delete dist/ crm@rachadigital.com@217.182.70.41:httpdocs/

# 4. Vérification
curl -I https://crm.rachadigital.com
```

### **Déploiement avec Script**
```bash
# Utiliser le script de correction
./deploy-ovh-fix.sh
```

## 🎯 **Résultat Attendu**

Après correction :
- ✅ **URL** : https://crm.rachadigital.com fonctionne
- ✅ **Application** : React CRM se charge correctement
- ✅ **Routes** : Navigation SPA fonctionnelle
- ✅ **Assets** : CSS/JS chargés depuis `/assets/`
- ✅ **Performance** : Cache et compression actifs

## 📞 **Support**

Si le problème persiste :
1. Vérifiez la configuration DNS du domaine
2. Assurez-vous que le certificat SSL est actif
3. Contactez le support OVH si nécessaire
4. Vérifiez les logs d'erreur Apache

---

**🎉 Après ces corrections, votre Racha Business CRM devrait fonctionner parfaitement sur OVH !**
