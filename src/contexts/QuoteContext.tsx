import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { QuoteItem } from '@/types'; // Import QuoteItem

export interface Quote {
  id: string;
  client: string;
  clientPhone: string;
  clientEmail: string;
  date: string;
  amount: number;
  advanceAmount: number;
  status: 'Émis' | 'En attente' | 'Accepté' | 'Facturé' | 'Refusé' | 'Expiré';
  paymentMethod: string;
  description: string;
  items?: QuoteItem[];
  notes?: string;
  validityDays?: number;
  createdAt: string;
  updatedAt: string;
}

interface QuoteContextType {
  quotes: Quote[];
  addQuote: (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>) => Quote;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  convertToInvoice: (quoteId: string) => void;
  getQuoteById: (id: string) => Quote | undefined;
  getQuotesByStatus: (status: string) => Quote[];
  getQuotesByClient: (client: string) => Quote[];
  searchQuotes: (query: string) => Quote[];
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const useQuoteContext = () => {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuoteContext must be used within a QuoteProvider');
  }
  return context;
};

interface QuoteProviderProps {
  children: ReactNode;
}

// Devis par défaut pour la démonstration
const defaultQuotes: Quote[] = [
  {
    id: "DEV-001",
    client: "Société ABC",
    clientPhone: "+212 661 234 567",
    clientEmail: "contact@societeabc.ma",
    date: "05/08/2025",
    amount: 15000,
    advanceAmount: 5000,
    status: "Émis",
    paymentMethod: "Virement",
    description: "Configuration des écrans tactiles pour salon Média",
    validityDays: 30,
    createdAt: "2025-01-05T10:00:00Z",
    updatedAt: "2025-01-05T10:00:00Z"
  },
  {
    id: "DEV-002",
    client: "Event Pro Services",
    clientPhone: "+212 662 345 678",
    clientEmail: "contact@eventpro.ma",
    date: "02/08/2025",
    amount: 8500,
    advanceAmount: 3000,
    status: "En attente",
    paymentMethod: "Chèque",
    description: "Maintenance des bornes interactives",
    validityDays: 30,
    createdAt: "2025-01-02T09:15:00Z",
    updatedAt: "2025-01-02T09:15:00Z"
  },
  {
    id: "DEV-003",
    client: "Hotel Marrakech",
    clientPhone: "+212 663 456 789",
    clientEmail: "reservation@hotelmarrakech.ma",
    date: "29/07/2025",
    amount: 22000,
    advanceAmount: 10000,
    status: "Accepté",
    paymentMethod: "Carte bancaire",
    description: "Installation système interactif pour l'accueil",
    validityDays: 30,
    createdAt: "2025-01-29T11:20:00Z",
    updatedAt: "2025-01-29T11:20:00Z"
  }
];

export const QuoteProvider: React.FC<QuoteProviderProps> = ({ children }) => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const STORAGE_KEY = 'crm_quotes';

  // Charger les devis depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedQuotes = localStorage.getItem(STORAGE_KEY);
      if (savedQuotes) {
        const parsedQuotes = JSON.parse(savedQuotes);
        setQuotes(parsedQuotes);
      } else {
        // Si aucun devis sauvegardé, utiliser les devis par défaut
        setQuotes(defaultQuotes);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultQuotes));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des devis:', error);
      setQuotes(defaultQuotes);
    }
  }, []);

  // Sauvegarder les devis dans localStorage à chaque modification
  useEffect(() => {
    if (quotes.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des devis:', error);
        toast.error('Erreur de sauvegarde', {
          description: 'Impossible de sauvegarder les devis'
        });
      }
    }
  }, [quotes]);

  const addQuote = (quoteData: Omit<Quote, 'id' | 'createdAt' | 'updatedAt'>): Quote => {
    const now = new Date().toISOString();
    const newId = `DEV-${String(Math.max(...quotes.map(q => parseInt(q.id.split('-')[1]) || 0), 0) + 1).padStart(3, '0')}`;
    
    const newQuote: Quote = {
      ...quoteData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    setQuotes(prev => [newQuote, ...prev]);
    
    toast.success("Devis créé", {
      description: `Devis ${newId} pour ${quoteData.client} créé avec succès.`
    });

    return newQuote;
  };

  const updateQuote = (id: string, quoteData: Partial<Quote>) => {
    setQuotes(prev => prev.map(quote => 
      quote.id === id 
        ? { 
            ...quote, 
            ...quoteData, 
            updatedAt: new Date().toISOString() 
          }
        : quote
    ));
    
    toast.success("Devis modifié", {
      description: "Les modifications ont été sauvegardées."
    });
  };

  const deleteQuote = (id: string) => {
    const quoteToDelete = quotes.find(q => q.id === id);
    setQuotes(prev => prev.filter(quote => quote.id !== id));
    
    if (quoteToDelete) {
      toast.success("Devis supprimé", {
        description: `Devis ${id} pour ${quoteToDelete.client} supprimé.`
      });
    }
  };

  const convertToInvoice = (quoteId: string) => {
    const quote = quotes.find(q => q.id === quoteId);
    if (!quote) return;

    // Marquer le devis comme facturé
    updateQuote(quoteId, { status: 'Facturé' });

    // Créer une nouvelle facture basée sur le devis
    const newInvoice = {
      id: `INV-${Date.now()}`,
      quoteId: quote.id,
      client: quote.client,
      clientEmail: quote.clientEmail,
      clientPhone: quote.clientPhone,
      projectName: quote.description,
      amount: quote.amount,
      advanceAmount: quote.advanceAmount,
      remainingAmount: quote.amount - quote.advanceAmount,
      paymentMethod: quote.paymentMethod,
      date: new Date().toLocaleDateString('fr-FR'),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
      status: quote.advanceAmount >= quote.amount ? "Payée" : "En attente",
      items: quote.items || [],
      notes: `Facture générée automatiquement à partir du devis ${quote.id}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Sauvegarder la facture dans le localStorage des factures
    const existingInvoices = JSON.parse(localStorage.getItem('crm_invoices') || '[]');
    const updatedInvoices = [...existingInvoices, newInvoice];
    localStorage.setItem('crm_invoices', JSON.stringify(updatedInvoices));

    toast.success("Devis converti en facture", {
      description: `Facture ${newInvoice.id} créée avec succès`,
      action: {
        label: "Voir factures",
        onClick: () => window.location.href = "/invoices"
      }
    });
  };

  const getQuoteById = (id: string): Quote | undefined => {
    return quotes.find(quote => quote.id === id);
  };

  const getQuotesByStatus = (status: string): Quote[] => {
    return quotes.filter(quote => quote.status === status);
  };

  const getQuotesByClient = (client: string): Quote[] => {
    return quotes.filter(quote => 
      quote.client.toLowerCase().includes(client.toLowerCase())
    );
  };

  const searchQuotes = (query: string): Quote[] => {
    const lowercaseQuery = query.toLowerCase();
    return quotes.filter(quote =>
      quote.id.toLowerCase().includes(lowercaseQuery) ||
      quote.client.toLowerCase().includes(lowercaseQuery) ||
      quote.description.toLowerCase().includes(lowercaseQuery) ||
      quote.clientEmail.toLowerCase().includes(lowercaseQuery)
    );
  };

  const value: QuoteContextType = {
    quotes,
    addQuote,
    updateQuote,
    deleteQuote,
    convertToInvoice,
    getQuoteById,
    getQuotesByStatus,
    getQuotesByClient,
    searchQuotes
  };

  return (
    <QuoteContext.Provider value={value}>
      {children}
    </QuoteContext.Provider>
  );
};
