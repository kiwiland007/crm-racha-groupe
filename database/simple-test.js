// Test simple de connexion MariaDB
import mysql from 'mysql2/promise';

const config = {
  host: 'localhost',
  port: 3306,
  user: 'kiwiland',
  password: 'a16rC_44t',
  database: 'admin_crm'
};

console.log('🔍 Test de connexion MariaDB...');
console.log(`Host: ${config.host}:${config.port}`);
console.log(`Database: ${config.database}`);
console.log(`User: ${config.user}`);
console.log('');

try {
  const connection = await mysql.createConnection(config);
  console.log('✅ Connexion réussie !');
  
  const [result] = await connection.execute('SELECT VERSION() as version');
  console.log(`📊 Version: ${result[0].version}`);
  
  const [dbResult] = await connection.execute('SELECT DATABASE() as db');
  console.log(`🗄️  Base: ${dbResult[0].db}`);
  
  await connection.end();
  console.log('✅ Test terminé avec succès !');
  
} catch (error) {
  console.log('❌ Erreur de connexion:');
  console.log(`   Code: ${error.code}`);
  console.log(`   Message: ${error.message}`);
  
  if (error.code === 'ECONNREFUSED') {
    console.log('💡 Suggestion: Vérifiez que MariaDB est démarré');
  } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('💡 Suggestion: Vérifiez les identifiants');
  }
}
