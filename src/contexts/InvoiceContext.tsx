import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface BonLivraison {
  id: string;
  factureId: string;
  devisId?: string;
  client: string;
  clientAdresse: string;
  dateCreation: string;
  dateLivraison: string;
  livreur: string;
  transporteur: string;
  status: 'en_preparation' | 'expedie' | 'en_cours_livraison' | 'livre' | 'partiellement_livre' | 'refuse';
  items: any[];
  totalColis: number;
  signatureClient: boolean;
  signatureLivreur: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  quoteId?: string;
  client: string;
  clientPhone: string;
  clientEmail: string;
  projectName: string;
  description: string;
  date: string;
  dueDate?: string;
  amount: number;
  advanceAmount?: number;
  remainingAmount?: number;
  status: 'Brouillon' | 'En attente' | 'Payée' | 'Partiellement payée' | 'En retard' | 'Annulée';
  paymentMethod: string;
  items?: any[];
  notes?: string;
  paidAt?: string;
  bonLivraison?: BonLivraison;
  bonLivraisonId?: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceContextType {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => Invoice;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  markAsPaid: (id: string, paidAmount?: number) => void;
  createBonLivraison: (invoiceId: string, blData: Omit<BonLivraison, 'id' | 'factureId' | 'createdAt' | 'updatedAt'>) => BonLivraison;
  updateBonLivraison: (invoiceId: string, blData: Partial<BonLivraison>) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getInvoicesByStatus: (status: string) => Invoice[];
  getInvoicesByClient: (client: string) => Invoice[];
  getOverdueInvoices: () => Invoice[];
  searchInvoices: (query: string) => Invoice[];
  getTotalAmount: () => number;
  getPaidAmount: () => number;
  getPendingAmount: () => number;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const useInvoiceContext = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoiceContext must be used within an InvoiceProvider');
  }
  return context;
};

interface InvoiceProviderProps {
  children: ReactNode;
}

// Factures par défaut pour la démonstration
const defaultInvoices: Invoice[] = [
  {
    id: "FAC-001",
    client: "Société TechnoMaroc",
    clientPhone: "0522-123456",
    clientEmail: "contact@technomaroc.ma",
    projectName: "Installation écrans tactiles",
    description: "Installation de 5 écrans tactiles 55 pouces",
    date: "15/01/2025",
    dueDate: "14/02/2025",
    amount: 45000,
    advanceAmount: 45000,
    remainingAmount: 0,
    status: "Payée",
    paymentMethod: "Virement",
    paidAt: "15/01/2025",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "FAC-002",
    client: "Hotel Atlas",
    clientPhone: "0523-789012",
    clientEmail: "direction@hotelatlas.ma",
    projectName: "Borne interactive accueil",
    description: "Borne interactive pour l'accueil clients",
    date: "10/01/2025",
    dueDate: "09/02/2025",
    amount: 12500,
    advanceAmount: 0,
    remainingAmount: 12500,
    status: "En attente",
    paymentMethod: "30 jours",
    createdAt: "2025-01-10T09:15:00Z",
    updatedAt: "2025-01-10T09:15:00Z"
  },
  {
    id: "FAC-003",
    client: "Centre Commercial Anfa",
    clientPhone: "0522-456789",
    clientEmail: "gestion@anfa-mall.ma",
    projectName: "Système d'affichage dynamique",
    description: "Système complet d'affichage dynamique",
    date: "08/01/2025",
    dueDate: "07/02/2025",
    amount: 78000,
    advanceAmount: 30000,
    remainingAmount: 48000,
    status: "Partiellement payée",
    paymentMethod: "Chèque",
    createdAt: "2025-01-08T11:20:00Z",
    updatedAt: "2025-01-08T11:20:00Z"
  }
];

