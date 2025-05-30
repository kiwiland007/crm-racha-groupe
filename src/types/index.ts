// Types centralisés pour Racha Business Group CRM

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  type: 'client' | 'prospect' | 'supplier' | 'partner';
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  category: string;
  price: {
    cost: number;
    sale: number;
    currency: 'MAD' | 'EUR' | 'USD';
  };
  stock: {
    quantity: number;
    minQuantity: number;
    location: string;
  };
  specifications?: Record<string, string>;
  images?: string[];
  availability: 'available' | 'out_of_stock' | 'discontinued';
  createdAt: Date;
  updatedAt: Date;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: {
    type: 'fixed' | 'hourly' | 'project';
    amount: number;
    currency: 'MAD' | 'EUR' | 'USD';
  };
  duration?: number; // en heures
  requirements?: string[];
  availability: 'available' | 'unavailable';
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteItem {
  id: string;
  type: 'product' | 'service';
  productId?: string;
  serviceId?: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Quote {
  id: string;
  clientId: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  projectName?: string;
  description: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  validityDays: number;
  paymentTerms: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface Invoice {
  id: string;
  quoteId?: string;
  clientId: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  projectName?: string;
  description: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  advanceAmount: number;
  remainingAmount: number;
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  paymentMethod?: 'cash' | 'bank_transfer' | 'card' | 'check';
  dueDate: Date;
  paidAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BonLivraison {
  id: string;
  invoiceId?: string;
  quoteId?: string;
  clientId: string;
  client: string;
  clientAddress: string;
  items: QuoteItem[];
  deliveryDate: Date;
  deliveryAddress: string;
  deliveryPerson: string;
  status: 'preparation' | 'shipped' | 'in_transit' | 'delivered' | 'returned';
  trackingNumber?: string;
  notes?: string;
  signature?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  clientId?: string;
  client: string;
  location: string;
  startDate: Date;
  endDate: Date;
  type: 'installation' | 'maintenance' | 'training' | 'meeting' | 'demo';
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo: string[];
  materials?: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  location: string;
  status: 'available' | 'reserved' | 'maintenance' | 'damaged';
  lastUpdated: Date;
  notes?: string;
}

export interface TechnicalSheet {
  id: string;
  productId: string;
  name: string;
  model: string;
  brand: string;
  specifications: Record<string, string>;
  documentation?: string[];
  images?: string[];
  manuals?: string[];
  warranty: {
    duration: number;
    type: 'manufacturer' | 'extended';
    terms: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'invoice' | 'stock' | 'event' | 'contact';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  expiresAt?: Date;
}

// Types pour les formulaires
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  type: Contact['type'];
  notes?: string;
  tags?: string[];
}

export interface ProductFormData {
  name: string;
  description: string;
  sku: string;
  category: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
  minQuantity: number;
  location: string;
  specifications?: Record<string, string>;
  availability: Product['availability'];
}

export interface QuoteFormData {
  clientId: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  projectName?: string;
  description: string;
  items: Omit<QuoteItem, 'id' | 'total'>[];
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  taxRate: number;
  validityDays: number;
  paymentTerms: string;
  notes?: string;
}

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Types pour les filtres et recherche
export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

// Types pour les erreurs
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

// Types pour les configurations
export interface AppConfig {
  company: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo?: string;
    website?: string;
  };
  features: {
    [key: string]: boolean;
  };
  limits: {
    [key: string]: number;
  };
}

export type { User as AuthUser };
export type { Contact as CRMContact };
export type { Product as CatalogProduct };
export type { Service as CatalogService };
