import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { useInvoiceContext } from './InvoiceContext';

export interface BLItem {
  id: number;
  productName: string;
  designation: string;
  category: string;
  quantity: number;
  quantiteCommandee: number;
  quantiteLivree: number;
  quantiteRestante: number;
  unite: string;
  etat: 'neuf' | 'occasion' | 'reconditionne' | 'defectueux';
  reference?: string;
  unitPrice: number;
  totalPrice: number;
  description?: string;
}

export interface BonLivraison {
  id: string;
  factureId: string;
  devisId?: string;
  client: string;
  clientAdresse: string;
  clientPhone?: string;
  clientEmail?: string;
  dateCreation: string;
  dateLivraison: string;
  livreur: string;
  transporteur: string;
  vehicule?: string;
  modeLivraison: 'livraison_directe' | 'transporteur' | 'retrait_client' | 'coursier';
  status: 'en_preparation' | 'expedie' | 'en_cours_livraison' | 'livre' | 'partiellement_livre' | 'refuse' | 'retour';
  items: BLItem[];
  totalColis: number;
  poidsTotal?: number;
  volumeTotal?: number;
  signatureClient: boolean;
  signatureLivreur: boolean;
  conditionsLivraison?: string;
  observationsGenerales?: string;
  observationsClient?: string;
  createdAt: string;
  updatedAt: string;
}

interface BLContextType {
  bonLivraisons: BonLivraison[];
  addBL: (bl: Omit<BonLivraison, 'id' | 'createdAt' | 'updatedAt'>) => BonLivraison;
  updateBL: (id: string, bl: Partial<BonLivraison>) => void;
  deleteBL: (id: string) => void;
  getBLById: (id: string) => BonLivraison | undefined;
  getBLsByFacture: (factureId: string) => BonLivraison[];
  getBLsByStatus: (status: string) => BonLivraison[];
  getBLsByClient: (client: string) => BonLivraison[];
  searchBLs: (query: string) => BonLivraison[];
  createBLFromInvoice: (factureId: string, blData: Partial<BonLivraison>) => BonLivraison | null;
  updateBLStatus: (id: string, status: BonLivraison['status']) => void;
}

const BLContext = createContext<BLContextType | undefined>(undefined);

export const useBLContext = () => {
  const context = useContext(BLContext);
  if (!context) {
    throw new Error('useBLContext must be used within a BLProvider');
  }
  return context;
};

interface BLProviderProps {
  children: ReactNode;
}

// BL par défaut pour la démonstration
const defaultBLs: BonLivraison[] = [
  {
    id: "BL-001",
    factureId: "FACT-25-001",
    devisId: "DEVIS-25-001",
    client: "Société TechnoMaroc",
    clientAdresse: "123 Rue Mohammed V, Casablanca",
    clientPhone: "0522-123456",
    clientEmail: "contact@technomaroc.ma",
    dateCreation: "15/01/2025",
    dateLivraison: "16/01/2025",
    livreur: "Hassan Alami",
    transporteur: "Express Maroc",
    vehicule: "123-A-45",
    modeLivraison: "livraison_directe",
    status: "livre",
    items: [
      {
        id: 1,
        productName: "Écran tactile 55\"",
        designation: "Écran tactile 55\"",
        category: "Écran tactile",
        quantity: 5,
        quantiteCommandee: 5,
        quantiteLivree: 5,
        quantiteRestante: 0,
        unite: "pcs",
        etat: "neuf",
        reference: "ECR-55-001",
        unitPrice: 9000,
        totalPrice: 45000
      }
    ],
    totalColis: 5,
    poidsTotal: 142.5,
    volumeTotal: 2.5,
    signatureClient: true,
    signatureLivreur: true,
    conditionsLivraison: "Livraison en bon état, installation comprise",
    observationsGenerales: "Matériel fragile - Manipulation avec précaution",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-16T14:30:00Z"
  },
  {
    id: "BL-002",
    factureId: "FACT-25-002",
    devisId: "DEVIS-25-002",
    client: "Hotel Atlas",
    clientAdresse: "Avenue Hassan II, Rabat",
    clientPhone: "0523-789012",
    clientEmail: "direction@hotelatlas.ma",
    dateCreation: "10/01/2025",
    dateLivraison: "12/01/2025",
    livreur: "Imane Mansouri",
    transporteur: "Livraison Express",
    modeLivraison: "transporteur",
    status: "en_cours_livraison",
    items: [
      {
        id: 1,
        productName: "Borne interactive 43\"",
        designation: "Borne interactive 43\"",
        category: "Borne",
        quantity: 1,
        quantiteCommandee: 1,
        quantiteLivree: 0,
        quantiteRestante: 1,
        unite: "pcs",
        etat: "neuf",
        reference: "BOR-43-001",
        unitPrice: 12500,
        totalPrice: 12500
      }
    ],
    totalColis: 1,
    poidsTotal: 45,
    signatureClient: false,
    signatureLivreur: true,
    conditionsLivraison: "Livraison standard",
    createdAt: "2025-01-10T09:15:00Z",
    updatedAt: "2025-01-12T08:00:00Z"
  }
];

