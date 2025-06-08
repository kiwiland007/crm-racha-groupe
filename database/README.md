# Base de Données Racha Business CRM

## Configuration

### Informations de connexion
- **Base de données** : `admin_crm`
- **Serveur** : `localhost:3306`
- **Version** : MariaDB v10.3.39
- **Utilisateur** : `kiwiland`
- **Mot de passe** : `*H@dFcMq0q38nvrz`

### Charset et Collation
- **Charset** : `utf8mb4`
- **Collation** : `utf8mb4_unicode_ci`

## Installation

### 1. Créer la base de données
```sql
CREATE DATABASE IF NOT EXISTS admin_crm 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### 2. Exécuter le schéma
```bash
mysql -u kiwiland -p admin_crm < database/schema.sql
```

### 3. Vérifier l'installation
```sql
USE admin_crm;
SHOW TABLES;
```

## Structure des Tables

### Tables Utilisateurs
- `users` - Utilisateurs du système
- `user_sessions` - Sessions actives
- `user_permissions` - Permissions utilisateurs

### Tables CRM
- `companies` - Entreprises clientes
- `contacts` - Contacts clients
- `leads` - Prospects et leads

### Tables Produits/Services
- `products` - Catalogue produits
- `product_categories` - Catégories produits
- `services` - Catalogue services

### Tables Commerciales
- `quotes` - Devis
- `quote_items` - Éléments de devis
- `invoices` - Factures
- `invoice_items` - Éléments de factures
- `bon_livraison` - Bons de livraison
- `bon_livraison_items` - Éléments de BL

### Tables Gestion
- `tasks` - Tâches
- `events` - Événements/RDV

### Tables Configuration
- `company_settings` - Paramètres entreprise
- `integrations` - Intégrations tierces
- `api_keys` - Clés API

### Tables Système
- `audit_logs` - Logs d'audit
- `files` - Fichiers uploadés

## Utilisateurs par Défaut

### Comptes de démonstration
```sql
-- Administrateur
Email: admin@rachadigital.com
Mot de passe: admin

-- Manager
Email: manager@rachadigital.com
Mot de passe: demo123

-- Employé
Email: employee@rachadigital.com
Mot de passe: demo123
```

## Synchronisation

### Mode de fonctionnement
1. **Local First** : Toutes les données sont d'abord sauvegardées en localStorage
2. **Synchronisation automatique** : Les données sont synchronisées avec MySQL quand une connexion est disponible
3. **Mode hors ligne** : L'application fonctionne entièrement hors ligne avec localStorage
4. **Queue de synchronisation** : Les modifications hors ligne sont mises en queue et synchronisées lors de la reconnexion

### API Endpoints
```
POST /api/auth/login          - Connexion utilisateur
GET  /api/contacts            - Liste des contacts
POST /api/contacts            - Créer un contact
PUT  /api/contacts/:id        - Modifier un contact
DELETE /api/contacts/:id      - Supprimer un contact

GET  /api/quotes              - Liste des devis
POST /api/quotes              - Créer un devis
PUT  /api/quotes/:id          - Modifier un devis
GET  /api/quotes/:id/pdf      - Générer PDF devis

GET  /api/invoices            - Liste des factures
POST /api/invoices            - Créer une facture
PUT  /api/invoices/:id        - Modifier une facture
GET  /api/invoices/:id/pdf    - Générer PDF facture

GET  /api/bon-livraison       - Liste des BL
POST /api/bon-livraison       - Créer un BL
PUT  /api/bon-livraison/:id   - Modifier un BL
GET  /api/bon-livraison/:id/pdf - Générer PDF BL

GET  /api/products            - Liste des produits
POST /api/products            - Créer un produit
PUT  /api/products/:id        - Modifier un produit

GET  /api/services            - Liste des services
POST /api/services            - Créer un service
PUT  /api/services/:id        - Modifier un service

GET  /api/settings/company    - Paramètres entreprise
PUT  /api/settings/company    - Modifier paramètres

GET  /api/settings/integrations - Intégrations
PUT  /api/settings/integrations - Modifier intégrations

GET  /api/health              - Vérifier connexion DB
```

## Sécurité

### Authentification
- **JWT Tokens** : Authentification par tokens JWT
- **Refresh Tokens** : Renouvellement automatique des tokens
- **Sessions** : Gestion des sessions utilisateurs
- **Rate Limiting** : Limitation du nombre de requêtes

### Chiffrement
- **Mots de passe** : Hashés avec bcrypt (12 rounds)
- **Données sensibles** : Chiffrées en base
- **Communications** : HTTPS en production

### Audit
- **Logs d'audit** : Toutes les actions sont loggées
- **Traçabilité** : Qui a fait quoi et quand
- **IP Tracking** : Suivi des adresses IP

## Maintenance

### Sauvegardes
```bash
# Sauvegarde complète
mysqldump -u kiwiland -p admin_crm > backup_$(date +%Y%m%d_%H%M%S).sql

# Sauvegarde structure seule
mysqldump -u kiwiland -p --no-data admin_crm > structure_$(date +%Y%m%d).sql

# Sauvegarde données seules
mysqldump -u kiwiland -p --no-create-info admin_crm > data_$(date +%Y%m%d).sql
```

### Restauration
```bash
# Restaurer une sauvegarde
mysql -u kiwiland -p admin_crm < backup_20241208_120000.sql
```

### Optimisation
```sql
-- Analyser les tables
ANALYZE TABLE contacts, quotes, invoices, bon_livraison;

-- Optimiser les tables
OPTIMIZE TABLE contacts, quotes, invoices, bon_livraison;

-- Vérifier l'intégrité
CHECK TABLE contacts, quotes, invoices, bon_livraison;
```

### Monitoring
```sql
-- Taille des tables
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'admin_crm'
ORDER BY (data_length + index_length) DESC;

-- Nombre d'enregistrements
SELECT 
    table_name AS 'Table',
    table_rows AS 'Rows'
FROM information_schema.TABLES 
WHERE table_schema = 'admin_crm'
ORDER BY table_rows DESC;

-- Sessions actives
SELECT 
    COUNT(*) as active_sessions,
    MAX(created_at) as last_login
FROM user_sessions 
WHERE expires_at > NOW();
```

## Développement

### Variables d'environnement
```env
# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_NAME=admin_crm
DB_USER=kiwiland
DB_PASSWORD=*H@dFcMq0q38nvrz

# JWT
JWT_SECRET=racha-crm-secret-key-2024

# API
API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:3000
```

### Tests
```bash
# Tester la connexion
npm run test:db

# Tester les migrations
npm run test:migrations

# Tester l'API
npm run test:api
```

## Support

### Logs d'erreur
- **Application** : `logs/app.log`
- **Base de données** : `logs/db.log`
- **API** : `logs/api.log`

### Dépannage
1. **Connexion échouée** : Vérifier les credentials et la connectivité réseau
2. **Synchronisation lente** : Vérifier la taille de la queue et la bande passante
3. **Erreurs SQL** : Consulter les logs MySQL et vérifier l'intégrité des données
4. **Performance** : Analyser les requêtes lentes et optimiser les index

### Contact
- **Développeur** : Racha Digital Team
- **Email** : dev@rachadigital.com
- **Documentation** : https://docs.rachadigital.com/crm
