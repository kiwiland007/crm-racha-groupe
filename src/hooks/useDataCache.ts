// Hook de cache de données avancé - Amélioration Senior Review
import { useState, useEffect, useCallback, useRef } from 'react';
import { errorHandler } from '@/utils/errorHandler';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

interface CacheOptions {
  ttl?: number; // Time to live en millisecondes
  maxSize?: number; // Taille maximale du cache
  persistToStorage?: boolean; // Persister dans localStorage
  storageKey?: string; // Clé pour localStorage
}

interface UseDataCacheOptions<T> extends CacheOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialData?: T;
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  private maxSize: number;
  private defaultTTL: number;

  constructor(maxSize = 100, defaultTTL = 5 * 60 * 1000) { // 5 minutes par défaut
    this.maxSize = maxSize;
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Nettoyer le cache si nécessaire
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const expiry = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Vérifier l'expiration
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry ? Date.now() <= entry.expiry : false;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());
    
    // Supprimer les entrées expirées
    entries.forEach(([key, entry]) => {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    });

    // Si encore trop d'entrées, supprimer les plus anciennes
    if (this.cache.size >= this.maxSize) {
      const sortedEntries = entries
        .filter(([, entry]) => now <= entry.expiry)
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = sortedEntries.slice(0, Math.floor(this.maxSize * 0.2));
      toDelete.forEach(([key]) => this.cache.delete(key));
    }
  }

  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.values());
    const validEntries = entries.filter(entry => now <= entry.expiry);
    
    return {
      total: this.cache.size,
      valid: validEntries.length,
      expired: entries.length - validEntries.length,
      maxSize: this.maxSize,
      usage: (this.cache.size / this.maxSize) * 100
    };
  }
}

// Instance globale du cache
const globalCache = new DataCache();

// Hook principal pour la gestion des données avec cache
export function useDataCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: UseDataCacheOptions<T> = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    enabled = true,
    refetchOnWindowFocus = false,
    refetchInterval,
    onSuccess,
    onError,
    initialData,
    persistToStorage = false,
    storageKey
  } = options;

  const [data, setData] = useState<T | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastFetch, setLastFetch] = useState<number | null>(null);
  
  const fetcherRef = useRef(fetcher);
  const intervalRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Mettre à jour la référence du fetcher
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  // Fonction pour charger depuis le localStorage
  const loadFromStorage = useCallback((): T | null => {
    if (!persistToStorage || !storageKey) return null;
    
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Erreur lors du chargement depuis localStorage:', error);
      return null;
    }
  }, [persistToStorage, storageKey]);

  // Fonction pour sauvegarder dans le localStorage
  const saveToStorage = useCallback((data: T) => {
    if (!persistToStorage || !storageKey) return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde dans localStorage:', error);
    }
  }, [persistToStorage, storageKey]);

  // Fonction de fetch avec gestion d'erreurs
  const fetchData = useCallback(async (force = false): Promise<T | null> => {
    if (!enabled) return null;

    // Vérifier le cache d'abord
    if (!force) {
      const cached = globalCache.get<T>(key);
      if (cached) {
        setData(cached);
        setError(null);
        return cached;
      }

      // Vérifier localStorage si pas en cache
      const stored = loadFromStorage();
      if (stored) {
        setData(stored);
        globalCache.set(key, stored, ttl);
        return stored;
      }
    }

    // Annuler la requête précédente si elle existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcherRef.current();
      
      // Vérifier si la requête n'a pas été annulée
      if (!abortControllerRef.current.signal.aborted) {
        setData(result);
        setLastFetch(Date.now());
        
        // Mettre en cache
        globalCache.set(key, result, ttl);
        
        // Sauvegarder dans localStorage
        saveToStorage(result);
        
        // Callback de succès
        onSuccess?.(result);
        
        return result;
      }
    } catch (err) {
      if (!abortControllerRef.current.signal.aborted) {
        const error = err as Error;
        setError(error);
        errorHandler.handle(error, { context: 'useDataCache', key });
        onError?.(error);
      }
    } finally {
      if (!abortControllerRef.current.signal.aborted) {
        setIsLoading(false);
      }
    }

    return null;
  }, [key, enabled, ttl, loadFromStorage, saveToStorage, onSuccess, onError]);

  // Fonction de refetch manuel
  const refetch = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Fonction pour invalider le cache
  const invalidate = useCallback(() => {
    globalCache.delete(key);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
    return fetchData(true);
  }, [key, storageKey, fetchData]);

  // Fonction pour mettre à jour les données manuellement
  const mutate = useCallback((newData: T | ((prev: T | null) => T)) => {
    const updatedData = typeof newData === 'function' 
      ? (newData as (prev: T | null) => T)(data)
      : newData;
    
    setData(updatedData);
    globalCache.set(key, updatedData, ttl);
    saveToStorage(updatedData);
  }, [data, key, ttl, saveToStorage]);

  // Effet pour le fetch initial
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  // Effet pour le refetch sur focus
  useEffect(() => {
    if (!refetchOnWindowFocus) return;

    const handleFocus = () => {
      if (enabled && document.visibilityState === 'visible') {
        fetchData();
      }
    };

    document.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refetchOnWindowFocus, enabled, fetchData]);

  // Effet pour le refetch périodique
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    intervalRef.current = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, enabled, fetchData]);

  // Nettoyage à la destruction
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    lastFetch,
    refetch,
    invalidate,
    mutate,
    isStale: lastFetch ? Date.now() - lastFetch > ttl : true,
    isCached: globalCache.has(key)
  };
}

// Hook pour les mutations avec optimistic updates
export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void;
    invalidateKeys?: string[];
  } = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: TVariables): Promise<TData | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await mutationFn(variables);
      
      // Invalider les clés spécifiées
      options.invalidateKeys?.forEach(key => {
        globalCache.delete(key);
      });
      
      options.onSuccess?.(data, variables);
      options.onSettled?.(data, null, variables);
      
      return data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      errorHandler.handle(error, { context: 'useMutation' });
      options.onError?.(error, variables);
      options.onSettled?.(undefined, error, variables);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn, options]);

  return {
    mutate,
    isLoading,
    error,
    reset: () => {
      setError(null);
      setIsLoading(false);
    }
  };
}

// Utilitaires pour le cache global
export const cacheUtils = {
  clear: () => globalCache.clear(),
  delete: (key: string) => globalCache.delete(key),
  getStats: () => globalCache.getStats(),
  has: (key: string) => globalCache.has(key),
  
  // Précharger des données
  prefetch: async <T>(key: string, fetcher: () => Promise<T>, ttl?: number) => {
    if (!globalCache.has(key)) {
      try {
        const data = await fetcher();
        globalCache.set(key, data, ttl);
        return data;
      } catch (error) {
        errorHandler.handle(error as Error, { context: 'prefetch', key });
        return null;
      }
    }
    return globalCache.get<T>(key);
  },
  
  // Invalider plusieurs clés
  invalidatePattern: (pattern: RegExp) => {
    const keys = Array.from(globalCache['cache'].keys());
    keys.forEach(key => {
      if (pattern.test(key)) {
        globalCache.delete(key);
      }
    });
  }
};