export const BLProvider: React.FC<BLProviderProps> = ({ children }) => {
  const [bonLivraisons, setBonLivraisons] = useState<BonLivraison[]>([]);
  const { getInvoiceById } = useInvoiceContext();
  const STORAGE_KEY = 'crm_bon_livraisons';

  // Charger les BL depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedBLs = localStorage.getItem(STORAGE_KEY);
      if (savedBLs) {
        const parsedBLs = JSON.parse(savedBLs);
        setBonLivraisons(parsedBLs);
      } else {
        // Si aucun BL sauvegardé, utiliser les BL par défaut
        setBonLivraisons(defaultBLs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBLs));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des BL:', error);
      setBonLivraisons(defaultBLs);
    }
  }, []);

  // Sauvegarder les BL dans localStorage à chaque modification
  useEffect(() => {
    if (bonLivraisons.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bonLivraisons));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des BL:', error);
        toast.error('Erreur de sauvegarde', {
          description: 'Impossible de sauvegarder les bons de livraison'
        });
      }
    }
  }, [bonLivraisons]);

  const addBL = (blData: Omit<BonLivraison, 'id' | 'createdAt' | 'updatedAt'>): BonLivraison => {
    const now = new Date().toISOString();
    const newId = `BL-${String(Math.max(...bonLivraisons.map(bl => parseInt(bl.id.split('-')[1]) || 0), 0) + 1).padStart(3, '0')}`;
    
    const newBL: BonLivraison = {
      ...blData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    setBonLivraisons(prev => [newBL, ...prev]);
    
    toast.success("Bon de livraison créé", {
      description: `BL ${newId} pour ${blData.client} créé avec succès.`
    });

    return newBL;
  };

  const updateBL = (id: string, blData: Partial<BonLivraison>) => {
    setBonLivraisons(prev => prev.map(bl => 
      bl.id === id 
        ? { 
            ...bl, 
            ...blData, 
            updatedAt: new Date().toISOString() 
          }
        : bl
    ));
    
    toast.success("Bon de livraison modifié", {
      description: "Les modifications ont été sauvegardées."
    });
  };

  const deleteBL = (id: string) => {
    const blToDelete = bonLivraisons.find(bl => bl.id === id);
    setBonLivraisons(prev => prev.filter(bl => bl.id !== id));
    
    if (blToDelete) {
      toast.success("Bon de livraison supprimé", {
        description: `BL ${id} pour ${blToDelete.client} supprimé.`
      });
    }
  };

  const getBLById = (id: string): BonLivraison | undefined => {
    return bonLivraisons.find(bl => bl.id === id);
  };

  const getBLsByFacture = (factureId: string): BonLivraison[] => {
    return bonLivraisons.filter(bl => bl.factureId === factureId);
  };

  const getBLsByStatus = (status: string): BonLivraison[] => {
    return bonLivraisons.filter(bl => bl.status === status);
  };

  const getBLsByClient = (client: string): BonLivraison[] => {
    return bonLivraisons.filter(bl => 
      bl.client.toLowerCase().includes(client.toLowerCase())
    );
  };

  const searchBLs = (query: string): BonLivraison[] => {
    const lowercaseQuery = query.toLowerCase();
    return bonLivraisons.filter(bl =>
      bl.id.toLowerCase().includes(lowercaseQuery) ||
      bl.client.toLowerCase().includes(lowercaseQuery) ||
      bl.livreur.toLowerCase().includes(lowercaseQuery) ||
      bl.transporteur.toLowerCase().includes(lowercaseQuery)
    );
  };

  const createBLFromInvoice = (factureId: string, blData: Partial<BonLivraison>): BonLivraison | null => {
    const invoice = getInvoiceById(factureId);
    if (!invoice) {
      toast.error("Facture non trouvée", {
        description: `Impossible de créer un BL pour la facture ${factureId}`
      });
      return null;
    }

    const newBLData: Omit<BonLivraison, 'id' | 'createdAt' | 'updatedAt'> = {
      factureId,
      client: invoice.client,
      clientAdresse: blData.clientAdresse || "Adresse à compléter",
      clientPhone: invoice.clientPhone,
      clientEmail: invoice.clientEmail,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      dateLivraison: blData.dateLivraison || new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      livreur: blData.livreur || "À assigner",
      transporteur: blData.transporteur || "Transport interne",
      modeLivraison: blData.modeLivraison || "livraison_directe",
      status: "en_preparation",
      items: blData.items || [],
      totalColis: blData.totalColis || 1,
      signatureClient: false,
      signatureLivreur: false,
      conditionsLivraison: blData.conditionsLivraison || "Livraison standard",
      ...blData
    };

    return addBL(newBLData);
  };

  const updateBLStatus = (id: string, status: BonLivraison['status']) => {
    const bl = bonLivraisons.find(b => b.id === id);
    if (!bl) return;

    updateBL(id, { status });

    const statusLabels = {
      'en_preparation': 'en préparation',
      'expedie': 'expédié',
      'en_cours_livraison': 'en cours de livraison',
      'livre': 'livré',
      'partiellement_livre': 'partiellement livré',
      'refuse': 'refusé',
      'retour': 'en retour'
    };

    toast.success("Statut mis à jour", {
      description: `BL ${id} marqué comme ${statusLabels[status]}.`
    });
  };

  const value: BLContextType = {
    bonLivraisons,
    addBL,
    updateBL,
    deleteBL,
    getBLById,
    getBLsByFacture,
    getBLsByStatus,
    getBLsByClient,
    searchBLs,
    createBLFromInvoice,
    updateBLStatus
  };

  return (
    <BLContext.Provider value={value}>
      {children}
    </BLContext.Provider>
  );
};