export const InvoiceProvider: React.FC<InvoiceProviderProps> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const STORAGE_KEY = 'crm_invoices';

  // Charger les factures depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedInvoices = localStorage.getItem(STORAGE_KEY);
      if (savedInvoices) {
        const parsedInvoices = JSON.parse(savedInvoices);
        setInvoices(parsedInvoices);
      } else {
        // Si aucune facture sauvegardée, utiliser les factures par défaut
        setInvoices(defaultInvoices);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultInvoices));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des factures:', error);
      setInvoices(defaultInvoices);
    }
  }, []);

  // Sauvegarder les factures dans localStorage à chaque modification
  useEffect(() => {
    if (invoices.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des factures:', error);
        toast.error('Erreur de sauvegarde', {
          description: 'Impossible de sauvegarder les factures'
        });
      }
    }
  }, [invoices]);

  const addInvoice = (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice => {
    const now = new Date().toISOString();
    const newId = `FAC-${String(Math.max(...invoices.map(i => parseInt(i.id.split('-')[1]) || 0), 0) + 1).padStart(3, '0')}`;
    
    const newInvoice: Invoice = {
      ...invoiceData,
      id: newId,
      remainingAmount: invoiceData.amount - (invoiceData.advanceAmount || 0),
      createdAt: now,
      updatedAt: now
    };

    setInvoices(prev => [newInvoice, ...prev]);
    
    toast.success("Facture créée", {
      description: `Facture ${newId} pour ${invoiceData.client} créée avec succès.`
    });

    return newInvoice;
  };

  const updateInvoice = (id: string, invoiceData: Partial<Invoice>) => {
    setInvoices(prev => prev.map(invoice => 
      invoice.id === id 
        ? { 
            ...invoice, 
            ...invoiceData,
            remainingAmount: (invoiceData.amount || invoice.amount) - (invoiceData.advanceAmount || invoice.advanceAmount || 0),
            updatedAt: new Date().toISOString() 
          }
        : invoice
    ));
    
    toast.success("Facture modifiée", {
      description: "Les modifications ont été sauvegardées."
    });
  };

  const deleteInvoice = (id: string) => {
    const invoiceToDelete = invoices.find(i => i.id === id);
    setInvoices(prev => prev.filter(invoice => invoice.id !== id));
    
    if (invoiceToDelete) {
      toast.success("Facture supprimée", {
        description: `Facture ${id} pour ${invoiceToDelete.client} supprimée.`
      });
    }
  };

  const markAsPaid = (id: string, paidAmount?: number) => {
    const invoice = invoices.find(i => i.id === id);
    if (!invoice) return;

    const totalPaid = (invoice.advanceAmount || 0) + (paidAmount || invoice.remainingAmount || 0);
    const newStatus = totalPaid >= invoice.amount ? 'Payée' : 'Partiellement payée';

    updateInvoice(id, {
      status: newStatus,
      advanceAmount: totalPaid,
      remainingAmount: invoice.amount - totalPaid,
      paidAt: newStatus === 'Payée' ? new Date().toLocaleDateString('fr-FR') : undefined
    });

    toast.success("Paiement enregistré", {
      description: `Facture ${id} marquée comme ${newStatus.toLowerCase()}.`
    });
  };

  const createBonLivraison = (invoiceId: string, blData: Omit<BonLivraison, 'id' | 'factureId' | 'createdAt' | 'updatedAt'>): BonLivraison => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) {
      throw new Error('Facture non trouvée');
    }

    const now = new Date().toISOString();
    const blId = `BL-${Date.now()}`;

    const newBL: BonLivraison = {
      ...blData,
      id: blId,
      factureId: invoiceId,
      createdAt: now,
      updatedAt: now
    };

    // Associer le BL à la facture
    updateInvoice(invoiceId, {
      bonLivraison: newBL,
      bonLivraisonId: blId
    });

    toast.success("Bon de livraison créé", {
      description: `BL ${blId} associé à la facture ${invoiceId}.`
    });

    return newBL;
  };

  const updateBonLivraison = (invoiceId: string, blData: Partial<BonLivraison>) => {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice || !invoice.bonLivraison) return;

    const updatedBL = {
      ...invoice.bonLivraison,
      ...blData,
      updatedAt: new Date().toISOString()
    };

    updateInvoice(invoiceId, {
      bonLivraison: updatedBL
    });

    toast.success("Bon de livraison modifié", {
      description: "Les modifications ont été sauvegardées."
    });
  };

  const getInvoiceById = (id: string): Invoice | undefined => {
    return invoices.find(invoice => invoice.id === id);
  };

  const getInvoicesByStatus = (status: string): Invoice[] => {
    return invoices.filter(invoice => invoice.status === status);
  };

  const getInvoicesByClient = (client: string): Invoice[] => {
    return invoices.filter(invoice => 
      invoice.client.toLowerCase().includes(client.toLowerCase())
    );
  };

  const getOverdueInvoices = (): Invoice[] => {
    const today = new Date();
    return invoices.filter(invoice => {
      if (!invoice.dueDate || invoice.status === 'Payée') return false;
      const dueDate = new Date(invoice.dueDate.split('/').reverse().join('-'));
      return dueDate < today;
    });
  };

  const searchInvoices = (query: string): Invoice[] => {
    const lowercaseQuery = query.toLowerCase();
    return invoices.filter(invoice =>
      invoice.id.toLowerCase().includes(lowercaseQuery) ||
      invoice.client.toLowerCase().includes(lowercaseQuery) ||
      invoice.projectName.toLowerCase().includes(lowercaseQuery) ||
      invoice.description.toLowerCase().includes(lowercaseQuery) ||
      invoice.clientEmail.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getTotalAmount = (): number => {
    return invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getPaidAmount = (): number => {
    return invoices
      .filter(invoice => invoice.status === 'Payée')
      .reduce((sum, invoice) => sum + invoice.amount, 0);
  };

  const getPendingAmount = (): number => {
    return invoices
      .filter(invoice => invoice.status !== 'Payée' && invoice.status !== 'Annulée')
      .reduce((sum, invoice) => sum + (invoice.remainingAmount || invoice.amount), 0);
  };

  const value: InvoiceContextType = {
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    markAsPaid,
    createBonLivraison,
    updateBonLivraison,
    getInvoiceById,
    getInvoicesByStatus,
    getInvoicesByClient,
    getOverdueInvoices,
    searchInvoices,
    getTotalAmount,
    getPaidAmount,
    getPendingAmount
  };

  return (
    <InvoiceContext.Provider value={value}>
      {children}
    </InvoiceContext.Provider>
  );
};
