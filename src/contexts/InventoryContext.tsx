import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  status: 'disponible' | 'loué' | 'maintenance' | 'endommagé';
  quantity: number;
  location: string;
  lastMaintenance: string;
  alert: boolean;
  price: {
    sale: number;
    rental: number;
  };
  serialNumber?: string;
  purchaseDate?: string;
  notes?: string;
  minQuantity?: number;
  maxQuantity?: number;
  supplier?: string;
  warranty?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface InventoryContextType {
  inventory: InventoryItem[];
  addItem: (item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: number, item: Partial<InventoryItem>) => void;
  deleteItem: (id: number) => void;
  updateStock: (id: number, newQuantity: number, reason?: string) => void;
  updateStatus: (id: number, status: InventoryItem['status'], location?: string) => void;
  getItemById: (id: number) => InventoryItem | undefined;
  getItemsByCategory: (category: string) => InventoryItem[];
  getItemsByStatus: (status: string) => InventoryItem[];
  getLowStockItems: () => InventoryItem[];
  searchItems: (query: string) => InventoryItem[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventoryContext must be used within an InventoryProvider');
  }
  return context;
};

interface InventoryProviderProps {
  children: ReactNode;
}

// Inventaire par défaut pour la démonstration
const defaultInventory: InventoryItem[] = [
  {
    id: 1,
    name: "Écran tactile 32\"",
    category: "Écran tactile",
    status: "disponible",
    quantity: 5,
    location: "Entrepôt principal",
    lastMaintenance: "15 Mar 2025",
    alert: false,
    price: {
      sale: 12000,
      rental: 2000
    },
    serialNumber: "ECR32-001",
    purchaseDate: "2024-01-15",
    minQuantity: 2,
    maxQuantity: 10,
    supplier: "TechDisplay Maroc",
    warranty: "2 ans",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2025-03-15T14:30:00Z"
  },
  {
    id: 2,
    name: "Borne interactive 43\"",
    category: "Borne",
    status: "loué",
    quantity: 0,
    location: "Client: MarketPro",
    lastMaintenance: "02 Avr 2025",
    alert: true,
    price: {
      sale: 35000,
      rental: 5000
    },
    serialNumber: "BOR43-002",
    purchaseDate: "2024-02-20",
    minQuantity: 1,
    maxQuantity: 5,
    supplier: "Interactive Solutions",
    warranty: "3 ans",
    createdAt: "2024-02-20T09:15:00Z",
    updatedAt: "2025-04-02T16:45:00Z"
  },
  {
    id: 3,
    name: "Table tactile 55\"",
    category: "Table tactile",
    status: "disponible",
    quantity: 2,
    location: "Entrepôt principal",
    lastMaintenance: "10 Fév 2025",
    alert: true,
    price: {
      sale: 45000,
      rental: 6500
    },
    serialNumber: "TAB55-003",
    purchaseDate: "2024-03-10",
    minQuantity: 1,
    maxQuantity: 3,
    supplier: "TouchTable Pro",
    warranty: "2 ans",
    createdAt: "2024-03-10T11:20:00Z",
    updatedAt: "2025-02-10T13:10:00Z"
  },
  {
    id: 4,
    name: "Écran LED extérieur",
    category: "Écran LED",
    status: "maintenance",
    quantity: 1,
    location: "Atelier technique",
    lastMaintenance: "20 Jan 2025",
    alert: false,
    price: {
      sale: 85000,
      rental: 12000
    },
    serialNumber: "LED-EXT-004",
    purchaseDate: "2024-04-05",
    minQuantity: 1,
    maxQuantity: 2,
    supplier: "LED Outdoor Maroc",
    warranty: "5 ans",
    createdAt: "2024-04-05T08:30:00Z",
    updatedAt: "2025-01-20T10:15:00Z"
  },
  {
    id: 5,
    name: "Projecteur interactif",
    category: "Projecteur",
    status: "disponible",
    quantity: 3,
    location: "Entrepôt principal",
    lastMaintenance: "05 Mar 2025",
    alert: false,
    price: {
      sale: 28000,
      rental: 4000
    },
    serialNumber: "PROJ-INT-005",
    purchaseDate: "2024-05-12",
    minQuantity: 2,
    maxQuantity: 5,
    supplier: "Projection Tech",
    warranty: "3 ans",
    createdAt: "2024-05-12T14:45:00Z",
    updatedAt: "2025-03-05T09:20:00Z"
  }
];

