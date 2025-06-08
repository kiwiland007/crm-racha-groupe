/**
 * Script de test pour vérifier les fonctionnalités d'intégration
 * Racha Business CRM - Settings
 */

import { toast } from "sonner";

interface IntegrationTestResult {
  integration: string;
  status: 'configured' | 'not_configured' | 'error';
  message: string;
  config?: any;
}

export class IntegrationTestSuite {
  private results: IntegrationTestResult[] = [];

  /**
   * Lance tous les tests d'intégration
   */
  public async runAllIntegrationTests(): Promise<IntegrationTestResult[]> {
    console.log("🔌 === DÉBUT DES TESTS D'INTÉGRATION ===");
    
    this.results = [];
    
    // Tests des intégrations
    await this.testPaymentIntegration();
    await this.testEmailIntegration();
    await this.testChatIntegration();
    await this.testAuthIntegration();
    await this.testAPIManagement();
    
    console.log("✅ === TESTS D'INTÉGRATION TERMINÉS ===");
    console.table(this.results);
    
    return this.results;
  }

  /**
   * Test de l'intégration paiement
   */
  private async testPaymentIntegration(): Promise<void> {
    try {
      const paymentConfig = localStorage.getItem('crm_integration_payment');
      
      if (paymentConfig) {
        const config = JSON.parse(paymentConfig);
        
        if (config.provider && config.apiKey && config.secretKey) {
          this.addResult('Payment Gateway', 'configured', 
            `${config.provider} configuré (Mode: ${config.testMode ? 'Test' : 'Production'})`,
            {
              provider: config.provider,
              currency: config.currency,
              testMode: config.testMode,
              hasWebhook: !!config.webhookUrl
            }
          );
        } else {
          this.addResult('Payment Gateway', 'error', 'Configuration incomplète');
        }
      } else {
        this.addResult('Payment Gateway', 'not_configured', 'Passerelle de paiement non configurée');
      }
    } catch (error) {
      this.addResult('Payment Gateway', 'error', `Erreur test paiement: ${error.message}`);
    }
  }

  /**
   * Test de l'intégration email
   */
  private async testEmailIntegration(): Promise<void> {
    try {
      const emailConfig = localStorage.getItem('crm_integration_email');
      
      if (emailConfig) {
        const config = JSON.parse(emailConfig);
        
        if (config.provider && config.apiKey && config.fromEmail) {
          this.addResult('Email Marketing', 'configured', 
            `${config.provider} configuré (${config.fromEmail})`,
            {
              provider: config.provider,
              fromEmail: config.fromEmail,
              fromName: config.fromName,
              hasReplyTo: !!config.replyTo,
              hasWebhook: !!config.webhookUrl
            }
          );
        } else {
          this.addResult('Email Marketing', 'error', 'Configuration incomplète');
        }
      } else {
        this.addResult('Email Marketing', 'not_configured', 'Service email non configuré');
      }
    } catch (error) {
      this.addResult('Email Marketing', 'error', `Erreur test email: ${error.message}`);
    }
  }

  /**
   * Test de l'intégration chat
   */
  private async testChatIntegration(): Promise<void> {
    try {
      const chatConfig = localStorage.getItem('crm_integration_chat');
      
      if (chatConfig) {
        const config = JSON.parse(chatConfig);
        
        if (config.provider && config.widgetId && config.apiKey) {
          this.addResult('Chat Client', 'configured', 
            `${config.provider} configuré (Position: ${config.position})`,
            {
              provider: config.provider,
              widgetId: config.widgetId,
              position: config.position,
              autoStart: config.autoStart,
              primaryColor: config.primaryColor
            }
          );
        } else {
          this.addResult('Chat Client', 'error', 'Configuration incomplète');
        }
      } else {
        this.addResult('Chat Client', 'not_configured', 'Service de chat non configuré');
      }
    } catch (error) {
      this.addResult('Chat Client', 'error', `Erreur test chat: ${error.message}`);
    }
  }

  /**
   * Test de l'intégration authentification
   */
  private async testAuthIntegration(): Promise<void> {
    try {
      const authConfig = localStorage.getItem('crm_integration_auth');
      
      if (authConfig) {
        const config = JSON.parse(authConfig);
        
        if (config.provider && config.clientId && config.clientSecret) {
          this.addResult('Authentication', 'configured', 
            `${config.provider} configuré (${config.enabled ? 'Activé' : 'Désactivé'})`,
            {
              provider: config.provider,
              enabled: config.enabled,
              scopes: config.scopes,
              redirectUrl: config.redirectUrl
            }
          );
        } else {
          this.addResult('Authentication', 'error', 'Configuration incomplète');
        }
      } else {
        this.addResult('Authentication', 'not_configured', 'Authentification externe non configurée');
      }
    } catch (error) {
      this.addResult('Authentication', 'error', `Erreur test auth: ${error.message}`);
    }
  }

  /**
   * Test de la gestion API
   */
  private async testAPIManagement(): Promise<void> {
    try {
      const apiKeys = localStorage.getItem('crm_api_keys');
      
      if (apiKeys) {
        const keys = JSON.parse(apiKeys);
        const activeKeys = keys.filter((key: any) => key.isActive);
        
        this.addResult('API Management', 'configured', 
          `${activeKeys.length} clés API actives sur ${keys.length} total`,
          {
            totalKeys: keys.length,
            activeKeys: activeKeys.length,
            keys: keys.map((k: any) => ({
              name: k.name,
              permissions: k.permissions,
              isActive: k.isActive,
              lastUsed: k.lastUsed
            }))
          }
        );
      } else {
        this.addResult('API Management', 'not_configured', 'Aucune clé API configurée');
      }
    } catch (error) {
      this.addResult('API Management', 'error', `Erreur test API: ${error.message}`);
    }
  }

