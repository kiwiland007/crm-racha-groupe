#!/usr/bin/env node

/**
 * Script de test de connexion à la base de données MariaDB
 * Usage: node test-connection.js
 */

const mysql = require('mysql2/promise');

// Configuration de la base de données
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'admin_crm',
  user: process.env.DB_USER || 'your_username',
  password: process.env.DB_PASSWORD || 'your_password',
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Couleurs pour les messages
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testConnection() {
  log('🔍 Test de connexion à la base de données MariaDB', 'cyan');
  log('================================================', 'cyan');
  
  let connection;
  
  try {
    // Afficher la configuration (sans le mot de passe)
    log('\n📋 Configuration:', 'blue');
    log(`   Host: ${DB_CONFIG.host}`, 'blue');
    log(`   Port: ${DB_CONFIG.port}`, 'blue');
    log(`   Database: ${DB_CONFIG.database}`, 'blue');
    log(`   User: ${DB_CONFIG.user}`, 'blue');
    log(`   Password: ${'*'.repeat(DB_CONFIG.password.length)}`, 'blue');
    
    // Tentative de connexion
    log('\n🔌 Tentative de connexion...', 'yellow');
    connection = await mysql.createConnection(DB_CONFIG);
    
    log('✅ Connexion établie avec succès!', 'green');
    
    // Test de la version
    log('\n🔍 Vérification de la version...', 'yellow');
    const [versionRows] = await connection.execute('SELECT VERSION() as version');
    const version = versionRows[0].version;
    log(`   Version: ${version}`, 'green');
    
    // Test des privilèges
    log('\n🔐 Vérification des privilèges...', 'yellow');
    const [privilegeRows] = await connection.execute('SHOW GRANTS FOR CURRENT_USER()');
    log(`   Privilèges: ${privilegeRows.length} entrées trouvées`, 'green');
    
    // Test de la base de données
    log('\n🗄️  Vérification de la base de données...', 'yellow');
    const [dbRows] = await connection.execute('SELECT DATABASE() as current_db');
    const currentDb = dbRows[0].current_db;
    log(`   Base de données actuelle: ${currentDb}`, 'green');
    
    // Test des tables
    log('\n📊 Vérification des tables...', 'yellow');
    const [tableRows] = await connection.execute('SHOW TABLES');
    log(`   Nombre de tables: ${tableRows.length}`, 'green');
    
    if (tableRows.length > 0) {
      log('   Tables trouvées:', 'green');
      tableRows.forEach(row => {
        const tableName = Object.values(row)[0];
        log(`     - ${tableName}`, 'green');
      });
    } else {
      log('   ⚠️  Aucune table trouvée - base de données vide', 'yellow');
    }
    
    // Test de performance
    log('\n⚡ Test de performance...', 'yellow');
    const startTime = Date.now();
    await connection.execute('SELECT 1');
    const endTime = Date.now();
    log(`   Temps de réponse: ${endTime - startTime}ms`, 'green');
    
    // Test des variables système importantes
    log('\n⚙️  Variables système importantes...', 'yellow');
    const [varRows] = await connection.execute(`
      SELECT 
        VARIABLE_NAME, 
        VARIABLE_VALUE 
      FROM INFORMATION_SCHEMA.GLOBAL_VARIABLES 
      WHERE VARIABLE_NAME IN (
        'max_connections',
        'innodb_buffer_pool_size',
        'query_cache_size',
        'max_allowed_packet'
      )
    `);
    
    varRows.forEach(row => {
      log(`   ${row.VARIABLE_NAME}: ${row.VARIABLE_VALUE}`, 'green');
    });
    
    log('\n🎉 Tous les tests sont passés avec succès!', 'green');
    log('   La base de données est prête à être utilisée.', 'green');
    
  } catch (error) {
    log('\n❌ Erreur de connexion:', 'red');
    log(`   ${error.message}`, 'red');
    
    // Suggestions de dépannage
    log('\n🔧 Suggestions de dépannage:', 'yellow');
    
    if (error.code === 'ECONNREFUSED') {
      log('   - Vérifiez que MariaDB/MySQL est démarré', 'yellow');
      log('   - Vérifiez le host et le port', 'yellow');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      log('   - Vérifiez le nom d\'utilisateur et le mot de passe', 'yellow');
      log('   - Vérifiez les privilèges de l\'utilisateur', 'yellow');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      log('   - Vérifiez que la base de données existe', 'yellow');
      log('   - Créez la base de données si nécessaire', 'yellow');
    }
    
    process.exit(1);
    
  } finally {
    if (connection) {
      await connection.end();
      log('\n🔌 Connexion fermée.', 'blue');
    }
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  log(`\n💥 Erreur non gérée: ${error.message}`, 'red');
  process.exit(1);
});

// Exécution du test
if (require.main === module) {
  testConnection();
}

module.exports = { testConnection, DB_CONFIG };
