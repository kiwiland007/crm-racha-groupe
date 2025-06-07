import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';

// Contextes métier
import { AuthProvider } from '@/contexts/AuthContext';
import { ProductProvider } from '@/contexts/ProductContext';
import { ContactProvider } from '@/contexts/ContactContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { InventoryProvider } from '@/contexts/InventoryContext';
import { QuoteProvider } from '@/contexts/QuoteContext';
import { InvoiceProvider } from '@/contexts/InvoiceContext';
import { EventProvider } from '@/contexts/EventContext';
import { BLProvider } from '@/contexts/BLContext';

// Configuration React Query optimisée
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Ne pas retry sur les erreurs 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Provider composite pour réduire le nesting
interface AppProvidersProps {
  children: React.ReactNode;
}

// Providers de base (infrastructure)
const BaseProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ThemeProvider>
);

// Providers métier (données)
const BusinessProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <AuthProvider>
    <NotificationProvider>
      <ProductProvider>
        <ContactProvider>
          <TaskProvider>
            <InventoryProvider>
              <QuoteProvider>
                <InvoiceProvider>
                  <EventProvider>
                    <BLProvider>
                      {children}
                    </BLProvider>
                  </EventProvider>
                </InvoiceProvider>
              </QuoteProvider>
            </InventoryProvider>
          </TaskProvider>
        </ContactProvider>
      </ProductProvider>
    </NotificationProvider>
  </AuthProvider>
);

// Provider principal optimisé
export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <BaseProviders>
    <BusinessProviders>
      {children}
    </BusinessProviders>
  </BaseProviders>
);

// Hook pour accéder au QueryClient
export const useQueryClient = () => queryClient;

// Types pour les providers
export type { AppProvidersProps };

// Configuration exportée pour les tests
export { queryClient };