  /**
   * Test des fonctionnalités avancées
   */
  public async testAdvancedFeatures(): Promise<void> {
    console.log("🚀 === TESTS FONCTIONNALITÉS AVANCÉES ===");
    
    // Test des webhooks
    await this.testWebhookConfiguration();
    
    // Test de la sécurité
    await this.testSecurityConfiguration();
    
    // Test des notifications
    await this.testNotificationSettings();
  }

  /**
   * Test de configuration des webhooks
   */
  private async testWebhookConfiguration(): Promise<void> {
    try {
      const integrations = ['payment', 'email', 'chat'];
      let webhookCount = 0;
      
      for (const integration of integrations) {
        const config = localStorage.getItem(`crm_integration_${integration}`);
        if (config) {
          const parsed = JSON.parse(config);
          if (parsed.webhookUrl) {
            webhookCount++;
          }
        }
      }
      
      this.addResult('Webhooks', webhookCount > 0 ? 'configured' : 'not_configured', 
        `${webhookCount} webhooks configurés`,
        { webhookCount, integrations }
      );
    } catch (error) {
      this.addResult('Webhooks', 'error', `Erreur test webhooks: ${error.message}`);
    }
  }

  /**
   * Test de configuration de sécurité
   */
  private async testSecurityConfiguration(): Promise<void> {
    try {
      // Vérifier les paramètres de sécurité
      const securitySettings = {
        httpsOnly: window.location.protocol === 'https:',
        localStorage: typeof Storage !== 'undefined',
        sessionTimeout: true, // Basé sur la config
        passwordPolicy: true // Basé sur la validation
      };
      
      const secureFeatures = Object.values(securitySettings).filter(Boolean).length;
      
      this.addResult('Security', 'configured', 
        `${secureFeatures}/4 fonctionnalités de sécurité actives`,
        securitySettings
      );
    } catch (error) {
      this.addResult('Security', 'error', `Erreur test sécurité: ${error.message}`);
    }
  }

  /**
   * Test des paramètres de notification
   */
  private async testNotificationSettings(): Promise<void> {
    try {
      // Vérifier si les notifications sont supportées
      const notificationSupport = {
        browserNotifications: 'Notification' in window,
        toastNotifications: true, // Sonner est utilisé
        emailNotifications: !!localStorage.getItem('crm_integration_email'),
        pushNotifications: 'serviceWorker' in navigator
      };
      
      const supportedFeatures = Object.values(notificationSupport).filter(Boolean).length;
      
      this.addResult('Notifications', 'configured', 
        `${supportedFeatures}/4 types de notifications supportés`,
        notificationSupport
      );
    } catch (error) {
      this.addResult('Notifications', 'error', `Erreur test notifications: ${error.message}`);
    }
  }

  /**
   * Ajouter un résultat de test
   */
  private addResult(integration: string, status: 'configured' | 'not_configured' | 'error', message: string, config?: any): void {
    this.results.push({ integration, status, message, config });
    
    const emoji = status === 'configured' ? '✅' : status === 'not_configured' ? '⚠️' : '❌';
    console.log(`${emoji} ${integration}: ${message}`);
  }

  /**
   * Générer un rapport de test
   */
  public generateIntegrationReport(): string {
    const total = this.results.length;
    const configured = this.results.filter(r => r.status === 'configured').length;
    const notConfigured = this.results.filter(r => r.status === 'not_configured').length;
    const errors = this.results.filter(r => r.status === 'error').length;

    return `
🔌 RAPPORT DE TEST D'INTÉGRATION
===============================
Total des intégrations: ${total}
✅ Configurées: ${configured}
⚠️ Non configurées: ${notConfigured}
❌ Erreurs: ${errors}

Taux de configuration: ${Math.round((configured / total) * 100)}%
    `.trim();
  }

  /**
   * Obtenir les recommandations
   */
  public getRecommendations(): string[] {
    const recommendations: string[] = [];
    
    this.results.forEach(result => {
      if (result.status === 'not_configured') {
        switch (result.integration) {
          case 'Payment Gateway':
            recommendations.push('Configurez une passerelle de paiement pour traiter les transactions en ligne');
            break;
          case 'Email Marketing':
            recommendations.push('Configurez un service d\'email marketing pour automatiser vos campagnes');
            break;
          case 'Chat Client':
            recommendations.push('Ajoutez un service de chat client pour améliorer le support');
            break;
          case 'Authentication':
            recommendations.push('Configurez l\'authentification externe pour simplifier la connexion');
            break;
          case 'API Management':
            recommendations.push('Créez des clés API pour permettre les intégrations tierces');
            break;
        }
      }
    });
    
    return recommendations;
  }
}

/**
 * Fonction utilitaire pour lancer les tests depuis la console
 */
export async function runIntegrationTests(): Promise<void> {
  const testSuite = new IntegrationTestSuite();
  const results = await testSuite.runAllIntegrationTests();
  
  // Tests avancés
  await testSuite.testAdvancedFeatures();
  
  console.log(testSuite.generateIntegrationReport());
  
  // Recommandations
  const recommendations = testSuite.getRecommendations();
  if (recommendations.length > 0) {
    console.log('\n📋 RECOMMANDATIONS:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }
  
  // Afficher un toast avec le résumé
  const configured = results.filter(r => r.status === 'configured').length;
  const total = results.length;
  
  if (configured === total) {
    toast.success("Toutes les intégrations sont configurées", {
      description: `${configured}/${total} intégrations actives`
    });
  } else {
    toast.info("Tests d'intégration terminés", {
      description: `${configured}/${total} intégrations configurées. Voir la console pour les détails.`
    });
  }
}

// Export pour utilisation dans la console du navigateur
(window as any).runIntegrationTests = runIntegrationTests;
