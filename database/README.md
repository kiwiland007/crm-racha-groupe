# 🗄️ Configuration Base de Données MariaDB - Racha Business CRM

## 📋 **INFORMATIONS DE CONNEXION**

### **Serveur MariaDB**
- **Host** : `localhost`
- **Port** : `3306`
- **Version** : MariaDB v10.3.39+
- **Base de données** : `admin_crm`
- **Utilisateur** : `kiwiland`
- **Mot de passe** : `a16rC_44t`

### **URL de Connexion**
```
mysql://kiwiland:a16rC_44t@localhost:3306/admin_crm
```

---

## 🚀 **DÉPLOIEMENT RAPIDE**

### **Option 1 : Script Automatique (Linux/Mac)**
```bash
cd database/
chmod +x *.sh
./quick-deploy.sh
```

### **Option 2 : Déploiement Manuel**
```bash
# 1. Connexion à MariaDB
mysql -h localhost -P 3306 -u kiwiland -p

# 2. Créer la base de données
CREATE DATABASE IF NOT EXISTS admin_crm CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE admin_crm;

# 3. Importer le schéma
mysql -h localhost -P 3306 -u kiwiland -p admin_crm < mysql-schema.sql
```

### **Option 3 : Test avec Node.js**
```bash
# Installer mysql2 si nécessaire
npm install mysql2

# Tester la connexion
node test-connection.js
```

---

## 📁 **FICHIERS DISPONIBLES**

### **Scripts de Déploiement**
- `quick-deploy.sh` - Déploiement automatique rapide
- `deploy-mysql.sh` - Déploiement complet avec options
- `connect-mariadb.sh` - Utilitaire de connexion et gestion

### **Schéma et Configuration**
- `mysql-schema.sql` - Schéma complet de la base de données
- `database-config.json` - Configuration pour l'application
- `test-connection.js` - Script de test Node.js

### **Documentation**
- `README.md` - Ce fichier
- `TABLES.md` - Documentation des tables (à créer)

---

## 🔧 **UTILISATION DES SCRIPTS**

### **Script de Connexion**
```bash
# Test rapide
./connect-mariadb.sh --check

# Session interactive
./connect-mariadb.sh --interactive

# Statistiques
./connect-mariadb.sh --stats

# Sauvegarde
./connect-mariadb.sh --backup

# Menu complet
./connect-mariadb.sh
```

### **Test Node.js**
```bash
# Test complet
node test-connection.js

# Test connexion seulement
node test-connection.js --connection

# Vérifier les tables
node test-connection.js --tables

# Statistiques
node test-connection.js --stats

# Générer un rapport
node test-connection.js --report
```

---

## 📊 **STRUCTURE DE LA BASE**

### **Tables Principales**
- `users` - Utilisateurs du système
- `contacts` - Contacts et clients
- `products` - Catalogue produits
- `services` - Services proposés
- `quotes` - Devis
- `invoices` - Factures
- `delivery_notes` - Bons de livraison

### **Tables Support**
- `product_categories` - Catégories de produits
- `quote_items` - Éléments de devis
- `invoice_items` - Éléments de factures
- `events` - Événements et rendez-vous
- `tasks` - Tâches
- `inventory` - Inventaire
- `notifications` - Notifications
- `audit_logs` - Logs d'audit
- `system_settings` - Paramètres système

### **Vues et Procédures**
- `quote_stats` - Statistiques des devis
- `low_stock_products` - Produits en stock faible
- `CreateInvoiceFromQuote()` - Créer facture depuis devis
- `CleanOldAuditLogs()` - Nettoyage des logs
- `GetDashboardStats()` - Statistiques tableau de bord

---

## 🔐 **SÉCURITÉ**

### **Permissions Utilisateur**
L'utilisateur `kiwiland` a les permissions suivantes :
- `ALL PRIVILEGES` sur la base `admin_crm`
- `PROCESS` pour les statistiques
- Accès depuis `localhost` et `%` (toutes IPs)

### **Recommandations**
- Changez le mot de passe en production
- Limitez l'accès réseau si nécessaire
- Activez SSL pour les connexions distantes
- Configurez des sauvegardes automatiques

---

## 💾 **SAUVEGARDE ET RESTAURATION**

### **Sauvegarde Manuelle**
```bash
# Sauvegarde complète
mysqldump -h localhost -u kiwiland -p admin_crm > backup_$(date +%Y%m%d).sql

# Sauvegarde avec compression
mysqldump -h localhost -u kiwiland -p admin_crm | gzip > backup_$(date +%Y%m%d).sql.gz
```

