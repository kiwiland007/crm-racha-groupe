/**
 * Hook pour la gestion de la synchronisation avec la base de données
 * Racha Business CRM
 */

import { useState, useEffect, useCallback } from 'react';
import { databaseService } from '@/services/databaseService';
import { toast } from 'sonner';
import { AppConfig } from '@/types'; // Import AppConfig

interface UseDatabaseOptions {
  autoSync?: boolean;
  syncInterval?: number; // en millisecondes
  entity?: string;
}

interface DatabaseState {
  isConnected: boolean;
  isLoading: boolean;
  lastSync: string | null;
  queueSize: number;
  error: string | null;
}

export function useDatabase(options: UseDatabaseOptions = {}) {
  const {
    autoSync = true,
    syncInterval = 60000, // 1 minute par défaut
    entity
  } = options;

  const [state, setState] = useState<DatabaseState>({
    isConnected: false,
    isLoading: false,
    lastSync: null,
    queueSize: 0,
    error: null
  });

  // Vérifier la connexion à la base de données
  const checkConnection = useCallback(async () => {
    try {
      const connected = await databaseService.testConnection();
      setState(prev => ({ 
        ...prev, 
        isConnected: connected,
        error: connected ? null : 'Connexion à la base de données échouée'
      }));
      return connected;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ 
        ...prev, 
        isConnected: false,
        error: errorMessage
      }));
      return false;
    }
  }, []);

  // Synchroniser les données
  const syncData = useCallback(async (
    entityName: string, 
    action: 'create' | 'update' | 'delete', 
    data: unknown // Changed from any to unknown
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await databaseService.syncData(entityName, action, data);
      
      if (success) {
        // Mettre à jour les statistiques
        const stats = databaseService.getSyncStats();
        setState(prev => ({
          ...prev,
          lastSync: new Date().toISOString(),
          queueSize: stats.queueSize,
          isLoading: false
        }));
        
        // Sauvegarder la date de dernière synchronisation
        localStorage.setItem('crm_last_sync', new Date().toISOString());
      } else {
        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          error: 'Échec de la synchronisation'
        }));
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de synchronisation';
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage
      }));
      return false;
    }
  }, []);

  // Charger les données depuis la base de données
  const loadData = useCallback(async (entityName: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const data = await databaseService.loadData(entityName);
      setState(prev => ({ ...prev, isLoading: false }));
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de chargement';
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage
      }));
      return [];
    }
  }, []);

  // Sauvegarder les paramètres de l'entreprise
  const saveCompanySettings = useCallback(async (settings: AppConfig['company']) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await databaseService.saveCompanySettings(settings);
      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de sauvegarde';
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage
      }));
      return false;
    }
  }, []);

  // Sauvegarder une intégration
  const saveIntegration = useCallback(async (type: string, config: Record<string, unknown>) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await databaseService.saveIntegration(type, config);
      setState(prev => ({ ...prev, isLoading: false }));
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de sauvegarde';
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage
      }));
      return false;
    }
  }, []);

  // Exporter toutes les données locales vers la base de données
  const exportToDatabase = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await databaseService.exportLocalDataToDatabase();
      
      if (success) {
        const stats = databaseService.getSyncStats();
        setState(prev => ({
          ...prev,
          lastSync: new Date().toISOString(),
          queueSize: stats.queueSize,
          isLoading: false
        }));
        
        toast.success('Export terminé', {
          description: 'Toutes les données ont été exportées vers la base de données'
        });
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'export';
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage
      }));
      
      toast.error('Erreur d\'export', {
        description: errorMessage
      });
      
      return false;
    }
  }, []);

  // Importer toutes les données depuis la base de données
  const importFromDatabase = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const success = await databaseService.importDataFromDatabase();
      
      if (success) {
        setState(prev => ({
          ...prev,
          lastSync: new Date().toISOString(),
          isLoading: false
        }));
        
        toast.success('Import terminé', {
          description: 'Toutes les données ont été importées depuis la base de données'
        });
      }
      
      return success;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'import';
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage
      }));
      
      toast.error('Erreur d\'import', {
        description: errorMessage
      });
      
      return false;
    }
  }, []);

  // Mettre à jour les statistiques de synchronisation
  const updateStats = useCallback(() => {
    const stats = databaseService.getSyncStats();
    const lastSync = localStorage.getItem('crm_last_sync');
    
    setState(prev => ({
      ...prev,
      lastSync,
      queueSize: stats.queueSize
    }));
  }, []);

  // Effet pour la synchronisation automatique
  useEffect(() => {
    if (!autoSync) return;

    // Vérification initiale
    checkConnection();
    updateStats();

    // Intervalle de synchronisation
    const interval = setInterval(() => {
      checkConnection();
      updateStats();
      
      // Si des éléments sont en queue et qu'on est connecté, les synchroniser
      const stats = databaseService.getSyncStats();
      if (stats.queueSize > 0 && state.isConnected) {
        databaseService.exportLocalDataToDatabase().then(() => {
          updateStats();
        });
      }
    }, syncInterval);

    return () => clearInterval(interval);
  }, [autoSync, syncInterval, checkConnection, updateStats, state.isConnected]);

  // Effet pour écouter les changements de connexion réseau
  useEffect(() => {
    const handleOnline = () => {
      checkConnection();
      // Tenter de synchroniser la queue quand on revient en ligne
      setTimeout(() => {
        const stats = databaseService.getSyncStats();
        if (stats.queueSize > 0) {
          databaseService.exportLocalDataToDatabase().then(() => {
            updateStats();
          });
        }
      }, 1000);
    };

    const handleOffline = () => {
      setState(prev => ({ ...prev, isConnected: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection, updateStats]);

  return {
    // État
    ...state,
    
    // Actions
    syncData,
    loadData,
    saveCompanySettings,
    saveIntegration,
    exportToDatabase,
    importFromDatabase,
    checkConnection,
    updateStats,
    
    // Utilitaires
    isOnline: navigator.onLine
  };
}
