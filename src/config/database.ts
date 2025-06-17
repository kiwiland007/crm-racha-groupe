/**
 * Configuration de la base de données MySQL/MariaDB
 * Racha Business CRM
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  charset: string;
  timezone: string;
}

// Configuration de production
export const DATABASE_CONFIG: DatabaseConfig = {
  host: 'localhost',
  port: 3306,
  database: 'admin_crm',
  username: 'kiwiland',
  password: '*H@dFcMq0q38nvrz',
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// Configuration de développement (peut utiliser SQLite ou MySQL local)
export const DEV_DATABASE_CONFIG: DatabaseConfig = {
  host: 'localhost',
  port: 3306,
  database: 'admin_crm_dev',
  username: 'kiwiland',
  password: '*H@dFcMq0q38nvrz',
  charset: 'utf8mb4',
  timezone: '+00:00'
};

// URLs API pour les opérations CRUD
export const API_ENDPOINTS = {
  // Authentification
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password'
  },
  
  // Utilisateurs
  users: {
    list: '/api/users',
    create: '/api/users',
    update: '/api/users/:id',
    delete: '/api/users/:id',
    profile: '/api/users/profile'
  },
  
  // Contacts
  contacts: {
    list: '/api/contacts',
    create: '/api/contacts',
    update: '/api/contacts/:id',
    delete: '/api/contacts/:id',
    search: '/api/contacts/search'
  },
  
  // Devis
  quotes: {
    list: '/api/quotes',
    create: '/api/quotes',
    update: '/api/quotes/:id',
    delete: '/api/quotes/:id',
    pdf: '/api/quotes/:id/pdf'
  },
  
  // Factures
  invoices: {
    list: '/api/invoices',
    create: '/api/invoices',
    update: '/api/invoices/:id',
    delete: '/api/invoices/:id',
    pdf: '/api/invoices/:id/pdf'
  },
  
  // Bons de livraison
  bonLivraison: {
    list: '/api/bon-livraison',
    create: '/api/bon-livraison',
    update: '/api/bon-livraison/:id',
    delete: '/api/bon-livraison/:id',
    pdf: '/api/bon-livraison/:id/pdf'
  },
  
  // Produits
  products: {
    list: '/api/products',
    create: '/api/products',
    update: '/api/products/:id',
    delete: '/api/products/:id',
    categories: '/api/products/categories'
  },
  
  // Services
  services: {
    list: '/api/services',
    create: '/api/services',
    update: '/api/services/:id',
    delete: '/api/services/:id',
    categories: '/api/services/categories'
  },
  
  // Inventaire
  inventory: {
    list: '/api/inventory',
    update: '/api/inventory/:id',
    movements: '/api/inventory/movements',
    alerts: '/api/inventory/alerts'
  },
  
  // Tâches
  tasks: {
    list: '/api/tasks',
    create: '/api/tasks',
    update: '/api/tasks/:id',
    delete: '/api/tasks/:id'
  },
  
  // Événements
  events: {
    list: '/api/events',
    create: '/api/events',
    update: '/api/events/:id',
    delete: '/api/events/:id'
  },
  
  // Paramètres
  settings: {
    company: '/api/settings/company',
    integrations: '/api/settings/integrations',
    notifications: '/api/settings/notifications',
    api: '/api/settings/api'
  },
  
  // Analytics
  analytics: {
    dashboard: '/api/analytics/dashboard',
    sales: '/api/analytics/sales',
    customers: '/api/analytics/customers',
    products: '/api/analytics/products'
  },
  
  // Fichiers
  files: {
    upload: '/api/files/upload',
    download: '/api/files/:id',
    delete: '/api/files/:id'
  }
};

// Configuration des tables de base de données
export const DATABASE_TABLES = {
  // Tables utilisateurs et authentification
  users: 'users',
  user_sessions: 'user_sessions',
  user_permissions: 'user_permissions',
  
  // Tables CRM
  contacts: 'contacts',
  companies: 'companies',
  leads: 'leads',
  
  // Tables commerciales
  quotes: 'quotes',
  quote_items: 'quote_items',
  invoices: 'invoices',
  invoice_items: 'invoice_items',
  bon_livraison: 'bon_livraison',
  bon_livraison_items: 'bon_livraison_items',
  
  // Tables produits et services
  products: 'products',
  product_categories: 'product_categories',
  services: 'services',
  service_categories: 'service_categories',
  
  // Tables inventaire
  inventory: 'inventory',
  inventory_movements: 'inventory_movements',
  
  // Tables gestion
  tasks: 'tasks',
  events: 'events',
  notifications: 'notifications',
  
  // Tables paramètres
  company_settings: 'company_settings',
  integrations: 'integrations',
  api_keys: 'api_keys',
  
  // Tables système
  audit_logs: 'audit_logs',
  files: 'files',
  email_templates: 'email_templates'
};

// Types de données pour TypeScript
export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export interface QueryResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  affectedRows?: number;
  insertId?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Configuration de sécurité
export const SECURITY_CONFIG = {
  // Chiffrement des mots de passe
  bcrypt: {
    saltRounds: 12
  },

  // JWT
  jwt: {
    secret: import.meta.env.VITE_JWT_SECRET || 'racha-crm-secret-key-2024',
    expiresIn: '24h',
    refreshExpiresIn: '7d'
  },

  // Sessions
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24 heures
    secure: import.meta.env.MODE === 'production',
    httpOnly: true,
    sameSite: 'strict' as const
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limite de 100 requêtes par fenêtre
  }
};

// Configuration de l'environnement
export const ENV_CONFIG = {
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000'
};

// Utilitaires pour les requêtes
export const buildApiUrl = (endpoint: string, params?: Record<string, string>): string => {
  let url = `${ENV_CONFIG.apiUrl}${endpoint}`;
  
  if (params) {
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
  }
  
  return url;
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('crm_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};
