import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export const usePWA = () => {
  const [state, setState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    installPrompt: null,
  });

  // Détecter si l'app est installée
  const checkIfInstalled = useCallback(() => {
    const isInstalled = 
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      (window.navigator as any).standalone === true;
    
    setState(prev => ({ ...prev, isInstalled }));
  }, []);

  // Gérer l'événement beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installPrompt = e as BeforeInstallPromptEvent;
      setState(prev => ({ 
        ...prev, 
        isInstallable: true, 
        installPrompt 
      }));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Gérer l'événement appinstalled
  useEffect(() => {
    const handleAppInstalled = () => {
      setState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        isInstallable: false, 
        installPrompt: null 
      }));
    };

    window.addEventListener('appinstalled', handleAppInstalled);
    
    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Gérer les changements de statut en ligne/hors ligne
  useEffect(() => {
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Vérifier l'état initial
  useEffect(() => {
    checkIfInstalled();
  }, [checkIfInstalled]);

  // Installer l'application
  const installApp = useCallback(async () => {
    if (!state.installPrompt) return false;

    try {
      await state.installPrompt.prompt();
      const choiceResult = await state.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        setState(prev => ({ 
          ...prev, 
          isInstallable: false, 
          installPrompt: null 
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'installation:', error);
      return false;
    }
  }, [state.installPrompt]);

  return {
    ...state,
    installApp,
    checkIfInstalled,
  };
};

// Hook pour le Service Worker
export const useServiceWorker = () => {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('Service Worker enregistré:', reg);
          setRegistration(reg);

          // Vérifier les mises à jour
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true);
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Erreur d\'enregistrement du Service Worker:', error);
        });

      // Écouter les messages du Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          setIsUpdateAvailable(true);
        }
      });
    }
  }, []);

  const updateApp = useCallback(async () => {
    if (!registration || !isUpdateAvailable) return;

    setIsUpdating(true);
    
    try {
      // Dire au nouveau Service Worker de prendre le contrôle
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }

      // Recharger la page pour appliquer la mise à jour
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setIsUpdating(false);
    }
  }, [registration, isUpdateAvailable]);

  const clearCache = useCallback(async () => {
    if (!registration) return;

    try {
      const messageChannel = new MessageChannel();
      registration.active?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );

      return new Promise((resolve) => {
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.success);
        };
      });
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
      return false;
    }
  }, [registration]);

  return {
    registration,
    isUpdateAvailable,
    isUpdating,
    updateApp,
    clearCache,
  };
};

// Hook pour les notifications push
export const usePushNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      throw new Error('Ce navigateur ne supporte pas les notifications');
    }

    const permission = await Notification.requestPermission();
    setPermission(permission);
    return permission === 'granted';
  }, []);

  const subscribe = useCallback(async (registration: ServiceWorkerRegistration) => {
    if (!registration || permission !== 'granted') return null;

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.VITE_VAPID_PUBLIC_KEY,
      });

      setSubscription(subscription);
      return subscription;
    } catch (error) {
      console.error('Erreur lors de l\'abonnement aux notifications:', error);
      return null;
    }
  }, [permission]);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return false;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      return true;
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      return false;
    }
  }, [subscription]);

  const showNotification = useCallback(async (title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') return;

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // Utiliser le Service Worker pour afficher la notification
      const registration = await navigator.serviceWorker.ready;
      return registration.showNotification(title, {
        icon: '/logo-192.png',
        badge: '/logo-192.png',
        ...options,
      });
    } else {
      // Fallback vers l'API Notification
      return new Notification(title, {
        icon: '/logo-192.png',
        ...options,
      });
    }
  }, [permission]);

  return {
    permission,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    showNotification,
    isSupported: 'Notification' in window,
  };
};

// Hook pour la synchronisation en arrière-plan
export const useBackgroundSync = () => {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype);
  }, []);

  const registerSync = useCallback(async (tag: string) => {
    if (!isSupported) return false;

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register(tag);
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la synchronisation:', error);
      return false;
    }
  }, [isSupported]);

  return {
    isSupported,
    registerSync,
  };
};
