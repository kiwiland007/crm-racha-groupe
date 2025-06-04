# 🚀 Guide de Déploiement - Racha Business CRM

## 📋 **Informations du Projet**

- **Nom** : Racha Business CRM
- **Version** : 1.0.0
- **Auteur** : Racha Business Group
- **Repository** : `racha-business-crm`

---

## 🔧 **Configuration Git**

### **Nouveau Repository GitHub**

```bash
# 1. Créer un nouveau repository sur GitHub
# Nom suggéré: racha-business-crm
# Description: Système de gestion CRM complet pour Racha Business Group

# 2. Configurer le remote
git remote add origin https://github.com/[USERNAME]/racha-business-crm.git

# 3. Pousser le code
git branch -M main
git push -u origin main
```

### **Repository Existant**

Si vous avez déjà un repository :

```bash
# Mettre à jour le remote
git remote set-url origin https://github.com/[USERNAME]/racha-business-crm.git

# Pousser les modifications
git push origin main
```

---

## 🌐 **Déploiement**

### **Option 1 : Vercel (Recommandé)**

```bash
# 1. Installer Vercel CLI
npm i -g vercel

# 2. Se connecter
vercel login

# 3. Déployer
vercel --prod
```

### **Option 2 : Netlify**

```bash
# 1. Build du projet
npm run build

# 2. Déployer le dossier dist/
# Via l'interface Netlify ou CLI
```

### **Option 3 : Serveur VPS**

```bash
# 1. Build de production
npm run build

# 2. Transférer les fichiers dist/ vers le serveur
scp -r dist/* user@server:/var/www/html/

# 3. Configurer Nginx/Apache
```

---

## 🔐 **Variables d'Environnement**

### **Production**

```env
VITE_APP_NAME="Racha Business CRM"
VITE_COMPANY_NAME="Racha Business Group"
VITE_COMPANY_LOGO="/racha-digital-logo.svg"
VITE_API_URL="https://api.rachabusiness.com"
VITE_ENVIRONMENT="production"
```

### **Staging**

```env
VITE_APP_NAME="Racha Business CRM - Staging"
VITE_COMPANY_NAME="Racha Business Group"
VITE_COMPANY_LOGO="/racha-digital-logo.svg"
VITE_API_URL="https://staging-api.rachabusiness.com"
VITE_ENVIRONMENT="staging"
```

---

## 📊 **Monitoring**

### **Analytics**

- Google Analytics
- Hotjar pour UX
- Sentry pour les erreurs

### **Performance**

- Lighthouse CI
- Web Vitals
- Bundle analyzer

---

## 🔄 **CI/CD**

### **GitHub Actions**

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run type-check
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🛡️ **Sécurité**

### **Headers de Sécurité**

```nginx
# Nginx configuration
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### **HTTPS**

- Certificat SSL/TLS obligatoire
- Redirection HTTP → HTTPS
- HSTS headers

---

## 📱 **PWA (Optionnel)**

Pour transformer en Progressive Web App :

```bash
# Installer Vite PWA plugin
npm install vite-plugin-pwa -D

# Configurer dans vite.config.ts
# Ajouter manifest.json
# Service worker pour cache offline
```

---

## 🔍 **Tests de Déploiement**

### **Checklist**

- [ ] Build sans erreurs
- [ ] TypeScript compilation OK
- [ ] Tests unitaires passent
- [ ] Lighthouse score > 90
- [ ] Responsive design testé
- [ ] Fonctionnalités critiques testées
- [ ] Performance acceptable
- [ ] SEO optimisé

### **Commandes de Test**

```bash
# Build et vérifications
npm run build
npm run type-check
npm run preview

# Tests de performance
npm run lighthouse
npm run bundle-analyzer
```

---

## 📞 **Support Post-Déploiement**

- **Monitoring** : Surveillance 24/7
- **Backups** : Sauvegarde quotidienne
- **Updates** : Mises à jour sécurisées
- **Support** : support@rachabusiness.com

---

<div align="center">
  <p><strong>Racha Business CRM</strong> - Prêt pour la production ! 🚀</p>
</div>
