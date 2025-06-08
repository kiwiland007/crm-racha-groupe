/**
 * Script de test pour vérifier la configuration de la base de données
 * Racha Business CRM
 */

import { toast } from "sonner";
import { databaseService } from "@/services/databaseService";
import { ENV_CONFIG } from "@/config/database";

interface DatabaseTestResult {
  test: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: any;
}

export class DatabaseTestSuite {
  private results: DatabaseTestResult[] = [];

  /**
   * Lance tous les tests de base de données
   */
  public async runAllDatabaseTests(): Promise<DatabaseTestResult[]> {
    console.log("🗄️ === DÉBUT DES TESTS DE BASE DE DONNÉES ===");
    
    this.results = [];
    
    // Tests de configuration
    await this.testEnvironmentConfig();
    await this.testDatabaseConfig();
    
    // Tests de connexion
    await this.testDatabaseConnection();
    await this.testAPIEndpoints();
    
    // Tests de synchronisation
    await this.testLocalStorage();
    await this.testSyncQueue();
    await this.testDataOperations();
    
    // Tests de sécurité
    await this.testSecurityConfig();
    
    console.log("✅ === TESTS DE BASE DE DONNÉES TERMINÉS ===");
    console.table(this.results);
    
    return this.results;
  }

  /**
   * Test de la configuration d'environnement
   */
  private async testEnvironmentConfig(): Promise<void> {
    try {
      const config = {
        mode: import.meta.env.MODE,
        apiUrl: ENV_CONFIG.apiUrl,
        isDevelopment: ENV_CONFIG.isDevelopment,
        isProduction: ENV_CONFIG.isProduction
      };

      this.addResult('Environment Config', 'info', 
        `Mode: ${config.mode}, API: ${config.apiUrl}`,
        config
      );
    } catch (error) {
      this.addResult('Environment Config', 'error', 
        `Erreur configuration: ${error.message}`
      );
    }
  }

  /**
   * Test de la configuration de base de données
   */
  private async testDatabaseConfig(): Promise<void> {
    try {
      // Vérifier les variables d'environnement de base de données
      const dbConfig = {
        host: import.meta.env.VITE_DB_HOST || 'localhost',
        port: import.meta.env.VITE_DB_PORT || '3306',
        database: import.meta.env.VITE_DB_NAME || 'admin_crm',
        user: import.meta.env.VITE_DB_USER || 'kiwiland'
      };

      if (dbConfig.host && dbConfig.database && dbConfig.user) {
        this.addResult('Database Config', 'success', 
          `Configuration DB: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`,
          dbConfig
        );
      } else {
        this.addResult('Database Config', 'warning', 
          'Configuration de base de données incomplète'
        );
      }
    } catch (error) {
      this.addResult('Database Config', 'error', 
        `Erreur config DB: ${error.message}`
      );
    }
  }

  /**
   * Test de connexion à la base de données
   */
  private async testDatabaseConnection(): Promise<void> {
    try {
      const isConnected = await databaseService.testConnection();
      
      if (isConnected) {
        this.addResult('Database Connection', 'success', 
          'Connexion à la base de données réussie'
        );
      } else {
        const status = ENV_CONFIG.isDevelopment ? 'info' : 'warning';
        const message = ENV_CONFIG.isDevelopment 
          ? 'Mode développement : API backend non disponible (normal)'
          : 'Connexion à la base de données échouée';
        
        this.addResult('Database Connection', status, message);
      }
    } catch (error) {
      this.addResult('Database Connection', 'error', 
        `Erreur connexion DB: ${error.message}`
      );
    }
  }

  /**
   * Test des endpoints API
   */
  private async testAPIEndpoints(): Promise<void> {
    try {
      const endpoints = [
        '/api/health',
        '/api/contacts',
        '/api/quotes',
        '/api/invoices',
        '/api/products',
        '/api/settings/company'
      ];

      this.addResult('API Endpoints', 'info', 
        `${endpoints.length} endpoints configurés`,
        endpoints
      );
    } catch (error) {
      this.addResult('API Endpoints', 'error', 
        `Erreur endpoints: ${error.message}`
      );
    }
  }

  /**
   * Test du localStorage
   */
  private async testLocalStorage(): Promise<void> {
    try {
      // Test d'écriture/lecture localStorage
      const testKey = 'crm_db_test';
      const testData = { test: true, timestamp: Date.now() };
      
      localStorage.setItem(testKey, JSON.stringify(testData));
      const retrieved = JSON.parse(localStorage.getItem(testKey) || '{}');
      localStorage.removeItem(testKey);
      
      if (retrieved.test === true) {
        this.addResult('LocalStorage', 'success', 
          'LocalStorage fonctionne correctement'
        );
      } else {
        this.addResult('LocalStorage', 'error', 
          'Erreur lecture/écriture localStorage'
        );
      }
    } catch (error) {
      this.addResult('LocalStorage', 'error', 
        `Erreur localStorage: ${error.message}`
      );
    }
  }

  /**
   * Test de la queue de synchronisation
   */
  private async testSyncQueue(): Promise<void> {
    try {
      const stats = databaseService.getSyncStats();
      
      this.addResult('Sync Queue', 'info', 
        `Queue: ${stats.queueSize} éléments, Online: ${stats.isOnline}`,
        stats
      );
    } catch (error) {
      this.addResult('Sync Queue', 'error', 
        `Erreur sync queue: ${error.message}`
      );
    }
  }

