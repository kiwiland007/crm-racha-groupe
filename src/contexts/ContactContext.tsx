import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface Contact {
  id: number;
  name: string;
  company?: string;
  email: string;
  phone: string;
  type: 'client' | 'prospect' | 'supplier' | 'partner';
  source: string;
  lastContact: string;
  assignedTo: string;
  notes?: string;
  status?: 'active' | 'inactive' | 'blocked';
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface ContactContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'lastContact'>) => void;
  updateContact: (id: number, contact: Partial<Contact>) => void;
  deleteContact: (id: number) => void;
  getContactById: (id: number) => Contact | undefined;
  getContactsByType: (type: string) => Contact[];
  searchContacts: (query: string) => Contact[];
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const useContactContext = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactContext must be used within a ContactProvider');
  }
  return context;
};

interface ContactProviderProps {
  children: ReactNode;
}

// Contacts par défaut pour la démonstration
const defaultContacts: Contact[] = [
  {
    id: 1,
    name: "Imane Alaoui",
    company: "MarketPro Digital",
    email: "imane.alaoui@marketpro.ma",
    phone: "06 12 34 56 78",
    type: "client",
    source: "LinkedIn",
    lastContact: "12 Avr 2025",
    assignedTo: "sara",
    notes: "Intéressé par nos écrans tactiles pour leur showroom",
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2025-04-12"
  },
  {
    id: 2,
    name: "Mehdi Bensaid",
    company: "TechSolutions Maroc",
    email: "m.bensaid@techsolutions.ma",
    phone: "06 98 76 54 32",
    type: "prospect",
    source: "Facebook Ads",
    lastContact: "28 Mar 2025",
    assignedTo: "hamid",
    notes: "À recontacter en mai pour proposition commerciale",
    status: "active",
    createdAt: "2024-02-20",
    updatedAt: "2025-03-28"
  },
  {
    id: 3,
    name: "Fatima Zahra Bennani",
    company: "Retail Plus",
    email: "f.bennani@retailplus.ma",
    phone: "06 55 44 33 22",
    type: "client",
    source: "Recommandation",
    lastContact: "05 Avr 2025",
    assignedTo: "sara",
    notes: "Client fidèle, commande régulière de bornes interactives",
    status: "active",
    createdAt: "2024-03-10",
    updatedAt: "2025-04-05"
  },
  {
    id: 4,
    name: "Youssef Amrani",
    company: "Event Masters",
    email: "y.amrani@eventmasters.ma",
    phone: "06 77 88 99 00",
    type: "prospect",
    source: "Site Web",
    lastContact: "15 Mar 2025",
    assignedTo: "hamid",
    notes: "Intéressé par nos services événementiels pour salons",
    status: "active",
    createdAt: "2024-04-01",
    updatedAt: "2025-03-15"
  }
];

export const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const STORAGE_KEY = 'crm_contacts';

  // Charger les contacts depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedContacts = localStorage.getItem(STORAGE_KEY);
      if (savedContacts) {
        const parsedContacts = JSON.parse(savedContacts);
        setContacts(parsedContacts);
      } else {
        // Si aucun contact sauvegardé, utiliser les contacts par défaut
        setContacts(defaultContacts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultContacts));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des contacts:', error);
      setContacts(defaultContacts);
    }
  }, []);

  // Sauvegarder les contacts dans localStorage à chaque modification
  useEffect(() => {
    if (contacts.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des contacts:', error);
        toast.error('Erreur de sauvegarde', {
          description: 'Impossible de sauvegarder les contacts'
        });
      }
    }
  }, [contacts]);

  const addContact = (contactData: Omit<Contact, 'id' | 'lastContact'>) => {
    const newId = Math.max(...contacts.map(c => c.id), 0) + 1;
    const now = new Date();
    
    const newContact: Contact = {
      ...contactData,
      id: newId,
      lastContact: now.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: 'active',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };

    setContacts(prev => [newContact, ...prev]);
    
    toast.success("Contact ajouté", {
      description: `${contactData.name} a été ajouté avec succès.`
    });
  };

  const updateContact = (id: number, contactData: Partial<Contact>) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id 
        ? { 
            ...contact, 
            ...contactData, 
            updatedAt: new Date().toISOString() 
          }
        : contact
    ));
    
    toast.success("Contact modifié", {
      description: "Les modifications ont été sauvegardées."
    });
  };

  const deleteContact = (id: number) => {
    const contactToDelete = contacts.find(c => c.id === id);
    setContacts(prev => prev.filter(contact => contact.id !== id));
    
    if (contactToDelete) {
      toast.success("Contact supprimé", {
        description: `${contactToDelete.name} a été supprimé avec succès.`
      });
    }
  };

  const getContactById = (id: number): Contact | undefined => {
    return contacts.find(contact => contact.id === id);
  };

  const getContactsByType = (type: string): Contact[] => {
    return contacts.filter(contact => contact.type === type);
  };

  const searchContacts = (query: string): Contact[] => {
    const lowercaseQuery = query.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company?.toLowerCase().includes(lowercaseQuery) ||
      contact.phone.includes(query)
    );
  };

  const value: ContactContextType = {
    contacts,
    addContact,
    updateContact,
    deleteContact,
    getContactById,
    getContactsByType,
    searchContacts
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};
