/**
 * Service de base de données pour l'API backend
 * Gère la synchronisation entre localStorage et la base de données
 */

// Configuration de l'API backend
const API_BASE_URL = process.env.VITE_API_URL || 'https://api.rachabusiness.com/api';

// Types pour les réponses API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Service principal de base de données
 */
class DatabaseService {
  private apiUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.apiUrl = API_BASE_URL;
    this.loadAuthToken();
  }

  /**
   * Charge le token d'authentification depuis localStorage
   */
  private loadAuthToken(): void {
    this.authToken = localStorage.getItem('auth_token');
  }

  /**
   * Sauvegarde le token d'authentification
   */
  public setAuthToken(token: string): void {
    this.authToken = token;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Supprime le token d'authentification
   */
  public clearAuthToken(): void {
    this.authToken = null;
    localStorage.removeItem('auth_token');
  }

  /**
   * Headers par défaut pour les requêtes API
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Méthode générique pour les requêtes API
   */
  private async apiRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.apiUrl}${endpoint}`;
      const config: RequestInit = {
        method,
        headers: this.getHeaders(),
      };

      if (data && method !== 'GET') {
        config.body = JSON.stringify(data);
      }

      const response = await fetch(url, config);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      return result;
    } catch (error) {
      console.error(`Erreur API ${method} ${endpoint}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  // =====================================================
  // GESTION DES UTILISATEURS
  // =====================================================

  /**
   * Récupère tous les utilisateurs
   */
  async getUsers(): Promise<ApiResponse<any[]>> {
    return this.apiRequest<any[]>('/users');
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(userData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>('/users', 'POST', userData);
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUser(id: number, userData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>(`/users/${id}`, 'PUT', userData);
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`/users/${id}`, 'DELETE');
  }

  // =====================================================
  // GESTION DES CONTACTS
  // =====================================================

  /**
   * Récupère tous les contacts
   */
  async getContacts(): Promise<ApiResponse<any[]>> {
    return this.apiRequest<any[]>('/contacts');
  }

  /**
   * Crée un nouveau contact
   */
  async createContact(contactData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>('/contacts', 'POST', contactData);
  }

  /**
   * Met à jour un contact
   */
  async updateContact(id: number, contactData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>(`/contacts/${id}`, 'PUT', contactData);
  }

  /**
   * Supprime un contact
   */
  async deleteContact(id: number): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`/contacts/${id}`, 'DELETE');
  }

  // =====================================================
  // GESTION DES PRODUITS
  // =====================================================

  /**
   * Récupère tous les produits
   */
  async getProducts(): Promise<ApiResponse<any[]>> {
    return this.apiRequest<any[]>('/products');
  }

  /**
   * Crée un nouveau produit
   */
  async createProduct(productData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>('/products', 'POST', productData);
  }

  /**
   * Met à jour un produit
   */
  async updateProduct(id: number, productData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>(`/products/${id}`, 'PUT', productData);
  }

  /**
   * Supprime un produit
   */
  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`/products/${id}`, 'DELETE');
  }

  // =====================================================
  // GESTION DES CATÉGORIES
  // =====================================================

  /**
   * Récupère toutes les catégories
   */
  async getCategories(): Promise<ApiResponse<any[]>> {
    return this.apiRequest<any[]>('/categories');
  }

  /**
   * Crée une nouvelle catégorie
   */
  async createCategory(categoryData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>('/categories', 'POST', categoryData);
  }

  /**
   * Met à jour une catégorie
   */
  async updateCategory(id: number, categoryData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>(`/categories/${id}`, 'PUT', categoryData);
  }

  /**
   * Supprime une catégorie
   */
  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`/categories/${id}`, 'DELETE');
  }

  // =====================================================
  // GESTION DES DEVIS
  // =====================================================

  /**
   * Récupère tous les devis
   */
  async getQuotes(): Promise<ApiResponse<any[]>> {
    return this.apiRequest<any[]>('/quotes');
  }

  /**
   * Crée un nouveau devis
   */
  async createQuote(quoteData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>('/quotes', 'POST', quoteData);
  }

  /**
   * Met à jour un devis
   */
  async updateQuote(id: number, quoteData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>(`/quotes/${id}`, 'PUT', quoteData);
  }

  /**
   * Supprime un devis
   */
  async deleteQuote(id: number): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`/quotes/${id}`, 'DELETE');
  }

  // =====================================================
  // GESTION DES FACTURES
  // =====================================================

  /**
   * Récupère toutes les factures
   */
  async getInvoices(): Promise<ApiResponse<any[]>> {
    return this.apiRequest<any[]>('/invoices');
  }

  /**
   * Crée une nouvelle facture
   */
  async createInvoice(invoiceData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>('/invoices', 'POST', invoiceData);
  }

  /**
   * Met à jour une facture
   */
  async updateInvoice(id: number, invoiceData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>(`/invoices/${id}`, 'PUT', invoiceData);
  }

  /**
   * Supprime une facture
   */
  async deleteInvoice(id: number): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`/invoices/${id}`, 'DELETE');
  }

  // =====================================================
  // GESTION DES BONS DE LIVRAISON
  // =====================================================

  /**
   * Récupère tous les bons de livraison
   */
  async getBonLivraisons(): Promise<ApiResponse<any[]>> {
    return this.apiRequest<any[]>('/bon-livraisons');
  }

  /**
   * Crée un nouveau bon de livraison
   */
  async createBonLivraison(blData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>('/bon-livraisons', 'POST', blData);
  }

  /**
   * Met à jour un bon de livraison
   */
  async updateBonLivraison(id: number, blData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>(`/bon-livraisons/${id}`, 'PUT', blData);
  }

  /**
   * Supprime un bon de livraison
   */
  async deleteBonLivraison(id: number): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`/bon-livraisons/${id}`, 'DELETE');
  }

  // =====================================================
  // GESTION DES ÉVÉNEMENTS
  // =====================================================

  /**
   * Récupère tous les événements
   */
  async getEvents(): Promise<ApiResponse<any[]>> {
    return this.apiRequest<any[]>('/events');
  }

  /**
   * Crée un nouvel événement
   */
  async createEvent(eventData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>('/events', 'POST', eventData);
  }

  /**
   * Met à jour un événement
   */
  async updateEvent(id: number, eventData: any): Promise<ApiResponse<any>> {
    return this.apiRequest<any>(`/events/${id}`, 'PUT', eventData);
  }

  /**
   * Supprime un événement
   */
  async deleteEvent(id: number): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`/events/${id}`, 'DELETE');
  }

  // =====================================================
  // SYNCHRONISATION LOCALSTORAGE → BASE DE DONNÉES
  // =====================================================

  /**
   * Synchronise toutes les données localStorage vers la base de données
   */
  async syncAllData(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Synchroniser les utilisateurs
      const users = JSON.parse(localStorage.getItem('crm_users') || '[]');
      for (const user of users) {
        const result = await this.createUser(user);
        if (!result.success) {
          errors.push(`Utilisateur ${user.fullName}: ${result.error}`);
        }
      }

      // Synchroniser les contacts
      const contacts = JSON.parse(localStorage.getItem('crm_contacts') || '[]');
      for (const contact of contacts) {
        const result = await this.createContact(contact);
        if (!result.success) {
          errors.push(`Contact ${contact.name}: ${result.error}`);
        }
      }

      // Synchroniser les catégories
      const categories = JSON.parse(localStorage.getItem('crm_categories') || '[]');
      for (const category of categories) {
        const result = await this.createCategory(category);
        if (!result.success) {
          errors.push(`Catégorie ${category.name}: ${result.error}`);
        }
      }

      // Synchroniser les produits
      const products = JSON.parse(localStorage.getItem('crm_products') || '[]');
      for (const product of products) {
        const result = await this.createProduct(product);
        if (!result.success) {
          errors.push(`Produit ${product.name}: ${result.error}`);
        }
      }

      // Synchroniser les devis
      const quotes = JSON.parse(localStorage.getItem('crm_quotes') || '[]');
      for (const quote of quotes) {
        const result = await this.createQuote(quote);
        if (!result.success) {
          errors.push(`Devis ${quote.id}: ${result.error}`);
        }
      }

      // Synchroniser les factures
      const invoices = JSON.parse(localStorage.getItem('crm_invoices') || '[]');
      for (const invoice of invoices) {
        const result = await this.createInvoice(invoice);
        if (!result.success) {
          errors.push(`Facture ${invoice.id}: ${result.error}`);
        }
      }

      // Synchroniser les bons de livraison
      const bls = JSON.parse(localStorage.getItem('crm_bon_livraisons') || '[]');
      for (const bl of bls) {
        const result = await this.createBonLivraison(bl);
        if (!result.success) {
          errors.push(`BL ${bl.id}: ${result.error}`);
        }
      }

      // Synchroniser les événements
      const events = JSON.parse(localStorage.getItem('crm_events') || '[]');
      for (const event of events) {
        const result = await this.createEvent(event);
        if (!result.success) {
          errors.push(`Événement ${event.title}: ${result.error}`);
        }
      }

      return {
        success: errors.length === 0,
        errors
      };

    } catch (error) {
      console.error('Erreur synchronisation:', error);
      return {
        success: false,
        errors: [`Erreur générale: ${error instanceof Error ? error.message : 'Erreur inconnue'}`]
      };
    }
  }

  /**
   * Teste la connexion à l'API
   */
  async testConnection(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return this.apiRequest<{ status: string; timestamp: string }>('/health');
  }
}

// Instance singleton
export const databaseService = new DatabaseService();

// Export des types
export type { ApiResponse };