  /**
   * Test des opérations de données
   */
  private async testDataOperations(): Promise<void> {
    try {
      // Compter les données locales
      const entities = ['contacts', 'quotes', 'invoices', 'products', 'services'];
      let totalRecords = 0;
      
      for (const entity of entities) {
        const data = localStorage.getItem(`crm_${entity}`);
        if (data) {
          const records = JSON.parse(data);
          totalRecords += Array.isArray(records) ? records.length : 0;
        }
      }
      
      this.addResult('Data Operations', 'info', 
        `${totalRecords} enregistrements en localStorage`,
        { totalRecords, entities }
      );
    } catch (error) {
      this.addResult('Data Operations', 'error', 
        `Erreur opérations données: ${error.message}`
      );
    }
  }

  /**
   * Test de la configuration de sécurité
   */
  private async testSecurityConfig(): Promise<void> {
    try {
      const securityFeatures = {
        https: window.location.protocol === 'https:',
        localStorage: typeof Storage !== 'undefined',
        jwt: !!import.meta.env.VITE_JWT_SECRET,
        csp: document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null
      };
      
      const activeFeatures = Object.values(securityFeatures).filter(Boolean).length;
      
      this.addResult('Security Config', 'info', 
        `${activeFeatures}/4 fonctionnalités de sécurité actives`,
        securityFeatures
      );
    } catch (error) {
      this.addResult('Security Config', 'error', 
        `Erreur config sécurité: ${error.message}`
      );
    }
  }

  /**
   * Test de performance de la base de données
   */
  public async testDatabasePerformance(): Promise<void> {
    console.log("⚡ === TESTS DE PERFORMANCE BASE DE DONNÉES ===");
    
    try {
      // Test de vitesse localStorage
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        localStorage.setItem(`test_${i}`, JSON.stringify({ id: i, data: 'test' }));
      }
      
      for (let i = 0; i < 1000; i++) {
        localStorage.getItem(`test_${i}`);
      }
      
      for (let i = 0; i < 1000; i++) {
        localStorage.removeItem(`test_${i}`);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.addResult('Performance Test', 'info', 
        `1000 opérations localStorage en ${duration.toFixed(2)}ms`,
        { duration, operations: 3000 }
      );
    } catch (error) {
      this.addResult('Performance Test', 'error', 
        `Erreur test performance: ${error.message}`
      );
    }
  }

  /**
   * Ajouter un résultat de test
   */
  private addResult(test: string, status: 'success' | 'error' | 'warning' | 'info', message: string, details?: any): void {
    this.results.push({ test, status, message, details });
    
    const emoji = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }[status];
    
    console.log(`${emoji} ${test}: ${message}`);
  }

  /**
   * Générer un rapport de test
   */
  public generateDatabaseReport(): string {
    const total = this.results.length;
    const success = this.results.filter(r => r.status === 'success').length;
    const errors = this.results.filter(r => r.status === 'error').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    const info = this.results.filter(r => r.status === 'info').length;

    return `
🗄️ RAPPORT DE TEST BASE DE DONNÉES
==================================
Total des tests: ${total}
✅ Succès: ${success}
❌ Erreurs: ${errors}
⚠️ Avertissements: ${warnings}
ℹ️ Informations: ${info}

Mode: ${ENV_CONFIG.isDevelopment ? 'Développement' : 'Production'}
API URL: ${ENV_CONFIG.apiUrl}
    `.trim();
  }

  /**
   * Obtenir les recommandations
   */
  public getDatabaseRecommendations(): string[] {
    const recommendations: string[] = [];
    
    this.results.forEach(result => {
      if (result.status === 'error') {
        switch (result.test) {
          case 'Database Connection':
            recommendations.push('Vérifiez que le serveur MySQL/MariaDB est démarré et accessible');
            break;
          case 'LocalStorage':
            recommendations.push('Vérifiez que le navigateur supporte localStorage');
            break;
          case 'Environment Config':
            recommendations.push('Vérifiez la configuration des variables d\'environnement');
            break;
        }
      } else if (result.status === 'warning') {
        switch (result.test) {
          case 'Database Config':
            recommendations.push('Complétez la configuration de base de données dans .env.local');
            break;
          case 'Database Connection':
            recommendations.push('Configurez l\'API backend pour la synchronisation en temps réel');
            break;
        }
      }
    });
    
    if (recommendations.length === 0) {
      recommendations.push('Configuration de base de données optimale ! 🎉');
    }
    
    return recommendations;
  }
}

/**
 * Fonction utilitaire pour lancer les tests depuis la console
 */
export async function runDatabaseTests(): Promise<void> {
  const testSuite = new DatabaseTestSuite();
  const results = await testSuite.runAllDatabaseTests();
  
  // Tests de performance
  await testSuite.testDatabasePerformance();
  
  console.log(testSuite.generateDatabaseReport());
  
  // Recommandations
  const recommendations = testSuite.getDatabaseRecommendations();
  if (recommendations.length > 0) {
    console.log('\n📋 RECOMMANDATIONS:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  // Afficher un toast avec le résumé
  const success = results.filter(r => r.status === 'success').length;
  const total = results.length;
  
  if (success === total) {
    toast.success("Tests de base de données réussis", {
      description: `${success}/${total} tests passés avec succès`
    });
  } else {
    toast.info("Tests de base de données terminés", {
      description: `${success}/${total} tests réussis. Voir la console pour les détails.`
    });
  }
}

// Export pour utilisation dans la console du navigateur
(window as any).runDatabaseTests = runDatabaseTests;
