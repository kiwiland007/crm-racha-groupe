import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface EventTechnician {
  id: number;
  name: string;
  email: string;
  speciality: string;
  initials: string;
  available: boolean;
}

export interface ReservedMaterial {
  productId: number;
  productName: string;
  category: string;
  quantity: number;
  pricePerDay: number;
  totalPrice: number;
}

export interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  time: string;
  location: string;
  client: string;
  status: 'planifié' | 'confirmé' | 'en attente' | 'en cours' | 'terminé' | 'annulé';
  teamMembers: number;
  equipments: number;
  description: string;
  assignedTechnicians?: number[];
  assignedTechnicianDetails?: EventTechnician[];
  reservedMaterials?: ReservedMaterial[];
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => Event;
  updateEvent: (id: number, event: Partial<Event>) => void;
  deleteEvent: (id: number) => void;
  assignTechnicians: (eventId: number, technicianIds: number[]) => void;
  reserveMaterials: (eventId: number, materials: ReservedMaterial[]) => void;
  updateEventStatus: (id: number, status: Event['status']) => void;
  getEventById: (id: number) => Event | undefined;
  getEventsByStatus: (status: string) => Event[];
  getEventsByClient: (client: string) => Event[];
  getEventsByDate: (date: string) => Event[];
  searchEvents: (query: string) => Event[];
  getTechnicianWorkload: (technicianId: number) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

// Événements par défaut pour la démonstration
const defaultEvents: Event[] = [
  {
    id: 1,
    title: "Salon Digital Tech",
    startDate: "12 Mai 2025",
    endDate: "15 Mai 2025",
    time: "09:00 - 18:00",
    location: "Centre de Conférences, Casablanca",
    client: "MarketPro Digital",
    status: "planifié",
    teamMembers: 3,
    equipments: 8,
    description: "Installation de stands interactifs pour le salon annuel Digital Tech.",
    assignedTechnicians: [1, 2, 4],
    reservedMaterials: [],
    priority: 'high',
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-15T10:00:00Z"
  },
  {
    id: 2,
    title: "Installation écrans Foire Internationale",
    startDate: "15 Mai 2025",
    endDate: "15 Mai 2025",
    time: "08:00 - 14:00",
    location: "Foire Internationale, Rabat",
    client: "Event Masters",
    status: "confirmé",
    teamMembers: 2,
    equipments: 4,
    description: "Installation de 4 écrans tactiles pour le stand d'Event Masters.",
    assignedTechnicians: [2, 3],
    reservedMaterials: [],
    priority: 'medium',
    createdAt: "2025-01-10T09:15:00Z",
    updatedAt: "2025-01-10T09:15:00Z"
  },
  {
    id: 3,
    title: "Réunion commerciale MarketPro",
    startDate: "18 Mai 2025",
    endDate: "18 Mai 2025",
    time: "10:00 - 12:00",
    location: "Siège MarketPro, Casablanca",
    client: "MarketPro Digital",
    status: "planifié",
    teamMembers: 1,
    equipments: 0,
    description: "Présentation des nouvelles offres et services.",
    assignedTechnicians: [5],
    reservedMaterials: [],
    priority: 'low',
    createdAt: "2025-01-08T11:20:00Z",
    updatedAt: "2025-01-08T11:20:00Z"
  },
  {
    id: 4,
    title: "Salon de l'Agriculture",
    startDate: "22 Mai 2025",
    endDate: "26 Mai 2025",
    time: "09:00 - 19:00",
    location: "Parc des Expositions, Meknès",
    client: "AgriTech Solutions",
    status: "en attente",
    teamMembers: 4,
    equipments: 12,
    description: "Installation complète du stand AgriTech avec bornes et écrans tactiles.",
    assignedTechnicians: [1, 2, 3, 4],
    reservedMaterials: [],
    priority: 'urgent',
    createdAt: "2025-01-05T14:30:00Z",
    updatedAt: "2025-01-05T14:30:00Z"
  }
];

