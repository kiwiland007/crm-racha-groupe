import { z } from 'zod';

// Schémas de base
const phoneRegex = /^\+212[0-9]{9}$/;
const emailSchema = z.string().email('Email invalide');
const phoneSchema = z.string().regex(phoneRegex, 'Format téléphone invalide (+212XXXXXXXXX)');

// Schéma Contact
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: emailSchema,
  phone: phoneSchema,
  company: z.string().max(100, 'Le nom de l\'entreprise ne peut pas dépasser 100 caractères').optional(),
  address: z.string().max(200, 'L\'adresse ne peut pas dépasser 200 caractères').optional(),
  type: z.enum(['client', 'prospect', 'supplier', 'partner'], {
    errorMap: () => ({ message: 'Type de contact invalide' })
  }),
  notes: z.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').optional(),
  tags: z.array(z.string()).optional()
});

// Schéma Produit
export const productSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
  sku: z.string()
    .min(3, 'Le SKU doit contenir au moins 3 caractères')
    .max(20, 'Le SKU ne peut pas dépasser 20 caractères')
    .regex(/^[A-Z0-9-]+$/, 'Le SKU ne peut contenir que des lettres majuscules, chiffres et tirets'),
  category: z.string().min(1, 'La catégorie est obligatoire'),
  costPrice: z.number()
    .min(0, 'Le prix de revient ne peut pas être négatif')
    .max(1000000, 'Le prix de revient ne peut pas dépasser 1 000 000 MAD'),
  salePrice: z.number()
    .min(0, 'Le prix de vente ne peut pas être négatif')
    .max(1000000, 'Le prix de vente ne peut pas dépasser 1 000 000 MAD'),
  quantity: z.number()
    .int('La quantité doit être un nombre entier')
    .min(0, 'La quantité ne peut pas être négative')
    .max(10000, 'La quantité ne peut pas dépasser 10 000'),
  minQuantity: z.number()
    .int('La quantité minimale doit être un nombre entier')
    .min(0, 'La quantité minimale ne peut pas être négative')
    .max(1000, 'La quantité minimale ne peut pas dépasser 1 000'),
  location: z.string().min(1, 'L\'emplacement est obligatoire'),
  availability: z.enum(['available', 'out_of_stock', 'discontinued'], {
    errorMap: () => ({ message: 'Statut de disponibilité invalide' })
  }),
  specifications: z.record(z.string()).optional()
}).refine(data => data.salePrice >= data.costPrice, {
  message: 'Le prix de vente doit être supérieur ou égal au prix de revient',
  path: ['salePrice']
});

// Schéma Service
export const serviceSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(1000, 'La description ne peut pas dépasser 1000 caractères'),
  category: z.string().min(1, 'La catégorie est obligatoire'),
  pricingType: z.enum(['fixed', 'hourly', 'project'], {
    errorMap: () => ({ message: 'Type de tarification invalide' })
  }),
  amount: z.number()
    .min(0, 'Le montant ne peut pas être négatif')
    .max(100000, 'Le montant ne peut pas dépasser 100 000 MAD'),
  duration: z.number()
    .int('La durée doit être un nombre entier')
    .min(1, 'La durée doit être d\'au moins 1 heure')
    .max(1000, 'La durée ne peut pas dépasser 1 000 heures')
    .optional(),
  requirements: z.array(z.string()).optional(),
  availability: z.enum(['available', 'unavailable'], {
    errorMap: () => ({ message: 'Statut de disponibilité invalide' })
  })
});

// Schéma Article de devis/facture
export const quoteItemSchema = z.object({
  type: z.enum(['product', 'service'], {
    errorMap: () => ({ message: 'Type d\'article invalide' })
  }),
  name: z.string().min(1, 'Le nom de l\'article est obligatoire'),
  description: z.string().max(200, 'La description ne peut pas dépasser 200 caractères').optional(),
  quantity: z.number()
    .min(0.01, 'La quantité doit être supérieure à 0')
    .max(1000, 'La quantité ne peut pas dépasser 1 000'),
  unitPrice: z.number()
    .min(0, 'Le prix unitaire ne peut pas être négatif')
    .max(100000, 'Le prix unitaire ne peut pas dépasser 100 000 MAD'),
  discount: z.number()
    .min(0, 'La remise ne peut pas être négative')
    .max(100, 'La remise ne peut pas dépasser 100%')
});

// Schéma Devis
export const quoteSchema = z.object({
  client: z.string().min(1, 'Le nom du client est obligatoire'),
  clientEmail: emailSchema,
  clientPhone: phoneSchema,
  clientAddress: z.string().max(200, 'L\'adresse ne peut pas dépasser 200 caractères').optional(),
  projectName: z.string().max(100, 'Le nom du projet ne peut pas dépasser 100 caractères').optional(),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),
  items: z.array(quoteItemSchema)
    .min(1, 'Au moins un article est requis')
    .max(50, 'Maximum 50 articles par devis'),
  discountType: z.enum(['percentage', 'fixed'], {
    errorMap: () => ({ message: 'Type de remise invalide' })
  }),
  discountValue: z.number()
    .min(0, 'La remise ne peut pas être négative')
    .max(100000, 'La remise ne peut pas dépasser 100 000'),
  taxRate: z.number()
    .min(0, 'Le taux de TVA ne peut pas être négatif')
    .max(30, 'Le taux de TVA ne peut pas dépasser 30%'),
  validityDays: z.number()
    .int('La validité doit être un nombre entier')
    .min(1, 'La validité doit être d\'au moins 1 jour')
    .max(365, 'La validité ne peut pas dépasser 365 jours'),
  paymentTerms: z.string().min(1, 'Les conditions de paiement sont obligatoires'),
  notes: z.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').optional()
});

