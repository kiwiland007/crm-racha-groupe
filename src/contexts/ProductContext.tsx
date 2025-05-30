import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Category {
  id: string;
  name: string;
  description: string;
  type: "product" | "service";
  color: string;
  isActive?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: {
    sale: string;
    rental: string;
  };
  category: string;
  availability: string;
  sku: string;
  technicalSpecs?: string;
  images?: string[];
}

interface ProductContextType {
  categories: Category[];
  products: Product[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Bornes Tactiles",
      description: "Bornes interactives pour espaces publics et commerciaux",
      type: "product",
      color: "bg-blue-100 text-blue-800",
      isActive: true
    },
    {
      id: "2",
      name: "Totems Interactifs",
      description: "Totems d'affichage et d'interaction pour événements",
      type: "product",
      color: "bg-green-100 text-green-800",
      isActive: true
    },
    {
      id: "3",
      name: "Tableaux Interactifs",
      description: "Écrans tactiles pour formation et présentation",
      type: "product",
      color: "bg-purple-100 text-purple-800",
      isActive: true
    },
    {
      id: "4",
      name: "Écrans Vitrines",
      description: "Écrans d'affichage pour vitrines commerciales",
      type: "product",
      color: "bg-cyan-100 text-cyan-800",
      isActive: true
    },
    {
      id: "5",
      name: "Murs d'Images",
      description: "Solutions multi-écrans pour affichage grand format",
      type: "product",
      color: "bg-indigo-100 text-indigo-800",
      isActive: true
    },
    {
      id: "6",
      name: "Systèmes de Paiement",
      description: "Caisses enregistreuses et bornes de paiement",
      type: "product",
      color: "bg-emerald-100 text-emerald-800",
      isActive: true
    },
    {
      id: "7",
      name: "Installation & Configuration",
      description: "Services d'installation et mise en service",
      type: "service",
      color: "bg-orange-100 text-orange-800",
      isActive: true
    },
    {
      id: "8",
      name: "Maintenance & Support",
      description: "Services de maintenance et support technique",
      type: "service",
      color: "bg-red-100 text-red-800",
      isActive: true
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: "PRD-001",
      name: "Borne Interactive 43\" KIMEX",
      description: "Borne interactive 43 pouces tactile PCAP pour lieux publics et événements",
      price: {
        sale: "45000",
        rental: "6000"
      },
      category: "1", // Bornes Tactiles
      availability: "en_stock",
      sku: "BRN-43-KIMEX",
      technicalSpecs: "Écran: 43\" Full HD tactile PCAP\nProcesseur: Intel i5-8400\nMémoire: 8GB DDR4\nStockage: 256GB SSD\nOS: Windows 10 Pro\nConnectivité: WiFi, Ethernet, USB\nDimensions: 180x60x40cm"
    },
    {
      id: "PRD-002",
      name: "Borne Interactive 55\" Circinus",
      description: "Borne tactile 55 pouces avec solution d'accessibilité PMR",
      price: {
        sale: "52000",
        rental: "7000"
      },
      category: "1", // Bornes Tactiles
      availability: "en_stock",
      sku: "BRN-55-CIR",
      technicalSpecs: "Écran: 55\" 4K tactile\nAccessibilité PMR intégrée\nHauteur ajustable\nProcesseur: Intel i7\nMémoire: 16GB RAM\nStockage: 512GB SSD\nAudio: Haut-parleurs intégrés"
    },
    {
      id: "PRD-003",
      name: "Pupitre Digital 49\"",
      description: "Pupitre numérique multimédia pour présentations interactives",
      price: {
        sale: "38000",
        rental: "5000"
      },
      category: "1", // Bornes Tactiles
      availability: "en_stock",
      sku: "PUP-49-DIG",
      technicalSpecs: "Écran: 49\" Full HD tactile\nAngle d'inclinaison: 0-45°\nProcesseur: Intel i5\nMémoire: 8GB RAM\nStockage: 256GB SSD\nConnectivité: HDMI, USB, WiFi"
    },
    {
      id: "PRD-004",
      name: "Totem Interactif Tactile",
      description: "Totem interactif de différentes tailles pour événements et espaces publics",
      price: {
        sale: "42000",
        rental: "5500"
      },
      category: "2", // Totems Interactifs
      availability: "sur_commande",
      sku: "TOT-INT-TAC",
      technicalSpecs: "Tailles disponibles: 32\", 43\", 55\"\nÉcran tactile capacitif\nBoîtier métallique robuste\nProcesseur: Intel i5\nMémoire: 8GB RAM\nStockage: 256GB SSD"
    },
    {
      id: "PRD-005",
      name: "Totem LED Affichage Outdoor",
      description: "Totem LED pour affichage extérieur résistant aux intempéries",
      price: {
        sale: "65000",
        rental: "8500"
      },
      category: "2", // Totems Interactifs
      availability: "en_stock",
      sku: "TOT-LED-OUT",
      technicalSpecs: "Écran LED P3.9 extérieur\nLuminosité: 5000 nits\nProtection IP65\nDimensions: 200x120x30cm\nAlimentation: 220V\nConnectivité: 4G, WiFi, Ethernet"
    },
    {
      id: "PRD-006",
      name: "Écran Tactile Interactif SMART MX",
      description: "Tableau interactif SMART pour espaces de formation et salles de classe",
      price: {
        sale: "48000",
        rental: "6500"
      },
      category: "3", // Tableaux Interactifs
      availability: "en_stock",
      sku: "ECR-SMART-MX",
      technicalSpecs: "Tailles: 65\", 75\", 86\"\nRésolution: 4K UHD\nTechnologie tactile: HyPr Touch\nPoints de contact: 20 simultanés\nLogiciel SMART Notebook inclus"
    },
    {
      id: "PRD-007",
      name: "Huawei Smart Board",
      description: "Écran tactile interactif Huawei pour collaboration moderne",
      price: {
        sale: "55000",
        rental: "7200"
      },
      category: "3", // Tableaux Interactifs
      availability: "en_stock",
      sku: "HUA-SMART-BD",
      technicalSpecs: "Écran: 65\" ou 75\" 4K\nOS: HarmonyOS\nProcesseur: Kirin 990\nMémoire: 8GB RAM\nStockage: 128GB\nCaméra 4K intégrée\nMicrophones array"
    },
    {
      id: "PRD-008",
      name: "Écran Vitrine 55\" Full HD",
      description: "Écran LCD 55 pouces Full HD pour vitrines commerciales",
      price: {
        sale: "25000",
        rental: "3200"
      },
      category: "4", // Écrans Vitrines
      availability: "en_stock",
      sku: "VIT-55-FHD",
      technicalSpecs: "Écran: 55\" Full HD LCD\nLuminosité: 2500 nits\nFonctionnement 24/7\nConnectivité: HDMI, USB\nTélécommande incluse\nMontage mural"
    },
    {
      id: "PRD-009",
      name: "Mur d'Images EVORA 55\"",
      description: "Mur d'images 3x3 avec 9 écrans 55 pouces, bord ultra-fin 3,5mm",
      price: {
        sale: "180000",
        rental: "22000"
      },
      category: "5", // Murs d'Images
      availability: "sur_commande",
      sku: "MUR-EVORA-55",
      technicalSpecs: "Configuration: 3x3 (9 écrans)\nTaille écrans: 55\" chacun\nBord: 3,5mm ultra-fin\nRésolution totale: 5760x3240\nRétroéclairage LED\nAngles de vision: 178°\nTechnologie anti-brûlure"
    },
    {
      id: "PRD-010",
      name: "Caisse Enregistreuse Tactile 15\"",
      description: "Caisse enregistreuse tactile 15 pouces avec écran LCD pour commerces",
      price: {
        sale: "18000",
        rental: "2400"
      },
      category: "6", // Systèmes de Paiement
      availability: "en_stock",
      sku: "CAI-15-TAC",
      technicalSpecs: "Écran: 15\" tactile résistif\nProcesseur: Intel Celeron\nMémoire: 4GB RAM\nStockage: 128GB SSD\nPorts: USB, Ethernet, Série\nTiroir-caisse inclus"
    },
    {
      id: "PRD-011",
      name: "Borne de Paiement PMR",
      description: "Borne de paiement avec accessibilité PMR et lecteur de cartes",
      price: {
        sale: "35000",
        rental: "4500"
      },
      category: "6", // Systèmes de Paiement
      availability: "sur_commande",
      sku: "BRN-PAY-PMR",
      technicalSpecs: "Écran: 22\" tactile\nLecteur cartes: EMV, NFC\nAccessibilité PMR complète\nClavier Braille\nAudio guidage\nImprimante tickets thermique"
    },
    {
      id: "PRD-012",
      name: "Borne Arcade Rétro 5000 Jeux",
      description: "Borne arcade classique avec 5000 jeux cultes intégrés",
      price: {
        sale: "28000",
        rental: "3600"
      },
      category: "1", // Bornes Tactiles
      availability: "en_stock",
      sku: "ARC-5000-RET",
      technicalSpecs: "Écran: 22\" LCD\nJeux: 5000 titres classiques\nCommandes: 2 joueurs\nJoysticks et boutons arcade\nHaut-parleurs stéréo\nDimensions: 170x70x60cm"
    }
  ]);

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: Date.now().toString(),
      isActive: true
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const updateCategory = (id: string, categoryData: Partial<Category>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, ...categoryData } : cat
    ));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `PRD-${Math.floor(Math.random() * 10000).toString().padStart(3, '0')}`
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(prod => 
      prod.id === id ? { ...prod, ...productData } : prod
    ));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(prod => prod.id !== id));
  };

  const getCategoryById = (id: string) => {
    return categories.find(cat => cat.id === id);
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter(prod => prod.category === categoryId);
  };

  const value: ProductContextType = {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategoryById,
    getProductsByCategory
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
