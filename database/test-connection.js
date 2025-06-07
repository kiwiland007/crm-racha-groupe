#!/usr/bin/env node

/**
 * Script de test de connexion MariaDB
 * Racha Business CRM - Version 1.0.0
 */

import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration de la base de données
const DB_CONFIG = {
  host: 'localhost',
  port: 3306,
  user: 'kiwiland',
  password: 'a16rC_44t',
  database: 'admin_crm',
  charset: 'utf8mb4',
  timezone: '+00:00',
  connectTimeout: 30000,
  acquireTimeout: 30000,
  timeout: 30000
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

// Fonctions utilitaires
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  header: (msg) => {
    console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);
    console.log(`${colors.cyan}  ${msg}${colors.reset}`);
    console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}`);
    console.log('');
  }
};

// Test de connexion principal
async function testConnection() {
  let connection = null;
  
  try {
    log.info('Tentative de connexion à MariaDB...');
    log.info(`Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`);
    log.info(`Database: ${DB_CONFIG.database}`);
    log.info(`User: ${DB_CONFIG.user}`);
    
    // Créer la connexion
    connection = await mysql.createConnection(DB_CONFIG);
    
    log.success('Connexion établie avec succès!');
    
    // Tester une requête simple
    const [versionResult] = await connection.execute('SELECT VERSION() as version');
    log.success(`Version MariaDB: ${versionResult[0].version}`);
    
    // Vérifier la base de données
    const [dbResult] = await connection.execute('SELECT DATABASE() as current_db');
    log.success(`Base de données actuelle: ${dbResult[0].current_db}`);
    
    return true;
    
  } catch (error) {
    log.error('Erreur de connexion:');
    log.error(`  Code: ${error.code || 'UNKNOWN'}`);
    log.error(`  Message: ${error.message}`);
    
    // Suggestions d'erreurs communes
    if (error.code === 'ECONNREFUSED') {
      log.warning('Suggestions:');
      log.warning('  - Vérifiez que MariaDB est démarré');
      log.warning('  - Vérifiez le port 3306');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      log.warning('Suggestions:');
      log.warning('  - Vérifiez le nom d\'utilisateur et mot de passe');
      log.warning('  - Vérifiez les permissions de l\'utilisateur');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      log.warning('Suggestions:');
      log.warning('  - Vérifiez que la base de données existe');
      log.warning('  - Créez la base de données si nécessaire');
    }
    
    return false;
    
  } finally {
    if (connection) {
      await connection.end();
      log.info('Connexion fermée');
    }
  }
}

// Vérifier les tables existantes
async function checkTables() {
  let connection = null;
  
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    
    log.info('Vérification des tables...');
    
    const [tables] = await connection.execute('SHOW TABLES');
    
    if (tables.length === 0) {
      log.warning('Aucune table trouvée dans la base de données');
      log.info('Exécutez le script mysql-schema.sql pour créer les tables');
      return false;
    }
    
    log.success(`${tables.length} table(s) trouvée(s):`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`  ✓ ${tableName}`);
    });
    
    // Vérifier quelques tables importantes
    const importantTables = ['users', 'contacts', 'products', 'quotes', 'invoices'];
    const existingTables = tables.map(t => Object.values(t)[0]);
    
    log.info('Vérification des tables importantes:');
    importantTables.forEach(table => {
      if (existingTables.includes(table)) {
        log.success(`  ✓ ${table}`);
      } else {
        log.warning(`  ✗ ${table} (manquante)`);
      }
    });
    
    return true;
    
  } catch (error) {
    log.error(`Erreur lors de la vérification des tables: ${error.message}`);
    return false;
    
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Obtenir des statistiques de base
async function getStats() {
  let connection = null;
  
  try {
    connection = await mysql.createConnection(DB_CONFIG);
    
    log.info('Collecte des statistiques...');
    
    // Statistiques des tables
    const [tableStats] = await connection.execute(`
      SELECT 
        TABLE_NAME as table_name,
        TABLE_ROWS as row_count,
        ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) as size_mb
      FROM information_schema.TABLES 
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME
    `, [DB_CONFIG.database]);
    
    if (tableStats.length > 0) {
      console.log('\nStatistiques des tables:');
      console.log('┌─────────────────────┬──────────┬────────────┐');
      console.log('│ Table               │ Lignes   │ Taille(MB) │');
      console.log('├─────────────────────┼──────────┼────────────┤');
      
      tableStats.forEach(stat => {
        const name = stat.table_name.padEnd(19);
        const rows = String(stat.row_count || 0).padStart(8);
        const size = String(stat.size_mb || 0).padStart(10);
        console.log(`│ ${name} │ ${rows} │ ${size} │`);
      });
      
      console.log('└─────────────────────┴──────────┴────────────┘');
    }
    
    // Statistiques générales si les tables existent
    const tables = ['contacts', 'products', 'quotes', 'invoices'];
    const existingTables = tableStats.map(t => t.table_name);
    
    for (const table of tables) {
      if (existingTables.includes(table)) {
        try {
          const [count] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
          log.info(`${table}: ${count[0].count} enregistrement(s)`);
        } catch (err) {
          log.warning(`Impossible de compter les enregistrements de ${table}`);
        }
      }
    }
    
    return true;
    
  } catch (error) {
    log.error(`Erreur lors de la collecte des statistiques: ${error.message}`);
    return false;
    
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Créer un rapport de test
async function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    database: {
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      database: DB_CONFIG.database,
      user: DB_CONFIG.user
    },
    tests: {
      connection: false,
      tables: false,
      stats: false
    },
    errors: []
  };
  
  try {
    // Test de connexion
    report.tests.connection = await testConnection();
    
    if (report.tests.connection) {
      // Test des tables
      report.tests.tables = await checkTables();
      
      // Statistiques
      report.tests.stats = await getStats();
    }
    
  } catch (error) {
    report.errors.push(error.message);
  }
  
  // Sauvegarder le rapport
  const reportPath = path.join(__dirname, 'connection-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  log.info(`Rapport sauvegardé: ${reportPath}`);
  
  return report;
}

// Fonction principale
async function main() {
  log.header('TEST DE CONNEXION MARIADB - RACHA BUSINESS CRM');
  
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Usage: node test-connection.js [options]');
    console.log('');
    console.log('Options:');
    console.log('  --connection    Tester seulement la connexion');
    console.log('  --tables        Vérifier seulement les tables');
    console.log('  --stats         Afficher seulement les statistiques');
    console.log('  --report        Générer un rapport complet');
    console.log('  --help, -h      Afficher cette aide');
    return;
  }
  
  try {
    if (args.includes('--connection')) {
      await testConnection();
    } else if (args.includes('--tables')) {
      await checkTables();
    } else if (args.includes('--stats')) {
      await getStats();
    } else if (args.includes('--report')) {
      await generateReport();
    } else {
      // Test complet par défaut
      const connectionOk = await testConnection();
      
      if (connectionOk) {
        console.log('');
        await checkTables();
        console.log('');
        await getStats();
      }
    }
    
    console.log('');
    log.success('Test terminé!');
    
  } catch (error) {
    log.error(`Erreur inattendue: ${error.message}`);
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  log.error('Erreur non gérée:');
  console.error(reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log.error('Exception non capturée:');
  console.error(error);
  process.exit(1);
});

// Exécuter le script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  testConnection,
  checkTables,
  getStats,
  generateReport,
  DB_CONFIG
};
