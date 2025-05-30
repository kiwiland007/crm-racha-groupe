import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Configuration du QueryClient pour les tests
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
    },
    mutations: {
      retry: false,
    },
  },
});

// Wrapper pour les tests avec tous les providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ProductProvider>
              <TooltipProvider>
                {children}
              </TooltipProvider>
            </ProductProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Fonction de render personnalisée
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data pour les tests
export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'admin' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockContact = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+212612345678',
  company: 'Test Company',
  type: 'client' as const,
  status: 'active' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test product description',
  sku: 'TEST-001',
  category: 'Electronics',
  price: {
    cost: 100,
    sale: 150,
    currency: 'MAD' as const,
  },
  stock: {
    quantity: 10,
    minQuantity: 2,
    location: 'Warehouse A',
  },
  availability: 'available' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockQuote = {
  id: '1',
  clientId: '1',
  client: 'John Doe',
  clientEmail: 'john@example.com',
  clientPhone: '+212612345678',
  description: 'Test quote',
  items: [
    {
      id: '1',
      type: 'product' as const,
      name: 'Test Product',
      description: 'Test description',
      quantity: 2,
      unitPrice: 150,
      discount: 0,
      total: 300,
    },
  ],
  subtotal: 300,
  discount: 0,
  tax: 60,
  total: 360,
  status: 'draft' as const,
  validityDays: 30,
  paymentTerms: 'Net 30',
  createdAt: new Date(),
  updatedAt: new Date(),
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
};

// Helpers pour les tests
export const waitForLoadingToFinish = () => 
  new Promise(resolve => setTimeout(resolve, 0));

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
  };
};

// Mock pour les hooks de navigation
export const mockNavigate = vi.fn();
export const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

// Mock pour les toasts
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
};

// Fonction pour créer des événements de test
export const createMockEvent = (type: string, properties = {}) => {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, properties);
  return event;
};

// Fonction pour attendre qu'un élément apparaisse
export const waitForElement = async (getByTestId: (id: string) => HTMLElement, testId: string) => {
  return new Promise<HTMLElement>((resolve) => {
    const checkElement = () => {
      try {
        const element = getByTestId(testId);
        resolve(element);
      } catch {
        setTimeout(checkElement, 100);
      }
    };
    checkElement();
  });
};

// Export de tout ce dont on a besoin
export * from '@testing-library/react';
export { customRender as render };
export { vi } from 'vitest';