### **Restauration**
```bash
# Depuis un fichier SQL
mysql -h localhost -u kiwiland -p admin_crm < backup_20241219.sql

# Depuis un fichier compressé
gunzip -c backup_20241219.sql.gz | mysql -h localhost -u kiwiland -p admin_crm
```

### **Sauvegarde Automatique**
Le script `connect-mariadb.sh` inclut une fonction de sauvegarde automatique qui :
- Crée des sauvegardes horodatées
- Compresse automatiquement
- Nettoie les anciennes sauvegardes (garde 10 dernières)

---

## 🔍 **DÉPANNAGE**

### **Erreurs Communes**

#### **Connexion Refusée**
```
ERROR 2003 (HY000): Can't connect to MySQL server
```
**Solutions :**
- Vérifiez que MariaDB est démarré
- Vérifiez le port 3306
- Vérifiez les paramètres réseau

#### **Accès Refusé**
```
ERROR 1045 (28000): Access denied for user
```
**Solutions :**
- Vérifiez le nom d'utilisateur et mot de passe
- Vérifiez les permissions de l'utilisateur
- Recréez l'utilisateur si nécessaire

#### **Base de Données Inexistante**
```
ERROR 1049 (42000): Unknown database
```
**Solutions :**
- Créez la base de données
- Vérifiez le nom de la base
- Importez le schéma

### **Commandes de Diagnostic**
```bash
# Vérifier le statut MariaDB
systemctl status mariadb  # Linux
brew services list | grep mariadb  # Mac

# Vérifier les processus
ps aux | grep mysql

# Vérifier les ports
netstat -tlnp | grep 3306

# Logs MariaDB
tail -f /var/log/mysql/error.log  # Linux
tail -f /usr/local/var/mysql/*.err  # Mac
```

---

## 📈 **MONITORING ET PERFORMANCE**

### **Requêtes Utiles**
```sql
-- Statistiques des tables
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as 'Size (MB)'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'admin_crm';

-- Processus actifs
SHOW PROCESSLIST;

-- Variables système
SHOW VARIABLES LIKE 'max_connections';
SHOW STATUS LIKE 'Threads_connected';

-- Requêtes lentes
SHOW VARIABLES LIKE 'slow_query_log';
```

### **Optimisation**
- Index sur les colonnes fréquemment recherchées
- Nettoyage régulier des logs d'audit
- Analyse périodique des tables
- Monitoring de l'utilisation mémoire

---

## 🔄 **INTÉGRATION APPLICATION**

### **Configuration Node.js**
```javascript
const mysql = require('mysql2/promise');

const config = {
  host: 'localhost',
  port: 3306,
  user: 'kiwiland',
  password: 'a16rC_44t',
  database: 'admin_crm',
  charset: 'utf8mb4'
};
```

### **Configuration PHP**
```php
$pdo = new PDO(
    'mysql:host=localhost;port=3306;dbname=admin_crm;charset=utf8mb4',
    'kiwiland',
    'a16rC_44t'
);
```

### **Configuration Python**
```python
import mysql.connector

config = {
    'host': 'localhost',
    'port': 3306,
    'user': 'kiwiland',
    'password': 'a16rC_44t',
    'database': 'admin_crm',
    'charset': 'utf8mb4'
}
```

---

## 📞 **SUPPORT**

### **Contacts**
- **Email** : support@rachabusiness.com
- **Documentation** : Voir les fichiers dans `/database/`
- **Logs** : Vérifiez les logs MariaDB pour les erreurs

### **Ressources**
- [Documentation MariaDB](https://mariadb.com/docs/)
- [Guide MySQL/MariaDB](https://dev.mysql.com/doc/)
- [Optimisation Performance](https://mariadb.com/kb/en/optimization-and-tuning/)

---

## ✅ **CHECKLIST DE DÉPLOIEMENT**

- [ ] MariaDB installé et démarré
- [ ] Base de données `admin_crm` créée
- [ ] Utilisateur `kiwiland` créé avec permissions
- [ ] Schéma importé (toutes les tables)
- [ ] Test de connexion réussi
- [ ] Configuration application mise à jour
- [ ] Sauvegarde configurée
- [ ] Monitoring en place

---

**Racha Business CRM - Base de Données Prête pour la Production** 🚀
