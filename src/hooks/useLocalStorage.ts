import { useState, useEffect, useCallback, useRef } from 'react';

// Types pour le hook localStorage
export interface UseLocalStorageOptions<T> {
  defaultValue?: T;
  serializer?: {
    parse: (value: string) => T;
    stringify: (value: T) => string;
  };
  syncAcrossTabs?: boolean;
  onError?: (error: Error) => void;
}

// Sérialiseur par défaut
const defaultSerializer = {
  parse: JSON.parse,
  stringify: JSON.stringify,
};

// Hook principal pour localStorage
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
): [T | undefined, (value: T | ((prev: T | undefined) => T)) => void, () => void] {
  
  const {
    defaultValue,
    serializer = defaultSerializer,
    syncAcrossTabs = true,
    onError,
  } = options;
  
  // Référence pour éviter les re-renders inutiles
  const initialValueRef = useRef<T | undefined>();
  
  // État local
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        initialValueRef.current = defaultValue;
        return defaultValue;
      }
      
      const parsed = serializer.parse(item);
      initialValueRef.current = parsed;
      return parsed;
    } catch (error) {
      onError?.(error as Error);
      initialValueRef.current = defaultValue;
      return defaultValue;
    }
  });
  
  // Fonction pour mettre à jour la valeur
  const setValue = useCallback((value: T | ((prev: T | undefined) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, serializer.stringify(valueToStore));
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }, [key, storedValue, serializer, onError]);
  
  // Fonction pour supprimer la valeur
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(undefined);
    } catch (error) {
      onError?.(error as Error);
    }
  }, [key, onError]);
  
  // Synchronisation entre onglets
  useEffect(() => {
    if (!syncAcrossTabs) return;
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.storageArea === window.localStorage) {
        try {
          if (e.newValue === null) {
            setStoredValue(undefined);
          } else {
            setStoredValue(serializer.parse(e.newValue));
          }
        } catch (error) {
          onError?.(error as Error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, serializer, syncAcrossTabs, onError]);
  
  return [storedValue, setValue, removeValue];
}

// Hook spécialisé pour les objets avec merge
export function useLocalStorageObject<T extends Record<string, unknown>>(
  key: string,
  defaultValue: T,
  options: Omit<UseLocalStorageOptions<T>, 'defaultValue'> = {}
): [T, (value: Partial<T> | ((prev: T) => T)) => void, () => void] {
  
  const [storedValue, setValue, removeValue] = useLocalStorage(key, {
    ...options,
    defaultValue,
  });
  
  const setObjectValue = useCallback((value: Partial<T> | ((prev: T) => T)) => {
    setValue(prev => {
      const currentValue = prev || defaultValue;
      
      if (typeof value === 'function') {
        return value(currentValue);
      }
      
      return { ...currentValue, ...value };
    });
  }, [setValue, defaultValue]);
  
  return [storedValue || defaultValue, setObjectValue, removeValue];
}

// Hook pour les arrays avec méthodes utilitaires
export function useLocalStorageArray<T>(
  key: string,
  defaultValue: T[] = [],
  options: Omit<UseLocalStorageOptions<T[]>, 'defaultValue'> = {}
): [
  T[],
  {
    set: (value: T[] | ((prev: T[]) => T[])) => void;
    push: (...items: T[]) => void;
    remove: (predicate: (item: T, index: number) => boolean) => void;
    update: (index: number, item: T) => void;
    clear: () => void;
  }
] {
  
  const [storedValue, setValue, removeValue] = useLocalStorage(key, {
    ...options,
    defaultValue,
  });
  
  const arrayValue = storedValue || defaultValue;
  
  const push = useCallback((...items: T[]) => {
    setValue(prev => [...(prev || defaultValue), ...items]);
  }, [setValue, defaultValue]);
  
  const remove = useCallback((predicate: (item: T, index: number) => boolean) => {
    setValue(prev => (prev || defaultValue).filter((item, index) => !predicate(item, index)));
  }, [setValue, defaultValue]);
  
  const update = useCallback((index: number, item: T) => {
    setValue(prev => {
      const newArray = [...(prev || defaultValue)];
      newArray[index] = item;
      return newArray;
    });
  }, [setValue, defaultValue]);
  
  const clear = useCallback(() => {
    setValue([]);
  }, [setValue]);
  
  return [
    arrayValue,
    {
      set: setValue,
      push,
      remove,
      update,
      clear,
    }
  ];
}

// Hook pour la gestion des préférences utilisateur
export function useUserPreferences<T extends Record<string, unknown>>(
  defaultPreferences: T
) {
  return useLocalStorageObject('user_preferences', defaultPreferences, {
    syncAcrossTabs: true,
    onError: (error) => {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
    },
  });
}

// Hook pour la gestion du cache avec TTL
export function useLocalStorageCache<T>(
  key: string,
  ttlMinutes: number = 60
): [
  T | null,
  (value: T) => void,
  () => void,
  boolean // isExpired
] {
  
  const cacheKey = `cache_${key}`;
  
  const [cacheData, setCacheData, removeCacheData] = useLocalStorage<{
    value: T;
    timestamp: number;
    ttl: number;
  }>(cacheKey);
  
  // Vérifier si le cache a expiré
  const isExpired = cacheData 
    ? Date.now() - cacheData.timestamp > cacheData.ttl
    : true;
  
  // Obtenir la valeur du cache
  const value = (cacheData && !isExpired) ? cacheData.value : null;
  
  // Mettre à jour le cache
  const setValue = useCallback((newValue: T) => {
    setCacheData({
      value: newValue,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
  }, [setCacheData, ttlMinutes]);
  
  // Supprimer le cache
  const removeValue = useCallback(() => {
    removeCacheData();
  }, [removeCacheData]);
  
  // Auto-nettoyage si expiré
  useEffect(() => {
    if (isExpired && cacheData) {
      removeCacheData();
    }
  }, [isExpired, cacheData, removeCacheData]);
  
  return [value, setValue, removeValue, isExpired];
}

// Utilitaires pour la gestion globale du localStorage
export const localStorageUtils = {
  // Obtenir toutes les clés du CRM
  getCRMKeys: (): string[] => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('crm_')) {
        keys.push(key);
      }
    }
    return keys;
  },
  
  // Nettoyer toutes les données du CRM
  clearCRMData: (): void => {
    const keys = localStorageUtils.getCRMKeys();
    keys.forEach(key => localStorage.removeItem(key));
  },
  
  // Obtenir la taille utilisée par le CRM
  getCRMStorageSize: (): number => {
    const keys = localStorageUtils.getCRMKeys();
    let totalSize = 0;
    
    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        totalSize += key.length + value.length;
      }
    });
    
    return totalSize;
  },
  
  // Exporter toutes les données du CRM
  exportCRMData: (): Record<string, unknown> => {
    const keys = localStorageUtils.getCRMKeys();
    const data: Record<string, unknown> = {};
    
    keys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      }
    });
    
    return data;
  },
  
  // Importer des données dans le CRM
  importCRMData: (data: Record<string, unknown>): void => {
    Object.entries(data).forEach(([key, value]) => {
      if (key.startsWith('crm_')) {
        try {
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        } catch (error) {
          console.error(`Erreur lors de l'import de ${key}:`, error);
        }
      }
    });
  },
};
