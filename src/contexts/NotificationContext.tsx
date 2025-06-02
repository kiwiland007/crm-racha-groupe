import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'system' | 'task' | 'contact' | 'invoice' | 'quote' | 'inventory' | 'event';
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  relatedId?: number;
  relatedType?: 'contact' | 'task' | 'invoice' | 'quote' | 'product' | 'event';
  createdAt: string;
  expiresAt?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: number) => void;
  clearAllNotifications: () => void;
  getNotificationsByCategory: (category: string) => Notification[];
  getNotificationsByType: (type: string) => Notification[];
  getUnreadNotifications: () => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

// Notifications par défaut pour la démonstration
const defaultNotifications: Notification[] = [
  {
    id: 1,
    title: "Nouvelle tâche assignée",
    message: "Une tâche 'Appeler Imane Alaoui' vous a été assignée avec une priorité élevée",
    type: "info",
    category: "task",
    read: false,
    actionUrl: "/tasks",
    actionLabel: "Voir les tâches",
    relatedId: 1,
    relatedType: "task",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2h
    priority: "high"
  },
  {
    id: 2,
    title: "Devis expirant bientôt",
    message: "Le devis DEVIS-25-001 expire dans 3 jours. Pensez à relancer le client.",
    type: "warning",
    category: "quote",
    read: false,
    actionUrl: "/quotes",
    actionLabel: "Voir les devis",
    relatedId: 1,
    relatedType: "quote",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // Il y a 4h
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // Dans 3 jours
    priority: "medium"
  },
  {
    id: 3,
    title: "Stock faible détecté",
    message: "L'écran tactile 55\" a un stock inférieur au seuil minimum (2 unités restantes)",
    type: "warning",
    category: "inventory",
    read: true,
    actionUrl: "/inventory",
    actionLabel: "Voir l'inventaire",
    relatedId: 1,
    relatedType: "product",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // Il y a 6h
    priority: "medium"
  },
  {
    id: 4,
    title: "Nouveau contact ajouté",
    message: "Un nouveau contact 'Ahmed Benali - TechCorp' a été ajouté au CRM",
    type: "success",
    category: "contact",
    read: true,
    actionUrl: "/contacts",
    actionLabel: "Voir les contacts",
    relatedId: 5,
    relatedType: "contact",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // Il y a 8h
    priority: "low"
  },
  {
    id: 5,
    title: "Événement à venir",
    message: "Installation prévue demain chez MarketPro Digital à 14h00",
    type: "info",
    category: "event",
    read: false,
    actionUrl: "/events",
    actionLabel: "Voir les événements",
    relatedId: 1,
    relatedType: "event",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // Il y a 12h
    priority: "high"
  },
  {
    id: 6,
    title: "Facture payée",
    message: "La facture INV-25-001 de 15 000 MAD a été marquée comme payée",
    type: "success",
    category: "invoice",
    read: true,
    actionUrl: "/invoices",
    actionLabel: "Voir les factures",
    relatedId: 1,
    relatedType: "invoice",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Il y a 1 jour
    priority: "low"
  },
  {
    id: 7,
    title: "Maintenance système",
    message: "Maintenance programmée ce weekend de 02h00 à 06h00. Sauvegardez vos données.",
    type: "info",
    category: "system",
    read: false,
    actionUrl: "/settings",
    actionLabel: "Paramètres",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Il y a 30min
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Dans 2 jours
    priority: "medium"
  }
];

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const STORAGE_KEY = 'crm_notifications';

  // Charger les notifications depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem(STORAGE_KEY);
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Filtrer les notifications expirées
        const validNotifications = parsedNotifications.filter((notif: Notification) => 
          !notif.expiresAt || new Date(notif.expiresAt) > new Date()
        );
        setNotifications(validNotifications);
      } else {
        // Si aucune notification sauvegardée, utiliser les notifications par défaut
        setNotifications(defaultNotifications);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNotifications));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      setNotifications(defaultNotifications);
    }
  }, []);

  // Sauvegarder les notifications dans localStorage à chaque modification
  useEffect(() => {
    if (notifications.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des notifications:', error);
      }
    }
  }, [notifications]);

  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter(notif => !notif.read).length;

  const addNotification = (notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newId = Math.max(...notifications.map(n => n.id), 0) + 1;
    const now = new Date().toISOString();
    
    const newNotification: Notification = {
      ...notificationData,
      id: newId,
      createdAt: now,
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Afficher un toast pour les nouvelles notifications
    toast.success("Nouvelle notification", {
      description: notificationData.title
    });
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast.success("Notifications marquées comme lues", {
      description: "Toutes les notifications ont été marquées comme lues"
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success("Notification supprimée");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("Toutes les notifications ont été supprimées");
  };

  const getNotificationsByCategory = (category: string): Notification[] => {
    return notifications.filter(notif => notif.category === category);
  };

  const getNotificationsByType = (type: string): Notification[] => {
    return notifications.filter(notif => notif.type === type);
  };

  const getUnreadNotifications = (): Notification[] => {
    return notifications.filter(notif => !notif.read);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByCategory,
    getNotificationsByType,
    getUnreadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
