# 🗄️ GUIDE DE MIGRATION VERS BASE DE DONNÉES OVH

## 📋 **ÉTAPES DE MIGRATION**

### **1. PRÉPARATION DE LA BASE DE DONNÉES OVH**

#### **A. Création de la base de données**
1. Connectez-vous à votre **espace client OVH**
2. Accédez à **Hébergements Web** > **Votre hébergement**
3. Onglet **Bases de données** > **Créer une base de données**
4. Choisissez **MySQL 8.0** (recommandé)
5. Notez les informations de connexion :
   - **Serveur** : `mysql-xxx.pro.ovh.net`
   - **Base** : `nom_de_votre_base`
   - **Utilisateur** : `votre_utilisateur`
   - **Mot de passe** : `votre_mot_de_passe`

#### **B. Import du schéma**
1. Accédez à **phpMyAdmin** depuis l'espace client OVH
2. Sélectionnez votre base de données
3. Onglet **Importer**
4. Sélectionnez le fichier `database/schema.sql`
5. Cliquez sur **Exécuter**

### **2. CONFIGURATION DE L'API BACKEND**

#### **A. Structure recommandée**
```
api/
├── config/
│   ├── database.php
│   └── cors.php
├── controllers/
│   ├── UserController.php
│   ├── ContactController.php
│   ├── ProductController.php
│   ├── QuoteController.php
│   ├── InvoiceController.php
│   ├── BonLivraisonController.php
│   └── EventController.php
├── models/
│   ├── User.php
│   ├── Contact.php
│   ├── Product.php
│   └── ...
├── middleware/
│   ├── Auth.php
│   └── CORS.php
├── routes/
│   └── api.php
└── index.php
```

#### **B. Configuration de base (PHP)**

**config/database.php**
```php
<?php
class Database {
    private $host = 'mysql-xxx.pro.ovh.net';
    private $db_name = 'votre_base';
    private $username = 'votre_utilisateur';
    private $password = 'votre_mot_de_passe';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
        } catch(PDOException $exception) {
            echo "Erreur de connexion: " . $exception->getMessage();
        }
        return $this->conn;
    }
}
?>
```

**index.php**
```php
<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

require_once 'config/database.php';
require_once 'routes/api.php';

$database = new Database();
$db = $database->getConnection();

if ($db) {
    // Router les requêtes API
    $request_uri = $_SERVER['REQUEST_URI'];
    $path = parse_url($request_uri, PHP_URL_PATH);
    $path = str_replace('/api', '', $path);
    
    // Inclure le routeur
    handleApiRequest($path, $_SERVER['REQUEST_METHOD'], $db);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Erreur de connexion à la base de données"]);
}
?>
```

### **3. MIGRATION DES DONNÉES LOCALSTORAGE**

#### **A. Utilisation du service de migration**
```typescript
import { databaseService } from '@/services/databaseService';

// Configurer l'URL de l'API
const API_URL = 'https://votre-domaine.com/api';

// Tester la connexion
const testResult = await databaseService.testConnection();
if (testResult.success) {
    console.log('✅ Connexion API réussie');
    
    // Synchroniser toutes les données
    const syncResult = await databaseService.syncAllData();
    if (syncResult.success) {
        console.log('✅ Migration réussie');
    } else {
        console.error('❌ Erreurs de migration:', syncResult.errors);
    }
} else {
    console.error('❌ Connexion API échouée');
}
```

#### **B. Migration manuelle par étapes**
1. **Utilisateurs** : Exporter depuis localStorage → Importer en base
2. **Contacts** : Vérifier les relations et contraintes
3. **Catégories** : Maintenir la hiérarchie parent/enfant
4. **Produits** : Associer aux bonnes catégories
5. **Devis/Factures** : Préserver les liens entre documents
6. **Bons de livraison** : Associer aux factures correctes
7. **Événements** : Maintenir les assignations de techniciens

### **4. MISE À JOUR DE L'APPLICATION FRONTEND**

#### **A. Variables d'environnement**
Créer un fichier `.env.production` :
```env
VITE_API_URL=https://votre-domaine.com/api
VITE_APP_ENV=production
VITE_DB_ENABLED=true
```

#### **B. Modification des contextes**
Remplacer les appels localStorage par des appels API :
```typescript
// Avant (localStorage)
const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');

// Après (API)
const response = await databaseService.getContacts();
const contacts = response.success ? response.data : [];
```

### **5. DÉPLOIEMENT SUR OVH**

#### **A. Structure des fichiers sur l'hébergement**
```
www/
├── api/                 # API Backend (PHP)
├── assets/             # Fichiers statiques du frontend
├── index.html          # Application React
├── .htaccess          # Configuration Apache
└── database/          # Scripts SQL (optionnel)
```

#### **B. Configuration .htaccess**
```apache
# Redirection API
RewriteEngine On
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# SPA Routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(?!api).*$ index.html [QSA,L]
```

### **6. TESTS POST-MIGRATION**

#### **A. Tests fonctionnels**
- [ ] Connexion utilisateur
- [ ] CRUD Contacts
- [ ] CRUD Produits/Services
- [ ] Génération PDF (Devis, Factures, BL)
- [ ] Gestion événements
- [ ] Synchronisation données

#### **B. Tests de performance**
- [ ] Temps de chargement < 3s
- [ ] Requêtes API < 500ms
- [ ] Génération PDF < 2s

#### **C. Tests de sécurité**
- [ ] Authentification JWT
- [ ] Validation des données
- [ ] Protection CSRF
- [ ] Chiffrement HTTPS

### **7. SAUVEGARDE ET ROLLBACK**

#### **A. Sauvegarde automatique**
```bash
# Script de sauvegarde quotidienne
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -h mysql-xxx.pro.ovh.net -u user -p database > backup_$DATE.sql
```

#### **B. Plan de rollback**
1. Sauvegarder la base actuelle
2. Restaurer les données localStorage
3. Revenir à la version précédente
4. Tester les fonctionnalités critiques

### **8. MONITORING ET MAINTENANCE**

#### **A. Logs d'erreurs**
- Surveiller les logs PHP
- Monitorer les erreurs JavaScript
- Alertes en cas de panne

#### **B. Optimisations**
- Index de base de données
- Cache des requêtes
- Compression des réponses API
- CDN pour les assets statiques

---

## 🚀 **CHECKLIST DE MIGRATION**

### **Phase 1 : Préparation**
- [ ] Base de données OVH créée
- [ ] Schéma SQL importé
- [ ] API backend développée
- [ ] Tests de connexion réussis

### **Phase 2 : Migration**
- [ ] Données localStorage exportées
- [ ] Migration utilisateurs
- [ ] Migration contacts
- [ ] Migration produits/services
- [ ] Migration documents (devis, factures, BL)
- [ ] Migration événements

### **Phase 3 : Déploiement**
- [ ] Frontend buildé pour production
- [ ] Fichiers uploadés sur OVH
- [ ] Configuration .htaccess
- [ ] Tests fonctionnels complets

### **Phase 4 : Validation**
- [ ] Toutes les fonctionnalités testées
- [ ] Performance validée
- [ ] Sécurité vérifiée
- [ ] Sauvegarde configurée

---

## 📞 **SUPPORT**

En cas de problème lors de la migration :
1. Vérifiez les logs d'erreurs
2. Testez la connexion à la base de données
3. Validez la configuration de l'API
4. Contactez le support OVH si nécessaire

**L'application est prête pour la migration vers une base de données professionnelle !** 🎯
