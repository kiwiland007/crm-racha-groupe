# 🚀 Racha Business CRM

<div align="center">
  <img src="public/racha-digital-logo.svg" alt="Racha Digital" width="300">
  
  **Système de gestion CRM complet pour Racha Business Group**
  
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan.svg)](https://tailwindcss.com/)
</div>

---

## 📋 **Description**

**Racha Business CRM** est un système de gestion client complet développé pour Racha Business Group. Il offre une solution moderne et intuitive pour gérer tous les aspects de votre entreprise : clients, produits, devis, factures, inventaire et bien plus.

### ✨ **Fonctionnalités Principales**

- 👥 **Gestion des contacts** - Base de données clients complète
- 📦 **Catalogue produits/services** - Gestion avancée avec catégories
- 📋 **Devis et factures** - Génération PDF professionnelle
- 📊 **Inventaire intelligent** - Suivi stock avec codes QR
- 📅 **Planification événements** - Gestion complète des projets
- 💬 **Intégration WhatsApp** - Communication client directe
- 📄 **Fiches techniques** - Documentation produits détaillée
- 🚚 **Bons de livraison** - Gestion logistique complète

---

## 🛠 **Technologies**

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Routing** | React Router v6 |
| **Forms** | React Hook Form, Zod |
| **PDF** | jsPDF, html2canvas |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **QR Codes** | qrcode.react |

---

## 🚀 **Installation**

### **Prérequis**
- Node.js 18+ 
- npm ou yarn
- Git

### **Installation rapide**

```bash
# 1. Cloner le repository
git clone https://github.com/rachabusiness/racha-business-crm.git

# 2. Naviguer vers le projet
cd racha-business-crm

# 3. Installer les dépendances
npm install

# 4. Lancer en mode développement
npm run dev

# 5. Ouvrir dans le navigateur
# http://localhost:8080
```

### **Scripts disponibles**

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run type-check   # Vérification TypeScript
npm run lint         # Linter ESLint
```

---

## 🎯 **Utilisation**

### **Première connexion**

L'application utilise un système d'authentification local. Créez votre premier utilisateur via la gestion des utilisateurs dans les paramètres.

### **Navigation**

- **Dashboard** - Vue d'ensemble des activités
- **Contacts** - Gestion de la clientèle
- **Produits/Services** - Catalogue complet
- **Devis** - Création et suivi des devis
- **Factures** - Facturation et paiements
- **Inventaire** - Gestion des stocks
- **Événements** - Planification projets
- **Paramètres** - Configuration système

---

## 📱 **Responsive Design**

L'application est entièrement responsive et optimisée pour :
- 💻 **Desktop** - Interface complète
- 📱 **Mobile** - Navigation tactile optimisée
- 📟 **Tablet** - Expérience adaptée

---

## 🔧 **Configuration**

### **Variables d'environnement**

Créez un fichier `.env.local` :

```env
VITE_APP_NAME="Racha Business CRM"
VITE_COMPANY_NAME="Racha Business Group"
VITE_COMPANY_LOGO="/racha-digital-logo.svg"
```

### **Personnalisation**

- **Logo** : Remplacez les fichiers dans `public/`
- **Couleurs** : Modifiez `tailwind.config.ts`
- **Données** : Configurez les données par défaut dans `src/contexts/`

---

## 📦 **Structure du projet**

```
src/
├── components/          # Composants réutilisables
├── contexts/           # Contextes React (état global)
├── pages/              # Pages de l'application
├── services/           # Services (PDF, API, etc.)
├── types/              # Types TypeScript
├── utils/              # Utilitaires
└── lib/                # Configuration des librairies
```

---

## 🚀 **DÉPLOIEMENT - PROJET PRÊT**

### **✅ STATUT : PRÊT POUR LA PRODUCTION**

Le projet Racha Business CRM est **100% prêt** pour le déploiement !

### **📦 Build Optimisé**
- ✅ **Taille** : ~2.3 MB (optimisé)
- ✅ **Chunks** : Code splitting activé
- ✅ **Compression** : Gzip ~221 kB
- ✅ **Performance** : Optimisé pour la production

### **🌐 Plateformes Recommandées**

#### **1. Cloudflare Pages (Recommandé)**
```bash
# Configuration
Build command: npm run build
Output directory: dist
Node version: 18+
```

#### **2. Vercel / Netlify**
```bash
# Même configuration
Build command: npm run build
Publish directory: dist
```

### **🚀 Déploiement Rapide**

Le dossier `dist/` est prêt avec tous les assets optimisés. Uploadez simplement ce dossier sur votre plateforme de déploiement.

### **📋 Fonctionnalités Déployées**
- ✅ CRM complet (Contacts, Produits, Devis, Factures)
- ✅ Gestion d'inventaire avec QR codes
- ✅ Génération PDF automatique
- ✅ Interface responsive mobile/desktop
- ✅ Logo Racha Digital intégré
- ✅ Base de données localStorage
- ✅ Interface d'administration
- ✅ Intégration WhatsApp
- ✅ Tableau de bord analytique

---

## 🤝 **Contribution**

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📄 **Licence**

Ce projet est sous licence propriétaire - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 📞 **Support**

- **Email** : support@rachabusiness.com
- **Website** : [rachabusiness.com](https://rachabusiness.com)
- **Documentation** : [docs.rachabusiness.com](https://docs.rachabusiness.com)

---

<div align="center">
  <p>Développé avec ❤️ par <strong>Racha Business Group</strong></p>
  <p>© 2025 Racha Business Group. Tous droits réservés.</p>
</div>
