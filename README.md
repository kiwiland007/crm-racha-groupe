# Racha Business CRM

## Project info

**Description**: Système de gestion CRM pour Racha Business Group - Solutions complètes de gestion d'entreprise

## Comment modifier ce code ?

Plusieurs façons de modifier cette application.

**Utiliser votre IDE préféré**

Vous pouvez cloner ce repo et pousser les changements.

La seule exigence est d'avoir Node.js et npm installés - [installer avec nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Suivez ces étapes :

```sh
# Étape 1: Cloner le repository
git clone https://github.com/kiwiland007/racha-business-crm.git

# Étape 2: Naviguer vers le répertoire du projet
cd racha-business-crm

# Étape 3: Installer les dépendances nécessaires
npm i

# Étape 4: Démarrer le serveur de développement
npm run dev
```

**Modifier un fichier directement dans GitHub**

- Naviguer vers le(s) fichier(s) désiré(s).
- Cliquer sur le bouton "Edit" (icône crayon) en haut à droite de la vue du fichier.
- Faire vos changements et commiter les modifications.

**Utiliser GitHub Codespaces**

- Naviguer vers la page principale de votre repository.
- Cliquer sur le bouton "Code" (bouton vert) près du coin supérieur droit.
- Sélectionner l'onglet "Codespaces".
- Cliquer sur "New codespace" pour lancer un nouvel environnement Codespace.
- Modifier les fichiers directement dans le Codespace et commiter et pousser vos changements une fois terminé.

## Quelles technologies sont utilisées pour ce projet ?

Ce projet est construit avec :

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Hook Form
- Zod (Validation)
- Lucide React (Icônes)

## Comment déployer ce projet ?

### Déploiement sur Cloudflare Pages (Recommandé)

1. **Préparer le projet pour la production :**
```sh
npm run build
```

2. **Déployer sur Cloudflare Pages :**
   - Connectez votre repository GitHub à Cloudflare Pages
   - Configuration de build :
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`
     - **Root directory:** `/`

3. **Variables d'environnement (optionnelles) :**
   - Configurez dans le dashboard Cloudflare Pages si nécessaire

### Autres plateformes supportées :

- **Vercel** - Déploiement automatique depuis GitHub
- **Netlify** - Configuration similaire à Cloudflare
- **GitHub Pages** - Pour les projets publics
- **Serveur VPS** - Servir les fichiers statiques du dossier `dist`

## Fonctionnalités principales

### 🔐 **Authentification & Sécurité**
- Système de connexion sécurisé avec 3 niveaux d'accès (Admin, Manager, Employé)
- Gestion des profils utilisateurs avec modification des informations
- Protection des routes et persistance de session
- Comptes de démonstration intégrés

### 📊 **Dashboard Intelligent**
- Vue d'ensemble personnalisée avec salutation utilisateur
- Statistiques en temps réel (CA, factures, clients, etc.)
- 3 onglets spécialisés : Vue générale, Ventes, Opérations
- Alertes automatiques pour stock critique et factures impayées

### 👥 **Gestion CRM Complète**
- **Contacts** : CRUD complet avec import/export
- **Devis** : Génération, PDF, WhatsApp, suivi des statuts
- **Factures** : Avances, PDF professionnel, modification
- **Événements** : Planification avec réservation matériel

### 📦 **Inventaire & Produits**
- **Produits** : Filtres avancés par catégorie, stock, prix
- **Services** : Durées en jours, techniciens assignés
- **Fiches techniques** : PDF détaillé, images, spécifications
- **Catégories** : Gestion flexible produits/services

### 💰 **Gestion Commerciale**
- **PDF professionnels** : Logo, informations légales marocaines
- **WhatsApp intégré** : Messages automatiques pour tous contacts
- **Calculs précis** : TVA, remises, avances, formatage français
- **Suivi complet** : Statuts, échéances, relances

### 🎨 **Interface Moderne**
- Design responsive adapté mobile/desktop
- Filtres intelligents avec badges visuels
- Menus déroulants avec actions complètes
- Notifications toast informatives

## 🎯 **Comptes de démonstration**

L'application inclut 3 comptes de test avec différents niveaux d'accès :

### 👨‍💼 **Administrateur**
- **Email** : `youssef@rachabusiness.com`
- **Mot de passe** : `demo123`
- **Accès** : Complet à toutes les fonctionnalités

### 👩‍💼 **Manager Commercial**
- **Email** : `fatima@rachabusiness.com`
- **Mot de passe** : `demo123`
- **Accès** : Fonctions commerciales étendues

### 👨‍🔧 **Employé Technique**
- **Email** : `sara@rachabusiness.com`
- **Mot de passe** : `demo123`
- **Accès** : Fonctions opérationnelles standard

## 🚀 **Déploiement rapide**

Utilisez le script de déploiement optimisé :

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Lancer le déploiement
./deploy.sh
```

Le script vérifie automatiquement :
- ✅ Prérequis (Node.js, npm)
- ✅ Syntaxe TypeScript
- ✅ Standards de code (ESLint)
- ✅ Build de production
- ✅ Fichiers critiques
- ✅ Optimisations

## 📊 **Performances & Optimisations**

### ⚡ **Optimisations techniques**
- Configuration centralisée dans `src/config/app.ts`
- Composants React.memo pour les performances
- Validation des données PDF avec gestion d'erreurs
- Formatage des nombres selon les standards français
- Lazy loading et code splitting

### 🔧 **Gestion d'erreurs**
- Validation complète des données avant génération PDF
- Gestion des erreurs réseau et API
- Messages d'erreur informatifs pour l'utilisateur
- Logs de débogage en mode développement

### 📱 **Responsive Design**
- Interface adaptée mobile/tablette/desktop
- Menus optimisés pour écrans tactiles
- Filtres et actions accessibles sur mobile
- Navigation intuitive sur tous supports
