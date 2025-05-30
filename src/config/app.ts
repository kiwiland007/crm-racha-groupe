// Configuration centralisée de l'application
export const APP_CONFIG = {
  // Informations de l'application
  name: 'Racha Business Digital CRM',
  version: '1.0.0',
  description: 'Système de gestion CRM pour solutions tactiles et digitales',
  
  // URLs et domaines
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://maroctactile-crm.pages.dev' 
    : 'http://localhost:8080',
  
  // Informations de l'entreprise
  company: {
    name: 'Racha Business Digital',
    legalName: 'RACHA BUSINESS DIGITAL SARL AU',
    address: 'Résidence Yasmine 2, Bloc B, App 12\nHay Riad, Rabat 10100\nMaroc',
    phone: '+212 6 69 38 28 28',
    email: 'contact@rachabusiness.com',
    website: 'https://rachabusiness.com',
    
    // Informations légales marocaines
    rc: 'RC 125896',
    patente: 'PAT 45789123',
    if: 'IF 15478963',
    ice: 'ICE 002547896000025',
    cnss: 'CNSS 8547896',
    
    // Coordonnées bancaires
    bank: {
      name: 'Banque Populaire',
      rib: 'BP 011 780 0012547896300025 12',
      swift: 'BMCEMAMC'
    }
  },
  
  // Configuration des fonctionnalités
  features: {
    authentication: true,
    pdfGeneration: true,
    whatsappIntegration: true,
    emailIntegration: true,
    smsIntegration: true,
    qrCodeGeneration: true,
    fileUpload: true,
    exportData: true,
    analytics: true,
    notifications: true
  },
  
  // Limites et quotas
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxFilesPerUpload: 5,
    maxContactsImport: 1000,
    maxProductsPerCategory: 500,
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures
  },
  
  // Configuration des notifications
  notifications: {
    position: 'bottom-right' as const,
    duration: 5000,
    maxVisible: 3
  },
  
  // Configuration PDF
  pdf: {
    format: 'a4' as const,
    orientation: 'portrait' as const,
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    fonts: {
      primary: 'helvetica',
      secondary: 'times'
    }
  },
  
  // Configuration des couleurs
  colors: {
    primary: '#1a2b3c', // Bleu foncé
    secondary: '#40e0d0', // Turquoise
    accent: '#f59e0b', // Orange
    success: '#10b981', // Vert
    warning: '#f59e0b', // Orange
    error: '#ef4444', // Rouge
    info: '#3b82f6' // Bleu
  },
  
  // Configuration des formats
  formats: {
    date: 'dd/MM/yyyy',
    dateTime: 'dd/MM/yyyy HH:mm',
    currency: 'MAD',
    locale: 'fr-FR'
  },
  
  // Configuration des API externes
  apis: {
    whatsapp: {
      baseUrl: 'https://wa.me',
      businessNumber: '+212669382828'
    },
    maps: {
      provider: 'google',
      apiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || ''
    }
  },
  
  // Configuration de développement
  development: {
    enableDebugLogs: process.env.NODE_ENV === 'development',
    enableMockData: true,
    enableTestFeatures: process.env.NODE_ENV === 'development'
  }
} as const;

// Types dérivés de la configuration
export type AppConfig = typeof APP_CONFIG;
export type CompanyInfo = typeof APP_CONFIG.company;
export type FeatureFlags = typeof APP_CONFIG.features;

// Utilitaires de configuration
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
  return APP_CONFIG.features[feature];
};

export const getCompanyInfo = (): CompanyInfo => {
  return APP_CONFIG.company;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(APP_CONFIG.formats.locale, {
    style: 'currency',
    currency: APP_CONFIG.formats.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(APP_CONFIG.formats.locale);
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString(APP_CONFIG.formats.locale);
};