// Liste des techniciens disponibles
export const TECHNICIANS: EventTechnician[] = [
  {
    id: 1,
    name: "Hassan Alami",
    email: "h.alami@rachabusiness.com",
    speciality: "Écrans tactiles",
    initials: "HA",
    available: true
  },
  {
    id: 2,
    name: "Imane Mansouri",
    email: "i.mansouri@rachabusiness.com",
    speciality: "Bornes interactives",
    initials: "IM",
    available: true
  },
  {
    id: 3,
    name: "Said Amrani",
    email: "s.amrani@rachabusiness.com",
    speciality: "Maintenance",
    initials: "SA",
    available: false
  },
  {
    id: 4,
    name: "Fatima Benali",
    email: "f.benali@rachabusiness.com",
    speciality: "Installation",
    initials: "FB",
    available: true
  },
  {
    id: 5,
    name: "Omar Tazi",
    email: "o.tazi@rachabusiness.com",
    speciality: "Formation",
    initials: "OT",
    available: true
  }
];

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const STORAGE_KEY = 'crm_events';

  // Charger les événements depuis localStorage au démarrage
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem(STORAGE_KEY);
      if (savedEvents) {
        const parsedEvents = JSON.parse(savedEvents);
        setEvents(parsedEvents);
      } else {
        // Si aucun événement sauvegardé, utiliser les événements par défaut
        setEvents(defaultEvents);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEvents));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des événements:', error);
      setEvents(defaultEvents);
    }
  }, []);

  // Sauvegarder les événements dans localStorage à chaque modification
  useEffect(() => {
    if (events.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des événements:', error);
        toast.error('Erreur de sauvegarde', {
          description: 'Impossible de sauvegarder les événements'
        });
      }
    }
  }, [events]);

  const addEvent = (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Event => {
    const now = new Date().toISOString();
    const newId = Math.max(...events.map(e => e.id), 0) + 1;
    
    const newEvent: Event = {
      ...eventData,
      id: newId,
      createdAt: now,
      updatedAt: now
    };

    setEvents(prev => [newEvent, ...prev]);
    
    toast.success("Événement créé", {
      description: `${eventData.title} a été ajouté au planning.`
    });

    return newEvent;
  };

  const updateEvent = (id: number, eventData: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { 
            ...event, 
            ...eventData, 
            updatedAt: new Date().toISOString() 
          }
        : event
    ));
    
    toast.success("Événement modifié", {
      description: "Les modifications ont été sauvegardées."
    });
  };

  const deleteEvent = (id: number) => {
    const eventToDelete = events.find(e => e.id === id);
    setEvents(prev => prev.filter(event => event.id !== id));
    
    if (eventToDelete) {
      toast.success("Événement supprimé", {
        description: `${eventToDelete.title} a été supprimé du planning.`
      });
    }
  };

  const assignTechnicians = (eventId: number, technicianIds: number[]) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const assignedTechnicianDetails = TECHNICIANS.filter(tech => 
      technicianIds.includes(tech.id)
    );

    updateEvent(eventId, {
      assignedTechnicians: technicianIds,
      assignedTechnicianDetails,
      teamMembers: technicianIds.length
    });

    const technicianNames = assignedTechnicianDetails.map(tech => tech.name).join(", ");
    
    toast.success("Techniciens assignés", {
      description: `${technicianIds.length} technicien(s) assigné(s) à "${event.title}": ${technicianNames}`
    });
  };

  const reserveMaterials = (eventId: number, materials: ReservedMaterial[]) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const totalEquipments = materials.reduce((total, item) => total + item.quantity, 0);

    updateEvent(eventId, {
      reservedMaterials: materials,
      equipments: totalEquipments
    });

    toast.success("Matériel réservé", {
      description: `${materials.length} type(s) de matériel réservé(s) pour "${event.title}"`
    });
  };

  const updateEventStatus = (id: number, status: Event['status']) => {
    const event = events.find(e => e.id === id);
    if (!event) return;

    updateEvent(id, { status });

    const statusLabels = {
      'planifié': 'planifié',
      'confirmé': 'confirmé',
      'en attente': 'en attente',
      'en cours': 'en cours',
      'terminé': 'terminé',
      'annulé': 'annulé'
    };

    toast.success("Statut mis à jour", {
      description: `${event.title} marqué comme ${statusLabels[status]}.`
    });
  };

  const getEventById = (id: number): Event | undefined => {
    return events.find(event => event.id === id);
  };

  const getEventsByStatus = (status: string): Event[] => {
    return events.filter(event => event.status === status);
  };

  const getEventsByClient = (client: string): Event[] => {
    return events.filter(event => 
      event.client.toLowerCase().includes(client.toLowerCase())
    );
  };

  const getEventsByDate = (date: string): Event[] => {
    return events.filter(event => 
      event.startDate === date || event.endDate === date
    );
  };

  const searchEvents = (query: string): Event[] => {
    const lowercaseQuery = query.toLowerCase();
    return events.filter(event =>
      event.title.toLowerCase().includes(lowercaseQuery) ||
      event.client.toLowerCase().includes(lowercaseQuery) ||
      event.location.toLowerCase().includes(lowercaseQuery) ||
      event.description.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getTechnicianWorkload = (technicianId: number): Event[] => {
    return events.filter(event => 
      event.assignedTechnicians?.includes(technicianId) &&
      (event.status === 'planifié' || event.status === 'confirmé' || event.status === 'en cours')
    );
  };

  const value: EventContextType = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    assignTechnicians,
    reserveMaterials,
    updateEventStatus,
    getEventById,
    getEventsByStatus,
    getEventsByClient,
    getEventsByDate,
    searchEvents,
    getTechnicianWorkload
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};
