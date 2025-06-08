# Guide de Déploiement - Racha Business CRM

## 🚀 Déploiement Rapide

### Prérequis
- Node.js 18+ 
- npm 9+
- Git

### Scripts de Déploiement Automatisés

#### Linux/macOS
```bash
chmod +x deploy.sh
./deploy.sh
```

#### Windows (PowerShell)
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\deploy.ps1
```

## 📋 Étapes Manuelles

### 1. Préparation
```bash
# Cloner le repository
git clone https://github.com/kiwiland007/crm-racha-groupe.git
cd crm-racha-groupe

# Installer les dépendances
npm install

# Nettoyer le cache
npm run clean
```

### 2. Configuration
```bash
# Copier le fichier d'environnement
cp .env.example .env.local

# Éditer les variables d'environnement
# VITE_API_URL=https://votre-api.com
# VITE_DB_HOST=votre-host
# etc.
```

### 3. Build de Production
```bash
# Build optimisé
npm run build

# Vérifier le build
ls -la dist/
```

### 4. Test Local
```bash
# Servir le build localement
npm run preview
# ou
npx serve dist
```

## 🌐 Options de Déploiement

### Option 1: Cloudflare Pages (Recommandé)

#### Configuration Cloudflare
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Node.js version**: `18`

#### Variables d'environnement Cloudflare
```
VITE_API_URL=https://api.rachabusiness.com
VITE_DB_HOST=votre-host-db
VITE_DB_NAME=admin_crm
VITE_JWT_SECRET=votre-secret-jwt
```

#### Déploiement automatique
1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déploiement automatique à chaque push

### Option 2: Serveur Web Traditionnel

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteBase /

# Handle Angular and Vue.js routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Compress files
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /path/to/dist;
    index index.html;

    # Handle SPA routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Option 3: Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Option 4: Netlify
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🗄️ Configuration Base de Données

### MySQL/MariaDB Setup
```sql
-- 1. Créer la base de données
CREATE DATABASE admin_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Créer l'utilisateur
CREATE USER 'kiwiland'@'localhost' IDENTIFIED BY '*H@dFcMq0q38nvrz';
GRANT ALL PRIVILEGES ON admin_crm.* TO 'kiwiland'@'localhost';
FLUSH PRIVILEGES;

-- 3. Importer le schéma
mysql -u kiwiland -p admin_crm < database/schema.sql
```

### Variables d'environnement Backend
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=admin_crm
DB_USER=kiwiland
DB_PASSWORD=*H@dFcMq0q38nvrz
JWT_SECRET=racha-crm-secret-key-2024
```

## 🔧 Configuration Serveur

### Headers de Sécurité
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS (Recommandé)
- Utiliser Let's Encrypt pour les certificats gratuits
- Rediriger HTTP vers HTTPS
- Configurer HSTS

## 📊 Monitoring et Maintenance

### Logs
- Surveiller les erreurs JavaScript
- Monitorer les performances
- Analyser les métriques utilisateur

### Sauvegardes
```bash
# Sauvegarde base de données
mysqldump -u kiwiland -p admin_crm > backup_$(date +%Y%m%d).sql

# Sauvegarde fichiers
tar -czf backup_files_$(date +%Y%m%d).tar.gz dist/
```

### Mises à jour
```bash
# Mettre à jour le code
git pull origin main

# Réinstaller les dépendances
npm ci

# Rebuild
npm run build

# Redéployer
```

## 🧪 Tests de Déploiement

### Checklist Post-Déploiement
- [ ] Application accessible via HTTPS
- [ ] Toutes les routes fonctionnent
- [ ] Authentification opérationnelle
- [ ] Base de données connectée
- [ ] Intégrations configurées
- [ ] Performance acceptable (< 3s)
- [ ] Responsive design
- [ ] Pas d'erreurs console

### Tests Automatisés
```bash
# Tests dans l'interface
# Aller sur /settings et cliquer sur :
# 🧪 Test Auth
# 🔌 Test Intégrations  
# 🗄️ Test DB
```

## 🆘 Dépannage

### Problèmes Courants

#### 1. Erreur 404 sur les routes
**Solution**: Configurer le serveur pour servir `index.html` pour toutes les routes

#### 2. Erreurs CORS
**Solution**: Configurer les headers CORS sur l'API backend

#### 3. Base de données inaccessible
**Solution**: Vérifier les credentials et la connectivité réseau

#### 4. Performance lente
**Solution**: Activer la compression gzip et optimiser les images

### Logs Utiles
```bash
# Logs serveur web
tail -f /var/log/nginx/error.log

# Logs application (console navigateur)
F12 → Console

# Logs base de données
tail -f /var/log/mysql/error.log
```

## 📞 Support

- **Documentation**: [docs.rachadigital.com/crm](https://docs.rachadigital.com/crm)
- **Issues**: [GitHub Issues](https://github.com/kiwiland007/crm-racha-groupe/issues)
- **Email**: dev@rachadigital.com

---

**✅ Déploiement réussi = CRM Racha Business Group opérationnel !** 🎉
