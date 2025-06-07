/**
 * Service de base de données CRM intégré
 * Gère les opérations CRUD avec une API backend et localStorage comme fallback
 */

import { Contact, Product, Quote, Invoice, Event, Task, Notification, InventoryItem, User } from '../types';

interface DatabaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Configuration de l'API backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Configuration de la base de données MySQL (à configurer en production)
const DB_CONFIG = {
  host: process.env.VITE_DB_HOST || 'localhost',
  port: parseInt(process.env.VITE_DB_PORT || '3306'),
  database: process.env.VITE_DB_NAME || 'admin_crm',
  user: process.env.VITE_DB_USER || 'your_user',
  password: process.env.VITE_DB_PASSWORD || 'your_password'
};

export class CRMDatabaseService {
  private isInitialized = false;
  private useLocalStorage = true; // Fallback vers localStorage

  /**
   * Initialise le service de base de données
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Tenter de se connecter à l'API backend
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        this.useLocalStorage = false;
        console.log('✅ Connexion API backend établie');
      } else {
        throw new Error('API backend non disponible');
      }
    } catch (error) {
      console.warn('⚠️ API backend non disponible, utilisation de localStorage');
      this.useLocalStorage = true;
    }

    this.isInitialized = true;
  }

  /**
   * Effectue une requête vers l'API backend ou utilise localStorage
   */
  private async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (this.useLocalStorage) {
      throw new Error('Mode localStorage - API non disponible');
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ==================== CONTACTS ====================

  async getContacts(): Promise<DatabaseResponse<Contact[]>> {
    try {
      await this.initialize();

      if (this.useLocalStorage) {
        // Utiliser localStorage comme fallback
        const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
        return { success: true, data: contacts };
      }

      // Utiliser l'API backend
      const contacts = await this.apiRequest<Contact[]>('/contacts');
      return { success: true, data: contacts };

    } catch (error) {
      // Fallback vers localStorage en cas d'erreur
      try {
        const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
        return { success: true, data: contacts };
      } catch (localError) {
        return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
      }
    }
  }

  async getContactById(id: string): Promise<DatabaseResponse<Contact>> {
    try {
      await this.initialize();

      if (this.useLocalStorage) {
        const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
        const contact = contacts.find((c: Contact) => c.id === id);
        return { success: true, data: contact };
      }

      const contact = await this.apiRequest<Contact>(`/contacts/${id}`);
      return { success: true, data: contact };

    } catch (error) {
      try {
        const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
        const contact = contacts.find((c: Contact) => c.id === id);
        return { success: true, data: contact };
      } catch (localError) {
        return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
      }
    }
  }

  async createContact(contact: Omit<Contact, 'createdAt' | 'updatedAt'>): Promise<DatabaseResponse<string>> {
    try {
      await this.initialize();

      const newContact = {
        ...contact,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (this.useLocalStorage) {
        const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
        contacts.push(newContact);
        localStorage.setItem('crm_contacts', JSON.stringify(contacts));
        return { success: true, data: contact.id };
      }

      await this.apiRequest(`/contacts`, {
        method: 'POST',
        body: JSON.stringify(newContact)
      });

      return { success: true, data: contact.id };

    } catch (error) {
      // Fallback vers localStorage
      try {
        const newContact = {
          ...contact,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
        contacts.push(newContact);
        localStorage.setItem('crm_contacts', JSON.stringify(contacts));
        return { success: true, data: contact.id };
      } catch (localError) {
        return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
      }
    }
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<DatabaseResponse<boolean>> {
    try {
      await this.initialize();

      // Pour l'instant, utiliser localStorage uniquement
      const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
      const index = contacts.findIndex((c: Contact) => c.id === id);

      if (index !== -1) {
        contacts[index] = {
          ...contacts[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('crm_contacts', JSON.stringify(contacts));
      }

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  async deleteContact(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      await this.initialize();

      // Pour l'instant, utiliser localStorage uniquement
      const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
      const filteredContacts = contacts.filter((c: Contact) => c.id !== id);
      localStorage.setItem('crm_contacts', JSON.stringify(filteredContacts));

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  // ==================== PRODUITS ====================

  async getProducts(): Promise<DatabaseResponse<Product[]>> {
    try {
      await this.initialize();
      const products = JSON.parse(localStorage.getItem('crm_products') || '[]');
      return { success: true, data: products };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  async createProduct(product: any): Promise<DatabaseResponse<string>> {
    try {
      await this.initialize();

      const newProduct = {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const products = JSON.parse(localStorage.getItem('crm_products') || '[]');
      products.push(newProduct);
      localStorage.setItem('crm_products', JSON.stringify(products));

      return { success: true, data: product.id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  // ==================== DEVIS ====================

  async getQuotes(): Promise<DatabaseResponse<Quote[]>> {
    try {
      await this.initialize();
      const quotes = JSON.parse(localStorage.getItem('crm_quotes') || '[]');
      return { success: true, data: quotes };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  async createQuote(quote: any): Promise<DatabaseResponse<string>> {
    try {
      await this.initialize();

      const newQuote = {
        ...quote,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const quotes = JSON.parse(localStorage.getItem('crm_quotes') || '[]');
      quotes.push(newQuote);
      localStorage.setItem('crm_quotes', JSON.stringify(quotes));

      return { success: true, data: quote.id };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  // ==================== UTILITAIRES ====================

  /**
   * Obtient les statistiques de la base de données
   */
  async getStats(): Promise<DatabaseResponse<any>> {
    try {
      await this.initialize();

      // Compter les éléments dans localStorage
      const stats = {
        categories: JSON.parse(localStorage.getItem('crm_categories') || '[]').length,
        contacts: JSON.parse(localStorage.getItem('crm_contacts') || '[]').length,
        products: JSON.parse(localStorage.getItem('crm_products') || '[]').length,
        quotes: JSON.parse(localStorage.getItem('crm_quotes') || '[]').length,
        invoices: JSON.parse(localStorage.getItem('crm_invoices') || '[]').length,
        deliveryNotes: JSON.parse(localStorage.getItem('crm_bon_livraisons') || '[]').length,
        events: JSON.parse(localStorage.getItem('crm_events') || '[]').length,
        tasks: JSON.parse(localStorage.getItem('crm_tasks') || '[]').length,
        notifications: JSON.parse(localStorage.getItem('crm_notifications') || '[]').length,
        inventory: JSON.parse(localStorage.getItem('crm_inventory') || '[]').length
      };

      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  /**
   * Simule une synchronisation (pour l'instant juste un message)
   */
  async syncFromLocalStorage(): Promise<DatabaseResponse<boolean>> {
    try {
      await this.initialize();

      // Pour l'instant, on simule juste une synchronisation réussie
      console.log('📊 Données localStorage synchronisées (simulation)');

      return { success: true, data: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  }

  /**
   * Obtient la configuration de la base de données
   */
  getDatabaseConfig() {
    return {
      ...DB_CONFIG,
      status: this.useLocalStorage ? 'localStorage' : 'api',
      apiUrl: API_BASE_URL
    };
  }
}

// Instance singleton
export const crmDatabase = new CRMDatabaseService();
