/**
 * Service de synchronisation avec la base de données MySQL/MariaDB
 * Racha Business CRM
 */

import {
  API_ENDPOINTS,
  buildApiUrl,
  getAuthHeaders,
  QueryResult,
  PaginatedResult,
  PaginationParams,
  ENV_CONFIG,
  AppConfig // Import AppConfig
} from '@/config/database';
import { toast } from 'sonner';

export class DatabaseService {
  private static instance: DatabaseService;
  private isOnline: boolean = navigator.onLine;
  private syncQueue: Array<{ action: string; data: unknown; timestamp: number }> = [];

  constructor() {
    // Écouter les changements de connexion
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processSyncQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Effectuer une requête HTTP vers l'API
   */
  private async makeRequest<T>(
    method: string,
    url: string,
    data?: unknown
  ): Promise<QueryResult<T>> {
    try {
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        ...(data && { body: JSON.stringify(data) })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Database request error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  /**
   * Synchroniser les données avec la base de données
   */
  public async syncData(entity: string, action: 'create' | 'update' | 'delete', data: unknown): Promise<boolean> {
    if (!this.isOnline) {
      // Ajouter à la queue de synchronisation
      this.syncQueue.push({
        action: `${action}_${entity}`,
        data,
        timestamp: Date.now()
      });
      
      // Sauvegarder la queue dans localStorage
      localStorage.setItem('crm_sync_queue', JSON.stringify(this.syncQueue));
      
      toast.warning('Mode hors ligne', {
        description: 'Les données seront synchronisées lors de la reconnexion'
      });
      
      return false;
    }

    try {
      const endpoint = this.getEndpointForEntity(entity);
      let url = buildApiUrl(endpoint);
      let method = 'POST';

      switch (action) {
        case 'create':
          method = 'POST';
          break;
        case 'update':
          method = 'PUT';
          url = buildApiUrl(endpoint.replace(':id', (data as { id: string }).id));
          break;
        case 'delete':
          method = 'DELETE';
          url = buildApiUrl(endpoint.replace(':id', (data as { id: string }).id));
          break;
      }

      const result = await this.makeRequest(method, url, action !== 'delete' ? data : undefined);
      
      if (result.success) {
        toast.success('Données synchronisées', {
          description: `${entity} ${action === 'create' ? 'créé' : action === 'update' ? 'modifié' : 'supprimé'} avec succès`
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Erreur de synchronisation', {
        description: error instanceof Error ? error.message : 'Erreur inconnue'
      });
      return false;
    }
  }

  /**
   * Récupérer des données depuis la base de données
   */
  public async fetchData<T>(
    entity: string, 
    params?: PaginationParams & Record<string, string | number | boolean | undefined>
  ): Promise<QueryResult<PaginatedResult<T>>> {
    try {
      const endpoint = this.getEndpointForEntity(entity);
      let url = buildApiUrl(endpoint);
      
      if (params) {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (params[key] !== undefined) {
            searchParams.append(key, String(params[key]));
          }
        });
        url += `?${searchParams.toString()}`;
      }

      return await this.makeRequest<PaginatedResult<T>>('GET', url);
    } catch (error) {
      console.error('Fetch error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur de récupération' 
      };
    }
  }

  /**
   * Sauvegarder les paramètres de l'entreprise
   */
  public async saveCompanySettings(settings: AppConfig['company']): Promise<boolean> {
    try {
      // Sauvegarder localement d'abord
      localStorage.setItem('crm_company_settings', JSON.stringify(settings));
      
      // Synchroniser avec la base de données
      const result = await this.makeRequest('PUT', buildApiUrl(API_ENDPOINTS.settings.company), settings);
      
      if (result.success) {
        toast.success('Paramètres sauvegardés', {
          description: 'Les paramètres de l\'entreprise ont été synchronisés'
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Save company settings error:', error);
      toast.error('Erreur de sauvegarde', {
        description: 'Impossible de sauvegarder les paramètres'
      });
      return false;
    }
  }

  /**
   * Sauvegarder les intégrations
   */
  public async saveIntegration(type: string, config: Record<string, unknown>): Promise<boolean> {
    try {
      // Sauvegarder localement d'abord
      localStorage.setItem(`crm_integration_${type}`, JSON.stringify(config));
      
      // Synchroniser avec la base de données
      const result = await this.makeRequest('PUT', buildApiUrl(API_ENDPOINTS.settings.integrations), {
        type,
        config,
        updatedAt: new Date().toISOString()
      });
      
      if (result.success) {
        toast.success('Intégration sauvegardée', {
          description: `Configuration ${type} synchronisée avec succès`
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Save integration error:', error);
      toast.error('Erreur de sauvegarde', {
        description: 'Impossible de sauvegarder l\'intégration'
      });
      return false;
    }
  }

  /**
   * Charger les données depuis la base de données
   */
  public async loadData(entity: string): Promise<unknown[]> {
    try {
      const result = await this.fetchData(entity);
      
      if (result.success && result.data) {
        // Sauvegarder localement pour le cache
        localStorage.setItem(`crm_${entity}`, JSON.stringify(result.data.data));
        return result.data.data;
      } else {
        // Fallback sur les données locales
        const localData = localStorage.getItem(`crm_${entity}`);
        return localData ? JSON.parse(localData) : [];
      }
    } catch (error) {
      console.error('Load data error:', error);
      // Fallback sur les données locales
      const localData = localStorage.getItem(`crm_${entity}`);
      return localData ? JSON.parse(localData) : [];
    }
  }

  /**
   * Traiter la queue de synchronisation
   */
  private async processSyncQueue(): Promise<void> {
    const queueData = localStorage.getItem('crm_sync_queue');
    if (!queueData) return;

    try {
      this.syncQueue = JSON.parse(queueData);
      
      for (const item of this.syncQueue) {
        const [actionStr, entity] = item.action.split('_');
        const action = actionStr as 'create' | 'update' | 'delete'; // Basic assertion
        if (['create', 'update', 'delete'].includes(action)) {
          await this.syncData(entity, action, item.data);
        } else {
          console.warn(`Invalid action in sync queue: ${actionStr}`);
        }
      }
      
      // Vider la queue après synchronisation
      this.syncQueue = [];
      localStorage.removeItem('crm_sync_queue');
      
      toast.success('Synchronisation terminée', {
        description: 'Toutes les données hors ligne ont été synchronisées'
      });
    } catch (error) {
      console.error('Sync queue processing error:', error);
      toast.error('Erreur de synchronisation', {
        description: 'Impossible de synchroniser certaines données'
      });
    }
  }

  /**
   * Obtenir l'endpoint pour une entité
   */
  private getEndpointForEntity(entity: string): string {
    const endpoints: Record<string, string> = {
      contacts: API_ENDPOINTS.contacts.list,
      quotes: API_ENDPOINTS.quotes.list,
      invoices: API_ENDPOINTS.invoices.list,
      bonLivraison: API_ENDPOINTS.bonLivraison.list,
      products: API_ENDPOINTS.products.list,
      services: API_ENDPOINTS.services.list,
      tasks: API_ENDPOINTS.tasks.list,
      events: API_ENDPOINTS.events.list,
      users: API_ENDPOINTS.users.list
    };

    return endpoints[entity] || '/api/generic';
  }

  /**
   * Vérifier la connexion à la base de données
   */
  public async testConnection(): Promise<boolean> {
    try {
      // En mode développement sans backend, retourner false mais ne pas logger d'erreur
      if (ENV_CONFIG.isDevelopment && !this.isBackendAvailable()) {
        return false;
      }

      const result = await this.makeRequest('GET', buildApiUrl('/api/health'));
      return result.success;
    } catch (error) {
      // Ne pas logger d'erreur si on sait que le backend n'est pas disponible
      if (!this.isBackendAvailable()) {
        return false;
      }
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  /**
   * Vérifier si le backend API est disponible
   */
  private isBackendAvailable(): boolean {
    // En mode développement, on peut fonctionner sans backend
    return ENV_CONFIG.isProduction || localStorage.getItem('crm_backend_available') === 'true';
  }

  /**
   * Exporter les données vers la base de données
   */
  public async exportLocalDataToDatabase(): Promise<boolean> {
    try {
      const entities = ['contacts', 'quotes', 'invoices', 'bonLivraison', 'products', 'services', 'tasks', 'events'];
      let successCount = 0;

      for (const entity of entities) {
        const localData = localStorage.getItem(`crm_${entity}`);
        if (localData) {
          const data = JSON.parse(localData);
          for (const item of data) {
            const success = await this.syncData(entity, 'create', item);
            if (success) successCount++;
          }
        }
      }

      toast.success('Export terminé', {
        description: `${successCount} éléments exportés vers la base de données`
      });

      return true;
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Erreur d\'export', {
        description: 'Impossible d\'exporter toutes les données'
      });
      return false;
    }
  }

  /**
   * Importer les données depuis la base de données
   */
  public async importDataFromDatabase(): Promise<boolean> {
    try {
      const entities = ['contacts', 'quotes', 'invoices', 'bonLivraison', 'products', 'services', 'tasks', 'events'];
      let successCount = 0;

      for (const entity of entities) {
        const data = await this.loadData(entity);
        if (data.length > 0) {
          successCount += data.length;
        }
      }

      toast.success('Import terminé', {
        description: `${successCount} éléments importés depuis la base de données`
      });

      return true;
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Erreur d\'import', {
        description: 'Impossible d\'importer toutes les données'
      });
      return false;
    }
  }

  /**
   * Obtenir les statistiques de synchronisation
   */
  public getSyncStats(): { 
    queueSize: number; 
    lastSync: string | null; 
    isOnline: boolean 
  } {
    const queueData = localStorage.getItem('crm_sync_queue');
    const lastSync = localStorage.getItem('crm_last_sync');
    
    return {
      queueSize: queueData ? JSON.parse(queueData).length : 0,
      lastSync,
      isOnline: this.isOnline
    };
  }
}

// Instance singleton
export const databaseService = DatabaseService.getInstance();
