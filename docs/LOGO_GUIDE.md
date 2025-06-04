# Guide d'Utilisation du Logo Racha Digital

## 📋 **Vue d'ensemble**

Le système de logo Racha Digital CRM comprend plusieurs variants et tailles pour s'adapter à tous les contextes d'utilisation.

## 🎨 **Assets Disponibles**

### **Fichiers Logo**
```
public/
├── racha-digital-logo.svg          # Logo complet (300x80px)
├── racha-digital-logo-compact.svg  # Logo compact (200x60px)
└── favicon-racha.svg               # Favicon (32x32px)
```

### **Composant React**
```
src/components/ui/logo.tsx          # Composant réutilisable
```

## 🔧 **Utilisation du Composant**

### **Import**
```tsx
import Logo from '@/components/ui/logo';
```

### **Variants Disponibles**

#### **1. Logo Complet**
```tsx
<Logo variant="full" size="lg" />
```
- **Usage** : Page de connexion, footer, documents officiels
- **Contient** : Icône + texte "RACHA DIGITAL" complet

#### **2. Logo Compact**
```tsx
<Logo variant="compact" size="md" />
```
- **Usage** : Header, navigation, espaces restreints
- **Contient** : Icône + texte "RACHA" et "DIGITAL" empilés

#### **3. Icône Seule**
```tsx
<Logo variant="icon" size="sm" showText={false} />
```
- **Usage** : Favicon, boutons, indicateurs
- **Contient** : Icône uniquement

### **Tailles Disponibles**

| Taille | Classe CSS | Usage Recommandé |
|--------|------------|------------------|
| `sm` | `h-6` | Boutons, icônes |
| `md` | `h-8 md:h-10` | Header, navigation |
| `lg` | `h-12 md:h-16` | Page de connexion |
| `xl` | `h-16 md:h-20` | Landing page, hero |

### **Exemples d'Utilisation**

#### **Header Principal**
```tsx
<Logo variant="compact" size="md" />
```

#### **Page de Connexion**
```tsx
<Logo variant="full" size="lg" />
```

#### **Favicon**
```tsx
<Logo variant="icon" size="sm" />
```

#### **Avec Classes Personnalisées**
```tsx
<Logo 
  variant="compact" 
  size="md" 
  className="hover:opacity-80 transition-opacity" 
/>
```

## 🎨 **Spécifications Design**

### **Couleurs**
- **Principal** : `#40E0D0` (Turquoise)
- **Secondaire** : `#666666` (Gris)
- **Fond** : `#FFFFFF` (Blanc)

### **Typographie**
- **Police** : Arial, sans-serif
- **Poids** : Bold pour "RACHA", Normal pour "DIGITAL"

### **Icône**
- **Style** : Nœuds connectés représentant un réseau
- **Symbolisme** : Connectivité, solutions digitales, CRM

## 📱 **Responsive Design**

Le composant s'adapte automatiquement :
```tsx
// Taille mobile : h-8, Taille desktop : h-10
<Logo variant="compact" size="md" />
```

## 🔍 **Bonnes Pratiques**

### **✅ À Faire**
- Utiliser `variant="compact"` dans les headers
- Utiliser `variant="full"` pour les pages importantes
- Respecter les tailles recommandées
- Maintenir les proportions originales

### **❌ À Éviter**
- Ne pas déformer le logo
- Ne pas changer les couleurs sans raison
- Ne pas utiliser le logo complet dans des espaces restreints
- Ne pas superposer d'autres éléments sur le logo

## 🛠 **Maintenance**

### **Mise à Jour des Assets**
1. Remplacer les fichiers SVG dans `public/`
2. Tester tous les variants
3. Vérifier la compatibilité responsive

### **Modification du Composant**
1. Éditer `src/components/ui/logo.tsx`
2. Maintenir la compatibilité des props
3. Tester tous les cas d'usage

## 📊 **Performances**

- **Format** : SVG (vectoriel, léger)
- **Taille** : ~2-5 KB par fichier
- **Chargement** : Optimisé pour le web
- **Cache** : Mis en cache par le navigateur

---

**Dernière mise à jour** : 2025-01-27  
**Version** : 1.0.1