export const InventoryProvider: React.FC<InventoryProviderProps> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const STORAGE_KEY = 'crm_inventory';

  // Charger l'inventaire depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedInventory = localStorage.getItem(STORAGE_KEY);
      if (savedInventory) {
        const parsedInventory = JSON.parse(savedInventory);
        setInventory(parsedInventory);
      } else {
        // Si aucun inventaire sauvegardé, utiliser l'inventaire par défaut
        setInventory(defaultInventory);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInventory));
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'inventaire:', error);
      setInventory(defaultInventory);
    }
  }, []);

  // Sauvegarder l'inventaire dans localStorage à chaque modification
  useEffect(() => {
    if (inventory.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'inventaire:', error);
        toast.error('Erreur de sauvegarde', {
          description: 'Impossible de sauvegarder l\'inventaire'
        });
      }
    }
  }, [inventory]);

  const addItem = (itemData: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newId = Math.max(...inventory.map(i => i.id), 0) + 1;
    const now = new Date().toISOString();
    
    const newItem: InventoryItem = {
      ...itemData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    setInventory(prev => [newItem, ...prev]);
    
    toast.success("Équipement ajouté", {
      description: `${itemData.name} a été ajouté à l'inventaire.`
    });
  };

  const updateItem = (id: number, itemData: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            ...itemData, 
            updatedAt: new Date().toISOString() 
          }
        : item
    ));
    
    toast.success("Équipement modifié", {
      description: "Les modifications ont été sauvegardées."
    });
  };

  const deleteItem = (id: number) => {
    const itemToDelete = inventory.find(i => i.id === id);
    setInventory(prev => prev.filter(item => item.id !== id));
    
    if (itemToDelete) {
      toast.success("Équipement supprimé", {
        description: `${itemToDelete.name} a été supprimé de l'inventaire.`
      });
    }
  };

  const updateStock = (id: number, newQuantity: number, reason?: string) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const oldQuantity = item.quantity;
    const operation = newQuantity > oldQuantity ? 'add' : newQuantity < oldQuantity ? 'remove' : 'set';
    const diff = Math.abs(newQuantity - oldQuantity);

    setInventory(prev => prev.map(item => 
      item.id === id 
        ? { 
            ...item, 
            quantity: newQuantity,
            updatedAt: new Date().toISOString() 
          }
        : item
    ));
    
    toast.success("Stock mis à jour", {
      description: `${item.name}: ${operation === 'add' ? '+' : operation === 'remove' ? '-' : '='} ${diff} → ${newQuantity} unités`,
      action: reason ? {
        label: "Voir raison",
        onClick: () => toast.info("Raison", { description: reason })
      } : undefined
    });
  };

  const updateStatus = (id: number, status: InventoryItem['status'], location?: string) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const updates: Partial<InventoryItem> = {
      status,
      updatedAt: new Date().toISOString()
    };

    if (location) {
      updates.location = location;
    }

    // Logique spécifique par statut
    if (status === 'maintenance') {
      updates.location = location || 'Atelier technique';
    } else if (status === 'disponible') {
      updates.location = location || 'Entrepôt principal';
      updates.alert = false;
      updates.lastMaintenance = new Date().toLocaleDateString('fr-FR');
    } else if (status === 'loué') {
      updates.quantity = Math.max(0, item.quantity - 1);
    }

    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    
    const statusLabels = {
      'disponible': 'disponible',
      'loué': 'loué',
      'maintenance': 'en maintenance',
      'endommagé': 'endommagé'
    };
    
    toast.success("Statut mis à jour", {
      description: `${item.name} marqué comme ${statusLabels[status]}.`
    });
  };

  const getItemById = (id: number): InventoryItem | undefined => {
    return inventory.find(item => item.id === id);
  };

  const getItemsByCategory = (category: string): InventoryItem[] => {
    return inventory.filter(item => item.category === category);
  };

  const getItemsByStatus = (status: string): InventoryItem[] => {
    return inventory.filter(item => item.status === status);
  };

  const getLowStockItems = (): InventoryItem[] => {
    return inventory.filter(item => 
      item.minQuantity && item.quantity <= item.minQuantity
    );
  };

  const searchItems = (query: string): InventoryItem[] => {
    const lowercaseQuery = query.toLowerCase();
    return inventory.filter(item =>
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.category.toLowerCase().includes(lowercaseQuery) ||
      item.location.toLowerCase().includes(lowercaseQuery) ||
      item.serialNumber?.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value: InventoryContextType = {
    inventory,
    addItem,
    updateItem,
    deleteItem,
    updateStock,
    updateStatus,
    getItemById,
    getItemsByCategory,
    getItemsByStatus,
    getLowStockItems,
    searchItems
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