// Schéma Facture
export const invoiceSchema = quoteSchema.extend({
  advanceAmount: z.number()
    .min(0, 'Le montant d\'avance ne peut pas être négatif')
    .max(1000000, 'Le montant d\'avance ne peut pas dépasser 1 000 000 MAD'),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'card', 'check'], {
    errorMap: () => ({ message: 'Mode de paiement invalide' })
  }).optional(),
  dueDate: z.date({
    required_error: 'La date d\'échéance est obligatoire',
    invalid_type_error: 'Date d\'échéance invalide'
  })
});

// Schéma Événement
export const eventSchema = z.object({
  title: z.string()
    .min(3, 'Le titre doit contenir au moins 3 caractères')
    .max(100, 'Le titre ne peut pas dépasser 100 caractères'),
  description: z.string()
    .min(10, 'La description doit contenir au moins 10 caractères')
    .max(500, 'La description ne peut pas dépasser 500 caractères'),
  client: z.string().min(1, 'Le nom du client est obligatoire'),
  location: z.string()
    .min(5, 'L\'emplacement doit contenir au moins 5 caractères')
    .max(200, 'L\'emplacement ne peut pas dépasser 200 caractères'),
  startDate: z.date({
    required_error: 'La date de début est obligatoire',
    invalid_type_error: 'Date de début invalide'
  }),
  endDate: z.date({
    required_error: 'La date de fin est obligatoire',
    invalid_type_error: 'Date de fin invalide'
  }),
  type: z.enum(['installation', 'maintenance', 'training', 'meeting', 'demo'], {
    errorMap: () => ({ message: 'Type d\'événement invalide' })
  }),
  assignedTo: z.array(z.string()).min(1, 'Au moins un technicien doit être assigné'),
  materials: z.array(z.string()).optional(),
  notes: z.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').optional()
}).refine(data => data.endDate > data.startDate, {
  message: 'La date de fin doit être postérieure à la date de début',
  path: ['endDate']
});

// Schéma Bon de Livraison
export const bonLivraisonSchema = z.object({
  client: z.string().min(1, 'Le nom du client est obligatoire'),
  clientAddress: z.string()
    .min(10, 'L\'adresse doit contenir au moins 10 caractères')
    .max(200, 'L\'adresse ne peut pas dépasser 200 caractères'),
  deliveryAddress: z.string()
    .min(10, 'L\'adresse de livraison doit contenir au moins 10 caractères')
    .max(200, 'L\'adresse de livraison ne peut pas dépasser 200 caractères'),
  deliveryDate: z.date({
    required_error: 'La date de livraison est obligatoire',
    invalid_type_error: 'Date de livraison invalide'
  }),
  deliveryPerson: z.string().min(1, 'Le nom du livreur est obligatoire'),
  items: z.array(quoteItemSchema)
    .min(1, 'Au moins un article est requis')
    .max(50, 'Maximum 50 articles par BL'),
  notes: z.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').optional()
});

// Schéma Fiche Technique
export const technicalSheetSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  model: z.string()
    .min(1, 'Le modèle est obligatoire')
    .max(50, 'Le modèle ne peut pas dépasser 50 caractères'),
  brand: z.string()
    .min(1, 'La marque est obligatoire')
    .max(50, 'La marque ne peut pas dépasser 50 caractères'),
  specifications: z.record(z.string())
    .refine(data => Object.keys(data).length > 0, {
      message: 'Au moins une spécification est requise'
    }),
  warrantyDuration: z.number()
    .int('La durée de garantie doit être un nombre entier')
    .min(1, 'La durée de garantie doit être d\'au moins 1 mois')
    .max(120, 'La durée de garantie ne peut pas dépasser 120 mois'),
  warrantyType: z.enum(['manufacturer', 'extended'], {
    errorMap: () => ({ message: 'Type de garantie invalide' })
  }),
  warrantyTerms: z.string()
    .min(10, 'Les conditions de garantie doivent contenir au moins 10 caractères')
    .max(500, 'Les conditions de garantie ne peuvent pas dépasser 500 caractères')
});

// Schéma Utilisateur
export const userSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  role: z.enum(['admin', 'manager', 'employee'], {
    errorMap: () => ({ message: 'Rôle invalide' })
  }),
  department: z.string().max(50, 'Le département ne peut pas dépasser 50 caractères').optional()
});

// Schéma de connexion
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
    .max(100, 'Le mot de passe ne peut pas dépasser 100 caractères')
});

// Schéma de recherche
export const searchSchema = z.object({
  query: z.string().max(100, 'La recherche ne peut pas dépasser 100 caractères').optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional()
});

// Types inférés des schémas
export type ContactFormData = z.infer<typeof contactSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type QuoteFormData = z.infer<typeof quoteSchema>;
export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type BonLivraisonFormData = z.infer<typeof bonLivraisonSchema>;
export type TechnicalSheetFormData = z.infer<typeof technicalSheetSchema>;
export type UserFormData = z.infer<typeof userSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type SearchFormData = z.infer<typeof searchSchema>;
